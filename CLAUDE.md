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
- **Web app instalable (PWA)** publicada en GitHub Pages desde `main` (carpeta raíz; `.nojekyll`): **https://phaarthurnatch.github.io/Vibe-Coding/monster-brawl/**
  (el dueño activa Pages una vez en Settings → Pages → Deploy from a branch → `main` / root). Archivos: `manifest.webmanifest`, `sw.js` (red primero para la página,
  copia guardada sin internet; subir `CACHE` si cambian íconos u otros archivos fijos), `icons/` (monstruo semilla 1334173269, generado con el propio juego).
  Botón "Instalar" arriba: en Android usa el aviso del navegador; en iPhone explica Compartir → "Agregar a pantalla de inicio". No aparece dentro de claude.ai.
- Se descartó subir a tiendas; Capacitor (APK para Android) queda como opción futura.
- Página publicada (Artifact privado del dueño) para probar en el celular: **https://claude.ai/artifact/5PSe9xvkZVHRRoQdiyMWBs**
  Hay que actualizar **ese mismo link**, no crear uno nuevo (ver "Publicar").

## Cómo trabajar en este proyecto

1. Editar `monster-brawl/index.html`.
2. Probar en un navegador headless con Playwright (Chromium ya viene instalado en el entorno; `require('playwright')` funciona).
   - Prueba rápida: `node monster-brawl/tools/smoke.js` (abre el juego como iPhone 13, hace nacer un huevo, revisa que el Rancho quede a la vista al abrir, toca al monstruo en el rancho para acercarlo y juega una pelea; debe terminar con `no errors`).
   - Si cambia la cantidad de páginas del menú, actualizar también el `translateY` inicial de `#track` en el HTML y la altura de `.track`/`.page`.
   - Para probar deslizamientos con el dedo (eventos touch) usar `Input.dispatchTouchEvent` por CDP; `page.mouse` sirve para el mouse. Al abrir una partida guardada se ve el rancho: en scripts, `ranchMode = false; renderHome()` para ir directo a la vista de cerca.
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
| UI | Menú con 3 páginas **una debajo de otra** (`homePage` 0–2; `.track` absoluto de 300% de alto y `translateY`): **Tienda arriba** (sólo ultimates, `renderAdopt` → `renderShopUlts`) / **Rancho** al medio (página inicial, `#pgHome`) / **Estadísticas abajo** (abajo del todo el botón "Liberar"). **No hay pestañas** (pedido del dueño): cada página dice en su borde qué hay arriba/abajo con botones `.edgeLbl` que también se pueden tocar. **El orden cambia según la vista** (`visPage`, CSS `order` de `.pgShop`/`#pgHome`/`.pgStats`): en el rancho, Tienda arriba ("▲ Tienda", `#lblTop`) y nada abajo; **viendo un monstruo de cerca, Estadísticas arriba** ("▲ Estadísticas", dorado con "(n)" si hay puntos por gastar, `edgeLabels`) **y el rancho abajo** ("Rancho ▼", `#lblBot`: deslizar hacia abajo o tocarlo vuelve al rancho); la Tienda dice "Rancho ▼" y Estadísticas "Monstruo ▼". Deslizar el dedo hacia arriba baja a Estadísticas y hacia abajo sube a la Tienda, en cualquier parte (**desde el rancho no se puede ir a Estadísticas**: no hay monstruo elegido; recién de cerca aparece "Estadísticas ▼") (`swipeStart`/`swipeEnd` con eventos **touch**, porque el navegador cancela el pointer al desplazar un panel; en un panel con scroll sólo cambia de página cuando ya está en el borde; sobre el monstruo de cerca sólo un trazo largo y rápido). **Rancho** (`RANCH`, `ranchMode`, `drawRanch`, `ranchStep`, `syncRanch`): rancho redondo de noche visto **desde el centro del rancho, el eje** (`drawRanch`: uno está parado en el centro, cámara `CAM_D` 0, **baja y mirando paralela al piso** (horizonte a 47% del alto, `camH` chico); girar es mirar alrededor, el paisaje sigue al dedo; los monstruos andan en un anillo alrededor, **nunca a menos de `RANCH_RMIN` 0,5 del centro** y libres hasta la cerca, que está lejos (`RANCH_RF` 2,2; `RANCH_RMAX` = 0,95·RF; decorado escalado a RF), con paseos largos para que se note la profundidad; el granero está afuera, detrás de la cerca; horizonte a 40% del alto; X = cx + wx·F/d, Y = horizonte + camH/d, escala 1/d; el rancho es grande comparado con los monstruos: lo cercano enorme, lo del otro lado chico, y lo que queda detrás de la cámara no se ve, hay que girar; lo muy cercano se desvanece (`near`/`nearM`); granero afuera de la cerca, muchos árboles **sólidos** adentro a distintas profundidades (los monstruos pasan por detrás; no se transparentan, pedido del dueño) y afuera, cerros y luna que se mueven al girar); cada espacio (monstruo, huevo o espacio libre con huevo "?") es un habitante que camina solo en cualquier dirección, también hacia adelante y atrás (`a.x/a.z` en el disco, saltitos, no se enciman, los que duermen no caminan); **mira hacia donde camina**: si se aleja de la cámara se ve **de espaldas** (`Monster.back`: sin cara ni panza, alas y cola por delante del cuerpo, nuca algo más oscura; `a.awayT` evita parpadeos) y quieto un rato se da vuelta a mirar con su nombre debajo; arrastrar a los lados **gira el rancho como carrusel** (`RANCH.th`, con inercia); los árboles de adelante se transparentan. En el rancho, sobre un habitante: **tocar = acercar la cámara**, **frotar despacio = caricia** con **la misma física que de cerca** (las partes bajo el dedo se dejan llevar, en coordenadas del monstruo con `a.scr`; corazones, queda feliz y se le quita lo triste; `ranchPet`; frotar rápido gira); **no hay golpe** en el rancho (se probó y el dueño lo quitó); **sin texto de ayuda abajo** (el dueño lo quitó) (`ranchHit` → `ranchZoomTo` → `zoom`, `ZOOM_S` 0,45 s, la cámara viaja hasta él con zoom, `drawRanchBg`) a la **vista de cerca**, que es **literalmente acercarse**: de fondo se ve el rancho en tiempo real en el lugar donde está ese monstruo (la cámara del centro gira hasta mirarlo de frente y hace zoom; lo que queda entre uno y él desaparece; **el de cerca es el mismo monstruo del rancho, en vivo** (`show` = `RANCH.actors[sel].m` y `egg` = su `EggView`; mientras se mira lo mueve `show.homeStep` y no `ranchStep`; no hay copia ni "tarjeta"); al acercarse, si estaba de espaldas se da vuelta a mirarte con un saltito y se alegra (`greetFocus`); **al deslizar a los lados de cerca no hay tarjetas: la cámara viaja por el rancho** en arco alrededor de uno hasta **el vecino que está hacia ese lado de la pantalla** (`ranchNeighbor`: dedo a la izquierda = el más cercano a la derecha, como arrastrar el paisaje; `slide.long` fuerza el giro por ese lado) (`slide.travel`, 0,9 s, `travelPoint`/`travelFade`; se aleja un poco a mitad de camino; el de primer plano anterior se desvanece al empezar y el nuevo aparece al llegar), siempre con el rancho en vivo; flores y estrellas no crecen con el zoom, `dotK`) (`drawCloseUp`: nombre, esquinas, botones; clase `ranch` en `#home` oculta todo eso en el rancho); ir hacia abajo (dedo hacia arriba) o tocar "Rancho ▼" vuelve al rancho (`toRanch`); **no hay botón 🏡** (se quitó). De cerca **y en Estadísticas**: deslizar **a los lados** pasa al siguiente/anterior (`switchMonster`, tarjetas horizontales `slide`, `cardUp`/`cardDown`), recorriendo también los espacios libres (`homeEmpty`); en las esquinas van el nivel (`cLv`), los corazones con el tiempo para el próximo (`cHearts`), "1/3" (`cIdx`) y si duerme "💤 29:11" (`cTime`); **no se muestra la etapa**; gestos: tocar = sacudir, frotar = acariciar, mantener = tomar/lanzar. También: selector de equipo 2v2, combate, resultado, animación de crecimiento (`checkGrowth`/`growStep`) |

