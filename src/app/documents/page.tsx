'use client'

import Link from 'next/link'
import { useState } from 'react'
import { DOCUMENTS, FAMILY, type DocItem } from '@/lib/trip'
import { getSupabaseBrowser, hasSupabase } from '@/lib/supabase/client'

const TYPE_LABELS: Record<DocItem['type'], string> = {
  passport: '🛂 Passport',
  visa: '🎟️ Japan visa',
  eid: '🪪 Emirates ID',
  certificate: '📜 Certificate',
  birth: '👶 Birth certificate',
  other: '📄 Other',
}

export default function DocumentsPage() {
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const supa = hasSupabase()

  async function open(path: string) {
    setErr(null)
    if (!supa) { setErr('Connect Supabase to view files.'); return }
    setBusy(path)
    const c = getSupabaseBrowser()!
    const { data, error } = await c.storage.from('documents').createSignedUrl(path, 60 * 10)
    setBusy(null)
    if (error || !data?.signedUrl) {
      setErr(error?.message || 'Could not open this file. Has it been uploaded yet?')
      return
    }
    window.open(data.signedUrl, '_blank')
  }

  return (
    <div className="px-5 py-3 space-y-4">
      <h1 className="h-display text-2xl">Documents</h1>
      <p className="text-sm text-ink/60">
        Passports, visas, Emirates IDs, certificates — stored privately in Supabase.
        Tap a row to open the PDF (a fresh signed link is generated each time, valid for 10 min).
      </p>

      {!supa && (
        <div className="card card-bordered-gold text-sm">
          Connect Supabase to read documents. Add env vars and redeploy.
        </div>
      )}
      {err && <p className="text-vermilion text-sm">{err}</p>}

      {[...FAMILY, { id: 'family', name: 'Family', nameJa: '家族', role: 'Shared' as any } as any].map((f: any) => {
        const docs = DOCUMENTS.filter(d => d.who === f.id)
        if (docs.length === 0) return null
        return (
          <section key={f.id} className="card">
            <header className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium">{f.name}</p>
                {f.nameJa && <p className="jp text-xs text-ink/55">{f.nameJa}</p>}
              </div>
              {f.id !== 'family' && <Link href={`/family/${f.id}`} className="pill">Profile →</Link>}
            </header>
            <ul className="space-y-1.5">
              {docs.map(d => (
                <li key={d.id}>
                  <button
                    onClick={() => open(d.path)}
                    className="w-full flex items-center justify-between text-left px-3 py-2 rounded-lg bg-paper hover:bg-black/[0.03]"
                  >
                    <span className="text-sm">
                      {TYPE_LABELS[d.type]} <span className="text-ink/55">· {d.title}</span>
                    </span>
                    <span className="text-xs text-ink/45">{busy === d.path ? '…' : 'Open'}</span>
                  </button>
                  <p className="text-[10px] text-ink/40 px-3 font-mono">{d.path}</p>
                </li>
              ))}
            </ul>
          </section>
        )
      })}

      <div className="card text-xs text-ink/60 space-y-1.5">
        <p className="font-medium text-ink">How to upload</p>
        <p>Supabase Dashboard → Storage → create a private bucket called <span className="font-mono">documents</span> (one-time).</p>
        <p>Inside that bucket, create folders <span className="font-mono">sutharsan/</span>, <span className="font-mono">divya/</span>, <span className="font-mono">adira/</span>, <span className="font-mono">family/</span>.</p>
        <p>Upload each PDF using the exact filenames shown above (e.g. <span className="font-mono">passport.pdf</span>).</p>
      </div>
    </div>
  )
}
