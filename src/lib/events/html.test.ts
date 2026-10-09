import test from "node:test";
import assert from "node:assert/strict";
import { parseRange, isEntryCopy } from "./html.ts";

test("standard date ranges",()=>{
  assert.deepEqual(parseRange("2026.10.01 ~ 2026.10.31"),{start:"2026-10-01",end:"2026-10-31"});
});
test("Korean and dash-separated dates work",()=>{
  assert.deepEqual(parseRange("2026년 10월 1일 ~ 2026-10-31"),{start:"2026-10-01",end:"2026-10-31"});
});
test("do not accept an impossible calendar day",()=>{
  assert.equal(parseRange("2026-02-30 ~ 2026-03-01"),null);
});
test("explicit coupon participation works without generic account sign-up",()=>{
  assert.equal(isEntryCopy("마이태그를 눌러주세요"),true);
  assert.equal(isEntryCopy("이벤트 신청하기"),true);
  assert.equal(isEntryCopy("별도 응모 없이 자동 적용됩니다"),false);
});
