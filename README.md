# Xenopus Colony Management System

A standalone, private, **time-aware** colony management platform for Xenopus labs.

This is **not** Frog Social. It is a private operational system for labs and suppliers to manage frog inventory, housing, use/rest rotation, performance, protocols/results, environmental observations, notifications, visual analytics, and future photo-recognition.

## Working Product Name

**XenoTrack Colony Register**

## Core Principle

Private by default. Frog Social integration is optional later and user-controlled.

## What XenoTrack Answers

- Which frogs are available?
- Which frogs are resting?
- Which frogs are overdue for reuse?
- Which bins need repopulation?
- Which bins should be used next?
- Which frogs or bins are performing well or declining?
- What will be available in 30/60/90/120 days?
- What happened historically by season, protocol, source, bin, frog, or environmental condition?

## Tech Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS 3
- **Database:** Supabase Postgres
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage (frog photos)
- **Email:** Resend or Postmark
- **SMS:** Twilio
- **Charts:** Recharts / Chart.js / Nivo (planned)
- **Deployment:** Vercel

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  page.tsx                  # Landing page
  layout.tsx                # Root layout with grouped sidebar navigation
  dashboard/               # Colony overview, today's actions, rotation summary
  frogs/                   # Frog inventory with lifecycle states
  locations/               # Housing tree (rooms, racks, bins, tanks)
  rotation/                # Bin/frog rotation management
  repopulation/            # Bin guidance, next-use recommendations
  forecast/                # Future view — 30/60/90/120 day availability
  past/                    # Past view — historical timeline with filters
  events/                  # Event logging (individual + bin-level)
  performance/             # Performance tracking, trends, rankings
  analytics/               # Visual analytics dashboard
  seasonality/             # Seasonal patterns and comparisons
  environment/             # Environmental observations and trends
  photos/                  # Photo upload and gallery
  shipments/               # Shipment tracking and claim workflow
  notifications/           # Preferences, rules, history, scheduled alerts
  workspace-profile/       # Lab mode, modules, rotation settings
  reports/                 # Export and report generation
  institutions/            # Team and workspace management
  api/                     # API route handlers

components/
  # Colony & Rotation
  BinStatusCard.tsx             # Bin cycle state card with actions
  FrogStatusCard.tsx            # Frog cycle state card
  RotationPlanner.tsx           # Bins grouped by cycle state
  RestQueue.tsx                 # Upcoming availability queue
  FutureForecast.tsx            # Forecast period cards
  PastTimeline.tsx              # Chronological event timeline
  TodayColonyActions.tsx        # Today's actionable items
  RecommendationCard.tsx        # Next-use/repopulation recommendation
  RepopulationPlanner.tsx       # Repopulation guidance workflow

  # Inventory & Data
  FrogTable.tsx                 # Sortable, paginated frog table
  FrogCard.tsx                  # Individual frog summary card
  LocationTree.tsx              # Hierarchical location browser
  EventLogger.tsx               # Quick event creation form
  PhotoUploader.tsx             # Drag-and-drop photo upload

  # Analytics & Charts
  LineChartCard.tsx             # Time series / trend chart
  BarChartCard.tsx              # Comparison bar chart
  StackedBarChartCard.tsx       # Composition breakdown chart
  HistogramCard.tsx             # Distribution chart
  HeatmapPlaceholder.tsx       # Monthly/seasonal heatmap
  ScatterPlotPlaceholder.tsx   # Correlation scatter plot
  SummaryMetricCard.tsx        # Single KPI with trend

  # Settings & System
  WorkspaceProfile.tsx         # Workspace settings display
  LabModeSelector.tsx          # Lab mode selection grid
  InstitutionSwitcher.tsx      # Multi-org workspace switcher
  NotificationPreferences.tsx  # Channel and frequency settings
  NotificationScheduler.tsx    # Notification rule management
  ClaimRegisterCard.tsx        # Shipment claim workflow
  EnvironmentalNotes.tsx       # Environmental observation form

lib/
  supabase.ts               # Supabase client (browser + server)
  auth.ts                   # Authentication helpers
  permissions.ts            # Role-based permission system
  rotation.ts               # Cycle state management and transitions
  repopulation-rules.ts     # Bin guidance, recommendations, forecasting
  frog-codes.ts             # Public code generation and parsing
  storage.ts                # Supabase Storage upload/delete
  notifications.ts          # Multi-channel dispatch and templates

docs/                       # Product specs and documentation (17 docs)
supabase/                   # Database schema, seeds, and RLS policies
```

## Lab Modes

- **Extract Lab** — bin-level extraction cycles, rest queues, oocyte collection
- **Developmental Lab** — breeding, fertilization, embryo staging
- **Ovary & Oocyte** — individual female performance tracking
- **Transgenic / Embryo** — line/genotype management, screening
- **General Colony** — neutral inventory and use/rest

## Scale Targets

- 50+ labs at launch
- 300–400 frogs per lab
- 50–75 bins per lab
- Lab-configurable rotation (90–120 day rest cycles)
- Multi-user teams with role-based access
- Email and SMS notifications

## Not Yet Built

- Biometric matching / photo recognition
- Camera station / motion-triggered capture
- Scale integration / SVL automation
- Stripe billing
- Full Frog Social integration
- AI colony assistant
- Hardware / sensor integrations
- Advanced analytics engine (charts scaffolded, not wired)
