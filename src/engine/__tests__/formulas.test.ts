/**
 * @file formulas.test.ts
 * @author Guillaume Gautier (xeewi)
 * @created 2026-03-23
 * @project Feature Cost Calculator
 */

import { describe, it, expect } from 'vitest';
import {
  calcTeamAvgRate,
  calcDevHours,
  calcStandaloneCost,
  calcComparison,
  extraCopyRatio,
} from '@/engine/formulas';
import {
  ENGINE_DEFAULTS,
  LIB_SETUP_HOURS,
  LIB_RUN_HOURS_PER_YEAR,
  EXTRA_COPY_UPKEEP_MAX,
} from '@/engine/types';
import type { EngineInputs, SeniorityRow } from '@/engine/types';

const base: EngineInputs = {
  ...ENGINE_DEFAULTS,
  teamAvgHourlyRate: 50,
  devHours: 1000,
  horizonYears: 5,
  nbCodebases: 2,
  newLibrary: true,
  nbTeams: 1,
};
const gap = (o: Partial<EngineInputs> = {}) => {
  const r = calcComparison({ ...base, ...o });
  return r.duplicated.total - r.shared.total;
};

describe('calcTeamAvgRate', () => {
  it('weights rates by headcount', () => {
    const team: SeniorityRow[] = [
      { label: 'Junior', headcount: 1, hourlyRate: 32 },
      { label: 'Mid', headcount: 2, hourlyRate: 40 },
      { label: 'Senior', headcount: 1, hourlyRate: 50 },
      { label: 'Lead', headcount: 0, hourlyRate: 62 },
    ];
    expect(calcTeamAvgRate(team)).toBeCloseTo(40.5);
  });
  it('returns 0 for an empty team', () => {
    expect(calcTeamAvgRate([{ label: 'Mid', headcount: 0, hourlyRate: 40 }])).toBe(0);
  });
});

describe('calcDevHours', () => {
  const sp = { mode: 'story-points' as const, storyPoints: 40, velocity: 10, sprintWeeks: 2, directValue: 0, directUnit: 'hours' as const };
  it('story points: team velocity, so hours scale with headcount', () => {
    // 4 sprints × 2 weeks × 35 h × 4 people
    expect(calcDevHours(sp, 4)).toBe(1120);
  });
  it('story points: zero velocity gives 0', () => {
    expect(calcDevHours({ ...sp, velocity: 0 }, 4)).toBe(0);
  });
  it('direct mode is already person-hours, headcount ignored', () => {
    expect(calcDevHours({ ...sp, mode: 'direct-hours', directValue: 300 }, 4)).toBe(300);
    expect(calcDevHours({ ...sp, mode: 'direct-hours', directValue: 10, directUnit: 'days' }, 4)).toBe(70);
  });
});

describe('calcStandaloneCost', () => {
  it('is build plus yearly upkeep', () => {
    const r = calcStandaloneCost(base);
    expect(r.initialDevCost).toBe(50_000);
    expect(r.totalMaintenanceCost).toBeCloseTo(50_000);
    expect(r.totalStandaloneCost).toBeCloseTo(100_000);
    expect(r.breakdown.reduce((s, b) => s + b.percentage, 0)).toBeCloseTo(100);
  });
});

