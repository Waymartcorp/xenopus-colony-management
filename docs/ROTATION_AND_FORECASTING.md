# Rotation and Forecasting

## Purpose

XenoTrack must support labs managing 300–400 frogs across 50–75 bins, especially extract/oocyte labs that cycle bins after use and rest frogs for lab-configurable periods (typically 90–120 days).

Rotation and forecasting are first-class features, not afterthoughts.

## Frog Lifecycle States

- **available** — ready for use, rest period complete
- **scheduled** — selected for upcoming use
- **recently_used** — used within the last few days
- **resting** — in mandatory rest period
- **rest_complete** — rest period finished, awaiting reuse
- **overdue** — past preferred reuse window, needs attention
- **hold/monitor** — flagged for health review or observation
- **retired** — permanently removed from use rotation
- **deceased** — dead

## Bin Lifecycle States

- **general_population** — holding frogs not in active rotation
- **recent_arrival** — new frogs, acclimating
- **ready_for_use** — rest complete, adequate count, ready to be used
- **scheduled_next** — selected as next use bin
- **recently_used** — used within the last few days
- **needs_repopulation** — below target capacity
- **resting** — in mandatory rest period after use
- **rest_complete** — rest finished, ready for reuse
- **overdue** — past preferred window, needs attention
- **hold/monitor** — flagged for review

## Rotation Settings (Per Organization)

```
rotation_settings:
  minimum_rest_days: 90
  target_rest_days: 120
  overdue_after_days: 135
  preferred_reuse_window_start: 90
  preferred_reuse_window_end: 120
  default_target_bin_capacity: 8
  default_mode: extract
```

## Rotation Logic

1. When a bin-level use event is logged:
   - All frogs in bin marked `recently_used`
   - After 1 day: frogs transition to `resting`
   - Bin transitions to `resting`
   - `rest_started_at` set to event date
   - `rest_complete_at` calculated from target_rest_days
   - `overdue_at` calculated from overdue_after_days

2. When rest_complete_at is reached:
   - Frog/bin transitions to `rest_complete`
   - Notification triggered (if enabled)
   - Bin appears in "ready for use" list

3. When overdue_at is reached:
   - Frog/bin transitions to `overdue`
   - Urgent notification triggered
   - Bin highlighted in rotation dashboard

4. Performance-aware recommendations:
   - Bins with higher average performance recommended first
   - Bins with declining performance flagged for review
   - Frogs with do_not_use flag excluded

## Status Messages

The system produces human-readable status messages:

- "Resting — available Aug 30"
- "Rest complete — ready for reuse"
- "Overdue — ready for 31 days"
- "Needs repopulation — add 5 frogs"
- "Use next — best candidate bin"
- "Hold — review required"
- "Recently used — resting starts tomorrow"

## Forecasting

### 30/60/90/120-Day Forecast

For any point in the future, show:
- Number of bins becoming available
- Number of frogs becoming available
- Bins still resting
- Bins overdue by that date
- Repopulation demand

### Future View Cards

Example:

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
```

```
Rack 1 / Bin 6
Status: Ready for use
Rest completed: Apr 20, 2026
Days ready: 14
Current count: 10 frogs
Recommended action: Use next for extraction
```

## Bulk Operations

- Bulk log use event for entire bin
- Bulk move frogs to rest
- Bulk mark rest complete
- Bulk schedule next use
- Bulk update cycle states after system events

## Preventing Stale Rotation

The system should prevent frogs from "hanging out" past their target reuse window:

- Overdue alerts when bins pass preferred_reuse_window_end
- Escalating notifications (in-app → email → SMS)
- Dashboard highlights for overdue items
- Weekly summary includes overdue counts
- Overdue frogs/bins shown prominently in rotation view
