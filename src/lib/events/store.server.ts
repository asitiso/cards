import { getSql, dbSource } from "@/lib/db";
import { collectLive } from "./http-collect.ts";
import { seoulToday } from "./html.ts";
import { SNAPSHOT_AT, SNAPSHOT_EVENTS, SNAPSHOT_REPORT } from "./snapshot.ts";
import { EXTRA_AT, EXTRA_EVENTS, EXTRA_REPORT } from "./extra-snapshot.ts";
import {
  ISSUERS,
  type Board,
  type EntryEvent,
  type IssuerId,
  type IssuerReport,
} from "./types.ts";

type EventRow = {
  id: string;
  issuer: IssuerId;
  title: string;
  summary: string;
  benefit: string;
  conditions: string;
  exclusions: string;
  start_date: string;
  end_date: string;
  apply_url: string;
  list_url: string;
  entry: boolean;
};

const QUIET: Record<string, string> = {
  samsung: "삼성카드 목록을 이번엔 열지 못했습니다. 삼성카드 이벤트 페이지로 바로 갈 수 있습니다.",
  lotte: "롯데카드 목록을 이번엔 열지 못했습니다.",
  hana: "하나카드 목록을 이번엔 열지 못했습니다.",
  nh: "NH농협카드 응모 탭을 이번엔 열지 못했습니다.",
  bc: "BC·페이북 목록을 이번엔 열지 못했습니다.",
  ibk: "IBK 카드 행사 목록을 이번엔 열지 못했습니다.",
  kakaobank: "카카오뱅크 이벤트는 앱에서 열리는 경우가 많습니다. 목록이 비면 앱으로 이동하세요.",
  tossbank: "토스뱅크 이벤트는 앱 안 행사가 많습니다. 목록이 비면 앱으로 이동하세요.",
};

