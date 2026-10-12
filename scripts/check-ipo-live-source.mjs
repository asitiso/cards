import { parseSonnimIpos, SONNIM_SCHEDULE_URL } from "../src/lib/ipo/sonnim-source.ts";
import { seoulToday } from "../src/lib/events/html.ts";

// Live source smoke check: successful HTTP without extractable records is failure.
const today = seoulToday();
const controller = AbortSignal.timeout(12000);
const response = await fetch(SONNIM_SCHEDULE_URL, {
  signal: controller,
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128 Safari/537.36",
    "Accept-Language": "ko-KR,ko;q=0.9",
    Accept: "text/html,application/xhtml+xml",
  },
});
const html = await response.text();
const parsed = parseSonnimIpos(html, today);
const lastMonth = new Date(Date.parse(today + "T00:00:00+09:00") - 21 * 86400000)
  .toISOString().slice(0, 10);
const current = parsed.filter(item => item.subscriptionEnd >= lastMonth);

if (!parsed.length) {
  const rows = [...html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)];
  console.log("DEBUG current HTML structure", JSON.stringify({
    namePresent: html.includes("엠에스바이오"),
    firstTableRows: rows.slice(0, 8).map(r => ({
      cells: [...r[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(m =>
        m[1].replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim().slice(0, 90)),
      rowSnippet: r[1].replace(/\s+/g, " ").slice(0, 270),
    })),
    aroundName: (() => {
      const offset = html.indexOf("엠에스바이오");
      return offset < 0 ? "" : html.slice(offset - 550, offset + 850);
    })(),
    firstHeading: [...html.matchAll(/<h[23]\b[^>]*>([\s\S]*?)<\/h[23]>/gi)]
      .slice(0, 7).map(m => m[1].replace(/<[^>]+>/g," ").trim()),
  }, null, 2));
}
console.log(JSON.stringify({
  today, http: response.status, bytes: html.length,
  tableCount: (html.match(/<table\b/gi) || []).length,
  trCount: (html.match(/<tr\b/gi) || []).length,
  total: parsed.length,
  current: current.length,
  sample: current.slice(0, 5).map(item => ({
    name: item.name, period: item.subscriptionStart + "~" + item.subscriptionEnd,
    offerPrice: item.offerPrice, brokers: item.brokers,
  })),
}, null, 2));
if (!response.ok || current.length === 0) {
  throw new Error("IPO live source was inaccessible or the parser produced no current records.");
}
