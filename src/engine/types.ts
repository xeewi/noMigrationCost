/**
 * @file types.ts
 * @author Guillaume Gautier (xeewi)
 * @created 2026-03-23
 * @project Feature Cost Calculator
 */

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
  velocity: number;       // team SP per sprint
  sprintWeeks: number;    // 1-4
  directValue: number;    // person-hours or person-days
  directUnit: DirectHoursUnit;
}

/** Model assumptions the user can tune (docs §7). */
export interface ModelParams {
  generalizationFactor: number; // G: build cost of the shareable version / specific version
  portingFactor: number;        // p: cost to copy-adapt into one more app / first build
  integrationFactor: number;    // i: cost to plug the library into one more app / first build
  maintenanceRate: number;      // m: yearly upkeep of one copy / its build cost
  extraCopyUpkeep: number;      // e0: yearly upkeep of an extra copy / upkeep of the first (sync included)
  divergenceRate: number;       // δ: yearly growth of e0 as copies drift (capped)
  coordinationRate: number;     // k: yearly coordination + upgrades per extra app / first build
}

export interface EngineInputs extends ModelParams {
  teamAvgHourlyRate: number;
  devHours: number;       // person-hours for one specific build
  horizonYears: number;
  nbCodebases: number;    // apps that need the feature (>= 2 for the comparison)
  newLibrary: boolean;    // false = the shared library already exists
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

export interface CostLine {
  label: string;
  cost: number;
}

export interface MonthCostPoint {
  month: number;       // 0..horizonYears*12
  shared: number;      // cumulative
  duplicated: number;  // cumulative
}

export interface ComparisonOutputs {
  shared: { lines: CostLine[]; total: number };
  duplicated: { lines: CostLine[]; total: number };
  monthly: MonthCostPoint[];
  /** First month from which sharing stays cheaper until the horizon. 0 = from day one, null = never within horizon. */
  breakEvenMonth: number | null;
}

/** Loaded hourly cost per seniority, France 2026 national (gross × employer multiplier / 1,607 h). Docs §1.3. */
export const SENIORITY_DEFAULTS: Record<SeniorityLevel, number> = {
  Junior: 32,
  Mid: 40,
  Senior: 50,
  Lead: 62,
} as const;

/** French legal working hours per week */
export const HOURS_PER_WEEK = 35;

/** French legal working hours per day */
export const HOURS_PER_DAY = 7;

/** Default model assumptions (docs §7.4). */
export const ENGINE_DEFAULTS: ModelParams = {
  generalizationFactor: 1.2,
  portingFactor: 0.65,
  integrationFactor: 0.2,
  maintenanceRate: 0.2,
  extraCopyUpkeep: 1.0,
  divergenceRate: 0.05,
  coordinationRate: 0.04,
};

/** One-off effort to stand up a new shared library: 8 weeks × 35 h (docs §3.1, assumption). */
export const LIB_SETUP_HOURS = 280;

/** Yearly effort to run a shared library: releases, CI, dependency updates (docs §3.2, assumption). */
export const LIB_RUN_HOURS_PER_YEAR = 100;

/** Ceiling on the extra-copy upkeep ratio: past this, teams stop syncing rather than pay more (docs §7.3). */
export const EXTRA_COPY_UPKEEP_MAX = 1.5;
