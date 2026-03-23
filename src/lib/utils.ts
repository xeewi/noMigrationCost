import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { YearCost } from '@/engine/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEuro(amount: number): string {
  if (!isFinite(amount) || isNaN(amount)) return '\u2014';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a euro amount with K/M abbreviation for compact display.
 * Used in chart axis labels, tooltips, and summary tiles (D-14, Research Pattern 5).
 *
 * Examples:
 *   formatEuroAbbrev(500)     => "\u20AC500"
 *   formatEuroAbbrev(42000)   => "\u20AC42K"
 *   formatEuroAbbrev(1500000) => "\u20AC1.5M"
 */
export function formatEuroAbbrev(amount: number): string {
  if (!isFinite(amount) || isNaN(amount)) return '\u2014';
  if (amount >= 1_000_000) return `\u20AC${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `\u20AC${Math.round(amount / 1_000)}K`;
  return `\u20AC${Math.round(amount)}`;
}

/**
 * Monthly data point for the cost comparison chart.
 * Produced by buildMonthlyChartData for the Recharts LineChart.
 */
export interface MonthCostPoint {
  month: number;       // 1..horizonYears*12
  shared: number;      // cumulative shared cost at this month
  duplicated: number;  // cumulative duplicated cost at this month
}

/**
 * Interpolates yearly cumulative cost arrays into monthly data points.
 * Uses linear interpolation between year boundaries (D-13, Research Pattern 1).
 *
 * @param sharedYearly     - YearCost[] from calcSharedCost, including year 0
 * @param duplicatedYearly - YearCost[] from calcDuplicatedCost, including year 0
 * @returns MonthCostPoint[] with month 1..N*12
 */
export function buildMonthlyChartData(
  sharedYearly: YearCost[],
  duplicatedYearly: YearCost[],
): MonthCostPoint[] {
  const points: MonthCostPoint[] = [];
  for (let yi = 1; yi < sharedYearly.length; yi++) {
    const s0 = sharedYearly[yi - 1].cumulativeCost;
    const s1 = sharedYearly[yi].cumulativeCost;
    const d0 = duplicatedYearly[yi - 1].cumulativeCost;
    const d1 = duplicatedYearly[yi].cumulativeCost;
    for (let m = 1; m <= 12; m++) {
      const frac = m / 12;
      points.push({
        month: (yi - 1) * 12 + m,
        shared: s0 + (s1 - s0) * frac,
        duplicated: d0 + (d1 - d0) * frac,
      });
    }
  }
  return points;
}
