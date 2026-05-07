import { NextResponse } from "next/server";

// TODO: Connect to Supabase, validate auth
// TODO: GET — list shipments for org
// TODO: POST — create a new shipment or claim an existing one

export async function GET() {
  return NextResponse.json({ shipments: [], total: 0 });
}

export async function POST() {
  // TODO: Validate body, handle claim_status transitions
  return NextResponse.json(
    { error: "Not implemented" },
    { status: 501 }
  );
}
