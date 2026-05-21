'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Suspense } from 'react'

const TABS = [
  { href: '/',          label: 'Home',      icon: HomeIcon },
  { href: '/itinerary', label: 'Itinerary', icon: CalIcon  },
  { href: '/bookings',  label: 'Bookings',  icon: TicketIcon },
  { href: '/log',       label: 'Log',       icon: BookIcon },
  { href: '/more',      label: 'More',      icon: MoreIcon },
] as const

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isFullscreen =
    pathname === '/vegetarian-card' ||
    pathname === '/login' ||
    pathname?.startsWith('/taxi/show')

  if (isFullscreen) return <>{children}</>

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Header />
      <main className="flex-1 pb-[calc(70px+var(--safe-bottom))]">
        <Suspense fallback={<div className="px-5 py-8 text-ink/40">Loading…</div>}>
          {children}
        </Suspense>
      </main>
      <BottomNav pathname={pathname || '/'} />
    </div>
  )
}

function Header() {
  return (
    <header
      className="px-5 pt-3 pb-2 flex items-center justify-between"
      style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}
    >
      <Link href="/" className="flex items-center gap-2">
        <span aria-hidden className="inline-block w-7 h-7 rounded-md" style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><g fill='none' stroke='%23d23a2c' stroke-width='4' stroke-linecap='round'><path d='M8 16h48M10 22h44'/><path d='M16 22v38M48 22v38'/><path d='M20 32h24'/></g></svg>\")",
          backgroundSize: 'contain', backgroundRepeat: 'no-repeat',
        }} />
        <span className="h-display text-lg">Japan TravelMate</span>
      </Link>
      <Link href="/vegetarian-card" className="text-xs pill !bg-vermilion !text-white">
        🍵 Veg card
      </Link>
    </header>
  )
}

function BottomNav({ pathname }: { pathname: string }) {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-t border-black/5"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
    >
      <ul className="grid grid-cols-5">
        {TABS.map((t) => {
          const active = t.href === '/' ? pathname === '/' : pathname.startsWith(t.href)
          const Icon = t.icon
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px]',
                  active ? 'text-vermilion' : 'text-ink/60'
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon active={active} />
                <span>{t.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function HomeIcon({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" />
    </svg>
  )
}
function CalIcon({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  )
}
function TicketIcon({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8z" />
      <path d="M13 6v2M13 11v2M13 16v2" />
    </svg>
  )
}
function BookIcon({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4V4z" /><path d="M4 16a4 4 0 0 1 4-4h12" />
    </svg>
  )
}
function MoreIcon({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.6 : 2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="12" r="1.3" /><circle cx="12" cy="12" r="1.3" /><circle cx="19" cy="12" r="1.3" />
    </svg>
  )
}
