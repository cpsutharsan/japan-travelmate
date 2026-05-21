'use client'

import { useMemo, useState } from 'react'
import { PHRASES, type PhraseCategory } from '@/lib/trip'
import { cn } from '@/lib/utils'

const CATS: PhraseCategory[] = ['Restaurant', 'Train', 'Taxi', 'Shopping', 'Emergency', 'Politeness']

export default function PhraseBookPage() {
  const [cat, setCat] = useState<PhraseCategory | 'All'>('All')
  const list = useMemo(() => cat === 'All' ? PHRASES : PHRASES.filter(p => p.category === cat), [cat])

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
      <h1 className="h-display text-2xl">Phrase book</h1>
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {(['All', ...CATS] as const).map(c => (
          <button key={c} onClick={() => setCat(c as any)}
            className={cn('pill whitespace-nowrap', cat === c && '!bg-ink !text-paper')}>{c}</button>
        ))}
      </div>

      <ul className="space-y-2">
        {list.map((p, i) => (
          <li key={i} className="card space-y-1">
            <p className="text-xs uppercase tracking-widest text-ink/50">{p.category}</p>
            <p className="text-sm text-ink/80">{p.en}</p>
            <p className="jp text-xl leading-snug">{p.ja}</p>
            <p className="text-xs italic text-ink/50">{p.romaji}</p>
            <div>
              <button className="pill" onClick={() => speak(p.ja)}>🔊 Play</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
