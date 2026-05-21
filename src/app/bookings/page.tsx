import Link from 'next/link'
import { FLIGHTS, HOTELS, TRAINS } from '@/lib/trip'
import { fmtShort } from '@/lib/date'

const CATS = [
  { id: 'flights',    label: 'Flights',     color: 'card-bordered-indigo'    },
  { id: 'hotels',     label: 'Hotels',      color: 'card-bordered-sage'      },
  { id: 'trains',     label: 'Shinkansen',  color: 'card-bordered-vermilion' },
  { id: 'tickets',    label: 'Activity tickets',     color: 'card-bordered-gold' },
  { id: 'reservations', label: 'Restaurant reservations', color: 'card-bordered-gold' },
  { id: 'misc',       label: 'Insurance / Other', color: 'card-bordered-sage' },
]

export default function BookingsPage() {
  return (
    <div className="px-5 py-3 space-y-4">
      <h1 className="h-display text-2xl">Bookings vault</h1>
      <p className="text-sm text-ink/60">Pre-loaded with confirmed items. Add PNRs and PDFs.</p>

      <section className="space-y-2">
        <h2 className="text-xs uppercase tracking-widest text-ink/50">Flights</h2>
        {FLIGHTS.map(f => (
          <Link key={f.id} href={`/bookings/flight/${f.id}`} className="card card-bordered-indigo flex justify-between">
            <div>
              <p className="font-medium">{f.airline} {f.number}</p>
              <p className="text-xs text-ink/60">{f.from} → {f.to} · {fmtShort(f.date)} · {f.depart}–{f.arrive}</p>
            </div>
            <p className="font-mono text-xs text-ink/50 self-center">{f.pnr}</p>
          </Link>
        ))}
      </section>

      <section className="space-y-2">
        <h2 className="text-xs uppercase tracking-widest text-ink/50">Hotels</h2>
        {HOTELS.map(h => (
          <Link key={h.id} href={`/bookings/hotel/${h.id}`} className="card card-bordered-sage flex justify-between">
            <div>
              <p className="font-medium">{h.name}</p>
              <p className="text-xs text-ink/60">{h.city} · {fmtShort(h.checkIn)} → {fmtShort(h.checkOut)}</p>
            </div>
            <span className="pill self-center">{h.city}</span>
          </Link>
        ))}
      </section>

      <section className="space-y-2">
        <h2 className="text-xs uppercase tracking-widest text-ink/50">Shinkansen</h2>
        {TRAINS.map(t => (
          <Link key={t.id} href={`/bookings/train/${t.id}`} className="card card-bordered-vermilion flex justify-between">
            <div>
              <p className="font-medium">{t.name}</p>
              <p className="text-xs text-ink/60">{t.from} → {t.to} · {fmtShort(t.date)} · {t.depart}–{t.arrive}</p>
            </div>
            <p className="text-[11px] text-ink/55 self-center">{t.car}</p>
          </Link>
        ))}
      </section>

      <section className="space-y-2">
        <h2 className="text-xs uppercase tracking-widest text-ink/50">Files</h2>
        <Link href="/bookings/files" className="card card-bordered-gold block">
          <p className="font-medium">Booking PDFs &amp; images</p>
          <p className="text-xs text-ink/60">Upload confirmations to Supabase Storage</p>
        </Link>
      </section>

      <div className="pt-2">
        <p className="text-[11px] text-ink/40 text-center">
          Categories: {CATS.map(c => c.label).join(' · ')}
        </p>
      </div>
    </div>
  )
}
