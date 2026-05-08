"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";

interface BinOption {
  id: string;
  label: string;
  frog_count: number;
  capacity: number;
  receiving_status: string;
}

type Step = "source" | "count" | "type" | "date" | "destination" | "confirm" | "done";

export default function LogUsePage() {
  const [step, setStep] = useState<Step>("source");
  const [bins, setBins] = useState<BinOption[]>([]);
  const [orgId, setOrgId] = useState<string>("");
  const [restDays, setRestDays] = useState(90);
  const [loading, setLoading] = useState(true);

  // Form state
  const [sourceBinId, setSourceBinId] = useState("");
  const [frogCount, setFrogCount] = useState("");
  const [useType, setUseType] = useState("");
  const [useDate, setUseDate] = useState(new Date().toISOString().split("T")[0]);
  const [performanceNote, setPerformanceNote] = useState("");
  const [destBinId, setDestBinId] = useState("");
  const [notifyEmail, setNotifyEmail] = useState("");

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
      setOrgId(mem.organization_id);

      // Get rotation settings
      const { data: rot } = await supabase
        .from("rotation_settings")
        .select("minimum_rest_days")
        .eq("organization_id", mem.organization_id)
        .limit(1)
        .single();
      if (rot) setRestDays(rot.minimum_rest_days ?? 90);

      // Get bins with frog counts
      const { data: locs } = await supabase
        .from("locations")
        .select("id, label, capacity, notes, status")
        .eq("organization_id", mem.organization_id)
        .order("label");

      if (locs) {
        const binData: BinOption[] = [];
        for (const loc of locs) {
          if (loc.status === "inactive") continue;
          const { count } = await supabase
            .from("frogs")
            .select("*", { count: "exact", head: true })
            .eq("current_location_id", loc.id);
          const fc = count ?? 0;
          const cap = loc.capacity ?? 8;
          let receivingStatus = fc === 0 ? "open" : "occupied";
          if (loc.notes === "open_for_receiving") receivingStatus = "open";
          binData.push({
            id: loc.id,
            label: loc.label,
            frog_count: fc,
            capacity: cap,
            receiving_status: receivingStatus,
          });
        }
        setBins(binData);
      }
      setLoading(false);
    }
    load();
  }, []);

  const sourceBin = bins.find((b) => b.id === sourceBinId);
  const destBin = bins.find((b) => b.id === destBinId);
  const restCompleteDate = new Date(new Date(useDate).getTime() + restDays * 86400000).toLocaleDateString();

  // Auto-recommend destination bin: open or has capacity, not the source bin
  const recommendedBins = bins
    .filter((b) => b.id !== sourceBinId && b.frog_count < b.capacity)
    .sort((a, b) => {
      // Prefer bins marked as "open" first, then by available capacity
      if (a.receiving_status === "open" && b.receiving_status !== "open") return -1;
      if (b.receiving_status === "open" && a.receiving_status !== "open") return 1;
      return a.frog_count - b.frog_count;
    });
  const recommended = recommendedBins[0];

  if (loading) {
    return <div className="p-6"><p className="text-sm text-gray-500">Loading...</p></div>;
  }

  if (bins.length === 0) {
    return (
      <div className="p-6 lg:p-10">
        <h1 className="page-header">Log Use &amp; Move to Rest</h1>
        <div className="mt-8 rounded-xl border-2 border-dashed border-gray-200 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-gray-900">No bins yet</h2>
          <p className="mt-2 text-sm text-gray-600">Create bins and add frogs before logging use.</p>
          <a href="/onboarding" className="btn-primary mt-4 inline-block">Set up colony</a>
        </div>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="p-6 lg:p-10">
        <div className="mx-auto max-w-xl">
          <div className="card overflow-hidden">
            <div className="border-l-4 border-green-500 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <span className="text-lg">✓</span>
              </div>
              <h1 className="mt-4 text-xl font-bold text-gray-900">Use Logged &amp; Transfer Complete</h1>
              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <p><strong>{frogCount} frogs</strong> taken from <strong>{sourceBin?.label}</strong> on <strong>{useDate}</strong> for <strong>{useType}</strong>.</p>
                <p>{sourceBin && parseInt(frogCount) ? `${sourceBin.frog_count - parseInt(frogCount)} frogs remain in ${sourceBin.label}.` : ""}</p>
                <p>Used frogs moved to <strong>{destBin?.label}</strong>.</p>
                <p>Rest complete on <strong>{restCompleteDate}</strong> ({restDays} days).</p>
                {notifyEmail && <p>Notifications scheduled for: {notifyEmail}</p>}
              </div>
              {performanceNote && (
                <div className="mt-3 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
                  <strong>Performance:</strong> {performanceNote}
                </div>
              )}
              <div className="mt-6 flex gap-3">
                <a href="/bins" className="btn-primary">View Bins</a>
                <button onClick={() => { setStep("source"); setSourceBinId(""); setFrogCount(""); }} className="btn-secondary">
                  Log Another Use
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const steps: Step[] = ["source", "count", "type", "date", "destination", "confirm"];

  return (
    <div className="p-6 lg:p-10">
      <h1 className="page-header">Log Use &amp; Move to Rest</h1>
      <p className="page-subtitle">Record which frogs were used and where they go to rest.</p>

      {/* Progress */}
      <div className="mt-6 flex gap-0.5">
        {steps.map((s, i) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full ${steps.indexOf(step) >= i ? "bg-brand-500" : "bg-gray-200"}`} />
        ))}
      </div>

      <div className="mt-8 mx-auto max-w-xl">
        <div className="card p-6">
          {step === "source" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">1. Select source bin</h2>
              <p className="text-sm text-gray-600">Which bin are frogs being taken from?</p>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {bins.filter((b) => b.frog_count > 0).map((b) => (
                  <label key={b.id} className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${sourceBinId === b.id ? "border-brand-400 bg-brand-50" : "border-gray-200 hover:bg-gray-50"}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="source" checked={sourceBinId === b.id} onChange={() => setSourceBinId(b.id)} className="h-4 w-4" />
                      <span className="text-sm font-medium text-gray-700">{b.label}</span>
                    </div>
                    <span className="font-mono text-xs text-gray-500">{b.frog_count} frogs</span>
                  </label>
                ))}
              </div>
              {bins.filter((b) => b.frog_count > 0).length === 0 && (
                <p className="text-sm text-gray-500">No bins have frogs yet. <a href="/frogs/add" className="text-brand-600 hover:underline">Add frogs first.</a></p>
              )}
            </div>
          )}

          {step === "count" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">2. How many frogs used?</h2>
              <p className="text-sm text-gray-600">From {sourceBin?.label} ({sourceBin?.frog_count} available)</p>
              <input type="number" value={frogCount} onChange={(e) => setFrogCount(e.target.value)} min="1" max={sourceBin?.frog_count} placeholder="Number of frogs" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm" />
              {sourceBin && frogCount && parseInt(frogCount) > 0 && (
                <p className="text-xs text-gray-500">{sourceBin.frog_count - parseInt(frogCount)} will remain in {sourceBin.label}</p>
              )}
            </div>
          )}

          {step === "type" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">3. Use type</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {["Injection", "Squeeze / oocyte extraction", "Breeding", "Other"].map((t) => (
                  <label key={t} className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors ${useType === t ? "border-brand-400 bg-brand-50" : "border-gray-200 hover:bg-gray-50"}`}>
                    <input type="radio" name="useType" checked={useType === t} onChange={() => setUseType(t)} className="h-4 w-4" />
                    <span className="text-sm text-gray-700">{t}</span>
                  </label>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Performance note (optional)</label>
                <textarea value={performanceNote} onChange={(e) => setPerformanceNote(e.target.value)} rows={2} placeholder="e.g. Good yield, ~2000 oocytes per frog" className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm" />
              </div>
            </div>
          )}

          {step === "date" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">4. Use date</h2>
              <input type="date" value={useDate} onChange={(e) => setUseDate(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm" />
              <p className="text-xs text-gray-500">Rest period: {restDays} days. Rest complete: {restCompleteDate}</p>
            </div>
          )}

          {step === "destination" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">5. Destination / rest bin</h2>
              <p className="text-sm text-gray-600">Where do the used frogs go to rest?</p>

              {/* Auto-recommendation */}
              {recommended && (
                <div className={`rounded-lg border-2 p-4 ${destBinId === recommended.id ? "border-brand-400 bg-brand-50" : "border-brand-200 bg-brand-50/50"}`}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">Recommended</p>
                  <div className="mt-1 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{recommended.label}</p>
                      <p className="text-xs text-gray-500">
                        {recommended.receiving_status === "open" ? "Open" : "Available"} · capacity: {recommended.capacity - recommended.frog_count} spots
                      </p>
                    </div>
                    <button
                      onClick={() => setDestBinId(recommended.id)}
                      className={destBinId === recommended.id ? "btn-primary text-xs px-3 py-1.5" : "btn-secondary text-xs px-3 py-1.5"}
                    >
                      {destBinId === recommended.id ? "Selected" : "Use this bin"}
                    </button>
                  </div>
                </div>
              )}

              {/* All options */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {bins.filter((b) => b.id !== sourceBinId).map((b) => (
                  <label key={b.id} className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${destBinId === b.id ? "border-brand-400 bg-brand-50" : "border-gray-200 hover:bg-gray-50"}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="dest" checked={destBinId === b.id} onChange={() => setDestBinId(b.id)} className="h-4 w-4" />
                      <span className="text-sm font-medium text-gray-700">{b.label}</span>
                    </div>
                    <span className="font-mono text-xs text-gray-500">{b.frog_count}/{b.capacity}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Notify when rest is complete</label>
                <input type="email" value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)} placeholder="email@lab.edu (defaults to you)" className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm" />
              </div>
            </div>
          )}

          {step === "confirm" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">6. Confirm</h2>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm space-y-2">
                <p><strong>Source:</strong> {sourceBin?.label}</p>
                <p><strong>Frogs used:</strong> {frogCount} (remaining: {sourceBin ? sourceBin.frog_count - parseInt(frogCount || "0") : 0})</p>
                <p><strong>Use type:</strong> {useType}</p>
                <p><strong>Date:</strong> {useDate}</p>
                {performanceNote && <p><strong>Performance:</strong> {performanceNote}</p>}
                <p><strong>Destination:</strong> {destBin?.label}</p>
                <p><strong>Rest complete:</strong> {restCompleteDate} ({restDays} days)</p>
                {notifyEmail && <p><strong>Notify:</strong> {notifyEmail}</p>}
              </div>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800">
                This will create linked records on both the source bin and destination bin.
                {notifyEmail && ` A notification will be sent when rest is complete.`}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => { const idx = steps.indexOf(step); if (idx > 0) setStep(steps[idx - 1]); }}
            disabled={step === "source"}
            className="btn-secondary disabled:opacity-30"
          >
            Back
          </button>
          {step === "confirm" ? (
            <button onClick={() => setStep("done")} className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700 active:scale-[0.98]">
              Confirm &amp; Save
            </button>
          ) : (
            <button
              onClick={() => { const idx = steps.indexOf(step); if (idx < steps.length - 1) setStep(steps[idx + 1]); }}
              className="btn-primary"
            >
              Continue
            </button>
          )}
        </div>
      </div>

      {/* Context note */}
      <p className="mt-8 text-center text-xs text-gray-400" suppressHydrationWarning>
        Organization: {orgId ? orgId.slice(0, 8) + "..." : "—"}
      </p>
    </div>
  );
}
