import test from "node:test";
import assert from "node:assert/strict";
import { tossPressLinks, verifiedTossPressEvent } from "./tosssec-collect.ts";

const target="https://corp.tossinvest.com/ko/news-room/detail?id=53191";
const link={url:target,title:"토스증권, 올리브영과 손잡고 고객 대상 제휴 이벤트 진행"};

test("official newsroom promotion links only; no external or notices",()=>{
 const html='<a href="/ko/news-room/detail?id=53191">토스증권, 올리브영과 제휴 이벤트 진행</a>' +
 '<a href="https://othersite.com/ko/news-room/detail?id=12345">토스증권 포인트 캐시백 이벤트</a>' +
 '<a href="/ko/post?category=52&id=25026&type=notice">원화 이자 변경 이벤트</a>';
 const links=tossPressLinks(html);
 assert.equal(links.length,1);
 assert.equal(links[0].url,target);
});

test("expired August promotion never becomes active in October",()=>{
 const html='<article>토스증권 올리브영 제휴 이벤트. 이벤트 기간: 2026.08.20 ~ 2026.09.05. '+
 '신규 고객에게 올리브영 모바일 상품권 2만원 증정</article>';
 assert.equal(verifiedTossPressEvent(link,html,"2026-10-09"),null);
});

test("two explicit event dates and benefit are required",()=>{
 const html='<main>토스증권 올리브영 고객 제휴 이벤트. 행사 기간: 2026.10.01 ~ 2026.10.31. '+
 '신규 고객 대상 올리브영 모바일 상품권 2만원 지급.</main>';
 const item=verifiedTossPressEvent(link,html,"2026-10-09");
 assert.equal(item?.issuer,"tosssec");
 assert.equal(item?.endDate,"2026-10-31");
 assert.equal(item?.applyUrl,target);
 assert.equal(verifiedTossPressEvent(link,html.replace("행사 기간:","게시일:"),"2026-10-09"),null);
});

test("stock-price notice and compliance period are not reward promotions",()=>{
 const html='<main>토스증권 올리브영 이벤트 관련 공시 심사 기간: 2026.10.01 ~ 2026.10.31 '+
 '신규 수수료 0.1% 적용</main>';
 assert.equal(verifiedTossPressEvent(link,html,"2026-10-09"),null);
});

test("one-sided dates must never invent a deadline",()=>{
 const html='<main>토스증권 올리브영 이벤트 행사 기간 2026.10.01부터 신규 고객에게 '+
 '올리브영 모바일 상품권 2만원을 지급해요</main>';
 assert.equal(verifiedTossPressEvent(link,html,"2026-10-09"),null);
});
