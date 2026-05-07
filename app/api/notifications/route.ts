import { NextResponse } from "next/server";

// TODO: Connect to Supabase, validate auth
// TODO: GET — list notification events for current user
// TODO: POST — update notification preferences
// TODO: Trigger notification dispatch (email/SMS/in-app)

export async function GET() {
  return NextResponse.json({ notifications: [], total: 0 });
}

export async function POST() {
  // TODO: Update notification_rules or trigger manual notification
  return NextResponse.json(
    { error: "Not implemented" },
    { status: 501 }
  );
}
