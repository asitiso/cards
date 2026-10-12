import { stripTags } from "../events/html.ts";
import type { IpoItem } from "./types.ts";

export const IPO38_URL = "https://www.38.co.kr/html/fund/index.htm?o=k";

/** 38 Communications is a supplementary public schedule, not an official filing. */
function priceOf(value: string): number | null {
  if (!/^\s*\d[\d,]*\s*$/.test(value)) return null;
  const amount = Number(value.replace(/[\s,]/g, ""));
  return amount >= 100 && Number.isSafeInteger(amount) ? amount : null;
}

function normalizeBrokerName(value: string): string {
  return value.replace(/주식회사|㈜|\(주\)/g, "").trim()
    .replace(/^케이비증권$/, "KB증권")
    .replace(/^엔에이치투자증권$/, "NH투자증권");
}

function datesOf(value: string): [string, string] | null {
  const match = value.match(/(20\d{2})\s*[.\/-]\s*(\d{1,2})\s*[.\/-]\s*(\d{1,2})\s*[~～\-–]\s*(?:(20\d{2})\s*[.\/-]\s*)?(\d{1,2})\s*[.\/-]\s*(\d{1,2})/);
  if (!match) return null;
  const first = match[1] + "-" + match[2].padStart(2, "0") + "-" + match[3].padStart(2, "0");
  const secondYear = match[4] || match[1];
  const second = secondYear + "-" + match[5].padStart(2, "0") + "-" + match[6].padStart(2, "0");
  const isDate = (date: string) => {
    const [year, month, day] = date.split("-").map(Number);
    const check = new Date(Date.UTC(year, month - 1, day));
    return check.getUTCFullYear() === year && check.getUTCMonth() === month - 1 &&
      check.getUTCDate() === day;
  };
  return isDate(first) && isDate(second) && first <= second ? [first, second] : null;
}

function detailUrl(raw: string): string {
  const link = /<a\b[^>]*href\s*=\s*["']([^"']+)["']/i.exec(raw)?.[1];
  if (!link) return IPO38_URL;
  try {
    const url = new URL(link.replace(/&amp;/g, "&"), IPO38_URL);
    if (url.protocol !== "https:" || url.hostname !== "www.38.co.kr") return IPO38_URL;
    return url.toString();
  } catch {
    return IPO38_URL;
  }
}

/** Only matches schedule rows with explicit year, date range and a valid broker. */
export function parse38Ipos(html: string): IpoItem[] {
  const rows = [...html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)];
  const results = new Map<string, IpoItem>();
  for (const match of rows) {
    const cells = [...match[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)]
      .map((cell) => stripTags(cell[1]).replace(/\s+/g, " ").trim());
    const dateIndex = cells.findIndex((cell) => datesOf(cell) !== null);
    if (dateIndex < 1 || dateIndex > 3 || cells.length < dateIndex + 5) continue;
    const range = datesOf(cells[dateIndex]);
    if (!range) continue;
    const name = cells[dateIndex - 1].replace(/^\(\s*유가\s*\)/, "").trim();
    if (name.length < 2 || name.length > 70 || !/[\p{L}]/u.test(name)) continue;

    // 38 lists: company | offering period | confirmed price | indicative price |
    // competition ratio | underwriting brokers | optional analysis link.
    const brokerCell = cells[dateIndex + 4] ?? "";
    const brokers = brokerCell.split(/[,，;、]/)
      .map(normalizeBrokerName)
      .filter((value) => /증권|투자/.test(value) && value.length <= 35);
    if (!brokers.length) continue;
    const offeringPrice = priceOf(cells[dateIndex + 1]);
    const id = name + "|" + range[0];
    const rawCompanyCell = [...match[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)][dateIndex - 1]?.[1] ?? "";
    results.set(id, {
      id, name, market: /유가/.test(cells[dateIndex - 1]) ? "유가증권" : "",
      subscriptionStart: range[0], subscriptionEnd: range[1],
      offerPrice: offeringPrice,
      refundDate: "", listingDate: "",
      brokers: [...new Set(brokers)],
      minimumShares: null, depositPercent: null,
      sourceUrl: detailUrl(rawCompanyCell),
      sourceLabel: "38커뮤니케이션(참고)",
    });
  }
  return [...results.values()];
}
