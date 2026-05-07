"use client";

import { useState } from "react";

// TODO: Integrate with Supabase Storage upload
// TODO: Associate uploaded photo with a frog_id
// TODO: Generate thumbnail on upload
// TODO: Set photo_type from user selection
// TODO: Show upload progress
// TODO: Validate file type and size

interface PhotoUploaderProps {
  frogId?: string;
  organizationId: string;
  onUploadComplete?: (photoUrl: string) => void;
}

export default function PhotoUploader({
  frogId,
  organizationId,
  onUploadComplete,
}: PhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [photoType, setPhotoType] = useState("general");
  const [uploading, setUploading] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // TODO: Process dropped files
    void handleUpload(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      void handleUpload(e.target.files);
    }
  };

  async function handleUpload(files: FileList) {
    if (files.length === 0) return;
    setUploading(true);

    // TODO: Upload each file to Supabase Storage
    // TODO: Create frog_photos record via API
    // TODO: Call onUploadComplete with the resulting URL
    console.log("Upload pending:", {
      files: files.length,
      frogId,
      organizationId,
      photoType,
    });

    setUploading(false);
    onUploadComplete?.("");
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <select
          value={photoType}
          onChange={(e) => setPhotoType(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="general">General</option>
          <option value="dorsal">Dorsal</option>
          <option value="ventral">Ventral</option>
          <option value="side">Side</option>
          <option value="health">Health</option>
          <option value="shipment">Shipment</option>
        </select>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition ${
          isDragging
            ? "border-brand-500 bg-brand-50"
            : "border-gray-300 bg-white"
        }`}
      >
        {uploading ? (
          <p className="text-sm text-gray-600">Uploading...</p>
        ) : (
          <>
            <p className="text-sm text-gray-600">
              Drag and drop photos here, or
            </p>
            <label className="mt-2 cursor-pointer rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
              Browse Files
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
            <p className="mt-2 text-xs text-gray-400">
              JPG, PNG up to 10MB each
            </p>
          </>
        )}
      </div>
    </div>
  );
}
