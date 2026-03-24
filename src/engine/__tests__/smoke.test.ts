/**
 * @file smoke.test.ts
 * @author Guillaume Gautier (xeewi)
 * @created 2026-03-23
 * @project Feature Cost Calculator
 */

import { describe, it, expect } from 'vitest';
import { SENIORITY_DEFAULTS, HOURS_PER_WEEK } from '@/engine/types';

describe('engine types smoke test', () => {
  it('exports seniority defaults matching French loaded costs', () => {
    expect(SENIORITY_DEFAULTS.Junior).toBe(32);
    expect(SENIORITY_DEFAULTS.Mid).toBe(40);
    expect(SENIORITY_DEFAULTS.Senior).toBe(51);
    expect(SENIORITY_DEFAULTS.Lead).toBe(67);
  });

  it('uses French 35h work week', () => {
    expect(HOURS_PER_WEEK).toBe(35);
  });
});
