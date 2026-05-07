"use client";

import { useState } from "react";

// TODO: Fetch real bin/frog/event data for selection
// TODO: Build preview payload from selected items
// TODO: Submit case packet to Frog Social API when available
// TODO: Store case_packet and case_packet_items in Supabase
// TODO: Return frog_social_case_id after submission

type IssueType =
  | "poor_oocyte_quality"
  | "low_extract_yield"
  | "fertilization_failure"
  | "embryo_developmental"
  | "mortality_health"
  | "feeding_recovery"
  | "bin_performance_decline"
  | "environmental_husbandry"
  | "rotation_bottleneck"
  | "other";

type Scope = "frog" | "bin" | "multiple_bins" | "rack" | "room" | "shipment_cohort" | "custom_date_range";

type SharingMode = "private_case_support" | "deidentified_community" | "public_attributed";

const ISSUE_TYPES: { value: IssueType; label: string }[] = [
  { value: "poor_oocyte_quality", label: "Poor oocyte quality" },
  { value: "low_extract_yield", label: "Low extract yield" },
  { value: "fertilization_failure", label: "Fertilization failure" },
  { value: "embryo_developmental", label: "Embryo / developmental issue" },
  { value: "mortality_health", label: "Mortality / health concern" },
  { value: "feeding_recovery", label: "Feeding / recovery concern" },
  { value: "bin_performance_decline", label: "Bin performance decline" },
  { value: "environmental_husbandry", label: "Environmental / husbandry concern" },
  { value: "rotation_bottleneck", label: "Rotation / repopulation bottleneck" },
  { value: "other", label: "Other" },
];

const SCOPE_OPTIONS: { value: Scope; label: string }[] = [
  { value: "frog", label: "Single frog" },
  { value: "bin", label: "Single bin" },
  { value: "multiple_bins", label: "Multiple bins" },
  { value: "rack", label: "Rack" },
  { value: "room", label: "Room" },
  { value: "shipment_cohort", label: "Shipment / cohort" },
  { value: "custom_date_range", label: "Custom date range" },
];

const DATA_CATEGORIES = [
  { id: "frogs", label: "Frog records", description: "Species, sex, size, age, source" },
  { id: "bins", label: "Bin / location records", description: "Housing, capacity, status" },
  { id: "use_rest", label: "Use/rest history", description: "Extraction dates, rest periods" },
  { id: "performance", label: "Performance ratings", description: "Yield scores, quality notes" },
  { id: "movement", label: "Movement / repopulation", description: "Bin transfers, repopulation events" },
  { id: "feeding", label: "Feeding logs", description: "Feed type, response, schedule (if husbandry enabled)" },
  { id: "husbandry", label: "Husbandry checkpoints", description: "Care checks, recovery observations (if enabled)" },
  { id: "environment", label: "Environmental notes", description: "Temperature, pH, water quality (if enabled)" },
  { id: "photos", label: "Photos", description: "Selected images only" },
  { id: "protocols", label: "Protocols / results", description: "Extraction protocols and outcomes (if enabled)" },
  { id: "shipment", label: "Shipment / source data", description: "Supplier, arrival date, cohort" },
];

type Step = "issue" | "scope" | "data" | "sharing" | "preview" | "submitted";

