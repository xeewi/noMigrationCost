/**
 * @file formulas.ts
 * @author Guillaume Gautier (xeewi)
 * @created 2026-03-23
 * @project Feature Cost Calculator
 */

/**
 * Formula engine — pure functions, no React. Every formula is documented in
 * docs/feature-cost-shared-vs-duplicated.md §7.
 *
 * Every cost is a multiple of C0 = devHours × rate (the cost of building the
 * feature once, for one app), except the running cost of a new library, which
 * is a fixed number of hours. So the sign of the verdict never depends on the
 * hourly rate, only on the effort and the assumptions.
 */

import type {
  SeniorityRow,
  SizingInputs,
  EngineInputs,
  StandaloneOutputs,
  ComparisonOutputs,
  MonthCostPoint,
} from './types';
import {
  HOURS_PER_WEEK,
  HOURS_PER_DAY,
  LIB_SETUP_HOURS,
  LIB_RUN_HOURS_PER_YEAR,
  EXTRA_COPY_UPKEEP_MAX,
} from './types';

/** Weighted average hourly rate. 0 when the team is empty. */
export function calcTeamAvgRate(team: SeniorityRow[]): number {
  const totalHeadcount = team.reduce((sum, row) => sum + row.headcount, 0);
  if (totalHeadcount === 0) return 0;
  const weightedSum = team.reduce((sum, row) => sum + row.headcount * row.hourlyRate, 0);
  return weightedSum / totalHeadcount;
}

/**
 * Person-hours to build the feature once.
 * Story points: velocity is the whole team's, so each sprint costs headcount × weeks × 35 h.
 * Direct mode: the value is already person-hours (or person-days × 7 h).
 */
export function calcDevHours(sizing: SizingInputs, headcount: number): number {
  if (sizing.mode === 'story-points') {
    if (sizing.velocity <= 0) return 0;
    const sprints = sizing.storyPoints / sizing.velocity;
    return sprints * sizing.sprintWeeks * HOURS_PER_WEEK * headcount;
  }
  return sizing.directUnit === 'days' ? sizing.directValue * HOURS_PER_DAY : sizing.directValue;
}

/** Feature built once, for one app: build + yearly upkeep (docs §7.1). */
export function calcStandaloneCost(inputs: EngineInputs): StandaloneOutputs {
  const { teamAvgHourlyRate: rate, devHours, horizonYears, maintenanceRate } = inputs;
  const initialDevCost = devHours * rate;
  const annualMaintenanceCost = initialDevCost * maintenanceRate;
  const totalMaintenanceCost = annualMaintenanceCost * horizonYears;
  const totalStandaloneCost = initialDevCost + totalMaintenanceCost;
  const pct = (c: number) => (totalStandaloneCost > 0 ? (c / totalStandaloneCost) * 100 : 0);

  return {
    teamAvgHourlyRate: rate,
    initialDevCost,
    initialDevHours: devHours,
    annualMaintenanceCost,
    totalMaintenanceCost,
    totalStandaloneCost,
    breakdown: [
      { category: 'Initial development', hours: devHours, cost: initialDevCost, percentage: pct(initialDevCost) },
      {
        category: `Upkeep (${horizonYears} y)`,
        hours: devHours * maintenanceRate * horizonYears,
        cost: totalMaintenanceCost,
        percentage: pct(totalMaintenanceCost),
      },
    ],
  };
}

/** Yearly upkeep ratio of one extra copy in year y (1-based): starts at e0, drifts by δ a year, capped. */
export function extraCopyRatio(e0: number, divergenceRate: number, year: number): number {
  return Math.min(EXTRA_COPY_UPKEEP_MAX, e0 + divergenceRate * (year - 1));
}

