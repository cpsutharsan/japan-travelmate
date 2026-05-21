import Link from 'next/link'
import { EMERGENCY, FAMILY } from '@/lib/trip'
import { hotelForNight, todayISO } from '@/lib/select'
import { CopyChip } from '@/components/CopyChip'

export default function EmergencyPage() {
  const hotel = hotelForNight(todayISO())
  const sutharsan = FAMILY.find(f => f.id === 'sutharsan')!
  const divya = FAMILY.find(f => f.id === 'divya')!

  return (
    <div className="px-5 py-3 space-y-4">
      <Link href="/" className="text-sm text-ink/60">← Home</Link>
      <h1 className="h-display text-2xl text-vermilion">🆘 Emergency</h1>

      <section className="card card-bordered-vermilion">
        <p className="text-xs uppercase tracking-widest text-ink/50">Show to anyone helping</p>
        <p className="jp text-lg mt-1 leading-relaxed">
          助けてください。家族3人で旅行中です。両親に連絡してください。
        </p>
        <p className="text-xs text-ink/55 mt-1">
          Please help. We are a family of 3 travelling together. Please contact the parents.
        </p>
      </section>

      {hotel && (
        <section className="card card-bordered-indigo">
          <p className="text-xs uppercase tracking-widest text-ink/50">Tonight&rsquo;s hotel</p>
          <p className="font-medium mt-1">{hotel.name}</p>
          <p className="jp text-lg">{hotel.addressJa}</p>
          <p className="text-xs text-ink/55">{hotel.addressEn}</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            <CopyChip text={hotel.addressJa} label="Copy JP" />
            <CopyChip text={hotel.addressEn} label="Copy EN" />
            <a className="pill" target="_blank" rel="noreferrer"
               href={`https://maps.google.com/?q=${encodeURIComponent(hotel.addressJa)}`}>Maps</a>
          </div>
        </section>
      )}

      <section className="card">
        <p className="text-xs uppercase tracking-widest text-ink/50 mb-2">Family</p>
        <ul className="space-y-1.5 text-sm">
          <li className="flex justify-between"><span>{sutharsan.name}</span><a className="font-mono" href={`tel:${(sutharsan.mobileRoaming ?? '').replace(/\s/g, '')}`}>{sutharsan.mobileRoaming}</a></li>
          <li className="flex justify-between"><span>{divya.name}</span><a className="font-mono" href={`tel:${(divya.mobileRoaming ?? '').replace(/\s/g, '')}`}>{divya.mobileRoaming}</a></li>
        </ul>
      </section>

      <section className="card">
        <p className="text-xs uppercase tracking-widest text-ink/50 mb-2">Japan emergency</p>
        <ul className="space-y-1.5 text-sm">
          <li className="flex justify-between"><span>Police</span><a className="font-mono" href={`tel:${EMERGENCY.police}`}>{EMERGENCY.police}</a></li>
          <li className="flex justify-between"><span>Ambulance / Fire</span><a className="font-mono" href={`tel:${EMERGENCY.ambulance}`}>{EMERGENCY.ambulance}</a></li>
          <li className="flex justify-between"><span>UAE Embassy Tokyo</span><a className="font-mono" href={`tel:${EMERGENCY.uaeEmbassyTokyo.replace(/\s/g, '')}`}>{EMERGENCY.uaeEmbassyTokyo}</a></li>
        </ul>
      </section>

      <Link href="/documents" className="card card-bordered-gold block">
        <p className="font-medium">📄 Documents (passports, visas, IDs)</p>
        <p className="text-xs text-ink/55">Open and show to authorities when needed.</p>
      </Link>

      <section className="card">
        <p className="text-xs uppercase tracking-widest text-ink/50 mb-2">Hospital / clinic</p>
        <p className="text-sm text-ink/70">Nearest English-speaking clinic depends on city. Search:</p>
        <ul className="text-sm space-y-1 mt-1">
          {['Tokyo English Lifeline (TELL)', 'St. Luke\'s International Hospital, Tokyo', 'Japan Baptist Hospital, Kyoto', 'Osaka General Medical Center'].map(s => (
            <li key={s}>
              <a className="underline" target="_blank" rel="noreferrer" href={`https://maps.google.com/?q=${encodeURIComponent(s)}`}>{s}</a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
