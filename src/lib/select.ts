/**
 * Pure selectors over the static trip data — same logic on server and client.
 */

import { ACTIVITIES, HOTELS, type Activity, type Hotel, TRIP } from './trip'
import { isToday, todayJST, tripDateISO, tripDayNumber } from './date'
import { differenceInMinutes, parse } from 'date-fns'

export function hotelForNight(dateISO: string): Hotel | null {
  // The hotel where you SLEEP that night is the one whose [checkIn, checkOut)
  // interval contains dateISO. Two bookings can overlap (e.g. on 24 May we sleep
  // at Disney Celebration but Minn Ueno is also reserved for luggage) — in that
  // case the SHORTER stay wins, since that's where we're actually sleeping.
  const candidates = HOTELS.filter(h => dateISO >= h.checkIn && dateISO < h.checkOut)
  if (candidates.length === 0) return null
  return candidates.reduce((best, h) => {
    const len = (d1: string, d2: string) => Math.abs(new Date(d2).getTime() - new Date(d1).getTime())
    return len(best.checkIn, best.checkOut) <= len(h.checkIn, h.checkOut) ? best : h
  })
}

export function activitiesFor(dateISO: string): Activity[] {
  return ACTIVITIES.filter(a => a.date === dateISO)
}

export function nextActivity(dateISO: string, nowHHMM?: string): Activity | null {
  const todays = activitiesFor(dateISO).filter(a => a.time)
  if (todays.length === 0) return null
  if (!nowHHMM) return todays[0]
  // Pick the first activity whose time is still in the future (or now)
  return todays.find(a => (a.time || '99:99') >= nowHHMM) ?? null
}

export function minutesUntil(dateISO: string, hhmm: string, fromJst: Date = todayJST()): number {
  // Hour-of-day is treated in JST. We approximate by stitching the trip date with the
  // supplied time, and comparing against fromJst which is already a JST midnight.
  const now = new Date()
  const jstNow = new Date(now.getTime() + (9 * 60 + now.getTimezoneOffset()) * 60_000)
  const target = parse(`${dateISO} ${hhmm}`, 'yyyy-MM-dd HH:mm', jstNow)
  return differenceInMinutes(target, jstNow)
}

export function currentJstHHMM(): string {
  const now = new Date()
  const jst = new Date(now.getTime() + (9 * 60 + now.getTimezoneOffset()) * 60_000)
  return jst.toISOString().slice(11, 16) // HH:MM
}

export function todayISO(): string {
  // If "today" is outside the trip, anchor to the trip start so the home page
  // is useful before departure.
  const n = tripDayNumber()
  if (n < 1) return TRIP.start
  if (n > TRIP.totalDays) return tripDateISO(TRIP.totalDays)
  return tripDateISO(n)
}

export { isToday }
