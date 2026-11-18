package com.vibecoding.cartasrpg

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

/** Datos de una carta tal como vienen de Scryfall (ya simplificados). */
data class MtgCard(
    val name: String,
    val printedName: String?,
    val typeLine: String,
    val printedTypeLine: String?,
    val oracleText: String,
    val printedText: String?,
    val flavorText: String?,
    val power: String?,
    val toughness: String?,
    val loyalty: String?,
    val cmc: Double,
    val colors: List<String>,
    val rarity: String,
    val keywords: List<String>,
    val artist: String?,
    val setName: String,
    val artUrl: String?,
    val scryfallUri: String,
    val lang: String,
)

object ScryfallClient {
    private const val API = "https://api.scryfall.com"
    private const val USER_AGENT = "ForjaDeCartasRPG/1.0 (Android)"

    /** Filtros comunes: nada de cartas de broma, tokens ni tierras básicas. */
    private const val BASE_FILTER = "-is:funny -t:token -t:basic game:paper"

    fun randomCard(category: Category, preferSpanish: Boolean): MtgCard {
        val core = category.query?.let { "($it) " } ?: ""
        val queries = buildList {
            if (preferSpanish) add("$core$BASE_FILTER lang:es")
            add("$core$BASE_FILTER")
        }
        var lastError = "No se encontró ninguna carta para esa categoría."
        for (q in queries) {
            val url = "$API/cards/random?q=" + URLEncoder.encode(q, "UTF-8")
            val (code, body) = get(url)
            when {
                code in 200..299 -> return parse(JSONObject(body))
                code == 404 -> continue
                else -> {
                    lastError = runCatching { JSONObject(body).optString("details") }
                        .getOrNull()?.takeIf { it.isNotBlank() }
                        ?: "Scryfall respondió con el código $code."
                }
            }
        }
        throw IOException(lastError)
    }

    fun downloadBitmap(url: String): Bitmap? = try {
        val c = URL(url).openConnection() as HttpURLConnection
        c.setRequestProperty("User-Agent", USER_AGENT)
        c.connectTimeout = 15000
        c.readTimeout = 20000
        c.inputStream.use { BitmapFactory.decodeStream(it) }.also { c.disconnect() }
    } catch (e: Exception) {
        null
    }

    private fun get(url: String): Pair<Int, String> {
        val c = URL(url).openConnection() as HttpURLConnection
        c.setRequestProperty("User-Agent", USER_AGENT)
        c.setRequestProperty("Accept", "application/json;q=0.9,*/*;q=0.8")
        c.connectTimeout = 15000
        c.readTimeout = 15000
        try {
            val code = c.responseCode
            val stream = if (code in 200..299) c.inputStream else c.errorStream
            val body = stream?.bufferedReader()?.use { it.readText() } ?: ""
            return code to body
        } finally {
            c.disconnect()
        }
    }

    private fun JSONObject.str(key: String): String? =
        if (has(key) && !isNull(key)) optString(key).takeIf { it.isNotBlank() } else null

    private fun JSONArray?.strings(): List<String>? =
        this?.let { arr -> (0 until arr.length()).map { arr.optString(it) } }

    fun parse(o: JSONObject): MtgCard {
        // Cartas de dos caras / divididas: usamos la primera cara.
        val face = o.optJSONArray("card_faces")?.optJSONObject(0)
        fun pick(key: String): String? = face?.str(key) ?: o.str(key)

        val art = face?.optJSONObject("image_uris")?.str("art_crop")
            ?: o.optJSONObject("image_uris")?.str("art_crop")

        val colors = o.optJSONArray("colors").strings()
            ?: face?.optJSONArray("colors").strings()
            ?: o.optJSONArray("color_identity").strings()
            ?: emptyList()

        return MtgCard(
            name = pick("name") ?: "Carta sin nombre",
            printedName = pick("printed_name"),
            typeLine = pick("type_line") ?: "",
            printedTypeLine = pick("printed_type_line"),
            oracleText = pick("oracle_text") ?: "",
            printedText = pick("printed_text"),
            flavorText = pick("flavor_text"),
            power = pick("power"),
            toughness = pick("toughness"),
            loyalty = pick("loyalty"),
            cmc = o.optDouble("cmc", 0.0).let { if (it.isNaN()) 0.0 else it },
            colors = colors,
            rarity = o.str("rarity") ?: "common",
            keywords = o.optJSONArray("keywords").strings() ?: emptyList(),
            artist = pick("artist"),
            setName = o.str("set_name") ?: "",
            artUrl = art,
            scryfallUri = o.str("scryfall_uri") ?: "https://scryfall.com",
            lang = o.str("lang") ?: "en",
        )
    }
}
