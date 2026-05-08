"use client";

import { useEffect, useState, useMemo } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";

interface ColonySnapshot {
  totalFrogs: number;
  activeFrogs: number;
  restingFrogs: number;
  readyFrogs: number;
  overdueFrogs: number;
  totalBins: number;
  populatedBins: number;
  openBins: number;
  restingBins: number;
  totalCapacity: number;
  restDays: number;
  groupingWindow: number;
  minOpenBins: number;
}

interface UsageStats {
  last7: number;
  last30: number;
  last60: number;
  last90: number;
  avgPerWeek: number;
  avgBinsPerWeek: number;
  trend: "increasing" | "stable" | "decreasing" | "insufficient";
}

type Tab = "stock" | "usage" | "ordering" | "scenario" | "ask" | "reality";

export default function CalculatorPage() {
  const [tab, setTab] = useState<Tab>("stock");
  const [snapshot, setSnapshot] = useState<ColonySnapshot | null>(null);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createBrowserSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: mem } = await supabase
        .from("organization_memberships")
        .select("organization_id")
        .eq("user_id", user.id)
        .limit(1)
        .single();
      if (!mem) { setLoading(false); return; }
      const orgId = mem.organization_id;

      // Rotation settings
      const { data: rot } = await supabase
        .from("rotation_settings")
        .select("minimum_rest_days, rest_bin_grouping_window_days, minimum_open_rest_bins, default_target_bin_capacity")
        .eq("organization_id", orgId)
        .limit(1)
        .single();

      const restDays = rot?.minimum_rest_days ?? 90;
      const groupingWindow = rot?.rest_bin_grouping_window_days ?? 2;
      const minOpenBins = rot?.minimum_open_rest_bins ?? 10;
      const defaultCap = rot?.default_target_bin_capacity ?? 8;

      // Bins
      const { data: locs } = await supabase
        .from("locations")
        .select("id, label, capacity, status, notes")
        .eq("organization_id", orgId);

      const bins = locs ?? [];
      let totalCap = 0;
      let populatedBins = 0;
      let openBins = 0;
      let restingBins = 0;

      const binFrogCounts: Record<string, number> = {};
      for (const loc of bins) {
        totalCap += loc.capacity ?? defaultCap;
        const { count } = await supabase
          .from("frogs")
          .select("*", { count: "exact", head: true })
          .eq("current_location_id", loc.id);
        const fc = count ?? 0;
        binFrogCounts[loc.id] = fc;
        if (fc > 0) populatedBins++;
        if (loc.notes === "open_for_receiving" || (fc === 0 && loc.status === "active")) openBins++;
      }

      // Frogs
      const { data: allFrogs } = await supabase
        .from("frogs")
        .select("id, status")
        .eq("organization_id", orgId);

      const frogs = allFrogs ?? [];
      const totalFrogs = frogs.length;
      const activeFrogs = frogs.filter((f) => f.status === "active" || !f.status).length;
      const restingFrogs = frogs.filter((f) => f.status === "resting").length;
      const readyFrogs = frogs.filter((f) => f.status === "ready").length;
      const overdueFrogs = frogs.filter((f) => f.status === "overdue").length;

      setSnapshot({
        totalFrogs,
        activeFrogs,
        restingFrogs,
        readyFrogs,
        overdueFrogs,
        totalBins: bins.length,
        populatedBins,
        openBins,
        restingBins,
        totalCapacity: totalCap,
        restDays,
        groupingWindow,
        minOpenBins,
      });

      // Usage stats from bin_transfer_events
      const now = new Date();
      const d90 = new Date(now); d90.setDate(d90.getDate() - 90);

      const { data: transfers } = await supabase
        .from("bin_transfer_events")
        .select("frog_count, use_date")
        .eq("organization_id", orgId)
        .gte("use_date", d90.toISOString().split("T")[0])
        .order("use_date", { ascending: true });

      if (transfers && transfers.length > 0) {
        const d7 = new Date(now); d7.setDate(d7.getDate() - 7);
        const d30 = new Date(now); d30.setDate(d30.getDate() - 30);
        const d60 = new Date(now); d60.setDate(d60.getDate() - 60);

        const last7 = transfers.filter((t) => t.use_date >= d7.toISOString().split("T")[0]).reduce((s, t) => s + t.frog_count, 0);
        const last30 = transfers.filter((t) => t.use_date >= d30.toISOString().split("T")[0]).reduce((s, t) => s + t.frog_count, 0);
        const last60 = transfers.filter((t) => t.use_date >= d60.toISOString().split("T")[0]).reduce((s, t) => s + t.frog_count, 0);
        const last90 = transfers.reduce((s, t) => s + t.frog_count, 0);

        const weeksOfData = Math.max(1, Math.ceil((now.getTime() - new Date(transfers[0].use_date).getTime()) / (7 * 86400000)));
        const avgPerWeek = Math.round((last90 / Math.min(weeksOfData, 13)) * 10) / 10;

        const events30 = transfers.filter((t) => t.use_date >= d30.toISOString().split("T")[0]).length;
        const avgBinsPerWeek = Math.round((events30 / Math.min(4, weeksOfData)) * 10) / 10;

        // Trend: compare first half vs second half
        const mid = transfers[Math.floor(transfers.length / 2)]?.use_date ?? "";
        const firstHalf = transfers.filter((t) => t.use_date < mid).reduce((s, t) => s + t.frog_count, 0);
        const secondHalf = transfers.filter((t) => t.use_date >= mid).reduce((s, t) => s + t.frog_count, 0);
        let trend: "increasing" | "stable" | "decreasing" = "stable";
        if (secondHalf > firstHalf * 1.2) trend = "increasing";
        else if (secondHalf < firstHalf * 0.8) trend = "decreasing";

        setUsage({ last7, last30, last60, last90, avgPerWeek, avgBinsPerWeek, trend });
      } else {
        setUsage({ last7: 0, last30: 0, last60: 0, last90: 0, avgPerWeek: 0, avgBinsPerWeek: 0, trend: "insufficient" });
      }

      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="p-6"><p className="text-sm text-gray-500">Loading colony data...</p></div>;
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "stock", label: "Frog Stock", icon: "●" },
    { key: "usage", label: "Usage Rate", icon: "↻" },
    { key: "ordering", label: "Ordering Advisor", icon: "⊕" },
    { key: "scenario", label: "Scenario", icon: "⊞" },
    { key: "reality", label: "Reality Check", icon: "◎" },
    { key: "ask", label: "Ask XenoTrack", icon: "?" },
  ];

  return (
    <div className="p-6 lg:p-10">
      <h1 className="page-header">Colony Calculator</h1>
      <p className="page-subtitle">Replace guesswork with real numbers. Stock, usage, ordering capacity, and colony sustainability.</p>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              tab === t.key
                ? "bg-white text-brand-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="text-xs opacity-60">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "stock" && <StockPanel snapshot={snapshot} />}
        {tab === "usage" && <UsagePanel usage={usage} />}
        {tab === "ordering" && <OrderingPanel snapshot={snapshot} usage={usage} />}
        {tab === "scenario" && <ScenarioPanel snapshot={snapshot} />}
        {tab === "reality" && <RealityCheckPanel snapshot={snapshot} usage={usage} />}
        {tab === "ask" && <AskPanel snapshot={snapshot} usage={usage} />}
      </div>
    </div>
  );
}

