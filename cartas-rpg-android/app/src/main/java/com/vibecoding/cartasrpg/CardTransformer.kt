package com.vibecoding.cartasrpg

import kotlin.math.ceil
import kotlin.random.Random

data class Stat(val label: String, val value: String)

/** Carta de rol, independiente de cualquier sistema. */
data class RpgCard(
    val category: Category,
    val title: String,
    val subtitle: String,
    val tier: Int,
    val stats: List<Stat>,
    val traits: List<String>,
    val effect: String,
    val flavor: String?,
    val hook: String,
    val artist: String?,
    val source: String,
    val artUrl: String?,
    val scryfallUri: String,
)

/** Convierte una carta de Magic en una carta de rol de sistema agnóstico. */
object CardTransformer {

    fun transform(card: MtgCard, requested: Category): RpgCard {
        val category = if (requested == Category.RANDOM) classify(card) else requested
        val title = card.printedName ?: card.name
        val typeLower = card.typeLine.lowercase()
        val legendary = "legendary" in typeLower

        // Subtipos: preferimos la línea de tipo impresa en español si existe.
        val subtypes = subtypesOf(card)
        val subtitle = buildString {
            append(category.singular)
            if (legendary && category != Category.DEITY && category != Category.HERO) append(" único")
            if (subtypes.isNotEmpty()) append(" — ").append(subtypes.take(3).joinToString(" "))
        }

        val stats = buildStats(card, typeLower)
        // Las habilidades explicadas en la descripción no se repiten como rasgos.
        val traits = card.keywords.filterNot { AbilityInterpreter.hasExplanation(it) }
            .map { translateKeyword(it) }.distinct().take(5)

        // Descripción generada a partir de lo que hace la carta (siempre desde el texto
        // Oracle en inglés); nunca se muestra el texto original.
        val effect = AbilityInterpreter.describe(card, category).joinToString("\n")

        return RpgCard(
            category = category,
            title = title,
            subtitle = subtitle,
            tier = tierOf(card),
            stats = stats,
            traits = traits,
            effect = effect,
            flavor = null,
            hook = hookFor(category, title),
            artist = card.artist,
            source = card.setName,
            artUrl = card.artUrl,
            scryfallUri = card.scryfallUri,
        )
    }

    /** Decide la categoría de rol a partir de la línea de tipo en inglés. */
    fun classify(card: MtgCard): Category {
        val t = card.typeLine.lowercase()
        val subs = card.typeLine.substringAfter("—", "").lowercase().split(" ").filter { it.isNotBlank() }
        return when {
            "scheme" in t || "phenomenon" in t || "saga" in subs || "battle" in t -> Category.EVENT
            "planeswalker" in t -> Category.HERO
            t.startsWith("plane") || "dungeon" in t || "land" in t || "room" in subs -> Category.LOCATION
            "god" in subs -> Category.DEITY
            "vehicle" in subs || "mount" in subs -> Category.MOUNT
            "creature" in t -> if ("legendary" in t) Category.NPC else Category.MONSTER
            "equipment" in subs -> Category.EQUIPMENT
            "trap" in subs -> Category.TRAP
            "artifact" in t -> Category.ITEM
            "instant" in t || "sorcery" in t -> Category.SPELL
            "enchantment" in t -> Category.ENCHANTMENT
            else -> Category.ITEM
        }
    }

    /** Nivel 1–5 basado en coste de maná y rareza. */
    private fun tierOf(card: MtgCard): Int {
        var tier = ceil((card.cmc + 1) / 2.0).toInt().coerceIn(1, 5)
        if (card.rarity == "mythic") tier++
        if (card.rarity == "common" && tier > 1 && card.cmc < 4) tier--
        return tier.coerceIn(1, 5)
    }

    private fun buildStats(card: MtgCard, typeLower: String): List<Stat> {
        val affinity = affinityOf(card, typeLower)
        val rarity = when (card.rarity) {
            "common" -> "Común"
            "uncommon" -> "Inusual"
            "rare" -> "Rara"
            "mythic" -> "Mítica"
            else -> "Especial"
        }
        return when {
            card.power != null && card.toughness != null -> listOf(
                Stat("Ofensiva", scale(card.power)),
                Stat("Aguante", scale(card.toughness)),
                Stat("Afinidad", affinity),
            )
            card.loyalty != null -> listOf(
                Stat("Voluntad", scale(card.loyalty)),
                Stat("Afinidad", affinity),
                Stat("Rareza", rarity),
            )
            "instant" in typeLower || "sorcery" in typeLower -> listOf(
                Stat("Ejecución", if ("instant" in typeLower) "Inmediata" else "Ritual"),
                Stat("Afinidad", affinity),
                Stat("Rareza", rarity),
            )
            else -> listOf(
                Stat("Afinidad", affinity),
                Stat("Rareza", rarity),
            )
        }
    }

