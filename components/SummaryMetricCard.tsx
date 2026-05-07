"use client";

// TODO: Accept trend indicator (up/down/stable)
// TODO: Optional sparkline mini-chart
// TODO: Color based on threshold (good/warning/bad)

interface SummaryMetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "stable" | null;
  trendLabel?: string;
  variant?: "default" | "success" | "warning" | "danger";
}

export default function SummaryMetricCard({
  label,
  value,
  subtitle,
  trend,
  trendLabel,
  variant = "default",
}: SummaryMetricCardProps) {
  const variants: Record<string, string> = {
    default: "border-gray-200 bg-white",
    success: "border-green-200 bg-green-50",
    warning: "border-yellow-200 bg-yellow-50",
    danger: "border-red-200 bg-red-50",
  };

  const trendColors: Record<string, string> = {
    up: "text-green-600",
    down: "text-red-600",
    stable: "text-gray-500",
  };

  const trendIcons: Record<string, string> = {
    up: "↑",
    down: "↓",
    stable: "→",
  };

  return (
    <div
      className={`rounded-xl border p-5 shadow-sm ${variants[variant]}`}
    >
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      <div className="mt-1 flex items-center gap-2">
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        {trend && (
          <span className={`text-xs font-medium ${trendColors[trend]}`}>
            {trendIcons[trend]} {trendLabel}
          </span>
        )}
      </div>
    </div>
  );
}
