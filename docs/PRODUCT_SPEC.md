# Product Spec

## Product Definition

XenoTrack Colony Register is a private, time-aware Xenopus colony management system. It enables labs to track frog inventory, housing, use/rest rotation, repopulation, performance, protocols/results, environmental conditions, and forecasting — all in one system.

## Target Users

- Lab managers / PIs
- Lab technicians
- Animal facility staff
- Supplier organizations (limited shipment preload)

## Workspace and Organization

- Each lab/institution gets a private workspace
- Users belong to one or more organizations
- Roles: owner, admin, manager, tech, viewer
- Organization-level settings control lab mode, rotation rules, and modules

## Lab Mode Profiles

Organizations choose a primary lab mode that customizes:

- Dashboard cards and metrics
- Event type templates
- Notification wording
- Report presets
- Analytics presets

Modes:

1. **Extract Lab** — bin-level extraction cycles, rest queues, repopulation
2. **Developmental Lab** — breeding, fertilization, embryo production, staging
3. **Ovary and Oocyte** — individual female performance, oocyte quality
4. **Transgenic / Embryo Development** — line/genotype, founders, crosses
5. **General / Mixed-Use** — neutral colony management

## Core Modules

### Frog Inventory
- Individual frog records with public code, local ID, sex, size class, source
- Status tracking through lifecycle states
- Performance history and use counts
- Photo attachments

### Housing (Bins / Locations)
- Hierarchical: rooms → racks → bins/tanks/tubs
- Capacity tracking and density management
- Bin lifecycle states and rotation status
- Cohort grouping

### Rotation and Forecasting
- Lab-configurable rest intervals (e.g., 90–120 days)
- Automatic rest timers after use
- Rest-complete and overdue alerts
- 30/60/90/120-day availability forecasts
- Next-use recommendations

### Repopulation Guidance
- Bins needing repopulation with counts
- Eligible source frogs/bins
- Performance-aware recommendations
- Bulk assign/move/log capabilities

### Events and History
- Use, rest, performance, health, movement, protocol events
- Bin-level events affecting all contained frogs
- Timeline view and date-range filtering

### Performance and Results
- Per-frog and per-bin performance scores
- Quality ratings, usable flags, trend tracking
- Protocol-linked results
- Seasonality and source/cohort analysis

### Environmental Observations
- Water temperature, pH, conductivity
- Room conditions, feeding, lighting
- Linkable to locations, events, protocols, results
- Future sensor/monitoring integration ready

### Notifications
- Email, SMS, in-app channels
- Rest-complete, overdue, repopulation, next-use alerts
- Weekly colony summaries
- Lab-mode-specific alert templates

### Visual Analytics
- Time/seasonality charts
- Rotation/forecasting charts
- Performance charts
- Environmental correlation charts
- Dashboard, past view, and future view integration

### Reports and Exports
- CSV export for data tables
- Printable summary reports
- Seasonal and performance report exports
- Future PDF/chart export

### Photo Upload and Future Imaging
- Standard frog photo upload (dorsal, ventral, side, health)
- Shipment and event photo attachments
- Future-ready fields for biometric matching (not yet built)

## Not In Scope (Current)

- Biometric matching / photo recognition
- Camera station / motion-triggered capture
- Scale integration / SVL automation
- Stripe billing
- Full Frog Social integration
- AI colony assistant
- Hardware/sensor integrations
