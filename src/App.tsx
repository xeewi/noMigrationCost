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
  calcComparison,
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
  nbCodebases: 2,
  newLibrary: true,
  nbTeams: 1,
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
  const [advancedParams, setAdvancedParams] = useState<AdvancedParamsState>(getDefaultAdvancedParams);

  const [nbCodebases, setNbCodebases] = useState<number>(EXAMPLE.nbCodebases);
  const [newLibrary, setNewLibrary] = useState<boolean>(EXAMPLE.newLibrary);
  const [nbTeams, setNbTeams] = useState<number>(EXAMPLE.nbTeams);

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
      setHorizonYears, setAdvancedParams, setNbCodebases, setNewLibrary, setNbTeams,
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
        nbCodebases, newLibrary, nbTeams, activeTab,
      );
    }, 300);
    return () => clearTimeout(id);
  }, [view, team, sizingMode, storyPoints, velocity, sprintWeeks,
      directValue, directUnit, horizonYears, advancedParams,
      nbCodebases, newLibrary, nbTeams, activeTab]);

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
    setNbCodebases(EXAMPLE.nbCodebases);
    setNewLibrary(EXAMPLE.newLibrary);
    setNbTeams(EXAMPLE.nbTeams);
    setActiveTab('comparison');
  }, []);

  const isExample = useMemo(() => {
    const current = encodeAppState(team, sizingMode, storyPoints, velocity, sprintWeeks,
      directValue, directUnit, horizonYears, advancedParams, nbCodebases, newLibrary, nbTeams, 'comparison');
    const example = encodeAppState(exampleTeam(), 'story-points', EXAMPLE.storyPoints, EXAMPLE.velocity,
      EXAMPLE.sprintWeeks, 0, 'hours', EXAMPLE.horizonYears, getDefaultAdvancedParams(),
      EXAMPLE.nbCodebases, EXAMPLE.newLibrary, EXAMPLE.nbTeams, 'comparison');
    return current === example;
  }, [team, sizingMode, storyPoints, velocity, sprintWeeks, directValue, directUnit,
      horizonYears, advancedParams, nbCodebases, newLibrary, nbTeams]);

  // Derived state — all via useMemo, never useState
  const teamAvgRate = useMemo(() => calcTeamAvgRate(team), [team]);

  const headcount = useMemo(() => team.reduce((sum, row) => sum + row.headcount, 0), [team]);

  const devHours = useMemo(
    () =>
      calcDevHours(
        { mode: sizingMode, storyPoints, velocity, sprintWeeks, directValue, directUnit },
        headcount,
      ),
    [sizingMode, storyPoints, velocity, sprintWeeks, directValue, directUnit, headcount],
  );

  const emptyReason = useMemo(() => {
    if (teamAvgRate === 0) return 'zero-team' as const;
    if (devHours === 0) return 'zero-hours' as const;
    return null;
  }, [teamAvgRate, devHours]);

  // Detect whether any advanced param differs from defaults (with fp tolerance)
  const isAdvancedModified = useMemo(
    () => (Object.keys(ENGINE_DEFAULTS) as (keyof AdvancedParamsState)[])
      .some((k) => Math.abs(advancedParams[k] - ENGINE_DEFAULTS[k]) > 0.001),
    [advancedParams],
  );

  const resetAdvancedParams = () => setAdvancedParams(getDefaultAdvancedParams());

  const engineInputs: EngineInputs = useMemo(() => ({
    ...advancedParams,
    teamAvgHourlyRate: teamAvgRate,
    devHours,
    horizonYears,
    nbCodebases,
    newLibrary,
    nbTeams,
  }), [advancedParams, teamAvgRate, devHours, horizonYears, nbCodebases, newLibrary, nbTeams]);

  const ready = teamAvgRate > 0 && devHours > 0;
  const costOutput = useMemo(() => (ready ? calcStandaloneCost(engineInputs) : null), [ready, engineInputs]);
  const comparison = useMemo(() => (ready ? calcComparison(engineInputs) : null), [ready, engineInputs]);

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
              nbCodebases={nbCodebases}
              onNbCodebasesChange={setNbCodebases}
              newLibrary={newLibrary}
              onNewLibraryChange={setNewLibrary}
              nbTeams={nbTeams}
              onNbTeamsChange={setNbTeams}
            />
          </aside>

          <main className="order-first lg:order-none min-w-0 px-4 py-6 sm:px-8 sm:py-8">
            {comparison && (
              <VerdictPanel
                sharedTotal={comparison.shared.total}
                duplicatedTotal={comparison.duplicated.total}
                breakEvenMonth={comparison.breakEvenMonth}
                startTie={Math.abs(comparison.monthly[0].shared - comparison.monthly[0].duplicated) < 1}
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
                comparison={comparison}
                horizonYears={horizonYears}
                nbCodebases={nbCodebases}
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
