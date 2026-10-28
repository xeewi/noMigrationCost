/**
 * @file VerdictPanel.tsx
 * @project Feature Cost Calculator
 *
 * The site-notice panel: the conclusion of the scenario, readable before any input.
 */

import { useEffect, useRef, useState } from 'react';
import { formatEuro } from '@/lib/utils';

interface VerdictPanelProps {
  sharedTotal: number;
  duplicatedTotal: number;
  breakEvenMonths: number | null;
  horizonYears: number;
}

/** Re-tallies a figure toward its new value (ease-out expo), snapping under reduced motion. */
function useTally(target: number, duration = 650): number {
  const [shown, setShown] = useState(target);
  const fromRef = useRef(target);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const from = fromRef.current;
    if (reduce || from === target) {
      fromRef.current = target;
      setShown(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const value = from + (target - from) * eased;
      fromRef.current = value;
      setShown(value);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return shown;
}

function formatMonths(months: number): string {
  const m = Math.max(1, Math.round(months));
  return m === 1 ? '1 month' : `${m} months`;
}

export function VerdictPanel({
  sharedTotal,
  duplicatedTotal,
  breakEvenMonths,
  horizonYears,
}: VerdictPanelProps) {
  const gap = duplicatedTotal - sharedTotal;
  const sharedWins = gap > 0;
  const tallied = useTally(Math.abs(gap));
  const years = horizonYears === 1 ? '1 year' : `${horizonYears} years`;
  const paysOffInHorizon = breakEvenMonths !== null && breakEvenMonths <= horizonYears * 12;

  return (
    <section
      aria-labelledby="verdict-heading"
      className="relative mt-3 rounded-md bg-panel text-white px-6 pt-8 pb-6 sm:px-8 ring-[6px] ring-white outline outline-1 outline-offset-[6px] outline-border"
    >
      <span className="absolute -top-3 left-6 sm:left-8 rounded-sm bg-signal px-2.5 py-0.5 font-sign text-[13px] font-bold uppercase tracking-[0.14em] text-ink">
        Verdict over {years}
      </span>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr_1fr] lg:gap-8">
        <div>
          <h2 id="verdict-heading" className="font-sign text-[22px] sm:text-[24px] font-semibold leading-tight text-panel-soft">
            {sharedWins ? 'Duplicating this feature costs you' : 'Sharing this feature costs you'}
          </h2>
          <p
            className="mt-2 font-sign text-[56px] sm:text-[76px] font-extrabold leading-none tracking-[-0.01em]"
            aria-live="polite"
          >
            +&thinsp;{formatEuro(tallied)}
          </p>
          <p className="mt-3 max-w-[38ch] text-[15px] text-[#dfe5fa]">
            {sharedWins
              ? 'more than building it once in a shared library.'
              : 'more than copying it into each app, in this scenario.'}
          </p>
        </div>

        <div>
          <h3 className="font-sign text-[22px] sm:text-[24px] font-semibold leading-tight text-panel-soft">
            Sharing pays off after
          </h3>
          <p className="mt-1 font-sign text-[44px] font-bold leading-none">
            {paysOffInHorizon ? formatMonths(breakEvenMonths!) : 'Never'}
          </p>
          <p className="mt-3 max-w-[30ch] text-[15px] text-[#dfe5fa]">
            {paysOffInHorizon
              ? 'Before that, the shared library costs more.'
              : `Not within ${years}. Try more teams or a longer horizon.`}
          </p>
        </div>

        <div>
          <h3 className="font-sign text-[22px] sm:text-[24px] font-semibold leading-tight text-panel-soft">
            Total cost
          </h3>
          <dl className="mt-2 space-y-1.5 text-[15px]">
            <div className="flex items-baseline justify-between gap-4 border-b border-white/20 pb-1.5">
              <dt className="text-[#dfe5fa]">Shared</dt>
              <dd className="font-sign text-[28px] font-bold leading-none">{formatEuro(sharedTotal)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[#dfe5fa]">Duplicated</dt>
              <dd className="font-sign text-[28px] font-bold leading-none">{formatEuro(duplicatedTotal)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
