/**
 * Public, broker-owned references for GENERAL customers' ONLINE IPO fees.
 * A broker-specific, account- or offering-specific fee can override this;
 * waived fees/zero allotments are not guaranteed and must be checked.
 * Do not add values from unsourced comparison blogs as "confirmed".
 */
export type PublishedIpoFee = {
  amount: number;
  url: string;
  note: string;
};

const OFFICIAL: Record<string, PublishedIpoFee> = {
  "KB증권": {
    amount: 1500,
    url: "https://www.kbsec.com/go.able?linkcd=m02070012",
    note: "패밀리(일반) 온라인 기준 · 우대등급·65세 이상·미배정 시 면제 가능",
  },
  "삼성증권": {
    amount: 2000,
    url: "https://www.samsungpop.com/ux/kor/customer/guide/workproductguide/addCommission.do",
    note: "일반 온라인 기준 · 우대등급·미배정 시 면제 가능",
  },
  "미래에셋증권": {
    amount: 2000,
    url: "https://digital.securities.miraeasset.com/public-offering/",
    note: "일반 온라인 기준 · 실버등급 이상 면제",
  },
  "신한투자증권": {
    amount: 2000,
    url: "https://www.shinhansec.com/siw/banking-lending/subscribe/guidePOSS/view.do",
    note: "일반 온라인/ARS 기준 · 등급별 감면·미배정 시 면제",
  },
  "키움증권": {
    amount: 2000,
    url: "https://www.kiwoom.com/h/banking/right/VPublicStockMainView?dummyVal=0",
    note: "일반 온라인 기준 · 우대고객 면제",
  },
  "한국투자증권": {
    amount: 2000,
    url: "https://www.truefriend.com/main/customer/guide/_static/TF04ae010000.jsp",
    note: "패밀리 등급 온라인 기준 · 우대고객 면제",
  },
  "대신증권": {
    amount: 2000,
    url: "https://money2.daishin.com/e5/mboard/ptype_accordion/Accordian_001/DW_Basic_List.aspx?boardseq=61",
    note: "일반 온라인 기준 · HNW 이상 면제 (계좌 유형·청약 공고 확인)",
  },
  "유진투자증권": {
    amount: 2000,
    url: "https://m.eugenefn.com/no20r.do?msgId=521104&pageNo=&topFlag=0",
    note: "공개 청약 안내의 온라인 일반 기준 · 신규·우수 고객 면제 가능",
  },
};

export function publishedIpoFee(broker: string): {
  onlineFee: number | null; onlineFeeNote: string; feeSourceUrl: string;
} {
  const canonical = broker.replace(/\s+/g, "").replace(/^케이비증권$/, "KB증권")
    .replace(/^엔에이치투자증권$/, "NH투자증권");
  const record = OFFICIAL[canonical];
  return record ? {
    onlineFee: record.amount,
    onlineFeeNote: record.note + " · 공식 안내표의 기본요금이며 종목·계좌마다 달라질 수 있음",
    feeSourceUrl: record.url,
  } : {
    onlineFee: null,
    onlineFeeNote: "증권사 공식 온라인 청약 수수료 검증 자료 없음",
    feeSourceUrl: "",
  };
}
