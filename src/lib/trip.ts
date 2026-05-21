/**
 * Pre-loaded trip data — single source of truth.
 * Edit the placeholder fields (passports, phones, PNRs) before deploying.
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
  nameJa: string
  dob?: string
  age?: number
  passportCountry?: string
  passportNumber?: string
  passportExpiry?: string
  mobileDubai?: string
  mobileRoaming?: string
  esimJp?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  bloodGroup?: string
  medical?: string
  allergies?: string
  favorites?: string[]
  photoPath?: string
}

export const FAMILY: Family[] = [
  {
    id: 'sutharsan',
    role: 'Father',
    name: 'Sutharsan Parthasarathy',
    nameJa: 'スタルサン・パルタサラティ',
    passportCountry: 'India',
    passportNumber: '— to be filled —',
    passportExpiry: '— to be filled —',
    mobileDubai: '+971 — to be filled —',
    mobileRoaming: '+971 — same with roaming —',
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
    nameJa: 'ディヴィヤ',
    passportCountry: 'India',
    passportNumber: '— to be filled —',
    passportExpiry: '— to be filled —',
    mobileDubai: '+971 — to be filled —',
    mobileRoaming: '+971 — same with roaming —',
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
    nameJa: 'アディラ',
    age: 4,
    passportCountry: 'India',
    passportNumber: '— to be filled —',
    passportExpiry: '— to be filled —',
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
  checkIn: string  // YYYY-MM-DD
  checkOut: string // YYYY-MM-DD
  city: 'Tokyo' | 'Hakone' | 'Kyoto' | 'Osaka'
  confirmation?: string
  notes?: string
}

export const HOTELS: Hotel[] = [
  {
    id: 'minn-ueno',
    name: 'Minn Ueno Iriya',
    nameJa: 'Minn 上野 入谷',
    addressEn: 'Taito-ku Iriya 2-34-5, Tokyo, Japan',
    addressJa: '東京都台東区入谷2-34-5',
    city: 'Tokyo',
    checkIn: '2026-05-22',
    checkOut: '2026-05-26',
    notes: '4 nights paid. 24 May night unused (Disney hotel). Luggage stays in room.',
  },
  {
    id: 'disney-celebration',
    name: 'Tokyo Disney Celebration Hotel',
    nameJa: '東京ディズニーセレブレーションホテル',
    addressEn: '1-1 Maihama, Urayasu-shi, Chiba, Japan',
    addressJa: '千葉県浦安市舞浜1-1',
    city: 'Tokyo',
    checkIn: '2026-05-24',
    checkOut: '2026-05-25',
    notes: 'Happy Entry 15-min early park access.',
  },
  {
    id: 'minn-kyoto',
    name: 'Minn Karasuma Gojo Kyoto',
    nameJa: 'Minn 烏丸五条 京都',
    addressEn: 'Karasuma-Gojo, Shimogyo-ku, Kyoto, Japan',
    addressJa: '京都府京都市下京区烏丸五条',
    city: 'Kyoto',
    checkIn: '2026-05-26',
    checkOut: '2026-05-27',
  },
  {
    id: 'citadines-namba',
    name: 'Citadines Namba Osaka',
    nameJa: 'シタディーン難波大阪',
    addressEn: '2-20-1 Nishishinsaibashi, Chuo-ku, Osaka, Japan',
    addressJa: '大阪府大阪市中央区西心斎橋2-20-1',
    city: 'Osaka',
    checkIn: '2026-05-27',
    checkOut: '2026-05-29',
    notes: '2 nights.',
  },
  {
    id: 'monday-ningyocho',
    name: 'MONday Apart Nihonbashi Ningyocho',
    nameJa: 'MONday Apart 日本橋人形町',
    addressEn: 'Nihonbashi-Ningyocho, Chuo-ku, Tokyo, Japan',
    addressJa: '東京都中央区日本橋人形町',
    city: 'Tokyo',
    checkIn: '2026-05-29',
    checkOut: '2026-05-30',
    notes: 'Close to T-CAT airport limousine bus.',
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
}

export const FLIGHTS: Flight[] = [
  {
    id: 'out-22may',
    airline: 'Emirates',
    pnr: '— PNR to be filled —',
    number: 'EK ___',
    date: '2026-05-22',
    depart: '02:40',
    arrive: '17:35',
    from: 'DXB',
    to: 'NRT',
  },
  {
    id: 'ret-30may',
    airline: 'Emirates',
    pnr: '— PNR to be filled —',
    number: 'EK ___',
    date: '2026-05-30',
    depart: '— TBD —',
    arrive: '— TBD —',
    from: 'NRT',
    to: 'DXB',
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
  ref?: string  // links to trains/hotels/restaurants id
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

  // Day 3 Sun 24 May - Disney
  { date: '2026-05-24', title: 'Tokyo Disneyland (Happy Entry)', city: 'Tokyo', kind: 'park' },
  { date: '2026-05-24', title: 'Stay: Disney Celebration Hotel', city: 'Tokyo', kind: 'check-in', ref: 'disney-celebration' },

  // Day 4 Mon 25 May - DisneySea / back to Minn
  { date: '2026-05-25', title: 'DisneySea or rest day', city: 'Tokyo', kind: 'park' },
  { date: '2026-05-25', title: 'Return to Minn Ueno (luggage there)', city: 'Tokyo', kind: 'check-in', ref: 'minn-ueno' },

  // Day 5 Tue 26 May - Hakone day trip + Kyoto
  { date: '2026-05-26', time: '07:36', title: 'Hikari 633 → Odawara (Car 9, 15-C/D + 14-D)', city: 'Tokyo', kind: 'transport', ref: 'hikari-633' },
  { date: '2026-05-26', title: 'Hakone day trip', city: 'Hakone', kind: 'sight' },
  { date: '2026-05-26', time: '16:35', title: 'Kodama 839 Odawara → Kyoto', city: 'Hakone', kind: 'transport', ref: 'kodama-839' },
  { date: '2026-05-26', time: '20:00', title: 'Check in Minn Karasuma Gojo', city: 'Kyoto', kind: 'check-in', ref: 'minn-kyoto' },

  // Day 6 Wed 27 May - Kyoto
  { date: '2026-05-27', time: '12:00', title: 'Shigetsu lunch (Flower course) — BOOK', city: 'Kyoto', kind: 'meal', ref: 'shigetsu' },
  { date: '2026-05-27', title: 'Arashiyama bamboo grove', city: 'Kyoto', kind: 'sight' },
  { date: '2026-05-27', title: 'Travel to Osaka — check in Citadines Namba', city: 'Osaka', kind: 'check-in', ref: 'citadines-namba' },

  // Day 7 Thu 28 May - Osaka
  { date: '2026-05-28', title: 'Osaka day — Dotonbori, Namba', city: 'Osaka', kind: 'sight' },
  { date: '2026-05-28', title: 'Dinner: Shama Vegetarian Indian', city: 'Osaka', kind: 'meal', ref: 'shama' },

  // Day 8 Fri 29 May - back to Tokyo
  { date: '2026-05-29', time: '09:24', title: 'Nozomi 84 Shin-Osaka → Tokyo', city: 'Osaka', kind: 'transport', ref: 'nozomi-84' },
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
  { id: 'flights', label: 'Flights (Emirates DXB–NRT round trip)', done: true, category: 'flights' },
  { id: 'hotels', label: 'All 5 hotels', done: true, category: 'hotels' },
  { id: 'shinkansen', label: 'Bullet trains × 3 (Hikari/Kodama/Nozomi)', done: true, category: 'trains' },
  { id: 'disney', label: 'Disneyland tickets', done: true, category: 'tickets' },
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
