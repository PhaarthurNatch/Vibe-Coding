// Prueba rápida: abre el juego como iPhone 13, adopta y hace nacer el primer huevo, le pone nombre y juega una pelea 1 vs 1.
// Uso: node monster-brawl/tools/smoke.js   (debe terminar con "no errors")
const path = require('path');
const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ ...devices['iPhone 13'] })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(400);
  // partida nueva: empieza en Adoptar; se adopta el huevo y se abre ahí mismo tocándolo
  if (await p.isVisible('#btnNew')) { await p.click('#btnNew'); await p.waitForTimeout(300); } // (el primer huevo ya viene adoptado)
  for (let i = 0; i < 12 && !(await p.evaluate(() => document.querySelector('#dialog.on') !== null)); i++) {
    const e = await p.evaluate(() => ({ x: homeView.cx + adoptEgg.gx * homeView.k, y: homeView.gy - (adoptEgg.z + adoptEgg.h * 0.45) * homeView.k }));
    await p.mouse.click(e.x, e.y); await p.waitForTimeout(150);
  }
  await p.waitForSelector('#dialog.on', { timeout: 5000 }); await p.click('#dlgYes'); await p.waitForTimeout(300);
  console.log('nació:', await p.textContent('#mName'), '|', await p.innerText('#mSub'));
  await p.click('[data-mode="1v1"]'); await p.waitForTimeout(500);
  await p.evaluate(() => battle.ms.filter(m => m.team !== 0).forEach(m => m.hp = 1)); // acelera: el rival casi sin vida
  await p.waitForSelector('#result.on', { timeout: 60000 });
  console.log('resultado:', await p.textContent('#resTitle'), '|', (await p.innerText('#resText')).replace(/\n/g, ' | '));
  await p.click('#resHome'); await p.waitForTimeout(300);
  console.log(errs.join('; ') || 'no errors');
  await b.close();
  process.exit(errs.length ? 1 : 0);
})();
