import { createServerFn } from "@tanstack/react-start";
import { loadBoard, refreshBoard } from "./store.server.ts";

export const getBoard = createServerFn({ method: "GET" }).handler(async () => loadBoard());

export const reloadBoard = createServerFn({ method: "POST" }).handler(async () => refreshBoard());
