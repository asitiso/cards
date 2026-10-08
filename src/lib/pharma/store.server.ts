import { getSql } from "@/lib/db";
import { mapPool, seoulToday } from "@/lib/events/html";
import { SEED_COMPANIES, chipLabel, type PharmaCompany } from "./companies.ts";
import { collectCompany, describeLogin } from "./collect.ts";
import { decryptText, encryptText, newPharmaKey } from "./secret.ts";
import type { PharmaBoard, PharmaBrowserLogin, PharmaCompanyReport, PharmaEvent, PharmaKind } from "./types.ts";

const BATCH = 4;

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

type ReportRow = { id: string; ok: boolean; message: string; count: number };

type Credential = { company_id: string; username: string; password_enc: string };

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

async function secretKey(): Promise<string> {
  const sql = await getSql();
  const rows = await sql<{ key: string }>`select key from pharma_secret where id = 1`;
  if (rows[0]?.key) return rows[0].key;
  const key = newPharmaKey();
  await sql`
    insert into pharma_secret (id, key) values (1, ${key})
    on conflict (id) do nothing
  `;
  const again = await sql<{ key: string }>`select key from pharma_secret where id = 1`;
  return again[0]?.key ?? key;
}

async function listCompanies(): Promise<PharmaCompany[]> {
  const sql = await getSql();
  const seeded = await sql<{ id: number }>`select id from pharma_seed where id = 1`;
  if (seeded.length === 0) {
    for (const [index, company] of SEED_COMPANIES.entries()) {
      await sql`
        insert into pharma_companies (id, name, short, login_url, position)
        values (${company.id}, ${company.name}, ${company.short}, ${company.loginUrl}, ${index})
        on conflict (id) do nothing
      `;
    }
    await sql`insert into pharma_seed (id) values (1) on conflict (id) do nothing`;
  }
  const rows = await sql<{ id: string; name: string; short: string; login_url: string }>`
    select id, name, short, login_url
    from pharma_companies
    order by position asc, name asc
  `;
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    short: row.short,
    loginUrl: row.login_url,
  }));
}

