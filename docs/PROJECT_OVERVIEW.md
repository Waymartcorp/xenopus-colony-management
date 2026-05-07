# Project Overview

## Product Name

**XenoTrack Colony Register**

Internal repo: `xenopus-colony-management`

## What It Is

XenoTrack is a private, time-aware Xenopus colony management system for labs managing up to 300–400 frogs and 50–75 bins per lab, with launch support for at least 50 labs.

It tracks:

- Inventory (frogs, bins, tanks, racks, rooms)
- Use/rest cycles and rotation
- Repopulation and bin guidance
- Performance and results
- Protocols and outcomes
- Environmental observations
- Notifications (email, SMS, in-app)
- Visual analytics and seasonality
- Future photo-recognition (architecture only, not yet built)

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
