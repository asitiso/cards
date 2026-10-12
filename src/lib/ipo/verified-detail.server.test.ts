import assert from "node:assert/strict";
import test from "node:test";
import {
  findIpoDetailUrl, parseVerifiedDetail, verifiedOnlineFee,
} from "./verified-detail.server.ts";

const home = [
  '<a href="/ipo/records/">과거 IPO 기록</a>',
  '<a href="/ipo/msbio/">엠에스바이오 <span>확정</span></a>',
  '<a href="/ipo/dts/">디티에스 변경 가능</a>',
  '<a href="https://evil.example/ipo/msbio/">엠에스바이오</a>',
].join("");
const detail = [
  '<html><h1>엠에스바이오</h1>',
  '<div>청약일 2026.10.12 ~ 10.13</div>',
  '<div>환불 10.15</div><div>상장 10.22</div>',
  '<p>청약은 2026.10.12부터 10.13까지 2일간 진행됩니다.',
  ' 배정받지 못한 물량의 증거금은 2026.10.15에 환불됩니다.',
  ' 상장 예정일은 2026.10.22입니다.</p>',
  '<p>최소 청약 10주 기준 증거금은 약 39,000원',
  ' (확정 공모가 7,800원 × 10주 × 증거금률 50%)입니다.</p>',
  '</html>',
].join("");

test("finds exact same-host stock detail, not adversarial URL", () => {
  assert.equal(findIpoDetailUrl(home, "엠에스바이오"), "https://jangjeon.kr/ipo/msbio/");
  assert.equal(findIpoDetailUrl(home, "디티에스"), "https://jangjeon.kr/ipo/dts/");
  assert.equal(findIpoDetailUrl(home, "바이오"), "");
});

test("extracts all 7 requested fields and validates math", () => {
  const detailResult = parseVerifiedDetail(detail, {
    name: "엠에스바이오", subscriptionStart: "2026-10-12",
    offerPrice: 7800, brokers: ["KB증권"],
    sourceUrl: "https://jangjeon.kr/ipo/msbio/",
  });
  assert.ok(detailResult);
  assert.equal(detailResult.refundDate, "2026-10-15");
  assert.equal(detailResult.listingDate, "2026-10-22");
  assert.deepEqual(detailResult.brokerTerms[0], {
    broker: "KB증권",
    minimumShares: 10, depositPercent: 50, minimumDeposit: 39000,
    termsVerified: true, onlineFee: 1500,
    onlineFeeNote: "패밀리(일반) 온라인 기준 · 우대등급·65세 이상·미배정 시 면제 가능 · 공식 안내표의 기본요금이며 종목·계좌마다 달라질 수 있음",
    feeSourceUrl: "https://www.kbsec.com/go.able?linkcd=m02070012",
  });
});

test("does not propagate guessed terms across joint bookrunners", () => {
  const shared = parseVerifiedDetail(detail, {
    name: "엠에스바이오", subscriptionStart: "2026-10-12",
    offerPrice: 7800, brokers: ["KB증권", "삼성증권"],
    sourceUrl: "https://jangjeon.kr/ipo/msbio/",
  });
  assert.equal(shared?.brokerTerms[0].minimumDeposit, null);
  assert.equal(shared?.brokerTerms[1].minimumDeposit, null);
  assert.equal(shared?.brokerTerms[1].onlineFee, 2000);
});

test("rejects mismatched name/period, and bad arithmetic", () => {
  const args = { name:"엠에스바이오", subscriptionStart:"2026-10-12",
    offerPrice:7800, brokers:["KB증권"], sourceUrl:"https://jangjeon.kr/ipo/msbio/" };
  assert.equal(parseVerifiedDetail(detail, { ...args, name:"기타회사" }), null);
  assert.equal(parseVerifiedDetail(detail, { ...args, subscriptionStart:"2026-10-14" }), null);
  const wrong = parseVerifiedDetail(detail, { ...args, offerPrice:7900 });
  assert.equal(wrong?.brokerTerms[0].minimumShares, null);
  assert.equal(wrong?.brokerTerms[0].minimumDeposit, null);
});

test("only source-backed broker fee is shown", () => {
  assert.equal(verifiedOnlineFee("KB증권").onlineFee, 1500);
  assert.equal(verifiedOnlineFee("대신증권").onlineFee, 2000);
  assert.equal(verifiedOnlineFee("NH투자증권").onlineFee, null);
});
