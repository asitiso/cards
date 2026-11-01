import { createFileRoute } from "@tanstack/react-router";
import { handleIpoCron } from "@/lib/ipo/cron-handler.server.ts";

/** Separate from the 20:00 finance collector; 11:00 UTC = 20:00 KST. */
export const Route = createFileRoute("/api/cron/collect-ipo-evening")({
  server: { handlers: { GET: async ({ request }) => handleIpoCron(request) } },
});
