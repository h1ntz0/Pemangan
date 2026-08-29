---
name: fsd-blueprint
description: "Membuat FSD Blueprint baru dari FSD sumber (plus screenshot menu dan penjelasan singkat), merevisi format Blueprint, dan menerapkan revisi konten dari FSD versi baru ke Blueprint yang sudah jadi. Gunakan skill ini setiap kali user menyebut \"FSD Blueprint\", \"buat Blueprint\", \"blueprint dari FSD\", \"revisi Blueprint\", \"FSD BP\", \"convert FSD jadi Blueprint\", atau meng-upload file FSD/.docx dan minta dijadikan Blueprint. WAJIB dipakai juga ketika user memberi FSD versi baru/revisi dan minta perubahannya diterapkan ke Blueprint yang sudah ada — skill ini tahu cara mencari section mana yang berubah dan mem-patch hanya bagian itu tanpa merusak screenshot yang sudah ditempel. Juga trigger untuk perubahan format dokumen Blueprint: ganti font, ukuran heading, row height, italic/bold istilah, perbaikan Daftar Isi, atau front matter (sampul, tanda tangan, Dokumen Kontrol). Standar PT. Advantage SCM."
---

# FSD Blueprint Generator & Reviser

Skill ini punya **tiga mode**. Tentukan mode dulu sebelum kerja.

| Mode | Input | Output |
|---|---|---|
| **A — Generate** | FSD sumber (.docx) + screenshot menu + penjelasan singkat | FSD Blueprint .docx lengkap |
| **B — Revisi format** | .docx Blueprint + instruksi format (font, heading, row height) | .docx terformat ulang |
| **C — Revisi konten** | FSD versi baru + Blueprint yang sudah jadi | Blueprint dengan **hanya bagian berubah** yang di-patch |

Kalau user upload .docx dan mintanya ambigu, **tanya dulu** — jangan tebak.

**Cara membedakan B dan C:** kalau user minta ubah tampilan/format → B.
Kalau user kasih FSD versi baru dan bilang "ada revisi" → C.

---

## ATURAN WAJIB (jangan dilanggar)

1. **Plan first.** Tulis rencana sebelum menyentuh file. Tampilkan ke user, minta konfirmasi kalau ada yang ambigu.
2. **Jangan pernah pakai regex untuk edit XML docx.** Selalu pakai `lxml` tree manipulation. Regex dengan `re.DOTALL` pada document.xml akan over-match dan menghapus ratusan tabel. Ini sudah pernah terjadi — lihat `references/pitfalls.md`.
3. **Jangan hapus elemen pakai index.** Index jadi basi setelah operasi pertama. Hapus pakai **element reference** (`body.remove(el)` dari list yang sudah dikumpulkan).
4. **Verifikasi sebelum bilang selesai.** Wajib: validasi schema + hitung paragraf/baris tabel + ekstraksi teks per halaman. Jangan klaim "sudah sesuai" tanpa bukti.
5. **Jangan mengarang data.** Kalau FPS/FSD tidak menyebut sesuatu (mis. PIC Review, Nomor Ticket), kosongkan dan beri tahu user. Jangan diisi tebakan.
6. **Bahasa mengikuti user** (Indonesia/English).
7. **Parafrase teks naratif, jangan salin dari FSD sumber.** Berlaku walaupun FSD
   sumber sudah punya kalimat deskripsi yang lengkap dan enak dibaca — justru di
   situ letak jebakannya, karena kalimat yang sudah rapi itu paling gampang
   ke-copy apa adanya. Lihat bagian **"Parafrase — Wajib, Bukan Opsional"** di
   bawah untuk cakupan pasti dan cara mengeceknya.

---

## Alur Kerja

### Langkah 0 — Kumpulkan input

Untuk **Mode A**, pastikan ada:
- FSD sumber (.docx) — wajib
- Screenshot tiap menu — opsional, tapi kalau tidak ada, semua gambar jadi placeholder
- Penjelasan singkat tiap menu — untuk menyusun deskripsi bullet & tabel spec
- Metadata: judul project, versi, nama penyusun/approver (boleh dikosongkan)

