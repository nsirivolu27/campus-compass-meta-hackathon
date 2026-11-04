import test from 'node:test';
import assert from 'node:assert/strict';
import {askLocalLlama} from '../server/llama.mjs';
import {campusContext} from '../server/guide.mjs';
import {validateAnswer} from '../web/guide.js';
import {directory} from '../web/directory-data.js';

const q={campusId:'uva',stopId:'shannon',question:'Where can I explore digital humanities?'};
const fake=source=>async()=>({ok:true,json:async()=>({done:true,message:{content:JSON.stringify({source,text:'invented answer',url:'https://invalid.example'})}})});
test('local inference can select evidence but cannot supply the displayed facts or citation',async()=>{
 const record=campusContext(q).sources.find(s=>s.place==='Shannon Library');
 const answer=await askLocalLlama(q,{fetchImpl:fake(record.id)});
 assert.equal(answer.text,record.fact);assert.equal(answer.sources[0].url,record.url);
 assert.equal(validateAnswer(answer).model,'Local Llama 3.2');
 for(const id of ['unknown','S999'])assert.equal((await askLocalLlama(q,{fetchImpl:fake(id)})).grounded,false);
});
test('a building record cannot verify opening hours, and a directory entry is not a building guide',async()=>{
 let called=false;
 const fetchImpl=async()=>{called=true;throw Error();};
 for(const query of [{...q,question:'Is it open until midnight tonight?'},{...q,campusId:directory.find(e=>e.coverage==='self-guided').id}]){
   assert.equal((await askLocalLlama(query,{fetchImpl})).grounded,false);
 }
 assert.equal(called,false);
});

test('local evidence selection keeps follow-ups but omits unrelated visitor and routing data',async()=>{
 let sent;
 const history=[{question:'Tell me about Shannon Library.',answer:'It has study spaces.'}];
 await askLocalLlama({...q,history,major:'History',interests:'Quiet study',visit:{minutes:40,routine:'commuter',upcoming:['rotunda']}},{fetchImpl:async(url,options)=>{
  sent=JSON.parse(JSON.parse(options.body).messages[1].content);
  return {ok:true,json:async()=>({done:true,message:{content:'{"source":"unknown"}'}})};
 }});
 assert.equal(sent.question,q.question);assert.deepEqual(sent.history,history);
 assert.equal(sent.selectedStop,'Shannon Library');
 assert.equal(sent.major,undefined);assert.equal(sent.visit,undefined);
 assert.ok(sent.sources.every(source=>source.id&&source.place&&source.fact&&!source.url));
});
