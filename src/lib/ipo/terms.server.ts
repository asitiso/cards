import { fetchText, stripTags, visibleMarkup } from "../events/html.ts";

export type IpoTerms = {
  minimumShares: number | null;
  depositPercent: number | null;
  verified: boolean;
  refundDate: string;
  listingDate: string;
};

/** Only read a numeric, same-host public IPO detail URL; never proxy arbitrary URLs. */
function safe38Url(raw: string): string | null {
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || url.hostname !== "www.38.co.kr") return null;
    if (!/^\/html\/fund\/(?:index\.htm)?$/.test(url.pathname)) return null;
    if (url.searchParams.get("o") !== "v") return null;
    const no = url.searchParams.get("no") ?? "";
    if (!/^\d{1,7}$/.test(no)) return null;
    return "https://www.38.co.kr/html/fund/?o=v&no=" + no;
  } catch {
    return null;
  }
}

export function parse38Terms(html: string, expectedName: string): IpoTerms {
  const empty: IpoTerms = { minimumShares: null, depositPercent: null, verified: false, refundDate: "", listingDate: "" };
  const text = stripTags(visibleMarkup(html)).replace(/\s+/g, " ");
  if (!expectedName || !text.includes(expectedName)) return empty;
  const start = text.indexOf("일반청약자");
  if (start < 0) return empty;
  const stop = text.indexOf("IR일정", start);
  const group = text.slice(start, stop > start ? stop : start + 500).slice(0, 800);
  const rate = group.match(/청약\s*증거금\s*율\s*[:：]\s*(\d{1,3})\s*%/);
  const lots = group.match(/최저\s*[:：]\s*([\d,]+)\s*주/);
  const minimumShares = lots ? Number(lots[1].replace(/,/g, "")) : null;
  const depositPercent = rate ? Number(rate[1]) : null;
  function detailDate(label: string): string {
    const found = text.match(new RegExp(label + "\\s*[:：]?\\s*(20\\d{2})\\.(\\d{1,2})\\.(\\d{1,2})"));
    if (!found) return "";
    const year = Number(found[1]), month = Number(found[2]), day = Number(found[3]);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return "";
    return found[1] + "-" + found[2].padStart(2, "0") + "-" + found[3].padStart(2, "0");
  }
  return {
    minimumShares: minimumShares !== null && minimumShares >= 1 && minimumShares <= 100000
      ? minimumShares : null,
    depositPercent: depositPercent !== null && depositPercent >= 1 && depositPercent <= 100
      ? depositPercent : null,
    verified: true,
    refundDate: detailDate("환불일"),
    listingDate: detailDate("상장일"),
  };
}

export async function fetchIpoTerms(rawUrl: string, name: string): Promise<IpoTerms> {
  const url = safe38Url(rawUrl);
  const empty: IpoTerms = { minimumShares: null, depositPercent: null, verified: false, refundDate: "", listingDate: "" };
  if (!url || !name || name.length > 80) return empty;
  try {
    const html = await fetchText(url, {}, 7500);
    return parse38Terms(html, name);
  } catch {
    return empty;
  }
}
