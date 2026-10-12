import { fetchText, stripTags, visibleMarkup } from "../events/html.ts";
import { publishedIpoFee } from "./broker-fees.ts";

export type BrokerTerms = {
  broker: string;
  minimumShares: number | null;
  depositPercent: number | null;
  minimumDeposit: number | null;
  onlineFee: number | null;
  onlineFeeNote: string;
  feeSourceUrl: string;
  termsVerified: boolean;
};

export type VerifiedIpoDetail = {
  refundDate: string;
  listingDate: string;
  sourceUrl: string;
  sourceLabel: string;
  checkedAt: string;
  brokerTerms: BrokerTerms[];
  note: string;
};

export const KB_OFFICIAL_IPO_FEES =
  "https://www.kbsec.com/go.able?linkcd=m02070012";
const JANGJEON_HOME = "https://jangjeon.kr/";
const JANGJEON_IPO_INDEX = "https://jangjeon.kr/ipo/";
const JANGJEON_RECORDS = "https://jangjeon.kr/ipo/records/";
const sourceName = "장전 공모주 상세(보조 자료)";

export const verifiedOnlineFee = publishedIpoFee;

function isoDate(year: number, month: number, day: number): string {
  if (year < 2020 || year > 2040 || month < 1 || month > 12) return "";
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.getUTCFullYear() === year && d.getUTCMonth() + 1 === month &&
    d.getUTCDate() === day
    ? year + "-" + String(month).padStart(2, "0") + "-" + String(day).padStart(2, "0")
    : "";
}

const normalized = (name: string) => name.replace(/[\s·()（）㈜-]+/g, "").toLowerCase();

/** Resolves a verified company link on a known page. No arbitrary URL input. */
export function findIpoDetailUrl(homeHtml: string, name: string): string {
  const requested = normalized(name);
  if (!requested || requested.length < 2) return "";
  const safe = visibleMarkup(homeHtml);
  for (const link of safe.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const linkName = normalized(stripTags(link[2]));
    // Label can include a separate "확정" badge. Never substring-match a
    // different share class or an unrelated stock name.
    if (linkName !== requested &&
      ![requested + "확정", requested + "변경가능", requested + "예정",
        requested + "청약시작", requested + "청약마감", requested + "환불일",
        requested + "상장일"].includes(linkName)) continue;
    try {
      const u = new URL(link[1].replace(/&amp;/g, "&"), JANGJEON_HOME);
      if (u.protocol === "https:" && u.hostname === "jangjeon.kr" &&
          /^\/ipo\/[a-z0-9-]+\/$/.test(u.pathname)) return u.origin + u.pathname;
    } catch {
      continue;
    }
  }
  return "";
}

function findDate(text: string, label: "환불" | "상장", subscriptionYear: number): string {
  // Explicit full date in the body has priority over shorthand headlines.
  const long = new RegExp(label + "(?:일| 예정일|·납입일)?\\s*[:：]?\\s*(20\\d{2})\\s*[.\\/-]\\s*(\\d{1,2})\\s*[.\\/-]\\s*(\\d{1,2})");
  const matched = text.match(long);
  if (matched) return isoDate(Number(matched[1]), Number(matched[2]), Number(matched[3]));
  const korean = new RegExp(label + "(?:일| 예정일|·납입일)?\\s*[:：]?\\s*(\\d{1,2})\\s*월\\s*(\\d{1,2})\\s*일");
  const m = text.match(korean);
  if (!m) {
    // Live filings also say "증거금은 YYYY.MM.DD에 환불됩니다" or
    // "상장 예정일은 YYYY.MM.DD입니다".
    const narrative = label === "환불"
      ? /(?:증거금|잔여금)(?:은|이)?\s*(20\d{2})\s*[.\/-]\s*(\d{1,2})\s*[.\/-]\s*(\d{1,2})에\s*환불/
      : /상장\s*(?:예정)?일(?:은|이)?\s*(20\d{2})\s*[.\/-]\s*(\d{1,2})\s*[.\/-]\s*(\d{1,2})/;
    const found = text.match(narrative);
    return found ? isoDate(Number(found[1]), Number(found[2]), Number(found[3])) : "";
  }
  const month = Number(m[1]), day = Number(m[2]);
  const year = subscriptionYear;
  return isoDate(year, month, day);
}

