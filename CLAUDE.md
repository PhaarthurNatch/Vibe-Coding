# Vibe-Coding

Repositorio personal de juegos/prototipos. El proyecto activo es **Monster Brawl** (`monster-brawl/`).
Los archivos `monster-game (3).jsx` y `monster-game (4).jsx` de la raíz son intentos anteriores del dueño: **no tocarlos**.

**Idioma:** el dueño escribe en español (a veces con errores de tipeo). Responder siempre en español, y toda la UI del juego va en español.

---

## Monster Brawl — qué es

Juego para celular (Android/iPhone) de monstruos generados al azar que **pelean solos** (auto-battler, estilo "cría y pelea").
El jugador cría, entrena y moldea la personalidad de sus monstruos; los combates son automáticos.

- Todo el juego está en **un solo archivo**: `monster-brawl/index.html` (HTML + CSS + JS en canvas, sin dependencias ni build).
- `monster-brawl/README.md`: resumen de funcionalidades para personas.
- Pensado para empaquetarse después como app con Capacitor (pendiente).
- Página publicada (Artifact privado del dueño) para probar en el celular: **https://claude.ai/artifact/5PSe9xvkZVHRRoQdiyMWBs**
  Hay que actualizar **ese mismo link**, no crear uno nuevo (ver "Publicar").

## Cómo trabajar en este proyecto

1. Editar `monster-brawl/index.html`.
2. Probar en un navegador headless con Playwright (Chromium ya viene instalado en el entorno; `require('playwright')` funciona).
   - Prueba rápida: `node monster-brawl/tools/smoke.js` (abre el juego como iPhone 13, hace nacer un huevo y juega una pelea; debe terminar con `no errors`).
   - Para equilibrio: escribir simulaciones con `page.evaluate` usando las clases del juego directamente (ejemplo abajo).
   - Las capturas de pantalla y scripts temporales van en el scratchpad, **nunca en el repo**.
3. Commit + push a la rama de trabajo. Mensajes de commit en inglés; terminar con las líneas de atribución que pida el entorno.
4. Publicar al Artifact (ver abajo) y explicar los cambios al dueño en español, sin tecnicismos innecesarios.

### Publicar (actualizar el link existente)

El Artifact no acepta `<!doctype>`, `<html>`, `<head>` ni `<body>` (la plataforma los agrega). Generar la copia así:

```bash
python3 monster-brawl/tools/build_artifact.py <ruta-de-salida>.html
```

y publicar ese archivo con la herramienta Artifact pasando `url: https://claude.ai/artifact/5PSe9xvkZVHRRoQdiyMWBs`
(en una sesión nueva primero hay que leerlo con `action: "read"`). En el Artifact **no funcionan** `alert/confirm/prompt`:
por eso el juego usa su propio diálogo `ask()`.

### Ejemplo de simulación (equilibrio)

```js
// dentro de page.evaluate(...) con el juego cargado
ARENA_W = 600; ARENA_D = 900;
const rec = { seed: (Math.random() * 4e9) >>> 0, level: 10, stage: 'adult', gen: 3, pts: randomPts(10),
              temper: { agr: 0, terco: 0, valor: 0 }, ultMode: 'save', ult: 'melee' };
const A = new Monster(rec); A.team = 0;
const E = makeFoe(rec); E.team = 1;
const B = new Battle(Math.random() < 0.5 ? [A, E] : [E, A], '1v1');   // alternar el orden: el primero en la lista actúa primero
let s = 0; while (!B.over && s < 60 * 150) { B.step(1 / 60); s++; }
const ganó = B.winTeam === 0;
```
Usar 50–150 peleas por caso: con menos, el azar mueve los resultados ±7 puntos.
Para dibujar galerías en el canvas, primero desactivar el loop: `window.requestAnimationFrame = () => 0`.

---

## Estructura de `index.html` (por secciones)

| Parte | Qué hay |
|---|---|
| Constantes al inicio | Arena (`ARENA_W/D`, `DEPTH`, `TOP`), ultimates (`ULTS`, `ULT_*`, `SHIELD_MUL`, `ultPow`), muerte súbita (`OT_*`), odio (`HATE_*`), miedo (`SCARED_HP`) |
| Genoma | `rng` con semilla, `genGenome(seed, stage, legacy, v3)` → `baseGenome` → `rollGenome`/`growFrom` (crecer conserva partes), `applyVariety` (partes/colores extra, sólo gen 3), `STAGE_LIM` (qué partes permite cada etapa) |
| Stats | `calcStats(g, level, pts)`, puntos `PTS` (Poder/Aguante/Agilidad/Técnica), `bodyFromTraining` (cambio visual), personalidad `TEMPER`, `DRILLS`, `ULT_MODES` |
| `class Monster` | Esqueleto de nodos con resortes (partes "floaty"), `animate`, `rigStep`, IA en `think` (objetivo, eje de lock-in, ataques, esquiva, ultimate), dibujo de cada parte, expresiones (`face`, `setEmo`), aura |
| `class Battle` | Paso de simulación, golpes (`hit`), proyectiles, ultimates (`startUlt` → cinemática → `execUlt`), muerte súbita, ranking final |
| Guardado | `SAVE_KEY = 'monster_brawl_v1'` en localStorage, `newRec`, `loadSave` (incluye migraciones), `persist` |
| UI | Menú con 2 páginas deslizables (Monstruo / Entrenar), huevo (`EggView`), gestos (tocar = sacudir, deslizar = acariciar, mantener = tomar/lanzar), selector de equipo 2v2, combate, resultado, animación de crecimiento (`checkGrowth`/`growStep`) |