## Reglas y decisiones de diseño vigentes (no revertir sin que el dueño lo pida)

- **Etapas:** Huevo → Bebé (Nv 1–2) → Niño (3–4) → Adolescente (5–7) → Adulto (8–11) → Awakened (12+) (`STAGE_LV`).
  Al crecer conserva todas sus partes (agrandadas) y se sortean partes nuevas; las cantidades sólo suben.
  **Crece recién al volver al menú**, con animación a pantalla completa; si debe crecer varias etapas, todas van en la misma animación.
  "Otra pelea" sigue usando la etapa actual.
- **Huevo:** se compra **sólo en un espacio libre del Home** (botón Comprar) por 60 monedas (`EGG_COST`), **1 al día** (`save.eggDay`, cambia a medianoche; el botón muestra cuánto falta) y se abre ahí mismo tocándolo varias veces (`tapEgg`); al nacer se le pone nombre. Una partida nueva empieza en el Home con su primer huevo ya puesto (gratis). **Hasta que ese primer huevo nazca no se puede ir a ningún lado** (`firstEgg`: ni deslizar páginas ni a otros espacios, **en pantalla sólo el huevo** (clase `first` en `#home` oculta todo lo demás: título, monedas, pestañas, nombre, panel, contador) y el huevo se mueve solo de a ratos como si algo quisiera salir (`egg.wig`); si lo intenta, el huevo se mueve y dice "¡Primero ábreme!", `nudgeEgg`). Migración: el antiguo huevo de la Tienda a medio abrir (`save.adopting`) pasa a `save.monsters`.
  En Estadísticas, con un huevo o un espacio libre seleccionado sale "Aún no hay nada aquí" y se oculta Liberar.
