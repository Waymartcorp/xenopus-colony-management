import NoticeStatusBadge from "@/components/NoticeStatusBadge";

// TODO: Fetch real data from Supabase (bin_cycle_status, frog_cycle_status, recommendations)
// TODO: Adapt content based on primary_lab_mode
// TODO: Connect action buttons to real mutation endpoints

const MOCK_SNAPSHOT_TIME = "Wednesday, May 7, 2026, 8:44 AM";

const MOCK_STATS = {
  totalBins: 24,
  totalFrogs: 187,
  readyBins: 4,
  restingBins: 14,
  restCompleteBins: 3,
  overdueBins: 1,
  needsRepopulation: 2,
  missingPerformance: 5,
  noticesSent: 3,
  noticesPending: 1,
};

const MOCK_NEXT_ACTION = {
  binLabel: "Rack 1 / Bin 6",
  reason: [
    "Rest complete — 112 days since last use",
    "8 frogs available (target: 8)",
    "Average performance 4.2/5",
    "No active warnings",
  ],
  noticeStatus: "sent" as const,
  noticeSentAt: "May 6, 8:15 AM",
};

const MOCK_ACTION_BINS = [
  { label: "Rack 2 / Bin 3", status: "Needs repopulation", count: "3/8 frogs", urgency: "warning" },
  { label: "Rack 3 / Bin 1", status: "Overdue — 142 days", count: "8/8 frogs", urgency: "danger" },
  { label: "Rack 1 / Bin 8", status: "Rest complete — ready", count: "7/8 frogs", urgency: "success" },
  { label: "Rack 4 / Bin 2", status: "Rest complete — ready", count: "8/8 frogs", urgency: "success" },
  { label: "Rack 2 / Bin 7", status: "Missing performance notes", count: "8/8 frogs", urgency: "info" },
];

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Today&apos;s Colony Status
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Snapshot: {MOCK_SNAPSHOT_TIME}
          </p>
        </div>
        <a
          href="/bins"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          View All Bins
        </a>
      </div>

      {/* Stats row */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total Bins" value={MOCK_STATS.totalBins} />
        <StatCard label="Ready for Use" value={MOCK_STATS.readyBins} variant="success" />
        <StatCard label="Rest Complete" value={MOCK_STATS.restCompleteBins} variant="success" />
        <StatCard label="Resting" value={MOCK_STATS.restingBins} variant="info" />
        <StatCard label="Overdue" value={MOCK_STATS.overdueBins} variant="danger" />
        <StatCard label="Need Repop" value={MOCK_STATS.needsRepopulation} variant="warning" />
      </div>

      {/* Next Recommended Action */}
      <section className="mt-8">
        <div className="rounded-xl border-2 border-brand-300 bg-brand-50 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                Next Recommended Action
              </p>
              <h2 className="mt-1 text-xl font-bold text-gray-900">
                Use next: {MOCK_NEXT_ACTION.binLabel}
              </h2>
            </div>
            <NoticeStatusBadge
              status={MOCK_NEXT_ACTION.noticeStatus}
              sentAt={MOCK_NEXT_ACTION.noticeSentAt}
              channel="email"
            />
          </div>
          <ul className="mt-3 space-y-1">
            {MOCK_NEXT_ACTION.reason.map((r) => (
              <li key={r} className="text-sm text-gray-700">• {r}</li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href="/use" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
              Log Use & Move to Rest
            </a>
            <a
              href="/bins/1"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              View Bin Details
            </a>
          </div>
        </div>
      </section>

      {/* Bins Needing Action */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Bins Needing Action
          </h2>
          <span className="text-sm text-gray-400">
            {MOCK_ACTION_BINS.length} bins
          </span>
        </div>
        <div className="mt-3 space-y-2">
          {MOCK_ACTION_BINS.map((bin) => (
            <div
              key={bin.label}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <UrgencyDot urgency={bin.urgency} />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {bin.label}
                  </p>
                  <p className="text-xs text-gray-500">{bin.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500">{bin.count}</span>
                <a
                  href="/bins"
                  className="text-xs font-medium text-brand-600 hover:underline"
                >
                  View
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Summary row */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-gray-700">
            Notices &amp; Alerts
          </h3>
          <div className="mt-3 space-y-2 text-sm text-gray-600">
            <p>Sent: {MOCK_STATS.noticesSent}</p>
            <p>Pending acknowledgement: {MOCK_STATS.noticesPending}</p>
            <a href="/notifications" className="text-xs text-brand-600 hover:underline">
              View all notices →
            </a>
          </div>
        </section>
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-gray-700">
            Missing Data
          </h3>
          <div className="mt-3 text-sm text-gray-600">
            <p>{MOCK_STATS.missingPerformance} events missing performance notes</p>
            <a href="/performance" className="text-xs text-brand-600 hover:underline">
              Log performance →
            </a>
          </div>
        </section>
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-gray-700">
            Colony Summary
          </h3>
          <div className="mt-3 space-y-1 text-sm text-gray-600">
            <p>{MOCK_STATS.totalFrogs} total frogs</p>
            <p>{MOCK_STATS.totalBins} bins across racks</p>
            <a href="/colony" className="text-xs text-brand-600 hover:underline">
              Full colony view →
            </a>
          </div>
        </section>
      </div>

      {/* Colony history note */}
      <div className="mt-8 rounded-lg border border-gray-100 bg-gray-50 p-4 text-center text-sm text-gray-500">
        Keep every bin and frog record in one place. See what happened, what is
        ready, and what is coming next. Preserve knowledge across technicians,
        lab managers, and projects.
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
  value: number;
  variant?: "default" | "success" | "info" | "danger" | "warning";
}) {
  const variants: Record<string, string> = {
    default: "border-gray-200 bg-white",
    success: "border-green-200 bg-green-50",
    info: "border-blue-200 bg-blue-50",
    danger: "border-red-200 bg-red-50",
    warning: "border-yellow-200 bg-yellow-50",
  };
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${variants[variant]}`}>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function UrgencyDot({ urgency }: { urgency: string }) {
  const colors: Record<string, string> = {
    danger: "bg-red-500",
    warning: "bg-yellow-500",
    success: "bg-green-500",
    info: "bg-blue-500",
  };
  return (
    <span className={`inline-block h-2.5 w-2.5 rounded-full ${colors[urgency] ?? "bg-gray-400"}`} />
  );
}
