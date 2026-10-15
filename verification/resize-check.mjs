import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,args:['--enable-unsafe-swiftshader']});
const report={errors:[]};
try {
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
 page.on('pageerror',e=>report.errors.push(e.message));
 await page.goto('http://127.0.0.1:4174/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__portfolio3D?.frames>30,null,{timeout:90000});
 await page.locator('.loading-screen').waitFor({state:'detached'});
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(800);
 assert.equal(await page.locator('.character-model canvas').count(),0);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 report.mobile='Desktop scene unmounted; layout fits';
 await page.setViewportSize({width:1920,height:1080});
 await page.waitForFunction(()=>window.__portfolio3D?.frames>30,null,{timeout:90000});
 assert.equal(await page.locator('.character-model canvas').count(),1);
 assert(await page.evaluate(()=>window.__portfolio3D.character.getObjectByName('EYEs001').material.map.image.width===1024));
 report.desktop='One scene remounted; original eye texture decoded';
 await page.locator('.header a[data-href="#work"]').click();await page.waitForTimeout(2000);
 const before=await page.locator('.work-flex').evaluate(n=>getComputedStyle(n).transform);
 await page.mouse.wheel(0,400);await page.waitForTimeout(2200);
 const after=await page.locator('.work-flex').evaluate(n=>getComputedStyle(n).transform);
 assert.notEqual(before,after);report.horizontalWork={before,after};
 await page.locator('.header a[data-href="#contact"]').click();await page.waitForTimeout(2200);
 const bottom=await page.evaluate(()=>scrollY);
 await page.locator('.header a[data-href="#about"]').click();await page.waitForTimeout(2000);
 const about=await page.evaluate(()=>scrollY);assert(Math.abs(about-1080)<8);assert(bottom>about+2000);
 report.reverseNavigation={from:bottom,to:about};
 assert.equal(report.errors.length,0);
 console.log(JSON.stringify(report));
}catch(e){report.failure=e.stack;console.error(e);process.exitCode=1;}
finally{await writeFile(new URL('./artifacts/fidelity/resize-report.json',import.meta.url),JSON.stringify(report,null,2));await browser.close();}
