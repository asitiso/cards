import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const vercel = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
const cronRoute = readFileSync(
  new URL("../src/routes/api/cron/collect-evening.ts", import.meta.url), "utf8",
);
const cardSource = readFileSync(
  new URL("../src/lib/events/http-collect.ts", import.meta.url), "utf8",
);
const brokerSource = readFileSync(
  new URL("../src/lib/events/market-collect.ts", import.meta.url), "utf8",
);
const home = readFileSync(new URL("../src/routes/index.tsx", import.meta.url), "utf8");

test("finance collection is scheduled at exactly 08:00 and 20:00 KST daily", () => {
  const financeCrons = vercel.crons.filter((job) =>
    job.path === "/api/cron/collect" || job.path === "/api/cron/collect-evening");
  assert.deepEqual(financeCrons, [
    { path: "/api/cron/collect", schedule: "0 23 * * *" },
    { path: "/api/cron/collect-evening", schedule: "0 11 * * *" },
  ]);
  // IPO collection runs independently; it must never extend homepage collection.
  const ipoCrons = vercel.crons.filter((job) => job.path.includes("collect-ipo-"));
  assert.deepEqual(ipoCrons, [
    { path: "/api/cron/collect-ipo-morning", schedule: "0 23 * * *" },
    { path: "/api/cron/collect-ipo-evening", schedule: "0 11 * * *" },
  ]);
  assert.match(cronRoute, /refreshBoard\(\)/);
  assert.match(cronRoute, /process\.env\.CRON_SECRET/);
  assert.match(cronRoute, /authorization/);
  assert.doesNotMatch(cronRoute, /refreshPharma\(/);
});

test("official card and brokerage sources cover more than the original few pages", () => {
  assert.match(cardSource, /\.slice\(0, 64\)/);
  assert.match(cardSource, /\[0, 1, 2, 3, 4\]/);
  assert.match(cardSource, /\[1, 2, 3, 4, 5\]/);
  assert.match(brokerSource, /\[1, 2, 3, 4, 5, 6\]/);
  assert.match(brokerSource, /rowsPerPage=30&listRow=30/);
  assert.match(brokerSource, /new Map<string,/);
});

test("today and passive view buttons are understated while application stays prominent", () => {
  assert.match(home, /bg-accent\/15/);
  assert.match(home, /event\.entry === false \? "border border-line bg-card text-muted"/);
  assert.match(home, /"bg-accent text-accent-ink"/);
});
