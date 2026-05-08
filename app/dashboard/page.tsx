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
        <p className="page-subtitle">{state.binCount} bins · {state.frogCount} frogs</p>
        <EmptyState
          title="Your colony is populated. Log first use when frogs are taken from a bin."
          description="When frogs are used, log the event and move them to a rest bin. The system tracks rest timers and notifies you when they're ready."
          actions={[
            { href: "/use", label: "Log use from bin", primary: true },
            { href: "/bins", label: "View bins" },
            { href: "/workspace-profile", label: "Set rest rules" },
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
        <a href="/use" className="btn-primary">Log Use &amp; Rest</a>
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
            <div className="mt-4 flex gap-3">
              <a href="/use" className="btn-primary">Log Use &amp; Rest</a>
              <a href="/bins" className="btn-secondary">View All Bins</a>
              <a href="/colony" className="btn-secondary">Whole Colony</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="mt-10 rounded-xl border border-gray-100 bg-gray-50 p-4 text-center text-sm text-gray-500">
        Keep every bin and frog record in one place. Track performance over time.
        Preserve knowledge across technicians and projects.
      </div>
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
