export default function EnvironmentPage() {
  // TODO: Fetch environmental_observations for org
  // TODO: EnvironmentalNotes component for logging new observations
  // TODO: Filter by location, observation_type, date range
  // TODO: Show environmental trends over time (LineChartCard)
  // TODO: Show correlation with performance (ScatterPlotPlaceholder)
  // TODO: Link observations to events, protocols, results
  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Environment</h1>
          <p className="mt-1 text-gray-600">
            Track water quality, room conditions, feeding, and husbandry. Link
            observations to performance outcomes.
          </p>
        </div>
        <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
          + Log Observation
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
          <option value="">All types</option>
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
          <option value="husbandry_intervention">Husbandry Intervention</option>
          <option value="seasonal_note">Seasonal Note</option>
          <option value="staff_change">Staff Change</option>
        </select>
        <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
          <option value="">All locations</option>
        </select>
        <input
          type="date"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Recent Observations
        </h2>
        {/* TODO: List of recent environmental_observations */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            No environmental observations logged yet. Use the button above to
            record water quality, conditions, or husbandry changes.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">Trends</h2>
        {/* TODO: LineChartCard for temperature/pH/conductivity over time */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6">
            <p className="text-sm font-medium text-gray-700">
              Temperature Over Time
            </p>
            <div className="mt-4 flex h-24 items-center justify-center rounded-lg bg-gray-50">
              <p className="text-xs text-gray-400">Line chart placeholder</p>
            </div>
          </div>
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6">
            <p className="text-sm font-medium text-gray-700">pH Over Time</p>
            <div className="mt-4 flex h-24 items-center justify-center rounded-lg bg-gray-50">
              <p className="text-xs text-gray-400">Line chart placeholder</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Performance Correlation
        </h2>
        {/* TODO: ScatterPlotPlaceholder for performance vs environmental factors */}
        <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-white p-6">
          <p className="text-center text-sm text-gray-500">
            Scatter plots showing performance vs environmental conditions will
            appear here.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Future: Sensor Integration
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Automated sensor/monitoring integrations are planned for later.
          Currently all environmental data is entered manually.
        </p>
      </section>
    </div>
  );
}
