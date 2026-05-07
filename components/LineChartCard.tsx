"use client";

// TODO: Integrate charting library (Recharts, Chart.js, or Nivo)
// TODO: Accept data series as props
// TODO: Responsive container
// TODO: Tooltip and legend support
// TODO: Export chart as image (future)

export interface DataPoint {
  label: string;
  value: number;
}

interface LineChartCardProps {
  title: string;
  subtitle?: string;
  data: DataPoint[];
  yLabel?: string;
  color?: string;
}

export default function LineChartCard({
  title,
  subtitle,
  data,
  yLabel,
}: LineChartCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      {data.length > 0 ? (
        <div className="flex h-40 items-end gap-1">
          {/* TODO: Replace with actual chart rendering */}
          {data.map((point, idx) => {
            const max = Math.max(...data.map((d) => d.value), 1);
            const height = (point.value / max) * 100;
            return (
              <div
                key={idx}
                className="flex flex-1 flex-col items-center justify-end"
              >
                <div
                  className="w-full rounded-t bg-brand-400"
                  style={{ height: `${height}%` }}
                />
                <span className="mt-1 text-[9px] text-gray-400">
                  {point.label}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-lg bg-gray-50">
          <p className="text-xs text-gray-400">
            No data yet{yLabel ? ` (${yLabel})` : ""}
          </p>
        </div>
      )}
    </div>
  );
}
