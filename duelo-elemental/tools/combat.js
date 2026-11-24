// Prueba del escudo y el daño: mantener presionada tu llama forma el escudo; lanzar la bola de fuego daña al rival; con escudo el daño baja.
// Uso: node duelo-elemental/tools/combat.js
const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ ...devices['iPhone 13'] });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + require('path').resolve(__dirname, '..', 'index.html')); await p.waitForTimeout(300);
  await p.click('.elbtn[data-el="fuego"]');
  await p.evaluate(() => { document.getElementById('calib').hidden = true; G.phase = 'fight'; G.foe.wait = 99; });
  await p.waitForTimeout(500);
  const c = await p.context().newCDPSession(p), t = (type, pts) => c.send('Input.dispatchTouchEvent', { type, touchPoints: pts });
  const fire = await p.evaluate(() => { const f = arenaProps()[0], v = view(); return { x: v.ox + f.x * v.k, y: v.oy + (TOP + f.y * DEPTH - 20) * v.k }; });
  // escudo: mantener presionada la llama
  await t('touchStart', [{ x: fire.x, y: fire.y }]); await p.waitForTimeout(900);
  const mid = await p.evaluate(() => ({ flow: G.flow.length, shield: G.me.shield }));
  await p.waitForTimeout(1600);
  const full = await p.evaluate(() => G.me.shield);

  await t('touchEnd', []); await p.waitForTimeout(300);
  // lanzar: arrastrar desde la llama hacia el rival y soltar rápido
  const throwAt = async () => {
    const tg = await p.evaluate(() => { const v = view(), f = G.foe; return { x: v.ox + f.gx * v.k, y: v.oy + (f.gy - 40 * f.s) * v.k }; });
    await t('touchStart', [{ x: fire.x, y: fire.y }]); await p.waitForTimeout(60);
    { const dx = tg.x - fire.x, dy = tg.y - fire.y, d = Math.hypot(dx, dy); for (let i = 1; i <= 6; i++) { await t('touchMove', [{ x: fire.x + dx / d * 7 * i, y: fire.y + dy / d * 7 * i }]); await p.waitForTimeout(40); } } // empezar despacio = esfera
    const n = 8; for (let i = 1; i <= n; i++) { await t('touchMove', [{ x: fire.x + (tg.x - fire.x) * i / n * 0.75, y: fire.y + (tg.y - fire.y) * i / n * 0.75 }]); await p.waitForTimeout(16); }
    await t('touchEnd', []);
    const hp0 = await p.evaluate(() => G.foe.hp); await p.waitForTimeout(1200); return hp0 - await p.evaluate(() => G.foe.hp);
  };
  const d1 = await throwAt();
  await p.evaluate(() => { G.foe.shield = 1; G.foe.x = ARENA_W * 0.5; G.foe.y = ARENA_D * 0.25; G.foe.vx = G.foe.vy = 0; }); await p.waitForTimeout(500);
  const d2 = await throwAt();
  // salpicadura: deslizar rápido desde la llama hacia el rival
  await p.evaluate(() => { G.foe.shield = 0; G.foe.hp = 100; G.foe.x = ARENA_W * 0.5; G.foe.y = ARENA_D * 0.25; G.foe.vx = G.foe.vy = 0; G.orbs = []; }); await p.waitForTimeout(500);
  const sw = async () => { const tg = await p.evaluate(() => { const v = view(), f = G.foe; return { x: v.ox + f.gx * v.k, y: v.oy + (f.gy - 40 * f.s) * v.k }; });
    await t('touchStart', [{ x: fire.x, y: fire.y }]); await p.waitForTimeout(150); /* deja el dedo un momento y luego desliza rápido */ for (let i = 1; i <= 3; i++) { await t('touchMove', [{ x: fire.x + (tg.x - fire.x) * i * 0.4, y: fire.y + (tg.y - fire.y) * i * 0.4 }]); await p.waitForTimeout(8); } /* (los toques simulados llegan cada ~50 ms; en un celular cada ~10 ms) */
    await t('touchEnd', []); await p.waitForTimeout(30); const r = await p.evaluate(() => ({ s: G.splashes.length, o: G.orbs.length })); await p.waitForTimeout(900); return { ...r, d: 100 - await p.evaluate(() => G.foe.hp) }; }; // soltar pronto = salpicadura

  const s1 = await sw();
  // arrastrar rápido pero seguir arrastrando (sin soltar): sale la esfera, no la salpicadura
  await p.waitForTimeout(400); await p.evaluate(() => { G.orbs = []; G.splashes = []; });
  await t('touchStart', [{ x: fire.x, y: fire.y }]); for (let i = 1; i <= 3; i++) { await t('touchMove', [{ x: fire.x + i * 40, y: fire.y + i * 25 }]); await p.waitForTimeout(8); }
  for (let i = 1; i <= 6; i++) { await t('touchMove', [{ x: fire.x + 120 + i * 5, y: fire.y + 75 }]); await p.waitForTimeout(60); }
  const keep = await p.evaluate(() => ({ s: G.splashes.length, o: G.orbs.length })); await t('touchEnd', []); await p.waitForTimeout(600);
  console.log({ sigueArrastrando: keep });
  if (!(keep.o === 1 && keep.s === 0)) errs.push('seguir arrastrando no dio una esfera');
  console.log({ salpicadura: s1 });
  if (!(s1.s === 1 && s1.o === 0)) errs.push('deslizar rápido no hizo salpicadura');
  if (!(s1.d > 5)) errs.push('la salpicadura no dañó');
  console.log({ mid, full: full.toFixed(2), sinEscudo: d1.toFixed(1), conEscudo: d2.toFixed(1) });
  if (!(mid.flow > 0 && full > 0.4)) errs.push('no se formó el escudo');
  if (!(d1 > 5)) errs.push('el lanzamiento no dañó');
  if (!(d2 > 0 && d2 < d1 * 0.6)) errs.push('el escudo no redujo el daño');
  console.log(errs.length ? 'ERRORS: ' + errs.join(' | ') : 'no errors'); await b.close();
})();