// ─── Stock Panel ──────────────────────────────────────────────────────────

function StockPanel({ snapshot }: { snapshot: ColonySnapshot | null }) {
  if (!snapshot) {
    return <EmptyCalc message="No colony data yet. Set up bins and add frogs to see your stock summary." />;
  }

  if (snapshot.totalBins === 0) {
    return <EmptyCalc message="No bins configured. Complete onboarding to see your colony stock." />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total Frogs" value={snapshot.totalFrogs} icon="●" color="brand" />
        <MetricCard label="Active / Available" value={snapshot.activeFrogs} icon="✓" color="green" />
        <MetricCard label="Resting" value={snapshot.restingFrogs} icon="◷" color="blue" />
        <MetricCard label="Ready After Rest" value={snapshot.readyFrogs} icon="↺" color="emerald" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total Bins" value={snapshot.totalBins} icon="◫" color="neutral" />
        <MetricCard label="Populated Bins" value={snapshot.populatedBins} icon="■" color="blue" />
        <MetricCard label="Open / Receiving" value={snapshot.openBins} icon="□" color="green" />
        <MetricCard label="Total Capacity" value={snapshot.totalCapacity} icon="▥" color="neutral" />
      </div>

      {snapshot.overdueFrogs > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <strong>{snapshot.overdueFrogs} frogs overdue</strong> — past the expected rest period.
        </div>
      )}

      {/* Capacity bar */}
      <div className="card p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">Colony Utilization</span>
          <span className="font-mono text-xs text-gray-500">
            {snapshot.totalFrogs} / {snapshot.totalCapacity} ({snapshot.totalCapacity > 0 ? Math.round((snapshot.totalFrogs / snapshot.totalCapacity) * 100) : 0}%)
          </span>
        </div>
        <div className="mt-3 h-4 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-500"
            style={{ width: `${Math.min(100, snapshot.totalCapacity > 0 ? (snapshot.totalFrogs / snapshot.totalCapacity) * 100 : 0)}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-gray-400">
          <span>0</span>
          <span>{snapshot.totalCapacity} capacity</span>
        </div>
      </div>

      <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs text-gray-500">
        Rest period: {snapshot.restDays} days · Minimum open bins: {snapshot.minOpenBins} · Grouping window: {snapshot.groupingWindow} days
      </div>
    </div>
  );
}

// ─── Usage Panel ──────────────────────────────────────────────────────────

function UsagePanel({ usage }: { usage: UsageStats | null }) {
  if (!usage || usage.trend === "insufficient") {
    return (
      <EmptyCalc message="Not enough logged use history yet. Log use events from the 'Log Use & Rest' page, and usage statistics will appear here automatically." />
    );
  }

  const trendConfig = {
    increasing: { label: "Increasing", cls: "text-amber-600 bg-amber-50 border-amber-200", icon: "↑" },
    stable: { label: "Stable", cls: "text-green-600 bg-green-50 border-green-200", icon: "→" },
    decreasing: { label: "Decreasing", cls: "text-blue-600 bg-blue-50 border-blue-200", icon: "↓" },
  };
  const trend = trendConfig[usage.trend] ?? trendConfig.stable;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Last 7 Days" value={usage.last7} icon="7" color="brand" subtitle="frogs used" />
        <MetricCard label="Last 30 Days" value={usage.last30} icon="30" color="blue" subtitle="frogs used" />
        <MetricCard label="Last 60 Days" value={usage.last60} icon="60" color="neutral" subtitle="frogs used" />
        <MetricCard label="Last 90 Days" value={usage.last90} icon="90" color="neutral" subtitle="frogs used" />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card p-5 text-center">
          <p className="text-xs font-medium text-gray-500">Avg Frogs / Week</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{usage.avgPerWeek}</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-xs font-medium text-gray-500">Avg Bins / Week</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{usage.avgBinsPerWeek}</p>
        </div>
        <div className={`rounded-xl border p-5 text-center ${trend.cls}`}>
          <p className="text-xs font-medium opacity-70">Usage Trend</p>
          <p className="mt-2 text-3xl font-bold">{trend.icon}</p>
          <p className="mt-1 text-sm font-semibold">{trend.label}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Ordering Panel ───────────────────────────────────────────────────────

function OrderingPanel({ snapshot, usage }: { snapshot: ColonySnapshot | null; usage: UsageStats | null }) {
  const [frogsPerBin, setFrogsPerBin] = useState("6");
  const [weeklyUse, setWeeklyUse] = useState("");
  const [restDaysInput, setRestDaysInput] = useState("");
  const [acclimation, setAcclimation] = useState("14");
  const [buffer, setBuffer] = useState("15");

  useEffect(() => {
    if (usage && usage.avgPerWeek > 0) setWeeklyUse(String(usage.avgPerWeek));
    if (snapshot) {
      setRestDaysInput(String(snapshot.restDays));
      if (snapshot.totalCapacity > 0 && snapshot.totalBins > 0) {
        setFrogsPerBin(String(Math.round(snapshot.totalCapacity / snapshot.totalBins)));
      }
    }
  }, [usage, snapshot]);

  const calc = useMemo(() => {
    if (!snapshot) return null;
    const fpb = parseInt(frogsPerBin) || 6;
    const wu = parseFloat(weeklyUse) || 0;
    const rd = parseInt(restDaysInput) || 90;
    const bufferPct = parseInt(buffer) || 15;

    if (wu === 0) return null;

    const binsUsedPerWeek = Math.ceil(wu / fpb);
    const restWeeks = Math.ceil(rd / 7);
    const binsInRest = binsUsedPerWeek * restWeeks;
    const bufferBins = Math.ceil(binsInRest * (bufferPct / 100));
    const recommendedOpenBins = binsInRest + bufferBins;
    const recommendedPopulated = Math.max(0, snapshot.totalBins - recommendedOpenBins);
    const maxActiveFrogs = recommendedPopulated * fpb;
    const safeToOrder = Math.max(0, maxActiveFrogs - snapshot.totalFrogs);
    const weeksUntilShortage = snapshot.activeFrogs > 0 ? Math.floor(snapshot.activeFrogs / wu) : 0;

    let risk: "low" | "medium" | "high" = "low";
    if (recommendedOpenBins > snapshot.totalBins) risk = "high";
    else if (recommendedOpenBins > snapshot.totalBins * 0.6) risk = "medium";

    return {
      binsUsedPerWeek,
      restWeeks,
      binsInRest,
      recommendedOpenBins,
      recommendedPopulated,
      maxActiveFrogs,
      safeToOrder,
      weeksUntilShortage,
      risk,
    };
  }, [snapshot, frogsPerBin, weeklyUse, restDaysInput, buffer]);

  if (!snapshot || snapshot.totalBins === 0) {
    return <EmptyCalc message="Set up your colony first to use the ordering advisor." />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Inputs */}
      <div className="card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-800">Assumptions</h3>
        <p className="text-xs text-gray-500">Adjust these to match your lab. Values are pre-filled from your colony settings and usage history.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <CalcInput label="Frogs per bin" value={frogsPerBin} onChange={setFrogsPerBin} />
          <CalcInput label="Frogs used / week" value={weeklyUse} onChange={setWeeklyUse} />
          <CalcInput label="Rest period (days)" value={restDaysInput} onChange={setRestDaysInput} />
          <CalcInput label="Acclimation (days)" value={acclimation} onChange={setAcclimation} />
          <CalcInput label="Safety buffer (%)" value={buffer} onChange={setBuffer} />
        </div>
        <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-500 space-y-1">
          <p>Current bins: <strong>{snapshot.totalBins}</strong> · Populated: <strong>{snapshot.populatedBins}</strong> · Open: <strong>{snapshot.openBins}</strong></p>
          <p>Current frogs: <strong>{snapshot.totalFrogs}</strong> · Active: <strong>{snapshot.activeFrogs}</strong></p>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {calc ? (
          <>
            <RiskBadge risk={calc.risk} />
            <div className="card p-5 space-y-3">
              <h3 className="text-sm font-semibold text-gray-800">Recommendations</h3>
              <ResultRow label="Bins cycling through rest" value={String(calc.binsInRest)} />
              <ResultRow label="Recommended open/rest bins" value={String(calc.recommendedOpenBins)} highlight />
              <ResultRow label="Maximum populated bins" value={String(calc.recommendedPopulated)} />
              <ResultRow label="Maximum active frogs" value={String(calc.maxActiveFrogs)} />
              <ResultRow label="Safe frogs to order now" value={calc.safeToOrder > 0 ? `~${calc.safeToOrder}` : "0 (at capacity)"} highlight />
              <ResultRow label="Weeks until potential shortage" value={calc.weeksUntilShortage > 52 ? "52+" : `~${calc.weeksUntilShortage}`} />
            </div>

            {calc.safeToOrder > 0 && (
              <div className="card border-l-4 border-green-400 p-4">
                <p className="text-sm text-gray-700">
                  You can safely order approximately <strong>{calc.safeToOrder} frogs</strong> while maintaining {calc.recommendedOpenBins} open rest bins.
                </p>
              </div>
            )}

            {calc.risk === "high" && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <strong>Warning:</strong> Your use rate requires more rest bins than you have available.
                Consider reducing weekly use or adding more bins.
              </div>
            )}

            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs text-gray-500 leading-relaxed">
              Based on {snapshot.totalBins} bins, {frogsPerBin} frogs/bin, {restDaysInput}-day rest, and {weeklyUse} frogs/week usage.
              Buffer: {buffer}%. Acclimation: {acclimation} days.
            </div>
          </>
        ) : (
          <div className="card p-8 text-center text-sm text-gray-500">
            Enter expected weekly use to see ordering recommendations.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Scenario Panel ───────────────────────────────────────────────────────

function ScenarioPanel({ snapshot }: { snapshot: ColonySnapshot | null }) {
  const [frogs, setFrogs] = useState(snapshot ? String(snapshot.totalFrogs) : "90");
  const [bins, setBins] = useState(snapshot ? String(snapshot.totalBins) : "30");
  const [weekly, setWeekly] = useState("12");
  const [rest, setRest] = useState(snapshot ? String(snapshot.restDays) : "90");

  const calc = useMemo(() => {
    const f = parseInt(frogs) || 0;
    const b = parseInt(bins) || 0;
    const w = parseInt(weekly) || 0;
    const r = parseInt(rest) || 90;
    if (f === 0 || b === 0 || w === 0) return null;

    const fpb = Math.ceil(f / b);
    const binsPerWeek = Math.ceil(w / fpb);
    const restWeeks = Math.ceil(r / 7);
    const requiredRestBins = binsPerWeek * restWeeks;
    const populatedBins = b - requiredRestBins;
    const weeksToShortage = f > 0 ? Math.floor(f / w) : 0;
    const safeOrder = Math.max(0, populatedBins * fpb - f);

    let status: "safe" | "tight" | "unsustainable" = "safe";
    if (requiredRestBins >= b) status = "unsustainable";
    else if (requiredRestBins > b * 0.6) status = "tight";

    return { fpb, binsPerWeek, restWeeks, requiredRestBins, populatedBins, weeksToShortage, safeOrder, status };
  }, [frogs, bins, weekly, rest]);

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-800">Scenario: &ldquo;I have X frogs in Y bins...&rdquo;</h3>
        <p className="mt-1 text-xs text-gray-500">Enter any numbers to model a scenario.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <CalcInput label="Total frogs" value={frogs} onChange={setFrogs} />
          <CalcInput label="Total bins" value={bins} onChange={setBins} />
          <CalcInput label="Frogs used / week" value={weekly} onChange={setWeekly} />
          <CalcInput label="Rest period (days)" value={rest} onChange={setRest} />
        </div>
      </div>

      {calc && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Required Rest Bins" value={calc.requiredRestBins} icon="□" color={calc.status === "unsustainable" ? "red" : "blue"} />
          <MetricCard label="Populated Bins" value={Math.max(0, calc.populatedBins)} icon="■" color="brand" />
          <MetricCard label="Weeks to Shortage" value={calc.weeksToShortage} icon="◷" color={calc.weeksToShortage < 12 ? "red" : "green"} />
          <MetricCard label="Safe to Order" value={calc.safeOrder} icon="⊕" color="green" />
        </div>
      )}

      {calc && (
        <div className={`card border-l-4 p-5 ${
          calc.status === "safe" ? "border-green-400" :
          calc.status === "tight" ? "border-yellow-400" :
          "border-red-400"
        }`}>
          <p className="text-sm text-gray-700 leading-relaxed">
            With <strong>{frogs} frogs</strong> in <strong>{bins} bins</strong>, using <strong>{weekly} frogs/week</strong> and
            a <strong>{rest}-day rest period</strong>:
            {calc.status === "safe" && (
              <> This setup is sustainable. You need ~{calc.requiredRestBins} bins for rest and can keep ~{Math.max(0, calc.populatedBins)} populated.
              Safe additional order: ~{calc.safeOrder} frogs.</>
            )}
            {calc.status === "tight" && (
              <> This setup is tight. You need {calc.requiredRestBins} rest bins out of {bins} total — leaving limited margin.
              Projected shortage in ~{calc.weeksToShortage} weeks.</>
            )}
            {calc.status === "unsustainable" && (
              <> This setup is unsustainable. You need {calc.requiredRestBins} rest bins but only have {bins} total bins.
              Add more bins or reduce weekly use.</>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Ask Panel ────────────────────────────────────────────────────────────

function AskPanel({ snapshot, usage }: { snapshot: ColonySnapshot | null; usage: UsageStats | null }) {
  const [answer, setAnswer] = useState<string | null>(null);
  const [question, setQuestion] = useState<string | null>(null);

  function ask(q: string) {
    setQuestion(q);
    if (!snapshot || snapshot.totalBins === 0) {
      setAnswer("No colony data available yet. Complete onboarding and add frogs to get answers.");
      return;
    }

    const fpb = snapshot.totalCapacity > 0 && snapshot.totalBins > 0
      ? Math.round(snapshot.totalCapacity / snapshot.totalBins)
      : 6;
    const wu = usage?.avgPerWeek ?? 0;
    const rd = snapshot.restDays;

    switch (q) {
      case "stock": {
        setAnswer(
          `You have ${snapshot.totalFrogs} frogs across ${snapshot.totalBins} bins. ` +
          `${snapshot.activeFrogs} active, ${snapshot.restingFrogs} resting, ${snapshot.readyFrogs} ready. ` +
          `${snapshot.populatedBins} bins are populated, ${snapshot.openBins} are open for receiving. ` +
          `Total capacity: ${snapshot.totalCapacity}.`
        );
        break;
      }
      case "usage": {
        if (!usage || usage.trend === "insufficient") {
          setAnswer("Not enough use history logged yet. Log use events and return here for usage analysis.");
        } else {
          setAnswer(
            `Your current usage rate is approximately ${usage.avgPerWeek} frogs/week ` +
            `(${usage.last30} in the last 30 days, ${usage.last90} in the last 90 days). ` +
            `Trend: ${usage.trend}. Average bins used: ${usage.avgBinsPerWeek}/week.`
          );
        }
        break;
      }
      case "order": {
        if (wu === 0) {
          setAnswer("Cannot calculate ordering capacity without usage data. Log some use events first, or use the Ordering Advisor tab to enter manual assumptions.");
        } else {
          const bpw = Math.ceil(wu / fpb);
          const restWeeks = Math.ceil(rd / 7);
          const neededRest = bpw * restWeeks;
          const maxPop = Math.max(0, snapshot.totalBins - neededRest);
          const maxFrogs = maxPop * fpb;
          const safe = Math.max(0, maxFrogs - snapshot.totalFrogs);
          setAnswer(
            `Based on ${snapshot.totalBins} bins, ${fpb} frogs/bin, ${rd}-day rest, and ${wu} frogs/week usage: ` +
            `you need ~${neededRest} rest bins, leaving ${maxPop} for populated frogs (max ${maxFrogs} frogs). ` +
            `Safe additional order: ~${safe} frogs. ` +
            (safe === 0 ? "You are near capacity for your current use rate." : "")
          );
        }
        break;
      }
      case "open": {
        if (wu === 0) {
          setAnswer(`Your configured minimum is ${snapshot.minOpenBins} open bins. Log use events to get a calculated recommendation based on actual usage.`);
        } else {
          const bpw = Math.ceil(wu / fpb);
          const restWeeks = Math.ceil(rd / 7);
          const needed = bpw * restWeeks + 2;
          setAnswer(
            `Based on ${wu} frogs/week usage (~${bpw} bins/week) and ${rd}-day rest period (${restWeeks} weeks): ` +
            `you should keep approximately ${needed} bins open for rest/receiving. ` +
            `You currently have ${snapshot.openBins} open. ` +
            (snapshot.openBins >= needed ? "This looks sufficient." : `Consider freeing ${needed - snapshot.openBins} more bin(s).`)
          );
        }
        break;
      }
      case "shortage": {
        if (wu === 0) {
          setAnswer("Cannot predict shortage without usage data. Log use events or enter assumptions in the Scenario tab.");
        } else {
          const weeks = snapshot.activeFrogs > 0 ? Math.floor(snapshot.activeFrogs / wu) : 0;
          const date = new Date(); date.setDate(date.getDate() + weeks * 7);
          setAnswer(
            `At ${wu} frogs/week with ${snapshot.activeFrogs} active frogs: ` +
            `estimated shortage in ~${weeks} weeks (around ${date.toLocaleDateString()}). ` +
            (weeks > 26 ? "This is well buffered." : weeks > 12 ? "Consider planning a repopulation order." : "This is urgent — order soon.")
          );
        }
        break;
      }
      case "bottleneck": {
        if (wu === 0) {
          setAnswer("No usage data to analyze bottlenecks. Start logging use events.");
        } else {
          const bpw = Math.ceil(wu / fpb);
          const restWeeks = Math.ceil(rd / 7);
          const needed = bpw * restWeeks;
          if (needed > snapshot.totalBins) {
            setAnswer(`Bottleneck: Not enough total bins. You need ${needed} rest bins but only have ${snapshot.totalBins} total. Add bins or reduce use rate.`);
          } else if (snapshot.openBins < needed) {
            setAnswer(`Bottleneck: Not enough open bins. You need ~${needed} for rest but have ${snapshot.openBins} open. Mark more bins as open/receiving.`);
          } else {
            setAnswer(`No immediate bottleneck detected. ${snapshot.openBins} open bins is sufficient for ${wu} frogs/week at ${rd}-day rest. Colony appears sustainable.`);
          }
        }
        break;
      }
    }
  }

  const questions = [
    { key: "stock", label: "What is my full frog stock now?" },
    { key: "usage", label: "What is my present usage rate?" },
    { key: "order", label: "How many frogs can I order?" },
    { key: "open", label: "How many bins should I keep open?" },
    { key: "shortage", label: "When will I run short?" },
    { key: "bottleneck", label: "What is my current bottleneck?" },
  ];

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-800">Ask XenoTrack</h3>
        <p className="mt-1 text-xs text-gray-500">Tap a question to get a calculated answer based on your colony data.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {questions.map((q) => (
            <button
              key={q.key}
              onClick={() => ask(q.key)}
              className={`rounded-lg border px-4 py-3 text-left text-sm transition-all hover:shadow-sm ${
                question === q.key
                  ? "border-brand-400 bg-brand-50 text-brand-700 font-medium"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {answer && (
        <div className="card border-l-4 border-brand-400 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 mb-2">Answer</p>
          <p className="text-sm text-gray-700 leading-relaxed">{answer}</p>
          <p className="mt-3 text-[10px] text-gray-400">
            Calculated from your colony data. Adjust assumptions in the Ordering Advisor or Scenario tabs.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Reality Check Panel ──────────────────────────────────────────────────

function RealityCheckPanel({ snapshot, usage }: { snapshot: ColonySnapshot | null; usage: UsageStats | null }) {
  if (!snapshot || snapshot.totalBins === 0) {
    return <EmptyCalc message="Set up your colony to see the reality check comparison." />;
  }

  const fpb = snapshot.totalCapacity > 0 && snapshot.totalBins > 0
    ? Math.round(snapshot.totalCapacity / snapshot.totalBins) : 6;
  const wu = usage?.avgPerWeek ?? 0;
  const bpw = wu > 0 ? Math.ceil(wu / fpb) : 0;
  const restWeeks = Math.ceil(snapshot.restDays / 7);
  const expectedRestBins = bpw * restWeeks;
  const expectedAvailable = snapshot.totalFrogs - (snapshot.restingFrogs);

  const comparisons = [
    {
      label: "Open rest bins",
      assumption: `${snapshot.minOpenBins} (configured minimum)`,
      actual: `${snapshot.openBins}`,
      status: snapshot.openBins >= snapshot.minOpenBins ? "ok" : "gap",
    },
    {
      label: "Bins needed for rest cycle",
      assumption: wu > 0 ? `~${expectedRestBins} (based on ${wu} frogs/wk)` : "Unknown (no use data)",
      actual: `${snapshot.openBins} available`,
      status: wu === 0 ? "unknown" : snapshot.openBins >= expectedRestBins ? "ok" : "gap",
    },
    {
      label: "Frogs actually available",
      assumption: `${snapshot.totalFrogs} total in colony`,
      actual: `${expectedAvailable} (excluding resting)`,
      status: expectedAvailable > 0 ? "ok" : "gap",
    },
    {
      label: "Usage rate vs capacity",
      assumption: wu > 0 ? `${wu} frogs/week demand` : "No use data yet",
      actual: wu > 0 && expectedAvailable > 0
        ? `~${Math.floor(expectedAvailable / wu)} weeks of supply`
        : "Insufficient data",
      status: wu > 0 && expectedAvailable / wu > 12 ? "ok" : wu > 0 ? "gap" : "unknown",
    },
    {
      label: "Rest period compliance",
      assumption: `${snapshot.restDays} days configured`,
      actual: snapshot.overdueFrogs > 0 ? `${snapshot.overdueFrogs} frogs overdue` : "All within period",
      status: snapshot.overdueFrogs === 0 ? "ok" : "gap",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="card border-l-4 border-brand-400 p-5">
        <h3 className="text-sm font-semibold text-gray-800">Assumptions vs Actuals</h3>
        <p className="mt-1 text-xs text-gray-500">
          Compare what your colony settings assume with what the data shows. Gaps indicate where reality differs from plan.
        </p>
      </div>

      <div className="space-y-2">
        {comparisons.map((c) => (
          <div key={c.label} className="card-flat overflow-hidden">
            <div className="flex items-stretch">
              <div className={`w-1 flex-shrink-0 ${c.status === "ok" ? "bg-green-400" : c.status === "gap" ? "bg-yellow-400" : "bg-gray-200"}`} />
              <div className="flex-1 p-4">
                <p className="text-sm font-medium text-gray-800">{c.label}</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Assumption</p>
                    <p className="text-xs text-gray-600">{c.assumption}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Actual</p>
                    <p className={`text-xs font-medium ${c.status === "ok" ? "text-green-700" : c.status === "gap" ? "text-yellow-700" : "text-gray-500"}`}>
                      {c.actual}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {wu === 0 && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
          Some comparisons require logged use events. As you log use from the &quot;Log Use &amp; Rest&quot; page, these will populate with real data.
        </div>
      )}

      <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs text-gray-500">
        This is not punitive — it helps PIs and lab managers see where the colony plan matches reality, and where adjustments may help.
      </div>
    </div>
  );
}

// ─── Shared Components ────────────────────────────────────────────────────

function MetricCard({ label, value, icon, color, subtitle }: {
  label: string;
  value: number;
  icon: string;
  color: "brand" | "green" | "blue" | "red" | "emerald" | "neutral";
  subtitle?: string;
}) {
  const styles = {
    brand: "border-brand-200 bg-brand-50/60",
    green: "border-green-200 bg-green-50/60",
    blue: "border-blue-200 bg-blue-50/60",
    red: "border-red-200 bg-red-50/60",
    emerald: "border-emerald-200 bg-emerald-50/60",
    neutral: "border-gray-200 bg-white",
  };
  const textColors = {
    brand: "text-brand-700",
    green: "text-green-700",
    blue: "text-blue-700",
    red: "text-red-700",
    emerald: "text-emerald-700",
    neutral: "text-gray-900",
  };
  return (
    <div className={`rounded-xl border p-4 transition-all hover:shadow-sm ${styles[color]}`}>
      <div className="flex items-center gap-2">
        <span className="text-xs opacity-50">{icon}</span>
        <p className="text-xs font-medium text-gray-500">{label}</p>
      </div>
      <p className={`mt-2 text-2xl font-bold ${textColors[color]}`}>{value}</p>
      {subtitle && <p className="mt-0.5 text-[10px] text-gray-400">{subtitle}</p>}
    </div>
  );
}

function CalcInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min="0"
        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
    </div>
  );
}

function ResultRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-gray-600">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? "text-brand-600" : "text-gray-900"}`}>{value}</span>
    </div>
  );
}

function RiskBadge({ risk }: { risk: "low" | "medium" | "high" }) {
  const cfg = {
    low: { label: "Low Risk", cls: "border-green-200 bg-green-50", text: "text-green-700", icon: "✓" },
    medium: { label: "Medium Risk", cls: "border-yellow-200 bg-yellow-50", text: "text-yellow-700", icon: "!" },
    high: { label: "High Risk", cls: "border-red-200 bg-red-50", text: "text-red-700", icon: "✕" },
  };
  const c = cfg[risk];
  return (
    <div className={`flex items-center gap-3 rounded-xl border p-4 ${c.cls}`}>
      <span className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${c.text} bg-white/80`}>{c.icon}</span>
      <div>
        <p className={`text-sm font-semibold ${c.text}`}>{c.label}</p>
        <p className="text-xs text-gray-600">
          {risk === "low" ? "Sustainable configuration." : risk === "medium" ? "Tight margins — monitor closely." : "Unsustainable — action needed."}
        </p>
      </div>
    </div>
  );
}

function EmptyCalc({ message }: { message: string }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50">
        <span className="text-lg text-brand-600">⊞</span>
      </div>
      <p className="mt-4 text-sm text-gray-600">{message}</p>
      <a href="/onboarding" className="btn-secondary mt-4 inline-block text-xs">Set up colony</a>
    </div>
  );
}
