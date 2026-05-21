import Link from 'next/link'
import { FAMILY } from '@/lib/trip'
import { hotelForNight, todayISO } from '@/lib/select'
import { Avatar } from '@/components/Avatar'

export default function FamilyGroup() {
  const hotel = hotelForNight(todayISO())
  return (
    <div className="px-5 py-3 space-y-3">
      <Link href="/family" className="text-sm text-ink/60">← Family</Link>
      <div className="card text-center">
        <h1 className="h-display text-2xl">Family group card</h1>
        <p className="text-xs text-ink/55">Show this to police, hotel staff, or anyone helping.</p>
      </div>

      <section className="card">
        <div className="grid grid-cols-3 gap-3">
          {FAMILY.map(f => (
            <div key={f.id} className="text-center">
              <div className="mx-auto"><Avatar id={f.id} name={f.name} size={64} /></div>
              <p className="text-xs font-medium mt-1">{f.name.split(' ')[0]}</p>
              <p className="jp text-[11px] text-ink/65">{f.nameJa}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card card-bordered-vermilion">
        <p className="jp text-lg leading-relaxed">
          私たちは3人家族で日本を旅行中です。家族とはぐれた場合、下記の番号にお電話ください。
        </p>
        <p className="text-xs text-ink/55 mt-1">
          We are a family of 3 travelling in Japan. If you find any of us separated, please call the numbers below.
        </p>
        <ul className="mt-3 text-sm space-y-1">
          {FAMILY.filter(f => f.id !== 'adira').map(f => (
            <li key={f.id} className="flex justify-between">
              <span>{f.name}</span>
              <a className="font-mono" href={`tel:${(f.mobileRoaming ?? '').replace(/\s/g, '')}`}>{f.mobileRoaming}</a>
            </li>
          ))}
        </ul>
      </section>

      {hotel && (
        <section className="card card-bordered-indigo">
          <p className="text-xs uppercase tracking-widest text-ink/50">今夜のホテル · Tonight</p>
          <p className="font-medium mt-1">{hotel.name}</p>
          <p className="jp">{hotel.addressJa}</p>
          <p className="text-xs text-ink/55">{hotel.addressEn}</p>
        </section>
      )}

      <p className="text-center text-xs text-ink/45">
        Screenshot this screen for offline backup.
      </p>
    </div>
  )
}
