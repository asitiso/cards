import type { IpoItem } from "./types.ts";

/** A company is one offering even after its subscription date is corrected. */
const stockKey = (name: string) => name.replace(/[\s·()（）㈜-]/g, "").toLowerCase();

function mismatch(a: IpoItem, b: IpoItem): string[] {
  const fields: Array<[keyof IpoItem, string]> = [
    ["subscriptionStart", "청약 시작일"],
    ["subscriptionEnd", "청약 종료일"],
    ["offerPrice", "공모가"],
    ["refundDate", "환불일"],
    ["listingDate", "상장일"],
  ];
  return fields.filter(([key]) => {
    const left = a[key], right = b[key];
    return left !== null && left !== "" && left !== undefined &&
      right !== null && right !== "" && right !== undefined && left !== right;
  }).map(([, label]) => label);
}

/**
 * Official KIND values take precedence. The two reference sources may fill
 * genuinely missing fields, but a disagreement is exposed, never concealed.
 * This function does no network or database I/O.
 */
export function mergeIpoSources(
  official: IpoItem[], reference: IpoItem[], secondary: IpoItem[],
): IpoItem[] {
  const sourceMap = (items: IpoItem[]) =>
    new Map(items.map(item => [stockKey(item.name), item] as const));
  const kind = sourceMap(official);
  const sonnim = sourceMap(reference);
  const comm38 = sourceMap(secondary);
  const keys = new Set([...kind.keys(), ...sonnim.keys(), ...comm38.keys()]);
  const merged: IpoItem[] = [];
  for (const key of keys) {
    const main = kind.get(key) ?? sonnim.get(key) ?? comm38.get(key);
    if (!main) continue;
    const supplement = kind.has(key) ? [sonnim.get(key), comm38.get(key)] :
      sonnim.has(key) ? [comm38.get(key)] : [];
    const others = supplement.filter((x): x is IpoItem => Boolean(x));
    const conflicts = [...new Set(others.flatMap(x => mismatch(main, x)))];
    // Never turn a reference-only offer-price into a KIND-confirmed price.
    // A reference fill is flagged for the issuer so staff can verify it.
    const firstNonempty = (key: "refundDate" | "listingDate") =>
      main[key] || others.map(x => x[key]).find(Boolean) || "";
    const filledPrice = main.offerPrice ?? others.map(x => x.offerPrice)
      .find((x): x is number => x !== null && x !== undefined) ?? null;
    const sourceStatus = conflicts.length ? "conflict" :
      kind.has(key) ? (sonnim.has(key) ? "corroborated" : "official") : "reference";
    const missingPriceFromOfficial = kind.has(key) && main.offerPrice === null &&
      filledPrice !== null;
    const issues = [
      ...conflicts.map(x => x + " 출처 불일치"),
      ...(missingPriceFromOfficial ? ["공모가는 보조 자료에서만 확인"] : []),
    ];
    merged.push({
      ...main,
      offerPrice: filledPrice,
      refundDate: firstNonempty("refundDate"),
      listingDate: firstNonempty("listingDate"),
      brokers: main.brokers.length ? main.brokers : (others[0]?.brokers ?? []),
      sourceStatus,
      verificationNote: issues.join(" · "),
    });
  }
  return merged.sort((a,b)=> a.subscriptionStart.localeCompare(b.subscriptionStart) ||
    a.name.localeCompare(b.name,"ko"));
}
