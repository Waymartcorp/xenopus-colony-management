"use client";

// TODO: Action button to accept/dismiss recommendation
// TODO: Link to target bin or frog detail

export interface Recommendation {
  id: string;
  type: "next_use" | "repopulation" | "rest_complete" | "overdue_review" | "performance_review";
  targetLabel: string;
  reason: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "accepted" | "dismissed" | "expired";
}

interface RecommendationCardProps {
  recommendation: Recommendation;
  onAccept?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export default function RecommendationCard({
  recommendation,
  onAccept,
  onDismiss,
}: RecommendationCardProps) {
  const priorityColors: Record<string, string> = {
    low: "border-gray-200 bg-white",
    medium: "border-blue-200 bg-blue-50",
    high: "border-yellow-200 bg-yellow-50",
    urgent: "border-red-200 bg-red-50",
  };

  const typeLabels: Record<string, string> = {
    next_use: "Next Use",
    repopulation: "Repopulation",
    rest_complete: "Rest Complete",
    overdue_review: "Overdue Review",
    performance_review: "Performance Review",
  };

  return (
    <div
      className={`rounded-xl border p-4 ${priorityColors[recommendation.priority]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
            {typeLabels[recommendation.type]}
          </span>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            {recommendation.targetLabel}
          </h3>
        </div>
        <span className="text-xs font-medium uppercase text-gray-400">
          {recommendation.priority}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600">{recommendation.reason}</p>
      {recommendation.status === "pending" && (onAccept || onDismiss) && (
        <div className="mt-3 flex gap-2">
          {onAccept && (
            <button
              onClick={() => onAccept(recommendation.id)}
              className="rounded bg-brand-600 px-3 py-1 text-xs font-medium text-white hover:bg-brand-700"
            >
              Accept
            </button>
          )}
          {onDismiss && (
            <button
              onClick={() => onDismiss(recommendation.id)}
              className="rounded border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              Dismiss
            </button>
          )}
        </div>
      )}
    </div>
  );
}
