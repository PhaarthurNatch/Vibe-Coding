# Vibe-Coding

Repositorio personal de juegos/prototipos. El proyecto activo es **Monster Brawl** (`monster-brawl/`).
Los archivos `monster-game (3).jsx` y `monster-game (4).jsx` de la raíz son intentos anteriores del dueño: **no tocarlos**.

**Idioma:** el dueño escribe en español (a veces con errores de tipeo). Responder siempre en español, y toda la UI del juego va en español.
**Respuestas breves:** al terminar un cambio, decir sólo qué se hizo, en pocas líneas (sin detallar pruebas, tablas ni el proceso), salvo que el dueño pida más detalle.

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
| Constantes al inicio | Arena (`ARENA_W/D`, `DEPTH`, `TOP`), ultimates (`ULTS`, `ULT_*`, `SHIELD_MUL`, `ultPow`), muerte súbita (`OT_*`), elección de objetivo (`TGT_*`, pesos `TGT_W`), miedo (`SCARED_HP`) |
| Genoma | `rng` con semilla, `genGenome(seed, stage, legacy, v3)` → `baseGenome` → `rollGenome`/`growFrom` (crecer conserva partes), `applyVariety` (partes/colores extra, sólo gen 3), `STAGE_LIM` (qué partes permite cada etapa) |
| Stats | `calcStats(g, level, pts)`, puntos `PTS` (Poder/Aguante/Agilidad/Técnica), `bodyFromTraining` (cambio visual), personalidad `TEMPER`, `DRILLS`, `ULT_MODES` |
| `class Monster` | Esqueleto de nodos con resortes (partes "floaty"), `animate`, `rigStep`, IA en `think` (objetivo, eje de lock-in, ataques, esquiva, ultimate), dibujo de cada parte, expresiones (`face`, `setEmo`), aura |
| `class Battle` | Paso de simulación, golpes (`hit`), proyectiles, ultimates (`startUlt` → cinemática → `execUlt`), muerte súbita, ranking final |
| Guardado | `SAVE_KEY = 'monster_brawl_v1'` en localStorage, `newRec`, `loadSave` (incluye migraciones), `persist` |
| UI | Menú con 4 páginas deslizables (`homePage` 0–3): Tienda (izquierda: huevo por adoptar y ultimates, `renderShopUlts`; `adoptRec`/`adoptEgg`, `renderAdopt`; se puede tocar para que bambolee o mantener para tomarlo y lanzarlo, `EggView.homeStep`) / Home (el monstruo, `homePage` 1, página inicial) / Entrenar / Criadero (derecha del todo, `renderBreed`), huevo (`EggView`), gestos (tocar = sacudir, deslizar = acariciar, mantener = tomar/lanzar; en el Home deslizar arriba/abajo cambia de monstruo (`switchMonster`; arriba = siguiente; **no hay flechas**, el dueño las quitó); la pestaña Entrenar brilla dorada si el monstruo tiene puntos por gastar; deslizar a los lados en cualquier parte cambia de página: sobre el monstruo sólo un trazo largo y rápido, y un deslizamiento no aprieta botones), selector de equipo 2v2, combate, resultado, animación de crecimiento (`checkGrowth`/`growStep`) |

## Reglas y decisiones de diseño vigentes (no revertir sin que el dueño lo pida)

- **Etapas:** Huevo → Bebé (Nv 1–2) → Niño (3–4) → Adolescente (5–7) → Adulto (8–11) → Awakened (12+) (`STAGE_LV`).
  Al crecer conserva todas sus partes (agrandadas) y se sortean partes nuevas; las cantidades sólo suben.
  **Crece recién al volver al menú**, con animación a pantalla completa; si debe crecer varias etapas, todas van en la misma animación.
  "Otra pelea" sigue usando la etapa actual.
- **Huevo:** se compra en la Tienda (página izquierda) por 60 monedas (`EGG_COST`; el primero de una partida nueva es gratis) y **se abre ahí mismo** (tocándolo varias veces; mientras tanto no se puede salir de Adoptar, `adoptLocked`); al nacer pasa al Home y se le pone nombre. La adopción en curso se guarda en `save.adopting`. Una partida nueva empieza así (sin monstruos, en Adoptar). Los huevos que ya estaban en la lista de partidas antiguas siguen naciendo en el Home.
- **Criadero** (4.ª página): cruza **dos Awakened** por 150 monedas (`BREED_COST`). Los padres quedan **durmiendo 30 min** (`napUntil`, `napping`; no pelean, sin botón de curar)
  y el huevo **incuba 1 hora** (`save.breeding = {rec, readyAt}`) antes de poder abrirlo a toques en el nido; al nacer pasa al Home. Un huevo a la vez.
  Herencia (`makeChild`, `recGenome`): cada grupo de partes de `GENE_GROUPS` sale al azar de uno de los padres (10% muta = sale de su propia semilla);
  `rec.genes[grupo]` guarda el monstruo *origen* `{seed, legacy, v3}` (plano, sirve para nietos). Personalidad = promedio ± azar; al despertar trae la ultimate de un padre (`ultGift`).
  Home muestra "Hijo de X y Y · Gen. N" (`parents`, `lineage`). Todos los campos son opcionales: no hace falta migración.