    private fun scale(v: String): String {
        val n = v.toIntOrNull() ?: return "Variable"
        val word = when {
            n <= 0 -> "Nula"
            n <= 1 -> "Débil"
            n <= 3 -> "Media"
            n <= 5 -> "Fuerte"
            n <= 8 -> "Temible"
            else -> "Colosal"
        }
        return "$word ($n)"
    }

    private fun affinityOf(card: MtgCard, typeLower: String): String {
        val names = card.colors.mapNotNull {
            when (it) {
                "W" -> "Luz"
                "U" -> "Mente"
                "B" -> "Sombra"
                "R" -> "Fuego"
                "G" -> "Naturaleza"
                else -> null
            }
        }
        return when {
            names.size > 2 -> "Caos primigenio"
            names.isNotEmpty() -> names.joinToString(" / ")
            "artifact" in typeLower -> "Artificio"
            "land" in typeLower -> "Tierra"
            else -> "Neutral"
        }
    }

    private fun subtypesOf(card: MtgCard): List<String> {
        val spanishLine = card.printedTypeLine?.takeIf { card.lang != "en" }
        val line = spanishLine ?: card.typeLine
        val part = line.substringAfter("—", "").trim()
        if (part.isEmpty()) return emptyList()
        val words = part.split(" ").filter { it.isNotBlank() }
        return if (spanishLine != null) {
            words.map { w -> w.replaceFirstChar { it.uppercase() } }
        } else {
            words.map { SUBTYPES[it] ?: it }
        }
    }

    fun translateKeyword(k: String): String {
        KEYWORDS[k.lowercase()]?.let { return it }
        if (k.lowercase().endsWith("walk")) return "Sigiloso"
        return k
    }

    /** Traduce un subtipo (inglés, sin distinguir mayúsculas) o null si no se conoce. */
    fun subtypeEs(word: String): String? =
        SUBTYPES.entries.firstOrNull { it.key.equals(word, ignoreCase = true) }?.value

    private fun hookFor(category: Category, name: String): String {
        val pool = HOOKS[category] ?: HOOKS.getValue(Category.ITEM)
        return pool[Random.nextInt(pool.size)].replace("{n}", name)
    }

    private val KEYWORDS = mapOf(
        "flying" to "Vuela",
        "deathtouch" to "Toque letal",
        "lifelink" to "Vampírico",
        "haste" to "Veloz",
        "vigilance" to "Siempre alerta",
        "reach" to "Largo alcance",
        "hexproof" to "Antimagia",
        "shroud" to "Velado",
        "indestructible" to "Indestructible",
        "first strike" to "Golpea primero",
        "double strike" to "Doble golpe",
        "menace" to "Intimidante",
        "intimidate" to "Intimidante",
        "fear" to "Aterrador",
        "defender" to "Guardián",
        "flash" to "Emboscada",
        "trample" to "Arrollador",
        "ward" to "Salvaguarda",
        "protection" to "Protección",
        "prowess" to "Ímpetu arcano",
        "equip" to "Equipable",
        "enchant" to "Se vincula",
        "scry" to "Clarividencia",
        "surveil" to "Vigilancia",
        "flashback" to "Eco del pasado",
        "infect" to "Infección",
        "toxic" to "Tóxico",
        "wither" to "Marchitar",
        "persist" to "Persistente",
        "undying" to "Imperecedero",
        "regenerate" to "Regeneración",
        "transform" to "Transformación",
        "morph" to "Disfraz",
        "disguise" to "Disfraz",
        "changeling" to "Cambiaformas",
        "shadow" to "Sombrío",
        "horsemanship" to "Jinete",
        "fight" to "Combate singular",
        "mill" to "Olvido",
        "investigate" to "Investigar",
        "explore" to "Explorar",
        "convoke" to "Ritual colectivo",
        "kicker" to "Potenciable",
        "cycling" to "Reciclable",
        "crew" to "Tripulable",
        "saddle" to "Ensillable",
        "venture into the dungeon" to "Explorar mazmorra",
        "ninjutsu" to "Ninjutsu",
        "bushido" to "Bushido",
        "landfall" to "Vínculo con la tierra",
        "treasure" to "Tesoro",
        "food" to "Provisiones",
        "proliferate" to "Propagar",
        "devour" to "Devorar",
        "afflict" to "Aflicción",
        "exalted" to "Exaltado",
        "annihilator" to "Aniquilador",
        "cascade" to "Cascada",
        "storm" to "Tormenta",
        "evoke" to "Evocar",
        "unearth" to "Desenterrar",
        "embalm" to "Embalsamar",
        "eternalize" to "Eternizar",
        "dash" to "Embestida",
        "mutate" to "Mutar",
        "riot" to "Disturbio",
        "skulk" to "Escurridizo",
        "fabricate" to "Fabricar",
        "partner" to "Compañero",
        "amass" to "Reunir ejército",
        "connive" to "Conspirar",
        "learn" to "Aprender",
        "foretell" to "Presagio",
    )

