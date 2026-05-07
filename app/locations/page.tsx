export default function LocationsPage() {
  // TODO: Fetch location tree for current organization
  // TODO: Render hierarchical tree (rooms → racks → bins/tanks/tubs)
  // TODO: Show capacity and current frog counts per location
  // TODO: Allow creating/editing locations
  // TODO: Highlight bins at capacity or needing attention
  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
          <p className="mt-1 text-gray-600">
            Rooms, racks, bins, tanks, tubs, and cohort housing.
          </p>
        </div>
        <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
          + Add Location
        </button>
      </div>

      <section className="mt-8">
        {/* TODO: Replace with LocationTree component */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-700">Location Tree</p>
          <p className="mt-4 text-sm text-gray-500">
            No locations defined. Start by adding a room, then racks and bins.
          </p>
        </div>
      </section>
    </div>
  );
}
