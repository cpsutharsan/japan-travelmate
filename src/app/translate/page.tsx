'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { CopyChip } from '@/components/CopyChip'
import { spendCheckAndIncrement, spendCount, spendCap } from '@/lib/spend'

type Result = { ja: string; romaji: string; context_note?: string }

export default function TranslatePage() {
  const [input, setInput] = useState('')
  const [jain, setJain] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [listening, setListening] = useState(false)
  const [usedToday, setUsedToday] = useState(0)
  const recRef = useRef<any>(null)

  useEffect(() => { setUsedToday(spendCount('translate')) }, [result])

  function startMic() {
    setErr(null)
    const SR =
      (typeof window !== 'undefined' && (window as any).SpeechRecognition) ||
      (typeof window !== 'undefined' && (window as any).webkitSpeechRecognition)
    if (!SR) { setErr('Speech input not supported on this browser. Type instead.'); return }
    const rec = new SR()
    rec.lang = 'en-US'
    rec.interimResults = true
    rec.continuous = false
    rec.onresult = (e: any) => {
      const last = e.results[e.results.length - 1]
      setInput(last[0].transcript)
      if (last.isFinal) {
        setListening(false)
        translate(last[0].transcript)
      }
    }
    rec.onerror = (e: any) => { setErr(`Mic error: ${e.error}`); setListening(false) }
    rec.onend = () => setListening(false)
    recRef.current = rec
    setListening(true)
    rec.start()
  }
  function stopMic() {
    try { recRef.current?.stop() } catch {}
    setListening(false)
  }

  async function translate(textArg?: string) {
    const text = (textArg ?? input).trim()
    if (!text) return
    const guard = spendCheckAndIncrement('translate')
    if (!guard.ok) { setErr(guard.reason); return }
    setBusy(true); setErr(null)
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text, jain }),
      })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(t || `HTTP ${res.status}`)
      }
      const data = (await res.json()) as Result
      setResult(data)
      // Auto-speak the Japanese.
      speak(data.ja)
    } catch (e: any) {
      setErr(e?.message ?? 'Translation failed')
    } finally {
      setBusy(false)
    }
  }

  function speak(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'ja-JP'
    u.rate = 0.9
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }

  return (
    <div className="px-5 py-3 space-y-4">
      <h1 className="h-display text-2xl">🗣️ Translate</h1>
      <p className="text-sm text-ink/60">
        Tap the mic, say what you need in English, then show the Japanese to staff.
        Used today: <span className="font-mono">{usedToday}</span>/{spendCap('translate')}
      </p>

      <section className="card">
        <textarea
          className="input min-h-[80px]"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g. Does this dish contain bonito flakes or fish stock?"
        />
        <div className="flex items-center justify-between gap-2 mt-2">
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={jain} onChange={e => setJain(e.target.checked)} />
            Jain (no onion / garlic)
          </label>
          <div className="flex gap-2">
            {!listening ? (
              <button className="btn-outline text-sm" onClick={startMic}>🎙️ Mic</button>
            ) : (
              <button className="btn-vermilion text-sm" onClick={stopMic}>● Listening</button>
            )}
            <button className="btn-primary text-sm" onClick={() => translate()} disabled={busy || !input.trim()}>
              {busy ? '…' : 'Translate'}
            </button>
          </div>
        </div>
      </section>

      {err && <p className="text-vermilion text-sm">{err}</p>}

      {result && (
        <>
          <section className="card card-bordered-vermilion">
            <p className="text-xs uppercase tracking-widest text-ink/50">Show this to staff</p>
            <p className="jp text-3xl md:text-5xl leading-snug mt-2 font-bold">{result.ja}</p>
            <p className="text-xs italic text-ink/50 mt-2">{result.romaji}</p>
            <div className="flex gap-2 flex-wrap pt-2">
              <button className="pill" onClick={() => speak(result.ja)}>🔊 Play</button>
              <CopyChip text={result.ja} label="Copy JP" />
              <Link href={`/translate/show?ja=${encodeURIComponent(result.ja)}`} className="pill">Full-screen</Link>
            </div>
            {result.context_note && (
              <p className="text-xs text-ink/55 mt-3 border-t border-black/5 pt-2 italic">
                💡 {result.context_note}
              </p>
            )}
          </section>
        </>
      )}

      <section className="card">
        <p className="text-xs uppercase tracking-widest text-ink/50 mb-1">Quick phrases</p>
        <div className="flex flex-wrap gap-1.5">
          {[
            'Is this vegetarian? No fish, no meat, no eggs, no dashi please.',
            'Where is the bathroom?',
            'Could we have a high chair for our 4-year-old?',
            'Please take us to this address.',
            'How much does this cost?',
            'Is there an English menu?',
            'No onion, no garlic please.',
          ].map(p => (
            <button key={p} className="pill text-xs" onClick={() => translate(p)}>{p.slice(0, 36)}{p.length > 36 ? '…' : ''}</button>
          ))}
        </div>
      </section>
    </div>
  )
}
