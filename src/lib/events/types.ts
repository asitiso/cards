export const MARKETS = [
  { id: "card", label: "카드" },
  { id: "securities", label: "증권" },
  { id: "bank", label: "은행" },
] as const;

export type Market = (typeof MARKETS)[number]["id"];

export const ISSUER_IDS = [
  "shinhan",
  "samsung",
  "hyundai",
  "kb",
  "lotte",
  "woori",
  "hana",
  "nh",
  "bc",
  "ibk",
  "mirae",
  "samsungsec",
  "koreainvest",
  "kbsec",
  "nhsec",
  "kiwoom",
  "shinhansec",
  "hanasec",
  "daishin",
  "meritz",
  "tosssec",
  "kakaopaysec",
  "kbbank",
  "shinhanbank",
  "wooribank",
  "hanabank",
  "nhbank",
  "ibkbank",
  "kakaobank",
  "tossbank",
  "kbank",
] as const;

export type IssuerId = (typeof ISSUER_IDS)[number];

export type IssuerMeta = {
  id: IssuerId;
  name: string;
  short: string;
  listUrl: string;
  market: Market;
  /** Android package. 바로가기 opens this app, then the Play Store. */
  androidPackage?: string;
  /** App Store id. iPhone 바로가기 opens this app, then the App Store. */
  iosAppId?: string;
};

