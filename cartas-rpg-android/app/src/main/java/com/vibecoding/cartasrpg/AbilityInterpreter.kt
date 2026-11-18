package com.vibecoding.cartasrpg

/**
 * Lee el texto de reglas (Oracle, en inglés) de una carta de Magic y genera una
 * descripción de efectos en español, en términos de rol genéricos (sin jerga de Magic).
 */
object AbilityInterpreter {

    private const val MAX_SENTENCES = 4

    fun describe(card: MtgCard, category: Category): List<String> {
        val abilities = describeText(card.oracleText, card.name, card.keywords).take(MAX_SENTENCES - 1)
        val explained = card.keywords.mapNotNull { KEYWORD_RULES[it.lowercase()] }.distinct()
        val sentences = (abilities + explained).take(MAX_SENTENCES)
        return sentences.ifEmpty { listOf(fallback(category, card)) }
    }

    fun hasExplanation(keyword: String) = KEYWORD_RULES.containsKey(keyword.lowercase())

    /** Explicación agnóstica de las habilidades clave más comunes. */
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

    fun describeText(oracle: String, name: String, keywords: List<String>): List<String> {
        var text = oracle.replace(Regex("\\s*\\([^)]*\\)"), "")
        // Autorreferencias → "~"
        val names = buildList {
            add(name)
            name.substringBefore(",").takeIf { it != name && it.length > 3 }?.let { add(it) }
            name.substringBefore(" ").takeIf { it != name && it.length > 4 }?.let { add(it) }
        }
        for (n in names) text = text.replace(n, "~")
        text = text.replace(
            Regex(
                "\\bthis (creature|artifact|enchantment|land|spell|card|equipment|vehicle|permanent|aura|saga|room|battle|scheme|plane|phenomenon|dungeon)\\b",
                RegexOption.IGNORE_CASE,
            ),
            "~",
        )
        val kw = keywords.map { it.lowercase() }
        val out = LinkedHashSet<String>()
        for (raw in text.split("\n")) {
            val line = raw.trim().lowercase()
            if (line.isEmpty() || isKeywordLine(line, kw)) continue
            interpretLine(line)?.let { out += it }
            if (out.size >= MAX_SENTENCES) break
        }
        return out.toList()
    }

    private fun isKeywordLine(line: String, kw: List<String>): Boolean {
        val parts = line.trimEnd('.').split(",", ";").map { it.trim() }.filter { it.isNotEmpty() }
        if (parts.isEmpty()) return true
        return parts.all { p -> kw.any { k -> p == k || p.startsWith("$k ") || p.startsWith("$k—") } }
    }

    // ---------------------------------------------------------------- líneas

    private fun interpretLine(line: String): String? {
        var body = line.replace(Regex("^[a-z' ]+ — "), "") // palabras de habilidad ("landfall — ")
        var prefix = ""

        // Habilidades de planeswalker: "+1: ...", "−3: ..."
        val loyalty = Regex("^([+−-]?)(\\d+|x): (.*)$").find(body)
        if (loyalty != null) {
            val sign = loyalty.groupValues[1]
            val n = loyalty.groupValues[2].toIntOrNull() ?: 0
            prefix = when {
                sign == "+" || n == 0 -> "Poder menor: "
                n >= 6 -> "Poder supremo: "
                else -> "Poder mayor: "
            }
            body = loyalty.groupValues[3]
        } else {
            val idx = body.indexOf(": ")
            if (idx > 0) {
                val cost = body.substring(0, idx)
                if (!cost.contains("when") && !cost.contains("\"") && looksLikeCost(cost)) {
                    prefix = activationPrefix(cost)
                    body = body.substring(idx + 2)
                }
            }
        }

        if (prefix.isEmpty()) {
            for ((re, phrase) in TRIGGERS) {
                val m = re.find(body) ?: continue
                prefix = phrase
                body = body.substring(m.range.last + 1)
                break
            }
        }

        val effects = findEffects(body)
        if (effects.isEmpty()) return null
        return capitalize(prefix + effects.joinToString(" y ")) + "."
    }

    private fun looksLikeCost(cost: String) =
        cost.contains("{") || cost.contains("sacrifice") || cost.contains("pay ") ||
            cost.contains("discard") || cost.contains("exile") || cost.contains("remove") || cost.contains("tap ")

