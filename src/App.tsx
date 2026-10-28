/**
 * @file App.tsx
 * @author Guillaume Gautier (xeewi)
 * @created 2026-03-23
 * @project Feature Cost Calculator
 */

import { useState, useMemo, useEffect, useCallback } from 'react';
import { TeamComposition } from '@/components/TeamComposition';
import { FeatureSizing } from '@/components/FeatureSizing';
import { TimeHorizon } from '@/components/TimeHorizon';
import { CostOutput } from '@/components/CostOutput';
import { AdvancedParameters } from '@/components/AdvancedParameters';
import { ComparisonTab } from '@/components/ComparisonTab';
import { Segmented } from '@/components/Segmented';
import type { AdvancedParamsState } from '@/components/AdvancedParameters';
import { AppHeader } from '@/components/AppHeader';
import { VerdictPanel } from '@/components/VerdictPanel';
import { AppFooter } from '@/components/AppFooter';
import { DocsPage } from '@/components/DocsPage';
import { useHashRoute } from '@/hooks/useHashRoute';
import {
  encodeAppState, decodeAppState, applyStateToSetters,
  getDefaultTeam, getDefaultAdvancedParams,
} from '@/lib/url-state';
import {
  calcTeamAvgRate,
  calcDevHours,
  calcStandaloneCost,
  calcSharedCost,
  calcDuplicatedCost,
  calcBreakEven,
} from '@/engine/formulas';
import { ENGINE_DEFAULTS } from '@/engine/types';
import type { SeniorityRow, SizingMode, DirectHoursUnit, EngineInputs } from '@/engine/types';

// Example scenario shown on first visit, so the verdict is readable before any input.
const EXAMPLE = {
  team: [1, 2, 1, 0],
  storyPoints: 40,
  velocity: 10,
  sprintWeeks: 2,
  horizonYears: 5,
  nbConsumingCodebases: 2,
} as const;

function exampleTeam(): SeniorityRow[] {
  return getDefaultTeam().map((row, i) => ({ ...row, headcount: EXAMPLE.team[i] }));
}

