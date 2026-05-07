// TODO: Generate weekly aggregation from forecast_snapshots + bottlenecks

interface WeeklyData {
  readyCount: number;
  restingCount: number;
  overdueCount: number;
  nextUseBins: string[];
  repopNeeded: number;
  shortageRisk: boolean;
  missingData: number;
}

const MOCK: WeeklyData = {
  readyCount: 31,
  restingCount: 128,
  overdueCount: 8,
  nextUseBins: ["Rack 1 / Bin 6", "Rack 1 / Bin 8", "Rack 4 / Bin 2"],
  repopNeeded: 1,
  shortageRisk: true,
  missingData: 5,
};

export default function WeeklySummary() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-gray-700">Weekly Summary</h3>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-gray-500">Ready frogs</p>
          <p className="font-bold">{MOCK.readyCount}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Resting</p>
          <p className="font-bold">{MOCK.restingCount}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Overdue</p>
          <p className="font-bold text-red-600">{MOCK.overdueCount}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Need repop</p>
          <p className="font-bold text-yellow-600">{MOCK.repopNeeded}</p>
        </div>
      </div>
      <div className="mt-3">
        <p className="text-xs font-medium text-gray-600">Next-use bins:</p>
        <p className="text-xs text-gray-500">{MOCK.nextUseBins.join(", ")}</p>
      </div>
      {MOCK.shortageRisk && (
        <p className="mt-2 text-xs font-medium text-red-600">
          ⚠ Shortage risk projected next month
        </p>
      )}
      {MOCK.missingData > 0 && (
        <p className="mt-1 text-xs text-gray-400">
          {MOCK.missingData} events missing performance data
        </p>
      )}
    </div>
  );
}
