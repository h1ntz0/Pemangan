---
name: qa-automatin-test
description: "Universal QA & SIT Automated Testing Agent menggunakan Playwright. Menjalankan Happy Test, Negative Test, Boundary, Security Injection & Exploratory Monkey Test. Menghasilkan laporan Markdown dan Workbook Excel SIT Standar Perusahaan secara dinamis untuk web app apa pun."
---

# QA Automatin Test (Universal SOP-Driven Testing)

Skill ini dirancang untuk menjalankan pengujian **SIT (System Integration Testing), UAT, dan Bug Hunting** pada aplikasi web apa pun secara **dinamis, interaktif, dan terstandarisasi**.

---

## 🎯 Aturan Wajib (Core Rules)
1. **Dilarang langsung mulai test tanpa bertanya**: Agen WAJIB menjalankan wawancara requirement interaktif terlebih dahulu.
2. **Result `X` untuk Bug**: Semua temuan ketidaksesuaian/bug bernilai `X` di Excel, bukan `V`.
3. **Standarisasi SIT**: Kolom *Tipe Temuan* (Critical, Major, Minor, Trivia) dan *Keterangan* wajib terisi lengkap pada setiap temuan `X`.
4. **Self-Healing Automation**: Jika script terhenti karena overlay atau controlled component, script wajib menerapkan *auto-recover* tanpa mematikan sesi.

---

## 🔄 Alur Kerja Lengkap (Step-by-Step)

### Step 0: Wawancara Requirement (Wajib Tanya ke User)
Sebelum menulis script atau membuka browser, ajukan pertanyaan berikut secara terstruktur:

```markdown
Mohon lengkapi informasi berikut sebelum pengujian dimulai:

1. 🌐 **Target URL**: Alamat web yang akan diuji (contoh: http://10.10.0.39:5007)
2. 📄 **Dokumen Acuan**: Apakah ada file FSD, SRS, API docs, atau SOP Excel template?
   *(Anda dapat langsung melampirkan file .pdf, .docx, atau .xlsx — sistem telah dilengkapi MCP Doc-Reader otomatis)*
3. 🔐 **Akses Login & Role**:
   - Akun Admin: [Username/NIK] & [Password]
   - Akun User Biasa / Non-Admin: [Username/NIK] & [Password]
4. 📋 **Form Data Tambahan**: Apakah ada master data khusus untuk isian form? (contoh: daftar NIK, Divisi, Kode Kantor)
5. 🧪 **Cakupan Pengujian (Scope)**:
   - [A] Happy Test Saja (Alur Positif)
   - [B] Happy Test + Negative Test (Validasi, Error & Boundary)
   - [C] Lengkap: Happy + Negative + Monkey Test (Security & Chaos)
6. 🖥️ **Mode Browser**: Visible (Headless: false) atau Background (Headless: true)?
```

#### 💡 Integrasi Pembacaan Dokumen Otomatis (MCP Doc-Reader):
Sistem OpenCode secara otomatis terhubung dengan MCP **`doc-reader`**:
- **PDF (.pdf)** ➔ Dibaca langsung via tool `read_pdf` (mengekstrak seluruh teks halaman).
- **Word (.docx / .doc)** ➔ Dibaca langsung via tool `read_docx` (mengekstrak teks & struktur dokumen).
- **Excel (.xlsx / .xls)** ➔ Dibaca langsung via tool `read_excel` (mengekstrak data per sheet jadi Markdown table / CSV).
- **Universal** ➔ Tool `read_document` otomatis mendeteksi format file apa pun.

---

### Step 1: Eksplorasi & Auto-Discovery Aplikasi
Setelah user memberikan parameter:
1. **Analisis Source Code / Dokumen**:
   - Baca file FSD / TSD jika tersedia di workspace untuk memetakan business rules.
   - Pindai struktur routing, komponen modal, dan form validation.
2. **Auto-Discovery Menu (DOM Crawling)** via Playwright:
   ```javascript
   const menuTree = await page.evaluate(() => {
     const navs = [];
     document.querySelectorAll('aside button, aside a, nav button, nav a, [role="menuitem"]').forEach(el => {
       const text = el.textContent.trim();
       if (text && text.length < 50) navs.push({ label: text, tag: el.tagName });
     });
     return [...new Map(navs.map(i => [i.label, i])).values()];
   });
   ```

---

### Step 2: Penyusunan Infrastruktur Pengujian
Buat direktori kerja di project pengguna:
```
testing/
├── test-cases/          # Output Excel SIT
├── reports/             # Output Markdown Report
├── detailed-screenshots/# Bukti visual screenshot pengujian & bug
test-scripts/
├── helpers.js           # Reusable Playwright utilities
└── test-final.js        # Script runnable suite
```

