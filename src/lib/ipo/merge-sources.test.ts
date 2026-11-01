import assert from "node:assert/strict";
import test from "node:test";
import { mergeIpoSources } from "./merge-sources.ts";
import type { IpoItem } from "./types.ts";

function row(name: string, overrides: Partial<IpoItem> = {}): IpoItem {
  return {
    id: name + "|2026-11-09", name, market: "코스닥",
    subscriptionStart: "2026-11-09", subscriptionEnd: "2026-11-10",
    offerPrice: 12000, refundDate: "2026-11-12", listingDate: "",
    brokers: ["KB증권"], minimumShares: null, depositPercent: null,
    sourceUrl: "https://kind.krx.co.kr/", sourceLabel: "KRX KIND", ...overrides,
  };
}

test("official fields win when secondary values conflict", () => {
  const kind = row("가나다", { offerPrice: 12000 });
  const blog = row("가나다", { offerPrice: 13000, subscriptionEnd: "2026-11-11" });
  const [result] = mergeIpoSources([kind], [blog], []);
  assert.equal(result.offerPrice, 12000);
  assert.equal(result.subscriptionEnd, "2026-11-10");
  assert.equal(result.sourceStatus, "conflict");
  assert.match(result.verificationNote ?? "", /공모가 출처 불일치/);
});

test("a changed official subscription date does not duplicate the company", () => {
  const rows = mergeIpoSources([row("가나다", { subscriptionStart: "2026-11-11" })],
    [row("가 나 다", { subscriptionStart: "2026-11-09" })], []);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].subscriptionStart, "2026-11-11");
});

test("secondary listings stay reference only, not official", () => {
  const [result] = mergeIpoSources([], [row("참고종목")], []);
  assert.equal(result.sourceStatus, "reference");
});

test("supplemental missing price is explicitly unverified", () => {
  const [result] = mergeIpoSources([row("가나다", { offerPrice: null })],
    [row("가나다", { offerPrice: 13000 })], []);
  assert.equal(result.offerPrice, 13000);
  assert.match(result.verificationNote ?? "", /보조 자료/);
});

test("matched official and reference dates do not make a false conflict", () => {
  const [result] = mergeIpoSources([row("가나다")], [row("가나다")], []);
  assert.equal(result.sourceStatus, "corroborated");
  assert.equal(result.verificationNote, "");
});

test("unknown dates and prices are never manufactured", () => {
  const [result] = mergeIpoSources([], [row("미정", {
    offerPrice: null, refundDate: "", listingDate: "",
  })], []);
  assert.equal(result.offerPrice, null);
  assert.equal(result.refundDate, "");
  assert.equal(result.listingDate, "");
});
