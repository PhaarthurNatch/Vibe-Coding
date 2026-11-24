// Prueba rápida: abre Duelo Elemental como iPhone 13, elige Fuego, calibra (mantener presionado), espera el conteo, inclina el teléfono (eventos simulados) y revisa que camine.
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
  if (out) await page.screenshot({ path: out + '/calib.png' });
  const tilt = (beta, gamma) => page.evaluate(([b, g]) => window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { alpha: 0, beta: b, gamma: g })), [beta, gamma]);
  // calibrar: mantener presionado sin mover el teléfono (si se mueve, se reinicia)
  const hold = await page.locator('#calHold').boundingBox(), hx = hold.x + hold.width / 2, hy = hold.y + hold.height / 2;
  await tilt(35, 3); await page.mouse.move(hx, hy); await page.mouse.down(); await page.waitForTimeout(500);
  await tilt(50, 3); await page.waitForTimeout(100);
  if ((await page.textContent('#calMsg')).indexOf('movió') < 0) errs.push('no se reinició al mover el teléfono');
  await page.mouse.up(); await page.mouse.down();
  for (let i = 0; i < 60 && !(await page.isHidden('#calib')); i++) { await tilt(40 + (i % 2) * 0.5, 0); await page.waitForTimeout(90); } // hasta que se llene el círculo
  await page.mouse.up();
  if (!(await page.isHidden('#calib'))) errs.push('no terminó de calibrar');
  if (out) { await page.waitForTimeout(700); await page.screenshot({ path: out + '/count.png' }); }
  await tilt(40, 25); await page.waitForTimeout(600);
  if (await page.evaluate(() => Math.hypot(G.me.vx, G.me.vy)) > 1) errs.push('camina durante el conteo');
  await tilt(40, 0); await page.waitForFunction(() => G.phase === 'fight', null, { timeout: 6000 });
  await page.waitForTimeout(300);
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
