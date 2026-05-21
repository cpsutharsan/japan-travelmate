/**
 * Lightweight daily spend cap for Claude API calls.
 * Counts requests per UTC day in localStorage; refuses past the cap.
 * Translation calls are very cheap (Haiku) so we count them separately from
 * chat calls (Sonnet), allowing more translations per day.
 */

const CAPS = { translate: 120, chat: 60 } as const

function key(kind: keyof typeof CAPS) {
  const day = new Date().toISOString().slice(0, 10)
  return `tm-claude-${kind}-${day}`
}

export function spendCount(kind: keyof typeof CAPS): number {
  if (typeof localStorage === 'undefined') return 0
  return Number(localStorage.getItem(key(kind)) || 0)
}

export function spendCap(kind: keyof typeof CAPS): number {
  return CAPS[kind]
}

export function spendCheckAndIncrement(kind: keyof typeof CAPS): { ok: true } | { ok: false; reason: string } {
  if (typeof localStorage === 'undefined') return { ok: true }
  const cur = spendCount(kind)
  if (cur >= CAPS[kind]) {
    return { ok: false, reason: `Daily ${kind} cap reached (${CAPS[kind]}). Try again tomorrow.` }
  }
  localStorage.setItem(key(kind), String(cur + 1))
  return { ok: true }
}
