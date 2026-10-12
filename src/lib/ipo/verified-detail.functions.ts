import { createServerFn } from "@tanstack/react-start";
import { fetchVerifiedIpoDetail } from "./verified-detail.server.ts";

export const getVerifiedIpoDetail = createServerFn({ method: "POST" })
  .validator((data: {
    name: string; subscriptionStart: string; offerPrice: number | null;
    brokers: string[];
  }) => ({
    name: String(data?.name ?? "").slice(0, 100),
    subscriptionStart: String(data?.subscriptionStart ?? "").slice(0, 15),
    offerPrice: typeof data?.offerPrice === "number" ? data.offerPrice : null,
    brokers: Array.isArray(data?.brokers) ? data.brokers
      .filter((s): s is string => typeof s === "string").slice(0, 10) : [],
  }))
  .handler(async ({ data }) => fetchVerifiedIpoDetail(data));
