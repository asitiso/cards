import test from "node:test";
import assert from "node:assert/strict";
import { wooriDetailUrl, wooriListCondition } from "./woori-details.ts";

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
