import { collectTossSecurities, TOSS_SECURITIES_NEWSROOM } from "../src/lib/events/tosssec-collect.ts";
const today = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul", year:"numeric",month:"2-digit",day:"2-digit"
}).format(new Date());
const hit = await collectTossSecurities(today);
console.log("Toss Securities official source:",TOSS_SECURITIES_NEWSROOM);
console.log("Toss Securities confirmed ongoing:",hit.events.length);
console.log("Status:",hit.message);
for(const event of hit.events)console.log(event.startDate,event.endDate,event.title,event.applyUrl);
if (hit.message.includes("접속에 실패")) {
  console.error("Official newsroom is inaccessible: do not claim successful source verification.");
  process.exitCode = 1;
}
if (hit.events.some((event) => event.issuer !== "tosssec" || event.endDate < today)) {
  console.error("Invalid or expired official promotion detected");
  process.exitCode = 1;
}
