import type { CollectHit } from "./http-collect.ts";
import type { EntryEvent } from "./types.ts";
import { isBoilerplateRule } from "./html.ts";

/**
 * Only verified, consistent batches may replace previously saved events.
 * A 200 response with no parsed events is NOT proof that the institution has
 * no promotions; its markup may have changed or the site may be app-only.
 */
/** Date-string shape alone accepts 2026-02-30; validate the calendar too. */
export function isRealCalendarDate(value: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return false;
  const year=Number(m[1]), month=Number(m[2]), day=Number(m[3]);
  const date=new Date(Date.UTC(year,month-1,day));
  return date.getUTCFullYear()===year && date.getUTCMonth()+1===month &&
    date.getUTCDate()===day;
}

export function validateCollection(hit: CollectHit): CollectHit {
  if (!hit.ok) return hit;
  if (hit.events.length === 0) {
    return {
      ...hit,
      ok: false,
      message: `${hit.message} 실제 행사 없음과 분석 실패를 구분할 수 없어 확인이 필요합니다.`,
    };
  }

  const seen = new Set<string>();
  for (const event of hit.events) {
    const validDate = isRealCalendarDate(event.startDate) &&
      isRealCalendarDate(event.endDate) && event.startDate <= event.endDate;
    const validUrl = /^https:\/\//i.test(event.applyUrl);
    if (event.issuer !== hit.issuer ||
      !event.id.startsWith(`${hit.issuer}:`) ||
      event.title.trim().length < 4 ||
      !validDate || !validUrl || seen.has(event.id)) {
      return {
        ...hit,
        ok: false,
        events: [],
        message: "수집한 행사에 누락·중복·날짜·링크 오류가 있어 이번 결과를 반영하지 않습니다.",
      };
    }
    seen.add(event.id);
  }
  return hit;
}

/** Prevent partial list/pagination/parser failures from masquerading as deletions. */
export function suddenDrop(previousOngoingCount: number, currentCount: number): boolean {
  return previousOngoingCount >= 8 &&
    currentCount < Math.max(3, Math.ceil(previousOngoingCount * 0.3));
}


/** A partly parsed page can lose 3-5 ongoing events without a 70% drop.
 * Compare stable IDs of still-ongoing campaigns; keep last known-good rows
 * if at least three AND at least 15% disappeared unexpectedly. */
export function suspiciousMissingOngoing(
  previous: readonly { id: string; endDate: string }[],
  next: readonly { id: string }[],
  today: string,
): { missing: number; total: number; suspicious: boolean } {
  const ongoing=previous.filter(e=>e.endDate>=today);
  const ids=new Set(next.map(e=>e.id));
  const missing=ongoing.filter(e=>!ids.has(e.id)).length;
  return {
    missing,
    total:ongoing.length,
    suspicious:ongoing.length>=8 && missing>=Math.max(3,Math.ceil(ongoing.length*0.15)),
  };
}


/** Keep known terms when only a title/list preview was read this time.
 * Never retain previous details when campaign title or dates have changed.
 * Actual re-verified detail pages always take precedence. */
export function mergeUnverifiedDetails(previous: EntryEvent | undefined, incoming: EntryEvent): EntryEvent {
  if (!previous || !incoming.detailUnverified) return incoming;
  if (previous.title !== incoming.title ||
      previous.startDate !== incoming.startDate ||
      previous.endDate !== incoming.endDate) return incoming;
  const useful = (value:string) =>
    value.trim().length>=12 &&
    !/^(?:원문에서|회사 화면에서|대상과 제외 조건은|카드사 페이지의)/.test(value) &&
    !isBoilerplateRule(value);
  const oldTerms=previous.conditions.filter((line) =>
    useful(line) && !(incoming.issuer === "woori" &&
      (line === previous.summary || line === previous.benefit || line === previous.title)),
  );
  const newTerms=incoming.conditions.filter(useful);
  const oldExclusions=previous.exclusions.filter(useful);
  const newExclusions=incoming.exclusions.filter(useful);
  const genericBenefit=(text:string)=>!useful(text) || text===incoming.title;
  return {
    ...incoming,
    summary: useful(incoming.summary) && incoming.summary!==incoming.title
      ? incoming.summary : (useful(previous.summary) ? previous.summary : incoming.summary),
    benefit: genericBenefit(incoming.benefit) && useful(previous.benefit)
      ? previous.benefit : incoming.benefit,
    conditions: newTerms.length ? newTerms : oldTerms,
    exclusions: newExclusions.length ? newExclusions : oldExclusions,
    entry: previous.entry,
  };
}
