/**
 * @file TimeHorizon.tsx
 * @author Guillaume Gautier (xeewi)
 * @created 2026-03-24
 * @project Feature Cost Calculator
 */

import { Segmented } from '@/components/Segmented';

interface TimeHorizonProps {
  horizonYears: number;
  onHorizonChange: (years: number) => void;
}

const HORIZON_OPTIONS = ['1', '3', '5', '10'] as const;

export function TimeHorizon({ horizonYears, onHorizonChange }: TimeHorizonProps) {
  return (
    <Segmented
      label="Time horizon in years"
      value={String(horizonYears)}
      onChange={(v) => onHorizonChange(Number(v))}
      options={HORIZON_OPTIONS.map((y) => ({ value: y, label: y === '1' ? '1 yr' : `${y} yrs` }))}
      className="w-full sm:w-auto"
    />
  );
}