## Reglas y decisiones de diseño vigentes (no revertir sin que el dueño lo pida)

- **Etapas:** Huevo → Bebé (Nv 1–2) → Niño (3–4) → Adolescente (5–7) → Adulto (8–11) → Awakened (12+) (`STAGE_LV`).
  Al crecer conserva todas sus partes (agrandadas) y se sortean partes nuevas; las cantidades sólo suben.
  **Crece recién al volver al menú**, con animación a pantalla completa; si debe crecer varias etapas, todas van en la misma animación.
  "Otra pelea" sigue usando la etapa actual.
- **Huevo:** se toca varias veces para que nazca y luego se le pone nombre.
- **Rivales:** siempre de la **misma etapa** que tu monstruo (se probó mezclar etapas y el dueño lo pidió quitar). Nivel ±1, puntos y personalidad al azar.
- **Combate:** automático, velocidad fija x1.5, sin botón de velocidad. Datos de los peleadores arriba de la arena; **sin barras de vida sobre las cabezas** (sólo una ★ sobre los monstruos del jugador). Sin indicador de objetivo. Al esquivar no aparece texto.
  Desde los 60 s de juego hay **muerte súbita** (el daño sube); antes había un corte a los 90 s que mostraba "Victoria" con enemigos vivos: no volver a eso.
  La pantalla se mantiene encendida durante los combates (Wake Lock).
- **IA:** objetivo = el más cercano; el daño recibido se acumula como odio y pasado un umbral va por quien más le pega ("¡grr!"). Esquivar = salto lateral real.
- **Vidas:** 3 corazones; pierde 1 si lo noquean; recupera 1 cada 5 min; sin vidas descansa 10 min o se cura con 30 monedas.
- **Premios:** XP y monedas según el puesto + bonus por K.O. (`REWARDS`).
- **Entrenamiento por puntos:** 2 puntos por nivel en Poder/Aguante/Agilidad/Técnica (máx. 20 c/u), reiniciar cuesta 50. El cuerpo cambia con los puntos.
  En el menú sólo se muestran esos 4 stats y la personalidad: **no hay "Ver detalle"** con vida/fuerza/peso/esquiva, etc. (el dueño lo pidió quitar).
- **Personalidad** (3 ejes de −1 a 1): Agresivo↔Cauto, Terco↔Oportunista, Valiente↔Prudente. Cambia **sólo** con ejercicios (15 monedas, bloqueados si el eje ya está al máximo) y según cómo pelea.
  **Acariciar o lanzar NO cambia la personalidad** (decisión del dueño). Acariciar lo deja feliz 1 minuto en el menú. Perder un corazón (que lo noqueen, aunque su equipo gane) lo deja triste 1 minuto (`sadUntil`); acariciarlo le quita esa tristeza. Con 1 corazón o menos queda **machacado** (no triste): cara cansada, curitas en la cabeza y ojo morado (`battered`, sólo en el menú).
- **Ultimate (Awakened):** equipable y cambiable desde Entrenar. Al despertar trae una de regalo (`starterUlt`); las demás se desbloquean por 150 monedas
  y quedan en la biblioteca de la cuenta (`save.ults`) para todos los monstruos. **No depende del stat más alto.**
  Una por pelea, se recarga al empezar cada pelea (no hay recarga con monedas). Antes de lanzarla carga 1,3 s y hay acercamiento de cámara.
  Al usarla: +30% a todo por 10 s. El aura de partículas (pequeñas) sólo aparece con la ultimate cargada.
  El jugador elige cuándo la usa: apenas pueda / como remate / para salvarse.
- **Variedad (gen 3):** monstruos nuevos tienen partes y paletas extra (orejas, antenas, bocas, pinzas, tentáculos, etc.).
  Los monstruos antiguos (gen 2 / `legacy`) **deben verse exactamente igual**: `applyVariety` usa un flujo de azar aparte y sólo se aplica con `v3`.

## Compatibilidad de partidas guardadas

`loadSave` migra datos viejos: completa `stage`, `lives`, `pts`, `temper`, `ultMode`; marca adultos antiguos como `legacy`; devuelve las monedas del
entrenamiento anterior (`train`) con un aviso único (`save.notice`); asigna la ultimate que ya tenían los Awakened antiguos.
**Cualquier cambio de formato debe agregar su migración ahí** para no romper partidas existentes.

## Equilibrio (último estado medido)

- Misma etapa: ~46–60% de victorias para tu monstruo (lo esperado es 50%).
- Estilos de personalidad: todos ganan parecido; cambian la forma de pelear (distancia, cambios de objetivo, comportamiento con poca vida).
- Ultimates: 44–54% en 1v1 y 24–34% en todos contra todos (esperado 25%). Las de daño usan el ataque más fuerte (`ultPow`).

## Ideas pendientes / posibles siguientes pasos

- Empaquetar con Capacitor para Android/iOS (y Wake Lock nativo).
- Cría: cruzar dos monstruos para que el hijo herede partes.
- Más ultimates (la biblioteca ya está pensada para crecer: agregar a `ULTS` + `ULT_KEYS` + su efecto en `execUlt`).
- Sonido.
- Si se quiere que la ultimate pese más: subir `ULT_ALL_MUL` o el daño de las ultimates de daño.
