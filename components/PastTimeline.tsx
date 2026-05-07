"use client";

// TODO: Fetch events with full filter support
// TODO: Infinite scroll or pagination for large histories
// TODO: Color-code by event type
// TODO: Link to frog/bin detail views
// TODO: Show performance score inline if available

export interface TimelineEvent {
  id: string;
  eventType: string;
  eventDate: string;
  frogCode: string | null;
  locationLabel: string | null;
  notes: string | null;
  outcome: string | null;
  performanceScore: number | null;
  createdBy: string | null;
}

interface PastTimelineProps {
  events: TimelineEvent[];
}

export default function PastTimeline({ events }: PastTimelineProps) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No events match your filters.
      </p>
    );
  }

  const typeColors: Record<string, string> = {
    use: "bg-brand-500",
    extraction: "bg-brand-500",
    squeeze: "bg-brand-500",
    rest_start: "bg-blue-500",
    rest_complete: "bg-green-500",
    performance: "bg-purple-500",
    health: "bg-red-500",
    movement: "bg-gray-500",
    injection: "bg-indigo-500",
    breeding: "bg-pink-500",
    environmental_note: "bg-teal-500",
    protocol_result: "bg-amber-500",
  };

  return (
    <div className="space-y-0">
      {events.map((event, idx) => (
        <div key={event.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={`h-3 w-3 rounded-full ${typeColors[event.eventType] ?? "bg-gray-400"}`}
            />
            {idx < events.length - 1 && (
              <div className="w-px flex-1 bg-gray-200" />
            )}
          </div>
          <div className="pb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium capitalize text-gray-700">
                {event.eventType.replace(/_/g, " ")}
              </span>
              <span className="text-xs text-gray-400">{event.eventDate}</span>
              {event.performanceScore != null && (
                <span className="rounded-full bg-purple-100 px-1.5 py-0.5 text-xs font-medium text-purple-700">
                  {event.performanceScore}/5
                </span>
              )}
            </div>
            <div className="mt-1 text-sm text-gray-600">
              {event.frogCode && (
                <span className="mr-2 font-mono text-xs">{event.frogCode}</span>
              )}
              {event.locationLabel && (
                <span className="mr-2 text-xs text-gray-500">
                  @ {event.locationLabel}
                </span>
              )}
            </div>
            {event.notes && (
              <p className="mt-1 text-xs text-gray-500">{event.notes}</p>
            )}
            {event.outcome && (
              <p className="mt-0.5 text-xs font-medium text-gray-700">
                Outcome: {event.outcome}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