Kalau ada yang kurang, **tanya**. Jangan mulai dengan asumsi.

### Langkah 1 — Baca sumber

```bash
pandoc -t markdown sumber.docx > /tmp/sumber.md   # baca isi
unzip -q sumber.docx -d /tmp/unpacked             # untuk manipulasi XML
find /tmp/unpacked -type l -delete                # buang symlink
```

Cek struktur: apakah sumber sudah berformat Blueprint (ada Overview / 2.1 Flow Process / 2.2 Role ID Specification / 2.3 User Interface)? Kalau sudah, kerjanya jadi **re-format**, bukan tulis ulang.

### Langkah 2 — Bangun / perbaiki dokumen

Jalankan script sesuai kebutuhan (semua ada di `scripts/`, sudah teruji):

| Script | Fungsi |
|---|---|
| `replace_images.py` | Ganti semua gambar jadi placeholder `[ Gambar – tempel screenshot di sini ]` |
| `build_frontmatter.py` | Bangun sampul + halaman TTD + Dokumen Kontrol sesuai standar |
| `fix_headings_toc.py` | Set outlineLvl (Heading 1–4) + bangun ulang Daftar Isi otomatis |
| `apply_format.py` | Times New Roman 12pt, H1 16pt, H2–4 14pt, justify |
| `apply_emphasis.py` | Italic istilah Inggris (whitelist), bold nama menu/field/tombol |
| `set_row_height.py` | Tinggi baris heading 2–4 jadi 0.30in |
| `diff_fsd.py` | **(Mode C)** Bandingkan FSD v1 vs v2, cari section yang berubah |
| `patch_section.py` | **(Mode C)** Ubah satu section saja, gambar dijaga. Bisa juga menandai hasil revisi dengan highlight kuning (`--highlight-changed`, `--highlight-title-only`, `--clear-highlight`) |
| `verify.py` | Validasi + hitung struktur + ekstrak teks halaman |

Urutan yang benar untuk dokumen baru:
```
replace_images → build_frontmatter → fix_headings_toc → apply_format → apply_emphasis → set_row_height → verify
```

Untuk **Mode B (revisi format)**, jalankan hanya script yang relevan dengan permintaan user.

Untuk **Mode C (revisi konten)**, lihat bagian khusus di bawah.

### Langkah 3 — Repack & verifikasi

```bash
cd /tmp/unpacked && zip -Xrq ../hasil.docx .
python3 scripts/verify.py ../hasil.docx --original sumber.docx
```

`verify.py` akan gagal keras kalau paragraf hilang drastis — itu tanda ada bug, **jangan diserahkan ke user**.

### Langkah 4 — Serahkan

Copy ke output, panggil `present_files`, lalu laporkan:
- Apa yang dikerjakan (tabel ringkas)
- **Apa yang belum diverifikasi** — jujur saja
- Langkah manual yang tersisa (selalu: refresh TOC di Word)

---

## Standar Format (PT. Advantage SCM)

Detail lengkap ada di `references/format-standard.md`. Ringkasannya:

**Front matter (4 halaman):**
- **I** — Sampul: box abu-abu bingkai tebal berisi `FSD BLUEPRINT` / `<NAMA PROJECT>` / `VERSI: x.x`; blok metadata (No. Dokumen, Klarifikasi: Rahasia, Disiapkan Oleh, Pemilik Sistem, Area Bisnis); box Copyright & Pernyataan **10pt**
- **II** — Judul project + 4 panel TTD (Disusun/Disetejui, Diperiksa/Diperiksa, Diketahui/Diketahui, Diketahui/Diketahui) **12pt** + box Disclaimer merah
- **III** — DOKUMEN KONTROL: header biru `4472C4`, kolom Tanggal Selesai Doc \| PIC Review \| Versi \| Referensi \| Nomor Ticket PMA
- **IV** — DAFTAR ISI: field TOC otomatis (`TOC \o "1-8" \h \z \u`)

