import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TICKETS } from '@/lib/trip'
import { fmtLong } from '@/lib/date'
import { CopyChip } from '@/components/CopyChip'
import { formatJPY } from '@/lib/utils'

export function generateStaticParams() {
  return TICKETS.map(t => ({ id: t.id }))
}

export default function TicketDetail({ params }: { params: { id: string } }) {
  const t = TICKETS.find(x => x.id === params.id)
  if (!t) notFound()
  return (
    <div className="px-5 py-3 space-y-3">
      <Link href="/bookings" className="text-sm text-ink/60">← All bookings</Link>
      <div className="card card-bordered-gold space-y-2">
        <p className="text-xs uppercase tracking-widest text-ink/50">Ticket</p>
        <h1 className="h-display text-2xl">{t.title}</h1>
        <p className="text-sm text-ink/70">{fmtLong(t.date)}{t.time ? ` · ${t.time}` : ''}</p>
        {t.reservation && (
          <p className="font-mono text-lg mt-2">{t.reservation} <CopyChip text={t.reservation} /></p>
        )}
        {t.costJpy && <p className="text-sm text-ink/65">Total {formatJPY(t.costJpy)}</p>}
        {t.notes && <p className="text-xs italic text-ink/55 mt-1">{t.notes}</p>}
      </div>
      {t.perPersonIds && t.perPersonIds.length > 0 && (
        <div className="card">
          <p className="text-xs uppercase tracking-widest text-ink/50 mb-2">Per-person codes</p>
          <ul className="space-y-1.5 text-sm">
            {t.perPersonIds.map((p, i) => (
              <li key={i} className="flex items-center justify-between gap-2">
                <div>
                  <p>{p.who}</p>
                  <p className="font-mono text-xs text-ink/60 break-all">{p.code}</p>
                </div>
                <CopyChip text={p.code} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
