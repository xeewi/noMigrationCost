import type { SeniorityRow, SeniorityLevel, SizingMode, DirectHoursUnit } from '@/engine/types';
import { SENIORITY_DEFAULTS, ENGINE_DEFAULTS } from '@/engine/types';
import type { AdvancedParamsState } from '@/components/AdvancedParameters';

export interface ShareableState {
  v: 1;
  th: [number, number, number, number]; // headcounts (Junior/Mid/Senior/Lead)
  tr: [number, number, number, number]; // hourly rates
  sm: 'sp' | 'dh';                      // sizingMode
  sp: number;                            // storyPoints
  vel: number;                           // velocity
  sw: number;                            // sprintWeeks
  dv: number;                            // directValue
  du: 'h' | 'd';                         // directUnit
  hy: number;                            // horizonYears
  gf: number;                            // generalizationFactor
  pf: number;                            // portingFactor
  dr: number;                            // divergenceRate
  mrs: number;                           // maintenanceRateShared
  mrd: number;                           // maintenanceRateDuplicated
  bdf: number;                           // bugDuplicationFactor
  nc: number;                            // nbConsumingCodebases
  tab: 'c' | 's';                        // active tab (comparison/standalone)
}

const SENIORITY_ORDER: SeniorityLevel[] = ['Junior', 'Mid', 'Senior', 'Lead'];

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
  nbConsumingCodebases: number,
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
    v: 1,
    th,
    tr,
    sm: sizingMode === 'story-points' ? 'sp' : 'dh',
    sp: storyPoints,
    vel: velocity,
    sw: sprintWeeks,
    dv: directValue,
    du: directUnit === 'hours' ? 'h' : 'd',
    hy: horizonYears,
    gf: advancedParams.generalizationFactor,
    pf: advancedParams.portingFactor,
    dr: advancedParams.divergenceRate,
    mrs: advancedParams.maintenanceRateShared,
    mrd: advancedParams.maintenanceRateDuplicated,
    bdf: advancedParams.bugDuplicationFactor,
    nc: nbConsumingCodebases,
    tab: activeTab === 'comparison' ? 'c' : 's',
  };

  return btoa(JSON.stringify(state))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function decodeAppState(hash: string): ShareableState | null {
  try {
    const padded = hash
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(hash.length + (4 - (hash.length % 4)) % 4, '=');
    const parsed = JSON.parse(atob(padded)) as ShareableState;
    if (parsed.v !== 1) return null;
    return parsed;
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
  setNbConsumingCodebases: (n: number) => void;
  setActiveTab: (t: string) => void;
}

export function applyStateToSetters(state: ShareableState, setters: StateSetters): void {
  const {
    setTeam,
    setSizingMode,
    setStoryPoints,
    setVelocity,
    setSprintWeeks,
    setDirectValue,
    setDirectUnit,
    setHorizonYears,
    setAdvancedParams,
    setNbConsumingCodebases,
    setActiveTab,
  } = setters;

  const team: SeniorityRow[] = SENIORITY_ORDER.map((level, i) => ({
    label: level,
    headcount: state.th[i],
    hourlyRate: state.tr[i],
  }));

  setTeam(team);
  setSizingMode(state.sm === 'sp' ? 'story-points' : 'direct-hours');
  setStoryPoints(state.sp);
  setVelocity(state.vel);
  setSprintWeeks(state.sw);
  setDirectValue(state.dv);
  setDirectUnit(state.du === 'h' ? 'hours' : 'days');
  setHorizonYears(state.hy);
  setAdvancedParams({
    generalizationFactor: state.gf,
    portingFactor: state.pf,
    divergenceRate: state.dr,
    maintenanceRateShared: state.mrs,
    maintenanceRateDuplicated: state.mrd,
    bugDuplicationFactor: state.bdf,
  });
  setNbConsumingCodebases(state.nc);
  setActiveTab(state.tab === 'c' ? 'comparison' : 'standalone');
}

export function getDefaultTeam(): SeniorityRow[] {
  return SENIORITY_ORDER.map((level) => ({
    label: level,
    headcount: 0,
    hourlyRate: SENIORITY_DEFAULTS[level],
  }));
}

export function getDefaultAdvancedParams(): AdvancedParamsState {
  return {
    generalizationFactor: ENGINE_DEFAULTS.generalizationFactor,
    portingFactor: ENGINE_DEFAULTS.portingFactor,
    divergenceRate: ENGINE_DEFAULTS.divergenceRate,
    maintenanceRateShared: ENGINE_DEFAULTS.maintenanceRateShared,
    maintenanceRateDuplicated: ENGINE_DEFAULTS.maintenanceRateDuplicated,
    bugDuplicationFactor: ENGINE_DEFAULTS.bugDuplicationFactor,
  };
}
