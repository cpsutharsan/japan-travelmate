import Link from 'next/link'
import { notFound } from 'next/navigation'
import { activitiesFor, hotelForNight, hotelsForNight } from '@/lib/select'
import { fmtLong } from '@/lib/date'
import { RESTAURANTS, TRAINS, TRIP } from '@/lib/trip'
import { tripDateISO } from '@/lib/date'

export function generateStaticParams() {
  return Array.from({ length: TRIP.totalDays }, (_, i) => ({ date: tripDateISO(i + 1) }))
}

export default function DayPage({ params }: { params: { date: string } }) {
  const date = params.date
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound()
  const activities = activitiesFor(date)
  const hotel = hotelForNight(date)
  const allHotels = hotelsForNight(date)
  const baseHotel = allHotels.find(h => h.id !== hotel?.id) ?? null

  return (
    <div className="px-5 py-3 space-y-4">
      <Link href="/itinerary" className="text-sm text-ink/60">← All days</Link>
      <h1 className="h-display text-2xl">{fmtLong(date)}</h1>

      {hotel && (
        <section className="card card-bordered-indigo">
          <p className="text-xs uppercase tracking-widest text-ink/50">Sleeping tonight</p>
          <p className="font-medium mt-0.5">{hotel.name}</p>
          <p className="jp text-sm">{hotel.addressJa}</p>
          <p className="text-xs text-ink/55">{hotel.addressEn}</p>
          {baseHotel && (
            <p className="text-xs text-ink/55 mt-2 border-t border-black/5 pt-2">
              🧳 Base (luggage stays here): <span className="font-medium text-ink/80">{baseHotel.name}</span> — still checked in {baseHotel.checkIn.slice(8)}–{baseHotel.checkOut.slice(8)} May.
            </p>
          )}
        </section>
      )}

      <section className="card">
        <p className="text-xs uppercase tracking-widest text-ink/50 mb-2">Schedule</p>
        {activities.length === 0 ? (
          <p className="text-sm text-ink/55">Nothing planned yet.</p>
        ) : (
          <ul className="space-y-3">
            {activities.map((a, i) => {
              const train = a.ref ? TRAINS.find(t => t.id === a.ref) : null
              const rest = a.ref ? RESTAURANTS.find(r => r.id === a.ref) : null
              return (
                <li key={i} className="flex gap-3">
                  <span className="font-mono text-ink/50 w-14 shrink-0">{a.time ?? '—'}</span>
                  <div className="flex-1">
                    <p className="text-sm">{a.title}</p>
                    <p className="text-xs text-ink/50">{a.city}{a.notes ? ` · ${a.notes}` : ''}</p>
                    {train && (
                      <p className="text-[11px] text-ink/55 mt-0.5">{train.car} · {train.seats}</p>
                    )}
                    {rest && rest.addressJa && (
                      <p className="jp text-[11px] text-ink/55 mt-0.5">{rest.addressJa}</p>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
