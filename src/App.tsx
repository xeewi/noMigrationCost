import { useState, useMemo } from 'react';
import { TeamComposition } from '@/components/TeamComposition';
import { FeatureSizing } from '@/components/FeatureSizing';
import { TimeHorizon } from '@/components/TimeHorizon';
import { CostOutput } from '@/components/CostOutput';
import { calcTeamAvgRate, calcDevHours, calcStandaloneCost } from '@/engine/formulas';
import {
  SENIORITY_DEFAULTS,
  ENGINE_DEFAULTS,
} from '@/engine/types';
import type { SeniorityRow, SizingMode, DirectHoursUnit } from '@/engine/types';

function App() {
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

  const costOutput = useMemo(() => {
    if (teamAvgRate === 0 || devHours === 0) return null;
    return calcStandaloneCost({
      teamAvgHourlyRate: teamAvgRate,
      devHours,
      horizonYears,
      maintenanceRate: ENGINE_DEFAULTS.maintenanceRateShared,
      generalizationFactor: ENGINE_DEFAULTS.generalizationFactor,
      portingFactor: ENGINE_DEFAULTS.portingFactor,
      divergenceRate: ENGINE_DEFAULTS.divergenceRate,
      bugDuplicationFactor: ENGINE_DEFAULTS.bugDuplicationFactor,
      nbConsumingCodebases: ENGINE_DEFAULTS.nbConsumingCodebases,
    });
  }, [teamAvgRate, devHours, horizonYears]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-[1280px] mx-auto px-6 py-8">
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
            <TimeHorizon
              horizonYears={horizonYears}
              onHorizonChange={setHorizonYears}
            />
          </div>
          {/* Output column: 45%, sticky per D-02 */}
          <div className="flex-[45] md:sticky md:top-6 md:self-start">
            <CostOutput output={costOutput} emptyReason={emptyReason} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
