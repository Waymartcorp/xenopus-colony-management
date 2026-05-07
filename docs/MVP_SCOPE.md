# MVP Scope

## Build Now

### Core Infrastructure
- Private institution workspaces
- Authentication (Supabase Auth)
- Roles and permissions (owner, admin, manager, tech, viewer)
- Organization-level lab mode and module settings

### Frog Inventory
- Manual frog creation with lifecycle states
- Bulk import starter path
- Frog cycle status tracking (available, resting, overdue, etc.)
- Public codes and local IDs
- Performance score and trend tracking

### Housing / Locations
- Hierarchical location tree (rooms, racks, bins, tanks, tubs)
- Bin lifecycle states and capacity tracking
- Bin cycle status (ready, resting, needs repopulation, overdue)

### Rotation and Forecasting
- Lab-configurable rotation settings (min rest, target rest, overdue threshold)
- Automatic rest timers after use events
- Rest-complete and overdue notifications
- 30/60/90/120-day availability forecast
- Next-use recommendations
- Bin and frog status messages ("Resting — available Aug 30")

### Repopulation Guidance
- Bins needing repopulation with deficit counts
- Eligible source frogs/bins
- Performance-aware and compatibility-aware recommendations
- Bulk assign, bulk log, bulk move, bulk repopulate

### Events and History
- Event logging (use, rest, performance, health, movement, protocol)
- Bin-level events applying to all frogs in bin
- Past view timeline with filters
- Outcome/result recording per event

### Performance Tracking
- Per-frog and per-bin performance ratings (1–5 scale)
- Quality labels (poor/fair/good/excellent)
- Use count, average performance, trend
- Do-not-use and retirement candidate flags
- Protocol and result linking

### Environmental Notes
- Manual entry of water/room conditions
- Linkable to rooms, racks, bins, events
- Environmental observation history

### Notifications
- Email (Resend/Postmark) and SMS (Twilio) architecture
- In-app notifications
- Rest-complete, overdue, repopulation, next-use alerts
- Weekly colony summary
- Notification preferences per user

### Visual Analytics
- Dashboard stat cards and summary metrics
- Placeholder chart components (line, bar, stacked, heatmap)
- Performance dashboard
- Seasonality dashboard placeholder
- Rotation forecast charts placeholder

### Photo Upload
- Frog photo upload to Supabase Storage
- Photo type categorization
- Event/shipment photo attachments

### Shipments
- Xenopus 1 shipment preload and claim-link workflow
- Shipment tracking and history

### Workspace Profile
- Lab mode selection
- Enabled modules configuration
- Mode-specific dashboard and event templates

### Reports
- CSV export placeholders
- Summary report placeholders
- Seasonal and performance report placeholders

## Do Not Build Yet

- Biometric matching / photo recognition
- Motion-triggered camera station
- Scale integration
- Snout–vent length automation
- Stripe billing
- Full Frog Social integration
- AI colony assistant beyond simple rule-based guidance
- Hardware/sensor integrations
- Automated water/environmental monitoring

## MVP Success Criteria

- 50 labs can each have private workspaces with configurable lab modes
- A lab can manage 300–400 frogs and 50–75 bins without confusion
- A tech can log an event in under 20 seconds
- A lab manager can see which frogs/bins are ready, resting, overdue, or need review
- The system forecasts availability at 30/60/90/120 days
- Bulk actions work for bin-level use, rest, and repopulation
- The system can send email/SMS updates for rest-complete and overdue alerts
- Performance tracking shows trends over time
- Environmental notes are recorded and linkable
- Visual analytics placeholders are ready for chart integration
- The schema supports future photo-recognition without migration chaos
