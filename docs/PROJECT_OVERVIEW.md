# Project Overview

## Product Name

**XenoTrack Colony Register**

Internal repo: `xenopus-colony-management`

## What It Is

XenoTrack is a private Xenopus colony register that replaces colony guesswork with dated records. It tracks bins, frogs, use/rest cycles, performance, and future availability — showing what actually happened, not what people assume happened.

### Core Principle

Bridge the gap between what PIs think is happening and what actually happens day-to-day. Make this visible without blame.

### Core Loop

Populate bins → frogs acclimate → bins become ready → log use → move to rest → rest timer → notification → return to rotation.

### Key Capabilities

- **Colony Calculator** — real-time stock counts, ordering advisor, sustainability checks, "Ask XenoTrack" guided answers
- **Reality Check** — assumptions vs actuals comparison (expected bins vs actual, expected usage vs actual)
- **Record Completeness** — shows where data is complete or missing (placement confirmed, performance notes, photos)
- **CSV Export** — download colony records for backup, analysis, or reporting
- **PI Summary** — high-level colony health at a glance
- **Technician Workflow** — guided bin-to-bin movement with recommendations

### Base Product (always included)

- Bin-centered colony register (bins are the primary operating unit)
- Frog inventory inside bins
- Use/rest cycling with guided flow
- Rest timers with notifications when complete
- Repopulation and bin capacity guidance
- Next-use recommendations
- Performance notes and use counts
- Past/future views and calendar
- Capacity forecasting and run-out prediction
- Bottleneck detection
- Email/SMS/in-app notifications
- Basic photo upload (private storage)
- Future imaging architecture (not built yet)

### Future Paid Add-ons (not part of base product)

- **Photo-ID & Imaging** — phone-guided capture, fingerprinting, photo-to-frog matching (coming soon)
- **Frog Sentinel** — husbandry companion: feeding, checkpoints, environmental notes, care correlations (coming soon)
- **Frog Social Case Support** — user-controlled case sharing for expert consultation (future)
- **Visual Analytics** — charts, trends, seasonality dashboards (future)

These are not available to users now. See `docs/MODULES.md` for the full product ladder.

## What It Is Not

XenoTrack is **not** Frog Social. It is a standalone private operational system. Frog Social integration is optional later and user-controlled.

## Core Principle

**Private by default.** All colony data belongs to the institution.

## Core Questions the Product Answers

- Which frogs are available?
- Which frogs are resting?
- Which frogs are overdue for reuse?
- Which bins need repopulation?
- Which bins should be used next?
- Which frogs or bins are performing well or declining?
- What will be available in 30/60/90/120 days?
- What happened historically by season, protocol, source, bin, frog, or environmental condition?

## Time Awareness

The system supports both:

- **Past View**: what happened, when, and with what result.
- **Future View**: what should happen next, when, and why.

## Lab Modes

XenoTrack supports configurable workspace profiles:

- Extract Lab (bin-level extraction cycles, oocyte collection)
- Developmental Lab (breeding, fertilization, embryo staging)
- Ovary and Oocyte (individual female performance tracking)
- Transgenic / Embryo Development (line/genotype management)
- General / Mixed-Use Colony (neutral inventory and use/rest)

One shared data model. Mode-specific labels, dashboards, event templates, notifications, and analytics presets.

## Stack

- Next.js 15 + TypeScript + Tailwind CSS
- Supabase Postgres + Auth + Storage
- Vercel deployment
- Resend or Postmark for email
- Twilio for SMS
- Future: charting library (Recharts, Chart.js, or similar)

## Scale Targets

- 50+ labs at launch
- 300–400 frogs per lab
- 50–75 bins per lab
- Multi-user teams with role-based access
- Email and SMS notifications