- **Espacios para monstruos** (`slotCap`, `save.slots`): se parte con **2** y cada monstruo que llega a Awakened desbloquea 1 más (hasta 8, `MAX_MONSTERS`;
  `awakeCounted` evita contar dos veces; se avisa en el título de la animación de despertar). Comprar y criar se hacen en un espacio libre.
  Migración: partidas antiguas reciben 2 + sus Awakened (y nunca menos que los monstruos que ya tienen).
- **Espacios libres = comprar o criar** (reemplazó a la página Criadero, pedido del dueño): al deslizar a un espacio libre se ve un huevo transparente con "?" y **sólo** dos botones (`renderSlotBtns`; clase `vacant` en `#home` oculta Pelea local y los de pelea):
  **Comprar** (60 monedas, 1 al día, mismas reglas que la Tienda; `buySlotEgg`) agrega un huevo a `save.monsters` y se abre ahí mismo a toques (`tapEgg`);
  **Criar** (gris "🔒 Criar" hasta desbloquearlo con 2 Awakened; aviso único, `save.breedUnlocked`, `checkBreedUnlock`) abre el modal `#breedPick` para elegir 2 Awakened (`openBreedPick` → `doBreed`), 150 monedas (`BREED_COST`).
  El huevo criado queda en ese espacio como un monstruo más con `stage: 'egg'` y `readyAt`: **incuba 3 horas** (abajo a la derecha "🥚 2 h 05 min"; tocarlo antes sólo lo mueve) y después se abre a toques.
  Puede haber varios a la vez. Los padres quedan **durmiendo 30 min** (`napUntil`, `napping`; no pelean, sin botón de curar). **Cada monstruo puede tener crías una sola vez** (`bred`).
  Migración: el antiguo `save.breeding = {rec, readyAt}` pasa a `save.monsters` con `readyAt`. 
  **Cada pelea ganada (1.er lugar) adelanta 2 min la incubación de todos los huevos criados** (`INCUBATE_FIGHT_MS`; se avisa en el resultado).
  Herencia (`makeChild`, `recGenome`): cada grupo de partes de `GENE_GROUPS` sale al azar de uno de los padres (10% muta = sale de su propia semilla);
  `rec.genes[grupo]` guarda el monstruo *origen* `{seed, legacy, v3}` (plano, sirve para nietos). Personalidad = promedio ± azar; al despertar trae la ultimate de un padre (`ultGift`).
  Home muestra "Hijo de X y Y · Gen. N" (`parents`, `lineage`). Todos los campos son opcionales: no hace falta migración.
