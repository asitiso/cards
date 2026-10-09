import { fetchText, mapPool, splitRules, stripTags, visibleMarkup } from "./html.ts";
import { stableLinkId } from "./discover.ts";
import { issuerMeta, type EntryEvent } from "./types.ts";
import type { CollectHit } from "./http-collect.ts";

export type NewlyCoveredIssuer = "nhbank" | "nhsec" | "kakaopaysec";
type OfficialPromotion = {
  url: string;
  title: string;
  benefit: string;
  start: string;
  end: string;
  identity: RegExp;
  /** Dates must appear in the same *current official publication*. */
  dateEvidence: RegExp;
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
  nhsec: [
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
  if (!source.identity.test(text) || !source.dateEvidence.test(text)) return null;
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
  const events=responses.flatMap(x=>x.event?[x.event]:[]);
  const reached=responses.filter(x=>x.reached).length;
  return {
    issuer,
    ok:events.length>0,
    events,
    message:events.length>0
      ? "공식 공개 자료 "+sources.length+"곳 중 행사 내용·기간을 확인한 "+events.length+
        "건입니다 (접속 "+reached+"/"+sources.length+"). 일부 공개 행사만 수집합니다."
      : "공식 공개 자료 "+sources.length+"곳에서 현재 진행 중인 행사를 검증하지 못했습니다. 마지막 목록을 유지합니다.",
  };
}
