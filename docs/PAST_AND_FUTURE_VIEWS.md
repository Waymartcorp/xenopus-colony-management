# Past and Future Views

## Philosophy

XenoTrack must be time-aware. The system supports both looking backward (what happened and with what result) and looking forward (what should happen next, when, and why).

## Past View

### What It Shows

Historical timeline of:
- Arrivals and shipments
- Movements between bins
- Injections and preparations
- Squeezes / oocyte extractions / breeding events
- Performance ratings
- Health notes and observations
- Rest periods (start and completion)
- Retirements and deaths
- Protocol events
- Results and outcomes
- Environmental observations

### Filters

- Frog (by code or local ID)
- Bin / location
- Rack / room
- Date range
- Event type
- Protocol
- Cohort / source / shipment
- Performance outcome
- Lab mode event types

### Comparisons

- Compare results over time periods
- Show results by season / month
- Show results by protocol
- Show results by source / cohort
- Show results by bin
- Show results by frog
- Show results by environmental condition
- Show results by rest duration

### UI Components

- PastTimeline — chronological event list with filters
- Performance comparison cards
- Seasonal breakdown tables
- Source/cohort performance tables

---

## Future View

### What It Shows

Forecast frogs and bins by availability date:
- Rest-complete dates based on lab settings
- Bins becoming available soon
- Bins overdue for reuse
- Bins needing repopulation
- Next recommended bins/frogs for use
- Scheduled notifications/reminders
- 30/60/90/120-day availability forecast
- Extraction/breeding/oocyte availability windows

### Forecast Intervals

- Today: what's ready right now
- 7 days: what becomes ready this week
- 30 days: next month availability
- 60 days: two-month horizon
- 90 days: quarter horizon
- 120 days: full cycle horizon

### UI Components

- FutureForecast — availability timeline
- RotationCalendar — calendar view of rest completions
- RestQueue — ordered list of upcoming availability
- TodayColonyActions — what needs attention today
- Forecast charts (bins by state over time)

### Example Cards

#### Future Bin Card

```
Rack 2 / Bin 14
Status: Resting
Last used: May 2, 2026
Rest target: 120 days
Available again: Aug 30, 2026
Current count: 8 frogs
Use count this cycle: 1
Average performance: 4.1 / 5
Next action: Keep resting
Days until ready: 86
```

#### Ready Bin Card

```
Rack 1 / Bin 6
Status: Ready for use
Rest completed: Apr 20, 2026
Days ready: 14
Current count: 10 frogs
Average performance: 4.2 / 5
Recommended action: Use next for extraction
```

### Forecast Summary

```
30-Day Forecast:
- Bins becoming available: 3
- Frogs becoming available: 24
- Bins still resting: 8
- Bins already overdue: 2
- Repopulation actions needed: 1

60-Day Forecast:
- Bins becoming available: 7
- Frogs becoming available: 56
- Expected ready-for-use total: 12
```

---

## Integration Points

- Dashboard shows summary of both past (recent events) and future (next actions)
- Notifications triggered by future dates (rest-complete, overdue)
- Analytics pulls from past data for trends
- Rotation view combines current state with future projections
- Reports can cover past periods or future forecasts
