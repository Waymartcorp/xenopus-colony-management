/**
 * Notification dispatch and preference management.
 *
 * Channels: email, sms, in_app
 * Triggers: rest-complete, overdue, repopulation, next-use, missing result,
 *           weekly summary, daily summary, performance decline, forecast summary.
 *
 * SAFE DEV MODE: If API keys are not configured, notifications log to console
 * instead of failing. Real dispatch only occurs when keys are present.
 *
 * See docs/NOTIFICATIONS_AND_UPDATES.md for full specification.
 */

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
  | "forecast_summary"
  | "projected_shortage"
  | "runout_warning"
  | "frog_threshold_crossed"
  | "bin_threshold_crossed"
  | "weekly_bottleneck_summary"
  | "monthly_capacity_forecast"
  | "urgent_repopulation"
  | "feeding_due"
  | "feeding_missed"
  | "husbandry_checkpoint_due"
  | "husbandry_checkpoint_overdue"
  | "abnormal_checkpoint"
  | "post_use_recovery_due"
  | "post_shipment_acclimation_due"
  | "density_review_due";

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

// --- Environment checks ---

function isEmailConfigured(): boolean {
  return !!(
    process.env.RESEND_API_KEY ||
    process.env.POSTMARK_API_KEY
  );
}

function isSmsConfigured(): boolean {
  return !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_FROM_NUMBER
  );
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
  payload: NotificationPayload
): Promise<{ success: boolean; messageId?: string }> {
  if (!isEmailConfigured()) {
    console.log("[DEV] Email not sent (no API key configured):", {
      to: payload.userId,
      subject: payload.subject,
      bodyPreview: payload.body.slice(0, 100),
    });
    return { success: true, messageId: "dev-mock" };
  }

  // TODO: Implement Resend dispatch
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // const { data, error } = await resend.emails.send({
  //   from: process.env.DEFAULT_FROM_EMAIL ?? 'noreply@xenotrack.app',
  //   to: [recipientEmail],
  //   subject: payload.subject,
  //   text: payload.body,
  // });
  console.log("[PROD] Email dispatch placeholder:", payload.subject);
  return { success: false };
}

async function sendSms(
  payload: NotificationPayload
): Promise<{ success: boolean; messageId?: string }> {
  if (!isSmsConfigured()) {
    console.log("[DEV] SMS not sent (no Twilio keys configured):", {
      to: payload.userId,
      bodyPreview: payload.body.slice(0, 80),
    });
    return { success: true, messageId: "dev-mock" };
  }

  // TODO: Implement Twilio dispatch
  // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  // const message = await client.messages.create({
  //   body: payload.body,
  //   from: process.env.TWILIO_FROM_NUMBER,
  //   to: recipientPhone,
  // });
  console.log("[PROD] SMS dispatch placeholder:", payload.body.slice(0, 80));
  return { success: false };
}

async function createInAppNotification(
  payload: NotificationPayload
): Promise<{ success: boolean; messageId?: string }> {
  // TODO: Insert into notification_events table with status 'delivered'
  // This always works locally since it's just a database insert
  console.log("[DEV] In-app notification:", {
    subject: payload.subject,
    bodyPreview: payload.body.slice(0, 100),
  });
  return { success: true, messageId: "in-app-pending" };
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

// --- Capacity & Run-Out Notification Templates ---

export function generateRunOutWarning(
  daysUntil: number,
  useRate: number,
  threshold: number,
  runoutDate: string
): string {
  return `Run-out warning: At your current use rate of ${useRate} frogs/week, ready frogs are projected to fall below threshold (${threshold}) in ${daysUntil} days (${runoutDate}).`;
}

export function generateProjectedShortage(
  shortfall: number,
  periodDays: number,
  recommendation: string
): string {
  return `Projected shortage: ${shortfall} frogs over the next ${periodDays} days. ${recommendation}`;
}

export function generateThresholdCrossedAlert(
  type: "frog" | "bin",
  current: number,
  threshold: number
): string {
  const label = type === "frog" ? "Ready frogs" : "Ready bins";
  return `${label} have fallen below threshold: ${current} available (threshold: ${threshold}). Immediate action recommended.`;
}

export function generateWeeklyBottleneckSummary(stats: {
  repopNeeded: number;
  overdueCount: number;
  shortageRisk: boolean;
  nextMonthProjection: string;
}): string {
  const lines = [
    "Weekly bottleneck summary:",
    `• ${stats.repopNeeded} bins need repopulation`,
    `• ${stats.overdueCount} frogs are overdue for reuse`,
  ];
  if (stats.shortageRisk) {
    lines.push(`• Ready supply is projected to drop below target ${stats.nextMonthProjection}`);
  }
  return lines.join("\n");
}

export function generateMonthlyCapacityForecast(stats: {
  useRate: number;
  avgPerformance: number;
  projectedCapacity: number;
  bottleneckCount: number;
  seasonalNote: string | null;
  recommendations: string[];
}): string {
  const lines = [
    "Monthly colony capacity forecast:",
    "",
    `Use rate: ${stats.useRate} frogs/week`,
    `Average performance: ${stats.avgPerformance}/5`,
    `Projected capacity: ${stats.projectedCapacity} frogs`,
    `Active bottlenecks: ${stats.bottleneckCount}`,
  ];
  if (stats.seasonalNote) {
    lines.push("", `Seasonality: ${stats.seasonalNote}`);
  }
  if (stats.recommendations.length > 0) {
    lines.push("", "Recommended adjustments:");
    stats.recommendations.forEach((r) => lines.push(`• ${r}`));
  }
  return lines.join("\n");
}

export function generateUrgentRepopulationMessage(
  frogsNeeded: number,
  timeframeDays: number,
  reason: string
): string {
  return `Repopulation recommendation: Add ${frogsNeeded} mature females over the next ${timeframeDays} days to ${reason}.`;
}

// --- Husbandry Notification Templates ---

export function generateFeedingDueMessage(
  location: string,
  time: string
): string {
  return `Feeding due: ${location} at ${time}.`;
}

export function generateFeedingMissedMessage(
  location: string,
  dueAt: string
): string {
  return `Missed feeding: ${location} was due at ${dueAt} and has not been logged. Please feed or reschedule.`;
}

export function generateHusbandryCheckpointDueMessage(
  checkpointType: string,
  location: string
): string {
  return `Husbandry checkpoint due: ${checkpointType} for ${location}.`;
}

export function generateHusbandryCheckpointOverdueMessage(
  checkpointType: string,
  location: string,
  daysPast: number
): string {
  return `Husbandry checkpoint overdue: ${checkpointType} for ${location} (${daysPast} days past due).`;
}

export function generateAbnormalCheckpointMessage(
  checkpointType: string,
  location: string,
  status: string,
  notes: string
): string {
  return `Attention: ${checkpointType} for ${location} marked ${status}. ${notes}`;
}

export function generatePostUseRecoveryMessage(
  location: string,
  daysSinceUse: number
): string {
  return `Post-use recovery check due: ${location} (${daysSinceUse} days since extraction). Verify feeding response and behavior.`;
}

export function generateConsecutivePoorFeedingMessage(
  location: string,
  count: number
): string {
  return `Attention: ${location} feeding response marked poor for ${count} consecutive feedings. Review bin health.`;
}
