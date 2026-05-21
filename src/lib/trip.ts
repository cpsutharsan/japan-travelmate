/**
 * Pre-loaded trip data — single source of truth.
 *
 * This file contains personal information (passport numbers, DOB).
 * It lives in a PRIVATE GitHub repo and the Vercel deployment is gated by
 * Supabase auth, so only sutharsan + divya can ever fetch this bundle.
 * Even so: do not make the repo public, and do not paste the bundle output.
 */

export const TRIP = {
  start: '2026-05-22',
  end: '2026-05-30',
  totalDays: 9,
  budgetAED: 44500,
  rateJpyToAed: 0.025,
}

export type Family = {
  id: 'sutharsan' | 'divya' | 'adira'
  role: 'Father' | 'Mother' | 'Daughter'
  name: string
  nameFull?: string         // canonical full name as used in hotel/flight bookings
  nameJa: string
  age?: number
  dob?: string              // YYYY-MM-DD
  placeOfBirth?: string
  passportCountry?: string
  passportNumber?: string
  passportIssue?: string    // YYYY-MM-DD
  passportExpiry?: string   // YYYY-MM-DD
  passportFile?: string     // Supabase Storage path inside the `documents` bucket
  visaNumber?: string       // Japan eVISA Issue No.
  visaReceipt?: string      // Japan eVISA receipt number
  visaIssue?: string
  visaExpiry?: string
  visaFile?: string         // Supabase Storage path
  eidFile?: string          // Supabase Storage path
  mobileDubai?: string
  mobileRoaming?: string
  esimJp?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  bloodGroup?: string
  medical?: string
  allergies?: string
  favorites?: string[]
}

export const FAMILY: Family[] = [
  {
    id: 'sutharsan',
    role: 'Father',
    name: 'Sutharsan Parthasaarathy',
    nameFull: 'Sutharsan Chiranjeevi Parthasaarathy',
    nameJa: 'スタルサン・パルタサラティ',
    dob: '1986-11-29',
    placeOfBirth: 'Kumbakonam, Tamil Nadu, India',
    passportCountry: 'India',
    passportNumber: 'Z4994373',
    passportIssue: '2019-06-30',
    passportExpiry: '2029-06-29',
    passportFile: 'sutharsan/passport.pdf',
    visaNumber: 'V260002847',
    visaReceipt: '1000009478776',
    visaIssue: '2026-03-04',
    visaExpiry: '2026-06-04',
    visaFile: 'sutharsan/visa.pdf',
    eidFile: 'sutharsan/eid.pdf',
    mobileDubai: '+971 — to be filled —',
    mobileRoaming: '+971 — to be filled —',
    esimJp: '',
    emergencyContactName: '— to be filled —',
    emergencyContactPhone: '+971 — to be filled —',
    bloodGroup: '',
    medical: '',
  },
  {
    id: 'divya',
    role: 'Mother',
    name: 'Divya',
    nameFull: 'Divya Asuri Narasimha Chary',
    nameJa: 'ディヴィヤ',
    dob: '1992-05-08',
    placeOfBirth: 'Medchal, Telangana, India',
    passportCountry: 'India',
    passportNumber: 'Z5567458',
    passportIssue: '2022-06-27',
    passportExpiry: '2032-06-26',
    passportFile: 'divya/passport.pdf',
    visaNumber: 'V260002848',
    visaReceipt: '1000009478749',
    visaIssue: '2026-03-04',
    visaExpiry: '2026-06-04',
    visaFile: 'divya/visa.pdf',
    eidFile: 'divya/eid.pdf',
    mobileDubai: '+971 — to be filled —',
    mobileRoaming: '+971 — to be filled —',
    esimJp: '',
    emergencyContactName: '— to be filled —',
    emergencyContactPhone: '+971 — to be filled —',
    bloodGroup: '',
    medical: '',
  },
  {
    id: 'adira',
    role: 'Daughter',
    name: 'Adira',
    nameFull: 'Adira Divya Sutharsan',
    nameJa: 'アディラ',
    dob: '2022-01-22',
    placeOfBirth: 'Dubai, United Arab Emirates',
    passportCountry: 'India',
    passportNumber: 'V2318222',
    passportIssue: '2022-01-28',
    passportExpiry: '2027-01-27',
    passportFile: 'adira/passport.pdf',
    visaNumber: 'V260002846',
    visaReceipt: '1000009478760',
    visaIssue: '2026-03-04',
    visaExpiry: '2026-06-04',
    visaFile: 'adira/visa.pdf',
    eidFile: 'adira/eid.pdf',
    age: 4,
    allergies: 'None stated',
    favorites: ['Rice', 'Plain pasta', 'Fruit', 'Yogurt', 'Biscuits', 'French fries', 'Dosa', 'Idli'],
  },
]

export type Hotel = {
  id: string
  name: string
  nameJa?: string
  addressEn: string
  addressJa: string
  phone?: string
  confirmation?: string
  pin?: string
  guestName?: string
  costJpy?: number
  costAed?: number
  license?: string
  gpsLat?: number
  gpsLng?: number
  checkIn: string  // YYYY-MM-DD
  checkInTime?: string
  checkOut: string // YYYY-MM-DD
  checkOutTime?: string
  city: 'Tokyo' | 'Hakone' | 'Kyoto' | 'Osaka'
  notes?: string
}

