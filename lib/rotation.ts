/**
 * Rotation cycle state management.
 *
 * Handles transitions between frog and bin lifecycle states based on events.
 * See docs/ROTATION_AND_FORECASTING.md.
 */

import { type RotationSettings, DEFAULT_ROTATION_SETTINGS } from "./repopulation-rules";

// TODO: Connect to Supabase to read/write cycle status
// TODO: Trigger notifications on state transitions
// TODO: Support bin-level events that transition all contained frogs
// TODO: Recalculate rest_complete_at and overdue_at on settings change

export type FrogCycleState =
  | "available"
  | "scheduled"
  | "recently_used"
  | "resting"
  | "rest_complete"
  | "overdue"
  | "hold_monitor"
  | "retired"
  | "deceased";

export type BinCycleState =
  | "general_population"
  | "recent_arrival"
  | "ready_for_use"
  | "scheduled_next"
  | "recently_used"
  | "needs_repopulation"
  | "resting"
  | "rest_complete"
  | "overdue"
  | "hold_monitor";

export interface CycleTransition {
  fromState: string;
  toState: string;
  trigger: string;
  timestamp: Date;
}

/**
 * Calculate rest completion date from use event date.
 */
export function calculateRestCompleteAt(
  useDate: Date,
  settings: RotationSettings = DEFAULT_ROTATION_SETTINGS
): Date {
  const restComplete = new Date(useDate);
  restComplete.setDate(restComplete.getDate() + settings.targetRestDays);
  return restComplete;
}

/**
 * Calculate overdue date from use event date.
 */
export function calculateOverdueAt(
  useDate: Date,
  settings: RotationSettings = DEFAULT_ROTATION_SETTINGS
): Date {
  const overdue = new Date(useDate);
  overdue.setDate(overdue.getDate() + settings.overdueAfterDays);
  return overdue;
}

/**
 * Determine current frog cycle state based on dates and settings.
 */
export function determineFrogCycleState(
  lastUsedAt: Date | null,
  restStartedAt: Date | null,
  settings: RotationSettings = DEFAULT_ROTATION_SETTINGS,
  now: Date = new Date()
): FrogCycleState {
  if (!lastUsedAt && !restStartedAt) return "available";

  const refDate = restStartedAt ?? lastUsedAt!;
  const daysSince = Math.floor(
    (now.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSince <= 1) return "recently_used";
  if (daysSince < settings.minimumRestDays) return "resting";
  if (daysSince >= settings.minimumRestDays && daysSince <= settings.overdueAfterDays) {
    return "rest_complete";
  }
  return "overdue";
}

/**
 * Determine current bin cycle state based on dates and settings.
 */
export function determineBinCycleState(
  lastUsedAt: Date | null,
  restStartedAt: Date | null,
  currentCount: number,
  targetCapacity: number,
  settings: RotationSettings = DEFAULT_ROTATION_SETTINGS,
  now: Date = new Date()
): BinCycleState {
  if (!lastUsedAt && !restStartedAt) {
    if (currentCount < Math.ceil(targetCapacity * 0.5)) return "needs_repopulation";
    return "general_population";
  }

  const refDate = restStartedAt ?? lastUsedAt!;
  const daysSince = Math.floor(
    (now.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSince <= 1) return "recently_used";
  if (daysSince < settings.minimumRestDays) return "resting";

  if (currentCount < Math.ceil(targetCapacity * 0.5)) return "needs_repopulation";

  if (daysSince >= settings.minimumRestDays && daysSince <= settings.overdueAfterDays) {
    return "rest_complete";
  }
  return "overdue";
}

/**
 * Generate human-readable status message for a frog.
 */
export function getFrogStatusMessage(
  state: FrogCycleState,
  restCompleteAt: Date | null
): string {
  switch (state) {
    case "available":
      return "Available for use";
    case "scheduled":
      return "Scheduled for upcoming use";
    case "recently_used":
      return "Recently used — resting starts soon";
    case "resting":
      return restCompleteAt
        ? `Resting — available ${restCompleteAt.toLocaleDateString()}`
        : "Resting";
    case "rest_complete":
      return "Rest complete — ready for reuse";
    case "overdue":
      return "Overdue — should be returned to use";
    case "hold_monitor":
      return "Hold — review required";
    case "retired":
      return "Retired";
    case "deceased":
      return "Deceased";
  }
}

/**
 * Process a use event and return updated cycle dates.
 */
export function processUseEvent(
  eventDate: Date,
  settings: RotationSettings = DEFAULT_ROTATION_SETTINGS
): {
  restStartedAt: Date;
  restCompleteAt: Date;
  overdueAt: Date;
  newState: FrogCycleState;
} {
  return {
    restStartedAt: eventDate,
    restCompleteAt: calculateRestCompleteAt(eventDate, settings),
    overdueAt: calculateOverdueAt(eventDate, settings),
    newState: "recently_used",
  };
}
