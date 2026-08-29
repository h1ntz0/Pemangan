# Jebakan Teknis — BACA SEBELUM EDIT XML

Semua di bawah ini **sudah pernah terjadi** dan merusak dokumen. Bukan teori.

---

## 1. JANGAN pakai regex untuk edit document.xml

**Yang terjadi:** `re.sub(r'<w:drawing>.*?</w:drawing>', ..., flags=re.DOTALL)`
pada document.xml 2.5 MB (satu baris panjang) → over-match lintas elemen.

**Kerusakannya:**
```
<w:tc>   orig=1579  jadi=37    (-1542)
<w:tr    orig= 495  jadi= 0    (-495)
<w:p     orig=2178  jadi=121   (-2057)
```
Seluruh isi dokumen hilang. Non-greedy `.*?` pun tetap bahaya karena XML-nya
satu baris tanpa newline.

**Yang benar:** `lxml` tree — `parent.replace(el, baru)`. Tidak mungkin
over-match karena beroperasi di level node.

---

## 2. JANGAN hapus elemen pakai index

**Yang terjadi:**
```python
kids = list(body)
# ... sisipkan elemen baru ...
for i in range(first, last+1):
    body.remove(kids[i])      # index sudah basi!
```
Paragraf turun dari 2178 → 134. Tabel konten (37 baris, seluruh isi FSD) terhapus.

**Yang benar:** kumpulkan elemen dulu, hapus by reference.
```python
old = [el for el in body if kondisi(el)]
for el in old:
    if el.getparent() is not None:
        body.remove(el)
```

---

## 3. Urutan child element OOXML itu KETAT

Salah urutan → `Element '...' is not expected`.

Kasus nyata:
- `<w:pageBreakBefore>` disisipkan di posisi 0 padahal sudah ada `<w:pStyle>`
  → pStyle wajib duluan.
- `<w:tblW>` ditaruh setelah `<w:jc>` di dalam `<w:tblPr>` → tblW duluan.

**Solusi:** selalu panggil `order_ppr()` / `order_rpr()` dari `docx_common.py`
setelah menambah child. Urutan lengkap ada di sana.

Untuk `<w:tblPr>`: `tblStyle, tblpPr, tblOverlap, bidiVisual, tblStyleRowBandSize,
tblStyleColBandSize, tblW, jc, tblCellSpacing, tblInd, tblBorders, shd,
tblLayout, tblCellMar, tblLook`

---

## 4. Drawing bisa terbungkus mc:AlternateContent

Kalau hanya `<w:drawing>` di dalamnya yang diganti, akan tersisa `<w:r>`
langsung di bawah `<mc:Choice>` → XML invalid ("Element 'r' is not expected",
parent = Choice).

**Solusi:** ganti seluruh node `<mc:AlternateContent>`. Lihat
`scripts/replace_images.py` langkah 1.

---

## 5. Run bersarang di dalam run

Struktur asli: `<w:r><w:drawing/></w:r>`.
Kalau drawing diganti dengan `<w:r>...</w:r>` utuh → jadi run di dalam run
(118 kasus). Validator cuma melaporkan 1, padahal semuanya rusak.

**Solusi:** ganti **seluruh run pembungkus**, bukan isinya saja.
Cek dengan: semua `<w:r>` harus punya parent `p`/`hyperlink`/`ins`/`del`.

---

## 6. `p.findall(w('r'))` melewatkan run

`findall` cuma anak langsung. Run di dalam `<w:hyperlink>` tidak ikut.
Akibatnya format cuma kena sebagian (255 dari 3779 run).

**Solusi:** pakai `p.iter(w('r'))`.

---

## 7. `id()` pada elemen lxml tidak stabil

`set(id(p) for p in tabel.iter(...))` lalu dicek dengan `id(p) in set` bisa
meleset karena lxml membuat proxy baru tiap akses.

**Solusi:** jangan pakai `id()` untuk identitas. Iterasi langsung dari scope
yang benar (`ct.iter(...)`), atau bandingkan dengan operator `is` pada
referensi yang disimpan dalam list.

---

## 8. `copy.deepcopy` run mewarisi format lama

Saat memecah run untuk italic/bold, deepcopy membawa `<w:i>` dari run asal →
italic menyebar ke teks yang tidak dimaksud.

