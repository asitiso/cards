import test from "node:test";
import assert from "node:assert/strict";
import { validateCollection, suddenDrop } from "./quality.ts";
import type { CollectHit } from "./http-collect.ts";

const base = {
  id:"mirae:stable-id",issuer:"mirae" as const,title:"정상 행사입니다",
  summary:"최소 조건 설명",benefit:"쿠폰",conditions:[],exclusions:[],
  startDate:"2026-10-01",endDate:"2026-10-31",
  applyUrl:"https://example.com/offer",listUrl:"https://example.com",
};
const hit: CollectHit = { issuer:"mirae",ok:true,message:"수집 성공",events:[base] };
test("empty HTML extraction is not a proven absence of events",()=>{
 assert.equal(validateCollection({...hit,events:[]}).ok,false);
});
test("valid batch is unchanged",()=>{assert.equal(validateCollection(hit).ok,true)});
test("duplicate item ids fail closed",()=>{
 assert.equal(validateCollection({...hit,events:[base,{...base}]}).ok,false);
});
test("malformed dates fail closed",()=>{
 assert.equal(validateCollection({...hit,events:[{...base,endDate:"?"}]}).ok,false);
});
test("sudden decrease blocks bulk false removals",()=>{
 assert.equal(suddenDrop(21,3),true);
 assert.equal(suddenDrop(21,14),false);
 assert.equal(suddenDrop(0,0),false);
});


test("reject impossible calendar dates even with correct format",()=>{
 assert.equal(validateCollection({...hit,events:[{...base,endDate:"2026-02-30"}]}).ok,false);
});
test("detect partial responses that lost 4 of 20 ongoing promotions",async()=>{
 const { suspiciousMissingOngoing }=await import("./quality.ts");
 const old=Array.from({length:20},(_,i)=>({id:"mirae:"+i,endDate:"2026-10-31"}));
 const incoming=old.slice(0,16);
 assert.equal(suspiciousMissingOngoing(old,incoming,"2026-10-09").suspicious,true);
 assert.equal(suspiciousMissingOngoing(old,old.slice(0,19),"2026-10-09").suspicious,false);
 assert.equal(suspiciousMissingOngoing([{id:"a",endDate:"2026-10-01"}],[],"2026-10-09").suspicious,false);
});
test("unverified list result must not erase previously checked event terms",async()=>{
 const { mergeUnverifiedDetails }=await import("./quality.ts");
 const old={...base,summary:"신규 고객은 이벤트 응모 후 10만원 이상 결제",benefit:"네이버페이 3만원 경품 지급",conditions:["이벤트 대상: 신규 가입 고객이며 행사 기간 내 응모 필수"],exclusions:["기존 고객은 경품 지급에서 제외됩니다."],entry:true};
 const weak={...base,summary:base.title,benefit:"원문에서 조건 확인",conditions:["개인신용정보이용/제공내역조회"],exclusions:[],entry:false,detailUnverified:true};
 const merged=mergeUnverifiedDetails(old,weak);
 assert.equal(merged.summary,old.summary);
 assert.equal(merged.benefit,old.benefit);
 assert.deepEqual(merged.conditions,old.conditions);
 assert.deepEqual(merged.exclusions,old.exclusions);
 assert.equal(merged.entry,true);
 assert.equal(mergeUnverifiedDetails(old,{...weak,title:"새로운 행사"})?.conditions[0],weak.conditions[0]);
 assert.equal(mergeUnverifiedDetails(old,{...weak,detailUnverified:false})?.entry,false);
});
