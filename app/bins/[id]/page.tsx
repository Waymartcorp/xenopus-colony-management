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

      setBin({ ...loc, frog_count: count ?? 0 });
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

  // Derive display status
  let displayStatus = "occupied";
  if (bin.notes === "open_for_receiving" || bin.frog_count === 0) displayStatus = "open";
  else if (bin.notes === "gp_source") displayStatus = "gp_source";
  if (bin.status === "inactive") displayStatus = "closed";

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
        <StatusBadge status={displayStatus} />
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DetailStat label="Frogs" value={`${bin.frog_count} / ${bin.capacity ?? "—"}`} />
        <DetailStat label="Status" value={statusLabel(displayStatus)} />
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
  const [transfers, setTransfers] = useState<{ id: string; frog_count: number; use_type: string; use_date: string; placement_status: string; rest_complete_at: string | null; performance_note: string | null; destination_location_id: string; source_location_id: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!binId) return;
    async function load() {
      const supabase = createBrowserSupabaseClient();
      // Get transfers where this bin is source OR destination
      const { data } = await supabase
        .from("bin_transfer_events")
        .select("id, frog_count, use_type, use_date, placement_status, rest_complete_at, performance_note, destination_location_id, source_location_id")
        .or(`source_location_id.eq.${binId},destination_location_id.eq.${binId}`)
        .order("use_date", { ascending: false })
        .limit(20);
      setTransfers(data ?? []);
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
            return (
              <div key={t.id} className="flex items-start gap-3 rounded-lg border border-gray-100 bg-white px-4 py-3">
                <span className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${isSource ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                  {isSource ? "↑" : "↓"}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    <strong>{t.frog_count} frogs</strong> {isSource ? "taken out" : "received"} — {t.use_type}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t.use_date} · Status: {t.placement_status}
                    {t.rest_complete_at && ` · Rest complete: ${new Date(t.rest_complete_at).toLocaleDateString()}`}
                  </p>
                  {t.performance_note && <p className="mt-1 text-xs text-gray-400">{t.performance_note}</p>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-3 rounded-xl border-2 border-dashed border-gray-200 bg-white p-6 text-center">
          <p className="text-sm text-gray-500">No transfers recorded for this bin yet.</p>
          <p className="mt-1 text-xs text-gray-400">Events will appear here after frogs are used or transferred.</p>
        </div>
      )}
    </section>
  );
}

function DestinationAssignments({ binId }: { binId: string }) {
  const [assignments, setAssignments] = useState<{ id: string; status: string; notification_status: string; confirmation_status: string; assigned_at: string; source_location_id: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!binId) return;
    async function load() {
      const supabase = createBrowserSupabaseClient();
      const { data } = await supabase
        .from("destination_bin_assignments")
        .select("id, status, notification_status, confirmation_status, assigned_at, source_location_id")
        .eq("destination_location_id", binId)
        .order("assigned_at", { ascending: false })
        .limit(10);
      setAssignments(data ?? []);
      setLoading(false);
    }
    load();
  }, [binId]);

  if (loading || assignments.length === 0) return null;

  return (
    <section className="mt-6">
      <h2 className="text-sm font-semibold text-gray-800">Destination Assignment</h2>
      <div className="mt-2 space-y-2">
        {assignments.map((a) => (
          <div key={a.id} className="rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium text-brand-700">
                {a.status === "assigned" ? "Assigned as destination" : a.status === "receiving" ? "Receiving frogs" : a.status === "resting" ? "Resting" : a.status}
              </span>
              <span className={`status-badge ${a.confirmation_status === "confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {a.confirmation_status === "confirmed" ? "Confirmed" : "Pending confirmation"}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-600">Assigned {new Date(a.assigned_at).toLocaleDateString()}</p>
          </div>
        ))}
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
