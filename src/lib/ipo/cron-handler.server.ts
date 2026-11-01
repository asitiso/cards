import { refreshIpoSnapshot } from "./snapshot.server.ts";

/** Isolated from the finance and pharma cron collectors. */
export async function handleIpoCron(request: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== "Bearer " + secret) {
    return new Response("unauthorized", { status: 401 });
  }
  try {
    const board = await refreshIpoSnapshot();
    return Response.json({ ok: true, count: board.items.length, collectedAt: board.collectedAt });
  } catch (error) {
    return Response.json({
      ok: false,
      message: error instanceof Error ? error.message : "IPO collector failed",
    }, { status: 500 });
  }
}