export default function CreateCasePage() {
  const [step, setStep] = useState<Step>("issue");
  const [issueType, setIssueType] = useState<IssueType | "">("");
  const [scope, setScope] = useState<Scope | "">("");
  const [selectedData, setSelectedData] = useState<string[]>(["frogs", "bins", "use_rest", "performance"]);
  const [sharingMode, setSharingMode] = useState<SharingMode>("private_case_support");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function toggleData(id: string) {
    setSelectedData((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  }

  if (step === "submitted") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <span className="text-2xl">✓</span>
          </div>
          <h1 className="mt-4 text-xl font-bold text-gray-900">Case Draft Saved</h1>
          <p className="mt-2 text-sm text-gray-600">
            Your case packet has been saved as a draft. When Frog Social
            integration is live, you can submit it for case support.
          </p>
          <p className="mt-2 text-xs text-gray-400">
            TODO: Submit to Frog Social API and receive case ID
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <a href="/frog-social" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
              View Cases
            </a>
            <a href="/dashboard" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <nav className="text-sm text-gray-500">
        <a href="/frog-social" className="hover:text-brand-600">Frog Social</a>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Create Case</span>
      </nav>

      <h1 className="mt-4 text-2xl font-bold text-gray-900">
        Create Frog Social Case
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Select what to share. Your full colony register is not shared — only
        the records you choose below.
      </p>

      {/* Step indicator */}
      <div className="mt-6 flex gap-1">
        {(["issue", "scope", "data", "sharing", "preview"] as Step[]).map((s, idx) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full ${
              (["issue", "scope", "data", "sharing", "preview"] as Step[]).indexOf(step) >= idx
                ? "bg-purple-500"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        {/* Step 1: Issue Type */}
        {step === "issue" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              What issue are you experiencing?
            </h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {ISSUE_TYPES.map((t) => (
                <label
                  key={t.value}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 ${
                    issueType === t.value ? "border-purple-400 bg-purple-50" : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="issue"
                    value={t.value}
                    checked={issueType === t.value}
                    onChange={() => setIssueType(t.value)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-gray-700">{t.label}</span>
                </label>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Case Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Declining oocyte quality in Rack 1 / Bin 6"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe the problem you're seeing..."
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
              />
            </div>
          </div>
        )}

        {/* Step 2: Scope */}
        {step === "scope" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              What scope should this case cover?
            </h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {SCOPE_OPTIONS.map((s) => (
                <label
                  key={s.value}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 ${
                    scope === s.value ? "border-purple-400 bg-purple-50" : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="scope"
                    value={s.value}
                    checked={scope === s.value}
                    onChange={() => setScope(s.value)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-gray-700">{s.label}</span>
                </label>
              ))}
            </div>
            {/* TODO: Show location/frog picker based on scope selection */}
            <p className="text-xs text-gray-400">
              TODO: Show bin/frog/location picker based on selected scope
            </p>
          </div>
        )}

        {/* Step 3: Data Categories */}
        {step === "data" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              What data should be included?
            </h2>
            <p className="text-sm text-gray-600">
              Select the record types to include in your case packet. Only
              selected categories will be shared.
            </p>
            <div className="space-y-2">
              {DATA_CATEGORIES.map((cat) => (
                <label
                  key={cat.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${
                    selectedData.includes(cat.id)
                      ? "border-purple-300 bg-purple-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedData.includes(cat.id)}
                    onChange={() => toggleData(cat.id)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{cat.label}</p>
                    <p className="text-xs text-gray-500">{cat.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Sharing Mode */}
        {step === "sharing" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              How should this case be shared?
            </h2>
            <div className="space-y-2">
              <SharingOption
                value="private_case_support"
                label="Private case support"
                description="Only visible to Frog Social support team. Your lab identity is known but case is not public."
                selected={sharingMode === "private_case_support"}
                onSelect={() => setSharingMode("private_case_support")}
              />
              <SharingOption
                value="deidentified_community"
                label="De-identified community case"
                description="Shared anonymously with the community case archive. Lab identity and frog IDs removed."
                selected={sharingMode === "deidentified_community"}
                onSelect={() => setSharingMode("deidentified_community")}
              />
              <SharingOption
                value="public_attributed"
                label="Public / attributed case"
                description="Shared publicly with your lab name attached. Useful for collaborative research."
                selected={sharingMode === "public_attributed"}
                onSelect={() => setSharingMode("public_attributed")}
              />
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
              Default: Private case support. You can change this later.
            </div>
          </div>
        )}

        {/* Step 5: Preview */}
        {step === "preview" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Review your case packet
            </h2>
            <p className="text-sm text-gray-600">
              This is exactly what will be sent. Nothing else from your colony
              register is shared.
            </p>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-gray-500">Issue Type</p>
                  <p className="font-medium text-gray-900">
                    {ISSUE_TYPES.find((t) => t.value === issueType)?.label ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Scope</p>
                  <p className="font-medium text-gray-900">
                    {SCOPE_OPTIONS.find((s) => s.value === scope)?.label ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Sharing Mode</p>
                  <p className="font-medium text-gray-900">
                    {sharingMode === "private_case_support" && "Private"}
                    {sharingMode === "deidentified_community" && "De-identified"}
                    {sharingMode === "public_attributed" && "Public / attributed"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Title</p>
                  <p className="font-medium text-gray-900">{title || "—"}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-medium text-gray-500">Included Data</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {selectedData.map((id) => (
                    <span key={id} className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                      {DATA_CATEGORIES.find((c) => c.id === id)?.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-medium text-gray-500">Excluded</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {DATA_CATEGORIES.filter((c) => !selectedData.includes(c.id)).map((c) => (
                    <span key={c.id} className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs text-gray-500">
                      {c.label}
                    </span>
                  ))}
                </div>
              </div>

              {description && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-500">Description</p>
                  <p className="mt-1 text-gray-700">{description}</p>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
              <strong>Privacy note:</strong> Your full colony register is not
              shared. Only the {selectedData.length} data categories selected
              above will be included in this case packet.
              {sharingMode === "deidentified_community" && (
                <span> Lab identity and frog IDs will be removed.</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => {
            const steps: Step[] = ["issue", "scope", "data", "sharing", "preview"];
            const idx = steps.indexOf(step);
            if (idx > 0) setStep(steps[idx - 1]);
          }}
          disabled={step === "issue"}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-30"
        >
          Back
        </button>
        <div className="flex gap-2">
          <a
            href="/frog-social"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </a>
          {step === "preview" ? (
            <div className="flex gap-2">
              <button
                onClick={() => setStep("submitted")}
                className="rounded-lg border border-purple-300 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-50"
              >
                Save Draft
              </button>
              <button
                onClick={() => setStep("submitted")}
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
              >
                Send to Frog Social
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                const steps: Step[] = ["issue", "scope", "data", "sharing", "preview"];
                const idx = steps.indexOf(step);
                if (idx < steps.length - 1) setStep(steps[idx + 1]);
              }}
              className="rounded-lg bg-purple-600 px-6 py-2 text-sm font-semibold text-white hover:bg-purple-700"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SharingOption({
  label,
  description,
  selected,
  onSelect,
  value,
}: {
  value: string;
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}) {
  void value;
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${
        selected ? "border-purple-400 bg-purple-50" : "border-gray-200 hover:bg-gray-50"
      }`}
    >
      <input
        type="radio"
        name="sharing"
        checked={selected}
        onChange={onSelect}
        className="mt-0.5 h-4 w-4"
      />
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </label>
  );
}
