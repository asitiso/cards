import test from "node:test";
import assert from "node:assert/strict";
import { PUBLIC_PROMOTIONS, verifyNewOfficialPromotion } from "./official-public-sources.ts";

test("NH Bank promotions require exact matching official period",()=>{
 const item=PUBLIC_PROMOTIONS.nhbank[0];
 const page="<main>NH농협은행 가을엔 해외송금 받GO, 행운 받GO! 이벤트 9월 16일부터 10월 31일까지 진행. 해외송금 후 응모</main>";
 const valid=verifyNewOfficialPromotion("nhbank",item,page,"2026-10-09");
 assert.equal(valid?.issuer,"nhbank");
 assert.equal(valid?.endDate,"2026-10-31");
 assert.equal(verifyNewOfficialPromotion("nhbank",item,page.replace("10월 31일까지","9월 30일까지"),"2026-10-09"),null);
});
test("do not count stale promotions after expiry",()=>{
 const item=PUBLIC_PROMOTIONS.nhbank.find(p=>p.title.includes("청약행운"))!;
 const page="<div>가을혜택이 우수수, 청약행운이 와르르! 9월 1일부터 10월 31일까지 이벤트</div>";
 assert.equal(verifyNewOfficialPromotion("nhbank",item,page,"2026-11-01"),null);
});
test("NH Securities ISA fee reduction is not an application-required event",()=>{
 const item=PUBLIC_PROMOTIONS.nhsec.find(p=>p.title.includes("ISA"))!;
 const page="<div>중개형 ISA 시작은 나무로! 기간 : 2026.02.01~2027.01.31</div>";
 const valid=verifyNewOfficialPromotion("nhsec",item,page,"2026-10-09");
 assert.equal(valid?.entry,false);
 assert.equal(verifyNewOfficialPromotion("nhsec",item,page.replace("2027.01.31","2025.01.31"),"2026-10-09"),null);
});
test("KakaoPay Securities newsroom event requires on-page MMA announcement",()=>{
 const item=PUBLIC_PROMOTIONS.kakaopaysec[0];
 const page="<div>카카오페이증권, 멜론과 비트타는 주식 거래 이벤트... 2026 MMA 티켓 추첨. 최근 2개월 주식 거래 없던 사용자 대상... 10월 23일까지 주식 거래 시 70명 추첨해 티켓 증정. 2026.09.23</div>";
 const valid=verifyNewOfficialPromotion("kakaopaysec",item,page,"2026-10-09");
 assert.equal(valid?.issuer,"kakaopaysec");
 assert.equal(valid?.entry,true);
 assert.equal(verifyNewOfficialPromotion("kakaopaysec",item,page.replace("비트타는","다른"),"2026-10-09"),null);
});

test("Shinhan Bank requires free-delivery dates and real benefit evidence", () => {
  const p=PUBLIC_PROMOTIONS.shinhanbank[0];
  const text="<article>신한은행은 땡겨요 1000만 고객 이벤트를 발표했다. 10월 1일부터 연말까지 땡배달 고객 배달비를 전액 지원한다.</article>";
  const good=verifyNewOfficialPromotion("shinhanbank",p,text,"2026-10-09");
  assert.equal(good?.endDate,"2026-12-31");
  assert.equal(good?.entry,false);
  assert.equal(verifyNewOfficialPromotion("shinhanbank",p,text.replace("배달비를 전액 지원","할인을 제공"),"2026-10-09"),null);
});
test("Toss Bank's 2 USD campaign rejects news lacking amount or correct deadline", () => {
  const p=PUBLIC_PROMOTIONS.tossbank[1];
  const text="<article>토스뱅크는 외화 저금통을 출시했다. 100회 적립 시 2달러를 지급한다. 이벤트는 10월 30일까지 운영된다.</article>";
  assert.equal(verifyNewOfficialPromotion("tossbank",p,text,"2026-10-09")?.endDate,"2026-10-30");
  assert.equal(verifyNewOfficialPromotion("tossbank",p,text.replace("2달러","3달러"),"2026-10-09"),null);
});
test("NH Investment DC campaign checks event terms beyond compliance date", () => {
  const p=PUBLIC_PROMOTIONS.nhsec[0];
  const text="<article>NH투자증권 퇴직연금 DC 신규가입 이벤트는 10월1일부터 2027년 1월31일까지 진행된다. 네이버페이 모바일 금액권 3만원 지급.</article>";
  assert.equal(verifyNewOfficialPromotion("nhsec",p,text,"2026-10-09")?.endDate,"2027-01-31");
  assert.equal(verifyNewOfficialPromotion("nhsec",p,text.replace("네이버페이","다른 경품"),"2026-10-09"),null);
});
