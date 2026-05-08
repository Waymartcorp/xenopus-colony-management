// TODO: Fetch real data from Supabase (bin_cycle_status, frog_cycle_status, recommendations)
// TODO: Connect action buttons to real mutation endpoints

const MOCK_STATS = {
  totalBins: 24,
  totalFrogs: 187,
  readyBins: 4,
  restingBins: 14,
  restCompleteBins: 3,
  overdueBins: 1,
  needsRepopulation: 2,
};

const MOCK_NEXT_ACTION = {
  binLabel: "Bin 6",
  reason: [
    "Rest complete — 112 days since last use",
    "8 frogs available (target: 8)",
    "Average performance 4.2/5",
  ],
};

const MOCK_ACTION_BINS = [
  { label: "Bin 3", status: "Needs repopulation", count: "3/8", urgency: "warning" as const },
  { label: "Bin 1", status: "Overdue — 142 days resting", count: "8/8", urgency: "danger" as const },
  { label: "Bin 8", status: "Rest complete", count: "7/8", urgency: "ready" as const },
  { label: "Bin 2", status: "Rest complete", count: "8/8", urgency: "ready" as const },
  { label: "Bin 7", status: "Resting — 37 days left", count: "8/8", urgency: "resting" as const },
];

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-header">Colony Dashboard</h1>
          <p className="page-subtitle">What needs attention today</p>
        </div>
        <a href="/use" className="btn-primary">
          Log Use &amp; Rest
        </a>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Ready" value={MOCK_STATS.readyBins} variant="ready" />
        <StatCard label="Rest Complete" value={MOCK_STATS.restCompleteBins} variant="ready" />
        <StatCard label="Resting" value={MOCK_STATS.restingBins} variant="resting" />
        <StatCard label="Overdue" value={MOCK_STATS.overdueBins} variant="danger" />
        <StatCard label="Need Repop" value={MOCK_STATS.needsRepopulation} variant="warning" />
      </div>

      {/* Next action */}
      <section className="mt-8">
        <div className="card overflow-hidden">
          <div className="border-l-4 border-brand-500 p-6">
            <p className="section-title text-brand-600">Next Recommended Bin</p>
            <h2 className="mt-2 text-xl font-bold text-gray-900">
              {MOCK_NEXT_ACTION.binLabel}
            </h2>
            <ul className="mt-3 space-y-1">
              {MOCK_NEXT_ACTION.reason.map((r) => (
                <li key={r} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="h-1 w-1 rounded-full bg-brand-400" />
                  {r}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex gap-3">
              <a href="/use" className="btn-primary">Log Use from This Bin</a>
              <a href="/bins/1" className="btn-secondary">View Details</a>
            </div>
          </div>
        </div>
      </section>

      {/* Bins needing action */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Bins Needing Action</h2>
          <a href="/bins" className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-800">
            View all →
          </a>
        </div>
        <div className="mt-4 space-y-2">
          {MOCK_ACTION_BINS.map((bin) => (
            <a
              key={bin.label}
              href="/bins"
              className="card-flat flex items-center justify-between px-5 py-3.5 transition-all hover:shadow-card-hover hover:border-gray-300"
            >
              <div className="flex items-center gap-4">
                <StatusDot urgency={bin.urgency} />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{bin.label}</p>
                  <p className="text-xs text-gray-500">{bin.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-gray-500">{bin.count} frogs</span>
                <span className="text-gray-300">→</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Colony summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="card-flat p-5">
          <p className="section-title">Total Bins</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{MOCK_STATS.totalBins}</p>
        </div>
        <div className="card-flat p-5">
          <p className="section-title">Total Frogs</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{MOCK_STATS.totalFrogs}</p>
        </div>
        <div className="card-flat p-5">
          <p className="section-title">Cycling</p>
          <p className="mt-1 text-sm text-gray-600">
            {MOCK_STATS.restingBins} resting · {MOCK_STATS.restCompleteBins + MOCK_STATS.readyBins} ready · {MOCK_STATS.overdueBins} overdue
          </p>
        </div>
      </section>

      {/* Footer note */}
      <div className="mt-10 rounded-xl bg-gray-50 border border-gray-100 p-4 text-center text-sm text-gray-500">
        Keep every bin and frog record in one place. Track performance over time.
        Preserve knowledge across technicians and projects.
      </div>
    </div>
  );
}

function StatCard({ label, value, variant }: { label: string; value: number; variant: "ready" | "resting" | "danger" | "warning" }) {
  const styles = {
    ready: "border-green-200 bg-green-50/60",
    resting: "border-blue-200 bg-blue-50/60",
    danger: "border-red-200 bg-red-50/60",
    warning: "border-yellow-200 bg-yellow-50/60",
  };
  const textColors = {
    ready: "text-green-700",
    resting: "text-blue-700",
    danger: "text-red-700",
    warning: "text-yellow-700",
  };
  return (
    <div className={`rounded-xl border p-4 ${styles[variant]}`}>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${textColors[variant]}`}>{value}</p>
    </div>
  );
}

function StatusDot({ urgency }: { urgency: "ready" | "resting" | "danger" | "warning" }) {
  const colors = {
    ready: "bg-green-500",
    resting: "bg-blue-400",
    danger: "bg-red-500",
    warning: "bg-yellow-500",
  };
  return (
    <span className={`flex h-2.5 w-2.5 rounded-full ${colors[urgency]}`}>
      {urgency === "danger" && <span className="animate-pulse-soft absolute h-2.5 w-2.5 rounded-full bg-red-400" />}
    </span>
  );
}
