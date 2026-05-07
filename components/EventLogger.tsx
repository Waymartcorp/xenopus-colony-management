"use client";

import { useState } from "react";

// TODO: Submit event via API route
// TODO: Auto-suggest frog by code or local ID
// TODO: Auto-populate location from frog's current_location
// TODO: Validate minimum rest interval before allowing use event
// TODO: Show confirmation with warnings if applicable

interface EventLoggerProps {
  organizationId: string;
  preselectedFrogId?: string;
  onEventLogged?: () => void;
}

export default function EventLogger({
  organizationId,
  preselectedFrogId,
  onEventLogged,
}: EventLoggerProps) {
  const [eventType, setEventType] = useState("use");
  const [frogCode, setFrogCode] = useState("");
  const [notes, setNotes] = useState("");
  const [outcome, setOutcome] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    // TODO: POST to /api/events
    console.log("Event log pending:", {
      organizationId,
      frogId: preselectedFrogId,
      frogCode,
      eventType,
      notes,
      outcome,
    });

    setSubmitting(false);
    onEventLogged?.();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-gray-800">Log Event</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Event Type
          </label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="use">Use (squeeze)</option>
            <option value="rest">Rest start</option>
            <option value="performance">Performance note</option>
            <option value="health">Health observation</option>
            <option value="movement">Movement</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Frog Code
          </label>
          <input
            type="text"
            value={frogCode}
            onChange={(e) => setFrogCode(e.target.value)}
            placeholder="e.g. XL-2024-0042"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {(eventType === "use" || eventType === "performance") && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Outcome
          </label>
          <select
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Select outcome...</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
            <option value="no_yield">No yield</option>
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Optional notes..."
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {submitting ? "Logging..." : "Log Event"}
      </button>
    </form>
  );
}
