import NoticeStatusBadge from "@/components/NoticeStatusBadge";

// TODO: Fetch from forecast_settings + forecast_snapshots + bottlenecks
// TODO: Calculate run-out from current state + use rate + rest pipeline
// TODO: Auto-generate snapshot on page load or via cron

const MOCK_ASSUMPTIONS = {
  avgFrogsPerWeek: 16,
  avgBinsPerWeek: 2,
  minRestDays: 90,
  targetRestDays: 120,
  overdueAfterDays: 135,
  readyFrogThreshold: 32,
  readyBinThreshold: 4,
  expectedRetirementRate: 2,
  expectedRepopulationRate: 8,
};

const MOCK_SUPPLY = {
  readyFrogsNow: 31,
  readyBinsNow: 4,
  restingFrogs: 128,
  restingBins: 14,
  gpFrogs: 83,
  becomingReady7d: 15,
  becomingReady30d: 48,
  becomingReady60d: 72,
  becomingReady90d: 96,
};

const MOCK_RUNOUT = {
  daysUntilShortage: 23,
  runoutDate: "May 30, 2026",
  belowFrogThresholdDate: "May 14, 2026",
  belowBinThresholdDate: "May 21, 2026",
  useRateExceedsRecovery: true,
  projectedShortfall60d: 24,
  recommendedAction:
    "Repopulate 3 bins with 8 frogs each or reduce use rate by 6 frogs/week.",
};

const MOCK_PERIODS = [
  { period: "Today", readyFrogs: 31, readyBins: 4, becoming: 0, demand: 2, surplus: 29 },
  { period: "This Week", readyFrogs: 31, readyBins: 4, becoming: 8, demand: 16, surplus: 23 },
  { period: "30 Days", readyFrogs: 48, readyBins: 6, becoming: 48, demand: 64, surplus: -16 },
  { period: "60 Days", readyFrogs: 72, readyBins: 9, becoming: 72, demand: 128, surplus: -24 },
  { period: "90 Days", readyFrogs: 96, readyBins: 12, becoming: 96, demand: 192, surplus: -32 },
  { period: "120 Days", readyFrogs: 112, readyBins: 14, becoming: 112, demand: 256, surplus: -48 },
];

