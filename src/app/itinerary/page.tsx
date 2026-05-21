import Link from 'next/link'
import { TRIP } from '@/lib/trip'
import { hotelForNight, activitiesFor, todayISO } from '@/lib/select'
import { fmtShort, tripDateISO } from '@/lib/date'

export default function ItineraryPage() {
  const today = todayISO()
  const days = Array.from({ length: TRIP.totalDays }, (_, i) => tripDateISO(i + 1))

  return (
    <div className="px-5 py-3 space-y-4">
      <h1 className="h-display text-2xl">Itinerary</h1>
      <p className="text-sm text-ink/60">Swipe or tap any day. &ldquo;Today&rdquo; is highlighted.</p>

      <ul className="space-y-3">
        {days.map((d, i) => {
          const h = hotelForNight(d)
          const a = activitiesFor(d)
          const isToday = d === today
          return (
            <li key={d}>
              <Link
                href={`/itinerary/${d}`}
                className={`card flex items-start gap-3 ${isToday ? 'ring-2 ring-vermilion' : ''}`}
              >
                <div className="w-12 shrink-0">
                  <p className="text-[10px] uppercase tracking-widest text-ink/40">Day</p>
                  <p className="h-display text-2xl leading-none">{i + 1}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{fmtShort(d)}</p>
                  <p className="text-xs text-ink/55 mt-0.5">
                    {h ? `Sleeping: ${h.name} (${h.city})` : 'Travel day'}
                  </p>
                  <p className="text-xs text-ink/70 mt-1 line-clamp-2">
                    {a.slice(0, 3).map(x => x.title).join(' · ') || 'No activities yet'}
                  </p>
                </div>
                {isToday && <span className="pill !bg-vermilion !text-white">Today</span>}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