- **Pelea local por WiFi, de 2 a 8 jugadores** (botón "📶 Pelea local" en el Home; módulo `LAN`, `LAN_MAX` 8): conexión directa WebRTC sin internet (sin servidores ICE; candidatos de la red local),
  emparejada con **códigos QR** (`packSDP`/`unpackSDP` achican la conexión a ~100 caracteres; `drawQR` con qrcode-generator, lectura con `BarcodeDetector` o jsQR,
  ambas bibliotecas van incrustadas al inicio del HTML con su licencia). El anfitrión crea y muestra su QR → el invitado toca Unirme y lo escanea → muestra su QR →
  el anfitrión lo escanea; con "+ Agregar jugador" repite para cada amigo (una conexión por invitado en `LAN.peers`; sala con `lanLobbyUpdate`).
  **Equipos por colores** (`LAN_COLORS`, 8 colores): en la sala sale la tarjeta de cada jugador con su monstruo y su color; cada uno toca **su** tarjeta para pasar al siguiente color
  (anfitrión: `LAN.color`; invitado manda `{t:'col'}` y el anfitrión cambia `peer.color`; al entrar se le da un color libre, `lanFreeColor`). Mismo color = compañeros.
  El equipo de cada monstruo es el número de su color; el modo sale solo (`lanModeOf`: `'1v1'`, `'ffa'` si todos distintos, `'teams'` si hay compañeros; se permiten equipos disparejos)
  y su nombre de los tamaños (`lanModeName(teams)`, ej. "2 vs 1"). Un solo botón "¡Pelear!" (desactivado si todos tienen el mismo color). En la pelea: anillo del color del equipo a los pies
  y barras de vida de ese color (`teamColor(m, 'lan')`). En el resultado, "🎨 Equipos" devuelve a todos a la sala (`lanToRoom`, mensaje `room`); la revancha mantiene los colores.
  Con `'teams'` o más de 4 salen en un óvalo (`spawnRing`), la arena crece (×√(n/4)) y el estado se manda 20 veces por segundo (máx. 60 partículas).
  Si un invitado se va a mitad de pelea, su monstruo sigue con la IA; si se va el anfitrión, se termina para todos.
  **El anfitrión simula** la pelea (`lanStartHost(mode)`; los monstruos de los otros tienen `remoteCtl` y esperan su botón) y manda el estado ~30/s
  (`lanSnapshot`); **el invitado sólo dibuja** (`battle.puppet`, `lanApply`) y manda `{t:'u'}` al apretar ULTIMATE. Pelea amistosa (`lanFinish`): sin corazones ni premios;
  revancha desde cualquiera de los dos. Prueba con dos páginas: `--disable-features=WebRtcHideLocalIpsWithMdns` y `lanGotCode(LAN.code)` en vez de la cámara.
  Pendiente (etapa 4): la arena repartida en varias pantallas sobre la mesa.