export const HOTELS: Hotel[] = [
  {
    id: 'minn-ueno',
    name: 'Minn Ueno Iriya',
    nameJa: 'Minn 上野 入谷',
    addressEn: 'Taito-ku Iriya 2-34-5, Taito Ward, Tokyo, 110-0013, Japan',
    addressJa: '東京都台東区入谷2-34-5',
    phone: '+81 50 3642 4954',
    confirmation: '5694.443.883',
    pin: '4113',
    guestName: 'Sutharsan Chiranjeevi Parthasaarathy',
    costJpy: 183577,
    costAed: 4412.28,
    license: '30 き 158',
    gpsLat: 35.43324, gpsLng: 139.47235,
    city: 'Tokyo',
    checkIn: '2026-05-22',
    checkInTime: '15:00',
    checkOut: '2026-05-26',
    checkOutTime: '10:00',
    notes: '4 nights paid (22–26 May). Pre-check-in done. Arrival 19:00–20:00.',
  },
  {
    id: 'minn-kyoto',
    name: 'Minn Karasuma Gojo Kyoto Station North',
    nameJa: 'Minn 烏丸五条 京都駅北',
    addressEn: 'Shimogyo Ward, Kyoto, 600-8183, Japan',
    addressJa: '京都府京都市下京区烏丸五条',
    phone: '+81 50 3642 5548',
    confirmation: '6840.916.416',
    pin: '4553',
    guestName: 'Sutharsan Chiranjeevi Parthasaarathy',
    costJpy: 27180,
    costAed: 653.29,
    license: '452',
    gpsLat: 34.59598, gpsLng: 135.45730,
    city: 'Kyoto',
    checkIn: '2026-05-26',
    checkInTime: '15:00',
    checkOut: '2026-05-27',
    checkOutTime: '10:00',
    notes: 'Non-refundable. Pre-check-in done. Arrival 18:00–19:00.',
  },
  {
    id: 'citadines-namba',
    name: 'Citadines Namba Osaka',
    nameJa: 'シタディーン難波大阪',
    addressEn: 'Naniwa-ku Nippombashi 3-5-25, Osaka, 556-0005, Japan',
    addressJa: '大阪府大阪市浪速区日本橋3-5-25',
    phone: '+81 6 6695 7017',
    confirmation: '6816.645.167',
    pin: '3606',
    guestName: 'Sutharsan Chiranjeevi Parthasaarathy',
    costJpy: 61241,
    costAed: 1416.10,
    license: '19-2997',
    gpsLat: 34.39738, gpsLng: 135.30366,
    city: 'Osaka',
    checkIn: '2026-05-27',
    checkInTime: '15:00',
    checkOut: '2026-05-29',
    checkOutTime: '11:00',
    notes: '2 nights. Arrival 16:00–17:00. Accommodation tax payable at property.',
  },
  {
    id: 'monday-ningyocho',
    name: 'MONday Apart Nihonbashi Ningyocho',
    nameJa: 'MONday Apart 日本橋人形町',
    addressEn: 'Chuo-ku Nihonbashikakigara-cho 1-34-5, Chuo Ward, Tokyo, 103-0014, Japan',
    addressJa: '東京都中央区日本橋蛎殻町1-34-5',
    phone: '+81 3 5642 7888',
    confirmation: '5388.029.316',
    pin: '0302',
    guestName: 'Sutharsan Chiranjeevi Parthasaarathy',
    costJpy: 63630,
    costAed: 1471,
    license: '2 き 16',
    gpsLat: 35.40879, gpsLng: 139.47105,
    city: 'Tokyo',
    checkIn: '2026-05-29',
    checkInTime: '15:00',
    checkOut: '2026-05-30',
    checkOutTime: '10:00',
    notes: 'Close to T-CAT airport limousine bus. Pay on arrival. Arrival 16:00–17:00.',
  },
]

export type Train = {
  id: string
  name: string
  date: string
  depart: string
  arrive: string
  from: string
  to: string
  car: string
  seats: string
  reservation?: string
  ticketIds?: string[]   // QR ticket security codes per passenger
  confirmed?: boolean
}

