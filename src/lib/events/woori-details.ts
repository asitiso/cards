/** Official public event detail route (not the generic campaign list). */
const DETAIL_BASE = "https://pc.wooricard.com/dcpc/yh1/bnf/bnf02/prgevnt/movePrgEvntDtl.do";

export function wooriDetailUrl(eventSerial: string): string {
  // A serial comes from Woori Card's own public getPrgEvntList API.
  if (!/^\d{6,12}$/.test(eventSerial)) throw new Error("Invalid Woori event serial");
  return `${DETAIL_BASE}?evntSrno=${eventSerial}`;
}

export function wooriListCondition(summary: string): string[] {
  const text=summary.replace(/\s+/g," ").trim();
  // List blurbs are usually REWARD descriptions, not eligibility conditions.
  // Only label them as conditions if they explicitly state a customer action.
  if (!/(?:\d[\d,]*\s*만원\s*이상\s*(?:이용|결제)|\d[\d,]*\s*원\s*이상\s*(?:이용|결제)|응모\s*(?:필수|후)|전월\s*실적|참여\s*대상|대상\s*카드)/.test(text)) return [];
  return [text.slice(0, 180)];
}


/**
 * BC Card's official partner event QR codes route WooriWONCard app-only
 * promotions through Woori's own mobile page with a target pageId.
 * This is a verified PUBLIC EVENT HANDOFF URL, not the payment URI scheme.
 *
 * Native app launch still depends on the Woori app's installed intent
 * filters and OS settings. A browser fallback must remain available.
 */
export function wooriEventHandoffUrl(webUrl: string): string {
  const url=new URL(webUrl);
  if (!["pc.wooricard.com","m.wooricard.com"].includes(url.hostname) ||
      !url.pathname.endsWith("/prgevnt/movePrgEvntDtl.do")) {
    throw new Error("Unrecognized official Woori campaign detail");
  }
  const serial=url.searchParams.get("evntSrno") ?? "";
  if (!/^\d{6,12}$/.test(serial)) throw new Error("Invalid Woori campaign serial");
  return "https://m.wooricard.com/dcmw/yh1/mlk/mlk03/M1MLK303S01.do?" +
    "pageId=yh1/bnf/bnf02/prgevnt/movePrgEvntDtl.do?evntSrno="+serial;
}

/** Try WooriWONCard's verified Android package on the real mobile route;
 * if it has no matching app handler, return to the SAME mobile event page,
 * NEVER to Google Play for an app that may already be installed. */
export function wooriAndroidEventIntent(mobileHandoffUrl: string): string {
  const url=new URL(mobileHandoffUrl);
  if (url.hostname !== "m.wooricard.com" ||
      url.pathname !== "/dcmw/yh1/mlk/mlk03/M1MLK303S01.do" ||
      !url.searchParams.get("pageId")?.startsWith("yh1/bnf/bnf02/prgevnt/movePrgEvntDtl.do?evntSrno=")) {
    throw new Error("Unrecognized Woori mobile event handoff");
  }
  return "intent://"+url.host+url.pathname+url.search+
    "#Intent;scheme=https;package=com.wooricard.smartapp;"+
    "S.browser_fallback_url="+encodeURIComponent(url.href)+";end";
}
