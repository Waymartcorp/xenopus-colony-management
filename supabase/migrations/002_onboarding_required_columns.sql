-- Migration: Ensure onboarding-required columns and policies exist
-- Safe to re-run: uses IF NOT EXISTS / OR REPLACE throughout
-- No destructive changes.

-- ============================================================
-- Organizations: ensure the table and required columns exist
-- ============================================================
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  organization_type text NOT NULL DEFAULT 'lab',
  primary_lab_mode text NOT NULL DEFAULT 'general',
  enabled_modules jsonb NOT NULL DEFAULT '["inventory","rotation","repopulation","events","performance","notifications","photos","shipments"]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- Organization memberships
-- ============================================================
CREATE TABLE IF NOT EXISTS organization_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'tech',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- Locations (bins/tanks/tubs)
-- ============================================================
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  parent_location_id uuid REFERENCES locations(id) ON DELETE SET NULL,
  location_type text NOT NULL,
  label text NOT NULL,
  capacity integer,
  status text DEFAULT 'active',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- Frogs
-- ============================================================
CREATE TABLE IF NOT EXISTS frogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  public_code text NOT NULL UNIQUE,
  local_id text,
  source text,
  shipment_id uuid,
  sex text,
  size_class text,
  status text DEFAULT 'active',
  current_location_id uuid REFERENCES locations(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- Rotation settings
-- ============================================================
CREATE TABLE IF NOT EXISTS rotation_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  minimum_rest_days integer NOT NULL DEFAULT 90,
  target_rest_days integer NOT NULL DEFAULT 120,
  overdue_after_days integer NOT NULL DEFAULT 135,
  preferred_reuse_window_start integer NOT NULL DEFAULT 90,
  preferred_reuse_window_end integer NOT NULL DEFAULT 120,
  default_target_bin_capacity integer NOT NULL DEFAULT 8,
  default_mode text NOT NULL DEFAULT 'extract',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(organization_id)
);

-- ============================================================
-- Notification rules
-- ============================================================
CREATE TABLE IF NOT EXISTS notification_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  rule_type text NOT NULL,
  channel text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  schedule text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- Bin cycle status
-- ============================================================
CREATE TABLE IF NOT EXISTS bin_cycle_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  current_cycle_state text NOT NULL DEFAULT 'general_population',
  last_used_at timestamptz,
  rest_started_at timestamptz,
  rest_complete_at timestamptz,
  overdue_at timestamptz,
  target_capacity integer,
  current_count integer NOT NULL DEFAULT 0,
  use_count integer NOT NULL DEFAULT 0,
  average_performance_score numeric,
  performance_trend text DEFAULT 'stable',
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(location_id)
);

-- ============================================================
-- Frog events (needed for dashboard empty-state check)
-- ============================================================
CREATE TABLE IF NOT EXISTS frog_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  frog_id uuid,
  event_type text NOT NULL,
  event_date timestamptz NOT NULL DEFAULT now(),
  location_id uuid,
  protocol_id uuid,
  notes text,
  outcome text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- RLS: Enable on all onboarding tables
-- ============================================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE frogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rotation_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE bin_cycle_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE frog_events ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Helper functions (CREATE OR REPLACE is safe to re-run)
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_org_member(org_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_memberships
    WHERE organization_id = org_id
      AND user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.org_role_level(org_id uuid)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT CASE role
      WHEN 'owner' THEN 4
      WHEN 'admin' THEN 3
      WHEN 'manager' THEN 2
      WHEN 'tech' THEN 1
      WHEN 'viewer' THEN 0
      ELSE -1
    END
    FROM public.organization_memberships
    WHERE organization_id = org_id
      AND user_id = auth.uid()
    LIMIT 1),
    -1
  );
$$;

-- ============================================================
-- Policies required for onboarding flow
-- (DROP IF EXISTS + CREATE to be idempotent)
-- ============================================================

