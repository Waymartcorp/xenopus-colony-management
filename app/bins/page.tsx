import NoticeStatusBadge from "@/components/NoticeStatusBadge";
import type { NoticeStatus } from "@/components/NoticeStatusBadge";

// TODO: Fetch from bin_cycle_status + locations + rotation_settings
// TODO: Filter by status, room, rack, performance
// TODO: Sort by availability date, last used, performance
// TODO: Connect action buttons to real endpoints

type BinStatus =
  | "general_population"
  | "recent_arrival"
  | "ready_for_use"
  | "scheduled_next"
  | "recently_used"
  | "needs_repopulation"
  | "resting"
  | "rest_complete"
  | "overdue"
  | "hold_monitor";

interface MockBin {
  id: string;
  label: string;
  room: string;
  rack: string;
  status: BinStatus;
  frogCount: number;
  targetCount: number;
  lastUsedDate: string | null;
  availableDate: string | null;
  daysResting: number | null;
  daysReady: number | null;
  avgPerformance: number | null;
  recommendedAction: string;
  noticeStatus: NoticeStatus;
}

const STATUS_LABELS: Record<BinStatus, { label: string; color: string }> = {
  general_population: { label: "General Population", color: "bg-gray-100 text-gray-700" },
  recent_arrival: { label: "Recent Arrival", color: "bg-purple-100 text-purple-700" },
  ready_for_use: { label: "Ready for Use", color: "bg-green-100 text-green-700" },
  scheduled_next: { label: "Scheduled Next", color: "bg-brand-100 text-brand-700" },
  recently_used: { label: "Recently Used", color: "bg-blue-100 text-blue-700" },
  needs_repopulation: { label: "Needs Repopulation", color: "bg-yellow-100 text-yellow-700" },
  resting: { label: "Resting", color: "bg-blue-100 text-blue-600" },
  rest_complete: { label: "Rest Complete", color: "bg-green-100 text-green-700" },
  overdue: { label: "Overdue", color: "bg-red-100 text-red-700" },
  hold_monitor: { label: "Hold / Monitor", color: "bg-orange-100 text-orange-700" },
};

const MOCK_BINS: MockBin[] = [
  { id: "1", label: "Bin 6", room: "Room A", rack: "Rack 1", status: "rest_complete", frogCount: 8, targetCount: 8, lastUsedDate: "Jan 15, 2026", availableDate: "May 5, 2026", daysResting: 112, daysReady: 2, avgPerformance: 4.2, recommendedAction: "Use next", noticeStatus: "sent" },
  { id: "2", label: "Bin 8", room: "Room A", rack: "Rack 1", status: "rest_complete", frogCount: 7, targetCount: 8, lastUsedDate: "Jan 20, 2026", availableDate: "May 7, 2026", daysResting: 107, daysReady: 0, avgPerformance: 3.8, recommendedAction: "Ready after rest", noticeStatus: "queued" },
  { id: "3", label: "Bin 2", room: "Room A", rack: "Rack 4", status: "rest_complete", frogCount: 8, targetCount: 8, lastUsedDate: "Jan 22, 2026", availableDate: "May 8, 2026", daysResting: 105, daysReady: null, avgPerformance: 4.5, recommendedAction: "Ready after rest", noticeStatus: "not_sent" },
  { id: "4", label: "Bin 1", room: "Room B", rack: "Rack 3", status: "overdue", frogCount: 8, targetCount: 8, lastUsedDate: "Dec 17, 2025", availableDate: "Apr 15, 2026", daysResting: 142, daysReady: 22, avgPerformance: 3.5, recommendedAction: "Overdue — review", noticeStatus: "sent" },
  { id: "5", label: "Bin 3", room: "Room A", rack: "Rack 2", status: "needs_repopulation", frogCount: 3, targetCount: 8, lastUsedDate: "Mar 1, 2026", availableDate: null, daysResting: null, daysReady: null, avgPerformance: null, recommendedAction: "Repopulate from GP", noticeStatus: "not_sent" },
  { id: "6", label: "Bin 7", room: "Room A", rack: "Rack 2", status: "resting", frogCount: 8, targetCount: 8, lastUsedDate: "Mar 15, 2026", availableDate: "Jun 13, 2026", daysResting: 53, daysReady: null, avgPerformance: 4.0, recommendedAction: "Wait — 37 days left", noticeStatus: "not_sent" },
  { id: "7", label: "Bin 4", room: "Room A", rack: "Rack 2", status: "resting", frogCount: 8, targetCount: 8, lastUsedDate: "Apr 1, 2026", availableDate: "Jun 30, 2026", daysResting: 36, daysReady: null, avgPerformance: 4.1, recommendedAction: "Wait — 54 days left", noticeStatus: "not_sent" },
  { id: "8", label: "Bin 5", room: "Room A", rack: "Rack 1", status: "recently_used", frogCount: 8, targetCount: 8, lastUsedDate: "May 5, 2026", availableDate: "Aug 3, 2026", daysResting: 2, daysReady: null, avgPerformance: 4.3, recommendedAction: "Resting — just used", noticeStatus: "not_sent" },
  { id: "9", label: "Bin 1", room: "Room C", rack: "GP Tank", status: "general_population", frogCount: 45, targetCount: 50, lastUsedDate: null, availableDate: null, daysResting: null, daysReady: null, avgPerformance: null, recommendedAction: "Source for repop", noticeStatus: "not_sent" },
  { id: "10", label: "Bin 2", room: "Room C", rack: "GP Tank", status: "general_population", frogCount: 38, targetCount: 50, lastUsedDate: null, availableDate: null, daysResting: null, daysReady: null, avgPerformance: null, recommendedAction: "Source for repop", noticeStatus: "not_sent" },
];

