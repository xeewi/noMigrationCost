/**
 * @file ComparisonTab.tsx
 * @author Guillaume Gautier (xeewi)
 * @created 2026-03-23
 * @project Feature Cost Calculator
 */

import { BarChart2 } from 'lucide-react';
import { CostChart } from '@/components/CostChart';
import { EmptyState } from '@/components/EmptyState';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatEuro } from '@/lib/utils';
import type { ComparisonOutputs, CostLine } from '@/engine/types';

interface ComparisonTabProps {
  comparison: ComparisonOutputs | null;
  horizonYears: number;
  nbCodebases: number;
  emptyReason: 'zero-team' | 'zero-hours' | null;
}

function SideTable({ title, lines, total, tone }: { title: string; lines: CostLine[]; total: number; tone: string }) {
  return (
    <div className="rounded-md border border-border bg-card sm:px-2 text-[13px] sm:text-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-normal">{title}</TableHead>
            <TableHead className="text-right">Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lines.filter((l) => l.cost > 0).map((l) => (
            <TableRow key={l.label}>
              <TableCell className="whitespace-normal">{l.label}</TableCell>
              <TableCell className="text-right">{formatEuro(l.cost)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="font-semibold">Total</TableCell>
            <TableCell className={`text-right font-semibold ${tone}`}>{formatEuro(total)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

export function ComparisonTab({ comparison, horizonYears, nbCodebases, emptyReason }: ComparisonTabProps) {
  if (emptyReason !== null || comparison === null) {
    return (
      <EmptyState
        icon={BarChart2}
        title="Add a team member and a feature size"
        description="The verdict needs at least one person on the team and a feature size above zero."
      />
    );
  }

  const years = horizonYears === 1 ? '1 year' : `${horizonYears} years`;

  return (
    <div className="space-y-7">
      <CostChart monthly={comparison.monthly} breakEvenMonth={comparison.breakEvenMonth} horizonYears={horizonYears} />

      <section aria-labelledby="breakdown-heading">
        <h2 id="breakdown-heading" className="font-sign text-[20px] font-bold uppercase tracking-[0.06em]">
          Full breakdown
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {nbCodebases} apps, over {years}. Every line is a share of the cost of building the feature once, except library setup and running, which are fixed hours (docs §7).
        </p>
        <div className="mt-3 grid gap-4 xl:grid-cols-2">
          <SideTable title="Shared library" lines={comparison.shared.lines} total={comparison.shared.total} tone="text-panel" />
          <SideTable title="One copy per app" lines={comparison.duplicated.lines} total={comparison.duplicated.total} tone="text-hazard" />
        </div>
      </section>
    </div>
  );
}
