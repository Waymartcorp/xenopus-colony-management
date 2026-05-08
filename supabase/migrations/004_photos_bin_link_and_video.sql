-- Migration 004: Link photos to bins/locations, add video support
-- Safe to run multiple times (idempotent)

-- Add location_id column (links photo/video to a bin)
ALTER TABLE public.frog_photos
  ADD COLUMN IF NOT EXISTS location_id uuid REFERENCES locations(id) ON DELETE SET NULL;

-- Rename image_url → file_url (supports both photo and video)
-- If image_url exists but file_url doesn't, rename it
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'frog_photos' AND column_name = 'image_url'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'frog_photos' AND column_name = 'file_url'
  ) THEN
    ALTER TABLE public.frog_photos RENAME COLUMN image_url TO file_url;
  END IF;
END $$;

-- Add file_url if neither existed (fresh DB edge case)
ALTER TABLE public.frog_photos
  ADD COLUMN IF NOT EXISTS file_url text;

-- Add media_type column (photo or video)
ALTER TABLE public.frog_photos
  ADD COLUMN IF NOT EXISTS media_type text NOT NULL DEFAULT 'photo';

-- Add title and notes
ALTER TABLE public.frog_photos
  ADD COLUMN IF NOT EXISTS title text;

ALTER TABLE public.frog_photos
  ADD COLUMN IF NOT EXISTS notes text;

-- Add check constraint for media_type (safe: drop if exists first)
ALTER TABLE public.frog_photos
  DROP CONSTRAINT IF EXISTS frog_photos_media_type_check;

ALTER TABLE public.frog_photos
  ADD CONSTRAINT frog_photos_media_type_check CHECK (media_type IN ('photo', 'video'));

-- Update Supabase Storage: ensure frog-photos bucket accepts video mime types
-- (This is informational — bucket config is managed in Supabase dashboard)
-- Supported: image/jpeg, image/png, image/webp, video/mp4, video/quicktime, video/webm