**Solusi:** bersihkan `i`/`iCs` di rPr hasil deepcopy sebelum set flag baru.

---

## 9. FSD sumber sering sudah punya ribuan italic

Ditemukan **2160 run italic bawaan** di sel tabel ("Wajib Isi", "Tidak Ada",
"Varchar 20"). Kalau tidak dibersihkan, aturan "italic hanya untuk istilah
Inggris" jadi tidak berlaku — hampir semua tabel miring.

**Solusi:** `apply_emphasis.py` membersihkan dulu, baru menerapkan whitelist.
Selalu **beri tahu user** kalau melakukan ini.

---

## 10. `--auto-repair` validator bisa merusak styles.xml

Menjalankan validator dengan `--auto-repair` pernah menambah error baru di
`word/styles.xml` (`uiPriority` tidak pada tempatnya).

**Solusi:** kalau styles.xml rusak, restore dari sumber:
```bash
unzip -o -q sumber.docx word/styles.xml -d /tmp/unpacked
```

---

## 11. Symlink di hasil unzip

`unzip` bisa menghasilkan symlink yang bikin `zip` gagal / bocor.
Selalu: `find /tmp/unpacked -type l -delete` setelah unzip.

---

## 12. Tinggi baris: pakai `atLeast`, bukan `exact`

`hRule="exact"` memotong isi yang panjang. `atLeast` menjadikan nilai itu
tinggi minimum sehingga teks panjang tetap muat.

Konversi: `inch * 1440 = twips`. 0.30in = 432.

---

## 13. Renderer gambar sering gagal

`view` pada PNG/JPG hasil render kadang mengembalikan gambar kosong.
**Jangan mengklaim "sudah saya lihat dan sesuai" kalau tidak terlihat.**

Verifikasi alternatif yang andal:
- `pdftotext -f N -l N -layout file.pdf -` → cek komposisi per halaman
- hitung struktur XML (paragraf, baris, distribusi ukuran font)

Lalu **katakan terus terang** ke user bahwa verifikasi berbasis teks, dan
minta mereka cek proporsi visualnya.

---

## 14. Field TOC tidak terisi tanpa Word

Field `TOC \o "1-8" \h \z \u` baru terisi setelah dibuka di Word dan
di-Update Field. LibreOffice headless tidak mengisinya.

**Selalu sampaikan** langkah manual ini ke user di akhir.

---

## 15. Mode C: JANGAN rebuild Blueprint yang sudah ada screenshot

Blueprint yang sudah diserahkan ke user biasanya **sudah ditempeli screenshot
manual**. Kalau ada revisi FSD lalu Claude menjalankan ulang pipeline Mode A,
semua screenshot itu hilang dan **tidak bisa dikembalikan**.

**Solusi:** `diff_fsd.py` untuk cari selisih, `patch_section.py` untuk ubah
hanya section terkait. `patch_section.py` sudah punya pengaman: menghitung
gambar sebelum & sesudah, dan membatalkan perubahan kalau gambar berkurang.

## 16. Judul section bercampur isi kalau pakai teks seluruh baris

Blueprint menaruh judul di sel pertama dan isi di sel kedua pada baris yang
SAMA. Kalau ekstraksi judul memakai `''.join(tr.itertext())`, hasilnya:
`"1.2 Scope1. Master asset2. Feedbeck User3. Follow Up admin..."`.

Akibat lain: section pendek seperti `1.1` tidak terdeteksi karena teks
barisnya panjang (>120 char) sehingga dikira baris isi, bukan judul.

**Solusi:** ambil judul dari **sel pertama saja** (`tr.findall(w('tc'))[0]`).
Lihat `row_heading()` di `patch_section.py` dan `extract_sections()` di
`diff_fsd.py`.

## 17. `--replace` harus mencakup baris judul

Karena judul dan isi sering satu baris, mencari teks hanya di "baris isi"
akan meleset (`0 kena`). Cari juga di sel ke-2 dan seterusnya pada baris
judul — tapi **lewati sel pertama** supaya nomor/judul tidak ikut terganti.

## 18. Kunci diff HARUS nama menu, bukan nomor section

Nomor section (2.3.1.4) adalah **posisi**, bukan identitas. Kalau ada menu
baru disisipkan di tengah, semua nomor di bawahnya bergeser:

