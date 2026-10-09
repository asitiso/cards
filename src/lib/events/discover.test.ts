import test from "node:test";
import assert from "node:assert/strict";
import { findDatedEventLinks, findEventIndexPages, stableLinkId } from "./discover.ts";

test("stable IDs follow URLs, never list order",()=>{
  assert.equal(stableLinkId("https://bank.example.com/event/a"),stableLinkId("https://bank.example.com/event/a"));
  assert.notEqual(stableLinkId("https://bank.example.com/event/a"),stableLinkId("https://bank.example.com/event/b"));
});
test("visible official same-domain dated offer is extracted",()=>{
 const html='<div><a href="/event/123">10월 계좌개설 캐시백 이벤트</a><span>2026.10.01 ~ 2026.10.31</span></div>';
 const found=findDatedEventLinks(html,"https://bank.example.com/","2026-10-09");
 assert.equal(found.length,1);
 assert.equal(found[0].end,"2026-10-31");
});
test("external, undated and expired links do not generate speculative events",()=>{
 const html='<a href="https://evil.example/offers">10월 이벤트</a>2026.10.01 ~ 2026.10.31'
 +'<a href="/event/expired">작년 이벤트</a>2025.01.01 ~ 2025.01.31'
 +'<a href="/event/future">무기한 신규 이벤트</a>';
 assert.deepEqual(findDatedEventLinks(html,"https://bank.example.com/","2026-10-09"),[]);
});
test("event navigation is capped to two same-domain pages",()=>{
 const html='<a href="/event">이벤트</a><a href="/benefit">혜택 전체보기</a><a href="/promotion">진행중 이벤트</a><a href="https://othersite.com/ev">이벤트</a>';
 const found=findEventIndexPages(html,"https://bank.example.com/");
 assert.equal(found.length,2);
 assert.ok(found.every(url=>url.startsWith("https://bank.example.com/")));
});