**Body:**
- Struktur: Overview → 1.1 Background, 1.2 Scope, 1.3 Policy & Issues → Spesifikasi Fungsional dan Teknis → 2.1 Flow Process, 2.2 Role ID Specification, 2.3 User Interface → 2.3.x per modul → 2.3.x.x per menu
- Tiap menu: gambar/placeholder + caption `Gambar x.x Tampilan ...` + bullet deskripsi + tabel **Button Specification** (Button Label \| OnClickEvent \| Visible \| Validation \| Error Message) + tabel **Field Spesification** (Field Name \| Type \| Length \| Example \| Remarks \| Wajib Isi)

**Tipografi:**
- Isi konten: Times New Roman **12pt**, justify
- Heading 1: **16pt** · Heading 2–4: **14pt**
- Copyright: **10pt** · Blok TTD: **12pt**
- Tinggi baris heading 2–4: **0.30in** (432 twips, `hRule=atLeast`)
- Italic: frasa Inggris utuh saja (*Preventive Maintenance*, *Change Log*, *Golden Unit*). **Bukan** istilah UI baku (edit, form, button, menu, report, user)
- Bold: nama menu/field/tombol (**Master Workstation**, **Change Request**, **FIXAM_IT**)

---

## Parafrase — Wajib, Bukan Opsional

**Kasus nyata yang melatarbelakangi aturan ini:** dibandingkan langsung,
bullet deskripsi di Blueprint hasil generate ternyata identik karakter-per-
karakter dengan bullet di FSD sumber. Bukan mirip — sama persis, termasuk
tanda baca. Ini terjadi karena FSD sumber kadang sudah berisi kalimat
deskripsi yang matang, dan tanpa instruksi eksplisit, kalimat yang sudah rapi
itu yang paling mudah "keambil" apa adanya alih-alih ditulis ulang.

### Cakupan — apa yang diparafrase, apa yang tidak

| Bagian | Diparafrase? | Alasan |
|---|---|---|
| Bullet deskripsi menu (naratif) | **Ya, wajib** | Kalimat penjelasan, bukan data terstruktur |
| Kolom **Remarks** di tabel Field Specification | **Ya, wajib** | Isinya juga kalimat penjelasan, bukan nilai baku |
| Kolom **Field Name**, **Type**, **Example** | **Tidak** | Data teknis presisi — memparafrase berisiko mengubah makna |
| Kolom **Button Label**, **OnClickEvent**, **Validation**, **Error Message** | **Tidak** | Spesifikasi teknis; error message sering berupa string yang benar-benar ditampilkan ke user, tidak boleh diparafrase |
| Nama menu, nama field, nama tombol | **Tidak** | Identitas, harus identik dengan aplikasi sungguhan |

**Aturan intinya:** kalau isinya *menjelaskan sesuatu dengan kalimat*, parafrase.
Kalau isinya *nilai/label/nama yang harus persis sama dengan sistem*, salin apa
adanya. Ini konsisten dengan Aturan Wajib #5 (jangan mengarang data) — parafrase
mengubah cara mengatakan, bukan mengubah apa yang dikatakan.

### Cara parafrase yang benar

Parafrase berarti **menyusun ulang struktur kalimat dengan makna yang identik**,
bukan menulis ulang bebas. Batasannya:

- **Boleh:** ubah susunan kalimat, ganti kata sambung, pecah kalimat panjang jadi
  dua, gabung dua kalimat pendek yang berurutan.
- **Boleh:** ganti pilihan kata yang maknanya sama persis (mis. "digunakan oleh"
  → "dipakai oleh").
- **Tidak boleh:** menambah informasi yang tidak ada di FSD sumber (mis. menambah
  alasan "untuk meningkatkan efisiensi" kalau FSD tidak menyebutnya).
- **Tidak boleh:** menghilangkan detail teknis (angka, nama role, nama status)
  demi kalimat terdengar lebih ringkas.
- **Tidak boleh:** mengubah urutan proses bisnis yang dijelaskan (mis. urutan
  status New → Need Verification → Need Approval → Approved harus tetap
  berurutan sama).

