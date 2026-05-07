import NoticeStatusBadge from "@/components/NoticeStatusBadge";

// TODO: Calculate from rotation_settings + bin_cycle_status + frog_events
// TODO: Integrate with full calendar UI library
// TODO: Pull scheduled events and protocol reminders

const MOCK_UPCOMING = [
  { date: "May 8", label: "Rack 4 / Bin 2", event: "Rest complete — ready for use", type: "ready" },
  { date: "May 10", label: "Rack 2 / Bin 1", event: "Rest complete — ready for use", type: "ready" },
  { date: "May 12", label: "Rack 1 / Bin 6", event: "Performance notes due (batch #34)", type: "reminder" },
  { date: "May 15", label: "Rack 3 / Bin 1", event: "Overdue — 150 days without use", type: "overdue" },
  { date: "May 21", label: "GP Tank 1", event: "Suggested as repopulation source for Rack 2 / Bin 3", type: "repopulation" },
  { date: "May 28", label: "Rack 2 / Bin 2", event: "Rest complete — ready for use", type: "ready" },
  { date: "Jun 5", label: "Rack 1 / Bin 7", event: "Rest complete — approaching window", type: "ready" },
  { date: "Jun 13", label: "Rack 2 / Bin 7", event: "Rest complete — ready for use", type: "ready" },
  { date: "Jun 20", label: "Rack 2 / Bin 6", event: "Rest complete — ready for use", type: "ready" },
  { date: "Jun 30", label: "Rack 2 / Bin 4", event: "Rest complete — ready for use", type: "ready" },
  { date: "Jul 8", label: "Rack 1 / Bin 3", event: "Rest complete — approaching window", type: "ready" },
  { date: "Jul 14", label: "Rack 3 / Bin 2", event: "Rest complete — ready for use", type: "ready" },
];

const MOCK_PERIODS = [
  { period: "Next 7 days", binsReady: 2, binsOverdue: 1, reminders: 1 },
  { period: "Next 30 days", binsReady: 5, binsOverdue: 1, reminders: 2 },
  { period: "Next 60 days", binsReady: 8, binsOverdue: 1, reminders: 3 },
  { period: "Next 90 days", binsReady: 11, binsOverdue: 1, reminders: 4 },
  { period: "Next 120 days", binsReady: 14, binsOverdue: 1, reminders: 5 },
];

const TYPE_STYLES: Record<string, { dot: string; badge: string }> = {
  ready: { dot: "bg-green-500", badge: "bg-green-100 text-green-700" },
  overdue: { dot: "bg-red-500", badge: "bg-red-100 text-red-700" },
  reminder: { dot: "bg-yellow-500", badge: "bg-yellow-100 text-yellow-700" },
  repopulation: { dot: "bg-purple-500", badge: "bg-purple-100 text-purple-700" },
};

export default function ForecastPage() {
  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Calendar &amp; Forecast
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Dated view of upcoming bin availability, reminders, and actions.
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/bins"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Bin Table
          </a>
          <a
            href="/past"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            History
          </a>
        </div>
      </div>

      {/* Summary cards */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {MOCK_PERIODS.map((p) => (
          <div key={p.period} className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-medium text-gray-500">{p.period}</p>
            <p className="mt-2 text-xl font-bold text-gray-900">{p.binsReady} bins ready</p>
            <div className="mt-1 flex gap-2 text-xs text-gray-500">
              {p.binsOverdue > 0 && (
                <span className="text-red-600">{p.binsOverdue} overdue</span>
              )}
              <span>{p.reminders} reminders</span>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Upcoming Events
        </h2>
        <p className="mt-1 text-xs text-gray-400">
          All bins and reminders sorted by date
        </p>
        <div className="mt-4 space-y-1">
          {MOCK_UPCOMING.map((item, idx) => {
            const style = TYPE_STYLES[item.type] ?? TYPE_STYLES.ready;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-4 py-3 hover:bg-gray-50"
              >
                <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
                <span className="w-16 text-xs font-semibold text-gray-600 whitespace-nowrap">
                  {item.date}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {item.label}
                </span>
                <span className="text-sm text-gray-600">{item.event}</span>
                <span className="ml-auto">
                  <NoticeStatusBadge status="not_sent" />
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* TODO: Full calendar grid view */}
      <section className="mt-8 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <p className="text-sm text-gray-500">
          Full calendar UI will be integrated here (week/month view with bin
          events overlaid).
        </p>
        <p className="mt-2 text-xs text-gray-400">
          TODO: Integrate react-calendar or similar. Show rest completions,
          scheduled uses, protocol reminders, and repopulation events.
        </p>
      </section>
    </div>
  );
}
