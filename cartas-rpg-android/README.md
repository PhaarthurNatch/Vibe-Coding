# Forja de Cartas RPG (Android)

App Android que toma cartas de **Magic: The Gathering** desde la API de
[Scryfall](https://scryfall.com) y las convierte en **cartas de rol de sistema
agnóstico**, en **tamaño póker** (63 × 88 mm, PNG de 750 × 1050 px a 300 ppp,
listas para imprimir).

## Cómo se usa
1. Pulsa **🎲 Carta aleatoria** o una categoría.
2. La carta aparece al momento. Tócala para generar otra de la misma categoría.
3. **💾 Guardar** la deja en `Imágenes/CartasRPG`; **📤 Compartir** la envía a
   otra app; **🔗 Scryfall** abre la carta original.
4. Activa *Preferir nombres en español* para usar el nombre impreso en español
   cuando exista.

## Categorías
| Botón | Qué busca en Scryfall |
|---|---|
| 🐉 Monstruos | criaturas no legendarias |
| 🧙 Personajes | criaturas legendarias (PNJ) |
| 💎 Objetos | artefactos que no son criaturas, equipo ni vehículos |
| ⚔️ Armas y equipo | equipamiento |
| 🏰 Lugares | tierras no básicas, planos, mazmorras y estancias |
| ✨ Hechizos | instantáneos y conjuros |
| 🔮 Bendiciones y maldiciones | encantamientos (auras, maldiciones…) |
| 🪤 Trampas | cartas con subtipo o nombre "Trap" |
| 📜 Eventos y tramas | planes (Archenemy), fenómenos, sagas y batallas |
| ☀️ Deidades | dioses |
| 👑 Héroes y archienemigos | planeswalkers |
| 🐎 Monturas y vehículos | vehículos y monturas |

En modo aleatorio la categoría se deduce automáticamente del tipo de la carta.

## Cómo se "agnostiza" la carta
- **Nivel (1–5 rombos)** según coste de maná y rareza, con nombre propio por
  categoría (Amenaza, Valor, Peligro, Círculo…).
- **Fuerza / resistencia** → *Ofensiva* y *Aguante* en escala verbal
  (Débil, Media, Fuerte, Temible, Colosal) con el número como referencia.
- **Colores** → *Afinidad*: Luz, Mente, Sombra, Fuego, Naturaleza, Artificio…
- **Descripción generada**: la app lee lo que hace la carta en Magic y lo
  reescribe como efectos de rol genéricos en español. Por ejemplo, "deals 3 damage
  to any target" se convierte en *Inflige daño moderado a un objetivo*, y "Create two
  1/1 Soldier tokens" en *Invoca a 2 aliados (soldado)*. Los disparadores pasan
  a *Al entrar en escena…*, *Cada vez que ataca…*, y los costes a *Como acción…*,
  *Sacrificándolo…*.
- **Habilidades clave** explicadas (Vuela, Toque letal, Arrollador…).
- **No se muestra el texto original** de la carta (ni reglas ni ambientación).
- Un **gancho de aventura** generado.
- Créditos del ilustrador y de la edición en el pie.

## Descargar / compilar el APK
- **GitHub Actions**: cada push que toque `cartas-rpg-android/` compila el APK
  (workflow *Android APK*). Descárgalo desde la pestaña *Actions* → última
  ejecución → artefacto `forja-de-cartas-rpg-apk`. Descomprime el zip e instala
  el `.apk` en el móvil (permite "instalar apps de origen desconocido").
- **Android Studio**: abre la carpeta `cartas-rpg-android` y pulsa *Run*.
- **Línea de comandos** (con Android SDK): `./gradlew assembleRelease`.

Requiere Android 10 (API 29) o superior y conexión a internet.

## Aviso legal
Datos e imágenes de Scryfall. Magic: The Gathering y sus ilustraciones son
propiedad de Wizards of the Coast y de sus artistas. Proyecto de fans no
oficial, sin afiliación con Wizards of the Coast ni Scryfall, para uso personal
y no comercial, conforme a la Fan Content Policy de Wizards.
