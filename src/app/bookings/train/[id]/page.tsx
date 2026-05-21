import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TRAINS } from '@/lib/trip'
import { fmtLong } from '@/lib/date'

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
      </div>
    </div>
  )
}