    private fun activationPrefix(cost: String): String = when {
        cost.contains("sacrifice ~") -> "Sacrificándolo, "
        cost.contains("sacrifice") -> "Sacrificando a un aliado o recurso, "
        cost.contains("pay") && cost.contains("life") -> "A cambio de su propia sangre, "
        cost.contains("discard") -> "Renunciando a un recurso, "
        cost.contains("{t}") && Regex("\\{[0-9wubrgcx/]+\\}").containsMatchIn(cost) -> "Como acción y gastando energía, "
        cost.contains("{t}") -> "Como acción, "
        else -> "Gastando energía, "
    }

    private val TRIGGERS: List<Pair<Regex, String>> = listOf(
        "^when you set ~ in motion[^,]*, " to "Al desatarse, ",
        "^whenever you roll \\{chaos\\}[^,]*, " to "Cuando el caos se desata, ",
        "^when you planeswalk[^,]*, " to "Al llegar a este lugar, ",
        "^whenever (equipped|enchanted) creature deals (combat )?damage[^,]*, " to "Cada vez que su portador hiere, ",
        "^whenever (equipped|enchanted) creature attacks[^,]*, " to "Cada vez que su portador ataca, ",
        "^whenever (equipped|enchanted) creature dies[^,]*, " to "Cuando su portador cae, ",
        "^when(ever)? ~ enters[^,]*, " to "Al entrar en escena, ",
        "^when(ever)? ~ dies[^,]*, " to "Al caer, ",
        "^when(ever)? ~ (is put into a graveyard|leaves)[^,]*, " to "Al desaparecer, ",
        "^whenever ~ attacks( or blocks)?[^,]*, " to "Cada vez que ataca, ",
        "^whenever ~ blocks[^,]*, " to "Cada vez que defiende, ",
        "^whenever ~ deals (combat )?damage[^,]*, " to "Cada vez que hiere, ",
        "^whenever ~ becomes the target[^,]*, " to "Cuando es señalado por magia, ",
        "^whenever ~ becomes tapped[^,]*, " to "Cada vez que se usa, ",
        "^when(ever)? ~ is dealt damage[^,]*, " to "Cada vez que recibe daño, ",
        "^at the beginning of (your|each) upkeep[^,]*, " to "Al inicio de cada ronda, ",
        "^at the beginning of (your|each)( player's)? end step[^,]*, " to "Al final de cada ronda, ",
        "^at the beginning of (each )?combat[^,]*, " to "Al empezar cada combate, ",
        "^at the beginning of [^,]*, " to "Periódicamente, ",
        "^whenever (you|a player|an opponent) casts?[^,]*, " to "Cada vez que alguien usa magia cerca, ",
        "^whenever (a|another) [^,]*creature[^,]* dies[^,]*, " to "Cada vez que alguien cae cerca, ",
        "^whenever (a|another) [^,]*creature[^,]* enters[^,]*, " to "Cada vez que llega alguien nuevo, ",
        "^whenever (a|another) [^,]*land[^,]* enters[^,]*, " to "Cada vez que se descubre un lugar nuevo, ",
        "^whenever an opponent[^,]*, " to "Cada vez que un enemigo actúa, ",
        "^whenever you gain life[^,]*, " to "Cada vez que el grupo se cura, ",
        "^whenever you draw[^,]*, " to "Cada vez que tiene una revelación, ",
        "^whenever [^,]*attacks[^,]*, " to "Cada vez que se desata un ataque, ",
        "^when(ever)? [^,]*, " to "Cuando se cumple cierta condición, ",
        "^as long as [^,]*, " to "Mientras se cumpla cierta condición, ",
        "^if [^,]*, " to "Si se cumple cierta condición, ",
        "^until end of turn, " to "Durante la escena, ",
    ).map { (r, p) -> Regex(r) to p }

    // ---------------------------------------------------------------- efectos

    private fun findEffects(body: String): List<String> {
        val found = LinkedHashSet<String>()
        var work = body
        for (rule in EFFECTS) {
            val m = rule.first.find(work) ?: continue
            val effect = rule.second(m, body) ?: continue
            found += effect
            // Consumimos el texto reconocido para que otras reglas no lo repitan.
            work = work.replaceRange(m.range, " ".repeat(m.value.length))
            if (found.size >= 2) break
        }
        return found.toList()
    }

    private fun num(s: String): Int? = when (s) {
        "a", "an", "one" -> 1
        "two" -> 2
        "three" -> 3
        "four" -> 4
        "five" -> 5
        "six" -> 6
        "seven" -> 7
        else -> s.toIntOrNull()
    }