export const ISSUERS: IssuerMeta[] = [
  {
    id: "shinhan",
    name: "신한카드",
    short: "신한",
    listUrl: "https://www.shinhancard.com/mob/MOBFM829N/MOBFM829R01.shc",
    market: "card",
    androidPackage: "com.shcard.smartpay",
    iosAppId: "572462317",
  },
  {
    id: "samsung",
    name: "삼성카드",
    short: "삼성",
    listUrl: "https://www.samsungcard.com/personal/event/ing/UHPPBE1401M0.jsp",
    market: "card",
    androidPackage: "net.ib.android.smcard",
    iosAppId: "379577046",
  },
  {
    id: "hyundai",
    name: "현대카드",
    short: "현대",
    listUrl: "https://www.hyundaicard.com/cpb/ev/CPBEV0101_01.hc",
    market: "card",
    androidPackage: "com.hyundaicard.appcard",
    iosAppId: "702653088",
  },
  {
    id: "kb",
    name: "KB국민카드",
    short: "KB",
    listUrl: "https://card.kbcard.com/BON/DVIEW/HBBMCXCRVNEC0001",
    market: "card",
    androidPackage: "com.kbcard.cxh.appcard",
    iosAppId: "695436326",
  },
  {
    id: "lotte",
    name: "롯데카드",
    short: "롯데",
    listUrl: "https://m.lottecard.co.kr/app/LPBNFDA_V100.lc",
    market: "card",
    androidPackage: "com.lcacApp",
    iosAppId: "688047200",
  },
  {
    id: "woori",
    name: "우리카드",
    short: "우리",
    listUrl: "https://m.wooricard.com/dcmw/yh1/bnf/bnf02/prgevnt/M1BNF202S00.do",
    market: "card",
    androidPackage: "com.wooricard.smartapp",
    iosAppId: "1499598869",
  },
  {
    id: "hana",
    name: "하나카드",
    short: "하나",
    listUrl: "https://m.hanacard.co.kr/MKEVT1000M.web",
    market: "card",
    androidPackage: "com.hanaskcard.paycla",
    iosAppId: "847268987",
  },
  {
    id: "nh",
    name: "NH농협카드",
    short: "NH",
    listUrl: "https://card.nonghyup.com/IPCC010001.menu",
    market: "card",
    androidPackage: "nh.smart.nhallonepay",
    iosAppId: "1177889176",
  },
  {
    id: "bc",
    name: "BC카드",
    short: "BC",
    listUrl: "https://web.paybooc.co.kr/web/evnt/main",
    market: "card",
    androidPackage: "kvp.jjy.MispAndroid320",
    iosAppId: "369125087",
  },
  {
    id: "ibk",
    name: "IBK기업은행",
    short: "IBK",
    listUrl: "https://www.ibk.co.kr/event/ingListEvent.ibk?pageId=CM01060100&evnt_dscd=H",
    market: "card",
    androidPackage: "com.ibk.android.ionebank",
    iosAppId: "1460543865",
  },
  {
    id: "mirae",
    name: "미래에셋증권",
    short: "미래",
    listUrl: "https://securities.miraeasset.com/hki/hki7000/r05.do",
    market: "securities",
    androidPackage: "com.miraeasset.trade",
    iosAppId: "1248716281",
  },
  {
    id: "samsungsec",
    name: "삼성증권",
    short: "삼성",
    listUrl: "https://m.samsungpop.com/mbw/customer/noticeEvent.do?cmd=eventList",
    market: "securities",
    androidPackage: "com.samsungpop.android.mpop",
    iosAppId: "1150231646",
  },
  {
    id: "koreainvest",
    name: "한국투자증권",
    short: "한투",
    listUrl: "https://m.truefriend.com/",
    market: "securities",
    androidPackage: "com.truefriend.neosmartarenewal",
    iosAppId: "1621986905",
  },
  {
    id: "kbsec",
    name: "KB증권",
    short: "KB",
    listUrl: "https://www.kbsec.com/go.able",
    market: "securities",
    androidPackage: "com.kbsec.mts.iplustarngm2",
    iosAppId: "350742701",
  },
  {
    id: "nhsec",
    name: "NH투자증권",
    short: "NH",
    listUrl: "https://www.mynamuh.com/",
    market: "securities",
    androidPackage: "com.wooriwm.txsmart",
    iosAppId: "486312400",
  },
  {
    id: "kiwoom",
    name: "키움증권",
    short: "키움",
    listUrl: "https://www.kiwoom.com/m/customer/event/VIngEventView",
    market: "securities",
    androidPackage: "com.kiwoom.heromts",
    iosAppId: "1570370057",
  },
  {
    id: "shinhansec",
    name: "신한투자증권",
    short: "신한",
    listUrl: "https://www.shinhansec.com/siw/customer/event/eventList/view.do",
    market: "securities",
    androidPackage: "com.shinhaninvest.nsmts",
    iosAppId: "1168512940",
  },
  {
    id: "hanasec",
    name: "하나증권",
    short: "하나",
    listUrl: "https://www.hanaw.com/corebbs5/eventIng/list/list.cmd",
    market: "securities",
    androidPackage: "com.hanasec.stock",
    iosAppId: "1506702407",
  },
  {
    id: "daishin",
    name: "대신증권",
    short: "대신",
    listUrl: "https://m.daishin.com/",
    market: "securities",
    androidPackage: "com.daishin",
    iosAppId: "414850336",
  },
  {
    id: "meritz",
    name: "메리츠증권",
    short: "메리츠",
    listUrl: "https://home.imeritz.com/cust/ntcevnt/PrgsEvnt.do",
    market: "securities",
    androidPackage: "com.imeritz.smartmeritz",
    iosAppId: "1104272974",
  },
  {
    id: "tosssec",
    name: "토스증권",
    short: "토스",
    listUrl: "https://www.tossinvest.com/",
    market: "securities",
    androidPackage: "viva.republica.toss",
    iosAppId: "839333328",
  },
  {
    id: "kakaopaysec",
    name: "카카오페이증권",
    short: "카카페",
    listUrl: "https://www.kakaopay.com/",
    market: "securities",
    androidPackage: "com.kakaopay.app",
    iosAppId: "1464496236",
  },
  {
    id: "kbbank",
    name: "KB국민은행",
    short: "KB",
    listUrl: "https://obank.kbstar.com/",
    market: "bank",
    androidPackage: "com.kbstar.kbbank",
    iosAppId: "373742138",
  },
  {
    id: "shinhanbank",
    name: "신한은행",
    short: "신한",
    listUrl: "https://bank.shinhan.com/",
    market: "bank",
    androidPackage: "com.shinhan.sbanking",
    iosAppId: "357484932",
  },
  {
    id: "wooribank",
    name: "우리은행",
    short: "우리",
    listUrl: "https://spot.wooribank.com/pot/Dream?withyou=EVEVT0001",
    market: "bank",
    androidPackage: "com.wooribank.smart.npib",
    iosAppId: "1470181651",
  },
  {
    id: "hanabank",
    name: "하나은행",
    short: "하나",
    listUrl: "https://m.kebhana.com/",
    market: "bank",
    androidPackage: "com.hanabank.oqf",
    iosAppId: "6743190232",
  },
  {
    id: "nhbank",
    name: "NH농협은행",
    short: "NH",
    listUrl: "https://banking.nonghyup.com/",
    market: "bank",
    androidPackage: "com.nonghyup.nhallonebank",
    iosAppId: "1641628055",
  },
  {
    id: "ibkbank",
    name: "IBK기업은행",
    short: "IBK",
    listUrl: "https://www.ibk.co.kr/event/ingListEvent.ibk?pageId=CM01060100",
    market: "bank",
    androidPackage: "com.ibk.android.ionebank",
    iosAppId: "1460543865",
  },
  {
    id: "kakaobank",
    name: "카카오뱅크",
    short: "카카오",
    listUrl: "https://www.kakaobank.com/",
    market: "bank",
    androidPackage: "com.kakaobank.channel",
    iosAppId: "1258016944",
  },
  {
    id: "tossbank",
    name: "토스뱅크",
    short: "토스",
    listUrl: "https://www.tossbank.com/",
    market: "bank",
    androidPackage: "viva.republica.toss",
    iosAppId: "839333328",
  },
  {
    id: "kbank",
    name: "케이뱅크",
    short: "케이",
    listUrl: "https://www.kbanknow.com/",
    market: "bank",
    androidPackage: "com.kbankwith.smartbank",
    iosAppId: "1178872627",
  },
];

export type EntryEvent = {
  id: string;
  issuer: IssuerId;
  title: string;
  summary: string;
  benefit: string;
  conditions: string[];
  exclusions: string[];
  startDate: string;
  endDate: string;
  applyUrl: string;
  listUrl: string;
  /** false면 응모·신청이 필요 없는 행사. 없으면 응모로 본다. */
  entry?: boolean;
};

export type IssuerReport = {
  id: IssuerId;
  name: string;
  listUrl: string;
  count: number;
  ok: boolean;
  message: string;
};

export type Board = {
  collectedAt: string;
  today: string;
  events: EntryEvent[];
  issuers: IssuerReport[];
};

export function issuerMeta(id: IssuerId): IssuerMeta {
  const found = ISSUERS.find((item) => item.id === id);
  if (!found) throw new Error(`unknown issuer ${id}`);
  return found;
}
