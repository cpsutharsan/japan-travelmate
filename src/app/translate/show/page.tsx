'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function TranslateShow() {
  return (
    <Suspense fallback={<main className="p-10">…</main>}>
      <Inner />
    </Suspense>
  )
}

function Inner() {
  const router = useRouter()
  const ja = useSearchParams().get('ja') ?? ''
  return (
    <main onClick={() => router.back()} className="min-h-[100dvh] bg-paper grid place-items-center px-6 py-10">
      <div className="bg-white border border-black/10 rounded-3xl shadow-paper p-8 md:p-12 max-w-2xl w-full text-center">
        <p className="text-xs uppercase tracking-widest text-vermilion">Show this to staff</p>
        <p className="jp text-4xl md:text-6xl leading-snug mt-4 font-bold">{ja}</p>
        <p className="text-xs text-ink/45 mt-8">Tap anywhere to close</p>
      </div>
    </main>
  )
}