    private fun damageWord(s: String): String {
        val n = num(s) ?: return "variable"
        return when {
            n <= 1 -> "leve"
            n <= 3 -> "moderado"
            n <= 5 -> "grave"
            else -> "devastador"
        }
    }

    private fun healWord(s: String): String {
        val n = num(s) ?: return "según la situación"
        return when {
            n <= 2 -> "leves"
            n <= 4 -> "moderadas"
            else -> "graves"
        }
    }

    private fun target(t: String): String = when {
        t.contains("each creature and each") || t.contains("each creature") || t.contains("each other creature") -> "a todos los presentes"
        t.contains("each opponent") || t.contains("each player") -> "a todos sus enemigos"
        t.contains("any target") -> "a un objetivo"
        t.contains("attacking or blocking") -> "a un combatiente"
        t.contains("target player") || t.contains("target opponent") || t.contains("that player") -> "a un enemigo"
        t.contains("target creature") || t.contains("target planeswalker") -> "a una criatura"
        t.startsWith("you") -> "a su portador"
        t.contains("~") -> "a sí mismo"
        else -> "a un objetivo"
    }

    private fun allies(n: Int, kind: String?): String {
        val k = kind?.let { CardTransformer.subtypeEs(it) ?: it }?.lowercase()
        return when {
            n == 1 && k != null -> "invoca a un aliado ($k)"
            n == 1 -> "invoca a un aliado"
            k != null -> "invoca a $n aliados ($k)"
            else -> "invoca a varios aliados"
        }
    }

    private fun keywordList(s: String): String? {
        val parts = s.replace(" and ", ", ").split(",").map { it.trim().trimEnd('.') }.filter { it.isNotEmpty() }
        val known = parts.mapNotNull { p ->
            val t = CardTransformer.translateKeyword(p)
            if (t != p) t else null
        }
        return known.takeIf { it.isNotEmpty() }?.joinToString(", ")
    }

    private val SUBJECTS = listOf(
        "equipped creature" to "a quien lo porta",
        "enchanted creature" to "a quien está bajo el hechizo",
        "creatures you control" to "a todos sus aliados",
        "other creatures you control" to "a todos sus aliados",
        "target creature you control" to "a un aliado",
        "target creature" to "a una criatura",
        "all creatures" to "a todos los presentes",
        "creatures your opponents control" to "a todos sus enemigos",
        "~" to "a sí mismo",
    )

    private fun subjectOf(s: String): String =
        SUBJECTS.firstOrNull { s.trim().endsWith(it.first) }?.second ?: "a un objetivo"

