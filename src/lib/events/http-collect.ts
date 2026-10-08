import {
  fetchText,
  isEntryCopy,
  isOngoing,
  mapPool,
  parseRange,
  seoulToday,
  splitRules,
  stripTags,
  visibleMarkup,
  ymd,
} from "./html.ts";
import { issuerMeta, type EntryEvent, type IssuerId } from "./types.ts";

export type CollectHit = {
  issuer: IssuerId;
  ok: boolean;
  message: string;
  events: EntryEvent[];
};

const SHINHAN_LIST =
  "https://www.shinhancard.com/mob/static/json/vendor/evnPgsList01.json";
const HYUNDAI_LIST = "https://www.hyundaicard.com/cpb/ev/CPBEV0101_01.hc";
const KB_LIST = "https://card.kbcard.com/BON/DVIEW/HBBMCXCRVNEC0001";

function cleanSummary(title: string, summary: string, conditions: string[]): string {
  const cleaned = summary.replace(/\s+/g, " ").trim();
  const usable =
    cleaned.length >= 12 &&
    !cleaned.includes("evt-visual") &&
    !cleaned.startsWith("//") &&
    cleaned !== title;
  if (usable) return cleaned.slice(0, 180);
  const line = conditions.find((item) => item.length > 18);
  return (line || title).replace(/\s+/g, " ").trim().slice(0, 180);
}
  function eventBase(
  issuer: IssuerId,
  externalId: string,
  fields: Omit<EntryEvent, "id" | "issuer" | "listUrl">,
): EntryEvent {
  return {
    id: `${issuer}:${externalId}`,
    issuer,
    listUrl: issuerMeta(issuer).listUrl,
    ...fields,
  };
}

type ShinhanItem = {
  mobWbEvtRvN: string;
  mobWbEvtNm: string;
  hpgEvtDlPgeUrlAr: string;
  hpgEvtSmrTt?: string;
  evtImgSlTilNm?: string;
  mobWbEvtStd: string;
  mobWbEvtEdd: string;
};

