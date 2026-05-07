-- =============================================================================
-- XenoTrack Colony Register — Row Level Security Policies
-- =============================================================================
-- Posture: PRIVATE BY DEFAULT
-- Users can only access records belonging to organizations where they hold
-- an active organization_memberships row.
-- =============================================================================

-- Helper function: check if the current auth user is a member of the given org
create or replace function public.is_org_member(org_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.organization_memberships
    where organization_id = org_id
      and user_id = auth.uid()
  );
$$;

-- Helper function: check if the current auth user has a minimum role in the org
create or replace function public.has_org_role(org_id uuid, min_role text)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.organization_memberships
    where organization_id = org_id
      and user_id = auth.uid()
      and role in (
        case
          when min_role = 'viewer' then 'viewer'
          else null
        end,
        case
          when min_role in ('viewer', 'tech') then 'tech'
          else null
        end,
        case
          when min_role in ('viewer', 'tech', 'manager') then 'manager'
          else null
        end,
        case
          when min_role in ('viewer', 'tech', 'manager', 'admin') then 'admin'
          else null
        end,
        'owner'
      )
  );
$$;

-- Simpler role check using level numbers
create or replace function public.org_role_level(org_id uuid)
returns integer
language sql
security definer
stable
as $$
  select coalesce(
    (select case role
      when 'owner' then 4
      when 'admin' then 3
      when 'manager' then 2
      when 'tech' then 1
      when 'viewer' then 0
      else -1
    end
    from public.organization_memberships
    where organization_id = org_id
      and user_id = auth.uid()
    limit 1),
    -1
  );
$$;


-- =============================================================================
-- organizations
-- =============================================================================
alter table public.organizations enable row level security;

create policy "org_select" on public.organizations
  for select using (public.is_org_member(id));

create policy "org_insert" on public.organizations
  for insert with check (true);
  -- Anyone authenticated can create an org (they become owner via trigger/app logic)

create policy "org_update" on public.organizations
  for update using (public.org_role_level(id) >= 3);
  -- admin+ can update org settings

create policy "org_delete" on public.organizations
  for delete using (public.org_role_level(id) >= 4);
  -- owner only can delete


-- =============================================================================
-- organization_memberships
-- =============================================================================
alter table public.organization_memberships enable row level security;

create policy "membership_select" on public.organization_memberships
  for select using (public.is_org_member(organization_id));

create policy "membership_insert" on public.organization_memberships
  for insert with check (public.org_role_level(organization_id) >= 3);
  -- admin+ can add members

create policy "membership_update" on public.organization_memberships
  for update using (public.org_role_level(organization_id) >= 3);

create policy "membership_delete" on public.organization_memberships
  for delete using (public.org_role_level(organization_id) >= 3);

-- Special: allow user to see their own memberships for org switching
create policy "membership_own_select" on public.organization_memberships
  for select using (user_id = auth.uid());


-- =============================================================================
-- rotation_settings
-- =============================================================================
alter table public.rotation_settings enable row level security;

create policy "rotation_settings_select" on public.rotation_settings
  for select using (public.is_org_member(organization_id));

create policy "rotation_settings_insert" on public.rotation_settings
  for insert with check (public.org_role_level(organization_id) >= 3);

create policy "rotation_settings_update" on public.rotation_settings
  for update using (public.org_role_level(organization_id) >= 3);

create policy "rotation_settings_delete" on public.rotation_settings
  for delete using (public.org_role_level(organization_id) >= 4);


-- =============================================================================
-- locations
-- =============================================================================
alter table public.locations enable row level security;

create policy "locations_select" on public.locations
  for select using (public.is_org_member(organization_id));

create policy "locations_insert" on public.locations
  for insert with check (public.org_role_level(organization_id) >= 2);
  -- manager+ can create locations

create policy "locations_update" on public.locations
  for update using (public.org_role_level(organization_id) >= 1);
  -- tech+ can update locations (e.g. notes, status)

