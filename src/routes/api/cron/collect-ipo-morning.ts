import { createFileRoute } from "@tanstack/react-router";
import { handleIpoCron } from "@/lib/ipo/cron-handler.server.ts";

/** Separate from the 08:00 finance collector; 23:00 UTC = 08:00 KST. */
export const Route = createFileRoute("/api/cron/collect-ipo-morning")({
  server: { handlers: { GET: async ({ request }) => handleIpoCron(request) } },
});