/**
 * Shared library vs one copy per app, over the horizon (docs §7.2-7.3).
 *
 *   Shared     build  = G·C0 + i·C0·(N−1) + setupHours·w
 *              yearly = m·G·C0·(1 + τ·(T−1)) + k·C0·(N−1) + runHours·w
 *   Duplicated build  = C0 + p·C0·(N−1)
 *              yearly = m·C0 · (1 + (N−1)·min(eMax, e0 + δ·(y−1)))
 *
 * Builds are paid at month 0, yearly costs accrue evenly month by month.
 * The break-even month is read from these same curves.
 */
export function calcComparison(inputs: EngineInputs): ComparisonOutputs {
  const {
    teamAvgHourlyRate: w,
    devHours,
    horizonYears,
    nbCodebases,
    newLibrary,
    generalizationFactor: G,
    portingFactor: p,
    integrationFactor: i,
    maintenanceRate: m,
    extraCopyUpkeep: e0,
    divergenceRate,
    coordinationRate: k,
    teamOverhead: tau,
    nbTeams,
  } = inputs;

  const C0 = devHours * w;
  const extra = Math.max(0, nbCodebases - 1);
  const months = horizonYears * 12;

  // Shared
  const sharedBuild = G * C0;
  const integration = i * C0 * extra;
  const setup = newLibrary ? LIB_SETUP_HOURS * w : 0;
  const sharedUpkeepYear = m * G * C0;
  // Every extra team that changes the shared code makes each change dearer: agree, review, avoid breaking the others (docs §7.2).
  const teamsYear = tau * Math.max(0, nbTeams - 1) * sharedUpkeepYear;
  const coordinationYear = k * C0 * extra;
  const runningYear = newLibrary ? LIB_RUN_HOURS_PER_YEAR * w : 0;
  const sharedYear = sharedUpkeepYear + teamsYear + coordinationYear + runningYear;

  // Duplicated
  const porting = p * C0 * extra;
  const firstCopyUpkeepYear = m * C0;
  const extraCopiesYear = (year: number) => m * C0 * extra * extraCopyRatio(e0, divergenceRate, year);

  const monthly: MonthCostPoint[] = [{ month: 0, shared: sharedBuild + integration + setup, duplicated: C0 + porting }];
  let extraCopiesTotal = 0;
  for (let t = 1; t <= months; t++) {
    const year = Math.ceil(t / 12);
    const extraMonth = extraCopiesYear(year) / 12;
    extraCopiesTotal += extraMonth;
    const prev = monthly[t - 1];
    monthly.push({
      month: t,
      shared: prev.shared + sharedYear / 12,
      duplicated: prev.duplicated + (firstCopyUpkeepYear / 12 + extraMonth),
    });
  }

  // Break-even: earliest month from which shared stays at or below duplicated to the horizon.
  // Relative tolerance so exact ties (e.g. equal build costs) don't flip on float noise.
  const notWorse = (pt: MonthCostPoint) => pt.shared <= pt.duplicated + 1e-9 * Math.max(1, pt.duplicated);
  let breakEvenMonth: number | null = null;
  for (let t = months; t >= 0 && notWorse(monthly[t]); t--) breakEvenMonth = t;

  const last = monthly[months];
  return {
    shared: {
      total: last.shared,
      lines: [
        { label: 'Build it once, made to share', cost: sharedBuild },
        { label: 'Plug it into the other apps', cost: integration },
        { label: 'Set up the library', cost: setup },
        { label: 'Upkeep of the shared code', cost: sharedUpkeepYear * horizonYears },
        { label: 'Several teams changing it', cost: teamsYear * horizonYears },
        { label: 'Coordination and upgrades', cost: coordinationYear * horizonYears },
        { label: 'Running the library', cost: runningYear * horizonYears },
      ],
    },
    duplicated: {
      total: last.duplicated,
      lines: [
        { label: 'Build it for the first app', cost: C0 },
        { label: 'Copy it into the other apps', cost: porting },
        { label: 'Upkeep of the first copy', cost: firstCopyUpkeepYear * horizonYears },
        { label: 'Upkeep of the extra copies', cost: extraCopiesTotal },
      ],
    },
    monthly,
    breakEvenMonth,
  };
}
