"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
const TOTAL_STEPS = 10;

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Lab/workspace
  const [labName, setLabName] = useState("");
  const [labMode, setLabMode] = useState("research");
  const [contactEmail, setContactEmail] = useState("");

  // Step 2: Housing term
  const [housingTerm, setHousingTerm] = useState("bin");

  // Step 3: Number of starting bins
  const [binCount, setBinCount] = useState("12");

  // Step 4: Frog count per bin
  const [frogsPerBin, setFrogsPerBin] = useState("8");
  const [frogSex, setFrogSex] = useState("female");

  // Step 5: Starting date
  const [startingDate, setStartingDate] = useState(new Date().toISOString().split("T")[0]);

  // Step 6: Acclimation period
  const [acclimationDays, setAcclimationDays] = useState("7");

  // Step 7: Ready date rule
  const [readyAfterDays, setReadyAfterDays] = useState("7");

  // Step 9: Rest period rules
  const [restDays, setRestDays] = useState("90");
  const [overdueAfter, setOverdueAfter] = useState("180");

  // Step 10: Notification recipients
  const [notifyEmail, setNotifyEmail] = useState("");

  async function finishOnboarding() {
    setSaving(true);
    setError(null);

    try {
      const supabase = createBrowserSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }

      // 1. Create organization
      const { data: org, error: orgErr } = await supabase
        .from("organizations")
        .insert({
          name: labName,
          primary_lab_mode: labMode,
          contact_email: contactEmail || user.email,
          housing_term: housingTerm,
          enabled_modules: ["inventory", "rotation", "repopulation", "events", "performance", "notifications", "photos", "shipments"],
        })
        .select()
        .single();
      if (orgErr) throw orgErr;

      // 2. Create membership (owner)
      const { error: memErr } = await supabase
        .from("organization_memberships")
        .insert({ organization_id: org.id, user_id: user.id, role: "owner" });
      if (memErr) throw memErr;

      // 3. Create bins
      const count = parseInt(binCount) || 0;
      const locations = [];
      for (let i = 1; i <= count; i++) {
        locations.push({
          organization_id: org.id,
          name: `${housingTerm.charAt(0).toUpperCase() + housingTerm.slice(1)} ${i}`,
          location_type: housingTerm,
          target_count: parseInt(frogsPerBin) || 8,
          populated_date: startingDate,
          acclimation_days: parseInt(acclimationDays) || 7,
        });
      }
      if (locations.length > 0) {
        const { error: locErr } = await supabase.from("locations").insert(locations);
        if (locErr) throw locErr;
      }

      // 4. Create frogs distributed across bins
      const perBin = parseInt(frogsPerBin) || 0;
      if (perBin > 0 && count > 0) {
        const { data: locs } = await supabase
          .from("locations")
          .select("id")
          .eq("organization_id", org.id);
        const bins = locs ?? [];
        const frogs = [];
        for (let b = 0; b < bins.length; b++) {
          for (let f = 0; f < perBin; f++) {
            frogs.push({
              organization_id: org.id,
              species: "Xenopus laevis",
              sex: frogSex,
              current_location_id: bins[b].id,
              arrival_date: startingDate,
            });
          }
        }
        if (frogs.length > 0) {
          const { error: frogErr } = await supabase.from("frogs").insert(frogs);
          if (frogErr) throw frogErr;
        }
      }

      // 5. Rotation settings
      const { error: rotErr } = await supabase.from("rotation_settings").insert({
        organization_id: org.id,
        min_rest_days: parseInt(restDays) || 90,
        target_rest_days: parseInt(restDays) || 90,
        overdue_after_days: parseInt(overdueAfter) || 180,
        acclimation_days: parseInt(acclimationDays) || 7,
        ready_after_days: parseInt(readyAfterDays) || 7,
      });
      if (rotErr) throw rotErr;

      // 6. Notification rule
      const recipientEmail = notifyEmail || contactEmail || user.email;
      await supabase.from("notification_rules").insert({
        organization_id: org.id,
        rule_type: "rest_complete",
        channel: "email",
        recipient_email: recipientEmail,
        enabled: true,
      });

      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Setup failed. Please try again.");
      setSaving(false);
    }
  }

  const term = housingTerm;
  const termPlural = housingTerm + "s";
  const termCap = term.charAt(0).toUpperCase() + term.slice(1);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900">Set up your colony</h1>
        <p className="mt-1 text-sm text-gray-500">
          Set up {termPlural} → add frogs → log use → move to rest → get notified → reuse.
        </p>

        {/* Progress */}
        <div className="mt-6 flex gap-0.5">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${step > i ? "bg-brand-500" : "bg-gray-200"}`} />
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-400">Step {step} of {TOTAL_STEPS}</p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">1. Create your lab workspace</h2>
              <p className="text-sm text-gray-600">Your private colony register.</p>
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
              <Field label="Contact email" value={contactEmail} onChange={setContactEmail} placeholder="lab-manager@institution.edu" type="email" />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">2. What do you call your frog housing?</h2>
              <p className="text-sm text-gray-600">Choose the term your lab uses. This labels everything in the system.</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {["bin", "tank", "tub"].map((t) => (
                  <label key={t} className={`flex cursor-pointer items-center justify-center rounded-lg border p-4 text-sm font-medium ${housingTerm === t ? "border-brand-400 bg-brand-50 text-brand-700" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
                    <input type="radio" name="term" value={t} checked={housingTerm === t} onChange={() => setHousingTerm(t)} className="sr-only" />
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">3. How many starting {termPlural}?</h2>
              <p className="text-sm text-gray-600">How many {termPlural} are you populating to start?</p>
              <Field label={`Number of ${termPlural}`} value={binCount} onChange={setBinCount} placeholder="e.g. 12" type="number" />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">4. How many frogs per {term}?</h2>
              <p className="text-sm text-gray-600">Enter the starting count for each {term}.</p>
              <Field label={`Frogs per ${term}`} value={frogsPerBin} onChange={setFrogsPerBin} placeholder="e.g. 8" type="number" />
              <div>
                <label className="block text-sm font-medium text-gray-700">Sex</label>
                <select value={frogSex} onChange={(e) => setFrogSex(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm">
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
              <p className="text-xs text-gray-400">This creates {parseInt(binCount) * parseInt(frogsPerBin) || 0} frogs across {binCount} {termPlural}.</p>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">5. When were these {termPlural} populated?</h2>
              <p className="text-sm text-gray-600">The date frogs arrived or were placed into {termPlural}.</p>
              <Field label="Starting / arrival date" value={startingDate} onChange={setStartingDate} placeholder="" type="date" />
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">6. Acclimation period</h2>
              <p className="text-sm text-gray-600">How many days do frogs need to acclimate before first use?</p>
              <Field label="Acclimation days" value={acclimationDays} onChange={setAcclimationDays} placeholder="e.g. 7" type="number" />
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">7. Ready date rule</h2>
              <p className="text-sm text-gray-600">{termCap}s become &quot;ready&quot; after acclimation completes. Confirm or adjust.</p>
              <Field label="Ready after (days from arrival)" value={readyAfterDays} onChange={setReadyAfterDays} placeholder="e.g. 7" type="number" />
              <p className="text-xs text-gray-500">Your {termPlural} populated on {startingDate} will be ready on {new Date(new Date(startingDate).getTime() + parseInt(readyAfterDays) * 86400000).toLocaleDateString()}.</p>
            </div>
          )}

          {step === 8 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">8. Upload photos (optional)</h2>
              <p className="text-sm text-gray-600">
                Attach photos to {termPlural} or individual frogs. Photos are archive records now and may support future photo-ID tools.
              </p>
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                <p className="text-sm text-gray-500">Photo upload available after setup is complete.</p>
                <p className="mt-1 text-xs text-gray-400">Upload from the {termCap} detail page or Photos section.</p>
              </div>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                Upload photos now to build your colony archive. Future photo-ID tools may use these to help identify individual frogs.
              </div>
            </div>
          )}

          {step === 9 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">9. Rest period rules</h2>
              <p className="text-sm text-gray-600">After frogs are used, how long must they rest before reuse?</p>
              <Field label="Rest period (days)" value={restDays} onChange={setRestDays} placeholder="e.g. 90" type="number" />
              <Field label="Overdue after (days)" value={overdueAfter} onChange={setOverdueAfter} placeholder="e.g. 180" type="number" />
              <p className="text-xs text-gray-500">
                After use, frogs rest for {restDays} days. If not reused by {overdueAfter} days, they are flagged as overdue.
              </p>
            </div>
          )}

          {step === 10 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">10. Notification recipients</h2>
              <p className="text-sm text-gray-600">Who should be notified when a rest period completes?</p>
              <Field label="Email for notifications" value={notifyEmail} onChange={setNotifyEmail} placeholder="you@lab.edu" type="email" />
              <p className="text-xs text-gray-500">
                You&apos;ll receive notifications when {termPlural} are rest-complete, overdue, or ready to return to rotation. You can add more recipients later.
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
              onClick={() => setStep((s) => Math.min(TOTAL_STEPS, s + 1) as Step)}
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
              {saving ? "Setting up..." : "Finish & Go to Dashboard"}
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
