'use client'

/**
 * Local-first storage with IndexedDB.
 * All user-generated data (expenses, log entries, happy meter, souvenirs, etc.) is
 * written here immediately so the app works offline. When online, a background sync
 * pushes pending records to Supabase.
 */

import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

export type ExpenseRow = {
  id: string
  ts: number
  date: string         // YYYY-MM-DD (JST)
  amountJpy: number
  amountAed: number
  category: string
  location?: string
  notes?: string
  synced?: boolean
}

export type LogRow = {
  id: string
  date: string
  adira?: string
  divya?: string
  bestMeal?: string
  remember?: string
  mood?: '😊' | '😐' | '😴' | '😍'
  ts: number
  synced?: boolean
}

export type HappyRow = {
  id: string
  date: string
  mood: number          // 1..5
  sleep: number         // 1..5
  meals: { breakfast: boolean; lunch: boolean; dinner: boolean; snacks: boolean }
  water: 'low' | 'medium' | 'high'
  meltdown: 'none' | 'mild' | 'major'
  meltdownNote?: string
  happyNote?: string
  ts: number
  synced?: boolean
}

export type SouvenirRow = {
  id: string
  recipient: string
  item: string
  boughtAt?: string
  cost?: number
  costCurrency?: 'JPY' | 'AED'
  category?: string
  photoBlob?: Blob
  bought: boolean
  ts: number
  synced?: boolean
}

export type ChecklistState = { id: string; checked: boolean; ts: number }

export type ProfileOverride = {
  id: string  // 'sutharsan' | 'divya' | 'adira'
  data: Record<string, string | undefined>
  ts: number
}

export type ContactRow = {
  id: string
  name: string
  group: string
  phone: string
  ts: number
}

export type PendingPhoto = {
  id: string
  blob: Blob
  date: string
  ts: number
}

export type Settings = {
  id: 'global'
  rateJpyToAed: number
  jainMode: boolean
  activePhoneLabel: 'roaming' | 'esim'
  rateUpdatedAt: number
}

interface TravelMateDB extends DBSchema {
  expenses:    { key: string; value: ExpenseRow; indexes: { 'by-date': string } }
  logs:        { key: string; value: LogRow; indexes: { 'by-date': string } }
  happy:       { key: string; value: HappyRow; indexes: { 'by-date': string } }
  souvenirs:   { key: string; value: SouvenirRow }
  checklist:   { key: string; value: ChecklistState }
  profiles:    { key: string; value: ProfileOverride }
  contacts:    { key: string; value: ContactRow }
  photos:      { key: string; value: PendingPhoto; indexes: { 'by-date': string } }
  settings:    { key: string; value: Settings }
  bookings:    { key: string; value: { id: string; done: boolean } }
}

let dbPromise: Promise<IDBPDatabase<TravelMateDB>> | null = null

export function db(): Promise<IDBPDatabase<TravelMateDB>> {
  if (!dbPromise) {
    dbPromise = openDB<TravelMateDB>('travelmate', 1, {
      upgrade(d) {
        const e = d.createObjectStore('expenses', { keyPath: 'id' });    e.createIndex('by-date', 'date')
        const l = d.createObjectStore('logs', { keyPath: 'id' });        l.createIndex('by-date', 'date')
        const h = d.createObjectStore('happy', { keyPath: 'id' });       h.createIndex('by-date', 'date')
        d.createObjectStore('souvenirs', { keyPath: 'id' })
        d.createObjectStore('checklist', { keyPath: 'id' })
        d.createObjectStore('profiles', { keyPath: 'id' })
        d.createObjectStore('contacts', { keyPath: 'id' })
        const p = d.createObjectStore('photos', { keyPath: 'id' });      p.createIndex('by-date', 'date')
        d.createObjectStore('settings', { keyPath: 'id' })
        d.createObjectStore('bookings', { keyPath: 'id' })
      },
    })
  }
  return dbPromise
}

export const uid = () =>
  (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36)

export async function getSettings(): Promise<Settings> {
  const d = await db()
  const s = await d.get('settings', 'global')
  return s ?? { id: 'global', rateJpyToAed: 0.025, jainMode: false, activePhoneLabel: 'roaming', rateUpdatedAt: Date.now() }
}

export async function setSettings(patch: Partial<Settings>) {
  const cur = await getSettings()
  const next = { ...cur, ...patch }
  const d = await db()
  await d.put('settings', next)
  return next
}
