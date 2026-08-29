# Standar Format FSD Blueprint — PT. Advantage SCM

Nilai di sini adalah nilai XML persis yang dipakai, sudah terverifikasi.

## Konversi satuan

| Satuan | Rumus | Contoh |
|---|---|---|
| Ukuran font | pt × 2 = half-points (`w:sz`) | 12pt → `24` |
| Tinggi baris / lebar | inch × 1440 = twips | 0.30in → `432` |

---

## Tipografi

| Elemen | Ukuran | `w:sz` | Font |
|---|---|---|---|
| Isi konten | 12pt | `24` | Times New Roman |
| Heading 1 | 16pt | `32` | Times New Roman |
| Heading 2 | 14pt | `28` | Times New Roman |
| Heading 3 | 14pt | `28` | Times New Roman |
| Heading 4 | 14pt | `28` | Times New Roman |
| Copyright & Pernyataan | 10pt | `20` | Times New Roman |
| Blok tanda tangan | 12pt | `24` | Times New Roman |
| Disclaimer | 9pt | `18` | merah `FF0000` |
| Placeholder gambar | 9pt | `18` | Calibri, italic, abu `808080` |

- Narasi (>60 karakter) → `<w:jc w:val="both"/>` (justify)
- Tinggi baris heading 2–4 → `432` twips, `hRule="atLeast"`

---

## Warna

| Keperluan | Hex |
|---|---|
| Judul di box sampul | `1F3864` |
| Shading box sampul | `BFBFBF` |
| Header Dokumen Kontrol | `4472C4` |
| Teks header Dokumen Kontrol | `FFFFFF` |
| Disclaimer | `FF0000` |
| Placeholder gambar | `808080` |

---

## Front Matter

### Halaman I — Sampul
1. `FUNCTIONAL SPECIFICATION & TECHNICAL DESIGN` — bold, 12pt, center
2. Box judul: border `000000` tebal (`sz=24`), shading `BFBFBF`, lebar 8000 dxa
   - `FSD BLUEPRINT` — bold 22pt center `1F3864`
   - `<NAMA PROJECT>` — bold 22pt center `1F3864`
   - `VERSI: x.x` — bold 10pt center `1F3864`
3. Blok metadata (border putih, 2 kolom 2600 + 3400):
   `No. Dokumen` · `Klarifikasi: Rahasia` · `Disiapkan Oleh` · `Pemilik Sistem` · `Area Bisnis`
4. Box Copyright & Pernyataan — border `000000` (`sz=8`), lebar 8600, isi 10pt justify

### Halaman II — Tanda tangan + Disclaimer
- Judul project — bold 14pt center
- **4 tabel** panel berpasangan, tiap tabel 4 kolom (1100/3400/1100/3400), lebar 9000:
  1. `Disusun oleh:` | `Disetejui oleh:`
  2. `Diperiksa oleh:` | `Diperiksa oleh:`
  3. `Diketahui oleh:` | `Diketahui oleh:`
  4. `Diketahui oleh:` | `Diketahui oleh:`
- Struktur tiap panel: baris label (span 2) → baris kosong TTD (tinggi 900) →
  `Nama` / `Jabatan` / `Tanggal` (tinggi 280, label underline)
- Box Disclaimer merah di bawahnya

> Catatan: `Disetejui` memang typo di template asli. Pertahankan kecuali user minta diperbaiki.

### Halaman III — DOKUMEN KONTROL
Judul bold 12pt center. Tabel 5 kolom, header shading `4472C4` teks putih 8pt:

| Kolom | Lebar (dxa) |
|---|---|
| Tanggal Selesai Doc | 1900 |
| PIC Review | 1500 |
| Versi | 900 |
| Referensi | 3100 |
| Nomor Ticket PMA | 1900 |

Isi baris dikosongkan kalau datanya tidak ada di sumber.

### Halaman IV — DAFTAR ISI
- Judul `DAFTAR ISI` bold 12pt center
- 2 entri manual dengan dot leader: `DOKUMEN KONTROL` → III, `DAFTAR ISI` → IV
- Field TOC: `TOC \o "1-8" \h \z \u`

---

## Body

```
Overview (<NAMA PROJECT>)            <- Heading 1
  1.1 Background                     <- Heading 2
  1.2 Scope
  1.3 Policy & Issues
Spesifikasi Fungsional dan Teknis    <- Heading 1
  2.1 Flow Process                   <- Heading 2
  2.2 Role ID Specification
  2.3 User Interface
    2.3.1 <Modul>                    <- Heading 3
      2.3.1.1 <Menu>                 <- Heading 4
      2.3.1.2 <Menu>
    2.3.2 Change Request             <- Heading 3
```

Judul utama (`Overview`, `Spesifikasi Fungsional dan Teknis`) **tanpa nomor bab**.

### Tabel Role ID Specification
| RoleID | Exist | Access Menu | Menu baru | Remarks |

### Isi tiap menu (2.3.x.x)
1. Placeholder gambar + caption `Gambar x.x Tampilan <nama>`
2. Bullet deskripsi
3. `Button Specification`:
   | Button Label | OnClickEvent | Visible | Validation | Error Message |
4. `Field Spesification`:
   | Field Name | Type | Length | Example | Remarks | Wajib Isi |

Nilai umum: `Selalu Muncul`, `Tidak Ada`, `Wajib Isi`, tipe `Varchar`,
`Integer`, `Date`, `Datetime`, `Lookup`, `Dropdown`, `Textbox`, `Autofield`.

---

## Pola kalimat deskripsi (dari dokumen existing)

Ini contoh **gaya/pola pembuka kalimat**, bukan teks yang boleh disalin utuh.
Isinya (nama menu, role, nama field) tetap harus disesuaikan dan ditulis ulang
per menu — lihat "Parafrase — Wajib, Bukan Opsional" di `SKILL.md`.

- "Gambar diatas adalah tampilan dari menu ..."
- "Menu tersebut dapat diakses oleh user dengan role ... dan ..."
- "Terdapat beberapa form yang ada dalam ... seperti form add, edit, dll"
- "Pada form pengisian data yang diberi bintang adalah data yang wajib diisi,
  dan jika tidak diisi akan muncul Notifikasi Konfirmasi ..."
- "Pada data Lookup yang memiliki tanda plus (+) mengambil data dari master
  reference dan dapat menambahkan data dengan klik tanda plus"
