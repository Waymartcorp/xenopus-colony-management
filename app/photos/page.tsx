export default function PhotosPage() {
  // TODO: Fetch photos for current organization with frog associations
  // TODO: Grid view of photos with thumbnails
  // TODO: PhotoUploader component for new uploads
  // TODO: Filter by photo_type (dorsal, ventral, side, general, health, shipment)
  // TODO: Show quality_status and future_embedding_status badges
  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Photos</h1>
          <p className="mt-1 text-gray-600">
            Frog photos for identification, health records, and future biometric
            matching.
          </p>
        </div>
        <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
          + Upload Photo
        </button>
      </div>

      <div className="mt-6 flex gap-3">
        <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
          <option value="">All types</option>
          <option value="dorsal">Dorsal</option>
          <option value="ventral">Ventral</option>
          <option value="side">Side</option>
          <option value="general">General</option>
          <option value="health">Health</option>
          <option value="shipment">Shipment</option>
        </select>
      </div>

      <section className="mt-6">
        {/* TODO: Photo grid with thumbnails */}
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-gray-500">
            No photos uploaded yet. Use the upload button to add frog photos.
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Supports dorsal, ventral, side, and health photos. Images will be
            stored in Supabase Storage.
          </p>
        </div>
      </section>
    </div>
  );
}
