# MVP Scope

## Core Bin-Cycling Loop

The central XenoTrack workflow:

```
Populate bins → frogs acclimate → bins become ready →
user logs use → used frogs move to rest bin →
rest timer runs → notification sent when rest complete →
frogs return to rotation or stay in rest bin for next use
```

### The user journey:

1. Create account, log in
2. Create lab/workspace
3. Enter bins and frogs
4. Set acclimation period, rest rules, notifications
5. Bins become ready after acclimation
6. Log use (choose source bin, count, type, date)
7. Move used frogs to rest bin
8. System starts rest timer
9. System notifies when rest is complete
10. Frogs are available again — repeat cycle

---

## Build Now (Base Product)

### Account & Onboarding
- Supabase Auth signup/login
- Terms acceptance
- 10-step onboarding: workspace, housing term, bins, frogs, dates, acclimation, ready rule, photos, rest rules, notifications

### Bin-Centered Colony Register
- Bins as primary operating unit
- Frog records inside bins
- Bin status: available, resting, rest complete, overdue, needs repopulation
- Frog count per bin, target count
- Starting date, acclimation period, ready date

### Use & Rest Cycling
- Log use flow: select source bin, frog count, use type, date, performance note
- Move to rest: choose or create destination rest bin
- Rest timer starts automatically
- Original bin keeps history of removal
- Rest bin keeps record of which frogs arrived, from where, and when ready

### Notifications
- Rest-complete notification
- Overdue notification
- Ready-to-return notification
- Weekly summary (optional)
- Email notifications (SMS future)
- Configurable recipients per workspace

### Performance Tracking
- Per-use performance notes
- Bin-level average performance
- Use count per bin and frog
- Performance trends over time

### Forecasting & Capacity
- Which bins are resting and when they'll be ready
- Run-out prediction
- Bottleneck detection
- Repopulation needs

### Photo Archive
- Upload photos to bins, frogs, events
- Private storage with signed URLs
- Structured for future photo-ID tools
- No biometric matching built yet

### Whole Colony View
- All bins with status indicators
- Active/available frogs, resting frogs, ready frogs, overdue frogs
- Bins available, bins resting, bins needing repopulation
- Use counts and performance summaries

### Reports & Time Views
- Daily, weekly, monthly, yearly views (selectable)
- Use events, rest completions, available/resting counts
- Performance notes, repopulation needs, bottlenecks

### Workspace Settings
- Lab mode selection
- Housing terminology (bin/tank/tub)
- Rotation settings (rest days, overdue threshold)
- Notification recipients

---

## Do Not Build Yet

- Biometric matching / photo recognition
- Frog Sentinel / husbandry module (future add-on)
- Frog Social case linking (architecture only, not visible)
- Billing / subscriptions
- Hardware/sensor integrations
- AI colony assistant
- Motion-triggered camera
- Scale integration

---

## MVP Success Criteria

- A user can sign up, create bins, add frogs, and start the cycling loop in under 10 minutes
- Logging use and moving to rest takes under 30 seconds
- The system tracks rest timers and shows when bins are ready
- The dashboard clearly shows: what's ready, what's resting, what's overdue
- Notifications fire when rest is complete
- The whole-colony view gives a snapshot of the entire colony state
- Photos can be uploaded and stored as archive records
- Performance notes accumulate over time with use counts
- The user never feels lost — the app guides: bins → use → rest → notify → reuse
