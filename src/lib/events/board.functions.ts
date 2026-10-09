import { createServerFn } from "@tanstack/react-start";
import { loadBoard, refreshBoard } from "./store.server.ts";
import { recentChanges } from "@/lib/change-history/store.server";

export const getBoard = createServerFn({ method: "GET" }).handler(async () => loadBoard());

export const reloadBoard = createServerFn({ method: "POST" }).handler(async () => refreshBoard());

/** Fetch the newest change history only when its panel is opened. */
export const getFinanceChanges = createServerFn({ method: "GET" }).handler(async () => recentChanges("finance"));
