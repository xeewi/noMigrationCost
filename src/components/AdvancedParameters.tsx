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

import type { ModelParams } from '@/engine/types';

export type AdvancedParamsState = ModelParams;

interface AdvancedParametersProps {
  params: AdvancedParamsState;
  onChange: (params: AdvancedParamsState) => void;
  isModified: boolean;
  onReset: () => void;
  nbCodebases: number;
  onNbCodebasesChange: (value: number) => void;
  newLibrary: boolean;
  onNewLibraryChange: (value: boolean) => void;
}

export interface ParamConfig {
  key: keyof AdvancedParamsState;
  label: string;
  hint: string;
  min: number;
  max: number;
  step: number;
  decimalPlaces: number;
  evidence: 'Measured' | 'Assumption';
  citation: string;
}

export const MIN_CODEBASES = 2;
export const MAX_CODEBASES = 10;

export const PARAM_CONFIGS: ParamConfig[] = [
  {
    key: 'generalizationFactor',
    label: 'Extra work to make it reusable',
    hint: '1.20 = building it to be shared takes 20 % more effort.',
    min: 1.0, max: 1.6, step: 0.05, decimalPlaces: 2, evidence: 'Measured',
    citation: 'Docs §3 and §7.4: COCOMO II "develop for reuse" multiplier 1.07–1.24; HP 1.11; median +20 % across five studies (Krüger & Berger, FSE 2020).',
  },
  {
    key: 'portingFactor',
    label: 'Effort to copy it into another app',
    hint: '0.65 = each copy costs 65 % of building it the first time.',
    min: 0.3, max: 1.0, step: 0.05, decimalPlaces: 2, evidence: 'Measured',
    citation: 'Docs §4 and §7.4: COCOMO II reuse model gives 0.55–0.8 for copy-and-adapt; NASA data (Selby) reaches 0.55 once about 12 % of the code is modified.',
  },
  {
    key: 'integrationFactor',
    label: 'Effort to plug the library into another app',
    hint: '0.20 = each extra app costs 20 % of the first build to integrate.',
    min: 0, max: 0.5, step: 0.05, decimalPlaces: 2, evidence: 'Measured',
    citation: 'Docs §3 and §7.4: relative cost of reuse about 0.2 (Poulin); platform variants about 0.33 of a new build (Krüger & Berger, FSE 2020).',
  },
  {
    key: 'maintenanceRate',
    label: 'Yearly upkeep of one copy',
    hint: '0.20 = each year, keeping one copy working costs 20 % of its build.',
    min: 0.1, max: 0.4, step: 0.01, decimalPlaces: 2, evidence: 'Measured',
    citation: 'Docs §2 and §7.4: order of magnitude only — about 20 % a year (US DoD rule of thumb, Boehm annual change traffic). Same rate on both sides.',
  },
  {
    key: 'extraCopyUpkeep',
    label: 'Upkeep of each extra copy',
    hint: '1.00 = an extra copy costs as much to keep as the first, syncing and repeated fixes included.',
    min: 0.5, max: 1.5, step: 0.05, decimalPlaces: 2, evidence: 'Assumption',
    citation: 'Docs §4 and §7.4: forked BSD systems port 11–16 % of their changes from each other, at a steady rate (Ray & Kim, FSE 2012). No direct measurement of the ratio.',
  },
  {
    key: 'divergenceRate',
    label: 'How fast the copies drift apart',
    hint: '0.05 = each year, an extra copy gets 5 % dearer to keep (capped at 1.5×).',
    min: 0, max: 0.2, step: 0.01, decimalPlaces: 2, evidence: 'Assumption',
    citation: 'Docs §4 and §7.4: no study measures this. Copies that drift far tend to stop syncing, hence the cap.',
  },
  {
    key: 'coordinationRate',
    label: 'Coordination and upgrades per extra app',
    hint: '0.04 = each extra app adds 4 % of the build a year in meetings and library upgrades.',
    min: 0, max: 0.15, step: 0.01, decimalPlaces: 2, evidence: 'Assumption',
    citation: 'Docs §3 and §7.4: coordination about 7 % of effort on a shared platform vs 5 % with copies (Krüger & Berger); 15 % of API changes break compatibility (Xavier et al., SANER 2017).',
  },
];

function ParamRow({ config, value, onValueChange }: { config: ParamConfig; value: number; onValueChange: (v: number) => void }) {
  const { key, label, hint, min, max, step, decimalPlaces, evidence, citation } = config;
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
        <span className="ml-auto text-[12px] uppercase tracking-[0.08em] text-muted-foreground">{evidence}</span>
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
  nbCodebases,
  onNbCodebasesChange,
  newLibrary,
  onNewLibraryChange,
}: AdvancedParametersProps) {
  const [mode, setMode] = useState<'simple' | 'detailed'>(isModified ? 'detailed' : 'simple');
  const apps = nbCodebases;

  return (
    <>
      <RailStep number={3} title="Who needs it">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm">Apps that need this feature</p>
          <div className="flex items-center gap-1.5" role="group" aria-label="Apps that need this feature">
            <button type="button" className={stepBtn} aria-label="One app fewer" disabled={apps <= MIN_CODEBASES}
              onClick={() => onNbCodebasesChange(Math.max(MIN_CODEBASES, apps - 1))}><Minus size={14} /></button>
            <span className="w-6 text-center font-semibold" aria-live="polite">{apps}</span>
            <button type="button" className={stepBtn} aria-label="One app more" disabled={apps >= MAX_CODEBASES}
              onClick={() => onNbCodebasesChange(Math.min(MAX_CODEBASES, apps + 1))}><Plus size={14} /></button>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-sm">Shared library</p>
          <Segmented
            label="Shared library"
            value={newLibrary ? 'new' : 'existing'}
            onChange={(v) => onNewLibraryChange(v === 'new')}
            options={[
              { value: 'new', label: 'To create' },
              { value: 'existing', label: 'Already exists' },
            ]}
          />
        </div>
        <p className="mt-2 text-[13px] text-muted-foreground">
          {newLibrary
            ? 'Creating it costs about 8 weeks of setup, then 100 hours a year to run, all charged to this feature.'
            : 'No setup or running cost: the library is already paid for.'}
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
              : 'Figures from software-engineering studies (COCOMO II, reuse and fork studies) and 2026 French salary data. Open Detailed to see which are measured and which are assumptions.'}
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
