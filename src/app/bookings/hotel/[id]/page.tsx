import Link from 'next/link'
import { notFound } from 'next/navigation'
import { HOTELS } from '@/lib/trip'
import { fmtLong } from '@/lib/date'
import { CopyChip } from '@/components/CopyChip'

export function generateStaticParams() {
  return HOTELS.map(h => ({ id: h.id }))
}

export default function HotelDetail({ params }: { params: { id: string } }) {
  const h = HOTELS.find(x => x.id === params.id)
  if (!h) notFound()
  return (
    <div className="px-5 py-3 space-y-3">
      <Link href="/bookings" className="text-sm text-ink/60">← All bookings</Link>
      <div className="card card-bordered-sage space-y-2">
        <p className="text-xs uppercase tracking-widest text-ink/50">Hotel · {h.city}</p>
        <h1 className="h-display text-2xl">{h.name}</h1>
        {h.nameJa && <p className="jp text-base">{h.nameJa}</p>}
        <p className="text-sm text-ink/70">Check in {fmtLong(h.checkIn)}</p>
        <p className="text-sm text-ink/70">Check out {fmtLong(h.checkOut)}</p>
        <hr className="my-2 border-black/10" />
        <p className="jp text-lg leading-snug">{h.addressJa}</p>
        <p className="text-xs text-ink/60">{h.addressEn}</p>
        <div className="flex gap-2 flex-wrap">
          <CopyChip text={h.addressJa} label="Copy JP address" />
          <CopyChip text={h.addressEn} label="Copy EN address" />
          <a className="pill"
             href={`https://maps.google.com/?q=${encodeURIComponent(h.addressJa)}`}
             target="_blank" rel="noreferrer">Open in Maps</a>
        </div>
        {h.notes && <p className="text-xs italic text-ink/60 mt-2">{h.notes}</p>}
      </div>
      <Link href={`/taxi?to=${h.id}`} className="btn-vermilion w-full">🚕 Show to taxi driver</Link>
    </div>
  )
}
