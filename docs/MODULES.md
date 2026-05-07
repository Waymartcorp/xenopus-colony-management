# Modules — Base Product vs Optional Add-Ons

## Design Principle

XenoTrack's default experience should remain **simple, bin-centered, and operational**. The base product answers:

- What bins need action?
- What frogs are ready?
- What's resting and when will it be available?
- Are we running out?
- What should we do next?

Optional modules extend this core with additional capabilities that not every lab needs.

---

## Base Product (always included)

The XenoTrack Colony Register base product includes:

| Feature | Description |
|---------|-------------|
| Private lab workspace | Secure, organization-scoped data |
| Bin-centered colony register | Bins as the primary operating unit |
| Frog inventory | Individual frog records inside bins |
| Use/rest rotation tracking | Cycle states, rest timers, reuse windows |
| Repopulation guidance | Bin capacity monitoring, GP source tracking |
| Next-use recommendations | Suggested bins for extraction |
| Performance notes | Post-use quality ratings |
| Past/future views | Historical timeline and upcoming calendar |
| Capacity forecasting | Run-out prediction, supply vs demand |
| Bottleneck detection | 12 bottleneck categories with severity |
| Email/SMS notifications | Rest-complete, overdue, weekly summary |
| Basic photo upload | Private storage with signed URLs |
| Future imaging architecture | Schema and fields ready, matching not built |

**The base dashboard shows ONLY rotation/colony actions unless optional modules are enabled.**

---

## Optional Modules

Each optional module can be enabled per-organization. During launch, all modules are offered with a **free 90-day trial**.

### husbandry_tracking
Track feeding, visual checks, care checkpoints, and recovery observations.

### feeding_schedule
Per-bin feeding schedules with response ratings and missed feeding alerts.

### environmental_notes
Water quality, temperature, pH, conductivity, and environmental correlation.

### protocols_results
Structured lab protocols and result records linked to events.

### frog_social_bridge
Connect selected records to Frog Social cases. Private by default.

### visual_analytics
Charts, trends, seasonality analysis, and visual dashboards.

### imaging_future
Photo-based identification and health assessment (architecture only).

---

## Module Entitlement

### Organization Settings

The `organizations.enabled_modules` JSONB column lists active module names:

```json
["inventory", "rotation", "repopulation", "events", "performance", "notifications", "photos", "shipments"]
```

Optional modules are added to this array when enabled.

### Trial Management

The `organization_module_trials` table tracks:

| Column | Description |
|--------|-------------|
| organization_id | Which org |
| module_name | Which module |
| trial_started_at | When trial began |
| trial_ends_at | 90 days later |
| status | active / expired / converted / disabled |

### Future Billing

TODO: After early testing, add:
- `organization_subscriptions` table
- Pricing tiers per module
- Stripe/billing integration
- Trial expiration enforcement
- Upgrade prompts

**Do NOT build billing yet.**

---

## Navigation Behavior

### Default (base product only)

```
Colony: Today's Actions, Bins & Rotation, Whole Colony, Frogs, Repopulation
Forecast: Forecast, Capacity / Run-Out, Bottlenecks
Records: Events, Performance, Photos, History
System: Notices, Shipments, Workspace
```

### When optional modules are enabled

Additional nav sections appear:
- Husbandry: Husbandry, Feeding, Tasks
- More: Environment, Analytics, Frog Social, Manage Modules

---

## Frog Social Bridge Rules

1. XenoTrack remains **private by default**
2. **No colony data goes to Frog Social automatically**
3. Users may choose to connect selected records
4. Users may create a case from selected frog/bin/history data
5. Users **preview exactly what will be shared** before sending
6. De-identification option available
7. Users can revoke sharing at any time

Language to use:
- "Connect selected records"
- "Create a case from this bin/frog history"
- "Share selected history for case support"
- "Compare against broader Xenopus case histories"
- "Private by default"

**Never say** colony data is automatically migrated or shared.

---

## User Opt-In Flow

The `/modules` page shows:

1. Base product card (always included, marked "Included")
2. Optional modules with descriptions
3. "Enable 90-Day Trial" button for each
4. Active trials with expiration dates
5. Module management when active

---

## Dashboard Behavior

**Base dashboard shows only:**
- Today's colony actions (bins needing repop, next-use, rest-complete, overdue)
- Run-out / bottleneck warnings
- Notices sent/pending
- Missing performance results

**When husbandry is enabled, additionally show:**
- Feedings due today
- Missed feedings
- Overdue husbandry tasks
- Recovery checks

**Modules should enhance, not clutter, the core experience.**
