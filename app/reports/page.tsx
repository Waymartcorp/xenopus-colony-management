"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { arrayToCsv, downloadCsv, getDateFilter, type DateRange } from "@/lib/export-csv";

export default function ReportsPage() {
  const [exporting, setExporting] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [error, setError] = useState<string | null>(null);
  const [hasData, setHasData] = useState<boolean | null>(null);

  async function getOrgId() {
    const supabase = createBrowserSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: mem } = await supabase
      .from("organization_memberships")
      .select("organization_id")
      .eq("user_id", user.id)
      .limit(1)
      .single();
    return mem?.organization_id ?? null;
  }

  async function exportColonyCsv() {
    setExporting("colony");
    setError(null);
    try {
      const orgId = await getOrgId();
      if (!orgId) { setError("Not authenticated"); return; }

      const supabase = createBrowserSupabaseClient();

      const { data: org } = await supabase
        .from("organizations")
        .select("name")
        .eq("id", orgId)
        .single();

      const { data: frogs } = await supabase
        .from("frogs")
        .select("public_code, status, sex, species, current_location_id, arrival_date, notes, created_at")
        .eq("organization_id", orgId);

      if (!frogs || frogs.length === 0) {
        setHasData(false);
        return;
      }
      setHasData(true);

      const { data: locs } = await supabase
        .from("locations")
        .select("id, label, status, notes")
        .eq("organization_id", orgId);
      const locMap = new Map((locs ?? []).map((l) => [l.id, l]));

      const headers = [
        "Organization", "Bin", "Bin Status", "Frog Code", "Frog Status",
        "Sex", "Species", "Arrival Date", "Notes", "Created At"
      ];

      const rows = frogs.map((f) => {
        const loc = locMap.get(f.current_location_id);
        return [
          org?.name ?? "", loc?.label ?? "", loc?.status ?? "",
          f.public_code, f.status ?? "active", f.sex ?? "", f.species ?? "",
          f.arrival_date ?? "", f.notes ?? "", f.created_at ?? ""
        ];
      });

      const csv = arrayToCsv(headers, rows);
      downloadCsv(csv, `xenotrack-colony-${new Date().toISOString().split("T")[0]}.csv`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(null);
    }
  }

  async function exportBinSummaryCsv() {
    setExporting("bins");
    setError(null);
    try {
      const orgId = await getOrgId();
      if (!orgId) { setError("Not authenticated"); return; }

      const supabase = createBrowserSupabaseClient();

      const { data: locs } = await supabase
        .from("locations")
        .select("id, label, location_type, capacity, status, notes, created_at")
        .eq("organization_id", orgId)
        .order("label");

      if (!locs || locs.length === 0) {
        setHasData(false);
        return;
      }
      setHasData(true);

      // Get frog counts per bin
      const frogCounts: Record<string, number> = {};
      for (const loc of locs) {
        const { count } = await supabase
          .from("frogs")
          .select("*", { count: "exact", head: true })
          .eq("current_location_id", loc.id);
        frogCounts[loc.id] = count ?? 0;
      }

      // Get transfer stats per bin (as source)
      const { data: transfers } = await supabase
        .from("bin_transfer_events")
        .select("source_location_id, destination_location_id, frog_count, use_date, placement_status")
        .eq("organization_id", orgId);

      const headers = [
        "Bin Name", "Type", "Status", "Open/Receiving", "Current Frogs",
        "Capacity", "Frogs Removed", "Frogs Received", "Last Use Date", "Notes", "Created"
      ];

      const rows = locs.map((loc) => {
        const frogsRemoved = (transfers ?? [])
          .filter((t) => t.source_location_id === loc.id)
          .reduce((sum, t) => sum + t.frog_count, 0);
        const frogsReceived = (transfers ?? [])
          .filter((t) => t.destination_location_id === loc.id)
          .reduce((sum, t) => sum + t.frog_count, 0);
        const lastUse = (transfers ?? [])
          .filter((t) => t.source_location_id === loc.id)
          .sort((a, b) => b.use_date.localeCompare(a.use_date))[0]?.use_date ?? "";

        const receiving = loc.notes === "open_for_receiving" ? "Yes" : "No";

        return [
          loc.label, loc.location_type ?? "", loc.status ?? "", receiving,
          frogCounts[loc.id] ?? 0, loc.capacity ?? "", frogsRemoved, frogsReceived,
          lastUse, loc.notes ?? "", loc.created_at ?? ""
        ];
      });

      const csv = arrayToCsv(headers, rows);
      downloadCsv(csv, `xenotrack-bins-${new Date().toISOString().split("T")[0]}.csv`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(null);
    }
  }

  async function exportTransferHistoryCsv() {
    setExporting("transfers");
    setError(null);
    try {
      const orgId = await getOrgId();
      if (!orgId) { setError("Not authenticated"); return; }

      const supabase = createBrowserSupabaseClient();
      const dateFilter = getDateFilter(dateRange);

      let query = supabase
        .from("bin_transfer_events")
        .select("use_date, source_location_id, destination_location_id, frog_count, use_type, rest_started_at, rest_complete_at, placement_status, performance_note, notes, created_by, created_at")
        .eq("organization_id", orgId)
        .order("use_date", { ascending: false });

      if (dateFilter) {
        query = query.gte("use_date", dateFilter.split("T")[0]);
      }

      const { data: transfers } = await query;

      if (!transfers || transfers.length === 0) {
        setHasData(false);
        return;
      }
      setHasData(true);

      // Resolve bin labels
      const { data: locs } = await supabase
        .from("locations")
        .select("id, label")
        .eq("organization_id", orgId);
      const locMap = new Map((locs ?? []).map((l) => [l.id, l.label]));

      const headers = [
        "Use Date", "Source Bin", "Destination Bin", "Frogs Taken",
        "Use Type", "Rest Start", "Rest Complete", "Placement Status",
        "Performance Note", "Notes", "Created By", "Created At"
      ];

      const rows = transfers.map((t) => [
        t.use_date, locMap.get(t.source_location_id) ?? t.source_location_id,
        locMap.get(t.destination_location_id) ?? t.destination_location_id,
        t.frog_count, t.use_type, t.rest_started_at ?? "", t.rest_complete_at ?? "",
        t.placement_status, t.performance_note ?? "", t.notes ?? "",
        t.created_by ?? "", t.created_at ?? ""
      ]);

      const csv = arrayToCsv(headers, rows);
      downloadCsv(csv, `xenotrack-transfers-${new Date().toISOString().split("T")[0]}.csv`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(null);
    }
  }

  async function exportPerformanceCsv() {
    setExporting("performance");
    setError(null);
    try {
      const orgId = await getOrgId();
      if (!orgId) { setError("Not authenticated"); return; }

      const supabase = createBrowserSupabaseClient();
      const dateFilter = getDateFilter(dateRange);

      let query = supabase
        .from("bin_transfer_events")
        .select("use_date, source_location_id, destination_location_id, frog_count, use_type, performance_note, created_at")
        .eq("organization_id", orgId)
        .not("performance_note", "is", null)
        .order("use_date", { ascending: false });

      if (dateFilter) {
        query = query.gte("use_date", dateFilter.split("T")[0]);
      }

      const { data: records } = await query;

      if (!records || records.length === 0) {
        setHasData(false);
        return;
      }
      setHasData(true);

      const { data: locs } = await supabase
        .from("locations")
        .select("id, label")
        .eq("organization_id", orgId);
      const locMap = new Map((locs ?? []).map((l) => [l.id, l.label]));

      const headers = [
        "Date", "Source Bin", "Use Type", "Frogs", "Performance Note", "Created At"
      ];

      const rows = records.map((r) => [
        r.use_date, locMap.get(r.source_location_id) ?? r.source_location_id,
        r.use_type, r.frog_count, r.performance_note ?? "", r.created_at ?? ""
      ]);

      const csv = arrayToCsv(headers, rows);
      downloadCsv(csv, `xenotrack-performance-${new Date().toISOString().split("T")[0]}.csv`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(null);
    }
  }

  return (
    <div className="p-6 lg:p-10">
      <h1 className="page-header">Reports &amp; Export</h1>
      <p className="page-subtitle">
        Download your colony records as CSV for backup, analysis, or institutional reporting.
      </p>

      {/* Trust / reassurance */}
      <div className="mt-4 rounded-lg border border-brand-100 bg-brand-50/50 p-3 text-xs text-gray-600">
        Your lab can export its records at any time. XenoTrack is not intended to lock users into the system. Exports include only data from your workspace and are generated directly in your browser.
      </div>

      {/* Date range filter */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-gray-500">Date range:</span>
        {([["all", "All Time"], ["30d", "Last 30 Days"], ["90d", "Last 90 Days"], ["year", "This Year"]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setDateRange(key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${dateRange === key ? "bg-brand-600 text-white" : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Error/empty state */}
      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}
      {hasData === false && (
        <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-700">
          No records found for the selected range. Create bins and add frogs first, or adjust the date filter.
        </div>
      )}

      {/* Export cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <ExportCard
          title="Colony CSV"
          description="One row per frog: bin, status, code, species, arrival date, notes."
          icon="●"
          exporting={exporting === "colony"}
          onExport={exportColonyCsv}
        />
        <ExportCard
          title="Bin Summary CSV"
          description="One row per bin: status, frog count, capacity, frogs removed/received."
          icon="◫"
          exporting={exporting === "bins"}
          onExport={exportBinSummaryCsv}
        />
        <ExportCard
          title="Use / Transfer History CSV"
          description="One row per use event: source, destination, frogs taken, rest dates, status."
          icon="↻"
          exporting={exporting === "transfers"}
          onExport={exportTransferHistoryCsv}
        />
        <ExportCard
          title="Performance CSV"
          description="Use events with performance notes: bin, date, type, observations."
          icon="◈"
          exporting={exporting === "performance"}
          onExport={exportPerformanceCsv}
        />
      </div>

      {/* Info */}
      <div className="mt-8 rounded-xl border border-gray-100 bg-gray-50 p-5">
        <h3 className="text-sm font-semibold text-gray-800">About Exports</h3>
        <ul className="mt-2 space-y-1 text-xs text-gray-600">
          <li>Exports include only data from your workspace (organization).</li>
          <li>Date filters apply to transfer history and performance exports.</li>
          <li>CSV files open in Excel, Google Sheets, R, Python, and most analysis tools.</li>
          <li>Your data is never shared across organizations.</li>
        </ul>
      </div>
    </div>
  );
}

function ExportCard({ title, description, icon, exporting, onExport }: {
  title: string;
  description: string;
  icon: string;
  exporting: boolean;
  onExport: () => void;
}) {
  return (
    <div className="card-flat overflow-hidden">
      <div className="flex items-start gap-4 p-5">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="mt-1 text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-3">
        <button
          onClick={onExport}
          disabled={exporting}
          className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-brand-700 active:scale-[0.98] disabled:opacity-50"
        >
          {exporting ? "Exporting..." : "Download CSV"}
        </button>
      </div>
    </div>
  );
}