create policy "locations_delete" on public.locations
  for delete using (public.org_role_level(organization_id) >= 2);


-- =============================================================================
-- shipments
-- =============================================================================
alter table public.shipments enable row level security;

create policy "shipments_select" on public.shipments
  for select using (
    public.is_org_member(organization_id)
    or (supplier_organization_id is not null and public.is_org_member(supplier_organization_id))
  );
  -- Receiving org and supplier org can both see the shipment

create policy "shipments_insert" on public.shipments
  for insert with check (public.org_role_level(organization_id) >= 2);

create policy "shipments_update" on public.shipments
  for update using (
    public.org_role_level(organization_id) >= 2
    or (supplier_organization_id is not null and public.org_role_level(supplier_organization_id) >= 2)
  );

create policy "shipments_delete" on public.shipments
  for delete using (public.org_role_level(organization_id) >= 3);


-- =============================================================================
-- frogs
-- =============================================================================
alter table public.frogs enable row level security;

create policy "frogs_select" on public.frogs
  for select using (public.is_org_member(organization_id));

create policy "frogs_insert" on public.frogs
  for insert with check (public.org_role_level(organization_id) >= 1);
  -- tech+ can create frogs

create policy "frogs_update" on public.frogs
  for update using (public.org_role_level(organization_id) >= 1);

create policy "frogs_delete" on public.frogs
  for delete using (public.org_role_level(organization_id) >= 3);
  -- admin+ can delete frogs


-- =============================================================================
-- frog_cycle_status
-- =============================================================================
alter table public.frog_cycle_status enable row level security;

create policy "frog_cycle_select" on public.frog_cycle_status
  for select using (
    exists (
      select 1 from public.frogs f
      where f.id = frog_id and public.is_org_member(f.organization_id)
    )
  );

create policy "frog_cycle_insert" on public.frog_cycle_status
  for insert with check (
    exists (
      select 1 from public.frogs f
      where f.id = frog_id and public.org_role_level(f.organization_id) >= 1
    )
  );

create policy "frog_cycle_update" on public.frog_cycle_status
  for update using (
    exists (
      select 1 from public.frogs f
      where f.id = frog_id and public.org_role_level(f.organization_id) >= 1
    )
  );

create policy "frog_cycle_delete" on public.frog_cycle_status
  for delete using (
    exists (
      select 1 from public.frogs f
      where f.id = frog_id and public.org_role_level(f.organization_id) >= 3
    )
  );


-- =============================================================================
-- bin_cycle_status
-- =============================================================================
alter table public.bin_cycle_status enable row level security;

create policy "bin_cycle_select" on public.bin_cycle_status
  for select using (
    exists (
      select 1 from public.locations l
      where l.id = location_id and public.is_org_member(l.organization_id)
    )
  );

create policy "bin_cycle_insert" on public.bin_cycle_status
  for insert with check (
    exists (
      select 1 from public.locations l
      where l.id = location_id and public.org_role_level(l.organization_id) >= 1
    )
  );

create policy "bin_cycle_update" on public.bin_cycle_status
  for update using (
    exists (
      select 1 from public.locations l
      where l.id = location_id and public.org_role_level(l.organization_id) >= 1
    )
  );

create policy "bin_cycle_delete" on public.bin_cycle_status
  for delete using (
    exists (
      select 1 from public.locations l
      where l.id = location_id and public.org_role_level(l.organization_id) >= 3
    )
  );


-- =============================================================================
-- frog_events
-- =============================================================================
alter table public.frog_events enable row level security;

create policy "events_select" on public.frog_events
  for select using (public.is_org_member(organization_id));

create policy "events_insert" on public.frog_events
  for insert with check (public.org_role_level(organization_id) >= 1);
  -- tech+ can log events

create policy "events_update" on public.frog_events
  for update using (public.org_role_level(organization_id) >= 1);