export const TRAINS: Train[] = [
  {
    id: 'hikari-633',
    name: 'Hikari 633',
    date: '2026-05-26',
    depart: '07:36',
    arrive: '08:09',
    from: 'Tokyo',
    to: 'Odawara',
    car: 'Car 9',
    seats: 'Adult 15-C, Adult 15-D, Child 14-D',
    reservation: '2819',
    ticketIds: [
      'E92B A054 9495 CCA3 59F0 BC26 ADCF 3A4A',
      'E735 BE4A 8C8B B1BC 47F0 ADD9 0DDE 6553',
      'ED3F B440 8C81 9AB9 3CF9 BA40 1624 1B5C',
    ],
    confirmed: true,
  },
  {
    id: 'kodama-839',
    name: 'Kodama 839',
    date: '2026-05-26',
    depart: '16:35',
    arrive: '19:34',
    from: 'Odawara',
    to: 'Kyoto',
    car: 'Car 10',
    seats: 'Adult 16-C, Adult 16-D, Child 15-D',
    reservation: '2076',
    ticketIds: [
      'E206 414A F04B A526 3F41 5098 C538 1798',
      'E80C 4B40 8041 8E2F 4991 9821 F266 0986',
      'EE7A 3D36 F037 8758 0695 75D5 0ED7 D1DD',
    ],
    confirmed: true,
  },
  {
    id: 'nozomi-84',
    name: 'Nozomi 84',
    date: '2026-05-29',
    depart: '09:24',
    arrive: '11:54',
    from: 'Shin-Osaka',
    to: 'Tokyo',
    car: 'Car 9',
    seats: 'Adult 6-C, Adult 6-D, Child 7-D',
    reservation: '2061',
    ticketIds: ['E972 77E6 6E4B CD84 F193 3520 9779 820F', 'E378 7DEC 6A41 2691 7A19 14AC 7AF9 9EA3', 'E50E 0B9A 0637 7FE6 0507 D9FF AE0B 6D24'],
    confirmed: true,
  },
]

export type Flight = {
  id: string
  airline: string
  pnr: string
  number: string
  date: string
  depart: string
  arrive: string
  from: string
  to: string
  dropBagsBy?: string
  clearSecurityBy?: string
  boarding?: string
  group?: string
  passengers?: { who: string; nameOnTicket: string; seq: string; seat: string; ticket: string }[]
  confirmed?: boolean
}

export const FLIGHTS: Flight[] = [
  {
    id: 'out-22may',
    airline: 'Emirates',
    pnr: 'LA4ERB',
    number: 'EK318',
    date: '2026-05-22',
    depart: '02:40',
    arrive: '17:35',
    from: 'DXB',
    to: 'NRT',
    dropBagsBy: '01:10',
    clearSecurityBy: '01:40',
    boarding: '01:40',
    group: '3',
    confirmed: true,
    passengers: [
      { who: 'Sutharsan', nameOnTicket: 'Mr Sutharsan Chiranjeeviparthasaarathy', seq: '102', seat: '71G', ticket: '1762209510446' },
      { who: 'Divya',     nameOnTicket: 'Ms Divya Asurinarasimhachary',             seq: '101', seat: '71F', ticket: '1762209510445' },
      { who: 'Adira',     nameOnTicket: 'Miss Adira Divyasutharsan',                seq: '103', seat: '71E', ticket: '1762209510447' },
    ],
  },
  {
    id: 'ret-30may',
    airline: 'Emirates',
    pnr: 'LA4ERB',
    number: 'EK ___',
    date: '2026-05-30',
    depart: '— TBD —',
    arrive: '— TBD —',
    from: 'NRT',
    to: 'DXB',
    confirmed: false,
  },
]

export type Ticket = {
  id: string
  title: string
  date: string
  time?: string
  reservation?: string
  costJpy?: number
  perPersonIds?: { who: string; code: string }[]
  notes?: string
}

export const TICKETS: Ticket[] = [
  {
    id: 'disneyland-25may',
    title: 'Tokyo Disneyland — 1-Day Passport',
    date: '2026-05-25',
    reservation: 'A00571698873',
    costJpy: 24400,
    perPersonIds: [
      { who: 'Sutharsan', code: '2102012-621-06357879-0' },
      { who: 'Divya',     code: '2102012-621-06357880-6' },
      { who: 'Adira',     code: '2102032-621-01263138-9' },
    ],
    notes: 'Day trip from Minn Ueno (Disney Celebration cancelled). Use Tokyo Disney Resort App. Validity through 10 May 2027 if unused.',
  },
]

export type Restaurant = {
  id: string
  name: string
  city: 'Tokyo' | 'Kyoto' | 'Osaka' | 'Hakone'
  type: 'Indian' | 'Vegan Japanese' | 'Shojin Ryori' | 'Casual'
  bookingRequired: boolean
  addressEn: string
  addressJa?: string
  priceRange: string
  notes?: string
  bookingLink?: string
  phone?: string
}

