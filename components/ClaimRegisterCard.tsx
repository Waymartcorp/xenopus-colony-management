"use client";

// TODO: Display claim-link shipment details (supplier, date, frog count)
// TODO: Confirm claim action with preview of what will be added
// TODO: POST to /api/shipments/claim on confirmation
// TODO: Show success state with link to view imported frogs

interface ClaimRegisterCardProps {
  shipmentId: string;
  supplierName: string;
  shipmentDate: string;
  frogCount: number;
  orderReference?: string;
  onClaim: (shipmentId: string) => void;
}

export default function ClaimRegisterCard({
  shipmentId,
  supplierName,
  shipmentDate,
  frogCount,
  orderReference,
  onClaim,
}: ClaimRegisterCardProps) {
  return (
    <div className="rounded-xl border border-brand-200 bg-brand-50 p-6">
      <h3 className="text-lg font-semibold text-brand-800">
        Claim Shipment
      </h3>
      <p className="mt-1 text-sm text-brand-700">
        A supplier has preloaded a shipment for your lab.
      </p>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-600">Supplier</dt>
          <dd className="font-medium text-gray-800">{supplierName}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-600">Shipment Date</dt>
          <dd className="font-medium text-gray-800">{shipmentDate}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-600">Frogs</dt>
          <dd className="font-medium text-gray-800">{frogCount}</dd>
        </div>
        {orderReference && (
          <div className="flex justify-between">
            <dt className="text-gray-600">Order Ref</dt>
            <dd className="font-medium text-gray-800">{orderReference}</dd>
          </div>
        )}
      </dl>

      <button
        onClick={() => onClaim(shipmentId)}
        className="mt-6 w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Claim & Register Frogs
      </button>
    </div>
  );
}
