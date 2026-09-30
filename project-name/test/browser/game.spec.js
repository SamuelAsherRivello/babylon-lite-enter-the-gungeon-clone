import {test,expect} from '@playwright/test';
const url=process.env.GAME_URL||'http://127.0.0.1:5173/babylon-lite-enter-the-gungeon-clone/';
const connected=p=>p.waitForFunction(()=>window.__gungeon?.state().status==='connected');
async function create(p){await p.goto(url);await p.waitForFunction(()=>window.__gungeon?.ready());await p.locator('#create').click();await connected(p);return p.evaluate(()=>window.__gungeon.state().code);}
async function me(p){return p.evaluate(()=>{const s=window.__gungeon.state();return s.gameState.players.find(p=>p.id===s.sessionId);});}
test('two clients share combat, hot joins/drops, short roll, local pause and fresh reconnect',async({browser})=>{
 const contexts=await Promise.all([0,1,2].map(()=>browser.newContext({viewport:{width:1440,height:1050}})));const [a,b,c]=await Promise.all(contexts.map(c=>c.newPage()));const errors=[];for(const p of [a,b,c])p.on('pageerror',e=>errors.push(e.message));
 try{const code=await create(a);await b.goto(url+'?room='+code);await connected(b);await a.locator('[data-weapon=carbine]').click();await b.locator('[data-weapon=scatter]').click();await a.locator('#ready').click();await b.locator('#ready').click();await a.waitForFunction(()=>window.__gungeon.state().gameState.phase==='combat');
  const p=await me(a);await a.keyboard.down('d');await a.waitForTimeout(250);await a.keyboard.up('d');await expect.poll(async()=>{const s=await b.evaluate(()=>window.__gungeon.state());return s.gameState.players.find(q=>q.id===p.id).x;}).toBeGreaterThan(p.x+.3);
  await a.keyboard.press('Space');await expect.poll(async()=>(await me(a)).rollCooldown).toBeGreaterThan(.5);
  const r=await a.locator('#game').boundingBox();await a.mouse.move(r.x+r.width*.1,r.y+r.height*.3);await a.mouse.down();await a.waitForFunction(()=>{const s=window.__gungeon.state();return s.gameState.shots.some(q=>q.owner===s.sessionId);});await a.mouse.up();
  await c.goto(url+'?room='+code);await connected(c);await expect.poll(()=>a.evaluate(()=>window.__gungeon.state().players.length)).toBe(3);await c.locator('#leave').click();await expect.poll(()=>a.evaluate(()=>window.__gungeon.state().players.length)).toBe(2);
  await a.locator('#pause').click();const before=await me(a),time=await b.evaluate(()=>window.__gungeon.state().gameState.time);await a.keyboard.down('d');await a.waitForTimeout(400);await a.keyboard.up('d');expect((await me(a)).x).toBeCloseTo(before.x,2);expect(await b.evaluate(()=>window.__gungeon.state().gameState.time)).toBeGreaterThan(time);await a.locator('#retry').click();
  const old=(await me(b)).id;await b.reload();await connected(b);expect((await me(b)).id).not.toBe(old);expect(await b.evaluate(()=>window.__gungeon.state().code)).toBe(code);
  await a.locator('#sound').click();await expect(a.locator('#sound')).toHaveAttribute('aria-pressed','true');await a.locator('#sound').click();await a.screenshot({path:'project-name/documentation/screenshot01.png',fullPage:true});expect(errors).toEqual([]);
  const dims=await a.evaluate(()=>({height:document.documentElement.scrollHeight,view:innerHeight}));expect(dims.height).toBeLessThanOrEqual(dims.view+2);
 }finally{await Promise.all(contexts.map(c=>c.close()));}
});
test('narrow mobile supports simultaneous move and aim/fire, roll and safe release',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});const p=await context.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 try{await create(p);await p.locator('#ready').click();await p.waitForFunction(()=>window.__gungeon.state().gameState.phase==='combat');await expect(p.locator('#touch-controls')).toBeVisible();const before=await me(p),move=await p.locator('#move-stick').boundingBox(),aim=await p.locator('#aim-stick').boundingBox(),cdp=await context.newCDPSession(p);
  const points=[{id:1,x:move.x+move.width/2+18,y:move.y+move.height/2,radiusX:2,radiusY:2},{id:2,x:aim.x+aim.width/2-18,y:aim.y+aim.height/2-8,radiusX:2,radiusY:2}];await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:points});await p.waitForTimeout(350);const after=await me(p);expect(after.x).toBeGreaterThan(before.x+.1);await p.waitForFunction(()=>{const s=window.__gungeon.state();return s.gameState.shots.some(q=>q.owner===s.sessionId);});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(450);const stop=await me(p);await p.waitForTimeout(250);expect((await me(p)).x).toBeCloseTo(stop.x,2);
  await p.locator('#touch-roll').tap();await expect.poll(async()=>(await me(p)).rollCooldown).toBeGreaterThan(.3);await p.screenshot({path:'project-name/documentation/mobile.png',fullPage:false});expect(errors).toEqual([]);
  const size=await p.locator('#game').boundingBox();expect(size.width/size.height).toBeCloseTo(16/9,1);
 }finally{await context.close();}
});
test('team defeat permits leader restart and a fresh shared run',async({browser})=>{
 const contexts=await Promise.all([0,1].map(()=>browser.newContext({viewport:{width:1440,height:1050}})));const [a,b]=await Promise.all(contexts.map(c=>c.newPage()));
 try{const code=await create(a);await b.goto(url+'?room='+code);await connected(b);await a.locator('#ready').click();await b.locator('#ready').click();await a.waitForFunction(()=>window.__gungeon.state().gameState.phase==='defeat',null,{timeout:90000});await expect(a.locator('#restart')).toBeVisible();await expect(b.locator('#restart')).toBeHidden();await a.screenshot({path:'project-name/documentation/defeat.png',fullPage:true});await a.locator('#restart').click();await b.waitForFunction(()=>window.__gungeon.state().gameState.phase==='lobby');expect(await b.evaluate(()=>window.__gungeon.state().gameState.round)).toBe(2);expect((await me(a)).hp).toBe(100);await a.locator('#ready').click();await b.locator('#ready').click();await a.waitForFunction(()=>window.__gungeon.state().gameState.phase==='combat');expect(await b.evaluate(()=>window.__gungeon.state().gameState.wave)).toBe(1);
 }finally{await Promise.all(contexts.map(c=>c.close()));}
});
