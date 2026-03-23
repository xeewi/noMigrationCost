import { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  Legend,
  CartesianGrid,
} from 'recharts';
import { buildMonthlyChartData, formatEuroAbbrev, formatEuro } from '@/lib/utils';
import type { YearCost, BreakEvenResult } from '@/engine/types';

interface CostChartProps {
  sharedYearly: YearCost[];
  duplicatedYearly: YearCost[];
  breakEven: BreakEvenResult;
  horizonYears: number;
}

interface TooltipPayloadItem {
  value: number;
  name: string;
  dataKey: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: number | string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const shared = payload.find((p) => p.dataKey === 'shared')?.value ?? 0;
  const duplicated = payload.find((p) => p.dataKey === 'duplicated')?.value ?? 0;
  const diff = Math.abs(duplicated - shared);
  const sharedWins = shared < duplicated;

  return (
    <div className="bg-popover border border-border rounded-md shadow-md p-3 text-sm">
      <p className="font-semibold mb-1">Month {label}</p>
      <p style={{ color: '#16a34a' }}>Shared: {formatEuro(shared)}</p>
      <p style={{ color: '#dc2626' }}>Duplicated: {formatEuro(duplicated)}</p>
      <p style={{ color: sharedWins ? '#15803d' : '#b45309' }}>
        Difference: {formatEuro(diff)}
      </p>
    </div>
  );
}

export function CostChart({
  sharedYearly,
  duplicatedYearly,
  breakEven,
  horizonYears,
}: CostChartProps) {
  const data = useMemo(
    () => buildMonthlyChartData(sharedYearly, duplicatedYearly),
    [sharedYearly, duplicatedYearly],
  );

  // Generate X-axis ticks: every 12 months for >= 3-year horizon, every 6 months for 1-year
  const ticks = useMemo(() => {
    const interval = horizonYears >= 3 ? 12 : 6;
    const result: number[] = [];
    for (let m = interval; m <= horizonYears * 12; m += interval) {
      result.push(m);
    }
    return result;
  }, [horizonYears]);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 16, right: 16, left: 8, bottom: 24 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="month"
          ticks={ticks}
          label={{ value: 'Month', position: 'insideBottom', offset: -4 }}
        />
        <YAxis tickFormatter={formatEuroAbbrev} width={60} />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" align="right" />
        {breakEven.exists && breakEven.months !== null && (
          <ReferenceLine
            x={Math.round(breakEven.months)}
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{ value: 'Break-even', position: 'top', fontSize: 11 }}
          />
        )}
        <Area
          type="monotone"
          dataKey="shared"
          name="Shared Path"
          stroke="#16a34a"
          fill="#16a34a"
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="duplicated"
          name="Duplicated Path"
          stroke="#dc2626"
          fill="#dc2626"
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
