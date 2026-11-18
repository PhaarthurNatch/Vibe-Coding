package com.vibecoding.cartasrpg

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
