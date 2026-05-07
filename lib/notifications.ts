/**
 * Notification dispatch and preference management.
 *
 * Channels: email, sms, in_app
 * Triggers: rest-complete, overdue, repopulation, next-use, missing result,
 *           weekly summary, daily summary, performance decline, forecast summary.
 *
 * See docs/NOTIFICATIONS_AND_UPDATES.md for full specification.
 */

// TODO: Integrate Resend/Postmark for email dispatch
// TODO: Integrate Twilio for SMS dispatch
// TODO: Implement in-app notification storage and polling
// TODO: Add cron-based scheduled notifications (daily/weekly/monthly)
// TODO: Add lab-mode-specific notification templates
// TODO: Add notification rule evaluation engine

export type NotificationChannel = "email" | "sms" | "in_app";

export type NotificationRuleType =
  | "rest_complete"
  | "overdue"
  | "repopulation"
  | "next_use"
  | "missing_result"
  | "weekly_summary"
  | "daily_summary"
  | "environment_note"
  | "performance_decline"
  | "forecast_summary";

export interface NotificationPayload {
  organizationId: string;
  userId?: string;
  channel: NotificationChannel;
  subject: string;
  body: string;
  ruleType?: NotificationRuleType;
}

export interface NotificationRule {
  id: string;
  organizationId: string;
  ruleType: NotificationRuleType;
  channel: NotificationChannel;
  enabled: boolean;
  schedule: string | null;
}

export interface NotificationPreferences {
  emailEnabled: boolean;
  smsEnabled: boolean;
  inAppEnabled: boolean;
  summaryFrequency: "daily" | "weekly" | "none";
  urgentOnly: boolean;
}

// --- Dispatch ---

export async function sendNotification(
  payload: NotificationPayload
): Promise<{ success: boolean; messageId?: string }> {
  switch (payload.channel) {
    case "email":
      return sendEmail(payload);
    case "sms":
      return sendSms(payload);
    case "in_app":
      return createInAppNotification(payload);
    default:
      return { success: false };
  }
}

async function sendEmail(
  _payload: NotificationPayload
): Promise<{ success: boolean; messageId?: string }> {
  // TODO: Use Resend or Postmark API
  // TODO: Template rendering for colony summaries, rotation alerts, claim links
  console.log("Email dispatch not yet implemented");
  return { success: false };
}

async function sendSms(
  _payload: NotificationPayload
): Promise<{ success: boolean; messageId?: string }> {
  // TODO: Use Twilio API
  // TODO: Respect SMS character limits
  console.log("SMS dispatch not yet implemented");
  return { success: false };
}

async function createInAppNotification(
  _payload: NotificationPayload
): Promise<{ success: boolean; messageId?: string }> {
  // TODO: Insert into notification_events table with status 'delivered'
  console.log("In-app notification not yet implemented");
  return { success: false };
}

// --- Rule Evaluation ---

export async function evaluateNotificationRules(
  _organizationId: string,
  _triggerType: NotificationRuleType,
  _context: Record<string, unknown>
): Promise<NotificationPayload[]> {
  // TODO: Query notification_rules for org where rule_type matches
  // TODO: Generate payloads for each matching + enabled rule
  // TODO: Use lab-mode-specific templates based on org primary_lab_mode
  return [];
}

// --- Template Generation ---

export function generateRestCompleteMessage(
  binLabel: string,
  frogCount: number,
  daysSinceUse: number
): string {
  return `${binLabel} has completed rest. ${frogCount} frogs are eligible for reuse. Last use: ${daysSinceUse} days ago.`;
}

export function generateOverdueMessage(
  count: number,
  daysPastReady: number
): string {
  return `${count} frogs have been ready for more than ${daysPastReady} days and have not been returned to use. Review rotation plan.`;
}

export function generateRepopulationMessage(
  binLabel: string,
  currentCount: number,
  targetCapacity: number,
  sex?: string
): string {
  const deficit = targetCapacity - currentCount;
  const sexLabel = sex ? ` ${sex}` : "";
  return `${binLabel} needs repopulation. Current: ${currentCount} frogs. Target: ${targetCapacity}. Recommended add: ${deficit}${sexLabel} frogs.`;
}

export function generateNextUseMessage(
  binLabel: string,
  reason: string
): string {
  return `Next suggested bin for use: ${binLabel}. Reason: ${reason}.`;
}

export function generateWeeklySummary(stats: {
  readyBins: number;
  restingBins: number;
  overdueBins: number;
  repopulationNeeded: number;
  overdueCount: number;
  nextRecommendedBin: string | null;
  avgPerformance: number | null;
  missingResults: number;
  forecast30Bins: number;
  forecast60Bins: number;
  forecast90Bins: number;
}): string {
  const lines = [
    "Colony Rotation Summary",
    "",
    `Ready bins: ${stats.readyBins}`,
    `Resting bins: ${stats.restingBins}`,
    `Bins needing repopulation: ${stats.repopulationNeeded}`,
    `Overdue rest-complete frogs: ${stats.overdueCount}`,
  ];

  if (stats.nextRecommendedBin) {
    lines.push(`Next recommended bin: ${stats.nextRecommendedBin}`);
  }

  lines.push("");
  lines.push("Forecast:");
  lines.push(`  Bins available in 30 days: ${stats.forecast30Bins}`);
  lines.push(`  Bins available in 60 days: ${stats.forecast60Bins}`);
  lines.push(`  Bins available in 90 days: ${stats.forecast90Bins}`);

  if (stats.avgPerformance != null) {
    lines.push("");
    lines.push(`Average performance: ${stats.avgPerformance.toFixed(1)}/5`);
  }

  if (stats.missingResults > 0) {
    lines.push(`Missing results: ${stats.missingResults} events`);
  }

  return lines.join("\n");
}

// --- Scheduled Job Helpers ---

export async function runDailyNotificationCheck(
  _organizationId: string
): Promise<void> {
  // TODO: Check for rest-complete, overdue, missing data
  // TODO: Generate and send notifications for matching rules
}

export async function runWeeklySummary(
  _organizationId: string
): Promise<void> {
  // TODO: Aggregate colony stats
  // TODO: Generate weekly summary
  // TODO: Send to owners/managers via configured channels
}

export async function runMonthlyForecast(
  _organizationId: string
): Promise<void> {
  // TODO: Generate 30/60/90/120-day forecast
  // TODO: Send forecast summary to configured recipients
}