    private val SUBTYPES = mapOf(
        "Human" to "Humano", "Elf" to "Elfo", "Dwarf" to "Enano", "Goblin" to "Goblin", "Orc" to "Orco",
        "Giant" to "Gigante", "Dragon" to "Dragón", "Zombie" to "Zombi", "Vampire" to "Vampiro",
        "Angel" to "Ángel", "Demon" to "Demonio", "Devil" to "Diablo", "Spirit" to "Espíritu",
        "Beast" to "Bestia", "Elemental" to "Elemental", "Wizard" to "Mago", "Warrior" to "Guerrero",
        "Knight" to "Caballero", "Cleric" to "Clérigo", "Rogue" to "Pícaro", "Soldier" to "Soldado",
        "Shaman" to "Chamán", "Druid" to "Druida", "Monk" to "Monje", "Archer" to "Arquero",
        "Assassin" to "Asesino", "Pirate" to "Pirata", "Noble" to "Noble", "Advisor" to "Consejero",
        "Merfolk" to "Tritón", "Horror" to "Horror", "Wolf" to "Lobo", "Werewolf" to "Hombre lobo",
        "Cat" to "Felino", "Bird" to "Ave", "Snake" to "Serpiente", "Insect" to "Insecto",
        "Spider" to "Araña", "Construct" to "Constructo", "Golem" to "Gólem", "Skeleton" to "Esqueleto",
        "Dinosaur" to "Dinosaurio", "Hydra" to "Hidra", "Sphinx" to "Esfinge", "Treefolk" to "Árbol viviente",
        "Faerie" to "Hada", "Leviathan" to "Leviatán", "Kraken" to "Kraken", "Ooze" to "Cieno",
        "Wurm" to "Gusano colosal", "Troll" to "Trol", "Ogre" to "Ogro", "Minotaur" to "Minotauro",
        "Centaur" to "Centauro", "Griffin" to "Grifo", "Horse" to "Caballo", "Bear" to "Oso",
        "Rat" to "Rata", "Bat" to "Murciélago", "Fish" to "Pez", "Plant" to "Planta", "Fungus" to "Hongo",
        "Illusion" to "Ilusión", "Shapeshifter" to "Cambiaformas", "Nightmare" to "Pesadilla",
        "Wraith" to "Espectro", "Specter" to "Espectro", "Imp" to "Diablillo", "Gargoyle" to "Gárgola",
        "Phoenix" to "Fénix", "Unicorn" to "Unicornio", "Wall" to "Muro", "Avatar" to "Avatar",
        "Equipment" to "Equipo", "Aura" to "Aura", "Curse" to "Maldición", "Vehicle" to "Vehículo",
        "Mount" to "Montura", "Food" to "Provisiones", "Treasure" to "Tesoro", "Clue" to "Pista",
        "Trap" to "Trampa", "Arcane" to "Arcano", "Adventure" to "Aventura", "Lesson" to "Lección",
        "Shrine" to "Santuario", "Cartouche" to "Cartucho", "Saga" to "Saga", "Room" to "Estancia",
        "Cave" to "Cueva", "Desert" to "Desierto", "Gate" to "Puerta", "Lair" to "Guarida",
        "Locus" to "Locus", "Sphere" to "Esfera", "Town" to "Pueblo", "Forest" to "Bosque",
        "Island" to "Isla", "Swamp" to "Pantano", "Mountain" to "Montaña", "Plains" to "Llanura",
        "God" to "Dios", "Fortification" to "Fortificación", "Siege" to "Asedio", "Gnome" to "Gnomo",
        "Kithkin" to "Mediano", "Halfling" to "Mediano", "Bard" to "Bardo", "Ranger" to "Explorador",
        "Warlock" to "Brujo", "Sorcerer" to "Hechicero", "Peasant" to "Campesino", "Citizen" to "Ciudadano",
        "Mercenary" to "Mercenario", "Berserker" to "Berserker", "Samurai" to "Samurái", "Ninja" to "Ninja",
        "Artificer" to "Artífice", "Scout" to "Explorador", "Detective" to "Detective",
    )