    private val EFFECTS: List<Pair<Regex, (MatchResult, String) -> String?>> = listOf(
        // Daño
        Regex("deals? (\\d+|x|that much) damage to ([^.]+?)(?= and |\\.|$)") to { m, _ ->
            "inflige daño ${damageWord(m.groupValues[1])} ${target(m.groupValues[2])}"
        },
        Regex("deals? damage equal to [^.]*? to ([^.]+?)(?= and |\\.|$)") to { m, _ ->
            "inflige daño proporcional a su fuerza ${target(m.groupValues[1])}"
        },
        // Destrucción
        Regex("destroy all ([a-z ]+)") to { m, _ ->
            val w = m.groupValues[1]
            when {
                w.startsWith("creature") -> "arrasa con todas las criaturas de la escena"
                w.startsWith("artifact") -> "destruye todos los objetos de la escena"
                w.startsWith("enchantment") -> "rompe todos los hechizos y maldiciones activos"
                w.startsWith("land") -> "devasta el lugar por completo"
                else -> "arrasa con todo lo que hay en la escena"
            }
        },
        Regex("destroy (up to \\w+ )?(another )?target ([^.]+)") to { m, _ ->
            val w = m.groupValues[3]
            when {
                w.startsWith("artifact or enchantment") -> "destruye un objeto o rompe un hechizo"
                w.contains("creature") -> "elimina a una criatura"
                w.startsWith("artifact") -> "destruye un objeto"
                w.startsWith("enchantment") -> "rompe un hechizo o maldición"
                w.startsWith("land") -> "arruina un lugar"
                w.startsWith("planeswalker") -> "derriba a un héroe poderoso"
                else -> "destruye un objetivo"
            }
        },
        // Destierro
        Regex("exile (all|each) ") to { _, b ->
            if (b.contains("graveyard")) "borra los restos de todos los caídos" else "destierra a todos a otro plano"
        },
        Regex("exile (up to \\w+ )?(another )?target ") to { _, b ->
            if (b.contains("from a graveyard") || b.contains("from your graveyard")) "borra los restos de un caído"
            else "destierra a un objetivo a otro plano"
        },
        // Retorno
        Regex("return [^.]*from (your|a|their owner's|its owner's) graveyard to the battlefield") to { _, _ ->
            "resucita a un aliado caído"
        },
        Regex("return [^.]*from your graveyard to your hand") to { _, _ -> "recupera algo que se había perdido" },
        Regex("return (all|each) [^.]*to (its|their) owners?'?s? hands?") to { _, _ -> "expulsa a todos de la escena por un tiempo" },
        Regex("return (up to \\w+ )?(another )?target [^.]*to (its|their) owners?'?s? hands?") to { _, _ ->
            "hace retroceder a un objetivo, que deberá volver a entrar en escena"
        },
        // Anulación
        Regex("counter target ([a-z ]*)spell") to { _, _ -> "anula un hechizo enemigo" },
        Regex("counter target (activated|triggered|ability)") to { _, _ -> "anula una habilidad" },
        Regex("can't be countered") to { _, _ -> "no puede ser anulado" },
        // Conocimiento
        Regex("draws? (a|an|one|two|three|four|five|x|\\d+) cards?") to { m, _ ->
            val n = num(m.groupValues[1])
            when {
                n == null -> "concede tantos momentos de inspiración como sea necesario"
                n == 1 -> "concede una pista o un momento de inspiración"
                else -> "concede $n pistas o momentos de inspiración"
            }
        },
        Regex("(target player|target opponent|each opponent|each player) discards?") to { _, _ ->
            "hace que el enemigo olvide algo o pierda un recurso"
        },
        Regex("search (your|their) library for [^.]*land") to { _, _ -> "descubre un camino o un refugio" },
        Regex("search (your|their) library for") to { _, _ -> "encuentra justo lo que se necesita" },
        Regex("\\b(scry|surveil) (\\d+|x)") to { _, _ -> "permite ver el futuro cercano" },
        Regex("(look at|reveals?) the top") to { _, _ -> "revela lo que está por venir" },
        Regex("\\bmills?\\b|top [^.]*into (your|their|his or her) graveyard") to { _, _ -> "borra recuerdos" },
        // Vida
        Regex("gains? (\\d+|x) life") to { m, _ -> "cura heridas ${healWord(m.groupValues[1])}" },
        Regex("gains? life equal") to { _, _ -> "cura heridas" },
        Regex("loses? (\\d+|x) life") to { m, b ->
            val who = if (b.contains("each opponent")) " a todos sus enemigos" else ""
            "drena la vitalidad$who"
        },
        // Fichas
        Regex("create (a|an|one|two|three|four|five|x|\\d+) [^.]*?treasure") to { _, _ -> "genera riquezas (tesoro)" },
        Regex("create (a|an|one|two|three|four|five|x|\\d+) [^.]*?food") to { _, _ -> "genera provisiones" },
        Regex("create (a|an|one|two|three|four|five|x|\\d+) [^.]*?clue") to { _, _ -> "revela una pista" },
        Regex("create (a|an|one|two|three|four|five|x|\\d+) [^.]*?(\\w+) (?:artifact )?(?:enchantment )?creature tokens?") to { m, _ ->
            val kind = m.groupValues[2].takeIf { it !in setOf("colorless", "white", "blue", "black", "red", "green", "legendary") }
            allies(num(m.groupValues[1]) ?: 2, kind)
        },
        Regex("create [^.]*tokens?") to { _, _ -> "crea algo útil de la nada" },
        // Potenciadores
        Regex("([a-z~ ]+?) gets? \\+([1-9]\\d*|x)/\\+([1-9]\\d*|x)") to { m, _ ->
            val s = subjectOf(m.groupValues[1])
            if (s == "a sí mismo") "se fortalece" else "fortalece $s"
        },
        Regex("([a-z~ ]+?) gets? \\+(\\d+|x)/[+-]0") to { m, _ ->
            val s = subjectOf(m.groupValues[1])
            if (s == "a sí mismo") "golpea con más fuerza" else "aumenta el poder ofensivo de ${s.removePrefix("a ")}"
        },
        Regex("([a-z~ ]+?) gets? [+-]0/\\+([1-9]\\d*|x)") to { m, _ ->
            val s = subjectOf(m.groupValues[1])
            if (s == "a sí mismo") "se vuelve más resistente" else "protege $s"
        },
        Regex("([a-z~ ]+?) gets? -(\\d+|x)/-(\\d+|x)") to { m, _ ->
            val s = subjectOf(m.groupValues[1])
            "debilita ${if (s == "a sí mismo") "a un objetivo" else s}"
        },
        Regex("(equipped creature|enchanted creature|creatures you control|other creatures you control|target creature|~) (?:has|have|gains?) ([a-z ,]+)") to { m, _ ->
            keywordList(m.groupValues[2])?.let { k ->
                val s = subjectOf(m.groupValues[1])
                if (s == "a sí mismo") "obtiene: $k" else "otorga $s: $k"
            }
        },
        Regex("(\\+1/\\+1|[a-z]+) counters? on") to { m, _ ->
            if (m.groupValues[1] == "+1/+1") "otorga fuerza permanente" else null
        },
        Regex("-1/-1 counters? on") to { _, _ -> "marchita de forma permanente" },
        // Control
        Regex("can't attack or block") to { _, _ -> "impide que un objetivo ataque o se defienda" },
        Regex("can't block") to { _, _ -> "impide que un objetivo se defienda" },
        Regex("can't attack") to { _, _ -> "impide que un objetivo ataque" },
        Regex("can't be blocked") to { _, _ -> "es imposible de detener" },
        Regex("doesn't untap") to { _, _ -> "deja paralizado a un objetivo durante mucho tiempo" },
        Regex("\\buntap (target|all|each|up to)") to { _, _ -> "renueva las fuerzas de un aliado" },
        Regex("\\btap (target|all|each|up to)") to { _, _ -> "paraliza a un objetivo" },
        Regex("gain control of") to { _, _ -> "domina la voluntad de un objetivo" },
        Regex("\\bfights?\\b") to { _, _ -> "se enfrenta en combate singular a una criatura" },
        Regex("(each player|each opponent|target player|target opponent) sacrifices") to { _, _ ->
            "obliga al enemigo a sacrificar algo valioso"
        },
        Regex("prevent (all|the next)") to { _, _ -> "protege del daño" },
        Regex("copy (target|it|that)") to { _, _ -> "duplica un hechizo o efecto" },
        Regex("\\btransform") to { _, _ -> "puede transformarse en otra forma" },
        Regex("flip a coin|roll a d") to { _, _ -> "deja el resultado en manos del azar" },
        Regex("win the game") to { _, _ -> "otorga la victoria absoluta" },
        Regex("lose the game") to { _, _ -> "condena a la derrota" },
        Regex("extra turn") to { _, _ -> "concede una ronda adicional" },
        Regex("cost[s]? [^.]*less") to { _, _ -> "facilita el uso de la magia" },
        Regex("cost[s]? [^.]*more") to { _, _ -> "dificulta el uso de la magia" },
        Regex("\\badd (\\{|one mana|two mana|three mana|x mana|an amount)") to { _, _ -> "proporciona energía mágica" },
        Regex("\\bskip") to { _, _ -> "hace perder una oportunidad" },
        Regex("(players|your opponents|each opponent) can't") to { _, _ -> "impone una restricción a sus enemigos" },
        Regex("shuffle [^.]*into") to { _, _ -> "devuelve algo al ciclo del destino" },
    )

