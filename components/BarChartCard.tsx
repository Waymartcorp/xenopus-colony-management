"use client";

// TODO: Integrate charting library (Recharts, Chart.js, or Nivo)
// TODO: Horizontal or vertical bar orientation
// TODO: Color per category
// TODO: Tooltip support

export interface BarDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface BarChartCardProps {
  title: string;
  subtitle?: string;
  data: BarDataPoint[];
}

export default function BarChartCard({
  title,
  subtitle,
  data,
}: BarChartCardProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      {data.length > 0 ? (
        <div className="space-y-2">
          {data.map((point, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="w-20 truncate text-xs text-gray-600">
                {point.label}
              </span>
              <div className="flex-1">
                <div
                  className="h-5 rounded bg-brand-400"
                  style={{ width: `${(point.value / max) * 100}%` }}
                />
              </div>
              <span className="w-8 text-right text-xs font-medium text-gray-700">
                {point.value}
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
