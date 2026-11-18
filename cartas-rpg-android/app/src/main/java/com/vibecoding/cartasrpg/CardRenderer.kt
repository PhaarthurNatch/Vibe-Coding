package com.vibecoding.cartasrpg

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.LinearGradient
import android.graphics.Paint
import android.graphics.Path
import android.graphics.Rect
import android.graphics.RectF
import android.graphics.Shader
import android.graphics.Typeface
import android.text.Layout
import android.text.SpannableStringBuilder
import android.text.Spanned
import android.text.StaticLayout
import android.text.TextPaint
import android.text.TextUtils
import android.text.style.ForegroundColorSpan
import android.text.style.RelativeSizeSpan
import android.text.style.StyleSpan
import kotlin.math.max

/**
 * Dibuja la carta a 300 ppp en tamaño póker: 2,5 × 3,5 pulgadas (63 × 88 mm) = 750 × 1050 px.
 */
object CardRenderer {
    const val W = 750
    const val H = 1050
    private const val M = 48f // margen interior del contenido

    private val ink = 0xFF2A2118.toInt()
    private val parchment = 0xFFF4ECD8.toInt()
    private val parchmentDark = 0xFFE6D6B0.toInt()

    private val serifBold = Typeface.create(Typeface.SERIF, Typeface.BOLD)
    private val serif = Typeface.create(Typeface.SERIF, Typeface.NORMAL)
    private val sansBold = Typeface.create(Typeface.SANS_SERIF, Typeface.BOLD)

    fun render(card: RpgCard, art: Bitmap?): Bitmap {
        val bmp = Bitmap.createBitmap(W, H, Bitmap.Config.ARGB_8888)
        bmp.density = 300
        val c = Canvas(bmp)
        val accent = card.category.color
        val accentDark = darken(accent, 0.65f)
        val p = Paint(Paint.ANTI_ALIAS_FLAG)

        // Marco exterior y fondo de pergamino.
        p.color = 0xFF16120D.toInt()
        c.drawRoundRect(RectF(0f, 0f, W.toFloat(), H.toFloat()), 40f, 40f, p)
        p.color = accent
        c.drawRoundRect(RectF(22f, 22f, W - 22f, H - 22f), 26f, 26f, p)
        p.shader = LinearGradient(0f, 0f, 0f, H.toFloat(), parchment, parchmentDark, Shader.TileMode.CLAMP)
        c.drawRoundRect(RectF(32f, 32f, W - 32f, H - 32f), 20f, 20f, p)
        p.shader = null

        // Banda superior: categoría + nivel.
        val band = RectF(M - 8, 44f, W - M + 8, 112f)
        p.color = accentDark
        c.drawRoundRect(band, 14f, 14f, p)
        val bandText = TextPaint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.WHITE; typeface = sansBold; textSize = 28f
        }
        val catText = card.roleLabel?.uppercase() ?: "${card.category.emoji} ${card.category.singular.uppercase()}"
        c.drawText(
            TextUtils.ellipsize(catText, bandText, 360f, TextUtils.TruncateAt.END).toString(),
            band.left + 18, band.centerY() + 10, bandText,
        )
        drawTier(c, card, band)

        // Nombre.
        val namePaint = TextPaint(Paint.ANTI_ALIAS_FLAG).apply { color = ink; typeface = serifBold }
        val nameW = W - 2 * M
        fitSingleLine(namePaint, card.title, nameW, 48f, 28f)
        c.drawText(
            TextUtils.ellipsize(card.title, namePaint, nameW, TextUtils.TruncateAt.END).toString(),
            M, 166f, namePaint,
        )

        // Subtítulo.
        val subPaint = TextPaint(Paint.ANTI_ALIAS_FLAG).apply {
            color = darken(ink, 1.6f); typeface = Typeface.create(serif, Typeface.ITALIC)
        }
        fitSingleLine(subPaint, card.subtitle, nameW, 25f, 18f)
        c.drawText(
            TextUtils.ellipsize(card.subtitle, subPaint, nameW, TextUtils.TruncateAt.END).toString(),
            M, 202f, subPaint,
        )

        // Ilustración.
        val artBox = RectF(M, 220f, W - M, 590f)
        drawArt(c, art, artBox, card, accent)
        p.style = Paint.Style.STROKE; p.strokeWidth = 5f; p.color = accentDark
        c.drawRoundRect(artBox, 14f, 14f, p)
        p.style = Paint.Style.FILL

        // Estadísticas.
        var y = 606f
        if (card.stats.isNotEmpty()) {
            drawStats(c, card.stats, RectF(M, y, W - M, y + 78f), accent, accentDark)
            y += 92f
        }

        // Caja de texto.
        val textBox = RectF(M, y, W - M, 966f)
        p.color = 0xB3FFFFFF.toInt()
        c.drawRoundRect(textBox, 12f, 12f, p)
        p.style = Paint.Style.STROKE; p.strokeWidth = 3f; p.color = accent
        c.drawRoundRect(textBox, 12f, 12f, p)
        p.style = Paint.Style.FILL
        drawBodyText(c, card, textBox, accentDark)