-- Organizations
DROP POLICY IF EXISTS "org_insert" ON public.organizations;
CREATE POLICY "org_insert" ON public.organizations
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "org_select" ON public.organizations;
CREATE POLICY "org_select" ON public.organizations
  FOR SELECT USING (public.is_org_member(id));

DROP POLICY IF EXISTS "org_select_by_membership" ON public.organizations;
CREATE POLICY "org_select_by_membership" ON public.organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.organization_memberships
      WHERE organization_id = id AND user_id = auth.uid()
    )
  );

-- Organization memberships: allow self-enrollment as owner on empty org
DROP POLICY IF EXISTS "membership_insert" ON public.organization_memberships;
CREATE POLICY "membership_insert" ON public.organization_memberships
  FOR INSERT WITH CHECK (
    public.org_role_level(organization_id) >= 3
    OR (
      user_id = auth.uid()
      AND role = 'owner'
      AND NOT EXISTS (
        SELECT 1 FROM public.organization_memberships m
        WHERE m.organization_id = organization_memberships.organization_id
      )
    )
  );

DROP POLICY IF EXISTS "membership_select" ON public.organization_memberships;
CREATE POLICY "membership_select" ON public.organization_memberships
  FOR SELECT USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS "membership_own_select" ON public.organization_memberships;
CREATE POLICY "membership_own_select" ON public.organization_memberships
  FOR SELECT USING (user_id = auth.uid());

-- Locations: owner/admin/manager can insert
DROP POLICY IF EXISTS "locations_select" ON public.locations;
CREATE POLICY "locations_select" ON public.locations
  FOR SELECT USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS "locations_insert" ON public.locations;
CREATE POLICY "locations_insert" ON public.locations
  FOR INSERT WITH CHECK (public.org_role_level(organization_id) >= 2);

-- Frogs: tech+ can insert
DROP POLICY IF EXISTS "frogs_select" ON public.frogs;
CREATE POLICY "frogs_select" ON public.frogs
  FOR SELECT USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS "frogs_insert" ON public.frogs;
CREATE POLICY "frogs_insert" ON public.frogs
  FOR INSERT WITH CHECK (public.org_role_level(organization_id) >= 1);

-- Rotation settings: admin+ can insert
DROP POLICY IF EXISTS "rotation_settings_select" ON public.rotation_settings;
CREATE POLICY "rotation_settings_select" ON public.rotation_settings
  FOR SELECT USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS "rotation_settings_insert" ON public.rotation_settings;
CREATE POLICY "rotation_settings_insert" ON public.rotation_settings
  FOR INSERT WITH CHECK (public.org_role_level(organization_id) >= 3);

-- Notification rules: manager+ can insert
DROP POLICY IF EXISTS "notif_rules_select" ON public.notification_rules;
CREATE POLICY "notif_rules_select" ON public.notification_rules
  FOR SELECT USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS "notif_rules_insert" ON public.notification_rules;
CREATE POLICY "notif_rules_insert" ON public.notification_rules
  FOR INSERT WITH CHECK (public.org_role_level(organization_id) >= 2);

-- Bin cycle status: accessible via location's org
DROP POLICY IF EXISTS "bin_cycle_select" ON public.bin_cycle_status;
CREATE POLICY "bin_cycle_select" ON public.bin_cycle_status
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.locations l
      WHERE l.id = location_id AND public.is_org_member(l.organization_id)
    )
  );

DROP POLICY IF EXISTS "bin_cycle_insert" ON public.bin_cycle_status;
CREATE POLICY "bin_cycle_insert" ON public.bin_cycle_status
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.locations l
      WHERE l.id = location_id AND public.org_role_level(l.organization_id) >= 1
    )
  );

-- Frog events: org member can read, tech+ can insert
DROP POLICY IF EXISTS "frog_events_select" ON public.frog_events;
CREATE POLICY "frog_events_select" ON public.frog_events
  FOR SELECT USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS "frog_events_insert" ON public.frog_events;
CREATE POLICY "frog_events_insert" ON public.frog_events
  FOR INSERT WITH CHECK (public.org_role_level(organization_id) >= 1);
