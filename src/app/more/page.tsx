import Link from 'next/link'

const ITEMS: { href: string; label: string; sub: string }[] = [
  { href: '/restaurants',  label: '🍱 Restaurants',       sub: 'Pre-loaded vegetarian spots' },
  { href: '/phrasebook',   label: '🗣️ Phrase book',       sub: 'Japanese with audio'         },
  { href: '/checklists',   label: '✅ Checklists',         sub: 'Pre-trip, daily, Adira bag'  },
  { href: '/expenses',     label: '💴 Expenses',           sub: '¥ → AED, budget chart'        },
  { href: '/converter',    label: '¥⇄د.إ Converter',       sub: 'Live currency + tax-free'    },
  { href: '/taxi',         label: '🚕 Taxi card',          sub: 'Hotel + destinations in JP'  },
  { href: '/share',        label: '📤 Photo sharing',      sub: 'One-tap WhatsApp to family'  },
  { href: '/souvenirs',    label: '🎁 Souvenir tracker',   sub: 'Who gets what'               },
  { href: '/adira',        label: '🧒 Adira mode',         sub: 'Safety card + happy meter'   },
  { href: '/family',       label: '👨‍👩‍👧 Family profiles',     sub: 'Phones, passports, vCard'    },
  { href: '/emergency',    label: '🆘 Emergency',          sub: 'Police, embassy, hospitals'  },
  { href: '/status',       label: '📋 Booking status',     sub: 'Pending vs confirmed'        },
  { href: '/log/export',   label: '📕 Memory book',        sub: 'PDF export at end of trip'   },
  { href: '/login',        label: '🔐 Account',             sub: 'Sign in / out'               },
]

export default function MorePage() {
  return (
    <div className="px-5 py-3 space-y-3">
      <h1 className="h-display text-2xl">More</h1>
      <ul className="space-y-2">
        {ITEMS.map(i => (
          <li key={i.href}>
            <Link href={i.href} className="card flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{i.label}</p>
                <p className="text-xs text-ink/55">{i.sub}</p>
              </div>
              <span className="pill">→</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="text-center text-[11px] text-ink/40 pt-4">
        Japan TravelMate · Built for the Parthasarathy family
      </p>
    </div>
  )
}
