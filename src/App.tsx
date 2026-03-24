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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { AdvancedParamsState } from '@/components/AdvancedParameters';
import { AppHeader } from '@/components/AppHeader';
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
import {
  SENIORITY_DEFAULTS,
  ENGINE_DEFAULTS,
} from '@/engine/types';
import type { SeniorityRow, SizingMode, DirectHoursUnit, EngineInputs } from '@/engine/types';

function App() {
  const { view, navigateTo } = useHashRoute();

  // Raw input state
  const [team, setTeam] = useState<SeniorityRow[]>([
    { label: 'Junior', headcount: 0, hourlyRate: SENIORITY_DEFAULTS.Junior },
    { label: 'Mid', headcount: 0, hourlyRate: SENIORITY_DEFAULTS.Mid },
    { label: 'Senior', headcount: 0, hourlyRate: SENIORITY_DEFAULTS.Senior },
    { label: 'Lead', headcount: 0, hourlyRate: SENIORITY_DEFAULTS.Lead },
  ]);
  const [sizingMode, setSizingMode] = useState<SizingMode>('story-points');
  const [storyPoints, setStoryPoints] = useState(0);
  const [velocity, setVelocity] = useState(10);
  const [sprintWeeks, setSprintWeeks] = useState(2);
  const [directValue, setDirectValue] = useState(0);
  const [directUnit, setDirectUnit] = useState<DirectHoursUnit>('hours');
  const [horizonYears, setHorizonYears] = useState(5);

  // Advanced parameters state — all formula constants lifted to App.tsx
  const [advancedParams, setAdvancedParams] = useState<AdvancedParamsState>({
    generalizationFactor: ENGINE_DEFAULTS.generalizationFactor,
    portingFactor: ENGINE_DEFAULTS.portingFactor,
    divergenceRate: ENGINE_DEFAULTS.divergenceRate,
    maintenanceRateShared: ENGINE_DEFAULTS.maintenanceRateShared,
    maintenanceRateDuplicated: ENGINE_DEFAULTS.maintenanceRateDuplicated,
    bugDuplicationFactor: ENGINE_DEFAULTS.bugDuplicationFactor,
  });

  const [nbConsumingCodebases, setNbConsumingCodebases] = useState<number>(
    ENGINE_DEFAULTS.nbConsumingCodebases,
  );

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
    setTeam(getDefaultTeam());
    setSizingMode('story-points');
    setStoryPoints(0);
    setVelocity(10);
    setSprintWeeks(2);
    setDirectValue(0);
    setDirectUnit('hours');
    setHorizonYears(5);
    setAdvancedParams(getDefaultAdvancedParams());
    setNbConsumingCodebases(ENGINE_DEFAULTS.nbConsumingCodebases);
    setActiveTab('comparison');
    // Hash will be updated by the state-change effect (encodes defaults — harmless per RESEARCH.md Pitfall 4)
  }, []);

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
        <div className="max-w-[1280px] mx-auto px-6 py-8 pb-16">
          <div className="flex gap-8 md:flex-row flex-col">
            {/* Inputs column: 55% */}
            <div className="flex-[55] space-y-6">
              <TeamComposition
                team={team}
                onTeamChange={setTeam}
                teamAvgRate={teamAvgRate}
              />
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
            </div>
            {/* Output column: 45% */}
            <div className="flex-[45]">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <TabsList>
                    <TabsTrigger value="comparison">Comparison</TabsTrigger>
                    <TabsTrigger value="standalone">Standalone</TabsTrigger>
                  </TabsList>
                  <TimeHorizon
                    horizonYears={horizonYears}
                    onHorizonChange={setHorizonYears}
                  />
                </div>
                <TabsContent value="comparison">
                  <ComparisonTab
                    sharedCost={sharedCostOutput}
                    duplicatedCost={duplicatedCostOutput}
                    breakEven={breakEvenResult}
                    horizonYears={horizonYears}
                    standaloneTotalCost={costOutput?.totalStandaloneCost ?? 0}
                    emptyReason={emptyReason}
                  />
                </TabsContent>
                <TabsContent value="standalone">
                  <CostOutput output={costOutput} emptyReason={emptyReason} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Docs view — full research document with sidebar navigation */}
      {view === 'docs' && <DocsPage />}

      <AppFooter />
    </div>
  );
}

export default App;
