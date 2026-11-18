package com.vibecoding.cartasrpg

/**
 * Descripción de la carta basada solo en las guías de la comunidad para usar cartas de
 * Magic en partidas de rol: uso en mesa según la categoría, rol táctico a partir de fuerza
 * y resistencia, y habilidades clave convertidas en mecánicas. No se traduce el texto de
 * reglas de la carta.
 */
object TableGuide {

    private const val MAX_KEYWORDS = 3

    fun describe(
        category: Category,
        tier: Int,
        stats: List<Stat>,
        keywords: List<String>,
        colors: List<String> = emptyList(),
    ): List<String> {
        val out = mutableListOf<String>()
        out += usage(category, tier)
        stats.firstOrNull { it.label == "Rol" }?.let { ROLE_TEXT[it.value] }?.let { out += it }
        if (stats.any { it.label == "Rol" }) strengths(colors)?.let { out += it }
        stats.firstOrNull { it.label == "Uso" }?.let { USE_TEXT[it.value] }?.let { out += it }
        stats.firstOrNull { it.label == "Ejecución" }?.let { CAST_TEXT[it.value] }?.let { out += it }
        out += keywords.mapNotNull { KEYWORD_RULES[it.lowercase()] }.distinct().take(MAX_KEYWORDS)
        return out
    }

    fun hasExplanation(keyword: String) = KEYWORD_RULES.containsKey(keyword.lowercase())

    /** Cómo usar la carta en mesa según su categoría. */
    private fun usage(category: Category, tier: Int): String = when (category) {
        Category.MONSTER -> "Úsalo como enemigo o encuentro de Amenaza $tier/5."
        Category.NPC -> "Úsalo como PNJ importante, rival o aliado de Influencia $tier/5."
        Category.DEITY -> "Úsalo como patrón divino, culto o adversario de campaña."
        Category.HERO -> "Úsalo como gran villano o mentor de campaña de Poder $tier/5."
        Category.ITEM, Category.EQUIPMENT -> "Entrégalo al grupo como recompensa de Valor $tier/5."
        Category.MOUNT -> "Úsalo como montura o transporte del grupo de Valor $tier/5."
        Category.LOCATION -> "Úsalo como escenario o encuentro de terreno con Peligro $tier/5."
        Category.SPELL -> "Hechizo de Círculo $tier/5 para personajes o enemigos que usan magia."
        Category.ENCHANTMENT -> "Efecto persistente de Intensidad $tier/5: úsalo como bendición o maldición que dura varias escenas."
        Category.TRAP -> "Peligro oculto de Letalidad $tier/5; los personajes atentos pueden detectarlo a tiempo."
        Category.EVENT -> "Úsalo como acontecimiento de Escala $tier/5 que altera la escena o la campaña."
        Category.RANDOM -> "Úsalo como inspiración libre."
    }

    /**
     * Puntos fuertes según el color, como hacen los conversores de cartas a fichas de
     * monstruo, que ajustan las estadísticas base según los colores de maná.
     */
    private val COLOR_STRENGTH = mapOf(
        "W" to "defensa y protección de los suyos",
        "U" to "magia, engaño y control",
        "B" to "daño letal y drenar vida",
        "R" to "daño explosivo y velocidad",
        "G" to "fuerza física y resistencia",
    )

    private fun strengths(colors: List<String>): String? {
        val parts = colors.mapNotNull { COLOR_STRENGTH[it] }
        if (parts.isEmpty()) return null
        return "Puntos fuertes: " + parts.joinToString("; ") + "."
    }

    private val ROLE_TEXT = mapOf(
        "Guardián" to "Guardián: no busca el combate; protege un lugar o a alguien.",
        "Hostigador" to "Hostigador: ataca desde el aire o a distancia y se retira antes de recibir golpes.",
        "Líder" to "Líder: dirige a otros; derrotarlo desmoraliza a sus seguidores.",
        "Atacante" to "Atacante: golpea fuerte pero aguanta poco; conviene eliminarlo pronto.",
        "Tanque" to "Tanque: aguanta mucho castigo y sirve para cerrar el paso.",
        "Especialista" to "Especialista: débil en combate directo, peligroso por sus habilidades.",
        "Esbirro" to "Esbirro: enemigo menor que suele aparecer en grupo.",
        "Apoyo" to "Apoyo: no lucha; potencia o protege a sus aliados.",
        "Soldado" to "Soldado: equilibrado entre ataque y defensa.",
        "Impredecible" to "Impredecible: su fuerza cambia según la situación.",
    )

