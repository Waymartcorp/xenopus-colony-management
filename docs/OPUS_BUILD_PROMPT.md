# Opus Build Prompt

Create a new Next.js + TypeScript + Tailwind application called `xenopus-colony-management`.

The app is a standalone private Xenopus colony management system, not Frog Social.

Build the initial repo scaffold, docs, placeholder pages, and Supabase schema for:

- Private institution/lab workspaces
- User accounts and organization memberships
- Frog inventory
- Frog photo upload
- Housing locations: rooms, racks, bins, tanks, tubs, cohorts
- Use/rest/performance event logging
- Repopulation and bin-use guidance
- Email/SMS-ready notifications
- Xenopus 1 shipment preload and claim-link workflow
- Future-ready fields for biometric photo recognition, weight, snout–vent length, capture station, and image embeddings

Create this folder structure:

app/
  dashboard/
  institutions/
  frogs/
  shipments/
  locations/
  photos/
  events/
  notifications/
  repopulation/
  api/

components/
  FrogTable.tsx
  FrogCard.tsx
  PhotoUploader.tsx
  EventLogger.tsx
  LocationTree.tsx
  InstitutionSwitcher.tsx
  ClaimRegisterCard.tsx
  NotificationPreferences.tsx
  RepopulationPlanner.tsx

lib/
  supabase.ts
  auth.ts
  permissions.ts
  frog-codes.ts
  storage.ts
  notifications.ts
  repopulation-rules.ts

docs/
  PROJECT_OVERVIEW.md
  PRODUCT_SPEC.md
  MVP_SCOPE.md
  DATA_MODEL.md
  USER_FLOWS.md
  NOTIFICATIONS_AND_UPDATES.md
  REPOPULATION_AND_BIN_GUIDANCE.md
  IMAGING_ROADMAP.md
  PRIVACY_AND_PERMISSIONS.md
  DEPLOYMENT.md
  SETUP_CHECKLIST.md

supabase/
  schema.sql
  seed.sql
  policies.sql

Create placeholder UI pages and components with clear TODO comments. Use Supabase Auth, Supabase Storage, and Postgres. Do not build biometric matching yet, but design the schema to support it later.
