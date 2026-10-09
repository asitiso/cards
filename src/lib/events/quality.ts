import type { CollectHit } from "./http-collect.ts";

/**
 * Only verified, consistent batches may replace previously saved events.
 * A 200 response with no parsed events is NOT proof that the institution has
 * no promotions; its markup may have changed or the site may be app-only.
 */
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
    const validDate = /^\d{4}-\d{2}-\d{2}$/.test(event.startDate) &&
      /^\d{4}-\d{2}-\d{2}$/.test(event.endDate) &&
      event.startDate <= event.endDate;
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
