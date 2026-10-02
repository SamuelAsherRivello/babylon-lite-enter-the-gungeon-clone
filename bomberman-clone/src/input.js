export function normalized(x,y){const n=Math.max(1,Math.hypot(x,y));return {x:x/n,y:y/n};}
export function makeInput(keys,move,aim,shoot,roll,paused=false){
 if(paused)return {x:0,y:0,ax:1,ay:0,shoot:false,roll:false};
 const v=normalized(move.x+(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),move.y+(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0));
 const a=normalized(aim.x,aim.y);return {x:v.x,y:v.y,ax:a.x,ay:a.y,shoot:!!shoot,roll:!!roll};
}
export function smoothPosition(current,target,dt){const k=1-Math.exp(-Math.max(0,dt)*18);if(!current||Math.hypot(current.x-target.x,current.y-target.y)>5)return {x:target.x,y:target.y};return {x:current.x+(target.x-current.x)*k,y:current.y+(target.y-current.y)*k};}
