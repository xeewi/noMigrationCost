/**
 * @file TimeHorizon.tsx
 * @author Guillaume Gautier (xeewi)
 * @created 2026-03-23
 * @project Feature Cost Calculator
 */

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TimeHorizonProps {
  horizonYears: number;
  onHorizonChange: (years: number) => void;
}

const HORIZON_OPTIONS = [1, 3, 5, 10] as const;

function formatYearLabel(years: number): string {
  return years === 1 ? '1 yr' : `${years} yrs`;
}

export function TimeHorizon({ horizonYears, onHorizonChange }: TimeHorizonProps) {
  return (
    <div className="flex items-center gap-1.5">
      {HORIZON_OPTIONS.map((years) => (
        <Button
          key={years}
          variant={horizonYears === years ? 'default' : 'outline'}
          size="sm"
          onClick={() => onHorizonChange(years)}
          type="button"
          className={cn('min-w-[48px] h-8 text-xs')}
        >
          {formatYearLabel(years)}
        </Button>
      ))}
    </div>
  );
}
