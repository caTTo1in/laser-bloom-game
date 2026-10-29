const fs=require('node:fs');
function update(file,edits){let s=fs.readFileSync(file,'utf8');for(let [from,to]of edits){if(!s.includes(from))throw Error(file+' missing '+from.slice(0,70));s=s.replace(from,to)}fs.writeFileSync(file,s)}
update('dist/engine.js',[["按下发射，让珊瑚色激光穿过所有同色晶块。","点击棋盘左侧的红色光源，击碎所有同色晶块。"],["这一关不用镜子，直接发射就好。","这一关不用镜子，点击圆形光源发射。"]]);
update('dist/index.html',[
['<div id="mirrorLayer"></div>','<div id="mirrorLayer"></div><div id="emitterLayer"></div>'],
['<button id="fire" class="primary">✦ 发射激光</button>','<div id="fireGuide" class="source-guide">点击棋盘光源 · 同步发射</div>'],
['显示一面镜子方向','只定位错误镜子'],
['标记一面错误镜子，告诉你正确方向。','标记一面错误镜子的位置，不揭示正确方向。'],
['同色击碎 · 异色挡光 · 首碎 +3 ◉','光束互穿 · 异色晶体挡光 · 首碎 +3 ◉'],
['提示不重复扣除：同关已揭示的镜子可再次查看。','点击任一光源，所有光束同时发射，交叉互不阻挡。<br>罗盘只定位错误，不给方向；扳手自动校准。<br>同关已标记的错误镜子可再次查看，不重复扣除。'],
['金边虚线镜在本波反射后碎裂','带 ✧ 的金色镜子在本波反射后碎裂']
]);
update('dist/chapter3.js',[["虚线金边镜子在本波反射后碎裂。","带 ✧ 的金色镜子在本波反射后碎裂。"]]);
update('dist/app.js',[
['{levels,simulate}=LaserGame','{levels,simulate,beamAtProgress}=LaserGame'],
['for(let line of lines){ctx.strokeStyle','ctx.globalCompositeOperation="screen";for(let line of lines){ctx.globalAlpha=line.opacity??1;ctx.strokeStyle'],
['for(let wall of levels[current].walls||[])','ctx.globalAlpha=1;ctx.globalCompositeOperation="source-over";for(let wall of levels[current].walls||[])'],
['ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(x-r*.4,y-r*.4);ctx.lineTo(x+r*.4,y+r*.4);ctx.moveTo(x+r*.4,y-r*.4);ctx.lineTo(x-r*.4,y+r*.4);ctx.stroke()}','ctx.fill();ctx.stroke()}'],
["$('fire').disabled=busy;","$('fireGuide').textContent=busy?'光路实验中…':'点击棋盘光源 · 同步发射';for(let b of document.querySelectorAll('.emitter-button'))b.disabled=busy;"],
["$('fire').textContent=busy?'光路实验中…':'✦ 发射激光';",''],
["hintMirror=-1;lines=[];tone(420);","hintMirror=-1;$('hintText').hidden=true;lines=[];tone(420);"],
["金边虚线镜：本波反射后碎裂，下一波直穿。","金色 ✧ 镜会碎。点击任一光源，双光束同步发射。"],
["发射第一束光，收集晶块里藏着的金币。","点击左侧圆形光源，发射第一束光。"],
["点击镜子调整光路，准备好后发射。","调整镜子后，点击棋盘上的圆形光源发射。"],
["sync();nav();mirrors();saveRun()","sync();nav();mirrors();emitters();saveRun()"],
["for(let frame of result.frames){if(token!==epoch)return;lines=[];for(let i=0;i<frame.lines.length;i+=2){if(token!==epoch)return;lines.push(...frame.lines.slice(i,i+2));await delay(27)}await delay(100);",'for(let frame of result.frames){if(token!==epoch)return;await animateWave(frame,token);if(token!==epoch)return;await delay(80);'],
['${j+1} 号镜子应调成 ${levels[current].solution[j]?\'\\\\\':\'/\'}。高亮位置已标出，同关再次查看这面镜子不扣道具。','${j+1} 号镜子存在错误，已用 ! 标记。请自行调整角度。再次查看这个错误位置不扣道具。'],
["$('fire').onclick=fire;",'']
]);
let app=fs.readFileSync('dist/app.js','utf8');let at=app.indexOf('function load(');app=app.slice(0,at)+
`function emitters(){ $('emitterLayer').innerHTML='';levels[current].sources.forEach((s,i)=>{let b=document.createElement('button'),p=point(s[0],s[1]);b.className='emitter-button';b.style.left=p[0]*100+'%';b.style.top=p[1]*100+'%';b.disabled=busy;b.setAttribute('aria-label','发射全部激光（'+(s[4]==='r'?'红色':'蓝色')+'光源）');b.onclick=fire;$('emitterLayer').append(b)})}
async function animateWave(frame,token){let previous=lines.map(s=>({...s,opacity:1})),length=Math.max(1,...frame.lines.map(s=>s.step+1));let duration=Math.min(1400,Math.max(240,length*35)),start=performance.now();while(token===epoch){let t=Math.min(1,(performance.now()-start)/duration);lines=beamAtProgress(frame.lines,t,previous);if(t>=1)break;await delay(16)}}
`+app.slice(at);fs.writeFileSync('dist/app.js',app);
fs.appendFileSync('dist/style.css',`
/* Revision 2: bare mirrors, direct source controls, no wall symbols. */
#mirrorLayer,#emitterLayer{pointer-events:none;position:absolute;inset:0}.mirror-button,.emitter-button{pointer-events:auto}
.mirror-button,.mirror-button.locked,.mirror-button.fragile{background:transparent;border:0;box-shadow:none;border-radius:0}.mirror-button:after{height:4px;width:78%;box-shadow:0 0 7px #d2eebc44}.mirror-button small{bottom:-1px;left:auto;right:0;font-size:8px}.mirror-button.locked:after{background:#9bab99}.mirror-button.fragile:after{background:linear-gradient(90deg,#ffe4a0 0 40%,transparent 40% 49%,#ffe4a0 49%);box-shadow:0 0 6px #ffd78155}.mirror-button.fragile:before{content:none}.mirror-button.pulse{animation:none;box-shadow:none}.mirror-button.pulse:before{content:'!';position:absolute;top:-6px;right:-2px;left:auto;width:15px;height:15px;border-radius:50%;background:#e8b663;color:#62471c;font-size:10px;font-weight:800;line-height:15px;text-align:center;transform:none;box-shadow:0 0 8px #f5bf5444}
.emitter-button{position:absolute;transform:translate(-50%,-50%);width:12%;height:12%;min-width:30px;min-height:30px;background:transparent;border:0;border-radius:50%;padding:0}.emitter-button:not(:disabled):hover{box-shadow:0 0 12px #cfebbb77}.emitter-button:disabled{opacity:1;cursor:wait}.source-guide{flex:1;display:grid;place-items:center;text-align:center;color:#809775;font-size:11px;min-height:44px;border-radius:10px;background:#eaf0df}.actions .secondary{flex:0 0 90px}.source-guide:before{content:'↖';font-size:16px;display:none}
`);
