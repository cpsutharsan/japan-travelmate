import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FLIGHTS } from '@/lib/trip'
import { fmtLong } from '@/lib/date'
import { CopyChip } from '@/components/CopyChip'

export function generateStaticParams() {
  return FLIGHTS.map(f => ({ id: f.id }))
}

export default function FlightDetail({ params }: { params: { id: string } }) {
  const f = FLIGHTS.find(x => x.id === params.id)
  if (!f) notFound()
  return (
    <div className="px-5 py-3 space-y-3">
      <Link href="/bookings" className="text-sm text-ink/60">← All bookings</Link>
      <div className="card card-bordered-indigo space-y-2">
        <p className="text-xs uppercase tracking-widest text-ink/50">Flight</p>
        <h1 className="h-display text-2xl">{f.airline} {f.number}</h1>
        <p>{f.from} → {f.to}</p>
        <p className="text-sm text-ink/60">{fmtLong(f.date)} · {f.depart} – {f.arrive}</p>
        <p className="font-mono text-3xl tracking-widest mt-3">{f.pnr}</p>
        <div className="flex gap-2"><CopyChip text={f.pnr} label="Copy PNR" /></div>

        {(f.dropBagsBy || f.boarding) && (
          <div className="mt-2 pt-2 border-t border-black/5 grid grid-cols-3 gap-2 text-xs">
            {f.dropBagsBy && <div><p className="text-ink/50">Drop bags by</p><p className="font-mono">{f.dropBagsBy}</p></div>}
            {f.clearSecurityBy && <div><p className="text-ink/50">Clear security by</p><p className="font-mono">{f.clearSecurityBy}</p></div>}
            {f.boarding && <div><p className="text-ink/50">Boarding</p><p className="font-mono">{f.boarding}</p></div>}
            {f.group && <div><p className="text-ink/50">Group</p><p className="font-mono">{f.group}</p></div>}
          </div>
        )}
      </div>

      {f.passengers && f.passengers.length > 0 && (
        <div className="card">
          <p className="text-xs uppercase tracking-widest text-ink/50 mb-2">Passengers</p>
          <ul className="space-y-2 text-sm">
            {f.passengers.map(p => (
              <li key={p.seq} className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{p.who} <span className="font-mono text-xs text-ink/55">· seat {p.seat}</span></p>
                  <p className="text-[11px] text-ink/55">{p.nameOnTicket}</p>
                  <p className="font-mono text-[11px] text-ink/55">Ticket {p.ticket} · SEQ {p.seq}</p>
                </div>
                <CopyChip text={p.ticket} label="Copy ticket" />
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link href="/bookings/files" className="card block">📎 Upload e-ticket PDF</Link>
    </div>
  )
}
