import { NextResponse } from "next/server";
import { z } from "zod";
import { getDatabase } from "@/lib/database";

export const runtime = "nodejs";

const payloadSchema = z.object({
  eventId: z.string().uuid(),
  sessionId: z.string().uuid(),
  numbers: z.array(z.string().regex(/^\d{4}$/)).min(1).max(3)
    .refine((values) => new Set(values).size === values.length, "Numbers must be unique"),
  language: z.enum(["en", "zh-CN", "ms-MY"]).default("en"),
});

export async function POST(request: Request) {
  const parsed = payloadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid search event" }, { status: 400 });
  }

  try {
    const sql = getDatabase();
    const recent = await sql`
      SELECT count(*)::int AS count
      FROM search_events
      WHERE session_id = ${parsed.data.sessionId}::uuid
        AND searched_at > now() - interval '1 minute'
    `;
    if ((recent[0]?.count ?? 0) >= 30) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    await sql`
      INSERT INTO search_events (event_id, session_id, numbers, language)
      VALUES (
        ${parsed.data.eventId}::uuid,
        ${parsed.data.sessionId}::uuid,
        ${sql.array(parsed.data.numbers)},
        ${parsed.data.language}
      )
      ON CONFLICT (event_id) DO NOTHING
    `;
    return NextResponse.json({ stored: true }, { status: 201 });
  } catch (error) {
    console.error("Search event storage failed", error);
    return NextResponse.json({ stored: false }, { status: 503 });
  }
}
