// TODO: Check if frog_social_bridge module is enabled for this org
// TODO: Fetch case_links and case_packets for current org
// TODO: Show sharing preview before any data leaves XenoTrack

export default function FrogSocialPage() {
  return (
    <div className="p-6 lg:p-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Frog Social Bridge
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Connect selected XenoTrack records to Frog Social for case
          consultation. Private by default — you control what is shared.
        </p>
      </div>

      {/* Opt-in explanation */}
      <section className="mt-8 rounded-xl border-2 border-purple-200 bg-purple-50 p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Connect to Frog Social
        </h2>
        <p className="mt-2 text-sm text-gray-700">
          Use selected XenoTrack records to create a Frog Social case and
          compare against the broader Xenopus case-history archive. You
          choose exactly which data to share.
        </p>
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <p>• <strong>Private by default</strong> — no colony data goes to Frog Social automatically</p>
          <p>• <strong>You select</strong> which frogs, bins, history, and observations to include</p>
          <p>• <strong>Preview before sharing</strong> — see exactly what will be sent</p>
          <p>• <strong>De-identification option</strong> — strip identifying details if preferred</p>
          <p>• <strong>Revoke anytime</strong> — unlink or revoke shared data</p>
        </div>
        <div className="mt-6 flex gap-3">
          <button className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700">
            Enable Frog Social Bridge
          </button>
          <button className="rounded-lg border border-purple-300 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-100">
            Learn More
          </button>
        </div>
      </section>

      {/* What can be shared */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          What Can Be Connected
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <ShareableItem label="Frog records" description="Species, sex, size, age, source" />
          <ShareableItem label="Bin records" description="Location, capacity, status" />
          <ShareableItem label="Use/rest history" description="Extraction dates, rest periods" />
          <ShareableItem label="Performance ratings" description="Yield scores, quality notes" />
          <ShareableItem label="Husbandry notes" description="Feeding, checkpoints (if module enabled)" />
          <ShareableItem label="Environmental data" description="Temperature, pH, water quality" />
          <ShareableItem label="Photos" description="Selected images only" />
          <ShareableItem label="Protocol/results" description="Extraction protocols and outcomes" />
        </div>
      </section>

      {/* Active cases placeholder */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Your Cases
        </h2>
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6 text-center">
          <p className="text-sm text-gray-500">
            No cases connected yet. Enable the Frog Social bridge to create
            your first case.
          </p>
        </div>
      </section>

      {/* Language note */}
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
