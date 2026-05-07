export default function AnalyticsPage() {
  // TODO: AnalyticsDashboard component with key charts
  // TODO: Summary metrics (colony size, rotation state, performance avg)
  // TODO: Chart sections: time/seasonality, rotation/forecasting, performance, environmental
  // TODO: Drill-down links to specific analytics pages
  // TODO: Chart library integration (Recharts/Chart.js/Nivo)
  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
      <p className="mt-2 text-gray-600">
        Visual exploration of colony data. Charts, graphs, and dashboard views
        for rotation, performance, seasonality, and environment.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Colony Overview
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <SummaryMetric label="Total Active Frogs" value="—" />
          <SummaryMetric label="Total Active Bins" value="—" />
          <SummaryMetric label="Avg Performance" value="—" />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Rotation &amp; Forecasting
        </h2>
        {/* TODO: StackedBarChartCard — bins by cycle state */}
        {/* TODO: LineChartCard — availability forecast over time */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <ChartPlaceholder title="Bins by Cycle State" type="Stacked Bar" />
          <ChartPlaceholder title="Availability Forecast" type="Line" />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">Performance</h2>
        {/* TODO: LineChartCard — avg performance over time */}
        {/* TODO: BarChartCard — performance by source/cohort */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <ChartPlaceholder title="Performance Over Time" type="Line" />
          <ChartPlaceholder title="Performance by Source" type="Bar" />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">Seasonality</h2>
        {/* TODO: HeatmapPlaceholder — performance by month */}
        {/* TODO: BarChartCard — quality by season */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <ChartPlaceholder title="Performance by Month" type="Heatmap" />
          <ChartPlaceholder title="Quality by Season" type="Bar" />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">Environment</h2>
        {/* TODO: ScatterPlotPlaceholder — performance vs temperature */}
        {/* TODO: LineChartCard — environmental trends */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <ChartPlaceholder title="Performance vs Temperature" type="Scatter" />
          <ChartPlaceholder title="Environmental Trends" type="Line" />
        </div>
      </section>
    </div>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function ChartPlaceholder({ title, type }: { title: string; type: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6">
      <p className="text-sm font-medium text-gray-700">{title}</p>
      <div className="mt-4 flex h-32 items-center justify-center rounded-lg bg-gray-50">
        <p className="text-xs text-gray-400">{type} chart placeholder</p>
      </div>
    </div>
  );
}
