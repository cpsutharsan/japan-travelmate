#!/usr/bin/env node
/**
 * One-shot uploader for family documents.
 *
 * Usage:
 *   1. Get your Supabase service_role key:
 *      Supabase Dashboard → Settings → API → "Legacy anon, service_role API keys" tab
 *      → copy the row labelled `service_role` (DON'T commit this key anywhere).
 *   2. Run:
 *        SUPABASE_SERVICE_ROLE_KEY='eyJ...' node scripts/upload-docs.mjs
 *   3. Once finished, regenerate the service_role key in the Supabase dashboard
 *      so the leaked-in-terminal-history copy stops working.
 *
 * The script:
 *   - Creates a private `documents` bucket if it doesn't already exist
 *   - Walks ./bookings to confirm/ and uploads each file to the canonical path
 *     under sutharsan/, divya/, adira/, family/
 *   - Skips files that already exist (idempotent — safe to re-run)
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://nxtdiouikrkyftsogiet.supabase.co'
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const BUCKET = 'documents'
const SRC_DIR = path.resolve('./bookings to confirm')

if (!KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY env var. See header comment.')
  process.exit(1)
}

const supa = createClient(SUPABASE_URL, KEY, { auth: { persistSession: false } })

// Mapping: source filename → destination path inside the `documents` bucket.
// Keep these aligned with src/lib/trip.ts DOCUMENTS.
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
  // Booking confirmations — useful to keep as a private archive
  'Booking.com_ Confirmation.pdf':   'family/hotel-minn-ueno.pdf',
  'Booking.com_ Confirmation1.pdf':  'family/hotel-minn-kyoto.pdf',
  'Booking.com_ Confirmation2.pdf':  'family/hotel-citadines-namba.pdf',
  'Booking.com_ Confirmation3.pdf':  'family/hotel-monday-ningyocho.pdf',
  // Disney + Nozomi
  'Tokyo Disney Resort_ Code for your Park ticket [A00571698873].eml': 'family/disney-park-ticket.eml',
  'ticket_JP0510556171_shin_osaka_station_tokyo_2026-05-29 (1).pdf': 'family/shinkansen-nozomi84.pdf',
}

async function ensureBucket() {
  const { data: buckets, error } = await supa.storage.listBuckets()
  if (error) throw error
  if (buckets.find(b => b.name === BUCKET)) {
    console.log(`✓ bucket "${BUCKET}" already exists`)
    return
  }
  const { error: cerr } = await supa.storage.createBucket(BUCKET, { public: false })
  if (cerr) throw cerr
  console.log(`✓ created private bucket "${BUCKET}"`)
}

async function fileExists(dest) {
  const dir = path.dirname(dest)
  const base = path.basename(dest)
  const { data } = await supa.storage.from(BUCKET).list(dir, { search: base })
  return data?.some(f => f.name === base)
}

async function uploadOne(srcName, destPath) {
  const src = path.join(SRC_DIR, srcName)
  try {
    await fs.access(src)
  } catch {
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
  const { error } = await supa.storage.from(BUCKET).upload(destPath, body, { contentType, upsert: false })
  if (error) {
    console.error(`  ✗ ${destPath}: ${error.message}`)
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
