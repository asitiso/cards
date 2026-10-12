import { createServerFn } from "@tanstack/react-start";
import { fetchIpoTerms } from "./terms.server.ts";

export const getIpoTerms = createServerFn({ method: "POST" })
  .validator((data: { url: string; name: string }) => ({
    url: String(data?.url ?? ""),
    name: String(data?.name ?? ""),
  }))
  .handler(async ({ data }) => fetchIpoTerms(data.url, data.name));
