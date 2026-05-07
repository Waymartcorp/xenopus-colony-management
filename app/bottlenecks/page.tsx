// TODO: Fetch active bottlenecks from bottlenecks table
// TODO: Auto-detect bottlenecks via cron or on-demand calculation
// TODO: Allow acknowledge/dismiss/resolve actions

type BottleneckType =
  | "not_enough_ready_frogs"
  | "not_enough_ready_bins"
  | "too_many_resting"
  | "rest_complete_not_reused"
  | "general_population_low"
  | "repopulation_lag"
  | "performance_decline"
  | "missing_performance_data"
  | "overuse_risk"
  | "demand_exceeds_available"
  | "source_cohort_imbalance"
  | "recent_arrival_bottleneck";

interface MockBottleneck {
  id: string;
  type: BottleneckType;
  severity: "low" | "medium" | "high";
  label: string;
  reason: string;
  affectedBins: string[];
  dateRange: string;
  recommendedAction: string;
  status: "active" | "acknowledged";
}

const BOTTLENECK_LABELS: Record<BottleneckType, string> = {
  not_enough_ready_frogs: "Not Enough Ready Frogs",
  not_enough_ready_bins: "Not Enough Ready Bins",
  too_many_resting: "Too Many Frogs Resting",
  rest_complete_not_reused: "Rest-Complete Frogs Not Being Reused",
  general_population_low: "General Population Too Low",
  repopulation_lag: "Repopulation Lag",
  performance_decline: "Performance Decline Reducing Usable Frogs",
  missing_performance_data: "Missing Performance Data",
  overuse_risk: "Overuse Risk",
  demand_exceeds_available: "Scheduled Demand Exceeds Available",
  source_cohort_imbalance: "Source/Cohort Imbalance",
  recent_arrival_bottleneck: "Recent Arrival Bottleneck",
};

const SEVERITY_STYLES = {
  high: { badge: "bg-red-100 text-red-700", border: "border-red-200" },
  medium: { badge: "bg-yellow-100 text-yellow-700", border: "border-yellow-200" },
  low: { badge: "bg-blue-100 text-blue-700", border: "border-blue-200" },
};

const MOCK_BOTTLENECKS: MockBottleneck[] = [
  {
    id: "1",
    type: "demand_exceeds_available",
    severity: "high",
    label: "Use rate exceeds rest recovery",
    reason: "At 16 frogs/week with 120-day rest, the lab needs 274 frogs in rotation but only has 187. Current use rate is unsustainable without repopulation.",
    affectedBins: ["All extraction bins"],
    dateRange: "Now – Jul 2026",
    recommendedAction: "Reduce use to 12 frogs/week or add 3 bins of 8 frogs from GP within 14 days.",
    status: "active",
  },
  {
    id: "2",
    type: "rest_complete_not_reused",
    severity: "medium",
    label: "Overdue bin not being reused",
    reason: "Rack 3 / Bin 1 has been rest-complete for 22 days (142 days total) without use. Delaying reuse wastes capacity.",
    affectedBins: ["Rack 3 / Bin 1"],
    dateRange: "Apr 15 – present",
    recommendedAction: "Schedule extraction for Rack 3 / Bin 1 this week or mark for observation.",
    status: "active",
  },
  {
    id: "3",
    type: "repopulation_lag",
    severity: "medium",
    label: "Bin below capacity",
    reason: "Rack 2 / Bin 3 has only 3/8 frogs. It has been below target for 67 days without repopulation.",
    affectedBins: ["Rack 2 / Bin 3"],
    dateRange: "Mar 1 – present",
    recommendedAction: "Add 5 mature females from GP Tank 1 or GP Tank 2.",
    status: "active",
  },
  {
    id: "4",
    type: "missing_performance_data",
    severity: "low",
    label: "Performance notes missing",
    reason: "5 use events in the last 30 days have no performance rating. This reduces forecasting accuracy.",
    affectedBins: ["Rack 1 / Bin 5", "Rack 1 / Bin 6"],
    dateRange: "Apr 7 – May 7",
    recommendedAction: "Log performance ratings for recent extractions.",
    status: "active",
  },
  {
    id: "5",
    type: "general_population_low",
    severity: "low",
    label: "GP source declining",
    reason: "GP Tank 2 is at 38/50 frogs. If 3 repopulation events are needed in the next 30 days, GP will drop below sustainable level.",
    affectedBins: ["GP Tank 2"],
    dateRange: "Next 30 days",
    recommendedAction: "Order new frogs or reduce repopulation from this tank.",
    status: "acknowledged",
  },
];

export default function BottlenecksPage() {
  const highCount = MOCK_BOTTLENECKS.filter((b) => b.severity === "high").length;
  const medCount = MOCK_BOTTLENECKS.filter((b) => b.severity === "medium").length;
  const lowCount = MOCK_BOTTLENECKS.filter((b) => b.severity === "low").length;

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bottlenecks</h1>
          <p className="mt-1 text-sm text-gray-500">
            What is slowing down or threatening your colony rotation?
          </p>
        </div>
        <a
          href="/capacity"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Capacity Forecast
        </a>
      </div>

      {/* Severity summary */}
      <div className="mt-6 flex gap-3">
        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
          {highCount} High
        </span>
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
          {medCount} Medium
        </span>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          {lowCount} Low
        </span>
      </div>

      {/* Bottleneck list */}
      <div className="mt-6 space-y-4">
        {MOCK_BOTTLENECKS.map((bn) => {
          const style = SEVERITY_STYLES[bn.severity];
          return (
            <div key={bn.id} className={`rounded-xl border ${style.border} bg-white p-5`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${style.badge}`}>
                    {bn.severity}
                  </span>
                  <span className="text-xs text-gray-400">
                    {BOTTLENECK_LABELS[bn.type]}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{bn.dateRange}</span>
              </div>
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                {bn.label}
              </h3>
              <p className="mt-1 text-sm text-gray-600">{bn.reason}</p>
              {bn.affectedBins.length > 0 && (
                <p className="mt-2 text-xs text-gray-500">
                  Affected: {bn.affectedBins.join(", ")}
                </p>
              )}
              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-800">
                  → {bn.recommendedAction}
                </p>
                <div className="flex gap-2">
                  {bn.status === "active" && (
                    <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">
                      Acknowledge
                    </button>
                  )}
                  <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart placeholder */}
      <section className="mt-8 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
        <p className="text-sm font-semibold text-gray-600">
          Bottleneck Severity Over Time
        </p>
        <p className="mt-2 text-xs text-gray-400">
          TODO: Stacked bar chart showing active bottlenecks by severity over
          past 90 days.
        </p>
      </section>
    </div>
  );
}
