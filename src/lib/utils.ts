/**
 * @file utils.ts
 * @author Guillaume Gautier (xeewi)
 * @created 2026-03-23
 * @project Feature Cost Calculator
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1).replace('.', ',')} M€`;
  if (amount >= 1_000) return `${Math.round(amount / 1_000)} k€`;
  return `${Math.round(amount)} €`;
}
