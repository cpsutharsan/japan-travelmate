#!/usr/bin/env node
/**
 * One-shot uploader for family profile photos.
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY='eyJ...' node scripts/upload-photos.mjs
 *
 * Reads ./images/{Sutharsan,Divya,Adira}.{jpg,JPG,jpeg,JPEG,png,PNG}
 * Uploads each to the private `profiles` bucket at <id>/avatar.<ext>.
 * Always uses upsert: true so re-running replaces older defaults.
 */

import fs from 'node:fs/promises'
import path from 'node:path'

const SUPABASE_URL = 'https://nxtdiouikrkyftsogiet.supabase.co'
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const BUCKET = 'profiles'
const SRC_DIR = path.resolve('./images')

if (!KEY) { console.error('Missing SUPABASE_SERVICE_ROLE_KEY env var.'); process.exit(1) }

const baseHeaders = { Authorization: `Bearer ${KEY}`, apikey: KEY }

const PEOPLE = [
  { id: 'sutharsan', source: 'Sutharsan' },
  { id: 'divya',     source: 'Divya' },
  { id: 'adira',     source: 'Adira' },
]

async function ensureBucket() {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/bucket/${BUCKET}`, { headers: baseHeaders })
  if (res.ok) { console.log(`✓ bucket "${BUCKET}" already exists`); return }
  const body = await res.text()
  const notFound = res.status === 404 || /"statusCode"\s*:\s*"?404"?/.test(body)
  if (!notFound) throw new Error(`Lookup failed: ${res.status} ${body}`)
  const cres = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: 'POST',
    headers: { ...baseHeaders, 'content-type': 'application/json' },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: false }),
  })
  if (!cres.ok) throw new Error(`Create failed: ${cres.status} ${await cres.text()}`)
  console.log(`✓ created private bucket "${BUCKET}"`)
}

async function findSource(stem) {
  const exts = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP', 'heic', 'HEIC']
  for (const ext of exts) {
    const p = path.join(SRC_DIR, `${stem}.${ext}`)
    try { await fs.access(p); return { p, ext: ext.toLowerCase() } } catch {}
  }
  return null
}

async function uploadOne(id, stem) {
  const src = await findSource(stem)
  if (!src) { console.warn(`  · skip (no image found for ${stem})`); return }
  const body = await fs.readFile(src.p)
  const contentType =
    src.ext === 'png'  ? 'image/png'  :
    src.ext === 'webp' ? 'image/webp' :
    src.ext === 'heic' ? 'image/heic' :
                         'image/jpeg'
  const dest = `${id}/avatar.${src.ext === 'jpeg' ? 'jpg' : src.ext}`
  const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${dest}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { ...baseHeaders, 'content-type': contentType, 'x-upsert': 'true' },
    body,
  })
  if (!res.ok) { console.error(`  ✗ ${dest}: ${res.status} ${(await res.text()).slice(0, 200)}`); return }
  console.log(`  ✓ ${dest} (${(body.length / 1024).toFixed(0)} KB)`)
}

await ensureBucket()
console.log('')
for (const p of PEOPLE) await uploadOne(p.id, p.source)
console.log('\nDone. The Family screen will fetch a signed URL on next load.')
