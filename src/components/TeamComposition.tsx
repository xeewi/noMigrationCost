/**
 * @file TeamComposition.tsx
 * @author Guillaume Gautier (xeewi)
 * @created 2026-03-23
 * @project Feature Cost Calculator
 */

import { Minus, Plus } from 'lucide-react';
import { formatEuro } from '@/lib/utils';
import type { SeniorityLevel, SeniorityRow } from '@/engine/types';
import { SENIORITY_DEFAULTS } from '@/engine/types';
import { RailStep } from '@/components/RailStep';

interface TeamCompositionProps {
  team: SeniorityRow[];
  onTeamChange: (team: SeniorityRow[]) => void;
  teamAvgRate: number;
}

const SENIORITY_LEVELS: SeniorityLevel[] = ['Junior', 'Mid', 'Senior', 'Lead'];

const stepBtn =
  'inline-flex size-8 items-center justify-center rounded-sm border border-input bg-card text-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-card';

export function TeamComposition({ team, onTeamChange, teamAvgRate }: TeamCompositionProps) {
  function update(index: number, patch: Partial<SeniorityRow>) {
    onTeamChange(team.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function handleRateChange(index: number, value: string) {
    const parsed = parseFloat(value);
    update(index, {
      hourlyRate: isNaN(parsed) || parsed < 0 ? SENIORITY_DEFAULTS[team[index].label] : parsed,
    });
  }

  return (
    <RailStep number={1} title="Who builds it">
      <ul className="divide-y divide-border">
        {SENIORITY_LEVELS.map((level, index) => {
          const row = team[index];
          return (
            <li key={level} className="flex items-center justify-between gap-3 py-2">
              <div className="min-w-0">
                <p className="font-medium">{level}</p>
                <label className="flex items-center gap-1 text-[13px] text-muted-foreground">
                  <input
                    type="number"
                    min={0}
                    value={row.hourlyRate}
                    aria-label={`${level} hourly rate in euros`}
                    onChange={(e) => handleRateChange(index, e.target.value)}
                    className="min-w-6 [field-sizing:content] rounded-sm border border-transparent bg-transparent px-1 hover:border-input focus:border-input focus:bg-card [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  €/h
                </label>
              </div>
              <div className="flex items-center gap-1.5" role="group" aria-label={`${level} headcount`}>
                <button
                  type="button"
                  className={stepBtn}
                  aria-label={`Remove one ${level}`}
                  disabled={row.headcount === 0}
                  onClick={() => update(index, { headcount: Math.max(0, row.headcount - 1) })}
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center font-semibold" aria-live="polite">{row.headcount}</span>
                <button
                  type="button"
                  className={stepBtn}
                  aria-label={`Add one ${level}`}
                  onClick={() => update(index, { headcount: row.headcount + 1 })}
                >
                  <Plus size={14} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-[13px] text-muted-foreground">
        Average loaded cost{' '}
        <span className="font-semibold text-foreground">
          {teamAvgRate > 0 ? `${formatEuro(teamAvgRate)}/h` : '—'}
        </span>
      </p>
    </RailStep>
  );
}
