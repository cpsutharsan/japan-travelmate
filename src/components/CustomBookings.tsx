'use client'

import { useEffect, useState } from 'react'
import {
  db, uid,
  CUSTOM_BOOKING_CATEGORIES,
  type CustomBookingRow, type CustomBookingCategory, type CustomBookingField,
} from '@/lib/db'
import { fmtShort } from '@/lib/date'
import { CopyChip } from '@/components/CopyChip'
import { getSupabaseBrowser, hasSupabase } from '@/lib/supabase/client'

const CAT_META: Record<CustomBookingCategory, { icon: string; label: string; chip: string }> = {
  transfer: { icon: '🚕', label: 'Transfers',   chip: 'bg-indigo/10 text-indigo' },
  tour:     { icon: '🗺️', label: 'Tours',       chip: 'bg-vermilion/10 text-vermilion' },
  flight:   { icon: '✈️', label: 'Flights',      chip: 'bg-indigo/10 text-indigo' },
  hotel:    { icon: '🏨', label: 'Hotels',       chip: 'bg-sage/15 text-sage' },
  train:    { icon: '🚄', label: 'Trains',       chip: 'bg-vermilion/10 text-vermilion' },
  ticket:   { icon: '🎟️', label: 'Tickets',      chip: 'bg-gold/20 text-[#8a6f1f]' },
  other:    { icon: '📌', label: 'Other',        chip: 'bg-gold/20 text-[#8a6f1f]' },
}

const SEED_FLAG = 'tm_seeded_custom_bookings_v1'

const KLOOK_SEED: CustomBookingRow = {
  id: 'seed-klook-nrt-22may',
  category: 'transfer',
  title: 'Narita Airport pickup → Minn Ueno Iriya',
  subtitle: 'Klook · NRT → Tokyo',
  date: '2026-05-22',
  cost: '$128.18',
  fields: [
    { label: 'Booking #', value: 'ZPQ012811' },
    { label: 'Payment ref', value: 'TS3864T3HMM6TRF3' },
    { label: 'Flight', value: 'EK318 · DXB→NRT · land 22 May 17:35' },
    { label: 'Vehicle', value: 'Toyota Alphard / Honda Odyssey or similar (max 6 pax, 4 bags)' },
    { label: 'Pickup', value: 'Terminal 1/2/3 Arrival Hall — driver meets at the pick-up & dispatching area outside the terminal. Verify the name on the reservation and your destination before entering.' },
    { label: 'Driver waits', value: '90 min from actual landing time' },
    { label: 'Drop-off', value: 'Minn Ueno Iriya · 2-34-5 Iriya, Taito City, Tokyo 110-0013 · 東京都台東区入谷2-34-5' },
    { label: 'Operator', value: 'Hakuu Co Ltd.' },
    { label: 'Operator phone', value: '+86 13327834616' },
    { label: 'Operator email', value: 'klook-transfer-cs@qinghetrip.com' },
  ],
  notes: 'No refunds for late arrivals or no-shows.',
  ts: Date.parse('2026-05-21T00:00:00Z'),
}

function toSupabase(r: CustomBookingRow) {
  return {
    id: r.id, category: r.category, title: r.title,
    subtitle: r.subtitle ?? null, date: r.date ?? null, cost: r.cost ?? null,
    fields: r.fields, notes: r.notes ?? null,
  }
}

