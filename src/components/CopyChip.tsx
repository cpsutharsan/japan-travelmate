'use client'

import { useState } from 'react'
import { copyText } from '@/lib/utils'

export function CopyChip({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { copyText(text); setCopied(true); setTimeout(() => setCopied(false), 1200) }}
      className="pill text-[11px] hover:bg-black/10"
      aria-label={`Copy ${label ?? text}`}
    >
      {copied ? 'Copied' : (label ?? 'Copy')}
    </button>
  )
}
