import test from "node:test";
import assert from "node:assert/strict";
import { parse38Ipos } from "./comm38-source.ts";

const sample = '<table><tr>' +
  '<td><a href="/html/fund/index.htm?o=v&no=123">빅웨이브로보틱스</a></td>' +
  '<td>2026.10.12~10.13</td>' +
  '<td>7,800</td><td>6,800~7,800</td><td>100:1</td>' +
  '<td>KB증권,삼성증권</td><td>분석</td></tr></table>';

test("parses dated 38 public schedule rows with confirmed price and brokers", () => {
  const result = parse38Ipos(sample);
  assert.equal(result.length, 1);
  assert.equal(result[0].name, "빅웨이브로보틱스");
  assert.equal(result[0].offerPrice, 7800);
  assert.deepEqual(result[0].brokers, ["KB증권", "삼성증권"]);
  assert.equal(result[0].subscriptionEnd, "2026-10-13");
  assert.equal(result[0].minimumShares, null);
  assert.equal(result[0].depositPercent, null);
  assert.match(result[0].sourceUrl, /^https:\/\/www\.38\.co\.kr\//);
});

test("does not invent confirmed price from an indicative price range", () => {
  const result = parse38Ipos(sample.replace("<td>7,800</td>", "<td>-</td>"));
  assert.equal(result.length, 1);
  assert.equal(result[0].offerPrice, null);
});

test("rejects unrelated table rows and impossible dates", () => {
  assert.deepEqual(parse38Ipos('<table><tr><td>뉴스</td></tr></table>'), []);
  assert.deepEqual(parse38Ipos(sample.replace("2026.10.12~10.13", "2026.10.52~10.53")), []);
});
