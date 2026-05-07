/**
 * Repopulation, rotation, and bin guidance engine.
 *
 * Evaluates bins and frogs against rules to produce movement and use recommendations.
 * See docs/REPOPULATION_AND_BIN_GUIDANCE.md and docs/ROTATION_AND_FORECASTING.md.
 */

// TODO: Connect to Supabase to fetch live data
// TODO: Add configurable rest interval per organization from rotation_settings
// TODO: Add size/sex compatibility matrix
// TODO: Add quarantine handling
// TODO: Add performance-aware scoring for bin ranking
// TODO: Add forecast calculation from rest_complete_at dates
// TODO: Support bulk operations (assign, move, rest, complete)

export interface RotationSettings {
  minimumRestDays: number;
  targetRestDays: number;
  overdueAfterDays: number;
  preferredReuseWindowStart: number;
  preferredReuseWindowEnd: number;
  defaultTargetBinCapacity: number;
}

export const DEFAULT_ROTATION_SETTINGS: RotationSettings = {
  minimumRestDays: 90,
  targetRestDays: 120,
  overdueAfterDays: 135,
  preferredReuseWindowStart: 90,
  preferredReuseWindowEnd: 120,
  defaultTargetBinCapacity: 8,
};

export interface BinStatus {
  locationId: string;
  label: string;
  capacity: number;
  currentCount: number;
  cycleState: string;
  lastUsedAt: string | null;
  restStartedAt: string | null;
  restCompleteAt: string | null;
  overdueAt: string | null;
  useCount: number;
  averagePerformanceScore: number | null;
  performanceTrend: "improving" | "stable" | "declining" | null;
  hasHealthWarnings: boolean;
  hasPerformanceWarnings: boolean;
  isQuarantine: boolean;
  compatibleSex: string | null;
  compatibleSizeClass: string | null;
}

export interface FrogStatus {
  frogId: string;
  publicCode: string;
  sex: string | null;
  sizeClass: string | null;
  status: string;
  cycleState: string;
  isResting: boolean;
  hasHealthWarning: boolean;
  daysSinceLastUse: number;
  useCount: number;
  averagePerformanceScore: number | null;
  performanceTrend: "improving" | "stable" | "declining" | null;
  recentPerformance: string | null;
  doNotUse: boolean;
  retirementCandidate: boolean;
}

export interface BinRecommendation {
  locationId: string;
  label: string;
  recommended: boolean;
  reason: string;
  availableCapacity: number;
  priority: "low" | "medium" | "high" | "urgent";
  recommendationType: "repopulation" | "next_use" | "avoid";
}

export interface FrogEligibility {
  frogId: string;
  publicCode: string;
  eligible: boolean;
  reason?: string;
  daysSinceLastUse: number;
}

// --- Bin evaluation ---

export function evaluateBinForRepopulation(
  bin: BinStatus,
  targetSex?: string | null,
  targetSizeClass?: string | null
): BinRecommendation {
  const availableCapacity = bin.capacity - bin.currentCount;

  if (availableCapacity <= 0) {
    return {
      locationId: bin.locationId,
      label: bin.label,
      recommended: false,
      reason: "No available capacity",
      availableCapacity: 0,
      priority: "low",
      recommendationType: "avoid",
    };
  }

  if (bin.hasHealthWarnings) {
    return {
      locationId: bin.locationId,
      label: bin.label,
      recommended: false,
      reason: "Active health warnings in this bin",
      availableCapacity,
      priority: "low",
      recommendationType: "avoid",
    };
  }

  if (bin.isQuarantine) {
    return {
      locationId: bin.locationId,
      label: bin.label,
      recommended: false,
      reason: "Bin is under quarantine/hold",
      availableCapacity,
      priority: "low",
      recommendationType: "avoid",
    };
  }

  if (bin.hasPerformanceWarnings) {
    return {
      locationId: bin.locationId,
      label: bin.label,
      recommended: false,
      reason: "Recent abnormal performance cluster",
      availableCapacity,
      priority: "low",
      recommendationType: "avoid",
    };
  }

  if (targetSex && bin.compatibleSex && bin.compatibleSex !== targetSex) {
    return {
      locationId: bin.locationId,
      label: bin.label,
      recommended: false,
      reason: `Sex mismatch: bin is ${bin.compatibleSex}, target is ${targetSex}`,
      availableCapacity,
      priority: "low",
      recommendationType: "avoid",
    };
  }

  if (
    targetSizeClass &&
    bin.compatibleSizeClass &&
    bin.compatibleSizeClass !== targetSizeClass
  ) {
    return {
      locationId: bin.locationId,
      label: bin.label,
      recommended: false,
      reason: `Size class mismatch`,
      availableCapacity,
      priority: "low",
      recommendationType: "avoid",
    };
  }

  return {
    locationId: bin.locationId,
    label: bin.label,
    recommended: true,
    reason: "Compatible and capacity available",
    availableCapacity,
    priority: availableCapacity >= bin.capacity / 2 ? "high" : "medium",
    recommendationType: "repopulation",
  };
}