async function collectShinhan(today: string): Promise<CollectHit> {
  const issuer = "shinhan" as const;
  try {
    const raw = await fetchText(SHINHAN_LIST);
    const items = (JSON.parse(raw) as { root: { evnlist: ShinhanItem[] } }).root.evnlist;
    const open = items
      .map((item) => ({
        item,
        start: ymd(item.mobWbEvtStd),
        end: ymd(item.mobWbEvtEdd),
      }))
      .filter((row) => isOngoing(row.end, today) && row.start <= today)
      .sort((a, b) => a.end.localeCompare(b.end))
      .slice(0, 28);

    const events = (
      await mapPool(open, 5, async (row) => {
        const applyUrl = new URL(row.item.hpgEvtDlPgeUrlAr, "https://www.shinhancard.com").href;
        try {
          const html = await fetchText(applyUrl);
          if (!html.includes("응모하기")) return null;
          const summaryRaw = stripTags(
            html.match(/class="evt-visual__summary"\s*>([\s\S]*?)<\/div>/)?.[1] ?? "",
          );
          const detailStart = html.indexOf("evt-detail");
          const detail = stripTags(html.slice(detailStart, detailStart + 14000));
          if (!isEntryCopy(`${summaryRaw}\n${detail}\n응모하기`)) return null;
          const rules = splitRules(detail);
          const summary = cleanSummary(row.item.mobWbEvtNm, summaryRaw, rules.conditions);
          return eventBase(issuer, row.item.mobWbEvtRvN, {
            title: row.item.mobWbEvtNm.replace(/\s+/g, " ").trim(),
            summary,
            benefit: (row.item.evtImgSlTilNm || summary).replace(/\s+/g, " ").trim().slice(0, 80),
            conditions: rules.conditions,
            exclusions: rules.exclusions,
            startDate: row.start,
            endDate: row.end,
            applyUrl,
          });
        } catch {
          return null;
        }
      })
    ).filter((event): event is EntryEvent => event !== null);

    return {
      issuer,
      ok: true,
      message: events.length
        ? `진행 중 목록 ${open.length}건을 읽고 응모 ${events.length}건만 남겼습니다.`
        : "목록은 열렸지만 응모 버튼을 가진 진행 이벤트가 없습니다.",
      events,
    };
  } catch (error) {
    return {
      issuer,
      ok: false,
      message: `신한카드 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
      events: [],
    };
  }
}

async function collectHyundai(today: string): Promise<CollectHit> {
  const issuer = "hyundai" as const;
  try {
    const html = await fetchText(HYUNDAI_LIST);
    const cards = [
      ...html.matchAll(
        /href="(\/cpb\/ev\/CPBEV0101_06\.hc\?bnftWebEvntCd=[^"]+)"[\s\S]*?txt_title">([\s\S]*?)<\/span>[\s\S]*?txt_date">([\s\S]*?)<\/span>/g,
      ),
    ]
      .map((match) => {
        const range = parseRange(stripTags(match[3]));
        if (!range || !isOngoing(range.end, today)) return null;
        const code = match[1].match(/bnftWebEvntCd=([^&]+)/)?.[1] ?? "";
        return {
          code,
          title: stripTags(match[2]).replace(/\s+/g, " "),
          range,
          applyUrl: new URL(match[1], "https://www.hyundaicard.com").href,
        };
      })
      .filter((row): row is NonNullable<typeof row> => row !== null)
      .slice(0, 18);

    const events = (
      await mapPool(cards, 4, async (card) => {
        try {
          const page = await fetchText(card.applyUrl);
          const start = page.indexOf('class="event_content"');
          const chunk = visibleMarkup(start >= 0 ? page.slice(start, start + 9000) : "");
          const text = stripTags(chunk);
          if (!isEntryCopy(text)) return null;
          const rules = splitRules(text);
          const summary = cleanSummary(card.title, text.split("\n").find((line) => line.length > 12) ?? "", rules.conditions);
          return eventBase(issuer, card.code, {
            title: card.title,
            summary,
            benefit: summary.slice(0, 80),
            conditions: rules.conditions.length ? rules.conditions : [summary],
            exclusions: rules.exclusions,
            startDate: card.range.start,
            endDate: card.range.end,
            applyUrl: card.applyUrl,
          });
        } catch {
          return null;
        }
      })
    ).filter((event): event is EntryEvent => event !== null);

    return {
      issuer,
      ok: true,
      message: events.length
        ? `이벤트 ${cards.length}건 중 응모 ${events.length}건입니다.`
        : "목록은 열렸지만 응모가 필요한 건이 없습니다. 무이자·자동 할인은 뺐습니다.",
      events,
    };
  } catch (error) {
    return {
      issuer,
      ok: false,
      message: `현대카드 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
      events: [],
    };
  }
}

