import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TRAINS } from '@/lib/trip'
import { fmtLong } from '@/lib/date'
import { CopyChip } from '@/components/CopyChip'

export function generateStaticParams() {
  return TRAINS.map(t => ({ id: t.id }))
}

export default function TrainDetail({ params }: { params: { id: string } }) {
  const t = TRAINS.find(x => x.id === params.id)
  if (!t) notFound()
  return (
    <div className="px-5 py-3 space-y-3">
      <Link href="/bookings" className="text-sm text-ink/60">← All bookings</Link>
      <div className="card card-bordered-vermilion space-y-2">
        <p className="text-xs uppercase tracking-widest text-ink/50">Shinkansen</p>
        <h1 className="h-display text-2xl">{t.name}</h1>
        <p className="text-base">{t.from} → {t.to}</p>
        <p className="text-sm text-ink/70">{fmtLong(t.date)} · {t.depart} – {t.arrive}</p>
        <p className="font-mono text-lg mt-2">{t.car}</p>
        <p className="text-sm">{t.seats}</p>
        {t.reservation && (
          <p className="text-sm mt-2">Reservation: <span className="font-mono">{t.reservation}</span> <CopyChip text={t.reservation} /></p>
        )}
      </div>
      {t.ticketIds && t.ticketIds.length > 0 && (
        <div className="card">
          <p className="text-xs uppercase tracking-widest text-ink/50 mb-2">QR-Ticket security codes</p>
          <ul className="space-y-2 font-mono text-[12px] break-all">
            {t.ticketIds.map((id, i) => (
              <li key={i} className="flex items-center justify-between gap-2">
                <span>Seat {t.seats.split(', ')[i] || `#${i+1}`}: {id}</span>
                <CopyChip text={id} />
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-ink/55 mt-2 italic">
            Print these QR PDFs before the trip — phone screens may not respond to the gate.
          </p>
        </div>
      )}
    </div>
  )
}
