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

    private class Entry(val card: RpgCard, val bitmap: Bitmap, val art: Bitmap? = null) {
        var savedUri: Uri? = null
        /** Aventura a la que pertenece (null si es una carta suelta). */
        var group: AdventureGroup? = null
        /** Rol dentro de la aventura (null en la carta resumen). */
        var role: Adventure.Role? = null
        /** Oráculo "elige 1 de 5" al que pertenece, mientras no se haya elegido. */
        var oracle: MutableList<Entry>? = null
    }

    /** Las cinco cartas de una aventura y su resumen, para poder cambiarlas al tocarlas. */
    private class AdventureGroup(val premise: Int, val twist: Int) {
        val cards = linkedMapOf<Adventure.Role, Entry>()
        var summary: Entry? = null
    }

    private val executor = Executors.newSingleThreadExecutor()
    private val mainHandler = Handler(Looper.getMainLooper())

    private lateinit var cardImage: ImageView
    private lateinit var placeholder: TextView
    private lateinit var progress: ProgressBar
    private lateinit var status: TextView
    private lateinit var historyLabel: TextView
    private lateinit var prevButton: Button
    private lateinit var nextButton: Button
    private lateinit var sheetButton: Button
    private lateinit var saveButton: Button
    private lateinit var shareButton: Button
    private lateinit var scryfallButton: Button
    private lateinit var spanishSwitch: Switch
    private val generateButtons = mutableListOf<Button>()

    private val history = mutableListOf<Entry>()
    private var index = -1
    private var loading = false

    private val current: Entry? get() = history.getOrNull(index)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        cardImage = findViewById(R.id.cardImage)
        placeholder = findViewById(R.id.placeholder)
        progress = findViewById(R.id.progress)
        status = findViewById(R.id.status)
        historyLabel = findViewById(R.id.historyLabel)
        prevButton = findViewById(R.id.prevButton)
        nextButton = findViewById(R.id.nextButton)
        sheetButton = findViewById(R.id.sheetButton)
        saveButton = findViewById(R.id.saveButton)
        shareButton = findViewById(R.id.shareButton)
        scryfallButton = findViewById(R.id.scryfallButton)
        spanishSwitch = findViewById(R.id.spanishSwitch)

        val prefs = getSharedPreferences("ajustes", MODE_PRIVATE)
        spanishSwitch.isChecked = prefs.getBoolean("espanol", false)
        spanishSwitch.setOnCheckedChangeListener { _, checked ->
            prefs.edit().putBoolean("espanol", checked).apply()
        }

        findViewById<Button>(R.id.randomButton).also {
            it.setOnClickListener { generate(Category.RANDOM) }
            generateButtons += it
        }
        findViewById<Button>(R.id.adventureButton).also {
            it.setOnClickListener { generateAdventure() }
            generateButtons += it
        }
        findViewById<Button>(R.id.oracleButton).also {
            it.setOnClickListener { generateOracle() }
            generateButtons += it
        }

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

        prevButton.setOnClickListener { show(index - 1) }
        nextButton.setOnClickListener { show(index + 1) }
        sheetButton.setOnClickListener { printSheet() }
        saveButton.setOnClickListener { current?.let { save(it, showToast = true) } }
        shareButton.setOnClickListener { share() }
        scryfallButton.setOnClickListener {
            current?.let { startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(it.card.scryfallUri))) }
        }
        cardImage.setOnClickListener { onCardTapped() }
        refreshControls()
    }

    override fun onDestroy() {
        super.onDestroy()
        executor.shutdownNow()
    }

    // ------------------------------------------------------------ generación

    private fun buildCard(
        category: Category,
        spanish: Boolean,
        roleLabel: String? = null,
        tweak: (RpgCard) -> RpgCard = { it },
    ): Entry {
        val mtg = ScryfallClient.randomCard(category, spanish)
        val rpg = CardTransformer.transform(mtg, category)
            .let { if (roleLabel != null) it.copy(roleLabel = roleLabel) else it }
            .let(tweak)
        val art = rpg.artUrl?.let { ScryfallClient.downloadBitmap(it) }
        return Entry(rpg, CardRenderer.render(rpg, art), art)
    }

    /** Tocar la carta: en una aventura cambia esa carta; si es suelta, genera otra igual. */
    private fun onCardTapped() {
        if (loading) return
        val entry = current ?: return
        val group = entry.group
        val role = entry.role
        entry.oracle?.let { chooseOracle(entry, it); return }
        when {
            group != null && role != null -> rerollAdventureCard(entry, group, role)
            group != null -> toast("Toca una de las 5 cartas de la aventura para cambiarla")
            else -> generate(entry.card.category)
        }
    }

    private fun rerollAdventureCard(old: Entry, group: AdventureGroup, role: Adventure.Role) {
        setLoading(true)
        status.text = "Buscando otra carta de ${role.label.lowercase()}…"
        val spanish = spanishSwitch.isChecked
        executor.execute {
            try {
                val fresh = buildCard(Adventure.categoryFor(role), spanish, old.card.roleLabel)
                fresh.group = group
                fresh.role = role
                group.cards[role] = fresh
                val summary = buildSummary(group)
                post {
                    replace(old, fresh)
                    group.summary?.let { replace(it, summary, showIt = false) }
                    group.summary = summary
                    show(history.indexOf(fresh))
                    status.text = "${role.emoji} ${role.label}: ${old.card.title} → ${fresh.card.title}. El resumen se actualizó."
                }
            } catch (e: Exception) {
                post { status.text = "No se pudo cambiar la carta: ${e.message ?: "error de conexión"}" }
            } finally {
                post { setLoading(false) }
            }
        }
    }

    /**
     * Oráculo de escena, como en las reglas para jugar rol en solitario con cartas de Magic:
     * se sacan 5 cartas al azar, se elige 1 (las otras 4 se descartan) y se interpreta
     * su ilustración como la siguiente escena u objetivo.
     */
    private fun generateOracle() {
        setLoading(true)
        val spanish = spanishSwitch.isChecked
        executor.execute {
            try {
                val options = mutableListOf<Entry>()
                for (i in 1..5) {
                    post { status.text = "Sacando carta $i/5 del oráculo…" }
                    val e = buildCard(Category.RANDOM, spanish, "🔮 Opción $i/5 · toca para elegir") {
                        it.copy(hook = ORACLE_PROMPT, hookLabel = "Interpreta")
                    }
                    e.oracle = options
                    options += e
                    Thread.sleep(100) // Scryfall pide espaciar las peticiones.
                }
                post {
                    add(options)
                    show(history.size - 5)
                    status.text = "Oráculo: recorre las 5 opciones con ◀ ▶ y toca la que mejor encaje con tu historia."
                }
            } catch (e: Exception) {
                post { status.text = "No se pudo consultar el oráculo: ${e.message ?: "error de conexión"}" }
            } finally {
                post { setLoading(false) }
            }
        }
    }

    private fun chooseOracle(chosen: Entry, options: MutableList<Entry>) {
        val card = chosen.card.copy(roleLabel = "🔮 Escena elegida")
        val picked = Entry(card, CardRenderer.render(card, chosen.art), chosen.art)
        options.filter { it !== chosen }.forEach { history.remove(it) }
        val i = history.indexOf(chosen)
        if (i >= 0) history[i] = picked else history += picked
        show(history.indexOf(picked))
        status.text = "Escena elegida: ${card.title}. Las otras 4 cartas se descartaron."
    }

    private fun buildSummary(group: AdventureGroup): Entry {
        val card = Adventure.summary(group.cards.mapValues { it.value.card }, group.premise, group.twist)
        val art = group.cards[Adventure.Role.THREAT]?.art
        return Entry(card, CardRenderer.render(card, art), art).also { it.group = group }
    }

    private fun replace(old: Entry, new: Entry, showIt: Boolean = true) {
        val i = history.indexOf(old)
        if (i < 0) return
        history[i] = new
        if (showIt || i == index) show(i)
    }

    private fun generate(category: Category) {
        setLoading(true)
        status.text = "Buscando en Scryfall…"
        val spanish = spanishSwitch.isChecked
        executor.execute {
            try {
                val entry = buildCard(category, spanish)
                post {
                    add(listOf(entry))
                    status.text = "${entry.card.category.emoji} ${entry.card.category.singular}: ${entry.card.title}  ·  toca la carta para otra igual"
                }
            } catch (e: Exception) {
                post { status.text = "No se pudo generar la carta: ${e.message ?: "error de conexión"}" }
            } finally {
                post { setLoading(false) }
            }
        }
    }

    private fun generateAdventure() {
        setLoading(true)
        val spanish = spanishSwitch.isChecked
        executor.execute {
            try {
                val roles = Adventure.Role.entries
                val group = AdventureGroup(Adventure.randomPremise(), Adventure.randomTwist())
                roles.forEachIndexed { i, role ->
                    post { status.text = "Forjando aventura ${i + 1}/${roles.size}: ${role.label}…" }
                    val label = "${role.emoji} Aventura ${i + 1}/${roles.size} · ${role.label}"
                    val entry = buildCard(Adventure.categoryFor(role), spanish, label)
                    entry.group = group
                    entry.role = role
                    group.cards[role] = entry
                    Thread.sleep(100) // Scryfall pide espaciar las peticiones.
                }
                val summaryEntry = buildSummary(group)
                group.summary = summaryEntry
                post {
                    add(listOf(summaryEntry) + group.cards.values)
                    // Mostramos primero el resumen; con ▶ se recorren las cinco cartas.
                    show(history.size - 6)
                    status.text = "Aventura lista: resumen + 5 cartas. Usa ◀ ▶ para recorrerlas y toca una carta para cambiarla por otra del mismo tipo."
                }
            } catch (e: Exception) {
                post { status.text = "No se pudo crear la aventura: ${e.message ?: "error de conexión"}" }
            } finally {
                post { setLoading(false) }
            }
        }
    }

    private fun post(block: () -> Unit) {
        mainHandler.post { if (!isFinishing && !isDestroyed) block() }
    }

    // ------------------------------------------------------------ historial

    private fun add(entries: List<Entry>) {
        history += entries
        // Limitamos la memoria: cada carta ocupa ~3 MB.
        while (history.size > MAX_HISTORY) history.removeAt(0)
        show(history.size - 1)
    }

    private fun show(i: Int) {
        if (i !in history.indices) return
        index = i
        cardImage.setImageBitmap(history[i].bitmap)
        cardImage.visibility = View.VISIBLE
        placeholder.visibility = View.GONE
        refreshControls()
    }

    private fun setLoading(value: Boolean) {
        loading = value
        progress.visibility = if (value) View.VISIBLE else View.GONE
        generateButtons.forEach { it.isEnabled = !value }
        refreshControls()
    }

    private fun refreshControls() {
        val has = current != null && !loading
        saveButton.isEnabled = has
        shareButton.isEnabled = has
        scryfallButton.isEnabled = has
        sheetButton.isEnabled = history.isNotEmpty() && !loading
        prevButton.isEnabled = index > 0
        nextButton.isEnabled = index < history.size - 1
        historyLabel.text = if (history.isEmpty()) "" else "Carta ${index + 1} de ${history.size}"
    }

    // ------------------------------------------------------------ exportar

    /** Hoja A4 con las últimas 9 cartas del historial. */
    private fun printSheet() {
        val cards = history.takeLast(9).map { it.bitmap }
        setLoading(true)
        status.text = "Montando hoja de impresión…"
        executor.execute {
            try {
                val sheet = CardRenderer.sheet(cards)
                val uri = saveBitmap(sheet, "hoja_cartas")
                sheet.recycle()
                post {
                    status.text = if (uri != null)
                        "Hoja A4 con ${cards.size} cartas guardada en Imágenes/CartasRPG. Imprímela al 100 % (sin ajustar)."
                    else "No se pudo guardar la hoja."
                }
            } catch (e: Throwable) {
                post { status.text = "No se pudo crear la hoja: ${e.message}" }
            } finally {
                post { setLoading(false) }
            }
        }
    }

    private fun save(entry: Entry, showToast: Boolean): Uri? {
        entry.savedUri?.let {
            if (showToast) toast("La carta ya está guardada en Imágenes/CartasRPG")
            return it
        }
        val uri = saveBitmap(entry.bitmap, "carta_" + entry.card.title)
        if (uri != null) {
            entry.savedUri = uri
            if (showToast) toast("Carta guardada en Imágenes/CartasRPG")
        } else {
            toast("No se pudo guardar la carta")
        }
        return uri
    }

    /** Guarda un PNG en Imágenes/CartasRPG (sin permisos, vía MediaStore). */
    private fun saveBitmap(bmp: Bitmap, baseName: String): Uri? {
        val safeName = baseName.replace(Regex("[^\\p{L}\\p{N}]+"), "_").trim('_').take(48)
        val values = ContentValues().apply {
            put(MediaStore.Images.Media.DISPLAY_NAME, "${safeName}_${System.currentTimeMillis()}.png")
            put(MediaStore.Images.Media.MIME_TYPE, "image/png")
            put(MediaStore.Images.Media.RELATIVE_PATH, Environment.DIRECTORY_PICTURES + "/CartasRPG")
            put(MediaStore.Images.Media.IS_PENDING, 1)
        }
        return try {
            val uri = contentResolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values) ?: return null
            contentResolver.openOutputStream(uri)?.use { bmp.compress(Bitmap.CompressFormat.PNG, 100, it) }
            values.clear()
            values.put(MediaStore.Images.Media.IS_PENDING, 0)
            contentResolver.update(uri, values, null, null)
            uri
        } catch (e: Exception) {
            null
        }
    }

    private fun share() {
        val entry = current ?: return
        val uri = save(entry, showToast = false) ?: return
        val send = Intent(Intent.ACTION_SEND).apply {
            type = "image/png"
            putExtra(Intent.EXTRA_STREAM, uri)
            putExtra(Intent.EXTRA_TEXT, entry.card.title)
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }
        startActivity(Intent.createChooser(send, "Compartir carta"))
    }

    private fun toast(msg: String) = Toast.makeText(this, msg, Toast.LENGTH_SHORT).show()

    private fun dp(v: Int) = TypedValue.applyDimension(
        TypedValue.COMPLEX_UNIT_DIP, v.toFloat(), resources.displayMetrics,
    ).toInt()

    companion object {
        private const val MAX_HISTORY = 15
        private const val ORACLE_PROMPT =
            "Mira la ilustración: ¿quién aparece, dónde está y qué está a punto de pasar? Eso es lo siguiente que ocurre en tu historia."
    }
}
