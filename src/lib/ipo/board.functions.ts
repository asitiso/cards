import { createServerFn } from "@tanstack/react-start";
import { loadIpoBoard } from "./kind-source.ts";
import { readIpoSnapshot, refreshIpoSnapshot } from "./snapshot.server.ts";

// Finance home is independent: IPO data is loaded only after selecting ㄱㅁ.
// Most tab opens need one fast DB read, never a live crawl.
export const getIpoBoard = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const saved = await readIpoSnapshot();
    if (saved) return saved;
  } catch { /* Missing DB -> preserve existing IPO-only live fallback. */ }
  return loadIpoBoard();
});

// Explicit reload does a fresh check; on failure retain the last valid board.
export const reloadIpoBoard = createServerFn({ method: "POST" }).handler(async () => {
  try { return await refreshIpoSnapshot(); }
  catch (err) {
    const message = err instanceof Error ? err.message : "갱신 실패";
    try {
      const previous = await readIpoSnapshot();
      if (previous) return { ...previous,
        message: "새 자료 확인 실패 (" + message + "). 마지막 정상 자료를 표시합니다. " +
          previous.message };
    } catch { /* Fall through to current isolated fallback. */ }
    return loadIpoBoard();
  }
});
