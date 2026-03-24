/**
 * @file ComparisonTab.tsx
 * @author Guillaume Gautier (xeewi)
 * @created 2026-03-23
 * @project Feature Cost Calculator
 */

import { BarChart2 } from 'lucide-react';
import { CostChart } from '@/components/CostChart';
import { EmptyState } from '@/components/EmptyState';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
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
  standaloneTotalCost: number;
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
  standaloneTotalCost,
  emptyReason,
}: ComparisonTabProps) {
  // Empty state — show when inputs are missing
  if (emptyReason !== null || sharedCost === null || duplicatedCost === null || breakEven === null) {
    return (
      <EmptyState
        icon={BarChart2}
        title="Configure your team and feature size to compare approaches"
        description="Add at least one team member and set a feature size to see the shared vs duplicated cost comparison."
      />
    );
  }

  const savings = duplicatedCost.totalCost - sharedCost.totalCost;
  const sharedWins = savings > 0;

  const rows: BreakdownRowData[] = [
    {
      category: 'Initial Development',
      sharedCost: sharedCost.initialDevCost,
      duplicatedCost: duplicatedCost.duplicatedDevCost,
    },
    {
      category: 'Library Setup',
      sharedCost: sharedCost.libSetupCost,
      duplicatedCost: null,
    },
    {
      category: `Maintenance (${horizonYears}y)`,
      sharedCost: sharedCost.annualMaintenanceCost * horizonYears,
      duplicatedCost:
        duplicatedCost.totalCost -
        duplicatedCost.duplicatedDevCost -
        duplicatedCost.totalBugsCost -
        duplicatedCost.totalSyncCost,
    },
    {
      category: `Coordination (${horizonYears}y)`,
      sharedCost: sharedCost.annualCoordinationCost * horizonYears,
      duplicatedCost: null,
    },
    {
      category: `Onboarding (${horizonYears}y)`,
      sharedCost: sharedCost.annualOnboardingCost * horizonYears,
      duplicatedCost: null,
    },
    {
      category: 'Bug Propagation',
      sharedCost: null,
      duplicatedCost: duplicatedCost.totalBugsCost,
    },
    {
      category: 'Sync/Divergence',
      sharedCost: null,
      duplicatedCost: duplicatedCost.totalSyncCost,
    },
  ];

  const dash = '\u2014';

  return (
    <div className="space-y-6">
      {/* Standalone reference badge (D-04) */}
      <div>
        <Badge variant="outline">Standalone: {formatEuro(standaloneTotalCost)}</Badge>
      </div>

      {/* Summary cards (D-06) */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-l-4 border-l-green-600">
          <CardContent className="py-4">
            <p className="text-xl font-semibold">Shared Path</p>
            <p className="text-[28px] font-semibold leading-tight mt-1">
              {formatEuro(sharedCost.totalCost)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-600">
          <CardContent className="py-4">
            <p className="text-xl font-semibold">Duplicated Path</p>
            <p className="text-[28px] font-semibold leading-tight mt-1">
              {formatEuro(duplicatedCost.totalCost)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Delta/savings */}
      <p className={`text-sm font-medium ${sharedWins ? 'text-green-700' : 'text-amber-700'}`}>
        {sharedWins
          ? `You save ${formatEuro(savings)}`
          : `Shared costs more by ${formatEuro(Math.abs(savings))}`}
      </p>

      {/* Break-even callout (D-07) */}
      {breakEven.exists ? (
        <div className="rounded-md bg-green-50 border border-green-200 text-green-800 px-4 py-3 text-sm">
          Break-even at {Math.round(breakEven.months!)} months &mdash; you save{' '}
          {formatEuro(savings)} over {horizonYears} years
        </div>
      ) : (
        <div className="rounded-md bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm">
          No break-even within {horizonYears} years &mdash; shared code costs more in this
          scenario. Try increasing the number of consuming teams or extending the time horizon.
        </div>
      )}

      {/* Chart (D-08 — hero element) */}
      <CostChart
        sharedYearly={sharedCost.yearlyBreakdown}
        duplicatedYearly={duplicatedCost.yearlyBreakdown}
        breakEven={breakEven}
        horizonYears={horizonYears}
      />

      {/* Side-by-side breakdown table (D-09) */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Shared Cost</TableHead>
            <TableHead className="text-right">Duplicated Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.category}>
              <TableCell>{row.category}</TableCell>
              <TableCell className="text-right">
                {row.sharedCost !== null ? formatEuro(row.sharedCost) : dash}
              </TableCell>
              <TableCell className="text-right">
                {row.duplicatedCost !== null ? formatEuro(row.duplicatedCost) : dash}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="font-semibold">Total</TableCell>
            <TableCell className="text-right font-semibold">
              {formatEuro(sharedCost.totalCost)}
            </TableCell>
            <TableCell className="text-right font-semibold">
              {formatEuro(duplicatedCost.totalCost)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
