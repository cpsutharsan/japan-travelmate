'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { VEGETARIAN_CARD } from '@/lib/trip'

export default function VegetarianCardPage() {
  const router = useRouter()
  const [jain, setJain] = useState(false)

  useEffect(() => {
    // Hint the device to allow landscape if the user rotates.
    const meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]')
    const prev = meta?.content
    if (meta) meta.content = 'width=device-width, initial-scale=1, viewport-fit=cover'
    return () => { if (meta && prev) meta.content = prev }
  }, [])

  return (
    <main
      onClick={() => router.back()}
      className="min-h-[100dvh] bg-paper px-6 py-10 grid place-items-center"
      style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 24px)' }}
    >
      <div className="max-w-2xl w-full">
        <div className="relative bg-white border border-black/10 rounded-3xl shadow-paper p-8 md:p-12">
          <div className="absolute -top-4 left-6 text-xs px-3 py-1 rounded-full bg-vermilion text-white tracking-widest">
            VEGETARIAN CARD
          </div>

          <h1 className="jp text-3xl md:text-5xl leading-snug font-bold text-vermilion">
            {VEGETARIAN_CARD.header}
          </h1>
          <p className="jp text-2xl md:text-4xl leading-relaxed mt-6">
            {VEGETARIAN_CARD.body}
          </p>
          {jain && (
            <p className="jp text-2xl md:text-3xl leading-relaxed mt-3 text-indigo">
              {VEGETARIAN_CARD.jain}
            </p>
          )}
          <p className="jp text-2xl md:text-4xl leading-relaxed mt-6 font-medium">
            {VEGETARIAN_CARD.footer}
          </p>

          <hr className="my-6 border-black/10" />

          <p className="text-sm md:text-base text-ink/70 leading-relaxed">
            {VEGETARIAN_CARD.en}
            {jain && ' (Also no onion or garlic, please.)'}
          </p>

          <div
            className="mt-8 flex items-center justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={jain}
                onChange={(e) => setJain(e.target.checked)}
              />
              Jain (no onion/garlic)
            </label>
            <button
              className="btn-outline text-sm"
              onClick={() => router.back()}
            >
              Tap to exit
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-ink/50 mt-4">
          Hand the phone to the staff. Cached for offline use.
        </p>
      </div>
    </main>
  )
}
