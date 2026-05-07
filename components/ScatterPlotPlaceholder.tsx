"use client";

// TODO: Integrate charting library for proper scatter plot
// TODO: X/Y axis labels
// TODO: Point color by category
// TODO: Trend line option

interface ScatterPlotPlaceholderProps {
  title: string;
  subtitle?: string;
  xLabel?: string;
  yLabel?: string;
}

export default function ScatterPlotPlaceholder({
  title,
  subtitle,
  xLabel = "X axis",
  yLabel = "Y axis",
}: ScatterPlotPlaceholderProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      <div className="relative flex h-40 items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50">
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] text-gray-400">
          {xLabel}
        </div>
        <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] text-gray-400">
          {yLabel}
        </div>
        <p className="text-xs text-gray-400">Scatter plot placeholder</p>
      </div>
    </div>
  );
}
