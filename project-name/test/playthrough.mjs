import {chromium} from '@playwright/test';import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-unsafe-webgpu','--disable-background-timer-throttling','--disable-renderer-backgrounding']});
const url=process.env.GAME_URL||'http://127.0.0.1:5173/babylon-lite-enter-the-gungeon-clone/';const contexts=[],controllers=[];
async function controller(c){const p=await c.newPage();const held=new Set();let firing=false;return {p,held,get firing(){return firing},async fire(v){if(v!==firing){if(v)await p.mouse.down();else await p.mouse.up();firing=v;}},async move(dx,dy){const next=new Set();if(dx>.2)next.add('d');if(dx<-.2)next.add('a');if(dy>.2)next.add('s');if(dy<-.2)next.add('w');for(const k of held)if(!next.has(k))await p.keyboard.up(k);for(const k of next)if(!held.has(k))await p.keyboard.down(k);held.clear();for(const k of next)held.add(k);}};}
function blocked(a,b,g){const n=Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)*5);for(let j=1;j<n;j++){const x=a.x+(b.x-a.x)*j/n,y=a.y+(b.y-a.y)*j/n;if(g.cover.some(c=>Math.abs(x-c.x)<c.w/2+.1&&Math.abs(y-c.y)<c.h/2+.1)||g.props.some(c=>Math.abs(x-c.x)<.6&&Math.abs(y-c.y)<.6))return true;}return false;}
try{
 for(let i=0;i<2;i++){const c=await browser.newContext({viewport:{width:1440,height:1050}});contexts.push(c);controllers.push(await controller(c));}
 const [a,b]=controllers;await a.p.goto(url);await a.p.waitForFunction(()=>window.__gungeon?.ready());await a.p.locator('#create').click();await a.p.waitForFunction(()=>window.__gungeon.state().status==='connected');const code=await a.p.evaluate(()=>window.__gungeon.state().code);console.log('ROOM',code);
 await b.p.goto(url+'?room='+code);await b.p.waitForFunction(()=>window.__gungeon?.state().status==='connected');await a.p.locator('[data-weapon=carbine]').click();await a.p.locator('#ready').click();await b.p.locator('#ready').click();await a.p.waitForFunction(()=>window.__gungeon.state().gameState.phase==='combat');
 let lastWave=0,sawBreak=false,sawBoss=false,success=false,revived=false,downId=null;const begin=Date.now();
 while(Date.now()-begin<220000){const states=await Promise.all(controllers.map(async c=>({c,s:await c.p.evaluate(()=>window.__gungeon.state())})));
  const g=states[0].s.gameState;if(!g){console.log('lost state');break;}if(g.wave!==lastWave){console.log('WAVE',g.wave,'HP',g.players.map(p=>p.hp));lastWave=g.wave;}
  if(g.enemies.some(e=>e.kind==='boss')&&!sawBoss){sawBoss=true;console.log('BOSS SEEN');await a.p.screenshot({path:'project-name/documentation/boss.png',fullPage:true});}
  if(downId&&g.players.some(p=>p.id===downId&&p.hp>0)){revived=true;console.log('REVIVED');downId=null;}const down=g.players.find(p=>p.hp<=0);if(down)downId=down.id;
  if(g.phase==='defeat'){console.log('DEFEAT',g.wave);await a.p.screenshot({path:'project-name/documentation/defeat.png',fullPage:true});break;}
  if(g.wave>=5&&g.phase==='break'){success=true;break;}
  for(let index=0;index<states.length;index++){const {c,s}=states[index],me=s.gameState?.players.find(p=>p.id===s.sessionId);if(!me||me.hp<=0){await c.fire(false);await c.move(0,0);continue;}
   if(g.phase==='break'){await c.fire(false);await c.move(0,0);if(me.credits>0){const choice=me.hp<me.maxHp-20||g.wave===4?'vitality':'damage';await c.p.locator(`[data-upgrade=${choice}]`).click();sawBreak=true;console.log('UPGRADE',index,choice,me.damage);if(index===0)await c.p.screenshot({path:'project-name/documentation/upgrades.png',fullPage:true});}continue;}
   let tx,ty;if(down){tx=down.x;ty=down.y;}else{const theta=g.time*.7+index*Math.PI;tx=15+5*Math.cos(theta);ty=9+4*Math.sin(theta);}
   let dx=tx-me.x,dy=ty-me.y;const n=Math.max(1,Math.hypot(dx,dy));dx/=n;dy/=n;
   if(!down)for(const bullet of g.shots.filter(s=>s.enemy)){const bx=me.x-bullet.x,by=me.y-bullet.y,d=Math.hypot(bx,by);if(d<1.5){dx+=bx/Math.max(.1,d)*1.3;dy+=by/Math.max(.1,d)*1.3;}}
   if(down&&Math.hypot(me.x-down.x,me.y-down.y)<1.1){dx=dy=0;}
   await c.move(dx,dy);const targets=[...g.enemies].sort((e,f)=>Math.hypot(e.x-me.x,e.y-me.y)-Math.hypot(f.x-me.x,f.y-me.y));const target=targets.find(e=>!blocked(me,e,g))||targets[0];
   if(target){const r=await c.p.locator('#game').boundingBox();await c.p.mouse.move(r.x+(60+target.x*28)/960*r.width,r.y+(18+target.y*28)/540*r.height);await c.fire(true);}if(me.rollCooldown<=.01&&!down)await c.p.keyboard.press('Space');
  }await a.p.waitForTimeout(80);
 }
 console.log('RESULT',JSON.stringify({lastWave,sawBreak,sawBoss,success,revived,elapsed:Date.now()-begin}));assert.ok(sawBreak,'No wave break');assert.ok(sawBoss,'No fifth-wave boss');assert.ok(success,'Boss not defeated');
}finally{await Promise.all(contexts.map(c=>c.close()));await browser.close();}
