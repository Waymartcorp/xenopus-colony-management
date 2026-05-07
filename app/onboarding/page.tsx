"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Workspace
  const [labName, setLabName] = useState("");
  const [labMode, setLabMode] = useState("research");
  const [contactEmail, setContactEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Step 2: Housing
  const [binCount, setBinCount] = useState("12");
  const [namingConvention, setNamingConvention] = useState("rack_bin");
  const [targetPerBin, setTargetPerBin] = useState("8");
  const [rooms, setRooms] = useState("");

  // Step 3: Frogs
  const [frogMethod, setFrogMethod] = useState("bulk");
  const [bulkCount, setBulkCount] = useState("0");
  const [frogSex, setFrogSex] = useState("female");

  // Step 5: Rotation
  const [minRest, setMinRest] = useState("90");
  const [targetRest, setTargetRest] = useState("120");
  const [overdueAfter, setOverdueAfter] = useState("180");
  const [usesPerMonth, setUsesPerMonth] = useState("4");

  // Step 6: Notifications
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [summaryFreq, setSummaryFreq] = useState("weekly");

  async function finishOnboarding() {
    setSaving(true);
    setError(null);

    try {
      const supabase = createBrowserSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }

      // 1. Create organization
      const { data: org, error: orgErr } = await supabase
        .from("organizations")
        .insert({
          name: labName,
          primary_lab_mode: labMode,
          contact_email: contactEmail || user.email,
          phone: phone || null,
          enabled_modules: ["inventory", "rotation", "repopulation", "events", "performance", "notifications", "photos", "shipments"],
        })
        .select()
        .single();

      if (orgErr) throw orgErr;

      // 2. Create membership (owner)
      const { error: memErr } = await supabase
        .from("organization_memberships")
        .insert({
          organization_id: org.id,
          user_id: user.id,
          role: "owner",
        });

      if (memErr) throw memErr;

      // 3. Create locations (bins)
      const count = parseInt(binCount) || 0;
      const roomList = rooms.split(",").map((r) => r.trim()).filter(Boolean);
      const locations = [];

      for (let i = 1; i <= count; i++) {
        const room = roomList.length > 0 ? roomList[(i - 1) % roomList.length] : "Room A";
        let label = `Bin ${i}`;
        if (namingConvention === "rack_bin") {
          const rack = Math.ceil(i / 6);
          const bin = ((i - 1) % 6) + 1;
          label = `Rack ${rack} / Bin ${bin}`;
        } else if (namingConvention === "room_rack_bin") {
          const rack = Math.ceil(i / 6);
          const bin = ((i - 1) % 6) + 1;
          label = `${room} / Rack ${rack} / Bin ${bin}`;
        }

        locations.push({
          organization_id: org.id,
          name: label,
          room: room,
          location_type: "bin",
          target_count: parseInt(targetPerBin) || 8,
        });
      }

      if (locations.length > 0) {
        const { error: locErr } = await supabase.from("locations").insert(locations);
        if (locErr) throw locErr;
      }

      // 4. Create frogs (bulk method)
      if (frogMethod === "bulk" && parseInt(bulkCount) > 0) {
        const { data: locs } = await supabase
          .from("locations")
          .select("id")
          .eq("organization_id", org.id)
          .limit(count);

        const frogs = [];
        const total = parseInt(bulkCount);
        const bins = locs ?? [];

        for (let i = 0; i < total; i++) {
          const bin = bins.length > 0 ? bins[i % bins.length] : null;
          frogs.push({
            organization_id: org.id,
            species: "Xenopus laevis",
            sex: frogSex,
            current_location_id: bin?.id ?? null,
          });
        }

        if (frogs.length > 0) {
          const { error: frogErr } = await supabase.from("frogs").insert(frogs);
          if (frogErr) throw frogErr;
        }
      }

      // 5. Save rotation settings
      const { error: rotErr } = await supabase.from("rotation_settings").insert({
        organization_id: org.id,
        min_rest_days: parseInt(minRest) || 90,
        target_rest_days: parseInt(targetRest) || 120,
        overdue_after_days: parseInt(overdueAfter) || 180,
        uses_per_month: parseInt(usesPerMonth) || 4,
      });

      if (rotErr) throw rotErr;

      // 6. Save notification preferences
      if (emailNotifs) {
        await supabase.from("notification_rules").insert({
          organization_id: org.id,
          rule_type: "rest_complete",
          channel: "email",
          frequency: summaryFreq,
          enabled: true,
        });
      }

      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Setup failed. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900">Set up your colony</h1>
        <p className="mt-1 text-sm text-gray-500">
          Complete these steps to start tracking your frogs and bins.
        </p>

        {/* Progress */}
        <div className="mt-6 flex gap-1">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full ${step >= s ? "bg-brand-500" : "bg-gray-200"}`}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-400">Step {step} of 6</p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">1. Create your lab workspace</h2>
              <p className="text-sm text-gray-600">
                This is your private colony register. Only people you invite will have access.
              </p>
              <Field label="Lab / workspace name" value={labName} onChange={setLabName} placeholder="e.g. Smith Lab, Building 4 Colony" />
              <div>
                <label className="block text-sm font-medium text-gray-700">Primary lab mode</label>
                <select value={labMode} onChange={(e) => setLabMode(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm">
                  <option value="research">Research (oocytes, extracts, embryos)</option>
                  <option value="teaching">Teaching</option>
                  <option value="breeding">Breeding / husbandry</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
              <Field label="Contact email" value={contactEmail} onChange={setContactEmail} placeholder="lab-manager@institution.edu" type="email" />
              <Field label="Phone (optional)" value={phone} onChange={setPhone} placeholder="+1 555 000 0000" type="tel" />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">2. Set up your housing structure</h2>
              <p className="text-sm text-gray-600">
                Bins are the primary operating unit. How is your colony organized?
              </p>
              <Field label="Number of bins / tanks / tubs" value={binCount} onChange={setBinCount} placeholder="e.g. 24" type="number" />
              <div>
                <label className="block text-sm font-medium text-gray-700">Naming convention</label>
                <select value={namingConvention} onChange={(e) => setNamingConvention(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm">
                  <option value="rack_bin">Rack + Bin (e.g. Rack 1 / Bin 3)</option>
                  <option value="room_rack_bin">Room + Rack + Bin</option>
                  <option value="numbered">Simple numbered (Bin 1, Bin 2...)</option>
                  <option value="custom">Custom labels</option>
                </select>
              </div>
              <Field label="Target frogs per bin" value={targetPerBin} onChange={setTargetPerBin} placeholder="e.g. 8" type="number" />
              <div>
                <label className="block text-sm font-medium text-gray-700">Rooms (comma-separated, optional)</label>
                <input value={rooms} onChange={(e) => setRooms(e.target.value)} placeholder="e.g. Room A, Room B" className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">3. Add your first frogs</h2>
              <p className="text-sm text-gray-600">
                Populate your colony register. You can always add more later.
              </p>
              <div className="space-y-2">
                <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                  <input type="radio" name="frog_method" value="bulk" checked={frogMethod === "bulk"} onChange={() => setFrogMethod("bulk")} className="h-4 w-4" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Bulk add by count</p>
                    <p className="text-xs text-gray-500">Add a batch distributed across your bins.</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                  <input type="radio" name="frog_method" value="skip" checked={frogMethod === "skip"} onChange={() => setFrogMethod("skip")} className="h-4 w-4" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Skip for now</p>
                    <p className="text-xs text-gray-500">Add frogs manually later from the Frogs page.</p>
                  </div>
                </label>
              </div>
              {frogMethod === "bulk" && (
                <div className="mt-4 space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <Field label="Total frogs to add" value={bulkCount} onChange={setBulkCount} placeholder="e.g. 96" type="number" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sex</label>
                    <select value={frogSex} onChange={(e) => setFrogSex(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm">
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="mixed">Mixed (will be split evenly)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">4. Upload photos</h2>
              <p className="text-sm text-gray-600">
                Build your colony photo archive. Photos are stored with your
                frog and bin records.
              </p>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                Upload photos now to build your colony archive. Future photo-ID
                tools may use these records to help match individual frogs.
              </div>
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                <p className="text-sm text-gray-500">
                  Photo upload will be available after workspace is created.
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  You can upload photos from the Photos page or individual frog/bin records.
                </p>
              </div>
              <p className="text-xs text-gray-400">
                Skip this step and upload photos later — your archive is always available.
              </p>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">5. Set rest and use rules</h2>
              <p className="text-sm text-gray-600">
                XenoTrack tracks when bins are resting, ready, or overdue. Set your defaults.
              </p>
              <Field label="Minimum rest days" value={minRest} onChange={setMinRest} placeholder="e.g. 90" type="number" />
              <Field label="Target rest days" value={targetRest} onChange={setTargetRest} placeholder="e.g. 120" type="number" />
              <Field label="Overdue after (days)" value={overdueAfter} onChange={setOverdueAfter} placeholder="e.g. 180" type="number" />
              <Field label="Expected uses per month (colony-wide)" value={usesPerMonth} onChange={setUsesPerMonth} placeholder="e.g. 4" type="number" />
              <p className="text-xs text-gray-500">
                These values drive forecasting and overdue alerts. Change anytime in Workspace settings.
              </p>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">6. Notification preferences</h2>
              <p className="text-sm text-gray-600">
                Choose how XenoTrack alerts you about your colony.
              </p>
              <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                <input type="checkbox" checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email notifications</p>
                  <p className="text-xs text-gray-500">Bin ready, overdue, repopulation needed</p>
                </div>
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700">Summary frequency</label>
                <select value={summaryFreq} onChange={(e) => setSummaryFreq(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm">
                  <option value="daily">Daily summary</option>
                  <option value="weekly">Weekly summary</option>
                  <option value="monthly">Monthly summary</option>
                  <option value="none">No summaries</option>
                </select>
              </div>
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
          {step < 6 ? (
            <button
              onClick={() => setStep((s) => Math.min(6, s + 1) as Step)}
              className="rounded-lg bg-brand-600 px-6 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={finishOnboarding}
              disabled={saving || !labName}
              className="rounded-lg bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? "Setting up..." : "Finish Setup"}
            </button>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          You can always change these settings later in Workspace.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
      />
    </div>
  );
}