export const RESTAURANTS: Restaurant[] = [
  // Tokyo
  { id: 'ts-tantan-ueno', name: "T's Tantan Ueno", city: 'Tokyo', type: 'Vegan Japanese', bookingRequired: false,
    addressEn: "Inside JR Ueno Station 3F ecute, Taito-ku, Tokyo", addressJa: '東京都台東区上野7-1-1 JR上野駅 3F エキュート',
    priceRange: '¥¥', notes: 'Vegan ramen, kid-friendly, no booking' },
  { id: 'ts-tantan-tokyo', name: "T's Tantan Tokyo Station", city: 'Tokyo', type: 'Vegan Japanese', bookingRequired: false,
    addressEn: 'Inside Keiyo Street, Tokyo Station', addressJa: '東京駅 京葉ストリート', priceRange: '¥¥', notes: 'Vegan ramen' },
  { id: 'ainsoph-journey', name: 'Ain Soph Journey Shinjuku', city: 'Tokyo', type: 'Vegan Japanese', bookingRequired: true,
    addressEn: 'Shinjuku, Tokyo', addressJa: '東京都新宿区', priceRange: '¥¥¥', notes: 'Book via TableCheck',
    bookingLink: 'https://www.tablecheck.com/' },
  { id: 'ainsoph-ginza', name: 'Ain Soph Ginza', city: 'Tokyo', type: 'Vegan Japanese', bookingRequired: true,
    addressEn: 'Ginza, Tokyo', addressJa: '東京都中央区銀座', priceRange: '¥¥¥', notes: 'Final dinner candidate (Fri 29 May 7 PM)' },
  { id: 'plant-more', name: 'Plant More', city: 'Tokyo', type: 'Casual', bookingRequired: false,
    addressEn: 'Lumine 1 Shinjuku 6F', addressJa: '東京都新宿区 ルミネ1 6F', priceRange: '¥¥', notes: 'Casual vegan' },
  { id: 'nataraj-harajuku', name: 'Nataraj Harajuku', city: 'Tokyo', type: 'Indian', bookingRequired: false,
    addressEn: 'Jinnan 3F Iwamoto Bldg, Shibuya', addressJa: '東京都渋谷区神南 岩本ビル3F', priceRange: '¥¥', notes: 'Indian buffet ¥1,300' },
  { id: 'mumbai-shinjuku', name: 'Mumbai Indian', city: 'Tokyo', type: 'Indian', bookingRequired: false,
    addressEn: 'Shinjuku Sumitomo Bldg, Tokyo', addressJa: '東京都新宿区 住友ビル', priceRange: '¥¥', notes: 'Thali' },
  { id: 'bon-shojin', name: 'Bon Shojin Ryori', city: 'Tokyo', type: 'Shojin Ryori', bookingRequired: true,
    addressEn: 'Ryusen, near Asakusa, Taito-ku', addressJa: '東京都台東区竜泉', priceRange: '¥¥¥¥', notes: 'Buddhist cuisine, reserve via hotel' },
  // Kyoto
  { id: 'shigetsu', name: 'Shigetsu', city: 'Kyoto', type: 'Shojin Ryori', bookingRequired: true,
    addressEn: 'Inside Tenryu-ji temple, Arashiyama, Kyoto', addressJa: '京都府京都市右京区嵯峨天龍寺芒ノ馬場町 天龍寺内',
    priceRange: '¥¥¥¥', notes: 'Michelin. BOOK 2 WEEKS AHEAD via shigetsu.com — Wed 27 May 12:00 lunch, Flower course',
    bookingLink: 'https://shigetsu.com/' },
  { id: 'mumokuteki', name: 'Mumokuteki Cafe', city: 'Kyoto', type: 'Casual', bookingRequired: false,
    addressEn: 'Downtown Kyoto', addressJa: '京都市中京区', priceRange: '¥¥', notes: 'Casual vegan' },
  { id: 'ajiro', name: 'Ajiro', city: 'Kyoto', type: 'Shojin Ryori', bookingRequired: true,
    addressEn: 'Near Myoshin-ji, Kyoto', addressJa: '京都市右京区花園 妙心寺前', priceRange: '¥¥¥¥', notes: 'Michelin Buddhist' },
  { id: 'izusen', name: 'Izusen', city: 'Kyoto', type: 'Shojin Ryori', bookingRequired: true,
    addressEn: 'Daitoku-ji, Kyoto', addressJa: '京都市北区紫野大徳寺町 大徳寺内', priceRange: '¥¥¥', notes: 'Affordable shojin ryori' },
  // Osaka
  { id: 'shama', name: 'Shama Vegetarian Indian', city: 'Osaka', type: 'Indian', bookingRequired: false,
    addressEn: 'Kitahorie, near Citadines, Osaka', addressJa: '大阪市西区北堀江', priceRange: '¥¥', notes: 'No onion/garlic/eggs. 4.5★' },
  { id: 'smile-himalayan', name: 'Smile Kitchen Himalayan Bar', city: 'Osaka', type: 'Indian', bookingRequired: false,
    addressEn: 'Namba, Osaka', addressJa: '大阪市中央区難波', priceRange: '¥¥', notes: '24-hr. Nepalese/Indian' },
]

export type PhraseCategory = 'Restaurant' | 'Train' | 'Taxi' | 'Shopping' | 'Emergency' | 'Politeness'
export type Phrase = { category: PhraseCategory; en: string; ja: string; romaji: string }

