import { createServerFn } from "@tanstack/react-start";
import { fetchIpoDetailsBatch } from "./verified-detail.server.ts";

export const getIpoDetailsBatch = createServerFn({ method: "POST" })
  .validator((data: {
    items: { id: string; name: string; subscriptionStart: string;
      offerPrice: number | null; brokers: string[] }[];
  }) => ({
    items: Array.isArray(data?.items) ? data.items.slice(0, 35).map(item => ({
      id: String(item?.id ?? "").slice(0, 110),
      name: String(item?.name ?? "").slice(0, 100),
      subscriptionStart: String(item?.subscriptionStart ?? "").slice(0, 15),
      offerPrice: typeof item?.offerPrice === "number" ? item.offerPrice : null,
      brokers: Array.isArray(item?.brokers)
        ? item.brokers.filter((x): x is string => typeof x === "string").slice(0, 8)
        : [],
    })) : [],
  }))
  .handler(async ({ data }) => fetchIpoDetailsBatch(data.items));
