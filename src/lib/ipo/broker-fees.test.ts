import assert from "node:assert/strict";
import test from "node:test";
import { publishedIpoFee } from "./broker-fees.ts";

test("all twelve source-backed general online fee schedules", () => {
  const fees = new Map([
    ["KB증권", 1500],
    ["삼성증권", 2000],
    ["미래에셋증권", 2000],
    ["신한투자증권", 2000],
    ["키움증권", 2000],
    ["한국투자증권", 2000],
    ["대신증권", 2000],
    ["유진투자증권", 2000],
    ["IBK투자증권", 1500],
    ["한화투자증권", 2000],
    ["iM증권", 2000],
    ["우리투자증권", 2000],
  ]);
  for (const [broker, price] of fees) {
    const result = publishedIpoFee(broker);
    assert.equal(result.onlineFee, price, broker);
    assert.match(result.feeSourceUrl, /^https:\/\//);
    assert.match(result.onlineFeeNote, /일반|패밀리/);
  }
});
test("unverified broker fee is unknown, never a guessed industry norm", () => {
  for (const broker of ["NH투자증권", "하나증권", "미확인증권"]) {
    const result = publishedIpoFee(broker);
    assert.equal(result.onlineFee, null);
    assert.equal(result.feeSourceUrl, "");
  }
});
test("broker aliases normalize without affecting others", () => {
  assert.equal(publishedIpoFee("케이비증권").onlineFee, 1500);
});