```
v1: 2.3.1.4 feedback          v2: 2.3.1.4 <menu baru>
    2.3.1.5 Master Reference      2.3.1.5 feedback
    2.3.1.6 Report                2.3.1.6 Master Reference
                                  2.3.1.7 Report
```

Dengan kunci **nomor** → dibaca "3 menu hilang + 4 menu baru" (salah total).
Dengan kunci **nama** → dibaca "1 menu baru, 3 hanya bergeser nomor" (benar).

`diff_fsd.py` memakai `norm_key()`: huruf kecil, tanda baca dibuang, spasi
dirapatkan. Nama duplikat (mis. "Report" di dua modul) dibedakan dengan
menambahkan nomor induknya sebagai sufiks.

Hasil diff dipisah jadi kategori **"isi berubah"** vs **"hanya bergeser
nomor"** — yang bergeser nomor TIDAK perlu di-patch isinya.

## 19. Bullet deskripsi ke-copy verbatim dari FSD sumber

**Yang terjadi:** dibandingkan langsung antara FSD sumber dan Blueprint hasil
generate (kasus nyata: dokumen Master Test & Survey), bullet deskripsi menu
ternyata **identik karakter-per-karakter**, termasuk tanda baca. Bukan mirip —
`diff` antara potongan kedua dokumen menunjukkan nol perbedaan.

**Kenapa terjadi:** instruksi lama cuma bilang "parafrase dari penjelasan
user", ditulis dengan asumsi user memberi penjelasan lisan singkat. Tapi
kenyataannya FSD sumber sering **sudah** berisi bullet deskripsi yang matang
dan enak dibaca. Kalimat yang sudah rapi itu justru paling gampang "keambil"
apa adanya karena tidak terasa perlu ditulis ulang — beda dengan penjelasan
singkat/berantakan yang secara alami memaksa ditulis ulang.

**Solusi:** parafrase itu wajib dilakukan justru **karena** FSD sumber sudah
rapi, bukan hanya saat sumbernya berantakan. Lihat bagian "Parafrase — Wajib,
Bukan Opsional" di `SKILL.md` untuk cakupan (bullet naratif + kolom Remarks,
bukan kolom struktural seperti Field Name/Validation/Error Message) dan cara
mengecek sebelum serah terima. Verifikasi kemiripan kalimat ini **tidak**
bisa diotomatiskan lewat `verify.py` — itu script untuk struktur XML, bukan
pembanding teks. Harus dibaca manual saat menyusun konten.

## 20. `<w:highlight w:val="none">` bawaan FSD sumber ke-hitung sebagai highlight

**Yang terjadi:** saat menguji fitur highlight revisi, penghitungan cepat
`len(list(el.iter(w('highlight'))))` melaporkan 6 highlight di satu baris
padahal baris itu belum pernah disentuh script. Ternyata FSD sumber memang
sudah punya elemen `<w:highlight w:val="none">` bawaan di beberapa run —
artinya "highlight dimatikan", bukan highlight kuning.

**Solusi:** saat menghitung atau mencari highlight KUNING, selalu filter
`val`, jangan hitung keberadaan elemen saja:
```python
sum(1 for hl in el.iter(w('highlight')) if hl.get(w('val')) == 'yellow')
```
`set_highlight()` dan `clear_highlight()` di `docx_common.py` sudah aman
(mereka eksplisit set/hapus berdasarkan value), tapi kode verifikasi/
pengecekan manual yang ditulis terpisah harus ikut memfilter ini.

## 21. `__pycache__` ikut ter-zip saat repack manual di sesi yang sama

**Yang terjadi:** setelah menjalankan script `.py` lewat `import` di sesi
Python yang sama dengan folder kerja docx, Python otomatis membuat
`__pycache__/*.pyc`. Kalau folder itu di-`zip` untuk repack docx tanpa
dikecualikan, validator resmi (`validate.py`) gagal dengan
`Unreferenced file: __pycache__/...`.

**Solusi:** sebelum `zip -Xrq hasil.docx .`, selalu `rm -rf __pycache__`
dulu di folder kerja, atau tambahkan `-x "__pycache__/*"` ke perintah zip.
Ini tidak terkait dengan perubahan pada dokumen — murni sampah dari proses
menjalankan script Python di direktori yang sama.