export default function CapacityPage() {
  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Capacity &amp; Run-Out Forecast
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Is your colony rotation sustainable? When will you run out of ready
            frogs?
          </p>
        </div>
        <a
          href="/bottlenecks"
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
        >
          View Bottlenecks
        </a>
      </div>

      {/* Run-Out Warning */}
      {MOCK_RUNOUT.useRateExceedsRecovery && (
        <div className="mt-6 rounded-xl border-2 border-red-300 bg-red-50 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-red-600">
                Run-Out Warning
              </p>
              <h2 className="mt-1 text-lg font-bold text-gray-900">
                Ready frogs projected to fall below threshold in{" "}
                {MOCK_RUNOUT.daysUntilShortage} days
              </h2>
            </div>
            <NoticeStatusBadge status="sent" sentAt="Today, 8:00 AM" channel="email" />
          </div>
          <p className="mt-3 text-sm text-gray-700">
            At the current use rate of {MOCK_ASSUMPTIONS.avgFrogsPerWeek}{" "}
            frogs/week and a {MOCK_ASSUMPTIONS.targetRestDays}-day rest period,
            this lab is projected to fall below its ready-frog threshold on{" "}
            <strong>{MOCK_RUNOUT.runoutDate}</strong>.
          </p>
          <p className="mt-2 text-sm text-gray-700">
            Projected shortage: <strong>{MOCK_RUNOUT.projectedShortfall60d} frogs</strong>{" "}
            over the next 60 days.
          </p>
          <p className="mt-2 text-sm font-medium text-gray-800">
            Recommended: {MOCK_RUNOUT.recommendedAction}
          </p>
          <div className="mt-4 flex gap-2">
            <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
              Plan Repopulation
            </button>
            <button className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100">
              Adjust Use Rate
            </button>
            <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {/* Current Supply */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Current Colony Supply
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <SupplyCard label="Ready Frogs" value={MOCK_SUPPLY.readyFrogsNow} threshold={MOCK_ASSUMPTIONS.readyFrogThreshold} />
          <SupplyCard label="Ready Bins" value={MOCK_SUPPLY.readyBinsNow} threshold={MOCK_ASSUMPTIONS.readyBinThreshold} />
          <SupplyCard label="Resting Frogs" value={MOCK_SUPPLY.restingFrogs} />
          <SupplyCard label="Resting Bins" value={MOCK_SUPPLY.restingBins} />
          <SupplyCard label="GP Available" value={MOCK_SUPPLY.gpFrogs} />
        </div>
      </section>

      {/* Resting Pipeline */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Resting Pipeline — Frogs Becoming Ready
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-4">
          <PipelineCard period="7 days" count={MOCK_SUPPLY.becomingReady7d} />
          <PipelineCard period="30 days" count={MOCK_SUPPLY.becomingReady30d} />
          <PipelineCard period="60 days" count={MOCK_SUPPLY.becomingReady60d} />
          <PipelineCard period="90 days" count={MOCK_SUPPLY.becomingReady90d} />
        </div>
      </section>

      {/* Forecast Table */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Supply vs. Demand Forecast
        </h2>
        <p className="mt-1 text-xs text-gray-400">
          Based on {MOCK_ASSUMPTIONS.avgFrogsPerWeek} frogs/week use rate and{" "}
          {MOCK_ASSUMPTIONS.targetRestDays}-day rest cycle
        </p>
        <div className="mt-3 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Period</th>
                <th className="px-4 py-3">Ready Frogs</th>
                <th className="px-4 py-3">Ready Bins</th>
                <th className="px-4 py-3">Becoming Ready</th>
                <th className="px-4 py-3">Expected Demand</th>
                <th className="px-4 py-3">Surplus / Shortfall</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_PERIODS.map((row) => (
                <tr key={row.period} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{row.period}</td>
                  <td className="px-4 py-3">{row.readyFrogs}</td>
                  <td className="px-4 py-3">{row.readyBins}</td>
                  <td className="px-4 py-3 text-green-600">+{row.becoming}</td>
                  <td className="px-4 py-3 text-gray-600">{row.demand}</td>
                  <td className={`px-4 py-3 font-semibold ${row.surplus >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {row.surplus >= 0 ? `+${row.surplus}` : row.surplus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Chart Placeholders */}
      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <ChartPlaceholder title="Ready Frogs Over Time" description="Line chart showing projected ready frog count vs. threshold line over 120 days" />
        <ChartPlaceholder title="Supply vs. Demand" description="Stacked area chart of cumulative availability vs. cumulative demand with run-out intersection" />
        <ChartPlaceholder title="Resting Pipeline" description="Bar chart of frogs completing rest by week for the next 16 weeks" />
        <ChartPlaceholder title="Repopulation Demand" description="Bar chart showing required repopulation frogs per month to maintain sustainability" />
      </section>

      {/* Assumptions Panel */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Forecasting Assumptions
        </h2>
        <p className="mt-1 text-xs text-gray-400">
          These values drive the forecast. Edit in Workspace Settings.
          TODO: auto-calculate from historical use data.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <AssumptionCard label="Avg frogs used/week" value={String(MOCK_ASSUMPTIONS.avgFrogsPerWeek)} />
          <AssumptionCard label="Avg bins used/week" value={String(MOCK_ASSUMPTIONS.avgBinsPerWeek)} />
          <AssumptionCard label="Min rest days" value={`${MOCK_ASSUMPTIONS.minRestDays}d`} />
          <AssumptionCard label="Target rest days" value={`${MOCK_ASSUMPTIONS.targetRestDays}d`} />
          <AssumptionCard label="Overdue after" value={`${MOCK_ASSUMPTIONS.overdueAfterDays}d`} />
          <AssumptionCard label="Ready frog threshold" value={String(MOCK_ASSUMPTIONS.readyFrogThreshold)} />
          <AssumptionCard label="Ready bin threshold" value={String(MOCK_ASSUMPTIONS.readyBinThreshold)} />
          <AssumptionCard label="Retirement rate/mo" value={String(MOCK_ASSUMPTIONS.expectedRetirementRate)} />
        </div>
        <a href="/workspace-profile" className="mt-3 inline-block text-sm font-medium text-brand-600 hover:underline">
          Edit assumptions →
        </a>
      </section>

      {/* Key Dates */}
      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-gray-700">Critical Dates</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3 text-sm">
          <div>
            <p className="text-xs text-gray-500">Below frog threshold</p>
            <p className="font-semibold text-red-600">{MOCK_RUNOUT.belowFrogThresholdDate}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Below bin threshold</p>
            <p className="font-semibold text-red-600">{MOCK_RUNOUT.belowBinThresholdDate}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Projected run-out</p>
            <p className="font-semibold text-red-600">{MOCK_RUNOUT.runoutDate}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SupplyCard({
  label,
  value,
  threshold,
}: {
  label: string;
  value: number;
  threshold?: number;
}) {
  const belowThreshold = threshold != null && value < threshold;
  return (
    <div className={`rounded-xl border p-4 ${belowThreshold ? "border-red-200 bg-red-50" : "border-gray-200 bg-white"}`}>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${belowThreshold ? "text-red-700" : "text-gray-900"}`}>
        {value}
      </p>
      {threshold != null && (
        <p className="mt-0.5 text-xs text-gray-400">threshold: {threshold}</p>
      )}
    </div>
  );
}

function PipelineCard({ period, count }: { period: string; count: number }) {
  return (
    <div className="rounded-xl border border-green-200 bg-green-50 p-4">
      <p className="text-xs font-medium text-green-600">Next {period}</p>
      <p className="mt-1 text-2xl font-bold text-green-800">+{count}</p>
      <p className="text-xs text-green-600">frogs becoming ready</p>
    </div>
  );
}

function ChartPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6">
      <p className="text-sm font-semibold text-gray-700">{title}</p>
      <p className="mt-2 text-xs text-gray-400">{description}</p>
      <p className="mt-4 text-xs text-gray-300">TODO: Integrate charting library</p>
    </div>
  );
}

function AssumptionCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}
