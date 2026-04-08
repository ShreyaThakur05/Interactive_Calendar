import { MONTH_NAMES } from './constants';

/** "YYYY-MM-DD" with no timezone shift */
export function toISO(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Grid cells for a month: leading nulls + day numbers */
export function buildMonthGrid(year: number, month: number): (number | null)[] {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7; // Mon = 0
  const total  = new Date(year, month + 1, 0).getDate();
  return [
    ...Array<null>(offset).fill(null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ];
}

/** "Jan 5" */
export function shortDate(iso: string): string {
  const [, m, d] = iso.split('-');
  return `${MONTH_NAMES[+m - 1].slice(0, 3)} ${+d}`;
}

/** Is dateStr strictly between start and end (order-independent)? */
export function isBetween(d: string, a: string | null, b: string | null): boolean {
  if (!a || !b) return false;
  const [lo, hi] = a <= b ? [a, b] : [b, a];
  return d > lo && d < hi;
}

/** Is dateStr the lower bound of the range? */
export function isRangeStart(d: string, a: string | null, b: string | null): boolean {
  if (!a) return false;
  if (!b) return d === a;
  return (a <= b ? a : b) === d;
}

/** Is dateStr the upper bound of the range? */
export function isRangeEnd(d: string, a: string | null, b: string | null): boolean {
  if (!a || !b) return false;
  return (a <= b ? b : a) === d;
}
