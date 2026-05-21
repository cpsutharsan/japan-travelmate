'use client'

import { useMemo, useState } from 'react'
import { RESTAURANTS, type Restaurant } from '@/lib/trip'
import { cn } from '@/lib/utils'

const CITIES: Restaurant['city'][] = ['Tokyo', 'Kyoto', 'Osaka', 'Hakone']
const TYPES: Restaurant['type'][] = ['Indian', 'Vegan Japanese', 'Shojin Ryori', 'Casual']

export default function RestaurantsPage() {
  const [city, setCity] = useState<Restaurant['city'] | 'All'>('All')
  const [type, setType] = useState<Restaurant['type'] | 'All'>('All')
  const [bookingOnly, setBookingOnly] = useState(false)

  const filtered = useMemo(() => {
    return RESTAURANTS.filter(r => {
      if (city !== 'All' && r.city !== city) return false
      if (type !== 'All' && r.type !== type) return false
      if (bookingOnly && !r.bookingRequired) return false
      return true
    })
  }, [city, type, bookingOnly])

  return (
    <div className="px-5 py-3 space-y-4">
      <h1 className="h-display text-2xl">Vegetarian spots</h1>

      <div className="space-y-2">
        <Filter label="City" value={city} options={['All', ...CITIES]} onChange={v => setCity(v as any)} />
        <Filter label="Type" value={type} options={['All', ...TYPES]} onChange={v => setType(v as any)} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={bookingOnly} onChange={e => setBookingOnly(e.target.checked)} />
          Booking required only
        </label>
      </div>

      <p className="text-xs text-ink/50">{filtered.length} place{filtered.length === 1 ? '' : 's'}</p>

      <ul className="space-y-2">
        {filtered.map(r => (
          <li key={r.id} className="card card-bordered-gold space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium">{r.name}</p>
              <span className="pill text-[10px]">{r.priceRange}</span>
            </div>
            <p className="text-xs text-ink/55">{r.city} · {r.type}{r.bookingRequired ? ' · book ahead' : ''}</p>
            <p className="jp text-sm">{r.addressJa}</p>
            <p className="text-xs text-ink/60">{r.addressEn}</p>
            {r.notes && <p className="text-xs italic text-ink/55">{r.notes}</p>}
            <div className="flex gap-2 pt-1 flex-wrap">
              <a className="pill" target="_blank" rel="noreferrer"
                 href={`https://maps.google.com/?q=${encodeURIComponent(r.addressJa || r.addressEn)}`}>Maps</a>
              {r.bookingLink && (
                <a className="pill" target="_blank" rel="noreferrer" href={r.bookingLink}>Book</a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Filter({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-widest text-ink/50 mb-1">{label}</p>
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {options.map(o => (
          <button key={o} onClick={() => onChange(o)}
            className={cn(
              'pill whitespace-nowrap',
              value === o ? '!bg-ink !text-paper' : ''
            )}>
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}
