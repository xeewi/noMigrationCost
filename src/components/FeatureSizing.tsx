/**
 * @file FeatureSizing.tsx
 * @author Guillaume Gautier (xeewi)
 * @created 2026-03-23
 * @project Feature Cost Calculator
 */

import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
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
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Feature Sizing</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={sizingMode}
          onValueChange={(v) => onSizingModeChange(v as SizingMode)}
        >
          <TabsList>
            <TabsTrigger value="story-points">Story Points</TabsTrigger>
            <TabsTrigger value="direct-hours">Direct Hours</TabsTrigger>
          </TabsList>

          <TabsContent value="story-points" className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="story-points-input">
                Story points
              </label>
              <Input
                id="story-points-input"
                type="number"
                min={0}
                value={storyPoints === 0 ? '' : storyPoints}
                placeholder="0"
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  onStoryPointsChange(isNaN(v) || v < 0 ? 0 : v);
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="velocity-input">
                Team velocity (SP/sprint)
              </label>
              <Input
                id="velocity-input"
                type="number"
                min={1}
                value={velocity}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  onVelocityChange(isNaN(v) || v < 1 ? 1 : v);
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="sprint-duration-trigger">
                Sprint duration
              </label>
              <Select
                value={String(sprintWeeks)}
                onValueChange={(v) => { if (v !== null) onSprintWeeksChange(Number(v)); }}
              >
                <SelectTrigger id="sprint-duration-trigger">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SPRINT_WEEK_OPTIONS.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="direct-hours" className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="direct-value-input">
                {directUnit === 'hours' ? 'Hours' : 'Days'}
              </label>
              <div className="flex gap-2 items-center">
                <Input
                  id="direct-value-input"
                  type="number"
                  min={0}
                  value={directValue === 0 ? '' : directValue}
                  placeholder="0"
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    onDirectValueChange(isNaN(v) || v < 0 ? 0 : v);
                  }}
                />
                <div className="flex gap-1">
                  <Button
                    variant={directUnit === 'hours' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onDirectUnitChange('hours')}
                    type="button"
                  >
                    Hours
                  </Button>
                  <Button
                    variant={directUnit === 'days' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onDirectUnitChange('days')}
                    type="button"
                  >
                    Days
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className={cn('mt-4 flex items-baseline gap-2 text-sm')}>
          <span className="text-muted-foreground font-medium">
            Estimated development hours
          </span>
          <span className={cn('font-semibold', devHours > 0 ? 'text-primary' : 'text-foreground')}>
            {devHours > 0 ? Math.round(devHours) : '\u2014'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
