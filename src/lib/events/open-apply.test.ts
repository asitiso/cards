import test from "node:test";
import assert from "node:assert/strict";
import { appSchemeIntent } from "./open-apply.ts";

test("Android uses official Woori app scheme and package with Play Store fallback",()=>{
 const fallback="https://play.google.com/store/apps/details?id=com.wooricard.smartapp";
 const intent=appSchemeIntent("com.wooricard.wcard","com.wooricard.smartapp",fallback);
 assert.equal(intent,
   "intent://#Intent;scheme=com.wooricard.wcard;package=com.wooricard.smartapp;S.browser_fallback_url="+
   encodeURIComponent(fallback)+";end");
 assert.equal(intent.includes("pc.wooricard.com"),false);
});
test("Only valid app scheme and Android package can become intent URLs",()=>{
 assert.throws(()=>appSchemeIntent("a;S.x=1","com.wooricard.smartapp","https://example.com"));
 assert.throws(()=>appSchemeIntent("com.wooricard.wcard","bad;package=evil","https://example.com"));
});
