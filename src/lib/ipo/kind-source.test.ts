import test from "node:test";
import assert from "node:assert/strict";
import { parseKindIpos } from "./kind-source.ts";

const officialRow = [
  '<table><tbody><tr class="list">',
  '<td><span>코스닥</span> 진코스텍</td>',
  '<td>2026-08-27</td>',
  '<td>2026-09-16 ~ 2026-09-22</td>',
  '<td>2026-10-02 ~ 2026-10-06</td>',
  '<td>2026-10-08</td>',
  '<td>23,500</td>',
  '<td>20,022</td>',
  '<td>2026-10-15</td>',
  '<td>하나증권주식회사</td>',
  '</tr></tbody></table>',
].join("");

test("parses a KRX 9-column offering without fabricating minimum deposit", () => {
  const rows = parseKindIpos(officialRow);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].name, "진코스텍");
  assert.equal(rows[0].market, "코스닥");
  assert.equal(rows[0].subscriptionStart, "2026-10-02");
  assert.equal(rows[0].subscriptionEnd, "2026-10-06");
  assert.equal(rows[0].offerPrice, 23500);
  assert.deepEqual(rows[0].brokers, ["하나증권"]);
  assert.equal(rows[0].minimumShares, null);
  assert.equal(rows[0].depositPercent, null);
});

test("rejects navigation rows and malformed dates", () => {
  assert.deepEqual(parseKindIpos('<table><tr><td>메뉴</td></tr></table>'), []);
  assert.deepEqual(parseKindIpos(officialRow.replace("2026-10-02", "2026-13-40")), []);
});

test("deduplicates the same offering displayed twice", () => {
  const repeated = officialRow.replace("</tbody>", officialRow.match(/<tr[\s\S]*?<\/tr>/)?.[0] + "</tbody>");
  assert.equal(parseKindIpos(repeated).length, 1);
});