export function parseVerifiedDetail(html: string, args: {
  name: string;
  subscriptionStart: string;
  offerPrice: number | null;
  brokers: string[];
  sourceUrl: string;
}): VerifiedIpoDetail | null {
  const clean = stripTags(visibleMarkup(html)).replace(/\s+/g, " ");
  if (!args.name || args.name.length > 90 || !args.subscriptionStart.match(/^20\d{2}-\d{2}-\d{2}$/)) return null;
  const h1 = /<h1\b[^>]*>([\s\S]*?)<\/h1>/i.exec(html);
  if (!h1 || normalized(stripTags(h1[1])) !== normalized(args.name)) return null;
  const date = args.subscriptionStart.replace(/-/g, "[.\\/-]");
  if (!new RegExp(date).test(clean)) return null;

  const y = Number(args.subscriptionStart.slice(0, 4));
  const refundDate = findDate(clean, "환불", y);
  const listingDate = findDate(clean, "상장", y);
  // Only use the explicitly printed "minimum shares / min. deposit / rate"
  // condition for a concrete issuer, and cross-check the exact calculation.
  const match = clean.match(/최소\s*청약\s*(\d{1,5})\s*주\s*기준\s*증거금은\s*약\s*([\d,]+)\s*원\s*\(([^)]*증거금률\s*(\d{1,3})\s*%[^)]*)\)/);
  const rawShares = match ? Number(match[1]) : null;
  const rawMargin = match ? Number(match[2].replace(/,/g, "")) : null;
  const rawRate = match ? Number(match[4]) : null;
  const depositValid = rawShares !== null && rawShares > 0 && rawShares < 100000 &&
    rawRate !== null && rawRate > 0 && rawRate <= 100 &&
    rawMargin !== null && Number.isSafeInteger(rawMargin) &&
    args.offerPrice !== null &&
    Math.ceil(args.offerPrice * rawShares * rawRate / 100) === rawMargin;

  // A generic issuer-wide description is never broker-specific for a joint
  // offering; suppress its "minimum" for all brokers in that case.
  const singleBroker = args.brokers.length === 1;
  const brokerTerms = args.brokers.map(broker => ({
    broker,
    minimumShares: depositValid && singleBroker ? rawShares : null,
    depositPercent: depositValid && singleBroker ? rawRate : null,
    minimumDeposit: depositValid && singleBroker ? rawMargin : null,
    termsVerified: Boolean(depositValid && singleBroker),
    ...verifiedOnlineFee(broker),
  }));
  return {
    refundDate, listingDate, sourceUrl: args.sourceUrl, sourceLabel: sourceName,
    checkedAt: new Date().toISOString(), brokerTerms,
    note: singleBroker ? "" : "복수 주관사는 증권사별 최소 청약수량이 다를 수 있어 개별 확정 공고 확인 필요",
  };
}

export type IpoDetailRequest = {
  name: string;
  subscriptionStart: string;
  offerPrice: number | null;
  brokers: string[];
};

// Soft cache only: speeds up repeated tab visits within the same worker,
// but does not claim durability across Vercel function restarts.
const INDEX_TTL = 6 * 60_000;
const ITEM_TTL = 3 * 60_000;
let cachedIndex: { html: string; expires: number } | null = null;
let indexInflight: Promise<string> | null = null;
const itemCache = new Map<string, { detail: VerifiedIpoDetail; expires: number }>();
const itemInflight = new Map<string, Promise<VerifiedIpoDetail>>();

function safeRequest(args: IpoDetailRequest): boolean {
  return Boolean(args.name && args.name.length <= 80 &&
    /^20\d{2}-\d{2}-\d{2}$/.test(args.subscriptionStart) &&
    args.brokers.length > 0 && args.brokers.length <= 8 &&
    args.brokers.every(x => x.length > 0 && x.length < 45) &&
    (args.offerPrice === null || (Number.isSafeInteger(args.offerPrice) &&
      args.offerPrice >= 100 && args.offerPrice < 10000000)));
}

