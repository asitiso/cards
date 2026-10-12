import { fetchText, seoulToday, stripTags } from "../events/html.ts";
import type { IpoBoard, IpoItem } from "./types.ts";
import { IPO38_URL, parse38Ipos } from "./comm38-source.ts";
import { SONNIM_SCHEDULE_URL, parseSonnimIpos } from "./sonnim-source.ts";

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
  const cutoff = new Date(Date.parse(today + "T00:00:00+09:00") - 21 * 86_400_000)
    .toISOString().slice(0, 10);
  const recent = (items: IpoItem[]) => items.filter(item => item.subscriptionEnd >= cutoff)
    .sort((a, b) => a.subscriptionStart.localeCompare(b.subscriptionStart) ||
      a.name.localeCompare(b.name, "ko"));

  // Fast path. The public schedule includes confirmed and upcoming IPOs,
  // and is substantially faster than waiting for blocked legacy sources.
  // Neither the homepage nor other finance collections depend on this request.
  let primaryMessage = "공모주로그 접속 실패";
  try {
    const html = await fetchText(SONNIM_SCHEDULE_URL, {}, 4500);
    const parsed = parseSonnimIpos(html, today);
    const items = recent(parsed);
    primaryMessage = parsed.length > 0
      ? "공모주로그 " + items.length + "건 (전체 판독 " + parsed.length + "건)"
      : "공모주로그 본문 판독 0건";
    if (items.length > 0) {
      return {
        today, collectedAt, status: "ok",
        sourceUrl: KIND_IPO_URL,
        message: "공개 청약 일정 " + items.length + "건 · " + primaryMessage +
          ". 신규·정정 공시 지연 가능. 청약 전 주관사 공고를 확인하세요.",
        items,
      };
    }
  } catch {
    // Move to backup sources rather than returning a false empty state.
  }

  // Fallback only: do not wait for two often-unavailable HTML sources on
  // every ordinary IPO tab open. Keep their original parser tests intact.
  const sources = [
    { label: "KRX KIND", url: KIND_IPO_URL },
    { label: "38커뮤니케이션", url: IPO38_URL },
  ];
  const responses = await Promise.allSettled(sources.map(source =>
    fetchText(source.url, {}, 6500),
  ));
  const kind = responses[0].status === "fulfilled"
    ? recent(parseKindIpos(responses[0].value)) : [];
  const backup = responses[1].status === "fulfilled"
    ? recent(parse38Ipos(responses[1].value)) : [];
  const merged = new Map<string, IpoItem>();
  for (const item of [...kind, ...backup]) {
    const key = item.name.replace(/[\s()（）·-]/g, "");
    const prior = merged.get(key);
    if (!prior) merged.set(key, item);
    else if (prior.subscriptionStart === item.subscriptionStart) merged.set(key, {
      ...prior,
      refundDate: prior.refundDate || item.refundDate,
      listingDate: prior.listingDate || item.listingDate,
      brokers: [...new Set([...prior.brokers, ...item.brokers])],
    });
  }
  const items = recent([...merged.values()]);
  const sourceReport = sources.map((source, i) =>
    source.label + " " + (responses[i].status === "rejected"
      ? "접속 실패" : (i === 0 ? kind.length : backup.length) + "건 판독"),
  ).join(" · ");
  const status: IpoBoard["status"] = items.length
    ? "ok" : responses.every(r => r.status === "rejected") ? "unavailable" : "empty";
  const message = status === "ok"
    ? "대체 공개 자료 " + items.length + "건 · " + primaryMessage + " · " + sourceReport +
      ". 최신 일정은 주관사 공고를 확인하세요."
    : "공모주 자동 수집 실패: " + primaryMessage + " · " + sourceReport +
      ". 0건이 실제 청약 종목 0건이라는 뜻은 아닙니다.";
  return { today, collectedAt, status, sourceUrl: KIND_IPO_URL, message, items };
}
