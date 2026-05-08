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
          title="Start by creating your bins"
          description="Define your housing structure first. Then add frogs, set rest rules, and start tracking the colony."
          actions={[
            { href: "/onboarding", label: "Set up colony", primary: true },
            { href: "/bins/new", label: "Create bins" },
          ]}
        />
      </div>
    );
  }

  // Empty state: bins exist but no frogs
  if (!state.hasFrogs) {
    return (
      <div className="p-6 lg:p-10">
        <h1 className="page-header">Colony Dashboard</h1>
        <p className="page-subtitle">{state.binCount} bins created</p>
        <EmptyState
          title="Your bins are ready. Add frogs to begin tracking."
          description="Assign frogs to bins so the system can track use, rest, and readiness."
          actions={[
            { href: "/frogs/add", label: "Add frogs by count", primary: true },
            { href: "/frogs/add", label: "Add individual frogs" },
            { href: "/photos", label: "Upload bin photos" },
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
        <p className="page-subtitle">{state.binCount} bins · {state.frogCount} frogs · {state.openBins} open for rest</p>
        <EmptyState
          title="Your colony is populated. Log first use when frogs are taken from a bin."
          description="When frogs are used, log the event and XenoTrack recommends a destination rest bin. The system tracks rest timers and notifies you when frogs are ready."
          actions={[
            { href: "/use", label: "Log use from bin", primary: true },
            { href: "/planner", label: "Use Cycle Planner" },
            { href: "/bins", label: "View bins" },
          ]}
        />
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

      {/* Quick links */}
      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <a href="/planner" className="card-flat flex items-center gap-3 px-4 py-3 transition-all hover:shadow-card-hover">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-sm text-brand-600">⊞</span>
          <div>
            <p className="text-xs font-semibold text-gray-800">Use Cycle Planner</p>
            <p className="text-[10px] text-gray-500">Calculate open-bin needs</p>
          </div>
        </a>
        <a href="/settings" className="card-flat flex items-center gap-3 px-4 py-3 transition-all hover:shadow-card-hover">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-600">⚙</span>
          <div>
            <p className="text-xs font-semibold text-gray-800">Settings</p>
            <p className="text-[10px] text-gray-500">Rest rules &amp; workspace</p>
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
