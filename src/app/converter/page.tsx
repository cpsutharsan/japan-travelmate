'use client'

import { useEffect, useState } from 'react'
import { getSettings, setSettings } from '@/lib/db'
import { formatAED, formatJPY } from '@/lib/utils'
import { fmtShort } from '@/lib/date'

export default function ConverterPage() {
  const [rate, setRate] = useState(0.025)
  const [updatedAt, setUpdatedAt] = useState<number>(Date.now())
  const [jpy, setJpy] = useState<string>('')
  const [aed, setAed] = useState<string>('')
  const [preTax, setPreTax] = useState('')
  const [history, setHistory] = useState<{ jpy: number; aed: number; ts: number }[]>([])

  useEffect(() => {
    (async () => {
      const s = await getSettings(); setRate(s.rateJpyToAed); setUpdatedAt(s.rateUpdatedAt)
      try { setHistory(JSON.parse(localStorage.getItem('conv-history') || '[]')) } catch {}
    })()
  }, [])

  function setJ(v: string) {
    setJpy(v); const n = Number(v)
    setAed(isFinite(n) ? (n * rate).toFixed(2) : '')
  }
  function setA(v: string) {
    setAed(v); const n = Number(v)
    setJpy(isFinite(n) && rate ? Math.round(n / rate).toString() : '')
  }
  function pushHistory() {
    const j = Number(jpy); if (!j) return
    const next = [{ jpy: j, aed: j * rate, ts: Date.now() }, ...history].slice(0, 10)
    setHistory(next); localStorage.setItem('conv-history', JSON.stringify(next))
  }

  async function changeRate(v: number) {
    setRate(v); const t = Date.now(); setUpdatedAt(t)
    await setSettings({ rateJpyToAed: v, rateUpdatedAt: t })
  }

  const taxFree = Number(preTax) ? Number(preTax) * 0.10 : 0

  return (
    <div className="px-5 py-3 space-y-4">
      <h1 className="h-display text-2xl">Currency converter</h1>

      <section className="card">
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink/60">Rate</span>
          <span className="font-mono">1 ¥ = <input className="input !inline-block !w-24 !py-1 !px-2 text-right" type="number" step="0.0001" value={rate} onChange={e => changeRate(Number(e.target.value))} /> AED</span>
        </div>
        <p className="text-[11px] text-ink/45 mt-1">Updated {fmtShort(new Date(updatedAt))}</p>
      </section>

      <section className="card space-y-2">
        <label className="block">
          <span className="text-xs text-ink/55">¥</span>
          <input inputMode="numeric" className="input mt-1 font-mono text-lg" value={jpy} onChange={e => setJ(e.target.value.replace(/[^\d.]/g, ''))} onBlur={pushHistory} />
        </label>
        <label className="block">
          <span className="text-xs text-ink/55">AED</span>
          <input inputMode="decimal" className="input mt-1 font-mono text-lg" value={aed} onChange={e => setA(e.target.value.replace(/[^\d.]/g, ''))} />
        </label>
        <div className="flex gap-1.5 flex-wrap">
          {[100, 500, 1000, 5000, 10000].map(n => (
            <button key={n} className="pill" onClick={() => setJ(String(n))}>¥{n.toLocaleString()}</button>
          ))}
        </div>
      </section>

      <section className="card card-bordered-gold">
        <p className="text-xs uppercase tracking-widest text-ink/50 mb-1">Tax-free calculator</p>
        <label className="block">
          <span className="text-xs text-ink/55">Pre-tax price (¥)</span>
          <input inputMode="numeric" className="input mt-1" value={preTax} onChange={e => setPreTax(e.target.value.replace(/[^\d]/g, ''))} />
        </label>
        {taxFree > 0 && (
          <p className="text-sm mt-2">You save <b>{formatJPY(Math.round(taxFree))}</b> ≈ <b>{formatAED(taxFree * rate)}</b></p>
        )}
      </section>

      <section className="card">
        <p className="text-xs uppercase tracking-widest text-ink/50 mb-2">Last 10 conversions</p>
        <ul className="space-y-1 text-sm">
          {history.map((h, i) => (
            <li key={i} className="flex justify-between"><span>{formatJPY(h.jpy)}</span><span className="text-ink/55">{formatAED(h.aed)}</span></li>
          ))}
          {history.length === 0 && <p className="text-xs text-ink/45">No history yet.</p>}
        </ul>
      </section>
    </div>
  )
}