export default function BinsPage() {
  const actionBins = MOCK_BINS.filter((b) =>
    ["rest_complete", "overdue", "needs_repopulation", "scheduled_next"].includes(b.status)
  );
  const restingBins = MOCK_BINS.filter((b) =>
    ["resting", "recently_used"].includes(b.status)
  );
  const otherBins = MOCK_BINS.filter((b) =>
    ["general_population", "recent_arrival", "hold_monitor", "ready_for_use"].includes(b.status)
  );

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bins &amp; Rotation
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            All bins sorted by action priority. Click any bin for details.
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/setup"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            + Add Bin
          </a>
          <a
            href="/forecast"
            className="rounded-lg border border-brand-300 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50"
          >
            Calendar
          </a>
        </div>
      </div>

      {/* Quick stats */}
      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <QuickStat label="Ready / Rest Complete" value={actionBins.filter(b => b.status === "rest_complete").length} color="green" />
        <QuickStat label="Overdue" value={actionBins.filter(b => b.status === "overdue").length} color="red" />
        <QuickStat label="Need Repop" value={actionBins.filter(b => b.status === "needs_repopulation").length} color="yellow" />
        <QuickStat label="Resting" value={restingBins.length} color="blue" />
        <QuickStat label="GP / Source" value={otherBins.length} color="gray" />
      </div>

      {/* Bins Needing Action */}
      {actionBins.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800">
            Bins Needing Action
          </h2>
          <div className="mt-3">
            <BinTable bins={actionBins} />
          </div>
        </section>
      )}

      {/* Resting Bins */}
      {restingBins.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800">Resting</h2>
          <div className="mt-3">
            <BinTable bins={restingBins} />
          </div>
        </section>
      )}

      {/* General Population / Other */}
      {otherBins.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800">
            General Population &amp; Source Bins
          </h2>
          <div className="mt-3">
            <BinTable bins={otherBins} />
          </div>
        </section>
      )}
    </div>
  );
}

function BinTable({ bins }: { bins: MockBin[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            <th className="px-4 py-3">Bin</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Frogs</th>
            <th className="px-4 py-3">Last Used</th>
            <th className="px-4 py-3">Available</th>
            <th className="px-4 py-3">Days</th>
            <th className="px-4 py-3">Perf</th>
            <th className="px-4 py-3">Action</th>
            <th className="px-4 py-3">Notice</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {bins.map((bin) => {
            const statusConfig = STATUS_LABELS[bin.status];
            return (
              <tr key={bin.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <a
                    href={`/bins/${bin.id}`}
                    className="font-medium text-gray-900 hover:text-brand-600"
                  >
                    {bin.rack} / {bin.label}
                  </a>
                  <p className="text-xs text-gray-400">{bin.room}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  {bin.frogCount}/{bin.targetCount}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {bin.lastUsedDate ?? "—"}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {bin.availableDate ?? "—"}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {bin.daysResting != null
                    ? bin.daysReady != null
                      ? `${bin.daysReady}d ready`
                      : `${bin.daysResting}d rest`
                    : "—"}
                </td>
                <td className="px-4 py-3 text-xs">
                  {bin.avgPerformance != null
                    ? `${bin.avgPerformance}/5`
                    : "—"}
                </td>
                <td className="px-4 py-3 text-xs font-medium text-gray-700">
                  {bin.recommendedAction}
                </td>
                <td className="px-4 py-3">
                  <NoticeStatusBadge status={bin.noticeStatus} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function QuickStat({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700",
    gray: "bg-gray-100 text-gray-700",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${colors[color]}`}>
      {label}: {value}
    </span>
  );
}