async function collectKb(today: string): Promise<CollectHit> {
  const issuer = "kb" as const;
  try {
    const html = await fetchText(KB_LIST);
    const cards = [
      ...html.matchAll(
        /goDetail\('(\d+)',\s*''\s*,\s*'1'\);[\s\S]*?subject">([\s\S]*?)<\/span>[\s\S]*?date">([\s\S]*?)<\/span>/g,
      ),
    ]
      .map((match) => {
        const range = parseRange(stripTags(match[3]));
        if (!range || !isOngoing(range.end, today)) return null;
        return {
          id: match[1],
          title: stripTags(match[2]).replace(/\s+/g, " "),
          range,
        };
      })
      .filter((row): row is NonNullable<typeof row> => row !== null);

    const unique = [...new Map(cards.map((card) => [card.id, card])).values()];

    const events = (
      await mapPool(unique, 4, async (card) => {
        const applyUrl = `https://card.kbcard.com/BON/DVIEW/HBBMCXCRVNEC0001?mainCC=a&eventNum=${card.id}`;
        try {
          const page = await fetchText(applyUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Referer: KB_LIST,
            },
            body: `이벤트일련번호=${card.id}&가맹점분류코드=&대고객게시여부=1`,
          });
          const visible = visibleMarkup(page);
          const start = visible.indexOf("eventViewWrap");
          const text = stripTags(visible.slice(start >= 0 ? start : 0, (start >= 0 ? start : 0) + 7000));
          if (!/응모하고|응모하기|응모\s*필수|응모\s*후/.test(text)) return null;
          if (/무이자/.test(card.title) && !/응모하고|응모하기/.test(text)) return null;
          const rules = splitRules(text);
          const summary = cleanSummary(card.title, "", rules.conditions);
          return eventBase(issuer, card.id, {
            title: card.title,
            summary,
            benefit: summary.slice(0, 80),
            conditions: rules.conditions,
            exclusions: rules.exclusions,
            startDate: card.range.start,
            endDate: card.range.end,
            applyUrl,
          });
        } catch {
          return null;
        }
      })
    ).filter((event): event is EntryEvent => event !== null);

    return {
      issuer,
      ok: true,
      message: events.length
        ? `진행 이벤트 ${unique.length}건 중 응모 ${events.length}건입니다.`
        : "목록은 열렸지만 본문에 응모 조건이 있는 건이 없습니다.",
      events,
    };
  } catch (error) {
    return {
      issuer,
      ok: false,
      message: `KB국민카드 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
      events: [],
    };
  }
}

function addDays(day: string, days: number): string {
  const [year, month, date] = day.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, date + days));
  return next.toISOString().slice(0, 10);
}

function dotted(value: string): string {
  const match = value.match(/(\d{4})\s*\.\s*(\d{1,2})\s*\.\s*(\d{1,2})/);
  if (!match) return "";
  return `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
}

function compactDay(value: string): string {
  const match = value.match(/(\d{4})(\d{2})(\d{2})/);
  if (!match) return "";
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function rankSoon<T extends { end: string; title: string }>(rows: T[], today: string, limit: number): T[] {
  const horizon = addDays(today, 50);
  return rows
    .filter((row) => row.end >= today)
    .map((row) => {
      const hot = /응모|캐시백|경품|적립|쿠폰|머니|상품권|태그/.test(row.title);
      const soon = row.end <= horizon;
      return { row, score: (hot ? 2 : 0) + (soon ? 1 : 0) };
    })
    .sort((a, b) => b.score - a.score || a.row.end.localeCompare(b.row.end))
    .slice(0, limit)
    .map((item) => item.row);
}

function rulesOr(title: string, text: string, fallback: string) {
  const rules = splitRules(text);
  return {
    summary: cleanSummary(title, text.split("\n").find((line) => line.length > 16) ?? "", rules.conditions),
    conditions: rules.conditions.length ? rules.conditions : [fallback],
    exclusions: rules.exclusions,
  };
}

async function samsungService(service: string, data: Record<string, unknown>, referer: string): Promise<unknown> {
  const now = new Date();
  const pad = (value: number, size: number) => String(value).padStart(size, "0");
  const serial = `${pad(now.getHours(), 2)}${pad(now.getMinutes(), 2)}${pad(now.getSeconds(), 2)}${pad(now.getMilliseconds(), 3)}${pad(Math.floor(Math.random() * 90000) + 10000, 5)}`;
  const raw = await fetchText(`https://www.samsungcard.com/frontservice/${service}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Origin: "https://www.samsungcard.com",
      Referer: referer,
    },
    body: JSON.stringify({
      ...data,
      common: {
        scrnId: service === "SHPPBE1401S02" ? "UHPPBE1401M0" : "UHPPBE1403M0",
        stdEtxtCrtSysNm: "P0000000",
        stdEtxtSn: serial,
        stdEtxtPrgDvNo: 0,
        stdEtxtPrgNo: 0,
        usid: "USERID0",
      },
    }),
  }, 15000);
  return JSON.parse(raw);
}

async function collectSamsung(today: string): Promise<CollectHit> {
  const issuer = "samsung" as const;
  const referer = "https://www.samsungcard.com/personal/event/ing/UHPPBE1401M0.jsp";
  try {
    const pages = await mapPool([0, 1, 2], 3, async (pageNo) => {
      const data = (await samsungService(
        "SHPPBE1401S02",
        { cmpId: "M171028654", query: "", cmpCtgId: "100", pgeNo: pageNo, enddtAdvtYn: 0, onGoing: "1" },
        referer,
      )) as { listPeiHPPPrgEvnInqrDVO?: SamsungListItem[] };
      return data.listPeiHPPPrgEvnInqrDVO ?? [];
    });
    const seen = new Map<string, { cmsId: string; cmpId: string; title: string; start: string; end: string }>();
    for (const item of pages.flat()) {
      const end = compactDay(item.cmsCmpEnddt || "");
      const start = compactDay(item.cmsCmpStrtdt || item.cmpStrtdt || "");
      const title = (item.cmpTitNm || "").replace(/\s+/g, " ").trim();
      if (!item.cmsId || !end || !title || start > today) continue;
      seen.set(String(item.cmsId), { cmsId: String(item.cmsId), cmpId: item.cmpId || "", title, start, end });
    }
    const chosen = rankSoon([...seen.values()], today, 18);
    const events = (
      await mapPool(chosen, 5, async (card) => {
        try {
          const detail = (await samsungService(
            "SHPPBE1403S00",
            { cmsId: card.cmsId, cmpId: card.cmpId, chnlExpsrTeryId: "HPP_UHPPBE1403M0_001" },
            `https://www.samsungcard.com/personal/event/ing/UHPPBE1403M0.jsp?cms_id=${card.cmsId}`,
          )) as { hPPPrgEvnDtlInqrDVO?: { cmpDtlCnUrl?: string; cmpSimpEntrYn?: string; cmpTitNm?: string } };
          const vo = detail.hPPPrgEvnDtlInqrDVO;
          const path = (vo?.cmpDtlCnUrl || "").trim();
          if (!path.startsWith("/")) return null;
          const html = await fetchText(new URL(path, "https://static11.samsungcard.com").href, {
            headers: { Referer: referer },
          });
          const text = stripTags(visibleMarkup(html));
          const simple = vo?.cmpSimpEntrYn === "Y";
          if (!simple && !isEntryCopy(text)) return null;
          const packed = rulesOr(card.title, text, "삼성카드 이벤트 페이지에서 응모 버튼으로 신청합니다.");
          return eventBase(issuer, card.cmsId, {
            title: (vo?.cmpTitNm || card.title).replace(/\s+/g, " ").trim(),
            summary: packed.summary,
            benefit: packed.summary.slice(0, 80),
            conditions: packed.conditions,
            exclusions: packed.exclusions,
            startDate: card.start || today,
            endDate: card.end,
            applyUrl: `https://www.samsungcard.com/personal/event/ing/UHPPBE1403M0.jsp?cms_id=${card.cmsId}`,
          });
        } catch {
          return null;
        }
      })
    ).filter((event): event is EntryEvent => event !== null);
    return {
      issuer,
      ok: true,
      message: events.length
        ? `진행 목록에서 마감이 가까운 ${chosen.length}건을 읽고 응모 ${events.length}건만 남겼습니다.`
        : "목록은 열렸지만 응모가 필요한 건이 없습니다.",
      events,
    };
  } catch (error) {
    return {
      issuer,
      ok: false,
      message: `삼성카드 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
      events: [],
    };
  }
}

type SamsungListItem = {
  cmsId?: string | number;
  cmpId?: string;
  cmpTitNm?: string;
  cmsCmpStrtdt?: string;
  cmsCmpEnddt?: string;
  cmpStrtdt?: string;
};

async function collectLotte(today: string): Promise<CollectHit> {
  const issuer = "lotte" as const;
  const listUrl = "https://www.lottecard.co.kr/app/LPBNFDA_V100.lc";
  try {
    const pages = await mapPool([1, 2, 3], 3, async (pageNo) => {
      const raw = await fetchText("https://www.lottecard.co.kr/app/LPBNFDA_A100.lc", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
          Referer: listUrl,
        },
        body: `pageNo=${pageNo}&bigTabGubun=2&tabGubun=9999&finishYn=N&sort=EVN_BULT_SDT&evnCtgSeq=9999`,
      });
      const data = JSON.parse(raw) as { Content?: string };
      return [...(data.Content ?? "").matchAll(
        /tlfLoad\('\d+','click','(\d+)','[^']*','[^']*','[^']*','([^']*)'\)[\s\S]{0,700}?<b>([\s\S]*?)<\/b>[\s\S]{0,240}?class="date">([\s\S]*?)<\/span>/g,
      )].map((match) => {
        const range = parseRange(stripTags(match[4]));
        if (!range) return null;
        return {
          id: match[1],
          popup: match[2],
          title: stripTags(match[3]).replace(/\s+/g, " "),
          start: range.start,
          end: range.end,
        };
      });
    });
    const unique = [...new Map(pages.flat().filter((row) => row && row.start <= today).map((row) => [row!.id, row!])).values()];
    const chosen = rankSoon(unique, today, 14);
    const events = (
      await mapPool(chosen, 4, async (card) => {
        const applyUrl = `https://www.lottecard.co.kr/app/LPBNFDA_V300.lc?evnBultSeq=${card.id}&evnCtgSeq=9999&bigTabGubun=2`;
        try {
          const page = await fetchText(applyUrl, { headers: { Referer: listUrl } });
          const start = page.indexOf('class="eventDetail"');
          const text = stripTags(visibleMarkup(start >= 0 ? page.slice(start, start + 14000) : ""));
          if (!isEntryCopy(text)) return null;
          const packed = rulesOr(card.title, text, "롯데카드 이벤트 화면에서 응모합니다.");
          return eventBase(issuer, card.id, {
            title: card.title,
            summary: packed.summary,
            benefit: packed.summary.slice(0, 80),
            conditions: packed.conditions,
            exclusions: packed.exclusions,
            startDate: card.start,
            endDate: card.end,
            applyUrl,
          });
        } catch {
          return null;
        }
      })
    ).filter((event): event is EntryEvent => event !== null);
    return {
      issuer,
      ok: true,
      message: events.length
        ? `진행 ${unique.length}건 중 ${chosen.length}건을 확인했고 응모 ${events.length}건입니다.`
        : "목록은 열렸지만 본문에 응모 조건이 있는 건이 없습니다.",
      events,
    };
  } catch (error) {
    return {
      issuer,
      ok: false,
      message: `롯데카드 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
      events: [],
    };
  }
}

async function collectHana(today: string): Promise<CollectHit> {
  const issuer = "hana" as const;
  const listUrl = "https://m.hanacard.co.kr/MKEVT1000M.web";
  try {
    const html = await fetchText(listUrl);
    const cards = [
      ...html.matchAll(
        /detail\('([^']+)','(\d+)'\)[\s\S]{0,900}?usage-default-title[^>]*>([\s\S]*?)<\/div>[\s\S]{0,280}?usage-default-etc-item[^>]*>([\s\S]*?)<\/div>/g,
      ),
    ]
      .map((match) => {
        const range = parseRange(stripTags(match[4]));
        const title = stripTags(match[3]).replace(/\s+/g, " ");
        if (!range || range.start > today) return null;
        if (/무이자/.test(title) && !/응모/.test(title)) return null;
        return { id: match[2], path: match[1], title, start: range.start, end: range.end };
      })
      .filter((row): row is NonNullable<typeof row> => row !== null);
    const unique = [...new Map(cards.map((card) => [card.id, card])).values()];
    const chosen = rankSoon(unique, today, 12);
    const events = (
      await mapPool(chosen, 4, async (card) => {
        const applyUrl = new URL(`${card.path}?EVN_SEQ=${card.id}`, "https://m.hanacard.co.kr").href;
        try {
          const page = await fetchText(applyUrl, { headers: { Referer: listUrl } });
          const sections = [...page.matchAll(/<section class="eVgroup[\s\S]*?<\/section>/g)].map((match) => match[0]).join("\n");
          const text = stripTags(visibleMarkup(sections));
          if (!isEntryCopy(text)) return null;
          const packed = rulesOr(card.title, text, "하나카드 이벤트 화면에서 응모합니다.");
          return eventBase(issuer, card.id, {
            title: card.title,
            summary: packed.summary,
            benefit: packed.summary.slice(0, 80),
            conditions: packed.conditions,
            exclusions: packed.exclusions,
            startDate: card.start,
            endDate: card.end,
            applyUrl,
          });
        } catch {
          return null;
        }
      })
    ).filter((event): event is EntryEvent => event !== null);
    return {
      issuer,
      ok: true,
      message: events.length
        ? `진행 ${unique.length}건 중 ${chosen.length}건을 확인했고 응모 ${events.length}건입니다.`
        : "목록은 열렸지만 응모 안내가 있는 건이 없습니다. 무이자 할부는 뺐습니다.",
      events,
    };
  } catch (error) {
    return {
      issuer,
      ok: false,
      message: `하나카드 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
      events: [],
    };
  }
}

