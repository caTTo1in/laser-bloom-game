const assert=require('node:assert/strict'),{harness}=require('./verify-impact-ui.cjs');
(async()=>{
let h=harness(15,{initialDirections:true});h.context.rotateSource(0);assert.equal(h.read('sourceAngle(0)'),Math.PI);await h.advance(100);let mid=h.read('sourceAngle(0)');assert(mid>Math.PI&&mid<Math.PI*1.5);h.context.rotateSource(0);assert.equal(h.read('sourceAngle(0)'),mid,'rapid turns start from the visible angle');await h.advance(200);assert.equal(h.read('sourceAngle(0)'),2*Math.PI,'up-to-right stays clockwise');assert.equal(h.read('shots'),0);
h=harness(15,{initialDirections:true});h.context.rotateSource(0);h.toggle(0);await h.advance(100);assert.equal(h.read('lines.length'),0,'beam waits for source to settle');await h.advance(1400);assert.equal(h.read('remaining.length'),0);assert.equal(h.read('shots'),1);assert.equal(h.nodes.get('result').hidden,false);
h=harness(15,{initialDirections:true});h.context.rotateSource(0);h.toggle(0);h.toggle(0);await h.advance(1500);assert.equal(h.read('remaining.length'),3,'turn-off cancels a pending launch');h.context.load(15);assert.equal(h.read('sourceAngle(0)'),Math.PI,'replay clears visual heading');
console.log('Rotary base verified: smooth interpolation, rapid turns, clockwise wrap, no activation cost, settled launch, cancellation and replay.');
})().catch(e=>{console.error(e);process.exitCode=1});
