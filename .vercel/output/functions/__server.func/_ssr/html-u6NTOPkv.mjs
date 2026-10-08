//#region node_modules/.nitro/vite/services/ssr/assets/html-u6NTOPkv.js
var _0002_events_default = "create table if not exists entry_events (\n  id text primary key,\n  issuer text not null,\n  title text not null,\n  summary text not null,\n  benefit text not null,\n  conditions text not null,\n  exclusions text not null,\n  start_date date,\n  end_date date,\n  apply_url text not null,\n  list_url text not null,\n  active boolean not null default true,\n  collected_at timestamptz not null default now()\n);\n\ncreate index if not exists entry_events_issuer_idx on entry_events (issuer);\ncreate index if not exists entry_events_end_idx on entry_events (end_date);\n\ncreate table if not exists collect_state (\n  id integer primary key,\n  collected_at timestamptz not null,\n  report text not null\n);\n";
var _0003_pharma_default = "create table if not exists pharma_events (\n  id text primary key,\n  company_id text not null,\n  title text not null,\n  summary text not null,\n  kind text not null,\n  conditions text not null,\n  start_date date,\n  end_date date,\n  url text not null,\n  active boolean not null default true,\n  collected_at timestamptz not null default now()\n);\n\ncreate index if not exists pharma_events_company_idx on pharma_events (company_id);\n\ncreate table if not exists pharma_credentials (\n  company_id text primary key,\n  username text not null,\n  password_enc text not null,\n  updated_at timestamptz not null default now()\n);\n\ncreate table if not exists pharma_secret (\n  id integer primary key,\n  key text not null\n);\n\ncreate table if not exists pharma_state (\n  id integer primary key,\n  collected_at timestamptz not null,\n  cursor integer not null default 0,\n  report text not null\n);\n";
var _0004_pharma_companies_default = "create table if not exists pharma_companies (\n  id text primary key,\n  name text not null,\n  short text not null,\n  login_url text not null,\n  position integer not null default 0\n);\n\ncreate table if not exists pharma_seed (\n  id integer primary key\n);\n\ndelete from pharma_credentials\nwhere company_id in ('baekje', 'boksan', 'geoyoung', 'sehwa', 'samwon', 'pico');\n\ndelete from pharma_events\nwhere company_id in ('baekje', 'boksan', 'geoyoung', 'sehwa', 'samwon', 'pico');\n";
var _0005_event_entry_default = "alter table entry_events add column if not exists entry boolean not null default true;\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({
			"/migrations/0002_events.sql": _0002_events_default,
			"/migrations/0003_pharma.sql": _0003_pharma_default,
			"/migrations/0004_pharma_companies.sql": _0004_pharma_companies_default,
			"/migrations/0005_event_entry.sql": _0005_event_entry_default
		});
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
function seoulToday(now = /* @__PURE__ */ new Date()) {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Seoul",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(now);
}
function visibleMarkup(html) {
	return html.replace(/<!--[\s\S]*?-->/g, " ").replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ");
}
function decodeEntities(value) {
	return value.replace(/&nbsp;/gi, " ").replace(/&middot;/g, "·").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, "\"").replace(/&#39;|'/g, "'").replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code))).replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16))).replace(/&/g, "&");
}
function stripTags(value) {
	return decodeEntities(value.replace(/<li[^>]*>/gi, "\n").replace(/<\/p>/gi, "\n").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, " ")).replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").replace(/[ \t]{2,}/g, " ").replace(/\n{2,}/g, "\n").trim();
}
function parseRange(value) {
	const nums = [...value.matchAll(/(\d{4})\s*\.\s*(\d{1,2})\s*\.\s*(\d{1,2})/g)].map((match) => `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`);
	if (nums.length < 2) return null;
	return {
		start: nums[0],
		end: nums[1]
	};
}
function ymd(compact) {
	const match = compact.match(/^(\d{4})(\d{2})(\d{2})$/);
	if (!match) return compact;
	return `${match[1]}-${match[2]}-${match[3]}`;
}
function isOngoing(endDate, today) {
	return endDate >= today;
}
var NEGATIVE = /응모\s*없이|무응모|별도\s*응모\s*(없|불필요)|별도\s*신청\s*(없|불필요)|응모가\s*불필요|응모\s*불필요|신청\s*없이\s*적용/;
var POSITIVE = /응모하기|응모\s*필수|응모하고|응모\s*후|이벤트\s*응모|응모하시면/;
function isEntryCopy(text) {
	const flat = text.replace(/\s+/g, " ");
	const positive = POSITIVE.test(flat);
	const negative = NEGATIVE.test(flat);
	if (!positive) return false;
	if (!negative) return true;
	return /응모하기|응모\s*필수|응모하고/.test(flat);
}
function linesFrom(text) {
	const seen = /* @__PURE__ */ new Set();
	const lines = [];
	for (const raw of text.split("\n")) {
		const line = raw.replace(/\s+/g, " ").trim();
		if (line.length < 10 || line.length > 180) continue;
		if (seen.has(line)) continue;
		seen.add(line);
		lines.push(line);
	}
	return lines;
}
function splitRules(text) {
	const lines = linesFrom(text);
	const exclusions = lines.filter((line) => /제외|불가|않을 경우|않은 경우|중복|조기 종료/.test(line)).slice(0, 4);
	return {
		conditions: lines.filter((line) => !exclusions.includes(line) && /대상|회원|실적|이상|기간|결제|이용|카드|응모/.test(line)).slice(0, 5),
		exclusions
	};
}
async function fetchText(url, init = {}, timeoutMs = 12e3) {
	const response = await fetch(url, {
		...init,
		signal: AbortSignal.timeout(timeoutMs),
		headers: {
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
			"Accept-Language": "ko-KR,ko;q=0.9",
			Accept: "text/html,application/json;q=0.9,*/*;q=0.8",
			...init.headers ?? {}
		}
	});
	if (!response.ok) throw new Error(`${response.status} ${url}`);
	const buffer = await response.arrayBuffer();
	const utf8 = new TextDecoder("utf-8").decode(buffer);
	if (utf8.includes("�") || /charset=euc-kr/i.test(utf8.slice(0, 400))) try {
		return new TextDecoder("euc-kr").decode(buffer);
	} catch {
		return utf8;
	}
	return utf8;
}
async function mapPool(items, size, task) {
	const out = new Array(items.length);
	let cursor = 0;
	async function worker() {
		while (cursor < items.length) {
			const index = cursor;
			cursor += 1;
			out[index] = await task(items[index]);
		}
	}
	await Promise.all(Array.from({ length: Math.min(size, items.length) }, () => worker()));
	return out;
}
//#endregion
export { isOngoing as a, seoulToday as c, visibleMarkup as d, ymd as f, isEntryCopy as i, splitRules as l, fetchText as n, mapPool as o, getSql as r, parseRange as s, dbSource as t, stripTags as u };