async function collectNh(today: string): Promise<CollectHit> {
  const issuer = "nh" as const;
  try {
    const html = await fetchText("https://card.nonghyup.com/servlet/IpCb2001R.act", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Referer: "https://card.nonghyup.com/servlet/IPCB010501.menu",
      },
      body: "menu_id=IPCB010501&DTL_CNM=04&DTL_CNM_DT=04&indexNum=1&pageNum=1&pageSize=40&ORDER_CONDITION=DEADLINE&SEARCH_TEXT=",
    });
    const cards = [
      ...html.matchAll(
        /goEvtDtail\('(\d+)','[^']*'\)[\s\S]{0,1400}?class="tit">([\s\S]*?)<\/div>[\s\S]{0,400}?class="date">([\s\S]*?)<\/div>/g,
      ),
    ].map((match) => {
      const dateHtml = match[3];
      const start = dotted((dateHtml.match(/<!--\s*(\d{4}\.\d{2}\.\d{2})/) ?? [])[1] ?? "");
      const end = dotted((dateHtml.match(/(\d{4}\.\d{2}\.\d{2})\s*까지/) ?? [])[1] ?? dateHtml);
      const title = stripTags(match[2]).replace(/\s+/g, " ");
      if (!end) return null;
      return { id: match[1], title, start: start || `${end.slice(0, 8)}01`, end };
    }).filter((row): row is NonNullable<typeof row> => row !== null && row.start <= today && row.end >= today);
    const unique = [...new Map(cards.map((card) => [card.id, card])).values()];
    const events = (
      await mapPool(unique.slice(0, 12), 4, async (card) => {
        const applyUrl = `https://card.nonghyup.com/servlet/IpCb2002R.act?EVT_CRT_SQNO=${card.id}`;
        let text = "";
        try {
          const page = await fetchText(applyUrl, {
            headers: { Referer: "https://card.nonghyup.com/servlet/IpCb2001R.act" },
          });
          const start = page.indexOf('id="content"');
          const end = page.indexOf("content_normal_inforbox", start);
          const chunk = start >= 0 ? page.slice(start, end > start ? end : start + 9000) : "";
          const alts = [...chunk.matchAll(/alt="([^"]{6,90})"/g)]
            .map((match) => stripTags(match[1]))
            .filter((alt) => !/썸네일|카드상세|응모하기|이미지 없음|로고/.test(alt));
          text = `${stripTags(visibleMarkup(chunk))}\n${alts.join("\n")}`;
        } catch {
          text = "";
        }
        const packed = rulesOr(
          card.title,
          text,
          "NH농협카드 응모 탭 이벤트입니다. 대상 카드와 제외 조건은 안내 이미지에 있습니다.",
        );
        return eventBase(issuer, card.id, {
          title: card.title,
          summary: packed.summary,
          benefit: packed.summary.slice(0, 80),
          conditions: packed.conditions,
          exclusions: packed.exclusions.length
            ? packed.exclusions
            : ["자세한 제외 업종은 카드사 안내 이미지를 확인하세요."],
          startDate: card.start,
          endDate: card.end,
          applyUrl,
        });
      })
    ).filter((event): event is EntryEvent => event !== null);
    return {
      issuer,
      ok: true,
      message: events.length
        ? `응모 탭에서 진행 ${events.length}건을 가져왔습니다. 조건 일부가 이미지라 카드사 화면을 함께 보세요.`
        : "응모 탭은 열렸지만 오늘 진행 중인 건이 없습니다.",
      events,
    };
  } catch (error) {
    return {
      issuer,
      ok: false,
      message: `NH농협카드 응모 탭을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
      events: [],
    };
  }
}

type PayboocItem = {
  pybcUnifEvntNo?: string;
  pybcUnifEvntTypCd?: string;
  pybcUnifEvntNm1?: string;
  pybcUnifEvntNm2?: string;
  pybcUnifEvntNm3?: string;
  evntBltnStrtDtm?: string;
  evntBltnEndDtm?: string;
  endEvent?: boolean;
};

const PAYBOOC_ENTRY = new Set(["02", "03", "06", "07"]);

async function collectBc(today: string): Promise<CollectHit> {
  const issuer = "bc" as const;
  const listUrl = "https://web.paybooc.co.kr/web/evnt/main";
  try {
    const raw = await fetchText("https://web.paybooc.co.kr/web/evnt/lst-evnt-data", {
      headers: { Accept: "application/json", Referer: listUrl },
    });
    const data = JSON.parse(raw) as { data?: { evntInqrList?: PayboocItem[] } };
    const cards = (data.data?.evntInqrList ?? [])
      .map((item) => {
        const title = [item.pybcUnifEvntNm1, item.pybcUnifEvntNm2, item.pybcUnifEvntNm3]
          .filter(Boolean)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        const start = compactDay(item.evntBltnStrtDtm || "");
        const end = compactDay(item.evntBltnEndDtm || "");
        const typed = PAYBOOC_ENTRY.has(item.pybcUnifEvntTypCd || "");
        const tagged = /마이태그|응모/.test(title);
        if (!item.pybcUnifEvntNo || !end || item.endEvent || start > today) return null;
        if (!typed && !tagged) return null;
        if (/무이자|할부/.test(title) && !typed && !/응모/.test(title)) return null;
        return { id: item.pybcUnifEvntNo, title, start, end, typed };
      })
      .filter((row): row is NonNullable<typeof row> => row !== null);
    const chosen = rankSoon(cards, today, 16);
    const events = (
      await mapPool(chosen, 4, async (card) => {
        const applyUrl = `https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=${card.id}`;
        try {
          const page = await fetchText(applyUrl, { headers: { Referer: listUrl } });
          const marker = page.indexOf("const eventData = ");
          const jsonStart = page.indexOf("{", marker);
          let notice = "";
          let groups = "";
          if (jsonStart > 0) {
            let depth = 0;
            let end = jsonStart;
            for (let index = jsonStart; index < page.length; index += 1) {
              const char = page[index];
              if (char === "{") depth += 1;
              else if (char === "}") {
                depth -= 1;
                if (depth === 0) {
                  end = index + 1;
                  break;
                }
              }
            }
            const eventData = JSON.parse(page.slice(jsonStart, end)) as {
              eventNoticeDto?: { ntceMainTitlNm?: string; ntceMainDtCtnt?: string; ntceSubDtCtnt?: string };
              eventDetailsGroupBaseDtoList?: {
                evntDtGrpNm?: string;
                eventDetailGroupContentDtoList?: { cntnTitlNm?: string; cntnDtCtnt?: string; cntnDtCtnt2?: string }[];
              }[];
            };
            notice = stripTags(
              `${eventData.eventNoticeDto?.ntceMainTitlNm ?? ""}\n${eventData.eventNoticeDto?.ntceMainDtCtnt ?? ""}\n${eventData.eventNoticeDto?.ntceSubDtCtnt ?? ""}`,
            );
            groups = (eventData.eventDetailsGroupBaseDtoList ?? [])
              .map((group) => {
                const bits = (group.eventDetailGroupContentDtoList ?? []).map((item) =>
                  stripTags(`${item.cntnTitlNm ?? ""}\n${item.cntnDtCtnt ?? ""}\n${item.cntnDtCtnt2 ?? ""}`),
                );
                return `${group.evntDtGrpNm ?? ""}\n${bits.join("\n")}`;
              })
              .join("\n");
          }
          const text = `${groups}\n${notice}`;
          const mytag = /마이태그/.test(card.title);
          if (!card.typed && !mytag && !isEntryCopy(`${text}\n${card.title}`)) return null;
          const packed = rulesOr(
            card.title,
            text,
            card.typed
              ? "페이북이 로그인·비로그인 응모형으로 분류한 이벤트입니다."
              : "페이북 마이태그(응모) 이벤트입니다. 태그와 결제 조건은 카드사 화면에서 확인하세요.",
          );
          return eventBase(issuer, card.id, {
            title: card.title,
            summary: packed.summary,
            benefit: packed.summary.slice(0, 80),
            conditions: packed.conditions,
            exclusions: packed.exclusions,
            startDate: card.start || today,
            endDate: card.end,
            applyUrl,
          });
        } catch {
          if (!card.typed) return null;
          return eventBase(issuer, card.id, {
            title: card.title,
            summary: card.title,
            benefit: card.title.slice(0, 80),
            conditions: ["페이북이 응모형으로 분류한 이벤트입니다. 대상과 제외 조건은 응모 화면에서 확인하세요."],
            exclusions: [],
            startDate: card.start || today,
            endDate: card.end,
            applyUrl,
          });
        }
      })
    ).filter((event): event is EntryEvent => event !== null);
    return {
      issuer,
      ok: true,
      message: events.length
        ? `페이북 진행 목록에서 응모·마이태그 ${events.length}건을 남겼습니다. BC 홈은 여기로 연결됩니다.`
        : "페이북 목록은 열렸지만 응모·마이태그 건이 없습니다.",
      events,
    };
  } catch (error) {
    return {
      issuer,
      ok: false,
      message: `BC·페이북 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
      events: [],
    };
  }
}