    private val USE_TEXT = mapOf(
        "Se porta" to "Se porta: quien lo lleva obtiene su beneficio mientras lo use.",
        "Un solo uso" to "Un solo uso: se consume al activarlo.",
        "Una vez por ronda" to "Una vez por ronda: puede activarse de nuevo tras recuperarse.",
        "Pasivo" to "Pasivo: su efecto está siempre activo.",
        "Se tripula" to "Se tripula: necesita a alguien que lo maneje.",
        "Se monta" to "Se monta: alguien debe cabalgarlo para aprovecharlo.",
    )

    private val CAST_TEXT = mapOf(
        "Inmediata" to "Ejecución inmediata: puede usarse como reacción en cualquier momento.",
        "Ritual" to "Ritual: requiere preparación y solo puede usarse con calma.",
    )

    private val KEYWORD_RULES = mapOf(
        "flying" to "Vuela: solo lo alcanzan ataques a distancia u otras criaturas voladoras.",
        "deathtouch" to "Toque letal: cualquier herida que inflige es mortal.",
        "lifelink" to "Vampírico: recupera tanta vitalidad como daño inflige.",
        "haste" to "Veloz: actúa en cuanto aparece, sin necesidad de prepararse.",
        "vigilance" to "Siempre alerta: puede atacar sin bajar la guardia.",
        "reach" to "Largo alcance: puede golpear a enemigos que vuelan.",
        "hexproof" to "Antimagia: sus enemigos no pueden señalarlo con hechizos.",
        "shroud" to "Velado: nadie puede señalarlo con magia, ni siquiera sus aliados.",
        "indestructible" to "Indestructible: el daño por sí solo no puede destruirlo.",
        "first strike" to "Golpea primero: en un enfrentamiento siempre ataca antes que su rival.",
        "double strike" to "Doble golpe: ataca dos veces en cada enfrentamiento.",
        "menace" to "Intimidante: hacen falta al menos dos defensores para frenarlo.",
        "defender" to "Guardián: no ataca, pero protege a los suyos.",
        "flash" to "Emboscada: puede aparecer en cualquier momento, incluso en el turno enemigo.",
        "trample" to "Arrollador: el daño sobrante atraviesa a quien se interponga.",
        "ward" to "Salvaguarda: quien intente hechizarlo debe pagar un precio extra.",
        "protection" to "Protección: es inmune a cierta fuente de daño o de magia.",
        "prowess" to "Ímpetu arcano: se fortalece cada vez que se usa magia a su alrededor.",
        "infect" to "Infección: sus heridas envenenan y debilitan de forma duradera.",
        "toxic" to "Tóxico: sus heridas envenenan a la víctima.",
        "undying" to "Imperecedero: puede volver una vez de entre los muertos, más fuerte.",
        "persist" to "Persistente: puede volver una vez de entre los muertos, debilitado.",
        "changeling" to "Cambiaformas: cuenta como cualquier tipo de criatura.",
        "skulk" to "Escurridizo: solo pueden frenarlo enemigos más débiles que él.",
        "intimidate" to "Intimidante: solo pueden frenarlo enemigos de su misma naturaleza.",
        "fear" to "Aterrador: solo lo frenan criaturas oscuras o artificiales.",
        "shadow" to "Sombrío: solo interactúa con otras criaturas de las sombras.",
        "flashback" to "Eco del pasado: puede usarse una segunda vez tras agotarse.",
        "equip" to "Equipable: puede entregarse a un aliado para que lo porte.",
        "crew" to "Tripulable: necesita aliados que lo manejen para ponerse en marcha.",
        "saddle" to "Ensillable: alguien debe montarlo para que despliegue todo su potencial.",
        "convoke" to "Ritual colectivo: los aliados pueden ayudar a pagar su coste.",
        "kicker" to "Potenciable: pagando un precio extra su efecto es mayor.",
        "cycling" to "Reciclable: puede descartarse para buscar otra opción.",
        "morph" to "Disfraz: puede presentarse oculto y revelar su verdadera forma después.",
        "disguise" to "Disfraz: puede presentarse oculto y revelar su verdadera forma después.",
        "exalted" to "Exaltado: cuando un aliado lucha solo, recibe su bendición.",
        "annihilator" to "Aniquilador: cada vez que ataca, el enemigo pierde algo valioso.",
        "cascade" to "Cascada: al usarse desencadena otro efecto mágico al azar.",
        "landfall" to "Vínculo con la tierra: se fortalece al descubrir lugares nuevos.",
    )
}
