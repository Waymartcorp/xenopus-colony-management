-- Xenopus Colony Management System — XenoTrack Colony Register
-- Full schema for time-aware colony management with rotation, forecasting,
-- performance, protocols, results, environmental observations, and analytics.

-- ============================================================
-- Organizations and Memberships
-- ============================================================

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organization_type text not null default 'lab',
  primary_lab_mode text not null default 'general',
  enabled_modules jsonb not null default '["inventory","rotation","repopulation","events","performance","notifications","photos","shipments"]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists organization_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null,
  role text not null default 'tech',
  created_at timestamptz not null default now()
);

-- ============================================================
-- Rotation Settings (per organization)
-- ============================================================

create table if not exists rotation_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  minimum_rest_days integer not null default 90,
  target_rest_days integer not null default 120,
  overdue_after_days integer not null default 135,
  preferred_reuse_window_start integer not null default 90,
  preferred_reuse_window_end integer not null default 120,
  default_target_bin_capacity integer not null default 8,
  default_mode text not null default 'extract',
  created_at timestamptz not null default now(),
  unique(organization_id)
);

-- ============================================================
-- Locations (rooms, racks, bins, tanks, tubs, cohorts)
-- ============================================================

create table if not exists locations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  parent_location_id uuid references locations(id) on delete set null,
  location_type text not null,
  label text not null,
  capacity integer,
  status text default 'active',
  notes text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Shipments
-- ============================================================

create table if not exists shipments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  supplier_organization_id uuid references organizations(id) on delete set null,
  shipment_date date,
  order_reference text,
  status text default 'draft',
  claim_status text default 'unclaimed',
  created_at timestamptz not null default now()
);

-- ============================================================
-- Frogs
-- ============================================================

