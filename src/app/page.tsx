import Link from 'next/link'
import { activitiesFor, hotelForNight, hotelsForNight, nextActivity, todayISO } from '@/lib/select'
import { fmtLong } from '@/lib/date'
import { tripDayNumber } from '@/lib/date'
import { CopyChip } from '@/components/CopyChip'
import { Countdown } from '@/components/Countdown'
import { FamilyAvatars } from '@/components/FamilyAvatars'
import { SmartPrompts } from '@/components/SmartPrompts'
import { InstallPrompt } from '@/components/InstallPrompt'
import { TRIP } from '@/lib/trip'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  const today = todayISO()
  const day = tripDayNumber()
  const dayLabel =
    day < 1 ? `${Math.abs(day - 1)} days until departure` :
    day > TRIP.totalDays ? 'Trip complete' :
    `Day ${day} of ${TRIP.totalDays}`

  const hotel = hotelForNight(today)
  const allHotels = hotelsForNight(today)
  const baseHotel = allHotels.find(h => h.id !== hotel?.id) ?? null
  const upcoming = nextActivity(today)
  const todays = activitiesFor(today)
  const meals = todays.filter(a => a.kind === 'meal')

  return (
    <div className="px-5 pt-2 pb-6 space-y-4">
      <InstallPrompt />

      {/* Family strip */}
      <div className="flex items-center justify-between">
        <FamilyAvatars />
        <Link href="/family" className="text-xs text-ink/60 underline">Profiles</Link>
      </div>

      {/* Header card */}
      <div className="card watermark-torii">
        <p className="text-xs uppercase tracking-widest text-vermilion">{dayLabel}</p>
        <h1 className="h-display text-2xl mt-1">{fmtLong(today)}</h1>
        <p className="text-sm text-ink/60 mt-1">
          {hotel ? `Tonight: ${hotel.city}` : 'No hotel scheduled for tonight'}
        </p>
      </div>

      {/* Tonight's hotel */}
      {hotel && (
        <section className="card card-bordered-indigo space-y-2">
          <header className="flex items-center justify-between">
            <h2 className="text-sm uppercase tracking-widest text-ink/50">Tonight you sleep at</h2>
            <CopyChip text={hotel.addressJa} label="Copy JP" />
          </header>
          <p className="h-display text-lg">{hotel.name}</p>
          <p className="text-sm jp text-ink/80">{hotel.addressJa}</p>
          <p className="text-xs text-ink/50">{hotel.addressEn}</p>
          {hotel.notes && <p className="text-xs text-ink/60 italic">{hotel.notes}</p>}
          {baseHotel && (
            <p className="text-xs text-ink/55 mt-1 border-t border-black/5 pt-2">
              🧳 Base hotel (luggage): <span className="font-medium text-ink/80">{baseHotel.name}</span>
            </p>
          )}
          <div className="flex gap-2 pt-1">
            <Link href={`/taxi?to=${hotel.id}`} className="btn-outline text-xs">🚕 Take me here</Link>
            <a className="btn-outline text-xs"
               href={`https://maps.google.com/?q=${encodeURIComponent(hotel.addressJa)}`}
               target="_blank" rel="noreferrer">Open in Maps</a>
          </div>
        </section>
      )}

      {/* Next activity */}
      {upcoming && (
        <section className="card card-bordered-vermilion">
          <h2 className="text-sm uppercase tracking-widest text-ink/50 mb-1">Next up</h2>
          <p className="h-display text-lg">{upcoming.title}</p>
          <p className="text-sm text-ink/60 mt-0.5">{upcoming.city}{upcoming.time ? ` · ${upcoming.time}` : ''}</p>
          {upcoming.time && (
            <p className="text-sm mt-2">
              <Countdown dateISO={today} hhmm={upcoming.time} />
            </p>
          )}
        </section>
      )}

      {/* Big buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/vegetarian-card" className="btn-primary !min-h-[64px] !text-base">
          🍵 Show veg card
        </Link>
        <Link href="/emergency" className="btn-vermilion !min-h-[64px] !text-base">
          🆘 I&rsquo;m lost
        </Link>
      </div>

      {/* Smart adjuster */}
      <SmartPrompts />

      {/* Meals & schedule */}
      {meals.length > 0 && (
        <section className="card card-bordered-sage">
          <h2 className="text-sm uppercase tracking-widest text-ink/50 mb-2">Today&rsquo;s meals</h2>
          <ul className="space-y-1 text-sm">
            {meals.map((m, i) => (
              <li key={i} className="flex justify-between">
                <span>{m.title}</span>
                <span className="text-ink/50">{m.time ?? ''}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {todays.length > 0 && (
        <section className="card">
          <h2 className="text-sm uppercase tracking-widest text-ink/50 mb-2">Schedule</h2>
          <ul className="space-y-2 text-sm">
            {todays.map((a, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-mono text-ink/50 w-14 shrink-0">{a.time ?? '—'}</span>
                <span className="flex-1">{a.title}<span className="block text-xs text-ink/45">{a.city}</span></span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Quick stats / shortcuts */}
      <div className="grid grid-cols-3 gap-3">
        <Link href="/expenses"   className="card text-center text-sm">💴<span className="block mt-1 text-xs text-ink/60">Expenses</span></Link>
        <Link href="/converter"  className="card text-center text-sm">¥⇄د.إ<span className="block mt-1 text-xs text-ink/60">Converter</span></Link>
        <Link href="/phrasebook" className="card text-center text-sm">🗣️<span className="block mt-1 text-xs text-ink/60">Phrases</span></Link>
        <Link href="/restaurants" className="card text-center text-sm">🍱<span className="block mt-1 text-xs text-ink/60">Veg spots</span></Link>
        <Link href="/checklists"  className="card text-center text-sm">✅<span className="block mt-1 text-xs text-ink/60">Checklists</span></Link>
        <Link href="/status"      className="card text-center text-sm">📋<span className="block mt-1 text-xs text-ink/60">Status</span></Link>
      </div>

      <p className="text-center text-[11px] text-ink/40 pt-2">
        Trip 22 – 30 May 2026 · Budget AED {TRIP.budgetAED.toLocaleString()}
      </p>
    </div>
  )
}
