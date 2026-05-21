'use client'

import { useRouter } from 'next/navigation'
import { FAMILY, ADIRA_CARD_JA } from '@/lib/trip'
import { useEffect, useState } from 'react'

export default function AdiraShow() {
  const router = useRouter()
  const [hotelLine, setHotelLine] = useState('ホテル未定')
  const [phones, setPhones] = useState('')

  useEffect(() => {
    // Pull data on client to make the show card cache-friendly.
    import('@/lib/select').then(({ hotelForNight, todayISO }) => {
      const today = todayISO()
      const h = hotelForNight(today)
      if (h) setHotelLine(`${h.nameJa ?? h.name} — ${h.addressJa}`)
      const s = FAMILY.find(f => f.id === 'sutharsan')!
      const d = FAMILY.find(f => f.id === 'divya')!
      setPhones(`${s.mobileRoaming ?? s.mobileDubai ?? ''} / ${d.mobileRoaming ?? d.mobileDubai ?? ''}`)
    })
  }, [])

  return (
    <main onClick={() => router.back()} className="min-h-[100dvh] bg-paper px-6 py-10 grid place-items-center">
      <div className="bg-white border border-black/10 rounded-3xl shadow-paper p-8 md:p-12 max-w-2xl w-full text-center">
        <div className="w-24 h-24 rounded-full bg-paper border border-black/10 mx-auto grid place-items-center text-3xl">A</div>
        <h1 className="h-display text-3xl mt-3">アディラ · Adira</h1>
        <pre className="jp text-2xl md:text-3xl whitespace-pre-wrap leading-relaxed mt-4">{ADIRA_CARD_JA(phones, hotelLine)}</pre>
        <p className="text-xs text-ink/55 mt-6">Tap anywhere to close</p>
      </div>
    </main>
  )
}
