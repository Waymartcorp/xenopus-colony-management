export default function PerformancePage() {
  // TODO: Fetch performance_ratings aggregated per frog and per bin
  // TODO: Show top performers, declining performers, retirement candidates
  // TODO: Show performance trend charts (LineChartCard)
  // TODO: Show use count vs performance (ScatterPlotPlaceholder)
  // TODO: Show rest duration vs performance correlation
  // TODO: Filter by source/cohort/shipment, protocol, season
  // TODO: PerformanceDashboard component
  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold text-gray-900">Performance</h1>
      <p className="mt-2 text-gray-600">
        Track individual frog and bin performance. Identify trends, top
        performers, and declining animals.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Average Score" value="—" subtitle="all frogs" />
        <MetricCard label="Top Performers" value="—" subtitle="score ≥ 4.0" />
        <MetricCard label="Declining" value="—" subtitle="trend down" />
        <MetricCard
          label="Retirement Candidates"
          value="—"
          subtitle="flagged"
        />
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Performance by Frog
        </h2>
        {/* TODO: Sortable table of frogs with avg score, use count, trend */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            Per-frog performance data will appear here when ratings are logged.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Performance by Bin
        </h2>
        {/* TODO: Sortable table of bins with avg score, use count, trend */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            Per-bin performance data will appear here when ratings are logged.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">Trends</h2>
        {/* TODO: LineChartCard for performance over time */}
        {/* TODO: ScatterPlotPlaceholder for use count vs performance */}
        {/* TODO: BarChartCard for performance by source/cohort */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm font-medium text-gray-700">
              Performance Over Time
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Line chart will appear here.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm font-medium text-gray-700">
              Rest Duration vs Performance
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Scatter plot will appear here.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm font-medium text-gray-700">
              Performance by Source
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Bar chart will appear here.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm font-medium text-gray-700">
              Use Count vs Performance
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Scatter plot will appear here.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
    </div>
  );
}
