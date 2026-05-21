'use client'

import { useEffect, useState } from 'react'

export function OfflineIndicator() {
  const [online, setOnline] = useState(true)
  useEffect(() => {
    const update = () => setOnline(navigator.onLine)
    update()
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])
  if (online) return null
  return (
    <div className="fixed top-0 inset-x-0 z-[60] bg-vermilion text-white text-xs py-1 text-center"
         style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 4px)' }}>
      Offline — showing cached data. Changes will sync when you reconnect.
    </div>
  )
}
