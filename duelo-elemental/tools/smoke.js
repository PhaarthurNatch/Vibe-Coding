// Prueba rápida: abre Duelo Elemental como iPhone 13, elige Fuego, inclina el teléfono (eventos simulados) y revisa que camine.
// Uso: node duelo-elemental/tools/smoke.js [carpeta-para-capturas]
const { chromium, devices } = require('playwright');
const path = require('path');
(async () => {
  const out = process.argv[2];
  const browser = await chromium.launch();
  const page = await browser.newPage({ ...devices['iPhone 13'] });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  await page.waitForTimeout(300);
  if (out) await page.screenshot({ path: out + '/pick.png' });
  await page.click('.elbtn[data-el="fuego"]');
  const tilt = (beta, gamma) => page.evaluate(([b, g]) => window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { alpha: 0, beta: b, gamma: g })), [beta, gamma]);
  await tilt(40, 0); await page.waitForTimeout(300);
  const p0 = await page.evaluate(() => ({ x: G.me.x, y: G.me.y }));
  await tilt(40, 25); await page.waitForTimeout(900);   // inclinar a la derecha
  const p1 = await page.evaluate(() => ({ x: G.me.x, y: G.me.y }));
  if (out) await page.screenshot({ path: out + '/walk.png' });
  await tilt(20, 0); await page.waitForTimeout(900);    // inclinar hacia adelante (se aleja)
  const p2 = await page.evaluate(() => ({ x: G.me.x, y: G.me.y }));
  await tilt(40, 0); await page.waitForTimeout(600);
  const v = await page.evaluate(() => Math.hypot(G.me.vx, G.me.vy));
  if (out) await page.screenshot({ path: out + '/stop.png' });
  const bad = await page.evaluate(() => G.ms.some(m => m.nodes.some(n => !isFinite(n.x) || !isFinite(n.y))));
  console.log({ p0, p1, p2, stopSpeed: v.toFixed(1) });
  if (!(p1.x > p0.x + 40)) errs.push('no caminó a la derecha');
  if (!(p2.y < p1.y - 40)) errs.push('no caminó hacia el fondo');
  if (v > 5) errs.push('no se detuvo');
  if (bad) errs.push('posición inválida');
  console.log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'no errors');
  await browser.close(); process.exit(errs.length ? 1 : 0);
})();
