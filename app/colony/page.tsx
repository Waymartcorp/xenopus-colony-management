"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";

interface BinSummary {
  id: string;
  label: string;
  frog_count: number;
  capacity: number;
  status: string;
  destFrom?: string;
  restComplete?: string;
  daysRemaining?: number;
}

interface ActiveMovement {
  sourceLabel: string;
  destLabel: string;
  frogCount: number;
  useDate: string;
  restComplete: string;
}

export default function ColonyPage() {
  const [bins, setBins] = useState<BinSummary[]>([]);
  const [totalFrogs, setTotalFrogs] = useState(0);
  const [movements, setMovements] = useState<ActiveMovement[]>([]);
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

      const orgId = mem.organization_id;

      const { data: locs } = await supabase
        .from("locations")
        .select("id, label, capacity, status, notes")
        .eq("organization_id", orgId)
        .order("label");

      // Get active transfers for cycle status computation
      const { data: transfers } = await supabase
        .from("bin_transfer_events")
        .select("source_location_id, destination_location_id, frog_count, use_date, rest_complete_at, placement_status")
        .eq("organization_id", orgId)
        .order("use_date", { ascending: false });

      const locMap = new Map((locs ?? []).map((l) => [l.id, l.label]));

      // Build dest bin → latest transfer map
      const destTransferMap = new Map<string, { sourceLabel: string; restComplete: string; frogCount: number; useDate: string }>();
      for (const t of transfers ?? []) {
        if (!destTransferMap.has(t.destination_location_id)) {
          destTransferMap.set(t.destination_location_id, {
            sourceLabel: locMap.get(t.source_location_id) ?? "Unknown",
            restComplete: t.rest_complete_at ?? "",
            frogCount: t.frog_count,
            useDate: t.use_date,
          });
        }
      }

      if (locs) {
        // Single query: get frog counts grouped by location
        const { data: frogCounts } = await supabase
          .from("frogs")
          .select("current_location_id")
          .eq("organization_id", orgId);
        const frogCountMap = new Map<string, number>();
        let total = 0;
        for (const f of frogCounts ?? []) {
          frogCountMap.set(f.current_location_id, (frogCountMap.get(f.current_location_id) ?? 0) + 1);
          total++;
        }

        const binData: BinSummary[] = [];
        for (const loc of locs) {
          const fc = frogCountMap.get(loc.id) ?? 0;

          // Compute cycle status from transfer data
          let displayStatus = fc === 0 ? "open" : "occupied";
          if (loc.notes === "open_for_receiving") displayStatus = "open";
          else if (loc.notes === "gp_source") displayStatus = "gp_source";
          if (loc.status === "inactive") displayStatus = "closed";

          const destInfo = destTransferMap.get(loc.id);
          let destFrom: string | undefined;
          let restComplete: string | undefined;
          let daysRemaining: number | undefined;

          if (destInfo && destInfo.restComplete) {
            const restDate = new Date(destInfo.restComplete);
            const now = new Date();
            daysRemaining = Math.ceil((restDate.getTime() - now.getTime()) / 86400000);
            restComplete = restDate.toLocaleDateString();
            destFrom = destInfo.sourceLabel;

            if (daysRemaining <= 0) {
              displayStatus = "ready";
            } else if (daysRemaining > 0) {
              displayStatus = "resting";
            }
          }

          binData.push({ id: loc.id, label: loc.label, frog_count: fc, capacity: loc.capacity ?? 8, status: displayStatus, destFrom, restComplete, daysRemaining });
        }
        setBins(binData);
        setTotalFrogs(total);
      }

      // Active movements (recent, not yet complete)
      const activeMovements: ActiveMovement[] = [];
      for (const t of (transfers ?? []).slice(0, 10)) {
        if (t.rest_complete_at && new Date(t.rest_complete_at) > new Date()) {
          activeMovements.push({
            sourceLabel: locMap.get(t.source_location_id) ?? "?",
            destLabel: locMap.get(t.destination_location_id) ?? "?",
            frogCount: t.frog_count,
            useDate: t.use_date,
            restComplete: new Date(t.rest_complete_at).toLocaleDateString(),
          });
        }
      }
      setMovements(activeMovements);

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
  const restingBins = bins.filter((b) => b.status === "resting");
  const readyBins = bins.filter((b) => b.status === "ready");
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
      <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatTile label="Total Bins" value={bins.length} />
        <StatTile label="Total Frogs" value={totalFrogs} />
        <StatTile label="Open" value={openBins.length} />
        <StatTile label="Resting" value={restingBins.length} />
        <StatTile label="Ready" value={readyBins.length} />
        <StatTile label="Occupied" value={occupiedBins.length} />
      </div>

      {/* Active source → destination movements */}
      {movements.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold text-gray-800">Active Movements</h2>
          <div className="mt-2 space-y-2">
            {movements.map((m, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-brand-100 bg-brand-50/50 px-4 py-2.5">
                <span className="text-xs font-bold text-brand-600">{m.sourceLabel}</span>
                <span className="text-gray-400">→</span>
                <span className="text-xs font-bold text-brand-600">{m.destLabel}</span>
                <span className="ml-auto text-[11px] text-gray-500">
                  {m.frogCount} frogs · {m.useDate} · rest complete {m.restComplete}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bins grouped by status */}
      {restingBins.length > 0 && (
        <BinGroup title="Resting" bins={restingBins} />
      )}
      {readyBins.length > 0 && (
        <BinGroup title="Ready (rest complete)" bins={readyBins} />
      )}
      {openBins.length > 0 && (
        <BinGroup title="Open / Receiving" bins={openBins} />
      )}
      {occupiedBins.length > 0 && (
        <BinGroup title="Populated / Active" bins={occupiedBins} />
      )}
      {gpBins.length > 0 && (
        <BinGroup title="GP Source" bins={gpBins} />
      )}
    </div>
  );
}

function BinGroup({ title, bins }: { title: string; bins: BinSummary[] }) {
  return (
    <section className="mt-6">
      <h2 className="text-sm font-semibold text-gray-700">{title} ({bins.length})</h2>
      <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {bins.map((bin) => (
          <a key={bin.id} href={`/bins/${bin.id}`} className="card-flat flex items-center justify-between px-4 py-3 hover:shadow-card-hover transition-shadow">
            <div>
              <p className="text-sm font-semibold text-gray-900">{bin.label}</p>
              <p className="text-xs text-gray-500">{bin.frog_count}/{bin.capacity} frogs</p>
              {bin.destFrom && (
                <p className="text-[10px] text-brand-600">From {bin.destFrom}</p>
              )}
              {bin.daysRemaining !== undefined && bin.daysRemaining > 0 && (
                <p className="text-[10px] text-gray-400">{bin.daysRemaining}d remaining · complete {bin.restComplete}</p>
              )}
              {bin.daysRemaining !== undefined && bin.daysRemaining <= 0 && (
                <p className="text-[10px] text-green-600">Rest complete</p>
              )}
            </div>
            <StatusBadge status={bin.status} />
          </a>
        ))}
      </div>
    </section>
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
    assigned: { label: "Assigned", cls: "bg-brand-100 text-brand-700" },
    occupied: { label: "Populated", cls: "bg-blue-100 text-blue-700" },
    resting: { label: "Resting", cls: "bg-amber-100 text-amber-700" },
    ready: { label: "Ready", cls: "bg-green-100 text-green-700" },
    overdue: { label: "Overdue", cls: "bg-red-100 text-red-700" },
    gp_source: { label: "GP Source", cls: "bg-purple-100 text-purple-700" },
    closed: { label: "Closed", cls: "bg-gray-100 text-gray-600" },
  };
  const s = cfg[status] ?? cfg.occupied;
  return <span className={`status-badge ${s.cls}`}>{s.label}</span>;
}
