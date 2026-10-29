const fs=require('node:fs');require('./drafts/campaign50.js');let draft=globalThis.LaserCampaign;
let chosen=[3,9,13,18,19].map(i=>structuredClone(draft[i]));
const names=['石墙后的光','交错双星','借光开路','静默的引路人','碎光小合奏'];
const tags=['三次反射 · 石墙','双路相遇 · 双色','先后清障 · 连锁','固定镜子 · 倒推','五镜综合 · 章节挑战'];
chosen.forEach((l,i)=>{l.name=names[i];l.tag=tags[i];delete l.chapter;if(i===4){l.locked=[];l.mirrors[2][2]=0;l.desc='五面镜子，两条交叉光路。清除交叉口，让最后的晶块一起绽放。'}});
fs.writeFileSync('dist/levels10.js','globalThis.LaserCampaign = '+JSON.stringify(chosen)+';\n');
