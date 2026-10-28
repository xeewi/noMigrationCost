/**
 * @file FeatureSizing.tsx
 * @author Guillaume Gautier (xeewi)
 * @created 2026-03-23
 * @project Feature Cost Calculator
 */

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RailStep } from '@/components/RailStep';
import { Segmented } from '@/components/Segmented';
import type { DirectHoursUnit, SizingMode } from '@/engine/types';

interface FeatureSizingProps {
  sizingMode: SizingMode;
  onSizingModeChange: (mode: SizingMode) => void;
  storyPoints: number;
  onStoryPointsChange: (sp: number) => void;
  velocity: number;
  onVelocityChange: (v: number) => void;
  sprintWeeks: number;
  onSprintWeeksChange: (w: number) => void;
  directValue: number;
  onDirectValueChange: (v: number) => void;
  directUnit: DirectHoursUnit;
  onDirectUnitChange: (u: DirectHoursUnit) => void;
  devHours: number;
}

const SPRINT_WEEK_OPTIONS = [
  { value: '1', label: '1 week' },
  { value: '2', label: '2 weeks' },
  { value: '3', label: '3 weeks' },
  { value: '4', label: '4 weeks' },
] as const;

function toInt(value: string): number {
  const v = parseInt(value, 10);
  return isNaN(v) || v < 0 ? 0 : v;
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={id} className="text-sm">{label}</label>
      <div className="w-28 shrink-0">{children}</div>
    </div>
  );
}

export function FeatureSizing({
  sizingMode,
  onSizingModeChange,
  storyPoints,
  onStoryPointsChange,
  velocity,
  onVelocityChange,
  sprintWeeks,
  onSprintWeeksChange,
  directValue,
  onDirectValueChange,
  directUnit,
  onDirectUnitChange,
  devHours,
}: FeatureSizingProps) {
  return (
    <RailStep number={2} title="How big is the feature">
      <Segmented
        label="Size the feature in"
        value={sizingMode}
        onChange={onSizingModeChange}
        options={[
          { value: 'story-points', label: 'Story points' },
          { value: 'direct-hours', label: 'Time' },
        ]}
      />

      {sizingMode === 'story-points' ? (
        <div className="mt-3 space-y-2">
          <Field id="story-points-input" label="Size">
            <Input id="story-points-input" type="number" min={0} className="text-right"
              value={storyPoints === 0 ? '' : storyPoints} placeholder="0"
              onChange={(e) => onStoryPointsChange(toInt(e.target.value))} />
          </Field>
          <Field id="velocity-input" label="Team points per sprint">
            <Input id="velocity-input" type="number" min={0} className="text-right"
              value={velocity === 0 ? '' : velocity} placeholder="1"
              onChange={(e) => onVelocityChange(toInt(e.target.value))} />
          </Field>
          <Field id="sprint-duration-trigger" label="Sprint length">
            <Select value={String(sprintWeeks)} onValueChange={(v) => { if (v !== null) onSprintWeeksChange(Number(v)); }}>
              <SelectTrigger id="sprint-duration-trigger" className="w-full"><SelectValue>{(v: string) => `${v} week${v === '1' ? '' : 's'}`}</SelectValue></SelectTrigger>
              <SelectContent>
                {SPRINT_WEEK_OPTIONS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          <Field id="direct-value-input" label={directUnit === 'hours' ? 'Hours of work' : 'Days of work'}>
            <Input id="direct-value-input" type="number" min={0} className="text-right"
              value={directValue === 0 ? '' : directValue} placeholder="0"
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                onDirectValueChange(isNaN(v) || v < 0 ? 0 : v);
              }} />
          </Field>
          <Segmented
            label="Unit"
            value={directUnit}
            onChange={onDirectUnitChange}
            options={[
              { value: 'hours', label: 'Hours' },
              { value: 'days', label: 'Days' },
            ]}
          />
        </div>
      )}

      <p className="mt-3 text-[13px] text-muted-foreground">
        About <span className="font-semibold text-foreground">{devHours > 0 ? Math.round(devHours) : '—'}</span> person-hours of development
      </p>
    </RailStep>
  );
}
