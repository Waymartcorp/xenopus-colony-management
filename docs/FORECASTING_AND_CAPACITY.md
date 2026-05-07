# Forecasting & Capacity Planning

## Overview

XenoTrack includes capacity forecasting to help labs understand whether their colony rotation is sustainable. The system predicts when ready frogs will run out, identifies bottlenecks, and recommends actions to maintain continuous availability.

## Key Questions the Forecast Answers

- "When will we run out of ready frogs?"
- "Are we using frogs faster than they are becoming available?"
- "What is the bottleneck?"
- "What bins should we use next?"
- "What will be ready next month?"
- "What bins need repopulation?"

## Forecast Views

### Time Periods

Users can toggle between:
- **Today** — immediate actions and current state
- **This week** — 7-day outlook
- **Next 30 days** — short-term planning
- **Next 60 days** — medium-term planning
- **Next 90 days** — long-term planning
- **Next 120 days** — full rest-cycle horizon
- **Monthly** — month-by-month capacity breakdown

### Each View Shows

- Ready frogs / bins now
- Resting frogs / bins
- Frogs / bins becoming ready
- Bins needing repopulation
- Expected use demand
- Expected shortfall or surplus
- Projected bottlenecks

## Run-Out Prediction

The run-out module estimates:
- Days until usable frog shortage
- Date when ready frogs fall below threshold
- Date when ready bins fall below threshold
- Whether current use rate exceeds recovery/rest rate
- How many frogs/bins need to be added or rested to avoid shortage

### Example Output

> "At the current use rate of 16 frogs/week and a 120-day rest period, this lab is projected to fall below its ready-frog threshold on July 18."
>
> "Projected shortage: 24 frogs over the next 60 days."
>
> "Recommended action: repopulate 3 bins with 8 frogs each or reduce use rate by 6 frogs/week."

## Bottleneck Detection

### Categories

| Bottleneck Type | Description |
|----------------|-------------|
| not_enough_ready_frogs | Ready frog count below threshold |
| not_enough_ready_bins | Ready bin count below threshold |
| too_many_resting | Excessive portion of colony in rest state |
| rest_complete_not_reused | Bins/frogs ready but not scheduled |
| general_population_low | GP source declining below sustainability |
| repopulation_lag | Bins below capacity for extended period |
| performance_decline | Declining performance reducing usable frogs |
| missing_performance_data | Gaps reducing forecast accuracy |
| overuse_risk | Use rate exceeds sustainable rotation |
| demand_exceeds_available | Scheduled demand more than available supply |
| source_cohort_imbalance | Uneven distribution across cohorts |
| recent_arrival_bottleneck | New arrivals not yet integrated |

### Each Bottleneck Includes

- Severity: low / medium / high
- Affected bins or frogs
- Date range
- Reason text
- Recommended action
- Status: active / acknowledged / resolved / dismissed

## Forecasting Assumptions

Users configure (or the system calculates from history):

| Setting | Default | Description |
|---------|---------|-------------|
| average_frogs_used_per_week | 16 | Typical extraction demand |
| average_bins_used_per_week | 2 | Bins used per extraction day |
| minimum_rest_days | 90 | Earliest reuse |
| target_rest_days | 120 | Ideal rest period |
| overdue_after_days | 135 | Overdue threshold |
| ready_frog_threshold | 32 | Minimum ready frogs before alert |
| ready_bin_threshold | 4 | Minimum ready bins before alert |
| expected_retirement_rate | 2/month | Frogs lost to age/health |
| expected_repopulation_rate | 8/month | Frogs added from GP/shipments |
| forecast_window_days | 120 | How far ahead to project |

**TODO:** Auto-calculate these from historical frog_events data.

## Data Model

### forecast_settings (per org)
Stores the assumptions above. One row per organization.

### forecast_snapshots
Point-in-time snapshots of the forecast state. Generated daily or on-demand. Stores ready counts, projections, shortfall, run-out date, and recommendations as JSON.

### bottlenecks
Active and historical bottleneck records with type, severity, affected entities, recommended actions, and lifecycle status.

## Notifications

Forecast-related notification types:

| Type | Trigger | Default Channel |
|------|---------|-----------------|
| projected_shortage | Shortfall detected for upcoming period | email |
| runout_warning | Run-out date within alert window | email + sms |
| frog_threshold_crossed | Ready frogs below threshold NOW | email + sms |
| bin_threshold_crossed | Ready bins below threshold NOW | email + sms |
| weekly_bottleneck_summary | Weekly digest of active bottlenecks | email |
| monthly_capacity_forecast | Monthly capacity and sustainability report | email |
| urgent_repopulation | Repopulation needed within 14 days | email + sms |

### Example Messages

**Run-out warning:**
> "Run-out warning: At your current use rate, ready frogs are projected to fall below threshold in 23 days."

**Weekly bottleneck summary:**
> "Weekly bottleneck summary: 2 bins need repopulation, 17 frogs are overdue for reuse, and ready supply is projected to drop below target next month."

**Repopulation recommendation:**
> "Repopulation recommendation: Add 24 mature females over the next 14 days to maintain the current extraction schedule."

## Daily / Weekly / Monthly Reports

### Daily Report
- Today's actions
- Bins ready today
- Bins needing repopulation today
- Urgent bottlenecks

### Weekly Report
- Ready / resting / overdue counts
- Next-use bins
- Repopulation needs
- Projected shortage risk
- Missing data alerts

### Monthly Report
- Use rate trends
- Performance trends
- Seasonality notes
- Projected capacity
- Active bottlenecks
- Recommended colony adjustments

## UI Components

| Component | Purpose |
|-----------|---------|
| CapacityForecast | Summary card with supply, demand, shortfall |
| RunOutForecast | Run-out date and days-until warning |
| BottleneckPanel | Active bottlenecks with severity and actions |
| ForecastAssumptions | Visible assumptions panel |
| DailySummary | Today's action items |
| WeeklySummary | 7-day overview with bottleneck alerts |
| MonthlySummary | Monthly capacity and trends |

## Pages

| Route | Purpose |
|-------|---------|
| /forecast | Main forecast with period toggle and timeline |
| /capacity | Run-out prediction and supply/demand analysis |
| /bottlenecks | All bottlenecks with severity and actions |
| /reports | Generated report access (daily/weekly/monthly) |

## Future Enhancements

- Auto-calculation of use rates from historical events
- Machine learning for performance prediction
- Seasonal adjustment factors
- Multi-cohort forecasting
- Scenario modeling ("what if we add 24 frogs?")
- Integration with scheduled calendar events
- PDF report generation
