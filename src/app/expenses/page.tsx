'use client'

import { useEffect, useMemo, useState } from 'react'
import { db, getSettings, setSettings, uid, type ExpenseRow } from '@/lib/db'
import { EXPENSE_CATEGORIES, TRIP, type ExpenseCategory } from '@/lib/trip'
import { formatAED, formatJPY } from '@/lib/utils'
import { todayISO } from '@/lib/select'
import { getSupabaseBrowser, hasSupabase } from '@/lib/supabase/client'

export default function ExpensesPage() {
  const [rows, setRows] = useState<ExpenseRow[]>([])
  const [rate, setRate] = useState(0.025)
  const [show, setShow] = useState(false)
  const [amount, setAmount] = useState('')
  const [cat, setCat] = useState<ExpenseCategory>('Food')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')
  const supa = hasSupabase()

  useEffect(() => {
    (async () => {
      const d = await db()
      setRows((await d.getAll('expenses')).sort((a, b) => b.ts - a.ts))
      const s = await getSettings(); setRate(s.rateJpyToAed)
    })()
  }, [])

  const today = todayISO()
  const totalAed = useMemo(() => rows.reduce((s, r) => s + r.amountAed, 0), [rows])
  const totalJpy = useMemo(() => rows.reduce((s, r) => s + r.amountJpy, 0), [rows])
  const todaysJpy = useMemo(() => rows.filter(r => r.date === today).reduce((s, r) => s + r.amountJpy, 0), [rows, today])
  const byCategory = useMemo(() => {
    const m: Record<string, number> = {}
    rows.forEach(r => { m[r.category] = (m[r.category] || 0) + r.amountAed })
    return m
  }, [rows])

  async function add() {
    const jpy = Number(amount); if (!jpy || jpy <= 0) return
    const aed = jpy * rate
    const row: ExpenseRow = {
      id: uid(), ts: Date.now(), date: today,
      amountJpy: jpy, amountAed: aed, category: cat,
      location: location || undefined, notes: notes || undefined,
      synced: false,
    }
    const d = await db(); await d.put('expenses', row)
    setRows(prev => [row, ...prev])
    setAmount(''); setLocation(''); setNotes(''); setShow(false)
    if (supa) {
      const c = getSupabaseBrowser()!
      await c.from('expenses').insert({
        id: row.id, date: row.date, amount_jpy: row.amountJpy, amount_aed: row.amountAed,
        category: row.category, location: row.location ?? null, notes: row.notes ?? null,
      }).then(async () => { await d.put('expenses', { ...row, synced: true }) }, () => {})
    }
  }

  async function changeRate(v: number) {
    setRate(v); await setSettings({ rateJpyToAed: v, rateUpdatedAt: Date.now() })
  }

  return (
    <div className="px-5 py-3 space-y-4">
      <h1 className="h-display text-2xl">Expenses</h1>

      <section className="card card-bordered-gold">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs uppercase tracking-widest text-ink/50">Spent so far</p>
            <p className="h-display text-3xl">{formatAED(totalAed)}</p>
            <p className="text-xs text-ink/55">{formatJPY(totalJpy)} · today {formatJPY(todaysJpy)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-ink/50">Budget</p>
            <p className="font-mono text-sm">{formatAED(TRIP.budgetAED)}</p>
            <p className="text-xs text-ink/55">{Math.round(100 * totalAed / TRIP.budgetAED)}% used</p>
          </div>
        </div>
        <div className="w-full bg-black/5 rounded-full h-2 mt-3 overflow-hidden">
          <div className="bg-vermilion h-2"
               style={{ width: `${Math.min(100, 100 * totalAed / TRIP.budgetAED)}%` }} />
        </div>
      </section>

      <section className="card">
        <p className="text-xs uppercase tracking-widest text-ink/50 mb-2">By category</p>
        <ul className="space-y-1.5">
          {EXPENSE_CATEGORIES.map(c => {
            const v = byCategory[c] || 0
            const pct = totalAed ? Math.round(100 * v / totalAed) : 0
            return (
              <li key={c}>
                <div className="flex justify-between text-xs">
                  <span>{c}</span><span className="text-ink/55">{formatAED(v)} · {pct}%</span>
                </div>
                <div className="w-full bg-black/5 h-1.5 rounded-full overflow-hidden">
                  <div className="h-1.5 bg-indigo" style={{ width: `${pct}%` }} />
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="card">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest text-ink/50">Rate</p>
          <label className="text-sm flex items-center gap-2">
            1 JPY =
            <input
              className="input !py-1 !px-2 w-24 text-right font-mono"
              type="number" step="0.0001" value={rate}
              onChange={e => changeRate(Number(e.target.value))} />
            AED
          </label>
        </div>
      </section>

      <ul className="space-y-2">
        {rows.length === 0 && <p className="text-sm text-ink/55">No expenses yet.</p>}
        {rows.map(r => (
          <li key={r.id} className="card flex justify-between">
            <div>
              <p className="text-sm font-medium">{formatJPY(r.amountJpy)} · {r.category}</p>
              <p className="text-xs text-ink/55">{r.date}{r.location ? ` · ${r.location}` : ''}{r.notes ? ` · ${r.notes}` : ''}</p>
            </div>
            <p className="font-mono text-xs text-ink/55 self-center">{formatAED(r.amountAed)}</p>
          </li>
        ))}
      </ul>

      <button onClick={() => setShow(true)}
              className="fixed right-5 bottom-[calc(80px+var(--safe-bottom))] z-40
                         w-14 h-14 rounded-full bg-vermilion text-white text-2xl shadow-paper grid place-items-center">
        +
      </button>

      {show && (
        <div className="fixed inset-0 z-50 bg-black/40 grid place-items-end" onClick={() => setShow(false)}>
          <div className="bg-paper rounded-t-2xl w-full max-w-xl p-5 space-y-3"
               onClick={e => e.stopPropagation()} style={{ paddingBottom: 'calc(var(--safe-bottom) + 16px)' }}>
            <h2 className="h-display text-xl">Add expense</h2>
            <label className="block">
              <span className="text-xs text-ink/60">Amount (¥)</span>
              <input inputMode="numeric" pattern="[0-9]*" className="input mt-1" value={amount} onChange={e => setAmount(e.target.value.replace(/[^\d]/g, ''))} autoFocus />
            </label>
            <label className="block">
              <span className="text-xs text-ink/60">Category</span>
              <select className="input mt-1" value={cat} onChange={e => setCat(e.target.value as ExpenseCategory)}>
                {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs text-ink/60">Location</span>
              <input className="input mt-1" value={location} onChange={e => setLocation(e.target.value)} />
            </label>
            <label className="block">
              <span className="text-xs text-ink/60">Notes</span>
              <input className="input mt-1" value={notes} onChange={e => setNotes(e.target.value)} />
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
