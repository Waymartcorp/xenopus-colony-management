"use client";

// TODO: Fetch today's actionable items from bin/frog cycle status
// TODO: Show rest-complete bins, overdue bins, repopulation needed, missing data
// TODO: Support quick-action buttons for each item
// TODO: Update based on lab mode (different action types per mode)

export interface ColonyAction {
  id: string;
  actionType: "rest_complete" | "overdue" | "repopulation" | "missing_result" | "performance_review" | "scheduled_use";
  targetLabel: string;
  description: string;
  urgency: "normal" | "high" | "urgent";
}

interface TodayColonyActionsProps {
  actions: ColonyAction[];
  onAction?: (actionId: string) => void;
}

export default function TodayColonyActions({
  actions,
  onAction,
}: TodayColonyActionsProps) {
  if (actions.length === 0) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-4">
        <p className="text-sm text-green-800">
          No urgent actions today. All bins and frogs are within normal
          parameters.
        </p>
      </div>
    );
  }

  const urgencyColors: Record<string, string> = {
    normal: "border-gray-200 bg-white",
    high: "border-yellow-200 bg-yellow-50",
    urgent: "border-red-200 bg-red-50",
  };

  return (
    <div className="space-y-2">
      {actions.map((action) => (
        <div
          key={action.id}
          className={`flex items-center justify-between rounded-lg border p-3 ${urgencyColors[action.urgency]}`}
        >
          <div>
            <p className="text-sm font-medium text-gray-800">
              {action.targetLabel}
            </p>
            <p className="text-xs text-gray-600">{action.description}</p>
          </div>
          {onAction && (
            <button
              onClick={() => onAction(action.id)}
              className="rounded-md bg-brand-600 px-3 py-1 text-xs font-medium text-white hover:bg-brand-700"
            >
              Action
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
