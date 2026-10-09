import { fetchText, mapPool, splitRules, stripTags, visibleMarkup } from "./html.ts";
import { stableLinkId } from "./discover.ts";
import { issuerMeta, type EntryEvent } from "./types.ts";
import type { CollectHit } from "./http-collect.ts";

export type CoveredBroker = "kiwoom" | "shinhansec";
type PublicCampaign = {
  url: string;
  title: string;
  benefit: string;
  start: string;
  end: string;
  /** Must appear in the actual current public page, not search snippets. */
  identity: RegExp;
  /** Explicit campaign-date evidence, distinct from approval/compliance dates. */
  period: RegExp;
};

/**
 * Confirmed public campaign pages.  This is a bounded supplement for brokers
 * whose public homepage does not expose a usable event feed. It is NOT a
 * complete event index. Never infer events or use stale cached pages.
 */
const SOURCES: Record<CoveredBroker, PublicCampaign[]> = {
  kiwoom: [
    {
      url:"https://www.kiwoom.com/e/wm/event/evtUserEC260050View",
      title:"키움에서 채권을 만나는 3가지 방법",
      benefit:"채권 첫 거래 쿠폰 및 매수·입고 상품권 혜택",
      start:"2026-07-24", end:"2026-10-22",
      identity:/키움.{0,20}채권|채권.{0,25}이벤트/,
      period:/이벤트\s*기간\s*[:：]?\s*2026년\s*7월\s*24일[\s\S]{0,55}2026년\s*10월\s*22일/,
    },
    {
      url:"https://www.kiwoom.com/e/wm/event/evtUserEC260082View",
      title:"키움 발행어음 투자하고 행운을 발행",
      benefit:"발행어음 투자 후 최대 20만원 현금 추첨",
      start:"2026-10-02", end:"2026-12-31",
      identity:/발행어음.{0,35}(행운|추첨|20만원)/,
      period:/이벤트\s*기간\s*[:：]?\s*2026년\s*10월\s*2일[\s\S]{0,55}2026년\s*12월\s*31일/,
    },
    {
      url:"https://www.kiwoom.com/e/home/event/VEvent20260086View?dummyVal=0",
      title:"키움 국내 개별주식 선물 지원금 추첨 이벤트",
      benefit:"국내 주식선물 거래 고객 대상 추첨 혜택",
      start:"2026-09-14", end:"2026-10-30",
      identity:/개별주식\s*선물|주식선물로\s*환승/,
      period:/2026\.09\.14[\s\S]{0,45}2026\.10\.30/,
    },
  ],
  shinhansec: [
    {
      url:"https://www.shinhansec.com/cms/contents/event/261001_IRP_pc.html",
      title:"신한투자증권 IRP 이벤트 최대 3만원 혜택",
      benefit:"IRP 신규 개설·입금 이벤트 최대 3만원",
      start:"2026-10-01", end:"2026-12-31",
      identity:/IRP.{0,65}(신규|이벤트)|신규.{0,45}IRP/,
      period:/2026\.10\.01[\s\S]{0,45}2026\.12\.31/,
    },
    {
      url:"https://open.shinhansec.com/cms/contents/event/261001_isa_mo.html",
      title:"신한투자증권 중개형 ISA 이벤트",
      benefit:"중개형 ISA 개설·순입금·ETF 거래 혜택",
      start:"2026-10-01", end:"2026-12-31",
      identity:/중개형\s*ISA/,
      period:/2026\.10\.01[\s\S]{0,45}12\.31/,
    },
  ],
};

export function verifyPublicBrokerPage(
  issuer: CoveredBroker, source: PublicCampaign, html: string, today: string,
): EntryEvent | null {
  const text=stripTags(visibleMarkup(html)).replace(/\s+/g," ");
  if(!source.identity.test(text) || !source.period.test(text)) return null;
  // The published range is explicitly tied to this URL and must be
  // corroborated by on-page campaign date evidence every refresh.
  if(today < source.start || today > source.end) return null;
  const rules=splitRules(stripTags(visibleMarkup(html)));
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
    entry:/응모|신청|추첨|쿠폰/.test(text),
  };
}

export async function collectPublicBroker(issuer:CoveredBroker,today:string):Promise<CollectHit>{
  const sources=SOURCES[issuer];
  const result=await mapPool(sources,3,async(s)=>{
    try{
      const page=await fetchText(s.url,{},7500);
      return {ok:true,event:verifyPublicBrokerPage(issuer,s,page,today)};
    }catch{
      return {ok:false,event:null};
    }
  });
  const events=result.flatMap(x=>x.event?[x.event]:[]);
  const opened=result.filter(x=>x.ok).length;
  return {
    issuer,
    ok:events.length>0,
    events,
    message:events.length>0
      ? "공식 공개 상세 "+sources.length+"곳 중 진행 기간과 본문이 검증된 "+events.length+
        "건 (접속 "+opened+"/"+sources.length+"). 전체 행사 목록 아님."
      : "공개 행사 페이지 "+sources.length+"곳에서 현재 행사 검증에 실패했습니다. 이전 자료를 유지합니다.",
  };
}
