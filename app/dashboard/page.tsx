"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";

// TODO: Replace with real queries against locations, frogs, frog_events, bin_cycle_status

interface ColonyState {
  hasBins: boolean;
  hasFrogs: boolean;
  hasEvents: boolean;
  binCount: number;
  frogCount: number;
  restingBins: number;
  readyBins: number;
  overdueBins: number;
  openBins: number;
}

export default function DashboardPage() {
  const [state, setState] = useState<ColonyState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createBrowserSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's org
      const { data: mem } = await supabase
        .from("organization_memberships")
        .select("organization_id")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (!mem) {
        setState({ hasBins: false, hasFrogs: false, hasEvents: false, binCount: 0, frogCount: 0, restingBins: 0, readyBins: 0, overdueBins: 0, openBins: 0 });
        setLoading(false);
        return;
      }

      const orgId = mem.organization_id;

      const { count: binCount } = await supabase
        .from("locations")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", orgId);

      const { count: frogCount } = await supabase
        .from("frogs")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", orgId);

      const { count: eventCount } = await supabase
        .from("frog_events")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", orgId);

      setState({
        hasBins: (binCount ?? 0) > 0,
        hasFrogs: (frogCount ?? 0) > 0,
        hasEvents: (eventCount ?? 0) > 0,
        binCount: binCount ?? 0,
        frogCount: frogCount ?? 0,
        restingBins: 0, // TODO: query bin_cycle_status
        readyBins: 0,
        overdueBins: 0,
        openBins: 0,
      });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <p className="text-sm text-gray-500">Loading your colony...</p>
      </div>
    );
  }

  if (!state) return null;

  // Empty state: no bins
  if (!state.hasBins) {
    return (
      <div className="p-6 lg:p-10">
        <h1 className="page-header">Colony Dashboard</h1>
        <EmptyState
          title="No colony data yet"
          description="Run the guided setup to define your bins, add frogs, and configure rest rules. This takes about 2 minutes."
          actions={[
            { href: "/onboarding", label: "Set up colony", primary: true },
          ]}
        />
        <HowItWorks />
      </div>
    );
  }

  // Empty state: bins exist but no frogs
  if (!state.hasFrogs) {
    return (
      <div className="p-6 lg:p-10">
        <h1 className="page-header">Colony Dashboard</h1>
        <p className="page-subtitle">{state.binCount} bin{state.binCount !== 1 ? "s" : ""} defined — no frogs registered yet</p>
        <EmptyState
          title="Add frogs to your bins"
          description="Assign frog counts or individual frogs to each bin. This is what XenoTrack will track through use/rest cycles."
          actions={[
            { href: "/frogs/add", label: "Add frogs", primary: true },
            { href: "/bins", label: "View bins" },
          ]}
        />
      </div>
    );
  }

  // Empty state: frogs exist but no use/rest events yet
  if (!state.hasEvents) {
    return (
      <div className="p-6 lg:p-10">
        <h1 className="page-header">Colony Dashboard</h1>
        <p className="page-subtitle">{state.binCount} bins · {state.frogCount} frogs registered</p>
        <EmptyState
          title="Colony is set up — ready to log use"
          description="When frogs are taken from a bin, log the use event. XenoTrack will recommend a destination rest bin and start the rest timer automatically."
          actions={[
            { href: "/use", label: "Log use from bin", primary: true },
            { href: "/bins", label: "View bins" },
          ]}
        />
        <HowItWorks />
      </div>
    );
  }

  // Active colony state
  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-header">Colony Dashboard</h1>
          <p className="page-subtitle">{state.binCount} bins · {state.frogCount} frogs</p>
        </div>
        <div className="flex gap-2">
          <a href="/planner" className="btn-secondary hidden sm:inline-flex">Planner</a>
          <a href="/use" className="btn-primary">Log Use &amp; Rest</a>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total Bins" value={state.binCount} variant="neutral" />
        <StatCard label="Ready" value={state.readyBins} variant="ready" />
        <StatCard label="Resting" value={state.restingBins} variant="resting" />
        <StatCard label="Overdue" value={state.overdueBins} variant="danger" />
        <StatCard label="Open (receiving)" value={state.openBins} variant="neutral" />
      </div>

      {/* Guided next step */}
      <section className="mt-8">
        <div className="card overflow-hidden">
          <div className="border-l-4 border-brand-500 p-6">
            <p className="section-title text-brand-600">What to do next</p>
            <p className="mt-2 text-sm text-gray-700">
              {state.readyBins > 0
                ? `${state.readyBins} bin(s) have completed rest and are ready for use.`
                : state.restingBins > 0
                ? `${state.restingBins} bin(s) are resting. You'll be notified when they're ready.`
                : "Log a use event when frogs are taken from a bin."}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="/use" className="btn-primary">Log Use &amp; Rest</a>
              <a href="/bins" className="btn-secondary">View All Bins</a>
              <a href="/colony" className="btn-secondary">Whole Colony</a>
            </div>
          </div>
        </div>
      </section>

      {/* Cycle visual summary */}
      <section className="mt-6">
        <div className="flex items-center gap-3 overflow-x-auto rounded-xl border border-gray-100 bg-gray-50/50 px-5 py-4">
          <CycleStep icon="◫" label="Populated" count={state.binCount - state.openBins - state.restingBins} active />
          <CycleArrow />
          <CycleStep icon="↑" label="Used" count={null} />
          <CycleArrow />
          <CycleStep icon="◷" label="Resting" count={state.restingBins} />
          <CycleArrow />
          <CycleStep icon="✓" label="Ready" count={state.readyBins} />
          <CycleArrow />
          <CycleStep icon="↺" label="Return" count={null} />
        </div>
      </section>

      {/* Colony Summary */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">Colony Summary</h2>
          <a href="/calculator" className="text-xs font-medium text-brand-600 hover:text-brand-700">Calculator →</a>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <RealityItem
            label="Total frogs on record"
            value={`${state.frogCount}`}
            note="All frogs registered in this workspace"
          />
          <RealityItem
            label="Bins needing attention"
            value={`${state.overdueBins}`}
            note={state.overdueBins > 0 ? "Overdue — past rest period" : "None overdue"}
            warning={state.overdueBins > 0}
          />
          <RealityItem
            label="Open rest bins"
            value={`${state.openBins}`}
            note="Bins available to receive used frogs"
          />
        </div>
      </section>

      {/* Quick links */}
      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <a href="/calculator" className="card-flat flex items-center gap-3 px-4 py-3 transition-all hover:shadow-card-hover">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-sm text-brand-600">⊞</span>
          <div>
            <p className="text-xs font-semibold text-gray-800">Colony Calculator</p>
            <p className="text-[10px] text-gray-500">Stock, ordering, capacity</p>
          </div>
        </a>
        <a href="/reports" className="card-flat flex items-center gap-3 px-4 py-3 transition-all hover:shadow-card-hover">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-600">⊡</span>
          <div>
            <p className="text-xs font-semibold text-gray-800">Reports &amp; Export</p>
            <p className="text-[10px] text-gray-500">CSV, assumptions vs actuals</p>
          </div>
        </a>
        <a href="/notifications" className="card-flat flex items-center gap-3 px-4 py-3 transition-all hover:shadow-card-hover">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-sm text-blue-600">◉</span>
          <div>
            <p className="text-xs font-semibold text-gray-800">Notifications</p>
            <p className="text-[10px] text-gray-500">Rest-complete alerts</p>
          </div>
        </a>
      </section>
    </div>
  );
}

