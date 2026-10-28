/**
 * @file url-state.ts
 * @author Guillaume Gautier (xeewi)
 * @created 2026-03-24
 * @project Feature Cost Calculator
 */

import type { SeniorityRow, SeniorityLevel, SizingMode, DirectHoursUnit } from '@/engine/types';
import { SENIORITY_DEFAULTS, ENGINE_DEFAULTS } from '@/engine/types';
import type { AdvancedParamsState } from '@/components/AdvancedParameters';
import { PARAM_CONFIGS, MIN_CODEBASES, MAX_CODEBASES } from '@/components/AdvancedParameters';

/** v2: model rewritten in 2026-10 — v1 links carried parameters that no longer exist and are ignored. */
export interface ShareableState {
  v: 2;
  th: [number, number, number, number]; // headcounts (Junior/Mid/Senior/Lead)
  tr: [number, number, number, number]; // hourly rates
  sm: 'sp' | 'dh';                      // sizingMode
  sp: number;                            // storyPoints
  vel: number;                           // velocity
  sw: number;                            // sprintWeeks
  dv: number;                            // directValue
  du: 'h' | 'd';                         // directUnit
  hy: number;                            // horizonYears
  mp: AdvancedParamsState;               // model parameters
  nc: number;                            // nbCodebases
  nl: boolean;                           // newLibrary
  tab: 'c' | 's';                        // active tab (comparison/standalone)
}

const SENIORITY_ORDER: SeniorityLevel[] = ['Junior', 'Mid', 'Senior', 'Lead'];
const HORIZONS = [1, 3, 5, 10];

export function encodeAppState(
  team: SeniorityRow[],
  sizingMode: SizingMode,
  storyPoints: number,
  velocity: number,
  sprintWeeks: number,
  directValue: number,
  directUnit: DirectHoursUnit,
  horizonYears: number,
  advancedParams: AdvancedParamsState,
  nbCodebases: number,
  newLibrary: boolean,
  activeTab: string,
): string {
  const th: [number, number, number, number] = [0, 0, 0, 0];
  const tr: [number, number, number, number] = [0, 0, 0, 0];

  SENIORITY_ORDER.forEach((level, i) => {
    const row = team.find((r) => r.label === level);
    th[i] = row?.headcount ?? 0;
    tr[i] = row?.hourlyRate ?? SENIORITY_DEFAULTS[level];
  });

  const state: ShareableState = {
    v: 2,
    th,
    tr,
    sm: sizingMode === 'story-points' ? 'sp' : 'dh',
    sp: storyPoints,
    vel: velocity,
    sw: sprintWeeks,
    dv: directValue,
    du: directUnit === 'hours' ? 'h' : 'd',
    hy: horizonYears,
    mp: advancedParams,
    nc: nbCodebases,
    nl: newLibrary,
    tab: activeTab === 'comparison' ? 'c' : 's',
  };

  return btoa(JSON.stringify(state))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/** Finite number clamped to [min, max], or the fallback. */
function num(v: unknown, min: number, max: number, fallback: number): number {
  return typeof v === 'number' && isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback;
}

/** Decodes a hash and clamps every field to what the UI can produce. Null if unreadable. */
export function decodeAppState(hash: string): ShareableState | null {
  try {
    const padded = hash
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(hash.length + (4 - (hash.length % 4)) % 4, '=');
    const raw = JSON.parse(atob(padded));
    if (raw?.v !== 2) return null;

    const mp = { ...ENGINE_DEFAULTS };
    for (const c of PARAM_CONFIGS) mp[c.key] = num(raw.mp?.[c.key], c.min, c.max, ENGINE_DEFAULTS[c.key]);

    const four = (arr: unknown, i: number, max: number, fallback: number) =>
      num(Array.isArray(arr) ? arr[i] : undefined, 0, max, fallback);

    return {
      v: 2,
      th: [0, 1, 2, 3].map((i) => Math.round(four(raw.th, i, 50, 0))) as ShareableState['th'],
      tr: SENIORITY_ORDER.map((l, i) => four(raw.tr, i, 1000, SENIORITY_DEFAULTS[l])) as ShareableState['tr'],
      sm: raw.sm === 'dh' ? 'dh' : 'sp',
      sp: num(raw.sp, 0, 1e6, 0),
      vel: num(raw.vel, 0, 1e4, 0),
      sw: Math.round(num(raw.sw, 1, 4, 2)),
      dv: num(raw.dv, 0, 1e7, 0),
      du: raw.du === 'd' ? 'd' : 'h',
      hy: HORIZONS.includes(raw.hy) ? raw.hy : 5,
      mp,
      nc: Math.round(num(raw.nc, MIN_CODEBASES, MAX_CODEBASES, MIN_CODEBASES)),
      nl: raw.nl !== false,
      tab: raw.tab === 's' ? 's' : 'c',
    };
  } catch {
    return null;
  }
}

interface StateSetters {
  setTeam: (t: SeniorityRow[]) => void;
  setSizingMode: (m: SizingMode) => void;
  setStoryPoints: (n: number) => void;
  setVelocity: (n: number) => void;
  setSprintWeeks: (n: number) => void;
  setDirectValue: (n: number) => void;
  setDirectUnit: (u: DirectHoursUnit) => void;
  setHorizonYears: (n: number) => void;
  setAdvancedParams: (p: AdvancedParamsState) => void;
  setNbCodebases: (n: number) => void;
  setNewLibrary: (b: boolean) => void;
  setActiveTab: (t: string) => void;
}

export function applyStateToSetters(state: ShareableState, s: StateSetters): void {
  s.setTeam(SENIORITY_ORDER.map((level, i) => ({ label: level, headcount: state.th[i], hourlyRate: state.tr[i] })));
  s.setSizingMode(state.sm === 'sp' ? 'story-points' : 'direct-hours');
  s.setStoryPoints(state.sp);
  s.setVelocity(state.vel);
  s.setSprintWeeks(state.sw);
  s.setDirectValue(state.dv);
  s.setDirectUnit(state.du === 'h' ? 'hours' : 'days');
  s.setHorizonYears(state.hy);
  s.setAdvancedParams(state.mp);
  s.setNbCodebases(state.nc);
  s.setNewLibrary(state.nl);
  s.setActiveTab(state.tab === 'c' ? 'comparison' : 'standalone');
}

export function getDefaultTeam(): SeniorityRow[] {
  return SENIORITY_ORDER.map((level) => ({
    label: level,
    headcount: 0,
    hourlyRate: SENIORITY_DEFAULTS[level],
  }));
}

export function getDefaultAdvancedParams(): AdvancedParamsState {
  return { ...ENGINE_DEFAULTS };
}
