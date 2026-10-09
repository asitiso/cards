import { dbSource, getSql } from "@/lib/db";
import { recentChanges } from "@/lib/change-history/store.server";
import { seoulToday } from "@/lib/events/html";
import { SEED_COMPANIES, type PharmaCompany } from "./companies.ts";
import type { PharmaBoard, PharmaBrowserLogin, PharmaCompanyReport, PharmaEvent, PharmaKind } from "./types.ts";

const LOGIN_DISABLED = "제약사 로그인 기능이 비활성화되어 있습니다. 제약사 사이트에서 직접 로그인해 주세요.";
const SETTINGS_DISABLED = "공개 설정 변경 기능이 비활성화되어 있습니다.";

type EventRow = {
  id: string;
  company_id: string;
  title: string;
  summary: string;
  kind: string;
  conditions: string;
  start_date: string | null;
  end_date: string | null;
  url: string;
};



function asList(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function toEvent(row: EventRow): PharmaEvent {
  const kind: PharmaKind = row.kind === "sale" || row.kind === "new" ? row.kind : "entry";
  return {
    id: row.id,
    companyId: row.company_id,
    title: row.title,
    summary: row.summary,
    kind,
    conditions: asList(row.conditions),
    startDate: row.start_date ?? "",
    endDate: row.end_date ?? "",
    url: row.url,
  };
}

async function listCompanies(): Promise<PharmaCompany[]> {
  const sql = await getSql();
  const rows = await sql<{ id: string; name: string; short: string; login_url: string }>`
    select id, name, short, login_url
    from pharma_companies
    order by position asc, name asc
  `;
  // Reading the board never seeds or changes an existing database.
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    short: row.short,
    loginUrl: row.login_url,
  }));
}

function bundledPharmaBoard(): PharmaBoard {
  return {
    collectedAt: "",
    today: seoulToday(),
    events: [],
    changes: [],
    companies: SEED_COMPANIES.map((company) => ({
      id: company.id,
      name: company.name,
      short: company.short,
      loginUrl: company.loginUrl,
      count: 0,
      ok: false,
      saved: false,
      username: "",
      message: LOGIN_DISABLED,
    })),
  };
}

export async function loadPharmaBoard(): Promise<PharmaBoard> {
  if (dbSource === "pglite") return bundledPharmaBoard();
  const sql = await getSql();
  const today = seoulToday();
  const catalog = await listCompanies();
  const rows = await sql<EventRow>`
    select id, company_id, title, summary, kind, conditions,
           start_date::text as start_date, end_date::text as end_date, url
    from pharma_events
    where active = true
    order by end_date asc nulls last, title asc
  `;
  const state = await sql<{ collected_at: string }>`
    select collected_at::text as collected_at from pharma_state where id = 1
  `;
  const known = new Set(catalog.map((company) => company.id));
  const events = rows
    .map(toEvent)
    .filter((event) => known.has(event.companyId))
    .filter((event) => !event.endDate || event.endDate >= today);
  const counts = new Map<string, number>();
  for (const event of events) counts.set(event.companyId, (counts.get(event.companyId) ?? 0) + 1);
  const companies: PharmaCompanyReport[] = catalog.map((company) => {
    return {
      id: company.id,
      name: company.name,
      short: company.short,
      loginUrl: company.loginUrl,
      count: counts.get(company.id) ?? 0,
      ok: false,
      saved: false,
      username: "",
      message: LOGIN_DISABLED,
    };
  });
  return {
    collectedAt: state[0]?.collected_at ?? "",
    today,
    events,
    companies,
    changes: await recentChanges("pharma"),
  };
}

// Credential-based collection is paused; saved events and history remain readable.
export async function refreshPharma(_companyId?: string): Promise<PharmaBoard> {
  return loadPharmaBoard();
}

// Stale clients and direct server calls reject before any database access.
// Existing credentials, events and configuration are retained untouched.
export async function savePharmaLogin(
  _companyId: string, _username: string, _password: string,
): Promise<{ board: PharmaBoard; login: PharmaBrowserLogin | null }> {
  throw new Error(LOGIN_DISABLED);
}

export async function clearPharmaLogin(_companyId: string): Promise<PharmaBoard> {
  throw new Error(LOGIN_DISABLED);
}

export async function addPharmaCompany(_name: string, _loginUrl: string): Promise<{ board: PharmaBoard; id: string }> {
  throw new Error(SETTINGS_DISABLED);
}

export async function updatePharmaCompany(_companyId: string, _name: string, _loginUrl: string): Promise<PharmaBoard> {
  throw new Error(SETTINGS_DISABLED);
}

export async function deletePharmaCompany(_companyId: string): Promise<PharmaBoard> {
  throw new Error(SETTINGS_DISABLED);
}
