import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const out = new URL('./artifacts/fidelity/', import.meta.url);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true, args: ['--enable-unsafe-swiftshader'] });
const report = {};
try {
  const sizes = process.argv[3] === 'remaining' ? [{width:1920,height:1080},{width:390,height:844}] : [{width:1440,height:900}];
  for (const [name, url, size] of [['reference', 'https://www.redoyanulhaque.me/'], ['deployed', 'https://yatharthm.is-a.dev/']].filter(([name]) => !process.argv[2] || name === process.argv[2]).flatMap(([name,url])=>sizes.map(size=>[name,url,size]))) {
    console.log('Capturing',name,size);
    const page = await browser.newPage({ viewport: size, deviceScaleFactor: 1, isMobile:size.width<=1024, hasTouch:size.width<=1024 });
    const key = `${name}-${size.width}`;
    report[key] = { errors: [], failed: [], responses:[] };
    report[name] = report[key];
    page.on('response', r => { report[key].responses.push({url:r.url(),status:r.status()}); });
    page.on('pageerror', e => report[name].errors.push(e.message));
    page.on('console', m => { if (['error', 'warning'].includes(m.type())) report[name].errors.push(m.text()); });
    page.on('requestfailed', r => report[name].failed.push({ url: r.url(), error: r.failure() }));
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.locator('.landing-intro').waitFor({timeout:45000});
    try { await page.locator('.loading-screen').waitFor({ state: 'detached', timeout: 120000 }); }
    catch { await page.screenshot({path:new URL(`${name}-loader.png`,out).pathname.slice(1)}); report[name].loader = await page.locator('.loading-screen').innerText(); continue; }
    await page.waitForTimeout(6500);
    await page.mouse.move(720, 450);
    await page.waitForTimeout(1000);
    await page.screenshot({ path: new URL(`${name}-before-hero-${size.width}.png`, out).pathname.slice(1) });
    report[name].hero = await page.evaluate(() => {
      const s = window.__portfolio3D;
      const data = { width: innerWidth, height: innerHeight, headings: [...document.querySelectorAll('.landing-intro,.landing-info')].map(n => ({ text: n.textContent, rect: n.getBoundingClientRect().toJSON() })) };
      if (s) {
        data.meshes = [];
        s.character.traverse(m => { if (m.isMesh) data.meshes.push({ name: m.name, parent: m.parent.name, visible: m.visible, position: m.position.toArray(), scale: m.scale.toArray(), material: (Array.isArray(m.material) ? m.material : [m.material]).map(mat => ({ uuid: mat.uuid, name: mat.name, color: mat.color?.getHexString(), opacity: mat.opacity, depthWrite: mat.depthWrite, map: mat.map ? { uuid: mat.map.uuid, image: { width: mat.map.image?.width, height: mat.map.image?.height }, colorSpace: mat.map.colorSpace, flipY: mat.map.flipY, channel: mat.map.channel } : null })) }); });
        data.camera = { position: s.camera.position.toArray(), fov: s.camera.fov, zoom: s.camera.zoom };
      }
      return data;
    });
    for (const [section, selector] of [['about', '.about-section'], ['desktop', '.whatIDO'], ['career', '.career-section'], ['work', '.work-section'], ['tech', '.techstack-new'], ['contact', '.contact-section']]) {
      if (!await page.locator(selector).count()) continue;
      const y = await page.locator(selector).evaluate(n => n.getBoundingClientRect().top + scrollY);
      await page.evaluate(y => window.scrollTo({top:y, behavior:'instant'}), y);
      await page.waitForTimeout(2300);
      await page.screenshot({ path: new URL(`${name}-before-${section}-${size.width}.png`, out).pathname.slice(1) });
    }
    console.log('Captured',name,size,'errors:',report[name].errors.length,'failed:',report[name].failed.length);
    await page.close();
  }
} finally {
  await writeFile(new URL(`baseline-${process.argv[2] || 'remote'}${process.argv[3] ? '-'+process.argv[3] : ''}.json`, out), JSON.stringify(report, null, 2));
  await browser.close();
}
