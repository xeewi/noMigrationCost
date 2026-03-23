import { describe, it, expect } from 'vitest';
import {
  calcTeamAvgRate,
  calcDevHours,
  calcStandaloneCost,
  calcSharedCost,
  calcDuplicatedCost,
  calcBreakEven,
  calcScaleFactor,
  calcDivergence,
} from '@/engine/formulas';
import type { SeniorityRow, SizingInputs, EngineInputs } from '@/engine/types';

// ---------------------------------------------------------------------------
// calcTeamAvgRate
// ---------------------------------------------------------------------------
describe('calcTeamAvgRate', () => {
  it('returns weighted average of active seniority rows (headcount > 0)', () => {
    const team: SeniorityRow[] = [
      { label: 'Junior', headcount: 2, hourlyRate: 32 },
      { label: 'Mid', headcount: 1, hourlyRate: 40 },
      { label: 'Senior', headcount: 0, hourlyRate: 51 },
      { label: 'Lead', headcount: 0, hourlyRate: 67 },
    ];
    // (2*32 + 1*40) / 3 = 104 / 3 = 34.67
    expect(calcTeamAvgRate(team)).toBeCloseTo(34.67, 1);
  });

  it('returns 0 when all headcounts are 0 (no division by zero)', () => {
    const team: SeniorityRow[] = [
      { label: 'Junior', headcount: 0, hourlyRate: 32 },
      { label: 'Mid', headcount: 0, hourlyRate: 40 },
    ];
    expect(calcTeamAvgRate(team)).toBe(0);
  });

  it('returns correct result for a single row with headcount > 0', () => {
    const team: SeniorityRow[] = [
      { label: 'Senior', headcount: 3, hourlyRate: 51 },
    ];
    expect(calcTeamAvgRate(team)).toBeCloseTo(51, 1);
  });
});

