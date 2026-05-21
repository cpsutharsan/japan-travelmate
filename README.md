# Japan TravelMate

Personal travel companion for the Parthasarathy family trip to Japan, 22–30 May 2026.

- Next.js 14 (App Router) + TypeScript + Tailwind
- Supabase (auth, Postgres, Storage)
- PWA with service worker + IndexedDB (works offline)
- Mobile-first, iPhone-Safari friendly

## 30-minute deployment checklist

### 1. Create the Supabase project (5 min)
1. Go to https://supabase.com/dashboard, create a new project (free tier is fine).
2. In **Settings → API**, copy the **Project URL** and **anon public key**.
3. In **SQL editor**, paste `supabase/schema.sql` from this repo and run it.
4. In **Storage**, create 4 **private** buckets: `bookings`, `photos`, `voice`, `profiles`.
5. In **Authentication → Providers**, leave email/password enabled. Disable "Confirm email" if you want to skip the verification step for your two accounts.
6. In **Authentication → Users**, click "Add user" twice and create accounts for `sutharsan@…` and `divya@…`.

### 2. Push to GitHub (3 min)
```
cd japan-travelmate
git init && git add . && git commit -m "Initial commit"
gh repo create japan-travelmate --private --source=. --push
```
(or use the GitHub UI to push the folder)

### 3. Deploy on Vercel (5 min)
1. https://vercel.com/new → import the repo.
2. **Environment Variables** → add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
3. Click **Deploy**. You'll get `japan-travelmate.vercel.app` (or pick a name).

### 4. Install as a PWA on iPhone (1 min)
1. Open the Vercel URL in **Safari** on the iPhone.
2. Tap the **Share** icon → **Add to Home Screen** → Add.
3. Open the new home-screen icon. It runs full-screen with the offline cache active.

### 5. Invite Divya (1 min)
- Send her the URL.
- She signs in with her Supabase email/password account.
- All bookings/log/expenses are shared automatically (RLS allows any authenticated user).

### 6. Fill in your real data (15 min)
The app ships with pre-loaded confirmed bookings. Edit `src/lib/trip.ts` for:
- **Family**: phone numbers, passport numbers/expiry, emergency contacts, blood groups
- **Flights**: PNRs (search for `to be filled` in the file)
- **Hotels**: confirmation codes (use the "Booking files" page to upload PDFs)

Or, do most of that **inside the app** — the Family detail screens persist edits to IndexedDB (and Supabase if signed in).

## Local dev
```
npm install
cp .env.example .env.local   # add your Supabase keys
npm run dev
```
The app runs without Supabase keys in **demo mode** (data stays local in IndexedDB).

## What's in here

| # | Module | Path |
|---|---|---|
| 1 | Home "Right Now" | `/` |
| 2 | Vegetarian Card (full-screen) | `/vegetarian-card` |
| 3 | Itinerary day-by-day | `/itinerary` |
| 4 | Bookings vault (flights/hotels/trains/files) | `/bookings` |
| 5 | Restaurant finder | `/restaurants` |
| 6 | Daily log + memory book PDF | `/log` |
| 7 | Expense tracker | `/expenses` |
| 8 | Adira mode + happy meter | `/adira` |
| 9 | Phrase book (with audio) | `/phrasebook` |
| 10 | Checklists | `/checklists` |
| 11 | Booking status dashboard | `/status` |
| 12 | Emergency screen | `/emergency` |
| 13 | Family profiles + group card | `/family` |
| 14 | Photo sharing hub | `/share` |
| 15 | Currency converter + tax-free | `/converter` |
| 16 | Taxi address card | `/taxi` |
| 17 | Souvenir tracker | `/souvenirs` |
| 18 | Adira happy meter | `/adira/happy` |
| 19 | Smart day adjuster | (home prompts) |
| 20 | Memory book PDF export | `/log/export` |

## Offline behaviour

- The service worker pre-caches the critical screens on first visit (home, vegetarian card, emergency, Adira card, itinerary, phrase book, taxi, family, checklists, offline).
- Page navigations are network-first with a cache fallback, so once visited a screen stays available.
- Static assets (CSS/JS/fonts/images) use cache-first.
- All your typed input (expenses, log entries, happy meter, souvenirs, profile overrides, contacts) lives in IndexedDB first and syncs to Supabase when online.

## Notes & known limits

- Voice memos and bookings/photos uploads require Supabase env vars. They run silently in the background when online.
- The "memory book" export uses the system print dialog → Save as PDF — works on iPhone Safari Share sheet.
- The address-card QR code is left as a Maps deep link (`maps.google.com/?q=…`) rather than an inline QR, which lets the driver tap straight through to Maps. If you want a printable QR, add a `qrcode` dep and replace the `📍` block.
- Passport numbers are stored in the `profiles.data` JSONB column — for stronger encryption-at-rest add a Supabase Vault key (out of scope for this build).
