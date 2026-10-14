import { chromium } from 'playwright';
const browser = await chromium.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: true,
});
try {
  for (const device of [{ name: 'mobile', width: 390, height: 844 }, { name: 'tablet', width: 820, height: 1180 }]) {
    const page = await browser.newPage({ viewport: { width: device.width, height: device.height }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    await page.goto(process.env.PORTFOLIO_PREVIEW_URL || 'http://127.0.0.1:8080/', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => getComputedStyle(document.body).overflowY === 'auto');
    await page.waitForTimeout(8000);
    await page.screenshot({ path: `artifacts/local-${device.name}-hero.png` });
    console.log(device.name, await page.locator('.landing-intro').innerText());
    await page.close();
  }
} finally { await browser.close(); }
