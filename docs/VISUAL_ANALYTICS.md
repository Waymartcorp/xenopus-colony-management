# Visual Analytics

## Purpose

XenoTrack must not only store dated colony, rotation, performance, protocol, result, and environmental data — it must also support visual exploration of that data through charts, graphs, and dashboard views.

## View Modes

Users should be able to view data as:

- Table / list view
- Timeline view
- Graphical / chart view
- Export / report view

## Access Points

Visual analytics should be accessible from:

- Dashboard (summary metrics and mini-charts)
- Performance page (performance-specific charts)
- Past view (historical trends)
- Future view (forecast charts)
- Seasonality page (seasonal patterns)
- Environment page (environmental correlations)
- Reports page (exportable visualizations)

## Chart Categories

### A. Time / Seasonality Charts

- Oocyte quality by month / season
- Extract performance by month / season
- Fertilization success over time
- Frog use count over time
- Bin use count over time
- Arrivals over time
- Mortality / retirement over time
- Protocol results over time

### B. Rotation / Forecasting Charts

- Frogs by cycle state: ready, resting, overdue, hold, retired
- Bins by cycle state: ready, resting, repopulate, overdue
- 30/60/90/120-day availability forecast
- Rest completions over time
- Repopulation demand over time
- Next-use forecast by week / month

### C. Performance Charts

- Average performance by frog
- Average performance by bin
- Use count vs performance
- Rest duration vs performance
- Performance by source / cohort / shipment
- Performance trend over time
- Performance by lab mode / use type
- Top-performing frogs
- Declining frogs

### D. Environmental / Husbandry Charts

- Performance vs temperature
- Performance vs pH
- Performance vs conductivity
- Performance vs density
- Performance before / after feeding changes
- Performance before / after husbandry interventions
- Performance by environmental note / date range

## UI Components

### Chart Wrapper Components

Reusable chart placeholders / wrappers:

- **LineChartCard** — time series, trends
- **BarChartCard** — comparisons, counts
- **StackedBarChartCard** — composition breakdowns
- **HistogramCard** — distribution views
- **HeatmapPlaceholder** — seasonal/monthly patterns
- **ScatterPlotPlaceholder** — correlation exploration
- **SummaryMetricCard** — single KPI with trend indicator

### Page Components

- **AnalyticsDashboard** — overview with key charts
- **PerformanceDashboard** — performance-specific views
- **SeasonalityDashboard** — monthly/seasonal patterns
- **VisualReports** — exportable chart collections
- **EnvironmentalTrends** — environment correlation views

## Charting Library

Recommended: Recharts, Chart.js, or Nivo

Selection criteria:
- React-native integration
- Responsive/mobile support
- Accessibility
- Export capability
- Customizable styling with Tailwind

## Exports

Future-ready placeholders for:

- Export charts to PDF / report
- CSV export for underlying chart data
- Printable summary reports
- Seasonal report export
- Performance report export
- Rotation forecast export

## Implementation Notes

- Chart components are scaffolded with TODO comments
- Mock/sample data shapes defined in components
- Real data integration happens when APIs are connected
- Charts should respond to lab-mode context (show relevant metrics)
- Dashboard mini-charts vs full-page detailed charts
- Mobile-responsive chart containers
