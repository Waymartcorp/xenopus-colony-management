"use client";

import { useState } from "react";

// TODO: Fetch real bins from Supabase locations table
// TODO: Submit use event + transfer to Supabase
// TODO: Start rest timer on destination bin
// TODO: Schedule notification for rest-complete date

const MOCK_BINS = [
  { id: "b1", name: "Bin 1", frogCount: 8, status: "available" },
  { id: "b2", name: "Bin 2", frogCount: 8, status: "available" },
  { id: "b3", name: "Bin 3", frogCount: 6, status: "available" },
  { id: "b4", name: "Bin 4", frogCount: 8, status: "resting" },
  { id: "b5", name: "Bin 5", frogCount: 8, status: "available" },
];

type UseStep = "source" | "count" | "type" | "date" | "performance" | "destination" | "confirm" | "done";

export default function LogUsePage() {
  const [step, setStep] = useState<UseStep>("source");
  const [sourceBin, setSourceBin] = useState("");
  const [frogCount, setFrogCount] = useState("");
  const [useType, setUseType] = useState("");
  const [useDate, setUseDate] = useState(new Date().toISOString().split("T")[0]);
  const [performanceNote, setPerformanceNote] = useState("");
  const [destBin, setDestBin] = useState("");
  const [createNewBin, setCreateNewBin] = useState(false);
  const [newBinName, setNewBinName] = useState("");
  const [notifyRecipients, setNotifyRecipients] = useState("");

  const sourceBinData = MOCK_BINS.find((b) => b.id === sourceBin);
  const restDays = 90; // TODO: Pull from rotation_settings
  const restCompleteDate = new Date(new Date(useDate).getTime() + restDays * 86400000).toLocaleDateString();

  if (step === "done") {
    return (
      <div className="p-6 lg:p-10">
        <div className="mx-auto max-w-xl rounded-xl border border-green-200 bg-green-50 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <span className="text-2xl">✓</span>
          </div>
          <h1 className="mt-4 text-xl font-bold text-gray-900">Use Logged & Transfer Complete</h1>
          <p className="mt-3 text-sm text-gray-700">
            <strong>{frogCount} frogs</strong> taken from <strong>{sourceBinData?.name}</strong> on <strong>{useDate}</strong> for <strong>{useType}</strong>.
            {sourceBinData && <> {sourceBinData.frogCount - parseInt(frogCount)} remain in source bin.</>}
          </p>
          <p className="mt-2 text-sm text-gray-700">
            Used frogs moved to <strong>{createNewBin ? newBinName : MOCK_BINS.find((b) => b.id === destBin)?.name}</strong>.
            Rest complete on <strong>{restCompleteDate}</strong>.
          </p>
          {notifyRecipients && (
            <p className="mt-2 text-sm text-gray-500">Notifications scheduled for: {notifyRecipients}</p>
          )}
          <div className="mt-6 flex justify-center gap-3">
            <a href="/bins" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
              View Bins
            </a>
            <button onClick={() => { setStep("source"); setSourceBin(""); setFrogCount(""); }} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Log Another Use
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold text-gray-900">Log Use & Move to Rest</h1>
      <p className="mt-1 text-sm text-gray-500">
        Record which frogs were used, from which bin, and where they go to rest.
      </p>

      {/* Progress */}
      <div className="mt-6 flex gap-0.5">
        {(["source", "count", "type", "date", "performance", "destination", "confirm"] as UseStep[]).map((s, i) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full ${(["source", "count", "type", "date", "performance", "destination", "confirm"] as UseStep[]).indexOf(step) >= i ? "bg-brand-500" : "bg-gray-200"}`} />
        ))}
      </div>

      <div className="mt-8 mx-auto max-w-xl rounded-xl border border-gray-200 bg-white p-6">
        {step === "source" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">1. Select source bin</h2>
            <p className="text-sm text-gray-600">Which bin are frogs being taken from?</p>
            <div className="space-y-2">
              {MOCK_BINS.filter((b) => b.status === "available").map((b) => (
                <label key={b.id} className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 ${sourceBin === b.id ? "border-brand-400 bg-brand-50" : "border-gray-200 hover:bg-gray-50"}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="source" value={b.id} checked={sourceBin === b.id} onChange={() => setSourceBin(b.id)} className="h-4 w-4" />
                    <span className="text-sm font-medium text-gray-700">{b.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{b.frogCount} frogs</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === "count" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">2. How many frogs used?</h2>
            <p className="text-sm text-gray-600">From {sourceBinData?.name} ({sourceBinData?.frogCount} available)</p>
            <input type="number" value={frogCount} onChange={(e) => setFrogCount(e.target.value)} min="1" max={sourceBinData?.frogCount} placeholder="e.g. 4" className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm" />
            <p className="text-xs text-gray-400">{sourceBinData && frogCount ? `${sourceBinData.frogCount - parseInt(frogCount)} will remain in ${sourceBinData.name}` : ""}</p>
          </div>
        )}

        {step === "type" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">3. Use type</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {["Injection", "Squeeze / oocyte extraction", "Breeding", "Other"].map((t) => (
                <label key={t} className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 ${useType === t ? "border-brand-400 bg-brand-50" : "border-gray-200 hover:bg-gray-50"}`}>
                  <input type="radio" name="useType" value={t} checked={useType === t} onChange={() => setUseType(t)} className="h-4 w-4" />
                  <span className="text-sm text-gray-700">{t}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === "date" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">4. Use date</h2>
            <input type="date" value={useDate} onChange={(e) => setUseDate(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm" />
          </div>
        )}

        {step === "performance" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">5. Performance note (optional)</h2>
            <p className="text-sm text-gray-600">Record yield, quality, or outcome.</p>
            <textarea value={performanceNote} onChange={(e) => setPerformanceNote(e.target.value)} rows={3} placeholder="e.g. Good oocyte yield, ~2000 per frog" className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm" />
            <p className="text-xs text-gray-400">You can add this later if not available now.</p>
          </div>
        )}

        {step === "destination" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">6. Destination / rest bin</h2>
            <p className="text-sm text-gray-600">Where do the used frogs go to rest?</p>
            <label className="flex items-center gap-2 rounded-lg border border-gray-200 p-3">
              <input type="checkbox" checked={createNewBin} onChange={(e) => setCreateNewBin(e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
              <span className="text-sm text-gray-700">Create a new rest bin</span>
            </label>
            {createNewBin ? (
              <input type="text" value={newBinName} onChange={(e) => setNewBinName(e.target.value)} placeholder="New bin name" className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm" />
            ) : (
              <div className="space-y-2">
                {MOCK_BINS.map((b) => (
                  <label key={b.id} className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 ${destBin === b.id ? "border-brand-400 bg-brand-50" : "border-gray-200 hover:bg-gray-50"}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="dest" value={b.id} checked={destBin === b.id} onChange={() => setDestBin(b.id)} className="h-4 w-4" />
                      <span className="text-sm font-medium text-gray-700">{b.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{b.status}</span>
                  </label>
                ))}
              </div>
            )}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Notify when rest is complete</label>
              <input type="email" value={notifyRecipients} onChange={(e) => setNotifyRecipients(e.target.value)} placeholder="email@lab.edu (or leave blank for default)" className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm" />
            </div>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">7. Confirm</h2>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm space-y-2">
              <p><strong>Source:</strong> {sourceBinData?.name}</p>
              <p><strong>Frogs used:</strong> {frogCount}</p>
              <p><strong>Use type:</strong> {useType}</p>
              <p><strong>Date:</strong> {useDate}</p>
              {performanceNote && <p><strong>Performance:</strong> {performanceNote}</p>}
              <p><strong>Destination:</strong> {createNewBin ? newBinName : MOCK_BINS.find((b) => b.id === destBin)?.name}</p>
              <p><strong>Rest complete:</strong> {restCompleteDate}</p>
              {notifyRecipients && <p><strong>Notify:</strong> {notifyRecipients}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-6 mx-auto max-w-xl flex justify-between">
        <button
          onClick={() => {
            const steps: UseStep[] = ["source", "count", "type", "date", "performance", "destination", "confirm"];
            const idx = steps.indexOf(step);
            if (idx > 0) setStep(steps[idx - 1]);
          }}
          disabled={step === "source"}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-30"
        >
          Back
        </button>
        {step === "confirm" ? (
          <button onClick={() => setStep("done")} className="rounded-lg bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-700">
            Confirm & Save
          </button>
        ) : (
          <button
            onClick={() => {
              const steps: UseStep[] = ["source", "count", "type", "date", "performance", "destination", "confirm"];
              const idx = steps.indexOf(step);
              if (idx < steps.length - 1) setStep(steps[idx + 1]);
            }}
            className="rounded-lg bg-brand-600 px-6 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
