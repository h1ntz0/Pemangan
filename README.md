<div align="center">

<img src="public/img/logo.png" alt="Logo SMKN 1 Jakarta" width="96" height="96" />

# PEMANGAN
### Sistem Informasi Peminjaman Ruangan & Laboratorium
**SMK Negeri 1 Jakarta**

[![React](https://img.shields.io/badge/React-19.0-2563eb?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Nginx](https://img.shields.io/badge/Nginx-Production_Ready-009639?style=flat-square&logo=nginx&logoColor=white)](https://nginx.org/)
[![Playwright](https://img.shields.io/badge/Tested_with-Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white)](https://playwright.dev/)

<p align="center">
  Layanan terpadu pengelolaan dan reservasi fasilitas 13 laboratorium komputer kejuruan (SIJA & RPL), studio multimedia, ruang teori, aula serbaguna, dan auditorium di SMK Negeri 1 Jakarta.
</p>

---

</div>

## Daftar Isi
- [Tentang Pemangan](#-tentang-pemangan)
- [Fitur Utama](#-fitur-utama)
- [Arsitektur & Tech Stack](#-arsitektur--tech-stack)
- [Struktur Halaman & Routing](#-struktur-halaman--routing)
- [Katalog Fasilitas Ruangan](#-katalog-fasilitas-ruangan)
- [Panduan Instalasi & Menjalankan](#-panduan-instalasi--menjalankan)
- [Akun Demo Pengujian](#-akun-demo-pengujian)
- [Pengujian Otomatis](#-pengujian-otomatis)
- [Tim Pengembang](#-tim-pengembang)

---

## 📌 Tentang Pemangan

**PEMANGAN** merupakan akronim dari **PEM**injaman ru**ANGAN**. Platform ini dikembangkan untuk mendigitalkan alur peminjaman fasilitas sekolah di SMK Negeri 1 Jakarta, menggantikan pencatatan manual berbasis buku dan formulir kertas dengan sistem terpusat, transparan, dan bebas bentrok jadwal (*conflict-free scheduling*).

---

## ⚡ Fitur Utama

1. **Jadwal Matriks Per-Jam Interaktif (`/timetable`)**
   - Pemantauan visual ketersediaan 13 ruangan sekolah dari pukul 07:00 hingga 17:00 WIB.
   - Pengecekan status real-time dengan penanda visual instan (*Tersedia* vs *Terjadwal*).

2. **Formulir Peminjaman 4-Langkah (`/booking`)**
   - **Langkah 1:** Pemilihan fasilitas ruangan dan opsi peralatan tambahan (proyektor, kabel LAN, switch, sound system).
   - **Langkah 2:** Penentuan tanggal & jam dengan validasi pencegahan jadwal bentrok otomatis.
   - **Langkah 3:** Pengisian identitas pemohon dan guru penanggung jawab / pendamping.
   - **Langkah 4:** Lembar konfirmasi ringkasan dan persetujuan SOP Sarpras.

3. **Surat Izin Resmi Ber-KOP & QR Code (`/slip/:id`)**
   - Mengikuti tata naskah dinas resmi Pemerintah Provinsi DKI Jakarta & Dinas Pendidikan.
   - Verifikasi keaslian nomor tiket menggunakan kode QR digital.
   - Tata letak cetak standar A4 yang dioptimalkan untuk ekspor PDF via `@media print`.

4. **Pusat Pelacakan Resi Mandiri (`/tracking`)**
   - Pengecekan progres permohonan secara instan cukup dengan memasukkan ID Tiket (misal: `BK-2026-001`) tanpa wajib login.

5. **Panel Manajemen Sarpras (`/admin`)**
   - Ringkasan metrik statistik: total tiket, permohonan tertunda, tiket disetujui, dan ruangan terfavorit.
   - Aksi persetujuan dan penolakan tiket disertai catatan resmi pengelola.
   - Ekspor rekapitulasi data peminjaman ke format CSV.

6. **Desain 3-Warna & Akses Mobile-First**
   - Menerapkan disiplin 3-Warna (Primary Blue, Neutral Canvas, Deep Slate) yang bersih tanpa ornamen berlebih.
   - Dukungan penuh *Light Mode* dan *Eye-Friendly Dark Mode*.
   - Dilengkapi *Bottom Navigation Bar* untuk kemudahan navigasi satu jempol pada layar smartphone.

---

## 🛠 Arsitektur & Tech Stack

| Layer | Teknologi | Deskripsi |
|---|---|---|
| **Frontend Framework** | React 19 + TypeScript | UI berbasis komponen modular dan type safety ketat |
| **Routing** | React Router DOM v7 | Client-side Single Page Application (SPA) routing |
| **Styling** | Tailwind CSS v4 | Utility-first styling dengan custom dark mode variant |
| **Icons & Assets** | Lucide React | Ikon antarmuka minimalis dan fungsional |
| **Web Server** | Nginx (Reverse Proxy & Static) | Melayani static bundle dengan SPA fallback (`try_files`) |
| **Testing** | Playwright | Suite uji otomatis untuk alur bisnis dan tampilan mobile |

```text
Pemangan/
├── public/
│   └── img/                 # Aset logo resmi SMKN 1 Jakarta (transparan) & foto fasilitas
├── src/
│   ├── components/
│   │   ├── booking/         # Komponen wizard langkah 1–4
│   │   ├── common/          # Badge, Modal, KopSurat, SplashScreen
│   │   ├── layout/          # Navbar desktop & BottomNav mobile
│   │   ├── rooms/           # RoomCard & RoomFilter
│   │   ├── slip/            # OfficialSlipModal
│   │   └── timetable/       # TimetableMatrix
│   ├── context/             # AuthContext, StorageContext, ThemeContext
│   ├── data/                # Dataset 13 ruangan, peralatan, dan riwayat demo
│   ├── pages/               # 9 halaman terpisah (Home, Rooms, Booking, Timetable, dll.)
│   ├── types/               # Definisi antarmuka TypeScript
│   ├── App.tsx              # Router mapping & layout wrapper
│   ├── index.css            # Token 3-warna & dark mode variant
│   └── main.tsx             # Entry point React
├── testing/                 # Tangkapan layar hasil verifikasi Playwright
├── nginx.conf               # Konfigurasi Nginx virtual host
└── package.json
```

---

## 🗺 Struktur Halaman & Routing

| Jalur URL | Halaman | Deskripsi |
|---|---|---|
| `/` | `HomePage` | Ringkasan fasilitas unggulan, statistik sarpras, dan aktivitas pemohon |
| `/rooms` | `RoomsPage` | Katalog lengkap 13 ruangan dengan filter pencarian instan |
| `/rooms/:id` | `RoomDetailPage` | Detail spesifikasi perangkat, daya tampung, dan penanggung jawab lab |
| `/booking` | `BookingPage` | Formulir wizard reservasi 4-langkah anti-bentrok |
| `/timetable` | `TimetablePage` | Jadwal visual per-jam penggunaan ruangan |
| `/tracking` | `TrackingPage` | Pelacakan status nomor tiket permohonan |
| `/admin` | `AdminPage` | Command Center pengelola sarpras (review, acc, tolak, ekspor data) |
| `/login` | `LoginPage` | Autentikasi akun Siswa, Guru, dan Admin Sarpras |
| `/slip/:id` | `SlipPrintPage` | Lembar Surat Izin Resmi format A4 siap cetak |

---

## 🏢 Katalog Fasilitas Ruangan (13 Ruangan Aktif)

| ID | Nama Fasilitas | Gedung | Kapasitas | Penanggung Jawab |
|---|---|---|---|---|
| `r-401` | Ruang 401 - Lab Komputer SIJA | Lantai 4 | 36 Siswa | Pak Amrul Khairullah, S.Kom |
| `r-403` | Ruang 403 - Lab Rekayasa Perangkat Lunak | Lantai 4 | 36 Siswa | Pak Rian Firmansyah, M.Kom |
| `r-405` | Ruang 405 - Lab Cyber Security & Fiber Optic | Lantai 4 | 32 Siswa | Ibu Nurhayati, M.Pd |
| `r-teater` | Ruang 1 - Teater Audio Visual (Auditorium) | Gedung Utama Lt 3 | 120 Orang | Ibu Dra. Endang Lestari |
| `r-serbaguna` | Ruang 2 - Gedung Serbaguna (Aula GSG) | Gedung GSG Lt 1 | 350 Orang | Waka Bidang Sarpras |
| `r-guru` | Ruang Guru & Konferensi Pimpinan | Gedung Utama Lt 1 | 45 Orang | Koordinator Tata Usaha |
| `r-podcast` | Studio Podcast & Broadcasting | Gedung Utama Lt 3 | 15 Orang | Pak Budi Hartono, S.Kom |
| `r-22` | Ruang 22 - Gedung Baru (Kelas Teori) | Gedung Baru Lt 2 | 36 Siswa | Pak Sukirman, S.Pd |
| `r-23` | Ruang 23 - Gedung Baru (Kelas Teori) | Gedung Baru Lt 2 | 36 Siswa | Ibu Nurhayati, M.Pd |
| `r-24` | Ruang 24 - Gedung Baru (Smart TV 65") | Gedung Baru Lt 2 | 40 Siswa | Pak Budi Hartono, S.Kom |
| `r-25` | Ruang 25 - Gedung Baru (Hybrid LAN) | Gedung Baru Lt 2 | 36 Siswa | Pak Dedi Prasetyo, S.T |
| `r-15` | Ruang 15 - Gedung Lama (Kelas Asri) | Gedung Lama Lt 1 | 32 Siswa | Ibu Sri Wahyuni, S.Pd |
| `r-16` | Ruang 16 - Gedung Lama (Organisasi Kesiswaan) | Gedung Lama Lt 1 | 32 Siswa | Pak Hendra Gunawan, S.Pd |

---

## 🚀 Panduan Instalasi & Menjalankan

### 1. Kebutuhan Sistem
- **Node.js**: versi 18.x atau lebih baru
- **npm** atau **pnpm**
- **Nginx** (opsional untuk production serving di jaringan lokal Wi-Fi)

### 2. Langkah Instalasi
```bash
# Clone repositori
git clone https://github.com/h1ntz0/Pemangan.git
cd Pemangan

# Instal dependensi
npm install

# Jalankan development server lokal
npm run dev
```

Akses browser pada `http://localhost:3000`.

### 3. Kompilasi Produksi & Nginx
```bash
# Build bundle produksi
npm run build

# Muat ulang Nginx (jika dikonfigurasikan)
sudo service nginx reload
```

---

## 🔑 Akun Demo Pengujian

Aplikasi menyediakan kredensial instan untuk menguji berbagai peran pengguna:

| Peran | NIS / NIP / Username | Kata Sandi | Hak Akses |
|---|---|---|---|
| **Siswa** | `102144` | `123` | Mengajukan reservasi 4-langkah, melacak tiket, dan mencetak surat izin |
| **Guru** | `19800101` | `123` | Pengajuan prioritas jadwal dan verifikasi pendampingan kelas |
| **Admin** | `admin` | `admin123` | Akses penuh Sarpras (menyetujui, menolak tiket, reset demo, dan ekspor CSV) |

---

## 🧪 Pengujian Otomatis

Suite pengujian otomatis berbasis Playwright mencakup verifikasi navigasi mobile, formulir wizard, pemilihan tema, dan pengecekan tampilan bebas dari layout breaking:

```bash
# Jalankan pengujian alur mobile & tema
node test-scripts/test-mobile-3color.js

# Jalankan pengujian splash screen & onboarding
node test-scripts/test-splash-screen.js
```

---

## 👨‍💻 Tim Pengembang

- **Pengembang:** Arrofi Zein & Rasya Aryasatya (XI SIJA 1 — SMK Negeri 1 Jakarta)
- **Guru Pembimbing:** Pak Amrul Khairullah, S.Kom
- **Program:** Proyek Kreatif & Kewirausahaan (PKK) Bidang Keahlian Sistem Informatika, Jaringan & Aplikasi (SIJA)
- **Institusi:** SMK Negeri 1 Jakarta Pusat
