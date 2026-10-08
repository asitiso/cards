import { fetchText, isOngoing, mapPool, stripTags, visibleMarkup } from "./html.ts";
import { ISSUERS, issuerMeta, type EntryEvent, type IssuerId } from "./types.ts";
import type { CollectHit } from "./http-collect.ts";

const ENTRY = /응모|쿠폰|추첨|이벤트\s*신청|신청\s*필수|신청하기|참여\s*신청/;

function eventOf(
  issuer: IssuerId,
  externalId: string,
  title: string,
  summary: string,
  startDate: string,
  endDate: string,
  applyUrl: string,
): EntryEvent {
  const line = summary || "회사 화면에서 응모·쿠폰·추첨 조건을 확인하세요.";
  return {
    id: `${issuer}:${externalId}`,
    issuer,
    title,
    summary: line,
    benefit: "응모·쿠폰·추첨",
    conditions: [line],
    exclusions: [],
    startDate,
    endDate,
    applyUrl,
    listUrl: issuerMeta(issuer).listUrl,
  };
}

function dateRange(value: string): { start: string; end: string } | null {
  const nums: string[] = [];
  for (const match of value.matchAll(/(\d{4})\s*(?:년|[.\-/])\s*(\d{1,2})\s*(?:월|[.\-/])\s*(\d{1,2})/g)) {
    const month = Number(match[2]);
    const day = Number(match[3]);
    if (month < 1 || month > 12 || day < 1 || day > 31) continue;
    nums.push(`${match[1]}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  }
  if (nums.length < 2) return null;
  return { start: nums[0], end: nums[1] };
}

function periodRange(text: string): { start: string; end: string } | null {
  const spot = text.match(/(?:이벤트\s*)?기간\s*[:：]?\s*([\s\S]{0,90})/);
  if (!spot) return null;
  return dateRange(spot[1]);
}

function pageText(html: string): string {
  return stripTags(visibleMarkup(html)).replace(/응모한 이벤트/g, "");
}

function isEntry(text: string): boolean {
  return ENTRY.test(text.replace(/\s+/g, " "));
}

function tidy(value: string): string {
  return stripTags(value)
    .replace(/&bull;|&middot;/gi, "·")
    .replace(/\s+/g, " ")
    .trim();
}

function clue(text: string, title: string, blurb = ""): string {
  const nice = tidy(blurb);
  if (nice.length >= 12 && nice.length <= 140 && nice !== title && !/바로가기|메뉴/.test(nice)) return nice;
  const line = text
    .split("\n")
    .map((item) => item.replace(/&bull;/gi, "·").replace(/\s+/g, " ").trim())
    .find(
      (item) =>
        item.length >= 16 &&
        item.length <= 120 &&
        ENTRY.test(item) &&
        !/바로가기|메뉴|닫기|로그인|copyright/i.test(item),
    );
  return line ?? title;
}

async function keepIfEntry(
  issuer: IssuerId,
  externalId: string,
  title: string,
  blurb: string,
  start: string,
  end: string,
  applyUrl: string,
): Promise<EntryEvent | null> {
  const preview = `${title} ${blurb}`;
  if (isEntry(preview)) return eventOf(issuer, externalId, title, clue(preview, title, blurb), start, end, applyUrl);
  try {
    const text = pageText(await fetchText(applyUrl, { headers: { Referer: issuerMeta(issuer).listUrl } }, 8000));
    if (!isEntry(text)) return null;
    return eventOf(issuer, externalId, title, clue(text, title, blurb), start, end, applyUrl);
  } catch {
    return null;
  }
}

async function collectMirae(today: string): Promise<CollectHit> {
  const issuer = "mirae" as const;
  const listUrl = issuerMeta(issuer).listUrl;
  try {
    const pages = await Promise.all(
      [1, 2].map((page) => fetchText(`${listUrl}?currentPage=${page}`, {}, 8000).catch(() => "")),
    );
    const seen = new Set<string>();
    const rows: { id: string; title: string; start: string; end: string }[] = [];
    for (const html of pages) {
      for (const match of html.matchAll(
        /doView\('(\d+)'[\s\S]{0,900}?class="evTit">([^<]+)<\/dd>[\s\S]{0,240}?class="evDate">([^<]+)<\/dd>/g,
      )) {
        const id = match[1];
        if (seen.has(id)) continue;
        const title = stripTags(match[2]).replace(/\s+/g, " ").trim();
        const range = dateRange(match[3]);
        if (!range || title.length < 4 || !isOngoing(range.end, today) || range.start > today) continue;
        seen.add(id);
        rows.push({ id, title, start: range.start, end: range.end });
      }
    }
    const events = (
      await mapPool(rows, 4, (row) =>
        keepIfEntry(
          issuer,
          row.id,
          row.title,
          row.title,
          row.start,
          row.end,
          `https://securities.miraeasset.com/hki/hki7000/v05.do?cs_ecis_id=${row.id}`,
        ),
      )
    ).filter((event): event is EntryEvent => event !== null);
    return {
      issuer,
      ok: true,
      message: events.length
        ? `진행 목록에서 응모·쿠폰·추첨 ${events.length}건을 읽었습니다.`
        : `진행 목록 ${rows.length}건을 읽었지만 응모·쿠폰·추첨은 없습니다.`,
      events,
    };
  } catch (error) {
    return {
      issuer,
      ok: false,
      message: `미래에셋증권 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
      events: [],
    };
  }
}

async function collectSamsungSec(today: string): Promise<CollectHit> {
  const issuer = "samsungsec" as const;
  const listUrl = issuerMeta(issuer).listUrl;
  try {
    const raw = await fetchText(
      "https://www.samsungpop.com/mbw/customer/noticeEvent.do",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Requested-With": "XMLHttpRequest",
          Referer: listUrl,
        },
        body: "cmd=getEventList&currentPage=1&rowsPerPage=30&listRow=30&ntcSect=3&EtcConts4=Y&todayEnd=0",
      },
      8000,
    );
    const parsed = JSON.parse(raw) as {
      list?: { ntcTitle1?: string; EtcConts5?: string; period?: string; menuSeqNo?: string }[];
    };
    const rows = (parsed.list ?? [])
      .map((item) => {
        const range = dateRange(item.period ?? "");
        const title = (item.ntcTitle1 ?? "").replace(/\s+/g, " ").trim();
        if (!item.menuSeqNo || !range || title.length < 4) return null;
        if (!isOngoing(range.end, today) || range.start > today) return null;
        return { id: item.menuSeqNo, title, blurb: item.EtcConts5 ?? "", start: range.start, end: range.end };
      })
      .filter((row): row is NonNullable<typeof row> => row !== null);
    const events = (
      await mapPool(rows, 4, (row) =>
        keepIfEntry(
          issuer,
          row.id,
          row.title,
          row.blurb,
          row.start,
          row.end,
          `https://www.samsungpop.com/mbw/customer/noticeEvent.do?cmd=eventView&MenuSeqNo=${row.id}`,
        ),
      )
    ).filter((event): event is EntryEvent => event !== null);
    return {
      issuer,
      ok: true,
      message: events.length
        ? `진행 ${rows.length}건 중 응모·쿠폰·추첨 ${events.length}건입니다.`
        : `진행 ${rows.length}건을 읽었지만 응모·쿠폰·추첨은 없습니다.`,
      events,
    };
  } catch (error) {
    return {
      issuer,
      ok: false,
      message: `삼성증권 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
      events: [],
    };
  }
}

async function collectHanaSec(today: string): Promise<CollectHit> {
  const issuer = "hanasec" as const;
  const listUrl = issuerMeta(issuer).listUrl;
  try {
    const html = await fetchText(listUrl, {}, 8000);
    const rows = [...html.matchAll(/bbsSeq=(\d+)[\s\S]{0,360}?class="title">([^<]+)<\/span>[\s\S]{0,240}?class="date">\s*([^<]+)/g)]
      .map((match) => {
        const title = stripTags(match[2]).replace(/\s+/g, " ").trim();
        const range = dateRange(match[3]);
        if (!range || title.length < 4 || !isOngoing(range.end, today) || range.start > today) return null;
        return { id: match[1], title, start: range.start, end: range.end };
      })
      .filter((row): row is NonNullable<typeof row> => row !== null);
    const unique = [...new Map(rows.map((row) => [row.id, row])).values()];
    const events = (
      await mapPool(unique, 4, (row) =>
        keepIfEntry(
          issuer,
          row.id,
          row.title,
          row.title,
          row.start,
          row.end,
          `https://www.hanaw.com/corebbs5/eventIng/view/view.cmd?bbsSeq=${row.id}`,
        ),
      )
    ).filter((event): event is EntryEvent => event !== null);
    return {
      issuer,
      ok: true,
      message: events.length
        ? `진행 ${unique.length}건 중 응모·쿠폰·추첨 ${events.length}건입니다.`
        : `진행 ${unique.length}건을 읽었지만 응모·쿠폰·추첨은 없습니다.`,
      events,
    };
  } catch (error) {
    return {
      issuer,
      ok: false,
      message: `하나증권 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
      events: [],
    };
  }
}

async function collectKbSec(today: string): Promise<CollectHit> {
  const issuer = "kbsec" as const;
  try {
    const raw = await fetchText("https://www.kbsec.com/main/jsp/main_board.jsp?bdgubun=2", {}, 8000);
    const parsed = JSON.parse(raw) as { list?: { date?: string; url?: string; title?: string }[] };
    const rows = (parsed.list ?? [])
      .map((item) => {
        const title = (item.title ?? "").replace(/\s+/g, " ").trim();
        const start = dateRange(`${item.date ?? ""} ~ ${item.date ?? ""}`)?.start;
        if (!item.url || !start || title.length < 4 || start > today) return null;
        return {
          id: item.url,
          title,
          start,
          applyUrl: new URL(item.url, "https://www.kbsec.com").href,
        };
      })
      .filter((row): row is NonNullable<typeof row> => row !== null)
      .slice(0, 12);
    const events = (
      await mapPool(rows, 4, async (row) => {
        try {
          const text = pageText(await fetchText(row.applyUrl, {}, 8000));
          const range = periodRange(text);
          if (!isEntry(text) || !range || !isOngoing(range.end, today) || range.start > today) return null;
          return eventOf(issuer, row.id, row.title, clue(text, row.title), range.start, range.end, row.applyUrl);
        } catch {
          return null;
        }
      })
    ).filter((event): event is EntryEvent => event !== null);
    return {
      issuer,
      ok: true,
      message: events.length
        ? `최근 글에서 기간이 확인된 응모·쿠폰·추첨 ${events.length}건입니다.`
        : "목록은 열렸지만 기간이 적힌 응모·쿠폰·추첨은 없습니다. 안내가 이미지인 글은 뺐습니다.",
      events,
    };
  } catch (error) {
    return {
      issuer,
      ok: false,
      message: `KB증권 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
      events: [],
    };
  }
}

