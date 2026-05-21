'use client'

import Link from 'next/link'
import { FAMILY } from '@/lib/trip'

export function FamilyAvatars() {
  return (
    <div className="flex items-center gap-3">
      {FAMILY.map(f => (
        <Link key={f.id} href={`/family/${f.id}`} className="flex items-center gap-2">
          <span className="w-10 h-10 rounded-full bg-white border border-black/10 grid place-items-center
                           font-display text-base shadow-paper">
            {f.name.slice(0, 1)}
          </span>
          <span className="hidden xs:block text-xs leading-tight">
            <span className="block font-medium">{f.name.split(' ')[0]}</span>
            <span className="block text-ink/50">{f.role}</span>
          </span>
        </Link>
      ))}
    </div>
  )
}
