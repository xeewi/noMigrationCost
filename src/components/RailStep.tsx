/**
 * @file RailStep.tsx
 * @project Feature Cost Calculator
 */

import type { ReactNode } from 'react';

interface RailStepProps {
  number: number;
  title: string;
  children: ReactNode;
}

/** One numbered step of the input rail. The numbers carry the reading order. */
export function RailStep({ number, title, children }: RailStepProps) {
  const id = `step-${number}`;
  return (
    <section aria-labelledby={id} className="border-b border-border px-5 py-5 last:border-b-0">
      <h2 id={id} className="flex items-center gap-2 font-sign text-[15px] font-bold uppercase tracking-[0.1em]">
        <span className="inline-flex size-6 items-center justify-center rounded-sm bg-ink text-[13px] text-white">
          {number}
        </span>
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
