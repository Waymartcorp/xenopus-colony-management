import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-gray-900">
        XenoTrack Colony Register
      </h1>
      <p className="mt-4 max-w-md text-center text-gray-600">
        Private Xenopus colony management for labs and institutions. Manage your
        frog inventory, housing, events, and performance records in one place.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/dashboard"
          className="rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/institutions"
          className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Manage Institution
        </Link>
      </div>
    </div>
  );
}
