"use client";

import { useState } from "react";

// TODO: Submit to /api/environment
// TODO: Auto-suggest location from recent entries
// TODO: Support multiple observation types in one entry
// TODO: Link to event/protocol/result if applicable

interface EnvironmentalNotesProps {
  organizationId: string;
  onSubmit?: () => void;
}

export default function EnvironmentalNotes({
  organizationId,
  onSubmit,
}: EnvironmentalNotesProps) {
  const [observationType, setObservationType] = useState("water_temperature");
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("°C");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // TODO: POST to /api/environment
    console.log("Environmental observation:", {
      organizationId,
      observationType,
      value,
      unit,
      notes,
    });
    setSubmitting(false);
    setValue("");
    setNotes("");
    onSubmit?.();
  }

  const typeUnits: Record<string, string> = {
    water_temperature: "°C",
    room_temperature: "°C",
    ph: "pH",
    conductivity: "µS/cm",
    density_change: "frogs",
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-gray-200 bg-white p-6"
    >
      <h3 className="text-lg font-semibold text-gray-800">
        Log Environmental Observation
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Observation Type
          </label>
          <select
            value={observationType}
            onChange={(e) => {
              setObservationType(e.target.value);
              setUnit(typeUnits[e.target.value] ?? "");
            }}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="water_temperature">Water Temperature</option>
            <option value="room_temperature">Room Temperature</option>
            <option value="ph">pH</option>
            <option value="conductivity">Conductivity</option>
            <option value="water_source">Water Source</option>
            <option value="feeding_change">Feeding Change</option>
            <option value="lighting_change">Lighting Change</option>
            <option value="filtration_change">Filtration Change</option>
            <option value="density_change">Density Change</option>
            <option value="disturbance">Disturbance</option>
            <option value="husbandry_intervention">
              Husbandry Intervention
            </option>
            <option value="seasonal_note">Seasonal Note</option>
            <option value="staff_change">Staff Change</option>
          </select>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Value
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. 22.5"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="w-20">
            <label className="block text-sm font-medium text-gray-700">
              Unit
            </label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Additional context..."
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {submitting ? "Saving..." : "Save Observation"}
      </button>
    </form>
  );
}
