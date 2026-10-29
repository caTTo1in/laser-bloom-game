const assert=require('node:assert/strict');
const {harness}=require('./verify-impact-ui.cjs');
(async()=>{
let h=harness(1);h.context.load(1);assert.equal(h.nodes.get('lesson').hidden,false);h.context.editMirror(0);assert.match(h.nodes.get('lessonText').textContent,/点击圆形/);h.toggle(0);assert.equal(h.nodes.get('lesson').hidden,true);await h.advance(1600);
h=harness(15,{initialDirections:true});h.context.rotateSource(0);assert.match(h.nodes.get('lessonText').textContent,/方向转好了/);h.toggle(0);await h.advance(1500);assert.equal(h.nodes.get('remaining').textContent,0);
h=harness(3);h.toggle(1);await h.advance(1500);assert.match(h.nodes.get('status').textContent,/异色/);assert(h.read('collisionFX.length')>0);h.context.editMirror(0);h.toggle(1);h.context.editMirror(0);assert.equal(h.read('pendingEdit.type'),'mirror');await h.advance(1500);assert.equal(h.read('pendingEdit'),null);assert.equal(h.read('activeSources.size'),0);assert.equal(h.read('remaining.length'),4);assert.equal(h.read('orient[0]'),0,'buffered edit applied once');
h=harness(3);h.toggle(1);h.context.editMirror(0);h.toggle(1);await h.advance(1500);assert.equal(h.read('orient[0]'),0,'switch off cancels queued edit');
h=harness(3);h.toggle(1);h.context.editMirror(0);h.context.load(15);await h.advance(1500);assert.equal(h.read('current'),15);assert.equal(h.read('pendingEdit'),null,'level changes discard old inputs');
console.log('Interaction verified: contextual lessons, rotating-source onboarding, timed mismatch feedback, one buffered edit, immediate switch cancellation, level-change safety.');
})().catch(e=>{console.error(e);process.exitCode=1});
