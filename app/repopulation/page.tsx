export default function RepopulationPage() {
  // TODO: Fetch bins with current_count < target_capacity
  // TODO: Fetch eligible source frogs from general population
  // TODO: Apply repopulation-rules engine for recommendations
  // TODO: RepopulationPlanner component for guided workflow
  // TODO: Show next-use recommendations alongside repopulation
  // TODO: Support bulk assign, bulk move, bulk repopulate
  // TODO: Show performance history per bin
  // TODO: Show source/cohort/shipment info
  // TODO: Export CSV of current repopulation state
  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Repopulation &amp; Bin Guidance
          </h1>
          <p className="mt-1 text-gray-600">
            Bins needing frogs, next-use recommendations, and movement planning.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Export CSV
          </button>
          <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
            Bulk Repopulate
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
          <option value="">All states</option>
          <option value="needs_repopulation">Needs Repopulation</option>
          <option value="ready_for_use">Ready for Use</option>
          <option value="resting">Resting</option>
          <option value="overdue">Overdue</option>
        </select>
        <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
          <option value="">All racks</option>
        </select>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Bins Needing Repopulation
        </h2>
        {/* TODO: BinStatusCard grid showing bins below capacity */}
        <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 p-6">
          <p className="text-sm text-yellow-800">
            No bins currently below target capacity.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Next Use Recommendations
        </h2>
        {/* TODO: RecommendationCard list for ready bins */}
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-6">
          <p className="text-sm text-green-800">
            Recommended bins for next use will appear here based on rotation
            state, performance, and capacity.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Eligible Source Frogs
        </h2>
        {/* TODO: Filterable list of frogs from general population eligible for placement */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            Frogs eligible for bin placement will appear here. Filtered by sex,
            size, rest status, and performance.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-red-800">Warnings</h2>
        {/* TODO: Bins and frogs to avoid with reasons */}
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm text-red-700">
            No bins or frogs flagged for avoidance.
          </p>
        </div>
      </section>
    </div>
  );
}