#### Komponen `helpers.js` Wajib:
- `log(status, category, testName, detail)`: Log visual console (✅ PASS, ❌ FAIL, 🐛 BUG, ⚠️ WARN).
- `shot(page, name)`: Capture fullpage screenshot bernomor urut otomatis.
- `reportBug(page, code, title, cat, sev, expected, actual, ssName)`: Registrasi temuan otomatis.
- `navSidebar(page, menuName)`: Navigasi presisi dengan regex exact-match.
- `closeAllOverlays(page)`: Pembersihan `z-index` overlay transparan yang memblokir pointer event.
- `setReactInput(page, selector, value)`: Bypass controlled React/Next.js input/select.

---

### Step 3: Matriks Kasus Uji (Test Scenarios)

#### A. Happy Flow (Alur Positif)
- **Otentikasi**: Login tiap role & verifikasi hak akses sidebar/menu.
- **Navigasi**: Buka semua menu & submenu, pastikan halaman tidak blank.
- **CRUD Operations**: Tambah data valid, edit data, filter/pencarian, export, dan hapus data.
- **Kondisi Khusus**: Konfirmasi dialog (*confirm prompt*), perubahan status real-time.

#### B. Negative Flow (Validasi & Error Handling)
- **Form Kosong**: Submit form tanpa input (harus ditolak frontend/backend).
- **Format Salah**: Waktu selesai lebih awal dari waktu mulai, angka negatif, karakter non-numerik.
- **Bentrok Jadwal / Duplikasi**: Double booking pada resource yang sama.
- **Akses Ilegal**: Non-admin mengakses URL/menu restricted.
- **Sanitasi & Keamanan**: Input `<script>alert(1)</script>` dan `' OR 1=1--` (harus disanitasi).

#### C. Monkey Testing (Eksplorasi & Chaos)
- Klik cepat multi-menu secara acak.
- Pengujian refresh browser (data persistence check).
- Pemeriksaan log console browser untuk mendeteksi unhandled error/warning.

---

### Step 4: Standarisasi Output Workbook Excel SIT

Format sheet wajib mengikuti struktur SOP SIT:

#### 1. Header Information (Baris 1 - 7):
- `PIC`: Tim QA Internal
- `Project Name`: [Nama Project]
- `Tester`: QA Automation Specialist
- `Start/Finish Date`: [Tanggal]
- `Version Control`: [Versi]
- `Note`: [Catatan pengujian]

#### 2. Kolom Definisi (Baris 9):
1. **No**: Format `X,Y` (contoh: `1,1`, `1,2`)
2. **Function**: Nama modul / skenario uji
3. **Tipe Temuan**: Mandatory untuk temuan bug (`Critical` / `Major` / `Minor` / `Trivia`), kosongkan jika pass
4. **Is Recurring**: `Ya` / `Tidak`
5. **Script test**: Langkah pengujian berurutan (Step 1, 2, 3...)
6. **Output expected**: Hasil yang diharapkan
7. **Jumlah Data Test**: Kuantitas data uji
8. **Detail Data Test**: Parameter isian uji
9. **Screenshot**: Nama file screenshot acuan
10. **Result**: `V` jika PASS, `X` jika FAIL / BUG
11. **Keterangan**: Deskripsi detail error jika result = `X`
12. **Respon PIC**
13. **Dev Name**: `Frontend Dev` / `Backend Dev`
14. **Start Date Testing**
15. **Finish Date Testing**
16. **Respone Dev**: `Open` / `In Progress` / `Fixed`
17. **Status Dev**: `Open` / `Closed`

#### 3. Styling & Pemisahan Sheet:
- **Sheet 1: Happy Test** (Tab Hijau `#22C55E`, Header Kolom Biru Gelap `#1E3A5F`, Section Header Biru Muda `#E8F0FE`).
- **Sheet 2: Negative Test** (Tab Merah `#EF4444`, Header Kolom Merah Gelap `#991B1B`, Section Header Merah Muda `#FEF2F2`).
- **Deklarasi**: Di baris akhir sertakan pernyataan resmi pengujian SIT bertanda miring (*italic*).

---

### Step 5: Format Laporan Markdown (`REPORT.md`)
Rangkum seluruh hasil pengujian dengan struktur:
1. **Ringkasan Eksekutif** (Total Case, Pass Rate %, Bug Count).
2. **Tabel Matriks Hasil Pengujian** per Modul.
3. **Daftar Bug & Anomali** lengkap dengan Severity, Bukti Screenshot, Root Cause, dan Solusi Perbaikan.
4. **Lampiran Bukti Screenshot**.
