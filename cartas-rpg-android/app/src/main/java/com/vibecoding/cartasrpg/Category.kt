package com.vibecoding.cartasrpg

/**
 * Categorías de cartas de rol. Cada una se traduce a una búsqueda de Scryfall
 * (sintaxis: https://scryfall.com/docs/syntax).
 */
enum class Category(
    val label: String,
    val singular: String,
    val emoji: String,
    val tierLabel: String,
    val query: String?,
    val color: Int,
) {
    RANDOM("Aleatoria", "Carta", "🎲", "Nivel", null, 0xFF7F6A4D.toInt()),
    MONSTER("Monstruos", "Monstruo", "🐉", "Amenaza", "t:creature -t:legendary -t:god", 0xFFB03A2E.toInt()),
    NPC("Personajes", "Personaje", "🧙", "Influencia", "t:legendary t:creature -t:god", 0xFF2E86C1.toInt()),
    ITEM("Objetos", "Objeto", "💎", "Valor", "t:artifact -t:creature -t:equipment -t:vehicle", 0xFF7D6608.toInt()),
    EQUIPMENT("Armas y equipo", "Arma / equipo", "⚔️", "Valor", "t:equipment", 0xFF6E7B8B.toInt()),
    LOCATION("Lugares", "Lugar", "🏰", "Peligro", "(t:land -t:basic) or t:plane or t:dungeon or t:room", 0xFF1E8449.toInt()),
    SPELL("Hechizos", "Hechizo", "✨", "Círculo", "t:instant or t:sorcery", 0xFF6C3483.toInt()),
    ENCHANTMENT("Bendiciones y maldiciones", "Encantamiento", "🔮", "Intensidad", "t:enchantment -t:creature -t:room -t:saga", 0xFF117A65.toInt()),
    TRAP("Trampas", "Trampa", "🪤", "Letalidad", "t:trap or name:trap", 0xFF935116.toInt()),
    EVENT("Eventos y tramas", "Evento", "📜", "Escala", "t:scheme or t:phenomenon or t:saga or t:battle", 0xFFA04000.toInt()),
    DEITY("Deidades", "Deidad", "☀️", "Divinidad", "t:god", 0xFFB7950B.toInt()),
    HERO("Héroes y archienemigos", "Héroe legendario", "👑", "Poder", "t:planeswalker", 0xFF5B2C6F.toInt()),
    MOUNT("Monturas y vehículos", "Montura / vehículo", "🐎", "Valor", "t:vehicle or t:mount", 0xFF6E2C00.toInt());
}
