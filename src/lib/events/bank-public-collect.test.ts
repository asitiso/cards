import test from "node:test";
import assert from "node:assert/strict";
import { officialBankPeriod, officialBankEvent } from "./bank-public-collect.ts";

test("full-year and short-year official event periods", () => {
  assert.deepEqual(officialBankPeriod("2026.09.22 ~ 2026.10.31"), { start:"2026-09-22", end:"2026-10-31" });
  assert.deepEqual(officialBankPeriod("26.10.1~26.10.31"), { start:"2026-10-01", end:"2026-10-31" });
  assert.deepEqual(officialBankPeriod("2026. 9.28 - 10.28"), { start:"2026-09-28", end:"2026-10-28" });
});
test("invalid dates and undated material cannot create promotions", () => {
  assert.equal(officialBankPeriod("26.02.30 ~ 26.03.01"), null);
  assert.equal(officialBankPeriod("일상적인 계좌 안내"), null);
});
test("only official page with matching source terms and current dates is recorded", () => {
  const page = {
    url:"https://www.kbanknow.com/web/product/invest/korea",
    title:"케이뱅크 한국투자증권 계좌 개설 제휴 혜택",
    benefit:"투자지원금",
    mustContain:/한국투자증권/,
  };
  const html="<main><h2>한국투자증권 이벤트</h2><p>2026.09.22 ~ 2026.10.31</p><p>주식 추첨 응모</p></main>";
  const event = officialBankEvent("kbank",page,html,"2026-10-09");
  assert.equal(event?.startDate,"2026-09-22");
  assert.equal(event?.issuer,"kbank");
  assert.equal(officialBankEvent("kbank",page,html,"2026-11-01"),null);
  assert.equal(officialBankEvent("kbank",page,html.replace("한국투자증권","기타"),"2026-10-09"),null);
});
