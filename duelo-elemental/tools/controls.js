// Prueba de los toques en la pelea: tocar = saltar (más largo, más alto), arrastrar = mover el brazo del lado del dedo, tocar un pozo o llama = el brazo se estira hacia allá y sigue al dedo; al soltar vuelve.
// Uso: node duelo-elemental/tools/controls.js
const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ ...devices['iPhone 13'] });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + require('path').resolve(__dirname, '..', 'index.html')); await p.waitForTimeout(300);
  await p.click('.elbtn[data-el="tierra"]');
  await p.evaluate(() => { document.getElementById('calib').hidden = true; G.phase = 'fight'; G.foe.wait = 99; });
  const c = await p.context().newCDPSession(p);
  const touch = (type, pts) => c.send('Input.dispatchTouchEvent', { type, touchPoints: pts });
  const maxZ = async () => p.evaluate(() => new Promise(r => { let m = 0; const t0 = performance.now(); const f = () => { m = Math.max(m, G.me.z); if (performance.now() - t0 < 1500) setTimeout(f, 16); else r(m); }; f(); }));
  // toque corto
  await touch('touchStart', [{ x: 300, y: 500, id: 1 }]); await p.waitForTimeout(30); await touch('touchEnd', []);
  const z1 = await maxZ();
  // toque más largo
  await touch('touchStart', [{ x: 300, y: 500, id: 1 }]); await p.waitForTimeout(300); const ch = await p.evaluate(() => G.me.charge); await p.waitForTimeout(150); await touch('touchEnd', []);
  const z2 = await maxZ(); await p.waitForTimeout(1500);
  // arrastrar en la mitad derecha: el brazo de la derecha sigue al dedo
  const before = await p.evaluate(() => { const N = G.me.nodes, a = [...G.me.ix.arms].sort((x, y) => N[x.sh].x - N[y.sh].x)[1]; return { x: N[a.ha].x, y: N[a.ha].y, rx: N[a.ha].x - N[a.sh].x, ry: N[a.ha].y - N[a.sh].y }; });
  await touch('touchStart', [{ x: 300, y: 500, id: 2 }]); for (let i = 1; i <= 12; i++) { await touch('touchMove', [{ x: 300 + i * 6, y: 500 - i * 8, id: 2 }]); await p.waitForTimeout(20); }
  await p.waitForTimeout(300);
  const during = await p.evaluate(() => { const N = G.me.nodes, a = G.me.ix.arms.find(x => x.ctl); return a ? { x: N[a.ha].x, y: N[a.ha].y, len: Math.hypot(N[a.ha].x - N[a.sh].x, N[a.ha].y - N[a.sh].y) } : null; });

  // y a la vez el otro lado
  await touch('touchMove', [{ x: 372, y: 404, id: 2 }, { x: 80, y: 500, id: 3 }]); await p.waitForTimeout(30);
  for (let i = 1; i <= 10; i++) { await touch('touchMove', [{ x: 372, y: 404, id: 2 }, { x: 80 - i * 5, y: 500 + i * 4, id: 3 }]); await p.waitForTimeout(20); }
  const both = await p.evaluate(() => G.me.ix.arms.filter(a => a.ctl).length);
  await touch('touchEnd', []); await p.waitForTimeout(1500);
  const after = await p.evaluate(() => ({ ctl: G.me.ix.arms.filter(a => a.ctl).length, z: G.me.z }));
  const back = await p.evaluate(() => { const N = G.me.nodes, a = [...G.me.ix.arms].sort((x, y) => N[x.sh].x - N[y.sh].x)[1]; return { rx: N[a.ha].x - N[a.sh].x, ry: N[a.ha].y - N[a.sh].y, mx: G.me.x, my: G.me.y }; });
  // tocar la llama de arriba a la izquierda: el brazo de la izquierda se estira hacia allá y sigue al dedo; no salta
  await p.waitForTimeout(800);
  const fire = await p.evaluate(() => { const f = arenaProps()[0], v = view(); return { x: v.ox + f.x * v.k, y: v.oy + (TOP + f.y * DEPTH - 20) * v.k }; });
  await touch('touchStart', [{ x: fire.x, y: fire.y, id: 4 }]); await p.waitForTimeout(400);
  const reach = await p.evaluate(() => { const N = G.me.nodes, a = G.me.ix.arms.find(x => x.ctl); if (!a) return null; const sh = N[a.sh], hn = N[a.ha], left = [...G.me.ix.arms].sort((x, y) => N[x.sh].x - N[y.sh].x)[0] === a; return { left, dx: hn.x - sh.x, dy: hn.y - sh.y, len: Math.hypot(hn.x - sh.x, hn.y - sh.y), z: G.me.z }; });
  await touch('touchMove', [{ x: fire.x + 150, y: fire.y, id: 4 }]); await p.waitForTimeout(400);
  const follow = await p.evaluate(() => { const N = G.me.nodes, a = G.me.ix.arms.find(x => x.ctl); return a ? N[a.ha].x - N[a.sh].x : null; });
  await touch('touchEnd', []); await p.waitForTimeout(600);
  const jumped = await p.evaluate(() => G.me.z > 0 || G.me.vz !== 0), freed = await p.evaluate(() => G.me.ix.arms.every(a => !a.ctl));
  console.log({ reach, follow, jumped, freed });
  if (!reach || !reach.left || !(reach.dx < -10 && reach.dy < -10)) errs.push('el brazo no se estiró hacia la llama');
  if (!(follow > reach.dx + 10)) errs.push('la mano no siguió al dedo');
  if (jumped || !freed) errs.push('saltó o el brazo no se soltó al tocar la llama');
  console.log({ z1: z1.toFixed(0), z2: z2.toFixed(0), charge: ch.toFixed(2), before, during, both, after, back });
  if (!(z1 > 5 && z2 > z1 * 2)) errs.push('salto no depende del toque');
  if (!during || !(during.x > before.x + 10 && during.y < before.y - 10)) errs.push('el brazo no siguió al dedo');
  if (both !== 2) errs.push('no se controlan los dos brazos a la vez');
  if (after.ctl !== 0 || Math.hypot(back.rx - before.rx, back.ry - before.ry) > 4) errs.push('el brazo no volvió');
  console.log(errs.length ? 'ERRORS: ' + errs.join(' | ') : 'no errors'); await b.close();
})();
