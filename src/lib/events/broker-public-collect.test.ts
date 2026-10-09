import test from "node:test";
import assert from "node:assert/strict";
import { verifyPublicBrokerPage } from "./broker-public-collect.ts";

const kiwoom = {
  url:"https://www.kiwoom.com/e/wm/event/evtUserEC260050View",
  title:"키움에서 채권을 만나는 3가지 방법",benefit:"채권 혜택",
  start:"2026-07-24",end:"2026-10-22",
  identity:/키움.{0,20}채권/,
  period:/이벤트\s*기간\s*[:：]?\s*2026년\s*7월\s*24일[\s\S]{0,55}2026년\s*10월\s*22일/,
};

test("verifies real event dates on the official linked page",()=>{
  const html="<main>키움 채권 이벤트 <p>이벤트 기간: 2026년 7월 24일(금) ~ 2026년 10월 22일(목)</p> 이벤트 신청</main>";
  const e=verifyPublicBrokerPage("kiwoom",kiwoom,html,"2026-10-09");
  assert.equal(e?.issuer,"kiwoom");
  assert.equal(e?.endDate,"2026-10-22");
});
test("blocks a repurposed page that no longer carries the campaign",()=>{
  const html="<main>키움 채권 이벤트</main>";
  assert.equal(verifyPublicBrokerPage("kiwoom",kiwoom,html,"2026-10-09"),null);
});
test("blocks stale events after the published campaign closes",()=>{
  const html="<main>키움 채권 이벤트 기간: 2026년 7월 24일(금) ~ 2026년 10월 22일(목)</main>";
  assert.equal(verifyPublicBrokerPage("kiwoom",kiwoom,html,"2026-10-23"),null);
});
test("never guesses when the page contains only compliance dates",()=>{
  const html="<main>키움 채권 이벤트 준법심사필 2026.07.23~2027.07.22</main>";
  assert.equal(verifyPublicBrokerPage("kiwoom",kiwoom,html,"2026-10-09"),null);
});
