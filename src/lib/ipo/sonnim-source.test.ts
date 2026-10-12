import assert from "node:assert/strict";
import test from "node:test";
import { parseSonnimIpos } from "./sonnim-source.ts";

const page = [
  '<main><h2>청약 예정</h2><p>청약이 아직 끝나지 않은 종목</p>',
  '<table><thead><tr><th>종목</th><th>청약기간</th><th>희망 밴드</th><th>확정 공모가</th><th>기관 경쟁률</th><th>수요예측일</th><th>상장 예정일</th><th>주관사</th></tr></thead><tbody>',
  '<tr><th scope="row"><a href="/ipo/dts/">디티에스</a></th><td>10.13~14</td><td>17,000~18,500원</td><td>확정 전</td><td>결과 전</td><td>2026년 10월 1일</td><td>미정</td><td>대신증권, 유진투자증권</td></tr>',
  '<tr><td>바로팜</td><td>11.2~3</td><td>16,400~20,200원</td><td>확정 전</td><td>결과 전</td><td>2026년 10월 22일</td><td>미정</td><td>미래에셋증권</td></tr>',
  '</tbody></table>',
  '<h2>2026년 10월</h2><p>청약 4건</p>',
  '<table><thead><tr><th>종목</th><th>청약기간</th><th>확정 공모가</th><th>희망 밴드</th><th>청약 경쟁률</th><th>상장일</th><th>주관사</th></tr></thead><tbody>',
  '<tr><th scope="row"><a href="/ipo/ms/">엠에스바이오</a></th><td>10.12~13</td><td>7,800원</td><td>6,800~7,800원</td><td>-</td><td>2026년 10월 22일</td><td>KB증권</td></tr>',
  '<tr><td>진코스텍</td><td>10.2~6</td><td>23,500원</td><td>19,500~23,500원</td><td>685 : 1</td><td>2026년 10월 15일</td><td>하나증권</td></tr>',
  '</tbody></table>',
  '</main>',
].join("");

test("parses today's subscription, future subscription and previous listings", () => {
  const rows = parseSonnimIpos(page, "2026-10-12");
  assert.equal(rows.length, 4);
  const today = rows.find((x) => x.name === "엠에스바이오");
  assert.ok(today);
  assert.equal(today.subscriptionStart, "2026-10-12");
  assert.equal(today.subscriptionEnd, "2026-10-13");
  assert.equal(today.offerPrice, 7800);
  assert.equal(today.listingDate, "2026-10-22");
  assert.deepEqual(today.brokers, ["KB증권"]);
  assert.match(today.sourceUrl, /^https:\/\/www\.sonnimlab\.com\/ipo\//);
});

test("never substitutes a preliminary price range for confirmed offer price", () => {
  const rows = parseSonnimIpos(page, "2026-10-12");
  const upcoming = rows.find((x) => x.name === "디티에스");
  assert.ok(upcoming);
  assert.equal(upcoming.offerPrice, null);
  assert.equal(upcoming.indicativePriceRange, "17,000~18,500원");
  assert.equal(upcoming.subscriptionEnd, "2026-10-14");
  assert.deepEqual(upcoming.brokers, ["대신증권", "유진투자증권"]);
  assert.equal(upcoming.minimumShares, null);
});

test("resolves November and next-January year without fake dates", () => {
  const november = parseSonnimIpos(page, "2026-10-12").find(x => x.name === "바로팜");
  assert.equal(november?.subscriptionStart, "2026-11-02");
  const januaryPage = page.replace("11.2~3", "1.4~5");
  const result = parseSonnimIpos(januaryPage, "2026-12-12");
  assert.equal(result.find(x => x.name === "바로팜")?.subscriptionStart, "2027-01-04");
});

test("ignores navigation, impossible dates, and malicious external detail links", () => {
  assert.deepEqual(parseSonnimIpos('<table><tr><td>홈</td></tr></table>', "2026-10-12"), []);
  const bogus = page.replace("10.12~13", "10.42~43");
  assert.equal(parseSonnimIpos(bogus, "2026-10-12").some(x => x.name === "엠에스바이오"), false);
  const malicious = page.replace('href="/ipo/ms/"', 'href="https://evil.example/path"');
  assert.equal(
    parseSonnimIpos(malicious, "2026-10-12").find(x => x.name === "엠에스바이오")?.sourceUrl,
    "https://www.sonnimlab.com/schedule/",
  );
});
