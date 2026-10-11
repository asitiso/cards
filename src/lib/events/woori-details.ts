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
 * The currently accessible Woori mobile campaign detail actually contains
 * its unique event serial (moveEvntSrno). This is the real event destination.
 * It is preferable to Woori's old third-party QR handoff, which today returns
 * a generic page with no event serial in its response.
 */
export function wooriEventHandoffUrl(webUrl: string): string {
  const url=new URL(webUrl);
  if (!["pc.wooricard.com","m.wooricard.com"].includes(url.hostname) ||
      !url.pathname.endsWith("/prgevnt/movePrgEvntDtl.do")) {
    throw new Error("Unrecognized official Woori campaign detail");
  }
  const serial=url.searchParams.get("evntSrno") ?? "";
  if (!/^\d{6,12}$/.test(serial)) throw new Error("Invalid Woori campaign serial");
  return "https://m.wooricard.com/dcmw/yh1/bnf/bnf02/prgevnt/movePrgEvntDtl.do?evntSrno="+serial;
}

/** Try this official MOBILE event URL in the installed Woori Android app.
 * If the app does not declare an event URL handler, Chrome opens this SAME
 * mobile event page rather than incorrectly sending users to Google Play. */
export function wooriAndroidEventIntent(mobileHandoffUrl: string): string {
  const url=new URL(mobileHandoffUrl);
  if (url.hostname !== "m.wooricard.com" ||
      url.pathname !== "/dcmw/yh1/bnf/bnf02/prgevnt/movePrgEvntDtl.do" ||
      !/^\d{6,12}$/.test(url.searchParams.get("evntSrno")??"")) {
    throw new Error("Unrecognized Woori mobile event handoff");
  }
  return "intent://"+url.host+url.pathname+url.search+
    "#Intent;scheme=https;package=com.wooricard.smartapp;"+
    "S.browser_fallback_url="+encodeURIComponent(url.href)+";end";
}


/**
 * Experimental app HOME launch, independent of the event deep link.
 * Unlike the payment-only custom scheme and the https event ACTION_VIEW,
 * this asks Android for WooriWONCard's launch activity. Chrome only permits
 * exported BROWSABLE activities: when unsupported, the fallback opens the
 * EXACT mobile event instead of Google Play. Never claims to open the event
 * inside the app, and never forwards arbitrary unverified app parameters.
 */
function buildWooriAppHomeIntent(fallbackUrl: string): string {
  return "intent://#Intent;action=android.intent.action.MAIN;" +
    "category=android.intent.category.LAUNCHER;" +
    "package=com.wooricard.smartapp;" +
    "S.browser_fallback_url=" + encodeURIComponent(fallbackUrl) + ";end";
}

export function wooriAppHomeLaunchIntent(webUrl: string): string {
  return buildWooriAppHomeIntent(wooriEventHandoffUrl(webUrl));
}

/** Issuer-level shortcut: no campaign serial, fallback stays on official home. */
export function wooriAppHomeShortcutIntent(): string {
  return buildWooriAppHomeIntent("https://m.wooricard.com/dcmw/main.do");
}
