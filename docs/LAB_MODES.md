# Lab Modes

## Overview

XenoTrack supports configurable lab mode profiles. One shared data model with mode-specific labels, dashboard cards, event templates, notification templates, report presets, and analytics presets.

Do not create separate apps for each mode.

## Available Modes

### A. Extract Lab View

**Focus:** bin-level extraction cycles, rest queues, repopulation, extract performance, seasonality.

**Default Events:**
- Extraction use
- Squeeze / oocyte collection
- Rest start
- Rest complete
- Repopulation
- Extract performance result
- Protocol result
- Environmental note

**Dashboard Cards:**
- Ready bins count
- Resting bins count
- Overdue bins
- Next recommended extraction bin
- Weekly extraction count
- Average performance this month

**Alerts:**
- Bin ready for extraction
- Bin overdue
- Bin needs repopulation
- Performance decline
- Missing extract result
- Upcoming extraction window

---

### B. Developmental Lab View

**Focus:** breeding, fertilization, embryo production, staging, developmental outcomes, recovery.

**Default Events:**
- Priming injection
- Ovulation injection
- Pairing / breeding
- Fertilization
- Embryo staging
- Developmental outcome
- Recovery note
- Protocol result

**Dashboard Cards:**
- Females ready for breeding
- Males recently used
- Active pairings
- Fertilization success rate (recent)
- Embryo batches in progress
- Recovery queue

**Alerts:**
- Females ready for breeding
- Males recently used
- Fertilization result missing
- Poor embryo survival trend
- Developmental follow-up due

---

### C. Ovary and Oocyte View

**Focus:** individual female performance, oocyte quality, rest interval, repeat performance, declining donors.

**Default Events:**
- Injection
- Squeeze
- Oocyte extraction
- Oocyte quality rating
- Recovery note
- Rest period
- Performance result

**Dashboard Cards:**
- Top donors available
- Females resting (with dates)
- Females overdue for reuse
- Declining performers
- Average oocyte quality this month
- Quality by rest duration

**Alerts:**
- Female ready after rest
- Used too soon
- Declining oocyte quality
- Top donor available
- Performance note missing
- Overdue donor review

---

### D. Transgenic / Embryo Development View

**Focus:** line/genotype management, founders, crosses, embryo cohorts, screening results.

**Default Events:**
- Cross setup
- Founder record
- Genotype assignment
- Embryo collection
- Line expansion
- Cohort movement
- Screening result
- Developmental outcome

**Dashboard Cards:**
- Active lines
- Founders ready
- Pending crosses
- Cohorts needing housing
- Screening results pending
- Line expansion status

**Alerts:**
- Line needs breeding
- Founder ready
- Cohort needs housing
- Genotype result missing
- Embryo follow-up due

---

### E. General / Mixed-Use Colony View

**Focus:** neutral colony management, inventory, use/rest history, basic repopulation, flexible modules.

**Default Events:**
- Use
- Rest start
- Rest complete
- Health observation
- Movement
- Environmental note

**Dashboard Cards:**
- Active frogs
- Resting frogs
- Ready bins
- Bins needing repopulation
- Recent events
- Alerts

**Alerts:**
- Rest complete
- Overdue
- Repopulation needed
- Health warning
- Missing data

## Implementation

### Organization-Level Fields

- `primary_lab_mode`: extract, developmental, ovary_oocyte, transgenic, general
- `enabled_modules`: JSON array of module keys

### Module Keys

- inventory
- rotation
- repopulation
- events
- performance
- protocols
- results
- environment
- notifications
- analytics
- photos
- shipments
- reports

### Mode Affects

- Dashboard card selection and ordering
- Event type quick-select templates
- Notification message wording
- Report presets
- Analytics chart defaults
- Sidebar navigation emphasis

### Workspace Profile UI

Location: /workspace-profile

Allows admin/owner to:
- Select primary lab mode
- Enable/disable modules
- View mode description and defaults
- Customize dashboard card selection (later)
