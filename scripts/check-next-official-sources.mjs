import { collectNewOfficialSource, PUBLIC_PROMOTIONS } from "../src/lib/events/official-public-sources.ts";
import { fetchText, stripTags, visibleMarkup } from "../src/lib/events/html.ts";
const today = new Intl.DateTimeFormat("en-CA", {timeZone:"Asia/Seoul", year:"numeric", month:"2-digit", day:"2-digit"}).format(new Date());
const ids = ["nhbank", "nhsec", "kakaopaysec", "shinhanbank", "tossbank"];
const results = await Promise.all(ids.map(id=>collectNewOfficialSource(id,today)));
let verified=0;
for(const result of results){
  console.log(result.issuer+": "+result.events.length+" verified; "+result.message);
  for(const event of result.events)console.log("  "+event.startDate+"~"+event.endDate+" "+event.title);
  if(result.events.length)verified+=1;
}
for(const issuer of ids.filter(id=>!results.find(r=>r.issuer===id)?.ok)){
  const cases=PUBLIC_PROMOTIONS[issuer];
  for (const p of cases){
    try {
      const html=await fetchText(p.url,{},5500);
      const text=stripTags(visibleMarkup(html)).replace(/\s+/g," ");
      console.log("DIAG "+issuer+" host="+new URL(p.url).hostname+" length="+html.length+
        " identity="+p.identity.test(text)+" date="+p.dateEvidence.test(text)+
        " title="+(text.slice(0,110).replace(/[\r\n]/g," ")));
    }catch(error) {
      console.log("DIAG "+issuer+" host="+new URL(p.url).hostname+
        " request_failed="+String(error instanceof Error ? error.message : error).slice(0,150));
    }
  }
}
if(!verified) {console.error("No verified live promotional source: block release.");process.exitCode=1;}
const required=["shinhanbank","tossbank","nhsec"];
const failed=required.filter(id=>!results.find(r=>r.issuer===id)?.ok);
if(failed.length){console.error("Release blocked: live verified promotion not found for "+failed.join(", "));process.exitCode=1;}
if(verified<ids.length) console.warn("Incomplete coverage: do not claim zero-hit sources fixed.");
