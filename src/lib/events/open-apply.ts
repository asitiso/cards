/**
 * Open a company link in its app when the phone has it.
 * `mode: "app"` (바로가기) falls back to that app's store page.
 * `mode: "page"` (응모) falls back to the exact web page.
 * Desktop always opens the web page.
 */
export function openApply(
  webUrl: string,
  androidPackage?: string,
  mode: "page" | "app" = "page",
  iosAppId?: string,
): void {
  const android = /Android/i.test(navigator.userAgent);
  if (android && androidPackage) {
    const play = `https://play.google.com/store/apps/details?id=${encodeURIComponent(androidPackage)}`;
    try {
      const url = new URL(webUrl);
      const fallback = encodeURIComponent(mode === "app" ? play : webUrl);
      const path = `${url.host}${url.pathname}${url.search}`;
      const scheme = url.protocol.replace(":", "") || "https";
      window.location.href = `intent://${path}#Intent;scheme=${scheme};package=${androidPackage};S.browser_fallback_url=${fallback};end`;
      return;
    } catch {
      if (mode === "app") {
        window.location.assign(play);
        return;
      }
    }
  }

  const ios = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (ios) {
    if (mode === "app" && iosAppId) {
      const store = `https://apps.apple.com/kr/app/id${iosAppId}`;
      // The company address can open the app via a universal link.
      // If this page is still here, the app did not take it — open the App Store.
      const timer = window.setTimeout(() => {
        if (document.visibilityState === "visible") window.location.replace(store);
      }, 1600);
      document.addEventListener(
        "visibilitychange",
        () => {
          if (document.hidden) window.clearTimeout(timer);
        },
        { once: true },
      );
      window.location.assign(webUrl);
      return;
    }
    window.location.assign(webUrl);
    return;
  }

  window.open(webUrl, "_blank", "noopener,noreferrer");
}
