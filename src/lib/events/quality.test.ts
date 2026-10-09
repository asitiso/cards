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
