import assert from "node:assert/strict";
import test from "node:test";
import { classifyKind, extractOffers, findLoginForm } from "./collect.ts";
import { decryptText, encryptText, newPharmaKey } from "./secret.ts";

test("classify keeps 응모, 할인, 신제품 only", () => {
  assert.equal(classifyKind("가을 신제품 출시"), "new");
  assert.equal(classifyKind("이벤트 응모하기"), "entry");
  assert.equal(classifyKind("10월 할인전"), "sale");
  assert.equal(classifyKind("일반 공지"), null);
});

test("login form picks the password form", () => {
  const html = `
    <form action="/member/login" method="post">
      <input type="hidden" name="csrf" value="abc" />
      <input type="text" name="userId" />
      <input type="password" name="userPw" />
    </form>`;
  const form = findLoginForm(html, "https://mall.example/login");
  assert.equal(form?.userField, "userId");
  assert.equal(form?.passField, "userPw");
  assert.equal(form?.action, "https://mall.example/member/login");
  assert.equal(form?.method, "post");
});

test("extracts dated offers and skips ended ones", () => {
  const html = `
    <a href="/event/1">가을 신제품 출시 2026.10.01 ~ 2026.10.31</a>
    <a href="/event/2">지난 할인전 2026.01.01 ~ 2026.01.31</a>
    <a href="/login">로그인</a>`;
  const events = extractOffers(html, "https://mall.example/", "pico", "2026-10-08");
  assert.equal(events.length, 1);
  assert.equal(events[0]?.kind, "new");
  assert.equal(events[0]?.endDate, "2026-10-31");
});

test("password roundtrip", () => {
  const key = newPharmaKey();
  assert.equal(decryptText(encryptText("secret-1", key), key), "secret-1");
});
