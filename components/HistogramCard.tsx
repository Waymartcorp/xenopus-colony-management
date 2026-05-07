"use client";

// TODO: Integrate charting library for proper histogram
// TODO: Configurable bin width
// TODO: Highlight current value or threshold

export interface HistogramBin {
  rangeLabel: string;
  count: number;
}

interface HistogramCardProps {
  title: string;
  subtitle?: string;
  bins: HistogramBin[];
}

export default function HistogramCard({
  title,
  subtitle,
  bins,
}: HistogramCardProps) {
  const max = Math.max(...bins.map((b) => b.count), 1);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      {bins.length > 0 ? (
        <div className="flex h-32 items-end gap-1">
          {bins.map((bin, idx) => (
            <div
              key={idx}
              className="flex flex-1 flex-col items-center justify-end"
            >
              <div
                className="w-full rounded-t bg-indigo-400"
                style={{ height: `${(bin.count / max) * 100}%` }}
              />
              <span className="mt-1 text-[8px] text-gray-400">
                {bin.rangeLabel}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-32 items-center justify-center rounded-lg bg-gray-50">
          <p className="text-xs text-gray-400">No data yet</p>
        </div>
      )}
    </div>
  );
}
