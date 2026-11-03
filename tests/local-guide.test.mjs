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
 assert.equal(validateAnswer(answer).model,'Local Llama 3.1');
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
