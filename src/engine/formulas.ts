/**
 * @file formulas.ts
 * @author Guillaume Gautier (xeewi)
 * @created 2026-03-23
 * @project Feature Cost Calculator
 */

/**
 * Formula Engine — All cost calculation functions.
 *
 * All functions are PURE TypeScript — no React imports, no side effects.
 * Each formula is directly traceable to docs/feature-cost-shared-vs-duplicated.md §7.
 *
 * Constants from French labor law and research doc:
 *   - 35h/week (HOURS_PER_WEEK) — legal basis France
 *   - 7h/day (HOURS_PER_DAY) — 35h / 5 days
 */

import type {
  SeniorityRow,
  SizingInputs,
  EngineInputs,
  StandaloneOutputs,
  SharedCostOutputs,
  DuplicatedCostOutputs,
  BreakEvenResult,
  YearCost,
} from './types';
import { HOURS_PER_WEEK, HOURS_PER_DAY, ENGINE_DEFAULTS } from './types';

// ---------------------------------------------------------------------------
// Internal constants derived from research doc examples
// ---------------------------------------------------------------------------

/**
 * Lib setup duration in weeks (§7.1: typical 8-week setup).
 * Used in libSetupCost and break-even calculations.
 */
const LIB_SETUP_WEEKS = 8;

/**
 * Annual versioning cost per year (§7.1: 12 releases × 3h × 65€ = 2340€).
 * This is embedded in the research doc example with the senior rate.
 * We scale it with the team's hourly rate.
 */
const VERSIONING_RELEASES_PER_YEAR = 12;
const VERSIONING_HOURS_PER_RELEASE = 3;

/**
 * Annual consumer support cost (§7.1: 7.5h × 52 × 65 = 25350€).
 * Scale with team's hourly rate.
 */
const SUPPORT_HOURS_PER_WEEK = 7.5;
const WEEKS_PER_YEAR = 52;

/**
 * Coordination hours per week per team (§7.1: 3h/week/team).
 */
const COORDINATION_HOURS_PER_WEEK_PER_TEAM = 3;

/**
 * Annual onboarding cost constants (§7.1: 3 new devs, 60h training + 20h mentoring).
 */
const NEW_DEVS_PER_YEAR = 3;
const ONBOARDING_TRAINING_HOURS = 60;
const ONBOARDING_TRAINING_RATE_FACTOR = 50 / 65; // mid-level rate as fraction of senior rate
const ONBOARDING_MENTORING_HOURS = 20;

/**
 * Duplicated code maintenance factor model (§7.2).
 * Starts at 1.8 year 1, increases 0.05 per year.
 */
const DOUBLE_MAINTENANCE_FACTOR_BASE = 1.8;
const DOUBLE_MAINTENANCE_FACTOR_INCREMENT = 0.05;

/**
 * Sync parameters used in §7.2 worked example.
 */
const EVOLVED_FEATURES_PER_YEAR = 8;
const SYNC_HOURS_PER_FEATURE_BASE = 16;

/**
 * Additional bug cost used in §7.2 worked example.
 * This is the total annual cost of additional bugs from duplication.
 */
const ADDITIONAL_BUGS_ANNUAL_COST = 50_600;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Calculates the weighted average hourly rate across the team.
 * Only rows with headcount > 0 are included.
 * Returns 0 if all headcounts are 0 (no division by zero).
 *
 * Formula: sum(headcount × rate) / sum(headcount)
 */
export function calcTeamAvgRate(team: SeniorityRow[]): number {
  const totalHeadcount = team.reduce((sum, row) => sum + row.headcount, 0);
  if (totalHeadcount === 0) return 0;

  const weightedSum = team.reduce(
    (sum, row) => sum + row.headcount * row.hourlyRate,
    0,
  );
  return weightedSum / totalHeadcount;
}

/**
 * Converts sizing inputs to development hours.
 *
 * Story-points mode: (storyPoints / velocity) × sprintWeeks × HOURS_PER_WEEK
 * Direct-hours mode: directValue (hours) or directValue × HOURS_PER_DAY (days)
 * Guards division by zero: returns 0 when velocity is 0 in SP mode.
 */
