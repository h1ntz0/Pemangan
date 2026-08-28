---
name: flowchart-standarisasi2
description: Mengekstrak flowchart mentah (gambar/deskripsi) menjadi struktur JSON detail tanpa meringkas, lalu SELALU merendernya jadi satu file HTML swimlane siap-download — lengkap dengan icon PNG, anti-overlap label routing, legend, tabel step, tabel decision, catatan, dan tombol download gambar per-section. Tidak pernah berhenti di JSON mentah sebagai output akhir.
---

# Skill: Flowchart Standarisasi 2 — Flowchart Mentah ke HTML Swimlane Tanpa Meringkas

## Deskripsi

Kamu adalah expert dalam menganalisis flowchart proses dan mengkonversinya menjadi output visual terstruktur.

Skill ini bekerja dalam **satu alur wajib, dua tahap internal**, dan HANYA punya satu bentuk output akhir:

- **Tahap 1 — Ekstraksi JSON** (internal, wajib, tidak pernah diskip): membaca flowchart mentah (gambar/deskripsi) dan mengekstrak **seluruh alur proses apa adanya** ke struktur JSON. Semua rule ekstraksi di bawah ini tetap berlaku penuh dan seketat sebelumnya.
- **Tahap 2 — Render HTML** (selalu dijalankan setelah Tahap 1, tanpa perlu diminta): JSON dari Tahap 1 langsung dipakai sebagai input `scripts/render_flowchart_html.py` untuk menghasilkan satu file HTML mandiri (swimlane diagram + legend + tabel step + tabel decision + catatan + tombol download PNG per-section).

**Setiap kali skill ini dipanggil, output akhir yang diserahkan ke user SELALU file HTML, bukan JSON mentah.** JSON hanyalah struktur data perantara di tahap 1 — jangan pernah menghentikan proses di JSON dan menyerahkannya sebagai jawaban final, dan jangan menunggu user secara eksplisit meminta "HTML"/"visual"/"gambar" dulu sebelum lanjut ke Tahap 2. Langsung render HTML-nya tanpa bertanya, dan sajikan file HTML tersebut ke user sebagai jawaban.

Pengecualian satu-satunya: jika user secara eksplisit dan spesifik minta "JSON saja" / "JSON mentahnya saja" / semacamnya, boleh tampilkan JSON itu (misalnya sebagai lampiran tambahan), tapi tetap lanjutkan ke HTML-nya juga kecuali user secara eksplisit bilang tidak perlu HTML.

Jangan pernah melompat ke Tahap 2 tanpa benar-benar menyelesaikan Tahap 1 dengan lengkap — struktur JSON Tahap 1 adalah source of truth yang menjamin tidak ada step yang hilang, dan itulah yang dikonsumsi renderer HTML.

### ATURAN UTAMA (berlaku untuk kedua tahap)

**JANGAN MERINGKAS FLOW PROCESS.**

Flowchart hasil output HARUS merepresentasikan flowchart mentah yang diberikan user secara detail dan berurutan.

Jika flowchart mentah memiliki banyak step kecil, aktivitas, input, proses, pengecekan, decision, perpindahan lane, atau aktivitas berulang, **semuanya harus dipertahankan**.

Jangan menggabungkan beberapa step menjadi satu step hanya karena step-step tersebut memiliki tujuan yang sama atau terlihat sebagai bagian dari satu proses besar.

Jangan menghilangkan step hanya karena dianggap terlalu detail, redundant, sederhana, atau bisa direpresentasikan dengan satu aktivitas yang lebih umum.

Jangan membuat interpretasi proses menjadi lebih singkat daripada flowchart sumber.

Prinsip ini berlaku sama persis di tahap render HTML: merender ke HTML tidak pernah jadi alasan untuk memangkas, menggabung, atau menyederhanakan step apa pun. HTML hanyalah presentasi lain dari JSON perantara yang sama — jumlah node, decision, loop, dan lane harus identik.

---

## Input

Input dapat berupa:

- Flowchart berupa gambar (screenshot, PNG, JPG, PDF/image)
- Deskripsi tertulis dari alur proses
- Flowchart yang memiliki beberapa lane/swimlane
- Flowchart dengan decision, looping, branching, atau perpindahan antar-lane

---

## Prinsip Ekstraksi (Tahap 1 — JSON internal)

### 1. Pertahankan seluruh step mentah

Setiap aktivitas atau shape yang terlihat pada flowchart mentah harus dipertahankan sebagai step tersendiri.

Contoh:

Flowchart mentah:

1. User membuka menu
2. User memilih data
3. Sistem menampilkan form
4. User mengisi form
5. User klik Save
6. Sistem melakukan validasi
7. Data valid?
8. Jika Ya → sistem menyimpan data
9. Jika Tidak → sistem menampilkan pesan error
10. User memperbaiki data

JANGAN diubah menjadi:

1. User melakukan input data
2. Sistem memvalidasi data
3. Data disimpan

Output harus tetap mempertahankan seluruh detail step mentah.

### 2. Jangan melakukan semantic compression

Jangan menggabungkan:

- "Buka Menu" + "Pilih Menu" menjadi "Akses Menu"
- "Input Data" + "Klik Save" menjadi "Submit Data"
- "Validasi Data" + "Simpan Data" menjadi "Proses Data"
- Beberapa aktivitas berbeda menjadi satu aktivitas hanya karena masih berada dalam satu proses bisnis

Gunakan teks/aktivitas yang paling dekat dengan flowchart sumber.

### 3. Jangan mengarang step

Jangan menambahkan step yang tidak terlihat atau tidak disebutkan pada sumber.

AI boleh melakukan normalisasi teknis yang diperlukan agar JSON valid, tetapi **tidak boleh menambahkan proses bisnis baru**.

Jika informasi tertentu tidak tersedia pada flowchart, gunakan `null`, `"-"`, atau nilai default sesuai schema.

Jika ada shape yang benar-benar tidak dapat diidentifikasi maknanya (misalnya shape kosong tanpa label dan tanpa fungsi yang jelas), catat secara eksplisit ke user bahwa shape tersebut diabaikan dan alasannya — jangan diam-diam menghapusnya, dan jangan mengarang label untuk shape tersebut.

### 4. Pertahankan urutan

Urutan step harus mengikuti urutan flowchart mentah.

Jangan melakukan rearrangement berdasarkan asumsi proses bisnis.

Jika flowchart memiliki percabangan, ikuti connection/arrow yang terlihat.

Jika terdapat looping, pertahankan koneksi kembali ke step sebelumnya.

### 5. Pertahankan decision

Setiap decision harus tetap menjadi `type: "decision"`.

Jangan mengubah decision menjadi process hanya untuk menyederhanakan flow.

Decision harus mempertahankan cabang:

- YA / YES / APPROVE / TRUE
- TIDAK / NO / REJECT / FALSE

Gunakan `yaTo` dan `tidakTo` sesuai koneksi pada flowchart.

