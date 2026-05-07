export default function FrogsPage() {
  // TODO: Fetch frogs for current organization from Supabase
  // TODO: Implement search, filter by status/sex/size/location
  // TODO: Paginated table with FrogTable component
  // TODO: Add frog button → creation form
  // TODO: Bulk import path
  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Frog Inventory</h1>
          <p className="mt-1 text-gray-600">
            All frogs in your colony. Filter by status, sex, size, or location.
          </p>
        </div>
        <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
          + Add Frog
        </button>
      </div>

      <div className="mt-6 flex gap-3">
        <input
          type="text"
          placeholder="Search by code or local ID..."
          className="w-full max-w-sm rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="resting">Resting</option>
          <option value="retired">Retired</option>
          <option value="deceased">Deceased</option>
        </select>
      </div>

      <section className="mt-6">
        {/* TODO: Replace with FrogTable component */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600">Code</th>
                <th className="px-4 py-3 font-medium text-gray-600">Sex</th>
                <th className="px-4 py-3 font-medium text-gray-600">Size</th>
                <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 font-medium text-gray-600">Location</th>
                <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
                  No frogs yet. Add your first frog to get started.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
