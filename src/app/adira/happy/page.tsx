'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { db, uid, type HappyRow } from '@/lib/db'
import { fmtShort, tripDateISO } from '@/lib/date'
import { todayISO } from '@/lib/select'
import { TRIP } from '@/lib/trip'

const MOODS = [
  { v: 1, e: '😴', label: 'tired' },
  { v: 2, e: '😐', label: 'ok' },
  { v: 3, e: '😊', label: 'good' },
  { v: 4, e: '😄', label: 'great' },
  { v: 5, e: '🤩', label: 'magical' },
] as const

export default function HappyMeter() {
  const today = todayISO()
  const [row, setRow] = useState<HappyRow | null>(null)
  const [all, setAll] = useState<HappyRow[]>([])

  useEffect(() => { reload() }, [])
  async function reload() {
    const d = await db()
    const a = await d.getAll('happy')
    setAll(a)
    const r = a.find(x => x.date === today)
    setRow(r ?? {
      id: uid(), date: today, mood: 3, sleep: 3,
      meals: { breakfast: false, lunch: false, dinner: false, snacks: false },
      water: 'medium', meltdown: 'none', ts: Date.now(),
    })
  }
  async function save(patch: Partial<HappyRow>) {
    if (!row) return
    const next = { ...row, ...patch, ts: Date.now(), synced: false }
    setRow(next)
    const d = await db(); await d.put('happy', next)
    setAll(prev => [...prev.filter(x => x.id !== next.id), next])
  }

  if (!row) return <p className="px-5 py-6">…</p>

  const days = Array.from({ length: TRIP.totalDays }, (_, i) => tripDateISO(i + 1))

  return (
    <div className="px-5 py-3 space-y-4">
      <Link href="/adira" className="text-sm text-ink/60">← Adira</Link>
      <h1 className="h-display text-2xl">Happy meter</h1>
      <p className="text-sm text-ink/60">30-second daily check. Helps spot patterns.</p>

      <section className="card space-y-3">
        <p className="text-xs uppercase tracking-widest text-ink/50">Today — {fmtShort(today)}</p>

        <div>
          <p className="text-xs text-ink/60 mb-1">How was Adira today?</p>
          <div className="flex gap-2">
            {MOODS.map(m => (
              <button key={m.v} onClick={() => save({ mood: m.v })}
                className={`w-12 h-12 rounded-full text-2xl border ${row.mood === m.v ? 'bg-ink text-paper' : 'bg-white border-black/10'}`}
                aria-label={m.label}>{m.e}</button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-ink/60 mb-1">Sleep last night</p>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} onClick={() => save({ sleep: n })}
                className={`w-10 h-10 rounded-md border ${row.sleep >= n ? 'bg-gold/40' : 'bg-white border-black/10'}`}>★</button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-ink/60 mb-1">Meals she ate</p>
          <div className="grid grid-cols-2 gap-1.5">
            {(['breakfast', 'lunch', 'dinner', 'snacks'] as const).map(k => (
              <label key={k} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={row.meals[k]}
                       onChange={e => save({ meals: { ...row.meals, [k]: e.target.checked } })} />
                {k}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-ink/60 mb-1">Water</p>
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as const).map(w => (
              <button key={w} onClick={() => save({ water: w })}
                className={`pill ${row.water === w ? '!bg-ink !text-paper' : ''}`}>{w}</button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-ink/60 mb-1">Meltdown</p>
          <div className="flex gap-2">
            {(['none', 'mild', 'major'] as const).map(m => (
              <button key={m} onClick={() => save({ meltdown: m })}
                className={`pill ${row.meltdown === m ? '!bg-vermilion !text-white' : ''}`}>{m}</button>
            ))}
          </div>
          {row.meltdown !== 'none' && (
            <textarea className="input mt-2" rows={2} placeholder="What happened?"
                      value={row.meltdownNote ?? ''} onChange={e => save({ meltdownNote: e.target.value })} />
          )}
        </div>

        <label className="block">
          <span className="text-xs text-ink/60">What made her happy today?</span>
          <input className="input mt-1" value={row.happyNote ?? ''} onChange={e => save({ happyNote: e.target.value })} />
        </label>
      </section>

      <section className="card">
        <p className="text-xs uppercase tracking-widest text-ink/50 mb-2">9-day mood</p>
        <div className="flex items-end gap-1 h-24">
          {days.map(d => {
            const r = all.find(x => x.date === d)
            const h = r ? (r.mood / 5) * 100 : 6
            return (
              <div key={d} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t bg-vermilion/80" style={{ height: `${h}%` }} />
                <span className="text-[10px] text-ink/45">{d.slice(8)}</span>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