async function collectIbkBank(today: string): Promise<CollectHit> {
  const issuer = "ibkbank" as const;
  const listUrl = issuerMeta(issuer).listUrl;
  try {
    const html = await fetchText(listUrl, {}, 8000);
    const rows = [
      ...html.matchAll(
        /evnt_srno=(\d+)&evnt_dscd=([A-Z])[\s\S]{0,500}?alt="([^"]*)"[\s\S]{0,1600}?기간<\/span>([\s\S]*?)<\/li>/g,
      ),
    ]
      .map((match) => {
        const title = stripTags(match[3]).replace(/\s+/g, " ").trim();
        const range = dateRange(stripTags(match[4]));
        if (!range || title.length < 4 || /카드/.test(title)) return null;
        if (!isOngoing(range.end, today) || range.start > today) return null;
        return { id: `${match[2]}-${match[1]}`, srno: match[1], code: match[2], title, start: range.start, end: range.end };
      })
      .filter((row): row is NonNullable<typeof row> => row !== null);
    const unique = [...new Map(rows.map((row) => [row.id, row])).values()];
    const events = (
      await mapPool(unique.slice(0, 12), 4, (row) =>
        keepIfEntry(
          issuer,
          row.id,
          row.title,
          row.title,
          row.start,
          row.end,
          `https://www.ibk.co.kr/event/ingDetailEvent.ibk?evnt_srno=${row.srno}&evnt_dscd=${row.code}&pageId=CM01060100`,
        ),
      )
    ).filter((event): event is EntryEvent => event !== null);
    return {
      issuer,
      ok: true,
      message: events.length
        ? `카드가 아닌 행사 ${unique.length}건 중 응모·쿠폰·추첨 ${events.length}건입니다.`
        : `카드가 아닌 행사 ${unique.length}건을 읽었지만 응모·쿠폰·추첨은 없습니다.`,
      events,
    };
  } catch (error) {
    return {
      issuer,
      ok: false,
      message: `IBK 행사 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
      events: [],
    };
  }
}

async function collectWooriBank(today: string): Promise<CollectHit> {
  const issuer = "wooribank" as const;
  const listUrl = issuerMeta(issuer).listUrl;
  try {
    const html = await fetchText(listUrl, {}, 8000);
    const blocks = [...html.matchAll(/<dl class="list-set[\s\S]*?<\/dl>/g)];
    const rows: { id: string; title: string; summary: string; start: string; end: string }[] = [];
    for (const block of blocks) {
      const chunk = block[0];
      const id = chunk.match(/goDetail\('(\d+)'/)?.[1];
      const title = stripTags(chunk.match(/<dt><a[^>]*>([\s\S]*?)<\/a>/)?.[1] ?? "");
      const summary = stripTags(chunk.match(/<dd>([\s\S]*?)<\/dd>/)?.[1] ?? "");
      const range = dateRange(chunk.match(/이벤트기간\s*:\s*([^<]+)/)?.[1] ?? "");
      if (!id || title.length < 4 || !range || !isOngoing(range.end, today)) continue;
      rows.push({ id, title, summary, start: range.start, end: range.end });
    }
    const events = (
      await mapPool(rows, 2, async (row) => {
        const applyUrl = listUrl;
        if (isEntry(`${row.title} ${row.summary}`)) {
          return eventOf(issuer, row.id, row.title, row.summary || row.title, row.start, row.end, applyUrl);
        }
        try {
          const text = pageText(
            await fetchText(
              "https://spot.wooribank.com/pot/Dream?withyou=EVEVT0001&cc=c001308:c001386",
              {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded", Referer: listUrl },
                body: `NO=${row.id}`,
              },
              8000,
            ),
          );
          if (!isEntry(`${row.title} ${row.summary} ${text}`)) return null;
          return eventOf(issuer, row.id, row.title, clue(text, row.summary || row.title), row.start, row.end, applyUrl);
        } catch {
          return null;
        }
      })
    ).filter((event): event is EntryEvent => event !== null);
    return {
      issuer,
      ok: true,
      message: events.length
        ? `진행 ${blocks.length}건 중 응모·쿠폰·추첨 ${events.length}건입니다.`
        : `진행 ${blocks.length}건을 읽었지만 본문에 응모·쿠폰·추첨이 없습니다.`,
      events,
    };
  } catch (error) {
    return {
      issuer,
      ok: false,
      message: `우리은행 이벤트 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
      events: [],
    };
  }
}

