"use client";

// TODO: Fetch eligible bins (available capacity, no health warnings, compatible)
// TODO: Fetch eligible frogs (active, not resting, no health warnings, meets rest interval)
// TODO: Apply repopulation-rules engine to generate recommendations
// TODO: Show recommended/avoid bins with reasons
// TODO: Confirm movement action and log events

export interface BinRecommendation {
  locationId: string;
  label: string;
  availableCapacity: number;
  reason: string;
  recommended: boolean;
}

export interface FrogCandidate {
  frogId: string;
  publicCode: string;
  sex: string | null;
  sizeClass: string | null;
  daysSinceLastUse: number;
  eligible: boolean;
  reason?: string;
}

interface RepopulationPlannerProps {
  bins: BinRecommendation[];
  frogCandidates: FrogCandidate[];
  onConfirmMove: (frogIds: string[], targetLocationId: string) => void;
}

export default function RepopulationPlanner({
  bins,
  frogCandidates,
  onConfirmMove,
}: RepopulationPlannerProps) {
  const recommended = bins.filter((b) => b.recommended);
  const avoid = bins.filter((b) => !b.recommended);
  const eligible = frogCandidates.filter((f) => f.eligible);

  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-sm font-semibold text-green-800">
          Recommended Bins ({recommended.length})
        </h3>
        {recommended.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {recommended.map((bin) => (
              <li
                key={bin.locationId}
                className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm"
              >
                <span className="font-medium">{bin.label}</span>
                <span className="ml-2 text-gray-600">
                  — {bin.availableCapacity} spots available
                </span>
                <p className="mt-1 text-xs text-green-700">{bin.reason}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-gray-500">
            No bins currently recommended.
          </p>
        )}
      </section>

      <section>
        <h3 className="text-sm font-semibold text-red-800">
          Avoid ({avoid.length})
        </h3>
        {avoid.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {avoid.map((bin) => (
              <li
                key={bin.locationId}
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm"
              >
                <span className="font-medium">{bin.label}</span>
                <p className="mt-1 text-xs text-red-700">{bin.reason}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-gray-500">No bins flagged.</p>
        )}
      </section>

      <section>
        <h3 className="text-sm font-semibold text-gray-800">
          Eligible Frogs ({eligible.length})
        </h3>
        {eligible.length > 0 ? (
          <ul className="mt-2 space-y-1">
            {eligible.map((frog) => (
              <li
                key={frog.frogId}
                className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-2 text-sm"
              >
                <span className="font-mono">{frog.publicCode}</span>
                <span className="text-xs text-gray-500">
                  {frog.daysSinceLastUse}d since last use
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-gray-500">
            No frogs currently eligible.
          </p>
        )}
      </section>

      <button
        onClick={() => {
          // TODO: Open confirmation modal with selected frogs and target bin
          const frogIds = eligible.map((f) => f.frogId);
          const target = recommended[0]?.locationId;
          if (frogIds.length && target) {
            onConfirmMove(frogIds, target);
          }
        }}
        disabled={eligible.length === 0 || recommended.length === 0}
        className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
      >
        Confirm Movement Plan
      </button>
    </div>
  );
}
