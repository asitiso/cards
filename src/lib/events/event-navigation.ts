import { issuerMeta, type IssuerId } from "./types.ts";
import { wooriEventHandoffUrl } from "./woori-details.ts";

/**
 * Woori Card campaign actions are app-first on mobile.
 * The official campaign web URL remains the desktop destination and fallback.
 * App support depends on the issuer's Android intent / iOS universal-link
 * registration; it cannot be guaranteed by this website alone.
 */
export function eventAppLaunch(issuer: IssuerId): {
  androidPackage: string;
  iosAppId: string;
  mode: "app";
  appScheme: "com.wooricard.wcard";
} | null {
  if (issuer !== "woori") return null;
  const { androidPackage, iosAppId } = issuerMeta(issuer);
  if (!androidPackage || !iosAppId) return null;
  return { androidPackage, iosAppId, mode: "app", appScheme: "com.wooricard.wcard" };
}


/** Verified official mobile benefits/events landing page. No app intent or store. */
export const WOORI_MOBILE_EVENTS_URL =
  "https://m.wooricard.com/dcmw/yh1/bnf/bnf01/M1BNF201S00.do";

/** A single click opens the original issuer page, except Woori promotions
 * open their matching official MOBILE detail page with the same serial ID.
 * Malformed legacy records safely retain their existing URL. */
export function eventWebDestination(
  event: { issuer: IssuerId; applyUrl: string },
): string {
  if (event.issuer !== "woori") return event.applyUrl;
  try {
    return wooriEventHandoffUrl(event.applyUrl);
  } catch {
    return event.applyUrl;
  }
}
