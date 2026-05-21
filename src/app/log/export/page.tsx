'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { db, type LogRow } from '@/lib/db'
import { tripDateISO } from '@/lib/date'
import { TRIP } from '@/lib/trip'

/**
 * Memory book "export" — opens a print-styled page that the user can
 * Save as PDF from the system print dialog. Keeps the deps minimal.
 */
export default function MemoryExport() {
  const [rows, setRows] = useState<LogRow[]>([])
  const [photos, setPhotos] = useState<Record<string, string[]>>({})

  useEffect(() => {
    (async () => {
      const d = await db()
      const logs = await d.getAll('logs')
      setRows(logs.sort((a, b) => a.date.localeCompare(b.date)))
      const ph = await d.getAll('photos')
      const map: Record<string, string[]> = {}
      ph.forEach(p => {
        (map[p.date] ||= []).push(URL.createObjectURL(p.blob))
      })
      setPhotos(map)
    })()
  }, [])

  const days = Array.from({ length: TRIP.totalDays }, (_, i) => tripDateISO(i + 1))

  return (
    <div className="px-5 py-3 space-y-4">
      <Link href="/log" className="text-sm text-ink/60 print:hidden">← Back to log</Link>
      <div className="flex items-center justify-between print:hidden">
        <h1 className="h-display text-2xl">Memory book</h1>
        <button className="btn-primary" onClick={() => window.print()}>🖨️ Save as PDF</button>
      </div>
      <p className="text-sm text-ink/60 print:hidden">
        Use your phone&rsquo;s share sheet → &ldquo;Print&rdquo; → &ldquo;Save to Files (PDF)&rdquo;.
      </p>

      <article className="space-y-8">
        <header className="text-center py-8">
          <h1 className="h-display text-4xl">Japan, May 2026</h1>
          <p className="text-sm text-ink/60 mt-2">The Parthasarathy family · 9 days</p>
        </header>

        {days.map(date => {
          const row = rows.find(r => r.date === date)
          const ph = photos[date] || []
          if (!row && ph.length === 0) return null
          return (
            <section key={date} className="break-inside-avoid">
              <h2 className="h-display text-2xl mb-2">{date}</h2>
              {row?.mood && <p className="text-2xl">{row.mood}</p>}
              {row?.adira && <p className="mt-2"><b>Adira:</b> {row.adira}</p>}
              {row?.divya && <p><b>Divya:</b> {row.divya}</p>}
              {row?.bestMeal && <p><b>Best meal:</b> {row.bestMeal}</p>}
              {row?.remember && <p className="italic mt-2">&ldquo;{row.remember}&rdquo;</p>}
              {ph.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {ph.map((u, i) => <img key={i} src={u} className="rounded-lg w-full" alt="" />)}
                </div>
              )}
            </section>
          )
        })}
      </article>
    </div>
  )
}