function EmptyState({ title, description, actions }: {
  title: string;
  description: string;
  actions: { href: string; label: string; primary?: boolean }[];
}) {
  return (
    <div className="mt-8 rounded-xl border-2 border-dashed border-gray-200 bg-white p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
        <span className="text-xl text-brand-600">◫</span>
      </div>
      <h2 className="mt-4 text-lg font-semibold text-gray-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">{description}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {actions.map((a) => (
          <a key={a.label} href={a.href} className={a.primary ? "btn-primary" : "btn-secondary"}>
            {a.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function RealityItem({ label, value, note, warning }: { label: string; value: string; note: string; warning?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${warning ? "border-yellow-200 bg-yellow-50/50" : "border-gray-200 bg-white"}`}>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className={`mt-1 text-xl font-bold ${warning ? "text-yellow-700" : "text-gray-900"}`}>{value}</p>
      <p className="mt-1 text-[10px] text-gray-400">{note}</p>
    </div>
  );
}

function CycleStep({ icon, label, count, active }: { icon: string; label: string; count: number | null; active?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 ${active ? "bg-brand-50" : ""}`}>
      <span className={`text-lg ${active ? "text-brand-600" : "text-gray-400"}`}>{icon}</span>
      <span className="text-[10px] font-medium text-gray-600">{label}</span>
      {count !== null && <span className="text-xs font-bold text-gray-900">{count}</span>}
    </div>
  );
}

function CycleArrow() {
  return <span className="text-sm text-gray-300">→</span>;
}

function StatCard({ label, value, variant }: { label: string; value: number; variant: "ready" | "resting" | "danger" | "neutral" }) {
  const styles = {
    ready: "border-green-200 bg-green-50/60",
    resting: "border-blue-200 bg-blue-50/60",
    danger: "border-red-200 bg-red-50/60",
    neutral: "border-gray-200 bg-white",
  };
  const textColors = {
    ready: "text-green-700",
    resting: "text-blue-700",
    danger: "text-red-700",
    neutral: "text-gray-900",
  };
  return (
    <div className={`rounded-xl border p-4 ${styles[variant]}`}>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${textColors[variant]}`}>{value}</p>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { num: 1, label: "Define bins", desc: "Name your tanks/bins during setup" },
    { num: 2, label: "Add frogs", desc: "Register frog counts per bin" },
    { num: 3, label: "Log use", desc: "Record when frogs are taken" },
    { num: 4, label: "Assign rest bin", desc: "System recommends a destination" },
    { num: 5, label: "Rest timer starts", desc: "Countdown tracked automatically" },
    { num: 6, label: "Get notified", desc: "Alert when rest period completes" },
    { num: 7, label: "Return to rotation", desc: "Frogs marked ready for reuse" },
  ];
  return (
    <section className="mt-10 rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-gray-800">How XenoTrack works</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <div key={s.num} className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">{s.num}</span>
            <div>
              <p className="text-xs font-semibold text-gray-800">{s.label}</p>
              <p className="text-[11px] text-gray-500">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
