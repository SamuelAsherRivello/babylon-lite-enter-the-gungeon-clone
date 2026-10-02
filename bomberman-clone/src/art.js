// Original hand-authored pixel patterns. Dots are transparent; all artwork is code-native.
const patterns={
 player:['......oooo......','....ooaaaaoo....','...oaaaaaaaao...','...oabbbbbaao...','...obcccccbbo...','...obcwcwcbbo...','....occcc co....'.replaceAll(' ','.'),'....oodddoo.....','...oaadddaao....','..oaadde ddaao..'.replaceAll(' ','.'),'..oaadddddaao...','...oaadddaao....','....oeeeeoo.....','....obbobbo.....','...obbbobbb o...'.replaceAll(' ','.'),'...oooo.oooo....'],
 chaser:['.....oooooo.....','...ooddddddoo...','..oddddddddddo..','.odaddddddadddo.','.oddaddddaddddo.','.odddaaaaaddddo.','.oddcwccwcdddo..','..oddcccccddo...','...odwwwwdo.....','....oddddo......','...ooddddoo.....','..oddoddoddo....','...oo....oo.....'],
 gunner:['.....oooooo.....','....obbbbbb o...'.replaceAll(' ','.'),'...obbaaaabbo...','...obaaaaaabo...','...ocwcwcwcco...','....occcccco....','....oodddoo.....','...obbbdbbbbo...','..obbb bdbbbbo..'.replaceAll(' ','.'),'..obbbbbbbbbo...','...obbbbbbbbo...','....obbobbo.....','...obbbobbb o...'.replaceAll(' ','.'),'...oooo.oooo....'],
 radial:['.......oo.......','......oddo......','...oooddddooo...','..odddaaaadddo..','.oddaaaaaaaaddo.','.odaaocccoaaado.','.odaaocwcoaaado.','.odaaocccoaaado.','.oddaaaaaaaaddo.','..odddaaaadddo..','...oooddddooo...','......oddo......','.......oo.......'],
 boss:['......oooooooo......','....oobbbbbbbboo....','...obbaa aaaabbbo...'.replaceAll(' ','.'),'..obbaaaaaaaaabbo...','..obbaaooooa aabbo..'.replaceAll(' ','.'),'..obboocwwcoobbo....','..obboocwwcoobbo....','..obboo cccoobbo....'.replaceAll(' ','.'),'...obbbddddbbbo.....','....ooddddddoo......','..ooobbbdbbbooo.....','.obbbbbdddbbbbbo....','.obaaabdddb aaabo...'.replaceAll(' ','.'),'.obaaabdddb aaabo...'.replaceAll(' ','.'),'..obbbbdddbbbbo.....','...obbbbbbbbbo......','....obbbobbbo.......','...obbbbobbbbo......','...ooooooooooo......']};
const cache=new Map();
export function sprite(kind='player',color='#ff8c64'){
 const key=kind+color;if(cache.has(key))return cache.get(key);const rows=patterns[kind]||patterns.player;
 const el=document.createElement('canvas');el.width=Math.max(...rows.map(r=>r.length));el.height=rows.length;const c=el.getContext('2d');
 const enemy=kind!=='player';const palette={o:'#111719',a:color,b:enemy?'#647476':'#454b4c',c:enemy?'#f5df9e':'#efc29d',w:'#fff8db',d:enemy?color:'#79523c',e:'#cfb582'};
 rows.forEach((r,y)=>[...r].forEach((p,x)=>{if(palette[p]){c.fillStyle=palette[p];c.fillRect(x,y,1,1);}}));cache.set(key,el);return el;
}
export const WEAPONS=[{id:'pistol',name:'Pulse pistol',tag:'PRECISE / STEADY',desc:'Hard-hitting single shots.',icon:'━▣'},{id:'scatter',name:'Scatter gun',tag:'CLOSE / WIDE',desc:'Five pellets. One loud answer.',icon:'▰═'},{id:'carbine',name:'Burst carbine',tag:'QUICK / CONTROLLED',desc:'Three-round rhythmic bursts.',icon:'━▰'}];
