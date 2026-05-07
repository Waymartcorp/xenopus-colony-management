import { createBrowserSupabaseClient } from "./supabase";

const PHOTOS_BUCKET = "frog-photos";

// TODO: Create bucket on first use or via Supabase dashboard
// TODO: Set up storage policies (org-scoped access)
// TODO: Generate thumbnails (server-side or edge function)

export async function uploadFrogPhoto(
  file: File,
  organizationId: string,
  frogId: string
): Promise<{ url: string; path: string }> {
  const supabase = createBrowserSupabaseClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${organizationId}/${frogId}/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(data.path);

  return { url: publicUrl, path: data.path };
}

export async function deleteFrogPhoto(path: string): Promise<void> {
  const supabase = createBrowserSupabaseClient();
  const { error } = await supabase.storage.from(PHOTOS_BUCKET).remove([path]);
  if (error) throw error;
}

export function getPhotoPublicUrl(path: string): string {
  const supabase = createBrowserSupabaseClient();
  const {
    data: { publicUrl },
  } = supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(path);
  return publicUrl;
}
