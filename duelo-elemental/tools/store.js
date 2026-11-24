// Prueba de guardar la esfera: llevarla a tu personaje y dejarla ahí la deja flotando; deslizar rápido hacia el rival la dispara y lo daña.
// Uso: node duelo-elemental/tools/store.js
const { chromium, devices } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ ...devices['iPhone 13'] });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await p.waitForTimeout(300);
  await p.click('.elbtn[data-el="agua"]');
  await p.evaluate(() => { document.getElementById('calib').hidden = true; G.phase = 'fight'; G.foe.wait = 99; G.me.x = ARENA_W * 0.5; G.me.y = ARENA_D * 0.6; });
  await p.waitForTimeout(600);
  const c = await p.context().newCDPSession(p), t = (type, pts) => c.send('Input.dispatchTouchEvent', { type, touchPoints: pts });
  const pool = await p.evaluate(() => { const f = arenaProps()[1], v = view(); return { x: v.ox + f.x * v.k, y: v.oy + (TOP + f.y * DEPTH) * v.k }; });
  const me = await p.evaluate(() => { const v = view(), c = G.me.nodes[G.me.ix.upper]; return { x: v.ox + c.x * v.k, y: v.oy + (c.y + 4 * G.me.s) * v.k }; });
  // sacar la esfera despacio y llevarla a tu personaje
  await t('touchStart', [{ x: pool.x, y: pool.y }]); await p.waitForTimeout(60);
  for (let i = 1; i <= 25; i++) { await t('touchMove', [{ x: pool.x + (me.x - pool.x) * i / 25, y: pool.y + (me.y - pool.y) * i / 25 }]); await p.waitForTimeout(30); }
  await p.waitForTimeout(150); const early = await p.evaluate(() => G.orbs.filter(o => o.docked).length); // no es inmediato
  await p.waitForTimeout(800); const docked = await p.evaluate(() => G.orbs.filter(o => o.docked).length);
  await t('touchEnd', []); await p.waitForTimeout(800);
  const still = await p.evaluate(() => { const o = G.orbs.find(o => o.docked), c = G.me.nodes[G.me.ix.upper]; return o ? Math.hypot(o.x - c.x, o.y - c.y) : null; });
  // deslizar rápido hacia abajo (lejos del rival): no dispara
  await t('touchStart', [{ x: 300, y: 400 }]); await p.waitForTimeout(40); for (let i = 1; i <= 3; i++) { await t('touchMove', [{ x: 300, y: 400 + i * 60 }]); await p.waitForTimeout(8); } await t('touchEnd', []); await p.waitForTimeout(300);
  const notFired = await p.evaluate(() => G.orbs.filter(o => o.docked).length);
  // deslizar rápido hacia arriba (hacia el rival): dispara
  const hp0 = await p.evaluate(() => G.foe.hp);
  await t('touchStart', [{ x: 300, y: 600 }]); await p.waitForTimeout(40); for (let i = 1; i <= 3; i++) { await t('touchMove', [{ x: 300, y: 600 - i * 60 }]); await p.waitForTimeout(8); } await t('touchEnd', []);
  const flying = await p.evaluate(() => G.orbs.filter(o => o.thrown).length); await p.waitForTimeout(1200);
  const dmg = hp0 - await p.evaluate(() => G.foe.hp);
  console.log({ early, docked, still: still && still.toFixed(1), notFired, flying, dmg: dmg.toFixed(1) });
  if (early !== 0) errs.push('se guardó de inmediato');
  if (docked !== 1 || !(still < 40)) errs.push('no quedó flotando cerca del personaje');
  if (notFired !== 1) errs.push('disparó hacia atrás');
  if (flying !== 1 || !(dmg > 5)) errs.push('no se disparó al rival');
  console.log(errs.length ? 'ERRORS: ' + errs.join(' | ') : 'no errors'); await b.close();
})();
