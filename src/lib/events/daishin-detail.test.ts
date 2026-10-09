import test from "node:test";
import assert from "node:assert/strict";
import { daishinDetailIsUnverified } from "./daishin-detail.ts";

test("the actual Daishin client-side template is not promotion-specific evidence",()=>{
  const shell="개인신용정보이용/제공내역조회 \n {{event.title}} \n 기간 {{yymmddhhmm(event.start_date)}}~{{yymmddhhmm(event.end_date)}} 조기 종료된 이벤트입니다.";
  assert.equal(daishinDetailIsUnverified(shell,"고배당 투자에 혜택을 더하다"),true);
});
test("matching rendered detail can be inspected",()=>{
  assert.equal(daishinDetailIsUnverified("고배당 투자에 혜택을 더하다 \n신규 고객 대상 이벤트 10만원 캐시백","고배당 투자에 혜택을 더하다"),false);
});
test("a global navigation shell is not valid even without handlebars",()=>{
  assert.equal(daishinDetailIsUnverified("고객센터 로그인 메뉴보기 기간예약주문내역","IRP 이전/납입 이벤트"),true);
});
