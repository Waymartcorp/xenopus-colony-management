"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";

interface MediaRecord {
  id: string;
  file_url: string;
  thumbnail_url: string | null;
  media_type: "photo" | "video";
  photo_type: string;
  title: string | null;
  notes: string | null;
  location_id: string | null;
  frog_id: string | null;
  created_at: string;
  location?: { label: string } | null;
}

interface Bin {
  id: string;
  label: string;
}

export default function PhotosPage() {
  const supabase = createBrowserSupabaseClient();
  const [media, setMedia] = useState<MediaRecord[]>([]);
  const [bins, setBins] = useState<Bin[]>([]);
  const [filterBin, setFilterBin] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterMedia, setFilterMedia] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  // Upload form state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadBin, setUploadBin] = useState("");
  const [uploadPhotoType, setUploadPhotoType] = useState("general");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadNotes, setUploadNotes] = useState("");

  useEffect(() => {
    loadData();
  }, [filterBin, filterType, filterMedia]);

  async function loadData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: membership } = await supabase
      .from("organization_memberships")
      .select("organization_id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (!membership) return;
    const orgId = membership.organization_id;

    // Load bins for filter and upload form
    const { data: binData } = await supabase
      .from("locations")
      .select("id, label")
      .eq("organization_id", orgId)
      .eq("location_type", "bin")
      .order("label");
    setBins(binData ?? []);

    // Load media with optional filters
    let query = supabase
      .from("frog_photos")
      .select("id, file_url, thumbnail_url, media_type, photo_type, title, notes, location_id, frog_id, created_at")
      .eq("organization_id", orgId)
      .order("created_at", { ascending: false });

    if (filterBin) query = query.eq("location_id", filterBin);
    if (filterType) query = query.eq("photo_type", filterType);
    if (filterMedia) query = query.eq("media_type", filterMedia);

    const { data: mediaData } = await query;

    // Attach bin labels
    const enriched = (mediaData ?? []).map((m) => ({
      ...m,
      location: binData?.find((b) => b.id === m.location_id) ? { label: binData.find((b) => b.id === m.location_id)!.label } : null,
    }));

    setMedia(enriched);
    setLoading(false);
  }

  async function handleUpload() {
    if (!uploadFile) return;
    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: membership } = await supabase
        .from("organization_memberships")
        .select("organization_id")
        .eq("user_id", user.id)
        .limit(1)
        .single();
      if (!membership) throw new Error("No organization");

      const orgId = membership.organization_id;
      const isVideo = uploadFile.type.startsWith("video/");
      const mediaType = isVideo ? "video" : "photo";
      const ext = uploadFile.name.split(".").pop() || "bin";
      const filePath = `${orgId}/${crypto.randomUUID()}.${ext}`;

      // Upload to Supabase Storage
      const { error: storageErr } = await supabase.storage
        .from("frog-photos")
        .upload(filePath, uploadFile, { contentType: uploadFile.type });

      if (storageErr) throw new Error(`Storage: ${storageErr.message}`);

      const { data: urlData } = supabase.storage.from("frog-photos").getPublicUrl(filePath);

      // Insert record
      const { error: insertErr } = await supabase.from("frog_photos").insert({
        organization_id: orgId,
        file_url: urlData.publicUrl,
        media_type: mediaType,
        photo_type: uploadPhotoType,
        location_id: uploadBin || null,
        title: uploadTitle || null,
        notes: uploadNotes || null,
        uploaded_by: user.id,
      });

      if (insertErr) throw new Error(`Insert: ${insertErr.message}`);

      // Reset form and reload
      setUploadFile(null);
      setUploadBin("");
      setUploadTitle("");
      setUploadNotes("");
      setShowUpload(false);
      loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const fileInputAccept = "image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm";

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Photos & Video</h1>
          <p className="mt-1 text-gray-600">
            Bin-linked media for colony records, health documentation, and future monitoring.
          </p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          + Upload
        </button>
      </div>

      {/* Upload panel */}
      {showUpload && (
        <div className="mt-4 rounded-xl border border-brand-200 bg-brand-50/50 p-5">
          <h3 className="text-sm font-semibold text-gray-900">Upload photo or video</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-gray-600">File</label>
              <input
                type="file"
                accept={fileInputAccept}
                onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                className="mt-1 block w-full text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-brand-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-brand-700"
              />
              <p className="mt-1 text-xs text-gray-400">Photos (JPEG, PNG, WebP) or video (MP4, MOV, WebM)</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Link to Bin</label>
              <select
                value={uploadBin}
                onChange={(e) => setUploadBin(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">— No bin (general) —</option>
                {bins.map((b) => (
                  <option key={b.id} value={b.id}>{b.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Type</label>
              <select
                value={uploadPhotoType}
                onChange={(e) => setUploadPhotoType(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="general">General</option>
                <option value="dorsal">Dorsal</option>
                <option value="ventral">Ventral</option>
                <option value="side">Side</option>
                <option value="health">Health check</option>
                <option value="environment">Environment / Tank</option>
                <option value="monitoring">Monitoring / Sentinel</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Title (optional)</label>
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="e.g. Bin A3 post-use check"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-gray-600">Notes (optional)</label>
              <textarea
                value={uploadNotes}
                onChange={(e) => setUploadNotes(e.target.value)}
                rows={2}
                placeholder="Any observations or context..."
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleUpload}
              disabled={!uploadFile || uploading}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
            <button
              onClick={() => setShowUpload(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-3">
        <select
          value={filterBin}
          onChange={(e) => setFilterBin(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All bins</option>
          {bins.map((b) => (
            <option key={b.id} value={b.id}>{b.label}</option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All types</option>
          <option value="dorsal">Dorsal</option>
          <option value="ventral">Ventral</option>
          <option value="side">Side</option>
          <option value="general">General</option>
          <option value="health">Health</option>
          <option value="environment">Environment</option>
          <option value="monitoring">Monitoring</option>
        </select>
        <select
          value={filterMedia}
          onChange={(e) => setFilterMedia(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Photos & Video</option>
          <option value="photo">Photos only</option>
          <option value="video">Video only</option>
        </select>
      </div>

      {/* Media grid */}
      <section className="mt-6">
        {loading ? (
          <div className="py-12 text-center text-gray-400">Loading...</div>
        ) : media.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-gray-500">
              No media uploaded yet. Use the upload button to add photos or videos linked to your bins.
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Supports photos (JPEG, PNG, WebP) and video (MP4, MOV, WebM). Each upload can be linked to a specific bin for easy reference.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {media.map((m) => (
              <div key={m.id} className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                <div className="relative aspect-video bg-gray-100">
                  {m.media_type === "video" ? (
                    <video
                      src={m.file_url}
                      className="h-full w-full object-cover"
                      controls
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={m.thumbnail_url || m.file_url}
                      alt={m.title || "Colony photo"}
                      className="h-full w-full object-cover"
                    />
                  )}
                  <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${m.media_type === "video" ? "bg-purple-100 text-purple-700" : "bg-brand-100 text-brand-700"}`}>
                    {m.media_type === "video" ? "VIDEO" : "PHOTO"}
                  </span>
                </div>
                <div className="p-3">
                  {m.title && <p className="text-sm font-medium text-gray-900 truncate">{m.title}</p>}
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {m.location && (
                      <span className="inline-flex items-center rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium text-brand-700 border border-brand-200">
                        {m.location.label}
                      </span>
                    )}
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                      {m.photo_type}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-gray-400">
                    {new Date(m.created_at).toLocaleDateString()}
                  </p>
                  {m.notes && <p className="mt-1 text-xs text-gray-500 line-clamp-2">{m.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sentinel teaser */}
      <section className="mt-10 rounded-xl border border-dashed border-gold-300 bg-gold-50/30 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-100">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b8972e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Frog Sentinel — Video Monitoring</h3>
            <p className="mt-1 text-xs text-gray-600">
              Future capability: continuous camera feeds per bin, automated event detection, time-lapse review, and health alerts.
              Upload manual video clips now to build your colony video archive.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
