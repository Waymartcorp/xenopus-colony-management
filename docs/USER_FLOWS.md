# User Flows

## Authentication and Onboarding

1. User signs up with email/password
2. User creates or joins an organization
3. Organization admin selects primary lab mode and enabled modules
4. User sees mode-specific dashboard

## Daily Workflow — Extract Lab Example

1. Tech opens dashboard → sees "Today's Colony Actions"
2. System shows: "Rack 1 / Bin 6 is ready for extraction (rest complete 112 days)"
3. Tech navigates to Rotation → sees rest queue and next-use recommendations
4. Tech selects bin → logs bin-level extraction event for all frogs
5. System records use event, starts rest timer for bin and frogs
6. Tech records performance/outcome per frog or bin
7. System updates cycle status, performance scores, and trends
8. System schedules rest-complete notification for target date

## Repopulation

1. Manager views /repopulation → sees bins below target capacity
2. System shows: "Rack 2 / Bin 14 needs 5 frogs. Suggested source: General Population"
3. Manager selects source frogs → confirms bulk move
4. System logs movement events, updates bin counts and cycle states

## Rotation Monitoring

1. Manager views /rotation → sees all bins by cycle state
2. Ready bins highlighted with days-since-rest-complete
3. Overdue bins shown with warning badges
4. Manager can drill into any bin for full history
5. Future forecast shows availability at 30/60/90/120 days

## Event Logging (Quick)

1. Tech clicks "+ Log Event" from any context
2. Selects event type (mode-specific templates shown first)
3. Enters frog code or selects bin for bulk event
4. Adds outcome/notes
5. Submits → event recorded in < 20 seconds

## Past View

1. User navigates to /past
2. Filters by date range, event type, frog, bin, protocol, source
3. Sees chronological timeline of events
4. Can compare results over time periods
5. Can group by season, month, protocol, source, or environmental condition

## Future View

1. User navigates to /forecast
2. Sees 30/60/90/120-day availability forecast
3. Sees bins becoming available soon
4. Sees bins overdue for reuse
5. Sees repopulation demand forecast
6. Sees next recommended use bins/frogs

## Performance Review

1. Manager navigates to /performance
2. Sees per-frog and per-bin performance summaries
3. Identifies declining performers
4. Reviews retirement candidates
5. Compares performance by source/cohort/season

## Environmental Notes

1. Tech navigates to /environment
2. Logs water temperature, pH, feeding change, etc.
3. Links observation to specific room/rack/bin
4. Later: analytics shows correlation with performance

## Notifications

1. User configures preferences at /notifications
2. Selects channels (email, SMS, in-app)
3. Selects frequency (daily, weekly, urgent-only)
4. System sends alerts based on rules and rotation state

## Workspace Profile

1. Admin navigates to /workspace-profile
2. Selects primary lab mode
3. Enables/disables modules
4. Dashboard, events, and notifications adapt to mode

## Reports and Export

1. User navigates to /reports
2. Selects report type (colony summary, performance, seasonal, rotation)
3. Exports as CSV or views printable summary
4. Future: PDF export with charts

## Shipment Claim

1. Supplier preloads shipment with frog records
2. Lab receives claim link via email
3. Lab admin clicks link → /shipments
4. Reviews shipment details → claims
5. Frogs are assigned to lab organization
