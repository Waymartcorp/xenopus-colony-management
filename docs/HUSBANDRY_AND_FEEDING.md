# Husbandry & Feeding Module

## Overview

The Husbandry module is an **add-on feature** in XenoTrack. It tracks routine colony care — feeding, visual checks, water quality, and recurring maintenance — as first-class data alongside rotation and performance.

**Pricing model:** Free for 90 days after activation, then available as an upgrade tier.

## Why Husbandry Matters

Husbandry conditions explain performance variability, welfare outcomes, reproduction success, and colony stability. By tracking care alongside use/rest, labs can correlate:

- Feeding response → extraction performance
- Missed feedings → declined oocyte quality
- Water quality → frog health and behavior
- Post-use recovery care → time to next readiness
- Density management → stress and performance

## Module Components

### 1. Husbandry Checkpoints

Dated, repeatable checks at room, rack, bin/tank, or colony level.

**Checkpoint types:**
- daily_visual — general visual inspection
- feeding — feeding check
- mortality — dead/missing frog check
- behavior_activity — activity level observation
- water_level — water volume check
- cleanliness — tank/bin cleanliness
- system_filter — filtration/plumbing check
- light_cycle — photoperiod verification
- temperature — water/room temperature
- ph — water pH
- conductivity — water conductivity
- flow_nozzle — water flow check
- vibration_disturbance — noise/vibration note
- density — stocking density review
- quarantine — quarantine status check
- post_shipment_acclimation — new arrival acclimation
- post_use_recovery — recovery after extraction

**Fields:** organization_id, location_id, frog_id, checkpoint_type, status (normal/attention/urgent/skipped), notes, checked_by, checked_at, next_due_at, linked_event_id

### 2. Feeding Schedule & Logs

**Feeding schedules** define what/when/how much to feed by location:
- feed_type, default_amount, unit, frequency, time_of_day

**Feeding logs** record what actually happened:
- feed_type, amount, unit, feeding_method, response_rating (poor/fair/good/excellent), notes, fed_by, fed_at

**Example entries:**
- "Rack 2 / Bin 14 fed 3g frog brittle. Response: good."
- "GP Tank 2 missed feeding. Rescheduled for tomorrow."
- "Feeding increased for repopulated recovery bins."

### 3. Husbandry Tasks

Recurring tasks with assignment, due dates, and completion tracking.

**Frequencies:** daily, weekly, monthly, custom
**Status:** pending, completed, skipped, overdue
**Assignment:** by role or specific user

**Example tasks:**
- Daily feed Bin Group A
- Weekly pH/conductivity check
- Monthly filter inspection
- Post-shipment check 24h after arrival
- Check resting bins every 7 days
- Review overdue bins every Monday

### 4. Dashboard Integration

Today's Husbandry Actions appear alongside rotation actions:
- Feedings due today
- Missed feedings
- Checkpoints due/overdue
- Post-use recovery checks
- Water/environment notes needing review

### 5. Notifications

| Type | Example |
|------|---------|
| feeding_due | "Feeding due: Rack 1 / Bins 1–8 at 9:00 AM." |
| feeding_missed | "Missed feeding: GP Tank 2 was due yesterday 5:00 PM." |
| checkpoint_due | "pH/conductivity check due for Room A." |
| checkpoint_overdue | "Weekly pH check 3 days overdue for Room A." |
| abnormal_checkpoint | "Attention: Bin 14 feeding response marked poor for 2 consecutive feedings." |
| post_use_recovery | "Recovery check due: Rack 1 / Bin 5 (2 days since extraction)." |
| post_shipment_acclimation | "Post-shipment acclimation check due (24h after arrival)." |

### 6. Past & Future Views

**Past View** includes:
- Feeding logs, checkpoint history, missed tasks, abnormal observations
- Husbandry changes before/after performance results

**Future View** includes:
- Upcoming feedings, scheduled checks, recovery checks, maintenance tasks

### 7. Analytics Placeholders

Future correlation charts:
- Feeding response over time by bin
- Missed feedings by week/month
- Feeding schedule vs extraction performance
- Density vs feeding response
- Environmental checks vs performance
- Post-use recovery by feeding schedule
- Seasonal feeding/performance trends

## Lab Mode Behavior

| Lab Mode | Husbandry Emphasis |
|----------|-------------------|
| Extract Lab | Feeding, recovery bins, post-extraction checks |
| Ovary/Oocyte | Donor condition, feeding response, oocyte quality links |
| Developmental | Breeding recovery, embryo result links, environmental consistency |
| Transgenic | Line/cohort housing, density, breeding readiness |
| General | Neutral checklist and feeding schedule |

## Data Model

### husbandry_checkpoints
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| organization_id | uuid | FK organizations |
| location_id | uuid | FK locations (optional) |
| frog_id | uuid | FK frogs (optional) |
| checkpoint_type | text | Enum of 17 types |
| status | text | normal/attention/urgent/skipped |
| notes | text | |
| checked_by | uuid | User who performed check |
| checked_at | timestamptz | When performed |
| next_due_at | timestamptz | When next check is due |
| linked_event_id | uuid | Optional link to frog_event |

### feeding_schedules
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| organization_id | uuid | FK organizations |
| location_id | uuid | FK locations |
| feed_type | text | e.g., "frog brittle", "bloodworm" |
| default_amount | numeric | |
| unit | text | e.g., "g", "ml" |
| frequency | text | daily/weekly/custom |
| time_of_day | time | Scheduled feeding time |
| active | boolean | |
| notes | text | |

### feeding_logs
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| organization_id | uuid | FK organizations |
| location_id | uuid | FK locations |
| feed_type | text | |
| amount | numeric | |
| unit | text | |
| feeding_method | text | |
| response_rating | text | poor/fair/good/excellent |
| notes | text | |
| fed_by | uuid | User who fed |
| fed_at | timestamptz | |
| next_due_at | timestamptz | |

### husbandry_tasks
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| organization_id | uuid | FK organizations |
| location_id | uuid | FK locations |
| task_type | text | |
| title | text | |
| description | text | |
| frequency | text | daily/weekly/monthly/custom |
| assigned_role | text | |
| assigned_user_id | uuid | |
| due_at | timestamptz | |
| completed_at | timestamptz | |
| skipped_at | timestamptz | |
| status | text | pending/completed/skipped/overdue |
| notification_enabled | boolean | |

## RLS Policies

All husbandry tables use standard organization-scoped RLS:
- All members can read
- Tech+ can insert checkpoints and feeding logs
- Manager+ can create/edit schedules and tasks
- Admin+ can delete

## Pages & Routes

| Route | Purpose |
|-------|---------|
| /husbandry | Daily checkpoints, due/overdue items, quick actions |
| /feeding | Feeding schedules, logs, response tracking |
| /tasks | All recurring tasks with status and assignment |

## Future Enhancements

- Hardware sensor integration (temperature, pH, conductivity probes)
- Automated checkpoint creation from sensor readings
- Photo-based health assessment integration
- Feeding optimization suggestions from performance data
- Cross-lab husbandry best practice sharing via Frog Social (opt-in)