export default function CustomBookings() {
  const [rows, setRows] = useState<CustomBookingRow[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [editing, setEditing] = useState<CustomBookingRow | null>(null)
  const supa = hasSupabase()

  useEffect(() => {
    (async () => {
      const d = await db()
      let all = await d.getAll('customBookings')
      if (all.length === 0 && !localStorage.getItem(SEED_FLAG)) {
        await d.put('customBookings', { ...KLOOK_SEED, synced: false })
        localStorage.setItem(SEED_FLAG, '1')
        if (supa) {
          getSupabaseBrowser()!.from('custom_bookings').upsert(toSupabase(KLOOK_SEED))
            .then(async () => { await d.put('customBookings', { ...KLOOK_SEED, synced: true }) }, () => {})
        }
        all = await d.getAll('customBookings')
      }
      setRows(all.sort((a, b) => (a.date ?? '').localeCompare(b.date ?? '') || a.ts - b.ts))
    })()
  }, [supa])

  async function save(row: CustomBookingRow) {
    const clean: CustomBookingRow = {
      ...row,
      fields: row.fields.filter(f => f.label.trim() || f.value.trim()),
      synced: false,
    }
    const d = await db()
    await d.put('customBookings', clean)
    setRows(prev => {
      const next = prev.filter(r => r.id !== clean.id).concat(clean)
      return next.sort((a, b) => (a.date ?? '').localeCompare(b.date ?? '') || a.ts - b.ts)
    })
    setEditing(null)
    if (supa) {
      getSupabaseBrowser()!.from('custom_bookings').upsert(toSupabase(clean))
        .then(async () => { await d.put('customBookings', { ...clean, synced: true }) }, () => {})
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this booking?')) return
    const d = await db()
    await d.delete('customBookings', id)
    setRows(prev => prev.filter(r => r.id !== id))
    setExpanded(null)
    if (supa) getSupabaseBrowser()!.from('custom_bookings').delete().eq('id', id).then(() => {}, () => {})
  }

  function newBooking() {
    setEditing({ id: uid(), category: 'transfer', title: '', fields: [{ label: '', value: '' }], ts: Date.now() })
  }

  // Group by category, preserving the CAT_META order.
  const groups = (Object.keys(CAT_META) as CustomBookingCategory[])
    .map(cat => ({ cat, items: rows.filter(r => r.category === cat) }))
    .filter(g => g.items.length > 0)

  return (
    <>
      {groups.map(({ cat, items }) => {
        const meta = CAT_META[cat]
        return (
          <section key={cat} className="space-y-3">
            <h2 className="flex items-center gap-2 px-1">
              <span className={`w-7 h-7 rounded-lg grid place-items-center text-sm ${meta.chip}`}>{meta.icon}</span>
              <span className="text-[11px] uppercase tracking-[0.15em] text-ink/55">{meta.label}</span>
            </h2>
            <div className="space-y-3">
              {items.map(r => (
                <article key={r.id}
                  className="rounded-2xl bg-white border border-black/5 shadow-paper overflow-hidden">
                  <button
                    onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                    className="w-full text-left px-4 py-3.5 active:scale-[0.995] transition">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[15px] leading-tight">{r.title}</p>
                        {r.subtitle && <p className="text-xs text-ink/60 mt-1 truncate">{r.subtitle}</p>}
                        {(r.date || r.cost) && (
                          <p className="font-mono text-[11px] text-ink/55 mt-1.5">
                            {r.date ? fmtShort(r.date) : ''}{r.date && r.cost ? ' · ' : ''}{r.cost ?? ''}
                          </p>
                        )}
                      </div>
                      <span aria-hidden className="self-center text-ink/30">{expanded === r.id ? '⌄' : '›'}</span>
                    </div>
                  </button>

                  {expanded === r.id && (
                    <div className="px-4 pb-4 pt-1 border-t border-black/5 space-y-2">
                      {r.fields.map((f, i) => (
                        <div key={i} className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[11px] uppercase tracking-wider text-ink/45">{f.label}</p>
                            <p className="text-sm break-words">{f.value}</p>
                          </div>
                          {f.value && <CopyChip text={f.value} />}
                        </div>
                      ))}
                      {r.notes && <p className="text-xs text-ink/60 italic pt-1">{r.notes}</p>}
                      <div className="flex gap-2 pt-2">
                        <button className="btn-outline flex-1 !py-1.5 text-sm" onClick={() => setEditing(r)}>Edit</button>
                        <button className="btn-outline flex-1 !py-1.5 text-sm text-vermilion" onClick={() => remove(r.id)}>Delete</button>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )
      })}

      <button onClick={newBooking}
        className="w-full rounded-2xl border border-dashed border-black/15 px-4 py-3.5
                   text-sm text-ink/60 active:scale-[0.995] transition">
        + Add booking
      </button>

      {editing && (
        <BookingForm
          initial={editing}
          onCancel={() => setEditing(null)}
          onSave={save} />
      )}
    </>
  )
}

function BookingForm({ initial, onCancel, onSave }: {
  initial: CustomBookingRow
  onCancel: () => void
  onSave: (r: CustomBookingRow) => void
}) {
  const [row, setRow] = useState<CustomBookingRow>(initial)
  const set = (patch: Partial<CustomBookingRow>) => setRow(prev => ({ ...prev, ...patch }))

  function setField(i: number, patch: Partial<CustomBookingField>) {
    setRow(prev => ({ ...prev, fields: prev.fields.map((f, j) => j === i ? { ...f, ...patch } : f) }))
  }
  function addField() { setRow(prev => ({ ...prev, fields: [...prev.fields, { label: '', value: '' }] })) }
  function removeField(i: number) { setRow(prev => ({ ...prev, fields: prev.fields.filter((_, j) => j !== i) })) }

  const canSave = row.title.trim().length > 0

  return (
    <div className="fixed inset-0 z-50 bg-black/40 grid place-items-end" onClick={onCancel}>
      <div className="bg-paper rounded-t-2xl w-full max-w-xl p-5 space-y-3 max-h-[88vh] overflow-y-auto"
           onClick={e => e.stopPropagation()} style={{ paddingBottom: 'calc(var(--safe-bottom) + 16px)' }}>
        <h2 className="h-display text-xl">{initial.title ? 'Edit booking' : 'Add booking'}</h2>

        <label className="block">
          <span className="text-xs text-ink/60">Category</span>
          <select className="input mt-1" value={row.category}
                  onChange={e => set({ category: e.target.value as CustomBookingCategory })}>
            {CUSTOM_BOOKING_CATEGORIES.map(c => (
              <option key={c} value={c}>{CAT_META[c].icon} {c[0].toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs text-ink/60">Title</span>
          <input className="input mt-1" value={row.title} autoFocus
                 onChange={e => set({ title: e.target.value })} placeholder="Narita pickup → Minn Ueno" />
        </label>

        <label className="block">
          <span className="text-xs text-ink/60">Subtitle (optional)</span>
          <input className="input mt-1" value={row.subtitle ?? ''}
                 onChange={e => set({ subtitle: e.target.value })} placeholder="Klook · NRT → Tokyo" />
        </label>

        <div className="flex gap-2">
          <label className="block flex-1">
            <span className="text-xs text-ink/60">Date</span>
            <input type="date" className="input mt-1" value={row.date ?? ''}
                   onChange={e => set({ date: e.target.value || undefined })} />
          </label>
          <label className="block flex-1">
            <span className="text-xs text-ink/60">Cost</span>
            <input className="input mt-1" value={row.cost ?? ''}
                   onChange={e => set({ cost: e.target.value || undefined })} placeholder="$128.18" />
          </label>
        </div>

        <div className="space-y-2">
          <span className="text-xs text-ink/60">Details</span>
          {row.fields.map((f, i) => (
            <div key={i} className="flex gap-2 items-start">
              <input className="input flex-[2]" value={f.label}
                     onChange={e => setField(i, { label: e.target.value })} placeholder="Label" />
              <input className="input flex-[3]" value={f.value}
                     onChange={e => setField(i, { value: e.target.value })} placeholder="Value" />
              <button className="pill shrink-0 self-center" onClick={() => removeField(i)} aria-label="Remove">✕</button>
            </div>
          ))}
          <button className="text-sm text-indigo" onClick={addField}>+ add detail row</button>
        </div>

        <label className="block">
          <span className="text-xs text-ink/60">Notes (optional)</span>
          <textarea className="input mt-1" rows={2} value={row.notes ?? ''}
                    onChange={e => set({ notes: e.target.value || undefined })} />
        </label>

        <div className="flex gap-2 pt-1">
          <button className="btn-outline flex-1" onClick={onCancel}>Cancel</button>
          <button className="btn-primary flex-1 disabled:opacity-40" disabled={!canSave}
                  onClick={() => onSave(row)}>Save</button>
        </div>
      </div>
    </div>
  )
}
