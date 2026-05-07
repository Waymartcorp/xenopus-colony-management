"use client";

import { useState } from "react";
import NoticeStatusBadge from "@/components/NoticeStatusBadge";

// TODO: Calculate from rotation_settings + bin_cycle_status + forecast_settings
// TODO: Integrate full calendar UI library
// TODO: Pull scheduled events and protocol reminders
// TODO: Toggle between daily/weekly/monthly views
// TODO: Auto-generate forecast_snapshots

type ViewPeriod = "today" | "week" | "30d" | "60d" | "90d" | "120d" | "monthly";

const PERIOD_LABELS: Record<ViewPeriod, string> = {
  today: "Today",
  week: "This Week",
  "30d": "Next 30 Days",
  "60d": "Next 60 Days",
  "90d": "Next 90 Days",
  "120d": "Next 120 Days",
  monthly: "Monthly Forecast",
};

const MOCK_VIEW_DATA: Record<ViewPeriod, {
  readyFrogs: number;
  readyBins: number;
  restingFrogs: number;
  becomingReady: number;
  binsBecomingReady: number;
  needsRepopulation: number;
  expectedDemand: number;
  shortfall: number;
  bottlenecks: number;
}> = {
  today: { readyFrogs: 31, readyBins: 4, restingFrogs: 128, becomingReady: 0, binsBecomingReady: 0, needsRepopulation: 1, expectedDemand: 2, shortfall: 0, bottlenecks: 1 },
  week: { readyFrogs: 31, readyBins: 4, restingFrogs: 128, becomingReady: 15, binsBecomingReady: 2, needsRepopulation: 1, expectedDemand: 16, shortfall: 0, bottlenecks: 2 },
  "30d": { readyFrogs: 48, readyBins: 6, restingFrogs: 112, becomingReady: 48, binsBecomingReady: 5, needsRepopulation: 2, expectedDemand: 64, shortfall: 16, bottlenecks: 3 },
  "60d": { readyFrogs: 72, readyBins: 9, restingFrogs: 88, becomingReady: 72, binsBecomingReady: 8, needsRepopulation: 3, expectedDemand: 128, shortfall: 24, bottlenecks: 3 },
  "90d": { readyFrogs: 96, readyBins: 12, restingFrogs: 64, becomingReady: 96, binsBecomingReady: 11, needsRepopulation: 3, expectedDemand: 192, shortfall: 32, bottlenecks: 4 },
  "120d": { readyFrogs: 112, readyBins: 14, restingFrogs: 48, becomingReady: 112, binsBecomingReady: 14, needsRepopulation: 4, expectedDemand: 256, shortfall: 48, bottlenecks: 5 },
  monthly: { readyFrogs: 48, readyBins: 6, restingFrogs: 112, becomingReady: 48, binsBecomingReady: 5, needsRepopulation: 2, expectedDemand: 64, shortfall: 16, bottlenecks: 3 },
};

const MOCK_TIMELINE = [
  { date: "May 7", label: "Today", items: ["Rack 1 / Bin 8 — rest complete, ready for use", "2 performance notes due"] },
  { date: "May 8", label: "Tomorrow", items: ["Rack 4 / Bin 2 — rest complete"] },
  { date: "May 10", label: "Sat", items: ["Rack 2 / Bin 1 — rest complete"] },
  { date: "May 12", label: "Mon", items: ["Performance notes due: Rack 1 / Bin 6 (batch #34)"] },
  { date: "May 15", label: "Thu", items: ["Rack 3 / Bin 1 — overdue 150 days"] },
  { date: "May 21", label: "Wed", items: ["Repopulation: GP Tank 1 → Rack 2 / Bin 3 (suggested)"] },
  { date: "May 28", label: "Wed", items: ["Rack 2 / Bin 2 — rest complete"] },
  { date: "Jun 5", label: "Thu", items: ["Rack 1 / Bin 7 — approaching rest window"] },
  { date: "Jun 13", label: "Fri", items: ["Rack 2 / Bin 7 — rest complete"] },
  { date: "Jun 20", label: "Fri", items: ["Rack 2 / Bin 6 — rest complete"] },
  { date: "Jun 30", label: "Mon", items: ["Rack 2 / Bin 4 — rest complete"] },
  { date: "Jul 8", label: "Tue", items: ["Rack 1 / Bin 3 — rest complete"] },
];

const MOCK_MONTHLY = [
  { month: "May 2026", ready: 4, becoming: 5, demand: 8, surplus: 1, bottlenecks: 2 },
  { month: "Jun 2026", ready: 6, becoming: 6, demand: 8, surplus: -2, bottlenecks: 3 },
  { month: "Jul 2026", ready: 5, becoming: 5, demand: 8, surplus: -3, bottlenecks: 4 },
  { month: "Aug 2026", ready: 4, becoming: 4, demand: 8, surplus: -4, bottlenecks: 4 },
];

