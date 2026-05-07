export default function ForecastPage() {
  // TODO: Calculate forecast based on rotation_settings and bin_cycle_status
  // TODO: Show 30/60/90/120-day availability forecast
  // TODO: Show bins becoming available by date
  // TODO: Show bins overdue for reuse
  // TODO: Show repopulation demand forecast
  // TODO: Show scheduled notifications/reminders
  // TODO: FutureForecast and RotationCalendar components
  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold text-gray-900">Future View</h1>
      <p className="mt-2 text-gray-600">
        Forecast frog and bin availability. See what becomes ready in
        30/60/90/120 days.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <ForecastCard period="30 Days" bins="—" frogs="—" />
        <ForecastCard period="60 Days" bins="—" frogs="—" />
        <ForecastCard period="90 Days" bins="—" frogs="—" />
        <ForecastCard period="120 Days" bins="—" frogs="—" />
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Upcoming Availability
        </h2>
        {/* TODO: FutureForecast component — timeline of bins completing rest */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            Bins and frogs becoming available will appear here sorted by date.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Rotation Calendar
        </h2>
        {/* TODO: Calendar view showing rest completions by week/month */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            Calendar view of rest completions and availability windows will
            appear here.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Overdue &amp; Needs Attention
        </h2>
        {/* TODO: Bins/frogs past overdue_at still not used */}
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm text-red-700">
            No overdue bins or frogs at this time.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Forecast Charts
        </h2>
        {/* TODO: LineChartCard showing bins by state over time */}
        {/* TODO: StackedBarChartCard showing availability by month */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            Forecast visualizations will appear here when charting is
            integrated.
          </p>
        </div>
      </section>
    </div>
  );
}

function ForecastCard({
  period,
  bins,
  frogs,
}: {
  period: string;
  bins: string;
  frogs: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{period}</p>
      <div className="mt-3 space-y-1">
        <p className="text-lg font-bold text-gray-900">{bins} bins</p>
        <p className="text-sm text-gray-600">{frogs} frogs available</p>
      </div>
    </div>
  );
}
