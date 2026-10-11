import { issuerMeta, type IssuerId } from "./types.ts";

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
