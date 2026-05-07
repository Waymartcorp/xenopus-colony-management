// TODO: Fetch case_packets, case_packet_items, case_links, case_resolutions for this case
// TODO: Show resolution when returned from Frog Social
// TODO: Allow saving resolution actions back to bin/frog history

const MOCK_CASE = {
  id: "cp-002",
  title: "Fertility concerns post-repopulation batch #8",
  issueType: "Fertilization failure",
  status: "shared" as const,
  sharingMode: "deidentified_community" as const,
  createdAt: "April 28, 2026",
  submittedAt: "April 28, 2026",
  frogSocialCaseId: "FS-2026-0847",
  description: "Following repopulation batch #8, fertilization rates dropped significantly (40% vs normal 85%). Affects 3 bins from same cohort.",
  dateRangeStart: "March 15, 2026",
  dateRangeEnd: "April 28, 2026",
  includedCategories: ["Frog records", "Bin records", "Use/rest history", "Performance ratings", "Movement history", "Shipment/source data"],
  excludedCategories: ["Photos", "Feeding logs", "Husbandry checkpoints", "Environmental data", "Protocols/results"],
  resolution: {
    status: "monitoring" as const,
    summary: "Pattern consistent with temperature shock during transit. Similar cases resolved with extended rest (120+ days) and gradual acclimatization protocol.",
    likelyFactors: [
      "Transit temperature variation during February shipment",
      "Shortened acclimatization period (3 days vs recommended 7)",
      "First use attempted within 45 days of arrival",
    ],
    recommendedActions: [
      "Extend rest period to 120 days minimum for affected cohort",
      "Monitor first extraction with reduced hormone dose",
      "Compare with non-affected bins from different shipment",
      "Log water temperature daily for 2 weeks post-recovery",
    ],
    relatedCases: ["FS-2025-0412", "FS-2025-0673"],
    receivedAt: "May 2, 2026",
  },
};

const STATUS_COLORS = {
  draft: "bg-gray-100 text-gray-600",
  shared: "bg-purple-100 text-purple-700",
  updated: "bg-blue-100 text-blue-700",
  revoked: "bg-red-100 text-red-600",
  resolved: "bg-green-100 text-green-700",
} as const;

const RESOLUTION_STATUS_COLORS = {
  unresolved: "bg-gray-100 text-gray-600",
  monitoring: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
};

export default function CaseDetailPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  void params;

  return (
    <div className="p-6 lg:p-10">
      <nav className="text-sm text-gray-500">
        <a href="/frog-social" className="hover:text-brand-600">Frog Social</a>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Case Detail</span>
      </nav>

      {/* Case header */}
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{MOCK_CASE.title}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {MOCK_CASE.issueType} · Created {MOCK_CASE.createdAt}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[MOCK_CASE.status]}`}>
            {MOCK_CASE.status}
          </span>
          {MOCK_CASE.frogSocialCaseId && (
            <span className="font-mono text-xs text-purple-600">
              {MOCK_CASE.frogSocialCaseId}
            </span>
          )}
        </div>
      </div>

      {/* Case details */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          Case Details
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <p className="text-xs font-medium text-gray-500">Sharing Mode</p>
            <p className="mt-0.5 text-gray-900">
              {MOCK_CASE.sharingMode === "deidentified_community"
                ? "De-identified community case"
                : MOCK_CASE.sharingMode === "private_case_support"
                ? "Private case support"
                : "Public / attributed"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Date Range</p>
            <p className="mt-0.5 text-gray-900">
              {MOCK_CASE.dateRangeStart} — {MOCK_CASE.dateRangeEnd}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs font-medium text-gray-500">Description</p>
            <p className="mt-0.5 text-gray-900">{MOCK_CASE.description}</p>
          </div>
        </div>
      </div>

      {/* Included / excluded data */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <h3 className="text-sm font-semibold text-green-800">Included in Case Packet</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {MOCK_CASE.includedCategories.map((cat) => (
              <span key={cat} className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs text-green-700">
                {cat}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-600">Not Included</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {MOCK_CASE.excludedCategories.map((cat) => (
              <span key={cat} className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs text-gray-500">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Resolution */}
      {MOCK_CASE.resolution && (
        <section className="mt-8">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-800">Resolution</h2>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${RESOLUTION_STATUS_COLORS[MOCK_CASE.resolution.status]}`}>
              {MOCK_CASE.resolution.status}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Received {MOCK_CASE.resolution.receivedAt}
          </p>

          <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-500">Summary</p>
              <p className="mt-1 text-sm text-gray-900">{MOCK_CASE.resolution.summary}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">Likely Contributing Factors</p>
              <ul className="mt-1 list-disc list-inside space-y-1 text-sm text-gray-700">
                {MOCK_CASE.resolution.likelyFactors.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">Recommended Actions</p>
              <ul className="mt-1 space-y-1.5">
                {MOCK_CASE.resolution.recommendedActions.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-purple-100 text-xs font-bold text-purple-700">
                      {i + 1}
                    </span>
                    <span className="text-gray-700">{a}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">Related Cases</p>
              <div className="mt-1 flex gap-2">
                {MOCK_CASE.resolution.relatedCases.map((rc) => (
                  <span key={rc} className="font-mono text-xs text-purple-600">
                    {rc}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Save to record */}
          <div className="mt-4 flex gap-2">
            <button className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
              Save Resolution to Bin/Frog History
            </button>
            <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Dismiss
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            TODO: Save resolution summary and actions back to selected bin/frog
            records in XenoTrack
          </p>
        </section>
      )}

      {/* Actions */}
      <section className="mt-8 border-t border-gray-200 pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          Case Actions
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Update Case Packet
          </button>
          <button className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
            Revoke Sharing
          </button>
        </div>
      </section>
    </div>
  );
}