function genericEvents(issuer: IssuerId, html: string, today: string): EntryEvent[] {
  const listUrl = issuerMeta(issuer).listUrl;
  const visible = visibleMarkup(html);
  const events: EntryEvent[] = [];
  const seen = new Set<string>();
  for (const match of visible.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = match[1];
    if (/javascript:|^#|로그인|메뉴/.test(href)) continue;
    const text = stripTags(match[2]).replace(/\s+/g, " ").trim();
    if (text.length < 8 || text.length > 80 || !ENTRY.test(text)) continue;
    let applyUrl: string;
    try {
      applyUrl = new URL(href, listUrl).href;
    } catch {
      continue;
    }
    if (seen.has(applyUrl)) continue;
    const around = visible.slice(match.index ?? 0, (match.index ?? 0) + 500);
    const range = dateRange(stripTags(around));
    if (!range || !isOngoing(range.end, today)) continue;
    seen.add(applyUrl);
    events.push(eventOf(issuer, String(seen.size), text, text, range.start, range.end, applyUrl));
    if (events.length >= 12) break;
  }
  return events;
}

async function collectGeneric(issuer: IssuerId, today: string): Promise<CollectHit> {
  const meta = issuerMeta(issuer);
  try {
    const html = await fetchText(meta.listUrl, {}, 8000);
    const title = stripTags(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
    if (/요청 오류|이용불가|오류페이지|접근.?거부|not found/i.test(title)) {
      return {
        issuer,
        ok: false,
        message: `${meta.name} 목록이 막혀 있습니다. 앱이나 웹에서 확인하세요.`,
        events: [],
      };
    }
    const events = genericEvents(issuer, html, today);
    return {
      issuer,
      ok: true,
      message: events.length
        ? `${meta.name}에서 응모·쿠폰·추첨 ${events.length}건을 읽었습니다.`
        : `${meta.name} 화면에는 날짜가 있는 응모·쿠폰·추첨이 없습니다. 앱에서 확인하세요.`,
      events,
    };
  } catch (error) {
    return {
      issuer,
      ok: false,
      message: `${meta.name} 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
      events: [],
    };
  }
}

const SPECIAL: Partial<Record<IssuerId, (today: string) => Promise<CollectHit>>> = {
  mirae: collectMirae,
  samsungsec: collectSamsungSec,
  hanasec: collectHanaSec,
  kbsec: collectKbSec,
  wooribank: collectWooriBank,
  ibkbank: collectIbkBank,
};

export async function collectMarkets(today: string): Promise<CollectHit[]> {
  const targets = ISSUERS.filter((item) => item.market !== "card");
  return mapPool(targets, 4, (item) => {
    const run = SPECIAL[item.id];
    return run ? run(today) : collectGeneric(item.id, today);
  });
}
