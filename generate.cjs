const fs=require('node:fs');const {levels,simulate}=require('./dist/engine.js');
let seed=10260317;function rnd(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}function pick(a){return a[Math.floor(rnd()*a.length)]}function shuffle(a){return a.map(x=>[rnd(),x]).sort((a,b)=>a[0]-b[0]).map(x=>x[1])}const key=(x,y)=>x+','+y;
const chapters=['初光实验','折返花园','双星并行','交叉清障','静止的镜子','深光回廊','三色协奏','互相成全','光路迷阵','最后的交响'];
const names=['借一束光','藏在转角','折线来信','另一条路','穿过花园','两岸微光','有序离场','光的接力','交错时刻','空出一格','镜中小径','静默引路','留下方向','绕过石墙','出口之前','深入回廊','转折之间','远方回响','曲径通明','长路初见','第三种光','金色来客','各归其色','三线同行','初次合奏','先后之间','一束之力','让出通路','光有回声','彼此照亮','隐藏的弯','交织光网','转角谜题','多路远行','破局之光','无声默契','深处来信','重逢时刻','三色终曲','万物有光','最后转角','长夜将明','清空星河','光的答案','碎光交响曲'];
function make(index,attempt){let chapter=Math.floor(index/5),size=index>=25?9:7,nColors=chapter>=6?3:chapter>=2?2:1;
let targetMirrors=chapter===1?2+(index%5>1?1:0):chapter<=3?3+(index%5>1?1:0):chapter===4?5:chapter===5?5+(index%5>2?1:0):chapter===6?6:chapter===7?7:chapter===8?8:9;
let mirrors=[],solution=[],sources=[],reserved=new Set(),segments=[];
for(let c=0;c<nColors;c++){
let edge=pick([0,1,2,3]),v=1+Math.floor(rnd()*(size-2)),src=edge===0?[0,v,1,0]:edge===1?[size-1,v,-1,0]:edge===2?[v,0,0,1]:[v,size-1,0,-1];if(reserved.has(key(src[0],src[1])))return;
sources.push([...src,['r','b','g'][c]]);let[x,y,dx,dy]=src;reserved.add(key(x,y));let count=Math.floor(targetMirrors/nColors)+(c<targetMirrors%nColors?1:0);
for(let j=0;j<count;j++){
let candidates=[];for(let d=1;d<size;d++){let nx=x+dx*d,ny=y+dy*d;if(nx<0||ny<0||nx>=size||ny>=size)break;if(mirrors.some(m=>m[0]===nx&&m[1]===ny))break;if(!reserved.has(key(nx,ny))&&(dx?ny>0&&ny<size-1:nx>0&&nx<size-1))candidates.push(d)}if(!candidates.length)return;
let d=pick(candidates);for(let t=1;t<=d;t++)reserved.add(key(x+dx*t,y+dy*t));x+=dx*d;y+=dy*d;let o=pick([0,1]);mirrors.push([x,y,o]);solution.push(o);[dx,dy]=o===0?[-dy,-dx]:[dy,dx];
}for(let d=1;d<size;d++){let nx=x+dx*d,ny=y+dy*d;if(nx<0||ny<0||nx>=size||ny>=size)break;reserved.add(key(nx,ny))}
}
let l={size,sources,mirrors,solution,blocks:[],walls:[]};let trace=simulate(l,solution).frames[0].lines;
let forbidden=new Set([...mirrors.map(m=>key(m[0],m[1])),...sources.map(s=>key(s[0],s[1]))]);let cells=new Map();
for(let p of trace){if(p.nx<0||p.ny<0||p.nx>=size||p.ny>=size||!Number.isInteger(p.nx)||!Number.isInteger(p.ny))continue;let k=key(p.nx,p.ny);if(forbidden.has(k))continue;if(!cells.has(k))cells.set(k,{x:p.nx,y:p.ny,colors:new Set()});cells.get(k).colors.add(p.color)}
let ordered=shuffle([...cells.values()]);for(let p of ordered){if(p.colors.size>1||rnd()<.52)l.blocks.push([p.x,p.y,pick([...p.colors])])}
if(l.blocks.length<3||l.blocks.length>(size===7?14:23))return;if(!sources.every(s=>l.blocks.some(b=>b[2]===s[4])))return;
let solved=simulate(l,solution),waves=solved.frames.filter(f=>f.hit.length).length;if(!solved.won)return;if(chapter===3||chapter>=5){if(waves<2)return}
// Every movable mirror must matter: flipping it alone must break the solution.
for(let j=0;j<mirrors.length;j++){let o=[...solution];o[j]=1-o[j];if(simulate(l,o).won)return}
let locked=chapter===4||chapter>=8?[Math.floor(rnd()*mirrors.length)]:[];l.locked=locked;
let used=new Set(trace.map(p=>key(p.nx,p.ny)));let wallCandidates=[];for(let x=0;x<size;x++)for(let y=0;y<size;y++){let k=key(x,y);if(!used.has(k)&&!forbidden.has(k))wallCandidates.push([x,y])}l.walls=shuffle(wallCandidates).slice(0,chapter>=1?Math.min(chapter,5):0);
// Reject alternative complete configurations, not just single-flip alternatives.
let free=mirrors.map((_,i)=>i).filter(i=>!locked.includes(i)),solutions=0;
for(let mask=0;mask<2**free.length;mask++){let o=[...solution];free.forEach((m,j)=>o[m]=(mask>>j)&1);if(simulate(l,o).won&&++solutions>1)return}if(solutions!==1)return;
mirrors.forEach((m,j)=>m[2]=locked.includes(j)?solution[j]:(rnd()<.62?1-solution[j]:solution[j]));if(mirrors.every((m,j)=>m[2]===solution[j]))mirrors[free[0]][2]=1-solution[free[0]];
l.name=names[index-5];l.tag=chapters[chapter]+' · '+free.length+' 面可调镜';l.desc=chapter===1?'绕过石墙，把光送到每一块晶体。':chapter===2?'两种光各有目标，先找好两条完整的路线。':chapter===3?'交叉口有异色晶块，先清障，再让另一束光通过。':chapter===4?'带锁的镜子不可旋转，把它作为已知条件。':chapter===5?'反射链更长了。可以从最后一块晶体向光源倒推。':chapter===6?'金色光加入实验。三种符号，对应三种颜色。':chapter===7?'让一束光先清障，另一束光才能深入。':chapter===8?'固定镜子、石墙与多路光线，先找决定性的转角。':'把三条光路连起来，让清障引发最后的连锁。';
l.hint=mirrors.map((m,j)=>`镜${j+1}${locked.includes(j)?'（固定）':''}：${solution[j]?'\\':'/'}`).join('；');l.waves=waves;l.chapter=chapter;return l}
let extra=[],hashes=new Set();for(let i=5;i<50;i++){let l;for(let attempt=0;attempt<150000;attempt++){l=make(i,attempt);if(l){let hash=JSON.stringify([l.sources,l.mirrors,l.blocks]);if(hashes.has(hash)){l=null;continue}hashes.add(hash);break}}if(!l)throw new Error('Generation failed level '+(i+1));extra.push(l);console.log(`Level ${i+1}: ${l.mirrors.length} mirrors, ${l.blocks.length} blocks, ${l.waves} waves`)}
fs.writeFileSync('dist/campaign.js','globalThis.LaserCampaign = '+JSON.stringify(extra)+';\n');fs.writeFileSync('campaign-report.json',JSON.stringify(extra.map((l,i)=>({level:i+6,chapter:chapters[l.chapter],mirrors:l.mirrors.length,locked:l.locked.length,blocks:l.blocks.length,waves:l.waves,solution:l.solution})),null,2));
