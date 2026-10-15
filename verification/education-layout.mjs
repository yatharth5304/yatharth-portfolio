import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
const baseline=process.argv.includes('--baseline');
const base=process.env.PORTFOLIO_PREVIEW_URL || 'http://127.0.0.1:4174/';
const out=new URL('./artifacts/education/',import.meta.url);await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,args:['--enable-unsafe-swiftshader']});
const report={base,views:[],errors:[],failed:[]};
const sizes=baseline?[{width:1365,height:768}]:[{width:1365,height:768},{width:1440,height:900},{width:1920,height:1080},{width:820,height:1180},{width:390,height:844},{width:320,height:740}].filter(size=>(!process.argv.includes('--remaining')||size.width!==1365&&size.width!==1440)&&(!process.argv.includes('--phones')||size.width<600));
try{
 for(const size of sizes){
  console.log('Testing education',size);
  const page=await browser.newPage({viewport:size,deviceScaleFactor:1,isMobile:size.width<=1024,hasTouch:size.width<=1024});
  page.on('pageerror',e=>report.errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
  page.on('requestfailed',r=>{if(!(r.resourceType()==='media'&&r.failure()?.errorText==='net::ERR_ABORTED'))report.failed.push({url:r.url(),failure:r.failure()});});
  await page.goto(base,{waitUntil:'domcontentloaded',timeout:60000});
  await page.locator('.portfolio-details').waitFor({timeout:60000});
  if(size.width>1024)await page.waitForFunction(()=>window.__portfolio3D?.frames>10,null,{timeout:120000});
  await page.locator('.loading-screen').waitFor({state:'detached',timeout:60000});
  await page.evaluate(()=>document.fonts.ready);
  const top=await page.locator('.portfolio-details').evaluate(n=>n.getBoundingClientRect().top+scrollY);
  await page.evaluate(top=>window.scrollTo({top,behavior:'instant'}),top);
  await page.waitForTimeout(2200);
  const metrics=await page.evaluate(()=>{
   const section=document.querySelector('.portfolio-details');
   const rect=n=>n.getBoundingClientRect().toJSON();
   const css=n=>{const s=getComputedStyle(n);return {marginLeft:s.marginLeft,marginRight:s.marginRight,padding:s.padding,width:s.width,maxWidth:s.maxWidth,columns:s.gridTemplateColumns,gap:s.gap,font:s.font,color:s.color,borderTop:s.borderTop};};
   return {section:rect(section),styles:css(section),heading:rect(section.querySelector('h2')),subtitle:rect(section.querySelector('h2+p')),text:section.textContent.replace(/\s+/g,' ').trim(),stats:[...section.querySelectorAll('.portfolio-stats p')].map(rect),principles:[...section.querySelectorAll('.portfolio-principles article')].map(rect),grids:[...section.querySelectorAll('.portfolio-stats,.portfolio-principles')].map(css),approved:[...document.querySelectorAll('.career-section,.work-container,.contact-section')].map(n=>({name:n.className,rect:rect(n),styles:css(n)})),overflow:document.documentElement.scrollWidth>innerWidth,controls:[...document.querySelectorAll('.social-icons a,.resume-button')].map(n=>({href:n.getAttribute('href'),target:n.getAttribute('target'),rect:rect(n),visible:getComputedStyle(n).display!=='none'&&n.getClientRects().length>0}))};
  });
  report.views.push({size,...metrics});
  const path=new URL(`${baseline?'before':'after'}-${size.width}.png`,out).pathname.slice(1);
  await page.screenshot({path,timeout:60000});
  if(!baseline){
   const approved=metrics.approved.find(n=>n.name.includes('contact-section')).rect;
   assert(Math.abs(metrics.section.left-approved.left)<1 && Math.abs(metrics.section.width-approved.width)<1,'Section must use approved content bounds');
   if(size.width===1365){
    const before=JSON.parse(await readFile(new URL('./baseline.json',out),'utf8')).views[0];
    assert.deepEqual(metrics.approved.map(n=>({name:n.name,styles:n.styles})),before.approved.map(n=>({name:n.name,styles:n.styles})),'Approved section styles remain unchanged');
   }
   assert(metrics.section.left>=15 && !metrics.overflow,'Gutters and document overflow');
   assert(Math.abs(metrics.heading.left-metrics.section.left)<1 && Math.abs(metrics.subtitle.left-metrics.section.left)<1,'Heading and education alignment');
   assert.equal(metrics.stats.length,4);assert.equal(metrics.principles.length,4);
   assert.equal(metrics.grids[0].columns.split(' ').length,size.width>1024?4:2);
   assert.equal(metrics.grids[1].columns.split(' ').length,size.width>900?2:1);
   assert([...metrics.stats,...metrics.principles].every(r=>r.left>=metrics.section.left-1 && r.right<=metrics.section.right+1),'Grid inside section');
   if(size.width<600){const resume=metrics.controls.find(c=>c.href==='/resume').rect;assert(metrics.principles.every(r=>r.right<=resume.left-6),'Phone content clears fixed resume rail');}
   const content=JSON.parse(await readFile(new URL('./baseline-content.json',out),'utf8'));
   assert.equal(metrics.text,content.text,'Preserve all section content exactly');
   assert.equal(await page.locator('.resume-button').getAttribute('href'),'/resume');
   assert.equal(await page.locator('.resume-button').getAttribute('target'),'_blank');
   await page.locator('.resume-button').hover();
   assert.equal(await page.locator('.resume-button').evaluate(n=>{const r=n.getBoundingClientRect();const hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return n.contains(hit);}),true,'Resume shortcut remains reachable');
   if(size.width>=900){
    for(const social of await page.locator('.social-icons a').all()){
     assert((await social.getAttribute('href')).startsWith('https://'));
     await social.hover();
     assert(await social.evaluate(n=>{const r=n.getBoundingClientRect();return n.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));}),'Social link remains reachable');
    }
   }
  }else await writeFile(new URL('baseline-content.json',out),JSON.stringify({text:metrics.text},null,2));
  await writeFile(new URL(`${baseline?'before':'verified'}-${size.width}.json`,out),JSON.stringify({size,...metrics,passed:true,errors:report.errors,failed:report.failed},null,2));
  await page.close();console.log('Captured education',size);
 }
 if(!baseline){assert.equal(report.errors.length,0,JSON.stringify(report.errors));assert.equal(report.failed.length,0,JSON.stringify(report.failed));}
}catch(e){report.failure=e.stack;console.error(e);process.exitCode=1;}
finally{await writeFile(new URL(baseline?'baseline.json':'report.json',out),JSON.stringify(report,null,2));await browser.close();}
