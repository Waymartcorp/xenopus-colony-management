// TODO: Calculate from forecast_settings + current cycle states
// TODO: Show line chart of ready frogs declining to threshold

interface RunOutData {
  daysUntilShortage: number | null;
  runoutDate: string | null;
  useRate: number;
  restPeriod: number;
  threshold: number;
  currentReady: number;
  recommendation: string;
}

const MOCK: RunOutData = {
  daysUntilShortage: 23,
  runoutDate: "May 30, 2026",
  useRate: 16,
  restPeriod: 120,
  threshold: 32,
  currentReady: 31,
  recommendation:
    "Repopulate 3 bins with 8 frogs each or reduce use rate by 6 frogs/week.",
};

export default function RunOutForecast() {
  const risk = MOCK.daysUntilShortage != null && MOCK.daysUntilShortage < 60;

  return (
    <div className={`rounded-xl border p-5 ${risk ? "border-red-200 bg-red-50" : "border-gray-200 bg-white"}`}>
      <h3 className="text-sm font-semibold text-gray-700">
        Run-Out Prediction
      </h3>
      {MOCK.daysUntilShortage != null ? (
        <>
          <p className="mt-3 text-sm text-gray-700">
            At <strong>{MOCK.useRate} frogs/week</strong> and a{" "}
            <strong>{MOCK.restPeriod}-day</strong> rest period, ready frogs will
            fall below threshold ({MOCK.threshold}) on{" "}
            <strong>{MOCK.runoutDate}</strong>.
          </p>
          <p className="mt-2 text-2xl font-bold text-red-700">
            {MOCK.daysUntilShortage} days
          </p>
          <p className="mt-2 text-xs font-medium text-gray-600">
            → {MOCK.recommendation}
          </p>
        </>
      ) : (
        <p className="mt-3 text-sm text-green-700">
          Colony rotation is sustainable at current rates. No shortage
          projected.
        </p>
      )}
      <a href="/capacity" className="mt-3 inline-block text-xs font-medium text-brand-600 hover:underline">
        View full forecast →
      </a>
    </div>
  );
}
