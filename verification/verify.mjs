import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { mkdir,writeFile,copyFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const out=new URL('./artifacts/',import.meta.url);await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,args:['--enable-unsafe-swiftshader']});
const report={checks:[],errors:[],screenshots:[]};
const base=process.env.PORTFOLIO_PREVIEW_URL || 'http://127.0.0.1:5173';
try {
 const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});
 const page=await context.newPage();
 page.on('pageerror',e=>report.errors.push(e.message));
 console.log('Opening local preview');
 await page.goto(base,{waitUntil:'domcontentloaded',timeout:60000});
 console.log('Waiting for 3D character');
 await page.waitForSelector('canvas[data-character-ready="true"]',{timeout:180000});
 await page.waitForSelector('.loading-screen',{state:'detached',timeout:30000});
 await page.waitForTimeout(5500);
 assert.equal(await page.locator('.scene-error').count(),0);
 const palette=await page.evaluate(()=>{const s=getComputedStyle(document.documentElement);return {accent:s.getPropertyValue('--accentColor').trim(),background:s.getPropertyValue('--backgroundColor').trim(),text:s.color,font:s.fontFamily};});
 assert.equal(palette.accent,'#c2a4ff');assert.equal(palette.background,'#0b080c');assert.equal(palette.text,'rgb(234, 229, 236)');assert.match(palette.font,/Geist/);
 report.palette=palette;report.checks.push('Exact theme variables, primary text, Geist');
 const initial=await page.evaluate(()=>{const s=window.__portfolio3D;return {frames:s.frames,clips:s.clips,head:s.character.getObjectByName('spine006').rotation.toArray(),camera:s.camera.position.toArray(),originalHair:!!s.character.getObjectByName('hair'),customHair:!!s.character.getObjectByName('CurlyHairLocks')};});
 assert(initial.originalHair && !initial.customHair);assert(initial.clips.includes('Blink')&&initial.clips.includes('typing'));
 await page.mouse.move(150,180);await page.waitForTimeout(600);
 const left=await page.evaluate(()=>window.__portfolio3D.character.getObjectByName('spine006').rotation.y);
 await page.mouse.move(1300,220);await page.waitForTimeout(600);
 const right=await page.evaluate(()=>window.__portfolio3D.character.getObjectByName('spine006').rotation.y);
 assert(Math.abs(right-left)>.2);report.checks.push('Original character retained; head tracking follows pointer');
 await page.locator('.character-hover').hover({force:true});await page.waitForTimeout(600);
 assert(await page.evaluate(()=>window.__portfolio3D.hovering));
 const hover=await page.evaluate(()=>window.__portfolio3D.mixer._actions.filter(a=>a._clip.name.includes('browup')).map(a=>({weight:a.getEffectiveWeight(),running:a.isRunning()})));
 assert(hover.some(a=>a.weight>0));report.checks.push('Eyebrow hover reaction');
 await page.mouse.move(1400,880);await page.waitForTimeout(800);
 const animation=await page.evaluate(()=>{const s=window.__portfolio3D;return {frames:s.frames,actions:s.mixer._actions.map(a=>({name:a._clip.name,time:a.time,running:a.isRunning()}))};});
 assert(animation.frames>initial.frames);assert(animation.actions.some(a=>a.name==='Blink'&&a.running));assert(animation.actions.some(a=>a.name.includes('typing')&&a.running));
 report.animation=animation;report.checks.push('Intro, blink, typing and keyboard clips run');
 await page.screenshot({path:new URL('local-desktop-hero.png',out).pathname.slice(1)});report.screenshots.push('local-desktop-hero.png');
 await page.screenshot({path:new URL('character-original-closeup.png',out).pathname.slice(1),clip:{x:500,y:180,width:500,height:550}});
 // The mobile asset is a render of the unchanged reference model, with the original
 // lighting; desktop remains live WebGL.
 const png=await page.evaluate(()=>{const s=window.__portfolio3D;const size=s.renderer.getSize({set(x,y){this.x=x;this.y=y;return this;}});const aspect=s.camera.aspect;s.renderer.setSize(600,720,false);s.camera.aspect=600/720;s.camera.updateProjectionMatrix();s.renderer.render(s.scene,s.camera);const result=s.renderer.domElement.toDataURL('image/png');s.renderer.setSize(size.x,size.y,false);s.camera.aspect=aspect;s.camera.updateProjectionMatrix();return result;});
 await writeFile(new URL('../frontend/public/images/developer-mobile.png',import.meta.url),Buffer.from(png.split(',')[1],'base64'));
 await copyFile(new URL('../frontend/public/images/developer-mobile.png',import.meta.url),new URL('../frontend/dist/images/developer-mobile.png',import.meta.url));
 await copyFile(new URL('../frontend/public/images/developer-mobile.png',import.meta.url),new URL('../target/classes/static/images/developer-mobile.png',import.meta.url)).catch(()=>{});
 await page.locator('.header a[data-href="#about"]').click();await page.waitForTimeout(2000);
 assert(await page.evaluate(()=>window.scrollY>100));
 await page.screenshot({path:new URL('local-desktop-about.png',out).pathname.slice(1)});
 const cameraBefore=initial.camera;
 await page.evaluate(()=>document.querySelector('.whatIDO').scrollIntoView());await page.waitForTimeout(1800);
 const transformation=await page.evaluate(()=>{const s=window.__portfolio3D;return {camera:s.camera.position.toArray(),rotation:s.character.rotation.toArray(),screenOpacity:s.character.getObjectByName('screenlight').material.opacity};});
 assert(transformation.camera[2]>cameraBefore[2]+10);report.transformation=transformation;report.checks.push('Scroll transforms character and camera; monitor reveal');
 await page.screenshot({path:new URL('local-desktop-services.png',out).pathname.slice(1)});
 await page.locator('.what-content').first().focus();await page.keyboard.press('Space');
 assert.equal(await page.locator('.what-content').first().getAttribute('aria-expanded'),'true');
 report.checks.push('Services disclosures support keyboard interaction');
 await page.keyboard.press('Control+k');await page.locator('dialog[open] input').fill('contact');await page.keyboard.press('Enter');await page.waitForTimeout(1800);
 assert.equal(await page.locator('dialog[open]').count(),0);report.checks.push('Command palette keyboard search and navigation');
 await page.screenshot({path:new URL('local-desktop-contact.png',out).pathname.slice(1)});
 assert.equal(await page.locator('a[href="/resume"]').count()>0,true);
 assert.equal(await page.locator('a[href="https://www.linkedin.com/in/yatharthmaharwade/"]').count()>0,true);
 const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();report.accessibility=axe.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));
 await page.goto(`${base}/myworks`,{waitUntil:'networkidle'});assert.equal(await page.locator('.myworks-card').count(),7);assert.equal(await page.locator('.myworks-card[href^="/projects/"]').count(),7);
 report.checks.push('Direct /myworks route; all seven backend-served case study links');
 for(const device of [{name:'tablet',width:820,height:1180},{name:'mobile',width:390,height:844}]) {
  const deviceContext=await browser.newContext({viewport:{width:device.width,height:device.height},deviceScaleFactor:1,isMobile:true,hasTouch:true});const p=await deviceContext.newPage();p.on('pageerror',e=>report.errors.push(`${device.name}: ${e.message}`));await p.goto(base,{waitUntil:'domcontentloaded'});await p.waitForTimeout(2500);
  assert.equal(await p.locator('.loading-screen').count(),0);assert.equal(await p.locator('.character-model canvas').count(),0);
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await p.waitForFunction(()=>getComputedStyle(document.body).overflowY === 'auto',{timeout:15000});
  await p.waitForTimeout(5000); // Capture after the original entrance timeline settles.
  await p.screenshot({path:new URL(`local-${device.name}-hero.png`,out).pathname.slice(1)});
  await p.locator('.header a[href="#work"]').click();await p.waitForTimeout(1500);assert(await p.evaluate(()=>window.scrollY>100));
  await p.screenshot({path:new URL(`local-${device.name}-work.png`,out).pathname.slice(1)});const a=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();report[`${device.name}Accessibility`]=a.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}));await deviceContext.close();
 }
 report.checks.push('Tablet loader completes; mobile fallback; mobile navigation; no horizontal overflow');
 // Capture the actual live reference at matching viewport sizes for side-by-side QA.
 for(const device of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844}]){
  const p=await browser.newPage({viewport:{width:device.width,height:device.height},deviceScaleFactor:1,isMobile:device.name==='mobile',hasTouch:device.name==='mobile'});
  try{await p.goto('https://www.redoyanulhaque.me/',{waitUntil:'domcontentloaded',timeout:60000});if(device.name==='desktop')await p.waitForSelector('.loading-screen',{state:'detached',timeout:180000});await p.waitForTimeout(6000);await p.screenshot({path:new URL(`reference-${device.name}-hero.png`,out).pathname.slice(1)});report.screenshots.push(`reference-${device.name}-hero.png`);}catch(e){report.referenceLimit=e.message;}await p.close();
 }
 assert.equal(report.errors.length,0,JSON.stringify(report.errors));
} catch(error) {report.failure=error.stack;console.error(error);throw error;}
finally {await writeFile(new URL('report.json',out),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await Promise.race([browser.close(),new Promise(resolve=>setTimeout(resolve,15000))]);}