export function calcDevHours(sizing: SizingInputs): number {
  if (sizing.mode === 'story-points') {
    if (sizing.velocity === 0) return 0;
    const sprints = sizing.storyPoints / sizing.velocity;
    return sprints * sizing.sprintWeeks * HOURS_PER_WEEK;
  }

  // direct-hours mode
  if (sizing.directUnit === 'days') {
    return sizing.directValue * HOURS_PER_DAY;
  }
  return sizing.directValue;
}

/**
 * Calculates the total standalone cost of a feature.
 *
 * Formulas (§7.1 standalone variant):
 *   initialDevCost = devHours × teamAvgHourlyRate × generalizationFactor
 *   annualMaintenanceCost = initialDevCost × maintenanceRate
 *   totalMaintenanceCost = annualMaintenanceCost × horizonYears
 *   totalStandaloneCost = initialDevCost + totalMaintenanceCost
 */
export function calcStandaloneCost(inputs: EngineInputs): StandaloneOutputs {
  const {
    teamAvgHourlyRate,
    devHours,
    horizonYears,
    maintenanceRate,
    generalizationFactor,
  } = inputs;

  const initialDevCost = devHours * teamAvgHourlyRate * generalizationFactor;
  const annualMaintenanceCost = initialDevCost * maintenanceRate;
  const totalMaintenanceCost = annualMaintenanceCost * horizonYears;
  const totalStandaloneCost = initialDevCost + totalMaintenanceCost;

  const breakdown = [
    {
      category: 'Initial Development',
      hours: devHours,
      cost: initialDevCost,
      percentage: (initialDevCost / totalStandaloneCost) * 100,
    },
    {
      category: `Annual Maintenance (x${horizonYears} years)`,
      hours: 0, // maintenance hours not directly tracked
      cost: totalMaintenanceCost,
      percentage: (totalMaintenanceCost / totalStandaloneCost) * 100,
    },
  ];

  return {
    teamAvgHourlyRate,
    initialDevCost,
    initialDevHours: devHours,
    annualMaintenanceCost,
    totalMaintenanceCost,
    totalStandaloneCost,
    breakdown,
  };
}

/**
 * Calculates the total cost of the shared code approach over the horizon.
 *
 * Formulas (§7.1):
 *   initialDevCost = devHours × rate × generalizationFactor
 *   libSetupCost = LIB_SETUP_WEEKS × HOURS_PER_WEEK × rate
 *   annualMaintenanceCost = (initialDevCost × maintenanceRate) + versioningCost + supportCost
 *   annualCoordinationCost = nbConsumingCodebases × COORDINATION_HOURS_PER_WEEK × 52 × rate
 *   annualOnboardingCost = NEW_DEVS × (trainingHours × midRate + mentoringHours × rate)
 *
 * Cumulative yearly breakdown starts at Year 0 (setup year).
 */
export function calcSharedCost(inputs: EngineInputs): SharedCostOutputs {
  const {
    teamAvgHourlyRate: rate,
    devHours,
    horizonYears,
    maintenanceRate,
    generalizationFactor,
    nbConsumingCodebases,
  } = inputs;

  const initialDevCost = devHours * rate * generalizationFactor;
  const libSetupCost = LIB_SETUP_WEEKS * HOURS_PER_WEEK * rate;

  // Annual maintenance = base maintenance + versioning + consumer support
  const baseMaintenance = initialDevCost * maintenanceRate;
  const versioningCost = VERSIONING_RELEASES_PER_YEAR * VERSIONING_HOURS_PER_RELEASE * rate;
  const supportCost = SUPPORT_HOURS_PER_WEEK * WEEKS_PER_YEAR * rate;
  const annualMaintenanceCost = baseMaintenance + versioningCost + supportCost;

  // Annual coordination cost (§7.1: nbTeams × 3h/week × 52 × rate)
  const annualCoordinationCost =
    nbConsumingCodebases * COORDINATION_HOURS_PER_WEEK_PER_TEAM * WEEKS_PER_YEAR * rate;

  // Annual onboarding cost (§7.1: 3 new devs × (60h×midRate + 20h×seniorRate))
  const midRate = rate * ONBOARDING_TRAINING_RATE_FACTOR;
  const annualOnboardingCost =
    NEW_DEVS_PER_YEAR *
    (ONBOARDING_TRAINING_HOURS * midRate + ONBOARDING_MENTORING_HOURS * rate);

  const annualRecurringCost = annualMaintenanceCost + annualCoordinationCost + annualOnboardingCost;

  // Build cumulative yearly breakdown
  // Year 0: setup costs only (initialDev + libSetup)
  // Year N (N >= 1): previous cumulative + all annual costs
  const yearlyBreakdown: YearCost[] = [];
  const year0Cost = initialDevCost + libSetupCost;
  yearlyBreakdown.push({ year: 0, cumulativeCost: year0Cost });

  for (let year = 1; year <= horizonYears; year++) {
    const prev = yearlyBreakdown[yearlyBreakdown.length - 1].cumulativeCost;
    yearlyBreakdown.push({ year, cumulativeCost: prev + annualRecurringCost });
  }

  const totalCost = yearlyBreakdown[yearlyBreakdown.length - 1].cumulativeCost;

  return {
    initialDevCost,
    libSetupCost,
    annualMaintenanceCost,
    annualCoordinationCost,
    annualOnboardingCost,
    totalCost,
    yearlyBreakdown,
  };
}