        // Pie: créditos.
        val foot = TextPaint(Paint.ANTI_ALIAS_FLAG).apply {
            color = darken(ink, 1.9f); typeface = serif; textSize = 17f
        }
        val credit = buildString {
            card.artist?.let { append("Ilus. ").append(it).append(" · ") }
            if (card.source.isNotBlank()) append(card.source).append(" · ")
            append("Scryfall")
        }
        c.drawText(
            TextUtils.ellipsize(credit, foot, W - 2 * M - 150, TextUtils.TruncateAt.END).toString(),
            M, 998f, foot,
        )
        foot.textAlign = Paint.Align.RIGHT
        foot.typeface = serifBold
        c.drawText("Forja RPG", W - M, 998f, foot)
        return bmp
    }

    /**
     * Hoja A4 a 300 ppp (2480 × 3508 px) con hasta 9 cartas en cuadrícula 3 × 3
     * y marcas de corte, lista para imprimir al 100 %.
     */
    fun sheet(cards: List<Bitmap>): Bitmap {
        val sw = 2480
        val sh = 3508
        val bmp = Bitmap.createBitmap(sw, sh, Bitmap.Config.ARGB_8888)
        bmp.density = 300
        val c = Canvas(bmp)
        c.drawColor(Color.WHITE)
        val ox = (sw - 3 * W) / 2f
        val oy = (sh - 3 * H) / 2f
        val paint = Paint(Paint.FILTER_BITMAP_FLAG or Paint.ANTI_ALIAS_FLAG)
        cards.take(9).forEachIndexed { i, card ->
            val x = ox + (i % 3) * W
            val y = oy + (i / 3) * H
            c.drawBitmap(card, null, RectF(x, y, x + W, y + H), paint)
        }
        // Marcas de corte en los márgenes.
        val cut = Paint().apply { color = 0xFF888888.toInt(); strokeWidth = 2f }
        for (k in 0..3) {
            val x = ox + k * W
            val y = oy + k * H
            c.drawLine(x, 20f, x, oy - 10, cut)
            c.drawLine(x, oy + 3 * H + 10, x, sh - 20f, cut)
            c.drawLine(20f, y, ox - 10, y, cut)
            c.drawLine(ox + 3 * W + 10, y, sw - 20f, y, cut)
        }
        return bmp
    }

    private fun drawTier(c: Canvas, card: RpgCard, band: RectF) {
        val r = 11f
        val gap = 30f
        val lastCx = band.right - 22 - r
        val firstCx = lastCx - 4 * gap
        val p = Paint(Paint.ANTI_ALIAS_FLAG)
        for (i in 0 until 5) {
            val cx = firstCx + i * gap
            if (i < card.tier) {
                p.style = Paint.Style.FILL; p.color = 0xFFFFD86B.toInt()
            } else {
                p.style = Paint.Style.STROKE; p.strokeWidth = 3f; p.color = 0xCCFFFFFF.toInt()
            }
            drawDiamond(c, cx, band.centerY(), r, p)
        }
        val label = TextPaint(Paint.ANTI_ALIAS_FLAG).apply {
            color = 0xE6FFFFFF.toInt(); typeface = sansBold; textSize = 20f; textAlign = Paint.Align.RIGHT
        }
        c.drawText(card.category.tierLabel.uppercase(), firstCx - r - 12, band.centerY() + 7, label)
    }

    private fun drawDiamond(c: Canvas, cx: Float, cy: Float, r: Float, p: Paint) {
        val path = Path().apply {
            moveTo(cx, cy - r); lineTo(cx + r, cy); lineTo(cx, cy + r); lineTo(cx - r, cy); close()
        }
        c.drawPath(path, p)
    }

    private fun drawArt(c: Canvas, art: Bitmap?, box: RectF, card: RpgCard, accent: Int) {
        c.save()
        val clip = Path().apply { addRoundRect(box, 14f, 14f, Path.Direction.CW) }
        c.clipPath(clip)
        if (art != null) {
            // Recorte centrado (center-crop).
            val scale = max(box.width() / art.width, box.height() / art.height)
            val sw = box.width() / scale
            val sh = box.height() / scale
            val sx = (art.width - sw) / 2f
            val sy = (art.height - sh) / 2f
            val src = Rect(sx.toInt(), sy.toInt(), (sx + sw).toInt(), (sy + sh).toInt())
            c.drawBitmap(art, src, box, Paint(Paint.FILTER_BITMAP_FLAG or Paint.ANTI_ALIAS_FLAG))
        } else {
            val p = Paint(Paint.ANTI_ALIAS_FLAG)
            p.shader = LinearGradient(box.left, box.top, box.right, box.bottom,
                darken(accent, 0.5f), accent, Shader.TileMode.CLAMP)
            c.drawRect(box, p)
            val e = TextPaint(Paint.ANTI_ALIAS_FLAG).apply { textSize = 150f; textAlign = Paint.Align.CENTER }
            c.drawText(card.category.emoji, box.centerX(), box.centerY() + 50, e)
        }
        c.restore()
    }

    private fun drawStats(c: Canvas, stats: List<Stat>, area: RectF, accent: Int, accentDark: Int) {
        val gap = 12f
        val w = (area.width() - gap * (stats.size - 1)) / stats.size
        val p = Paint(Paint.ANTI_ALIAS_FLAG)
        val label = TextPaint(Paint.ANTI_ALIAS_FLAG).apply {
            color = accentDark; typeface = sansBold; textSize = 17f; textAlign = Paint.Align.CENTER
        }
        val value = TextPaint(Paint.ANTI_ALIAS_FLAG).apply {
            color = ink; typeface = serifBold; textAlign = Paint.Align.CENTER
        }
        stats.forEachIndexed { i, s ->
            val r = RectF(area.left + i * (w + gap), area.top, area.left + i * (w + gap) + w, area.bottom)
            p.style = Paint.Style.FILL; p.color = withAlpha(accent, 0x30)
            c.drawRoundRect(r, 12f, 12f, p)
            p.style = Paint.Style.STROKE; p.strokeWidth = 3f; p.color = accent
            c.drawRoundRect(r, 12f, 12f, p)
            c.drawText(s.label.uppercase(), r.centerX(), r.top + 26, label)
            fitSingleLine(value, s.value, w - 16, 27f, 16f)
            c.drawText(
                TextUtils.ellipsize(s.value, value, w - 16, TextUtils.TruncateAt.END).toString(),
                r.centerX(), r.bottom - 16, value,
            )
        }
    }

    private fun drawBodyText(c: Canvas, card: RpgCard, box: RectF, accentDark: Int) {
        val sb = SpannableStringBuilder()
        fun paragraph() {
            if (sb.isNotEmpty()) {
                sb.append("\n")
                val start = sb.length
                sb.append("\n")
                sb.setSpan(RelativeSizeSpan(0.45f), start, sb.length, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
            }
        }
        fun styled(text: String, vararg spans: Any) {
            val start = sb.length
            sb.append(text)
            spans.forEach { sb.setSpan(it, start, sb.length, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE) }
        }

        card.motive?.let {
            styled(it, StyleSpan(Typeface.ITALIC), ForegroundColorSpan(0xFF5C4F3D.toInt()))
        }
        if (card.traits.isNotEmpty()) {
            paragraph()
            styled("Rasgos: ", StyleSpan(Typeface.BOLD), ForegroundColorSpan(accentDark))
            styled(card.traits.joinToString(" · "), StyleSpan(Typeface.BOLD))
        }
        if (card.effect.isNotBlank()) {
            paragraph()
            sb.append(card.effect)
        }
        card.flavor?.takeIf { it.isNotBlank() }?.let {
            paragraph()
            styled("“$it”", StyleSpan(Typeface.ITALIC), ForegroundColorSpan(0xFF5C4F3D.toInt()))
        }
        if (card.hook.isNotBlank()) {
            paragraph()
            styled("${card.hookLabel}: ", StyleSpan(Typeface.BOLD), ForegroundColorSpan(accentDark))
            styled(card.hook, StyleSpan(Typeface.ITALIC))
        }

        val pad = 16f
        val width = (box.width() - 2 * pad).toInt()
        val maxH = box.height() - 2 * pad
        val tp = TextPaint(Paint.ANTI_ALIAS_FLAG).apply { color = ink; typeface = serif }

        var size = 27f
        var layout: StaticLayout
        while (true) {
            tp.textSize = size
            layout = build(sb, tp, width, Int.MAX_VALUE)
            if (layout.height <= maxH || size <= 14f) break
            size -= 1f
        }
        if (layout.height > maxH) {
            // Aún no cabe: recortamos con puntos suspensivos.
            var lines = layout.lineCount
            while (lines > 1 && layout.height > maxH) {
                lines--
                layout = build(sb, tp, width, lines)
            }
        }
        c.save()
        c.translate(box.left + pad, box.top + pad)
        layout.draw(c)
        c.restore()
    }

    private fun build(text: CharSequence, tp: TextPaint, width: Int, maxLines: Int): StaticLayout =
        StaticLayout.Builder.obtain(text, 0, text.length, tp, width)
            .setAlignment(Layout.Alignment.ALIGN_NORMAL)
            .setLineSpacing(0f, 1.05f)
            .setIncludePad(false)
            .setMaxLines(maxLines)
            .setEllipsize(TextUtils.TruncateAt.END)
            .build()

    private fun fitSingleLine(p: TextPaint, text: String, width: Float, start: Float, min: Float) {
        var s = start
        p.textSize = s
        while (p.measureText(text) > width && s > min) {
            s -= 1f
            p.textSize = s
        }
    }

    private fun darken(color: Int, f: Float): Int {
        fun ch(v: Int) = (v * f).toInt().coerceIn(0, 255)
        return Color.argb(Color.alpha(color), ch(Color.red(color)), ch(Color.green(color)), ch(Color.blue(color)))
    }

    private fun withAlpha(color: Int, a: Int) =
        Color.argb(a, Color.red(color), Color.green(color), Color.blue(color))
}
