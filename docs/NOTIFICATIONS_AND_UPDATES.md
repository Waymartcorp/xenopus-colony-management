# Notifications and Updates

## Purpose

Keep everyone managing the colony on the same page. The system should proactively inform users about rotation state, upcoming availability, needed actions, and performance changes.

## Channels

### Email

Use for:

- Weekly/daily colony summaries
- Shipment claim links
- Team invitations
- Reports
- Non-urgent reminders
- Forecast summaries

### SMS / Phone

Use for:

- Urgent review items
- Same-day reminders
- Time-sensitive operational messages
- Rest-complete alerts (if configured)
- Overdue rotation alerts

### In-App

Use for:

- Dashboard alerts
- Task lists (Today's Colony Actions)
- Rest warnings
- Bin planning prompts
- Performance decline notices
- Repopulation prompts

## Notification Types

### Rotation / Cycle Alerts

- Rest-complete bin/frog alerts
- Overdue rotation alerts
- Next-use recommendations
- Bins ready for extraction/use

### Repopulation

- Bin below target capacity
- Repopulation recommendation available
- Bulk action needed

### Performance

- Performance decline detected
- Missing performance/result data
- Retirement candidate identified
- Top performer available

### Colony Summary

- Weekly colony rotation summary
- Daily colony actions
- 30-day availability forecast
- Monthly performance report

### Environmental

- Environmental note reminder
- Condition change logged

### Protocol / Results

- Protocol result reminder
- Missing result follow-up

### Shipment

- Shipment claim reminder
- New shipment available for claim

## Notification Preferences

Each user should control:

- Email on/off
- SMS on/off
- In-app on/off
- Summary frequency: daily, weekly, none
- Urgent-only mode
- Role-based alerts
- Lab-mode-specific alert templates

## Example Messages

### Rest Complete

"Rack 1 / Bin 6 has completed rest. 8 frogs are eligible for reuse. Last extraction: 112 days ago."

### Repopulation Needed

"Rack 2 / Bin 14 needs repopulation. Current: 3 frogs. Target: 8. Recommended add: 5 mature females."

### Next Use Recommendation

"Next suggested bin for use: Rack 3 / Bin 8. Reason: rest complete, good prior performance, correct frog count, no active warnings."

### Overdue Alert

"17 frogs have been ready for more than 30 days and have not been returned to use. Review rotation plan."

### Weekly Summary

```
Colony Rotation Summary — Week of May 5, 2026

Ready bins: 4
Bins needing repopulation: 3
Rest-complete bins: 2
Overdue rest-complete frogs: 17
Next recommended extraction bin: Rack 1 / Bin 6

Performance:
- Average this week: 4.1 / 5
- Declining frogs flagged: 2
- Missing results: 3 events

Forecast:
- Bins available in 30 days: 6
- Bins available in 60 days: 11
- Bins available in 90 days: 18
```

## Initial Notification Rules

### Weekly Colony Summary

Sent to owners/managers. Includes active counts, ready/resting/overdue, recent events, bins needing attention, missing data, forecast.

### Rest-Complete Alert

Triggered when a bin or frog reaches rest_complete_at date.

### Overdue Alert

Triggered when a bin or frog passes overdue_at date without being used.

### Bin Repopulation Prompt

Triggered when bin current_count drops below threshold percentage of target_capacity.

### Missing Performance Note

Triggered when a use event lacks a performance rating after a configurable time.

### Forecast Summary

Monthly summary of upcoming availability and recommended actions.
