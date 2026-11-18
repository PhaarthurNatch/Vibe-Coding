package com.vibecoding.cartasrpg

import android.app.Activity
import android.content.ContentValues
import android.content.Intent
import android.content.res.ColorStateList
import android.graphics.Bitmap
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.os.Environment
import android.os.Handler
import android.os.Looper
import android.provider.MediaStore
import android.util.TypedValue
import android.view.View
import android.widget.Button
import android.widget.GridLayout
import android.widget.ImageView
import android.widget.ProgressBar
import android.widget.Switch
import android.widget.TextView
import android.widget.Toast
import java.util.concurrent.Executors

class MainActivity : Activity() {

    private val executor = Executors.newSingleThreadExecutor()
    private val mainHandler = Handler(Looper.getMainLooper())

    private lateinit var cardImage: ImageView
    private lateinit var placeholder: TextView
    private lateinit var progress: ProgressBar
    private lateinit var status: TextView
    private lateinit var saveButton: Button
    private lateinit var shareButton: Button
    private lateinit var scryfallButton: Button
    private lateinit var spanishSwitch: Switch
    private val generateButtons = mutableListOf<Button>()

    private var currentCard: RpgCard? = null
    private var currentBitmap: Bitmap? = null
    private var savedUri: Uri? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        cardImage = findViewById(R.id.cardImage)
        placeholder = findViewById(R.id.placeholder)
        progress = findViewById(R.id.progress)
        status = findViewById(R.id.status)
        saveButton = findViewById(R.id.saveButton)
        shareButton = findViewById(R.id.shareButton)
        scryfallButton = findViewById(R.id.scryfallButton)
        spanishSwitch = findViewById(R.id.spanishSwitch)

        val prefs = getSharedPreferences("ajustes", MODE_PRIVATE)
        spanishSwitch.isChecked = prefs.getBoolean("espanol", false)
        spanishSwitch.setOnCheckedChangeListener { _, checked ->
            prefs.edit().putBoolean("espanol", checked).apply()
        }

        val randomButton = findViewById<Button>(R.id.randomButton)
        randomButton.setOnClickListener { generate(Category.RANDOM) }
        generateButtons += randomButton

        val grid = findViewById<GridLayout>(R.id.categoryGrid)
        val margin = dp(4)
        Category.entries.filter { it != Category.RANDOM }.forEach { cat ->
            val b = Button(this).apply {
                text = "${cat.emoji}\n${cat.label}"
                isAllCaps = false
                setTextSize(TypedValue.COMPLEX_UNIT_SP, 13f)
                setTextColor(Color.WHITE)
                backgroundTintList = ColorStateList.valueOf(cat.color)
                minHeight = dp(76)
                setOnClickListener { generate(cat) }
            }
            val lp = GridLayout.LayoutParams(
                GridLayout.spec(GridLayout.UNDEFINED, 1f),
                GridLayout.spec(GridLayout.UNDEFINED, 1f),
            ).apply {
                width = 0
                setMargins(margin, margin, margin, margin)
            }
            grid.addView(b, lp)
            generateButtons += b
        }

        saveButton.setOnClickListener { save(showToast = true) }
        shareButton.setOnClickListener { share() }
        scryfallButton.setOnClickListener {
            currentCard?.let { startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(it.scryfallUri))) }
        }
        cardImage.setOnClickListener { currentCard?.let { generate(it.category) } }
    }

    override fun onDestroy() {
        super.onDestroy()
        executor.shutdownNow()
    }

    private fun generate(category: Category) {
        setLoading(true)
        status.text = "Buscando en Scryfall…"
        val spanish = spanishSwitch.isChecked
        executor.execute {
            try {
                val mtg = ScryfallClient.randomCard(category, spanish)
                val rpg = CardTransformer.transform(mtg, category)
                val art = rpg.artUrl?.let { ScryfallClient.downloadBitmap(it) }
                val bmp = CardRenderer.render(rpg, art)
                mainHandler.post {
                    if (isFinishing || isDestroyed) return@post
                    currentCard = rpg
                    currentBitmap = bmp
                    savedUri = null
                    cardImage.setImageBitmap(bmp)
                    cardImage.visibility = View.VISIBLE
                    placeholder.visibility = View.GONE
                    status.text = "${rpg.category.emoji} ${rpg.category.singular}: ${rpg.title}  ·  toca la carta para otra igual"
                    setLoading(false)
                }
            } catch (e: Exception) {
                mainHandler.post {
                    if (isFinishing || isDestroyed) return@post
                    status.text = "No se pudo generar la carta: ${e.message ?: "error de conexión"}"
                    setLoading(false)
                }
            }
        }
    }

    private fun setLoading(loading: Boolean) {
        progress.visibility = if (loading) View.VISIBLE else View.GONE
        generateButtons.forEach { it.isEnabled = !loading }
        val hasCard = currentBitmap != null && !loading
        saveButton.isEnabled = hasCard
        shareButton.isEnabled = hasCard
        scryfallButton.isEnabled = hasCard
    }

    /** Guarda la carta (PNG 750×1050, 300 ppp) en Imágenes/CartasRPG. */
    private fun save(showToast: Boolean): Uri? {
        savedUri?.let {
            if (showToast) toast("La carta ya está guardada en Imágenes/CartasRPG")
            return it
        }
        val bmp = currentBitmap ?: return null
        val card = currentCard ?: return null
        val safeName = card.title.replace(Regex("[^\\p{L}\\p{N}]+"), "_").trim('_').take(40)
        val values = ContentValues().apply {
            put(MediaStore.Images.Media.DISPLAY_NAME, "carta_${safeName}_${System.currentTimeMillis()}.png")
            put(MediaStore.Images.Media.MIME_TYPE, "image/png")
            put(MediaStore.Images.Media.RELATIVE_PATH, Environment.DIRECTORY_PICTURES + "/CartasRPG")
            put(MediaStore.Images.Media.IS_PENDING, 1)
        }
        return try {
            val uri = contentResolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values)
                ?: throw IllegalStateException("sin acceso a la galería")
            contentResolver.openOutputStream(uri)?.use { bmp.compress(Bitmap.CompressFormat.PNG, 100, it) }
            values.clear()
            values.put(MediaStore.Images.Media.IS_PENDING, 0)
            contentResolver.update(uri, values, null, null)
            savedUri = uri
            if (showToast) toast("Carta guardada en Imágenes/CartasRPG")
            uri
        } catch (e: Exception) {
            toast("No se pudo guardar: ${e.message}")
            null
        }
    }

    private fun share() {
        val uri = save(showToast = false) ?: return
        val send = Intent(Intent.ACTION_SEND).apply {
            type = "image/png"
            putExtra(Intent.EXTRA_STREAM, uri)
            putExtra(Intent.EXTRA_TEXT, currentCard?.title ?: "")
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }
        startActivity(Intent.createChooser(send, "Compartir carta"))
    }

    private fun toast(msg: String) = Toast.makeText(this, msg, Toast.LENGTH_SHORT).show()

    private fun dp(v: Int) = TypedValue.applyDimension(
        TypedValue.COMPLEX_UNIT_DIP, v.toFloat(), resources.displayMetrics,
    ).toInt()
}
