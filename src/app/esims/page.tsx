'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ESIMS, ESIM_BOOKING, FAMILY } from '@/lib/trip'
import { CopyChip } from '@/components/CopyChip'

export default function EsimsPage() {
  return (
    <div className="px-5 py-3 space-y-4 pb-12">
      <h1 className="h-display text-2xl">📱 eSIMs</h1>
      <p className="text-sm text-ink/60">
        {ESIM_BOOKING.provider} · {ESIM_BOOKING.plan} · {ESIM_BOOKING.durationDays} days · 2 lines.
      </p>

      <section className="card card-bordered-gold">
        <p className="text-xs uppercase tracking-widest text-ink/50">Booking</p>
        <p className="font-mono text-lg mt-1">{ESIM_BOOKING.bookingId} <CopyChip text={ESIM_BOOKING.bookingId} /></p>
        <p className="text-xs text-ink/55 mt-1">
          ⚠️ Activate <b>after</b> you arrive in Japan — the 10-day counter starts the moment the eSIM connects to a Japanese network.
        </p>
      </section>

      {ESIMS.map(e => {
        const owner = FAMILY.find(f => f.id === e.who)
        return <EsimCard key={e.id} esim={e} ownerName={owner?.name ?? 'Shared'} />
      })}

      <section className="card">
        <p className="text-xs uppercase tracking-widest text-ink/50 mb-2">Install guide — iPhone</p>
        <ol className="text-sm text-ink/75 space-y-1 list-decimal list-inside">
          <li>Open <b>Settings → Cellular → Add eSIM → Enter Details Manually</b>.</li>
          <li>SM-DP+ Address: paste the iOS address from your card above.</li>
          <li>Activation Code: paste the iOS activation code.</li>
          <li>Tap <b>Next</b> → label it <b>&ldquo;Japan&rdquo;</b> → leave <b>iMessage / FaceTime</b> on your primary line.</li>
          <li>Default Line: <b>Primary</b> (keeps your number reachable). Cellular Data: <b>Japan</b>.</li>
          <li>Turn <b>Allow Cellular Data Switching</b> OFF (or it'll roam expensively).</li>
        </ol>
        <p className="text-xs text-ink/55 mt-2 italic">
          You only need to do this once per device. Then in Japan, toggle <b>Settings → Cellular → Japan → Turn On This Line</b>.
        </p>
      </section>

      <section className="card">
        <p className="text-xs uppercase tracking-widest text-ink/50 mb-2">Tips for the trip</p>
        <ul className="text-sm text-ink/75 space-y-1 list-disc list-inside">
          <li>Plan starts when first connected — install on the plane Wi-Fi or in DXB if possible, but <b>don't activate</b> the line until landing.</li>
          <li>Tether Adira's iPad / a second phone off either of yours — saves carrying a pocket WiFi.</li>
          <li>If one eSIM fails, you both still have data via your roaming line as a fallback.</li>
        </ul>
      </section>

      <Link href="/status" className="btn-outline w-full">← Back to booking status</Link>
    </div>
  )
}

function EsimCard({ esim, ownerName }: { esim: typeof ESIMS[number]; ownerName: string }) {
  const [reveal, setReveal] = useState(false)
  const masked = (s: string) => '•••• •••• ' + s.slice(-6)
  return (
    <section className="card card-bordered-indigo space-y-2">
      <div className="flex items-center justify-between">
        <p className="font-medium">For: {ownerName}</p>
        <span className="pill">{esim.who}</span>
      </div>
      <p className="text-[11px] font-mono text-ink/55">ICCID {esim.iccid}</p>

      <div className="mt-1 pt-2 border-t border-black/5 space-y-2">
        <Row label="iPhone — SM-DP+ Address" value={esim.smDpIos} reveal />
        <Row label="iPhone — Activation Code" value={esim.activationIos} reveal={reveal} mask={masked(esim.activationIos)} />
        <Row label="Android — Activation Code" value={esim.activationAndroid} reveal={reveal} mask={masked(esim.activationAndroid)} long />
        <button className="pill" onClick={() => setReveal(v => !v)}>
          {reveal ? '🙈 Hide codes' : '👁 Reveal activation codes'}
        </button>
      </div>
    </section>
  )
}

function Row({ label, value, reveal, mask, long }: { label: string; value: string; reveal: boolean; mask?: string; long?: boolean }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-widest text-ink/50">{label}</p>
      <div className="flex items-center gap-2 mt-0.5">
        <span className={`font-mono text-xs ${long ? 'break-all' : ''} flex-1`}>
          {reveal ? value : (mask ?? value)}
        </span>
        {reveal && <CopyChip text={value} />}
      </div>
    </div>
  )
}
