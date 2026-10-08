import { readFileSync, writeFileSync } from "node:fs";
import { collectLive } from "./http-collect.ts";
import { parseRange, seoulToday } from "./html.ts";
import { issuerMeta, type EntryEvent } from "./types.ts";

function wooriFromFile(): EntryEvent[] {
  let raw: Array<{ text: string; dtl: string }> = [];
  try {
    raw = JSON.parse(readFileSync("/tmp/rows-woori.json", "utf8")) as Array<{
      text: string;
      dtl: string;
    }>;
  } catch {
    return [];
  }
  const listUrl = issuerMeta("woori").listUrl;
  const today = seoulToday();
  const events: EntryEvent[] = [];
  for (const row of raw) {
    const [serial, kind] = row.dtl.split("|");
    if (kind !== "2" || !serial) continue;
    const text = row.text.replace(/\s+/g, " ").trim();
    const range = parseRange(text);
    if (!range || range.end < today) continue;
    const withoutDate = text.replace(/응모기간[\s\S]*$/, "").trim();
    const parts = withoutDate.split(" ");
    const badge = /^(캐시백|할인|경품|포인트|무이자)$/.test(parts[0] ?? "") ? parts[0] : "";
    const body = (badge ? parts.slice(1).join(" ") : withoutDate).trim();
    events.push({
      id: `woori:${serial}`,
      issuer: "woori",
      title: body || `우리카드 응모 ${serial}`,
      summary: body,
      benefit: badge || "응모",
      conditions: [
        body,
        "우리카드가 응모형으로 분류한 이벤트입니다. 대상 카드·실적·제외 업종은 응모 화면에서 확인하세요.",
      ],
      exclusions: ["로그인 응모가 필요할 수 있습니다."],
      startDate: range.start,
      endDate: range.end,
      applyUrl: listUrl,
      listUrl,
    });
  }
  return events;
}

const today = seoulToday();
const live = await collectLive(today);
const woori = wooriFromFile();
const events = [...live.flatMap((hit) => hit.events), ...woori];
const report = [
  ...live.map((hit) => ({
    id: hit.issuer,
    ok: hit.ok,
    message: hit.message,
    count: hit.events.length,
  })),
  {
    id: "woori",
    ok: woori.length > 0,
    message: woori.length
      ? `응모형 필터로 ${woori.length}건을 가져왔습니다. 상세 약관은 카드사 화면에서 확인하세요.`
      : "우리카드 응모형 목록을 가져오지 못했습니다.",
    count: woori.length,
  },
];

const body = `import type { EntryEvent, IssuerId } from "./types.ts";

export const SNAPSHOT_AT = ${JSON.stringify(new Date().toISOString())};

export const SNAPSHOT_EVENTS: EntryEvent[] = ${JSON.stringify(events, null, 2)};

export const SNAPSHOT_REPORT: { id: IssuerId; ok: boolean; message: string; count: number }[] = ${JSON.stringify(report, null, 2)};
`;

writeFileSync(new URL("./snapshot.ts", import.meta.url), body);
console.log(
  "events",
  events.length,
  report.map((item) => `${item.id}:${item.count}${item.ok ? "" : "!"}`).join(" "),
);
for (const event of events) {
  console.log(`- [${event.issuer}] ${event.title} | ${event.startDate}~${event.endDate}`);
}