**Uji cepat sebelum menulis:** kalau kalimat hasil parafrase ditaruh bersebelahan
dengan kalimat FSD sumber, keduanya harus terlihat **berbeda strukturnya** tapi
**sama isinya**. Kalau strukturnya juga mirip (cuma ganti 1-2 kata), itu belum
parafrase — masih terlalu dekat dengan menyalin.

### Contoh

FSD sumber:
> "Menu Master Test ini akan digunakan oleh Operator/PIC yang ditunjuk untuk
> melakukan penginputan Bank Soal/Pertanyaan untuk test/ujian."

**Salah** (ini yang terjadi di kasus nyata — disalin utuh):
> "Menu Master Test ini akan digunakan oleh Operator/PIC yang ditunjuk untuk
> melakukan penginputan Bank Soal/Pertanyaan untuk test/ujian."

**Salah** (kosmetik doang, struktur masih identik):
> "Menu Master Test ini dipakai oleh Operator/PIC yang ditunjuk buat melakukan
> penginputan Bank Soal/Pertanyaan untuk test/ujian."

**Benar** (struktur berbeda, isi identik — role, hak akses, dan tujuan tetap sama):
> "Operator atau PIC yang ditunjuk memakai menu ini untuk menginput Bank
> Soal/Pertanyaan yang dipakai pada test atau ujian."

FSD sumber (kolom Remarks di tabel Field Specification):
> "Digunakan untuk memilih jenis test/survey. Pilihan pada kolom ini akan
> mempengaruhi kolom pertanyaan/soal yang akan dimunculkan"

**Benar:**
> "Menentukan jenis test/survey; pilihan di sini menentukan kolom
> pertanyaan/soal apa saja yang muncul selanjutnya."

### Verifikasi wajib sebelum serah terima

Tambahan untuk Langkah 3 (Repack & verifikasi) dan Langkah 4 (Serahkan) yang
sudah ada: sebelum memanggil `present_files`, bandingkan **bullet deskripsi dan
kolom Remarks** hasil akhir terhadap FSD sumber per menu. Kalau ada kalimat yang
sama persis atau hanya beda 1-2 kata, tulis ulang dulu sebelum diserahkan. Jangan
mengandalkan `verify.py` untuk ini — script itu memvalidasi struktur XML dan
jumlah paragraf, bukan kemiripan kalimat. Pengecekan kemiripan ini harus dibaca
manual oleh Claude saat menyusun, bukan dianggap otomatis benar karena
`verify.py` lolos.

Ini berlaku di **Mode A** (menyusun bullet dari FSD sumber) maupun **Mode C**
(saat `patch_section.py` mengganti isi section — teks pengganti yang disiapkan
sebelum patch juga harus parafrase, bukan salinan dari FSD versi baru).

---

## Mode A — Menyusun konten dari gambar + penjelasan

Ada dua sumber yang mungkin dipakai, dan keduanya **wajib diparafrase** —
lihat bagian "Parafrase — Wajib, Bukan Opsional" di atas untuk cakupan dan
contohnya:

- **Screenshot + penjelasan singkat dari user** — susun bullet dari penjelasan
  itu, dengan bahasa sendiri.
- **FSD sumber yang sudah punya bullet deskripsi lengkap** — ini yang paling
  rawan ke-copy apa adanya, justru karena kalimatnya sudah rapi. Baca isinya,
  pahami maknanya, lalu **tulis ulang dengan struktur kalimat sendiri**. Jangan
  menyalin walaupun kalimat aslinya sudah terdengar baik.

Susun untuk tiap menu:

1. **Placeholder gambar** + caption `Gambar x.x Tampilan <nama menu>`
2. **Bullet deskripsi** — parafrase dari FSD sumber dan/atau penjelasan user.
   Pola kalimat yang dipakai di dokumen existing (boleh dipakai sebagai pola
   pembuka, isinya tetap ditulis ulang):
   - "Gambar diatas adalah tampilan dari menu ..."
   - "Menu tersebut dapat diakses oleh user dengan role ..."
   - "Terdapat beberapa form yang ada dalam ... seperti form add, edit, dll"
3. **Tabel Button Specification** — satu baris per tombol yang terlihat di
   screenshot atau disebut FSD. Kolom Button Label/OnClickEvent/Validation/
   Error Message disalin apa adanya dari FSD — ini data teknis, bukan narasi.