export const PHRASES: Phrase[] = [
  // Restaurant
  { category: 'Restaurant', en: 'Is this vegetarian?', ja: 'これはベジタリアンですか？', romaji: 'Kore wa bejitarian desu ka?' },
  { category: 'Restaurant', en: 'No fish stock, please.', ja: 'だし、かつお節は使わないでください。', romaji: 'Dashi, katsuobushi wa tsukawanaide kudasai.' },
  { category: 'Restaurant', en: 'Water, please.', ja: 'お水をください。', romaji: 'Omizu wo kudasai.' },
  { category: 'Restaurant', en: 'No meat, no fish, no eggs.', ja: '肉、魚、卵は食べません。', romaji: 'Niku, sakana, tamago wa tabemasen.' },
  // Train
  { category: 'Train', en: 'Where is platform __ ?', ja: '___番ホームはどこですか？', romaji: '___ -ban hōmu wa doko desu ka?' },
  { category: 'Train', en: 'Reserved seat.', ja: '指定席です。', romaji: 'Shitei-seki desu.' },
  { category: 'Train', en: 'What is the next station?', ja: '次の駅は何ですか？', romaji: 'Tsugi no eki wa nan desu ka?' },
  // Taxi
  { category: 'Taxi', en: 'Please take me to this address.', ja: 'この住所までお願いします。', romaji: 'Kono jūsho made onegai shimasu.' },
  { category: 'Taxi', en: 'How much is it?', ja: 'いくらですか？', romaji: 'Ikura desu ka?' },
  { category: 'Taxi', en: 'Stop here, please.', ja: 'ここで止めてください。', romaji: 'Koko de tomete kudasai.' },
  // Shopping
  { category: 'Shopping', en: 'How much?', ja: 'いくらですか？', romaji: 'Ikura desu ka?' },
  { category: 'Shopping', en: 'Tax-free, please.', ja: '免税でお願いします。', romaji: 'Menzei de onegai shimasu.' },
  { category: 'Shopping', en: 'Do you accept credit card?', ja: 'クレジットカードは使えますか？', romaji: 'Kurejitto kādo wa tsukaemasu ka?' },
  // Emergency
  { category: 'Emergency', en: 'Please help.', ja: '助けてください。', romaji: 'Tasukete kudasai.' },
  { category: 'Emergency', en: 'I need a doctor.', ja: '医者が必要です。', romaji: 'Isha ga hitsuyō desu.' },
  { category: 'Emergency', en: 'Police, please.', ja: '警察を呼んでください。', romaji: 'Keisatsu wo yonde kudasai.' },
  { category: 'Emergency', en: 'I have lost my child.', ja: '子供が迷子になりました。', romaji: 'Kodomo ga maigo ni narimashita.' },
  // Politeness
  { category: 'Politeness', en: 'Thank you.', ja: 'ありがとうございます。', romaji: 'Arigatō gozaimasu.' },
  { category: 'Politeness', en: 'Excuse me.', ja: 'すみません。', romaji: 'Sumimasen.' },
  { category: 'Politeness', en: "I'm sorry.", ja: 'ごめんなさい。', romaji: 'Gomen nasai.' },
]

export const VEGETARIAN_CARD = {
  header: '私たちは厳格な菜食主義者です',
  body: '肉、魚、鶏肉、卵、だし、かつお節、魚醤、魚介エキスを一切食べません。',
  footer: '野菜、豆腐、米、麺のみ食べます。よろしくお願いします。',
  jain: 'たまねぎ、にんにくも食べません。',
  en: 'We are strict vegetarians. We do not eat meat, fish, chicken, eggs, dashi, bonito flakes, fish sauce, or any seafood extract. We eat only vegetables, tofu, rice, and noodles. Thank you very much.',
}

export const ADIRA_CARD_JA = (parentPhones: string, hotelToday: string) =>
  `私は迷子です。\n名前：アディラ\n両親に電話してください：${parentPhones}\n今夜のホテル：${hotelToday}\nありがとうございます。`

export type Activity = {
  date: string
  time?: string
  title: string
  city: string
  kind: 'transport' | 'sight' | 'meal' | 'check-in' | 'check-out' | 'park'
  ref?: string  // links to trains/hotels/restaurants/tickets id
  notes?: string
}

