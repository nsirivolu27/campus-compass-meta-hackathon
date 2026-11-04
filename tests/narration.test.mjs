import test from 'node:test';
import assert from 'node:assert/strict';
import {narrationText,narrationRate,browserVoice} from '../web/narration.js';

test('spoken answers omit citation markup while preserving names, times and uncertainty',()=>{
 const text='Visit **Newman Library** [S1].\nCheck [visitor hours](https://www.vt.edu/visit.html) — I cannot confirm 9:30 a.m. access.\n- Ask about the $5 fee.';
 assert.equal(narrationText(text),'Visit Newman Library. Check visitor hours, I cannot confirm 9:30 a.m. access. Ask about the $5 fee.');
 assert.equal(narrationText('UVA and MIT. See https://example.edu [S2, S3]'),'U V A and M I T. See');
 assert.equal(narrationText('First observation\nNext observation'),'First observation. Next observation');
});

test('voice selection does not switch languages or add a remote provider for a quality label',()=>{
 const voices=[
  {name:'Default',lang:'en-US',localService:true,default:true},
  {name:'Natural',lang:'fr-FR',localService:true,default:false},
  {name:'Premium online',lang:'en-US',localService:false,default:false},
  {name:'Enhanced English',lang:'en-US',localService:true,default:false},
 ];
 assert.equal(browserVoice(voices)?.name,'Enhanced English');
 assert.equal(voices[0].name,'Default');
 assert.equal(browserVoice(voices.slice(1,3)),undefined);
 assert.equal(browserVoice([]),undefined);
 assert.equal(browserVoice(voices.slice(0,1))?.name,'Default');
});

test('invalid saved pace cannot make narration unintelligible',()=>{
 assert.equal(narrationRate('relaxed'),0.9);
 assert.equal(narrationRate('natural'),0.97);
 assert.equal(narrationRate('brisk'),1.05);
 assert.equal(narrationRate('999'),0.97);
});
