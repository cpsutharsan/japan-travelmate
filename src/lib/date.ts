import { differenceInCalendarDays, format, isSameDay, parseISO } from 'date-fns'
import { TRIP } from './trip'

// All trip dates are interpreted in Asia/Tokyo so the app can read "today" sensibly
// from any timezone. We approximate by always treating the supplied date string as a
// floating local date; trip days are 22..30 May 2026.

export function todayJST(): Date {
  // Get UTC now, shift to JST (UTC+9), strip time to midnight in JST.
  const now = new Date()
  const jst = new Date(now.getTime() + (9 * 60 + now.getTimezoneOffset()) * 60_000)
  return new Date(jst.getFullYear(), jst.getMonth(), jst.getDate())
}

export function tripDayNumber(d: Date = todayJST()): number {
  const start = parseISO(TRIP.start)
  const diff = differenceInCalendarDays(d, start) + 1
  return Math.max(0, Math.min(TRIP.totalDays + 1, diff))
}

export function isTripDay(d: Date = todayJST()): boolean {
  const n = tripDayNumber(d)
  return n >= 1 && n <= TRIP.totalDays
}

export function tripDateISO(n: number): string {
  const start = parseISO(TRIP.start)
  const d = new Date(start)
  d.setDate(start.getDate() + (n - 1))
  return format(d, 'yyyy-MM-dd')
}

export function fmtLong(d: Date | string): string {
  const date = typeof d === 'string' ? parseISO(d) : d
  return format(date, 'EEEE d MMMM yyyy')
}

export function fmtShort(d: Date | string): string {
  const date = typeof d === 'string' ? parseISO(d) : d
  return format(date, 'EEE d MMM')
}

export function isToday(iso: string): boolean {
  return isSameDay(parseISO(iso), todayJST())
}