export const ACTIVITIES: Activity[] = [
  // Day 1 Fri 22 May - Arrive Tokyo
  { date: '2026-05-22', time: '17:35', title: 'Arrive Narita (NRT)', city: 'Tokyo', kind: 'transport' },
  { date: '2026-05-22', time: '19:30', title: 'Check in Minn Ueno Iriya', city: 'Tokyo', kind: 'check-in', ref: 'minn-ueno' },
  { date: '2026-05-22', title: 'Dinner: T\'s Tantan Ueno', city: 'Tokyo', kind: 'meal', ref: 'ts-tantan-ueno' },

  // Day 2 Sat 23 May - Tokyo
  { date: '2026-05-23', title: 'Asakusa morning (Senso-ji)', city: 'Tokyo', kind: 'sight' },
  { date: '2026-05-23', time: '18:00', title: 'Shibuya Sky (sunset slot)', city: 'Tokyo', kind: 'sight', notes: 'Book ahead' },

  // Day 3 Sun 24 May - Free Tokyo day (Disney Celebration cancelled)
  { date: '2026-05-24', title: 'Ueno Park / Skytree / free Tokyo day', city: 'Tokyo', kind: 'sight',
    notes: 'Open day — pick from Ueno Zoo, Skytree, Imperial Palace gardens, Akihabara, etc.' },
  { date: '2026-05-24', title: 'Evening: relax / dinner near Minn Ueno', city: 'Tokyo', kind: 'meal' },

  // Day 4 Mon 25 May - Disneyland day trip from Minn Ueno
  { date: '2026-05-25', time: '07:30', title: 'Travel Ueno → Maihama (JR Keihin-Tohoku + Keiyo lines, ~40 min)', city: 'Tokyo', kind: 'transport' },
  { date: '2026-05-25', time: '09:00', title: 'Tokyo Disneyland — 1-Day Passport', city: 'Tokyo', kind: 'park', ref: 'disneyland-25may',
    notes: 'Reservation A00571698873. Park opens 09:00 (no Happy Entry — Celebration hotel cancelled).' },
  { date: '2026-05-25', title: 'Return to Minn Ueno Iriya in the evening', city: 'Tokyo', kind: 'check-in', ref: 'minn-ueno' },

  // Day 5 Tue 26 May - Hakone day trip + Kyoto
  { date: '2026-05-26', time: '07:36', title: 'Hikari 633 → Odawara (Car 9, 15-C/D + 14-D)', city: 'Tokyo', kind: 'transport', ref: 'hikari-633' },
  { date: '2026-05-26', title: 'Hakone day trip', city: 'Hakone', kind: 'sight' },
  { date: '2026-05-26', time: '16:35', title: 'Kodama 839 Odawara → Kyoto', city: 'Hakone', kind: 'transport', ref: 'kodama-839' },
  { date: '2026-05-26', time: '20:00', title: 'Check in Minn Karasuma Gojo', city: 'Kyoto', kind: 'check-in', ref: 'minn-kyoto' },

  // Day 6 Wed 27 May - Kyoto + travel to Osaka
  { date: '2026-05-27', time: '12:00', title: 'Shigetsu lunch (Flower course) — BOOK', city: 'Kyoto', kind: 'meal', ref: 'shigetsu' },
  { date: '2026-05-27', title: 'Arashiyama bamboo grove', city: 'Kyoto', kind: 'sight' },
  { date: '2026-05-27', title: 'Travel to Osaka — check in Citadines Namba', city: 'Osaka', kind: 'check-in', ref: 'citadines-namba' },

  // Day 7 Thu 28 May - Osaka
  { date: '2026-05-28', title: 'Osaka day — Dotonbori, Namba', city: 'Osaka', kind: 'sight' },
  { date: '2026-05-28', title: 'Dinner: Shama Vegetarian Indian', city: 'Osaka', kind: 'meal', ref: 'shama' },

  // Day 8 Fri 29 May - back to Tokyo
  { date: '2026-05-29', time: '09:24', title: 'Nozomi 84 Shin-Osaka → Tokyo (Car 9, 6-C/D + 7-D)', city: 'Osaka', kind: 'transport', ref: 'nozomi-84' },
  { date: '2026-05-29', title: 'Check in MONday Apart Ningyocho', city: 'Tokyo', kind: 'check-in', ref: 'monday-ningyocho' },
  { date: '2026-05-29', time: '20:00', title: 'TeamLab Planets — BOOK', city: 'Tokyo', kind: 'sight' },
  { date: '2026-05-29', time: '19:00', title: 'Ain Soph Ginza dinner — BOOK', city: 'Tokyo', kind: 'meal', ref: 'ainsoph-ginza' },

  // Day 9 Sat 30 May - Depart
  { date: '2026-05-30', title: 'T-CAT bus to Narita', city: 'Tokyo', kind: 'transport' },
  { date: '2026-05-30', title: 'Fly NRT → DXB (Emirates)', city: 'Tokyo', kind: 'transport' },
]

export type BookingStatus = {
  id: string
  label: string
  done: boolean
  category: 'flights' | 'hotels' | 'trains' | 'tickets' | 'restaurants' | 'misc'
  detail?: string
  link?: string
}

