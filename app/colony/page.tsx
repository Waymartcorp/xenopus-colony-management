"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";

interface BinSummary {
  id: string;
  label: string;
  frog_count: number;
  capacity: number;
  status: string;
}

export default function ColonyPage() {
  const [bins, setBins] = useState<BinSummary[]>([]);
  const [totalFrogs, setTotalFrogs] = useState(0);
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
        .select("id, label, capacity, status, notes")
        .eq("organization_id", mem.organization_id)
        .order("label");

      if (locs) {
        const binData: BinSummary[] = [];
        let total = 0;
        for (const loc of locs) {
          const { count } = await supabase
            .from("frogs")
            .select("*", { count: "exact", head: true })
            .eq("current_location_id", loc.id);
          const fc = count ?? 0;
          total += fc;

          let displayStatus = fc === 0 ? "open" : "occupied";
          if (loc.notes === "open_for_receiving") displayStatus = "open";
          else if (loc.notes === "gp_source") displayStatus = "gp_source";
          if (loc.status === "inactive") displayStatus = "closed";

          binData.push({
            id: loc.id,
            label: loc.label,
            frog_count: fc,
            capacity: loc.capacity ?? 8,
            status: displayStatus,
          });
        }
        setBins(binData);
        setTotalFrogs(total);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="p-6"><p className="text-sm text-gray-500">Loading colony...</p></div>;
  }

  if (bins.length === 0) {
    return (
      <div className="p-6 lg:p-10">
        <h1 className="page-header">Whole Colony View</h1>
        <div className="mt-8 rounded-xl border-2 border-dashed border-gray-200 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-gray-900">No colony defined yet</h2>
          <p className="mt-2 text-sm text-gray-600">
            Set up your bins, add frogs, and start tracking the colony.
          </p>
          <a href="/onboarding" className="btn-primary mt-4 inline-block">Set up colony</a>
        </div>
      </div>
    );
  }

  const openBins = bins.filter((b) => b.status === "open");
  const occupiedBins = bins.filter((b) => b.status === "occupied");
  const gpBins = bins.filter((b) => b.status === "gp_source");

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-header">Whole Colony View</h1>
          <p className="page-subtitle">{bins.length} bins · {totalFrogs} frogs</p>
        </div>
        <div className="flex gap-2">
          <a href="/reports" className="btn-secondary hidden sm:inline-flex">Export CSV</a>
          <a href="/use" className="btn-primary">Log Use &amp; Rest</a>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-5">
        <StatTile label="Total Bins" value={bins.length} />
        <StatTile label="Total Frogs" value={totalFrogs} />
        <StatTile label="Open (receiving)" value={openBins.length} />
        <StatTile label="Occupied" value={occupiedBins.length} />
        <StatTile label="GP Source" value={gpBins.length} />
      </div>

      {/* All bins */}
      <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {bins.map((bin) => (
          <a key={bin.id} href={`/bins/${bin.id}`} className="card-flat flex items-center justify-between px-4 py-3 hover:shadow-card-hover transition-shadow">
            <div>
              <p className="text-sm font-semibold text-gray-900">{bin.label}</p>
              <p className="text-xs text-gray-500">{bin.frog_count}/{bin.capacity} frogs</p>
            </div>
            <StatusBadge status={bin.status} />
          </a>
        ))}
      </div>

      {/* Context notes */}
      <div className="mt-10 space-y-2 text-center text-xs text-gray-400">
        <p>Resting, ready, and overdue statuses will appear once use/rest events are logged.</p>
        <p>Photos stored now may support future photo-ID tools, but no automatic recognition is active yet.</p>
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; cls: string }> = {
    open: { label: "Open", cls: "bg-green-100 text-green-700" },
    assigned: { label: "Assigned Destination", cls: "bg-brand-100 text-brand-700" },
    occupied: { label: "Occupied", cls: "bg-blue-100 text-blue-700" },
    resting: { label: "Resting", cls: "bg-blue-100 text-blue-600" },
    ready: { label: "Ready", cls: "bg-green-100 text-green-700" },
    overdue: { label: "Overdue", cls: "bg-red-100 text-red-700" },
    gp_source: { label: "GP Source", cls: "bg-purple-100 text-purple-700" },
    closed: { label: "Closed", cls: "bg-gray-100 text-gray-600" },
    pending_confirmation: { label: "Pending Confirmation", cls: "bg-yellow-100 text-yellow-700" },
  };
  const s = cfg[status] ?? cfg.occupied;
  return <span className={`status-badge ${s.cls}`}>{s.label}</span>;
}
