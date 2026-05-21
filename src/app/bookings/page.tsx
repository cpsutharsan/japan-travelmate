import Link from 'next/link'
import { FLIGHTS, HOTELS, TICKETS, TRAINS } from '@/lib/trip'
import { fmtShort } from '@/lib/date'

export default function BookingsPage() {
  return (
    <div className="px-5 py-3 space-y-6 pb-12">
      <header>
        <h1 className="h-display text-2xl">Bookings vault</h1>
        <p className="text-sm text-ink/60 mt-1">Tap any card for the full booking with PINs and QR codes.</p>
      </header>

      <Section accent="indigo" icon="✈️" label="Flights">
        {FLIGHTS.map(f => (
          <BookingCard key={f.id} href={`/bookings/flight/${f.id}`}
            title={`${f.airline} ${f.number}`}
            subtitle={`${f.from} → ${f.to}`}
            line2={`${fmtShort(f.date)} · ${f.depart}–${f.arrive}`}
            badge={f.pnr} />
        ))}
      </Section>

      <Section accent="sage" icon="🏨" label="Hotels">
        {HOTELS.map(h => (
          <BookingCard key={h.id} href={`/bookings/hotel/${h.id}`}
            title={h.name}
            subtitle={`${h.city} · ${fmtShort(h.checkIn)} → ${fmtShort(h.checkOut)}`}
            line2={h.confirmation ? `#${h.confirmation}${h.pin ? ` · PIN ${h.pin}` : ''}` : undefined}
            badge={h.city} />
        ))}
      </Section>

      <Section accent="vermilion" icon="🚄" label="Shinkansen">
        {TRAINS.map(t => (
          <BookingCard key={t.id} href={`/bookings/train/${t.id}`}
            title={t.name}
            subtitle={`${t.from} → ${t.to}`}
            line2={`${fmtShort(t.date)} · ${t.depart}–${t.arrive} · ${t.car}`}
            badge={t.reservation ? `Res ${t.reservation}` : undefined} />
        ))}
      </Section>

      <Section accent="gold" icon="🎟️" label="Tickets">
        {TICKETS.map(t => (
          <BookingCard key={t.id} href={`/bookings/ticket/${t.id}`}
            title={t.title}
            subtitle={`${fmtShort(t.date)}${t.time ? ` · ${t.time}` : ''}`}
            line2={t.perPersonIds?.length ? `${t.perPersonIds.length} tickets` : undefined}
            badge={t.reservation ? `#${t.reservation}` : undefined} />
        ))}
      </Section>

      <Section accent="gold" icon="📁" label="Documents & files">
        <BookingCard href="/documents"
          title="Passports, visas, Emirates IDs"
          subtitle="Per family member, stored privately in Supabase"
          badge="Open" />
        <BookingCard href="/bookings/files"
          title="Other booking PDFs"
          subtitle="Upload anything else"
          badge="Upload" />
      </Section>
    </div>
  )
}

const ACCENT_BG: Record<string, string> = {
  indigo:    'bg-indigo/10 text-indigo',
  sage:      'bg-sage/15  text-sage',
  vermilion: 'bg-vermilion/10 text-vermilion',
  gold:      'bg-gold/20  text-[#8a6f1f]',
}

function Section({ accent, icon, label, children }: {
  accent: 'indigo' | 'sage' | 'vermilion' | 'gold'
  icon: string
  label: string
  children: React.ReactNode
}) {
  const chip = ACCENT_BG[accent]
  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 px-1">
        <span className={`w-7 h-7 rounded-lg grid place-items-center text-sm ${chip}`}>{icon}</span>
        <span className="text-[11px] uppercase tracking-[0.15em] text-ink/55">{label}</span>
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function BookingCard({ href, title, subtitle, line2, badge }: {
  href: string
  title: string
  subtitle?: string
  line2?: string
  badge?: string
}) {
  return (
    <Link href={href}
          className="block rounded-2xl bg-white border border-black/5 shadow-paper px-4 py-3.5
                     active:scale-[0.995] transition">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-[15px] leading-tight">{title}</p>
          {subtitle && <p className="text-xs text-ink/60 mt-1 truncate">{subtitle}</p>}
          {line2 && <p className="font-mono text-[11px] text-ink/55 mt-1.5">{line2}</p>}
        </div>
        {badge && (
          <span className="shrink-0 self-center pill text-[10px] uppercase tracking-wider">
            {badge}
          </span>
        )}
        <span aria-hidden className="self-center text-ink/30">›</span>
      </div>
    </Link>
  )
}
