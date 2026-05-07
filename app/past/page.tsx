export default function PastPage() {
  // TODO: Fetch historical events with full filter support
  // TODO: PastTimeline component with chronological event list
  // TODO: Filters: frog, bin, rack, room, date range, event type, protocol, cohort, source, outcome
  // TODO: Compare results over time periods
  // TODO: Group by season, month, protocol, source, bin, frog, environmental condition
  // TODO: Show results by rest duration
  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold text-gray-900">Past View</h1>
      <p className="mt-2 text-gray-600">
        Historical timeline of all colony events. Filter, compare, and analyze
        what happened and with what result.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by frog code, bin, or note..."
          className="w-full max-w-sm rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
          <option value="">All event types</option>
          <option value="use">Use / Extraction</option>
          <option value="rest_start">Rest Start</option>
          <option value="rest_complete">Rest Complete</option>
          <option value="performance">Performance</option>
          <option value="health">Health</option>
          <option value="movement">Movement</option>
          <option value="injection">Injection</option>
          <option value="breeding">Breeding</option>
          <option value="protocol_result">Protocol Result</option>
          <option value="environmental_note">Environmental Note</option>
        </select>
        <input
          type="date"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          placeholder="From"
        />
        <input
          type="date"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          placeholder="To"
        />
        <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
          <option value="">All locations</option>
        </select>
        <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
          <option value="">All outcomes</option>
          <option value="excellent">Excellent</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
        </select>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">Timeline</h2>
        {/* TODO: PastTimeline component */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            No events match your filters. Adjust filters or add events to see
            the timeline.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Comparison &amp; Analysis
        </h2>
        {/* TODO: Comparison cards showing results by period, season, source */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm font-medium text-gray-700">By Season</p>
            <p className="mt-2 text-xs text-gray-500">
              Performance comparison across seasons will appear here.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm font-medium text-gray-700">By Protocol</p>
            <p className="mt-2 text-xs text-gray-500">
              Performance comparison across protocols will appear here.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm font-medium text-gray-700">
              By Source / Cohort
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Performance comparison by frog source will appear here.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm font-medium text-gray-700">
              By Rest Duration
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Performance vs rest duration will appear here.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
