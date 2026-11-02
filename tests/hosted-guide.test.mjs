import test from 'node:test';
import assert from 'node:assert/strict';
import {request as httpRequest} from 'node:http';
import {createGuideServer} from '../server/http.mjs';

const pairCode='a'.repeat(32);
const publicOrigin='https://guide.example.test';
const question={campusId:'ucsd',stopId:'geisel',question:'Where can I study?'};

// Exercise the proxy-facing Host header explicitly; fetch normalizes it to the URL.
function send(url,body,headers={}){
 return new Promise((resolve,reject)=>{
  const req=httpRequest(url,{method:body?'POST':'GET',headers:{Host:'guide.example.test','Content-Type':'application/json',...headers}},res=>{
   let text='';res.setEncoding('utf8');res.on('data',chunk=>text+=chunk);
   res.on('end',()=>resolve({status:res.statusCode,json:async()=>JSON.parse(text)}));
  });
  req.on('error',reject);req.end(body?JSON.stringify(body):undefined);
 });
}

test('hosted mode rejects insecure origins and short pairing secrets',()=>{
 for(const origin of ['http://guide.example.test','https://guide.example.test/path','https://user:password@guide.example.test','https://guide.example.test?key=value']){
  assert.throws(()=>createGuideServer({publicOrigin:origin,pairCode}));
 }
 assert.throws(()=>createGuideServer({publicOrigin,pairCode:'12345678'}),/32-character/);
});

test('hosted API requires a paired Android token, including requests forging browser headers',async t=>{
 let modelCalls=0,clock=1000;
 const server=createGuideServer({apiKey:'fixture-secret',publicOrigin,pairCode,now:()=>clock,ask:async()=>{modelCalls++;return {text:'Fixture answer',sources:[],grounded:false};}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 t.after(()=>new Promise(resolve=>{server.close(resolve);server.closeAllConnections();}));
 const base=`http://127.0.0.1:${server.address().port}`;
 const request=(path,body,headers={})=>send(base+path,body,headers);
 assert.equal((await request('/api/status',null,{Host:'attacker.example'})).status,403);
 assert.equal((await request('/api/ask',question,{Origin:publicOrigin,'X-TMF-Client':'browser'})).status,401);
 assert.equal((await request('/api/ask',question,{Origin:'https://attacker.example'})).status,403);
 for(const path of ['/','/app.js','/.env.local'])assert.equal((await request(path)).status,404);
 const paired=await (await request('/api/pair',{code:pairCode})).json();
 assert.equal(paired.expiresIn,3600);
 const auth={Authorization:`Bearer ${paired.token}`};
 const status=await (await request('/api/status',null,auth)).json();
 assert.equal(status.paired,true);
 assert.doesNotMatch(JSON.stringify(status),/fixture-secret|aaaaaaaa/);
 assert.equal((await request('/api/ask',question,auth)).status,200);
 clock+=3600000;
 assert.equal((await (await request('/api/status',null,auth)).json()).paired,false);
 assert.equal((await request('/api/ask',question,auth)).status,401);
 assert.equal(modelCalls,1);
});

test('pairing attempts are bounded before they can authorize model calls',async t=>{
 const server=createGuideServer({publicOrigin,pairCode});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 t.after(()=>new Promise(resolve=>{server.close(resolve);server.closeAllConnections();}));
 const base=`http://127.0.0.1:${server.address().port}`;
 const pair=code=>send(base+'/api/pair',{code});
 for(let i=0;i<10;i++)assert.equal((await pair('wrong')).status,401);
 assert.equal((await pair(pairCode)).status,429);
});
