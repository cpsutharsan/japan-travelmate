'use client'

import { useEffect, useState } from 'react'

type DeferredPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> }

const DISMISS_KEY = 'tm-install-dismissed-at'
const DISMISS_HOURS = 24 * 14 // re-show after 2 weeks if not installed

export function InstallPrompt() {
  const [show, setShow] = useState(false)
  const [variant, setVariant] = useState<'ios' | 'native' | null>(null)
  const [deferred, setDeferred] = useState<DeferredPrompt | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Already installed as a PWA — never show.
    const standaloneIOS = (window.navigator as any).standalone === true
    const standalonePWA = window.matchMedia('(display-mode: standalone)').matches
    if (standaloneIOS || standalonePWA) return

    // Recently dismissed — back off.
    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0)
    if (dismissedAt && Date.now() - dismissedAt < DISMISS_HOURS * 60 * 60 * 1000) return

    const ua = window.navigator.userAgent
    const isIOS = /iPhone|iPad|iPod/.test(ua)
    const isSafari = isIOS && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua)

    if (isSafari) {
      setVariant('ios')
      setShow(true)
      return
    }

    // Chrome / Edge / Android — wait for the native prompt to be available.
    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferred(e as DeferredPrompt)
      setVariant('native')
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)

    // If it was already fired before this component mounted, the event is lost.
    // Most browsers will refire on next navigation though.
    const onInstalled = () => setShow(false)
    window.addEventListener('appinstalled', onInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, String(Date.now()))
    setShow(false)
  }

  async function install() {
    if (!deferred) return
    await deferred.prompt()
    const choice = await deferred.userChoice
    if (choice.outcome === 'accepted') setShow(false)
    else dismiss()
  }

  if (!show || !variant) return null

  return (
    <div className="card card-bordered-vermilion mb-4 relative">
      <button onClick={dismiss}
              aria-label="Dismiss"
              className="absolute top-2 right-2 w-7 h-7 rounded-full text-ink/50 hover:bg-black/5 text-base leading-none">×</button>
      <p className="text-xs uppercase tracking-widest text-vermilion">Install on this device</p>
      {variant === 'ios' ? (
        <>
          <p className="text-sm mt-1">
            Get the full-screen app icon (works offline, no Safari toolbar).
          </p>
          <ol className="text-xs text-ink/70 mt-2 space-y-1.5 list-decimal list-inside">
            <li>Tap the <b>Share</b> icon <span className="inline-block w-4 h-4 align-middle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            </span> at the bottom of Safari.</li>
            <li>Scroll down and tap <b>Add to Home Screen</b>.</li>
            <li>Tap <b>Add</b> in the top-right.</li>
          </ol>
          <button onClick={dismiss} className="btn-outline text-xs mt-3">Got it</button>
        </>
      ) : (
        <>
          <p className="text-sm mt-1">
            Install Japan TravelMate for offline access and a real home-screen icon.
          </p>
          <div className="flex gap-2 mt-3">
            <button onClick={install} className="btn-vermilion text-xs flex-1">📲 Install app</button>
            <button onClick={dismiss}  className="btn-outline   text-xs">Not now</button>
          </div>
        </>
      )}
    </div>
  )
}