function cleanCompany(name: string, loginUrl: string): { name: string; short: string; loginUrl: string } {
  const trimmed = name.trim();
  if (!trimmed || trimmed.length > 40) throw new Error("회사 이름은 1~40자로 입력하세요.");
  let url: URL;
  try {
    url = new URL(loginUrl.trim());
  } catch {
    throw new Error("홈페이지 주소가 올바르지 않습니다.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("http 주소만 저장할 수 있습니다.");
  }
  return { name: trimmed, short: chipLabel(trimmed), loginUrl: url.href };
}

async function getCompany(id: string): Promise<PharmaCompany | undefined> {
  return (await listCompanies()).find((company) => company.id === id);
}

async function readReport(): Promise<ReportRow[]> {
  const sql = await getSql();
  const state = await sql<{ report: string }>`select report from pharma_state where id = 1`;
  try {
    const parsed = JSON.parse(state[0]?.report ?? "[]") as unknown;
    return Array.isArray(parsed) ? (parsed as ReportRow[]) : [];
  } catch {
    return [];
  }
}

export async function loadPharmaBoard(): Promise<PharmaBoard> {
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
  const creds = await sql<{ company_id: string; username: string }>`
    select company_id, username from pharma_credentials
  `;
  const saved = new Map(creds.map((row) => [row.company_id, row.username]));
  const state = await sql<{ collected_at: string }>`
    select collected_at::text as collected_at from pharma_state where id = 1
  `;
  const report = await readReport();
  const known = new Set(catalog.map((company) => company.id));
  const events = rows
    .map(toEvent)
    .filter((event) => known.has(event.companyId))
    .filter((event) => !event.endDate || event.endDate >= today);
  const counts = new Map<string, number>();
  for (const event of events) counts.set(event.companyId, (counts.get(event.companyId) ?? 0) + 1);
  const companies: PharmaCompanyReport[] = catalog.map((company) => {
    const hit = report.find((item) => item.id === company.id);
    const username = saved.get(company.id) ?? "";
    return {
      id: company.id,
      name: company.name,
      short: company.short,
      loginUrl: company.loginUrl,
      count: counts.get(company.id) ?? 0,
      ok: hit?.ok ?? false,
      saved: username.length > 0,
      username,
      message:
        hit?.message ??
        (username
          ? "저장되어 있습니다. 다시 수집하면 읽습니다."
          : "아이디를 저장하면 응모·할인·신제품을 읽습니다."),
    };
  });
  return {
    collectedAt: state[0]?.collected_at ?? "",
    today,
    events,
    companies,
  };
}

async function writeEvents(companyId: string, result: { ok: boolean; message: string; events: PharmaEvent[] }) {
  if (!result.ok) return;
  const sql = await getSql();
  const collectedAt = new Date().toISOString();
  await sql`update pharma_events set active = false where company_id = ${companyId}`;
  for (const event of result.events) {
    await sql`
      insert into pharma_events (
        id, company_id, title, summary, kind, conditions, start_date, end_date, url, active, collected_at
      ) values (
        ${event.id}, ${event.companyId}, ${event.title}, ${event.summary}, ${event.kind},
        ${JSON.stringify(event.conditions)}, ${event.startDate || null}, ${event.endDate || null},
        ${event.url}, true, ${collectedAt}
      )
      on conflict (id) do update set
        title = excluded.title,
        summary = excluded.summary,
        kind = excluded.kind,
        conditions = excluded.conditions,
        start_date = excluded.start_date,
        end_date = excluded.end_date,
        url = excluded.url,
        active = true,
        collected_at = excluded.collected_at
    `;
  }
}

async function saveReport(updates: ReportRow[], cursor: number | null): Promise<void> {
  const sql = await getSql();
  const prior = await readReport();
  const catalog = await listCompanies();
  const merged = catalog
    .map((company) => updates.find((item) => item.id === company.id) ?? prior.find((item) => item.id === company.id))
    .filter((item): item is ReportRow => Boolean(item));
  const state = await sql<{ cursor: number }>`select cursor from pharma_state where id = 1`;
  const next = cursor ?? state[0]?.cursor ?? 0;
  const now = new Date().toISOString();
  await sql`
    insert into pharma_state (id, collected_at, cursor, report)
    values (1, ${now}, ${next}, ${JSON.stringify(merged)})
    on conflict (id) do update set
      collected_at = excluded.collected_at,
      cursor = excluded.cursor,
      report = excluded.report
  `;
}

async function credentialsFor(ids: string[]): Promise<Map<string, { username: string; password: string }>> {
  const sql = await getSql();
  const key = await secretKey();
  const rows = await sql<Credential>`
    select company_id, username, password_enc from pharma_credentials
  `;
  const out = new Map<string, { username: string; password: string }>();
  for (const row of rows) {
    if (!ids.includes(row.company_id)) continue;
    try {
      out.set(row.company_id, { username: row.username, password: decryptText(row.password_enc, key) });
    } catch {
      out.set(row.company_id, { username: row.username, password: "" });
    }
  }
  return out;
}

async function runCompanies(companies: PharmaCompany[]): Promise<ReportRow[]> {
  const creds = await credentialsFor(companies.map((company) => company.id));
  const today = seoulToday();
  return mapPool(companies, 2, async (company) => {
    const cred = creds.get(company.id);
    if (!cred?.password) {
      return {
        id: company.id,
        ok: false,
        count: 0,
        message: cred ? "저장된 비밀번호를 읽지 못했습니다. 다시 저장해 주세요." : "아이디를 저장하면 읽습니다.",
      };
    }
    const result = await collectCompany(company, cred.username, cred.password, today);
    await writeEvents(company.id, result);
    return { id: company.id, ok: result.ok, count: result.events.length, message: result.message };
  });
}

export async function refreshPharma(companyId?: string): Promise<PharmaBoard> {
  const sql = await getSql();
  if (companyId) {
    const company = await getCompany(companyId);
    if (!company) throw new Error("없는 회사입니다.");
    const updates = await runCompanies([company]);
    await saveReport(updates, null);
    return loadPharmaBoard();
  }
  const rows = await sql<{ company_id: string }>`
    select company_id from pharma_credentials order by company_id asc
  `;
  const catalog = await listCompanies();
  const byId = new Map(catalog.map((company) => [company.id, company]));
  const saved = rows
    .map((row) => byId.get(row.company_id))
    .filter((company): company is PharmaCompany => Boolean(company));
  if (saved.length === 0) {
    await saveReport([], 0);
    return loadPharmaBoard();
  }
  const state = await sql<{ cursor: number }>`select cursor from pharma_state where id = 1`;
  const start = (state[0]?.cursor ?? 0) % saved.length;
  const take = Math.min(BATCH, saved.length);
  const batch = Array.from({ length: take }, (_, index) => saved[(start + index) % saved.length]);
  const updates = await runCompanies(batch);
  await saveReport(updates, (start + take) % saved.length);
  return loadPharmaBoard();
}

export async function savePharmaLogin(
  companyId: string,
  username: string,
  password: string,
): Promise<{ board: PharmaBoard; login: PharmaBrowserLogin | null }> {
  const company = await getCompany(companyId);
  if (!company) throw new Error("없는 회사입니다.");
  const name = username.trim();
  if (!name || name.length > 120) throw new Error("아이디를 입력하세요.");
  if (password.length > 200) throw new Error("비밀번호가 너무 깁니다.");
  const sql = await getSql();
  const key = await secretKey();
  const existing = await sql<{ password_enc: string }>`
    select password_enc from pharma_credentials where company_id = ${companyId}
  `;
  const secret = password ? encryptText(password, key) : existing[0]?.password_enc;
  if (!secret) throw new Error("비밀번호를 입력하세요.");
  await sql`
    insert into pharma_credentials (company_id, username, password_enc, updated_at)
    values (${companyId}, ${name}, ${secret}, now())
    on conflict (company_id) do update set
      username = excluded.username,
      password_enc = excluded.password_enc,
      updated_at = now()
  `;
  const loginPromise = describeLogin(company.loginUrl).catch(() => null);
  const updates = await runCompanies([company]);
  await saveReport(updates, null);
  return { board: await loadPharmaBoard(), login: await loginPromise };
}

export async function clearPharmaLogin(companyId: string): Promise<PharmaBoard> {
  if (!(await getCompany(companyId))) throw new Error("없는 회사입니다.");
  const sql = await getSql();
  await sql`delete from pharma_credentials where company_id = ${companyId}`;
  await sql`update pharma_events set active = false where company_id = ${companyId}`;
  await saveReport([{ id: companyId, ok: false, count: 0, message: "로그인 정보를 지웠습니다." }], null);
  return loadPharmaBoard();
}

export async function addPharmaCompany(name: string, loginUrl: string): Promise<{ board: PharmaBoard; id: string }> {
  const cleaned = cleanCompany(name, loginUrl);
  const sql = await getSql();
  await listCompanies();
  const id = `c-${Date.now().toString(36)}`;
  const pos = await sql<{ max: number | null }>`select max(position) as max from pharma_companies`;
  const position = (pos[0]?.max ?? 0) + 1;
  await sql`
    insert into pharma_companies (id, name, short, login_url, position)
    values (${id}, ${cleaned.name}, ${cleaned.short}, ${cleaned.loginUrl}, ${position})
  `;
  return { board: await loadPharmaBoard(), id };
}

export async function updatePharmaCompany(companyId: string, name: string, loginUrl: string): Promise<PharmaBoard> {
  if (!(await getCompany(companyId))) throw new Error("없는 회사입니다.");
  const cleaned = cleanCompany(name, loginUrl);
  const sql = await getSql();
  await sql`
    update pharma_companies
    set name = ${cleaned.name}, short = ${cleaned.short}, login_url = ${cleaned.loginUrl}
    where id = ${companyId}
  `;
  return loadPharmaBoard();
}

export async function deletePharmaCompany(companyId: string): Promise<PharmaBoard> {
  if (!(await getCompany(companyId))) throw new Error("없는 회사입니다.");
  const sql = await getSql();
  await sql`delete from pharma_credentials where company_id = ${companyId}`;
  await sql`delete from pharma_events where company_id = ${companyId}`;
  await sql`delete from pharma_companies where id = ${companyId}`;
  return loadPharmaBoard();
}
