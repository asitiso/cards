import test from "node:test";
import assert from "node:assert/strict";
import { wooriDetailUrl, wooriListCondition, wooriEventHandoffUrl, wooriAndroidEventIntent } from "./woori-details.ts";

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

test("Official app-only event QR handoff keeps the exact individual campaign ID",()=>{
  const source=wooriDetailUrl("30006298");
  const handoff=wooriEventHandoffUrl(source);
  assert.equal(handoff,"https://m.wooricard.com/dcmw/yh1/mlk/mlk03/M1MLK303S01.do?pageId=yh1/bnf/bnf02/prgevnt/movePrgEvntDtl.do?evntSrno=30006298");
  assert.equal(wooriEventHandoffUrl("https://m.wooricard.com/dcmw/yh1/bnf/bnf02/prgevnt/movePrgEvntDtl.do?evntSrno=30006298"),handoff);
  assert.notEqual(wooriEventHandoffUrl(wooriDetailUrl("30006323")),handoff);
});
test("Woori native Android intent targets official event handoff with MOBILE fallback, never store",()=>{
  const handoff=wooriEventHandoffUrl(wooriDetailUrl("30006298"));
  const intent=wooriAndroidEventIntent(handoff);
  assert.match(intent,/^intent:\/\/m\.wooricard\.com\/dcmw\/yh1\/mlk\/mlk03\/M1MLK303S01\.do\?/);
  assert.match(intent,/package=com\.wooricard\.smartapp/);
  assert.ok(intent.includes("S.browser_fallback_url="+encodeURIComponent(handoff)));
  assert.equal(intent.includes("play.google.com"),false);
  assert.equal(intent.includes("com.wooricard.wcard"),false);
});
test("Campaign handoff only accepts Woori-owned event routes and numeric serials",()=>{
  assert.throws(()=>wooriEventHandoffUrl("https://bad.example/prgevnt/movePrgEvntDtl.do?evntSrno=30006298"));
  assert.throws(()=>wooriEventHandoffUrl("https://pc.wooricard.com/dcpc/yh1/bnf/bnf02/prgevnt/movePrgEvntDtl.do?evntSrno=1%3Bpackage%3Devil"));
  assert.throws(()=>wooriAndroidEventIntent("https://unknown.example/event?id=30006298"));
});
