import { createFileRoute } from "@tanstack/react-router";
import { refreshBoard } from "@/lib/events/store.server";

/** 20:00 KST = 11:00 UTC. Finance-only refresh. */
export const Route = createFileRoute("/api/cron/collect-evening")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const secret = process.env.CRON_SECRET;
        if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
          return new Response("unauthorized", { status: 401 });
        }
        try {
          const board = await refreshBoard();
          return Response.json({
            ok: true,
            collectedAt: board.collectedAt,
            count: board.events.length,
            category: "finance",
          });
        } catch (error) {
          return Response.json({
            ok: false,
            message: error instanceof Error ? error.message : "finance collection failed",
          }, { status: 500 });
        }
      },
    },
  },
});
