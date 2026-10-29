const fs=require('node:fs');let f='dist/app.js',s=fs.readFileSync(f,'utf8');
for(let [before,after] of [
['function load(i,reset=false)','function load(i,reset=true)'],
['r=reset?null:state.runs[i]','r=reset||state.completed.includes(i)?null:state.runs[i]'],
['let bonus=E.clear(state,current,shots);save();','let bonus=E.clear(state,current,shots);delete state.runs[current];save();'],
["state.completed.length===levels.length?'十五关，全部点亮！':current===levels.length-1?'碎镜接力，实验成功！':'漂亮，全部击碎！'","'成功通关'"],
["' 关 · 启动 '+shots+' 次 · 最佳 '","' 关 · 本次启动 '+shots+' 次 · 历史最佳 '"],
['load(current);paint();','load(current,false);paint();']
]){if(!s.includes(before))throw Error('Missing '+before);s=s.replace(before,after)}fs.writeFileSync(f,s);
let b=fs.readFileSync('build-demo.cjs','utf8').replace('laser-bloom-demo-v8.html','laser-bloom-demo-v9.html').replace('Immediate-impact demo v8 built','Replay-fix demo v9 built');fs.writeFileSync('build-demo.cjs',b);
