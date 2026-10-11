import test from "node:test";
import assert from "node:assert/strict";
import { eventAppLaunch } from "./event-navigation.ts";

test("Woori campaign buttons use its official Android and iOS app identifiers",()=>{
  assert.deepEqual(eventAppLaunch("woori"), {
    androidPackage:"com.wooricard.smartapp",
    iosAppId:"1499598869",
    mode:"app",
    appScheme:"com.wooricard.wcard",
  });
});
test("Other card, bank and securities campaign actions retain their original web behavior",()=>{
  for (const issuer of ["shinhan","samsung","kb","mirae","tosssec","nhbank"] as const)
    assert.equal(eventAppLaunch(issuer),null);
});
