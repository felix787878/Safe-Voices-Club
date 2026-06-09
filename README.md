# Safe Voices Club

Aplikasi keselamatan personal (PWA) untuk pengguna Indonesia — **Lindungi Dirimu, Jaga Sesama**.

## Fitur

- **Zona Panik** — Ketuk 3x cepat atau goyangkan HP untuk mengaktifkan mode darurat
- **Panggilan Darurat** — Countdown otomatis ke 112/110
- **WhatsApp Alert** — Kirim pesan darurat ke kontak terpercaya
- **Rekaman Audio** — Bukti audio tersimpan lokal di perangkat
- **Peta Komunitas** — Lihat laporan darurat dan kejadian pelecehan anonim
- **Quick Exit** — Sembunyikan aplikasi dengan tampilan cuaca palsu
- **Pusat Bantuan** — Hotline SAPA 129, Komnas Perempuan, LBH APIK, dan lainnya

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion
- Supabase (peta komunitas real-time)
- Leaflet.js + OpenStreetMap
- next-pwa

## Setup Lokal

### 1. Clone & Install

```bash
npm install
```

### 2. Konfigurasi Supabase

1. Buat proyek gratis di [supabase.com](https://supabase.com)
2. Jalankan migrasi SQL dari `supabase/migrations/001_init.sql` di SQL Editor
3. Salin URL dan anon key dari Settings → API

### 3. Environment Variables

```bash
cp .env.example .env.local
```

Isi `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### 4. Jalankan

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Deploy ke Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/safe-voices-club)

1. Push ke GitHub
2. Import proyek di Vercel
3. Tambahkan environment variables `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

## Privasi

- Tidak ada autentikasi pengguna — penggunaan sepenuhnya anonim
- Kontak darurat dan rekaman audio **hanya** tersimpan di perangkat (localStorage)
- Supabase hanya menyimpan koordinat anonim dan jenis kejadian
- Tidak ada analytics atau tracking pihak ketiga

## Lisensi

MIT
