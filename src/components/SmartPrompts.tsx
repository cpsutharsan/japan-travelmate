'use client'

import { useEffect, useState } from 'react'
import { db, type HappyRow } from '@/lib/db'
import { todayISO } from '@/lib/select'

/**
 * Smart Day Adjuster — reads the last 2 Happy Meter entries and surfaces gentle
 * suggestions on the home screen. Pure heuristics, no alarms.
 */
export function SmartPrompts() {
  const [prompts, setPrompts] = useState<string[]>([])

  useEffect(() => {
    (async () => {
      const d = await db()
      const all = await d.getAllFromIndex('happy', 'by-date')
      const sorted = all.sort((a, b) => a.date.localeCompare(b.date))
      const today = todayISO()
      const past = sorted.filter(r => r.date < today).slice(-2)
      const out: string[] = []
      if (past.length === 0) return
      const last = past[past.length - 1]
      if (last.meltdown === 'major') out.push('Adira had a major meltdown yesterday — consider a slower morning today.')
      if (last.sleep <= 2) out.push("Adira's sleep last night was rough — maybe skip an evening activity.")
      const lowMeals = past.filter(r => {
        const m = r.meals || { breakfast: false, lunch: false, dinner: false, snacks: false }
        const count = [m.breakfast, m.lunch, m.dinner].filter(Boolean).length
        return count <= 1
      })
      if (lowMeals.length >= 2) out.push("Adira hasn't eaten much in the last two days — try familiar food today (T's Tantan ramen / Indian).")
      setPrompts(out)
    })()
  }, [])

  if (prompts.length === 0) return null
  return (
    <div className="card card-bordered-gold space-y-2">
      <h3 className="text-sm font-medium">A gentle nudge</h3>
      <ul className="text-sm text-ink/75 space-y-1 list-disc list-inside">
        {prompts.map((p, i) => <li key={i}>{p}</li>)}
      </ul>
    </div>
  )
}
