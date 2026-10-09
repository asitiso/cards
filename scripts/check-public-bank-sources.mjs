import { collectPublicBank } from "../src/lib/events/bank-public-collect.ts";

const today = new Intl.DateTimeFormat("en-CA", {
  timeZone:"Asia/Seoul",year:"numeric",month:"2-digit",day:"2-digit",
}).format(new Date());
const banks=["kakaobank","kbank"];
const results=await Promise.all(banks.map((bank)=>collectPublicBank(bank,today)));
let failed=false;
for(let i=0;i<banks.length;i++){
  const hit=results[i];
  console.log(`${banks[i]}: ${hit.events.length} verified ongoing event(s), ok=${hit.ok}; ${hit.message}`);
  if(!hit.ok) failed=true;
}
if(failed) {
  console.error("A public bank source was not verifiable from the CI network. Do not deploy unverified claims.");
  process.exitCode=1;
}
