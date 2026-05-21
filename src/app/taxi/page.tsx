'use client'

import { Suspense, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { HOTELS, TAXI_DESTINATIONS } from '@/lib/trip'
import { hotelForNight, todayISO } from '@/lib/select'

export default function TaxiPage() {
  return (
    <Suspense fallback={<div className="px-5 py-3">Loading…</div>}>
      <Inner />
    </Suspense>
  )
}

function Inner() {
  const params = useSearchParams()
  const initial = params.get('to') ?? ''
  const [pick, setPick] = useState<string>(initial)

  const today = todayISO()
  const tonightHotel = hotelForNight(today)

  const sets = useMemo(() => {
    const hotelItems = HOTELS.map(h => ({ id: h.id, label: h.name, nameJa: h.nameJa ?? h.name, addressJa: h.addressJa }))
    return { hotels: hotelItems, places: TAXI_DESTINATIONS }
  }, [])

  const selected =
    sets.hotels.find(h => h.id === pick) ||
    sets.places.find(p => p.id === pick) ||
    (tonightHotel ? { id: tonightHotel.id, label: tonightHotel.name, nameJa: tonightHotel.nameJa ?? tonightHotel.name, addressJa: tonightHotel.addressJa } : null)

  return (
    <div className="px-5 py-3 space-y-4">
      <h1 className="h-display text-2xl">🚕 Taxi card</h1>

      {tonightHotel && !pick && (
        <Link href={`/taxi/show?id=${tonightHotel.id}`} className="btn-vermilion w-full !min-h-[64px] !text-base">
          Take me to {tonightHotel.name} (tonight)
        </Link>
      )}

      <section className="card">
        <p className="text-xs uppercase tracking-widest text-ink/50 mb-2">Hotels</p>
        <ul className="space-y-1">
          {sets.hotels.map(h => (
            <li key={h.id}>
              <button onClick={() => setPick(h.id)}
                className={`w-full text-left card !p-3 ${pick === h.id ? 'ring-2 ring-vermilion' : ''}`}>
                <p className="text-sm font-medium">{h.label}</p>
                <p className="jp text-xs text-ink/55">{h.addressJa}</p>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <p className="text-xs uppercase tracking-widest text-ink/50 mb-2">Common destinations</p>
        <ul className="space-y-1">
          {sets.places.map(p => (
            <li key={p.id}>
              <button onClick={() => setPick(p.id)}
                className={`w-full text-left card !p-3 ${pick === p.id ? 'ring-2 ring-vermilion' : ''}`}>
                <p className="text-sm font-medium">{p.label}</p>
                <p className="jp text-xs text-ink/55">{p.nameJa} · {p.addressJa}</p>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {selected && (
        <Link href={`/taxi/show?id=${selected.id}`} className="btn-primary w-full">
          Show this to the driver →
        </Link>
      )}
    </div>
  )
}
