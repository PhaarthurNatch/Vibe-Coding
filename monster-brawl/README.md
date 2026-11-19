# Monster Brawl

Juego de monstruos generados al azar que pelean solos (estilo "cría y pelea").
Todo está en `index.html` (HTML5 canvas, sin dependencias). Ábrelo en el navegador del celular.

## Qué hay
- **Web app instalable**: se puede instalar desde el navegador (botón Instalar; en iPhone, Compartir → Agregar a pantalla de inicio) y funciona sin internet.
- **Pelea local por WiFi**: de 2 a 8 celulares en el mismo WiFi se conectan escaneando códigos QR y pelean sus monstruos (amistosa, sin perder corazones). Los equipos se arman con colores: cada uno toca su monstruo en la sala para cambiar de color; los del mismo color son compañeros (1 vs 1, todos contra todos, 2 vs 2, 2 vs 1, etc.).
- **Menú en 3 páginas, una debajo de otra** (deslizar arriba/abajo, o tocar "▲ Tienda" / "Estadísticas ▼" en los bordes; no hay pestañas): Tienda (arriba: ultimates por 150),
  Rancho (al medio, página inicial) y Estadísticas (abajo: entrenar y liberar).
- **Rancho**: todos tus monstruos (y huevos y espacios libres) viven en un rancho redondo y caminan solos; deslizar a los lados lo gira
  como un carrusel. Al tocar a uno, la cámara se acerca y se ve de cerca con sus datos y botones de pelea; 🏡 vuelve al rancho.
  De cerca, deslizar a los lados pasa al siguiente monstruo.
- **Espacios libres**: al deslizar entre tus monstruos aparecen los espacios vacíos con un huevo transparente; ahí puedes **Comprar** un huevo (60 monedas, 1 al día) o **Criar** (desde que tienes 2 Awakened): cruza dos Awakened por 150 monedas; los padres duermen 30 min y el huevo incuba 3 horas en ese espacio. El hijo hereda partes, colores y
  personalidad de sus padres (a veces muta algo) y al despertar trae la ultimate de uno de ellos.
- **Huevo y etapas de vida**: cada monstruo nuevo parte como huevo (tócalo para que nazca y ponle nombre).
  Bebé (Nv. 1-2): una sola pieza de cuerpo con ojos y boca. Niño (Nv. 3-4): cabeza y torso chico, a veces bracitos, piernitas, cuernito o colita.
  Adolescente (Nv. 5-7): más grande y con más partes. Adulto (Nv. 8-11): todas las partes.
  Awakened (Nv. 12+): mismo cuerpo de adulto y una ultimate; al usarla le sale un aura de partículas de su color que dura lo que dura su efecto. Al crecer conserva todas sus partes
  (agrandadas) y se sortea si le salen partes nuevas; las cantidades sólo suben. Crece recién al volver al menú,
  con una animación a pantalla completa donde le van apareciendo las partes nuevas (si le toca crecer varias etapas,
  crecen una tras otra dentro de la misma animación).
- **Variedad (monstruos nuevos)**: orejas (gato, redondas, conejo blandas, aleta) que se mueven solas; antenas elásticas
  (bolita, luz que pulsa, hoja); cabezas corazón/hexágono/hongo/frijol; bocas con lengua que se mueve, mandíbulas que se abren
  y cierran, bigotes; pupilas corazón/diamante/espiral que gira; astas y cuernos de carnero; alas de mariposa, fuego que titila
  y hoja; colas con corazón, horquilla, aguijón que brilla o mechón; pinzas que chasquean al golpear y tentáculos que ondulan;
  garras de ave y botas. Colores: paletas pastel, neón, oscura (ojos que brillan), tierra, metálica (oro/plata) y caramelo,
  cuerpo de dos tonos y dibujos (rayas, degradado, manchas grandes). Los monstruos antiguos conservan su aspecto.
