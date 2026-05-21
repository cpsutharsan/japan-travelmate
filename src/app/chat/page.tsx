'use client'

import { useEffect, useRef, useState } from 'react'
import { spendCap, spendCheckAndIncrement, spendCount } from '@/lib/spend'

type Part =
  | { type: 'text'; text: string }
  | { type: 'image'; mediaType: string; dataBase64: string; previewUrl: string }

type Msg = {
  id: string
  role: 'user' | 'assistant'
  parts: Part[]
  ts: number
  streaming?: boolean
}

const STORAGE_KEY = 'tm-chat-history-v1'
const MAX_KEEP = 40    // trim to last N messages so the API doesn't blow up

function load(): Msg[] {
  if (typeof localStorage === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function persist(msgs: Msg[]) {
  // Drop the data URLs of older images before persisting — they bloat localStorage.
  const trimmed = msgs.slice(-MAX_KEEP).map((m, i, arr) => {
    const old = arr.length - i > 6
    return {
      ...m,
      parts: m.parts.map(p => {
        if (p.type === 'image' && old) return { ...p, dataBase64: '', previewUrl: '' }
        return p
      }),
    }
  })
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed)) } catch {}
}

function uid() {
  return (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)
}

export default function ChatPage() {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState<Part[]>([]) // pending images to attach
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [used, setUsed] = useState(0)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMsgs(load()); setUsed(spendCount('chat')) }, [])
  useEffect(() => { persist(msgs); endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  async function pickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (!/^image\//.test(f.type)) { setErr('Image files only'); return }
    if (f.size > 4 * 1024 * 1024) { setErr('Image must be under 4 MB'); return }
    setErr(null)
    const buf = await f.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buf)))
    setPending(p => [...p, { type: 'image', mediaType: f.type, dataBase64: base64, previewUrl: URL.createObjectURL(f) }])
    e.target.value = ''
  }

  async function send() {
    const text = input.trim()
    if (!text && pending.length === 0) return
    const guard = spendCheckAndIncrement('chat')
    if (!guard.ok) { setErr(guard.reason); return }
    setUsed(spendCount('chat'))
    setErr(null)

    const userParts: Part[] = [...pending, ...(text ? [{ type: 'text' as const, text }] : [])]
    const userMsg: Msg = { id: uid(), role: 'user', parts: userParts, ts: Date.now() }
    const assistMsg: Msg = { id: uid(), role: 'assistant', parts: [{ type: 'text', text: '' }], ts: Date.now(), streaming: true }
    const next = [...msgs, userMsg, assistMsg]
    setMsgs(next)
    setInput(''); setPending([])
    setBusy(true)

    // Build the API payload — drop preview-only fields and strip empty old images.
    const payload = next
      .filter(m => !m.streaming)
      .slice(-MAX_KEEP)
      .map(m => ({
        role: m.role,
        content: m.parts
          .filter(p => p.type !== 'image' || (p as any).dataBase64)
          .map(p => p.type === 'image'
            ? { type: 'image', mediaType: p.mediaType, dataBase64: p.dataBase64 }
            : { type: 'text', text: p.text }),
      }))

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: payload }),
      })
      if (!res.ok || !res.body) {
        const t = await res.text().catch(() => '')
        throw new Error(t || `HTTP ${res.status}`)
      }
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''
        for (const line of lines) {
          if (!line.startsWith('data:')) continue
          const data = line.slice(5).trim()
          if (!data) continue
          try {
            const parsed = JSON.parse(data)
            if (typeof parsed.delta === 'string') {
              setMsgs(prev => {
                const out = [...prev]
                const last = out[out.length - 1]
                if (last && last.role === 'assistant') {
                  const tp = last.parts[0]
                  if (tp.type === 'text') tp.text += parsed.delta
                }
                return out
              })
            }
          } catch {}
        }
      }
      setMsgs(prev => {
        const out = [...prev]
        const last = out[out.length - 1]
        if (last) delete last.streaming
        return out
      })
    } catch (e: any) {
      setErr(e?.message ?? 'Chat failed')
      setMsgs(prev => prev.slice(0, -1))   // drop the empty assistant turn
    } finally {
      setBusy(false)
    }
  }

  function clearChat() {
    if (!confirm('Clear chat history?')) return
    setMsgs([])
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }

  return (
    <div className="px-5 py-3 space-y-3 pb-32">
      <div className="flex items-center justify-between">
        <h1 className="h-display text-2xl">💬 Travel chat</h1>
        <button onClick={clearChat} className="text-xs text-ink/55 underline">Clear</button>
      </div>
      <p className="text-xs text-ink/50">
        Used today: <span className="font-mono">{used}</span>/{spendCap('chat')}
        · Backed by Claude Sonnet · Vegetarian + family context loaded
      </p>

      {msgs.length === 0 && (
        <div className="card">
          <p className="text-xs uppercase tracking-widest text-ink/50 mb-2">Try asking</p>
          <ul className="text-sm space-y-1 text-ink/75">
            <li>• &ldquo;What's open on Sunday near Minn Ueno that's vegetarian?&rdquo;</li>
            <li>• &ldquo;Adira is tired — what's a quiet thing to do near our hotel?&rdquo;</li>
            <li>• &ldquo;How do we get from Ueno to Maihama for Disneyland?&rdquo;</li>
            <li>• 📷 Take a photo of a menu and ask &ldquo;is anything on this veg?&rdquo;</li>
          </ul>
        </div>
      )}

      <div className="space-y-2">
        {msgs.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-snug ${
              m.role === 'user' ? 'bg-ink text-paper' : 'bg-white border border-black/5 shadow-paper'
            }`}>
              {m.parts.map((p, i) =>
                p.type === 'image'
                  ? (p.previewUrl
                    ? <img key={i} src={p.previewUrl} className="rounded-lg mb-2 max-h-48" alt="" />
                    : <p key={i} className="text-[11px] text-ink/45 italic">[photo]</p>)
                  : <p key={i} className="whitespace-pre-wrap">{p.text}{m.streaming && i === m.parts.length - 1 ? '▍' : ''}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {err && <p className="text-vermilion text-sm">{err}</p>}

      <div className="fixed bottom-[calc(70px+var(--safe-bottom))] inset-x-0 z-40 px-5 pt-2 pb-3 bg-paper border-t border-black/5">
        {pending.length > 0 && (
          <div className="flex gap-2 mb-2">
            {pending.map((p, i) => p.type === 'image' && (
              <div key={i} className="relative">
                <img src={p.previewUrl} className="h-14 w-14 object-cover rounded-md border border-black/10" alt="" />
                <button onClick={() => setPending(prev => prev.filter((_, j) => j !== i))}
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-vermilion text-white text-xs">×</button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2">
          <label className="btn-outline !min-h-[44px] !px-3 cursor-pointer text-base">
            📷
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={pickImage} />
          </label>
          <textarea
            className="input flex-1 !min-h-[44px] resize-none"
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Ask anything…"
            disabled={busy}
          />
          <button className="btn-primary !min-h-[44px] !px-4" onClick={send} disabled={busy || (!input.trim() && pending.length === 0)}>
            {busy ? '…' : '↑'}
          </button>
        </div>
      </div>
    </div>
  )
}
