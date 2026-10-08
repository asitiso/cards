import assert from "node:assert/strict";
import test from "node:test";
import { diffEventLists } from "./diff.ts";

type Sample = { id: string; title: string; summary: string; conditions: string[] };
const fields: ReadonlyArray<readonly [keyof Sample, string]> = [
  ["title", "제목"],
  ["summary", "내용"],
  ["conditions", "조건"],
];

test("new, updated and removed events are classified correctly", () => {
  const previous: Sample[] = [
    { id: "a", title: "행사 A", summary: "기존", conditions: ["1"] },
    { id: "b", title: "행사 B", summary: "고정", conditions: [] },
    { id: "c", title: "행사 C", summary: "종료", conditions: [] },
  ];
  const incoming: Sample[] = [
    { id: "a", title: "행사 A", summary: "수정", conditions: ["1", "2"] },
    { id: "b", title: "행사 B", summary: "고정", conditions: [] },
    { id: "d", title: "행사 D", summary: "신규", conditions: [] },
  ];
  assert.deepEqual(diffEventLists(previous, incoming, fields), [
    { eventId: "a", title: "행사 A", action: "updated", fields: ["내용", "조건"] },
    { eventId: "d", title: "행사 D", action: "added", fields: [] },
    { eventId: "c", title: "행사 C", action: "removed", fields: [] },
  ]);
});

test("identical data and display reordering do not create records", () => {
  const a: Sample = { id: "a", title: "행사 A", summary: "같음", conditions: ["고정"] };
  const b: Sample = { id: "b", title: "행사 B", summary: "같음", conditions: [] };
  assert.deepEqual(diffEventLists([a, b], [b, a], fields), []);
});

test("repeated collection after applying a change records nothing", () => {
  const after: Sample[] = [{ id: "a", title: "행사 A", summary: "신규", conditions: [] }];
  assert.deepEqual(diffEventLists(after, after, fields), []);
});