- **Partes "floaty"**: cada parte es un nodo con resorte que sigue a su padre con retraso; al recibir golpes se sacuden y al morir caen como ragdoll.
- **Stats salen del cuerpo**: vida, fuerza, disparo, defensa, velocidad, peso (regula el knockback) y esquiva.
- **IA**: elige objetivo mirando a la vez qué tan cerca está, quién le está pegando ahora, quién le ha pegado en toda la pelea, quién lo está atacando, quién está débil o distraído, a quién ataca su compañero (2 vs 2), si ya hay varios encima de uno (todos contra todos), si tiene escudo y qué tan peligroso es. La personalidad decide cuánto pesa cada cosa ("¡grr!" cuando cambia por rabia, "¡ahora!" por oportunidad). No cambia a cada rato: sólo si el nuevo es claramente mejor. Al fijarlo se mueve sobre un eje de lock-in que gira lento.
- **Combate físico**: el golpe solo cuenta si la mano/cabeza toca al enemigo (con impulso hacia adelante); disparar empuja hacia atrás;
  esquivar es un salto lateral real, así que el ataque falla físicamente.
- Modos 1v1, 2v2 y todos contra todos (velocidad fija x1.5). En 2v2 eliges 2 de tus monstruos para pelear en equipo
  (o un aliado al azar si sólo tienes uno listo); cada uno gana su XP, monedas y pierde sus vidas. XP, monedas y niveles guardados en el dispositivo.
- **Vidas**: 3 por monstruo; si lo noquean pierde una y recupera 1 cada 5 min. Sin vidas descansa 10 min (o se cura al instante con 30 monedas).
- **Interacción en la vitrina**: toque corto = sacudirlo; deslizar el dedo = acariciarlo (cierra los ojos, se sonroja, salen corazones);
  mantener presionado = tomarlo: cuelga del dedo, lo puedes mover, levantar y lanzar; al caer rebota y vuelve caminando al centro.
- **Entrenamiento por puntos**: 2 puntos por nivel para repartir en Poder (daño), Aguante (vida y defensa), Agilidad
  (velocidad y esquiva) y Técnica (ataca más seguido y llega más lejos). Reiniciarlos cuesta monedas. El cuerpo cambia según
  los puntos (brazos más gruesos, torso más ancho, piernas más largas, ojos más grandes).
- **Personalidad**: Agresivo↔Cauto (distancia, se aleja tras golpear), Terco↔Oportunista (no suelta a su objetivo / va por el
  débil o distraído y lo remata más fuerte), Valiente↔Prudente (con poca vida pega más fuerte / se aleja y esquiva más).
  Cambia con ejercicios (monedas) y según cómo pelea.
  En Awakened eliges el momento de la ultimate: apenas pueda, como remate o para salvarse.
- **Ultimate (Awakened)**: se lanza apretando el botón **ULTIMATE** abajo de la arena (una vez por pelea). Se equipa y se cambia cuando quieras desde Estadísticas. Al despertar trae una de regalo; las demás
  se desbloquean con monedas (150) y quedan en tu biblioteca para todos tus monstruos. Disponibles: Onda de choque (lanza a todos
  al otro lado), Bala gigante (atraviesa todo en línea recta; apunta adelantándose), Escudo de hierro (no recibe daño 10 s), Supervelocidad (se mueve y
  ataca el doble de rápido 10 s), Reflejos fantasma (doble esquiva 10 s). Al usarla queda potenciado (+30% a todo por 10 s). Las de daño usan su ataque más fuerte (golpe o disparo).
  Se usa una por pelea (con carga previa y acercamiento de cámara) y se recarga al empezar cada pelea.
- **Expresiones**: asustados con poca vida (tiemblan, sudan, cejas preocupadas), enojados al atacar, dolor al recibir golpes,
  mareados con golpes fuertes, sorpresa al esquivar, felices al noquear o ganar, tristes al perder o con pocas vidas. Si lo noquean (pierde un corazón) queda triste 1 minuto en el menú, aunque su equipo gane, pero si lo acaricias se pone feliz. Con 1 corazón o menos se ve machacado: cansado, con curitas y un ojo morado.
- **Rivales**: siempre de la misma etapa que tu monstruo, con nivel parecido y puntos y personalidad al azar.
- **Muerte súbita**: desde los 60 s de pelea (de juego) el daño va subiendo poco a poco, así las peleas siempre terminan con un K.O.
- **Premios por posición**: XP y monedas según el lugar en que termina (+10 XP y +5 monedas por K.O.).

## Llevarlo a Android / iPhone
Envolverlo con Capacitor: `npm i @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios`,
`npx cap init`, poner `index.html` en la carpeta web (`www/`), luego `npx cap add android` / `npx cap add ios`.