// --- Bin next-use evaluation ---

export function evaluateBinForNextUse(
  bin: BinStatus,
  settings: RotationSettings = DEFAULT_ROTATION_SETTINGS
): BinRecommendation {
  if (
    bin.cycleState !== "ready_for_use" &&
    bin.cycleState !== "rest_complete"
  ) {
    return {
      locationId: bin.locationId,
      label: bin.label,
      recommended: false,
      reason: `Cycle state is ${bin.cycleState}`,
      availableCapacity: bin.capacity - bin.currentCount,
      priority: "low",
      recommendationType: "avoid",
    };
  }

  if (bin.currentCount < Math.ceil(bin.capacity * 0.5)) {
    return {
      locationId: bin.locationId,
      label: bin.label,
      recommended: false,
      reason: "Insufficient frog count for use",
      availableCapacity: bin.capacity - bin.currentCount,
      priority: "low",
      recommendationType: "avoid",
    };
  }

  if (bin.hasHealthWarnings) {
    return {
      locationId: bin.locationId,
      label: bin.label,
      recommended: false,
      reason: "Active health warnings",
      availableCapacity: bin.capacity - bin.currentCount,
      priority: "low",
      recommendationType: "avoid",
    };
  }

  const daysSinceRestComplete = bin.restCompleteAt
    ? daysBetween(new Date(bin.restCompleteAt), new Date())
    : 0;

  let priority: "low" | "medium" | "high" | "urgent" = "medium";
  if (daysSinceRestComplete > settings.overdueAfterDays - settings.targetRestDays) {
    priority = "urgent";
  } else if (daysSinceRestComplete > 14) {
    priority = "high";
  }

  const perfNote =
    bin.averagePerformanceScore != null
      ? `, avg performance ${bin.averagePerformanceScore.toFixed(1)}/5`
      : "";

  return {
    locationId: bin.locationId,
    label: bin.label,
    recommended: true,
    reason: `Rest complete${daysSinceRestComplete > 0 ? ` ${daysSinceRestComplete} days ago` : ""}${perfNote}, ${bin.currentCount} frogs available`,
    availableCapacity: bin.capacity - bin.currentCount,
    priority,
    recommendationType: "next_use",
  };
}

// --- Frog eligibility ---

export function evaluateFrogEligibility(
  frog: FrogStatus,
  settings: RotationSettings = DEFAULT_ROTATION_SETTINGS
): FrogEligibility {
  if (frog.doNotUse) {
    return {
      frogId: frog.frogId,
      publicCode: frog.publicCode,
      eligible: false,
      reason: "Flagged do-not-use",
      daysSinceLastUse: frog.daysSinceLastUse,
    };
  }

  if (frog.status !== "active") {
    return {
      frogId: frog.frogId,
      publicCode: frog.publicCode,
      eligible: false,
      reason: `Status is ${frog.status}`,
      daysSinceLastUse: frog.daysSinceLastUse,
    };
  }

  if (frog.isResting || frog.cycleState === "resting" || frog.cycleState === "recently_used") {
    return {
      frogId: frog.frogId,
      publicCode: frog.publicCode,
      eligible: false,
      reason: "Currently in rest period",
      daysSinceLastUse: frog.daysSinceLastUse,
    };
  }

  if (frog.hasHealthWarning) {
    return {
      frogId: frog.frogId,
      publicCode: frog.publicCode,
      eligible: false,
      reason: "Active health warning",
      daysSinceLastUse: frog.daysSinceLastUse,
    };
  }

  if (frog.daysSinceLastUse < settings.minimumRestDays && frog.daysSinceLastUse > 0) {
    return {
      frogId: frog.frogId,
      publicCode: frog.publicCode,
      eligible: false,
      reason: `Only ${frog.daysSinceLastUse}d since last use (minimum: ${settings.minimumRestDays})`,
      daysSinceLastUse: frog.daysSinceLastUse,
    };
  }

  if (
    frog.recentPerformance === "poor" ||
    frog.recentPerformance === "no_yield"
  ) {
    return {
      frogId: frog.frogId,
      publicCode: frog.publicCode,
      eligible: false,
      reason: "Recent poor performance — review recommended",
      daysSinceLastUse: frog.daysSinceLastUse,
    };
  }

  if (frog.retirementCandidate) {
    return {
      frogId: frog.frogId,
      publicCode: frog.publicCode,
      eligible: false,
      reason: "Flagged as retirement candidate",
      daysSinceLastUse: frog.daysSinceLastUse,
    };
  }

  return {
    frogId: frog.frogId,
    publicCode: frog.publicCode,
    eligible: true,
    daysSinceLastUse: frog.daysSinceLastUse,
  };
}

