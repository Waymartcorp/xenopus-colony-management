import { NextResponse } from "next/server";

// TODO: Connect to Supabase, validate auth
// TODO: GET — list events with filters (type, date range, frog_id)
// TODO: POST — log a new event (use, rest, performance, health, movement)

export async function GET() {
  return NextResponse.json({ events: [], total: 0 });
}

export async function POST() {
  // TODO: Validate event_type, frog_id, create event record
  // TODO: Trigger notification rules if applicable
  return NextResponse.json(
    { error: "Not implemented" },
    { status: 501 }
  );
}