create policy "events_delete" on public.frog_events
  for delete using (public.org_role_level(organization_id) >= 3);


-- =============================================================================
-- frog_photos
-- =============================================================================
alter table public.frog_photos enable row level security;

create policy "photos_select" on public.frog_photos
  for select using (public.is_org_member(organization_id));

create policy "photos_insert" on public.frog_photos
  for insert with check (public.org_role_level(organization_id) >= 1);
  -- tech+ can upload photos

create policy "photos_update" on public.frog_photos
  for update using (public.org_role_level(organization_id) >= 1);

create policy "photos_delete" on public.frog_photos
  for delete using (public.org_role_level(organization_id) >= 3);


-- =============================================================================
-- frog_measurements
-- =============================================================================
alter table public.frog_measurements enable row level security;

create policy "measurements_select" on public.frog_measurements
  for select using (public.is_org_member(organization_id));

create policy "measurements_insert" on public.frog_measurements
  for insert with check (public.org_role_level(organization_id) >= 1);

create policy "measurements_update" on public.frog_measurements
  for update using (public.org_role_level(organization_id) >= 1);

create policy "measurements_delete" on public.frog_measurements
  for delete using (public.org_role_level(organization_id) >= 3);


-- =============================================================================
-- image_embeddings
-- =============================================================================
alter table public.image_embeddings enable row level security;

create policy "embeddings_select" on public.image_embeddings
  for select using (public.is_org_member(organization_id));

create policy "embeddings_insert" on public.image_embeddings
  for insert with check (public.org_role_level(organization_id) >= 1);

create policy "embeddings_update" on public.image_embeddings
  for update using (public.org_role_level(organization_id) >= 3);

create policy "embeddings_delete" on public.image_embeddings
  for delete using (public.org_role_level(organization_id) >= 3);


-- =============================================================================
-- performance_ratings
-- =============================================================================
alter table public.performance_ratings enable row level security;

create policy "perf_select" on public.performance_ratings
  for select using (public.is_org_member(organization_id));

create policy "perf_insert" on public.performance_ratings
  for insert with check (public.org_role_level(organization_id) >= 1);
  -- tech+ can log performance

create policy "perf_update" on public.performance_ratings
  for update using (public.org_role_level(organization_id) >= 1);

create policy "perf_delete" on public.performance_ratings
  for delete using (public.org_role_level(organization_id) >= 3);


-- =============================================================================
-- protocols
-- =============================================================================
alter table public.protocols enable row level security;

create policy "protocols_select" on public.protocols
  for select using (public.is_org_member(organization_id));

create policy "protocols_insert" on public.protocols
  for insert with check (public.org_role_level(organization_id) >= 2);
  -- manager+ can create protocols

create policy "protocols_update" on public.protocols
  for update using (public.org_role_level(organization_id) >= 2);

create policy "protocols_delete" on public.protocols
  for delete using (public.org_role_level(organization_id) >= 3);


-- =============================================================================
-- results
-- =============================================================================
alter table public.results enable row level security;

create policy "results_select" on public.results
  for select using (public.is_org_member(organization_id));

create policy "results_insert" on public.results
  for insert with check (public.org_role_level(organization_id) >= 1);

create policy "results_update" on public.results
  for update using (public.org_role_level(organization_id) >= 1);

create policy "results_delete" on public.results
  for delete using (public.org_role_level(organization_id) >= 3);


-- =============================================================================
-- environmental_observations
-- =============================================================================
alter table public.environmental_observations enable row level security;

create policy "env_obs_select" on public.environmental_observations
  for select using (public.is_org_member(organization_id));

create policy "env_obs_insert" on public.environmental_observations
  for insert with check (public.org_role_level(organization_id) >= 1);
  -- tech+ can log environmental observations

create policy "env_obs_update" on public.environmental_observations
  for update using (public.org_role_level(organization_id) >= 1);

