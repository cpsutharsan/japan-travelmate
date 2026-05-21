'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { HOTELS, TAXI_DESTINATIONS } from '@/lib/trip'

export default function TaxiShow() {
  return (
    <Suspense fallback={<main className="p-10 text-center">…</main>}>
      <Inner />
    </Suspense>
  )
}

function Inner() {
  const router = useRouter()
  const id = useSearchParams().get('id') ?? ''
  const hotel = HOTELS.find(h => h.id === id)
  const place = TAXI_DESTINATIONS.find(p => p.id === id)
  if (!hotel && !place) {
    return <main className="p-10">Unknown destination. <button onClick={() => router.back()}>Back</button></main>
  }

  const nameJa = hotel ? (hotel.nameJa ?? hotel.name) : place!.nameJa
  const addrJa = hotel ? hotel.addressJa : place!.addressJa
  const addrEn = hotel ? hotel.addressEn : ''
  const phone  = hotel ? (hotel.phone ?? '') : ''

  return (
    <main onClick={() => router.back()} className="min-h-[100dvh] bg-paper grid place-items-center px-6 py-10">
      <div className="bg-white border border-black/10 rounded-3xl shadow-paper p-8 md:p-12 max-w-2xl w-full text-center">
        <p className="text-xs uppercase tracking-widest text-vermilion">Please take us to</p>
        <h1 className="jp text-4xl md:text-6xl leading-snug mt-3 font-bold">{nameJa}</h1>
        <p className="jp text-2xl md:text-3xl leading-relaxed mt-4">{addrJa}</p>
        {phone && <p className="text-sm text-ink/65 mt-3">電話: {phone}</p>}
        {addrEn && <p className="text-xs text-ink/55 mt-2">{addrEn}</p>}
        <p className="text-xs text-ink/45 mt-8">Tap anywhere to close</p>
      </div>
    </main>
  )
}
