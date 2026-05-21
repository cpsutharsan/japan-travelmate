'use client'

import { useEffect, useState } from 'react'
import { minutesUntil } from '@/lib/select'

export function Countdown({ dateISO, hhmm, label }: { dateISO: string; hhmm: string; label?: string }) {
  const [mins, setMins] = useState(() => minutesUntil(dateISO, hhmm))
  useEffect(() => {
    const id = setInterval(() => setMins(minutesUntil(dateISO, hhmm)), 30_000)
    return () => clearInterval(id)
  }, [dateISO, hhmm])

  if (mins < -240) return <span className="text-ink/40">Past</span>
  if (mins < 0)    return <span className="text-vermilion font-mono">happening now</span>
  if (mins < 60)   return <span className="font-mono">{mins} min{label ? ` · ${label}` : ''}</span>
  const h = Math.floor(mins / 60), m = mins % 60
  return <span className="font-mono">{h}h {m}m{label ? ` · ${label}` : ''}</span>
}
