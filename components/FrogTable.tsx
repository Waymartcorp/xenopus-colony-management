"use client";

// TODO: Accept frogs array as prop with proper typing from Supabase schema
// TODO: Sortable columns (code, sex, size, status, location)
// TODO: Row click → navigate to frog detail page
// TODO: Inline status badge with color coding
// TODO: Pagination controls

export interface Frog {
  id: string;
  public_code: string;
  local_id: string | null;
  sex: string | null;
  size_class: string | null;
  status: string;
  current_location_id: string | null;
  location_label?: string;
}

interface FrogTableProps {
  frogs: Frog[];
  total: number;
  page: number;
  onPageChange: (page: number) => void;
}

export default function FrogTable({
  frogs,
  total,
  page,
  onPageChange,
}: FrogTableProps) {
  if (frogs.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">No frogs match your criteria.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-medium text-gray-600">Code</th>
            <th className="px-4 py-3 font-medium text-gray-600">Local ID</th>
            <th className="px-4 py-3 font-medium text-gray-600">Sex</th>
            <th className="px-4 py-3 font-medium text-gray-600">Size</th>
            <th className="px-4 py-3 font-medium text-gray-600">Status</th>
            <th className="px-4 py-3 font-medium text-gray-600">Location</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {frogs.map((frog) => (
            <tr
              key={frog.id}
              className="cursor-pointer hover:bg-gray-50"
            >
              <td className="px-4 py-3 font-mono text-sm">
                {frog.public_code}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {frog.local_id ?? "—"}
              </td>
              <td className="px-4 py-3 capitalize">{frog.sex ?? "—"}</td>
              <td className="px-4 py-3">{frog.size_class ?? "—"}</td>
              <td className="px-4 py-3">
                <StatusBadge status={frog.status} />
              </td>
              <td className="px-4 py-3 text-gray-600">
                {frog.location_label ?? "Unassigned"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {total > frogs.length && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <p className="text-sm text-gray-500">
            Page {page} · {total} total
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              className="rounded border px-3 py-1 text-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    resting: "bg-blue-100 text-blue-800",
    retired: "bg-gray-100 text-gray-800",
    deceased: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
        colors[status] ?? "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}
