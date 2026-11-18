# Monster Brawl

Juego de monstruos generados al azar que pelean solos (estilo "cría y pelea").
Todo está en `index.html` (HTML5 canvas, sin dependencias). Ábrelo en el navegador del celular.

## Qué hay
- **Cuerpos aleatorios** (vista frontal 2D): pupilas, ojos, cabeza, cuello, torso superior/medio/inferior,
  hombros, brazos, antebrazos, muslos, piernas, pies, alas, colas, cuernos y boca. Varían en color, largo y cantidad (puede ser 0).
- **Partes "floaty"**: cada parte es un nodo con resorte que sigue a su padre con retraso; al recibir golpes se sacuden y al morir caen como ragdoll.
- **Stats salen del cuerpo**: vida, fuerza, disparo, defensa, velocidad, peso (regula el knockback) y esquiva.
- **IA**: elige objetivo mezclando el más cercano y el que más daño le ha hecho; al fijarlo se mueve sobre un eje de lock-in que gira lento.
- **Combate físico**: el golpe solo cuenta si la mano/cabeza toca al enemigo (con impulso hacia adelante); disparar empuja hacia atrás;
  esquivar es un salto lateral real, así que el ataque falla físicamente.
- Modos 1v1, 2v2 y todos contra todos. XP y niveles guardados en el dispositivo.

## Llevarlo a Android / iPhone
Envolverlo con Capacitor: `npm i @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios`,
`npx cap init`, poner `index.html` en la carpeta web (`www/`), luego `npx cap add android` / `npx cap add ios`.