async function collectIbk(today: string): Promise<CollectHit> {
  const issuer = "ibk" as const;
  const listUrl = "https://www.ibk.co.kr/event/ingListEvent.ibk?pageId=CM01060100&evnt_dscd=H";
  try {
    const html = await fetchText(listUrl);
    const cards = [
      ...html.matchAll(
        /evnt_srno=(\d+)&evnt_dscd=H[\s\S]{0,500}?alt="([^"]*)"[\s\S]{0,1600}?기간<\/span>([\s\S]*?)<\/li>/g,
      ),
    ].map((match) => {
      const range = parseRange(stripTags(match[3]));
      const title = stripTags(match[2]).replace(/\s+/g, " ");
      if (!range || range.start > today) return null;
      const cardLike = /카드|응모/.test(title);
      if (!cardLike) return null;
      if (/무이자/.test(title) && !/응모/.test(title)) return null;
      return { id: match[1], title, start: range.start, end: range.end };
    }).filter((row): row is NonNullable<typeof row> => row !== null);
    const unique = [...new Map(cards.map((card) => [card.id, card])).values()];
    const chosen = rankSoon(unique, today, 10);
    const events = (
      await mapPool(chosen, 4, async (card) => {
        const applyUrl = `https://www.ibk.co.kr/event/ingDetailEvent.ibk?evnt_srno=${card.id}&evnt_dscd=H&pageId=CM01060100`;
        try {
          const page = await fetchText(applyUrl, { headers: { Referer: listUrl } });
          const alts = [...page.matchAll(/<img[^>]*alt="([^"]{20,500})"[^>]*>/g)]
            .map((match) => stripTags(match[1]).replace(/[·•]/g, "\n"))
            .filter((alt) => !/기업은행 로고|이전|다음/.test(alt));
          const text = alts.join("\n");
          if (!/신청하기|응모하기|사전 신청|쿠폰\s*다운로드|이벤트\s*응모/.test(text)) return null;
          const packed = rulesOr(card.title, text, "IBK 카드 행사 화면에서 신청 또는 쿠폰을 받아야 혜택이 적용됩니다.");
          return eventBase(issuer, card.id, {
            title: card.title,
            summary: packed.summary,
            benefit: packed.summary.slice(0, 80),
            conditions: packed.conditions,
            exclusions: packed.exclusions,
            startDate: card.start,
            endDate: card.end,
            applyUrl,
          });
        } catch {
          return null;
        }
      })
    ).filter((event): event is EntryEvent => event !== null);
    return {
      issuer,
      ok: true,
      message: events.length
        ? `카드 행사 ${unique.length}건 중 신청·응모 ${events.length}건입니다. 예금·청약 행사는 뺐습니다.`
        : `카드 행사 ${unique.length}건을 읽었지만 신청이나 응모가 필요한 건은 없습니다.`,
      events,
    };
  } catch (error) {
    return {
      issuer,
      ok: false,
      message: `IBK 이벤트 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
      events: [],
    };
  }
}

export async function collectLive(today = seoulToday()): Promise<CollectHit[]> {
  return Promise.all([
    collectShinhan(today),
    collectSamsung(today),
    collectHyundai(today),
    collectKb(today),
    collectLotte(today),
    collectHana(today),
    collectNh(today),
    collectBc(today),
    collectIbk(today),
  ]);
}