Jika decision punya lebih dari dua cabang, atau cabangnya bukan pasangan Ya/Tidak (misalnya kategori A/B/C, atau label custom seperti "Langsung"/"Tidak Langsung"), tetap catat SEMUA cabang apa adanya — jangan dipaksakan jadi biner. Lihat field `branches` di bagian Output Format untuk cara merepresentasikan ini tanpa mengubah `yaTo`/`tidakTo` untuk kasus 2 cabang.

### 6. Pertahankan lane

Setiap step harus tetap berada pada lane yang sesuai dengan posisi/role pada flowchart mentah.

Jangan memindahkan step antar-lane hanya berdasarkan asumsi.

### 7. Pertahankan pengulangan

Jika flowchart mentah memiliki proses yang kembali ke step sebelumnya, jangan menghilangkan loop tersebut.

Contoh:

Input → Validasi → Tidak Valid → Kembali ke Input

Harus tetap menghasilkan koneksi:

`Validasi -> Input`

bukan membuat proses baru seperti "Revisi Data" jika shape tersebut tidak ada pada flowchart.

### 8. Dead-end apa adanya

Jika sebuah step pada sumber memang tidak memiliki garis lanjutan ke mana pun (dead-end pada flowchart aslinya — bukan karena kamu lupa menelusuri), jangan mengarang koneksi supaya "terlihat lengkap". Tandai step tersebut sebagai dead-end (lihat field `deadend` di Output Format) dan sebutkan ke user bahwa itu memang begitu pada sumber.

---

# Struktur JSON Internal (Tahap 1)

JSON di bawah ini TIDAK diserahkan ke user sebagai jawaban akhir — ini murni struktur data perantara yang langsung dipakai untuk menjalankan Tahap 2 (render HTML). Kecuali user eksplisit minta "JSON saja", jangan menampilkan blok JSON mentah sebagai jawaban; langsung proses ke HTML dan serahkan file HTML-nya.

Ketika user meminta ekstraksi biasa (tanpa minta visual/HTML), output HARUS berupa valid JSON dan tidak boleh memiliki teks lain sebelum atau sesudah JSON.

Struktur JSON:

```json
{
  "title": "[NAMA PROSES / BRAND]",
  "subtitle": "[DESKRIPSI SINGKAT PROSES]",
  "lanes": ["[Nama Lane 1]", "[Nama Lane 2]", "..."],
  "steps": [
    {
      "id": "[unik string, misal: s0, s1, s2, ...]",
      "no": [urutan step di tabel, atau null jika step tidak muncul di tabel],
      "type": "[start|end|process|input|decision|database]",
      "label": "[teks singkat dalam shape]",
      "lane": [index lane],
      "row": [index baris dalam diagram],
      "offset": [OPSIONAL, default 0 — lihat 'Field tambahan untuk Tahap 2' di bawah],
      "desc": "[deskripsi detail untuk tabel, atau null]",
      "pic": "[nama PIC/departemen, atau '-']",
      "output": "[output/deliverable, atau null]",
      "next": [
        {"to": "[id step berikutnya]"}
      ],
      "yaTo": "[id step jika YA/APPROVE, atau null]",
      "tidakTo": "[id step jika TIDAK/REJECT, atau null]",
      "branches": [OPSIONAL — hanya untuk decision >2 cabang atau label custom, lihat di bawah],
      "deadend": [OPSIONAL, true jika step ini memang tidak punya lanjutan pada sumber],
      "deadend_note": "[OPSIONAL, keterangan singkat kenapa dead-end]"
    }
  ],
  "footerNotes": [
    "[note 1]",
    "[note 2]",
    "[note 3]"
  ]
}
```

---

# Field Rules

## id

Gunakan identifier unik:

`s0`, `s1`, `s2`, `s3`, dst.

Tidak boleh ada ID yang duplikat.

## no

Nomor urutan step yang ditampilkan pada tabel.

Jika shape tidak perlu masuk tabel, gunakan:

`null`

Jangan menggunakan `no` untuk menggabungkan beberapa shape menjadi satu nomor.

Jika terdapat 10 shape aktivitas yang berbeda dan semuanya masuk tabel, semuanya harus memiliki nomor masing-masing.

## type

Gunakan:

- `start` → titik mulai
- `end` → titik selesai
- `process` → aktivitas/proses
- `input` → input/form/data masuk
- `decision` → keputusan/percabangan
- `database` → penyimpanan/master data, ATAU titik data/merge sebelum broadcast ke beberapa lane sekaligus (mis. shape "Masuk ke dalam database", atau shape merge/gerbang data seperti "Inputan" sebelum hasil disebar ke banyak pihak). **Selalu dirender sebagai tabung/silinder ungu** di HTML (lihat "Aturan Layout — Shape Database/Merge"), terlepas dari bentuk asli shape ini di sumber (hexagon, silinder, atau bentuk data lain) — standarisasi visual ini sengaja dilakukan supaya semua flowchart yang dirender skill ini konsisten.

Jangan mengubah type hanya untuk mengurangi jumlah step.

## label

Label harus menggambarkan teks/aktivitas pada shape sumber.

Label boleh dinormalisasi sedikit jika diperlukan untuk keterbacaan, tetapi jangan mengubah makna atau menggabungkan beberapa aktivitas.

Jika teks sumber cukup panjang, pertahankan makna utamanya tanpa menggabungkan aktivitas berbeda.

**Prioritas label:**

1. Teks asli pada flowchart
2. Normalisasi minor jika teks tidak terbaca sempurna
3. Jangan membuat label baru yang lebih general jika teks asli masih dapat dipahami

Jangan memendekkan label karena khawatir "kepanjangan buat shape-nya" — itu bukan pertimbangan yang valid di tahap ekstraksi. Renderer HTML sudah otomatis mengecilkan font shape (`autofit_size()`, lihat "Aturan Layout — Auto-fit Label Shape") supaya label sepanjang apa pun dari sumber tetap muat di dalam shape-nya. Tulis label selengkap makna aslinya; urusan "muat secara visual" itu tanggung jawab Tahap 2, bukan alasan untuk meringkas di Tahap 1.

## lane

Gunakan index lane:

- lane pertama = `0`
- lane kedua = `1`
- lane ketiga = `2`
- dst.

Jangan membuat lane baru jika lane tersebut tidak ada pada sumber.

## row

Row harus mengikuti posisi vertikal flowchart.

Step yang berada pada level/tinggi yang sama dapat memiliki row yang sama.

Jangan menggunakan row untuk menggabungkan beberapa step.

## desc

`desc` digunakan untuk memberikan penjelasan detail mengenai step.

Jangan menggunakan `desc` sebagai alasan untuk menghilangkan detail dari `label` atau step lain.

Jika satu shape mewakili satu aktivitas, tetap buat satu object step.

## pic

PIC harus mengikuti lane/role pada flowchart.

Jika tidak diketahui:

`"-"`

Jangan mengarang nama PIC.

## output

