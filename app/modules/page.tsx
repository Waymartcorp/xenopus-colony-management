// TODO: Fetch organization_module_trials + enabled_modules for current org
// TODO: Enable/disable modules with confirmation
// TODO: Show trial status and expiration dates
// TODO: Add billing integration later (do NOT build yet)

interface Module {
  id: string;
  name: string;
  description: string;
  status: "active" | "available" | "expired";
  trialEnds?: string;
}

const MODULES: Module[] = [
  {
    id: "husbandry_tracking",
    name: "Husbandry Tracking",
    description:
      "Track feeding, environmental notes, care checkpoints, and recovery observations alongside colony rotation and performance.",
    status: "available",
  },
  {
    id: "feeding_schedule",
    name: "Feeding Schedule",
    description:
      "Define per-bin feeding schedules with response tracking, missed feeding alerts, and feeding–performance correlation.",
    status: "available",
  },
  {
    id: "environmental_notes",
    name: "Environmental Notes",
    description:
      "Log water quality, temperature, pH, conductivity, and other environmental observations linked to locations and performance.",
    status: "available",
  },
  {
    id: "protocols_results",
    name: "Protocols & Results",
    description:
      "Define lab protocols and record structured results linked to events. Track extraction yields, oocyte quality, and embryo outcomes.",
    status: "available",
  },
  // Frog Social Bridge is architecturally ready but not user-facing yet.
  // It will be listed here when the integration is ready for users.
  {
    id: "visual_analytics",
    name: "Visual Analytics",
    description:
      "Charts, trends, seasonality analysis, and visual dashboards for colony performance and capacity.",
    status: "available",
  },
  {
    id: "imaging_future",
    name: "Imaging & Recognition (Future)",
    description:
      "Photo-based individual identification and health assessment. Architecture is ready; biometric matching is not built yet.",
    status: "available",
  },
];

export default function ModulesPage() {
  return (
    <div className="p-6 lg:p-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Modules</h1>
        <p className="mt-1 text-sm text-gray-500">
          XenoTrack&apos;s base product covers bins, rotation, repopulation,
          performance, forecasting, and notifications. Optional modules extend
          your workspace with additional capabilities.
        </p>
      </div>

      {/* Base product card */}
      <section className="mt-8">
        <div className="rounded-xl border-2 border-brand-200 bg-brand-50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Base Colony Register
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Bins, frogs, use/rest rotation, repopulation, performance,
                past/future views, capacity forecasting, bottleneck detection,
                notifications, and photo upload.
              </p>
            </div>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Included
            </span>
          </div>
        </div>
      </section>

      {/* Optional modules */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Optional Modules
        </h2>
        <p className="mt-1 text-xs text-gray-400">
          Try any module free for 90 days. No credit card required.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {MODULES.map((mod) => (
            <ModuleCard key={mod.id} module={mod} />
          ))}
        </div>
      </section>

      {/* Future billing note */}
      <p className="mt-8 text-xs text-gray-400">
        TODO: Billing and subscription management will be added here. For now,
        all modules are available as free trials during early testing.
      </p>
    </div>
  );
}

function ModuleCard({ module }: { module: Module }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-semibold text-gray-900">{module.name}</h3>
        {module.status === "active" && (
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
            Active
          </span>
        )}
        {module.status === "expired" && (
          <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
            Expired
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-gray-600">{module.description}</p>
      {module.trialEnds && (
        <p className="mt-2 text-xs text-gray-400">
          Trial ends: {module.trialEnds}
        </p>
      )}
      <div className="mt-4">
        {module.status === "available" && (
          <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
            Enable 90-Day Trial
          </button>
        )}
        {module.status === "active" && (
          <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Manage
          </button>
        )}
      </div>
    </div>
  );
}
