import test from 'node:test';
import assert from 'node:assert/strict';
import {advanceTour,restoreProgress,recommendTour} from '../web/tour.js';
import {parseCommand} from '../web/core.js';
import {campuses} from '../web/data.js';
import {tourPoints} from '../web/tour-data.js';

const empty=()=>({visited:[],skipped:[],finished:false});
const campus=campuses[0];
const profile={major:'Computer science',interests:'Student life',interest:'engineering',lifestyle:'exploring',minutes:20};

test('skipping never counts as visiting; the final outcome opens a recap',()=>{
 const route=['geisel','price','jacobs'];
 const first=advanceTour(empty(),route,'geisel','skipped');
 assert.deepEqual(first.progress,{visited:[],skipped:['geisel'],finished:false});
 assert.equal(first.nextId,'price');
 const second=advanceTour(first.progress,route,'price','visited');
 const last=advanceTour(second.progress,route,'jacobs','visited');
 assert.equal(last.nextId,null);assert.equal(last.progress.finished,true);
 assert.deepEqual(last.progress.visited,['price','jacobs']);
});

test('jumping ahead still returns to unresolved earlier stops without looping over resolved ones',()=>{
 const route=['geisel','price','jacobs'];
 const state={visited:['price'],skipped:[],finished:false};
 const result=advanceTour(state,route,'jacobs','visited');
 assert.equal(result.nextId,'geisel');
 assert.deepEqual(state.visited,['price']);
 const revisited=advanceTour({visited:[],skipped:['geisel'],finished:true},route,'geisel','visited');
 assert.deepEqual(revisited.progress.skipped,[]);
 assert.deepEqual(revisited.progress.visited,['geisel']);
 assert.equal(revisited.progress.finished,false);
});

test('restoring progress rejects other campuses, duplicate outcomes and malformed storage',()=>{
 assert.deepEqual(restoreProgress({visited:['geisel','geisel','rotunda',null],skipped:['geisel','price'],finished:'true'},campus),{visited:['geisel'],skipped:['price'],finished:false});
 for(const value of [null,7,'bad',{visited:{},skipped:42}])assert.deepEqual(restoreProgress(value,campus),empty());
 const progress=empty();
 assert.deepEqual(advanceTour(progress,['geisel'],'unknown','visited'),{progress,nextId:null});
});

test('replanning excludes completed and skipped places, even when they are the best interest match',()=>{
 const initial=recommendTour(campus,profile,tourPoints.ucsd,null);
 const excluded=initial.stops.map(s=>s.id);
 const remaining=recommendTour(campus,profile,tourPoints.ucsd,null,Date.now(),excluded);
 assert.ok(remaining.stops.length>0);
 assert.ok(remaining.stops.every(s=>!excluded.includes(s.id)));
 const complete=recommendTour(campus,profile,tourPoints.ucsd,null,Date.now(),campus.stops.map(s=>s.id));
 assert.equal(complete.status,'complete');assert.deepEqual(complete.stops,[]);
 assert.equal(complete.minutes,null);
});

test('ten minutes allows one nearby stop but does not disguise a long approach as feasible',()=>{
 const now=Date.now(),start={...tourPoints.ucsd.price,accuracy:0,timestamp:now};
 const plan=recommendTour(campus,{...profile,minutes:10},tourPoints.ucsd,start,now);
 assert.equal(plan.stops.length,1);assert.ok(plan.minutes<=10);
 const distant={...start,latitude:start.latitude+0.015};
 const impossible=recommendTour(campus,{...profile,minutes:10},tourPoints.ucsd,distant,now);
 assert.equal(impossible.status,'too-far');assert.deepEqual(impossible.stops,[]);
});

test('remaining unmapped activities never inherit a mapped-start claim',()=>{
 const points={geisel:tourPoints.ucsd.geisel};
 const now=Date.now(),start={...points.geisel,accuracy:0,timestamp:now};
 const plan=recommendTour(campus,profile,points,start,now,['geisel']);
 assert.equal(plan.status,'unmapped');assert.equal(plan.startMeters,null);
});

test('tour voice controls require explicit commands rather than matching ordinary questions',()=>{
 assert.equal(parseCommand('Skip this stop.').type,'skip');
 assert.equal(parseCommand('finish tour').type,'finish');
 for(const question of ['Can I skip the admissions tour?','When does the tour finish?','What is the next stop like?'])assert.equal(parseCommand(question).type,'question');
});
