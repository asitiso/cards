import { stripTags, visibleMarkup } from "../events/html.ts";
import type { IpoItem } from "./types.ts";

/**
 * Supplementary public, server-rendered IPO schedule:
 * https://www.sonnimlab.com/schedule/
 *
 * Two table layouts are published: upcoming subscriptions (8 columns),
 * and completed/current month subscriptions (7 columns). The former has
 * indicative price before the not-yet-finalized offer-price column.
 */
export const SONNIM_SCHEDULE_URL = "https://www.sonnimlab.com/schedule/";

function checkDay(year: number, month: number, day: number): string | null {
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month ||
      date.getUTCDate() !== day) return null;
  return year + "-" + String(month).padStart(2, "0") + "-" + String(day).padStart(2, "0");
}

/** Accept compact periods e.g. 10.12~13, 11.2~3, 12.30~1.2. */
function parsePeriod(raw: string, preferredYear: number): [string, string] | null {
  const match = raw.match(/(?:(20\d{2})\s*[.\/-]\s*)?(\d{1,2})\s*[.\/-]\s*(\d{1,2})\s*[~～–-]\s*(?:(20\d{2})\s*[.\/-]\s*)?(?:(\d{1,2})\s*[.\/-]\s*)?(\d{1,2})/);
  if (!match) return null;
  const firstYear = Number(match[1] ?? preferredYear);
  const firstMonth = Number(match[2]);
  const secondMonth = Number(match[5] ?? firstMonth);
  let secondYear = Number(match[4] ?? firstYear);
  if (!match[4] && secondMonth < firstMonth) secondYear += 1;
  const start = checkDay(firstYear, firstMonth, Number(match[3]));
  const end = checkDay(secondYear, secondMonth, Number(match[6]));
  return start && end && start <= end ? [start, end] : null;
}

function moneyOnly(value: string): number | null {
  // "확정 전" and indicative ranges are never a finalized IPO price.
  if (!/^\s*[\d,]+\s*(?:원)?\s*$/.test(value)) return null;
  const number = Number(value.replace(/[^\d]/g, ""));
  return Number.isSafeInteger(number) && number >= 100 ? number : null;
}

function listingDate(value: string, defaultYear: number): string {
  const full = value.match(/(20\d{2})\s*년\s*(\d{1,2})\s*월\s*(\d{1,2})\s*일/);
  if (full) return checkDay(Number(full[1]), Number(full[2]), Number(full[3])) ?? "";
  const compact = value.match(/(20\d{2})[.\/-](\d{1,2})[.\/-](\d{1,2})/);
  if (compact) return checkDay(Number(compact[1]), Number(compact[2]), Number(compact[3])) ?? "";
  const short = value.match(/(\d{1,2})\s*월\s*(\d{1,2})\s*일/);
  return short ? (checkDay(defaultYear, Number(short[1]), Number(short[2])) ?? "") : "";
}

function sameSiteUrl(html: string): string {
  const href = /<a\b[^>]*\bhref\s*=\s*["']([^"']+)["']/i.exec(html)?.[1];
  if (!href) return SONNIM_SCHEDULE_URL;
  try {
    const u = new URL(href.replace(/&amp;/g, "&"), SONNIM_SCHEDULE_URL);
    return u.protocol === "https:" && u.hostname === "www.sonnimlab.com"
      ? u.href : SONNIM_SCHEDULE_URL;
  } catch {
    return SONNIM_SCHEDULE_URL;
  }
}

function brokerList(raw: string): string[] {
  return [...new Set(raw.split(/[,，、;·]/).map((text) => text.trim())
    .map((text) => text.replace(/주식회사|㈜|\(주\)/g, ""))
    .filter((text) => /증권|투자/.test(text) && text.length <= 35))];
}

function futureYear(month: number, today: string): number {
  const currentYear = Number(today.slice(0, 4));
  const currentMonth = Number(today.slice(5, 7));
  return month + 2 < currentMonth ? currentYear + 1 : currentYear;
}

/**
 * Parse 7- or 8-column schedule rows with an explicit period and broker.
 * No schedule metadata is invented; indicative ranges remain separate from
 * final offer prices.
 */
export function parseSonnimIpos(html: string, today: string): IpoItem[] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) return [];
  const safe = visibleMarkup(html);
  const results = new Map<string, IpoItem>();
  for (const table of safe.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/gi)) {
    const before = safe.slice(0, table.index ?? 0);
    const headings = [...before.matchAll(/<h[23]\b[^>]*>([\s\S]*?)<\/h[23]>/gi)];
    const section = stripTags(headings.at(-1)?.[1] ?? "");
    const monthly = section.match(/(20\d{2})\s*년\s*(\d{1,2})\s*월/);
    const isUpcoming = /청약\s*예정/.test(section);

    for (const row of table[1].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
      const rawCells = [...row[1].matchAll(/<(td|th)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map(m => m[2]);
      const cells = rawCells.map(x => stripTags(x).replace(/\s+/g, " ").trim());
      if (cells.length !== 7 && cells.length !== 8) continue;
      const approximate = cells[1].match(/(?:20\d{2}[.\/-])?(\d{1,2})[.\/-]\d{1,2}\s*[~～–-]/);
      if (!approximate) continue;
      const month = Number(approximate[1]);
      const year = monthly ? Number(monthly[1]) : futureYear(month, today);
      const period = parsePeriod(cells[1], year);
      if (!period) continue;
      const brokers = brokerList(cells.at(-1) ?? "");
      if (!brokers.length) continue;
      const name = cells[0].trim();
      if (name.length < 2 || name.length > 75 || !/[\p{L}]/u.test(name)) continue;

      const upcomingLayout = cells.length === 8 || isUpcoming;
      const priceIndex = upcomingLayout ? 3 : 2;
      const bandIndex = upcomingLayout ? 2 : 3;
      const offerPrice = moneyOnly(cells[priceIndex] ?? "");
      const tentativeBand = cells[bandIndex] ?? "";
      const range = /[\d,]+\s*[~～–-]\s*[\d,]+/.test(tentativeBand)
        ? tentativeBand.replace(/\s+/g, "") : "";
      const listed = listingDate(cells[upcomingLayout ? 6 : 5] ?? "", year);
      const id = name.replace(/\s+/g, "") + "|" + period[0];
      results.set(id, {
        id, name, market: "",
        subscriptionStart: period[0], subscriptionEnd: period[1],
        offerPrice, refundDate: "", listingDate: listed, brokers,
        minimumShares: null, depositPercent: null,
        indicativePriceRange: range,
        sourceUrl: sameSiteUrl(rawCells[0] ?? ""), sourceLabel: "공모주로그(참고)",
      });
    }
  }
  return [...results.values()];
}