describe('calcComparison', () => {
  it('matches the hand-computed reference (docs §7.5)', () => {
    // C0 = 50,000. Shared build = 1.2·C0 + 0.2·C0 + 280 h·50 = 84,000
    // Shared yearly = 0.2·1.2·C0 + 0.04·C0 + 100 h·50 = 19,000 → 5 y = 95,000
    // Dup build = 1.65·C0 = 82,500
    // Dup yearly = 0.2·C0·(1 + e(y)), e = 1.00, 1.05, 1.10, 1.15, 1.20 → 10,000·(5 + 5.5) = 105,000
    const r = calcComparison(base);
    expect(r.monthly[0].shared).toBeCloseTo(84_000);
    expect(r.monthly[0].duplicated).toBeCloseTo(82_500);
    expect(r.shared.total).toBeCloseTo(179_000);
    expect(r.duplicated.total).toBeCloseTo(187_500);
    expect(r.shared.lines.reduce((s, l) => s + l.cost, 0)).toBeCloseTo(r.shared.total);
    expect(r.duplicated.lines.reduce((s, l) => s + l.cost, 0)).toBeCloseTo(r.duplicated.total);
  });

  it('break-even is read from the curves and agrees with the verdict', () => {
    const r = calcComparison(base);
    expect(r.breakEvenMonth).not.toBeNull();
    const be = r.breakEvenMonth!;
    expect(be).toBeGreaterThan(0);
    expect(r.monthly[be].shared).toBeLessThanOrEqual(r.monthly[be].duplicated);
    expect(r.monthly[be - 1].shared).toBeGreaterThan(r.monthly[be - 1].duplicated);
  });

  it('break-even is 0 when sharing is cheaper from day one, null when it never wins', () => {
    expect(calcComparison({ ...base, newLibrary: false }).breakEvenMonth).toBe(0);
    expect(calcComparison({ ...base, devHours: 35 }).breakEvenMonth).toBeNull();
  });

  it('verdict and break-even never contradict each other', () => {
    for (const devHours of [7, 100, 500, 2000, 10000])
      for (const nbCodebases of [2, 3, 5, 10])
        for (const horizonYears of [1, 3, 5, 10])
          for (const newLibrary of [true, false]) {
            const r = calcComparison({ ...base, devHours, nbCodebases, horizonYears, newLibrary });
            const sharedWins = r.duplicated.total > r.shared.total;
            if (sharedWins) expect(r.breakEvenMonth).not.toBeNull();
            if (r.duplicated.total < r.shared.total) expect(r.breakEvenMonth).toBeNull();
          }
  });

  it('an exact tie at month 0 stays a tie whatever the rate (float noise)', () => {
    // 1120 h: 1.2 + 0.2 + 280/1120 = 1.65 = 1 + 0.65, so builds tie exactly
    for (const teamAvgHourlyRate of [40.5, 46.888888888888886, 51.3, 77.7])
      expect(calcComparison({ ...base, devHours: 1120, teamAvgHourlyRate }).breakEvenMonth).toBe(0);
  });

  it('gap is proportional to the hourly rate, so the rate never flips the verdict', () => {
    expect(gap({ teamAvgHourlyRate: 100 })).toBeCloseTo(2 * gap());
  });

  it('more apps favour sharing', () => {
    expect(gap({ nbCodebases: 3 })).toBeGreaterThan(gap());
    expect(gap({ nbCodebases: 10 })).toBeGreaterThan(gap({ nbCodebases: 3 }));
  });

  it('a small feature on a new library favours duplicating', () => {
    expect(gap({ devHours: 35 })).toBeLessThan(0);
  });

  it('each assumption moves the verdict the intuitive way', () => {
    expect(gap({ generalizationFactor: 1.5 })).toBeLessThan(gap());
    expect(gap({ portingFactor: 0.9 })).toBeGreaterThan(gap());
    expect(gap({ integrationFactor: 0.4 })).toBeLessThan(gap());
    expect(gap({ extraCopyUpkeep: 1.3 })).toBeGreaterThan(gap());
    expect(gap({ divergenceRate: 0.15 })).toBeGreaterThan(gap());
    expect(gap({ coordinationRate: 0.1 })).toBeLessThan(gap());
  });

  it('each extra team changing the shared code adds τ of its upkeep', () => {
    // shared upkeep = 0.2·1.2·50,000 = 12,000 a year; 3 teams → +2·0.1·12,000·5 y = 12,000
    expect(calcComparison({ ...base, nbTeams: 3 }).shared.total - calcComparison(base).shared.total).toBeCloseTo(12_000);
    expect(calcComparison({ ...base, nbTeams: 3 }).duplicated.total).toBeCloseTo(calcComparison(base).duplicated.total);
  });

  it('enough teams on the shared code flip the verdict to duplicating', () => {
    expect(gap()).toBeGreaterThan(0);
    expect(gap({ nbTeams: 10 })).toBeLessThan(0);
    expect(calcComparison({ ...base, nbTeams: 10 }).breakEvenMonth).toBeNull();
  });

  it('an existing library removes setup and running costs', () => {
    const r = calcComparison({ ...base, newLibrary: false });
    const fixed = (LIB_SETUP_HOURS + LIB_RUN_HOURS_PER_YEAR * base.horizonYears) * base.teamAvgHourlyRate;
    expect(calcComparison(base).shared.total - r.shared.total).toBeCloseTo(fixed);
  });
});

describe('extraCopyRatio', () => {
  it('drifts by δ a year and is capped', () => {
    expect(extraCopyRatio(1, 0.05, 1)).toBe(1);
    expect(extraCopyRatio(1, 0.05, 3)).toBeCloseTo(1.1);
    expect(extraCopyRatio(1, 0.2, 10)).toBe(EXTRA_COPY_UPKEEP_MAX);
  });
});
