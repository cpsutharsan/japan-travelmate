'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { db, uid, type LogRow } from '@/lib/db'
import { fmtLong } from '@/lib/date'
import { getSupabaseBrowser, hasSupabase } from '@/lib/supabase/client'

const MOODS = ['😊', '😐', '😴', '😍'] as const

export default function DailyLogEntry({ params }: { params: { date: string } }) {
  const date = params.date
  const [row, setRow] = useState<LogRow | null>(null)
  const [photos, setPhotos] = useState<{ id: string; url: string }[]>([])
  const [uploading, setUploading] = useState(false)
  const [voiceing, setVoicing] = useState(false)
  const supa = hasSupabase()

  useEffect(() => {
    (async () => {
      const d = await db()
      const r = (await d.getAll('logs')).find(x => x.date === date)
      if (r) setRow(r)
      else setRow({ id: uid(), date, ts: Date.now() })
      const pending = (await d.getAllFromIndex('photos', 'by-date', date))
      setPhotos(pending.map(p => ({ id: p.id, url: URL.createObjectURL(p.blob) })))
    })()
  }, [date])

  async function save(patch: Partial<LogRow>) {
    if (!row) return
    const next: LogRow = { ...row, ...patch, ts: Date.now(), synced: false }
    setRow(next)
    const d = await db()
    await d.put('logs', next)
    if (supa) syncLog(next).catch(() => {})
  }

  async function syncLog(r: LogRow) {
    const c = getSupabaseBrowser()
    if (!c) return
    await c.from('logs').upsert({
      id: r.id, date: r.date, adira: r.adira ?? null, divya: r.divya ?? null,
      best_meal: r.bestMeal ?? null, remember: r.remember ?? null, mood: r.mood ?? null,
    })
    const d = await db()
    await d.put('logs', { ...r, synced: true })
  }

  async function addPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return
    setUploading(true)
    const d = await db()
    for (const f of Array.from(files)) {
      const id = uid()
      await d.put('photos', { id, blob: f, date, ts: Date.now() })
      setPhotos(prev => [...prev, { id, url: URL.createObjectURL(f) }])
      if (supa) {
        const c = getSupabaseBrowser()!
        const path = `${date}/${id}-${f.name.replace(/[^a-z0-9._-]/gi, '_')}`
        await c.storage.from('photos').upload(path, f, { upsert: false }).catch(() => {})
      }
    }
    setUploading(false); e.target.value = ''
  }

  async function addVoice(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f || !supa) return
    setVoicing(true)
    const c = getSupabaseBrowser()!
    const path = `${date}/voice-${Date.now()}.${f.name.split('.').pop() || 'm4a'}`
    await c.storage.from('voice').upload(path, f, { upsert: false }).catch(() => {})
    setVoicing(false); e.target.value = ''
  }

  if (!row) return <p className="px-5 py-6">Loading…</p>

  return (
    <div className="px-5 py-3 space-y-3">
      <Link href="/log" className="text-sm text-ink/60">← All days</Link>
      <h1 className="h-display text-2xl">{fmtLong(date)}</h1>

      <section className="card space-y-2">
        <label className="block">
          <span className="text-xs text-ink/60">Adira moment</span>
          <textarea className="input mt-1" rows={2} value={row.adira ?? ''} onChange={e => save({ adira: e.target.value })} />
        </label>
        <label className="block">
          <span className="text-xs text-ink/60">Divya moment</span>
          <textarea className="input mt-1" rows={2} value={row.divya ?? ''} onChange={e => save({ divya: e.target.value })} />
        </label>
        <label className="block">
          <span className="text-xs text-ink/60">Best meal today</span>
          <textarea className="input mt-1" rows={2} value={row.bestMeal ?? ''} onChange={e => save({ bestMeal: e.target.value })} />
        </label>
        <label className="block">
          <span className="text-xs text-ink/60">What I&rsquo;d remember</span>
          <textarea className="input mt-1" rows={3} value={row.remember ?? ''} onChange={e => save({ remember: e.target.value })} />
        </label>

        <div>
          <p className="text-xs text-ink/60 mb-1">Mood</p>
          <div className="flex gap-2">
            {MOODS.map(m => (
              <button key={m}
                onClick={() => save({ mood: m })}
                className={`w-12 h-12 rounded-full text-2xl border ${row.mood === m ? 'bg-ink text-paper' : 'bg-white border-black/10'}`}>
                {m}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="card">
        <p className="text-xs uppercase tracking-widest text-ink/50 mb-2">Photos</p>
        <div className="grid grid-cols-3 gap-2">
          {photos.map(p => (
            <img key={p.id} src={p.url} alt="" className="rounded-lg aspect-square object-cover" />
          ))}
          <label className="rounded-lg aspect-square border-2 border-dashed border-black/15 grid place-items-center text-2xl text-ink/40 cursor-pointer">
            +
            <input type="file" accept="image/*" multiple className="hidden" onChange={addPhotos} disabled={uploading} />
          </label>
        </div>
        {uploading && <p className="text-xs text-ink/55 mt-2">Saving…</p>}
      </section>

      <section className="card">
        <p className="text-xs uppercase tracking-widest text-ink/50 mb-2">Voice memo</p>
        <label className="btn-outline cursor-pointer text-sm">
          🎙️ Upload audio
          <input type="file" accept="audio/*" className="hidden" onChange={addVoice} disabled={voiceing || !supa} />
        </label>
        {!supa && <p className="text-xs text-ink/55 mt-1">Connect Supabase to enable audio upload.</p>}
      </section>
    </div>
  )
}