    // ---------------------------------------------------------------- respaldo

    private fun fallback(category: Category, card: MtgCard): String = when (category) {
        Category.MONSTER, Category.MOUNT ->
            if (card.power != null) "Una criatura que confía en la fuerza bruta: sin trucos, solo garras, dientes y determinación."
            else "Una presencia extraña cuyo poder se manifiesta como el narrador decida."
        Category.NPC -> "Una figura de renombre. Su influencia vale más que su espada."
        Category.DEITY -> "Un poder divino que exige devoción a cambio de su favor."
        Category.HERO -> "Un ser capaz de viajar entre mundos y alterar el destino."
        Category.LOCATION -> "Un lugar con historia propia; quien lo domina obtiene recursos y refugio."
        Category.ITEM, Category.EQUIPMENT -> "Un objeto de poder cuyos secretos aún están por descubrir."
        Category.SPELL -> "Un conjuro de efecto sutil; el narrador decide cómo se manifiesta."
        Category.ENCHANTMENT -> "Un efecto mágico persistente que altera la escena mientras dure."
        Category.TRAP -> "Un peligro oculto que se activa cuando menos se espera."
        Category.EVENT -> "Un acontecimiento que cambia las reglas de la escena mientras dura."
        Category.RANDOM -> "Un misterio por descubrir."
    }

    private fun capitalize(s: String) = s.replaceFirstChar { it.uppercase() }
}