- **Rivales:** siempre de la **misma etapa** que tu monstruo (se probó mezclar etapas y el dueño lo pidió quitar). Nivel ±1, puntos y personalidad al azar.
- **Combate:** automático, velocidad fija x1.5, sin botón de velocidad. Empieza con cuenta regresiva 3, 2, 1 y "FIGHT!" estilo arcade (`INTRO_*`, `drawIntro`; sólo en `startBattle`, las simulaciones no la tienen). Datos de los peleadores arriba de la arena; **sin barras de vida ni marcas sobre las cabezas** (la ★ sobre tus monstruos también se quitó; tus monstruos se distinguen con la ★ y el borde dorado en los datos de arriba). Sin indicador de objetivo. Al esquivar no aparece texto.
  Desde los 60 s de juego hay **muerte súbita** (el daño sube); antes había un corte a los 90 s que mostraba "Victoria" con enemigos vivos: no volver a eso.
  La pantalla se mantiene encendida durante los combates (Wake Lock).
- **IA — objetivo** (`Monster.scoreTarget`): cada 0,5 s puntúa a cada enemigo con factores de 0 a 1 (misma escala en todas las etapas):
  cercanía (tiempo en alcanzarlo según golpe/disparo), amenaza (daño de los últimos ~4 s), rencor (daño de toda la pelea), si lo ataca a él,
  vulnerable (poca vida / lo remata), distraído (pelea con otro), equipo en 2v2 (mismo objetivo que el compañero, peso bajo a propósito:
  con más peso se juntaban 97% del tiempo y perjudicaba a los Cautos), amontonamiento en todos contra todos, escudo activo y peligro (DPS relativo).
  La personalidad cambia los pesos: Agresivo = cercanía; Cauto = evita al peligroso; Terco = rencor y no suelta (pide más margen para cambiar);
  Oportunista = vulnerable/distraído; Valiente = va por el más peligroso; Prudente = lo evita. Sólo cambia si el nuevo es claramente mejor (`TGT_MARGIN`)
  y tras un mínimo con el actual (`TGT_COMMIT`). Avisos: "¡grr!" (cambió por rabia) y "¡ahora!" (por oportunidad). Esquivar = salto lateral real.
- **Peso por etapa** (`WEIGHT_SCALE`): los adultos llegaban casi todos al tope 3,5; ahora su peso se escala (×0,885, tope 4,2) para que el promedio siga ~3,3
  pero haya adultos livianos (~2,6) y pesados (~4,1). Las otras etapas no cambian. `st.mass` es el peso sin escalar ni tope (lo usa el vuelo).
- **Cadenas de golpes** (`STUN`): si te interrumpen el golpe, la espera baja a 0,25 s; tras 2 aturdimientos seguidos queda 0,6 s sin aturdirse;
  el más pesado se aturde un poco menos (`poise`) y el más liviano pega más fuerte al más pesado (`light` 0,5; era 2 antes del peso por etapa y dejaba a los livianos en 67%).
  Racha máxima bajó de ~18–25 golpes seguidos a ~13. Con el peso por etapa: livianos ~48% / medios ~48–52% / pesados ~51–54% en 1v1. `KITE.ffaFire` subió a 2,0 para que el Cauto no volviera a dominar todos contra todos.
- **Vuelo de los alados** (`FLY`, `flyer`): según la carga alar (`st.mass` sin tope / tamaño de alas; el peso normal casi siempre está en el máximo 3,5)
  los pesados (alas chicas para su cuerpo) **saltan alto** hacia su objetivo, con un salto algo lento (gravedad ×`leapG` 0,7; `startLeap`, estado `leap`) y los livianos **flotan para alejarse** ~2–2,8 s a altura `floatZ` (`floatT`) cuando el rival está encima, cada ~9–13 s (mientras flotan retroceden y disparan hacia abajo si pueden).
  En el aire (z > `airZ`) no se puede golpear ni ser golpeado cuerpo a cuerpo, no esquivan, no chocan con los del suelo; los disparos suben o bajan
  hasta la altura del objetivo (`z0`/`tz`) y pasan por debajo de los que vuelan si no apuntaban a ellos. Recibir un golpe acorta el vuelo. Al volar (saltar o flotar) aletean más rápido y con ~2,5× más recorrido (`flapK`, y la punta del ala más firme con `boost`).
  Equilibrio 1v1: sin alas ~47%, saltan ~50%, flotan ~55% (antes de esto: con alas 53%, sin alas 47%; la ventaja de los que flotan viene de ser alados livianos, no del vuelo).
