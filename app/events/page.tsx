export default function EventsPage() {
  // TODO: Fetch events for current organization, ordered by date
  // TODO: Filter by event_type (expanded for lab modes), date range, frog, bin, protocol
  // TODO: EventLogger component for quick event creation
  // TODO: Support bin-level events (apply to all frogs in bin)
  // TODO: Show outcome/performance inline
  // TODO: Link to protocol/result if attached
  // TODO: Timeline or list view toggle
  // TODO: Bulk log event for entire bin
  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="mt-1 text-gray-600">
            Use, rest, performance, health, protocol, and movement events.
            Supports individual and bin-level logging.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Bulk Log (Bin)
          </button>
          <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
            + Log Event
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
          <option value="">All types</option>
          <option value="use">Use / Extraction</option>
          <option value="squeeze">Squeeze</option>
          <option value="injection">Injection</option>
          <option value="rest_start">Rest Start</option>
          <option value="rest_complete">Rest Complete</option>
          <option value="performance">Performance Note</option>
          <option value="health">Health</option>
          <option value="movement">Movement</option>
          <option value="breeding">Breeding</option>
          <option value="fertilization">Fertilization</option>
          <option value="embryo_staging">Embryo Staging</option>
          <option value="protocol_result">Protocol Result</option>
          <option value="environmental_note">Environmental Note</option>
        </select>
        <input
          type="text"
          placeholder="Frog code or bin..."
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          type="date"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
          <option value="">All outcomes</option>
          <option value="excellent">Excellent</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
          <option value="no_yield">No Yield</option>
        </select>
      </div>

      <section className="mt-6">
        {/* TODO: PastTimeline component or event list */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            No events logged yet. Use the button above to record a use, rest,
            performance, or protocol event. Bin-level events apply to all frogs
            in the selected bin.
          </p>
        </div>
      </section>
    </div>
  );
}
