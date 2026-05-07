export default function DashboardPage() {
  // TODO: Fetch colony summary from Supabase (counts by cycle state)
  // TODO: Adapt dashboard cards based on primary_lab_mode
  // TODO: Show TodayColonyActions component
  // TODO: Show rotation summary (ready, resting, overdue counts)
  // TODO: Show recent activity feed
  // TODO: Show next-use recommendations
  // TODO: Show mini forecast (30-day preview)
  // TODO: Show performance summary metric
  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">
            Colony overview and today&apos;s actions.
          </p>
        </div>
        {/* TODO: InstitutionSwitcher in header */}
      </div>

      <section className="mt-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Today&apos;s Colony Actions
        </h2>
        {/* TODO: TodayColonyActions component */}
        <div className="mt-3 rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-800">
            No urgent actions today. All bins are within normal rotation
            parameters.
          </p>
        </div>
      </section>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Active Frogs" value="—" />
        <StatCard label="Ready Bins" value="—" variant="success" />
        <StatCard label="Resting Bins" value="—" variant="info" />
        <StatCard label="Overdue" value="—" variant="danger" />
        <StatCard label="Avg Performance" value="—" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="text-lg font-semibold text-gray-800">
            Rotation Summary
          </h2>
          {/* TODO: Mini StackedBarChartCard showing bins by state */}
          <div className="mt-3 rounded-xl border border-gray-200 bg-white p-6">
            <div className="grid grid-cols-4 gap-4 text-center">
              <MiniStat label="Ready" value="—" color="green" />
              <MiniStat label="Resting" value="—" color="blue" />
              <MiniStat label="Repopulate" value="—" color="yellow" />
              <MiniStat label="Overdue" value="—" color="red" />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800">
            30-Day Forecast
          </h2>
          {/* TODO: FutureForecast mini-view */}
          <div className="mt-3 rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Bins becoming available in the next 30 days will appear here.
            </p>
          </div>
        </section>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Activity
          </h2>
          {/* TODO: Last 10 events from frog_events */}
          <div className="mt-3 rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              No recent activity to display.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800">
            Next Use Recommendations
          </h2>
          {/* TODO: Top 3 RecommendationCards */}
          <div className="mt-3 rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Recommendations will appear when rotation data is available.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: string;
  variant?: "default" | "success" | "info" | "danger";
}) {
  const variants: Record<string, string> = {
    default: "border-gray-200 bg-white",
    success: "border-green-200 bg-green-50",
    info: "border-blue-200 bg-blue-50",
    danger: "border-red-200 bg-red-50",
  };
  return (
    <div className={`rounded-xl border p-5 shadow-sm ${variants[variant]}`}>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function MiniStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  const colors: Record<string, string> = {
    green: "text-green-700",
    blue: "text-blue-700",
    yellow: "text-yellow-700",
    red: "text-red-700",
  };
  return (
    <div>
      <p className={`text-2xl font-bold ${colors[color]}`}>{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
