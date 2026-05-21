'use client'

import { useEffect, useState } from 'react'
import { DEFAULT_RECIPIENTS } from '@/lib/trip'
import { db, uid, type SouvenirRow } from '@/lib/db'
import { formatJPY } from '@/lib/utils'

export default function Souvenirs() {
  const [rows, setRows] = useState<SouvenirRow[]>([])
  const [show, setShow] = useState(false)
  const [recipient, setRecipient] = useState(DEFAULT_RECIPIENTS[0].name)
  const [item, setItem] = useState('')
  const [boughtAt, setBoughtAt] = useState('')
  const [cost, setCost] = useState('')

  useEffect(() => { (async () => { setRows(await (await db()).getAll('souvenirs')) })() }, [])

  async function add() {
    if (!recipient || !item) return
    const row: SouvenirRow = {
      id: uid(), recipient, item,
      boughtAt: boughtAt || undefined,
      cost: cost ? Number(cost) : undefined, costCurrency: 'JPY',
      bought: true, ts: Date.now(),
    }
    const d = await db(); await d.put('souvenirs', row)
    setRows(p => [...p, row])
    setItem(''); setBoughtAt(''); setCost(''); setShow(false)
  }

  async function toggle(r: SouvenirRow) {
    const next = { ...r, bought: !r.bought, ts: Date.now() }
    const d = await db(); await d.put('souvenirs', next)
    setRows(p => p.map(x => x.id === r.id ? next : x))
  }

  const total = rows.filter(r => r.bought && r.cost).reduce((s, r) => s + (r.cost ?? 0), 0)
  const recipientsCovered = new Set(rows.filter(r => r.bought).map(r => r.recipient))

  return (
    <div className="px-5 py-3 space-y-4">
      <h1 className="h-display text-2xl">Souvenir tracker</h1>
      <p className="text-sm text-ink/60">Spent so far: <b>{formatJPY(total)}</b> · {recipientsCovered.size} recipient(s) covered</p>

      <section className="card">
        <p className="text-xs uppercase tracking-widest text-ink/50 mb-2">Suggested recipients</p>
        <ul className="space-y-1 text-sm">
          {DEFAULT_RECIPIENTS.map(r => (
            <li key={r.id} className="flex justify-between">
              <span>{r.name} <span className="text-ink/45 text-xs">({r.group})</span></span>
              <span className={recipientsCovered.has(r.name) ? 'text-sage' : 'text-vermilion'}>
                {recipientsCovered.has(r.name) ? '✓' : 'pending'}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <ul className="space-y-2">
        {rows.map(r => (
          <li key={r.id} className="card flex justify-between items-start">
            <div className="text-sm">
              <p className="font-medium">{r.item}</p>
              <p className="text-xs text-ink/55">For {r.recipient}{r.boughtAt ? ` · ${r.boughtAt}` : ''}{r.cost ? ` · ${formatJPY(r.cost)}` : ''}</p>
            </div>
            <button className="pill" onClick={() => toggle(r)}>{r.bought ? '✓ bought' : 'pending'}</button>
          </li>
        ))}
        {rows.length === 0 && <p className="text-sm text-ink/55">Nothing logged yet.</p>}
      </ul>

      <button onClick={() => setShow(true)}
              className="fixed right-5 bottom-[calc(80px+var(--safe-bottom))] z-40 w-14 h-14 rounded-full bg-vermilion text-white text-2xl shadow-paper grid place-items-center">+</button>

      {show && (
        <div className="fixed inset-0 z-50 bg-black/40 grid place-items-end" onClick={() => setShow(false)}>
          <div className="bg-paper rounded-t-2xl w-full max-w-xl p-5 space-y-3"
               onClick={e => e.stopPropagation()} style={{ paddingBottom: 'calc(var(--safe-bottom) + 16px)' }}>
            <h2 className="h-display text-xl">Add gift</h2>
            <label className="block">
              <span className="text-xs text-ink/60">For whom</span>
              <input className="input mt-1" list="recipients" value={recipient} onChange={e => setRecipient(e.target.value)} />
              <datalist id="recipients">{DEFAULT_RECIPIENTS.map(r => <option key={r.id} value={r.name} />)}</datalist>
            </label>
            <label className="block">
              <span className="text-xs text-ink/60">What</span>
              <input className="input mt-1" value={item} onChange={e => setItem(e.target.value)} />
            </label>
            <label className="block">
              <span className="text-xs text-ink/60">Bought where</span>
              <input className="input mt-1" value={boughtAt} onChange={e => setBoughtAt(e.target.value)} />
            </label>
            <label className="block">
              <span className="text-xs text-ink/60">Cost (¥)</span>
              <input className="input mt-1" inputMode="numeric" value={cost} onChange={e => setCost(e.target.value.replace(/[^\d]/g, ''))} />
            </label>
            <div className="flex gap-2 pt-1">
              <button className="btn-outline flex-1" onClick={() => setShow(false)}>Cancel</button>
              <button className="btn-primary flex-1" onClick={add}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
