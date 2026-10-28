/**
 * @file AdvancedParameters.tsx
 * @author Guillaume Gautier (xeewi)
 * @created 2026-03-23
 * @project Feature Cost Calculator
 */

import { useState, useEffect } from 'react';
import { Info, Minus, Plus } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { RailStep } from '@/components/RailStep';
import { Segmented } from '@/components/Segmented';

export interface AdvancedParamsState {
  generalizationFactor: number;
  portingFactor: number;
  divergenceRate: number;
  maintenanceRateShared: number;
  maintenanceRateDuplicated: number;
  bugDuplicationFactor: number;
}

interface AdvancedParametersProps {
  params: AdvancedParamsState;
  onChange: (params: AdvancedParamsState) => void;
  isModified: boolean;
  onReset: () => void;
  nbConsumingCodebases: number;
  onNbConsumingCodebasesChange: (value: number) => void;
}

interface ParamConfig {
  key: keyof AdvancedParamsState;
  label: string;
  hint: string;
  min: number;
  max: number;
  step: number;
  decimalPlaces: number;
  citation: string;
}

const PARAM_CONFIGS: ParamConfig[] = [
  {
    key: 'generalizationFactor',
    label: 'Extra work to make it reusable',
    hint: '1.30 = shared code takes 30 % more effort to build.',
    min: 1.0, max: 2.0, step: 0.05, decimalPlaces: 2,
    citation: 'Research doc §3.2: Shared code requires 20–40% more code than a specific implementation to be generic enough for multiple consumers. Default 1.3 reflects the conservative end of the estimate.',
  },
  {
    key: 'portingFactor',
    label: 'Effort to copy it into another app',
    hint: '0.65 = porting costs 65 % of building it the first time.',
    min: 0.3, max: 1.0, step: 0.05, decimalPlaces: 2,
    citation: 'Research doc §4.1: Adapting a feature to a second codebase costs 50–80% of the initial effort. Default 0.65 is the midpoint of the range.',
  },
  {
    key: 'divergenceRate',
    label: 'How fast the copies drift apart',
    hint: '0.20 = keeping copies in sync gets 20 % harder each year.',
    min: 0.05, max: 0.5, step: 0.01, decimalPlaces: 2,
    citation: 'Research doc §7.5: Duplicated code diverges exponentially over time. Default 0.20 reflects moderate active development.',
  },
  {
    key: 'maintenanceRateShared',
    label: 'Yearly upkeep, shared library',
    hint: '0.18 = each year costs 18 % of the build cost.',
    min: 0.1, max: 0.3, step: 0.01, decimalPlaces: 2,
    citation: 'Research doc §7.1: Annual maintenance as % of initial dev cost. Industry average 15–25% (§2.1).',
  },
  {
    key: 'maintenanceRateDuplicated',
    label: 'Yearly upkeep, duplicated copies',
    hint: '0.22 = each year costs 22 % of the build cost, per copy.',
    min: 0.15, max: 0.4, step: 0.01, decimalPlaces: 2,
    citation: 'Research doc §7.2: Duplicated code maintenance is higher due to double effort on bug fixes and feature evolution (§4.2).',
  },
  {
    key: 'bugDuplicationFactor',
    label: 'Bugs fixed more than once',
    hint: '2.0 = every bug fix is done twice.',
    min: 1.0, max: 3.0, step: 0.1, decimalPlaces: 1,
    citation: 'Research doc §7.4 / IEEE study (§2.3): Up to 33% of bug fixes in cloned code contain propagated bugs.',
  },
];

function ParamRow({ config, value, onValueChange }: { config: ParamConfig; value: number; onValueChange: (v: number) => void }) {
  const { key, label, hint, min, max, step, decimalPlaces, citation } = config;
  const [inputStr, setInputStr] = useState(value.toFixed(decimalPlaces));

  useEffect(() => {
    setInputStr(value.toFixed(decimalPlaces));
  }, [value, decimalPlaces]);

  function commit() {
    const parsed = parseFloat(inputStr.replace(',', '.'));
    if (isNaN(parsed)) {
      setInputStr(value.toFixed(decimalPlaces));
    } else {
      const clamped = Math.max(min, Math.min(max, parsed));
      onValueChange(clamped);
      setInputStr(clamped.toFixed(decimalPlaces));
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium">{label}</span>
        <Popover>
          <PopoverTrigger
            aria-label={`Source for ${label}`}
            className="inline-flex items-center justify-center rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
          >
            <Info size={14} />
          </PopoverTrigger>
          <PopoverContent side="top" className="text-sm">{citation}</PopoverContent>
        </Popover>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Slider min={min} max={max} step={step} value={value}
            onValueChange={(v) => onValueChange(Array.isArray(v) ? v[0] : v)} aria-label={label} />
        </div>
        <Input type="text" inputMode="decimal" value={inputStr}
          onChange={(e) => setInputStr(e.target.value)} onBlur={commit}
          className="w-18 text-right" data-param={key} aria-label={`${label} value`} />
      </div>
      <p className="text-[13px] text-muted-foreground">{hint}</p>
    </div>
  );
}

const stepBtn =
  'inline-flex size-8 items-center justify-center rounded-sm border border-input bg-card hover:bg-muted disabled:opacity-40 disabled:hover:bg-card';

export function AdvancedParameters({
  params,
  onChange,
  isModified,
  onReset,
  nbConsumingCodebases,
  onNbConsumingCodebasesChange,
}: AdvancedParametersProps) {
  const [mode, setMode] = useState<'simple' | 'detailed'>(isModified ? 'detailed' : 'simple');
  const teams = nbConsumingCodebases;

  return (
    <>
      <RailStep number={3} title="Who would share it">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm">Teams using the shared library</p>
          <div className="flex items-center gap-1.5" role="group" aria-label="Teams using the shared library">
            <button type="button" className={stepBtn} aria-label="One team fewer" disabled={teams <= 1}
              onClick={() => onNbConsumingCodebasesChange(Math.max(1, teams - 1))}><Minus size={14} /></button>
            <span className="w-6 text-center font-semibold" aria-live="polite">{teams}</span>
            <button type="button" className={stepBtn} aria-label="One team more" disabled={teams >= 10}
              onClick={() => onNbConsumingCodebasesChange(Math.min(10, teams + 1))}><Plus size={14} /></button>
          </div>
        </div>
        <p className="mt-2 text-[13px] text-muted-foreground">
          Each team adds about 3 hours a week of coordination to the shared path.
        </p>
      </RailStep>

      <RailStep number={4} title="Assumptions">
        <Segmented
          label="Assumptions view"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'simple', label: 'Simple' },
            { value: 'detailed', label: 'Detailed' },
          ]}
        />
        {mode === 'simple' ? (
          <p className="mt-3 text-sm text-muted-foreground">
            {isModified
              ? 'You changed some of the research figures. Open Detailed to see which.'
              : 'Figures from industry research (COCOMO II, IEEE studies) and French salary data. Open Detailed to adjust them.'}
          </p>
        ) : (
          <div className="mt-4 space-y-5">
            {PARAM_CONFIGS.map((config) => (
              <ParamRow key={config.key} config={config} value={params[config.key]}
                onValueChange={(v) => onChange({ ...params, [config.key]: v })} />
            ))}
          </div>
        )}
        {isModified && (
          <button type="button" onClick={onReset}
            className="mt-4 text-sm font-medium text-panel underline decoration-1 hover:decoration-2">
            Restore research figures
          </button>
        )}
      </RailStep>
    </>
  );
}
