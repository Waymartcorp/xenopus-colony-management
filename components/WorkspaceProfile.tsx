"use client";

// TODO: Fetch and save organization settings
// TODO: Show mode preview (dashboard cards, event templates)
// TODO: Validate rotation settings

export interface WorkspaceSettings {
  primaryLabMode: string;
  enabledModules: string[];
  rotationSettings: {
    minimumRestDays: number;
    targetRestDays: number;
    overdueAfterDays: number;
    preferredReuseWindowStart: number;
    preferredReuseWindowEnd: number;
    defaultTargetBinCapacity: number;
  };
}

interface WorkspaceProfileProps {
  settings: WorkspaceSettings;
  onSave: (settings: WorkspaceSettings) => void;
}

export default function WorkspaceProfile({
  settings,
  onSave,
}: WorkspaceProfileProps) {
  // TODO: Local state management for form
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Current Configuration
        </h3>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-600">Lab Mode</dt>
            <dd className="font-medium capitalize text-gray-900">
              {settings.primaryLabMode.replace(/_/g, " ")}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Min Rest Days</dt>
            <dd className="font-medium text-gray-900">
              {settings.rotationSettings.minimumRestDays}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Target Rest Days</dt>
            <dd className="font-medium text-gray-900">
              {settings.rotationSettings.targetRestDays}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Overdue After</dt>
            <dd className="font-medium text-gray-900">
              {settings.rotationSettings.overdueAfterDays} days
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Reuse Window</dt>
            <dd className="font-medium text-gray-900">
              {settings.rotationSettings.preferredReuseWindowStart}–
              {settings.rotationSettings.preferredReuseWindowEnd} days
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Default Bin Capacity</dt>
            <dd className="font-medium text-gray-900">
              {settings.rotationSettings.defaultTargetBinCapacity}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Enabled Modules</dt>
            <dd className="font-medium text-gray-900">
              {settings.enabledModules.length}
            </dd>
          </div>
        </dl>
      </div>
      <button
        onClick={() => onSave(settings)}
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Save Settings
      </button>
    </div>
  );
}
