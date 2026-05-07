# Performance and Seasonality

## Performance Tracking

### Per-Frog Metrics

- Individual use count (lifetime)
- Average performance score (1–5)
- Last performance score
- Performance trend: improving / stable / declining
- Best performance score
- Worst performance score
- Do-not-use flag
- Retirement candidate flag

### Per-Bin Metrics

- Bin use count (lifetime and per-cycle)
- Average bin performance score
- Last performance score
- Performance trend
- Best cycle performance
- Historical density at time of use

### Derived Analytics

- Source / cohort / shipment performance comparison
- Rest duration vs performance correlation
- Use count vs performance (diminishing returns)
- Performance by protocol
- Performance by season / month
- Performance by environmental condition
- Performance by bin density
- Performance by age (time since arrival)

## Performance Rating System

### Score Scale

- 5 — Excellent
- 4 — Good
- 3 — Fair
- 2 — Poor
- 1 — Very poor / no usable result

### Quality Labels

- excellent
- good
- fair
- poor

### Usable Flag

- yes — fully usable result
- partial — partially usable
- no — not usable

### Trend Calculation

Based on last N performance ratings (configurable, default 5):
- improving: recent scores trending up
- stable: no significant change
- declining: recent scores trending down

## Seasonality

### Purpose

Many Xenopus labs observe seasonal variation in:
- Oocyte quality
- Fertilization success
- Embryo survival
- Overall performance
- Recovery time

XenoTrack should help labs explore these patterns visually and analytically.

### Seasonal Analytics

- Oocyte quality by month / season
- Extract performance by month / season
- Fertilization success by season
- Recovery / performance by rest duration across seasons
- Performance by bin density across seasons
- Mortality / retirement by month / season
- Arrivals by month / season

### Seasonality Dashboard

Shows:
- Monthly performance averages (current year vs previous)
- Seasonal comparison cards
- Best/worst performing months
- Correlation with environmental observations
- Pattern detection (if enough data)

### Data Requirements

Seasonality analytics require:
- Dated events with performance scores
- At least 6–12 months of data for meaningful patterns
- Environmental observations for correlation
- Protocol tracking for controlling variables

## Research Value

Labs should be able to explore performance and seasonality data:
- "For fun" / curiosity
- For operational optimization
- For research insight
- For protocol refinement
- For source/supplier evaluation

The system should make it easy to ask questions like:
- "Do my frogs perform better in winter?"
- "Does rest duration affect oocyte quality?"
- "Are frogs from Supplier A better than Supplier B?"
- "Has performance changed since we switched protocols?"
- "Did the water temperature spike affect extraction results?"
