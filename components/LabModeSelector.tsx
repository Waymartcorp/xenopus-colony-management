"use client";

// TODO: Show mode descriptions and default event types
// TODO: Preview dashboard cards per mode
// TODO: Save to organization settings

export interface LabMode {
  id: string;
  label: string;
  description: string;
  defaultEvents: string[];
}

const LAB_MODES: LabMode[] = [
  {
    id: "extract",
    label: "Extract Lab",
    description:
      "Bin-level extraction cycles, rest queues, repopulation, oocyte collection, extract performance",
    defaultEvents: [
      "extraction",
      "squeeze",
      "rest_start",
      "rest_complete",
      "repopulation",
      "performance",
      "protocol_result",
      "environmental_note",
    ],
  },
  {
    id: "developmental",
    label: "Developmental Lab",
    description:
      "Breeding, fertilization, embryo production, staging, developmental outcomes, recovery",
    defaultEvents: [
      "priming_injection",
      "ovulation_injection",
      "breeding",
      "fertilization",
      "embryo_staging",
      "developmental_outcome",
      "recovery",
      "protocol_result",
    ],
  },
  {
    id: "ovary_oocyte",
    label: "Ovary & Oocyte",
    description:
      "Individual female performance, oocyte quality, rest interval, repeat performance tracking",
    defaultEvents: [
      "injection",
      "squeeze",
      "oocyte_extraction",
      "oocyte_quality",
      "recovery",
      "rest_start",
      "performance",
    ],
  },
  {
    id: "transgenic",
    label: "Transgenic / Embryo Development",
    description:
      "Line/genotype management, founders, crosses, embryo cohorts, screening results",
    defaultEvents: [
      "cross_setup",
      "founder_record",
      "genotype_assignment",
      "embryo_collection",
      "line_expansion",
      "cohort_movement",
      "screening_result",
      "developmental_outcome",
    ],
  },
  {
    id: "general",
    label: "General Colony",
    description:
      "Neutral colony management, inventory, use/rest history, basic repopulation",
    defaultEvents: [
      "use",
      "rest_start",
      "rest_complete",
      "health",
      "movement",
      "environmental_note",
    ],
  },
];

interface LabModeSelectorProps {
  currentMode: string;
  onSelect: (modeId: string) => void;
}

export default function LabModeSelector({
  currentMode,
  onSelect,
}: LabModeSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {LAB_MODES.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onSelect(mode.id)}
          className={`rounded-xl border p-4 text-left transition ${
            currentMode === mode.id
              ? "border-brand-500 bg-brand-50 ring-2 ring-brand-200"
              : "border-gray-200 hover:border-brand-300 hover:bg-brand-50"
          }`}
        >
          <p className="text-sm font-semibold text-gray-800">{mode.label}</p>
          <p className="mt-1 text-xs text-gray-500">{mode.description}</p>
          <div className="mt-3 flex flex-wrap gap-1">
            {mode.defaultEvents.slice(0, 4).map((evt) => (
              <span
                key={evt}
                className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] text-gray-600"
              >
                {evt.replace(/_/g, " ")}
              </span>
            ))}
            {mode.defaultEvents.length > 4 && (
              <span className="text-[9px] text-gray-400">
                +{mode.defaultEvents.length - 4} more
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
