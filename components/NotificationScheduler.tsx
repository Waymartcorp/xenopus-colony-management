"use client";

// TODO: Fetch notification_rules for org
// TODO: Allow creating/editing/disabling rules
// TODO: Support lab-mode-specific alert templates
// TODO: Show next scheduled send time

export interface NotificationRule {
  id: string;
  ruleType: string;
  channel: "email" | "sms" | "in_app";
  enabled: boolean;
  schedule: string | null;
}

interface NotificationSchedulerProps {
  rules: NotificationRule[];
  onToggle: (ruleId: string, enabled: boolean) => void;
  onAdd?: () => void;
}

export default function NotificationScheduler({
  rules,
  onToggle,
  onAdd,
}: NotificationSchedulerProps) {
  const ruleTypeLabels: Record<string, string> = {
    rest_complete: "Rest Complete",
    overdue: "Overdue Rotation",
    repopulation: "Repopulation Needed",
    next_use: "Next Use Recommendation",
    missing_result: "Missing Result",
    weekly_summary: "Weekly Summary",
    daily_summary: "Daily Summary",
    environment_note: "Environmental Reminder",
    performance_decline: "Performance Decline",
    forecast_summary: "Forecast Summary",
  };

  const channelIcons: Record<string, string> = {
    email: "✉️",
    sms: "📱",
    in_app: "🔔",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">
          Notification Rules
        </h3>
        {onAdd && (
          <button
            onClick={onAdd}
            className="rounded-md bg-brand-600 px-3 py-1 text-xs font-medium text-white hover:bg-brand-700"
          >
            + Add Rule
          </button>
        )}
      </div>

      {rules.length === 0 ? (
        <p className="text-sm text-gray-500">
          No notification rules configured.
        </p>
      ) : (
        <div className="space-y-2">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span>{channelIcons[rule.channel]}</span>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {ruleTypeLabels[rule.ruleType] ?? rule.ruleType}
                  </p>
                  {rule.schedule && (
                    <p className="text-xs text-gray-400">{rule.schedule}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => onToggle(rule.id, !rule.enabled)}
                className={`relative h-5 w-9 rounded-full transition ${
                  rule.enabled ? "bg-brand-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${
                    rule.enabled ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
