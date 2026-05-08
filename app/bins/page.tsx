"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";

interface Bin {
  id: string;
  label: string;
  location_type: string;
  capacity: number;
  frog_count: number;
  receiving_status: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  open: { label: "Open", color: "bg-green-100 text-green-700" },
  assigned: { label: "Assigned Destination", color: "bg-brand-100 text-brand-700" },
  receiving: { label: "Receiving", color: "bg-teal-100 text-teal-700" },
  occupied: { label: "Occupied", color: "bg-blue-100 text-blue-700" },
  resting: { label: "Resting", color: "bg-blue-100 text-blue-600" },
  rest_complete: { label: "Rest Complete", color: "bg-emerald-100 text-emerald-700" },
  ready: { label: "Ready for Use", color: "bg-green-100 text-green-700" },
  closed: { label: "Closed / Hold", color: "bg-gray-100 text-gray-600" },
  gp_source: { label: "GP Source", color: "bg-purple-100 text-purple-700" },
  needs_repop: { label: "Needs Repopulation", color: "bg-yellow-100 text-yellow-700" },
  pending_confirmation: { label: "Pending Placement", color: "bg-yellow-100 text-yellow-700" },
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
        .select("id, label, location_type, capacity, status, notes")
        .eq("organization_id", mem.organization_id)
        .order("label");

      if (locs && locs.length > 0) {
        const binData: Bin[] = [];
        for (const loc of locs) {
          const { count } = await supabase
            .from("frogs")
            .select("*", { count: "exact", head: true })
            .eq("current_location_id", loc.id);

          const fc = count ?? 0;
          const cap = loc.capacity ?? 8;
          // Derive status: if notes indicate special status, use it
          let receivingStatus = fc === 0 ? "open" : "occupied";
          if (loc.notes === "open_for_receiving") receivingStatus = "open";
          else if (loc.notes === "gp_source") receivingStatus = "gp_source";
          if (loc.status === "inactive") receivingStatus = "closed";

          binData.push({
            id: loc.id,
            label: loc.label,
            location_type: loc.location_type,
            capacity: cap,
            frog_count: fc,
            receiving_status: receivingStatus,
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
                  <p className="text-sm font-semibold text-gray-900">{bin.label}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-gray-400">
                  {bin.frog_count}/{bin.capacity}
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

      {bins.length > 0 && openBins.length === 0 && (
        <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          No bins are marked as open for receiving. When frogs are used, you&apos;ll need an open bin to receive them for rest.
        </div>
      )}
    </div>
  );
}
