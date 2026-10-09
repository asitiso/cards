import { fetchText, mapPool, splitRules, stripTags, visibleMarkup } from "./html.ts";
import { stableLinkId } from "./discover.ts";
import { issuerMeta, type EntryEvent } from "./types.ts";
import type { CollectHit } from "./http-collect.ts";

export type NewlyCoveredIssuer = "nhbank" | "nhsec" | "kakaopaysec" | "shinhanbank" | "tossbank";
type OfficialPromotion = {
  url: string;
  title: string;
  benefit: string;
  start: string;
  end: string;
  identity: RegExp;
  /** Dates must appear in the same *current official publication*. */
  dateEvidence: RegExp;
  /** The actual reward must be present, not just a campaign-like heading. */
  benefitEvidence?: RegExp;
  entry: boolean;
};

/**
 * Official public announcements, not third-party search/news aggregators.
 * Sources are limited and explicitly verified; these do not constitute a
 * complete list of promotions across each bank or securities app.
 *
 * NH Bank news is published by its parent, NH Financial Group.
 */
export const PUBLIC_PROMOTIONS: Record<NewlyCoveredIssuer, readonly OfficialPromotion[]> = {
  nhbank: [
    // Backup public coverage when NH Financial Group pages time out.
    // These reports explicitly quote NH Bank's own promotion announcement.
    {
      url:"https://www.nongmin.com/article/20260916500215",
      title:"NH농협은행 가을엔 해외송금 받GO, 행운 받GO!",
      benefit:"해외송금 후 응모한 고객 500명 추첨 CU 모바일 상품권 5천원",
      start:"2026-09-16",end:"2026-10-31",
      identity:/가을엔\s*해외송금\s*받GO.{0,15}행운\s*받GO/i,
      dateEvidence:/(?:9월\s*)?16일부터\s*10월\s*31일까지/,
      entry:true,
    },
    {
      url:"https://www.nongmin.com/article/20261002500448",
      title:"NH농협은행 NH올원뱅크 10주년 페스타 사전 알림 신청",
      benefit:"10월 12일까지 사전 알림 신청 후 모바일 쿠폰 경품 11,111명 추첨",
      start:"2026-10-02",end:"2026-10-12",
      identity:/NH올원뱅크\s*10주년\s*페스타/,
      dateEvidence:/12일까지\s*신청하면|알림\s*신청\s*이벤트를?\s*12일까지|사전\s*알림\s*신청\s*이벤트/,
      entry:true,
    },
    {
      url:"https://www.nhfngroup.com/user/indexSub.do?boardId=4998475&boardSeq=5902505&command=albumView&dum=dum&framePath=unknownboard&page=1&siteId=nhfngroup",
      title:"NH농협은행 가을엔 해외송금 받GO, 행운 받GO!",
      benefit:"해외송금 받은 후 응모 시 500명 추첨 CU 모바일 상품권 5천원",
      start:"2026-09-16",end:"2026-10-31",
      identity:/가을엔\s*해외송금\s*받GO.{0,15}행운\s*받GO/i,
      dateEvidence:/9월\s*16일부터\s*10월\s*31일까지/,
      entry:true,
    },
    {
      url:"https://www.nhfngroup.com/user/indexSub.do?boardId=4998475&boardSeq=5901605&categoryDepth=&categoryId=&command=view&dum=dum&framePath=unknownboard&page=1&siteId=nhfngroup",
      title:"NH농협은행 NH청년 응원 BOOST!",
      benefit:"청년 예적금·대출 고객 경품, NH포인트·여행지원금 추첨",
      start:"2026-09-01",end:"2026-10-31",
      identity:/NH청년\s*응원\s*BOOST/i,
      dateEvidence:/9월\s*1일부터\s*10월\s*31일까지/,
      entry:false,
    },
    {
      url:"https://nhfngroup.com/user/indexSub.do?boardId=4998475&boardSeq=5901603&command=albumView&dum=dum&framePath=unknownboard&page=1&siteId=nhfngroup",
      title:"NH농협은행 주택청약종합저축 가을혜택·청약행운 이벤트",
      benefit:"주택청약종합저축 가입·자동이체 고객 3,000명 추첨 모바일 경품",
      start:"2026-09-01",end:"2026-10-31",
      identity:/가을혜택이\s*우수수.{0,30}청약행운이\s*와르르/,
      dateEvidence:/9월\s*1일부터\s*10월\s*31일까지/,
      entry:false,
    },
  ],
  shinhanbank: [
    {
      // Public report of Shinhan Bank's own Dangyeoyo campaign announcement.
      url:"https://www.newspim.com/news/view/20260930001079",
      title:"신한은행 땡겨요 땡배달 배달비 전액 지원",
      benefit:"땡겨요 땡배달 제휴 배달 이용 시 고객 배달비 전액 지원 (별도 쿠폰·응모 불필요)",
      start:"2026-10-01",end:"2026-12-31",
      identity:/신한은행.{0,75}땡겨요/,
      dateEvidence:/10월\s*1일부터\s*연말까지/,
      benefitEvidence:/배달비를?\s*전액\s*지원|배달비\s*전액\s*지원/,
      entry:false,
    },
  ],
  tossbank: [
    {
      // Company-launch event confirmed by press accounts. The event start
      // is 2026-07-30, and a start during the campaign permits 100 later saves.
      url:"https://www.edaily.co.kr/News/Read?mediaCodeNo=257&newsId=03407926645520096",
      title:"토스뱅크 외화 저금통 행운의 2달러",
      benefit:"행사 기간 외화 저금통 적립 시작 후 매일 1만원 이상 자동이체 100회 달성 시 2달러",
      start:"2026-07-30",end:"2026-10-30",
      identity:/토스뱅크.{0,250}외화\s*저금통/,
      dateEvidence:/7월\s*30일부터\s*10월\s*30일까지/,
      benefitEvidence:/100회.{0,65}2달러|2달러.{0,65}100회/,
      entry:false,
    },
    {
      url:"https://www.newspim.com/news/view/20260731000204",
      title:"토스뱅크 외화 저금통 행운의 2달러",
      benefit:"행사 기간 외화 저금통 적립 시작 후 매일 1만원 이상 자동이체 100회 달성 시 2달러",
      start:"2026-07-30",end:"2026-10-30",
      identity:/토스뱅크.{0,250}외화\s*저금통/,
      dateEvidence:/이벤트는?\s*10월\s*30일까지\s*운영|이벤트를?\s*10월\s*30일까지\s*진행/,
      benefitEvidence:/100회.{0,75}2달러|2달러.{0,75}100회/,
      entry:false,
    },
  ],
  nhsec: [
    {
      // NH Investment & Securities' DC campaign announcement, reported by
      // the National Agricultural Cooperative's own news publication.
      url:"https://www.nongmin.com/article/20261002500504",
      title:"NH투자증권 퇴직연금 DC 신규가입 경품 이벤트",
      benefit:"퇴직연금 DC 신규가입·최초 입금: 순입금 1천만원 이상 네이버페이 3만원, 미만 아메리카노 2매",
      start:"2026-10-01",end:"2027-01-31",
      identity:/NH투자증권.{0,145}퇴직연금.{0,35}DC/,
      dateEvidence:/10월\s*1일부터\s*2027년\s*1월\s*31일까지/,
      benefitEvidence:/네이버페이.{0,35}3만원/,
      entry:false,
    },
    {
      url:"https://www1.edaily.co.kr/News/Read?mediaCodeNo=257&newsId=03391526645608984",
      title:"NH투자증권 퇴직연금 DC 신규가입 경품 이벤트",
      benefit:"퇴직연금 DC 신규가입·최초 입금: 순입금 1천만원 이상 네이버페이 3만원, 미만 아메리카노 2매",
      start:"2026-10-01",end:"2027-01-31",
      identity:/NH투자증권.{0,145}퇴직연금.{0,35}DC/,
      dateEvidence:/2026년\s*10월\s*1일부터\s*2027년\s*1월\s*31일까지/,
      benefitEvidence:/네이버페이.{0,40}3만원/,
      entry:false,
    },
    {
      url:"https://www.mynamuh.com/tx/main.html",
      title:"나무증권 중개형 ISA 신규 개설 수수료 우대",
      benefit:"중개형 ISA 신규 개설 시 온라인 매매수수료 우대",
      start:"2026-02-01",end:"2027-01-31",
      identity:/중개형\s*ISA\s*시작은\s*나무로/,
      dateEvidence:/2026\.\s*02\.\s*01\s*[~–-]\s*2027\.\s*01\.\s*31/,
      entry:false,
    },
  ],
  kakaopaysec: [
    {
      url:"https://www.kakaopaysec.com/company/news_page/dynamicPage.do",
      title:"카카오페이증권 멜론 비트타는 주식 거래 MMA 티켓 추첨",
      benefit:"최근 2개월 주식 거래 이력이 없는 고객 중 추첨 70명에게 2026 MMA 티켓",
      start:"2026-09-22",end:"2026-10-23",
      identity:/비트타는\s*주식\s*거래.{0,20}이벤트/,
      dateEvidence:/10월\s*23일까지\s*주식\s*거래/,
      entry:true,
    },
  ],
};

