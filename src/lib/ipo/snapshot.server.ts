import { getSql } from "@/lib/db";
import { fetchText, seoulToday } from "../events/html.ts";
import { IPO38_URL, parse38Ipos } from "./comm38-source.ts";
import { KIND_IPO_URL, parseKindIpos } from "./kind-source.ts";
import { SONNIM_SCHEDULE_URL, parseSonnimIpos } from "./sonnim-source.ts";
import { mergeIpoSources } from "./merge-sources.ts";
import type { IpoBoard, IpoItem } from "./types.ts";

let memo: { value: IpoBoard; expires: number } | null = null;
let inflight: Promise<IpoBoard> | null = null;

function currentBoard(board: IpoBoard): IpoBoard {
  const age = Date.now() - Date.parse(board.collectedAt);
  const stale = !Number.isFinite(age) || age > 24 * 60 * 60 * 1000;
  return {
    ...board,
    today: seoulToday(),
    message: (stale ? "최종 검증이 24시간 넘었습니다. 최신 공시를 확인하세요. · " : "") +
      board.message,
  };
}

/** One small DB read; no external site is contacted by the IPO tab. */
export async function readIpoSnapshot(): Promise<IpoBoard | null> {
  if (memo && memo.expires > Date.now()) return currentBoard(memo.value);
  const sql = await getSql();
  const rows = await sql<{ board_json: string; collected_at: string }>`
    select board_json, collected_at::text as collected_at
    from ipo_board_snapshot where id = 1
  `;
  if (!rows[0]) return null;
  try {
    const raw = typeof rows[0].board_json === "string"
      ? JSON.parse(rows[0].board_json) as IpoBoard : rows[0].board_json as IpoBoard;
    if (!raw || !Array.isArray(raw.items) || raw.status !== "ok") return null;
    const board = { ...raw, collectedAt: rows[0].collected_at };
    memo = { value: board, expires: Date.now() + 20_000 };
    return currentBoard(board);
  } catch { return null; }
}

function cutoffDay(today: string): string {
  return new Date(Date.parse(today + "T00:00:00+09:00") - 21 * 86_400_000)
    .toISOString().slice(0, 10);
}

async function collect(): Promise<IpoBoard> {
  const today = seoulToday();
  // These downloads run ONLY in the dedicated IPO cron / explicit refresh.
  // Timeouts prevent a blocked external site from blocking the worker forever.
  const sources = [
    { name: "KRX KIND", url: KIND_IPO_URL, ms: 4800, parse: (s: string) => parseKindIpos(s) },
    { name: "공모주로그", url: SONNIM_SCHEDULE_URL, ms: 5000,
      parse: (s: string) => parseSonnimIpos(s, today) },
    { name: "38커뮤니케이션", url: IPO38_URL, ms: 5500, parse: (s: string) => parse38Ipos(s) },
  ];
  const responses = await Promise.allSettled(sources.map(async source =>
    source.parse(await fetchText(source.url, {}, source.ms)),
  ));
  const lists = responses.map(result =>
    result.status === "fulfilled" ? result.value as IpoItem[] : []);
  const merged = mergeIpoSources(lists[0], lists[1], lists[2])
    .filter(item => item.subscriptionEnd >= cutoffDay(today));
  if (!merged.length) {
    throw new Error("공모주 수집 실패: 정상 판독된 일정이 없습니다. 이전 저장자료를 유지합니다.");
  }
  const report = sources.map((source, i) =>
    source.name + " " + (responses[i].status === "fulfilled" ?
      lists[i].length + "건" : "접속 실패")).join(" · ");
  const officialCount = merged.filter(item =>
    item.sourceStatus !== "reference").length;
  return {
    today, collectedAt: new Date().toISOString(), status: "ok",
    sourceUrl: KIND_IPO_URL,
    message: "저장된 공모주 " + merged.length + "건 · 공식 자료 포함 " + officialCount +
      "건 · " + report + ". 보조 자료 값은 청약 전 공식 공고를 확인하세요.",
    items: merged,
  };
}

/** Collector does not mutate the finance homepage's own state or collector. */
export async function refreshIpoSnapshot(): Promise<IpoBoard> {
  if (inflight) return inflight;
  inflight = (async () => {
    const next = await collect();
    const previous = await readIpoSnapshot();
    // Protect the last good board from sudden parser breakage. Historic rows
    // naturally expire; compare only current and future offerings.
    const currentActive = previous?.items.filter(x => x.subscriptionEnd >= next.today).length ?? 0;
    const nextActive = next.items.filter(x => x.subscriptionEnd >= next.today).length;
    if (currentActive >= 5 && nextActive < Math.ceil(currentActive * 0.35)) {
      throw new Error("공모주 자료가 갑자기 감소했습니다. 기존 검증자료를 보존했습니다.");
    }
    const sql = await getSql();
    await sql`
      insert into ipo_board_snapshot (id, collected_at, board_json)
      values (1, ${next.collectedAt}, ${JSON.stringify(next)})
      on conflict (id) do update set
        collected_at = excluded.collected_at,
        board_json = excluded.board_json
    `;
    memo = { value: next, expires: Date.now() + 20_000 };
    return currentBoard(next);
  })();
  try { return await inflight; }
  finally { inflight = null; }
}