- **Rivales:** siempre de la **misma etapa** que tu monstruo (se probó mezclar etapas y el dueño lo pidió quitar). Nivel ±1, puntos y personalidad al azar.
- **Combate:** automático, velocidad fija x1.5, sin botón de velocidad. Empieza con cuenta regresiva 3, 2, 1 y "FIGHT!" estilo arcade (`INTRO_*`, `drawIntro`; sólo en `startBattle`, las simulaciones no la tienen). Datos de los peleadores arriba de la arena; **sin barras de vida sobre las cabezas** (sólo una ★ sobre los monstruos del jugador). Sin indicador de objetivo. Al esquivar no aparece texto.
  Desde los 60 s de juego hay **muerte súbita** (el daño sube); antes había un corte a los 90 s que mostraba "Victoria" con enemigos vivos: no volver a eso.
  La pantalla se mantiene encendida durante los combates (Wake Lock).
- **IA — objetivo** (`Monster.scoreTarget`): cada 0,5 s puntúa a cada enemigo con factores de 0 a 1 (misma escala en todas las etapas):
  cercanía (tiempo en alcanzarlo según golpe/disparo), amenaza (daño de los últimos ~4 s), rencor (daño de toda la pelea), si lo ataca a él,
  vulnerable (poca vida / lo remata), distraído (pelea con otro), equipo en 2v2 (mismo objetivo que el compañero, peso bajo a propósito:
  con más peso se juntaban 97% del tiempo y perjudicaba a los Cautos), amontonamiento en todos contra todos, escudo activo y peligro (DPS relativo).
  La personalidad cambia los pesos: Agresivo = cercanía; Cauto = evita al peligroso; Terco = rencor y no suelta (pide más margen para cambiar);
  Oportunista = vulnerable/distraído; Valiente = va por el más peligroso; Prudente = lo evita. Sólo cambia si el nuevo es claramente mejor (`TGT_MARGIN`)
  y tras un mínimo con el actual (`TGT_COMMIT`). Avisos: "¡grr!" (cambió por rabia) y "¡ahora!" (por oportunidad). Esquivar = salto lateral real.
- **Cadenas de golpes** (`STUN`): si te interrumpen el golpe, la espera baja a 0,25 s; tras 2 aturdimientos seguidos queda 0,6 s sin aturdirse;
  el más pesado se aturde un poco menos (`poise`) y el más liviano pega más fuerte al más pesado (`light`, compensa que perdió las cadenas).
  Racha máxima bajó de ~18–25 golpes seguidos a ~13. Livianos ~45% / pesados ~54% en 1v1 (antes 47/51). `KITE.ffaFire` subió a 2,0 para que el Cauto no volviera a dominar todos contra todos.
- **Vidas:** 3 corazones; pierde 1 si lo noquean; recupera 1 cada 5 min; sin vidas descansa 10 min o se cura con monedas según la etapa (`HEAL_COST`: bebé 20 … Awakened 60).
- **Premios** (`REWARDS`, [XP, monedas] por modo y puesto) + K.O. (+10 XP, +5 monedas): 1v1 60/25 · 20/10; 2v2 45/15 · 15/5 (menos porque cada monstruo tuyo cobra el suyo); todos contra todos 80/40 · 50/25 · 30/15 · 15/5.
  El Criadero (150) es el gasto de monedas para el juego avanzado.
- **Entrenamiento por puntos:** 2 puntos por nivel en Poder/Aguante/Agilidad/Técnica (máx. 20 c/u), reiniciar cuesta 50. El cuerpo cambia con los puntos.
  En el menú sólo se muestran esos 4 stats y la personalidad: **no hay "Ver detalle"** con vida/fuerza/peso/esquiva, etc. (el dueño lo pidió quitar).
