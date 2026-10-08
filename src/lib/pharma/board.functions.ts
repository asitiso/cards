import { createServerFn } from "@tanstack/react-start";
import {
  addPharmaCompany,
  clearPharmaLogin,
  deletePharmaCompany,
  loadPharmaBoard,
  refreshPharma,
  savePharmaLogin,
  updatePharmaCompany,
} from "./store.server.ts";

export const getPharmaBoard = createServerFn({ method: "GET" }).handler(async () => loadPharmaBoard());

export const reloadPharma = createServerFn({ method: "POST" })
  .validator((data: { companyId?: string } | undefined) => ({ companyId: data?.companyId ?? "" }))
  .handler(async ({ data }) => refreshPharma(data.companyId || undefined));

export const storePharmaLogin = createServerFn({ method: "POST" })
  .validator((data: { companyId: string; username: string; password: string }) => ({
    companyId: String(data.companyId ?? ""),
    username: String(data.username ?? ""),
    password: String(data.password ?? ""),
  }))
  .handler(async ({ data }) => savePharmaLogin(data.companyId, data.username, data.password));

export const removePharmaLogin = createServerFn({ method: "POST" })
  .validator((data: { companyId: string }) => ({ companyId: String(data.companyId ?? "") }))
  .handler(async ({ data }) => clearPharmaLogin(data.companyId));

export const createPharmaCompany = createServerFn({ method: "POST" })
  .validator((data: { name: string; loginUrl: string }) => ({
    name: String(data.name ?? ""),
    loginUrl: String(data.loginUrl ?? ""),
  }))
  .handler(async ({ data }) => addPharmaCompany(data.name, data.loginUrl));

export const editPharmaCompany = createServerFn({ method: "POST" })
  .validator((data: { companyId: string; name: string; loginUrl: string }) => ({
    companyId: String(data.companyId ?? ""),
    name: String(data.name ?? ""),
    loginUrl: String(data.loginUrl ?? ""),
  }))
  .handler(async ({ data }) => updatePharmaCompany(data.companyId, data.name, data.loginUrl));

export const removePharmaCompany = createServerFn({ method: "POST" })
  .validator((data: { companyId: string }) => ({ companyId: String(data.companyId ?? "") }))
  .handler(async ({ data }) => deletePharmaCompany(data.companyId));
