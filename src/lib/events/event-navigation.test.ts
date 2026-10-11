import test from "node:test";
import assert from "node:assert/strict";
import { eventAppLaunch, eventWebDestination, WOORI_MOBILE_EVENTS_URL } from "./event-navigation.ts";

test("Woori campaign buttons use its official Android and iOS app identifiers",()=>{
  assert.deepEqual(eventAppLaunch("woori"), {
    androidPackage:"com.wooricard.smartapp",
    iosAppId:"1499598869",
    mode:"app",
    appScheme:"com.wooricard.wcard",
  });
});
test("Other card, bank and securities campaign actions retain their original web behavior",()=>{
  for (const issuer of ["shinhan","samsung","kb","mirae","tosssec","nhbank"] as const)
    assert.equal(eventAppLaunch(issuer),null);
});


test("Woori one-tap buttons open exact official mobile event ID without a choice screen",()=>{
  const a=eventWebDestination({issuer:"woori",applyUrl:"https://pc.wooricard.com/dcpc/yh1/bnf/bnf02/prgevnt/movePrgEvntDtl.do?evntSrno=30006298"});
  const b=eventWebDestination({issuer:"woori",applyUrl:"https://pc.wooricard.com/dcpc/yh1/bnf/bnf02/prgevnt/movePrgEvntDtl.do?evntSrno=30006323"});
  assert.equal(a,"https://m.wooricard.com/dcmw/yh1/bnf/bnf02/prgevnt/movePrgEvntDtl.do?evntSrno=30006298");
  assert.notEqual(a,b);
  assert.equal(a.includes("intent:"),false);
  assert.equal(a.includes("play.google.com"),false);
});
test("Woori source shortcut uses the official mobile benefits/events page",()=>{
  assert.equal(WOORI_MOBILE_EVENTS_URL,"https://m.wooricard.com/dcmw/yh1/bnf/bnf01/M1BNF201S00.do");
});
test("Other providers and malformed legacy URLs keep their original links",()=>{
  const src="https://www.samsungcard.com/personal/event";
  assert.equal(eventWebDestination({issuer:"samsung",applyUrl:src}),src);
  const bad="https://pc.wooricard.com/event?bad=1";
  assert.equal(eventWebDestination({issuer:"woori",applyUrl:bad}),bad);
});
