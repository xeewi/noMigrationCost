/**
 * @file Segmented.tsx
 * @project Feature Cost Calculator
 */

import { cn } from '@/lib/utils';

interface SegmentedProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  className?: string;
}

/** A row of mutually exclusive toggle buttons. */
export function Segmented<T extends string>({ label, value, options, onChange, className }: SegmentedProps<T>) {
  return (
    <div role="group" aria-label={label} className={cn('flex rounded-sm border border-input bg-card p-0.5', className)}>
      {options.map((opt) => {
        const on = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex-1 whitespace-nowrap rounded-[3px] px-3 py-1.5 text-sm font-medium transition-colors duration-150',
              on ? 'bg-ink text-white' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
