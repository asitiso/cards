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
  // Three independent public sources; loading the finance home page never
  // fetches IPOs. A source must yield real parsed rows to count as usable.
  const endpoints = [
    { label: "공모주로그", url: SONNIM_SCHEDULE_URL },
    { label: "KRX KIND", url: KIND_IPO_URL },
    { label: "38커뮤니케이션", url: IPO38_URL },
  ];
  const requests = await Promise.allSettled(endpoints.map((source) =>
    fetchText(source.url, {}, 7000),
  ));
  const sonnim = requests[0].status === "fulfilled"
    ? parseSonnimIpos(requests[0].value, today) : [];
  const kind = requests[1].status === "fulfilled"
    ? parseKindIpos(requests[1].value) : [];
  const thirdParty = requests[2].status === "fulfilled"
    ? parse38Ipos(requests[2].value) : [];

  const cutoff = new Date(Date.parse(today + "T00:00:00+09:00") - 21 * 86_400_000)
    .toISOString().slice(0, 10);
  const byName = new Map<string, IpoItem>();
  const keyOf = (item: IpoItem) => item.name.replace(/[\s()（）·-]/g, "");
  // Recent/current entries from the updated public schedule take precedence
  // over stale records from older supplementary schedules.
  for (const source of [sonnim, kind, thirdParty]) {
    for (const item of source) {
      if (item.subscriptionEnd < cutoff) continue;
      const key = keyOf(item);
      const prior = byName.get(key);
      if (!prior) {
        byName.set(key, item);
      } else if (prior.subscriptionStart === item.subscriptionStart) {
        // Fill missing dates only when the two sources agree on the offering period.
        byName.set(key, {
          ...prior,
          listingDate: prior.listingDate || item.listingDate,
          refundDate: prior.refundDate || item.refundDate,
          brokers: [...new Set([...prior.brokers, ...item.brokers])],
        });
      }
    }
  }
  const items = [...byName.values()].sort((a, b) =>
    a.subscriptionStart.localeCompare(b.subscriptionStart) ||
    a.name.localeCompare(b.name, "ko"),
  );
  const tally = [sonnim.length, kind.length, thirdParty.length];
  const report = endpoints.map((source, index) => {
    const status = requests[index].status === "rejected" ? "접속 실패"
      : tally[index] > 0 ? tally[index] + "건 판독" : "본문 판독 0건";
    return source.label + " " + status;
  }).join(" · ");
  const status: IpoBoard["status"] = items.length > 0 ? "ok"
    : requests.every((r) => r.status === "rejected") ? "unavailable" : "empty";
  const message = status === "ok"
    ? "공개 일정 " + items.length + "건 · " + report +
      ". 예정 종목·공모가는 변경될 수 있으며 최종 청약 공고가 우선합니다."
    : "공모주 자동 수집에 실패했습니다 (" + report +
      "). 0건은 청약 종목이 없다는 뜻이 아닙니다. 공식 일정표를 확인하세요.";
  return { today, collectedAt, status, sourceUrl: KIND_IPO_URL, message, items };
}
