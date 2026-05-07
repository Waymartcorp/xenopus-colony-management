"use client";

import BinStatusCard, { type BinStatus } from "./BinStatusCard";

// TODO: Fetch bins grouped by cycle state
// TODO: Support bulk actions (log use for bin, mark rest complete, repopulate)
// TODO: Filter by rack/room, cycle state, performance
// TODO: Sort by rest_complete_at, priority, performance

interface RotationPlannerProps {
  bins: BinStatus[];
  onBinAction?: (action: string, locationId: string) => void;
}

export default function RotationPlanner({
  bins,
  onBinAction,
}: RotationPlannerProps) {
  const grouped = {
    ready: bins.filter(
      (b) =>
        b.cycleState === "ready_for_use" || b.cycleState === "rest_complete"
    ),
    resting: bins.filter(
      (b) =>
        b.cycleState === "resting" || b.cycleState === "recently_used"
    ),
    overdue: bins.filter((b) => b.cycleState === "overdue"),
    repopulate: bins.filter((b) => b.cycleState === "needs_repopulation"),
    other: bins.filter(
      (b) =>
        !["ready_for_use", "rest_complete", "resting", "recently_used", "overdue", "needs_repopulation"].includes(b.cycleState)
    ),
  };

  return (
    <div className="space-y-8">
      {grouped.ready.length > 0 && (
        <Section title="Ready for Use" count={grouped.ready.length}>
          {grouped.ready.map((bin) => (
            <BinStatusCard key={bin.locationId} bin={bin} onAction={onBinAction} />
          ))}
        </Section>
      )}
      {grouped.overdue.length > 0 && (
        <Section title="Overdue" count={grouped.overdue.length}>
          {grouped.overdue.map((bin) => (
            <BinStatusCard key={bin.locationId} bin={bin} onAction={onBinAction} />
          ))}
        </Section>
      )}
      {grouped.repopulate.length > 0 && (
        <Section title="Needs Repopulation" count={grouped.repopulate.length}>
          {grouped.repopulate.map((bin) => (
            <BinStatusCard key={bin.locationId} bin={bin} onAction={onBinAction} />
          ))}
        </Section>
      )}
      {grouped.resting.length > 0 && (
        <Section title="Resting" count={grouped.resting.length}>
          {grouped.resting.map((bin) => (
            <BinStatusCard key={bin.locationId} bin={bin} onAction={onBinAction} />
          ))}
        </Section>
      )}
      {grouped.other.length > 0 && (
        <Section title="Other" count={grouped.other.length}>
          {grouped.other.map((bin) => (
            <BinStatusCard key={bin.locationId} bin={bin} onAction={onBinAction} />
          ))}
        </Section>
      )}
      {bins.length === 0 && (
        <p className="text-sm text-gray-500">
          No bins with cycle status data. Add locations and log events to see
          rotation state.
        </p>
      )}
    </div>
  );
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-800">
        {title} ({count})
      </h3>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </div>
  );
}
