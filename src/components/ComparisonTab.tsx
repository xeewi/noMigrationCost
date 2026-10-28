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
import type { SharedCostOutputs, DuplicatedCostOutputs, BreakEvenResult } from '@/engine/types';

interface ComparisonTabProps {
  sharedCost: SharedCostOutputs | null;
  duplicatedCost: DuplicatedCostOutputs | null;
  breakEven: BreakEvenResult | null;
  horizonYears: number;
  portingFactor: number;
  emptyReason: 'zero-team' | 'zero-hours' | null;
}

interface BreakdownRowData {
  category: string;
  sharedCost: number | null;
  duplicatedCost: number | null;
}

export function ComparisonTab({
  sharedCost,
  duplicatedCost,
  breakEven,
  horizonYears,
  portingFactor,
  emptyReason,
}: ComparisonTabProps) {
  if (emptyReason !== null || sharedCost === null || duplicatedCost === null || breakEven === null) {
    return (
      <EmptyState
        icon={BarChart2}
        title="Add a team member and a feature size"
        description="The verdict needs at least one person on the team and a feature size above zero."
      />
    );
  }

  const portingCost = (duplicatedCost.duplicatedDevCost * portingFactor) / (1 + portingFactor);
  const duplicatedMaintenance =
    duplicatedCost.totalCost -
    duplicatedCost.duplicatedDevCost -
    duplicatedCost.totalBugsCost -
    duplicatedCost.totalSyncCost;

  // What copying the feature keeps costing you, biggest first
  const hiddenCosts = [
    { label: 'Fixing the same bugs in each copy', value: duplicatedCost.totalBugsCost },
    { label: 'Keeping the copies in sync', value: duplicatedCost.totalSyncCost },
    { label: 'Porting it to the second app', value: portingCost },
    { label: 'Maintaining two copies', value: duplicatedMaintenance },
  ].sort((a, b) => b.value - a.value);
  const maxHidden = Math.max(...hiddenCosts.map((c) => c.value), 1);

  const rows: BreakdownRowData[] = [
    { category: 'Initial development', sharedCost: sharedCost.initialDevCost, duplicatedCost: duplicatedCost.duplicatedDevCost },
    { category: 'Library setup', sharedCost: sharedCost.libSetupCost, duplicatedCost: null },
    { category: `Maintenance (${horizonYears} y)`, sharedCost: sharedCost.annualMaintenanceCost * horizonYears, duplicatedCost: duplicatedMaintenance },
    { category: `Coordination between teams (${horizonYears} y)`, sharedCost: sharedCost.annualCoordinationCost * horizonYears, duplicatedCost: null },
    { category: `Onboarding on the library (${horizonYears} y)`, sharedCost: sharedCost.annualOnboardingCost * horizonYears, duplicatedCost: null },
    { category: 'Bugs fixed twice', sharedCost: null, duplicatedCost: duplicatedCost.totalBugsCost },
    { category: 'Syncing copies that drift', sharedCost: null, duplicatedCost: duplicatedCost.totalSyncCost },
  ];
  const dash = '—';

  return (
    <div className="space-y-7">
      <CostChart
        sharedYearly={sharedCost.yearlyBreakdown}
        duplicatedYearly={duplicatedCost.yearlyBreakdown}
        breakEven={breakEven}
        horizonYears={horizonYears}
      />

      <section aria-labelledby="hidden-costs-heading">
        <h2 id="hidden-costs-heading" className="font-sign text-[20px] font-bold uppercase tracking-[0.06em]">
          What copying keeps costing you
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Over {horizonYears === 1 ? '1 year' : `${horizonYears} years`}, biggest first.</p>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {hiddenCosts.map((c) => (
            <li key={c.label} className="rounded-md border border-border bg-card px-4 py-3">
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <p className="mt-0.5 font-sign text-[28px] font-bold leading-tight">{formatEuro(c.value)}</p>
              <div className="mt-2 h-2 rounded-sm bg-muted" aria-hidden="true">
                <div className="h-full rounded-sm" style={{ background: 'repeating-linear-gradient(135deg, var(--hazard) 0 4px, #f3c9c6 4px 7px)', width: `${Math.max(4, (c.value / maxHidden) * 100)}%` }} />
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="breakdown-heading">
        <h2 id="breakdown-heading" className="font-sign text-[20px] font-bold uppercase tracking-[0.06em]">
          Full breakdown
        </h2>
        <div className="mt-3 rounded-md border border-border bg-card sm:px-2 text-[13px] sm:text-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-normal">Cost item</TableHead>
                <TableHead className="text-right">Shared</TableHead>
                <TableHead className="text-right">Duplicated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.category}>
                  <TableCell className="whitespace-normal">{row.category}</TableCell>
                  <TableCell className="text-right">{row.sharedCost !== null ? formatEuro(row.sharedCost) : dash}</TableCell>
                  <TableCell className="text-right">{row.duplicatedCost !== null ? formatEuro(row.duplicatedCost) : dash}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="font-semibold">Total</TableCell>
                <TableCell className="text-right font-semibold text-panel">{formatEuro(sharedCost.totalCost)}</TableCell>
                <TableCell className="text-right font-semibold text-hazard">{formatEuro(duplicatedCost.totalCost)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </section>
    </div>
  );
}
