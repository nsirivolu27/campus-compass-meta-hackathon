/** Prepare spoken text without changing the displayed answer or its sources. @param {string} text */
export function narrationText(text) {
 return text
  .replace(/\[([^\]]+)\]\(https?:\/\/[^\s)]+\)/g,'$1')
  .replace(/\[S\d+(?:\s*,\s*S?\d+)*\]/g,'')
  .replace(/https?:\/\/\S+/g,'')
  .replace(/\*\*([^*]+)\*\*/g,'$1')
  .replace(/^\s*(?:#{1,6}\s+|[-*•]\s+|\d+\.\s+)/gm,'')
  .replace(/([^.!?:;\n])\n+/g,'$1. ')
  .replace(/[—–]/g,', ')
  .replace(/\b(UVA|UCSD|UCLA|UIUC|MIT)\b/g,word=>word.split('').join(' '))
  .replace(/\s+([,.!?;:])/g,'$1')
  .replace(/\s+/g,' ').trim().slice(0,3500);
}

/** @param {string} pace */
export function narrationRate(pace) {
 return pace==='relaxed'?0.9:pace==='brisk'?1.05:0.97;
}

/** Browsers expose no quality score. Prefer explicitly enhanced local English voices.
 * @template {{name:string,lang:string,localService:boolean,default:boolean}} T
 * @param {T[]} voices @returns {T|undefined}
 */
export function browserVoice(voices) {
 const candidates=voices.filter(voice=>voice.localService&&/^en(?:[-_]|$)/i.test(voice.lang));
 /** @param {T} voice */
 const score=voice=>Number(/natural|neural|enhanced|premium/i.test(voice.name))*100+
  Number(/^en[-_]US$/i.test(voice.lang))*10+Number(voice.default);
 return candidates.slice().sort((a,b)=>score(b)-score(a))[0];
}
