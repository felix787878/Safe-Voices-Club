You are an expert full-stack developer. Build a complete, production-ready 
Progressive Web App (PWA) called "Safe Voices Club" — a personal safety and harassment 
reporting platform for Indonesian users.

Deploy-ready on Vercel. Use the following stack:
- Frontend: Next.js 14 (App Router) + TypeScript
- Styling: Tailwind CSS + shadcn/ui
- Animations: Framer Motion
- Backend/DB: Supabase (free tier) — real-time community map data
- Maps: Leaflet.js + OpenStreetMap (no API key needed)
- PWA: next-pwa library

---

## HONEST DESIGN PHILOSOPHY

This is a safety tool, NOT a full emergency system. The UI must be honest
about this. Web browsers CANNOT make automatic calls or send SMS without 
user confirmation — this is an OS-level security restriction.

The panic sequence is therefore designed around the fastest possible path
to get the user to take ONE confirming action (tap), not to automate 
everything silently.

---

## COLOR PALETTE & BRANDING

- Primary: Deep purple #6C3483 (trust, calm)
- Emergency/Danger: Red #E74C3C
- Safe/Success: Green #27AE60
- Warning: Orange #E67E22
- Background: #F8F9FA (light) with full dark mode support
- App name: "Safe Voices Club" with tagline "Lindungi Dirimu, Jaga Sesama"
- Font: Inter for UI, system-ui as fallback

---

## PAGE STRUCTURE

---

### 1. ONBOARDING FLOW (First-time users only)

Stored in localStorage key: "SafeVoicesClub_onboarding_complete"
Show only when this key is absent or false.

Step 1 — Welcome Screen
- Full-screen illustration (png placeholder) with app logo
- Headline: "Kamu Tidak Sendirian"
- CTA: "Mulai Setup" button

Step 2 — Emergency Contacts Setup
- Input up to 3 emergency WhatsApp contacts
- Fields per contact: Name (text), Phone number (with +62 validation)
- Phone validation: strip leading 0, prepend +62, only accept Indonesian 
  mobile formats (08xx → +628xx)
- Show live preview of WhatsApp link as user types
- Minimum 1 contact required to proceed; show error if empty
- CTA: "Lanjut" / Skip option shows warning banner later on dashboard

Step 3 — Permissions Explanation
- Three cards explaining WHY each permission is needed:
  🎙️ Mikrofon → "Merekam audio sebagai bukti"
  📍 Lokasi → "Mengirim koordinat ke kontak darurat"
  🔔 Notifikasi → "Opsional — untuk pengingat keamanan"
- Do NOT request permissions here — just explain. Permissions are 
  requested lazily on first use of each feature.
- CTA: "Saya Mengerti, Mulai" → mark onboarding complete, redirect to /

---

### 2. MAIN DASHBOARD (/)

Layout: Two vertical sections (mobile-first, 375–430px primary target)

TOP SECTION — "Kontak Darurat" (40% viewport)
- Display saved emergency contacts (max 3) as cards with:
  - Avatar with initials (colored by name hash)
  - Name and formatted phone number
  - WhatsApp icon shortcut button (opens wa.me link)
  - Edit (pencil icon) / Delete (trash icon) per card
- "+ Tambah Kontak" button if fewer than 3 contacts saved
- All data persisted in localStorage key: "SafeVoicesClub_emergency_contacts"
- If 0 contacts: show red warning banner "⚠️ Tambahkan kontak darurat 
  agar fitur panik berfungsi penuh"

BOTTOM SECTION — "Zona Panik" (60% viewport)
- Large, full-width rounded card with pulsing border animation
- Label: "PANIK?" in large bold text
- Sub-label: "Ketuk 3x Cepat atau Goyangkan HP"
- Animated tap icon (three concentric ripple rings)
- Visual tap progress counter: dots 1/3, 2/3, 3/3 (appear as user taps)
- Background: deep purple gradient → flashes red on activation
- Tap window: 3 taps within 1.5 seconds triggers panic sequence
- Shake trigger: DeviceMotionEvent API, threshold > 25 m/s² acceleration,
  3 qualifying shakes within 2 seconds triggers panic sequence
- On mobile browsers that block DeviceMotionEvent, show small text: 
  "Goyangan mungkin tidak tersedia di browser ini"

PERSISTENT ELEMENTS (all pages)
- Bottom navigation bar: 🏠 Beranda | 🗺️ Peta | 🎙️ Rekaman | ℹ️ Info
- Floating Action Button (FAB) center-bottom: red circle with shield icon
  — this is a shortcut to trigger panic sequence from any page
- Quick Exit button: small inconspicuous icon bottom-left (see feature below)

---

