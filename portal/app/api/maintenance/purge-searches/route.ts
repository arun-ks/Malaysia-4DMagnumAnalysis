import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sql = getDatabase();
    const deleted = await sql`
      DELETE FROM search_events
      WHERE searched_at < now() - interval '90 days'
      RETURNING event_id
    `;
    return NextResponse.json({ deleted: deleted.length });
  } catch (error) {
    console.error("Search retention cleanup failed", error);
    return NextResponse.json({ error: "Cleanup failed" }, { status: 503 });
  }
}
