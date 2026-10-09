/** Daishin public pages may return a client-side event template while serving
 * the site's global navigation normally. Those texts are not promotion terms.
 * Do not infer campaign conditions until the actual campaign title is visible. */
export function daishinDetailIsUnverified(text: string, campaignTitle: string): boolean {
  return /\{\{\s*(?:event\.|yymmddhhmm\()/i.test(text) ||
    !text.replace(/\s+/g, " ").includes(campaignTitle.replace(/\s+/g, " "));
}
