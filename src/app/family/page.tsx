import Link from 'next/link'
import { FAMILY } from '@/lib/trip'

export default function FamilyIndex() {
  return (
    <div className="px-5 py-3 space-y-3">
      <h1 className="h-display text-2xl">Family profiles</h1>
      <p className="text-sm text-ink/60">Tap a person for full info, or open the group card to show authorities.</p>

      <ul className="space-y-2">
        {FAMILY.map(f => (
          <li key={f.id}>
            <Link href={`/family/${f.id}`} className="card flex items-center gap-3">
              <span className="w-12 h-12 rounded-full bg-paper border border-black/10 grid place-items-center font-display text-lg">
                {f.name.slice(0, 1)}
              </span>
              <div className="flex-1">
                <p className="font-medium">{f.name}</p>
                <p className="jp text-sm text-ink/65">{f.nameJa}</p>
                <p className="text-xs text-ink/50">{f.role}</p>
              </div>
              <span className="pill">→</span>
            </Link>
          </li>
        ))}
      </ul>

      <Link href="/family/group" className="btn-primary w-full">👨‍👩‍👧 Family group card</Link>
    </div>
  )
}
