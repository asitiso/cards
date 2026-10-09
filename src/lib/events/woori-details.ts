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
