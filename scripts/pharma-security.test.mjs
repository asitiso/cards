import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

let vite;
let store;
let sql;
let embedded;
before(async () => {
  // All mutation tests use an isolated embedded database, never Supabase.
  delete process.env.DATABASE_URL;
  vite = await createServer({
    configFile: false,
    plugins: [{
      name: "test-embedded-storage",
      transform(code, id) {
        if (/\/(?:pharma|change-history)\/store\.server\.ts$/.test(id.replaceAll("\\", "/"))) {
          return code.replaceAll('from "@/lib/db"', 'from "test-embedded-db"');
        }
      },
      resolveId(id) {
        if (id === "test-embedded-db") return "\0test-db";
      },
      load(id) {
        if (id === "\0test-db") return 'export const dbSource = "neon"; export async function getSql() { return globalThis.__pharmaTestSql; }';
      },
    }],
    resolve: { alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) } },
    server: { middlewareMode: true, hmr: false },
  });
  const db = await vite.ssrLoadModule("/src/lib/db.ts");
  sql = await db.getSql();
  embedded = await db.getPglite();
  // Exercise the configured-database read path against real isolated storage.
  // Fail immediately if any request reads passwords or encryption keys.
  globalThis.__pharmaTestSql = Object.assign(async (strings, ...params) => {
    assert.doesNotMatch(strings.join("?"), /pharma_credentials|pharma_secret/i);
    return sql(strings, ...params);
  }, { query: sql.query });
  store = await vite.ssrLoadModule("/src/lib/pharma/store.server.ts");
  await sql`insert into pharma_seed (id) values (1) on conflict do nothing`;
  await sql`insert into pharma_companies (id, name, short, login_url, position)
    values ('security-test', 'Test', 'Test', 'http://127.0.0.1:1', 0)`;
  await sql`insert into pharma_credentials (company_id, username, password_enc)
    values ('security-test', 'private-user', 'existing-secret')`;
  await sql`insert into pharma_events (id, company_id, title, summary, kind, conditions, end_date, url)
    values ('preserved-event', 'security-test', 'Saved event', 'Details', 'sale', '[]', '2099-12-31', 'https://example.com/event')`;
  await sql`insert into cards_private.change_history (domain, source_id, event_id, action, title)
    values ('pharma', 'security-test', 'preserved-event', 'added', 'Saved change')`;
});
after(async () => { await vite?.close(); await embedded?.close(); delete globalThis.__pharmaTestSql; });

for (const [name, args] of [
  ["savePharmaLogin", ["security-test", "new-user", "new-password"]],
  ["clearPharmaLogin", ["security-test"]],
  ["addPharmaCompany", ["New", "http://127.0.0.1:1"]],
  ["updatePharmaCompany", ["security-test", "Changed", "http://127.0.0.1:2"]],
  ["deletePharmaCompany", ["security-test"]],
]) {
  test(`${name} rejects direct calls and preserves stored data`, async () => {
    const companies = await sql`select * from pharma_companies order by id`;
    const credentials = await sql`select * from pharma_credentials order by company_id`;
    const events = await sql`select * from pharma_events order by id`;
    const changes = await sql`select * from cards_private.change_history order by id`;
    await assert.rejects(() => store[name](...args), /비활성화/);
    assert.deepEqual(await sql`select * from pharma_companies order by id`, companies);
    assert.deepEqual(await sql`select * from pharma_credentials order by company_id`, credentials);
    assert.deepEqual(await sql`select * from pharma_events order by id`, events);
    assert.deepEqual(await sql`select * from cards_private.change_history order by id`, changes);
  });
}

test("pharma refresh does not use saved credentials or change collection state", async () => {
  const credentials = await sql`select * from pharma_credentials`;
  const state = await sql`select * from pharma_state`;
  const board = await store.refreshPharma("security-test");
  assert.equal(board.events[0]?.title, "Saved event");
  assert.equal(board.changes[0]?.title, "Saved change");
  assert.deepEqual(await sql`select * from pharma_credentials`, credentials);
  assert.deepEqual(await sql`select * from pharma_state`, state);
  assert.ok(board.companies.every((company) => !company.saved && company.username === ""));
});
