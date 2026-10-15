import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const out = new URL('./artifacts/fidelity/', import.meta.url);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless:true, args:['--enable-unsafe-swiftshader'] });
const report = { environment:'Production Vite build; unmodified Spring CSP; verified snapshot API fixture', checks:[], views:[], errors:[], failed:[] };
const url = process.env.PORTFOLIO_PREVIEW_URL || 'http://127.0.0.1:4174/';
const sizes = [{width:1440,height:900},{width:1920,height:1080},{width:390,height:844},{width:820,height:1180}];
try {
  for (const size of sizes.filter(size=>!process.argv[2] || (process.argv[2]==='remaining' ? size.width!==1440 : size.width===Number(process.argv[2])))) {
    console.log('Testing', size);
    const mobile = size.width <= 1024;
    const page = await browser.newPage({viewport:size,deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile});
    try {
    page.on('pageerror',e=>report.errors.push({size,...{message:e.message}}));
    page.on('console',m=>{if(m.type()==='error')report.errors.push({size,message:m.text()});});
    page.on('requestfailed',r=>{const failure={url:r.url(),reason:r.failure()};if(r.resourceType()==='media' && r.failure()?.errorText==='net::ERR_ABORTED')(report.cancelledMedia ||= []).push(failure);else report.failed.push(failure);});
    const response = await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
    assert(response.ok());
    const csp = response.headers()['content-security-policy'];
    assert(csp.includes("connect-src 'self';"));
    assert(!csp.includes("connect-src 'self' blob:"));
    await page.locator('.landing-intro').waitFor({timeout:45000});
    if(!mobile){await page.waitForFunction(()=>window.__portfolio3D?.frames>30 || document.querySelector('.scene-error'),null,{timeout:90000});assert.equal(await page.locator('.scene-error').count(),0,await page.locator('.scene-error').allTextContents().then(x=>x.join(' ')));}
    await page.locator('.loading-screen').waitFor({state:'detached',timeout:90000});
    await page.waitForTimeout(6500);
    const prefix = `corrected-${size.width}x${size.height}`;
    const view = {size,csp,screenshots:[],sections:[]};
    report.views.push(view);
    const shot = async name => {const file=`${prefix}-${name}.png`;await page.screenshot({path:new URL(file,out).pathname.slice(1),timeout:60000});view.screenshots.push(file);};
    if(!mobile){await page.mouse.move(size.width*.5,size.height*.5);await page.waitForTimeout(600);}
    await shot('hero');
    const headings = await page.locator('.landing-intro h1,.landing-info').evaluateAll(nodes=>nodes.map(n=>({text:n.textContent,rect:n.getBoundingClientRect().toJSON(),scrollWidth:n.scrollWidth,clientWidth:n.clientWidth})));
    assert(headings.every(h=>h.rect.left>=0 && h.rect.right<=size.width+1 && h.scrollWidth<=h.clientWidth+1),JSON.stringify(headings));
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Horizontal overflow');
    view.headings=headings;
    if(!mobile){
      view.scene = await page.evaluate(()=>{const s=window.__portfolio3D;const e=s.character.getObjectByName('EYEs001');const g=s.character.getObjectByName('screenlight');return {camera:{position:s.camera.position.toArray(),fov:s.camera.fov,zoom:s.camera.zoom},eyes:{skinned:e.isSkinnedMesh,visible:e.visible,map:e.material.map?.image?.width,opaque:e.material.opacity===1},glow:{width:g.material.map?.image?.width,height:g.material.map?.image?.height},clips:s.clips};});
      assert(view.scene.eyes.skinned && view.scene.eyes.visible && view.scene.eyes.map===1024 && view.scene.eyes.opaque);
      assert.equal(view.scene.glow.width,800);assert.equal(view.scene.glow.height,800);
      if (size.width === 1440 && process.env.RENDER_MOBILE === '1') {
        const png = await page.evaluate(() => {
          const s = window.__portfolio3D;
          const blink = s.mixer._actions.find(a=>a._clip.name==='Blink');
          const oldTime = blink.time, oldPause = blink.paused;
          blink.time=0; blink.paused=true; s.mixer.update(0);
          const head=s.character.getObjectByName('spine006');
          const oldRotation=head.rotation.clone(); head.rotation.set(-Math.PI/12,0,0);
          const width=s.renderer.domElement.width, height=s.renderer.domElement.height, aspect=s.camera.aspect;
          s.renderer.setSize(600,720,false);s.camera.aspect=600/720;s.camera.updateProjectionMatrix();
          s.renderer.render(s.scene,s.camera);const png=s.renderer.domElement.toDataURL('image/png');
          s.renderer.setSize(width,height,false);s.camera.aspect=aspect;s.camera.updateProjectionMatrix();
          head.rotation.copy(oldRotation);blink.time=oldTime;blink.paused=oldPause;
          return png;
        });
        for (const file of ['../frontend/public/images/developer-mobile.png','../frontend/dist/images/developer-mobile.png']) await writeFile(new URL(file,import.meta.url),Buffer.from(png.split(',')[1],'base64'));
        console.log('Rendered open-eye mobile fallback');
      }
      const angles=[];
      for(const x of [size.width*.12,size.width*.88]){
        await page.mouse.move(x,size.height*.35);await page.waitForTimeout(500);
        angles.push(await page.evaluate(()=>window.__portfolio3D.character.getObjectByName('spine006').rotation.y));
      }
      assert(Math.abs(angles[1]-angles[0])>.2);view.headTracking=angles;
      await page.locator('.character-hover').hover({force:true});await page.waitForTimeout(600);
      assert(await page.evaluate(()=>window.__portfolio3D.mixer._actions.some(a=>a._clip.name.includes('browup')&&a.getEffectiveWeight()>0)));
      await shot('face-hover');
      const active=await page.evaluate(()=>window.__portfolio3D.mixer._actions.filter(a=>a.isRunning()).map(a=>a._clip.name));
      assert(active.includes('Blink') && active.some(n=>n.includes('typing')));view.activeClips=active;
      await page.mouse.move(size.width-50,100);
    } else assert.equal(await page.locator('.character-model canvas').count(),0);
    for(const [name,selector] of [['about','.about-section'],['desktop','.whatIDO'],['career','.career-section'],['work','.work-section'],['stack','.techstack-new'],['education','.portfolio-details'],['contact','.contact-section']]){
      const top=await page.locator(selector).evaluate(n=>n.getBoundingClientRect().top+scrollY);
      await page.evaluate(top=>window.scrollTo({top,behavior:'instant'}),top);
      await page.waitForTimeout(2300);
      if(name==='desktop')await page.waitForFunction(()=>[...document.querySelectorAll('.what-content-in')].every(node=>Number(getComputedStyle(node).opacity)>.99),null,{timeout:10000});
      await shot(name);
      view.sections.push({name,top,text:await page.locator(selector).innerText()});
      if(name==='desktop'){
        if(!mobile){view.desktop=await page.evaluate(()=>{const s=window.__portfolio3D;return {camera:s.camera.position.toArray(),monitor:s.character.getObjectByName('DesktopMonitor').position.toArray(),parts:s.character.getObjectByName('Plane004').children.map(c=>({material:c.material.name,opacity:c.material.opacity})),glow:s.character.getObjectByName('screenlight').material.opacity};});assert(view.desktop.parts.every(p=>p.opacity>.99));assert(view.desktop.glow>.99);}
        await page.locator('.what-content').first().click({force:true});assert.equal(await page.locator('.what-content').first().getAttribute('aria-expanded'),'true');
      }
    }
    const expectedTop=await page.locator('#about').evaluate(target=>{let top=0;for(let node=target;node;node=node.offsetParent)top+=node.offsetTop;return top;});
    await page.locator('.header a[data-href="#about"]').click();await page.waitForTimeout(1800);
    view.navigation={expectedTop,actual:await page.evaluate(()=>scrollY)};
    assert(Math.abs(view.navigation.actual-expectedTop)<8,JSON.stringify(view.navigation));
    await page.keyboard.press('Control+k');await page.locator('dialog[open] input').fill('contact');await page.keyboard.press('Enter');await page.waitForTimeout(1500);
    assert.equal(await page.locator('dialog[open]').count(),0);
    assert(await page.locator('a[href="/resume"]').count()>0);
    assert(await page.locator('a[href="https://www.linkedin.com/in/yatharthmaharwade/"]').count()>0);
    await page.goto(new URL('/myworks',url).href,{waitUntil:'networkidle'});
    assert.equal(await page.locator('.myworks-card').count(),7);
    await page.close();
    console.log('Passed',size);
    } catch (error) {
      (report.failures ||= []).push({size,message:error.stack});
      await page.screenshot({path:new URL(`failure-${size.width}.png`,out).pathname.slice(1)}).catch(()=>{});
      await page.close();
      console.error('Failed',size,error.message);
      process.exitCode=1;
    }
  }
  assert.equal(report.failures?.length || 0,0,JSON.stringify(report.failures));
  assert.equal(report.errors.length,0,JSON.stringify(report.errors));
  assert.equal(report.failed.length,0,JSON.stringify(report.failed));
  report.checks.push('CSP unchanged; original eye texture decoded and skinned; glow atlas restored; camera/FOV retained; pointer tracking; eyebrow hover; blink/typing clips; assembled monitor reveal; services clicks; section navigation; command palette; contact links; seven projects; no horizontal overflow; no console errors or failed requests');
}catch(error){report.failure=error.stack;console.error(error);const page=browser.contexts().flatMap(c=>c.pages())[0];if(page){await page.screenshot({path:new URL('test-failure.png',out).pathname.slice(1)}).catch(()=>{});report.failureDOM=await page.locator('body').innerText().catch(()=>null);}process.exitCode=1;}
finally{await writeFile(new URL('corrected-report.json',out),JSON.stringify(report,null,2));await browser.close();}
