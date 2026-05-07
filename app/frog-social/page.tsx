// TODO: Check if frog_social_bridge module is enabled for this org
// TODO: Fetch case_links and case_packets for current org
// TODO: Show sharing preview before any data leaves XenoTrack

const MOCK_CASES = [
  {
    id: "cp-001",
    title: "Declining oocyte quality in Rack 1 / Bin 6",
    issueType: "Poor oocyte quality",
    status: "draft" as const,
    sharingMode: "private_case_support" as const,
    createdAt: "May 4, 2026",
    itemCount: 4,
  },
  {
    id: "cp-002",
    title: "Fertility concerns post-repopulation batch #8",
    issueType: "Fertilization failure",
    status: "shared" as const,
    sharingMode: "deidentified_community" as const,
    createdAt: "April 28, 2026",
    itemCount: 6,
    frogSocialCaseId: "FS-2026-0847",
    resolutionStatus: "monitoring",
  },
];

const STATUS_COLORS = {
  draft: "bg-gray-100 text-gray-600",
  shared: "bg-purple-100 text-purple-700",
  updated: "bg-blue-100 text-blue-700",
  revoked: "bg-red-100 text-red-600",
  resolved: "bg-green-100 text-green-700",
} as const;

export default function FrogSocialPage() {
  return (
    <div className="p-6 lg:p-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Frog Social Cases
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Create case packets to get expert support from Frog Social.
            Private by default — you control what is shared.
          </p>
        </div>
        <a
          href="/frog-social/create"
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
        >
          + Create Case
        </a>
      </div>

      {/* Privacy banner */}
      <div className="mt-6 rounded-lg border border-purple-200 bg-purple-50 p-4 text-sm text-purple-800">
        <strong>Privacy:</strong> Your full colony register is not shared.
        Only selected, user-approved case packets are sent to Frog Social. You
        preview everything before it leaves XenoTrack.
      </div>

      {/* Active cases */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">Your Cases</h2>
        <div className="mt-4 space-y-3">
          {MOCK_CASES.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{c.title}</h3>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {c.issueType} · {c.itemCount} data categories ·{" "}
                    {c.sharingMode === "private_case_support"
                      ? "Private"
                      : c.sharingMode === "deidentified_community"
                      ? "De-identified"
                      : "Public"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[c.status]}`}
                  >
                    {c.status}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <span>Created {c.createdAt}</span>
                {c.frogSocialCaseId && (
                  <span className="font-mono text-purple-600">
                    {c.frogSocialCaseId}
                  </span>
                )}
                {c.resolutionStatus && (
                  <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-yellow-700">
                    {c.resolutionStatus}
                  </span>
                )}
              </div>
              <div className="mt-3 flex gap-2">
                {c.status === "draft" && (
                  <>
                    <a
                      href="/frog-social/create"
                      className="text-xs font-medium text-purple-600 hover:underline"
                    >
                      Edit &amp; Submit
                    </a>
                    <button className="text-xs font-medium text-red-500 hover:underline">
                      Delete Draft
                    </button>
                  </>
                )}
                {c.status === "shared" && (
                  <>
                    <button className="text-xs font-medium text-purple-600 hover:underline">
                      View Shared Data
                    </button>
                    <button className="text-xs font-medium text-gray-500 hover:underline">
                      Revoke Sharing
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Resolution loop */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">Resolutions</h2>
        <p className="mt-1 text-sm text-gray-500">
          When Frog Social resolves a case, the resolution summary and
          recommendations are returned here. You choose whether to save them
          to your frog/bin history.
        </p>
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6 text-center">
          <p className="text-sm text-gray-500">
            No resolutions received yet. Shared cases will show resolution
            updates here.
          </p>
          {/* TODO: Show case_resolutions when returned from Frog Social */}
        </div>
      </section>

      {/* What can be shared */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          What Can Be Included in a Case Packet
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ShareableItem label="Frog records" description="Species, sex, size, age, source" />
          <ShareableItem label="Bin / location records" description="Housing, capacity, status" />
          <ShareableItem label="Use/rest history" description="Extraction dates, rest periods" />
          <ShareableItem label="Performance ratings" description="Yield scores, quality notes" />
          <ShareableItem label="Movement history" description="Bin transfers, repopulation" />
          <ShareableItem label="Feeding logs" description="If husbandry module enabled" />
          <ShareableItem label="Husbandry checkpoints" description="If husbandry module enabled" />
          <ShareableItem label="Environmental data" description="Temp, pH, water quality (if enabled)" />
          <ShareableItem label="Photos" description="Selected images only" />
          <ShareableItem label="Protocols/results" description="Extraction protocols and outcomes" />
          <ShareableItem label="Shipment/source data" description="Supplier, arrival date, cohort" />
          <ShareableItem label="Problem description" description="User-written context and notes" />
        </div>
      </section>

      {/* Privacy commitment */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700">Privacy Commitment</p>
        <p className="mt-1">
          XenoTrack never shares your colony data automatically. The Frog
          Social bridge is entirely opt-in. You choose what to connect, preview
          before sending, and can revoke at any time. Your private colony
          register remains yours.
        </p>
      </div>
    </div>
  );
}

function ShareableItem({ label, description }: { label: string; description: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <p className="text-sm font-medium text-gray-800">{label}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}
