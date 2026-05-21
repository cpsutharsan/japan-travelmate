'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabaseBrowser, hasSupabase } from '@/lib/supabase/client'

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-[100dvh] grid place-items-center">Loading…</main>}>
      <LoginInner />
    </Suspense>
  )
}

function LoginInner() {
  const router = useRouter()
  const next = useSearchParams().get('next') || '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const supa = hasSupabase()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setErr(null); setInfo(null)
    const client = getSupabaseBrowser()
    if (!client) { setErr('Supabase is not configured yet — add env vars and redeploy.'); setBusy(false); return }
    try {
      if (mode === 'signin') {
        const { error } = await client.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.replace(next)
      } else {
        const { error } = await client.auth.signUp({ email, password })
        if (error) throw error
        setInfo('Check your inbox to confirm the account, then sign in.')
        setMode('signin')
      }
    } catch (e: any) {
      setErr(e?.message ?? 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  function skip() { router.replace(next) }

  return (
    <main className="min-h-[100dvh] grid place-items-center px-5 py-10 bg-paper">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white shadow-paper grid place-items-center mb-3">
            <span aria-hidden className="block w-9 h-9" style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><g fill='none' stroke='%23d23a2c' stroke-width='4' stroke-linecap='round'><path d='M8 16h48M10 22h44'/><path d='M16 22v38M48 22v38'/><path d='M20 32h24'/></g></svg>\")",
              backgroundSize: 'contain', backgroundRepeat: 'no-repeat',
            }} />
          </div>
          <h1 className="h-display text-2xl">Japan TravelMate</h1>
          <p className="text-sm text-ink/60 mt-1">22 – 30 May 2026 · Family of 3</p>
        </div>

        <form onSubmit={submit} className="card space-y-3">
          <h2 className="font-medium">{mode === 'signin' ? 'Sign in' : 'Create an account'}</h2>
          <label className="block">
            <span className="text-xs text-ink/60">Email</span>
            <input className="input mt-1" type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          </label>
          <label className="block">
            <span className="text-xs text-ink/60">Password</span>
            <input className="input mt-1" type="password" required value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
            Remember me on this device
          </label>
          {err && <p className="text-vermilion text-sm">{err}</p>}
          {info && <p className="text-sage text-sm">{info}</p>}

          <button className="btn-primary w-full" disabled={busy}>
            {busy ? '…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>

          <button type="button" className="text-sm text-ink/60 underline w-full"
                  onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
            {mode === 'signin' ? "First time? Create the family account →" : 'Already have an account? Sign in →'}
          </button>

          {!supa && (
            <div className="text-xs text-ink/60 border border-dashed border-black/15 rounded-xl p-3">
              <p className="font-medium text-ink mb-1">Demo mode</p>
              <p>Supabase env vars are not set yet. You can still browse the app locally — your data will live only on this device.</p>
              <button type="button" className="btn-outline mt-2 w-full" onClick={skip}>Enter demo mode →</button>
            </div>
          )}
        </form>

        <p className="text-center text-xs text-ink/50 mt-4">
          Two users supported: <span className="font-mono">sutharsan</span> &amp; <span className="font-mono">divya</span> — both see the same data.
        </p>
      </div>
    </main>
  )
}