export function verifyNewOfficialPromotion(
  issuer: NewlyCoveredIssuer, source: OfficialPromotion, html: string, today: string,
): EntryEvent | null {
  if (today < source.start || today > source.end) return null;
  const text = stripTags(visibleMarkup(html)).replace(/\s+/g, " ");
  if (!source.identity.test(text) || !source.dateEvidence.test(text) ||
    (source.benefitEvidence && !source.benefitEvidence.test(text))) return null;
  const rules = splitRules(stripTags(visibleMarkup(html)));
  return {
    id: issuer+":"+stableLinkId(source.url),
    issuer,
    title:source.title,
    summary:source.benefit,
    benefit:source.benefit,
    conditions:rules.conditions,
    exclusions:rules.exclusions,
    startDate:source.start,
    endDate:source.end,
    applyUrl:source.url,
    listUrl:issuerMeta(issuer).listUrl,
    entry:source.entry,
  };
}

/** 7s timeouts, at most 3 in flight, no browser or login/captcha bypass. */
export async function collectNewOfficialSource(issuer:NewlyCoveredIssuer,today:string):Promise<CollectHit>{
  const sources=PUBLIC_PROMOTIONS[issuer];
  const responses=await mapPool([...sources],3,async(source)=>{
    try{
      const html=await fetchText(source.url,{},7000);
      return {reached:true,event:verifyNewOfficialPromotion(issuer,source,html,today)};
    }catch{return {reached:false,event:null};}
  });
  const events=[...new Map(responses.flatMap(x=>x.event?[x.event]:[]).map(e=>[e.title,e])).values()];
  const reached=responses.filter(x=>x.reached).length;
  return {
    issuer,
    ok:events.length>0,
    events,
    message:events.length>0
      ? "금융사 공식 자료·공식 발표 보도 "+sources.length+"곳 중 행사 내용·기간을 확인한 "+events.length+
        "건입니다 (접속 "+reached+"/"+sources.length+"). 일부 공개 행사만 수집합니다."
      : "공식 공개 자료 "+sources.length+"곳에서 현재 진행 중인 행사를 검증하지 못했습니다. 마지막 목록을 유지합니다.",
  };
}