    private val HOOKS: Map<Category, List<String>> = mapOf(
        Category.MONSTER to listOf(
            "Los aldeanos hablan de {n} rondando los caminos al caer la noche.",
            "Un cazador ofrece una recompensa por acabar con {n}.",
            "{n} protege algo que el grupo necesita desesperadamente.",
            "Huellas recientes indican que {n} no está solo.",
            "{n} no es hostil: huye de algo mucho peor.",
        ),
        Category.NPC to listOf(
            "{n} necesita un favor y paga bien… por ahora.",
            "{n} conoce un secreto que alguien quiere enterrar.",
            "Nadie confía en {n}, pero es quien conoce el camino.",
            "{n} busca venganza contra un antiguo aliado.",
            "{n} confunde a uno del grupo con un viejo conocido.",
        ),
        Category.DEITY to listOf(
            "Los fieles de {n} exigen una ofrenda antes de la próxima luna.",
            "Un oráculo afirma que {n} ha elegido a alguien del grupo.",
            "El templo de {n} ha sido profanado y la tierra lo resiente.",
        ),
        Category.HERO to listOf(
            "{n} recluta campeones para una guerra entre mundos.",
            "{n} ha desaparecido y su poder se desborda sin control.",
            "Un portal se abre y {n} lo cruza malherido.",
        ),
        Category.ITEM to listOf(
            "{n} fue robado de la cámara de un noble.",
            "Un mercader vende {n} sin saber lo que es.",
            "{n} reacciona cuando se acerca a cierta ruina.",
            "Dicen que {n} trae desgracia a quien lo posee.",
        ),
        Category.EQUIPMENT to listOf(
            "{n} perteneció a un héroe caído; su familia lo reclama.",
            "Forjar otro {n} requiere un material imposible.",
            "{n} susurra a quien lo empuña.",
        ),
        Category.MOUNT to listOf(
            "{n} es la única forma de cruzar el páramo a tiempo.",
            "Alguien ofrece {n} a cambio de un trabajo peligroso.",
            "{n} escapó y siembra el caos en el mercado.",
        ),
        Category.LOCATION to listOf(
            "Un mapa incompleto conduce a {n}.",
            "Quienes entran en {n} vuelven cambiados… si vuelven.",
            "Dos facciones se disputan el control de {n}.",
            "Algo despertó en lo más profundo de {n}.",
        ),
        Category.SPELL to listOf(
            "Un grimorio antiguo describe {n}, pero falta una página.",
            "Un rival lanzó {n} contra el grupo y huyó.",
            "Aprender {n} exige un precio que el maestro no revela.",
        ),
        Category.ENCHANTMENT to listOf(
            "{n} pesa sobre un pueblo entero desde hace generaciones.",
            "Romper {n} exige encontrar a quien lo creó.",
            "{n} protege un lugar sagrado… y también a sus enemigos.",
        ),
        Category.TRAP to listOf(
            "{n} custodia la entrada de una cámara olvidada.",
            "Alguien preparó {n} sabiendo exactamente quién vendría.",
            "El último grupo que cayó en {n} sigue ahí.",
        ),
        Category.EVENT to listOf(
            "{n}: el mundo cambia y el grupo está en el centro.",
            "Las señales anuncian {n} en tres días.",
            "Un villano orquesta {n} desde las sombras.",
        ),
    )
}
