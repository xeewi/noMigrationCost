/**
 * @file CostOutput.tsx
 * @author Guillaume Gautier (xeewi)
 * @created 2026-03-23
 * @project Feature Cost Calculator
 */

import { Calculator } from 'lucide-react';
import { formatEuro } from '@/lib/utils';
import { EmptyState } from '@/components/EmptyState';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { StandaloneOutputs } from '@/engine/types';

interface CostOutputProps {
  output: StandaloneOutputs | null;
  emptyReason?: 'zero-team' | 'zero-hours' | null;
}

export function CostOutput({ output, emptyReason = null }: CostOutputProps) {
  if (output === null) {
    const description = emptyReason === 'zero-hours'
      ? 'Enter a feature size to see cost estimates. Set story points or direct hours above.'
      : 'Add at least one team member to see cost estimates. Set headcount to 1 or more for any seniority level.';
    return (
      <EmptyState
        icon={Calculator}
        title="Configure your team and feature size to estimate costs"
        description={description}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Standalone Feature Cost</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {/* Summary */}
            <div className="space-y-1">
              <p className="text-sm font-semibold text-muted-foreground">
                Total standalone cost
              </p>
              <p className="text-3xl font-semibold text-foreground">
                {formatEuro(output.totalStandaloneCost)}
              </p>
            </div>

            <Separator />

            {/* Breakdown table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {output.breakdown.map((row) => (
                  <TableRow key={row.category}>
                    <TableCell>{row.category}</TableCell>
                    <TableCell className="text-right">
                      {row.hours > 0 ? Math.round(row.hours) : '\u2014'}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatEuro(row.cost)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">
                        {Math.round(row.percentage)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell className="font-semibold">Total</TableCell>
                  <TableCell className="text-right font-semibold">
                    {Math.round(output.initialDevHours)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatEuro(output.totalStandaloneCost)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">100%</Badge>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
      </CardContent>
    </Card>
  );
}
