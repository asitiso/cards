import test from "node:test";
import assert from "node:assert/strict";
import { wooriDetailUrl, wooriListCondition, wooriEventHandoffUrl, wooriAndroidEventIntent, wooriAppHomeLaunchIntent } from "./woori-details.ts";

test("Woori public event serial resolves to its own detail, not the whole list", () => {
  assert.equal(wooriDetailUrl("30006298"),
    "https://pc.wooricard.com/dcpc/yh1/bnf/bnf02/prgevnt/movePrgEvntDtl.do?evntSrno=30006298");
  assert.notEqual(wooriDetailUrl("30006298"),wooriDetailUrl("30006323"));
});
test("invalid serial cannot be used for URL injection",()=>{
  assert.throws(()=>wooriDetailUrl("../login?session=1"));
  assert.throws(()=>wooriDetailUrl(""));
});
test("Woori benefit description is not made into a fake eligibility requirement",()=>{
  assert.deepEqual(wooriListCondition("최대 20만원 캐시백 받아가세요"),[]);
  assert.deepEqual(wooriListCondition("50만원 이상 이용하면, 최대 1만원 캐시백"),["50만원 이상 이용하면, 최대 1만원 캐시백"]);
});

test("Official mobile event detail keeps the exact individual campaign ID",()=>{
  const source=wooriDetailUrl("30006298");
  const mobile=wooriEventHandoffUrl(source);
  assert.equal(mobile,"https://m.wooricard.com/dcmw/yh1/bnf/bnf02/prgevnt/movePrgEvntDtl.do?evntSrno=30006298");
  assert.equal(wooriEventHandoffUrl(mobile),mobile);
  assert.notEqual(wooriEventHandoffUrl(wooriDetailUrl("30006323")),mobile);
});
test("Android intent tries Woori app with the official MOBILE event as fallback, never Play",()=>{
  const mobile=wooriEventHandoffUrl(wooriDetailUrl("30006298"));
  const intent=wooriAndroidEventIntent(mobile);
  assert.match(intent,/^intent:\/\/m\.wooricard\.com\/dcmw\/yh1\/bnf\/bnf02\/prgevnt\/movePrgEvntDtl\.do\?/);
  assert.match(intent,/package=com\.wooricard\.smartapp/);
  assert.ok(intent.includes("S.browser_fallback_url="+encodeURIComponent(mobile)));
  assert.equal(intent.includes("play.google.com"),false);
  assert.equal(intent.includes("com.wooricard.wcard"),false);
});
test("Campaign mobile link only accepts Woori-owned routes and numeric serials",()=>{
  assert.throws(()=>wooriEventHandoffUrl("https://bad.example/prgevnt/movePrgEvntDtl.do?evntSrno=30006298"));
  assert.throws(()=>wooriEventHandoffUrl("https://pc.wooricard.com/dcpc/yh1/bnf/bnf02/prgevnt/movePrgEvntDtl.do?evntSrno=1%3Bpackage%3Devil"));
  assert.throws(()=>wooriAndroidEventIntent("https://unknown.example/event?id=30006298"));
});


test("Woori app home launch intent does not masquerade as an event deep link",()=>{
  const serial="30006298";
  const page=wooriDetailUrl(serial);
  const intent=wooriAppHomeLaunchIntent(page);
  assert.match(intent,/^intent:\/\/#Intent;action=android\.intent\.action\.MAIN;/);
  assert.match(intent,/category=android\.intent\.category\.LAUNCHER/);
  assert.match(intent,/package=com\.wooricard\.smartapp/);
  assert.equal(intent.includes("com.wooricard.wcard"),false);
  assert.equal(intent.includes("play.google.com"),false);
  assert.ok(intent.includes("S.browser_fallback_url="+encodeURIComponent(wooriEventHandoffUrl(page))));
  assert.notEqual(wooriAppHomeLaunchIntent(wooriDetailUrl("30006323")),intent);
});
test("Woori launcher rejects outside hosts and injected event IDs",()=>{
  assert.throws(()=>wooriAppHomeLaunchIntent("https://evil.example/event?id=30006298"));
  assert.throws(()=>wooriAppHomeLaunchIntent("https://m.wooricard.com/dcmw/yh1/bnf/bnf02/prgevnt/movePrgEvntDtl.do?evntSrno=evil"));
});
