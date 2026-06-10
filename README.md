# Safe Voices Club

**Aplikasi keselamatan personal berbasis web (PWA) untuk pengguna di Indonesia.**

Safe Voices Club membantu pengguna merespons situasi darurat dengan lebih cepat: mengaktifkan mode panik, menghubungi layanan darurat, memberi tahu kontak terpercaya, merekam bukti audio, serta melihat laporan kejadian di peta komunitas — semuanya dengan pendekatan yang transparan terhadap batasan keamanan peramban web.

> **Tagline:** *Lindungi Dirimu, Jaga Sesama*

---

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Teknologi](#teknologi)
- [Prasyarat](#prasyarat)
- [Instalasi & Pengembangan Lokal](#instalasi--pengembangan-lokal)
- [Variabel Lingkungan](#variabel-lingkungan)
- [Perintah NPM](#perintah-npm)
- [Deployment](#deployment)
- [Privasi & Keamanan Data](#privasi--keamanan-data)
- [Struktur Proyek](#struktur-proyek)
- [Lisensi](#lisensi)

---

## Fitur Utama

| Modul | Deskripsi |
| --- | --- |
| **Zona Panik** | Aktivasi darurat melalui ketukan cepat (3×) atau goyangan perangkat |
| **Panggilan Darurat** | Hitung mundur otomatis menuju dialer 112/110 |
| **Notifikasi WhatsApp** | Pengiriman pesan darurat ke hingga 3 kontak terpercaya |
| **Rekaman Audio** | Perekaman bukti audio yang disimpan secara lokal di perangkat |
| **Peta Komunitas** | Visualisasi laporan darurat dan kejadian pelecehan secara anonim |
| **Quick Exit** | Penyembunyian cepat aplikasi dengan tampilan cuaca palsu |
| **Pusat Bantuan** | Akses ke hotline SAPA 129, Komnas Perempuan, LBH APIK, dan layanan terkait |
| **Panduan Pengguna** | Petunjuk penggunaan fitur langsung dari halaman beranda |

---

## Teknologi

| Lapisan | Stack |
| --- | --- |
| Framework | [Next.js 14](https://nextjs.org/) (App Router) + TypeScript |
| UI | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Animasi | [Framer Motion](https://www.framer.com/motion/) |
| Basis Data | [Supabase](https://supabase.com/) (PostgreSQL, real-time) |
| Peta | [Leaflet](https://leafletjs.com/) + OpenStreetMap |
| PWA | [next-pwa](https://github.com/shadowwalker/next-pwa) |

---

## Prasyarat

- **Node.js** 18 atau lebih baru
- **npm** (atau pnpm/yarn)
- Akun [Supabase](https://supabase.com/) (tier gratis mencukupi untuk pengembangan)

---

## Instalasi & Pengembangan Lokal

### 1. Clone repositori dan instal dependensi

```bash
git clone <url-repositori>
cd ariq2
npm install
```

### 2. Konfigurasi Supabase

1. Buat proyek baru di [Supabase Dashboard](https://supabase.com/dashboard).
2. Buka **SQL Editor**, lalu jalankan skrip migrasi:

   ```
   supabase/migrations/001_init.sql
   ```

3. Salin **Project URL** dan **anon public key** dari **Settings → API**.

### 3. Atur variabel lingkungan

```bash
cp .env.example .env.local
```

Isi nilai pada `.env.local` sesuai kredensial Supabase Anda (lihat tabel di bawah).

### 4. Jalankan server pengembangan

```bash
npm run dev
```

Aplikasi tersedia di [http://localhost:3000](http://localhost:3000).

---

## Variabel Lingkungan

| Variabel | Wajib | Deskripsi |
| --- | :---: | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Ya | URL proyek Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Ya | Anon/public API key Supabase |

Contoh `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **Catatan:** Jangan pernah mengekspos *service role key* ke sisi klien. Hanya gunakan *anon key* yang sudah dilindungi Row Level Security (RLS).

---

## Perintah NPM

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Menjalankan server pengembangan |
| `npm run build` | Membangun aplikasi untuk produksi |
| `npm run start` | Menjalankan build produksi secara lokal |
| `npm run lint` | Memeriksa kualitas kode dengan ESLint |

---

## Deployment

Proyek ini siap di-deploy ke [Vercel](https://vercel.com/) atau platform Node.js lainnya.

### Vercel

1. Push kode ke repositori Git (GitHub, GitLab, atau Bitbucket).
2. Import proyek di Vercel Dashboard.
3. Tambahkan variabel lingkungan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/safe-voices-club)

Setelah deploy, pastikan PWA dapat diinstal dari peramban mobile melalui opsi **Add to Home Screen** / **Pasang Aplikasi**.

---

## Privasi & Keamanan Data

Safe Voices Club dirancang dengan prinsip privasi-by-design:

- **Tanpa autentikasi pengguna** — tidak ada akun, email, atau profil yang wajib didaftarkan.
- **Data sensitif di perangkat** — kontak darurat dan rekaman audio disimpan di *localStorage* perangkat, bukan di server.
- **Data peta yang terbatas** — Supabase hanya menyimpan koordinat anonim, jenis kejadian, dan metadata laporan yang diperlukan untuk peta komunitas.
- **Tanpa pelacakan pihak ketiga** — tidak ada integrasi analytics atau advertising tracker.

Aplikasi ini merupakan **alat bantu keselamatan**, bukan pengganti layanan darurat resmi. Panggilan telepon melalui peramban web tetap memerlukan konfirmasi pengguna sesuai kebijakan keamanan sistem operasi.

---

## Struktur Proyek

```
ariq2/
├── public/                  # Aset statis, manifest PWA, service worker
├── src/
│   ├── app/                 # Halaman & routing (App Router)
│   ├── components/          # Komponen UI dan fitur
│   ├── contexts/            # State global (mis. mode panik)
│   └── lib/                 # Utilitas, storage, integrasi Supabase
├── supabase/
│   └── migrations/          # Skrip SQL untuk skema database
├── .env.example             # Template variabel lingkungan
└── package.json
```

---

## Lisensi

Proyek ini dilisensikan di bawah **MIT License**.
