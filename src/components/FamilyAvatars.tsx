'use client'

import Link from 'next/link'
import { FAMILY } from '@/lib/trip'
import { Avatar } from './Avatar'

export function FamilyAvatars() {
  return (
    <div className="flex items-center gap-3">
      {FAMILY.map(f => (
        <Link key={f.id} href={`/family/${f.id}`} className="flex items-center gap-2">
          <Avatar id={f.id} name={f.name} size={40} className="shadow-paper" />
          <span className="hidden xs:block text-xs leading-tight">
            <span className="block font-medium">{f.name.split(' ')[0]}</span>
            <span className="block text-ink/50">{f.role}</span>
          </span>
        </Link>
      ))}
    </div>
  )
}
