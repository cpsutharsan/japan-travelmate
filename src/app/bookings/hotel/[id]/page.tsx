import Link from 'next/link'
import { notFound } from 'next/navigation'
import { HOTELS } from '@/lib/trip'
import { fmtLong } from '@/lib/date'
import { CopyChip } from '@/components/CopyChip'
import { formatAED, formatJPY } from '@/lib/utils'

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
        <p className="text-sm text-ink/70">Check in {fmtLong(h.checkIn)}{h.checkInTime ? ` · ${h.checkInTime}` : ''}</p>
        <p className="text-sm text-ink/70">Check out {fmtLong(h.checkOut)}{h.checkOutTime ? ` · ${h.checkOutTime}` : ''}</p>

        {(h.confirmation || h.pin) && (
          <div className="mt-2 pt-2 border-t border-black/5 space-y-1">
            {h.confirmation && (
              <p className="font-mono text-lg tracking-wide">
                {h.confirmation} <CopyChip text={h.confirmation} label="Copy" />
              </p>
            )}
            {h.pin && (
              <p className="text-sm">PIN: <span className="font-mono">{h.pin}</span> <CopyChip text={h.pin} label="Copy PIN" /></p>
            )}
            {h.guestName && <p className="text-xs text-ink/55">Guest: {h.guestName}</p>}
            {h.license && <p className="text-xs text-ink/55">License: {h.license}</p>}
          </div>
        )}

        <hr className="my-2 border-black/10" />
        <p className="jp text-lg leading-snug">{h.addressJa}</p>
        <p className="text-xs text-ink/60">{h.addressEn}</p>
        {h.phone && <p className="text-xs"><a className="font-mono underline" href={`tel:${h.phone.replace(/\s/g, '')}`}>{h.phone}</a></p>}

        <div className="flex gap-2 flex-wrap pt-1">
          <CopyChip text={h.addressJa} label="Copy JP" />
          <CopyChip text={h.addressEn} label="Copy EN" />
          <a className="pill"
             href={`https://maps.google.com/?q=${encodeURIComponent(h.addressJa)}`}
             target="_blank" rel="noreferrer">Maps</a>
        </div>

        {(h.costJpy || h.costAed) && (
          <p className="text-xs text-ink/55 mt-1">
            Paid {h.costJpy ? formatJPY(h.costJpy) : ''}{h.costJpy && h.costAed ? ' · ' : ''}{h.costAed ? formatAED(h.costAed) : ''}
          </p>
        )}

        {h.notes && <p className="text-xs italic text-ink/60 mt-2">{h.notes}</p>}
      </div>
      <Link href={`/taxi?to=${h.id}`} className="btn-vermilion w-full">🚕 Show to taxi driver</Link>
    </div>
  )
}