Isi berdasarkan output yang memang terlihat atau dapat disimpulkan langsung dari step tersebut.

Jika tidak ada:

`null`

Jangan membuat output baru hanya untuk melengkapi field.

## next

Berisi koneksi normal ke step berikutnya.

Jika hanya satu:

```json
"next": [{"to": "s2"}]
```

Jika tidak memiliki koneksi:

```json
"next": []
```

Pertahankan semua koneksi yang memang ada.

## yaTo

Khusus untuk decision **dua cabang** (Ya/Tidak atau ekuivalennya).

Isi ID step tujuan cabang:

- YA
- YES
- APPROVE
- TRUE
- kondisi positif yang ekuivalen

Jika bukan decision, atau decision punya >2 cabang (pakai `branches` sebagai gantinya):

`null`

## tidakTo

Khusus untuk decision **dua cabang**.

Isi ID step tujuan cabang:

- TIDAK
- NO
- REJECT
- FALSE
- kondisi negatif yang ekuivalen

Jika bukan decision, atau decision punya >2 cabang (pakai `branches` sebagai gantinya):

`null`

## branches (opsional)

Dipakai HANYA jika decision punya lebih dari 2 cabang, atau cabangnya bukan pasangan Ya/Tidak biasa — misalnya kategori 3 arah ("Test Essay" / "Test PG & Mix Match" / "Survey"), atau label custom ("Langsung" / "Tidak Langsung"). Jangan dipaksakan ke `yaTo`/`tidakTo` kalau labelnya bukan benar-benar Ya/Tidak — pakai `branches` supaya teks label asli sumber tetap terekam persis.

```json
"branches": [
  {"label": "Test Essay", "to": "s9", "kind": "normal"},
  {"label": "Test PG & Mix Match", "to": "s14", "kind": "normal"},
  {"label": "Survey", "to": "s12", "kind": "normal"}
]
```

`kind` boleh `normal` (default, abu-abu), `ya` (hijau — untuk cabang yang secara semantik "positif"/disetujui), atau `tidak` (merah — untuk cabang "negatif"/ditolak). Untuk decision Ya/Tidak biasa, tetap gunakan `yaTo`/`tidakTo` seperti biasa — `branches` tidak wajib diisi kalau `yaTo`/`tidakTo` sudah cukup.

## deadend / deadend_note (opsional)

