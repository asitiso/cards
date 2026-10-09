import { stripTags, visibleMarkup } from "./html.ts";

export type DatedEventLink = {
  url: string;
  title: string;
  start: string;
  end: string;
};

/** Only crawl publicly linked pages on the institution's own domain. */
function ownedLink(href: string, sourceUrl: string): string | null {
  if (!href || /^(javascript:|data:|mailto:|tel:|#)/i.test(href)) return null;
  try {
    const url = new URL(href.replace(/&amp;/g, "&"), sourceUrl);
    const base = new URL(sourceUrl).hostname.replace(/^www\./i, "");
    const host = url.hostname.replace(/^www\./i, "");
    if (url.protocol !== "https:" || (host !== base && !host.endsWith(`.${base}`))) return null;
    url.hash = "";
    return url.href;
  } catch {
    return null;
  }
}

/** Stable across collection order and paging; unlike array-index based ids. */
export function stableLinkId(url: string): string {
  let h = 2166136261;
  for (let i = 0; i < url.length; i += 1) {
    h = Math.imul(h ^ url.charCodeAt(i), 16777619);
  }
  return (h >>> 0).toString(36);
}

function anchors(markup: string): Array<{ url: string; title: string; index: number }> {
  const matches = [...markup.matchAll(/<a\b([^>]*?\bhref\s*=\s*(["'])(.*?)\2[^>]*)>([\s\S]*?)<\/a>/gi)];
  return matches.map((m) => {
    const alt = m[4].match(/<img\b[^>]*\balt\s*=\s*(["'])(.*?)\1/i)?.[2] ?? "";
    return { url: m[3], title: stripTags(m[4] || alt) || stripTags(alt), index: m.index ?? 0 };
  });
}

const DATE = /(20\d{2})\s*(?:년|[.\-/])\s*(\d{1,2})\s*(?:월|[.\-/])\s*(\d{1,2})/g;
function rangeFrom(text: string): { start: string; end: string } | null {
  const dates = [...text.matchAll(DATE)].map((m) => {
    const month = Number(m[2]), day = Number(m[3]);
    if (month < 1 || month > 12 || day < 1 || day > 31) return "";
    return `${m[1]}-${m[2].padStart(2,"0")}-${m[3].padStart(2,"0")}`;
  }).filter(Boolean);
  if (dates.length < 2) return null;
  return { start: dates[0], end: dates[1] };
}

/** Light static parsing only: two explicit dates + promotion-looking title/link. */
export function findDatedEventLinks(html: string, sourceUrl: string, today: string): DatedEventLink[] {
  const visible = visibleMarkup(html);
  const found = new Map<string, DatedEventLink>();
  for (const a of anchors(visible)) {
    const url = ownedLink(a.url, sourceUrl);
    const title = a.title.replace(/\s+/g, " ").trim();
    if (!url || title.length < 8 || title.length > 120 ||
      /^(이벤트|더보기|바로가기|전체보기|자세히|혜택|로그인)$/i.test(title)) continue;
    if (!/(이벤트|event|evnt|promo|혜택|응모|추첨|캐시백|쿠폰|적금|계좌)/i.test(title+" "+url)) continue;
    // Only consider the current link and its immediate surrounding list item.
    // The next link is a hard boundary: otherwise its dates can be mistakenly
    // attached to this title, creating a promotion that does not exist.
    const following = visible.slice(a.index, a.index + 720);
    const nextAnchor = following.search(/<a\\b/i);
    const nextIndex = nextAnchor === 0
      ? following.slice(2).search(/<a\\b/i) + 2
      : nextAnchor;
    const boundaries = [following.indexOf("</li>"), following.indexOf("</article>"),
      nextIndex].filter((idx) => idx > 0);
    const after = following.slice(0, boundaries.length ? Math.min(...boundaries) : 720);
    const listOpen = visible.lastIndexOf("<li", a.index);
    const listClose = visible.lastIndexOf("</li>", a.index);
    const articleOpen = visible.lastIndexOf("<article", a.index);
    const articleClose = visible.lastIndexOf("</article>", a.index);
    const precedingStart = listOpen > listClose && a.index - listOpen <= 420
      ? listOpen
      : (articleOpen > articleClose && a.index - articleOpen <= 420 ? articleOpen : a.index);
    const local = visible.slice(precedingStart, a.index) + after;
    const range = rangeFrom(stripTags(local));
    if (!range || range.start > today || range.end < today || range.start > range.end) continue;
    found.set(url, { url, title, ...range });
  }
  return [...found.values()].slice(0, 24);
}

/** At most two extra GETs per generic institution, and only after 0 hits. */
export function findEventIndexPages(html: string, sourceUrl: string, max = 2): string[] {
  const visible = visibleMarkup(html);
  const found = new Map<string, number>();
  for (const a of anchors(visible)) {
    const url = ownedLink(a.url, sourceUrl);
    if (!url || url === sourceUrl) continue;
    if (!/(이벤트|진행중|진행 중|혜택|프로모션|event|evnt|benefit|promotion)/i.test(a.title+" "+url)) continue;
    if (/(자세히|응모하기|신청하기|공지사항|상세보기)/.test(a.title)) continue;
    const score = (/event|evnt|promotion|benefit/i.test(new URL(url).pathname) ? 2 : 0) +
      (/(이벤트|행사|프로모션)/.test(a.title) ? 2 : 0);
    if (score >= 2) found.set(url, Math.max(found.get(url) ?? 0, score));
  }
  return [...found].sort((a,b)=>b[1]-a[1]).slice(0,Math.max(0,Math.min(2,max))).map(([url])=>url);
}
