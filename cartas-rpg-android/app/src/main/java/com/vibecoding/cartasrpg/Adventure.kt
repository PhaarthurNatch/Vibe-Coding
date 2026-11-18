package com.vibecoding.cartasrpg

import kotlin.random.Random

/**
 * Generador de aventuras: se sacan cinco cartas y se improvisan conexiones entre ellas
 * para obtener el esqueleto de una aventura (método popularizado en r/rpg y The Alexandrian).
 */
object Adventure {

    enum class Role(val label: String, val emoji: String, val options: List<Category>) {
        THREAT("Amenaza", "🐉", listOf(Category.MONSTER, Category.MONSTER, Category.HERO)),
        SETTING("Escenario", "🏰", listOf(Category.LOCATION)),
        TREASURE("Botín", "💎", listOf(Category.ITEM, Category.EQUIPMENT)),
        COMPLICATION("Complicación", "⚠️", listOf(Category.TRAP, Category.ENCHANTMENT, Category.SPELL, Category.EVENT)),
        ALLY("Aliado", "🧙", listOf(Category.NPC)),
    }

    fun categoryFor(role: Role): Category = role.options[Random.nextInt(role.options.size)]

    private val PREMISES = listOf(
        "{ally} pide ayuda al grupo: {threat} se ha adueñado de {setting}. Allí se oculta {treasure}, pero {complication} complicará las cosas.",
        "Para recuperar {treasure}, el grupo debe viajar a {setting}. {threat} lo custodia, {ally} conoce el camino y {complication} aguarda en el peor momento.",
        "Los rumores sobre {treasure} llevan al grupo hasta {setting}. {ally} no es quien dice ser, {threat} acecha y {complication} lo cambia todo.",
        "{threat} amenaza con arrasar {setting}. Solo {treasure} puede detenerlo, y {ally} sabe dónde está… aunque {complication} se interpone.",
        "{setting} ya no es seguro: {complication} lo ha alterado y {threat} ha aprovechado para instalarse. {ally} ofrece {treasure} a quien lo resuelva.",
    )

    private val TWISTS = listOf(
        "El aliado trabaja en secreto para la amenaza.",
        "El botín está maldito y exige un precio.",
        "La amenaza solo protege algo que considera suyo.",
        "Otro grupo persigue el mismo objetivo.",
        "El escenario se derrumbará si se usa la fuerza bruta.",
        "La complicación fue provocada por el propio aliado.",
        "La amenaza es la víctima de alguien aún peor.",
    )

    /** Crea la carta resumen a partir de las cinco cartas de rol. */
    fun summary(cards: Map<Role, RpgCard>): RpgCard {
        fun n(r: Role) = cards[r]?.title ?: "algo desconocido"
        var premise = PREMISES[Random.nextInt(PREMISES.size)]
        premise = premise.replace("{threat}", n(Role.THREAT))
            .replace("{setting}", n(Role.SETTING))
            .replace("{treasure}", n(Role.TREASURE))
            .replace("{complication}", n(Role.COMPLICATION))
            .replace("{ally}", n(Role.ALLY))
            .replaceFirstChar { it.uppercase() }
        val list = Role.entries.joinToString("\n") { "${it.emoji} ${it.label}: ${n(it)}" }
        val tier = cards.values.map { it.tier }.average().takeIf { !it.isNaN() }?.let { Math.round(it).toInt() } ?: 3
        val threat = cards[Role.THREAT]
        return RpgCard(
            category = Category.EVENT,
            title = "Aventura en ${n(Role.SETTING)}",
            subtitle = "Cinco cartas, una historia",
            tier = tier.coerceIn(1, 5),
            stats = listOf(
                Stat("Peligro", listOf("Bajo", "Moderado", "Serio", "Alto", "Extremo")[tier.coerceIn(1, 5) - 1]),
                Stat("Escenas", "${3 + tier / 2}–${4 + tier}"),
            ),
            traits = emptyList(),
            effect = premise + "\n" + list,
            flavor = null,
            hook = TWISTS[Random.nextInt(TWISTS.size)],
            hookLabel = "Giro",
            artist = threat?.artist,
            source = threat?.source ?: "",
            artUrl = threat?.artUrl,
            scryfallUri = threat?.scryfallUri ?: "https://scryfall.com",
            roleLabel = "🗺️ Aventura",
        )
    }
}
