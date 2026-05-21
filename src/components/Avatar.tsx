'use client'

import { useEffect, useState } from 'react'
import { getSupabaseBrowser, hasSupabase } from '@/lib/supabase/client'

/**
 * Shows a family member's avatar from the private `profiles` bucket.
 * Falls back to a first-initial circle if the file isn't there yet.
 * Caches signed URLs per session to avoid one round-trip per render.
 */
const cache: Record<string, string | null> = {}

const EXTS = ['jpg', 'png', 'jpeg', 'webp', 'heic']

export function Avatar({ id, name, size = 48, className = '' }: { id: string; name: string; size?: number; className?: string }) {
  const [url, setUrl] = useState<string | null>(cache[id] ?? null)

  useEffect(() => {
    if (cache[id] !== undefined) { setUrl(cache[id]); return }
    if (!hasSupabase()) { cache[id] = null; setUrl(null); return }
    let cancelled = false
    ;(async () => {
      const c = getSupabaseBrowser()!
      for (const ext of EXTS) {
        const { data } = await c.storage.from('profiles').createSignedUrl(`${id}/avatar.${ext}`, 60 * 60)
        if (data?.signedUrl) {
          cache[id] = data.signedUrl
          if (!cancelled) setUrl(data.signedUrl)
          return
        }
      }
      cache[id] = null
      if (!cancelled) setUrl(null)
    })()
    return () => { cancelled = true }
  }, [id])

  const px = `${size}px`
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        width={size}
        height={size}
        className={`rounded-full object-cover border border-black/10 ${className}`}
        style={{ width: px, height: px }}
      />
    )
  }
  return (
    <span
      aria-label={name}
      className={`inline-flex rounded-full bg-paper border border-black/10 items-center justify-center font-display ${className}`}
      style={{ width: px, height: px, fontSize: `${size * 0.4}px` }}
    >
      {name.slice(0, 1)}
    </span>
  )
}

export function invalidateAvatar(id: string) { delete cache[id] }
