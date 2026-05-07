"use client";

// TODO: Link to frog detail page
// TODO: Show most recent photo thumbnail if available
// TODO: Show last event date and type
// TODO: Quick-action buttons (log event, move, view history)

interface FrogCardProps {
  id: string;
  publicCode: string;
  localId?: string | null;
  sex?: string | null;
  sizeClass?: string | null;
  status: string;
  locationLabel?: string | null;
  thumbnailUrl?: string | null;
  lastEventDate?: string | null;
}

export default function FrogCard({
  publicCode,
  localId,
  sex,
  sizeClass,
  status,
  locationLabel,
  thumbnailUrl,
  lastEventDate,
}: FrogCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
          {thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnailUrl}
              alt={`Photo of ${publicCode}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl text-gray-300">
              🐸
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-mono text-sm font-semibold">{publicCode}</h3>
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                status === "active"
                  ? "bg-green-100 text-green-800"
                  : status === "resting"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
              }`}
            >
              {status}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {[sex, sizeClass, localId].filter(Boolean).join(" · ") ||
              "No details"}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {locationLabel ?? "No location"} ·{" "}
            {lastEventDate ? `Last event: ${lastEventDate}` : "No events"}
          </p>
        </div>
      </div>
    </div>
  );
}
