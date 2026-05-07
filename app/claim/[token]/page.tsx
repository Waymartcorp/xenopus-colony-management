// TODO: Validate claim token from URL params
// TODO: Fetch shipment details associated with token
// TODO: Show shipment preview (supplier, date, frog count)
// TODO: If user is authenticated and has org, allow claiming
// TODO: If user is not authenticated, prompt login/signup first
// TODO: On claim: update shipment claim_status, assign frogs to org

export default function ClaimPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  // In Next.js 15, params is a Promise in dynamic routes
  // TODO: Await params and use token to fetch shipment
  void params;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Claim Your Shipment
        </h1>
        <p className="mt-4 text-gray-600">
          A supplier has prepared a shipment for your lab. Review the details
          below and claim to add the frogs to your colony.
        </p>

        <div className="mt-8 rounded-xl border border-brand-200 bg-brand-50 p-6 text-left">
          {/* TODO: Display shipment details from token lookup */}
          <h2 className="text-sm font-semibold text-brand-800">
            Shipment Details
          </h2>
          <p className="mt-3 text-sm text-gray-600">
            Loading shipment information...
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <button className="w-full rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700">
            Claim &amp; Register Frogs
          </button>
          <p className="text-xs text-gray-400">
            You must be signed in to claim a shipment. Claimed frogs will be
            added to your organization&apos;s colony.
          </p>
        </div>
      </div>
    </div>
  );
}
