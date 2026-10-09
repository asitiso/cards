import { collectNewOfficialSource } from "../src/lib/events/official-public-sources.ts";
const today = new Intl.DateTimeFormat("en-CA", {timeZone:"Asia/Seoul", year:"numeric", month:"2-digit", day:"2-digit"}).format(new Date());
const ids = ["nhbank", "nhsec", "kakaopaysec"];
const results = await Promise.all(ids.map(id=>collectNewOfficialSource(id,today)));
let verified=0;
for(const result of results){
  console.log(result.issuer+": "+result.events.length+" verified; "+result.message);
  for(const event of result.events)console.log("  "+event.startDate+"~"+event.endDate+" "+event.title);
  if(result.events.length)verified+=1;
}
if(!verified) { console.error("No verified live promotional source: block release."); process.exitCode=1; }
if(verified<ids.length) console.warn("Incomplete coverage: do not claim zero-hit sources fixed.");
