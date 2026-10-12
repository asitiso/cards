import { createServerFn } from "@tanstack/react-start";
import { loadIpoBoard } from "./kind-source.ts";

// Deliberately independent: neither the homepage loader nor finance refresh
// touches the IPO source. It is fetched only after users select ㄱㅁ.
export const getIpoBoard = createServerFn({ method: "GET" }).handler(async () => loadIpoBoard());
export const reloadIpoBoard = createServerFn({ method: "POST" }).handler(async () => loadIpoBoard());
