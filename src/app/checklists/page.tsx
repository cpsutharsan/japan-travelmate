'use client'

import { useEffect, useState } from 'react'
import { CHECKLISTS } from '@/lib/trip'
import { db } from '@/lib/db'

export default function ChecklistsPage() {
  const [state, setState] = useState<Record<string, boolean>>({})

  useEffect(() => {
    (async () => {
      const d = await db()
      const all = await d.getAll('checklist')
      const m: Record<string, boolean> = {}
      all.forEach(x => m[x.id] = x.checked)
      setState(m)
    })()
  }, [])

  async function toggle(id: string) {
    const next = !state[id]
    setState(p => ({ ...p, [id]: next }))
    const d = await db(); await d.put('checklist', { id, checked: next, ts: Date.now() })
  }

  return (
    <div className="px-5 py-3 space-y-4">
      <h1 className="h-display text-2xl">Checklists</h1>

      {CHECKLISTS.map(c => {
        const done = c.items.filter(i => state[i.id]).length
        return (
          <section key={c.id} className="card">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{c.title}</h2>
              <span className="text-xs text-ink/55">{done}/{c.items.length}</span>
            </div>
            <ul className="mt-2 space-y-1.5">
              {c.items.map(it => (
                <li key={it.id}>
                  <label className="flex items-start gap-2 text-sm">
                    <input type="checkbox" checked={!!state[it.id]} onChange={() => toggle(it.id)} className="mt-0.5" />
                    <span className={state[it.id] ? 'line-through text-ink/40' : ''}>{it.text}</span>
                  </label>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
