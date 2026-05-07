export default function NotificationsPage() {
  // TODO: Fetch notification preferences and rules for current user/org
  // TODO: Show notification history (sent, queued, failed)
  // TODO: NotificationPreferences component for channel settings
  // TODO: NotificationScheduler component for rule management
  // TODO: Support lab-mode-specific alert templates
  // TODO: Show scheduled alerts and next send times
  // TODO: Today's Colony Actions notification preview
  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
      <p className="mt-2 text-gray-600">
        Configure how you receive colony updates, rotation alerts, and
        performance notices. Supports email, SMS, and in-app channels.
      </p>

      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Channel Preferences
        </h2>
        {/* TODO: NotificationPreferences component */}
        <div className="mt-4 space-y-3">
          <PreferenceRow
            label="Email notifications"
            description="Weekly summaries, rest-complete alerts, reports, claim links"
          />
          <PreferenceRow
            label="SMS notifications"
            description="Urgent alerts, overdue rotation, same-day reminders"
          />
          <PreferenceRow
            label="In-app alerts"
            description="Dashboard warnings, today's actions, task prompts"
          />
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Notification Rules
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Rules that trigger automatic notifications based on colony state.
        </p>
        {/* TODO: NotificationScheduler component */}
        <div className="mt-4 space-y-2">
          {[
            { type: "Rest Complete", channel: "email + in-app" },
            { type: "Overdue Rotation", channel: "email + SMS" },
            { type: "Repopulation Needed", channel: "in-app" },
            { type: "Weekly Summary", channel: "email" },
            { type: "Missing Result", channel: "in-app" },
            { type: "Performance Decline", channel: "in-app" },
            { type: "Forecast Summary", channel: "email (monthly)" },
          ].map((rule) => (
            <div
              key={rule.type}
              className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {rule.type}
                </p>
                <p className="text-xs text-gray-400">{rule.channel}</p>
              </div>
              <div className="h-5 w-9 rounded-full bg-brand-600" />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Notification History
        </h2>
        <p className="mt-4 text-sm text-gray-500">
          No notifications sent yet. Notifications will appear here once rules
          are triggered.
        </p>
      </section>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Scheduled Alerts
        </h2>
        <p className="mt-4 text-sm text-gray-500">
          Upcoming scheduled notifications (weekly summaries, forecasts) will
          show here.
        </p>
      </section>
    </div>
  );
}

function PreferenceRow({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      {/* TODO: Toggle switch */}
      <div className="h-6 w-11 rounded-full bg-brand-600" />
    </div>
  );
}
