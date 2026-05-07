// TODO: Fetch husbandry_checkpoints + feeding_logs + husbandry_tasks for today
// TODO: Filter by room/rack/bin
// TODO: Show lab-mode-specific emphasis
// TODO: Gate behind husbandry module entitlement (free 90 days, then upgrade)

const MOCK_DUE_TODAY = [
  { type: "feeding", label: "Feed Rack 1 / Bins 1–8", time: "9:00 AM", status: "pending" },
  { type: "feeding", label: "Feed Rack 2 / Bins 1–8", time: "9:00 AM", status: "pending" },
  { type: "post_use_recovery", label: "Recovery check: Rack 1 / Bin 5", time: "10:00 AM", status: "pending" },
  { type: "ph", label: "pH/conductivity check: Room A", time: "11:00 AM", status: "pending" },
  { type: "daily_visual", label: "Visual check: all bins", time: "8:00 AM", status: "completed" },
];

const MOCK_OVERDUE = [
  { type: "feeding", label: "GP Tank 2 missed feeding (yesterday)", dueAt: "May 6, 5:00 PM" },
  { type: "density", label: "Density check: Rack 2 / Bin 3 (3 days overdue)", dueAt: "May 4" },
];

const MOCK_RECENT = [
  { type: "daily_visual", label: "Visual check: all bins", checkedBy: "Jane Smith", checkedAt: "Today, 8:12 AM", status: "normal" },
  { type: "feeding", label: "Rack 1 / Bins 1–8 fed 3g brittle", checkedBy: "Jane Smith", checkedAt: "Yesterday, 9:05 AM", status: "normal" },
  { type: "post_use_recovery", label: "Recovery check: Rack 1 / Bin 5", checkedBy: "Tom Chen", checkedAt: "Yesterday, 2:30 PM", status: "attention" },
  { type: "temperature", label: "Temperature check: Room A (19.2°C)", checkedBy: "Jane Smith", checkedAt: "Yesterday, 8:00 AM", status: "normal" },
];

const TYPE_ICONS: Record<string, string> = {
  feeding: "🍽",
  daily_visual: "👁",
  post_use_recovery: "🔄",
  ph: "🧪",
  temperature: "🌡",
  density: "📊",
  water_level: "💧",
  cleanliness: "✨",
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  normal: "bg-green-100 text-green-700",
  attention: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
  skipped: "bg-gray-100 text-gray-500",
};

export default function HusbandryPage() {
  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Husbandry</h1>
          <p className="mt-1 text-sm text-gray-500">
            Daily checks, feeding, and colony care tasks.
          </p>
        </div>
        <div className="flex gap-2">
          <a href="/feeding" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Feeding Schedule
          </a>
          <a href="/tasks" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            All Tasks
          </a>
        </div>
      </div>

      {/* Module badge */}
      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
        Husbandry Module · Free for 90 days
      </div>

      {/* Overdue */}
      {MOCK_OVERDUE.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-red-600">
            Overdue ({MOCK_OVERDUE.length})
          </h2>
          <div className="mt-2 space-y-2">
            {MOCK_OVERDUE.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span>{TYPE_ICONS[item.type] ?? "📋"}</span>
                  <span className="text-sm font-medium text-gray-900">{item.label}</span>
                </div>
                <span className="text-xs text-red-600">Due: {item.dueAt}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Due Today */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold text-gray-800">Due Today</h2>
        <div className="mt-3 space-y-2">
          {MOCK_DUE_TODAY.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
              <div className="flex items-center gap-3">
                <span>{TYPE_ICONS[item.type] ?? "📋"}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.time}</p>
                </div>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[item.status]}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Checks */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">Recent Checks</h2>
        <div className="mt-3 space-y-2">
          {MOCK_RECENT.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-4 py-3">
              <div className="flex items-center gap-3">
                <span>{TYPE_ICONS[item.type] ?? "📋"}</span>
                <div>
                  <p className="text-sm text-gray-800">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.checkedBy} · {item.checkedAt}</p>
                </div>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[item.status]}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          Quick Actions
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
            Log Feeding
          </button>
          <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Log Checkpoint
          </button>
          <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Recovery Check
          </button>
          <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Water Check
          </button>
        </div>
      </section>

      {/* Analytics placeholder */}
      <section className="mt-8 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
        <p className="text-sm font-semibold text-gray-600">
          Husbandry Analytics
        </p>
        <p className="mt-2 text-xs text-gray-400">
          TODO: Charts for feeding response over time, missed feedings by
          week, husbandry exceptions, and performance correlation.
        </p>
      </section>
    </div>
  );
}
