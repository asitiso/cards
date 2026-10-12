import { fetchIpoDetailsBatch } from "../src/lib/ipo/verified-detail.server.ts";

const targets = [
  { id: "엠에스바이오|2026-10-12", name: "엠에스바이오",
    subscriptionStart: "2026-10-12", offerPrice: 7800, brokers: ["KB증권"] },
  { id: "디티에스|2026-10-13", name: "디티에스",
    subscriptionStart: "2026-10-13", offerPrice: null,
    brokers: ["대신증권", "유진투자증권"] },
  { id: "티앤이코리아|2026-10-20", name: "티앤이코리아",
    subscriptionStart: "2026-10-20", offerPrice: null, brokers: ["신한투자증권"] },
];
const start = Date.now();
const rows = await fetchIpoDetailsBatch(targets);
console.log("IPO_BATCH_LIVE", JSON.stringify({
  durationMs: Date.now() - start,
  rows: rows.map(row => ({
    id: row.id, url: row.detail.sourceUrl,
    refund: row.detail.refundDate, listing: row.detail.listingDate,
    brokers: row.detail.brokerTerms.map(term => ({
      broker: term.broker, min: term.minimumDeposit,
      rate: term.depositPercent, fee: term.onlineFee,
      verified: term.termsVerified,
    })),
  })),
}, null, 2));
if (rows.length !== targets.length || rows.some((x,i) => x.id !== targets[i].id)) {
  throw new Error("Batch verification changed stock identity or order.");
}
const ms = rows[0].detail;
if (ms.brokerTerms[0].minimumDeposit !== 39000 ||
    ms.brokerTerms[0].onlineFee !== 1500 ||
    ms.refundDate !== "2026-10-15" ||
    ms.listingDate !== "2026-10-22") {
  throw new Error("Real issuer detail did not preserve verified deposit, fee and dates.");
}
const dts = rows[1].detail;
if (dts.brokerTerms.length !== 2 || dts.brokerTerms.some(term =>
  term.minimumDeposit !== null || term.termsVerified)) {
  throw new Error("Joint underwriters inherited unverified shared minimum.");
}
if (dts.brokerTerms[0].onlineFee !== 2000 ||
    dts.brokerTerms[1].onlineFee !== 2000 ||
    rows[2].detail.brokerTerms[0].onlineFee !== 2000) {
  throw new Error("Per-broker general fee references were lost.");
}
