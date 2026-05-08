-- Migration: Add bin transfer workflow tables and rotation settings columns
-- Safe to re-run: uses IF NOT EXISTS and ADD COLUMN IF NOT EXISTS

-- ============================================================
-- Add new columns to rotation_settings
-- ============================================================
ALTER TABLE rotation_settings ADD COLUMN IF NOT EXISTS minimum_open_rest_bins integer NOT NULL DEFAULT 10;
ALTER TABLE rotation_settings ADD COLUMN IF NOT EXISTS rest_bin_grouping_window_days integer NOT NULL DEFAULT 2;

-- ============================================================
-- Bin Transfer Events
-- ============================================================
CREATE TABLE IF NOT EXISTS bin_transfer_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  source_location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  destination_location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  frog_count integer NOT NULL,
  use_type text NOT NULL,
  use_date date NOT NULL,
  rest_started_at timestamptz NOT NULL DEFAULT now(),
  rest_complete_at timestamptz,
  grouping_window_days integer NOT NULL DEFAULT 2,
  grouped_with_transfer_id uuid REFERENCES bin_transfer_events(id) ON DELETE SET NULL,
  placement_status text NOT NULL DEFAULT 'assigned' CHECK (placement_status IN ('assigned','notified','confirmed','adjusted')),
  performance_note text,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bin_transfers_org ON bin_transfer_events(organization_id, use_date DESC);
CREATE INDEX IF NOT EXISTS idx_bin_transfers_source ON bin_transfer_events(source_location_id);
CREATE INDEX IF NOT EXISTS idx_bin_transfers_dest ON bin_transfer_events(destination_location_id);
CREATE INDEX IF NOT EXISTS idx_bin_transfers_status ON bin_transfer_events(organization_id, placement_status);

-- ============================================================
-- Destination Bin Assignments
-- ============================================================
CREATE TABLE IF NOT EXISTS destination_bin_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  source_location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  destination_location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned','receiving','resting','complete','cancelled')),
  assigned_at timestamptz NOT NULL DEFAULT now(),
  notification_status text DEFAULT 'pending' CHECK (notification_status IN ('pending','queued','sent','delivered','acknowledged')),
  confirmation_status text DEFAULT 'pending' CHECK (confirmation_status IN ('pending','confirmed','adjusted')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dest_assignments_org ON destination_bin_assignments(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_dest_assignments_dest ON destination_bin_assignments(destination_location_id);

-- ============================================================
-- RLS for new tables
-- ============================================================
ALTER TABLE bin_transfer_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE destination_bin_assignments ENABLE ROW LEVEL SECURITY;

-- bin_transfer_events policies
DROP POLICY IF EXISTS "bin_transfers_select" ON public.bin_transfer_events;
CREATE POLICY "bin_transfers_select" ON public.bin_transfer_events
  FOR SELECT USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS "bin_transfers_insert" ON public.bin_transfer_events;
CREATE POLICY "bin_transfers_insert" ON public.bin_transfer_events
  FOR INSERT WITH CHECK (public.org_role_level(organization_id) >= 1);

DROP POLICY IF EXISTS "bin_transfers_update" ON public.bin_transfer_events;
CREATE POLICY "bin_transfers_update" ON public.bin_transfer_events
  FOR UPDATE USING (public.org_role_level(organization_id) >= 1);

-- destination_bin_assignments policies
DROP POLICY IF EXISTS "dest_assignments_select" ON public.destination_bin_assignments;
CREATE POLICY "dest_assignments_select" ON public.destination_bin_assignments
  FOR SELECT USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS "dest_assignments_insert" ON public.destination_bin_assignments;
CREATE POLICY "dest_assignments_insert" ON public.destination_bin_assignments
  FOR INSERT WITH CHECK (public.org_role_level(organization_id) >= 1);

DROP POLICY IF EXISTS "dest_assignments_update" ON public.destination_bin_assignments;
CREATE POLICY "dest_assignments_update" ON public.destination_bin_assignments
  FOR UPDATE USING (public.org_role_level(organization_id) >= 1);
