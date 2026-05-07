import { NextResponse } from "next/server";

// TODO: Connect to Supabase, validate auth, check org membership
// TODO: GET — list frogs with filters (status, sex, size, location)
// TODO: POST — create a new frog record

export async function GET() {
  return NextResponse.json({ frogs: [], total: 0 });
}

export async function POST() {
  // TODO: Validate body, generate public_code, insert into frogs table
  return NextResponse.json(
    { error: "Not implemented" },
    { status: 501 }
  );
}
