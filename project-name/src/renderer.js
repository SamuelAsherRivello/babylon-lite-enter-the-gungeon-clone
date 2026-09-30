import {createEngine,createDynamicTexture,updateDynamicTexture,createGridSpriteAtlas,createSprite2DLayer,addSprite2D,updateSprite2D,createSpriteRenderer,registerSpriteRenderer,renderFrame,resizeEngine,disposeSpriteRenderer,disposeSpriteAtlas,disposeEngine,enableDeviceLostSpriteRecovery} from '@babylonjs/lite';
import {sprite} from './art.js';import {smoothPosition} from './input.js';
const W=960,H=540,T=28,OX=60,OY=18;
export async function createRenderer(canvas,onFailure){
 if(!navigator.gpu)throw Error('WebGPU is unavailable. Use current Chrome or Edge with hardware acceleration enabled.');
 const engine=await createEngine(canvas,{maxDevicePixelRatio:1.5,msaaSamples:1});
 const surface=document.createElement('canvas');surface.width=W;surface.height=H;const c=surface.getContext('2d');c.imageSmoothingEnabled=false;
 const texture=createDynamicTexture(engine,W,H,{minFilter:'nearest',magFilter:'nearest'}),atlas=createGridSpriteAtlas(texture,{cellWidthPx:W,cellHeightPx:H});
 const layer=createSprite2DLayer(atlas,{capacity:1}),quad=addSprite2D(layer,{positionPx:[canvas.width/2,canvas.height/2],sizePx:[canvas.width,canvas.height],frame:0});
 const renderer=createSpriteRenderer(engine,{layers:[layer]});registerSpriteRenderer(renderer);
 const recovery=enableDeviceLostSpriteRecovery(engine,{onLost:()=>onFailure(Error('Graphics device interrupted. Reload to restore the arena and rejoin.'))});
 const pos=new Map(),hp=new Map(),hit=new Map(),muzzles=new Map();let shotIds=new Set(),last=0,round=null,disposed=false;const particles=[];
 const rect=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
 const label=(text,x,y,color='#f5dfab',size=10)=>{c.fillStyle=color;c.font=`600 ${size}px monospace`;c.textAlign='center';c.fillText(text,x,y);};
 function torch(x,y,now){const f=Math.sin(now/80+x)*2;const g=c.createRadialGradient(x,y,0,x,y,70);g.addColorStop(0,'#edac4934');g.addColorStop(1,'#edac4900');c.fillStyle=g;c.fillRect(x-70,y-70,140,140);rect(x-4,y,8,16,'#272d2c');rect(x-6,y-4,12,8,'#956646');rect(x-4,y-16+f,8,12-f,'#dc7638');rect(x-2,y-12+f,4,8-f,'#ffe5a3');}
 function floor(now){rect(0,0,W,H,'#101517');rect(OX-10,OY-10,30*T+20,18*T+20,'#0a0f12');
  for(let y=0;y<18;y++)for(let x=0;x<30;x++){const px=OX+x*T,py=OY+y*T,n=(x*7+y*11)%9;const wall=x===0||x===29||y===0||y===17;
   rect(px,py,T,T,wall?'#29302e':['#3b4140','#3e4442','#393f3e','#414642'][n%4]);rect(px+1,py+1,T-2,1,wall?'#62665a':'#4b514c');rect(px+1,py+T-2,T-2,2,'#252c2b');rect(px+T-2,py+1,2,T-3,'#2e3432');
   if(wall){rect(px+2,py+3,T-4,T-9,'#53584d');rect(px+3,py+3,T-6,2,'#737668');rect(px+3,py+T-10,T-6,3,'#373e37');}else if(n===3){rect(px+6,py+8,8,1,'#2c3430');rect(px+12,py+9,1,7,'#2c3430');}else if(n===5){rect(px+8,py+6,2,2,'#69736366');}
  }
  rect(OX+12*T,OY+6*T,6*T,6*T,'#614b3228');c.strokeStyle='#bda17244';c.lineWidth=1;c.strokeRect(OX+12*T+4,OY+6*T+4,6*T-8,6*T-8);
  for(const [x,y]of [[3,.5],[10,.5],[19,.5],[26,.5],[.5,8],[29.5,8],[3,17.3],[26,17.3]])torch(OX+x*T,OY+y*T,now);
  label('BRASS & BRIMSTONE',W/2,OY+9*T,'#aa95614a',16);
 }
 function draw(g,id,now){if(disposed)return;const dt=last?Math.min(.05,(now-last)/1000):1/60;last=now;floor(now);
  const fallback={cover:[{x:8,y:5,w:1.5,h:1.5},{x:22,y:5,w:1.5,h:1.5},{x:8,y:13,w:1.5,h:1.5},{x:22,y:13,w:1.5,h:1.5}],props:[{x:5,y:8},{x:25,y:10},{x:14,y:4},{x:16,y:14}],players:[],enemies:[],shots:[],loot:[]};const state=g||fallback;
  if(round!==`${g?.code}:${g?.round}`){pos.clear();hp.clear();hit.clear();shotIds.clear();round=`${g?.code}:${g?.round}`;}
  for(const a of state.cover){const x=OX+a.x*T,y=OY+a.y*T,w=a.w*T;rect(x-w/2+3,y-w/2+8,w,w,'#10181899');rect(x-w/2,y-w/2,w,w,'#676858');rect(x-w/2+3,y-w/2+3,w-6,w-10,'#92917c');rect(x-w/2+3,y-w/2+3,w-6,3,'#c0b593');rect(x-w/2+5,y+w/2-10,w-10,3,'#494f45');rect(x-2,y-w/2+8,3,w-22,'#75755e');}
  for(const p of state.props){const x=OX+p.x*T,y=OY+p.y*T;rect(x-14,y-8,30,28,'#15191766');rect(x-14,y-18,28,30,'#513d2c');rect(x-11,y-16,22,22,'#976a3b');rect(x-9,y-14,18,3,'#bd8b50');rect(x-3,y-14,3,22,'#5e4229');rect(x-11,y+4,22,3,'#342d24');rect(x-13,y-9,26,3,'#c9a574');}
  for(const l of state.loot){const x=OX+l.x*T,y=OY+l.y*T+Math.sin(now/160+l.id)*2;rect(x-5,y-5,10,10,'#24463a');rect(x-3,y-5,6,10,'#7eeab1');rect(x-5,y-3,10,6,'#7eeab1');rect(x-1,y-1,2,2,'#e5ffd8');}
  const active=new Set();const actors=[...state.players,...state.enemies.map(e=>({...e,enemy:true}))].sort((a,b)=>a.y-b.y);
  for(const a of actors){const key=(a.enemy?'e':'p')+a.id;active.add(key);const oldHp=hp.get(key);if(oldHp!==undefined&&a.hp<oldHp){hit.set(key,now+120);for(let j=0;j<7;j++)particles.push({x:OX+a.x*T,y:OY+a.y*T,vx:(Math.random()-.5)*90,vy:(Math.random()-.5)*90,life:.28,color:a.enemy?'#ffc273':'#ff8866'});}hp.set(key,a.hp);
   const p=smoothPosition(pos.get(key),a,dt);pos.set(key,p);const x=OX+p.x*T,y=OY+p.y*T,boss=a.kind==='boss',scale=boss?3:2;const color=a.enemy?({chaser:'#e57b60',gunner:'#d4bb70',radial:'#bc79ba',boss:'#d0b077'}[a.kind]):a.color;
   c.fillStyle='#0b111480';c.beginPath();c.ellipse(x,y+10,boss?29:16,boss?10:6,0,0,Math.PI*2);c.fill();
   if(!a.enemy){c.strokeStyle=a.color;c.lineWidth=a.id===id?2:1;c.beginPath();c.ellipse(x,y+10,17,7,0,0,Math.PI*2);c.stroke();}
   const im=sprite(a.enemy?a.kind:'player',color);c.save();c.translate(Math.round(x),Math.round(y-7));if(a.rolling>0)c.rotate(a.angle+now/45);if(a.hp<=0){c.globalAlpha=.4;c.rotate(Math.PI/2);}else if(a.shield>0&&Math.floor(now/70)%2)c.globalAlpha=.65;c.drawImage(im,-im.width*scale/2,-im.height*scale/2,im.width*scale,im.height*scale);c.restore();
   if(hit.get(key)>now){rect(x-12,y-20,24,28,'#ffffff88');}
   if(!a.enemy&&a.hp>0){const angle=a.angle||0;c.save();c.translate(x,y-4);c.rotate(angle);rect(8,-3,a.weapon==='scatter'?20:17,6,'#171f20');rect(9,-3,a.weapon==='pistol'?10:16,4,'#b9b9a0');rect(11,1,7,3,'#846144');if((muzzles.get(a.id)||0)>now){rect(25,-6,9,12,'#ffd071');rect(28,-3,10,6,'#fff3b9');}c.restore();}
   if(!a.enemy){label(a.id===id?'YOU':`P${a.number}`,x,y-29,a.color,9);rect(x-15,y+17,30,3,'#131c1c');rect(x-15,y+17,30*a.hp/a.maxHp,3,a.hp<30?'#ff7b6a':a.color);if(a.hp<=0){label(a.revive>0?`REVIVE ${Math.round(a.revive/2*100)}%`:'DOWN',x,y+30,'#ffdfa1',9);}}
   else if(boss){rect(x-30,y+30,60,4,'#221f20');rect(x-30,y+30,60*a.hp/a.maxHp,4,'#e9bd7a');label('WARDEN',x,y-40,'#e9bd7a',9);}
  }
  for(const key of pos.keys())if(!active.has(key)){pos.delete(key);hp.delete(key);hit.delete(key);}
  for(const s of state.shots){const x=OX+s.x*T,y=OY+s.y*T;if(!shotIds.has(s.id)&&!s.enemy)muzzles.set(s.owner,now+75);if(s.enemy){c.fillStyle='#fe7793';c.beginPath();c.arc(x,y,4,0,Math.PI*2);c.fill();rect(x-1,y-1,2,2,'#fff1d4');c.strokeStyle='#622548';c.lineWidth=1;c.stroke();}else{c.strokeStyle='#97efee';c.lineWidth=3;c.beginPath();c.moveTo(x-s.vx*.18,y-s.vy*.18);c.lineTo(x,y);c.stroke();rect(x-1,y-1,3,3,'#eaffdc');}}
  shotIds=new Set(state.shots.map(s=>s.id));
  for(let j=particles.length-1;j>=0;j--){const p=particles[j];p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;if(p.life<=0)particles.splice(j,1);else rect(p.x,p.y,3,3,p.color);}
  const v=c.createRadialGradient(W/2,H/2,180,W/2,H/2,540);v.addColorStop(0,'#00000000');v.addColorStop(1,'#070e1370');c.fillStyle=v;c.fillRect(0,0,W,H);
  label('VAULT 01 / THE COPPER KEEP',OX+150,OY+18*T-11,'#b4ac91',9);
  if(g?.phase==='combat'){label(`WAVE ${String(g.wave).padStart(2,'0')}`,W-145,OY+18*T-11,'#dfc396',9);}
  updateDynamicTexture(engine,texture,surface,{invertY:false});resizeEngine(engine);updateSprite2D(quad,{positionPx:[canvas.width/2,canvas.height/2],sizePx:[canvas.width,canvas.height]});renderFrame(engine,dt*1000);
 }
 return {draw,screenToWorld(x,y){return {x:(x*W-OX)/T,y:(y*H-OY)/T};},dispose(){if(disposed)return;disposed=true;recovery.disable();disposeSpriteRenderer(renderer);disposeSpriteAtlas(atlas);disposeEngine(engine);}};
}
