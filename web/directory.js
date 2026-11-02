/** @typedef {import('./data.js').Campus} Campus */
/** @typedef {{id:string,unitid:string,name:string,aliases:string,city:string,state:string,address:string,zip:string,website:string,admissions:string,accessibility:string,level:number,control:number,latitude:number|null,longitude:number|null,coverage:string}} DirectoryEntry */
/** @param {string} value */
const normalize=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

/** @param {DirectoryEntry[]} records @param {string} query @param {string} state @param {number} [limit] */
export function searchCampuses(records,query,state='',limit=25){
 const phrase=normalize(query),words=phrase.split(' ').filter(Boolean);
 const matches=records.filter(r=>(!state||r.state===state)&&words.every(w=>normalize(`${r.name} ${r.aliases} ${r.city} ${r.state}`).includes(w)));
 /** @param {DirectoryEntry} record */
 function relevance(record){
  if(!phrase)return 0;
  const name=normalize(record.name),aliases=normalize(record.aliases);
  if(name===phrase)return 100;
  if(record.aliases.split(/[,;|]|\s{2,}/).some(alias=>normalize(alias)===phrase))return 90;
  if(` ${aliases} `.includes(` ${phrase} `))return 80;
  if(name.startsWith(phrase))return 70;
  if(` ${name} `.includes(` ${phrase} `))return 60;
  if(normalize(record.city)===phrase)return 50;
  return words.every(word=>` ${name} ${aliases} `.includes(` ${word} `))?40:0;
 }
 const ranked=matches.map(record=>({record,score:relevance(record)})).sort((a,b)=>b.score-a.score);
 return {total:matches.length,records:ranked.slice(0,limit).map(item=>item.record)};
}

/** Universal reflection activities, never represented as verified campus locations.
 * @param {DirectoryEntry} entry @returns {Campus} */
export function selfGuidedCampus(entry){
 const source=entry.admissions||entry.website||`https://nces.ed.gov/collegenavigator/?id=${entry.unitid}`;
 const activities=[
  {id:'arrival',name:'Your first impression',tags:['community','commuter'],prompt:'When you arrive, notice how you feel. What helps you find your way, and what would you ask a student?'},
  {id:'learning',name:'Picture your learning day',tags:['engineering','science','arts'],prompt:'Ask an adviser how students explore your interests. What would you want to make, study or discover here?'},
  {id:'routine',name:'Imagine your everyday',tags:['study','commuter'],prompt:'Ask about study spaces and your daily commute. Where would you spend the time between classes?'},
  {id:'belonging',name:'Find your people',tags:['community','arts'],prompt:'Ask about clubs, support services and student communities. What would help you feel that you belong?'}
 ];
 return {id:entry.id,name:entry.name,short:entry.name,city:entry.city,state:entry.state,theme:'coast',description:'Make this visit your own.',visit:source,
  stops:activities.map(a=>({...a,category:'Reflection',fact:'This is a self-guided reflection activity, not a verified building or tour stop. Check the institution’s website for visit arrangements and access before you travel.',source,sourceName:'Institution information · IPEDS-listed link'}))};
}
