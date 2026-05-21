'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { FAMILY, type Family } from '@/lib/trip'
import { db, getSettings, setSettings } from '@/lib/db'
import { CopyChip } from '@/components/CopyChip'

export default function FamilyDetail() {
  const id = (useParams().id as Family['id'])
  const base = FAMILY.find(f => f.id === id)
  const [override, setOverride] = useState<Record<string, string>>({})
  const [revealPassport, setRevealPassport] = useState(false)
  const [active, setActive] = useState<'roaming' | 'esim'>('roaming')

  useEffect(() => {
    (async () => {
      const d = await db()
      const o = await d.get('profiles', id)
      if (o?.data) setOverride(o.data as any)
      const s = await getSettings()
      setActive(s.activePhoneLabel)
    })()
  }, [id])

  if (!base) return <p className="px-5 py-6">Not found.</p>
  const merged: Family = { ...base, ...override } as any

  async function save(patch: Record<string, string>) {
    const next = { ...override, ...patch }
    setOverride(next)
    const d = await db(); await d.put('profiles', { id, data: next, ts: Date.now() })
  }

  async function changeActive(v: 'roaming' | 'esim') {
    setActive(v); await setSettings({ activePhoneLabel: v })
  }

  const activeNumber = active === 'esim' ? merged.esimJp : merged.mobileRoaming
  const vcard = makeVCard(merged)

  return (
    <div className="px-5 py-3 space-y-3">
      <Link href="/family" className="text-sm text-ink/60">← All</Link>

      <section className="card text-center">
        <div className="w-24 h-24 rounded-full bg-paper border border-black/10 mx-auto grid place-items-center text-3xl">
          {merged.name.slice(0, 1)}
        </div>
        <h1 className="h-display text-3xl mt-3">{merged.name}</h1>
        <p className="jp text-xl">{merged.nameJa}</p>
        <p className="text-xs text-ink/55">{merged.role}{merged.age ? ` · age ${merged.age}` : ''}</p>
      </section>

      <section className="card space-y-3">
        <p className="text-xs uppercase tracking-widest text-ink/50">Phones</p>
        <Row label="📱 Dubai" value={merged.mobileDubai ?? ''}
             onChange={v => save({ mobileDubai: v })} editable />
        <Row label="🌏 Roaming" value={merged.mobileRoaming ?? ''}
             onChange={v => save({ mobileRoaming: v })} editable />
        <Row label="🇯🇵 Japan eSIM" value={merged.esimJp ?? ''}
             onChange={v => save({ esimJp: v })} editable />

        <div className="pt-1">
          <p className="text-xs text-ink/55 mb-1">Currently reachable on:</p>
          <div className="flex gap-2">
            {(['roaming', 'esim'] as const).map(v => (
              <button key={v} onClick={() => changeActive(v)}
                className={`pill ${active === v ? '!bg-ink !text-paper' : ''}`}>{v}</button>
            ))}
          </div>
        </div>

        {activeNumber && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-black/5">
            <a className="btn-vermilion text-xs flex-1 !px-3" href={`tel:${activeNumber.replace(/\s/g, '')}`}>📞 Call</a>
            <a className="btn-outline text-xs flex-1 !px-3" target="_blank" rel="noreferrer"
               href={`https://wa.me/${activeNumber.replace(/\D/g, '')}`}>💬 WhatsApp</a>
          </div>
        )}
      </section>

      <section className="card space-y-2">
        <p className="text-xs uppercase tracking-widest text-ink/50">Emergency contact (Dubai)</p>
        <Row label="Name" value={merged.emergencyContactName ?? ''} onChange={v => save({ emergencyContactName: v })} editable />
        <Row label="Phone" value={merged.emergencyContactPhone ?? ''} onChange={v => save({ emergencyContactPhone: v })} editable />
      </section>

      <section className="card space-y-2">
        <p className="text-xs uppercase tracking-widest text-ink/50">Passport</p>
        <Row label="Country" value={merged.passportCountry ?? ''} onChange={v => save({ passportCountry: v })} editable />
        <Row label="Number" value={revealPassport ? (merged.passportNumber ?? '') : '•••• tap reveal'} onChange={v => save({ passportNumber: v })} editable={revealPassport} />
        <Row label="Expiry" value={merged.passportExpiry ?? ''} onChange={v => save({ passportExpiry: v })} editable />
        <button className="pill" onClick={() => setRevealPassport(v => !v)}>{revealPassport ? 'Hide' : 'Reveal'} passport</button>
      </section>

      <section className="card space-y-2">
        <p className="text-xs uppercase tracking-widest text-ink/50">Medical</p>
        <Row label="Blood group" value={merged.bloodGroup ?? ''} onChange={v => save({ bloodGroup: v })} editable />
        <Row label="Notes" value={merged.medical ?? ''} onChange={v => save({ medical: v })} editable />
        {id === 'adira' && <Row label="Allergies" value={merged.allergies ?? ''} onChange={v => save({ allergies: v })} editable />}
      </section>

      <a className="btn-outline w-full" download={`${merged.name}.vcf`}
         href={`data:text/vcard;charset=utf-8,${encodeURIComponent(vcard)}`}>
        📇 Share contact (vCard)
      </a>
      <CopyChip text={vcard} label="Copy vCard text" />
    </div>
  )
}

function Row({ label, value, onChange, editable }: { label: string; value: string; onChange?: (v: string) => void; editable?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs text-ink/55">{label}</span>
      {editable
        ? <input className="input mt-1" value={value} onChange={e => onChange?.(e.target.value)} />
        : <p className="text-sm mt-1 break-all">{value}</p>}
    </label>
  )
}

function makeVCard(f: Family) {
  return [
    'BEGIN:VCARD', 'VERSION:3.0',
    `FN:${f.name}`,
    `N:${f.name};;;;`,
    `X-NAME-JA:${f.nameJa}`,
    f.mobileRoaming ? `TEL;TYPE=cell;TYPE=voice:${f.mobileRoaming}` : '',
    f.mobileDubai ? `TEL;TYPE=home:${f.mobileDubai}` : '',
    f.esimJp ? `TEL;TYPE=work:${f.esimJp}` : '',
    'END:VCARD',
  ].filter(Boolean).join('\n')
}
