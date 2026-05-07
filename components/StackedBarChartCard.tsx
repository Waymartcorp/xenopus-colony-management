"use client";

// TODO: Integrate charting library for proper stacked bars
// TODO: Legend for each segment
// TODO: Tooltip with segment values

export interface StackedBarSegment {
  label: string;
  color: string;
  value: number;
}

export interface StackedBarGroup {
  groupLabel: string;
  segments: StackedBarSegment[];
}

interface StackedBarChartCardProps {
  title: string;
  subtitle?: string;
  groups: StackedBarGroup[];
}

export default function StackedBarChartCard({
  title,
  subtitle,
  groups,
}: StackedBarChartCardProps) {
  const maxTotal = Math.max(
    ...groups.map((g) => g.segments.reduce((sum, s) => sum + s.value, 0)),
    1
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      {groups.length > 0 ? (
        <div className="space-y-2">
          {groups.map((group, idx) => {
            const total = group.segments.reduce((s, seg) => s + seg.value, 0);
            return (
              <div key={idx} className="flex items-center gap-3">
                <span className="w-16 truncate text-xs text-gray-600">
                  {group.groupLabel}
                </span>
                <div className="flex flex-1 overflow-hidden rounded">
                  {group.segments.map((seg, si) => (
                    <div
                      key={si}
                      className="h-5"
                      style={{
                        width: `${(seg.value / maxTotal) * 100}%`,
                        backgroundColor: seg.color,
                      }}
                      title={`${seg.label}: ${seg.value}`}
                    />
                  ))}
                </div>
                <span className="w-8 text-right text-xs text-gray-500">
                  {total}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex h-32 items-center justify-center rounded-lg bg-gray-50">
          <p className="text-xs text-gray-400">No data yet</p>
        </div>
      )}
    </div>
  );
}
