'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSupabaseBrowser, hasSupabase } from '@/lib/supabase/client'

type Item = { name: string; updated_at?: string; size?: number }

export default function BookingFilesPage() {
  const [files, setFiles] = useState<Item[]>([])
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const supa = hasSupabase()

  async function refresh() {
    if (!supa) return
    const c = getSupabaseBrowser()!
    const { data, error } = await c.storage.from('bookings').list('', { limit: 100, sortBy: { column: 'name', order: 'asc' } })
    if (error) setErr(error.message); else setFiles((data as Item[]) ?? [])
  }
  useEffect(() => { refresh() }, [supa])

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !supa) return
    setBusy(true); setErr(null)
    const c = getSupabaseBrowser()!
    const path = `${Date.now()}-${file.name.replace(/[^a-z0-9._-]/gi, '_')}`
    const { error } = await c.storage.from('bookings').upload(path, file, { upsert: false })
    if (error) setErr(error.message)
    await refresh()
    setBusy(false); e.target.value = ''
  }

  async function urlFor(name: string): Promise<string | null> {
    if (!supa) return null
    const c = getSupabaseBrowser()!
    const { data, error } = await c.storage.from('bookings').createSignedUrl(name, 60 * 30)
    if (error) { setErr(error.message); return null }
    return data?.signedUrl ?? null
  }

  return (
    <div className="px-5 py-3 space-y-3">
      <Link href="/bookings" className="text-sm text-ink/60">← All bookings</Link>
      <h1 className="h-display text-2xl">Booking files</h1>
      <p className="text-sm text-ink/60">Upload PDFs and images of confirmations. Stored in the private <span className="font-mono">bookings</span> bucket.</p>

      {!supa && (
        <div className="card card-bordered-gold text-sm">
          Connect Supabase to enable file uploads. (Add <span className="font-mono">NEXT_PUBLIC_SUPABASE_URL</span> &amp; key, then redeploy.)
        </div>
      )}

      <label className="btn-primary cursor-pointer inline-block">
        {busy ? 'Uploading…' : '📎 Upload file'}
        <input type="file" className="hidden" onChange={upload}
               accept="application/pdf,image/*" disabled={busy || !supa} />
      </label>

      {err && <p className="text-vermilion text-sm">{err}</p>}

      <ul className="space-y-2">
        {files.map(f => (
          <li key={f.name} className="card flex items-center justify-between">
            <span className="text-sm break-all">{f.name}</span>
            <button className="pill"
                    onClick={async () => { const u = await urlFor(f.name); if (u) window.open(u, '_blank') }}>
              Open
            </button>
          </li>
        ))}
        {files.length === 0 && supa && <p className="text-sm text-ink/55">No files yet.</p>}
      </ul>
    </div>
  )
}
