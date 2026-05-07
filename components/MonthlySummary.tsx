// TODO: Generate from monthly forecast_snapshots + performance_ratings + bottlenecks

interface MonthlyData {
  useRate: number;
  avgPerformance: number;
  seasonalityNote: string | null;
  projectedCapacity: number;
  bottleneckCount: number;
  recommendedAdjustments: string[];
}

const MOCK: MonthlyData = {
  useRate: 16,
  avgPerformance: 4.1,
  seasonalityNote: "Performance typically dips in summer months (Jun–Aug).",
  projectedCapacity: 48,
  bottleneckCount: 3,
  recommendedAdjustments: [
    "Add 24 mature females over the next 14 days",
    "Consider reducing use rate to 12/week during summer",
    "Schedule batch repopulation from GP Tank 1",
  ],
};

export default function MonthlySummary() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-gray-700">Monthly Overview</h3>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-gray-500">Use rate</p>
          <p className="font-bold">{MOCK.useRate} frogs/week</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Avg performance</p>
          <p className="font-bold">{MOCK.avgPerformance}/5</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Projected capacity</p>
          <p className="font-bold">{MOCK.projectedCapacity} frogs</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Bottlenecks</p>
          <p className="font-bold text-red-600">{MOCK.bottleneckCount}</p>
        </div>
      </div>
      {MOCK.seasonalityNote && (
        <p className="mt-3 text-xs text-yellow-700">
          Seasonality: {MOCK.seasonalityNote}
        </p>
      )}
      <div className="mt-3">
        <p className="text-xs font-medium text-gray-600">Recommended adjustments:</p>
        <ul className="mt-1 space-y-0.5">
          {MOCK.recommendedAdjustments.map((adj, i) => (
            <li key={i} className="text-xs text-gray-500">• {adj}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
