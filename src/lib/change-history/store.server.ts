import { getSql } from "@/lib/db";
import type { ChangeDomain, ChangeDraft, ChangeRecord } from "./types.ts";

type DbChangeRow = {
  id: string;
  domain: ChangeDomain;
  source_id: string;
  event_id: string;
  action: ChangeRecord["action"];
  title: string;
  fields: string;
  changed_at: string;
};

/** A single batch write per successful source collection; zero writes when nothing changed. */
export async function appendChanges(
  domain: ChangeDomain,
  sourceId: string,
  drafts: readonly ChangeDraft[],
): Promise<void> {
  if (drafts.length === 0) return;
  const sql = await getSql();

  // Chunk to keep parameter counts and SQL payloads small.
  for (let start = 0; start < drafts.length; start += 80) {
    const chunk = drafts.slice(start, start + 80);
    const params: unknown[] = [];
    const placeholders = chunk.map((draft) => {
      const i = params.length;
      params.push(domain, sourceId, draft.eventId, draft.action, draft.title, JSON.stringify(draft.fields));
      return `($${i + 1}, $${i + 2}, $${i + 3}, $${i + 4}, $${i + 5}, $${i + 6}::jsonb)`;
    });
    await sql.query(
      `insert into cards_private.change_history (domain, source_id, event_id, action, title, fields)
       values ${placeholders.join(", ")}`,
      params,
    );
  }
}

/** The database is the source of truth; only a small newest-first window is sent to the UI. */
export async function recentChanges(domain: ChangeDomain): Promise<ChangeRecord[]> {
  const sql = await getSql();
  const rows = await sql<DbChangeRow>`
    select id::text as id, domain, source_id, event_id, action, title,
           fields::text as fields, changed_at::text as changed_at
    from cards_private.change_history
    where domain = ${domain}
    order by id desc
    limit 60
  `;
  return rows.map((row) => ({
    id: row.id,
    domain: row.domain,
    sourceId: row.source_id,
    eventId: row.event_id,
    action: row.action,
    title: row.title,
    fields: safelyParseFields(row.fields),
    changedAt: row.changed_at,
  }));
}

function safelyParseFields(json: string): string[] {
  try {
    const value: unknown = JSON.parse(json);
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}
