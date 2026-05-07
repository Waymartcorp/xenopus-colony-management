"use client";

// TODO: Fetch bins ordered by rest_complete_at ascending
// TODO: Show countdown or date for each bin
// TODO: Highlight bins completing soon (within 7 days)
// TODO: Support marking rest complete early (with confirmation)

export interface RestQueueItem {
  locationId: string;
  label: string;
  restCompleteAt: string;
  daysUntilReady: number;
  currentCount: number;
  targetCapacity: number;
  averagePerformance: number | null;
}

interface RestQueueProps {
  items: RestQueueItem[];
  onMarkComplete?: (locationId: string) => void;
}

export default function RestQueue({ items, onMarkComplete }: RestQueueProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No bins currently in rest queue.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.locationId}
          className={`flex items-center justify-between rounded-lg border p-3 ${
            item.daysUntilReady <= 7
              ? "border-green-200 bg-green-50"
              : item.daysUntilReady <= 14
                ? "border-blue-200 bg-blue-50"
                : "border-gray-200 bg-white"
          }`}
        >
          <div>
            <p className="text-sm font-medium text-gray-800">{item.label}</p>
            <p className="text-xs text-gray-500">
              {item.currentCount}/{item.targetCapacity} frogs ·{" "}
              {item.averagePerformance
                ? `${item.averagePerformance.toFixed(1)}/5`
                : "No score"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-700">
              {item.daysUntilReady <= 0
                ? "Ready now"
                : `${item.daysUntilReady}d`}
            </p>
            <p className="text-xs text-gray-400">{item.restCompleteAt}</p>
            {item.daysUntilReady <= 0 && onMarkComplete && (
              <button
                onClick={() => onMarkComplete(item.locationId)}
                className="mt-1 rounded bg-green-600 px-2 py-0.5 text-xs text-white hover:bg-green-700"
              >
                Mark Complete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
