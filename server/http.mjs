import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import {askMuse,GuideError} from './guide.mjs';

const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.ttf':'font/ttf'};
const equal=(a,b)=>typeof a==='string'&&Buffer.byteLength(a)===Buffer.byteLength(b)&&timingSafeEqual(Buffer.from(a),Buffer.from(b));
async function jsonBody(req) {
  if(!req.headers['content-type']?.startsWith('application/json'))throw new GuideError(415,'content_type','Send JSON.');
  const parts=[];let size=0;
  for await(const part of req){size+=part.length;if(size>16000)throw new GuideError(413,'too_large','That question is too long.');parts.push(part);}
  try{return JSON.parse(Buffer.concat(parts).toString('utf8'));}catch{throw new GuideError(400,'invalid_json','Send a valid question.');}
}

/** Local browser preview, or a private Android API behind an HTTPS reverse proxy. */
export function createGuideServer({root=resolve(import.meta.dirname,'../web'),apiKey='',model='muse-spark-1.3',pairCode,publicOrigin='',ask=askMuse,now=Date.now}={}) {
  let publicHost='';
  if(publicOrigin){
    const url=new URL(publicOrigin);
    if(url.protocol!=='https:'||url.origin!==publicOrigin||url.username||url.password)throw new Error('Use an HTTPS origin without a path for TMF_PUBLIC_ORIGIN.');
    if(!/^[a-f0-9]{32}$/.test(pairCode??''))throw new Error('Hosted pairing requires a random 32-character hexadecimal code.');
    publicHost=url.host;
  }
  const tokens=new Map();let pairingAttempts=0;let active=0;let calls=0;
  let recent=[];
  return createServer(async(req,res)=>{
    const reply=(status,body)=>{if(res.destroyed)return;res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(body));};
    try {
      const host=req.headers.host??'';
      if(publicHost?host!==publicHost:!/^(127\.0\.0\.1|localhost):\d+$/.test(host))throw new GuideError(403,'host','Open the configured guide server.');
      const origin=req.headers.origin;
      if(origin&&origin!==(publicOrigin||`http://${host}`))throw new GuideError(403,'origin','Open the guide on this server.');
      for(const [token,expires] of tokens)if(expires<=now())tokens.delete(token);
      const token=req.headers.authorization?.replace(/^Bearer /,'');
      const paired=tokens.has(token);
      const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
      if(path==='/api/status'&&req.method==='GET'){reply(200,{configured:Boolean(apiKey),paired,provider:'Meta Model API',model,remaining:Math.max(0,100-calls)});return;}
      if(path==='/api/pair'&&req.method==='POST'){
        if(++pairingAttempts>10)throw new GuideError(429,'pair_limit','Restart the guide server to try pairing again.');
        const body=await jsonBody(req);
        if(!pairCode||!equal(body?.code,pairCode))throw new GuideError(401,'pair_code','That pairing code did not match. Use the code from the guide server terminal.');
        const token=randomBytes(32).toString('hex');tokens.set(token,now()+60*60*1000);reply(200,{token,expiresIn:3600});return;
      }
      if(path==='/api/ask'&&req.method==='POST'){
        const browser=!publicOrigin&&origin===`http://${host}`&&req.headers['x-tmf-client']==='browser';
        if(!browser&&!paired)throw new GuideError(401,'pair_required','Pair the Android app with this guide server. Pairing expires after one hour or a server restart.');
        const body=await jsonBody(req);
        recent=recent.filter(time=>Date.now()-time<60000);
        if(active>=2||recent.length>=12||calls>=100)throw new GuideError(429,'guide_limit','The guide is at its demo request limit. Please wait, or check the guide server.');
        const controller=new AbortController();res.on('close',()=>controller.abort());
        active++;recent.push(Date.now());if(apiKey)calls++;
        try{reply(200,await ask(body,{apiKey,model,signal:controller.signal}));}finally{active--;}
        return;
      }
      if(path.startsWith('/api/'))throw new GuideError(404,'not_found','Unknown guide action.');
      // A hosted instance serves only the paired Android API, never an unprotected web chat.
      if(publicOrigin)throw new GuideError(404,'not_found','Use the paired Android app.');
      if(req.method!=='GET'&&req.method!=='HEAD')throw new GuideError(405,'method','Use GET.');
      const file=resolve(root,'.'+(path==='/'?'/index.html':path));
      if(!file.startsWith(root+sep)||!(extname(file) in mime))throw new GuideError(404,'not_found','Not found.');
      const body=await readFile(file);
      res.writeHead(200,{'Content-Type':mime[extname(file)]+'; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:body);
    }catch(error){reply(error instanceof GuideError?error.status:404,{error:error instanceof GuideError?error.code:'not_found',message:error instanceof GuideError?error.message:'Not found.'});}
  });
}
