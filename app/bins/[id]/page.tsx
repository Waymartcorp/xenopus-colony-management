"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";

// TODO: Query bin_cycle_status for rest timer / ready date
// TODO: Fetch performance_ratings for this bin
// TODO: Fetch frog_events history for this bin

interface BinDetail {
  id: string;
  name: string;
  room: string | null;
  target_count: number;
  frog_count: number;
  location_type: string;
}

interface FrogRow {
  id: string;
  species: string;
  sex: string | null;
  identifier_code: string | null;
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
        .select("id, name, room, target_count, location_type")
        .eq("id", binId)
        .single();

      if (!loc) { setLoading(false); return; }

      const { data: frogList, count } = await supabase
        .from("frogs")
        .select("id, species, sex, identifier_code", { count: "exact" })
        .eq("current_location_id", binId)
        .order("identifier_code");

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

  const status = bin.frog_count === 0 ? "open" : "occupied";

  return (
    <div className="p-6 lg:p-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500">
        <a href="/bins" className="hover:text-brand-600">Bins</a>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{bin.name}</span>
      </nav>

      {/* Header */}
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{bin.name}</h1>
          {bin.room && <p className="mt-1 text-sm text-gray-500">{bin.room}</p>}
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DetailStat label="Frogs" value={`${bin.frog_count} / ${bin.target_count}`} />
        <DetailStat label="Status" value={status === "open" ? "Open (receiving)" : "Occupied"} />
        <DetailStat label="Type" value={bin.location_type} />
        <DetailStat label="Capacity Available" value={String(bin.target_count - bin.frog_count)} />
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
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Species</th>
                  <th className="px-4 py-3">Sex</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {frogs.map((frog) => (
                  <tr key={frog.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-brand-600">
                      {frog.identifier_code || frog.id.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{frog.species}</td>
                    <td className="px-4 py-3 text-gray-600">{frog.sex || "—"}</td>
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

      {/* Event history */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">Use &amp; Event History</h2>
        <div className="mt-3 rounded-xl border-2 border-dashed border-gray-200 bg-white p-6 text-center">
          <p className="text-sm text-gray-500">No events recorded for this bin yet.</p>
          <p className="mt-1 text-xs text-gray-400">Events will appear here after frogs are used or transferred.</p>
        </div>
      </section>

      {/* Photo note */}
      <div className="mt-8 rounded-lg border border-gray-100 bg-gray-50 p-3 text-center text-xs text-gray-500">
        Photos stored now may support future photo-ID tools, but no automatic recognition is active yet.
      </div>
    </div>
  );
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
  };
  const labels: Record<string, string> = {
    open: "Open (receiving)",
    occupied: "Occupied",
    resting: "Resting",
    ready: "Ready for Use",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status] ?? styles.occupied}`}>
      {labels[status] ?? status}
    </span>
  );
}
