const fs=require('node:fs');function update(file,edits){let s=fs.readFileSync(file,'utf8');for(let[a,b]of edits){if(!s.includes(a))throw Error(file+' missing '+a.slice(0,90));s=s.replace(a,b)}fs.writeFileSync(file,s)}
update('dist/app.js',[
['{levels,simulate,beamAtProgress,impactsAtProgress}=LaserGame','{levels,simulate,beamAtProgress,impactsAtProgress,DIRECTIONS,sourceDirection}=LaserGame'],
['activeSources=new Set();\nconst colors','activeSources=new Set(),sourceDirections=[],hintSource=-1;\nconst colors'],
['{orient:[...orient],shots};save()','{orient:[...orient],sourceDirections:[...sourceDirections],shots};save()'],
['Math.atan2(src[3],src[2])','Math.atan2(DIRECTIONS[sourceDirections[source]][1],DIRECTIONS[sourceDirections[source]][0])'],
["'点击哪个激光头，就开启哪束'","(levels[current].rotatable?.length?'↻ 转方向 · 点光源开关':'点击哪个激光头，就开启哪束')"],
["['01 · 初光实验','02 · 交错寻光','03 · 碎镜接力']","['01 · 初光实验','02 · 交错寻光','03 · 碎镜接力','04 · 转向实验']"],
["['初光实验','交错寻光','碎镜接力'].forEach","['初光实验','交错寻光','碎镜接力','转向实验'].forEach"],
['history.push([...orient]);resetCircuitForEdit();orient[i]','rememberConfiguration();resetCircuitForEdit();orient[i]'],
["hintMirror=-1;$('hintText').hidden=true;lines=[];tone(420);mirrors();sync();saveRun();","hintMirror=-1;hintSource=-1;$('hintText').hidden=true;lines=[];tone(420);mirrors();emitters();sync();saveRun();"],
['(l.locked||[]).forEach(j=>orient[j]=l.solution[j]);remaining=',"sourceDirections=l.sources.map((s,j)=>(l.rotatable||[]).includes(j)&&r?.sourceDirections?.length===l.sources.length?r.sourceDirections[j]:sourceDirection(s));(l.locked||[]).forEach(j=>orient[j]=l.solution[j]);remaining="],
['history=[];hintMirror=-1;runEarned=0;','history=[];hintMirror=-1;hintSource=-1;runEarned=0;'],
["$('status').textContent=i===0?","$('status').textContent=l.rotatable?.length?'点 ↻ 转方向；点光源独立开关。':i===0?"],
['broken:[...broken]});sync();mirrors();','broken:[...broken],sourceDirections:[...sourceDirections]});sync();mirrors();'],
["orient=history.pop();resetCircuitForEdit();lines=[];hintMirror=-1;saveRun();mirrors();sync();","let previous=history.pop();orient=previous.orient;sourceDirections=previous.sourceDirections;resetCircuitForEdit();lines=[];hintMirror=-1;hintSource=-1;saveRun();mirrors();emitters();sync();"]
]);
let f='dist/app.js',s=fs.readFileSync(f,'utf8');let begin=s.indexOf('function emitters(){'),end=s.indexOf('function shatterCrystal(',begin);if(begin<0||end<0)throw Error('Missing emitters');s=s.slice(0,begin)+`
const directionNames=['右','下','左','上'];
function rememberConfiguration(){history.push({orient:[...orient],sourceDirections:[...sourceDirections]})}
function sourceLabel(i){let src=levels[current].sources[i];return (activeSources.has(i)?'关闭':'开启')+(src[4]==='r'?'红色':'蓝色')+'激光'+((levels[current].rotatable||[]).includes(i)?'（朝'+directionNames[sourceDirections[i]]+'）':'')}
function emitters(){ $('emitterLayer').innerHTML='';levels[current].sources.forEach((src,i)=>{let b=document.createElement('button'),p=point(src[0],src[1]);b.className='emitter-button'+(activeSources.has(i)?' active':'');b.style.left=p[0]*100+'%';b.style.top=p[1]*100+'%';b.dataset.source=i;b.setAttribute('aria-pressed',String(activeSources.has(i)));b.setAttribute('aria-label',sourceLabel(i));b.onclick=()=>toggleSource(i);$('emitterLayer').append(b);if((levels[current].rotatable||[]).includes(i)){let r=document.createElement('button'),q=point(src[0]+(src[0]<3?.85:-.85),src[1]+(src[1]<3?.85:-.85));r.className='source-rotate'+(hintSource===i?' hinted':'');r.style.left=q[0]*100+'%';r.style.top=q[1]*100+'%';r.dataset.source=i;r.disabled=busy;r.textContent='↻';r.setAttribute('aria-label','旋转'+(src[4]==='r'?'红色':'蓝色')+'激光头，当前朝'+directionNames[sourceDirections[i]]);r.onclick=()=>rotateSource(i);$('emitterLayer').append(r)}})}
function rotateSource(i){if(busy||!(levels[current].rotatable||[]).includes(i))return;rememberConfiguration();resetCircuitForEdit();sourceDirections[i]=(sourceDirections[i]+1)%4;hintSource=-1;hintMirror=-1;$('hintText').hidden=true;saveRun();mirrors();emitters();sync();tone(470);$('status').textContent=(levels[current].sources[i][4]==='r'?'红色':'蓝色')+'激光头已朝'+directionNames[sourceDirections[i]]+'，点击圆形光源开启。'}
`+s.slice(end);
begin=s.indexOf('function syncEmitters(){');end=s.indexOf('function resetCircuitForEdit(',begin);s=s.slice(0,begin)+`function syncEmitters(){for(let b of document.querySelectorAll('.emitter-button')){let i=Number(b.dataset.source);if(!levels[current].sources[i]){b.remove();continue}let on=activeSources.has(i);b.disabled=false;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));b.setAttribute('aria-label',sourceLabel(i))}for(let b of document.querySelectorAll('.source-rotate'))b.disabled=busy}
`+s.slice(end);
begin=s.indexOf('function wrongMirror(){');end=s.indexOf("$('reset').onclick=",begin);if(begin<0||end<0)throw Error('Missing hint tools');s=s.slice(0,begin)+`
function mistakes(){let l=levels[current],wrong=[];for(let i of l.rotatable||[])if(sourceDirections[i]!==l.sourceSolution[i])wrong.push({type:'source',index:i,key:32+i});l.mirrors.forEach((_,i)=>{if(orient[i]!==l.solution[i])wrong.push({type:'mirror',index:i,key:i})});return wrong}
function useItem(item){if(busy)return;let wrong=mistakes();if(!wrong.length){$('hintText').textContent='光源与镜子方向都正确了，开启光源就好，不消耗道具。';$('hintText').hidden=false;return}let revealed=state.revealed[current]||[],target=item==='hint'?(wrong.find(w=>!revealed.includes(w.key))||wrong[0]):wrong[0],i=target.index,isSource=target.type==='source';let label=isSource?(levels[current].sources[i][4]==='r'?'红色':'蓝色')+'激光头':(i+1)+' 号镜子';
if(item==='hint'){if(!revealed.includes(target.key)){if(!E.consume(state,'hint'))return openShop('罗盘用完了，花 12 金币补充一个吧。');revealed.push(target.key);state.revealed[current]=revealed}hintSource=isSource?i:-1;hintMirror=isSource?-1:i;$('hintText').textContent=label+'的方向存在错误，已用 ! 标记。'+(isSource?'点击旁边的 ↻ 调整。':'请自行调整。')+'再次查看不扣道具。';
}else{if(!E.consume(state,'align'))return openShop('扳手用完了，花 24 金币补充一个吧。');rememberConfiguration();resetCircuitForEdit();if(isSource)sourceDirections[i]=levels[current].sourceSolution[i];else orient[i]=levels[current].solution[i];hintSource=isSource?i:-1;hintMirror=isSource?-1:i;$('hintText').textContent=label+'已校准，继续观察其他方向。'}
$('hintText').hidden=false;saveRun();mirrors();emitters();sync();tone(700)}
`+s.slice(end);fs.writeFileSync(f,s);
update('dist/economy.js',[
['root.LaserGame?.levels.length||15','root.LaserGame?.levels.length||20'],
['x<12','x<64'],
['s.runs[i]={orient:r.orient,shots:integer(r.shots)}','s.runs[i]={orient:r.orient,shots:integer(r.shots),...(Array.isArray(r.sourceDirections)&&r.sourceDirections.every(d=>Number.isInteger(d)&&d>=0&&d<4)?{sourceDirections:r.sourceDirections}:{})}']
]);
update('dist/index.html',[
['十五关寻光','二十关寻光'],['0 / 15','0 / 20'],['FIFTEEN LITTLE EXPERIMENTS','TWENTY LITTLE EXPERIMENTS'],['<h2>十五关寻光</h2>','<h2>二十关寻光</h2>'],
['<script src="engine.js">','<script src="chapter4.js"></script><script src="engine.js">'],
['只定位错误镜子','只定位错误元件'],['自动修正一面镜子','自动校准一个元件'],
['标记一面错误镜子的位置，不揭示正确方向。','标记一处错误镜子或激光头，不揭示正确方向。'],['自动修正一面错误镜子，帮你继续推理。','自动校准一处错误镜子或激光头的方向。'],
['调镜或重来会熄灯并恢复棋盘。','调镜、旋转光源或重来会熄灯并恢复棋盘。<br>第16关起，点光源旁的 ↻ 顺时针转90°，点光源本体控制开关。']
]);
fs.appendFileSync('dist/style.css','\n.source-rotate{pointer-events:auto;position:absolute;transform:translate(-50%,-50%);width:28px;height:28px;min-width:28px;min-height:28px;background:#213e35;border:1px solid #6f8b6c99;border-radius:50%;color:#d6dcb7;font-size:20px;line-height:24px;padding:0;display:grid;place-items:center;touch-action:manipulation}.source-rotate.hinted:after{content:"!";position:absolute;right:-5px;top:-5px;font-size:10px;font-weight:bold;width:14px;height:14px;line-height:14px;text-align:center;background:#e8b663;color:#62471c;border-radius:50%}.source-rotate:disabled{opacity:.4}\n');
f='build-demo.cjs';s=fs.readFileSync(f,'utf8').replace("'chapter3.js','engine.js'","'chapter3.js','chapter4.js','engine.js'").replace('scripts.length!==5','scripts.length!==6').replace('laser-bloom-demo-v9.html','laser-bloom-demo-v10.html').replace('碎光实验室-前十五关.html','碎光实验室-前二十关.html').replace('Replay-fix demo v9 built','Rotating-source demo v10 built');fs.writeFileSync(f,s);
