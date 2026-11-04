import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {landmarkGuides} from '../web/landmark-data.js';
import {guideById,withHistoricalStops} from '../web/campus-guides.js';
import {tourPoints} from '../web/tour-data.js';
import {recommendTour} from '../web/tour.js';
import {directory} from '../web/directory-data.js';
import {validateMemories} from '../web/core.js';
import {campusContext,parseAnswer} from '../server/guide.mjs';

test('every school at the cutoff, including ties, and Virginia Tech has a feasible on-site start',()=>{
 const original=JSON.parse(readFileSync(new URL('../data/tour-landmarks.json',import.meta.url)));
 assert.deepEqual(original,landmarkGuides);
 assert.equal(original.filter(g=>g.rank!==null&&g.rank<=50).length,51);
 assert.equal(original.filter(g=>g.rank===49).length,3);
 assert.equal(guideById.size,52);
 const now=Date.now(),profile={minutes:10,interest:'study',major:'History',lifestyle:'exploring'};
 let count=0;
 for(const guide of original){
  const entry=directory.find(e=>e.unitid===guide.unitid);
  const c=guideById.get(entry.id),points=tourPoints[c.id];
  assert.ok(c.stops.length>=3);
  assert.equal(new Set(c.stops.map(s=>s.id)).size,c.stops.length);
  assert.match(c.visit,/^https:\/\//);
  for(const stop of c.stops){
   const pin=points[stop.id];assert.ok(pin,stop.name);
   assert.ok(Number.isFinite(pin.latitude)&&Number.isFinite(pin.longitude));
   const plan=recommendTour(c,profile,points,{...pin,accuracy:5,timestamp:now},now);
   assert.equal(plan.status,'ready');assert.ok(plan.stops.length&&plan.minutes<=10);count++;
  }
 }
 assert.equal(count,160);
});

test('tour brief resolves only upcoming stops at the selected campus and retains legacy journal IDs',()=>{
 const c=guideById.get('ipeds-233921');
 assert.equal(c.short,'Virginia Tech');
 const ctx=campusContext({campusId:c.id,stopId:'burruss-hall',major:'History',question:'What should I see next?',visit:{upcoming:['shannon','drillfield','drillfield','burruss-hall'],minutes:20,routine:'commuter',latitude:37.229}});
 assert.deepEqual(ctx.input.visit.upcoming,['Drillfield']);
 assert.equal(ctx.input.visit.plannedMinutes,20);assert.equal(ctx.input.visit.routine,'commuter');
 assert.ok(!JSON.stringify(ctx.input).includes('37.229'));
 const old={id:'old',campusId:c.id,stopId:'arrival',text:'How would my commute feel?',kind:'question',createdAt:'2026-10-27T12:00:00Z'};
 assert.deepEqual(validateMemories([old],[withHistoricalStops(c)]),[old]);
 assert.ok(!c.stops.some(s=>s.id==='arrival'));
});

test('visitor access questions require an institutional web citation even with a real landmark citation',()=>{
 const campusId=directory.find(e=>e.name==='Massachusetts Institute of Technology').id;
 const c=guideById.get(campusId);
 const ctx=campusContext({campusId,stopId:c.stops[0].id,question:'Is it open tonight?'});
 assert.ok(!ctx.domains.has('openstreetmap.org'));
 const answer=url=>parseAnswer({status:'completed',output:[{type:'message',role:'assistant',content:[{type:'output_text',text:'Check visitor access. [S1]',annotations:url?[{type:'url_citation',url}]:[]}]}]},ctx);
 assert.equal(answer().grounded,false);
 assert.equal(answer('https://www.openstreetmap.org/way/123').grounded,false);
 assert.equal(answer('https://www.mit.edu/visitmit/').grounded,true);
});