// --- Forecast ---

export interface ForecastResult {
  period: string;
  days: number;
  binsAvailable: number;
  frogsAvailable: number;
  binsOverdue: number;
}

export function calculateForecast(
  bins: BinStatus[],
  settings: RotationSettings = DEFAULT_ROTATION_SETTINGS
): ForecastResult[] {
  const periods = [
    { period: "30 Days", days: 30 },
    { period: "60 Days", days: 60 },
    { period: "90 Days", days: 90 },
    { period: "120 Days", days: 120 },
  ];

  const now = new Date();

  return periods.map(({ period, days }) => {
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const binsAvailable = bins.filter((bin) => {
      if (!bin.restCompleteAt) return bin.cycleState === "ready_for_use";
      return new Date(bin.restCompleteAt) <= futureDate;
    }).length;

    const frogsAvailable = bins
      .filter((bin) => {
        if (!bin.restCompleteAt) return bin.cycleState === "ready_for_use";
        return new Date(bin.restCompleteAt) <= futureDate;
      })
      .reduce((sum, bin) => sum + bin.currentCount, 0);

    const binsOverdue = bins.filter((bin) => {
      if (!bin.overdueAt) return false;
      return new Date(bin.overdueAt) <= futureDate;
    }).length;

    return { period, days, binsAvailable, frogsAvailable, binsOverdue };
  });
}

// --- Status message generation ---

export function generateBinStatusMessage(
  bin: BinStatus,
  settings: RotationSettings = DEFAULT_ROTATION_SETTINGS
): string {
  switch (bin.cycleState) {
    case "resting":
      return bin.restCompleteAt
        ? `Resting — available ${new Date(bin.restCompleteAt).toLocaleDateString()}`
        : "Resting";
    case "rest_complete":
    case "ready_for_use":
      return "Rest complete — ready for reuse";
    case "overdue": {
      const daysReady = bin.restCompleteAt
        ? daysBetween(new Date(bin.restCompleteAt), new Date())
        : 0;
      return `Overdue — ready for ${daysReady} days`;
    }
    case "needs_repopulation":
      return `Needs repopulation — add ${bin.capacity - bin.currentCount} frogs`;
    case "scheduled_next":
      return "Use next — best candidate bin";
    default:
      return bin.cycleState.replace(/_/g, " ");
  }
}

// --- Helpers ---

function daysBetween(start: Date, end: Date): number {
  return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

// --- Aggregated recommendations ---

export function generateRecommendations(
  bins: BinStatus[],
  frogs: FrogStatus[],
  settings: RotationSettings = DEFAULT_ROTATION_SETTINGS,
  options?: { targetSex?: string; targetSizeClass?: string }
): {
  repopulation: BinRecommendation[];
  nextUse: BinRecommendation[];
  avoid: BinRecommendation[];
  eligibleFrogs: FrogEligibility[];
} {
  const repopulation: BinRecommendation[] = [];
  const nextUse: BinRecommendation[] = [];
  const avoid: BinRecommendation[] = [];

  for (const bin of bins) {
    if (bin.cycleState === "needs_repopulation" || bin.currentCount < bin.capacity) {
      const result = evaluateBinForRepopulation(bin, options?.targetSex, options?.targetSizeClass);
      if (result.recommended) {
        repopulation.push(result);
      } else {
        avoid.push(result);
      }
    }

    if (bin.cycleState === "ready_for_use" || bin.cycleState === "rest_complete") {
      const result = evaluateBinForNextUse(bin, settings);
      if (result.recommended) {
        nextUse.push(result);
      }
    }
  }

  nextUse.sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const eligibleFrogs = frogs.map((frog) => evaluateFrogEligibility(frog, settings));

  return { repopulation, nextUse, avoid, eligibleFrogs };
}
