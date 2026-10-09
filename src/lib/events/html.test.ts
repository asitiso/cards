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


test("bank and broker navigation must not become promotion conditions", async()=>{
  const { splitRules,isBoilerplateRule }=await import("./html.ts");
  const raw=[
    "개인신용정보이용/제공내역조회",
    "계좌통합관리/오픈뱅킹/마이데이터이용제한",
    "예약/기간예약주문내역",
    "ELW 기간등락률 상위",
    "기간 {{yymmddhhmm(event.start_date)}}~ {{yymmddhhmm(event.end_date)}} 조회수 {{event.read_count}} 조기 종료된 이벤트 입니다.",
    "이벤트 대상: 신규 고객이 행사 기간 내 응모 후 5만원 이상 결제해야 합니다.",
    "경품 지급 대상은 행사 참여 중복 당첨에서 제외됩니다.",
  ].join("\n");
  const result=splitRules(raw);
  assert.deepEqual(result.conditions,["이벤트 대상: 신규 고객이 행사 기간 내 응모 후 5만원 이상 결제해야 합니다."]);
  assert.deepEqual(result.exclusions,["경품 지급 대상은 행사 참여 중복 당첨에서 제외됩니다."]);
  assert.equal(isBoilerplateRule("기간 {{event.start_date}} 종료"),true);
});
