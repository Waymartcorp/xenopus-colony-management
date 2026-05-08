"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";

// TODO: Query bin_cycle_status for rest timers, ready dates
// TODO: Add receiving_status to locations table (open, occupied, resting, closed, gp_source, ready, needs_repop)

interface Bin {
  id: string;
  name: string;
  room: string | null;
  location_type: string;
  target_count: number;
  frog_count: number;
  receiving_status: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  open: { label: "Open", color: "bg-green-100 text-green-700" },
  occupied: { label: "Occupied", color: "bg-blue-100 text-blue-700" },
  resting: { label: "Resting", color: "bg-blue-100 text-blue-600" },
  ready: { label: "Ready for Use", color: "bg-green-100 text-green-700" },
  closed: { label: "Closed / Hold", color: "bg-gray-100 text-gray-600" },
  gp_source: { label: "GP Source", color: "bg-purple-100 text-purple-700" },
  needs_repop: { label: "Needs Repopulation", color: "bg-yellow-100 text-yellow-700" },
};

export default function BinsPage() {
  const [bins, setBins] = useState<Bin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createBrowserSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: mem } = await supabase
        .from("organization_memberships")
        .select("organization_id")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (!mem) { setLoading(false); return; }

      const { data: locs } = await supabase
        .from("locations")
        .select("id, name, room, location_type, target_count")
        .eq("organization_id", mem.organization_id)
        .order("name");

      if (locs && locs.length > 0) {
        // Get frog counts per location
        const binData: Bin[] = [];
        for (const loc of locs) {
          const { count } = await supabase
            .from("frogs")
            .select("*", { count: "exact", head: true })
            .eq("current_location_id", loc.id);

          binData.push({
            ...loc,
            frog_count: count ?? 0,
            receiving_status: (count ?? 0) === 0 ? "open" : "occupied",
            // TODO: Derive from bin_cycle_status once events exist
          });
        }
        setBins(binData);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="p-6"><p className="text-sm text-gray-500">Loading bins...</p></div>;
  }

  // Empty state
  if (bins.length === 0) {
    return (
      <div className="p-6 lg:p-10">
        <h1 className="page-header">Bins</h1>
        <div className="mt-8 rounded-xl border-2 border-dashed border-gray-200 bg-white p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
            <span className="text-xl text-brand-600">◫</span>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900">No bins yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
            Create your bins to define where frogs live. Each bin tracks frogs,
            use history, rest timers, and readiness.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <a href="/onboarding" className="btn-primary">Set up colony</a>
          </div>
        </div>
      </div>
    );
  }

  const openBins = bins.filter((b) => b.receiving_status === "open");
  const occupiedBins = bins.filter((b) => b.receiving_status !== "open");

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-header">Bins</h1>
          <p className="page-subtitle">{bins.length} bins · {openBins.length} open for receiving</p>
        </div>
        <a href="/use" className="btn-primary">Log Use &amp; Rest</a>
      </div>

      {/* Bin list */}
      <div className="mt-8 space-y-2">
        {bins.map((bin) => {
          const status = STATUS_LABELS[bin.receiving_status] ?? STATUS_LABELS.occupied;
          return (
            <a
              key={bin.id}
              href={`/bins/${bin.id}`}
              className="card-flat flex items-center justify-between px-5 py-4 transition-all hover:shadow-card-hover hover:border-gray-300"
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${bin.receiving_status === "open" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {bin.frog_count}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{bin.name}</p>
                  {bin.room && <p className="text-xs text-gray-500">{bin.room}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-gray-400">
                  {bin.frog_count}/{bin.target_count}
                </span>
                <span className={`status-badge ${status.color}`}>
                  {status.label}
                </span>
                <span className="text-gray-300">→</span>
              </div>
            </a>
          );
        })}
      </div>

      {occupiedBins.length > 0 && openBins.length === 0 && (
        <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          No bins are marked as open for receiving. When frogs are used, you&apos;ll need an open bin to receive them for rest.
        </div>
      )}
    </div>
  );
}