4. **Tabel Field Spesification** — satu baris per field di form. Kolom Field
   Name/Type/Example disalin apa adanya. Kolom **Remarks** diparafrase kalau
   isinya kalimat penjelasan (bukan nilai baku seperti "Wajib Diisi").

**PENTING:** kalau penjelasan user/FSD tidak cukup untuk mengisi kolom (mis. Validation atau Error Message), **isi `Tidak Ada` atau kosongkan, lalu beri tahu user kolom mana yang perlu dilengkapi.** Jangan mengarang validasi yang tidak disebutkan — parafrase tidak pernah berarti menambah informasi baru.

---

## Mode C — Revisi konten (FSD versi baru → patch Blueprint)

**Skenario:** user kasih FSD versi baru (mis. `FSD_v2.docx`), dan sudah punya
Blueprint jadi dari versi sebelumnya — **yang screenshot-nya sudah ditempel manual.**

### ATURAN MUTLAK

> **JANGAN PERNAH rebuild Blueprint dari nol.**
> Screenshot di dalamnya ditempel manual oleh user dan **tidak bisa dikembalikan**
> kalau hilang. Rebuild = menghancurkan kerja user berjam-jam.
> Yang boleh: **patch hanya section yang berubah.**

### Langkah

**1. Cari selisihnya**
```bash
python3 scripts/diff_fsd.py fsd_v1.docx fsd_v2.docx --show-diff
```

**Kunci pembanding = NAMA MENU, bukan nomor section.** Nomor (2.3.1.4) cuma
posisi dan bergeser kalau ada menu baru disisipkan di tengah; nama menu adalah
identitasnya. Dengan kunci nomor, penyisipan satu menu bikin semua menu di
bawahnya salah terbaca sebagai "hilang + baru".

Output dikelompokkan jadi 5:

| Kelompok | Artinya | Tindakan |
|---|---|---|
| **menu baru** | ada di v2, tidak ada di v1 | tambahkan ke Blueprint |
| **menu hilang** | ada di v1, tidak ada di v2 | **KONFIRMASI dulu**, jangan hapus otomatis |
| **isi berubah** | nama sama, isi beda | patch menu ini |
| **hanya bergeser nomor** | isi sama, cuma nomornya pindah | **jangan disentuh** |
| **tetap** | tidak berubah | jangan disentuh |

**2. Tampilkan ke user, MINTA KONFIRMASI**

Jangan langsung eksekusi. Tampilkan ringkasannya dan tanya:
- Section yang **berubah** → konfirmasi mana yang mau di-patch
- Section **baru** → tanya di mana posisinya dan apakah ada screenshot barunya
- Section **hilang** → **selalu tanya**. Jangan menghapus apa pun tanpa izin;
  bisa jadi cuma dipindah, bukan dihapus.

**3. Patch satu per satu — targetkan pakai NAMA MENU**

Untuk **section yang ISI-nya berubah**, urutannya: bersihkan highlight lama →
patch → tandai hasil revisi. Ketiganya bisa satu perintah:

```bash
# lihat isi menu sebelum diubah
python3 scripts/patch_section.py document.xml --menu "feedback" --show

# ganti teks lama, dan tandai kuning teks HASIL revisinya
python3 scripts/patch_section.py document.xml --menu "Master - Peripheral" \
    --clear-highlight --replace "30 hari" "7 hari" --highlight-changed

# ganti nama menu (judul juga bisa ditandai lewat --highlight-changed)
python3 scripts/patch_section.py document.xml --menu "feedback" \
    --title "Feedback User" --highlight-changed

# tambah bullet baru — bullet ini otomatis ditandai kuning juga (dia hasil revisi)
python3 scripts/patch_section.py document.xml --menu "feedback" \
    --clear-highlight --append-bullet "Penambahan validasi reopen maksimal 7 hari" \
    --highlight-changed
```

Untuk **menu yang benar-benar BARU** (belum ada di Blueprint versi sebelumnya),
cukup judulnya yang ditandai — isi section (bullet, tabel) ditulis normal:

