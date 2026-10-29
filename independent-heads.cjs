const fs=require('node:fs');function update(file,edits){let s=fs.readFileSync(file,'utf8');for(let [a,b] of edits){if(!s.includes(a))throw Error(file+' missing '+a.slice(0,80));s=s.replace(a,b)}fs.writeFileSync(file,s)}
update('dist/app.js',[
['runEarned=0,broken=new Set();','runEarned=0,broken=new Set(),activeSources=new Set();'],
['for(let src of levels[current].sources){ctx.save();','for(let source=0;source<levels[current].sources.length;source++){let src=levels[current].sources[source];ctx.save();ctx.globalAlpha=activeSources.has(source)?1:.65;ctx.shadowBlur=activeSources.has(source)?14:0;ctx.shadowColor=colors[src[4]];'],
["$('fireGuide').textContent=busy?'光路实验中…':'点击棋盘光源 · 同步发射';for(let b of document.querySelectorAll('.emitter-button'))b.disabled=busy;","$('fireGuide').textContent=activeSources.size?`已开 ${activeSources.size}/${levels[current].sources.length} 束 · 再点可关`:'点击哪个激光头，就开启哪束';syncEmitters();"],
['history.push([...orient]);broken=new Set();orient[i]','history.push([...orient]);resetCircuitForEdit();orient[i]'],
["b.disabled=busy;b.setAttribute('aria-label','发射全部激光（'+(s[4]==='r'?'红色':'蓝色')+'光源）');b.onclick=fire;","b.dataset.source=i;b.setAttribute('aria-pressed',String(activeSources.has(i)));b.setAttribute('aria-label',(activeSources.has(i)?'关闭':'开启')+(s[4]==='r'?'红色':'蓝色')+'激光');b.onclick=()=>toggleSource(i);"],
["coinFX=[];history=[];hintMirror=-1;runEarned=0;broken=new Set();","coinFX=[];history=[];hintMirror=-1;runEarned=0;broken=new Set();activeSources=new Set();"],
['金色 ✧ 镜会碎。点击任一光源，双光束同步发射。','金色 ✧ 镜会碎。每个光源独立开关。'],
['调整镜子后，点击棋盘上的圆形光源发射。','点击哪个光源就开启哪束，再点可关闭。'],
['history.push([...orient]);broken=new Set();orient[j]','history.push([...orient]);resetCircuitForEdit();orient[j]'],
['orient=history.pop();broken=new Set();lines=[];','orient=history.pop();resetCircuitForEdit();lines=[];'],
["${i+1}</small>`;b.onclick=", "${i+1}</small>`;b.onclick="],
["if(broken.has(i))return;","if(broken.has(i)&&hintMirror!==i)return;"]
]);
let file='dist/app.js',s=fs.readFileSync(file,'utf8'),start=s.indexOf('async function fire(){'),end=s.indexOf('function openShop(',start);if(start<0||end<0)throw Error('Missing circuit functions');
s=s.slice(0,start)+`
function syncEmitters(){for(let b of document.querySelectorAll('.emitter-button')){let i=Number(b.dataset.source),on=activeSources.has(i),src=levels[current].sources[i];b.disabled=false;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));b.setAttribute('aria-label',(on?'关闭':'开启')+(src[4]==='r'?'红色':'蓝色')+'激光')}}
function resetCircuitForEdit(){epoch++;busy=false;activeSources=new Set();remaining=levels[current].blocks.map((_,i)=>i);broken=new Set();lines=[];particles=[];coinFX=[];runEarned=0;syncEmitters()}
function toggleSource(i){epoch++;busy=false;if(activeSources.has(i)){activeSources.delete(i);lines=lines.filter(l=>l.source!==i)}else{activeSources.add(i);shots++}saveRun();sync();mirrors();tone(activeSources.has(i)?640:320);if(!activeSources.size){lines=[];$('status').textContent='所有激光已关闭，已击碎的方块保持消除。';return}runCircuit()}
function starCount(){let baseline=levels[current].sources.length;return shots<=baseline?'★★★':shots<=baseline+2?'★★':'★'}
async function runCircuit(){busy=true;let token=++epoch;let result=simulate(levels[current],orient,{activeSources:[...activeSources],remaining:[...remaining],broken:[...broken]});sync();mirrors();$('status').textContent='已开启的激光正在寻找通路…';
for(let frame of result.frames){if(token!==epoch)return;await animateWave(frame,token);if(token!==epoch)return;await delay(80);if(token!==epoch)return;let waveCoins=0;
for(let m of frame.shattered||[]){broken.add(m);let b=levels[current].mirrors[m],p=point(b[0],b[1]);for(let j=0;j<12;j++)particles.push({x:p[0],y:p[1],angle:j*Math.PI/6,t:performance.now(),color:'f'})}mirrors();
for(let id of frame.hit){let b=levels[current].blocks[id],p=point(b[0],b[1]);for(let j=0;j<10;j++)particles.push({x:p[0],y:p[1],angle:j*Math.PI/5,t:performance.now(),color:b[2]});let earn=E.awardBlock(state,current,id);waveCoins+=earn;if(earn)for(let k=0;k<3;k++)coinFX.push({x:p[0],y:p[1],t:performance.now(),k})}
runEarned+=waveCoins;remaining=remaining.filter(n=>!frame.hit.includes(n));save();sync();if(frame.hit.length||(frame.shattered||[]).length){tone(650+remaining.length*35);$('status').textContent='击碎 '+frame.hit.length+' 块'+(waveCoins?' · 金币 +'+waveCoins:'')+(frame.shattered?.length?' · 镜子碎裂！':'');await delay(350)}}
if(token!==epoch)return;busy=false;sync();mirrors();
if(result.won){let bonus=E.clear(state,current,shots);save();sync();nav();$('status').textContent=bonus?'全部清空 · 首通奖励 +10 金币！':'全部清空，实验成功！';await delay(250);if(token!==epoch)return;$('winStars').textContent=starCount();$('winTitle').textContent=state.completed.length===levels.length?'十五关，全部点亮！':current===levels.length-1?'碎镜接力，实验成功！':'漂亮，全部击碎！';$('winText').textContent='第 '+(current+1)+' 关 · 启动 '+shots+' 次 · 最佳 '+state.best[current]+' 次';$('winCoins').textContent=runEarned+bonus?'◉ 本次游玩获得 '+(runEarned+bonus)+' 金币':'本关奖励已领取，欢迎继续挑战。';$('next').textContent=current===levels.length-1?'返回关卡地图 →':'下一关 →';$('result').hidden=false;tone(900)}else $('status').textContent='还剩 '+remaining.length+' 块。可开关其他光源；调镜会熄灯并恢复棋盘。'}
`+s.slice(end);
s=s.replace("`发射 ${shots} 次`","`启动 ${shots} 次`");
s=s.replace("state.best[i]===1?'★★★':state.best[i]<=3?'★★':'★'","state.best[i]<=levels[i].sources.length?'★★★':state.best[i]<=levels[i].sources.length+2?'★★':'★'");fs.writeFileSync(file,s);
update('dist/index.html',[
['点击棋盘光源 · 同步发射','点击哪个激光头，就开启哪束'],
['点击任一光源，所有光束同时发射，交叉互不阻挡。','每个激光头独立开关，再点关闭；开启的光束交叉互不阻挡。<br>开关光源会保留已消除的方块。调镜或重来会熄灯并恢复棋盘。'],
['一发清空 ★★★ · 三发以内 ★★ · 完成 ★','各光源只启动一次 ★★★ · 多启动两次以内 ★★ · 完成 ★'],
['发射 0 次','启动 0 次']
]);
fs.appendFileSync('dist/style.css','\n.emitter-button.active{box-shadow:0 0 0 2px #d7f4c977,0 0 15px #d7f4c944}.emitter-button.active:after{content:"";position:absolute;right:2px;top:2px;width:5px;height:5px;border-radius:50%;background:#d9f7b2}\n');
