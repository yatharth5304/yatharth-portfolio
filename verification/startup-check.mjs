// Run against serve-production.mjs. Pause startup at its real network boundaries
// to verify the shell, handoff, API fallback and direct route independently.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.PORTFOLIO_PREVIEW_URL || 'http://127.0.0.1:4174/';
const out = new URL('./artifacts/startup/', import.meta.url);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || (process.platform === 'win32' ? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' : undefined),
  headless: true, args: ['--enable-unsafe-swiftshader'],
});
const report = { cases: [], errors: [], failed: [] };
const gate = () => { let release; const promise = new Promise(resolve => { release = resolve; }); return { promise, release }; };
async function capture(page, name) {
  // Unlike page.screenshot, DevTools does not wait for fonts/document load,
  // which are deliberately paused by the early-startup checks.
  const session = await page.context().newCDPSession(page);
  const { data } = await session.send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  await writeFile(new URL(name + '.png', out), Buffer.from(data, 'base64'));
  await session.detach();
}

try {
  for (const scenario of [
    { name: 'desktop-delayed', width: 1365, height: 768, delayed: true },
    { name: 'mobile-timeout', width: 390, height: 844, timeout: true },
    { name: 'tablet-api-error', width: 820, height: 1180, error: true },
    { name: 'works-direct', width: 1440, height: 900, path: '/myworks', delayed: true },
    { name: 'mobile-reduced-motion', width: 320, height: 740, reduced: true },
  ]) {
    const context = await browser.newContext({ viewport: { width: scenario.width, height: scenario.height }, reducedMotion: scenario.reduced ? 'reduce' : 'no-preference', isMobile: scenario.width <= 1024, hasTouch: scenario.width <= 1024 });
    await context.addInitScript(() => {
      window.__startupAudit = { sawShell: false, emptyFrames: 0 };
      const sample = () => {
        const audit = window.__startupAudit;
        const shell = document.getElementById('startup-loader');
        if (shell) audit.sawShell = true;
        if (audit.sawShell && !shell && !document.querySelector('.loading-screen,.portfolio-details,.myworks-page')) audit.emptyFrames++;
        requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
    const page = await context.newPage();
    page.on('pageerror', error => report.errors.push({ case: scenario.name, message: error.message }));
    page.on('console', message => {
      if (message.type() !== 'error') return;
      if ((scenario.timeout || scenario.error) && message.location().url.includes('/api/')) return;
      report.errors.push({ case: scenario.name, message: message.text() });
    });
    page.on('requestfailed', request => {
      if (scenario.timeout && request.url().includes('/api/')) return;
      if (request.resourceType() === 'media' && request.failure()?.errorText === 'net::ERR_ABORTED') return;
      report.failed.push({ case: scenario.name, url: request.url(), failure: request.failure() });
    });
    const scripts = gate(), data = gate(), routeChunk = gate();
    await page.route('**/assets/*.js', async route => {
      await scripts.promise;
      if (route.request().url().includes(scenario.path ? '/MyWorks-' : '/MainContainer-')) await routeChunk.promise;
      await route.continue();
    });
    await page.route('**/api/**', async route => {
      await data.promise;
      if (scenario.timeout) {
        await new Promise(resolve => setTimeout(resolve, 7000));
        try { await route.continue(); } catch { /* AbortSignal timeout is expected. */ }
      } else if (scenario.error) await route.fulfill({status:503, contentType:'application/json', body:'{}'});
      else await route.continue();
    });
    await page.goto(new URL(scenario.path || '/', base).href, { waitUntil: 'commit' });
    await page.locator('#startup-loader').waitFor({ state: 'visible' });
    assert.equal(await page.locator('#root').innerText(), '');
    if (scenario.name === 'desktop-delayed') {
      for (const width of [1365, 1440, 1920, 820, 390, 320]) {
        await page.setViewportSize({ width, height: scenario.height });
        const bounds = await page.locator('.startup-pill').boundingBox();
        assert(bounds.x >= 0 && bounds.x + bounds.width <= width, 'Pill must fit the viewport');
        await capture(page, `initial-${width}`);
      }
      await page.setViewportSize({ width: scenario.width, height: scenario.height });
    }
    if (scenario.reduced) assert.equal(await page.locator('.startup-track').first().evaluate(n => getComputedStyle(n).animationName), 'none');
    await page.waitForTimeout(500);
    const paint = await page.evaluate(() => performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null);
    const apiRequested = page.waitForRequest(request => request.url().includes('/api/'));
    scripts.release();
    await apiRequested;
    if (scenario.delayed) {
      await page.waitForTimeout(750);
      assert(await page.locator('#startup-loader').isVisible(), 'Keep shell during the API wait');
      assert.equal(await page.locator('.portfolio-details,.myworks-page').count(), 0, 'Do not reveal content before data');
      data.release();
      await page.waitForFunction(() => Boolean(document.documentElement.dataset.contentSource));
      await page.waitForTimeout(500);
      assert(await page.locator('#startup-loader').isVisible(), 'Keep shell while the lazy route chunk is delayed');
      await capture(page, scenario.name + '-waiting-for-route');
      routeChunk.release();
    } else { routeChunk.release(); data.release(); }
    await page.locator('#startup-loader').waitFor({state:'detached', timeout:30000});
    assert.equal(await page.locator('html').getAttribute('data-content-source'), scenario.timeout || scenario.error ? 'verified-fallback' : 'api');
    if (scenario.path) {
      await page.locator('.myworks-page').waitFor({state:'visible'});
      assert.equal(await page.locator('.myworks-card').count(), 7);
      await page.locator('.back-button').click();
      await page.locator('.portfolio-details').waitFor({state:'attached'});
    }
    if (scenario.width > 1024) {
      await page.locator('.loading-screen').waitFor({state:'visible'});
      await capture(page, scenario.name + '-react-loader');
      await page.waitForFunction(() => window.__portfolio3D?.frames > 10, null, {timeout:120000});
      await page.locator('.loading-screen').waitFor({state:'detached',timeout:120000});
    } else assert.equal(await page.locator('.loading-screen').count(),0);
    await page.locator('.portfolio-details').waitFor({state:'attached'});
    await page.waitForTimeout(1500);
    assert.equal(await page.locator('.resume-button').getAttribute('href'), '/resume');
    const audit = await page.evaluate(() => window.__startupAudit);
    assert(audit.sawShell && audit.emptyFrames === 0, 'No empty frame between startup and the app');
    await capture(page, scenario.name + '-loaded');
    report.cases.push({name:scenario.name,viewport:`${scenario.width}x${scenario.height}`,firstContentfulPaintMs:paint,...audit,passed:true});
    console.log('Passed', scenario.name);
    await context.close();
  }
  const context = await browser.newContext({ javaScriptEnabled:false, viewport:{width:390,height:844} });
  const page = await context.newPage();
  await page.goto(base);
  assert.equal(await page.locator('#startup-loader').isVisible(),false, 'No endless loader with JavaScript disabled');
  assert(await page.locator('noscript a[href="/resume"]').isVisible());
  report.cases.push({name:'no-javascript-fallback',passed:true});
  await context.close();
  assert.equal(report.errors.length,0,JSON.stringify(report.errors));
  assert.equal(report.failed.length,0,JSON.stringify(report.failed));
} catch (error) { report.failure = error.stack; process.exitCode = 1; console.error(error); }
finally { await writeFile(new URL('report.json',out),JSON.stringify(report,null,2)); await browser.close(); }