function App() {
  const { view, navigateTo } = useHashRoute();

  // Raw input state
  const [team, setTeam] = useState<SeniorityRow[]>(exampleTeam);
  const [sizingMode, setSizingMode] = useState<SizingMode>('story-points');
  const [storyPoints, setStoryPoints] = useState<number>(EXAMPLE.storyPoints);
  const [velocity, setVelocity] = useState<number>(EXAMPLE.velocity);
  const [sprintWeeks, setSprintWeeks] = useState<number>(EXAMPLE.sprintWeeks);
  const [directValue, setDirectValue] = useState(0);
  const [directUnit, setDirectUnit] = useState<DirectHoursUnit>('hours');
  const [horizonYears, setHorizonYears] = useState<number>(EXAMPLE.horizonYears);

  // Advanced parameters state — all formula constants lifted to App.tsx
  const [advancedParams, setAdvancedParams] = useState<AdvancedParamsState>({
    generalizationFactor: ENGINE_DEFAULTS.generalizationFactor,
    portingFactor: ENGINE_DEFAULTS.portingFactor,
    divergenceRate: ENGINE_DEFAULTS.divergenceRate,
    maintenanceRateShared: ENGINE_DEFAULTS.maintenanceRateShared,
    maintenanceRateDuplicated: ENGINE_DEFAULTS.maintenanceRateDuplicated,
    bugDuplicationFactor: ENGINE_DEFAULTS.bugDuplicationFactor,
  });

  const [nbConsumingCodebases, setNbConsumingCodebases] = useState<number>(EXAMPLE.nbConsumingCodebases);

  const [activeTab, setActiveTab] = useState<string>('comparison');

  // Hash read on mount — restores state from URL hash (SHARE-02)
  useEffect(() => {
    const raw = window.location.hash.slice(1);
    if (!raw) return;
    const state = decodeAppState(raw);
    if (!state) return; // malformed hash — stay at defaults
    applyStateToSetters(state, {
      setTeam, setSizingMode, setStoryPoints, setVelocity,
      setSprintWeeks, setDirectValue, setDirectUnit,
      setHorizonYears, setAdvancedParams, setNbConsumingCodebases,
      setActiveTab,
    });
  }, []);

  // Hash write on state change — live URL updates with 300ms debounce (D-01)
  useEffect(() => {
    if (view !== 'calculator') return; // D-08: don't overwrite route hash with calculator state
    const id = setTimeout(() => {
      window.location.hash = encodeAppState(
        team, sizingMode, storyPoints, velocity, sprintWeeks,
        directValue, directUnit, horizonYears, advancedParams,
        nbConsumingCodebases, activeTab,
      );
    }, 300);
    return () => clearTimeout(id);
  }, [view, team, sizingMode, storyPoints, velocity, sprintWeeks,
      directValue, directUnit, horizonYears, advancedParams,
      nbConsumingCodebases, activeTab]);

  // Reset handler — clears all inputs to defaults and clears hash (D-04)
  const handleReset = useCallback(() => {
    setTeam(exampleTeam());
    setSizingMode('story-points');
    setStoryPoints(EXAMPLE.storyPoints);
    setVelocity(EXAMPLE.velocity);
    setSprintWeeks(EXAMPLE.sprintWeeks);
    setDirectValue(0);
    setDirectUnit('hours');
    setHorizonYears(EXAMPLE.horizonYears);
    setAdvancedParams(getDefaultAdvancedParams());
    setNbConsumingCodebases(EXAMPLE.nbConsumingCodebases);
    setActiveTab('comparison');
  }, []);

  const isExample = useMemo(() => {
    const current = encodeAppState(team, sizingMode, storyPoints, velocity, sprintWeeks,
      directValue, directUnit, horizonYears, advancedParams, nbConsumingCodebases, 'comparison');
    const example = encodeAppState(exampleTeam(), 'story-points', EXAMPLE.storyPoints, EXAMPLE.velocity,
      EXAMPLE.sprintWeeks, 0, 'hours', EXAMPLE.horizonYears, getDefaultAdvancedParams(),
      EXAMPLE.nbConsumingCodebases, 'comparison');
    return current === example;
  }, [team, sizingMode, storyPoints, velocity, sprintWeeks, directValue, directUnit,
      horizonYears, advancedParams, nbConsumingCodebases]);

  // Derived state — all via useMemo, never useState
  const teamAvgRate = useMemo(() => calcTeamAvgRate(team), [team]);

  const devHours = useMemo(
    () =>
      calcDevHours({
        mode: sizingMode,
        storyPoints,
        velocity,
        sprintWeeks,
        directValue,
        directUnit,
      }),
    [sizingMode, storyPoints, velocity, sprintWeeks, directValue, directUnit],
  );

  const emptyReason = useMemo(() => {
    if (teamAvgRate === 0) return 'zero-team' as const;
    if (devHours === 0) return 'zero-hours' as const;
    return null;
  }, [teamAvgRate, devHours]);

  // Detect whether any advanced param differs from defaults (with fp tolerance)
  const isAdvancedModified = useMemo(() => {
    const eps = 0.001;
    return (
      Math.abs(advancedParams.generalizationFactor - ENGINE_DEFAULTS.generalizationFactor) > eps ||
      Math.abs(advancedParams.portingFactor - ENGINE_DEFAULTS.portingFactor) > eps ||
      Math.abs(advancedParams.divergenceRate - ENGINE_DEFAULTS.divergenceRate) > eps ||
      Math.abs(advancedParams.maintenanceRateShared - ENGINE_DEFAULTS.maintenanceRateShared) > eps ||
      Math.abs(advancedParams.maintenanceRateDuplicated - ENGINE_DEFAULTS.maintenanceRateDuplicated) > eps ||
      Math.abs(advancedParams.bugDuplicationFactor - ENGINE_DEFAULTS.bugDuplicationFactor) > eps
    );
  }, [advancedParams]);

  const resetAdvancedParams = () => {
    setAdvancedParams({
      generalizationFactor: ENGINE_DEFAULTS.generalizationFactor,
      portingFactor: ENGINE_DEFAULTS.portingFactor,
      divergenceRate: ENGINE_DEFAULTS.divergenceRate,
      maintenanceRateShared: ENGINE_DEFAULTS.maintenanceRateShared,
      maintenanceRateDuplicated: ENGINE_DEFAULTS.maintenanceRateDuplicated,
      bugDuplicationFactor: ENGINE_DEFAULTS.bugDuplicationFactor,
    });
  };

  // Two separate EngineInputs objects — shared vs duplicated (Research Pitfall 3)
  const sharedEngineInputs: EngineInputs = useMemo(() => ({
    teamAvgHourlyRate: teamAvgRate,
    devHours,
    horizonYears,
    maintenanceRate: advancedParams.maintenanceRateShared,
    generalizationFactor: advancedParams.generalizationFactor,
    portingFactor: advancedParams.portingFactor,
    divergenceRate: advancedParams.divergenceRate,
    bugDuplicationFactor: advancedParams.bugDuplicationFactor,
    nbConsumingCodebases,
    maintenanceRateShared: advancedParams.maintenanceRateShared,
  }), [teamAvgRate, devHours, horizonYears, advancedParams, nbConsumingCodebases]);

  const duplicatedEngineInputs: EngineInputs = useMemo(() => ({
    ...sharedEngineInputs,
    maintenanceRate: advancedParams.maintenanceRateDuplicated,
  }), [sharedEngineInputs, advancedParams.maintenanceRateDuplicated]);

  // Standalone cost uses shared maintenance rate
  const costOutput = useMemo(() => {
    if (teamAvgRate === 0 || devHours === 0) return null;
    return calcStandaloneCost(sharedEngineInputs);
  }, [teamAvgRate, devHours, sharedEngineInputs]);

  // Comparison engine outputs — ready for Plan 03
  const sharedCostOutput = useMemo(() => {
    if (teamAvgRate === 0 || devHours === 0) return null;
    return calcSharedCost(sharedEngineInputs);
  }, [teamAvgRate, devHours, sharedEngineInputs]);

  const duplicatedCostOutput = useMemo(() => {
    if (teamAvgRate === 0 || devHours === 0) return null;
    return calcDuplicatedCost(duplicatedEngineInputs);
  }, [teamAvgRate, devHours, duplicatedEngineInputs]);

  const breakEvenResult = useMemo(() => {
    if (teamAvgRate === 0 || devHours === 0) return null;
    return calcBreakEven(duplicatedEngineInputs);
  }, [teamAvgRate, devHours, duplicatedEngineInputs]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader onReset={handleReset} view={view} onNavigate={navigateTo} />

      {/* Calculator view — always mounted, hidden when on docs (D-07: zero state loss) */}
      <div className={view === 'calculator' ? '' : 'hidden'}>
        <div className="max-w-[1440px] mx-auto flex flex-col lg:grid lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside aria-label="Scenario" className="bg-card border-b lg:border-b-0 lg:border-r border-border">
            {isExample && (
              <p className="hidden lg:block mx-5 mt-5 rounded-sm bg-[#fff5cc] px-3 py-2.5 text-[13px] text-ink">
                <span className="font-semibold">Example scenario.</span> Change any figure to make it yours: the verdict updates as you type.
              </p>
            )}
            <TeamComposition team={team} onTeamChange={setTeam} teamAvgRate={teamAvgRate} />
            <FeatureSizing
              sizingMode={sizingMode}
              onSizingModeChange={setSizingMode}
              storyPoints={storyPoints}
              onStoryPointsChange={setStoryPoints}
              velocity={velocity}
              onVelocityChange={setVelocity}
              sprintWeeks={sprintWeeks}
              onSprintWeeksChange={setSprintWeeks}
              directValue={directValue}
              onDirectValueChange={setDirectValue}
              directUnit={directUnit}
              onDirectUnitChange={setDirectUnit}
              devHours={devHours}
            />
            <AdvancedParameters
              params={advancedParams}
              onChange={setAdvancedParams}
              isModified={isAdvancedModified}
              onReset={resetAdvancedParams}
              nbConsumingCodebases={nbConsumingCodebases}
              onNbConsumingCodebasesChange={setNbConsumingCodebases}
            />
          </aside>

          <main className="order-first lg:order-none min-w-0 px-4 py-6 sm:px-8 sm:py-8">
            {sharedCostOutput && duplicatedCostOutput && breakEvenResult && (
              <VerdictPanel
                sharedTotal={sharedCostOutput.totalCost}
                duplicatedTotal={duplicatedCostOutput.totalCost}
                breakEvenMonths={breakEvenResult.exists ? breakEvenResult.months : null}
                horizonYears={horizonYears}
              />
            )}
            {isExample && (
              <p className="lg:hidden mt-4 rounded-sm bg-[#fff5cc] px-3 py-2.5 text-[13px] text-ink">
                <span className="font-semibold">Example scenario.</span> Your own figures go in the steps below the results.
              </p>
            )}
            <div className="mt-6 mb-5 flex flex-wrap items-center justify-between gap-3">
              <Segmented
                label="Result view"
                value={activeTab === 'standalone' ? 'standalone' : 'comparison'}
                onChange={setActiveTab}
                options={[
                  { value: 'comparison', label: 'Shared vs duplicated' },
                  { value: 'standalone', label: 'One feature alone' },
                ]}
                className="w-full sm:w-auto"
              />
              <TimeHorizon horizonYears={horizonYears} onHorizonChange={setHorizonYears} />
            </div>
            {activeTab === 'standalone' ? (
              <CostOutput output={costOutput} emptyReason={emptyReason} />
            ) : (
              <ComparisonTab
                sharedCost={sharedCostOutput}
                duplicatedCost={duplicatedCostOutput}
                breakEven={breakEvenResult}
                horizonYears={horizonYears}
                portingFactor={advancedParams.portingFactor}
                emptyReason={emptyReason}
              />
            )}
          </main>
        </div>
      </div>

      {/* Docs view — full research document with sidebar navigation */}
      {view === 'docs' && <DocsPage />}

      <AppFooter />
    </div>
  );
}

export default App;
