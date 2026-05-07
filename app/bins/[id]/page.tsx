import NoticeStatusBadge from "@/components/NoticeStatusBadge";

// TODO: Fetch bin details from locations + bin_cycle_status + frogs + frog_events
// TODO: Fetch performance_ratings for this bin
// TODO: Fetch recommendations for this bin
// TODO: Connect actions to real API endpoints

const MOCK_BIN = {
  id: "1",
  label: "Rack 1 / Bin 6",
  room: "Room A",
  status: "rest_complete" as const,
  frogCount: 8,
  targetCount: 8,
  lastUsedDate: "January 15, 2026",
  availableDate: "May 5, 2026",
  restWindow: "90–120 days",
  daysResting: 112,
  daysReady: 2,
  avgPerformance: 4.2,
  totalUses: 12,
  noticeStatus: "sent" as const,
  noticeSentAt: "May 6, 8:15 AM",
  noticeChannel: "email" as const,
  noticeRecipient: "Jane Smith",
};

const MOCK_FROGS = [
  { id: "f1", code: "XL-2024-0042", sex: "Female", sizeClass: "Large", lastPerformance: 4.5, cycleState: "rest_complete" },
  { id: "f2", code: "XL-2024-0043", sex: "Female", sizeClass: "Large", lastPerformance: 4.0, cycleState: "rest_complete" },
  { id: "f3", code: "XL-2024-0044", sex: "Female", sizeClass: "Large", lastPerformance: 4.5, cycleState: "rest_complete" },
  { id: "f4", code: "XL-2024-0045", sex: "Female", sizeClass: "Medium", lastPerformance: 3.5, cycleState: "rest_complete" },
  { id: "f5", code: "XL-2024-0046", sex: "Female", sizeClass: "Large", lastPerformance: 4.0, cycleState: "rest_complete" },
  { id: "f6", code: "XL-2024-0047", sex: "Female", sizeClass: "Large", lastPerformance: 4.5, cycleState: "rest_complete" },
  { id: "f7", code: "XL-2024-0048", sex: "Female", sizeClass: "Medium", lastPerformance: 4.0, cycleState: "rest_complete" },
  { id: "f8", code: "XL-2024-0049", sex: "Female", sizeClass: "Large", lastPerformance: 4.5, cycleState: "rest_complete" },
];

const MOCK_HISTORY = [
  { date: "May 6, 2026", event: "Notice sent: ready for use", by: "System" },
  { date: "Jan 15, 2026", event: "Used for extraction (batch #34)", by: "Jane Smith" },
  { date: "Jan 15, 2026", event: "Performance logged: avg 4.2/5", by: "Jane Smith" },
  { date: "Sep 28, 2025", event: "Used for extraction (batch #27)", by: "Tom Chen" },
  { date: "Sep 28, 2025", event: "Performance logged: avg 4.0/5", by: "Tom Chen" },
  { date: "May 15, 2025", event: "Bin repopulated (8 frogs assigned)", by: "Jane Smith" },
];

export default function BinDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  void params;

  return (
    <div className="p-6 lg:p-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500">
        <a href="/bins" className="hover:text-brand-600">Bins &amp; Rotation</a>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{MOCK_BIN.label}</span>
      </nav>

      {/* Header */}
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{MOCK_BIN.label}</h1>
          <p className="mt-1 text-sm text-gray-500">{MOCK_BIN.room}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            Rest Complete
          </span>
          <NoticeStatusBadge
            status={MOCK_BIN.noticeStatus}
            sentAt={MOCK_BIN.noticeSentAt}
            channel={MOCK_BIN.noticeChannel}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <DetailStat label="Frogs" value={`${MOCK_BIN.frogCount} / ${MOCK_BIN.targetCount}`} />
        <DetailStat label="Days Resting" value={String(MOCK_BIN.daysResting)} />
        <DetailStat label="Days Ready" value={String(MOCK_BIN.daysReady)} />
        <DetailStat label="Avg Performance" value={`${MOCK_BIN.avgPerformance}/5`} />
        <DetailStat label="Total Uses" value={String(MOCK_BIN.totalUses)} />
      </div>

      {/* Key dates */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-3 text-sm">
          <div>
            <p className="text-xs font-medium text-gray-500">Last Used</p>
            <p className="mt-1 font-semibold text-gray-900">{MOCK_BIN.lastUsedDate}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Available Since</p>
            <p className="mt-1 font-semibold text-gray-900">{MOCK_BIN.availableDate}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Rest/Reuse Window</p>
            <p className="mt-1 font-semibold text-gray-900">{MOCK_BIN.restWindow}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <section className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          Actions
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <ActionButton label="Log Use for Bin" primary />
          <ActionButton label="Mark Bin Resting" />
          <ActionButton label="Mark Bin Ready" />
          <ActionButton label="Repopulate Bin" />
          <ActionButton label="Move Frogs" />
          <ActionButton label="Send Notice" />
          <ActionButton label="Acknowledge Notice" />
        </div>
        {/* Frog Social contextual case link (shown when bridge module enabled) */}
        {/* TODO: Only render when frog_social_bridge module is enabled */}
        <div className="mt-4 border-t border-gray-100 pt-4">
          <a
            href={`/frog-social/create?scope=bin&source_id=${MOCK_BIN.id}&label=${encodeURIComponent(MOCK_BIN.label)}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-purple-300 bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-100"
          >
            <span>🔗</span> Create Frog Social case from this bin
          </a>
        </div>
      </section>

      {/* Frogs in this bin */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Frogs in This Bin ({MOCK_FROGS.length})
        </h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Sex</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Last Perf</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_FROGS.map((frog) => (
                <tr key={frog.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs font-medium text-brand-600">
                    <a href={`/frogs`}>{frog.code}</a>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{frog.sex}</td>
                  <td className="px-4 py-3 text-gray-600">{frog.sizeClass}</td>
                  <td className="px-4 py-3">{frog.lastPerformance}/5</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                      Rest complete
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* History */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Use &amp; Event History
        </h2>
        <div className="mt-3 space-y-2">
          {MOCK_HISTORY.map((entry, idx) => (
            <div key={idx} className="flex items-start gap-3 rounded-lg border border-gray-100 bg-white px-4 py-3">
              <span className="mt-0.5 text-xs text-gray-400 whitespace-nowrap">
                {entry.date}
              </span>
              <span className="text-sm text-gray-700">{entry.event}</span>
              <span className="ml-auto text-xs text-gray-400">{entry.by}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Notes */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">Notes</h2>
        <div className="mt-3 rounded-xl border border-gray-200 bg-white p-5">
          {/* TODO: Fetch notes/observations for this bin */}
          <p className="text-sm text-gray-500">No notes for this bin.</p>
          <button className="mt-3 text-sm font-medium text-brand-600 hover:underline">
            + Add note
          </button>
        </div>
      </section>
    </div>
  );
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function ActionButton({ label, primary = false }: { label: string; primary?: boolean }) {
  return (
    <button
      className={
        primary
          ? "rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          : "rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      }
    >
      {label}
    </button>
  );
}
