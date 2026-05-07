"use client";

// TODO: Calculate forecast from bin_cycle_status rest_complete_at dates
// TODO: Group by time period (7d, 30d, 60d, 90d, 120d)
// TODO: Show total frogs becoming available in each period
// TODO: Show bins by forecast period

export interface ForecastPeriod {
  label: string;
  days: number;
  binsAvailable: number;
  frogsAvailable: number;
  binsOverdue: number;
}

interface FutureForecastProps {
  periods: ForecastPeriod[];
}

export default function FutureForecast({ periods }: FutureForecastProps) {
  if (periods.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No forecast data available. Log events and configure rotation settings
        to generate forecasts.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {periods.map((period) => (
        <div
          key={period.label}
          className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
        >
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {period.label}
            </p>
            <p className="text-xs text-gray-500">
              {period.binsAvailable} bins · {period.frogsAvailable} frogs
              available
            </p>
          </div>
          <div className="text-right">
            {period.binsOverdue > 0 && (
              <p className="text-xs font-medium text-red-600">
                {period.binsOverdue} overdue
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
