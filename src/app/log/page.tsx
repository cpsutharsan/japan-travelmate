'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { db, type LogRow, type PendingPhoto } from '@/lib/db'
import { TRIP } from '@/lib/trip'
import { fmtShort, tripDateISO } from '@/lib/date'
import { todayISO } from '@/lib/select'

type DayLog = LogRow & { photos: number }

export default function LogPage() {
  const [rows, setRows] = useState<Record<string, DayLog>>({})

  useEffect(() => { reload() }, [])

  async function reload() {
    const d = await db()
    const logs = await d.getAll('logs')
    const photos = await d.getAll('photos')
    const merged: Record<string, DayLog> = {}
    logs.forEach(l => { merged[l.date] = { ...l, photos: 0 } })
    photos.forEach(p => {
      if (!merged[p.date]) merged[p.date] = { id: crypto.randomUUID(), date: p.date, ts: 0, photos: 0 }
      merged[p.date].photos += 1
    })
    setRows(merged)
  }

  const dates = Array.from({ length: TRIP.totalDays }, (_, i) => tripDateISO(i + 1))
  const today = todayISO()

  return (
    <div className="px-5 py-3 space-y-4">
      <h1 className="h-display text-2xl">Daily log</h1>
      <p className="text-sm text-ink/60">Photos, &ldquo;Adira moments&rdquo;, &ldquo;Divya moments&rdquo;, best meal, voice memos.</p>

      <ul className="space-y-2">
        {dates.map(d => {
          const r = rows[d]
          const isToday = d === today
          return (
            <li key={d}>
              <Link href={`/log/${d}`}
                    className={`card flex items-center justify-between ${isToday ? 'ring-2 ring-vermilion' : ''}`}>
                <div>
                  <p className="text-sm font-medium">{fmtShort(d)}</p>
                  <p className="text-xs text-ink/55 mt-0.5 line-clamp-1">
                    {r ? (r.adira || r.divya || r.bestMeal || r.remember || '—') : 'No entry yet'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-ink/50">
                  {r?.mood && <span className="text-base">{r.mood}</span>}
                  <span>📷 {r?.photos ?? 0}</span>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>

      <Link href="/log/export" className="btn-outline w-full">📕 Generate memory book (end of trip)</Link>
    </div>
  )
}