export const BOOKING_STATUS: BookingStatus[] = [
  { id: 'flight-out', label: 'Flight out · EK318 · 22 May 02:40 → NRT · PNR LA4ERB', done: true, category: 'flights' },
  { id: 'flight-ret', label: 'Flight return · 30 May NRT → DXB (number TBD)', done: false, category: 'flights', detail: 'Confirm Emirates return flight number, depart/arrive times.' },
  { id: 'hotel-minn-ueno', label: 'Hotel: Minn Ueno Iriya · 22–26 May · #5694.443.883', done: true, category: 'hotels' },
  { id: 'hotel-minn-kyoto', label: 'Hotel: Minn Karasuma Gojo Kyoto · 26 May · #6840.916.416', done: true, category: 'hotels' },
  { id: 'hotel-citadines', label: 'Hotel: Citadines Namba Osaka · 27–29 May · #6816.645.167', done: true, category: 'hotels' },
  { id: 'hotel-monday', label: 'Hotel: MONday Apart Ningyocho · 29 May · #5388.029.316', done: true, category: 'hotels' },
  { id: 'shinkansen-hikari', label: 'Hikari 633 · 26 May · Tokyo→Odawara · Res 2819', done: true, category: 'trains' },
  { id: 'shinkansen-kodama', label: 'Kodama 839 · 26 May · Odawara→Kyoto · Res 2076', done: true, category: 'trains' },
  { id: 'shinkansen-nozomi', label: 'Nozomi 84 · 29 May · Shin-Osaka→Tokyo · Res 2061', done: true, category: 'trains' },
  { id: 'disney', label: 'Tokyo Disneyland · 25 May · #A00571698873', done: true, category: 'tickets' },
  { id: 'shigetsu', label: 'Shigetsu Kyoto — URGENT (Wed 27 May lunch)', done: false, category: 'restaurants',
    link: 'https://shigetsu.com/', detail: 'Reserve Flower course, 12:00. 2-week lead time.' },
  { id: 'teamlab', label: 'TeamLab Planets — Fri 29 May evening', done: false, category: 'tickets',
    link: 'https://planets.teamlab.art/' },
  { id: 'shibuya-sky', label: 'Shibuya Sky — Sat 23 May 6 PM sunset', done: false, category: 'tickets',
    link: 'https://www.shibuya-scramble-square.com/sky/' },
  { id: 'ainsoph-ginza', label: 'Ain Soph Ginza dinner — Fri 29 May 7 PM', done: false, category: 'restaurants' },
  { id: 'insurance', label: 'Travel insurance', done: false, category: 'misc' },
  { id: 'esim', label: 'eSIM (Airalo Japan) or pocket WiFi', done: false, category: 'misc',
    link: 'https://www.airalo.com/japan-esim' },
  { id: 'yamato', label: 'Yamato luggage forwarding (arrange on arrival)', done: false, category: 'misc' },
]

export type Checklist = { id: string; title: string; items: { id: string; text: string }[] }

export const CHECKLISTS: Checklist[] = [
  {
    id: 'pre-trip',
    title: 'Pre-trip',
    items: [
      { id: 'p1', text: 'Confirm flight PNRs & check seats' },
      { id: 'p2', text: 'Book Shigetsu Kyoto (2 weeks ahead)' },
      { id: 'p3', text: 'Book TeamLab Planets & Shibuya Sky' },
      { id: 'p4', text: 'Buy travel insurance for all 3' },
      { id: 'p5', text: 'Activate Emirates roaming + buy Airalo eSIM' },
      { id: 'p6', text: 'Install Suica in Apple Wallet for both phones' },
      { id: 'p7', text: 'Pack passports, JR tickets printout, vegetarian card printout (backup)' },
      { id: 'p8', text: 'Adira: print pocket safety card' },
    ],
  },
  {
    id: 'daily-morning',
    title: 'Daily morning',
    items: [
      { id: 'm1', text: 'Suica card / Apple Wallet charged' },
      { id: 'm2', text: 'Hotel key card' },
      { id: 'm3', text: 'Water bottle' },
      { id: 'm4', text: 'Sunscreen' },
      { id: 'm5', text: "Adira's snack pouch" },
      { id: 'm6', text: 'Phone charger / power bank' },
    ],
  },
  {
    id: 'adira-bag',
    title: "Adira's day bag",
    items: [
      { id: 'a1', text: 'Familiar snacks (biscuits, fruit pouch)' },
      { id: 'a2', text: 'Water bottle' },
      { id: 'a3', text: 'Wipes & spare clothes' },
      { id: 'a4', text: 'Small toy / colouring book' },
      { id: 'a5', text: 'Pocket safety card (Japanese)' },
      { id: 'a6', text: 'Sun hat' },
    ],
  },
  {
    id: 'tax-free',
    title: 'Tax-free shopping',
    items: [
      { id: 't1', text: 'Carry passport every time' },
      { id: 't2', text: 'Keep all receipts in one envelope' },
      { id: 't3', text: 'Leave tax-free packages sealed until you fly home' },
      { id: 't4', text: 'Spend ≥ ¥5,000 per store for general goods' },
    ],
  },
]

export type TaxiDestination = {
  id: string
  label: string
  nameJa: string
  addressJa: string
  notes?: string
}

export const TAXI_DESTINATIONS: TaxiDestination[] = [
  { id: 'narita-t2', label: 'Narita Airport — Terminal 2', nameJa: '成田空港 第2ターミナル', addressJa: '千葉県成田市古込1-1 第2旅客ターミナルビル' },
  { id: 'tokyo-station', label: 'Tokyo Station', nameJa: '東京駅', addressJa: '東京都千代田区丸の内1丁目' },
  { id: 'shin-osaka', label: 'Shin-Osaka Station', nameJa: '新大阪駅', addressJa: '大阪市淀川区西中島5丁目' },
  { id: 'kyoto-station', label: 'Kyoto Station', nameJa: '京都駅', addressJa: '京都市下京区東塩小路高倉町8-3' },
  { id: 'maihama', label: 'Maihama Station (Disneyland)', nameJa: '舞浜駅', addressJa: '千葉県浦安市舞浜26' },
  { id: 'shibuya', label: 'Shibuya Station', nameJa: '渋谷駅', addressJa: '東京都渋谷区道玄坂' },
  { id: 'asakusa', label: 'Asakusa (Senso-ji)', nameJa: '浅草寺', addressJa: '東京都台東区浅草2-3-1' },
  { id: 't-cat', label: 'T-CAT (Tokyo City Air Terminal)', nameJa: '東京シティエアターミナル', addressJa: '東京都中央区日本橋箱崎町42-1' },
]

