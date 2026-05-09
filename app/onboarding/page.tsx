"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
const TOTAL_STEPS = 8;

type BinStatus = "populated" | "open" | "gp_source" | "closed";

interface BinDef {
  label: string;
  status: BinStatus;
  startingFrogs: number;
  capacity: number;
}

const STATUS_OPTIONS: { value: BinStatus; label: string; description: string }[] = [
  { value: "populated", label: "Populated", description: "Contains frogs, ready for use" },
  { value: "open", label: "Open (receiving)", description: "Available to receive incoming orders or frogs after use" },
  { value: "gp_source", label: "GP source", description: "General population source bin" },
  { value: "closed", label: "Closed / hold", description: "Not in use" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedStep, setFailedStep] = useState<string | null>(null);

  // Step 1: Lab/workspace
  const [labName, setLabName] = useState("");
  const [labMode, setLabMode] = useState("research");

  // Step 2: Housing term + count
  const [housingTerm, setHousingTerm] = useState("bin");
  const [binCount, setBinCount] = useState("");
  const [namingPattern, setNamingPattern] = useState("simple");

  // Step 3: Bin naming/numbering — generated after step 2
  const [bins, setBins] = useState<BinDef[]>([]);

  // Step 4: Frog distribution (set in bin table)
  const [defaultFrogsPerBin, setDefaultFrogsPerBin] = useState("6");
  const [defaultCapacity, setDefaultCapacity] = useState("8");
  const [frogSex, setFrogSex] = useState("female");

  // Step 5: Arrival / start date
  const [startingDate, setStartingDate] = useState(new Date().toISOString().split("T")[0]);

  // Step 6: Rest/rotation rules
  const [restDays, setRestDays] = useState("90");
  const [overdueAfter, setOverdueAfter] = useState("135");
  const [minOpenRestBins, setMinOpenRestBins] = useState("10");
  const [groupingWindowDays, setGroupingWindowDays] = useState("2");

  // Step 7: Notifications
  const [notifyEmail, setNotifyEmail] = useState("");

  // Generate bin list from count + naming pattern
  function generateBins() {
    const count = parseInt(binCount) || 0;
    const cap = parseInt(defaultCapacity) || 8;
    const frogs = parseInt(defaultFrogsPerBin) || 0;
    const termCap = housingTerm.charAt(0).toUpperCase() + housingTerm.slice(1);
    const newBins: BinDef[] = [];
    for (let i = 1; i <= count; i++) {
      let label = `${termCap} ${i}`;
      if (namingPattern === "rack") label = `Rack 1 / ${termCap} ${i}`;
      if (namingPattern === "room_rack") label = `Room 1 / Rack 1 / ${termCap} ${i}`;
      newBins.push({
        label,
        status: "populated",
        startingFrogs: frogs,
        capacity: cap,
      });
    }
    setBins(newBins);
  }

  function updateBin(idx: number, field: keyof BinDef, value: string | number) {
    setBins((prev) => {
      const next = [...prev];
      if (field === "label") next[idx] = { ...next[idx], label: value as string };
      else if (field === "status") next[idx] = { ...next[idx], status: value as BinStatus };
      else if (field === "startingFrogs") next[idx] = { ...next[idx], startingFrogs: parseInt(value as string) || 0 };
      else if (field === "capacity") next[idx] = { ...next[idx], capacity: parseInt(value as string) || 0 };
      return next;
    });
  }

  function markOpenBins(count: number) {
    setBins((prev) => {
      const next = [...prev];
      for (let i = 0; i < next.length; i++) {
        if (i >= next.length - count) {
          next[i] = { ...next[i], status: "open", startingFrogs: 0 };
        } else {
          if (next[i].status === "open") next[i] = { ...next[i], status: "populated" };
        }
      }
      return next;
    });
  }

  async function finishOnboarding() {
    setSaving(true);
    setError(null);
    setFailedStep(null);

    function logStep(stepName: string, table: string, err: { message: string; code?: string; details?: string; hint?: string }) {
      console.error(`[onboarding] FAILED at "${stepName}" (table: ${table})`, {
        message: err.message,
        code: err.code,
        details: err.details,
        hint: err.hint,
      });
    }

    try {
      const supabase = createBrowserSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }

      // Check if user already has an org (from a previous partial attempt)
      let orgId: string;
      const { data: existingMem } = await supabase
        .from("organization_memberships")
        .select("organization_id")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (existingMem) {
        // Reuse existing org — update its name/mode
        orgId = existingMem.organization_id;
        setFailedStep("update_organization");
        const { error: updateErr } = await supabase
          .from("organizations")
          .update({
            name: labName,
            primary_lab_mode: labMode === "research" ? "extract" : labMode,
          })
          .eq("id", orgId);
        if (updateErr) {
          logStep("update_organization", "organizations", updateErr);
          throw new Error(`Update organization: ${updateErr.message}${updateErr.hint ? ` (hint: ${updateErr.hint})` : ""}`);
        }

        // Delete any existing locations/frogs for a clean re-setup
        setFailedStep("clean_existing_data");
        await supabase.from("frogs").delete().eq("organization_id", orgId);
        await supabase.from("locations").delete().eq("organization_id", orgId);
        await supabase.from("rotation_settings").delete().eq("organization_id", orgId);
        await supabase.from("notification_rules").delete().eq("organization_id", orgId);
        console.log("[onboarding] Reusing existing org:", orgId);
      } else {
        // Create new org + membership
        orgId = crypto.randomUUID();

        setFailedStep("create_organization");
        const { error: orgErr } = await supabase
          .from("organizations")
          .insert({
            id: orgId,
            name: labName,
            organization_type: "lab",
            primary_lab_mode: labMode === "research" ? "extract" : labMode,
          });
        if (orgErr) {
          logStep("create_organization", "organizations", orgErr);
          throw new Error(`Create organization: ${orgErr.message}${orgErr.hint ? ` (hint: ${orgErr.hint})` : ""}`);
        }

        setFailedStep("create_membership");
        const { error: memErr } = await supabase
          .from("organization_memberships")
          .insert({ organization_id: orgId, user_id: user.id, role: "owner" });
        if (memErr) {
          logStep("create_membership", "organization_memberships", memErr);
          throw new Error(`Create membership: ${memErr.message}${memErr.hint ? ` (hint: ${memErr.hint})` : ""}`);
        }
      }

      // Step 3: Create bins/locations (batch in groups of 20 for RLS reliability)
      setFailedStep("create_locations");
      const locationInserts = bins.map((b) => ({
        organization_id: orgId,
        location_type: housingTerm,
        label: b.label,
        capacity: b.capacity,
        status: b.status === "closed" ? "inactive" : "active",
        notes: b.status === "open" ? "open_for_receiving" : b.status === "gp_source" ? "gp_source" : null,
      }));
      if (locationInserts.length > 0) {
        for (let i = 0; i < locationInserts.length; i += 20) {
          const batch = locationInserts.slice(i, i + 20);
          const { error: locErr } = await supabase.from("locations").insert(batch);
          if (locErr) {
            logStep(`create_locations (batch ${Math.floor(i / 20) + 1})`, "locations", locErr);
            throw new Error(`Create locations batch ${Math.floor(i / 20) + 1}: ${locErr.message}${locErr.hint ? ` (hint: ${locErr.hint})` : ""}`);
          }
        }
      }

      // Step 4: Get created locations back (to link frogs)
      setFailedStep("read_locations");
      const { data: createdLocs, error: readLocErr } = await supabase
        .from("locations")
        .select("id, label, capacity")
        .eq("organization_id", orgId)
        .order("label");
      if (readLocErr) {
        logStep("read_locations", "locations", readLocErr);
        throw new Error(`Read locations: ${readLocErr.message}`);
      }
      const locMap = new Map<string, string>();
      (createdLocs ?? []).forEach((l) => locMap.set(l.label, l.id));

      // Step 5: Create frog records for populated bins
      setFailedStep("create_frogs");
      const frogInserts: { organization_id: string; public_code: string; sex: string; current_location_id: string; status: string }[] = [];
      let frogCounter = 1;
      const codePrefix = `XT-${Date.now().toString(36).slice(-4).toUpperCase()}`;
      for (const b of bins) {
        if (b.startingFrogs > 0 && b.status !== "open" && b.status !== "closed") {
          const locId = locMap.get(b.label);
          if (!locId) continue;
          for (let f = 0; f < b.startingFrogs; f++) {
            frogInserts.push({
              organization_id: orgId,
              public_code: `${codePrefix}-${String(frogCounter).padStart(4, "0")}`,
              sex: frogSex,
              current_location_id: locId,
              status: "active",
            });
            frogCounter++;
          }
        }
      }
      if (frogInserts.length > 0) {
        for (let i = 0; i < frogInserts.length; i += 100) {
          const batch = frogInserts.slice(i, i + 100);
          const { error: frogErr } = await supabase.from("frogs").insert(batch);
          if (frogErr) {
            logStep("create_frogs", "frogs", frogErr);
            throw new Error(`Create frogs (batch ${Math.floor(i / 100) + 1}): ${frogErr.message}${frogErr.hint ? ` (hint: ${frogErr.hint})` : ""}`);
          }
        }
      }

      // Step 6: Rotation settings
      setFailedStep("create_rotation_settings");
      const rotPayload: Record<string, unknown> = {
        organization_id: orgId,
        minimum_rest_days: parseInt(restDays) || 90,
        target_rest_days: parseInt(restDays) || 90,
        overdue_after_days: parseInt(overdueAfter) || 135,
        preferred_reuse_window_start: parseInt(restDays) || 90,
        preferred_reuse_window_end: parseInt(overdueAfter) || 135,
        default_target_bin_capacity: parseInt(defaultCapacity) || 8,
        default_mode: labMode === "research" ? "extract" : labMode,
      };
      let { error: rotErr } = await supabase.from("rotation_settings").insert(rotPayload);
      if (rotErr?.message?.includes("minimum_open_rest_bins")) {
        // Column doesn't exist yet — retry without the extended columns
        const { error: retryErr } = await supabase.from("rotation_settings").insert(rotPayload);
        rotErr = retryErr;
      }
      if (rotErr) {
        logStep("create_rotation_settings", "rotation_settings", rotErr);
        throw new Error(`Create rotation settings: ${rotErr.message}${rotErr.hint ? ` (hint: ${rotErr.hint})` : ""}`);
      }

      // Step 7: Notification rule (if email provided)
      if (notifyEmail) {
        setFailedStep("create_notification_rule");
        const { error: notifErr } = await supabase.from("notification_rules").insert({
          organization_id: orgId,
          rule_type: "rest_complete",
          channel: "email",
          enabled: true,
          schedule: notifyEmail,
        });
        if (notifErr) {
          logStep("create_notification_rule", "notification_rules", notifErr);
          throw new Error(`Create notification rule: ${notifErr.message}${notifErr.hint ? ` (hint: ${notifErr.hint})` : ""}`);
        }
      }

      // Step 8: Create bin_cycle_status for each location (non-fatal — status is computed from transfers)
      try {
        const binCycleInserts = [];
        for (const b of bins) {
          const locId = locMap.get(b.label);
          if (!locId) continue;
          const cycleState = b.status === "open" ? "available" : "general_population";
          binCycleInserts.push({
            location_id: locId,
            current_cycle_state: cycleState,
            target_capacity: b.capacity,
            current_count: b.startingFrogs,
          });
        }
        if (binCycleInserts.length > 0) {
          const { error: bcsErr } = await supabase.from("bin_cycle_status").insert(binCycleInserts);
          if (bcsErr) {
            console.warn("[onboarding] bin_cycle_status insert skipped (non-fatal):", bcsErr.message);
          }
        }
      } catch (bcsError) {
        console.warn("[onboarding] bin_cycle_status step skipped:", bcsError);
      }

      // Verify colony was created before redirecting
      const { count: verifyCount } = await supabase
        .from("locations")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", orgId);

      if ((verifyCount ?? 0) === 0) {
        throw new Error("Colony creation appeared to succeed but no locations were found. Please check your database policies and try again.");
      }

      console.log("[onboarding] Colony created successfully:", { orgId, bins: verifyCount, frogs: frogInserts.length });
      window.location.href = "/dashboard";
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown setup error.";
      setError(msg);
      setSaving(false);
    }
  }

  const termCap = housingTerm.charAt(0).toUpperCase() + housingTerm.slice(1);
  const termPlural = housingTerm + "s";
  const populatedBins = bins.filter((b) => b.status === "populated" || b.status === "gp_source");
  const openBins = bins.filter((b) => b.status === "open");
  const totalFrogs = bins.reduce((sum, b) => sum + (b.status !== "open" && b.status !== "closed" ? b.startingFrogs : 0), 0);

  const STEP_LABELS = ["Lab", "Housing", "Configure", "Frogs", "Date", "Rest rules", "Notify", "Review"];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      {/* Subtle background pattern */}
      <div className="pattern-dots fixed inset-0 pointer-events-none opacity-40" />

      <div className="relative mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1" fill="white" opacity="0.9"/><rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.5"/><rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.5"/><rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.9"/></svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Set up your colony</h1>
            <p className="text-xs text-gray-500">
              Define {termPlural} → assign frogs → set rules → start tracking
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="mt-6 flex items-center gap-1">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div className={`h-1.5 w-full rounded-full transition-colors ${step > i ? "bg-brand-500" : step === i + 1 ? "bg-brand-300" : "bg-gray-200"}`} />
              <span className={`hidden sm:block text-[10px] font-medium ${step === i + 1 ? "text-brand-600" : "text-gray-400"}`}>
                {STEP_LABELS[i]}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-400 sm:hidden">Step {step}: {STEP_LABELS[step - 1]}</p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <p className="font-medium">Setup error</p>
            <p className="mt-1">{error}</p>
            {failedStep && <p className="mt-1 text-xs text-red-500">Failed at: {failedStep}</p>}
          </div>
        )}

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
          {/* Step 1: Lab info */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">1. Create your lab workspace</h2>
              <p className="text-sm text-gray-600">Your private colony register. All data stays within your workspace.</p>
              <Field label="Lab / workspace name" value={labName} onChange={setLabName} placeholder="e.g. Smith Lab Colony" />
              <div>
                <label className="block text-sm font-medium text-gray-700">Primary lab mode</label>
                <select value={labMode} onChange={(e) => setLabMode(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm">
                  <option value="research">Research (oocytes, extracts, embryos)</option>
                  <option value="teaching">Teaching</option>
                  <option value="breeding">Breeding</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Housing term + count + naming pattern */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">2. Define your housing</h2>
              <p className="text-sm text-gray-600">What do you call your frog housing, and how many do you have?</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {["bin", "tank", "tub"].map((t) => (
                  <label key={t} className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 text-sm font-medium ${housingTerm === t ? "border-brand-400 bg-brand-50 text-brand-700" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
                    <input type="radio" name="term" value={t} checked={housingTerm === t} onChange={() => setHousingTerm(t)} className="sr-only" />
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </label>
                ))}
              </div>
              <Field label={`Total number of ${termPlural}`} value={binCount} onChange={setBinCount} placeholder="e.g. 30" type="number" />
              <div>
                <label className="block text-sm font-medium text-gray-700">Naming pattern</label>
                <select value={namingPattern} onChange={(e) => setNamingPattern(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm">
                  <option value="simple">{termCap} 1, {termCap} 2, {termCap} 3...</option>
                  <option value="rack">Rack 1 / {termCap} 1, Rack 1 / {termCap} 2...</option>
                  <option value="room_rack">Room 1 / Rack 1 / {termCap} 1...</option>
                </select>
              </div>
              <Field label="Default target capacity per bin" value={defaultCapacity} onChange={setDefaultCapacity} placeholder="e.g. 8" type="number" />
              <Field label="Default starting frogs per populated bin" value={defaultFrogsPerBin} onChange={setDefaultFrogsPerBin} placeholder="e.g. 6" type="number" />
            </div>
          )}

          {/* Step 3: Bin naming and status table */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">3. Name and configure each {housingTerm}</h2>
              <p className="text-sm text-gray-600">
                Edit labels, set starting status, and adjust frog counts. Mark bins as &quot;Open&quot; if they should receive incoming orders or frogs returning from use.
              </p>

              {/* Quick actions */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => markOpenBins(Math.ceil(bins.length / 2))}
                  className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  Mark last half as Open
                </button>
                <button
                  onClick={() => markOpenBins(Math.ceil(bins.length / 3))}
                  className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  Mark last third as Open
                </button>
              </div>

              {/* Bin table */}
              <div className="max-h-[28rem] overflow-y-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gray-50 text-xs font-medium uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="px-3 py-2 text-left">#</th>
                      <th className="px-3 py-2 text-left">Label</th>
                      <th className="px-3 py-2 text-left">Status</th>
                      <th className="px-3 py-2 text-right">Frogs</th>
                      <th className="px-3 py-2 text-right">Capacity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bins.map((b, idx) => (
                      <tr key={idx} className={b.status === "open" ? "bg-green-50/40" : ""}>
                        <td className="px-3 py-2 text-gray-400">{idx + 1}</td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={b.label}
                            onChange={(e) => updateBin(idx, "label", e.target.value)}
                            className="w-full rounded border border-gray-200 px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <select
                            value={b.status}
                            onChange={(e) => updateBin(idx, "status", e.target.value)}
                            className="rounded border border-gray-200 px-2 py-1 text-xs"
                          >
                            {STATUS_OPTIONS.map((o) => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <input
                            type="number"
                            value={b.status === "open" || b.status === "closed" ? 0 : b.startingFrogs}
                            onChange={(e) => updateBin(idx, "startingFrogs", e.target.value)}
                            disabled={b.status === "open" || b.status === "closed"}
                            min="0"
                            className="w-16 rounded border border-gray-200 px-2 py-1 text-right text-sm disabled:bg-gray-50 disabled:text-gray-400"
                          />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <input
                            type="number"
                            value={b.capacity}
                            onChange={(e) => updateBin(idx, "capacity", e.target.value)}
                            min="1"
                            className="w-16 rounded border border-gray-200 px-2 py-1 text-right text-sm"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                <strong>{bins.length}</strong> {termPlural} — <strong>{populatedBins.length}</strong> populated, <strong>{openBins.length}</strong> open for receiving · <strong>{totalFrogs}</strong> starting frogs
              </div>

              {/* Reserve-bin warning */}
              {openBins.length < (parseInt(minOpenRestBins) || 10) && bins.length > 0 && (
                <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
                  <strong>Warning:</strong> XenoTrack recommends keeping at least {minOpenRestBins || 10} {termPlural} open for rest/receiving.
                  Used frogs need destination {termPlural} after use. You currently have {openBins.length} open.
                </div>
              )}
            </div>
          )}

          {/* Step 4: Frog sex + details */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">4. Frog details</h2>
              <p className="text-sm text-gray-600">Default attributes for the starting frog records. You can edit individual frogs later.</p>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sex</label>
                <select value={frogSex} onChange={(e) => setFrogSex(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm">
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                <p><strong>{totalFrogs} frogs</strong> will be created across <strong>{populatedBins.length}</strong> populated {termPlural}.</p>
                <p className="mt-1 text-xs text-gray-400">Each frog gets a unique code (e.g. XT-A1B2-0001). You can add individual names and photos later.</p>
              </div>
            </div>
          )}

          {/* Step 5: Arrival date */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">5. When were frogs placed in {termPlural}?</h2>
              <p className="text-sm text-gray-600">The date frogs arrived or were placed into {termPlural}. Used for acclimation tracking.</p>
              <Field label="Starting / arrival date" value={startingDate} onChange={setStartingDate} placeholder="" type="date" />
            </div>
          )}

          {/* Step 6: Rest/rotation rules */}
          {step === 6 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">6. Rest &amp; rotation rules</h2>
              <p className="text-sm text-gray-600">After frogs are used, how long must they rest before reuse?</p>
              <Field label="Minimum rest period (days)" value={restDays} onChange={setRestDays} placeholder="e.g. 90" type="number" />
              <Field label="Flag as overdue after (days)" value={overdueAfter} onChange={setOverdueAfter} placeholder="e.g. 135" type="number" />
              <Field label="Minimum open rest bins (recommended)" value={minOpenRestBins} onChange={setMinOpenRestBins} placeholder="e.g. 10" type="number" />
              <Field label="Rest-bin grouping window (days)" value={groupingWindowDays} onChange={setGroupingWindowDays} placeholder="e.g. 2" type="number" />
              <p className="text-xs text-gray-500">
                Rest period: {restDays || "—"} days. Overdue after: {overdueAfter || "—"} days.
                Keep at least {minOpenRestBins || 10} bins open for receiving.
                Frogs from the same source bin used within {groupingWindowDays || 2} days may share a rest bin.
              </p>
            </div>
          )}

          {/* Step 7: Notifications */}
          {step === 7 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">7. Notification recipients</h2>
              <p className="text-sm text-gray-600">Who should be notified when bins are rest-complete or need attention?</p>
              <Field label="Email for notifications" value={notifyEmail} onChange={setNotifyEmail} placeholder="you@lab.edu" type="email" />
              <p className="text-xs text-gray-500">
                Leave blank to skip. You can add notification recipients later.
              </p>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                Photos stored now may support future photo-ID tools, but no automatic recognition is active yet.
                You can upload photos from any bin detail page after setup.
              </div>
            </div>
          )}

          {/* Step 8: Review */}
          {step === 8 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">8. Review &amp; create colony</h2>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm space-y-2">
                <p><strong>Lab:</strong> {labName || "—"}</p>
                <p><strong>Mode:</strong> {labMode}</p>
                <p><strong>Total {termPlural}:</strong> {bins.length}</p>
                <p><strong>Populated starting {termPlural}:</strong> {populatedBins.length}</p>
                <p><strong>Open receiving/rest {termPlural}:</strong> {openBins.length}</p>
                <p><strong>Starting frogs:</strong> {totalFrogs}</p>
                <p><strong>Frog sex:</strong> {frogSex}</p>
                <p><strong>Arrival/start date:</strong> {startingDate}</p>
                <p><strong>Rest period:</strong> {restDays} days (overdue after {overdueAfter})</p>
                <p><strong>Notifications:</strong> {notifyEmail || "Not configured (add later)"}</p>
              </div>
              <p className="text-xs text-gray-500">
                After setup, you can edit individual bin labels, add frog photos, adjust statuses, and start logging use events.
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1) as Step)}
            disabled={step === 1}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-30"
          >
            Back
          </button>
          {step < TOTAL_STEPS ? (
            <button
              onClick={() => {
                if (step === 2) generateBins();
                setStep((s) => Math.min(TOTAL_STEPS, s + 1) as Step);
              }}
              disabled={step === 1 && !labName}
              className="rounded-lg bg-brand-600 px-6 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={finishOnboarding}
              disabled={saving || !labName || bins.length === 0}
              className="rounded-lg bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? "Creating colony..." : "Create Colony"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm" />
    </div>
  );
}
