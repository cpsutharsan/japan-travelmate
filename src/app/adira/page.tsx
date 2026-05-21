import Link from 'next/link'
import { FAMILY, ADIRA_CARD_JA } from '@/lib/trip'
import { hotelForNight, todayISO } from '@/lib/select'
import { CopyChip } from '@/components/CopyChip'
import { Avatar } from '@/components/Avatar'

export default function AdiraSafetyPage() {
  const adira = FAMILY.find(f => f.id === 'adira')!
  const sutharsan = FAMILY.find(f => f.id === 'sutharsan')!
  const divya = FAMILY.find(f => f.id === 'divya')!
  const hotel = hotelForNight(todayISO())
  const phones = `${sutharsan.mobileRoaming ?? sutharsan.mobileDubai ?? ''} / ${divya.mobileRoaming ?? divya.mobileDubai ?? ''}`
  const hotelLine = hotel ? `${hotel.nameJa ?? hotel.name} — ${hotel.addressJa}` : 'ホテル未定'
  const cardText = ADIRA_CARD_JA(phones, hotelLine)

  return (
    <div className="px-5 py-3 space-y-4">
      <Link href="/" className="text-sm text-ink/60">← Home</Link>

      <section className="card card-bordered-vermilion text-center">
        <div className="mx-auto inline-block"><Avatar id="adira" name={adira.name} size={112} /></div>
        <h1 className="h-display text-3xl mt-2">{adira.name}</h1>
        <p className="jp text-2xl">{adira.nameJa}</p>
        <p className="text-xs text-ink/60 mt-1">Age {adira.age} · Daughter</p>
      </section>

      <section className="card space-y-2">
        <p className="text-xs uppercase tracking-widest text-ink/50">Lost-child card (show this)</p>
        <pre className="jp text-base whitespace-pre-wrap leading-relaxed">{cardText}</pre>
        <div className="flex gap-2 flex-wrap">
          <CopyChip text={cardText} label="Copy" />
          <Link href="/adira/show" className="pill">Full-screen</Link>
        </div>
      </section>

      <section className="card">
        <p className="text-xs uppercase tracking-widest text-ink/50 mb-2">Parents&rsquo; phones</p>
        <ul className="space-y-1 text-sm">
          <li className="flex justify-between"><span>{sutharsan.name}</span><a className="font-mono" href={`tel:${(sutharsan.mobileRoaming ?? '').replace(/\s/g, '')}`}>{sutharsan.mobileRoaming}</a></li>
          <li className="flex justify-between"><span>{divya.name}</span><a className="font-mono" href={`tel:${(divya.mobileRoaming ?? '').replace(/\s/g, '')}`}>{divya.mobileRoaming}</a></li>
        </ul>
      </section>

      <section className="card">
        <p className="text-xs uppercase tracking-widest text-ink/50 mb-2">Tonight&rsquo;s hotel</p>
        {hotel ? (
          <>
            <p className="font-medium">{hotel.name}</p>
            <p className="jp text-sm">{hotel.addressJa}</p>
            <p className="text-xs text-ink/55">{hotel.addressEn}</p>
          </>
        ) : <p className="text-sm text-ink/55">No hotel scheduled.</p>}
      </section>

      <section className="card">
        <p className="text-xs uppercase tracking-widest text-ink/50 mb-2">Familiar foods</p>
        <div className="flex flex-wrap gap-1.5">
          {(adira.favorites ?? []).map(f => <span key={f} className="pill">{f}</span>)}
        </div>
      </section>

      <section className="card">
        <p className="text-xs uppercase tracking-widest text-ink/50 mb-2">Allergies</p>
        <p className="text-sm">{adira.allergies ?? 'None'}</p>
      </section>

      <Link href="/adira/happy" className="btn-outline w-full">📊 Happy meter</Link>
    </div>
  )
}
