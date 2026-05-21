'use client'

import { useEffect, useState } from 'react'
import { db, uid, type ContactRow } from '@/lib/db'
import { todayISO } from '@/lib/select'

const TEMPLATES = [
  'Hi! Here are today\'s photos from {city}. Adira had a blast at {activity}.',
  'Arrived safely. All well. Photos from today.',
  'Will call tonight. Quick photo update.',
]

export default function PhotoShare() {
  const [contacts, setContacts] = useState<ContactRow[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [group, setGroup] = useState('Family')
  const [tpl, setTpl] = useState(TEMPLATES[0])
  const [sentToday, setSentToday] = useState<Record<string, string>>({})

  useEffect(() => {
    (async () => {
      const d = await db(); setContacts(await d.getAll('contacts'))
      try { setSentToday(JSON.parse(localStorage.getItem(`sent-${todayISO()}`) || '{}')) } catch {}
    })()
  }, [])

  async function add() {
    if (!name || !phone) return
    const row: ContactRow = { id: uid(), name, phone, group, ts: Date.now() }
    const d = await db(); await d.put('contacts', row)
    setContacts(p => [...p, row])
    setName(''); setPhone(''); setGroup('Family')
  }

  async function remove(id: string) {
    const d = await db(); await d.delete('contacts', id)
    setContacts(p => p.filter(c => c.id !== id))
  }

  function send(c: ContactRow) {
    const msg = encodeURIComponent(tpl.replace('{city}', '').replace('{activity}', ''))
    const url = `https://wa.me/${c.phone.replace(/\D/g, '')}?text=${msg}`
    window.open(url, '_blank')
    const next = { ...sentToday, [c.id]: new Date().toISOString() }
    setSentToday(next); localStorage.setItem(`sent-${todayISO()}`, JSON.stringify(next))
  }

  const grouped: Record<string, ContactRow[]> = {}
  contacts.forEach(c => { (grouped[c.group] ||= []).push(c) })

  return (
    <div className="px-5 py-3 space-y-4">
      <h1 className="h-display text-2xl">Photo sharing</h1>
      <p className="text-sm text-ink/60">One-tap WhatsApp to grandparents. Photos get attached in WhatsApp&rsquo;s share sheet.</p>

      <section className="card">
        <p className="text-xs uppercase tracking-widest text-ink/50 mb-1">Message template</p>
        <select className="input" value={tpl} onChange={e => setTpl(e.target.value)}>
          {TEMPLATES.map(t => <option key={t}>{t}</option>)}
        </select>
      </section>

      {Object.entries(grouped).map(([g, list]) => (
        <section key={g} className="card">
          <p className="text-xs uppercase tracking-widest text-ink/50 mb-2">{g}</p>
          <ul className="space-y-1.5">
            {list.map(c => (
              <li key={c.id} className="flex items-center justify-between gap-2">
                <div className="text-sm">
                  <p>{c.name}</p>
                  <p className="text-xs text-ink/55">{c.phone}{sentToday[c.id] ? ' · sent today' : ''}</p>
                </div>
                <div className="flex gap-1.5">
                  <button className="pill !bg-vermilion !text-white" onClick={() => send(c)}>Send</button>
                  <button className="pill" onClick={() => remove(c.id)}>×</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="card space-y-2">
        <p className="text-xs uppercase tracking-widest text-ink/50">Add contact</p>
        <input className="input" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="input" placeholder="+971… or +91…" value={phone} onChange={e => setPhone(e.target.value)} />
        <select className="input" value={group} onChange={e => setGroup(e.target.value)}>
          <option>Family</option><option>Friends</option><option>Sutharsan&rsquo;s side</option><option>Divya&rsquo;s side</option><option>Other</option>
        </select>
        <button className="btn-primary w-full" onClick={add}>Add</button>
      </section>
    </div>
  )
}
