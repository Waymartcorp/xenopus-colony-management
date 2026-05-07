export default function SeasonalityPage() {
  // TODO: SeasonalityDashboard component
  // TODO: Show monthly performance averages (current year vs previous)
  // TODO: Show seasonal comparison cards
  // TODO: Best/worst performing months
  // TODO: Correlation with environmental observations
  // TODO: HeatmapPlaceholder for monthly patterns
  // TODO: LineChartCard for year-over-year comparison
  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold text-gray-900">Seasonality</h1>
      <p className="mt-2 text-gray-600">
        Explore seasonal patterns in performance, use, and colony health.
        Requires 6–12 months of data for meaningful patterns.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Monthly Performance
        </h2>
        {/* TODO: HeatmapPlaceholder or BarChartCard showing avg score by month */}
        <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-white p-6">
          <div className="grid grid-cols-12 gap-1">
            {[
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ].map((month) => (
              <div
                key={month}
                className="flex flex-col items-center rounded bg-gray-100 p-2"
              >
                <span className="text-xs text-gray-500">{month}</span>
                <span className="mt-1 text-xs font-medium text-gray-400">
                  —
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-gray-400">
            Monthly heatmap placeholder — data will populate with use.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Seasonal Comparisons
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SeasonCard season="Winter" months="Dec–Feb" score="—" />
          <SeasonCard season="Spring" months="Mar–May" score="—" />
          <SeasonCard season="Summer" months="Jun–Aug" score="—" />
          <SeasonCard season="Fall" months="Sep–Nov" score="—" />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Year-over-Year
        </h2>
        {/* TODO: LineChartCard comparing current year vs previous */}
        <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-white p-6">
          <p className="text-center text-sm text-gray-500">
            Year-over-year comparison chart will appear here when sufficient
            data is available.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Seasonal Metrics
        </h2>
        {/* TODO: Tables showing oocyte quality, fertilization, extract performance by season */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm font-medium text-gray-700">
              Oocyte Quality by Season
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Data will appear with logged performance ratings.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm font-medium text-gray-700">
              Mortality by Month
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Data will appear with logged events.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SeasonCard({
  season,
  months,
  score,
}: {
  season: string;
  months: string;
  score: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-gray-800">{season}</p>
      <p className="text-xs text-gray-400">{months}</p>
      <p className="mt-3 text-2xl font-bold text-gray-900">{score}</p>
      <p className="text-xs text-gray-500">avg performance</p>
    </div>
  );
}