/**
 * Calculates the total cost of the duplicated code approach over the horizon.
 *
 * Formulas (§7.2):
 *   baseDev = devHours × rate  (no generalization — specific implementation)
 *   duplicatedDevCost = baseDev × (1 + portingFactor)
 *   baseMaintenance = baseDev × maintenanceRate
 *   yearN_maintenance = baseMaintenance × (1.8 + 0.05 × year)
 *   yearN_sync = EVOLVED_FEATURES × SYNC_HOURS × (1 + divergenceRate)^year × rate
 *   yearN_bugs = ADDITIONAL_BUGS_ANNUAL_COST (fixed from research doc example)
 */
export function calcDuplicatedCost(inputs: EngineInputs): DuplicatedCostOutputs {
  const {
    teamAvgHourlyRate: rate,
    devHours,
    horizonYears,
    maintenanceRate,
    portingFactor,
    divergenceRate,
  } = inputs;

  const baseDev = devHours * rate;
  const duplicatedDevCost = baseDev * (1 + portingFactor);
  const baseMaintenance = baseDev * maintenanceRate;

  const yearlyBreakdown: YearCost[] = [];
  yearlyBreakdown.push({ year: 0, cumulativeCost: duplicatedDevCost });

  let totalBugsCost = 0;
  let totalSyncCost = 0;

  for (let year = 1; year <= horizonYears; year++) {
    const prev = yearlyBreakdown[yearlyBreakdown.length - 1].cumulativeCost;

    // Maintenance grows over time as copies diverge.
    // Year 1 = 1.80, Year 2 = 1.85, Year 3 = 1.90, ...
    const maintenanceFactor =
      DOUBLE_MAINTENANCE_FACTOR_BASE + DOUBLE_MAINTENANCE_FACTOR_INCREMENT * (year - 1);
    const yearMaintenance = baseMaintenance * maintenanceFactor;

    // Sync cost uses exponential divergence model
    const yearSync =
      EVOLVED_FEATURES_PER_YEAR *
      SYNC_HOURS_PER_FEATURE_BASE *
      Math.pow(1 + divergenceRate, year) *
      rate;

    // Additional bugs cost (fixed from research doc)
    const yearBugs = ADDITIONAL_BUGS_ANNUAL_COST;

    totalBugsCost += yearBugs;
    totalSyncCost += yearSync;

    yearlyBreakdown.push({
      year,
      cumulativeCost: prev + yearMaintenance + yearSync + yearBugs,
    });
  }

  const totalCost = yearlyBreakdown[yearlyBreakdown.length - 1].cumulativeCost;

  return {
    duplicatedDevCost,
    yearlyBreakdown,
    totalCost,
    totalBugsCost,
    totalSyncCost,
  };
}

/**
 * Calculates the break-even point where shared code becomes more cost-effective.
 *
 * Formula (§7.3):
 *   upfrontCost = generalizationOverhead + libSetupCost
 *     where generalizationOverhead = baseDev × (genFactor - 1)
 *   annualDuplicatedCosts = year1Maintenance + year1Sync + bugsCost
 *   annualSharedMaintenance uses ENGINE_DEFAULTS.maintenanceRateShared (0.18)
 *     because break-even compares shared vs duplicated approaches
 *   monthlySavings = (annualDuplicatedCosts - annualSharedMaintenance) / 12
 *   monthlyCoordination = annualCoordination / 12
 *   netMonthlySavings = monthlySavings - monthlyCoordination
 *   months = upfrontCost / netMonthlySavings
 *   Returns { exists: false, months: null } when netMonthlySavings <= 0
 *
 * Note: inputs.maintenanceRate is the duplicated rate (typically 0.22).
 */
