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
 const item=PUBLIC_PROMOTIONS.nhbank[2];
 const page="<div>가을혜택이 우수수, 청약행운이 와르르! 9월 1일부터 10월 31일까지 이벤트</div>";
 assert.equal(verifyNewOfficialPromotion("nhbank",item,page,"2026-11-01"),null);
});
test("NH Securities ISA fee reduction is not an application-required event",()=>{
 const item=PUBLIC_PROMOTIONS.nhsec[0];
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
