import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  const store = cookies()
  return createServerClient(url, key, {
    cookies: {
      get(name: string) { return store.get(name)?.value },
      set() { /* no-op in RSC; auth is handled by middleware */ },
      remove() { /* no-op */ },
    },
  })
}
