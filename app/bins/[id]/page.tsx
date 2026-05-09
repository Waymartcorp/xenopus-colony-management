"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";

interface BinDetail {
  id: string;
  label: string;
  capacity: number;
  frog_count: number;
  location_type: string;
  status: string;
  notes: string | null;
  cycleStatus: string;
  restComplete?: string;
  daysRemaining?: number;
}

interface FrogRow {
  id: string;
  public_code: string;
  sex: string | null;
  status: string;
}

export default function BinDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [binId, setBinId] = useState<string>("");
  const [bin, setBin] = useState<BinDetail | null>(null);
  const [frogs, setFrogs] = useState<FrogRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => setBinId(p.id));
  }, [params]);

  useEffect(() => {
    if (!binId) return;
    async function load() {
      const supabase = createBrowserSupabaseClient();

      const { data: loc } = await supabase
        .from("locations")
        .select("id, label, capacity, location_type, status, notes")
        .eq("id", binId)
        .single();

      if (!loc) { setLoading(false); return; }

      const { data: frogList, count } = await supabase
        .from("frogs")
        .select("id, public_code, sex, status", { count: "exact" })
        .eq("current_location_id", binId)
        .order("public_code");

      const frogCount = count ?? 0;

      // Compute cycle status from transfers
      // Check if this bin is a destination for any active transfers
      const { data: destTransfers } = await supabase
        .from("bin_transfer_events")
        .select("rest_complete_at")
        .eq("destination_location_id", binId)
        .order("use_date", { ascending: false })
        .limit(1);

      let cycleStatus = "open";
      let restComplete: string | undefined;
      let daysRemaining: number | undefined;

      if (loc.status === "inactive") {
        cycleStatus = "closed";
      } else if (destTransfers && destTransfers.length > 0 && destTransfers[0].rest_complete_at) {
        const restDate = new Date(destTransfers[0].rest_complete_at);
        daysRemaining = Math.ceil((restDate.getTime() - Date.now()) / 86400000);
        restComplete = restDate.toLocaleDateString();
        if (daysRemaining > 0) cycleStatus = "resting";
        else cycleStatus = "ready";
      } else if (frogCount > 0) {
        cycleStatus = "populated";
      } else if (loc.notes === "open_for_receiving") {
        cycleStatus = "open";
      }

      setBin({ ...loc, frog_count: frogCount, cycleStatus, restComplete, daysRemaining });
      setFrogs(frogList ?? []);
      setLoading(false);
    }
    load();
  }, [binId]);

  if (loading) {
    return <div className="p-6"><p className="text-sm text-gray-500">Loading bin...</p></div>;
  }

  if (!bin) {
    return (
      <div className="p-6 lg:p-10">
        <p className="text-sm text-gray-500">Bin not found.</p>
        <a href="/bins" className="text-sm text-brand-600 hover:underline">Back to bins</a>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500">
        <a href="/bins" className="hover:text-brand-600">Bins</a>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{bin.label}</span>
      </nav>

      {/* Header */}
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{bin.label}</h1>
          <p className="mt-1 text-sm text-gray-500">{bin.location_type}</p>
        </div>
        <StatusBadge status={bin.cycleStatus} />
      </div>

      {/* Cycle status detail */}
      {bin.cycleStatus === "resting" && bin.daysRemaining && (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
          Resting — {bin.daysRemaining} days remaining · complete {bin.restComplete}
        </div>
      )}
      {bin.cycleStatus === "ready" && (
        <div className="mt-3 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-800">
          Rest complete — ready to return to rotation
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DetailStat label="Frogs" value={`${bin.frog_count} / ${bin.capacity ?? "—"}`} />
        <DetailStat label="Cycle Status" value={statusLabel(bin.cycleStatus)} />
        <DetailStat label="Type" value={bin.location_type} />
        <DetailStat label="Capacity Available" value={String((bin.capacity ?? 0) - bin.frog_count)} />
      </div>

      {/* Actions */}
      <section className="mt-6">
        <div className="flex flex-wrap gap-2">
          <a href="/use" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
            Log Use from This Bin
          </a>
          <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Upload Photo
          </button>
          <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Add Note
          </button>
        </div>
      </section>

      {/* Frogs in this bin */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Frogs in This Bin ({bin.frog_count})
        </h2>
        {frogs.length > 0 ? (
          <div className="mt-3 overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Sex</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {frogs.map((frog) => (
                  <tr key={frog.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-brand-600">
                      {frog.public_code}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{frog.sex || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{frog.status || "active"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-3 rounded-xl border-2 border-dashed border-gray-200 bg-white p-6 text-center">
            <p className="text-sm text-gray-500">No frogs in this bin.</p>
            <p className="mt-1 text-xs text-gray-400">This bin is open and available to receive frogs.</p>
          </div>
        )}
      </section>

      {/* Transfer history */}
      <TransferHistory binId={binId} />

      {/* Destination assignments */}
      <DestinationAssignments binId={binId} />

      {/* Record Completeness */}
      <RecordCompleteness binId={binId} frogCount={bin.frog_count} hasTransfers={false} />

      {/* Photo note */}
      <div className="mt-8 rounded-lg border border-gray-100 bg-gray-50 p-3 text-center text-xs text-gray-500">
        Photos stored now may support future photo-ID tools, but no automatic recognition is active yet.
      </div>
    </div>
  );
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    open: "Open (receiving)",
    occupied: "Occupied",
    resting: "Resting",
    ready: "Ready for Use",
    gp_source: "GP Source",
    closed: "Closed / Hold",
  };
  return labels[status] ?? status;
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    open: "bg-green-100 text-green-700",
    occupied: "bg-blue-100 text-blue-700",
    resting: "bg-blue-100 text-blue-600",
    ready: "bg-green-100 text-green-700",
    gp_source: "bg-purple-100 text-purple-700",
    closed: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status] ?? styles.occupied}`}>
      {statusLabel(status)}
    </span>
  );
}

function TransferHistory({ binId }: { binId: string }) {
  const [transfers, setTransfers] = useState<{ id: string; frog_count: number; use_type: string; use_date: string; placement_status: string; rest_started_at: string | null; rest_complete_at: string | null; performance_note: string | null; destination_location_id: string; source_location_id: string; dest_label?: string; source_label?: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!binId) return;
    async function load() {
      const supabase = createBrowserSupabaseClient();
      const { data } = await supabase
        .from("bin_transfer_events")
        .select("id, frog_count, use_type, use_date, placement_status, rest_started_at, rest_complete_at, performance_note, destination_location_id, source_location_id")
        .or(`source_location_id.eq.${binId},destination_location_id.eq.${binId}`)
        .order("use_date", { ascending: false })
        .limit(20);

      if (data && data.length > 0) {
        const locIds = new Set<string>();
        data.forEach((t) => { locIds.add(t.source_location_id); locIds.add(t.destination_location_id); });
        const { data: locs } = await supabase
          .from("locations")
          .select("id, label")
          .in("id", [...locIds]);
        const locMap = new Map((locs ?? []).map((l) => [l.id, l.label]));

        setTransfers(data.map((t) => ({
          ...t,
          source_label: locMap.get(t.source_location_id) ?? t.source_location_id,
          dest_label: locMap.get(t.destination_location_id) ?? t.destination_location_id,
        })));
      }
      setLoading(false);
    }
    load();
  }, [binId]);

  if (loading) return null;

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-gray-800">Transfer History</h2>
      {transfers.length > 0 ? (
        <div className="mt-3 space-y-2">
          {transfers.map((t) => {
            const isSource = t.source_location_id === binId;
            const otherBin = isSource ? t.dest_label : t.source_label;
            const restComplete = t.rest_complete_at ? new Date(t.rest_complete_at).toLocaleDateString() : null;
            const daysRemaining = t.rest_complete_at ? Math.max(0, Math.ceil((new Date(t.rest_complete_at).getTime() - Date.now()) / 86400000)) : null;

            return (
              <div key={t.id} className="flex items-start gap-3 rounded-lg border border-gray-100 bg-white px-4 py-3">
                <span className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${isSource ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                  {isSource ? "↑" : "↓"}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    <strong>{t.use_date}:</strong> {t.frog_count} frogs {isSource ? "removed" : "received"} — {t.use_type}
                  </p>
                  <p className="text-xs text-gray-600">
                    {isSource ? `Destination rest bin: ${otherBin}` : `From source bin: ${otherBin}`}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      t.placement_status === "confirmed" ? "bg-green-100 text-green-700" :
                      t.placement_status === "assigned" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>{t.placement_status}</span>
                    {restComplete && (
                      <span className="text-[10px] text-gray-500">
                        Rest complete: {restComplete}{daysRemaining !== null && daysRemaining > 0 ? ` (${daysRemaining}d remaining)` : daysRemaining === 0 ? " (ready)" : ""}
                      </span>
                    )}
                  </div>
                  {t.performance_note && (
                    <p className="mt-1 rounded bg-gray-50 px-2 py-1 text-xs text-gray-500">
                      Performance: {t.performance_note}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-3 rounded-xl border-2 border-dashed border-gray-200 bg-white p-6 text-center">
          <p className="text-sm text-gray-500">No transfers recorded for this bin yet.</p>
          <p className="mt-1 text-xs text-gray-400">Log use from this bin to create the first transfer record.</p>
        </div>
      )}
    </section>
  );
}

function DestinationAssignments({ binId }: { binId: string }) {
  const [receiving, setReceiving] = useState<{
    sourceLabel: string;
    frogCount: number;
    useDates: string[];
    restStart: string;
    restComplete: string;
    daysRemaining: number;
    placementStatus: string;
    isGrouped: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!binId) return;
    async function load() {
      const supabase = createBrowserSupabaseClient();

      // Get all transfers TO this bin
      const { data: transfers } = await supabase
        .from("bin_transfer_events")
        .select("source_location_id, frog_count, use_date, rest_started_at, rest_complete_at, placement_status, grouped_with_transfer_id")
        .eq("destination_location_id", binId)
        .order("use_date", { ascending: false })
        .limit(10);

      if (transfers && transfers.length > 0) {
        // Resolve source bin label from the most recent transfer
        const sourceId = transfers[0].source_location_id;
        const { data: sourceLoc } = await supabase
          .from("locations")
          .select("label")
          .eq("id", sourceId)
          .single();

        const totalFrogs = transfers.reduce((s, t) => s + t.frog_count, 0);
        const useDates = [...new Set(transfers.map((t) => t.use_date))];
        const restComplete = transfers[0].rest_complete_at ?? "";
        const restStart = transfers[0].rest_started_at ?? transfers[0].use_date;
        const daysRemaining = restComplete ? Math.max(0, Math.ceil((new Date(restComplete).getTime() - Date.now()) / 86400000)) : 0;
        const isGrouped = transfers.length > 1 || transfers.some((t) => t.grouped_with_transfer_id);

        setReceiving({
          sourceLabel: sourceLoc?.label ?? "Unknown",
          frogCount: totalFrogs,
          useDates,
          restStart,
          restComplete: restComplete ? new Date(restComplete).toLocaleDateString() : "—",
          daysRemaining,
          placementStatus: transfers[0].placement_status ?? "assigned",
          isGrouped,
        });
      }
      setLoading(false);
    }
    load();
  }, [binId]);

  if (loading || !receiving) return null;

  return (
    <section className="mt-6">
      <h2 className="text-sm font-semibold text-gray-800">Receiving / Rest Status</h2>
      <div className="mt-2 rounded-lg border-2 border-brand-200 bg-brand-50 p-4 text-sm">
        <p className="font-medium text-brand-800">
          Receiving/rest bin for frogs from {receiving.sourceLabel}
        </p>
        <div className="mt-2 grid gap-2 text-xs text-gray-700">
          <p>Received <strong>{receiving.frogCount} frogs</strong> on {receiving.useDates.join(", ")}</p>
          {receiving.isGrouped && (
            <p className="text-brand-600">Grouped rest cohort</p>
          )}
          <p>Rest started: {new Date(receiving.restStart).toLocaleDateString()}</p>
          <p>Rest complete: <strong>{receiving.restComplete}</strong></p>
          {receiving.daysRemaining > 0 ? (
            <p className="font-semibold text-amber-700">{receiving.daysRemaining} days remaining</p>
          ) : (
            <p className="font-semibold text-green-700">Rest complete — ready for rotation</p>
          )}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
            receiving.placementStatus === "confirmed" ? "bg-green-100 text-green-700" :
            receiving.placementStatus === "assigned" ? "bg-blue-100 text-blue-700" :
            "bg-yellow-100 text-yellow-700"
          }`}>
            Placement: {receiving.placementStatus}
          </span>
        </div>
      </div>
    </section>
  );
}

function RecordCompleteness({ binId, frogCount, hasTransfers }: { binId: string; frogCount: number; hasTransfers: boolean }) {
  const [items, setItems] = useState<{ label: string; status: "complete" | "missing" | "calculated" }[]>([]);

  useEffect(() => {
    async function check() {
      const supabase = createBrowserSupabaseClient();

      // Check if there are transfer events for this bin
      const { count: transferCount } = await supabase
        .from("bin_transfer_events")
        .select("*", { count: "exact", head: true })
        .or(`source_location_id.eq.${binId},destination_location_id.eq.${binId}`);

      const hasUseHistory = (transferCount ?? 0) > 0;

      // Check assignments
      const { count: assignCount } = await supabase
        .from("destination_bin_assignments")
        .select("*", { count: "exact", head: true })
        .eq("destination_location_id", binId);

      const hasAssignment = (assignCount ?? 0) > 0;

      const checks: { label: string; status: "complete" | "missing" | "calculated" }[] = [
        { label: "Frog count recorded", status: frogCount > 0 ? "complete" : "missing" },
        { label: "Use history", status: hasUseHistory ? "complete" : "missing" },
        { label: "Destination assignment", status: hasAssignment ? "complete" : "missing" },
        { label: "Rest date calculated", status: hasUseHistory ? "calculated" : "missing" },
        { label: "Photo archive", status: "missing" },
      ];

      setItems(checks);
    }
    check();
  }, [binId, frogCount]);

  if (items.length === 0) return null;

  const complete = items.filter((i) => i.status === "complete" || i.status === "calculated").length;

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-800">Record Completeness</h2>
        <span className="text-xs text-gray-400">{complete}/{items.length}</span>
      </div>
      <div className="mt-2 space-y-1">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2 py-1">
            <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${
              item.status === "complete" ? "bg-green-100 text-green-600" :
              item.status === "calculated" ? "bg-blue-100 text-blue-600" :
              "bg-gray-100 text-gray-400"
            }`}>
              {item.status === "complete" ? "✓" : item.status === "calculated" ? "∗" : "—"}
            </span>
            <span className={`text-xs ${item.status === "missing" ? "text-gray-400" : "text-gray-700"}`}>
              {item.label}
            </span>
            {item.status === "missing" && (
              <span className="text-[10px] text-gray-300">not yet recorded</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
