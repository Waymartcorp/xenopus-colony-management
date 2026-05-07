import { createBrowserSupabaseClient } from "./supabase";

const PHOTOS_BUCKET = "frog-photos";

// File path convention: {organization_id}/{context_id}/{filename}
// The bucket is PRIVATE. Use signed URLs to serve images.

// TODO: Set up storage policies in Supabase dashboard (see supabase/policies.sql)
// TODO: Generate thumbnails server-side or via edge function
// TODO: Validate file types and size before upload

export async function uploadFrogPhoto(
  file: File,
  organizationId: string,
  contextId: string // frog_id, shipment_id, or event context
): Promise<{ path: string; signedUrl: string }> {
  const supabase = createBrowserSupabaseClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${organizationId}/${contextId}/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw error;

  // Bucket is private — use signed URL (valid for 1 hour)
  const { data: urlData, error: urlError } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .createSignedUrl(data.path, 3600);

  if (urlError) throw urlError;

  return { path: data.path, signedUrl: urlData.signedUrl };
}

export async function getSignedPhotoUrl(
  path: string,
  expiresInSeconds: number = 3600
): Promise<string> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .createSignedUrl(path, expiresInSeconds);

  if (error) throw error;
  return data.signedUrl;
}

export async function getSignedPhotoUrls(
  paths: string[],
  expiresInSeconds: number = 3600
): Promise<{ path: string; signedUrl: string }[]> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .createSignedUrls(paths, expiresInSeconds);

  if (error) throw error;
  return (data ?? [])
    .filter((item) => item.signedUrl != null)
    .map((item) => ({
      path: item.path ?? "",
      signedUrl: item.signedUrl!,
    }));
}

export async function deleteFrogPhoto(path: string): Promise<void> {
  const supabase = createBrowserSupabaseClient();
  const { error } = await supabase.storage.from(PHOTOS_BUCKET).remove([path]);
  if (error) throw error;
}

export async function listOrgPhotos(
  organizationId: string,
  subfolder?: string
): Promise<string[]> {
  const supabase = createBrowserSupabaseClient();
  const prefix = subfolder
    ? `${organizationId}/${subfolder}`
    : organizationId;

  const { data, error } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .list(prefix);

  if (error) throw error;
  return (data ?? []).map((f) => `${prefix}/${f.name}`);
}
