export default function ShipmentsPage() {
  // TODO: Fetch shipments for current organization
  // TODO: Show claim-link flow for Xenopus 1 preloaded shipments
  // TODO: Allow creating manual shipment records
  // TODO: Status badges (draft, in_transit, received, claimed)
  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shipments</h1>
          <p className="mt-1 text-gray-600">
            Track incoming shipments and claim preloaded records from suppliers.
          </p>
        </div>
        <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
          + New Shipment
        </button>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Pending Claims
        </h2>
        {/* TODO: ClaimRegisterCard for unclaimed shipments */}
        <p className="mt-4 text-sm text-gray-500">
          No pending claims. Suppliers can preload shipments for you to claim.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Shipment History
        </h2>
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">No shipments recorded yet.</p>
        </div>
      </section>
    </div>
  );
}
