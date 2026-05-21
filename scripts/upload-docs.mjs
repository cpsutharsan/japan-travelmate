#!/usr/bin/env node
/**
 * One-shot uploader for family documents — uses Supabase Storage REST API
 * directly (no SDK), so it works on any Node 18+ without WebSocket polyfills.
 *
 * Usage:
 *   1. Get your Supabase service_role key:
 *      Supabase Dashboard → Settings → API → "Legacy anon, service_role API keys"
 *      → copy the `service_role` row. DON'T commit this key.
 *   2. Run:
 *        SUPABASE_SERVICE_ROLE_KEY='eyJ...' node scripts/upload-docs.mjs
 *   3. Rotate the key afterwards (Dashboard → API → ⋯ next to service_role → Roll).
 *
 * The script:
 *   - Creates a private `documents` bucket if it doesn't already exist
 *   - Walks ./bookings to confirm/ and uploads each file to the canonical path
 *   - Skips files that already exist (idempotent — safe to re-run)
 */

import fs from 'node:fs/promises'
import path from 'node:path'

const SUPABASE_URL = 'https://nxtdiouikrkyftsogiet.supabase.co'
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const BUCKET = 'documents'
const SRC_DIR = path.resolve('./bookings to confirm')

if (!KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY env var. See header comment.')
  process.exit(1)
}

const baseHeaders = {
  Authorization: `Bearer ${KEY}`,
  apikey: KEY,
}

// Source filename → destination path inside the `documents` bucket.
const MAP = {
  '8.Passport_Sutharsan CP.pdf':     'sutharsan/passport.pdf',
  '11.VISA_Sutharsan.pdf':           'sutharsan/visa.pdf',
  '11.EID_Sutharsan CP.pdf':         'sutharsan/eid.pdf',
  'Z4994373.pdf':                    'sutharsan/evisa.pdf',
  '8.Passport_Divya AN.pdf':         'divya/passport.pdf',
  '11.VISA_Divya AN.pdf':            'divya/visa.pdf',
  '11.EID_Divya AN.pdf':             'divya/eid.pdf',
  'Z5567458.pdf':                    'divya/evisa.pdf',
  '8.Passport_Adira DS.pdf':         'adira/passport.pdf',
  '11.VISA_Adira DS.pdf':            'adira/visa.pdf',
  '11.EID_Adira DS.pdf':             'adira/eid.pdf',
  'V2318222.pdf':                    'adira/evisa.pdf',
  '17.Birth certificate_Adira.pdf':  'adira/birth-certificate.pdf',
  '16.Marriage Certificate.pdf':     'family/marriage-certificate.pdf',
  'DXB-JPN BOARDING PASS.pdf':       'family/boarding-pass-dxb-nrt.pdf',
  'Booking.com_ Confirmation.pdf':   'family/hotel-minn-ueno.pdf',
  'Booking.com_ Confirmation1.pdf':  'family/hotel-minn-kyoto.pdf',
  'Booking.com_ Confirmation2.pdf':  'family/hotel-citadines-namba.pdf',
  'Booking.com_ Confirmation3.pdf':  'family/hotel-monday-ningyocho.pdf',
  'Tokyo Disney Resort_ Code for your Park ticket [A00571698873].eml': 'family/disney-park-ticket.eml',
  'ticket_JP0510556150_tokyo_station_odawara_2026-05-26.pdf':         'family/shinkansen-hikari633.pdf',
  'ticket_JP0510556161_odawara_station_kyoto_2026-05-26 (1).pdf':     'family/shinkansen-kodama839.pdf',
  'ticket_JP0510556171_shin_osaka_station_tokyo_2026-05-29.pdf':      'family/shinkansen-nozomi84.pdf',
}

async function ensureBucket() {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/bucket/${BUCKET}`, { headers: baseHeaders })
  if (res.ok) { console.log(`✓ bucket "${BUCKET}" already exists`); return }
  // Supabase Storage can return HTTP 400 with `"statusCode":"404"` in the body
  // for a missing bucket. Treat any 404-like response as "create it".
  const body = await res.text()
  const notFound = res.status === 404 || /not[_ ]?found/i.test(body) || /"statusCode"\s*:\s*"?404"?/.test(body)
  if (!notFound) throw new Error(`Bucket lookup failed: ${res.status} ${body}`)
  const cres = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: 'POST',
    headers: { ...baseHeaders, 'content-type': 'application/json' },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: false }),
  })
  if (!cres.ok) throw new Error(`Bucket create failed: ${cres.status} ${await cres.text()}`)
  console.log(`✓ created private bucket "${BUCKET}"`)
}

async function fileExists(dest) {
  // HEAD on the storage REST returns 200/400 oddly across versions; using GET
  // info endpoint is the most reliable.
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/info/${BUCKET}/${encodeURIComponent(dest).replace(/%2F/g, '/')}`, {
    headers: baseHeaders,
  })
  return res.ok
}

async function uploadOne(srcName, destPath) {
  const src = path.join(SRC_DIR, srcName)
  try { await fs.access(src) } catch {
    console.warn(`  · skip (source missing): ${srcName}`)
    return
  }
  if (await fileExists(destPath)) {
    console.log(`  · skip (already in bucket): ${destPath}`)
    return
  }
  const body = await fs.readFile(src)
  const contentType = srcName.endsWith('.eml') ? 'message/rfc822' :
                      srcName.endsWith('.png') ? 'image/png' :
                      'application/pdf'
  const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${encodeURIComponent(destPath).replace(/%2F/g, '/')}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { ...baseHeaders, 'content-type': contentType, 'x-upsert': 'false' },
    body,
  })
  if (!res.ok) {
    console.error(`  ✗ ${destPath}: ${res.status} ${(await res.text()).slice(0, 200)}`)
    return
  }
  console.log(`  ✓ ${destPath} (${(body.length / 1024).toFixed(0)} KB)`)
}

async function main() {
  console.log(`Uploading to ${SUPABASE_URL} bucket "${BUCKET}"`)
  console.log(`Source: ${SRC_DIR}\n`)
  await ensureBucket()
  console.log('')
  for (const [src, dest] of Object.entries(MAP)) {
    await uploadOne(src, dest)
  }
  console.log('\nDone. Re-open the /documents page in the app to verify.')
}

main().catch(e => { console.error(e); process.exit(1) })
