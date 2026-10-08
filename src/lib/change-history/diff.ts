import type { ChangeDraft } from "./types.ts";

/**
 * Compare two successful collection snapshots.
 * Only meaningful fields are compared, never collected_at or sort order.
 * Calling this with a failed / empty scrape is deliberately the caller's responsibility.
 */
export function diffEventLists<T extends { id: string; title: string }>(
  previous: readonly T[],
  incoming: readonly T[],
  trackedFields: ReadonlyArray<readonly [keyof T, string]>,
): ChangeDraft[] {
  const before = new Map(previous.map((item) => [item.id, item]));
  const after = new Set(incoming.map((item) => item.id));
  const changes: ChangeDraft[] = [];

  for (const item of incoming) {
    const old = before.get(item.id);
    if (!old) {
      changes.push({ eventId: item.id, title: item.title, action: "added", fields: [] });
      continue;
    }

    const fields = trackedFields
      .filter(([key]) => JSON.stringify(old[key] ?? null) !== JSON.stringify(item[key] ?? null))
      .map(([, label]) => label);
    if (fields.length) {
      changes.push({ eventId: item.id, title: item.title, action: "updated", fields });
    }
  }

  for (const item of previous) {
    if (!after.has(item.id)) {
      changes.push({ eventId: item.id, title: item.title, action: "removed", fields: [] });
    }
  }
  return changes;
}
