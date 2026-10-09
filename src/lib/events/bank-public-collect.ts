import { fetchText, mapPool, splitRules, stripTags, visibleMarkup } from "./html.ts";
import { stableLinkId } from "./discover.ts";
import { issuerMeta, type EntryEvent } from "./types.ts";
import type { CollectHit } from "./http-collect.ts";

type Bank = "kakaobank" | "kbank";
type OfficialEventPage = {
  url: string;
  title: string;
  benefit: string;
  mustContain: RegExp;
};

/**
 * Verified, public promotional pages on each bank's own web properties.
 * These are limited source-specific fallbacks, NOT full bank event feeds.
 * If the pages expire or change structure, the collector fails closed.
 */
const OFFICIAL_PAGES: Record<Bank, OfficialEventPage[]> = {
  kakaobank: [
    {
      url: "https://event.kakaobank.com/p/m1saving?i=ssfshop",
      title: "카카오뱅크 한달적금 with SSF SHOP 쿠폰·경품 이벤트",
      benefit: "SSF SHOP 퍼플코인·할인쿠폰·경품 응모권",
      mustContain: /SSF\s*SHOP/i,
    },
    {
      url: "https://www.kakaobank.com/products/chakboot",
      title: "카카오뱅크 착붙 신한카드 제휴 캐시백 이벤트",
      benefit: "착붙 신한카드 이용 캐시백 혜택",
      mustContain: /착붙.{0,30}신한카드/,
    },
  ],
  kbank: [
    {
      url: "https://www.kbanknow.com/web/product/invest/korea",
      title: "케이뱅크 한국투자증권 계좌 개설 제휴 혜택",
      benefit: "주식 2주·투자지원금·네이버페이 포인트",
      mustContain: /한국투자증권/,
    },
    {
      url: "https://www.kbanknow.com/web/service/benefit-detail/2340",
      title: "케이뱅크 KB국민카드 제휴 응모 이벤트",
      benefit: "KB국민카드 이용 캐시백 혜택",
      mustContain: /KB국민카드/,
    },
    {
      url: "https://www.kbanknow.com/web/service/benefit-detail/2341",
      title: "케이뱅크 NH농협카드 제휴 응모 이벤트",
      benefit: "NH농협카드 이용 캐시백 혜택",
      mustContain: /NH농협카드/,
    },
  ],
};

const PERIOD =
  /((?:20)?\d{2})\s*[./년-]\s*(\d{1,2})\s*[./월-]\s*(\d{1,2})\s*(?:일)?\s*(?:~|–|—|-)\s*(?:(\d{2,4})\s*[./년-]\s*)?(\d{1,2})\s*[./월-]\s*(\d{1,2})/;

function date(yearRaw: string, monthRaw: string, dayRaw: string): string | null {
  const year = Number(yearRaw.length === 2 ? "20" + yearRaw : yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  const d = new Date(Date.UTC(year, month - 1, day));
  if (d.getUTCFullYear() !== year || d.getUTCMonth() !== month - 1 ||
      d.getUTCDate() !== day) return null;
  return [year, String(month).padStart(2, "0"), String(day).padStart(2, "0")].join("-");
}

/** Parse explicit full-year or short-year ranges; do not infer a campaign year. */
export function officialBankPeriod(text: string): { start: string; end: string } | null {
  // Do not allow unrelated HTML segments to be mashed together across a long span.
  const normalized = text.replace(/\s+/g, " ");
  const match = normalized.match(PERIOD);
  if (!match) return null;
  const start = date(match[1], match[2], match[3]);
  const end = date(match[4] || match[1], match[5], match[6]);
  return start && end && start <= end ? { start, end } : null;
}

export function officialBankEvent(
  bank: Bank, page: OfficialEventPage, html: string, today: string,
): EntryEvent | null {
  const text = stripTags(visibleMarkup(html));
  if (!page.mustContain.test(text)) return null;
  const dates = officialBankPeriod(text);
  if (!dates || dates.start > today || dates.end < today) return null;
  const rules = splitRules(text);
  return {
    id: bank + ":" + stableLinkId(page.url),
    issuer: bank,
    title: page.title,
    summary: page.benefit,
    benefit: page.benefit,
    conditions: rules.conditions,
    exclusions: rules.exclusions,
    startDate: dates.start,
    endDate: dates.end,
    applyUrl: page.url,
    listUrl: issuerMeta(bank).listUrl,
    entry: /응모하기|응모\s*필수|경품\s*응모|이벤트\s*신청/i.test(text),
  };
}

export async function collectPublicBank(bank: Bank, today: string): Promise<CollectHit> {
  const pages = OFFICIAL_PAGES[bank];
  const results = await mapPool(pages, 3, async (page) => {
    try {
      const html = await fetchText(page.url, {}, 7000);
      return { event: officialBankEvent(bank, page, html, today), reached: true };
    } catch {
      return { event: null, reached: false };
    }
  });
  const events = results.flatMap(({ event }) => event ? [event] : []);
  const reached = results.filter((r) => r.reached).length;
  return {
    issuer: bank,
    ok: events.length > 0,
    message: events.length
      ? "공식 공개 상세 페이지 " + pages.length + "곳을 점검해 날짜 검증된 " +
        events.length + "건을 확보했습니다. (접속 " + reached + "/" + pages.length +
        ", 공개 행사 전체 목록을 보장하지 않음)"
      : "확인된 공식 공개 상세 페이지 " + pages.length +
        "곳에서 유효한 진행 이벤트를 검증하지 못했습니다. 이전 자료를 유지합니다.",
    events,
  };
}