export type SouvenirRecipient = { id: string; name: string; group: string }
export const DEFAULT_RECIPIENTS: SouvenirRecipient[] = [
  { id: 'sp-mother', name: "Sutharsan's mother", group: 'Family' },
  { id: 'sp-father', name: "Sutharsan's father", group: 'Family' },
  { id: 'dv-mother', name: "Divya's mother", group: 'Family' },
  { id: 'dv-father', name: "Divya's father", group: 'Family' },
  { id: 'adira-teacher', name: "Adira's nursery teacher", group: 'School' },
  { id: 'sp-office', name: "Sutharsan's office team", group: 'Work' },
  { id: 'dv-office', name: "Divya's office team", group: 'Work' },
]

export const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Activities', 'Hotels', 'Misc'] as const
export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number]

export const EMERGENCY = {
  police: '110',
  ambulance: '119',
  uaeEmbassyTokyo: '+81 3-5489-0804',
}

/**
 * Documents stored in the Supabase Storage `documents` bucket.
 * The Documents page reads from these paths. To upload: Supabase Dashboard →
 * Storage → `documents` → create folders matching the family member id (sutharsan,
 * divya, adira) and upload the PDFs with the exact filenames below.
 */
export type DocItem = {
  id: string
  title: string
  who: 'sutharsan' | 'divya' | 'adira' | 'family'
  type: 'passport' | 'visa' | 'eid' | 'certificate' | 'birth' | 'other'
  path: string  // path inside the `documents` Supabase bucket
}

export const DOCUMENTS: DocItem[] = [
  // Sutharsan
  { id: 'p-su',  title: 'Passport',         who: 'sutharsan', type: 'passport', path: 'sutharsan/passport.pdf' },
  { id: 'v-su',  title: 'Japan visa',       who: 'sutharsan', type: 'visa',     path: 'sutharsan/visa.pdf' },
  { id: 'ev-su', title: 'Japan eVISA doc',  who: 'sutharsan', type: 'visa',     path: 'sutharsan/evisa.pdf' },
  { id: 'e-su',  title: 'Emirates ID',      who: 'sutharsan', type: 'eid',      path: 'sutharsan/eid.pdf' },
  // Divya
  { id: 'p-di',  title: 'Passport',         who: 'divya',     type: 'passport', path: 'divya/passport.pdf' },
  { id: 'v-di',  title: 'Japan visa',       who: 'divya',     type: 'visa',     path: 'divya/visa.pdf' },
  { id: 'ev-di', title: 'Japan eVISA doc',  who: 'divya',     type: 'visa',     path: 'divya/evisa.pdf' },
  { id: 'e-di',  title: 'Emirates ID',      who: 'divya',     type: 'eid',      path: 'divya/eid.pdf' },
  // Adira
  { id: 'p-ad',  title: 'Passport',         who: 'adira',     type: 'passport', path: 'adira/passport.pdf' },
  { id: 'v-ad',  title: 'Japan visa',       who: 'adira',     type: 'visa',     path: 'adira/visa.pdf' },
  { id: 'ev-ad', title: 'Japan eVISA doc',  who: 'adira',     type: 'visa',     path: 'adira/evisa.pdf' },
  { id: 'e-ad',  title: 'Emirates ID',      who: 'adira',     type: 'eid',      path: 'adira/eid.pdf' },
  { id: 'b-ad',  title: 'Birth certificate',who: 'adira',     type: 'birth',    path: 'adira/birth-certificate.pdf' },
  // Family
  { id: 'm-fam',     title: 'Marriage certificate',         who: 'family', type: 'certificate', path: 'family/marriage-certificate.pdf' },
  { id: 'bp-fam',    title: 'Boarding pass (DXB → NRT)',    who: 'family', type: 'other',       path: 'family/boarding-pass-dxb-nrt.pdf' },
  { id: 'hu-fam',    title: 'Booking — Minn Ueno',          who: 'family', type: 'other',       path: 'family/hotel-minn-ueno.pdf' },
  { id: 'hk-fam',    title: 'Booking — Minn Kyoto',         who: 'family', type: 'other',       path: 'family/hotel-minn-kyoto.pdf' },
  { id: 'hc-fam',    title: 'Booking — Citadines Namba',    who: 'family', type: 'other',       path: 'family/hotel-citadines-namba.pdf' },
  { id: 'hm-fam',    title: 'Booking — MONday Ningyocho',   who: 'family', type: 'other',       path: 'family/hotel-monday-ningyocho.pdf' },
  { id: 'sn-fam',    title: 'Shinkansen Nozomi 84 ticket',  who: 'family', type: 'other',       path: 'family/shinkansen-nozomi84.pdf' },
  { id: 'dp-fam',    title: 'Disney park ticket (email)',   who: 'family', type: 'other',       path: 'family/disney-park-ticket.eml' },
]
