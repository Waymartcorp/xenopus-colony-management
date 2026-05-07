// TODO: Fetch feeding_schedules + feeding_logs for current org
// TODO: Show schedule adherence and missed feedings
// TODO: Filter by room/rack/bin
// TODO: Support editing schedules (manager+)

const MOCK_SCHEDULES = [
  { id: "1", location: "Rack 1 / Bins 1–8", feedType: "Frog brittle", amount: "3g/bin", frequency: "Daily", time: "9:00 AM", active: true },
  { id: "2", location: "Rack 2 / Bins 1–8", feedType: "Frog brittle", amount: "3g/bin", frequency: "Daily", time: "9:00 AM", active: true },
  { id: "3", location: "GP Tank 1", feedType: "Mixed pellet", amount: "15g", frequency: "Daily", time: "5:00 PM", active: true },
  { id: "4", location: "GP Tank 2", feedType: "Mixed pellet", amount: "12g", frequency: "Daily", time: "5:00 PM", active: true },
  { id: "5", location: "Recovery bins", feedType: "Bloodworm", amount: "2g/bin", frequency: "Every 2 days", time: "10:00 AM", active: true },
];

const MOCK_RECENT_LOGS = [
  { location: "Rack 1 / Bins 1–8", feedType: "Frog brittle", amount: "3g", response: "good", fedBy: "Jane Smith", fedAt: "Today, 9:05 AM" },
  { location: "Rack 2 / Bins 1–8", feedType: "Frog brittle", amount: "3g", response: "good", fedBy: "Jane Smith", fedAt: "Today, 9:12 AM" },
  { location: "GP Tank 1", feedType: "Mixed pellet", amount: "15g", response: "excellent", fedBy: "Tom Chen", fedAt: "Yesterday, 5:10 PM" },
  { location: "Recovery bins", feedType: "Bloodworm", amount: "2g", response: "fair", fedBy: "Jane Smith", fedAt: "Yesterday, 10:00 AM" },
  { location: "GP Tank 2", feedType: "Mixed pellet", amount: "12g", response: null, fedBy: null, fedAt: "MISSED — May 6" },
];

const RESPONSE_COLORS: Record<string, string> = {
  excellent: "text-green-700 bg-green-100",
  good: "text-green-600 bg-green-50",
  fair: "text-yellow-700 bg-yellow-100",
  poor: "text-red-700 bg-red-100",
};

export default function FeedingPage() {
  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Feeding</h1>
          <p className="mt-1 text-sm text-gray-500">
            Feeding schedules, logs, and response tracking.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
            Log Feeding
          </button>
          <a href="/husbandry" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Husbandry
          </a>
        </div>
      </div>

      {/* Schedules */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">Active Schedules</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Feed Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Frequency</th>
                <th className="px-4 py-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_SCHEDULES.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{s.location}</td>
                  <td className="px-4 py-3 text-gray-600">{s.feedType}</td>
                  <td className="px-4 py-3 text-gray-600">{s.amount}</td>
                  <td className="px-4 py-3 text-gray-600">{s.frequency}</td>
                  <td className="px-4 py-3 text-gray-600">{s.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent logs */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">Recent Feeding Logs</h2>
        <div className="mt-3 space-y-2">
          {MOCK_RECENT_LOGS.map((log, idx) => {
            const isMissed = log.fedBy === null;
            return (
              <div
                key={idx}
                className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                  isMissed ? "border-red-200 bg-red-50" : "border-gray-200 bg-white"
                }`}
              >
                <div>
                  <p className={`text-sm font-medium ${isMissed ? "text-red-700" : "text-gray-900"}`}>
                    {log.location} — {log.feedType} {log.amount}
                  </p>
                  <p className="text-xs text-gray-400">
                    {isMissed ? log.fedAt : `${log.fedBy} · ${log.fedAt}`}
                  </p>
                </div>
                {log.response && (
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${RESPONSE_COLORS[log.response] ?? ""}`}>
                    {log.response}
                  </span>
                )}
                {isMissed && (
                  <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                    missed
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Charts placeholder */}
      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6">
          <p className="text-sm font-semibold text-gray-700">Feeding Response by Bin</p>
          <p className="mt-2 text-xs text-gray-400">
            TODO: Line chart showing feeding response ratings over time per bin
          </p>
        </div>
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6">
          <p className="text-sm font-semibold text-gray-700">Missed Feedings</p>
          <p className="mt-2 text-xs text-gray-400">
            TODO: Bar chart of missed feedings by week/month
          </p>
        </div>
      </section>
    </div>
  );
}
