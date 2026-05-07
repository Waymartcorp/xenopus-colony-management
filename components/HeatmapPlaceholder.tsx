"use client";

// TODO: Integrate charting library for proper heatmap
// TODO: Rows = categories (months, bins, frogs), Cols = time periods
// TODO: Color intensity based on value
// TODO: Tooltip showing exact value

interface HeatmapPlaceholderProps {
  title: string;
  subtitle?: string;
  rows?: string[];
  cols?: string[];
}

export default function HeatmapPlaceholder({
  title,
  subtitle,
  rows = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  cols = ["2024", "2025", "2026"],
}: HeatmapPlaceholderProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="w-12" />
              {cols.map((col) => (
                <th
                  key={col}
                  className="px-1 text-center text-[9px] text-gray-400"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row}>
                <td className="pr-2 text-right text-[9px] text-gray-500">
                  {row}
                </td>
                {cols.map((col) => (
                  <td key={col} className="p-0.5">
                    <div className="h-4 w-full rounded-sm bg-gray-100" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-center text-[10px] text-gray-400">
        Heatmap data will populate with logged performance ratings
      </p>
    </div>
  );
}