export default function ForecastPage() {
  const [view, setView] = useState<ViewPeriod>("30d");
  const data = MOCK_VIEW_DATA[view];

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Colony Forecast
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            When will frogs be ready? Are we using them faster than they
            recover?
          </p>
        </div>
        <div className="flex gap-2">
          <a href="/capacity" className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50">
            Run-Out Risk
          </a>
          <a href="/bottlenecks" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Bottlenecks
          </a>
        </div>
      </div>

      {/* Period Toggle */}
      <div className="mt-6 flex flex-wrap gap-1 rounded-lg bg-gray-100 p-1">
        {(Object.keys(PERIOD_LABELS) as ViewPeriod[]).map((key) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              view === key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {PERIOD_LABELS[key]}
          </button>
        ))}
      </div>

      {/* Forecast Stats */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <ForecastStat label="Ready Frogs" value={data.readyFrogs} />
        <ForecastStat label="Ready Bins" value={data.readyBins} />
        <ForecastStat label="Becoming Ready" value={data.becomingReady} positive />
        <ForecastStat label="Expected Demand" value={data.expectedDemand} />
        <ForecastStat
          label={data.shortfall > 0 ? "Projected Shortfall" : "Surplus"}
          value={data.shortfall > 0 ? data.shortfall : data.readyFrogs - data.expectedDemand + data.becomingReady}
          negative={data.shortfall > 0}
        />
      </div>

      {/* Secondary stats */}
      <div className="mt-3 grid gap-3 sm:grid-cols-4">
        <MiniStat label="Resting frogs" value={data.restingFrogs} />
        <MiniStat label="Bins becoming ready" value={data.binsBecomingReady} />
        <MiniStat label="Need repopulation" value={data.needsRepopulation} />
        <MiniStat label="Bottlenecks" value={data.bottlenecks} alert={data.bottlenecks > 2} />
      </div>

      {/* Monthly forecast (if selected) */}
      {view === "monthly" && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800">
            Monthly Colony Capacity
          </h2>
          <div className="mt-3 overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  <th className="px-4 py-3">Month</th>
                  <th className="px-4 py-3">Ready Bins</th>
                  <th className="px-4 py-3">Becoming Ready</th>
                  <th className="px-4 py-3">Expected Demand</th>
                  <th className="px-4 py-3">Surplus/Shortfall</th>
                  <th className="px-4 py-3">Bottlenecks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_MONTHLY.map((row) => (
                  <tr key={row.month} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{row.month}</td>
                    <td className="px-4 py-3">{row.ready}</td>
                    <td className="px-4 py-3 text-green-600">+{row.becoming}</td>
                    <td className="px-4 py-3">{row.demand}</td>
                    <td className={`px-4 py-3 font-semibold ${row.surplus >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {row.surplus >= 0 ? `+${row.surplus}` : row.surplus}
                    </td>
                    <td className="px-4 py-3">{row.bottlenecks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Timeline */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Upcoming Events Timeline
        </h2>
        <div className="mt-3 space-y-1">
          {MOCK_TIMELINE.map((day, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 rounded-lg border border-gray-100 bg-white px-4 py-3 hover:bg-gray-50"
            >
              <div className="w-20 flex-shrink-0">
                <p className="text-xs font-semibold text-gray-700">{day.date}</p>
                <p className="text-xs text-gray-400">{day.label}</p>
              </div>
              <div className="space-y-1">
                {day.items.map((item, i) => (
                  <p key={i} className="text-sm text-gray-600">{item}</p>
                ))}
              </div>
              <span className="ml-auto">
                <NoticeStatusBadge status="not_sent" />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Chart Placeholders */}
      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6">
          <p className="text-sm font-semibold text-gray-700">Ready Frogs Over Time</p>
          <p className="mt-2 text-xs text-gray-400">
            Line chart: projected ready frog count vs. threshold, with run-out date marked
          </p>
        </div>
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6">
          <p className="text-sm font-semibold text-gray-700">Supply vs. Demand</p>
          <p className="mt-2 text-xs text-gray-400">
            Area chart: cumulative availability vs. cumulative demand over 120 days
          </p>
        </div>
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6">
          <p className="text-sm font-semibold text-gray-700">Monthly Capacity Forecast</p>
          <p className="mt-2 text-xs text-gray-400">
            Stacked bar: ready/resting/repopulation bins per month for the next 6 months
          </p>
        </div>
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6">
          <p className="text-sm font-semibold text-gray-700">Repopulation Demand</p>
          <p className="mt-2 text-xs text-gray-400">
            Bar chart: frogs needed per month to maintain sustainability
          </p>
        </div>
      </section>
    </div>
  );
}

function ForecastStat({
  label,
  value,
  positive = false,
  negative = false,
}: {
  label: string;
  value: number;
  positive?: boolean;
  negative?: boolean;
}) {
  const color = negative ? "text-red-700" : positive ? "text-green-700" : "text-gray-900";
  const bg = negative ? "border-red-200 bg-red-50" : positive ? "border-green-200 bg-green-50" : "border-gray-200 bg-white";
  return (
    <div className={`rounded-xl border p-4 ${bg}`}>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${color}`}>
        {positive && value > 0 ? "+" : ""}{negative ? `-${value}` : value}
      </p>
    </div>
  );
}

function MiniStat({ label, value, alert = false }: { label: string; value: number; alert?: boolean }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-lg font-bold ${alert ? "text-red-600" : "text-gray-800"}`}>{value}</p>
    </div>
  );
}
