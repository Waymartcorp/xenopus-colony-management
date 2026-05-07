import { NextResponse } from "next/server";

// TODO: Connect to Supabase, validate auth and org membership
// TODO: GET — list locations as tree structure
// TODO: POST — create a new location (room, rack, bin, tank, tub)

export async function GET() {
  return NextResponse.json({ locations: [] });
}

export async function POST() {
  // TODO: Validate location_type, parent_location_id, capacity
  return NextResponse.json(
    { error: "Not implemented" },
    { status: 501 }
  );
}
