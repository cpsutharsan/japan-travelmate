'use client'

import { useEffect, useState } from 'react'
import { BOOKING_STATUS } from '@/lib/trip'
import { db } from '@/lib/db'

export default function StatusPage() {
  const [override, setOverride] = useState<Record<string, boolean>>({})
  useEffect(() => {
    (async () => {
      const d = await db()
      const m: Record<string, boolean> = {}
      ;(await d.getAll('bookings')).forEach(b => m[b.id] = b.done)
      setOverride(m)
    })()
  }, [])

  async function toggle(id: string, current: boolean) {
    const next = !current
    setOverride(p => ({ ...p, [id]: next }))
    const d = await db(); await d.put('bookings', { id, done: next })
  }

  const merged = BOOKING_STATUS.map(b => ({ ...b, done: override[b.id] ?? b.done }))
  const todo = merged.filter(m => !m.done)
  const done = merged.filter(m => m.done)

  return (
    <div className="px-5 py-3 space-y-4">
      <h1 className="h-display text-2xl">Booking status</h1>
      <p className="text-sm text-ink/60">{done.length} done · {todo.length} pending</p>

      <section>
        <h2 className="text-xs uppercase tracking-widest text-ink/50 mb-2">⚠️ Pending</h2>
        <ul className="space-y-2">
          {todo.map(b => (
            <li key={b.id} className="card card-bordered-vermilion">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-medium text-sm">{b.label}</p>
                  {b.detail && <p className="text-xs text-ink/55 mt-0.5">{b.detail}</p>}
                  {b.link && <a href={b.link} target="_blank" rel="noreferrer" className="pill mt-1 inline-block">Open link →</a>}
                </div>
                <button className="pill !bg-sage !text-white" onClick={() => toggle(b.id, b.done)}>Mark done</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xs uppercase tracking-widest text-ink/50 mb-2">✅ Confirmed</h2>
        <ul className="space-y-1.5">
          {done.map(b => (
            <li key={b.id} className="card flex items-center justify-between">
              <span className="text-sm">{b.label}</span>
              <button className="text-xs text-ink/45 underline" onClick={() => toggle(b.id, b.done)}>undo</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
