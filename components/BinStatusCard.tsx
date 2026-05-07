"use client";

// TODO: Link to bin detail view
// TODO: Show performance trend indicator
// TODO: Action buttons (log use, mark rest complete, repopulate)

export interface BinStatus {
  locationId: string;
  label: string;
  cycleState: string;
  lastUsedAt: string | null;
  restCompleteAt: string | null;
  overdueAt: string | null;
  targetCapacity: number;
  currentCount: number;
  useCount: number;
  averagePerformance: number | null;
  performanceTrend: "improving" | "stable" | "declining" | null;
}

interface BinStatusCardProps {
  bin: BinStatus;
  onAction?: (action: string, locationId: string) => void;
}

export default function BinStatusCard({ bin, onAction }: BinStatusCardProps) {
  const stateColors: Record<string, string> = {
    ready_for_use: "border-green-200 bg-green-50",
    rest_complete: "border-green-200 bg-green-50",
    resting: "border-blue-200 bg-blue-50",
    recently_used: "border-blue-200 bg-blue-50",
    needs_repopulation: "border-yellow-200 bg-yellow-50",
    overdue: "border-red-200 bg-red-50",
    hold_monitor: "border-orange-200 bg-orange-50",
    general_population: "border-gray-200 bg-white",
    recent_arrival: "border-purple-200 bg-purple-50",
    scheduled_next: "border-indigo-200 bg-indigo-50",
  };

  const stateLabels: Record<string, string> = {
    ready_for_use: "Ready for Use",
    rest_complete: "Rest Complete",
    resting: "Resting",
    recently_used: "Recently Used",
    needs_repopulation: "Needs Repopulation",
    overdue: "Overdue",
    hold_monitor: "Hold / Monitor",
    general_population: "General Population",
    recent_arrival: "Recent Arrival",
    scheduled_next: "Scheduled Next",
  };

  const borderColor = stateColors[bin.cycleState] ?? "border-gray-200 bg-white";
  const stateLabel = stateLabels[bin.cycleState] ?? bin.cycleState;

  return (
    <div className={`rounded-xl border p-4 ${borderColor}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{bin.label}</h3>
          <p className="mt-0.5 text-xs font-medium text-gray-600">
            {stateLabel}
          </p>
        </div>
        {bin.averagePerformance != null && (
          <span className="text-sm font-bold text-gray-700">
            {bin.averagePerformance.toFixed(1)}/5
          </span>
        )}
      </div>

      <div className="mt-3 space-y-1 text-xs text-gray-600">
        <p>
          Count: {bin.currentCount}/{bin.targetCapacity}
          {bin.currentCount < bin.targetCapacity && (
            <span className="ml-1 text-yellow-700">
              (need {bin.targetCapacity - bin.currentCount})
            </span>
          )}
        </p>
        {bin.lastUsedAt && <p>Last used: {bin.lastUsedAt}</p>}
        {bin.restCompleteAt && <p>Available: {bin.restCompleteAt}</p>}
        {bin.useCount > 0 && <p>Use count: {bin.useCount}</p>}
        {bin.performanceTrend && bin.performanceTrend !== "stable" && (
          <p className={bin.performanceTrend === "declining" ? "text-red-600" : "text-green-600"}>
            Trend: {bin.performanceTrend}
          </p>
        )}
      </div>

      {onAction && (
        <div className="mt-3 flex gap-2">
          {bin.cycleState === "ready_for_use" && (
            <button
              onClick={() => onAction("use", bin.locationId)}
              className="rounded bg-brand-600 px-2 py-1 text-xs font-medium text-white hover:bg-brand-700"
            >
              Log Use
            </button>
          )}
          {bin.cycleState === "needs_repopulation" && (
            <button
              onClick={() => onAction("repopulate", bin.locationId)}
              className="rounded bg-yellow-600 px-2 py-1 text-xs font-medium text-white hover:bg-yellow-700"
            >
              Repopulate
            </button>
          )}
        </div>
      )}
    </div>
  );
}
