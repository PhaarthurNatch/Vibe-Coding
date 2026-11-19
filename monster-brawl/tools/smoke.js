// Prueba rápida: abre el juego como iPhone 13, hace nacer el primer huevo, revisa el rancho (tocar al monstruo lo acerca), le pone nombre y juega una pelea 1 vs 1.
// Uso: node monster-brawl/tools/smoke.js   (debe terminar con "no errors")
const path = require('path');
const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ ...devices['iPhone 13'] })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(400);
  // partida nueva: empieza en el Home con su primer huevo (gratis); se abre tocándolo
  for (let i = 0; i < 12 && await p.evaluate(() => !!egg); i++) {
    const e = await p.evaluate(() => ({ x: homeView.cx + egg.gx * homeView.k, y: homeView.gy - (egg.z + egg.h * 0.45) * homeView.k }));
    await p.mouse.click(e.x, e.y); await p.waitForTimeout(150);
  }
  await p.waitForSelector('#dialog.on', { timeout: 5000 }); await p.click('#dlgYes'); await p.waitForTimeout(300);
  console.log('nació:', await p.textContent('#mName'), '|', await p.innerText('#mSub'));
  // el Home tiene que quedar centrado (también al volver a abrir el juego)
  const offCenter = () => p.evaluate(() => Math.abs(document.getElementById('pgHome').getBoundingClientRect().top - document.querySelector('.pager').getBoundingClientRect().top)); // el Rancho (página del medio) a la vista
  if (await offCenter() > 5) errs.push('el Home no está centrado tras nacer');
  await p.reload(); await p.waitForTimeout(400);
  if (await offCenter() > 5) errs.push('el Home no está centrado al abrir el juego');
  if (errs.length) { console.log(errs.join('; ')); await b.close(); process.exit(1); }
  // al abrir se ve el rancho: se toca al monstruo para verlo de cerca
  await p.waitForTimeout(600);
  let a = null;
  for (let i = 0; i < 12 && !a; i++) { // puede estar detrás de la cámara: se gira hasta verlo
    a = await p.evaluate(() => { const m = RANCH.actors.find(x => x.kind === 'mon' && x.hit && (x.hit.x0 + x.hit.x1) / 2 > 30 && (x.hit.x0 + x.hit.x1) / 2 < innerWidth - 30); if (!m) { RANCH.th += 0.5; return null; } const h = m.hit; return { x: (h.x0 + h.x1) / 2, y: h.y0 * 0.3 + h.y1 * 0.7 }; });
    if (!a) await p.waitForTimeout(150);
  }
  await p.mouse.click(a.x, a.y); await p.waitForTimeout(700); // tocar = verlo de cerca
  if (await p.evaluate(() => ranchMode)) { errs.push('tocar al monstruo en el rancho no lo acercó'); console.log(errs.join('; ')); await b.close(); process.exit(1); }
  await p.click('#btnFight'); await p.waitForTimeout(200); // "Luchar" abre los modos
  await p.click('[data-mode="1v1"]'); await p.waitForTimeout(500);
  await p.evaluate(() => battle.ms.filter(m => m.team !== 0).forEach(m => m.hp = 1)); // acelera: el rival casi sin vida
  await p.waitForSelector('#result.on', { timeout: 60000 });
  console.log('resultado:', await p.textContent('#resTitle'), '|', (await p.innerText('#resText')).replace(/\n/g, ' | '));
  await p.click('#resHome'); await p.waitForTimeout(300);
  console.log(errs.join('; ') || 'no errors');
  await b.close();
  process.exit(errs.length ? 1 : 0);
})();
