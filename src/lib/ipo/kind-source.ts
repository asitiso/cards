import { fetchText, seoulToday, stripTags } from "../events/html.ts";
import type { IpoBoard, IpoItem } from "./types.ts";
import { IPO38_URL, parse38Ipos } from "./comm38-source.ts";

/**
 * KRX KIND is provided by underwriting brokers. Its public list does not
 * publish broker-specific minimum lots, deposit rates, fees or account rules:
 * never infer those from the offer price alone.
 */
export const KIND_IPO_URL =
  "https://kind.krx.co.kr/listinvstg/pubofrprogcom.do?method=searchPubofrProgComMain";

function findDates(value: string): string[] {
  const matches = value.matchAll(/(20\d{2})[.\/-](\d{1,2})[.\/-](\d{1,2})/g);
  const dates: string[] = [];
  for (const match of matches) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month ||
        date.getUTCDate() !== day) continue;
    dates.push(match[1] + "-" + match[2].padStart(2, "0") + "-" + match[3].padStart(2, "0"));
  }
  return dates;
}

function parsePrice(value: string): number | null {
  const clean = value.trim();
  if (!/^\d[\d,\s]*$/.test(clean)) return null;
  const price = Number(clean.replace(/[\s,]/g, ""));
  return Number.isSafeInteger(price) && price > 0 ? price : null;
}

function parseBrokers(value: string): string[] {
  const brokers = value
    .replace(/주식회사|\(주\)|㈜/g, "")
    .split(/[,，、;]/)
    .map((part) => part.replace(/\s+/g, "").trim())
    .map((part) => part.replace(/^엔에이치투자증권$/, "NH투자증권"))
    .filter((part) => /증권|투자/.test(part) && part.length < 40);
  return [...new Set(brokers)];
}

/**
 * Parse only real 9-column KRX offering table rows. An unexpected page or a
 * captcha returns [] and must be reported as unverified, never "no IPOs".
 */
export function parseKindIpos(html: string): IpoItem[] {
  const rows = [...html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)];
  const result = new Map<string, IpoItem>();
  for (const row of rows) {
    const cells = [...row[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)]
      .map((match) => stripTags(match[1]).replace(/\s+/g, " ").trim());
    if (cells.length !== 9) continue;
    const period = findDates(cells[3]);
    if (period.length < 2) continue;
    const market = /코스닥|유가증권|코스피|코넥스/.exec(cells[0])?.[0] ?? "";
    const name = cells[0].replace(/^(코스닥|유가증권|코스피|코넥스)\s*/, "").trim();
    if (name.length < 2 || name.length > 80 || !/[\p{L}0-9]/u.test(name)) continue;
    const start = period[0];
    const end = period[period.length - 1];
    if (start > end) continue;
    const key = name + "|" + start;
    const brokers = parseBrokers(cells[8]);
    if (!brokers.length) continue;
    result.set(key, {
      id: key,
      name,
      market,
      subscriptionStart: start,
      subscriptionEnd: end,
      offerPrice: parsePrice(cells[5]),
      refundDate: findDates(cells[4])[0] ?? "",
      listingDate: findDates(cells[7])[0] ?? "",
      brokers,
      minimumShares: null,
      depositPercent: null,
      sourceUrl: KIND_IPO_URL,
      sourceLabel: "KRX KIND",
    });
  }
  return [...result.values()].sort((a, b) =>
    a.subscriptionStart.localeCompare(b.subscriptionStart) || a.name.localeCompare(b.name, "ko"),
  );
}

export async function loadIpoBoard(): Promise<IpoBoard> {
  const today = seoulToday();
  const collectedAt = new Date().toISOString();
  // Both public sources are optional and bounded. This network work happens
  // only when a user opens the IPO tab; it cannot delay the finance homepage.
  const results = await Promise.allSettled([
    fetchText(KIND_IPO_URL, {}, 8000),
    fetchText(IPO38_URL, {}, 8000),
  ]);
  const kind = results[0].status === "fulfilled" ? parseKindIpos(results[0].value) : [];
  const supplemental = results[1].status === "fulfilled" ? parse38Ipos(results[1].value) : [];
  const cutoff = new Date(Date.parse(today + "T00:00:00+09:00") - 21 * 86_400_000)
    .toISOString().slice(0, 10);
  // Prefer official KIND entries for matching stock + opening date.
  const merged = new Map<string, IpoItem>();
  for (const item of supplemental) {
    if (item.subscriptionEnd >= cutoff) merged.set(item.id, item);
  }
  for (const item of kind) {
    if (item.subscriptionEnd < cutoff) continue;
    const previous = merged.get(item.id);
    merged.set(item.id, previous ? {
      ...item,
      // A public table can leave one of these values blank, retain the
      // supplementary value but do not infer numbers or fill in unknown lots.
      offerPrice: item.offerPrice ?? previous.offerPrice,
      refundDate: item.refundDate || previous.refundDate,
      listingDate: item.listingDate || previous.listingDate,
      brokers: [...new Set([...item.brokers, ...previous.brokers])],
    } : item);
  }
  const items = [...merged.values()].sort((a, b) =>
    a.subscriptionStart.localeCompare(b.subscriptionStart) || a.name.localeCompare(b.name, "ko"),
  );
  const status: IpoBoard["status"] = items.length ? "ok"
    : results.every((result) => result.status === "rejected") ? "unavailable" : "empty";
  const message = items.length
    ? "공개 자료 조회 " + items.length + "건 (KRX KIND " + kind.length +
      "건, 38커뮤니케이션 " + supplemental.length +
      "건). 공식 원문을 우선하며 공개 자료 미수집·페이지별 누락 및 정정 가능성이 있습니다."
    : status === "unavailable"
      ? "공개 청약자료 서버에 연결할 수 없습니다. 공식 원문에서 직접 확인하세요."
      : "공개 일정표에서 청약 항목을 판독하지 못했습니다. 일정이 없다는 뜻은 아닙니다.";
  return { today, collectedAt, status, sourceUrl: KIND_IPO_URL, message, items };
}
