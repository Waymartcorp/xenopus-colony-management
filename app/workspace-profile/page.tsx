export default function WorkspaceProfilePage() {
  // TODO: Fetch organization settings (primary_lab_mode, enabled_modules, rotation_settings)
  // TODO: WorkspaceProfile and LabModeSelector components
  // TODO: Allow admin to select primary lab mode
  // TODO: Allow admin to enable/disable modules
  // TODO: Show rotation settings form
  // TODO: Preview mode-specific dashboard and event templates
  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold text-gray-900">Workspace Profile</h1>
      <p className="mt-2 text-gray-600">
        Configure your lab mode, enabled modules, and rotation settings. These
        affect dashboards, event templates, and notifications.
      </p>

      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-800">Lab Mode</h2>
        <p className="mt-2 text-sm text-gray-600">
          Choose your primary lab mode. This customizes dashboards, event
          templates, and notification wording.
        </p>
        {/* TODO: LabModeSelector component */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ModeOption
            mode="extract"
            label="Extract Lab"
            description="Bin-level extraction cycles, rest queues, oocyte collection"
          />
          <ModeOption
            mode="developmental"
            label="Developmental Lab"
            description="Breeding, fertilization, embryo staging, outcomes"
          />
          <ModeOption
            mode="ovary_oocyte"
            label="Ovary & Oocyte"
            description="Individual female performance, oocyte quality tracking"
          />
          <ModeOption
            mode="transgenic"
            label="Transgenic / Embryo"
            description="Line management, founders, crosses, screening"
          />
          <ModeOption
            mode="general"
            label="General Colony"
            description="Neutral inventory, use/rest, basic repopulation"
          />
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Rotation Settings
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Configure rest intervals and reuse windows for your colony.
        </p>
        {/* TODO: Rotation settings form connected to rotation_settings table */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <SettingInput label="Minimum Rest Days" placeholder="90" />
          <SettingInput label="Target Rest Days" placeholder="120" />
          <SettingInput label="Overdue After Days" placeholder="135" />
          <SettingInput label="Preferred Reuse Window Start" placeholder="90" />
          <SettingInput label="Preferred Reuse Window End" placeholder="120" />
          <SettingInput label="Default Bin Capacity" placeholder="8" />
        </div>
        <button className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
          Save Settings
        </button>
      </section>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Enabled Modules
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Enable or disable modules for your workspace. Disabled modules are
          hidden from navigation.
        </p>
        {/* TODO: Module toggle list */}
        <div className="mt-4 space-y-2">
          {[
            "Inventory",
            "Rotation",
            "Repopulation",
            "Events",
            "Performance",
            "Protocols & Results",
            "Environment",
            "Notifications",
            "Analytics",
            "Photos",
            "Shipments",
            "Reports",
          ].map((mod) => (
            <div
              key={mod}
              className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3"
            >
              <span className="text-sm font-medium text-gray-700">{mod}</span>
              <div className="h-5 w-9 rounded-full bg-brand-600" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ModeOption({
  mode,
  label,
  description,
}: {
  mode: string;
  label: string;
  description: string;
}) {
  return (
    <button className="rounded-lg border border-gray-200 p-4 text-left transition hover:border-brand-500 hover:bg-brand-50">
      <p className="text-sm font-semibold text-gray-800">{label}</p>
      <p className="mt-1 text-xs text-gray-500">{description}</p>
      <p className="mt-2 font-mono text-xs text-gray-400">{mode}</p>
    </button>
  );
}

function SettingInput({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="number"
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
    </div>
  );
}