export function calcBreakEven(inputs: EngineInputs): BreakEvenResult {
  const {
    teamAvgHourlyRate: rate,
    devHours,
    maintenanceRate,
    generalizationFactor,
    divergenceRate,
    nbConsumingCodebases,
  } = inputs;

  const baseDev = devHours * rate;
  const initialDevCost = baseDev * generalizationFactor;
  const libSetupCost = LIB_SETUP_WEEKS * HOURS_PER_WEEK * rate;

  const generalizationOverhead = initialDevCost - baseDev;
  const upfrontCost = generalizationOverhead + libSetupCost;

  // Year 1 duplicated costs
  const baseMaintenance = baseDev * maintenanceRate;
  const year1Maintenance = baseMaintenance * DOUBLE_MAINTENANCE_FACTOR_BASE;
  const year1Sync =
    EVOLVED_FEATURES_PER_YEAR *
    SYNC_HOURS_PER_FEATURE_BASE *
    Math.pow(1 + divergenceRate, 1) *
    rate;
  const annualDuplicatedCosts = year1Maintenance + year1Sync + ADDITIONAL_BUGS_ANNUAL_COST;

  // Annual shared maintenance (§7.3 uses only the 33774 maintenance term, not onboarding)
  // Matches the research doc: Monthly_Maintenance_Savings = (dup_costs - shared_maintenance) / 12
  // The shared maintenance uses the shared rate (0.18), not the duplicated rate from inputs.
  const sharedRate = inputs.maintenanceRateShared ?? ENGINE_DEFAULTS.maintenanceRateShared;
  const sharedBaseMaintenance = initialDevCost * sharedRate;
  const versioningCost = VERSIONING_RELEASES_PER_YEAR * VERSIONING_HOURS_PER_RELEASE * rate;
  const supportCost = SUPPORT_HOURS_PER_WEEK * WEEKS_PER_YEAR * rate;
  const annualSharedMaintenance = sharedBaseMaintenance + versioningCost + supportCost;

  // Monthly savings = (all year-1 duplicated costs - shared maintenance) / 12
  const annualSavings = annualDuplicatedCosts - annualSharedMaintenance;
  const monthlySavings = annualSavings / 12;

  // Monthly coordination cost (ongoing cost of sharing)
  const annualCoordination =
    nbConsumingCodebases * COORDINATION_HOURS_PER_WEEK_PER_TEAM * WEEKS_PER_YEAR * rate;
  const monthlyCoordination = annualCoordination / 12;

  const netMonthlySavings = monthlySavings - monthlyCoordination;

  if (netMonthlySavings <= 0) {
    return { exists: false, months: null };
  }

  const months = upfrontCost / netMonthlySavings;
  return { exists: true, months };
}

/**
 * Calculates the advantage ratio of shared vs duplicated code for N codebases.
 * Returns totalDuplicatedCost / totalSharedCost.
 *
 * Formula (§7.4): Advantage_Ratio(N) = Total_Duplicated_Cost(N) / Total_Shared_Cost(N)
 */
export function calcScaleFactor(inputs: EngineInputs): number {
  const duplicated = calcDuplicatedCost(inputs);
  const shared = calcSharedCost(inputs);

  if (shared.totalCost === 0) return 0;
  return duplicated.totalCost / shared.totalCost;
}

/**
 * Calculates the divergence cost at time t using an exponential growth model.
 *
 * Formula (§7.5): Divergence_Cost(t) = baseSyncCost × e^(divergenceRate × t)
 *
 * @param baseSyncCost - Synchronization cost at t=0
 * @param divergenceRate - Annual divergence rate (typically 0.15-0.30)
 * @param t - Time in years
 */
export function calcDivergence(
  baseSyncCost: number,
  divergenceRate: number,
  t: number,
): number {
  return baseSyncCost * Math.exp(divergenceRate * t);
}
