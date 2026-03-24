/**
 * @file AdvancedParameters.tsx
 * @author Guillaume Gautier (xeewi)
 * @created 2026-03-23
 * @project Feature Cost Calculator
 */

import { useState, useEffect } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

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
  min: number;
  max: number;
  step: number;
  decimalPlaces: number;
  citation: string;
}

const PARAM_CONFIGS: ParamConfig[] = [
  {
    key: 'generalizationFactor',
    label: 'Generalization factor',
    min: 1.0,
    max: 2.0,
    step: 0.05,
    decimalPlaces: 2,
    citation:
      'Research doc \u00a73.2: Shared code requires 20\u201340% more code than a specific implementation to be generic enough for multiple consumers. Default 1.3 reflects the conservative end of the +20% estimate.',
  },
  {
    key: 'portingFactor',
    label: 'Porting factor',
    min: 0.3,
    max: 1.0,
    step: 0.05,
    decimalPlaces: 2,
    citation:
      'Research doc \u00a74.1: Adapting a feature to a second codebase costs 50\u201380% of the initial effort. Default 0.65 is the midpoint of the 0.5\u20130.8 range from industry data.',
  },
  {
    key: 'divergenceRate',
    label: 'Divergence rate',
    min: 0.05,
    max: 0.50,
    step: 0.01,
    decimalPlaces: 2,
    citation:
      'Research doc \u00a77.5: Duplicated code diverges exponentially over time. Default 0.20 (20% annual rate) reflects moderate active development. Higher = faster divergence.',
  },
  {
    key: 'maintenanceRateShared',
    label: 'Maintenance rate (shared)',
    min: 0.10,
    max: 0.30,
    step: 0.01,
    decimalPlaces: 2,
    citation:
      'Research doc \u00a77.1: Annual maintenance cost as % of initial dev cost. Industry average 15\u201325% (\u00a72.1). Shared code default 18% accounts for generalized codebase overhead.',
  },
  {
    key: 'maintenanceRateDuplicated',
    label: 'Maintenance rate (duplicated)',
    min: 0.15,
    max: 0.40,
    step: 0.01,
    decimalPlaces: 2,
    citation:
      'Research doc \u00a77.2: Duplicated code maintenance is higher due to double effort. Default 22% (vs 18% shared) reflects the 2x overhead on bug fixes and feature evolution (\u00a74.2).',
  },
  {
    key: 'bugDuplicationFactor',
    label: 'Bug duplication factor',
    min: 1.0,
    max: 3.0,
    step: 0.1,
    decimalPlaces: 1,
    citation:
      'Research doc \u00a77.4 / IEEE study (\u00a72.3): Up to 33% of bug fixes in cloned code contain propagated bugs. Default 2.0 models full doubling of bug fix cost across 2 codebases.',
  },
];

interface ParamRowProps {
  config: ParamConfig;
  value: number;
  onValueChange: (value: number) => void;
}

function ParamRow({ config, value, onValueChange }: ParamRowProps) {
  const { key, label, min, max, step, decimalPlaces, citation } = config;
  const [inputStr, setInputStr] = useState(value.toFixed(decimalPlaces));

  // Sync inputStr when value changes externally (e.g., reset)
  useEffect(() => {
    setInputStr(value.toFixed(decimalPlaces));
  }, [value, decimalPlaces]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputStr(e.target.value);
  }

  function handleInputBlur() {
    const parsed = parseFloat(inputStr);
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
        <span className="text-sm text-foreground">{label}</span>
        <Popover>
          <PopoverTrigger
            aria-label={`View citation for ${label}`}
            className="inline-flex items-center justify-center rounded p-0.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Info size={14} />
          </PopoverTrigger>
          <PopoverContent side="top" className="text-sm">
            {citation}
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Slider
            min={min}
            max={max}
            step={step}
            value={value}
            onValueChange={(v) => onValueChange(Array.isArray(v) ? v[0] : v)}
            aria-label={label}
          />
        </div>
        <Input
          type="number"
          value={inputStr}
          min={min}
          max={max}
          step={step}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className="w-18 text-right"
          data-param={key}
        />
      </div>
    </div>
  );
}

export function AdvancedParameters({
  params,
  onChange,
  isModified,
  onReset,
  nbConsumingCodebases,
  onNbConsumingCodebasesChange,
}: AdvancedParametersProps) {
  const [open, setOpen] = useState(false);

  function handleParamChange(key: keyof AdvancedParamsState, value: number) {
    onChange({ ...params, [key]: value });
  }

  function handleConsumingTeamsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const parsed = parseInt(e.target.value, 10);
    if (!isNaN(parsed)) {
      onNbConsumingCodebasesChange(parsed);
    }
  }

  function handleConsumingTeamsBlur(e: React.FocusEvent<HTMLInputElement>) {
    const parsed = parseInt(e.target.value, 10);
    if (isNaN(parsed)) {
      onNbConsumingCodebasesChange(1);
    } else {
      onNbConsumingCodebasesChange(Math.max(1, Math.min(10, parsed)));
    }
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        className="flex w-full items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-left hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ChevronDown
          size={16}
          className={cn(
            'shrink-0 text-muted-foreground transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
        <span className="text-sm font-normal text-foreground">
          Advanced Parameters
        </span>
        {isModified && (
          <Badge variant="outline" className="ml-auto text-xs">
            Modified
          </Badge>
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="rounded-b-lg border border-t-0 border-border bg-card px-4 py-4">
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-normal text-foreground">
              Number of consuming teams
            </label>
            <Input
              type="number"
              min={1}
              max={10}
              step={1}
              value={nbConsumingCodebases}
              onChange={handleConsumingTeamsChange}
              onBlur={handleConsumingTeamsBlur}
              className="w-24"
            />
            <p className="text-xs text-muted-foreground">
              Teams sharing the same codebase
            </p>
          </div>
          <Separator />
          {PARAM_CONFIGS.map((config) => (
            <ParamRow
              key={config.key}
              config={config}
              value={params[config.key]}
              onValueChange={(v) => handleParamChange(config.key, v)}
            />
          ))}
          <div className="pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onReset}
            >
              Reset to defaults
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
