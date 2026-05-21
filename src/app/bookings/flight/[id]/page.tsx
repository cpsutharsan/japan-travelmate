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
      </div>
      <Link href="/bookings/files" className="card block">📎 Upload e-ticket PDF</Link>
    </div>
  )
}