function blankDetail(args: IpoDetailRequest): VerifiedIpoDetail {
  return {
    refundDate: "", listingDate: "", sourceUrl: "", sourceLabel: sourceName,
    checkedAt: new Date().toISOString(),
    brokerTerms: args.brokers.slice(0, 8).map(broker => ({
      broker, minimumShares: null, depositPercent: null, minimumDeposit: null,
      termsVerified: false, ...verifiedOnlineFee(broker),
    })),
    note: "공개 종목별 청약수량·증거금률을 확인하지 못했습니다. 주관사별 공고를 확인하세요.",
  };
}

async function getIpoIndex(): Promise<string> {
  if (cachedIndex && cachedIndex.expires > Date.now()) return cachedIndex.html;
  if (indexInflight) return indexInflight;
  indexInflight = (async () => {
    const results = await Promise.allSettled(
      [JANGJEON_IPO_INDEX, JANGJEON_HOME, JANGJEON_RECORDS]
        .map(url => fetchText(url, {}, 4500)),
    );
    const pages = results.flatMap(result => result.status === "fulfilled"
      ? [result.value] : []);
    if (!pages.length) throw Error("All IPO index sources unavailable");
    const html = pages.join("\n");
    cachedIndex = { html, expires: Date.now() + INDEX_TTL };
    return html;
  })();
  try { return await indexInflight; }
  finally { indexInflight = null; }
}

async function readItem(args: IpoDetailRequest, indexHtml: string): Promise<VerifiedIpoDetail> {
  const empty = blankDetail(args);
  const url = findIpoDetailUrl(indexHtml, args.name);
  if (!url) return empty;
  try {
    const html = await fetchText(url, {}, 4800);
    return parseVerifiedDetail(html, { ...args, sourceUrl: url }) ?? empty;
  } catch {
    return empty;
  }
}

function itemKey(args: IpoDetailRequest): string {
  return [normalized(args.name), args.subscriptionStart, args.offerPrice ?? "?",
    args.brokers.slice().sort().join(",")].join("|");
}

async function memoItem(args: IpoDetailRequest, indexHtml: string): Promise<VerifiedIpoDetail> {
  const key = itemKey(args);
  const old = itemCache.get(key);
  if (old && old.expires > Date.now()) return old.detail;
  const inflight = itemInflight.get(key);
  if (inflight) return inflight;
  const work = readItem(args, indexHtml).then(detail => {
    itemCache.set(key, {
      detail, expires: Date.now() + (detail.sourceUrl ? ITEM_TTL : 75_000),
    });
    if (itemCache.size > 200) {
      for (const [id, entry] of itemCache) {
        if (entry.expires <= Date.now()) itemCache.delete(id);
      }
      if (itemCache.size > 200) itemCache.delete(itemCache.keys().next().value!);
    }
    return detail;
  });
  itemInflight.set(key, work);
  try { return await work; }
  finally { itemInflight.delete(key); }
}

/** Single-item lookup remains available for a card expanded before bulk fetch. */
export async function fetchVerifiedIpoDetail(args: IpoDetailRequest): Promise<VerifiedIpoDetail> {
  if (!safeRequest(args)) return blankDetail(args);
  try { return await memoItem(args, await getIpoIndex()); }
  catch { return blankDetail(args); }
}

/**
 * Perform one shared index download followed by a bounded parallel scan of
 * ALL displayed offerings. Preserves original order, has no effect on the
 * finance homepage, and returns unavailable fields as null rather than fake
 * "confirmed" values. Entries are scoped to the currently requested list.
 */
export async function fetchIpoDetailsBatch(
  items: Array<{ id: string } & IpoDetailRequest>,
): Promise<Array<{ id: string; detail: VerifiedIpoDetail }>> {
  const workItems = items.slice(0, 35);
  let index = "";
  try { index = await getIpoIndex(); } catch { /* fees can still be shown */ }
  const output: Array<{ id: string; detail: VerifiedIpoDetail }> = new Array(workItems.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(6, workItems.length) }, async () => {
    while (cursor < workItems.length) {
      const i = cursor++;
      const item = workItems[i];
      output[i] = {
        id: item.id,
        detail: index && safeRequest(item)
          ? await memoItem(item, index) : blankDetail(item),
      };
    }
  }));
  return output;
}
