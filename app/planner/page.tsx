"use client";

import { useState, useMemo } from "react";

export default function PlannerPage() {
  const [totalBins, setTotalBins] = useState("30");
  const [frogsPerBin, setFrogsPerBin] = useState("6");
  const [frogsUsedPerWeek, setFrogsUsedPerWeek] = useState("12");
  const [restPeriodDays, setRestPeriodDays] = useState("90");
  const [acclimationDays, setAcclimationDays] = useState("14");
  const [safetyBuffer, setSafetyBuffer] = useState("2");
  const [repopIntervalWeeks, setRepopIntervalWeeks] = useState("26");

  const calc = useMemo(() => {
    const bins = parseInt(totalBins) || 0;
    const fpb = parseInt(frogsPerBin) || 6;
    const usedPerWeek = parseInt(frogsUsedPerWeek) || 0;
    const restDays = parseInt(restPeriodDays) || 90;
    const buffer = parseInt(safetyBuffer) || 2;
    const repopWeeks = parseInt(repopIntervalWeeks) || 26;

    if (bins === 0 || usedPerWeek === 0) return null;

    const binsUsedPerWeek = Math.ceil(usedPerWeek / fpb);
    const restWeeks = Math.ceil(restDays / 7);

    // How many bins are "in rest" at any given time = bins used per week * rest period in weeks
    const binsInRest = binsUsedPerWeek * restWeeks;
    const recommendedOpenBins = binsInRest + buffer;
    const recommendedPopulatedBins = bins - recommendedOpenBins;

    const sustainableFrogsPerWeek = recommendedPopulatedBins > 0
      ? recommendedPopulatedBins * fpb / restWeeks
      : 0;

    const totalCapacity = bins * fpb;
    const startingFrogs = recommendedPopulatedBins * fpb;

    // Weeks until rest-bin shortage if all populated bins are used linearly
    const weeksUntilShortage = recommendedOpenBins > 0
      ? Math.floor(recommendedOpenBins / binsUsedPerWeek)
      : 0;

    // Repopulation estimate
    const frogsUsedBeforeRepop = usedPerWeek * repopWeeks;
    const needsRepop = frogsUsedBeforeRepop > startingFrogs;
    const weeksUntilRunout = startingFrogs > 0 ? Math.floor(startingFrogs / usedPerWeek) : 0;

    // Risk level
    let riskLevel: "low" | "medium" | "high" = "low";
    if (recommendedOpenBins > bins) riskLevel = "high";
    else if (recommendedOpenBins > bins * 0.7) riskLevel = "high";
    else if (recommendedOpenBins > bins * 0.5) riskLevel = "medium";

    const hasBottleneck = recommendedPopulatedBins < 1 || recommendedOpenBins > bins;

    return {
      bins,
      fpb,
      binsUsedPerWeek,
      restWeeks,
      binsInRest,
      recommendedOpenBins,
      recommendedPopulatedBins,
      sustainableFrogsPerWeek: Math.round(sustainableFrogsPerWeek * 10) / 10,
      totalCapacity,
      startingFrogs,
      weeksUntilShortage,
      weeksUntilRunout,
      needsRepop,
      riskLevel,
      hasBottleneck,
    };
  }, [totalBins, frogsPerBin, frogsUsedPerWeek, restPeriodDays, safetyBuffer, repopIntervalWeeks]);

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-header">Use Cycle Planner</h1>
          <p className="page-subtitle">Calculate how many bins to keep open based on your expected use rate.</p>
        </div>
        <a href="/settings" className="btn-secondary text-xs">Back to Settings</a>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Input panel */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-gray-800">Colony Parameters</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <PlannerInput label="Total bins" value={totalBins} onChange={setTotalBins} unit="bins" />
              <PlannerInput label="Target frogs per bin" value={frogsPerBin} onChange={setFrogsPerBin} unit="frogs" />
              <PlannerInput label="Frogs used per week" value={frogsUsedPerWeek} onChange={setFrogsUsedPerWeek} unit="frogs/wk" />
              <PlannerInput label="Rest period" value={restPeriodDays} onChange={setRestPeriodDays} unit="days" />
              <PlannerInput label="Acclimation period" value={acclimationDays} onChange={setAcclimationDays} unit="days" />
              <PlannerInput label="Safety buffer (extra bins)" value={safetyBuffer} onChange={setSafetyBuffer} unit="bins" />
              <PlannerInput label="Repopulation interval" value={repopIntervalWeeks} onChange={setRepopIntervalWeeks} unit="weeks" />
            </div>
          </div>

          {/* Flow diagram */}
          <div className="card overflow-hidden p-6">
            <h2 className="text-sm font-semibold text-gray-800">Bin Cycling Flow</h2>
            <div className="mt-4 flex items-center justify-between gap-2">
              <FlowNode label="Populated" sublabel={`${calc?.recommendedPopulatedBins ?? "—"} bins`} color="blue" />
              <FlowArrow label="Use" />
              <FlowNode label="In Rest" sublabel={`${calc?.binsInRest ?? "—"} bins`} color="amber" />
              <FlowArrow label={`${calc?.restWeeks ?? "—"} wks`} />
              <FlowNode label="Ready" sublabel="Return" color="green" />
            </div>
            <div className="mt-3 flex justify-center">
              <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-500">
                <span>↺</span>
                <span>Continuous rotation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results panel */}
        <div className="space-y-4">
          {calc && (
            <>
              {/* Risk badge */}
              <div className={`rounded-xl border p-5 ${
                calc.riskLevel === "low" ? "border-green-200 bg-green-50/60" :
                calc.riskLevel === "medium" ? "border-yellow-200 bg-yellow-50/60" :
                "border-red-200 bg-red-50/60"
              }`}>
                <div className="flex items-center gap-3">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    calc.riskLevel === "low" ? "bg-green-200 text-green-700" :
                    calc.riskLevel === "medium" ? "bg-yellow-200 text-yellow-700" :
                    "bg-red-200 text-red-700"
                  }`}>
                    {calc.riskLevel === "low" ? "✓" : calc.riskLevel === "medium" ? "!" : "✕"}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Risk: {calc.riskLevel === "low" ? "Low" : calc.riskLevel === "medium" ? "Medium" : "High"}
                    </p>
                    <p className="text-xs text-gray-600">
                      {calc.riskLevel === "low"
                        ? "This configuration is sustainable for the given use rate."
                        : calc.riskLevel === "medium"
                        ? "This may create rest-bin pressure under heavy use."
                        : "Not enough bins to support this use rate and rest period."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-gray-800">Recommendations</h3>
                <div className="mt-3 space-y-3">
                  <ResultRow label="Recommended populated bins" value={`${Math.max(0, calc.recommendedPopulatedBins)}`} />
                  <ResultRow label="Recommended open/rest bins" value={`${calc.recommendedOpenBins}`} highlight />
                  <ResultRow label="Bins cycling through rest at any time" value={`${calc.binsInRest}`} />
                  <ResultRow label="Sustainable frogs/week" value={`~${calc.sustainableFrogsPerWeek}`} />
                </div>
              </div>

              {/* Capacity summary */}
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-gray-800">Capacity &amp; Ordering</h3>
                <div className="mt-3 space-y-3">
                  <ResultRow label="Total bin capacity" value={`${calc.totalCapacity} frogs`} />
                  <ResultRow label="Recommended starting frogs" value={`${Math.max(0, calc.startingFrogs)}`} />
                  <ResultRow label="Weeks until frog run-out" value={calc.weeksUntilRunout > 100 ? "100+" : `~${calc.weeksUntilRunout} weeks`} />
                  <ResultRow label="Needs repopulation before interval?" value={calc.needsRepop ? "Yes" : "No"} highlight={calc.needsRepop} />
                </div>
              </div>

              {/* Warnings */}
              {calc.hasBottleneck && (
                <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
                  <strong>Warning:</strong> This setup leaves insufficient open bins for rest/receiving.
                  Used frogs may have nowhere to go after use. Consider reducing the starting population,
                  increasing total bins, or lowering the expected weekly use.
                </div>
              )}

              {calc.recommendedPopulatedBins > 0 && calc.recommendedOpenBins <= (parseInt(safetyBuffer) || 2) && (
                <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
                  <strong>Tight margin:</strong> Only {calc.recommendedOpenBins} bins available for rest.
                  Any increase in use rate could create a bottleneck.
                </div>
              )}

              {/* Natural language summary */}
              <div className="card border-l-4 border-brand-400 p-5">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Based on a <strong>{restPeriodDays}-day rest period</strong> and an expected use rate of{" "}
                  <strong>{frogsUsedPerWeek} frogs/week</strong> (~{calc.binsUsedPerWeek} bins/week),
                  XenoTrack recommends keeping approximately <strong>{calc.recommendedOpenBins} bins open</strong> for rest/receiving
                  and populating <strong>{Math.max(0, calc.recommendedPopulatedBins)} bins</strong> with frogs.
                  {calc.weeksUntilRunout < 52 && (
                    <> At this rate, you may need to repopulate in approximately <strong>{calc.weeksUntilRunout} weeks</strong>.</>
                  )}
                </p>
              </div>
            </>
          )}

          {!calc && (
            <div className="card p-8 text-center">
              <p className="text-sm text-gray-500">Enter your colony parameters to see recommendations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PlannerInput({ label, value, onChange, unit }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600">{label}</label>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min="0"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <span className="whitespace-nowrap text-xs text-gray-400">{unit}</span>
      </div>
    </div>
  );
}

function ResultRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-600">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? "text-brand-600" : "text-gray-900"}`}>{value}</span>
    </div>
  );
}

function FlowNode({ label, sublabel, color }: { label: string; sublabel: string; color: "blue" | "amber" | "green" }) {
  const styles = {
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    green: "border-green-200 bg-green-50 text-green-700",
  };
  return (
    <div className={`flex flex-col items-center rounded-xl border px-4 py-3 ${styles[color]}`}>
      <span className="text-xs font-bold">{label}</span>
      <span className="mt-0.5 text-[10px] opacity-70">{sublabel}</span>
    </div>
  );
}

function FlowArrow({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-gray-300">→</span>
      <span className="text-[9px] text-gray-400">{label}</span>
    </div>
  );
}
