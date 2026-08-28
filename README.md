# Pemangan 2.0 — Sistem Informasi Peminjaman Ruangan & Lab SMKN 1 Jakarta

Platform terintegrasi pengelolaan dan reservasi fasilitas ruangan, laboratorium komputer SIJA & RPL, studio broadcasting, aula serbaguna, dan auditorium di SMK Negeri 1 Jakarta secara transparan, terstruktur, dan bebas konflik jadwal.

---

## 🌟 Fitur Unggulan Big Update 2.0

1. **Jadwal Visual Matriks Per-Jam (Interactive Timetable Matrix):**
   - Monitoring ketersediaan 13 ruangan sekolah secara visual dari pukul 07:00 hingga 17:00 WIB.
   - Filter tanggal real-time dengan status warna instan (*Hijau: Tersedia, Merah: Digunakan, Kuning: Menunggu Review*).

2. **Wizard Formulir Reservasi 4-Langkah (Smart 4-Step Booking Wizard):**
   - **Langkah 1:** Pemilihan Ruangan & Checkbox Opsi Peralatan Tambahan (Mic Wireless, Sound Portable, Gigabit Switch, Laser Pointer, dsb).
   - **Langkah 2:** Penentuan Waktu & Validasi Anti-Bentrok otomatis (*Anti-Conflict Engine*).
   - **Langkah 3:** Identitas Pemohon, Kategori (Siswa/Guru/Admin/Organisasi), dan Guru Pendamping / Penanggung Jawab.
   - **Langkah 4:** Lembar Review Ringkasan Permohonan & Persetujuan SOP Sarpras.

3. **Surat Izin Resmi Digital 2.0 (Ber-KOP & QR Code Verification):**
   - Format KOP Resmi Pemerintah Provinsi DKI Jakarta & SMK Negeri 1 Jakarta.
   - Dilengkapi generator QR Code unik untuk verifikasi digital keabsahan nomor tiket permohonan.
   - Format tanda tangan 3 pihak (Pemohon, Guru Pembimbing, dan Waka Bidang Sarpras).
   - Format cetak A4 siap simpan sebagai dokumen PDF via `@media print`.

4. **Lacak Status Resi Tiket Mandiri (Tracking Center):**
   - Pencarian status pengajuan instan cukup dengan memasukkan Nomor Tiket (contoh: `BK-2026-001`) tanpa harus login.

5. **Sarpras Enterprise Command Center (Panel Guru & Admin):**
   - Ringkasan KPI Dashboard: Total Permohonan, Jumlah Perlu Review, Rasio Disetujui, dan Ruangan Terfavorit.
   - Manajemen persetujuan/penolakan dengan catatan resmi.
   - Ekspor seluruh dataset peminjaman ke format spreadsheet **CSV**.
   - Fitur reset data demo sekolah.

6. **Standar Desain Swiss Minimalist & Institutional Enterprise:**
   - Desain formal, elegan, berbasis token CSS (*no AI slop*), responsif penuh pada smartphone/tablet/desktop, dan dukungan Dark/Light Mode persisten.

---

## 🏢 Katalog Fasilitas Sekolah (13 Ruangan Aktif)

| ID Ruangan | Nama Ruangan & Fasilitas | Lokasi Gedung | Kapasitas | Penanggung Jawab (PIC) |
|---|---|---|---|---|
| `r-401` | Ruang 401 - Lab Komputer SIJA (Cloud & Network) | Lantai 4 | 36 Orang | Pak Amrul Khairullah, S.Kom |
| `r-403` | Ruang 403 - Lab Rekayasa Perangkat Lunak & Database | Lantai 4 | 36 Orang | Pak Rian Firmansyah, M.Kom |
| `r-405` | Ruang 405 - Lab Cyber Security & Fiber Optic | Lantai 4 | 32 Orang | Ibu Nurhayati, M.Pd |
| `r-teater` | Ruang 1 - Teater Audio Visual (Auditorium) | Gedung Utama (Lt 3) | 120 Orang | Ibu Dra. Endang Lestari |
| `r-serbaguna`| Ruang 2 - Gedung Serbaguna (Aula GSG) | Gedung GSG (Lt 1) | 350 Orang | Waka Bidang Sarpras |
| `r-guru` | Ruang Guru & Konferensi Pimpinan | Gedung Utama (Lt 1) | 45 Orang | Koordinator Tata Usaha |
| `r-podcast` | Studio Podcast & Broadcasting SMKN 1 | Gedung Utama (Lt 3) | 15 Orang | Pak Budi Hartono, S.Kom |
| `r-22` | Ruang 22 - Gedung Baru (Kelas Teori) | Gedung Baru (Lt 2) | 36 Orang | Pak Sukirman, S.Pd |
| `r-23` | Ruang 23 - Gedung Baru (Kelas Teori) | Gedung Baru (Lt 2) | 36 Orang | Ibu Nurhayati, M.Pd |
| `r-24` | Ruang 24 - Gedung Baru (Smart TV 65") | Gedung Baru (Lt 2) | 40 Orang | Pak Budi Hartono, S.Kom |
| `r-25` | Ruang 25 - Gedung Baru (Hybrid Class LAN) | Gedung Baru (Lt 2) | 36 Orang | Pak Dedi Prasetyo, S.T |
| `r-15` | Ruang 15 - Gedung Lama (Kelas Asri) | Gedung Lama (Lt 1) | 32 Orang | Ibu Sri Wahyuni, S.Pd |
| `r-16` | Ruang 16 - Gedung Lama (Organisasi Kesiswaan) | Gedung Lama (Lt 1) | 32 Orang | Pak Hendra Gunawan, S.Pd |

---

## 🔑 Akun Demo Pengujian

| Peran | NIS / NIP / Username | Kata Sandi | Deskripsi Hak Akses |
|---|---|---|---|
| **Siswa** | `102144` | `123` | Pengajuan reservasi 4-langkah & unduh surat izin resmi |
| **Guru** | `19800101` | `guru` | Pengajuan prioritas & akses Command Center Sarpras |
| **Admin** | `admin` | `admin` | Manajemen penuh permohonan, persetujuan, & ekspor CSV |

---

## 🚀 Cara Menjalankan Secara Lokal

1. **Jalankan web server lokal:**
   ```bash
   python3 -m http.server 8080
   ```
2. **Buka di Browser:**
   Akses `http://localhost:8080` untuk melihat portal utama atau `http://localhost:8080/login/login.html` untuk login.

3. **Jalankan Pengujian Otomatis Headed:**
   ```bash
   node test-scripts/test-big-update.js
   ```

---

## 👨‍💻 Tim Pengembang

- **Pengembang:** Arrofi Zein & Rasya Aryasatya (XI SIJA 1 — SMK Negeri 1 Jakarta)
- **Guru Pembimbing:** Pak Amrul Khairullah, S.Kom
- **Program:** Proyek Kreatif & Kewirausahaan (PKK) Bidang Keahlian Sistem Informatika, Jaringan & Aplikasi
