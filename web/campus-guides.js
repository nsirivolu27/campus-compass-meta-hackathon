import {campuses as pilot} from './data.js';
import {directory} from './directory-data.js';
import {selfGuidedCampus} from './directory.js';
import {landmarkGuides} from './landmark-data.js';

const entries=new Map(directory.map(entry=>[entry.unitid,entry]));
const themes={
 library:['Study','study','arts'], arts:['Arts','arts','community'],
 science:['Research','science','study'], engineering:['Projects','engineering','science'],
 community:['Student life','community','commuter'], history:['Campus history','arts','community'],
 visitor:['Arrival','community','commuter'], outdoors:['Campus outdoors','community','science']
};
const prompts={
 library:'Where would you spend an hour between classes? Compare the study spaces you can visit.',
 arts:'Look for a public programme. Which performance or exhibit would bring you back?',
 science:'What research question would you want to explore here? Ask how undergraduates get involved.',
 engineering:'Ask a student what they have built recently and how they joined the project.',
 community:'Look for an event you would go to on your own. Would it fit your day?',
 history:'Take a minute outside. What would you tell a friend about this part of campus?',
 visitor:'Ask the visit staff what you could see today that fits your interests.',
 outdoors:'Pause outside and picture crossing this space between two classes.'
};

/** @param {string} url */
export function mapCredit(url){
 const host=new URL(url).hostname;
 if(host==='www.openstreetmap.org')return '© OpenStreetMap contributors';
 if(host==='en.wikipedia.org')return 'Wikipedia landmark coordinates';
 return 'University map location';
}
export const guideById=new Map(pilot.map(campus=>[campus.id,campus]));
/** @type {Map<string,import('./data.js').Campus>} */
export const legacyById=new Map();
for(const guide of landmarkGuides){
 const entry=entries.get(guide.unitid);
 if(!entry||!guide.stops.length)continue;
 const previous=selfGuidedCampus(entry);
 legacyById.set(entry.id,previous);
 const stops=guide.stops.map(place=>{
   const theme=/** @type {keyof typeof themes} */(place.theme);
   const [category,...tags]=themes[theme];
   return {id:place.id,name:place.name,category,tags,prompt:prompts[theme],
     fact:place.fact||`The campus-area map marks ${place.name} near ${guide.name}.`,
     source:place.factUrl||place.mapUrl,sourceName:place.factUrl?guide.name+' · '+place.name:mapCredit(place.mapUrl)+' · '+place.name};
 });
 guideById.set(entry.id,{...previous,name:guide.name,short:guide.name,visit:guide.visitUrl,stops});
}

/** Older journals and saved visits refer to the original reflection activities.
 * @param {import('./data.js').Campus} campus */
export function withHistoricalStops(campus){
 const legacy=legacyById.get(campus.id);
 return legacy?{...campus,stops:[...campus.stops,...legacy.stops]}:campus;
}
