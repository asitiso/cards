import { collectPublicBroker } from "../src/lib/events/broker-public-collect.ts";
const today=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Seoul",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
const hits=await Promise.all(["kiwoom","shinhansec"].map((id)=>collectPublicBroker(id,today)));
let failed=false;
for(const hit of hits){
  console.log(hit.issuer+": "+hit.events.length+" verified, "+hit.message);
  for(const event of hit.events) console.log("  "+event.title+" "+event.startDate+"~"+event.endDate);
  if(!hit.ok) failed=true;
}
if(failed) {console.error("Public broker source missing: block release; do not count unverified events.");process.exitCode=1;}