```bash
python3 scripts/patch_section.py document.xml --menu "Menu Baru" \
    --title "Menu Baru" --highlight-title-only
```

**Aturan highlight — baca dulu sebelum patch:**

| Situasi | Flag | Yang ditandai kuning |
|---|---|---|
| Section isi berubah (`--replace`) | `--highlight-changed` | Seluruh baris/bullet yang kena replace — walau cuma sebagian kecil teksnya beda |
| Bullet baru ditambahkan (`--append-bullet`) | `--highlight-changed` | Bullet barunya sendiri (otomatis ikut tertandai) |
| Menu benar-benar baru | `--highlight-title-only` | **Hanya** teks judul menu. Isi section (bullet, tabel, gambar) **tidak** ditandai |
| Revisi berikutnya menimpa section yang sama | `--clear-highlight` (jalankan dulu, sebelum flag lain) | Menghapus highlight kuning dari revisi sebelumnya, supaya tidak menumpuk |

**Yang di-highlight selalu teks VERSI BARU (hasil revisi), bukan versi lama
yang dihapus** — teks lama sudah tidak ada lagi di dokumen setelah `--replace`
dijalankan, jadi tidak ada yang perlu "ditandai sebagai lama".

`--menu` cocokkan nama tanpa peduli huruf besar/kecil dan tanda baca, jadi
`"master peripheral"` == `"Master - Peripheral"`. Kalau tidak ketemu persis,
dicoba pencocokan sebagian. `--section <nomor>` masih ada sebagai cadangan,
tapi **utamakan `--menu`**.

`patch_section.py` otomatis:
- backup ke `.bak` sebelum mengubah
- menghitung gambar sebelum & sesudah — **kalau gambar berkurang, perubahan
  dibatalkan dan dikembalikan dari backup**

**4. Verifikasi**
```bash
python3 scripts/verify.py hasil.docx --original blueprint_lama.docx
```
Cek: jumlah gambar **tidak berkurang**, paragraf tidak anjlok. Untuk section
yang di-highlight, tambahan cek manual: buka docx, pastikan **hanya** bagian
yang memang direvisi yang kuning — bukan seluruh section, dan bukan section
lain yang tidak sedang di-patch.

**5. Update Dokumen Kontrol**

Revisi = versi baru. Tambahkan baris di tabel DOKUMEN KONTROL (tanggal, PIC,
versi, referensi perubahan). Kalau datanya tidak diberi user, **tanya** —
jangan diisi tebakan.

### Kalau section baru butuh screenshot

Section yang benar-benar baru belum punya gambar. Sisipkan placeholder
`[ Gambar – tempel screenshot di sini ]` + caption, lalu **beri tahu user
secara eksplisit** section mana saja yang perlu ditempel screenshot baru.

### Yang TIDAK boleh dilakukan di Mode C

- Menjalankan `build_frontmatter.py` (menimpa front matter yang sudah disetujui)
- Menjalankan `replace_images.py` (menghapus screenshot user)
- Menjalankan ulang seluruh pipeline Mode A
- Menghapus section tanpa konfirmasi user

---

## Yang tidak bisa diotomatiskan

Sampaikan ini ke user di akhir, jangan disembunyikan:

1. **Daftar Isi** — field TOC harus di-refresh manual di Word: klik kanan → Update Field → Update entire table. Tidak bisa terisi tanpa Word dibuka.
2. **Screenshot** — user tempel sendiri ke posisi placeholder. Menempel otomatis rawan urutan tergeser.
3. **Verifikasi visual** — renderer gambar sering gagal. Kalau tidak bisa lihat hasil render, **bilang terus terang** bahwa verifikasi berbasis ekstraksi teks + struktur XML, dan minta user cek proporsi visualnya.

---

## Referensi

- `references/format-standard.md` — spesifikasi format lengkap + nilai XML persis
- `references/pitfalls.md` — jebakan teknis yang sudah pernah bikin rusak. **Baca sebelum edit XML.**
- `assets/istilah.md` — daftar istilah italic & bold, bisa ditambah per project
