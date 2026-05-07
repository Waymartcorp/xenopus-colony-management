import { NextResponse } from "next/server";

// TODO: Connect to Supabase, validate auth
// TODO: GET — list photos for org/frog with pagination
// TODO: POST — handle file upload to Supabase Storage, create frog_photos record

export async function GET() {
  return NextResponse.json({ photos: [], total: 0 });
}

export async function POST() {
  // TODO: Accept multipart form data, upload to storage bucket
  // TODO: Create frog_photos record with image_url, thumbnail_url
  // TODO: Set future_embedding_status = 'not_started'
  return NextResponse.json(
    { error: "Not implemented" },
    { status: 501 }
  );
}