### 3. PANIC SEQUENCE (triggered by triple-tap, shake, or FAB)

Full-screen overlay with red gradient background.
Show 4 status cards updating live with ✓ / ✗ / ⏳ indicators.

REVISED PRIORITY ORDER (most critical first):

─────────────────────────────────────────────
ACTION 1 — CALL 112 (Emergency Services — PRIMARY)
─────────────────────────────────────────────
- Immediately show a large full-screen prompt:
  "Menghubungi 112 (Darurat Nasional)..."
- 3-second countdown timer displayed prominently
- After countdown: window.location.href = 'tel:112'
  (This opens the dialer pre-filled — user taps green call button once)
- Display text: "Satu ketukan untuk terhubung ke layanan darurat"
- Show secondary button: "Hubungi Polisi (110)" → tel:110

─────────────────────────────────────────────
ACTION 2 — LOCATION CAPTURE (runs immediately in parallel)
─────────────────────────────────────────────
- Call navigator.geolocation.getCurrentPosition() with 
  { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
- On success: generate Google Maps link and display coordinates
- Copy-to-clipboard button for coordinates
- Also save anonymously to Supabase table "panic_events":
  session_id (anonymous UUID from localStorage "SafeVoicesClub_session_id"),
  latitude, longitude, timestamp, is_resolved: false
- On failure: show "Lokasi tidak tersedia — izinkan akses lokasi" with 
  Settings shortcut

─────────────────────────────────────────────
ACTION 3 — WHATSAPP ALERTS (tertiary — after call prompt)
─────────────────────────────────────────────
- Open WhatsApp deep link for Contact 1:
  https://wa.me/[number]?text=DARURAT!%20Saya%20merasa%20terancam.%20Tolong%20hubungi%20saya.%20Lokasi%3A%20[google_maps_link]
  (inject location link if captured, otherwise omit location part)
- Open in new tab so panic screen stays visible
- Show buttons for Contact 2 and Contact 3 as well
- Fallback: if WhatsApp link fails to open, show sms: deep link button
- If 0 contacts saved: show "Belum ada kontak darurat — tambahkan di Beranda"

─────────────────────────────────────────────
ACTION 4 — AUDIO RECORDING (runs in background)
─────────────────────────────────────────────
- Request getUserMedia({ audio: true }) with graceful permission prompt
- Format: audio/webm (native browser MediaRecorder format — do NOT use 
  mp3 or wav — those require external libraries and may fail)
- Duration: 120 seconds max with countdown timer (e.g., "Merekam: 1:47")
- Show red pulsing dot + "Merekam..." label
- On completion or manual stop: save blob to localStorage as base64
  Key format: "SafeVoicesClub_recording_[ISO_timestamp]"
  Value: { data: base64string, duration: seconds, size: bytes }
- Show "Rekaman Tersimpan ✓" toast
- On permission denied: show "Mikrofon tidak tersedia — izinkan akses 
  mikrofon di pengaturan browser" without breaking other actions

─────────────────────────────────────────────
PANIC SCREEN LAYOUT:
- Full-screen red overlay with Framer Motion entrance animation
- Top area: countdown to 112 dial (3 seconds) with large timer
- Status cards row: 📞 Panggilan | 📍 Lokasi | 💬 WhatsApp | 🎙️ Rekaman
- Middle: large "HUBUNGI 110 (POLISI)" secondary button
- WhatsApp contact buttons below
- Bottom: large green "SAYA SUDAH AMAN" button — stops recording, 
  marks panic_event as resolved in Supabase, dismisses overlay
- Top-right: QUICK EXIT button (X icon) — see feature below

---

### 4. QUICK EXIT / DISGUISE FEATURE

Floating button always visible on all pages:
- Position: bottom-left, 44px minimum touch target
- Icon: small inconspicuous symbol (e.g., eye with slash, or grid icon)
- NOT labeled "Quick Exit" — label it "⚙️" or "≡" to avoid detection

On click:
- Immediately replace DOM content with a realistic Indonesian weather 
  widget UI (show fake Jakarta weather, humidity, wind speed, forecast)
- Change URL using window.history.replaceState(null, '', '/cuaca')
- Weather UI should look like a real standalone widget, not part of Safe Voices Club
- Pressing browser back OR a hidden trigger (tap weather icon 3x fast) 
  restores Safe Voices Club app
- Also implement /kalkulator route as alternative decoy (simple calculator)
- Decoy pages must have proper <title> tags ("Cuaca Jakarta" / "Kalkulator")

---

### 5. COMMUNITY EMERGENCY MAP (/peta)

Using Leaflet.js + OpenStreetMap tiles (no API key required).

REAL-TIME PANIC MARKERS:
- On mount: fetch from Supabase "panic_events" where 
  created_at > (now - 24 hours) AND is_resolved = false
- Display as red pulsing CSS-animated markers
- Click marker → popup: "🚨 Laporan Darurat — [relative time ago]"
  (no personal info shown — anonymous)
- Auto-center map on user's current location (ask permission on mount)
- If permission denied: center on Jakarta (-6.2088, 106.8456) as default

MANUAL INCIDENT REPORTS:
- Floating "+ Laporkan Kejadian" button (bottom-right)
- Sliding modal form with fields:
  - Jenis kejadian (dropdown): Catcalling | Penguntitan | Pelecehan fisik | 
    Pelecehan digital | Eksibisionisme | Intimidasi | Lainnya
  - Deskripsi (textarea, optional, max 200 chars)
  - Waktu kejadian (datetime-local input, default: now)
  - Lokasi: auto-detect button OR tap-on-map pin
- Submit → insert to Supabase "incident_reports" table
- Show as orange markers (differentiated from red panic markers)
- Show toast: "Laporan berhasil dikirim. Terima kasih."

HEATMAP:
- Use Leaflet.heat plugin
- Toggle button top-right: "Tampilkan Zona Rawan" / "Sembunyikan Heatmap"
- Heatmap uses data from last 30 days of incident_reports

LEGEND:
- Small bottom-right legend card: 🔴 Kejadian darurat (24 jam) | 
  🟠 Laporan pelecehan | 🟡 Zona rawan (heatmap)

---

### 6. AUDIO EVIDENCE VAULT (/rekaman)

- On mount: read all localStorage keys matching "SafeVoicesClub_recording_*"
- Display as cards sorted by newest first, each showing:
  - Date and time (formatted in Indonesian: "Senin, 9 Juni 2025 — 14:32")
  - Duration (e.g., "1 menit 47 detik")
  - File size (e.g., "2.3 MB")
  - Play button with inline waveform visualization using Web Audio API
    (draw AudioBuffer channel data as SVG waveform)
  - Download button → export as .webm file named 
    "SafeVoicesClub_rekaman_YYYY-MM-DD_HH-mm.webm"
  - Delete button → confirmation dialog: "Hapus rekaman ini? Tindakan 
    ini tidak dapat dibatalkan." with Cancel/Hapus buttons

- If empty: show empty state with illustration and text:
  "Belum ada rekaman. Rekaman akan muncul di sini setelah kamu 
   mengaktifkan mode panik."

- Warning banner (sticky top): "⚠️ Rekaman tersimpan di perangkat ini 
  saja. Segera kirim ke polisi atau simpan ke cloud sebagai bukti."

- localStorage quota check: if stored data > 80% of estimated 5MB limit,
  show warning: "Penyimpanan hampir penuh — hapus rekaman lama"

---

### 7. EDUCATION & RESOURCES (/info)

Two tabs: "Kenali Pelecehan" and "Pusat Bantuan"

TAB 1 — "Kenali Pelecehan"
Accordion sections for each type (use Framer Motion for expand/collapse):

1. Pelecehan Verbal
   - Definisi, contoh (catcalling, komentar tubuh, siulan)
   - Apa yang bisa kamu lakukan

2. Pelecehan Fisik
   - Definisi, contoh (sentuhan tanpa izin, penghadangan)
   - Langkah-langkah respons

3. Pelecehan Digital / Online
   - Definisi, contoh (revenge porn, stalking online, dick pics)
   - Platform pelaporan: Kominfo, platform sosial media

4. di Tempat Kerja
   - Definisi, contoh, hak hukum UU No. 12/2022

5. di Transportasi Umum
   - Contoh, tombol darurat KRL/MRT, cara lapor ke petugas

Bystander Guide — "Metode 5D":
- 5 cards in horizontal scroll: Direct | Distract | Delegate | 
  Document | Delay
- Each with icon (SVG), title, and 2-sentence explanation

TAB 2 — "Pusat Bantuan"
Card grid of emergency contacts with tappable tel: links and 
"Hubungi Sekarang" CTA:

1. SAPA 129 — Kementerian PPPA
   Hotline kekerasan terhadap perempuan dan anak
   📞 129

2. Komnas Perempuan
   Pelaporan kasus kekerasan berbasis gender
   📞 021-3903963

3. LBH APIK Jakarta
   Bantuan hukum gratis untuk perempuan
   📞 021-8779-7289

4. Into The Light Indonesia
   Konseling kesehatan mental dan pencegahan bunuh diri
   📞 119 ext 8

5. Yayasan Pulih
   Konseling trauma
   📞 021-788-42580

6. Polisi
   📞 110

7. Ambulans / Darurat Nasional
   📞 112

Each card: org name, description, phone (tappable tel: link),
"Hubungi Sekarang" button that uses tel: deep link.

---

## PWA CONFIGURATION

manifest.json:
{
  "name": "Safe Voices Club - Lindungi Dirimu",
  "short_name": "Safe Voices Club",
  "description": "Aplikasi keselamatan personal untuk pengguna Indonesia",
  "theme_color": "#6C3483",
  "background_color": "#F8F9FA",
  "display": "standalone",
  "orientation": "portrait",
  "start_url": "/",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}

Service Worker (via next-pwa):
- Cache main dashboard and /info pages for offline use
- Show offline fallback page for /peta (map requires connectivity)
- Cache all static assets

Install prompt:
- Show "Pasang Aplikasi" banner on first visit (after 30 seconds)
- Use beforeinstallprompt event
- Store "SafeVoicesClub_install_dismissed" in localStorage if user dismisses

Generate placeholder icons using Canvas API or SVG-to-PNG at build time.

---

## SUPABASE SCHEMA

Create these migration files in /supabase/migrations/:

```sql
-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Panic events (fully anonymous)
create table panic_events (
  id uuid default gen_random_uuid() primary key,
  session_id text not null,
  latitude decimal(10, 8) not null,
  longitude decimal(11, 8) not null,
  created_at timestamptz default now(),
  is_resolved boolean default false
);

-- Incident reports (community map)
create table incident_reports (
  id uuid default gen_random_uuid() primary key,
  incident_type text not null,
  description text check (char_length(description) <= 200),
  incident_time timestamptz not null,
  latitude decimal(10, 8) not null,
  longitude decimal(11, 8) not null,
  created_at timestamptz default now()
);

-- Row Level Security
alter table panic_events enable row level security;
alter table incident_reports enable row level security;

-- Allow anonymous inserts and public reads
create policy "Allow anonymous insert" on panic_events
  for insert with check (true);

create policy "Allow public read" on panic_events
  for select using (true);

create policy "Allow anonymous update resolved" on panic_events
  for update using (true) with check (true);

create policy "Allow anonymous insert" on incident_reports
  for insert with check (true);

create policy "Allow public read" on incident_reports
  for select using (true);
```

---

## RESPONSIVE DESIGN REQUIREMENTS

- Mobile-first design (primary: 375–430px width)
- Panic Zone button: minimum 250px height on mobile
- All interactive elements: minimum 44x44px touch target
- Dark mode: full support via prefers-color-scheme media query and 
  Tailwind dark: classes
- Framer Motion: use AnimatePresence for page transitions, 
  spring animations for panic sequence entrance
- Reduce motion: respect prefers-reduced-motion — disable all animations
  except critical UI feedback (recording dot, loading states)
- No horizontal scroll at any breakpoint

---

## ERROR HANDLING (all in Indonesian)

Mic permission denied:
  "Mikrofon tidak dapat diakses. Buka Pengaturan > Privasi > Mikrofon 
   dan izinkan browser ini."

Location permission denied:
  "Lokasi tidak dapat diakses. Pesan darurat akan dikirim tanpa koordinat."

No contacts set when panic triggered:
  "Belum ada kontak darurat. Hubungi 112 atau 110 langsung."

Supabase connection failed:
  "Data tidak dapat dikirim ke peta komunitas saat ini. 
   Fitur lain tetap berfungsi." (non-blocking, silent failure for map)

localStorage full:
  "Penyimpanan perangkat penuh. Hapus rekaman lama untuk melanjutkan."

MediaRecorder not supported:
  "Browser ini tidak mendukung rekaman audio. 
   Coba gunakan Chrome atau Firefox terbaru."

---

## VERCEL DEPLOYMENT

vercel.json:
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(self), geolocation=(self)" }
      ]
    }
  ]
}

Environment variables (add to Vercel dashboard):
  NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

Include:
- .env.example with placeholder values
- README.md with: setup steps, Supabase config guide, Deploy to Vercel
  button ([![Deploy with Vercel](https://vercel.com/button)](link))
- .gitignore that includes .env.local

---

## IMPORTANT CONSTRAINTS

- All UI text in Bahasa Indonesia (zero English-language user-facing strings)
- No user authentication — fully anonymous usage
- Audio stays on device only (localStorage) — never uploaded to server
- Contacts stay in localStorage only — never sent to server
- Supabase stores only: anonymous coordinates + incident type (no names, 
  no audio, no contact info)
- Privacy footer (all pages): "Safe Voices Club tidak menyimpan identitas atau 
  rekaman suara Anda di server manapun."
- No analytics, no tracking scripts, no third-party cookies
- Generate a random UUID on first visit as session_id 
  (localStorage key: "SafeVoicesClub_session_id") — used only for Supabase rows

---