export type SeniorityLevel = 'Junior' | 'Mid' | 'Senior' | 'Lead';

export interface SeniorityRow {
  label: SeniorityLevel;
  headcount: number;
  hourlyRate: number; // euro/h, user-overridable
}

export type SizingMode = 'story-points' | 'direct-hours';
export type DirectHoursUnit = 'hours' | 'days';

export interface SizingInputs {
  mode: SizingMode;
  storyPoints: number;
  velocity: number;       // SP per sprint
  sprintWeeks: number;    // 1-4
  directValue: number;
  directUnit: DirectHoursUnit;
}

export interface EngineInputs {
  teamAvgHourlyRate: number;
  devHours: number;
  horizonYears: number;
  maintenanceRate: number;         // default 0.18 shared, 0.22 duplicated
  generalizationFactor: number;    // default 1.3
  portingFactor: number;           // default 0.65
  divergenceRate: number;          // default 0.20
  bugDuplicationFactor: number;    // default 2.0
  nbConsumingCodebases: number;    // default 2
  maintenanceRateShared?: number;  // optional — overrides ENGINE_DEFAULTS.maintenanceRateShared in calcBreakEven
}

export interface BreakdownRow {
  category: string;
  hours: number;
  cost: number;
  percentage: number; // 0-100
}

export interface StandaloneOutputs {
  teamAvgHourlyRate: number;
  initialDevCost: number;
  initialDevHours: number;
  annualMaintenanceCost: number;
  totalMaintenanceCost: number;
  totalStandaloneCost: number;
  breakdown: BreakdownRow[];
}

export interface SharedCostOutputs {
  initialDevCost: number;
  libSetupCost: number;
  annualMaintenanceCost: number;
  annualCoordinationCost: number;
  annualOnboardingCost: number;
  totalCost: number;
  yearlyBreakdown: YearCost[];
}

export interface DuplicatedCostOutputs {
  duplicatedDevCost: number;
  yearlyBreakdown: YearCost[];
  totalCost: number;
  totalBugsCost: number;   // sum of all yearly bug costs over the horizon
  totalSyncCost: number;   // sum of all yearly sync costs over the horizon
}

export interface YearCost {
  year: number;
  cumulativeCost: number;
}

export interface BreakEvenResult {
  exists: boolean;
  months: number | null;
}

/** Default salary values from docs/feature-cost-shared-vs-duplicated.md section 1.3 */
export const SENIORITY_DEFAULTS: Record<SeniorityLevel, number> = {
  Junior: 32,
  Mid: 40,
  Senior: 51,
  Lead: 67,
} as const;

/** French legal working hours per week */
export const HOURS_PER_WEEK = 35;

/** French legal working hours per day */
export const HOURS_PER_DAY = 7;

/** Default engine parameters from research doc */
export const ENGINE_DEFAULTS = {
  generalizationFactor: 1.3,
  portingFactor: 0.65,
  divergenceRate: 0.20,
  maintenanceRateShared: 0.18,
  maintenanceRateDuplicated: 0.22,
  bugDuplicationFactor: 2.0,
  nbConsumingCodebases: 1,
  defaultHorizonYears: 3,
} as const;