create table if not exists frogs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  public_code text not null unique,
  local_id text,
  source text,
  shipment_id uuid references shipments(id) on delete set null,
  sex text,
  size_class text,
  status text default 'active',
  current_location_id uuid references locations(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Frog Cycle Status (computed/cached rotation state)
-- ============================================================

create table if not exists frog_cycle_status (
  id uuid primary key default gen_random_uuid(),
  frog_id uuid not null references frogs(id) on delete cascade,
  current_cycle_state text not null default 'available',
  last_used_at timestamptz,
  rest_started_at timestamptz,
  rest_complete_at timestamptz,
  overdue_at timestamptz,
  use_count integer not null default 0,
  average_performance_score numeric,
  performance_trend text default 'stable',
  do_not_use boolean not null default false,
  retirement_candidate boolean not null default false,
  updated_at timestamptz not null default now(),
  unique(frog_id)
);

-- ============================================================
-- Bin Cycle Status (computed/cached rotation state per location)
-- ============================================================

create table if not exists bin_cycle_status (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references locations(id) on delete cascade,
  current_cycle_state text not null default 'general_population',
  last_used_at timestamptz,
  rest_started_at timestamptz,
  rest_complete_at timestamptz,
  overdue_at timestamptz,
  target_capacity integer,
  current_count integer not null default 0,
  use_count integer not null default 0,
  average_performance_score numeric,
  performance_trend text default 'stable',
  updated_at timestamptz not null default now(),
  unique(location_id)
);

-- ============================================================
-- Protocols
-- ============================================================

create table if not exists protocols (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  protocol_type text,
  notes text,
  version text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Frog Events
-- ============================================================

create table if not exists frog_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  frog_id uuid references frogs(id) on delete cascade,
  event_type text not null,
  event_date timestamptz not null default now(),
  location_id uuid references locations(id) on delete set null,
  protocol_id uuid references protocols(id) on delete set null,
  notes text,
  outcome text,
  created_by uuid,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Performance Ratings
-- ============================================================

create table if not exists performance_ratings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  frog_id uuid references frogs(id) on delete cascade,
  location_id uuid references locations(id) on delete set null,
  event_id uuid references frog_events(id) on delete set null,
  score numeric not null,
  quality_label text,
  usable text default 'yes',
  notes text,
  protocol_id uuid references protocols(id) on delete set null,
  result_id uuid,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Results
-- ============================================================

create table if not exists results (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  protocol_id uuid references protocols(id) on delete set null,
  event_id uuid references frog_events(id) on delete set null,
  frog_id uuid references frogs(id) on delete set null,
  location_id uuid references locations(id) on delete set null,
  result_type text,
  outcome_summary text,
  data_json jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Environmental Observations
-- ============================================================

create table if not exists environmental_observations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  location_id uuid references locations(id) on delete set null,
  frog_id uuid references frogs(id) on delete set null,
  event_id uuid references frog_events(id) on delete set null,
  protocol_id uuid references protocols(id) on delete set null,
  observation_type text not null,
  value numeric,
  unit text,
  notes text,
  observed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- ============================================================
-- Recommendations (system-generated)
-- ============================================================

create table if not exists recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  recommendation_type text not null,
  target_location_id uuid references locations(id) on delete set null,
  target_frog_id uuid references frogs(id) on delete set null,
  reason text,
  priority text default 'medium',
  status text default 'pending',
  created_at timestamptz not null default now()
);

-- ============================================================
-- Frog Photos
-- ============================================================

create table if not exists frog_photos (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  frog_id uuid references frogs(id) on delete cascade,
  image_url text not null,
  thumbnail_url text,
  photo_type text default 'general',
  uploaded_by uuid,
  quality_status text,
  future_embedding_status text default 'not_started',
  created_at timestamptz not null default now()
);

-- ============================================================
-- Frog Measurements (future: weight, SVL, body condition)
-- ============================================================

create table if not exists frog_measurements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  frog_id uuid references frogs(id) on delete cascade,
  measurement_type text not null,
  value numeric not null,
  unit text not null,
  linked_photo_id uuid references frog_photos(id) on delete set null,
  capture_method text,
  confidence_score numeric,
  measured_at timestamptz not null default now()
);

-- ============================================================
-- Image Embeddings (future: biometric matching)
-- ============================================================

create table if not exists image_embeddings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  frog_id uuid references frogs(id) on delete cascade,
  frog_photo_id uuid references frog_photos(id) on delete cascade,
  embedding vector,
  model_name text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Notification Rules
-- ============================================================

create table if not exists notification_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  rule_type text not null,
  channel text not null,
  enabled boolean not null default true,
  schedule text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Notification Events
-- ============================================================

create table if not exists notification_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid,
  channel text not null,
  subject text,
  body text,
  status text default 'queued',
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Indexes for common queries
-- ============================================================

create index if not exists idx_frogs_org on frogs(organization_id);
create index if not exists idx_frogs_location on frogs(current_location_id);
create index if not exists idx_frogs_status on frogs(organization_id, status);
create index if not exists idx_locations_org on locations(organization_id);
create index if not exists idx_locations_parent on locations(parent_location_id);
create index if not exists idx_frog_events_org_date on frog_events(organization_id, event_date);
create index if not exists idx_frog_events_frog on frog_events(frog_id);
create index if not exists idx_frog_events_location on frog_events(location_id);
create index if not exists idx_performance_ratings_frog on performance_ratings(frog_id);
create index if not exists idx_performance_ratings_location on performance_ratings(location_id);
create index if not exists idx_environmental_obs_org_date on environmental_observations(organization_id, observed_at);
create index if not exists idx_environmental_obs_location on environmental_observations(location_id);
create index if not exists idx_frog_cycle_status_state on frog_cycle_status(current_cycle_state);
create index if not exists idx_bin_cycle_status_state on bin_cycle_status(current_cycle_state);
create index if not exists idx_results_org on results(organization_id);
create index if not exists idx_recommendations_org on recommendations(organization_id, status);

-- ============================================================
-- TODO: Analytics views / materialized views for reporting
-- ============================================================
-- - Colony state counts (frogs by cycle state, bins by cycle state)
-- - Monthly performance summary
-- - Seasonal performance summary
-- - Rest-duration vs performance correlation
-- - Source/cohort/shipment performance summary
-- - 30/60/90/120-day availability forecast
-- - Repopulation demand over time
