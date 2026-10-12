import { findIpoDetailUrl, parseVerifiedDetail } from "../src/lib/ipo/verified-detail.server.ts";

const fetchHtml = async (url) => {
  const reply = await fetch(url, { signal: AbortSignal.timeout(9000),
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128 Safari/537.36",
      "Accept-Language": "ko-KR,ko;q=0.9" } });
  if (!reply.ok) throw new Error("HTTP " + reply.status + " " + url);
  return reply.text();
};
const home = await fetchHtml("https://jangjeon.kr/");
const url = findIpoDetailUrl(home, "엠에스바이오");
console.log("IPO_DETAIL_HOME", JSON.stringify({
  bytes: home.length, matchedUrl: url,
  sampleLinks: [...home.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .filter(m => m[0].includes("엠에스바이오"))
    .slice(0, 3).map(m => m[0].slice(0, 380)),
}));
if (!url) throw new Error("Exact IPO detail link not discovered.");
const html = await fetchHtml(url);
const parsed = parseVerifiedDetail(html, {
  name: "엠에스바이오", subscriptionStart: "2026-10-12",
  offerPrice: 7800, brokers: ["KB증권"], sourceUrl: url,
});
console.log("IPO_DETAIL_LIVE", JSON.stringify({
  url, bytes:html.length, parsed,
  heading: [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(x => x[1].slice(0,140)),
  namedParagraphs: [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .filter(x => /최소 청약|환불|상장/.test(x[0])).slice(0,3).map(x=>x[0].slice(0,460)),
},null,2));
if (parsed?.brokerTerms?.[0]?.minimumDeposit !== 39000 ||
    parsed?.brokerTerms?.[0]?.onlineFee !== 1500 ||
    parsed?.refundDate !== "2026-10-15" ||
    parsed?.listingDate !== "2026-10-22") {
  throw new Error("IPO live enrichment did not verify all requested fields.");
}
