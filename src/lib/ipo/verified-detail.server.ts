import { fetchText, stripTags, visibleMarkup } from "../events/html.ts";

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
const sourceName = "장전 공모주 상세(보조 자료)";

/**
 * KB Securities' published general online IPO fee is 1,500 KRW for
 * the ordinary (Family) tier. Qualifying grades, seniors, and some
 * zero-allocation online applications can be fee-free. It is not a
 * universal per-application debit.
 * Other brokers remain UNKNOWN until their exact official schedules
 * are verified: do not guess 2,000KRW or assume all brokers are alike.
 */
export function verifiedOnlineFee(broker: string): {
  onlineFee: number | null;
  onlineFeeNote: string;
  feeSourceUrl: string;
} {
  if (broker === "KB증권" || broker === "케이비증권") return {
    onlineFee: 1500,
    onlineFeeNote: "KB증권 일반 등급 온라인 청약 기준. 우대·65세 이상·온라인 미배정 시 면제 가능",
    feeSourceUrl: KB_OFFICIAL_IPO_FEES,
  };
  return {
    onlineFee: null,
    onlineFeeNote: "증권사별 온라인 청약 수수료 미확인",
    feeSourceUrl: "",
  };
}

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
      ![requested + "확정", requested + "변경가능", requested + "예정"].includes(linkName)) continue;
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
  if (!m) return "";
  const month = Number(m[1]), day = Number(m[2]);
  const year = month === 1 && subscriptionYear % 100 === 12 ? subscriptionYear + 1 : subscriptionYear;
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

/**
 * Called only for expanded cards: homepage remains untouched; on first
 * selection, the public index provides an exact issuer URL.
 */
export async function fetchVerifiedIpoDetail(args: {
  name: string;
  subscriptionStart: string;
  offerPrice: number | null;
  brokers: string[];
}): Promise<VerifiedIpoDetail> {
  const empty: VerifiedIpoDetail = {
    refundDate: "", listingDate: "", sourceUrl: "", sourceLabel: sourceName,
    checkedAt: new Date().toISOString(),
    brokerTerms: args.brokers.slice(0, 8).map(broker => ({
      broker, minimumShares: null, depositPercent: null, minimumDeposit: null,
      termsVerified: false, ...verifiedOnlineFee(broker),
    })),
    note: "종목별 최소 청약주수·증거금률과 환불일은 아직 검증되지 않았습니다.",
  };
  if (!args.name || args.name.length > 80 ||
      !/^20\d{2}-\d{2}-\d{2}$/.test(args.subscriptionStart) ||
      args.brokers.length > 8 || !args.brokers.every(x => x.length > 0 && x.length < 45)) return empty;
  try {
    const home = await fetchText(JANGJEON_HOME, {}, 5000);
    const url = findIpoDetailUrl(home, args.name);
    if (!url) return empty;
    const html = await fetchText(url, {}, 6500);
    const parsed = parseVerifiedDetail(html, { ...args, sourceUrl: url });
    if (!parsed) return empty;
    return parsed;
  } catch {
    return empty;
  }
}
