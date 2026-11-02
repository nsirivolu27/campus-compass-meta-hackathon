import {loadEnvFile} from 'node:process';
import {resolve} from 'node:path';
import {randomInt,randomBytes} from 'node:crypto';
import {createGuideServer} from '../server/http.mjs';
try{loadEnvFile(resolve(import.meta.dirname,'../.env.local'));}catch(error){if(error.code!=='ENOENT')throw new Error('Could not read .env.local. Check its format.');}
const publicOrigin=process.env.TMF_PUBLIC_ORIGIN?.trim()??'';
const pairCode=publicOrigin?randomBytes(16).toString('hex'):String(randomInt(10000000,100000000));
const apiKey=process.env.MODEL_API_KEY?.trim()??'';
if(publicOrigin&&!apiKey)throw new Error('Configure MODEL_API_KEY in the host secret store before starting the HTTPS guide.');
const port=Number(process.env.PORT||4317);
if(!Number.isInteger(port)||port<1||port>65535)throw new Error('PORT must be between 1 and 65535.');
const server=createGuideServer({apiKey,model:process.env.META_MODEL||'muse-spark-1.3',pairCode,publicOrigin});
server.listen(port,publicOrigin?'0.0.0.0':'127.0.0.1',()=>{
  console.log(`Try My Future: ${publicOrigin||`http://127.0.0.1:${port}`}`);
  console.log(apiKey?'Muse Spark key configured. An actual question will check model access.':'Muse Spark needs setup: run powershell -File scripts/setup-ai.ps1');
  console.log(`Private Android pairing code: ${pairCode}`);
  console.log(publicOrigin?'HTTPS proxy required. Pair from the matching Android build. Tokens expire in one hour. Keep this console private.':`Run adb reverse tcp:${port} tcp:${port}, then enter this code in the app’s Glasses settings.`);
  console.log('Local demo limit: 100 model requests per server run; 12/minute, 2 concurrent.');
});
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>{server.close(()=>process.exit(0));setTimeout(()=>process.exit(0),5000).unref();});
