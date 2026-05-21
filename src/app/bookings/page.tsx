import Link from 'next/link'
import { FLIGHTS, HOTELS, TICKETS, TRAINS } from '@/lib/trip'
import { fmtShort } from '@/lib/date'

export default function BookingsPage() {
  return (
    <div className="px-5 py-3 space-y-4">
      <h1 className="h-display text-2xl">Bookings vault</h1>
      <p className="text-sm text-ink/60">All confirmed items. Tap any row for the full card with PINs and QR codes.</p>

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
          <Link key={h.id} href={`/bookings/hotel/${h.id}`} className="card card-bordered-sage">
            <div className="flex justify-between">
              <div>
                <p className="font-medium">{h.name}</p>
                <p className="text-xs text-ink/60">{h.city} · {fmtShort(h.checkIn)} → {fmtShort(h.checkOut)}</p>
              </div>
              <span className="pill self-center">{h.city}</span>
            </div>
            {h.confirmation && <p className="font-mono text-[11px] text-ink/55 mt-1">#{h.confirmation}</p>}
          </Link>
        ))}
      </section>

      <section className="space-y-2">
        <h2 className="text-xs uppercase tracking-widest text-ink/50">Shinkansen</h2>
        {TRAINS.map(t => (
          <Link key={t.id} href={`/bookings/train/${t.id}`} className="card card-bordered-vermilion">
            <div className="flex justify-between">
              <div>
                <p className="font-medium">{t.name}</p>
                <p className="text-xs text-ink/60">{t.from} → {t.to} · {fmtShort(t.date)} · {t.depart}–{t.arrive}</p>
              </div>
              <p className="text-[11px] text-ink/55 self-center">{t.car}</p>
            </div>
            {t.reservation && <p className="font-mono text-[11px] text-ink/55 mt-1">Res {t.reservation}</p>}
          </Link>
        ))}
      </section>

      <section className="space-y-2">
        <h2 className="text-xs uppercase tracking-widest text-ink/50">Tickets</h2>
        {TICKETS.map(t => (
          <Link key={t.id} href={`/bookings/ticket/${t.id}`} className="card card-bordered-gold">
            <div className="flex justify-between">
              <div>
                <p className="font-medium">{t.title}</p>
                <p className="text-xs text-ink/60">{fmtShort(t.date)}{t.time ? ` · ${t.time}` : ''}</p>
              </div>
              {t.reservation && <p className="font-mono text-[11px] text-ink/55 self-center">#{t.reservation}</p>}
            </div>
          </Link>
        ))}
      </section>

      <section className="space-y-2">
        <h2 className="text-xs uppercase tracking-widest text-ink/50">Documents &amp; Files</h2>
        <Link href="/documents" className="card card-bordered-gold block">
          <p className="font-medium">Passports, visas, Emirates IDs, certificates</p>
          <p className="text-xs text-ink/60">Per family member, stored privately in Supabase Storage</p>
        </Link>
        <Link href="/bookings/files" className="card card-bordered-gold block">
          <p className="font-medium">Booking PDFs &amp; images</p>
          <p className="text-xs text-ink/60">Upload anything else to Supabase Storage</p>
        </Link>
      </section>
    </div>
  )
}