create policy "env_obs_delete" on public.environmental_observations
  for delete using (public.org_role_level(organization_id) >= 3);


-- =============================================================================
-- recommendations
-- =============================================================================
alter table public.recommendations enable row level security;

create policy "recommendations_select" on public.recommendations
  for select using (public.is_org_member(organization_id));

create policy "recommendations_insert" on public.recommendations
  for insert with check (public.org_role_level(organization_id) >= 2);

create policy "recommendations_update" on public.recommendations
  for update using (public.org_role_level(organization_id) >= 2);

create policy "recommendations_delete" on public.recommendations
  for delete using (public.org_role_level(organization_id) >= 2);


-- =============================================================================
-- notification_rules
-- =============================================================================
alter table public.notification_rules enable row level security;

create policy "notif_rules_select" on public.notification_rules
  for select using (public.is_org_member(organization_id));

create policy "notif_rules_insert" on public.notification_rules
  for insert with check (public.org_role_level(organization_id) >= 2);
  -- manager+ can create notification rules

create policy "notif_rules_update" on public.notification_rules
  for update using (public.org_role_level(organization_id) >= 2);

create policy "notif_rules_delete" on public.notification_rules
  for delete using (public.org_role_level(organization_id) >= 2);


-- =============================================================================
-- notification_events
-- =============================================================================
alter table public.notification_events enable row level security;

create policy "notif_events_select" on public.notification_events
  for select using (
    public.is_org_member(organization_id)
    or user_id = auth.uid()
  );

create policy "notif_events_insert" on public.notification_events
  for insert with check (public.org_role_level(organization_id) >= 2);

create policy "notif_events_update" on public.notification_events
  for update using (public.org_role_level(organization_id) >= 2);

create policy "notif_events_delete" on public.notification_events
  for delete using (public.org_role_level(organization_id) >= 3);


-- =============================================================================
-- user_legal_acceptances (users see only their own)
-- =============================================================================
-- Table created in schema.sql; enable RLS here
alter table public.user_legal_acceptances enable row level security;

create policy "legal_select_own" on public.user_legal_acceptances
  for select using (user_id = auth.uid());

create policy "legal_insert_own" on public.user_legal_acceptances
  for insert with check (user_id = auth.uid());


-- =============================================================================
-- Storage policies for frog-photos bucket (apply via Supabase dashboard or SQL)
-- =============================================================================
-- Path convention: {organization_id}/{frog_id_or_context}/{filename}
--
-- These policies should be created in the storage schema.
-- Run these in the Supabase SQL editor or apply via dashboard.

-- Allow authenticated users to upload to their org folder
-- create policy "storage_insert" on storage.objects
--   for insert with check (
--     bucket_id = 'frog-photos'
--     and auth.role() = 'authenticated'
--     and public.is_org_member((storage.foldername(name))[1]::uuid)
--   );

-- Allow authenticated users to read from their org folder
-- create policy "storage_select" on storage.objects
--   for select using (
--     bucket_id = 'frog-photos'
--     and auth.role() = 'authenticated'
--     and public.is_org_member((storage.foldername(name))[1]::uuid)
--   );

-- Allow authenticated users to update in their org folder
-- create policy "storage_update" on storage.objects
--   for update using (
--     bucket_id = 'frog-photos'
--     and auth.role() = 'authenticated'
--     and public.is_org_member((storage.foldername(name))[1]::uuid)
--   );

-- Allow admin+ to delete from their org folder
-- create policy "storage_delete" on storage.objects
--   for delete using (
--     bucket_id = 'frog-photos'
--     and auth.role() = 'authenticated'
--     and public.org_role_level((storage.foldername(name))[1]::uuid) >= 3
--   );

-- NOTE: The frog-photos bucket must be set to PRIVATE (not public).
-- Use signed URLs to serve images to authenticated users.
-- TODO: Apply these via Supabase dashboard if storage.foldername is available,
-- or adapt to your Supabase version's storage path functions.
