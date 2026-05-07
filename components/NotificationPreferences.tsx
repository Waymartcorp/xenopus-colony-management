"use client";

import { useState } from "react";

// TODO: Fetch current preferences from Supabase
// TODO: Save preference changes via API
// TODO: Support email, SMS, in-app channel toggles
// TODO: Frequency selection (immediate, daily, weekly)
// TODO: Role-based alert filtering

interface Preferences {
  emailEnabled: boolean;
  smsEnabled: boolean;
  inAppEnabled: boolean;
  summaryFrequency: "daily" | "weekly" | "none";
  urgentOnly: boolean;
}

interface NotificationPreferencesProps {
  initialPreferences: Preferences;
  onSave: (prefs: Preferences) => void;
}

export default function NotificationPreferences({
  initialPreferences,
  onSave,
}: NotificationPreferencesProps) {
  const [prefs, setPrefs] = useState<Preferences>(initialPreferences);

  function toggle(key: keyof Preferences) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-800">Channels</h3>
        <Toggle
          label="Email"
          description="Summaries, reports, claim links"
          enabled={prefs.emailEnabled}
          onToggle={() => toggle("emailEnabled")}
        />
        <Toggle
          label="SMS"
          description="Urgent alerts and time-sensitive messages"
          enabled={prefs.smsEnabled}
          onToggle={() => toggle("smsEnabled")}
        />
        <Toggle
          label="In-App"
          description="Dashboard alerts and task prompts"
          enabled={prefs.inAppEnabled}
          onToggle={() => toggle("inAppEnabled")}
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-800">
          Summary Frequency
        </h3>
        <select
          value={prefs.summaryFrequency}
          onChange={(e) =>
            setPrefs((prev) => ({
              ...prev,
              summaryFrequency: e.target.value as Preferences["summaryFrequency"],
            }))
          }
          className="mt-2 rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="none">None</option>
        </select>
      </div>

      <Toggle
        label="Urgent only"
        description="Only receive critical notifications"
        enabled={prefs.urgentOnly}
        onToggle={() => toggle("urgentOnly")}
      />

      <button
        onClick={() => onSave(prefs)}
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Save Preferences
      </button>
    </div>
  );
}

function Toggle({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`relative h-6 w-11 rounded-full transition ${
          enabled ? "bg-brand-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
