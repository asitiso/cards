import test from "node:test";
import assert from "node:assert/strict";
import { parse38Terms } from "./terms.server.ts";

test("reads only retail investor minimum and margin from a matching IPO detail", () => {
  const html = "<html><body>빅웨이브로보틱스 " +
    "우리사주조합 청약증거금율 : 100% " +
    "기관투자자등 청약한도 100,000 주 " +
    "일반청약자 500,000 주 청약증거금율 : 50% 청약 최고한도 : 3000 주 최저 : 10 주 " +
    "IR일정 기관투자자</body></html>";
  assert.deepEqual(parse38Terms(html, "빅웨이브로보틱스"), {
    minimumShares: 10, depositPercent: 50, verified: true,
  });
});

test("unknown minima stay unknown", () => {
  const html = "<p>빅웨이브로보틱스 일반청약자 청약증거금율 : 50% 최저 : - 주 IR일정</p>";
  const parsed = parse38Terms(html, "빅웨이브로보틱스");
  assert.equal(parsed.minimumShares, null);
  assert.equal(parsed.depositPercent, 50);
});

test("rejects unrelated issuer details", () => {
  const html = "<p>다른 기업 일반청약자 청약증거금율 : 50% 최저 : 10 주 IR일정</p>";
  assert.equal(parse38Terms(html, "빅웨이브로보틱스").verified, false);
});
