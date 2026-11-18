# Monster Brawl

Juego de monstruos generados al azar que pelean solos (estilo "cría y pelea").
Todo está en `index.html` (HTML5 canvas, sin dependencias). Ábrelo en el navegador del celular.

## Qué hay
- **Huevo y etapas de vida**: cada monstruo nuevo parte como huevo (tócalo para que nazca y ponle nombre).
  Bebé (Nv. 1-2): una sola pieza de cuerpo con ojos y boca. Niño (Nv. 3-4): cabeza y torso chico, a veces bracitos, piernitas, cuernito o colita.
  Adolescente (Nv. 5-7): más grande y con más partes. Adulto (Nv. 8+): todas las partes. Al crecer conserva todas sus partes
  (agrandadas) y se sortea si le salen partes nuevas; las cantidades sólo suben. Crece recién al volver al menú,
  con una animación a pantalla completa donde le van apareciendo las partes nuevas.
- **Partes "floaty"**: cada parte es un nodo con resorte que sigue a su padre con retraso; al recibir golpes se sacuden y al morir caen como ragdoll.
- **Stats salen del cuerpo**: vida, fuerza, disparo, defensa, velocidad, peso (regula el knockback) y esquiva.
- **IA**: primero ataca al más cercano; el daño recibido se acumula como odio y, cuando el odio hacia alguien pasa un umbral, va por él aunque esté lejos ("¡grr!"); al fijarlo se mueve sobre un eje de lock-in que gira lento.
- **Combate físico**: el golpe solo cuenta si la mano/cabeza toca al enemigo (con impulso hacia adelante); disparar empuja hacia atrás;
  esquivar es un salto lateral real, así que el ataque falla físicamente.
- Modos 1v1, 2v2 y todos contra todos (velocidad fija x1.5). XP, monedas y niveles guardados en el dispositivo.
- **Vidas**: 3 por monstruo; si lo noquean pierde una y recupera 1 cada 5 min. Sin vidas descansa 10 min (o se cura al instante con 30 monedas).
- **Interacción en la vitrina**: toque corto = sacudirlo; deslizar el dedo = acariciarlo (cierra los ojos, se sonroja, salen corazones);
  mantener presionado = tomarlo: cuelga del dedo, lo puedes mover, levantar y lanzar; al caer rebota y vuelve caminando al centro.
- **Entrenamiento**: desliza a la página Entrenar y paga monedas para subir Vida, Fuerza, Disparo, Defensa, Velocidad, Peso o Esquiva
  (máx. 10 niveles por stat; cuesta 20, 35, 50… monedas). Los rivales también traen algo de entrenamiento según su nivel.
- **Expresiones**: asustados con poca vida (tiemblan, sudan, cejas preocupadas), enojados al atacar, dolor al recibir golpes,
  mareados con golpes fuertes, sorpresa al esquivar, felices al noquear o ganar, tristes al perder o con pocas vidas.
- **Premios por posición**: XP y monedas según el lugar en que termina (+10 XP y +5 monedas por K.O.).

## Llevarlo a Android / iPhone
Envolverlo con Capacitor: `npm i @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios`,
`npx cap init`, poner `index.html` en la carpeta web (`www/`), luego `npx cap add android` / `npx cap add ios`.