- **Vidas:** 3 corazones; pierde 1 si lo noquean; recupera 1 cada 5 min; sin vidas descansa 10 min o se cura con monedas según la etapa (`HEAL_COST`: bebé 20 … Awakened 60).
  Mientras duerme (sin vidas o tras criar) la cuenta regresiva va **abajo a la derecha del área del monstruo** en el Home (`cTime`, "💤 29:11"; sin frase de estado); en el panel sólo queda el botón "Curar ya" cuando está sin vidas.
- **Premios** (`REWARDS`, [XP, monedas] por modo y puesto) + K.O. (+10 XP, +5 monedas): 1v1 60/25 · 20/10; 2v2 45/15 · 15/5 (menos porque cada monstruo tuyo cobra el suyo); todos contra todos 80/40 · 50/25 · 30/15 · 15/5.
  Criar (150) es el gasto de monedas para el juego avanzado.
- **Entrenamiento por puntos:** 2 puntos por nivel en Poder/Aguante/Agilidad/Técnica (máx. 20 c/u), reiniciar cuesta 50. El cuerpo cambia con los puntos.
  **El Home no muestra estadísticas** (sólo el monstruo, **centrado** en su espacio con un tamaño de 64% del alto, y los botones de pelea): todo está en la pestaña Estadísticas, arriba XP/récord/padres y luego cada stat con su valor, barra, puntos "n/20" y su botón +1 (`MAIN_DEF` en el mismo orden que `PTS`), luego Ultimate y Personalidad. Sólo se muestran esos 4 stats: **no hay "Ver detalle"** con vida/fuerza/peso/esquiva, etc. (el dueño lo pidió quitar).
- **Personalidad** (3 ejes de −1 a 1): Agresivo↔Cauto, Terco↔Oportunista, Valiente↔Prudente. Cambia **sólo** con ejercicios (15 monedas, bloqueados si el eje ya está al máximo) y según cómo pelea.
  **Acariciar o lanzar NO cambia la personalidad** (decisión del dueño). Acariciar lo deja feliz 1 minuto en el menú. Perder un corazón (que lo noqueen, aunque su equipo gane) lo deja triste 1 minuto (`sadUntil`); acariciarlo le quita esa tristeza. Con 1 corazón o menos queda **machacado** (no triste): cara cansada, curitas en la cabeza y ojo morado (`battered`, sólo en el menú).
- **Ultimate (Awakened):** equipable y cambiable desde Estadísticas (ahí **sólo** aparecen las desbloqueadas). Al despertar trae una de regalo (`starterUlt`); las demás se **compran en la Tienda** por 150 monedas
  y quedan en la biblioteca de la cuenta (`save.ults`) para todos los monstruos. **No depende del stat más alto.**
  Se recarga **20 s después de usarla** (`ULT_RECHARGE_S`, en segundos reales; el botón muestra los segundos grandes "N s · para recargar" y una barra dorada que se llena, clase `cd`) y al empezar cada pelea (no hay recarga con monedas). Antes de lanzarla carga 1,3 s y hay acercamiento de cámara.
  Escudo de hierro = **no recibe daño** por 10 s (`SHIELD_MUL` 0; igual lo empujan; pedido del dueño). Al usarla: +30% a todo por 10 s. El aura de partículas (pequeñas) **sólo aparece al cargar la ultimate y mientras dura su efecto** (10 s); no se ve en el menú ni con la ultimate lista. Excepción: la animación de crecer a Awakened sí muestra el aura (`growAura`).
  **Tus monstruos la lanzan sólo cuando aprietas el botón ULTIMATE** abajo de la arena (`ultBar`, `setupUltBar`/`updateUltBar`, `ultRequest`; uno por monstruo tuyo con ultimate,
  desactivado en la cuenta regresiva y mientras recarga). Ya no hay modos "cuándo la usa" en Estadísticas; los **rivales** siguen decidiendo solos (`ultMode` al azar).
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
