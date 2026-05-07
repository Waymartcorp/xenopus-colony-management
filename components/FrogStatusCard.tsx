"use client";

// TODO: Link to frog detail view
// TODO: Show performance history mini-chart
// TODO: Action buttons (log event, move, view history)

export interface FrogCycleInfo {
  frogId: string;
  publicCode: string;
  localId: string | null;
  sex: string | null;
  sizeClass: string | null;
  cycleState: string;
  lastUsedAt: string | null;
  restCompleteAt: string | null;
  useCount: number;
  averagePerformance: number | null;
  performanceTrend: "improving" | "stable" | "declining" | null;
  doNotUse: boolean;
  retirementCandidate: boolean;
  locationLabel: string | null;
}

interface FrogStatusCardProps {
  frog: FrogCycleInfo;
}

export default function FrogStatusCard({ frog }: FrogStatusCardProps) {
  const stateColors: Record<string, string> = {
    available: "border-green-200 bg-green-50",
    rest_complete: "border-green-200 bg-green-50",
    resting: "border-blue-200 bg-blue-50",
    recently_used: "border-blue-200 bg-blue-50",
    overdue: "border-red-200 bg-red-50",
    hold_monitor: "border-orange-200 bg-orange-50",
    scheduled: "border-indigo-200 bg-indigo-50",
    retired: "border-gray-200 bg-gray-50",
    deceased: "border-gray-200 bg-gray-100",
  };

  const stateLabels: Record<string, string> = {
    available: "Available",
    rest_complete: "Rest Complete",
    resting: "Resting",
    recently_used: "Recently Used",
    overdue: "Overdue",
    hold_monitor: "Hold / Monitor",
    scheduled: "Scheduled",
    retired: "Retired",
    deceased: "Deceased",
  };

  const borderColor = stateColors[frog.cycleState] ?? "border-gray-200 bg-white";
  const stateLabel = stateLabels[frog.cycleState] ?? frog.cycleState;

  return (
    <div className={`rounded-xl border p-4 ${borderColor}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-mono text-sm font-semibold text-gray-900">
            {frog.publicCode}
          </h3>
          <p className="mt-0.5 text-xs text-gray-600">{stateLabel}</p>
        </div>
        <div className="text-right">
          {frog.averagePerformance != null && (
            <span className="text-sm font-bold text-gray-700">
              {frog.averagePerformance.toFixed(1)}/5
            </span>
          )}
          {frog.doNotUse && (
            <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
              DNU
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 space-y-1 text-xs text-gray-600">
        <p>
          {[frog.sex, frog.sizeClass, frog.localId].filter(Boolean).join(" · ")}
        </p>
        {frog.locationLabel && <p>Location: {frog.locationLabel}</p>}
        {frog.lastUsedAt && <p>Last used: {frog.lastUsedAt}</p>}
        {frog.restCompleteAt && <p>Available: {frog.restCompleteAt}</p>}
        <p>Uses: {frog.useCount}</p>
        {frog.performanceTrend && frog.performanceTrend !== "stable" && (
          <p className={frog.performanceTrend === "declining" ? "text-red-600" : "text-green-600"}>
            Trend: {frog.performanceTrend}
          </p>
        )}
        {frog.retirementCandidate && (
          <p className="font-medium text-orange-600">Retirement candidate</p>
        )}
      </div>
    </div>
  );
}