function asList(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function toEvent(row: EventRow): EntryEvent {
  return {
    id: row.id,
    issuer: row.issuer,
    title: row.title,
    summary: row.summary,
    benefit: row.benefit,
    conditions: asList(row.conditions),
    exclusions: asList(row.exclusions),
    startDate: row.start_date,
    endDate: row.end_date,
    applyUrl: row.apply_url,
    listUrl: row.list_url,
    entry: row.entry !== false,
  };
}

function fullReport(
  partial: { id: IssuerId; ok: boolean; message: string; count: number }[],
  counts: Map<string, number>,
): IssuerReport[] {
  return ISSUERS.map((issuer) => {
    const hit = partial.find((item) => item.id === issuer.id);
    const count = counts.get(issuer.id) ?? hit?.count ?? 0;
    if (hit) {
      return {
        id: issuer.id,
        name: issuer.name,
        listUrl: issuer.listUrl,
        count,
        ok: hit.ok,
        message: hit.message,
      };
    }
    return {
      id: issuer.id,
      name: issuer.name,
      listUrl: issuer.listUrl,
      count,
      ok: false,
      message: QUIET[issuer.id] ?? "이번 수집에서 응모·쿠폰·추첨 이벤트를 찾지 못했습니다.",
    };
  });
}

async function insertEvents(events: EntryEvent[], collectedAt: string): Promise<void> {
  const sql = await getSql();
  for (const event of events) {
    await sql`
      insert into entry_events (
        id, issuer, title, summary, benefit, conditions, exclusions,
        start_date, end_date, apply_url, list_url, active, collected_at, entry
      ) values (
        ${event.id}, ${event.issuer}, ${event.title}, ${event.summary}, ${event.benefit},
        ${JSON.stringify(event.conditions)}, ${JSON.stringify(event.exclusions)},
        ${event.startDate}, ${event.endDate}, ${event.applyUrl}, ${event.listUrl},
        true, ${collectedAt}, ${event.entry !== false}
      )
      on conflict (id) do nothing
    `;
  }
}

async function seedIfEmpty(): Promise<void> {
  const sql = await getSql();
  const existing = await sql<{ id: number }>`select id from collect_state where id = 1`;
  if (existing.length > 0) return;
  await insertEvents(SNAPSHOT_EVENTS, SNAPSHOT_AT);
  await sql`
    insert into collect_state (id, collected_at, report)
    values (1, ${SNAPSHOT_AT}, ${JSON.stringify(SNAPSHOT_REPORT)})
    on conflict (id) do nothing
  `;
}

async function backfillExtra(): Promise<void> {
  const sql = await getSql();
  const counts = await sql<{ issuer: string }>`
    select issuer from entry_events where active = true group by issuer
  `;
  const have = new Set(counts.map((row) => row.issuer));
  const state = await sql<{ report: string }>`select report from collect_state where id = 1`;
  let prior: { id: IssuerId; ok: boolean; message: string; count: number }[] = [];
  try {
    prior = JSON.parse(state[0]?.report ?? "[]") as typeof prior;
  } catch {
    prior = [];
  }
  const reported = new Set(prior.filter((item) => item.ok).map((item) => item.id));
  const missingIssuers = new Set(
    EXTRA_EVENTS.map((event) => event.issuer).filter(
      (issuer) => !have.has(issuer) && !reported.has(issuer),
    ),
  );
  if (missingIssuers.size === 0) return;
  const missing = EXTRA_EVENTS.filter((event) => missingIssuers.has(event.issuer));
  await insertEvents(missing, EXTRA_AT);
  const merged = prior.filter((item) => !missingIssuers.has(item.id));
  for (const report of EXTRA_REPORT) {
    if (missingIssuers.has(report.id)) merged.push(report);
  }
  await sql`
    insert into collect_state (id, collected_at, report)
    values (1, ${EXTRA_AT}, ${JSON.stringify(merged)})
    on conflict (id) do update set
      collected_at = excluded.collected_at,
      report = excluded.report
  `;
}

async function readBoard(): Promise<Board> {
  const sql = await getSql();
  const rows = await sql<EventRow>`
    select id, issuer, title, summary, benefit, conditions, exclusions,
           start_date::text as start_date, end_date::text as end_date,
           apply_url, list_url, entry
    from entry_events
    where active = true
    order by end_date asc, title asc
  `;
  const state = await sql<{ collected_at: string; report: string }>`
    select collected_at::text as collected_at, report from collect_state where id = 1
  `;
  const events = rows.map(toEvent);
  const counts = new Map<string, number>();
  for (const event of events) counts.set(event.issuer, (counts.get(event.issuer) ?? 0) + 1);
  let partial: { id: IssuerId; ok: boolean; message: string; count: number }[] = [];
  try {
    partial = JSON.parse(state[0]?.report ?? "[]") as typeof partial;
  } catch {
    partial = [];
  }
  return {
    collectedAt: state[0]?.collected_at ?? new Date().toISOString(),
    today: seoulToday(),
    events,
    issuers: fullReport(partial, counts),
  };
}

function bundledBoard(): Board {
  const events = [...SNAPSHOT_EVENTS];
  const have = new Set(events.map((event) => event.issuer));
  const reported = new Set(SNAPSHOT_REPORT.filter((item) => item.ok).map((item) => item.id));
  const missingIssuers = new Set(
    EXTRA_EVENTS.map((event) => event.issuer).filter((issuer) => !have.has(issuer) && !reported.has(issuer)),
  );
  for (const event of EXTRA_EVENTS) {
    if (missingIssuers.has(event.issuer)) events.push(event);
  }
  events.sort((a, b) => a.endDate.localeCompare(b.endDate) || a.title.localeCompare(b.title, "ko"));
  const counts = new Map<string, number>();
  for (const event of events) counts.set(event.issuer, (counts.get(event.issuer) ?? 0) + 1);
  const partial = SNAPSHOT_REPORT.filter((item) => !missingIssuers.has(item.id));
  for (const report of EXTRA_REPORT) {
    if (missingIssuers.has(report.id)) partial.push(report);
  }
  return {
    collectedAt: missingIssuers.size > 0 ? EXTRA_AT : SNAPSHOT_AT,
    today: seoulToday(),
    events,
    issuers: fullReport(partial, counts),
  };
}

export async function loadBoard(): Promise<Board> {
  if (dbSource === "pglite") return bundledBoard();
  await seedIfEmpty();
  await backfillExtra();
  return readBoard();
}

export async function refreshBoard(): Promise<Board> {
  await seedIfEmpty();
  const sql = await getSql();
  const today = seoulToday();
  const hits = await collectLive(today);
  const collectedAt = new Date().toISOString();
  for (const hit of hits) {
    if (!hit.ok) continue;
    await sql`update entry_events set active = false where issuer = ${hit.issuer}`;
    for (const event of hit.events) {
      await sql`
        insert into entry_events (
          id, issuer, title, summary, benefit, conditions, exclusions,
          start_date, end_date, apply_url, list_url, active, collected_at, entry
        ) values (
          ${event.id}, ${event.issuer}, ${event.title}, ${event.summary}, ${event.benefit},
          ${JSON.stringify(event.conditions)}, ${JSON.stringify(event.exclusions)},
          ${event.startDate}, ${event.endDate}, ${event.applyUrl}, ${event.listUrl},
          true, ${collectedAt}, ${event.entry !== false}
        )
        on conflict (id) do update set
          title = excluded.title,
          summary = excluded.summary,
          benefit = excluded.benefit,
          conditions = excluded.conditions,
          exclusions = excluded.exclusions,
          start_date = excluded.start_date,
          end_date = excluded.end_date,
          apply_url = excluded.apply_url,
          list_url = excluded.list_url,
          active = true,
          collected_at = excluded.collected_at,
          entry = excluded.entry
      `;
    }
  }
  const previous = await sql<{ report: string }>`select report from collect_state where id = 1`;
  let prior: { id: IssuerId; ok: boolean; message: string; count: number }[] = [];
  try {
    prior = JSON.parse(previous[0]?.report ?? "[]") as typeof prior;
  } catch {
    prior = [];
  }
  const merged = [...prior.filter((item) => !hits.some((hit) => hit.issuer === item.id))];
  for (const hit of hits) {
    merged.push({
      id: hit.issuer,
      ok: hit.ok,
      message: hit.ok ? hit.message : `${hit.message} 마지막 목록을 유지합니다.`,
      count: hit.ok ? hit.events.length : (prior.find((item) => item.id === hit.issuer)?.count ?? 0),
    });
  }
  await sql`
    insert into collect_state (id, collected_at, report)
    values (1, ${collectedAt}, ${JSON.stringify(merged)})
    on conflict (id) do update set
      collected_at = excluded.collected_at,
      report = excluded.report
  `;
  return readBoard();
}
