import { createFileRoute } from "@tanstack/react-router";
import { refreshBoard } from "@/lib/events/store.server";
import { refreshPharma } from "@/lib/pharma/store.server";

/** 10:00 Asia/Seoul = 01:00 UTC. Vercel Cron calls this once a day. */
export const Route = createFileRoute("/api/cron/collect")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const secret = process.env.CRON_SECRET;
        const bearer = request.headers.get("authorization");
        const fromCron = request.headers.get("x-vercel-cron");
        if (secret) {
          if (bearer !== `Bearer ${secret}`) return new Response("unauthorized", { status: 401 });
        } else if (!fromCron) {
          return new Response("unauthorized", { status: 401 });
        }
        const board = await refreshBoard();
        let pharmaCount = 0;
        let pharmaError = "";
        try {
          pharmaCount = (await refreshPharma()).events.length;
        } catch (error) {
          pharmaError = error instanceof Error ? error.message : "pharma failed";
        }
        return Response.json({
          ok: true,
          collectedAt: board.collectedAt,
          count: board.events.length,
          pharmaCount,
          pharmaError,
        });
      },
    },
  },
});
