/**
 * @file CostChart.tsx
 * @author Guillaume Gautier (xeewi)
 * @created 2026-03-23
 * @project Feature Cost Calculator
 */

import { useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { formatEuroAbbrev, formatEuro } from '@/lib/utils';
import type { MonthCostPoint } from '@/engine/types';

const PANEL = '#1f3a93';
const HAZARD = '#c8221b';
const INK = '#14171a';
const SIGNAL = '#f7c600';

interface CostChartProps {
  monthly: MonthCostPoint[];
  breakEvenMonth: number | null;
  horizonYears: number;
}

interface TooltipPayloadItem {
  value: number | number[];
  dataKey: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: number | string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const pick = (key: string) => {
    const v = payload.find((p) => p.dataKey === key)?.value;
    return typeof v === 'number' ? v : 0;
  };
  const shared = pick('shared');
  const duplicated = pick('duplicated');
  const diff = duplicated - shared;

  return (
    <div className="rounded-sm border border-border bg-popover px-3 py-2.5 text-sm shadow-[0_6px_20px_-8px_rgba(20,23,26,0.35)]">
      <p className="font-sign text-[13px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
        {label === 0 ? 'Start' : `Month ${label}`}
      </p>
      <p className="mt-1 flex justify-between gap-6"><span>Shared</span><span className="font-semibold" style={{ color: PANEL }}>{formatEuro(shared)}</span></p>
      <p className="flex justify-between gap-6"><span>Duplicated</span><span className="font-semibold" style={{ color: HAZARD }}>{formatEuro(duplicated)}</span></p>
      <p className="mt-1 flex justify-between gap-6 border-t border-border pt-1">
        <span>{diff >= 0 ? 'Extra cost of copies' : 'Extra cost of sharing'}</span>
        <span className="font-semibold">{formatEuro(Math.abs(diff))}</span>
      </p>
    </div>
  );
}

function BreakEvenFlag({ viewBox, months }: { viewBox?: { x: number; y: number }; months: number }) {
  if (!viewBox) return null;
  const text = `BREAK-EVEN · ${months} MO`;
  const width = text.length * 7.4 + 16;
  return (
    <g transform={`translate(${viewBox.x + 6}, ${viewBox.y + 2})`}>
      <rect width={width} height={22} fill={SIGNAL} rx={2} />
      <text x={8} y={15.5} fill={INK} fontFamily="Barlow Condensed" fontWeight={700} fontSize={13} letterSpacing="0.06em">
        {text}
      </text>
    </g>
  );
}

export function CostChart({
  monthly,
  breakEvenMonth,
  horizonYears,
}: CostChartProps) {
  const data = useMemo(
    () =>
      monthly.map((p) => ({
        ...p,
        // Hatched band only where copies cost more than sharing
        gap: [p.shared, Math.max(p.shared, p.duplicated)] as [number, number],
      })),
    [monthly],
  );

  const ticks = useMemo(() => {
    const interval = horizonYears >= 3 ? 12 : 3;
    const result: number[] = [];
    for (let m = interval; m <= horizonYears * 12; m += interval) result.push(m);
    return result;
  }, [horizonYears]);

  return (
    <figure className="rounded-md border border-border bg-card px-4 pt-4 pb-2 sm:px-5">
      <figcaption className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <span className="font-sign text-[17px] font-bold uppercase tracking-[0.08em]">Cumulative cost</span>
        <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><i className="inline-block h-[3px] w-4" style={{ background: PANEL }} />Shared</span>
          <span className="inline-flex items-center gap-1.5"><i className="inline-block h-[3px] w-4" style={{ background: HAZARD }} />Duplicated</span>
          <span className="inline-flex items-center gap-1.5">
            <i className="inline-block h-2.5 w-4" style={{ background: `repeating-linear-gradient(135deg, ${HAZARD} 0 3px, transparent 3px 7px)` }} />
            Extra cost of the copies
          </span>
        </span>
      </figcaption>
      <div className="mt-2 h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 8 }}>
            <defs>
              <pattern id="hazard-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="4" height="8" fill={HAZARD} fillOpacity={0.8} />
              </pattern>
            </defs>
            <CartesianGrid vertical={false} stroke="#e3e6eb" />
            <XAxis
              dataKey="month"
              ticks={ticks}
              tickFormatter={(m: number) => (m % 12 === 0 ? `Year ${m / 12}` : `M${m}`)}
              tick={{ fill: '#4a4f58', fontSize: 12 }}
              axisLine={{ stroke: '#c3c8d1' }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatEuroAbbrev}
              width={64}
              tick={{ fill: '#4a4f58', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: INK, strokeDasharray: '3 3' }} />
            <Area dataKey="gap" stroke="none" fill="url(#hazard-hatch)" isAnimationActive={false} activeDot={false} />
            <Line type="linear" dataKey="shared" stroke={PANEL} strokeWidth={3} dot={false} isAnimationActive={false} />
            <Line type="linear" dataKey="duplicated" stroke={HAZARD} strokeWidth={3} dot={false} isAnimationActive={false} />
            {breakEvenMonth !== null && breakEvenMonth > 0 && (
              <ReferenceLine
                x={breakEvenMonth}
                stroke={INK}
                strokeDasharray="4 4"
                label={(props: { viewBox?: { x: number; y: number } }) => (
                  <BreakEvenFlag viewBox={props.viewBox} months={breakEvenMonth} />
                )}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}