Set `"deadend": true` jika step ini memang tidak punya garis lanjutan pada flowchart sumber (lihat Prinsip Ekstraksi #8). Isi `deadend_note` dengan keterangan singkat, misalnya `"tidak ada lanjutan pada sumber"`. Jangan gunakan field ini untuk step yang sebenarnya punya lanjutan tapi kamu belum sempat menelusurinya — pastikan benar-benar sudah dicek dulu di sumber.

**Field ini murni untuk kelengkapan/audit-trail Tahap 1 (JSON internal) — sejak 2026-08-26, `deadend`/`deadend_note` TIDAK PERNAH dirender ke HTML dalam bentuk apa pun** (bukan di kanvas, bukan tooltip, bukan di tabel step). Ini keputusan produk eksplisit dari user (dianggap noise visual yang tidak penting bagi pembaca diagram), bukan bug — lihat "Riwayat — deadend_note TIDAK LAGI Dirender ke HTML (Keputusan Produk, Bukan Bug)" untuk detail dan riwayatnya. Tetap isi field ini dengan benar setiap kali menemukan dead-end di sumber (itu bagian dari Prinsip Ekstraksi #8, soal integritas ekstraksi, bukan soal tampilan) — panjang teksnya sekarang tidak lagi dibatasi ketat karena tidak pernah tampil di kanvas, tapi tetap tulis singkat & jelas sebagai praktik baik untuk siapa pun yang membuka JSON-nya langsung.

## offset (opsional, hanya relevan untuk Tahap 2 / render HTML)

Kolom sub-posisi horizontal di dalam lane, dipakai saat sebuah decision bercabang ke beberapa box yang digambar sejajar/berdampingan pada sumber (bukan lurus ke bawah). `0` = kolom utama/tengah, negatif = ke kiri, positif = ke kanan. Lihat "Aturan Layout Render HTML" untuk detail penggunaan dan cara mencegah tabrakan.

---

# Aturan Anti-Ringkasan

Ini adalah aturan paling penting dari skill — berlaku untuk tahap ekstraksi JSON maupun tahap render HTML.

### DILARANG:

- Merangkum 5 step menjadi 1 step
- Menggabungkan beberapa aktivitas menjadi satu proses
- Menghilangkan step yang dianggap kecil
- Menghilangkan step karena dianggap redundant
- Mengubah beberapa input menjadi satu "Input Data"
- Mengubah beberapa proses menjadi satu "Proses Data"
- Mengubah beberapa approval menjadi satu "Approval"
- Menghapus decision
- Menghapus loop
- Menghapus perpindahan lane
- Menghilangkan intermediate process
- Mengubah flowchart detail menjadi high-level flow
- Membuat flowchart versi "lebih sederhana"
- (Saat render HTML) Mengecilkan/menyembunyikan step demi memuluskan layout — kalau layout terasa padat, perbesar `--lane-w`/`--offset-w`/`--row-h`, JANGAN kurangi jumlah step atau detail label
- Berhenti di JSON dan menyerahkannya sebagai jawaban akhir tanpa lanjut render HTML — ini SELALU salah kecuali user eksplisit hanya minta JSON

### WAJIB:

- 1 shape/aktivitas pada sumber = 1 step JSON
- Pertahankan urutan
- Pertahankan koneksi
- Pertahankan decision
- Pertahankan loop
- Pertahankan lane
- Pertahankan aktivitas intermediate
- Pertahankan detail proses
- Pertahankan struktur flowchart mentah

**Jumlah step JSON harus sedekat mungkin dengan jumlah shape/aktivitas pada flowchart sumber.**

Jika terdapat 30 aktivitas pada flowchart mentah, jangan menghasilkan hanya 10 step karena AI merasa prosesnya dapat diringkas.

---

# Penanganan Teks Flowchart

Jika teks pada shape terbaca:

Gunakan teks tersebut sebagai dasar `label`.

Jika teks sebagian terbaca:

Gunakan bagian yang terbaca dan jangan mengarang informasi yang tidak terlihat.

Jika terdapat singkatan:

Pertahankan singkatan sesuai sumber.

Jangan mengganti istilah teknis dengan istilah yang lebih umum hanya untuk membuatnya lebih mudah dipahami.

---

# Penanganan Flowchart Kompleks

## Branching

Jika satu step bercabang ke beberapa proses, pertahankan seluruh cabang yang terlihat.

## Looping

Jika flow kembali ke step sebelumnya, pertahankan koneksi tersebut.

## Parallel Process

Jika beberapa proses berjalan paralel, jangan digabungkan menjadi satu proses.

Gunakan row yang sesuai dengan posisi masing-masing.

## Cross-Lane Flow

Jika proses berpindah dari satu lane ke lane lain, pertahankan perpindahan tersebut.

## Multiple Decision

Jika terdapat beberapa decision berturut-turut, masing-masing harus menjadi object `decision` terpisah.

Jangan menggabungkan beberapa decision menjadi satu decision.

## Broadcast / Distribusi ke Banyak Lane

Jika satu titik data (misalnya hasil akhir proses) disebarkan/dibroadcast ke beberapa lane sekaligus (pola "cascade" — satu node bercabang ke banyak lane, masing-masing lane lalu punya rangkaian step lanjutannya sendiri-sendiri), pertahankan pola ini apa adanya: satu node sumber, banyak koneksi keluar, masing-masing menuju rangkaian step yang terpisah per lane. Jangan disederhanakan jadi satu node "Distribusi ke semua pihak".

---

# Workflow

1. Baca seluruh flowchart mentah.
2. Identifikasi seluruh lane.
3. Identifikasi setiap shape/aktivitas satu per satu.
4. Catat teks setiap shape.
5. Identifikasi type setiap shape.
6. Identifikasi posisi lane setiap shape.
7. Identifikasi posisi row setiap shape.
8. Identifikasi seluruh arrow/connection.
9. Identifikasi decision dan cabangnya (termasuk decision >2 cabang → gunakan `branches`).
10. Identifikasi looping.
11. Identifikasi perpindahan antar-lane.
12. Identifikasi dead-end (step tanpa lanjutan pada sumber).
13. Konversikan setiap shape menjadi object JSON tersendiri.
14. Validasi bahwa tidak ada step yang diringkas atau dihilangkan.
15. Validasi seluruh connection.
16. Validasi `yaTo`/`tidakTo`/`branches` untuk setiap decision.
17. Validasi JSON internal (checklist di bawah).
18. **Langsung lanjut ke Tahap 2 (Render HTML) tanpa bertanya dan tanpa menunggu permintaan tambahan dari user.** JSON dari langkah 1–17 dipertahankan penuh sebagai input `render_flowchart_html.py` — tidak diringkas ulang atau disederhanakan untuk "menyesuaikan" ke HTML.
19. Jalankan `render_flowchart_html.py`, preview hasilnya (cek tabrakan label di titik-titik decision bercabang banyak — lihat "Aturan Layout Render HTML"), lalu serahkan file HTML tersebut ke user sebagai jawaban akhir. Hanya tampilkan JSON mentah ke user jika diminta eksplisit ("kasih JSON-nya juga"/"JSON saja") — dan itu pun sebagai tambahan, bukan pengganti, HTML-nya.

---

# Final Validation Checklist (Tahap 1 — sebelum lanjut render HTML)

Sebelum menghasilkan JSON, lakukan pengecekan internal:

- Apakah semua shape pada flowchart sudah menjadi step?
- Apakah ada dua atau lebih shape yang saya gabungkan?
- Apakah ada aktivitas yang saya hilangkan karena dianggap tidak penting?
- Apakah ada decision yang saya hilangkan?
- Apakah ada loop yang saya hilangkan?
- Apakah semua perpindahan lane dipertahankan?
- Apakah urutan flow masih sama dengan sumber?
- Apakah setiap decision memiliki `yaTo`/`tidakTo` (2 cabang) atau `branches` (>2 cabang / label custom)?
- Apakah setiap `next`, `yaTo`, `tidakTo`, dan `branches[].to` menunjuk ke ID yang valid?
- Apakah jumlah step masuk akal dibandingkan jumlah shape pada sumber?
- Apakah saya menambahkan proses yang sebenarnya tidak ada pada sumber?
- Apakah dead-end pada sumber sudah ditandai (`deadend: true`) alih-alih dipaksakan punya lanjutan, atau sebaliknya, tidak ditandai dead-end padahal sebenarnya punya lanjutan yang belum saya telusuri?

Jika jawaban terhadap salah satu pertanyaan di atas adalah "ya" (untuk pertanyaan yang mengindikasikan masalah), perbaiki JSON sebelum output.

---

# Tahap 2 — Render HTML (WAJIB, otomatis, bukan opsi)

Tahap ini **selalu dijalankan setiap kali skill dipanggil** — tidak perlu trigger kata kunci apa pun dari user, tidak perlu user minta "HTML"/"visual"/"gambar" dulu. Begitu Tahap 1 (ekstraksi JSON) selesai dan lolos validasi, langsung lanjut render HTML tanpa bertanya ke user. Satu-satunya kondisi yang membuat Tahap 2 TIDAK dijalankan adalah kalau user secara eksplisit bilang tidak perlu HTML / hanya mau JSON.

## Cara pakai script yang sudah dibundel

Skill ini menyertakan dua script Python siap pakai di folder `scripts/`, dan aset icon PNG yang sudah ter-generate di `assets/icons/` (sudah jadi file fisik — tidak perlu digenerate ulang kecuali file assetnya hilang/dipindah tanpa foldernya):

```
flowchart-standarisasi2/
├── SKILL.md
├── scripts/
│   ├── generate_icons.py        # regenerate semua icon PNG (self-contained, hanya butuh Pillow)
│   └── render_flowchart_html.py # generator HTML utama
└── assets/
    └── icons/                   # icon PNG + base64 cache siap pakai
```

Langkah eksekusi:

1. Susun JSON hasil Tahap 1 ke sebuah file, misalnya `flow.json`. **Field wajib**: `title`, `subtitle`, `lanes`, `steps` (dengan `id`,`type`,`label`,`lane`,`row`, dan `next`/`yaTo`/`tidakTo`/`branches` sesuai isi flow). **Field tambahan yang perlu diisi khusus untuk Tahap 2**: `offset` (default 0, isi jika ada cabang berdampingan — lihat "Aturan Layout" di bawah) dan `footerNotes` (lihat "Aturan Isi Catatan" di bawah — WAJIB diisi dengan business rule, jangan dikosongkan begitu saja kalau flow sumber memang mengandung aturan/ketentuan/deadline apa pun).
2. Jalankan:
   ```bash
   python3 scripts/render_flowchart_html.py --data flow.json --out output.html
   ```
   Opsional: `--lane-w`, `--offset-w`, `--row-h` untuk menambah spacing kalau layout masih terasa padat (lihat aturan di bawah — defaultnya 760/258/168, sudah teruji aman untuk flowchart kompleks 60+ node dengan decision 3-cabang).
3. Jika `assets/icons/` belum ada (mis. baru clone skill ini dari nol), `render_flowchart_html.py` otomatis memanggil `generate_icons.py` sendiri — tidak perlu langkah manual tambahan. Satu-satunya dependency eksternal adalah **Pillow** (`pip install Pillow --break-system-packages` jika belum ada).
4. Copy `output.html` ke folder output kerja dan sajikan ke user sebagai file yang bisa didownload.

Jangan menulis ulang logic HTML/SVG dari nol di setiap percakapan — selalu jalankan script ini supaya behavior (layout, warna, anti-overlap, tombol download) konsisten dari sesi ke sesi dan dari device ke device manapun skill ini dipindahkan.

## Struktur HTML yang dihasilkan (wajib ada semua)

1. **Header banner** — judul + subtitle + icon proses generik, warna navy (`#152A54`).
2. **Diagram flowchart utama** — SVG swimlane, di dalam `<div id="canvasHolder">`, dengan tombol **"⬇ Unduh Flowchart Utama (PNG)"** di atasnya (self-contained: serialize SVG → canvas 2x scale → PNG, TANPA dependency eksternal).
3. **Panel Legenda Simbol** — dengan tombol **"⬇ Unduh Legenda Simbol (PNG)"**. Icon di legenda harus berupa **miniatur bentuk shape asli** yang dipakai di diagram (oval hijau/merah untuk Start/End, kotak biru untuk Process/Input, belah ketupat oranye untuk Decision, **tabung/silinder ungu untuk Database/Merge**) — **bukan** icon simbolik generik seperti gear/kaca pembesar/dokumen/segi enam. Ini sudah diimplementasikan di `generate_icons.py` (fungsi `icon_shape_*`) — jangan diganti balik ke icon simbolik atau ke bentuk segi enam.
4. **Panel "Penjelasan Setiap Step"** — tabel No/Aktivitas/Lane/PIC, hanya berisi step yang punya `no` (sesuai sumber — decision biasanya tidak bernomor). Dengan tombol **"⬇ Unduh Tabel Step (PNG)"**.
5. **Panel "Daftar Decision Point"** — tabel Decision/Lane, berisi semua node `type: "decision"`. Dengan tombol **"⬇ Unduh Decision Point (PNG)"**.
6. **Panel "Catatan"** — lihat "Aturan Isi Catatan" di bawah. **TIDAK ADA tombol download di panel ini** (keputusan eksplisit — jangan ditambahkan lagi kecuali user memintanya secara eksplisit).

Total 4 tombol download di seluruh halaman: Flowchart Utama, Legenda Simbol, Tabel Step, Decision Point. Semua nama tombol memakai pola konsisten: **"⬇ Unduh <Nama Bagian> (PNG)"**.

## Aturan Isi Catatan

Section "Catatan" HARUS berisi **business rule / process rule yang benar-benar tersirat dari flowchart itu sendiri** — contoh: batas waktu (H+1, H+7, H+5), kondisi kapan sebuah approval bersifat opsional/kondisional, aturan distribusi hasil ke pihak-pihak terkait, dsb.

Section "Catatan" **TIDAK BOLEH** berisi meta-commentary tentang proses ekstraksi/pembuatan diagram itu sendiri — misalnya "shape X saya abaikan karena tidak terbaca", "step Y tidak digambar lanjutannya", "lane A dan B merepresentasikan dua kolom terpisah". Catatan semacam itu, kalau memang perlu disampaikan, sampaikan langsung ke user lewat chat/teks balasan (bukan dipaksa masuk ke file HTML dalam bentuk apa pun — lihat field `deadend_note` untuk kasus spesifik dead-end, yang sejak 2026-08-26 memang tidak lagi dirender ke HTML sama sekali), bukan di panel Catatan.

Isi field `footerNotes` di JSON dengan kalimat-kalimat business rule ini; `render_flowchart_html.py` akan menampilkannya apa adanya di panel Catatan.

## Aturan Layout — Mencegah Tabrakan Label & Shape

Ini rangkuman algoritma yang sudah diimplementasikan di `render_flowchart_html.py` — pahami alasannya supaya kalau perlu menyesuaikan manual, arah perbaikannya tetap konsisten:

1. **Lebar lane & jarak antar-kolom cabang harus lebih besar dari lebar box + lebar teks label terpanjang.** Default `--lane-w 760` dan `--offset-w 258` sudah aman untuk box selebar ~190px dan label sepanjang ~20 karakter ("Test PG & Mix Match"). Kalau flowchart sumber punya label branch yang jauh lebih panjang, naikkan `--offset-w` (dan otomatis `--lane-w` ikut perlu dinaikkan proporsional) — jangan memendekkan teks label untuk "memuat"-nya.
2. **Safety clamp otomatis (WAJIB ada, jangan dihapus dari script):** sebelum menghitung koordinat apa pun, `render_flowchart_html.py` menghitung `MIN_OFFSET_W` dari setengah-lebar shape terbesar yang benar-benar dipakai di flowchart itu (`max_hw*2 + 40`), dan `MIN_LANE_W` dari offset terjauh yang dipakai. Nilai `--offset-w`/`--lane-w` dari CLI (atau default) di-clamp naik ke minimum ini kalau ternyata lebih kecil. **Ini menutup celah yang pernah terjadi**: decision (`hw=88`) diletakkan di offset bersebelahan dengan process box (`hw=98`) pakai `--offset-w 150` manual → 150 < 88+98 → kedua shape overlap. Jangan pernah percaya begitu saja nilai `--offset-w`/`--lane-w` yang diminta user/operator kalau itu lebih kecil dari kebutuhan minimum shape yang sedang dipakai — biarkan script yang menegakkan batas amannya sendiri, bukan mengandalkan manusia menghitung manual tiap kali.
3. **Rendering dilakukan 3 layer, urut dari bawah ke atas: (1) semua garis/connector, (2) semua shape/node, (3) semua label edge paling terakhir.** Ini menjamin label TIDAK PERNAH tertutup garis lain atau shape lain, apa pun urutan penggambaran edge-nya.
4. **Posisi label pada edge lurus (source dan target di kolom/offset yang sama) ditempatkan center di garis, condong ke arah SOURCE (±20% dari jarak vertikal source→target).**
5. **Posisi label pada edge elbow (source dan target beda kolom/offset — misalnya cabang decision ke offset kiri/kanan) ditempatkan di tengah segmen horizontal jog, dengan jog dinaikkan/diturunkan ke ±42% dari jarak vertikal, condong ke arah SOURCE.** Kombinasi aturan #4 dan #5 membuat label dari cabang lurus (dekat decision) dan label dari cabang menyamping (lebih jauh dari decision) otomatis punya ketinggian berbeda — sehingga tidak akan pernah tabrakan meskipun sama-sama berasal dari decision yang sama dan teksnya panjang.
6. **Edge same-row yang "kelewat" shape lain WAJIB di-reroute lewat bawah ("dip"), tidak boleh digambar garis lurus.** Kasus nyata yang pernah terjadi: decision di lane 2 (offset ke kanan) punya cabang "Tidak" yang lompat balik ke sebuah process box di lane 0 — sementara ADA process box lain (lane 1) duduk tepat di antara keduanya, di row yang sama. Garis lurus dari decision ke box lane-0 akan memotong lurus menembus box lane-1 itu. Sebelum menggambar edge same-row, script WAJIB mengecek (`is_obstructed`) apakah ada node lain (row sama) yang cx-nya berada strictly di antara cx source dan cx target. Kalau ADA obstruksi: reroute jadi 3 segmen — turun dari bottom-anchor source sampai `dip_y = cy_row + tinggi-shape-tertinggi-di-row-itu + 34px`, mendatar di `dip_y` melewati bawah semua shape yang "terlewati", lalu naik ke bottom-anchor target. Kalau TIDAK ada obstruksi (target adalah tetangga langsung, tidak ada apa pun di antaranya): tetap pakai garis lurus seperti biasa (lebih bersih secara visual). Pola dip ini meniru cara loop "reject/decline" jarak-jauh biasa digambar manual pada flowchart aslinya (melengkung di bawah baris utama), dan berlaku otomatis untuk flowchart apa pun tanpa perlu dikonfigurasi manual per-kasus.
6b. **Edge elbow (beda row DAN beda kolom/offset) yang pendekatan vertikal akhirnya "kelewat" shape lain WAJIB digeser, tidak boleh dibiarkan menembus/bersembunyi di belakang shape itu.** Kasus nyata yang pernah terjadi (dua варian): (a) sebuah process box di lane lain terhubung ke process box lain yang punya database (`offset 0`, row tepat di atasnya) — garis datang dari lane berbeda, elbow jog-nya mendarat lurus ke bawah tepat menembus box database itu sebelum sampai ke target. (b) sebuah edge panjang (mis. cabang "Ya" dari decision yang lompat lintas-lane ke box yang jauh di row lain) jog-nya kebetulan lewat PERSIS di belakang node lain (mis. node "Selesai") yang duduk di row perantara pada kolom yang sama dengan target — karena node digambar di atas edge (layer nodes > layer paths), garis itu jadi tersembunyi di belakangnya alih-alih terlihat memotongnya, sehingga bug-nya TIDAK KELIHATAN sampai dicek teliti. Sebelum menggambar edge elbow, script WAJIB mengecek (`find_vertical_obstruction`) apakah ada node lain dengan row strictly di antara row source dan row target, yang cx-nya dekat dengan cx TARGET (dalam radius gabungan half-width kedua node). Kalau ADA: geser `midY` (titik jog horizontal) melewati batas node itu — kalau target di bawah source, `midY = max(midY_default, bottom_obstruksi + 22)`; kalau target di atas source, `midY = min(midY_default, top_obstruksi - 22)`. Kalau TIDAK ada obstruksi: pakai `midY` default (42% dari source, condong ke source) seperti biasa. **Aturan ini krusial khususnya untuk shape `database`** karena pola umumnya (database diletakkan satu row di atas process box induknya, offset sama) rentan kena obstruksi ini setiap kali box induknya menerima edge masuk dari lane/row lain — jangan pernah anggap ini kasus langka.
7. **Setiap label punya background putih semi-opaque dengan border warna sesuai jenis edge**, supaya tetap terbaca walau ada garis lain lewat di belakangnya.
8. **Warna edge**: abu-abu (`#5b6577`) untuk koneksi normal, hijau (`#3f8f3f`) untuk cabang "Ya/Yes/Approve/True" (`kind: "ya"`), merah (`#c0392b`) untuk cabang "Tidak/No/Reject/False" (`kind: "tidak"`). Arrowhead ikut warna edge-nya.
9. **Field `offset` pada step** dipakai untuk memberi tahu renderer bahwa step tersebut digambar berdampingan (bukan lurus ke bawah) dengan step lain di lane yang sama pada row yang sama. Isi `0` untuk kolom utama/tengah, negatif untuk ke kiri, positif untuk ke kanan (mis. decision 3 cabang: -1/0/+1). Kalau tidak yakin, biarkan default `0` — renderer tetap akan menghasilkan diagram yang benar secara struktur, hanya saja cabang-cabang akan tergambar segaris vertikal alih-alih berdampingan seperti sumber; sebisa mungkin tetap isi `offset` yang sesuai supaya bentuk visual mendekati sumber. **Ingat: offset boleh melewati batas lane sendiri dan "masuk" ke area lane lain secara visual** (ini valid dan disengaja — dipakai saat decision di satu lane bercabang ke box di lane lain yang lebih jauh, seperti kasus Comsec "Setuju?" di lane Manager/BM yang cabang Tidak-nya kembali ke lane Inputer). Aturan #2 dan #6 di atas ada justru untuk menangani skenario ini dengan aman.
10. Setelah render, **selalu screenshot/preview hasilnya** (misalnya convert SVG ke PNG lewat LibreOffice headless, atau screenshot HTML-nya) dan cek titik-titik decision bercabang banyak DAN titik-titik loop/reject jarak-jauh — pastikan tidak ada shape yang overlap dan tidak ada garis yang menembus shape lain sebelum menyerahkan file ke user. Kalau masih ada masalah tata letak yang tidak tercakup aturan #1–9 di atas, perbaiki algoritma routing-nya di script (dan dokumentasikan aturannya di sini), jangan tambal manual di satu file output saja — supaya perbaikannya otomatis berlaku untuk flowchart lain berikutnya juga.
6c. **Edge SAME-COLUMN (bukan elbow, `abs(cx_a - cx_b) < 6`) yang melompati 2+ row WAJIB dicek juga (`find_straight_obstruction`), dan kalau ada obstruksi, di-bypass menyamping — bukan cuma digeser vertikal seperti #6b.** Ini beda kasus dari #6b: kalau x source dan x target PERSIS sama, menggeser `midY` saja tidak akan pernah menghindari obstruksi (karena garisnya tetap 100% vertikal lurus di kolom yang sama). Kasus nyata: sebuah process box menerima edge langsung dari box lain di lane yang SAMA tapi row-nya terpaut 2+ row, sementara ADA database (offset sama, row di antaranya) atau bahkan process box lain (kalau satu source bercabang ke dua target yang row-nya jauh berbeda, satu di antaranya terpaut row dengan yang lain) — pola ini ternyata sangat umum terjadi setiap kali sebuah step utama (mis. "Ambil data...") punya dua cabang next yang salah satu targetnya "melewati" target cabang lainnya secara vertikal. Kalau `find_straight_obstruction` menemukan obstruksi: jangan pakai garis lurus, pakai **bypass 4-segmen menyamping** — turun dari source ke tepat di atas obstruksi, geser menyamping (`bypass_x = x1 + hw_obstruksi + 30`, ke arah kanan) melewati lebar obstruksi, turun lagi melewati obstruksi, lalu geser balik ke kolom target sebelum masuk ke target. Ini SELALU aman secara struktur (tidak pernah menembus/bersembunyi di belakang apa pun), meski secara estetika hasilnya berupa "kotak kecil" di sisi obstruksi — itu trade-off yang bisa diterima; jangan pernah mundur ke garis lurus polos hanya demi tampilan lebih mulus kalau itu berarti garis kembali menembus/bersembunyi di belakang shape.

## Aturan Layout — Shape Database / Merge (Tabung Ungu)

Shape dengan `type: "database"` **WAJIB digambar sebagai tabung/silinder berdiri** (cap elips di atas, sisi lurus vertikal, lengkung di bawah — simbol "stored data" klasik pada flowchart), **bukan segi enam, bukan bentuk lain**. Ini berlaku di DUA tempat sekaligus dan keduanya harus konsisten:

1. **Diagram utama** (`shape_database()` di `render_flowchart_html.py`): fill `#D9CCF0`, stroke `#5F4390`, cap elips di `ell_h = hh * 0.26` dari total tinggi shape, teks label diposisikan di `cy + ell_h*0.55 + 3` (bukan tepat di `cy`) supaya baris pertama teks tidak ketiban garis cap — ini pernah jadi bug nyata (teks "Masuk ke" terlihat seperti tercoret karena cap ellipse memotongnya) sebelum ukuran/posisi ini disesuaikan.
2. **Icon legenda** (`icon_shape_data` di `generate_icons.py`): digambar dengan bentuk tabung yang sama persis secara proporsi (elips atas, sisi lurus, elips bawah), warna sama (`#D9CCF0`/`#5F4390`), supaya legenda benar-benar mewakili bentuk yang dipakai di diagram (konsisten dengan prinsip "Panel Legenda Simbol" di atas).

`DIM["database"]` di-set ke `(62, 50)` (half-width 62, half-height 50) — lebih tinggi dari sebelumnya (36) justru supaya ada cukup ruang vertikal untuk cap ellipse + label 2–3 baris tanpa saling menimpa. **Jangan mengecilkan tinggi ini** kecuali sudah dites ulang bahwa teks label terpanjang yang mungkin muncul (`max_chars=12` per baris pada `svg_text` untuk shape ini) tetap punya jarak aman dari garis cap.

Kalau ke depan ada kebutuhan bentuk database yang berbeda (mis. user minta warna lain), ubah konstanta warna/ukuran di KEDUA tempat itu bersamaan (script render + generator icon) supaya diagram dan legenda tidak pernah tidak-sinkron.

## Aturan Layout — Auto-fit Label Shape (Process / Decision / Database)

Bug nyata yang pernah terjadi (beda dari riwayat `deadend_note` di bawah — ini soal label SHAPE itu sendiri, bukan anotasi kecil di luar shape): pada flowchart Comsec "Master IMEI Android", salah satu shape `database` punya label panjang apa adanya dari sumber — `"Masuk ke database IMEI, device yang sudah didaftarkan dapat dipergunakan sesuai kebutuhan"` (~90 karakter). Sebelum ada perbaikan ini, setiap shape (`process`/`input`/`decision`/`database`) punya **ukuran box TETAP** (dari dict `DIM`) dan **font size TETAP**, tanpa hubungan apa pun antara panjang teks dan tinggi box. Label sepanjang itu di-wrap ke 8+ baris pada font tetap, dan hasilnya teks tumpah jauh melewati cap ellipse di atas DAN keluar dari sisi bawah shape — bukan cuma "agak mepet", tapi benar-benar keluar dari shape-nya, tumpang tindih dengan elemen lain di bawahnya.

Ini bukan kasus langka yang bisa diabaikan: aturan **Anti-Ringkasan** di skill ini secara eksplisit MELARANG memendekkan label demi memuluskan layout ("JANGAN kurangi jumlah step atau detail label"), padahal flowchart sumber sangat mungkin punya kalimat panjang dalam satu shape (lihat contoh IMEI di atas) — jadi masalah "label lebih panjang dari box" itu PASTI akan terjadi lagi di flowchart lain, bukan cuma kebetulan di kasus ini.

**Perbaikan**: fungsi `autofit_size(text, avail_h, base_size, min_size, base_max_chars, lh)` di `render_flowchart_html.py` mengecilkan font size step demi step dari `base_size` sampai `min_size` sampai tinggi blok teks ter-wrap muat di `avail_h` yang tersedia di dalam shape — meniru pola `autoFit()` yang sudah terbukti di skill flowchart sejenis lainnya, diadaptasi ke gaya wrap berbasis jumlah-karakter yang dipakai di file ini (bukan pengukuran pixel). Dipanggil di `shape_process()`, `shape_decision()`, dan `shape_database()` sebelum render label-nya. **Prinsipnya: kalau teks kepanjangan, KECILKAN FONT-nya, JANGAN PERNAH pendekkan teksnya** — itu satu-satunya cara mematuhi aturan Anti-Ringkasan sekaligus menjaga teks tetap di dalam shape.

Kalau ke depan menambah shape/field label baru yang bisa berisi teks panjang dari sumber, WAJIB pakai `autofit_size()` yang sama (jangan hardcode `size=`/`max_chars=` tetap lagi seperti sebelumnya) — hitung `avail_h` dari tinggi shape yang benar-benar bisa dipakai untuk teks (kurangi ruang untuk badge nomor, cap ellipse database, atau bagian shape yang menyempit seperti ujung diamond decision), lalu teruskan ke `svg_text()` sebagai `size=fsize, max_chars=chars`. Jangan pernah kembali ke font/box ukuran tetap untuk label shape — itu sumber bug ini.

## Riwayat — deadend_note TIDAK LAGI Dirender ke HTML (Keputusan Produk, Bukan Bug)

**Konteks penting untuk sesi mendatang: jangan menambahkan kembali rendering `deadend_note` (kanvas, tooltip, ATAU tabel) tanpa mengecek dulu dengan user.** Ini bukan sesuatu yang "belum sempat dikerjakan" — ini fitur yang sudah pernah ada, lalu SENGAJA dihapus.

Riwayat singkat: awalnya `deadend_note` dirender sebagai anotasi italic kecil (~10px) langsung di kanvas, di bawah shape dead-end-nya. Sempat ada bug legibilitas (note ~150 karakter di flowchart Comsec "Permintaan Hak Akses USB" ter-wrap jadi 4 baris rapat yang terbaca buram) yang diperbaiki dengan pembatasan panjang teks + backstop truncate/tooltip. Tapi setelah bug itu diperbaiki dan user melihat hasilnya di flowchart Comsec "Master IMEI Android", user menilai **teks merah ini sendiri, terlepas dari legibilitasnya, adalah visual clutter yang tidak penting** dan secara eksplisit minta dihapus total — bukan diperkecil, bukan disingkat, dihapus. Diputuskan dan dikonfirmasi ke skala **permanen di skill** (bukan cuma di 2 file yang sudah terlanjur dikirim), supaya tidak muncul lagi di flowchart mana pun ke depannya.

Yang dihapus dari `render_flowchart_html.py` saat itu: loop yang menggambar teks italic merah di kanvas dekat shape dead-end, fungsi `truncate_short()` (satu-satunya pemanggilnya), parameter `title=` pada `svg_text()` (satu-satunya pemakainya adalah tooltip dead-end ini), span `(deadend_note...)` di baris tabel step, dan CSS class `.deadnote`.

Yang **TETAP ADA** dan TIDAK berubah: field `deadend`/`deadend_note` di JSON Tahap 1 tetap wajib diisi dengan benar (lihat Prinsip Ekstraksi #8 dan field rule di atas) — itu soal integritas ekstraksi (menandai bahwa dead-end ini memang dari sumber, bukan step yang lupa ditelusuri), independen dari soal ditampilkan atau tidak. Pewarnaan fill/stroke kemerahan pada shape `process` yang `deadend: true` (di `shape_process()`) juga TETAP ADA — itu sinyal visual lewat warna shape itu sendiri, bukan teks tambahan, dan tidak pernah jadi keluhan user.

## Regression checklist sebelum menganggap render "selesai"

Setiap kali skill ini selesai merender HTML, mental checklist berikut wajib dicek dari hasil preview sebelum diserahkan ke user:

- Apakah ada dua shape yang bersinggungan/overlap secara visual? (indikasi `--offset-w`/`--lane-w` kurang, atau safety clamp di script perlu ditinjau ulang)
- Apakah ada garis edge yang menembus lurus ke/dari sebuah shape yang bukan source/target-nya? (indikasi routing same-row butuh dip, lihat aturan #6)
- **Apakah ada garis edge yang bersembunyi DI BELAKANG sebuah shape (bukan menembus di depan, tapi ketutup karena shape digambar di atas layer garis)?** Ini bug yang sama seriusnya tapi lebih gampang terlewat karena secara visual "kelihatan rapi" — cek khususnya edge elbow lintas-row yang landing-nya searah kolom dengan node lain di row perantara (lihat aturan #6b). Jangan cuma cek "ada garis nembus box" — cek juga "ada box yang nutupin garis".
- Apakah setiap label (termasuk label "Ya"/"Tidak"/label custom) terbaca jelas, tidak ketumpuk garis lain, tidak ketumpuk shape lain, dan tidak bertabrakan dengan label lain?
- Apakah decision dengan cabang panjang (melompati lane lain) sudah dites, bukan cuma decision dengan cabang pendek/lokal?
- Apakah shape `database` yang diletakkan satu row di atas process box induknya (offset sama) sudah dites dengan process box itu MENERIMA edge dari lane/row lain (bukan cuma dari box tepat di atasnya sendiri)? Ini pola yang paling sering memicu bug #6b.
- Apakah ada step yang punya DUA ATAU LEBIH `next` (bercabang ke beberapa target sekaligus) di mana target-targetnya berada di kolom (lane+offset) yang SAMA tapi row-nya berjauhan? Kalau ya, cek apakah salah satu cabang "melompati" target cabang lainnya (atau melompati database milik cabang lainnya) — ini pola pemicu bug #6c, paling gampang lolos karena masing-masing cabang KELIHATANNYA baik-baik saja kalau dicek satu-satu.
- **Apakah ada label shape (process/decision/database) yang teksnya panjang dari sumber?** Zoom in ke shape itu spesifik dan pastikan teksnya benar-benar muat DI DALAM garis batas shape (tidak tumpah ke cap ellipse database, tidak keluar dari sisi bawah/atas box, tidak nembus ujung diamond decision) — font-nya boleh mengecil otomatis (lihat "Aturan Layout — Auto-fit Label Shape"), itu normal dan diharapkan, BUKAN indikasi bug. Yang jadi indikasi bug adalah kalau teks masih kelihatan keluar dari shape meskipun sudah mengecil ke `min_size` — itu artinya box shape itu sendiri (`DIM` di `render_flowchart_html.py`) perlu ditinjau ulang untuk kasus label sepanjang itu.
- **Kalau ada step `deadend: true`, pastikan `deadend_note`-nya TIDAK muncul di HTML dalam bentuk apa pun** (bukan di kanvas, bukan tooltip saat hover, bukan di tabel step) — ini dihapus permanen atas keputusan eksplisit user (lihat "Riwayat — deadend_note TIDAK LAGI Dirender ke HTML"). Kalau ternyata masih muncul, itu regresi: cek apakah ada perubahan yang tidak sengaja mengembalikan rendering-nya.

Kalau salah satu jawabannya "ya, ada masalah" — perbaikannya HARUS masuk ke `render_flowchart_html.py` sebagai aturan umum (bukan workaround manual di satu output), lalu dokumentasikan penambahannya di section "Aturan Layout" di atas, supaya flowchart lain yang dirender di kemudian hari (device manapun, sesi manapun) otomatis ikut aman.



Begitu sebuah HTML flowchart sudah dibuat dan disetujui user, permintaan revisi berikutnya (styling, tombol, legenda, dsb.) **tidak boleh mengubah**:

- Isi/struktur diagram flowchart utama (node, koneksi, label, lane, row)
- Isi tabel "Penjelasan Setiap Step"
- Isi tabel "Daftar Decision Point"

kecuali user secara eksplisit memintanya. Permintaan seperti "tambah tombol download X" atau "perbaiki posisi label" adalah perubahan kosmetik/fitur yang HARUS diterapkan tanpa menyentuh tiga hal di atas.

## Self-containment / portability

Seluruh dependency Tahap 2 ada di dalam folder skill ini:

- `scripts/generate_icons.py` — hanya butuh Pillow, tidak ada file/asset eksternal yang diperlukan untuk menggambar icon (semua digambar dari primitif PIL).
- `scripts/render_flowchart_html.py` — hanya butuh Python standar + `assets/icons/*.b64` (sudah ada, atau di-generate otomatis dari #1 kalau hilang).
- Satu-satunya dependency runtime di sisi **browser** (bukan saat generate) adalah CDN `html2canvas` (dipakai HANYA oleh 3 tombol download section — Legenda, Tabel Step, Decision Point; tombol Flowchart Utama murni SVG→canvas tanpa library luar). Ini butuh koneksi internet saat user membuka HTML-nya dan mengklik salah satu dari 3 tombol tersebut — sudah ada pesan error otomatis di tombol terkait kalau library gagal dimuat.
- Skill ini tidak bergantung pada file/context apa pun di luar foldernya sendiri. Setelah dipindah ke device lain, cukup jalankan `scripts/render_flowchart_html.py` seperti biasa.

---

# Prinsip Utama

**Jangan membuat flowchart versi AI.**

**Buat representasi HTML (via JSON perantara) dari flowchart yang diberikan user — apa adanya, dan selalu sampai ke bentuk HTML final, tanpa perlu diminta dua kali.**

Tujuan skill ini bukan untuk memperbaiki, menyederhanakan, mengoptimalkan, atau merangkum proses bisnis.

Tujuannya adalah:

> **1:1 extraction dari flowchart mentah ke struktur JSON, dan 1:1 representasi visual dari JSON tersebut ke HTML — tanpa kehilangan detail di kedua tahap.**

Flowchart sumber adalah source of truth.

Jika flowchart sumber memiliki detail yang banyak, output juga harus memiliki detail yang banyak — baik dalam bentuk JSON maupun HTML.
