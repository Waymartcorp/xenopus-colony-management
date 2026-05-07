// TODO: Generate from current bin states + event data + bottlenecks

interface DailyData {
  binsReadyToday: number;
  binsNeedingRepop: number;
  urgentBottlenecks: number;
  actionsNeeded: string[];
}

const MOCK: DailyData = {
  binsReadyToday: 4,
  binsNeedingRepop: 1,
  urgentBottlenecks: 1,
  actionsNeeded: [
    "Rack 1 / Bin 6 — ready for extraction",
    "Rack 2 / Bin 3 — needs repopulation (3/8)",
    "Log performance for batch #34",
  ],
};

export default function DailySummary() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-gray-700">Today&apos;s Summary</h3>
      <div className="mt-3 flex gap-4 text-sm">
        <span className="text-green-700">{MOCK.binsReadyToday} bins ready</span>
        <span className="text-yellow-700">{MOCK.binsNeedingRepop} need repop</span>
        {MOCK.urgentBottlenecks > 0 && (
          <span className="text-red-700">{MOCK.urgentBottlenecks} bottleneck</span>
        )}
      </div>
      <ul className="mt-3 space-y-1">
        {MOCK.actionsNeeded.map((action, i) => (
          <li key={i} className="text-sm text-gray-600">• {action}</li>
        ))}
      </ul>
    </div>
  );
}
