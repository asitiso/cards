import { fetchText, mapPool, parseRange, stripTags, visibleMarkup } from "./html.ts";
import { stableLinkId } from "./discover.ts";
import { issuerMeta, type EntryEvent } from "./types.ts";
import type { CollectHit } from "./http-collect.ts";

export const TOSS_SECURITIES_NEWSROOM = "https://corp.tossinvest.com/ko/news-room";

type PressLink = { url: string; title: string };

/**
 * Scan the official corporate newsroom instead of its stock-trading terminal.
 * Only explicit promotion announcements on the same corporate site qualify.
 * Four detail requests maximum, two concurrent, no account / app scraping.
 */
export function tossPressLinks(html: string): PressLink[] {
  const found = new Map<string, PressLink>();
  const anchors = html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi);
  for (const anchor of anchors) {
    const href = anchor[1].match(/\bhref\s*=\s*(["'])(.*?)\1/i)?.[2];
    if (!href) continue;
    let url: URL;
    try {
      url = new URL(href.replace(/&amp;/gi, "&"), TOSS_SECURITIES_NEWSROOM);
    } catch {
      continue;
    }
    if (url.protocol !== "https:" || url.hostname !== "corp.tossinvest.com" ||
        !/^\/ko\/news-room\/detail\/?$/.test(url.pathname) ||
        !/^\d+$/.test(url.searchParams.get("id") ?? "")) continue;
    const title = stripTags(anchor[2]).replace(/\s+/g, " ").trim();
    if (title.length < 10 || title.length > 180 ||
        !/(이벤트|프로모션|캐시백|경품|쿠폰|상품권|주식\s*\d+주\s*(?:증정|지급))/i.test(title)) continue;
    found.set(url.href, { url: url.href, title });
  }
  return [...found.values()].slice(0, 4);
}

/**
 * A news publication date, product rate/interest period, or compliance review
 * date must not be mistaken for a promotional period. Require an EXPLICIT
 * event/offer period with two full calendar dates on its official detail page.
 * If it is absent, this is unverified, never "no campaigns exist".
 */
export function verifiedTossPressEvent(
  link: PressLink, html: string, today: string,
): EntryEvent | null {
  const text = stripTags(visibleMarkup(html)).replace(/\s+/g, " ").trim();
  const keyTerms = link.title.replace(/토스증권|이벤트|프로모션|고객|진행|대상|제휴/g, " ")
    .split(/[\s·,]+/)
    .map((word) => word.replace(/(?:에서|으로|과|와|의|은|는|을|를|로)$/, ""))
    .filter((word) => word.length >= 3);
  if (!keyTerms.length || !keyTerms.some((word) => text.includes(word))) return null;
  const periodPart = text.match(/(?:이벤트|행사|프로모션)\s*기간\s*[:：]?\s*([^\n]{0,130})/i)?.[1];
  if (!periodPart) return null;
  const range = parseRange(periodPart);
  if (!range || range.start > today || range.end < today || range.start > range.end) return null;
  const reward = text.match(/.{0,25}(?:모바일\s*상품권|주식\s*\d+\s*주|캐시백|쿠폰|경품).{0,40}/i)?.[0]?.trim();
  if (!reward || !/(\d|원|상품권|경품)/.test(reward)) return null;
  const autoApplied = /별도\s*(?:응모|신청)\s*없이|자동\s*(?:적용|지급)/.test(text);
  return {
    id: "tosssec:" + stableLinkId(link.url),
    issuer: "tosssec",
    title: link.title,
    summary: reward.slice(0, 100),
    benefit: reward.slice(0, 100),
    conditions: [],
    exclusions: [],
    startDate: range.start,
    endDate: range.end,
    applyUrl: link.url,
    listUrl: TOSS_SECURITIES_NEWSROOM,
    entry: !autoApplied,
  };
}

export async function collectTossSecurities(today: string): Promise<CollectHit> {
  const issuer = "tosssec" as const;
  try {
    const html = await fetchText(TOSS_SECURITIES_NEWSROOM, {}, 7000);
    const links = tossPressLinks(html);
    const entries = await mapPool(links, 2, async (link) => {
      try {
        const detail = await fetchText(link.url, {}, 6500);
        return verifiedTossPressEvent(link, detail, today);
      } catch {
        return null;
      }
    });
    const events = entries.filter((event): event is EntryEvent => event !== null);
    return {
      issuer,
      events,
      ok: events.length > 0,
      message: events.length > 0
        ? "토스증권 공식 회사소식에서 행사 기간·혜택이 검증된 " + events.length +
          "건입니다. 앱 전용 행사는 포함하지 않습니다."
        : "토스증권 회사소식에서 진행 중인 행사 기간·혜택을 확인하지 못했습니다. " +
          "0건은 행사 없음이 아닌 수집 확인 필요 상태이며, 앱 전용 이벤트는 별도 확인이 필요합니다.",
    };
  } catch {
    return {
      issuer,
      events: [],
      ok: false,
      message: "토스증권 공식 회사소식 접속에 실패했습니다. 마지막 정상 수집 데이터를 유지합니다.",
    };
  }
}