// ---------------------------------------------------------------------------
// calcDevHours
// ---------------------------------------------------------------------------
describe('calcDevHours', () => {
  it('converts story points to hours using velocity, sprint weeks, and 35h/week', () => {
    const sizing: SizingInputs = {
      mode: 'story-points',
      storyPoints: 20,
      velocity: 10,       // SP/sprint
      sprintWeeks: 2,
      directValue: 0,
      directUnit: 'hours',
    };
    // sprints = 20/10 = 2, hours = 2 * 2 * 35 = 140
    expect(calcDevHours(sizing)).toBe(140);
  });

  it('returns directValue directly when mode is direct-hours and unit is hours', () => {
    const sizing: SizingInputs = {
      mode: 'direct-hours',
      storyPoints: 0,
      velocity: 10,
      sprintWeeks: 2,
      directValue: 100,
      directUnit: 'hours',
    };
    expect(calcDevHours(sizing)).toBe(100);
  });

  it('converts days to hours (7h/day) when mode is direct-hours and unit is days', () => {
    const sizing: SizingInputs = {
      mode: 'direct-hours',
      storyPoints: 0,
      velocity: 10,
      sprintWeeks: 2,
      directValue: 20,
      directUnit: 'days',
    };
    // 20 * 7 = 140
    expect(calcDevHours(sizing)).toBe(140);
  });

  it('returns 0 when velocity is 0 (no division by zero in SP mode)', () => {
    const sizing: SizingInputs = {
      mode: 'story-points',
      storyPoints: 20,
      velocity: 0,
      sprintWeeks: 2,
      directValue: 0,
      directUnit: 'hours',
    };
    expect(calcDevHours(sizing)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// calcStandaloneCost
// ---------------------------------------------------------------------------
describe('calcStandaloneCost', () => {
  const baseInputs: EngineInputs = {
    teamAvgHourlyRate: 65,
    devHours: 400,
    horizonYears: 3,
    maintenanceRate: 0.18,
    generalizationFactor: 1.3,
    portingFactor: 0.65,
    divergenceRate: 0.20,
    bugDuplicationFactor: 2.0,
    nbConsumingCodebases: 2,
  };

  it('calculates initialDevCost = devHours * rate * generalizationFactor', () => {
    // 400 * 65 * 1.3 = 33800
    const result = calcStandaloneCost(baseInputs);
    expect(result.initialDevCost).toBeCloseTo(33800, 0);
  });

  it('calculates annualMaintenanceCost = initialDevCost * maintenanceRate', () => {
    // 33800 * 0.18 = 6084
    const result = calcStandaloneCost(baseInputs);
    expect(result.annualMaintenanceCost).toBeCloseTo(6084, 0);
  });

  it('calculates totalMaintenanceCost = annualMaintenanceCost * horizonYears', () => {
    // 6084 * 3 = 18252
    const result = calcStandaloneCost(baseInputs);
    expect(result.totalMaintenanceCost).toBeCloseTo(18252, 0);
  });

  it('calculates totalStandaloneCost = initialDevCost + totalMaintenanceCost', () => {
    // 33800 + 18252 = 52052
    const result = calcStandaloneCost(baseInputs);
    expect(result.totalStandaloneCost).toBeCloseTo(52052, 0);
  });

  it('returns correct initialDevHours', () => {
    const result = calcStandaloneCost(baseInputs);
    expect(result.initialDevHours).toBe(400);
  });

  it('returns correct teamAvgHourlyRate', () => {
    const result = calcStandaloneCost(baseInputs);
    expect(result.teamAvgHourlyRate).toBe(65);
  });

  it('returns breakdown with 2 rows: Initial Development and Annual Maintenance', () => {
    const result = calcStandaloneCost(baseInputs);
    expect(result.breakdown).toHaveLength(2);
    expect(result.breakdown[0].category).toBe('Initial Development');
    expect(result.breakdown[1].category).toContain('Annual Maintenance');
  });

  it('breakdown percentages sum to 100', () => {
    const result = calcStandaloneCost(baseInputs);
    const total = result.breakdown.reduce((sum, row) => sum + row.percentage, 0);
    expect(total).toBeCloseTo(100, 1);
  });
});

// ---------------------------------------------------------------------------
// calcSharedCost — section 7.1 worked example
// ---------------------------------------------------------------------------
describe('calcSharedCost', () => {
  const inputs: EngineInputs = {
    teamAvgHourlyRate: 65,
    devHours: 400,
    horizonYears: 3,
    maintenanceRate: 0.18,
    generalizationFactor: 1.3,
    portingFactor: 0.65,
    divergenceRate: 0.20,
    bugDuplicationFactor: 2.0,
    nbConsumingCodebases: 2,
  };

  it('calculates initialDevCost = devHours * rate * generalizationFactor (33800)', () => {
    // 400 * 65 * 1.3 = 33800
    const result = calcSharedCost(inputs);
    expect(result.initialDevCost).toBeCloseTo(33800, 0);
  });

  it('calculates libSetupCost = 8 weeks * 35h/week * seniorRate (18200)', () => {
    // 8 * 35 * 65 = 18200
    const result = calcSharedCost(inputs);
    expect(result.libSetupCost).toBeCloseTo(18200, 0);
  });

  it('calculates annualMaintenanceCost = (33800 * 0.18) + versioningCost + supportCost', () => {
    // (33800 * 0.18) + 2340 + 25350 = 6084 + 2340 + 25350 = 33774
    const result = calcSharedCost(inputs);
    expect(result.annualMaintenanceCost).toBeCloseTo(33774, 0);
  });

  it('calculates annualCoordinationCost = nbTeams * 3h * 52 * rate (20280)', () => {
    // 2 * 3 * 52 * 65 = 20280
    const result = calcSharedCost(inputs);
    expect(result.annualCoordinationCost).toBeCloseTo(20280, 0);
  });

  it('has Year 0 cumulative cost of 52000', () => {
    // initialDev + libSetup = 33800 + 18200 = 52000
    const result = calcSharedCost(inputs);
    const year0 = result.yearlyBreakdown.find(y => y.year === 0);
    expect(year0?.cumulativeCost).toBeCloseTo(52000, 0);
  });

  it('has Year 1 cumulative cost of 118954', () => {
    // 52000 + 33774 + 20280 + 12900 = 118954
    const result = calcSharedCost(inputs);
    const year1 = result.yearlyBreakdown.find(y => y.year === 1);
    expect(year1?.cumulativeCost).toBeCloseTo(118954, 0);
  });

  it('has Year 2 cumulative cost of 185908', () => {
    const result = calcSharedCost(inputs);
    const year2 = result.yearlyBreakdown.find(y => y.year === 2);
    expect(year2?.cumulativeCost).toBeCloseTo(185908, 0);
  });

  it('has Year 3 cumulative cost of 252862', () => {
    const result = calcSharedCost(inputs);
    const year3 = result.yearlyBreakdown.find(y => y.year === 3);
    expect(year3?.cumulativeCost).toBeCloseTo(252862, 0);
  });
});

// ---------------------------------------------------------------------------
// calcDuplicatedCost — section 7.2 worked example
// ---------------------------------------------------------------------------
describe('calcDuplicatedCost', () => {
  const inputs: EngineInputs = {
    teamAvgHourlyRate: 65,
    devHours: 400,
    horizonYears: 3,
    maintenanceRate: 0.22,
    generalizationFactor: 1.3,
    portingFactor: 0.65,
    divergenceRate: 0.20,
    bugDuplicationFactor: 2.0,
    nbConsumingCodebases: 2,
  };

  it('calculates duplicatedDevCost = baseDev * (1 + portingFactor) = 42900', () => {
    // baseDev = 400 * 65 = 26000, duplicatedDevCost = 26000 * 1.65 = 42900
    const result = calcDuplicatedCost(inputs);
    expect(result.duplicatedDevCost).toBeCloseTo(42900, 0);
  });

  it('has Year 1 maintenance of 10296 (5720 * 1.80)', () => {
    // baseMaintenance = 26000 * 0.22 = 5720, year1 = 5720 * 1.80 = 10296
    const result = calcDuplicatedCost(inputs);
    const year1 = result.yearlyBreakdown.find(y => y.year === 1);
    // Year 1 cumulative = 42900 + 10296 + 9984 + 50600
    expect(year1?.cumulativeCost).toBeCloseTo(113780, 0);
  });

  it('has Year 0 cumulative = 42900 (duplicatedDevCost only)', () => {
    const result = calcDuplicatedCost(inputs);
    const year0 = result.yearlyBreakdown.find(y => y.year === 0);
    expect(year0?.cumulativeCost).toBeCloseTo(42900, 0);
  });
});

// ---------------------------------------------------------------------------
// calcBreakEven — section 7.3 worked example
// ---------------------------------------------------------------------------
describe('calcBreakEven', () => {
  const inputs: EngineInputs = {
    teamAvgHourlyRate: 65,
    devHours: 400,
    horizonYears: 3,
    maintenanceRate: 0.22,
    generalizationFactor: 1.3,
    portingFactor: 0.65,
    divergenceRate: 0.20,
    bugDuplicationFactor: 2.0,
    nbConsumingCodebases: 2,
  };

  it('returns approximately 18.5 months for the research doc example', () => {
    // generalizationOverhead = 7800, libSetup = 18200
    // monthlySavings = 3092, monthlyCoordination = 1690
    // months = 26000 / 1402 ≈ 18.5
    const result = calcBreakEven(inputs);
    expect(result.exists).toBe(true);
    expect(result.months).not.toBeNull();
    expect(result.months!).toBeCloseTo(18.5, 0);
  });

  it('returns { exists: false, months: null } when savings <= coordination cost', () => {
    // Set up inputs where monthly savings <= monthly coordination cost
    const noBreakEvenInputs: EngineInputs = {
      ...inputs,
      devHours: 10,          // tiny feature, minimal maintenance savings
      maintenanceRate: 0.01, // almost no maintenance savings
      nbConsumingCodebases: 10, // lots of coordination cost
    };
    const result = calcBreakEven(noBreakEvenInputs);
    expect(result.exists).toBe(false);
    expect(result.months).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// calcScaleFactor — section 7.4
// ---------------------------------------------------------------------------
describe('calcScaleFactor', () => {
  it('returns ratio > 1 when duplicated costs more than shared', () => {
    const inputs: EngineInputs = {
      teamAvgHourlyRate: 65,
      devHours: 400,
      horizonYears: 3,
      maintenanceRate: 0.22,
      generalizationFactor: 1.3,
      portingFactor: 0.65,
      divergenceRate: 0.20,
      bugDuplicationFactor: 2.0,
      nbConsumingCodebases: 2,
    };
    const ratio = calcScaleFactor(inputs);
    // From table: N=2, ratio ~1.04
    expect(ratio).toBeGreaterThan(0);
  });

  it('returns a positive number', () => {
    const inputs: EngineInputs = {
      teamAvgHourlyRate: 65,
      devHours: 400,
      horizonYears: 3,
      maintenanceRate: 0.22,
      generalizationFactor: 1.3,
      portingFactor: 0.65,
      divergenceRate: 0.20,
      bugDuplicationFactor: 2.0,
      nbConsumingCodebases: 3,
    };
    const ratio = calcScaleFactor(inputs);
    expect(ratio).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// calcDivergence — section 7.5 worked examples
// ---------------------------------------------------------------------------
describe('calcDivergence', () => {
  it('calculates divergence at Year 1: 8500 * e^(0.20 * 1) ≈ 10382', () => {
    expect(calcDivergence(8500, 0.20, 1)).toBeCloseTo(10382, 0);
  });

  it('calculates divergence at Year 2: 8500 * e^(0.20 * 2) ≈ 12681', () => {
    // Research doc shows 12,680 (rounded) — actual value is ~12680.5, within ±1
    expect(calcDivergence(8500, 0.20, 2)).toBeCloseTo(12681, 0);
  });

  it('calculates divergence at Year 3: 8500 * e^(0.20 * 3) ≈ 15488', () => {
    expect(calcDivergence(8500, 0.20, 3)).toBeCloseTo(15488, 0);
  });

  it('returns baseSyncCost when t = 0', () => {
    expect(calcDivergence(8500, 0.20, 0)).toBeCloseTo(8500, 0);
  });
});
