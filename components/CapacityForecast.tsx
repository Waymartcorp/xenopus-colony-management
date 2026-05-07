// TODO: Fetch from forecast_snapshots for this org
// TODO: Accept forecast_settings as props or fetch
// TODO: Recalculate on demand when settings change

interface CapacityData {
  readyFrogs: number;
  readyBins: number;
  restingFrogs: number;
  becomingReady30d: number;
  expectedDemand30d: number;
  projectedShortfall: number;
  runoutDate: string | null;
  runoutDays: number | null;
}

const MOCK_DATA: CapacityData = {
  readyFrogs: 31,
  readyBins: 4,
  restingFrogs: 128,
  becomingReady30d: 48,
  expectedDemand30d: 64,
  projectedShortfall: 16,
  runoutDate: "May 30, 2026",
  runoutDays: 23,
};

export default function CapacityForecast() {
  const d = MOCK_DATA;
  const hasRisk = d.runoutDays != null && d.runoutDays < 60;

  return (
    <div className={`rounded-xl border p-5 ${hasRisk ? "border-red-200 bg-red-50" : "border-gray-200 bg-white"}`}>
      <h3 className="text-sm font-semibold text-gray-700">Capacity Forecast</h3>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-gray-500">Ready now</p>
          <p className="font-bold text-gray-900">{d.readyFrogs} frogs / {d.readyBins} bins</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Becoming ready (30d)</p>
          <p className="font-bold text-green-700">+{d.becomingReady30d}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Expected demand (30d)</p>
          <p className="font-bold text-gray-700">{d.expectedDemand30d}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Projected shortfall</p>
          <p className={`font-bold ${d.projectedShortfall > 0 ? "text-red-600" : "text-green-600"}`}>
            {d.projectedShortfall > 0 ? `-${d.projectedShortfall}` : "None"}
          </p>
        </div>
      </div>
      {d.runoutDate && (
        <p className="mt-3 text-xs font-medium text-red-600">
          Run-out projected: {d.runoutDate} ({d.runoutDays} days)
        </p>
      )}
      <a href="/capacity" className="mt-2 inline-block text-xs font-medium text-brand-600 hover:underline">
        Full capacity forecast →
      </a>
    </div>
  );
}
