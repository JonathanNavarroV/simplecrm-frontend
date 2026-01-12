import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isWithinInterval,
  format as dfFormat,
  parseISO,
  isValid,
} from 'date-fns';

export type DateCell = Date | null;

export function toDateOnly(d: Date | string | null): Date | null {
  if (!d) return null;
  const dt = typeof d === 'string' ? parseISO(d) : d;
  if (!isValid(dt)) return null;
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
}

export function getMonthMatrix(monthRef: Date | string, weekStartsOn = 0): DateCell[][] {
  const ref = toDateOnly(
    typeof monthRef === 'string' ? parseISO(monthRef) : (monthRef as Date),
  ) as Date;
  const start = startOfWeek(startOfMonth(ref), { weekStartsOn });
  const end = endOfWeek(endOfMonth(ref), { weekStartsOn });

  const days: Date[] = [];
  let cursor = start;
  while (cursor <= end) {
    days.push(new Date(cursor));
    cursor = addDays(cursor, 1);
  }

  const weeks: DateCell[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

export function isSameDate(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return isSameDay(a, b);
}

export function isInRange(day: Date | null, start: Date | null, end: Date | null): boolean {
  if (!day || !start || !end) return false;
  return isWithinInterval(day, { start, end });
}

export function formatDate(d: Date | null, fmt = 'yyyy-MM-dd'): string {
  if (!d) return '';
  return dfFormat(d, fmt);
}