- **Personalidad** (3 ejes de −1 a 1): Agresivo↔Cauto, Terco↔Oportunista, Valiente↔Prudente. Cambia **sólo** con ejercicios (15 monedas, bloqueados si el eje ya está al máximo) y según cómo pelea.
  **Acariciar o lanzar NO cambia la personalidad** (decisión del dueño). Acariciar lo deja feliz 1 minuto en el menú. Perder un corazón (que lo noqueen, aunque su equipo gane) lo deja triste 1 minuto (`sadUntil`); acariciarlo le quita esa tristeza. Con 1 corazón o menos queda **machacado** (no triste): cara cansada, curitas en la cabeza y ojo morado (`battered`, sólo en el menú).
- **Ultimate (Awakened):** equipable y cambiable desde Entrenar (ahí **sólo** aparecen las desbloqueadas). Al despertar trae una de regalo (`starterUlt`); las demás se **compran en la Tienda** por 150 monedas
  y quedan en la biblioteca de la cuenta (`save.ults`) para todos los monstruos. **No depende del stat más alto.**
  Una por pelea, se recarga al empezar cada pelea (no hay recarga con monedas). Antes de lanzarla carga 1,3 s y hay acercamiento de cámara.
  Escudo de hierro = **no recibe daño** por 10 s (`SHIELD_MUL` 0; igual lo empujan; pedido del dueño). Al usarla: +30% a todo por 10 s. El aura de partículas (pequeñas) **sólo aparece al cargar la ultimate y mientras dura su efecto** (10 s); no se ve en el menú ni con la ultimate lista. Excepción: la animación de crecer a Awakened sí muestra el aura (`growAura`).
  El jugador elige cuándo la usa: apenas pueda / como remate / para salvarse.
- **Variedad (gen 3):** monstruos nuevos tienen partes y paletas extra (orejas, antenas, bocas, pinzas, tentáculos, etc.).
  Los monstruos antiguos (gen 2 / `legacy`) **deben verse exactamente igual**: `applyVariety` usa un flujo de azar aparte y sólo se aplica con `v3`.

## Compatibilidad de partidas guardadas

`loadSave` migra datos viejos: completa `stage`, `lives`, `pts`, `temper`, `ultMode`; marca adultos antiguos como `legacy`; devuelve las monedas del
entrenamiento anterior (`train`) con un aviso único (`save.notice`); asigna la ultimate que ya tenían los Awakened antiguos.
**Cualquier cambio de formato debe agregar su migración ahí** para no romper partidas existentes.

## Equilibrio (último estado medido)

- Misma etapa: ~46–60% de victorias para tu monstruo (lo esperado es 50%).
- Estilos de personalidad en 1v1: todos ganan parecido; cambian la forma de pelear (distancia, cambios de objetivo, comportamiento con poca vida).
- Personalidades por modo (900 peleas c/u, tras el ajuste `KITE`): todos contra todos 23–27% (Cauto ~29%; esperado 25%), 2 vs 2 48–52%.
  Antes del ajuste el Cauto (casi siempre pelea a distancia) ganaba ~38% en todos contra todos y ~41% en 2 vs 2, y el Prudente ~33% en todos contra todos.
  `KITE` (sólo para los que pelean a distancia, salvo `ffaRetreat`): en todos contra todos se quedan más cerca (`ffaDist`) y disparan más lento (`ffaFire`),
  y el Prudente huye menos lejos con poca vida (`ffaRetreat`); en equipo disparan más seguido (`teamCover` 0,75; el dueño lo pidió bajar dos veces desde 0,45 porque se veía exagerado, así que el Cauto en 2v2 queda algo bajo, ~41–44%) y el Cauto se aleja menos tras golpear (`teamBackoff`).
  1 vs 1 no cambia. Subir más `ffaFire` casi no baja al Cauto (su ventaja es sobrevivir, no el daño).
  Cambios de objetivo por pelea (todos contra todos): Terco ~0,7, Oportunista ~2,6.
- Ultimates: 44–54% en 1v1 y 24–34% en todos contra todos (esperado 25%); con el Escudo de hierro invulnerable: ~51% en 1v1 y ~36% en todos contra todos. Las de daño usan el ataque más fuerte (`ultPow`).

## Ideas pendientes / posibles siguientes pasos

- Empaquetar con Capacitor para Android/iOS (y Wake Lock nativo).
- Más ultimates (la biblioteca ya está pensada para crecer: agregar a `ULTS` + `ULT_KEYS` + su efecto en `execUlt`).
- Sonido.
- Si se quiere que la ultimate pese más: subir `ULT_ALL_MUL` o el daño de las ultimates de daño.
