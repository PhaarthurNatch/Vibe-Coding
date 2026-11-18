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

## Basado en guías de la comunidad
La conversión se apoya en las ideas que más se repiten en las guías para usar
cartas de Magic en partidas de rol, adaptadas para que valgan en cualquier sistema:
- **"¿Qué hace la carta?"**: describir el efecto de forma sencilla y no copiar
  las reglas (guías de conversión de hechizos, mentalidad de conversión de ICRPG).
- **El coste de maná como base de la dificultad**, ajustado por fuerza y resistencia,
  ya que la media de ambas estima bien el coste. Volar suma medio punto y ser legendario, uno más.
- **Rol táctico** según fuerza y resistencia: Atacante, Tanque, Hostigador,
  Guardián, Líder, Esbirro…
- **El círculo de colores como filosofía**: cada color da una motivación y unos
  enemigos naturales (Luz ↔ Sombra y Fuego, Mente ↔ Fuego y Naturaleza…).
- **Equipo y artefactos como objetos mágicos** para entregar al grupo, con su
  forma de uso (se porta, un solo uso, una vez por ronda…).
- **Generar aventuras sacando 5 cartas** e improvisar conexiones (método de
  r/rpg difundido por The Alexandrian).
- **Preparar un lote de cartas** para varias sesiones e imprimirlo en hojas.

## Funciones extra
- 🗺️ **Aventura**: amenaza + escenario + botín + complicación + aliado, con una
  carta resumen que incluye la premisa y un giro.
- ◀ ▶ **Historial** de las últimas 15 cartas.
- 🖨️ **Hoja A4** con las últimas 9 cartas en cuadrícula 3×3 con marcas de corte,
  a 300 ppp. Imprímela al 100 %.

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
