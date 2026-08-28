#!/usr/bin/env python3
"""
Patch SATU section di Blueprint yang sudah jadi — tanpa merusak sisanya.

PENTING: Blueprint tujuan biasanya SUDAH berisi screenshot yang ditempel user.
Screenshot itu tidak bisa dikembalikan kalau hilang. Karena itu:
  - Script ini hanya menyentuh baris (w:tr) milik section yang diminta
  - Gambar di dalam section TIDAK ikut dihapus kecuali --replace-images
  - Selalu backup dulu (otomatis, .bak)

Pakai:
    # lihat isi section sebelum diubah
    python3 patch_section.py document.xml --menu "feedback" --show

    # ganti teks tertentu di dalam satu section
    python3 patch_section.py document.xml --section 2.3.1.4 \
        --replace "30 hari" "7 hari"

    # ganti judul section
    python3 patch_section.py document.xml --section 2.3.1.4 \
        --title "Feedback User"

    # tambah baris bullet di akhir section
    python3 patch_section.py document.xml --section 2.3.1.4 \
        --append-bullet "Penambahan validasi reopen maksimal 7 hari"
"""
import argparse
import re
import shutil
import sys
from lxml import etree
from docx_common import (w, XS, load, save, content_table, text_of,
                         make_para, order_rpr, get_rpr, set_highlight,
                         highlight_row, clear_highlight_row, highlight_first_run)

HEAD_RE = re.compile(r'^(\d+(?:\.\d+)*)\s')


def norm_key(title):
    """Samakan dengan diff_fsd.norm_key: nama menu jadi kunci stabil."""
    s = (title or '').lower()
    s = re.sub(r'[-–—_:.,()\[\]/]+', ' ', s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s


def row_heading(tr):
    """(nomor, judul, teks_sel_pertama) dari SEL PERTAMA baris.

    Judul ada di sel pertama, isinya di sel lain — kalau pakai teks seluruh
    baris, judul akan tercampur isi dan section pendek jadi tidak terdeteksi."""
    cells = tr.findall(w('tc'))
    first = text_of(cells[0]) if cells else text_of(tr)
    if len(first) >= 120:
        return None, None, first
    m = HEAD_RE.match(first[:120])
    if not m:
        return None, None, first
    return m.group(1), first[m.end():].strip(), first


def find_section(ct, number=None, menu=None):
    """Cari baris judul berdasarkan NAMA MENU (utama) atau nomor (cadangan).

    Nama menu lebih dipercaya: nomor bisa bergeser kalau ada menu baru
    disisipkan di tengah.
    """
    rows = ct.findall(w('tr'))
    want = norm_key(menu) if menu else None
    for i, tr in enumerate(rows):
        num, title, _ = row_heading(tr)
        if num is None:
            continue
        if want and norm_key(title) == want:
            return i, num, title
        if number and num == number:
            return i, num, title
    # pencarian longgar: nama menu sebagai substring
    if want:
        for i, tr in enumerate(rows):
            num, title, _ = row_heading(tr)
            if num and title and want in norm_key(title):
                return i, num, title
    return None, None, None


def section_rows(ct, number=None, menu=None):
    """Kembalikan (baris_judul, [baris_isi], nomor, judul)."""
    rows = ct.findall(w('tr'))
    start, num, title = find_section(ct, number, menu)
    if start is None:
        return None, [], None, None

    body = []
    depth = num.count('.')
    for tr in rows[start + 1:]:
        n2, _, _ = row_heading(tr)
        if n2 and n2.count('.') <= depth:
            break
        body.append(tr)
    return rows[start], body, num, title


def count_images(rows):
    n = 0
    for tr in rows:
        n += len(list(tr.iter(w('drawing'))))
    return n


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('path', nargs='?', default='/tmp/unpacked/word/document.xml')
    ap.add_argument('--menu', default=None,
                    help='NAMA menu (disarankan) mis. "Master - Peripheral"')
    ap.add_argument('--section', default=None,
                    help='nomor section (cadangan) mis. 2.3.1.4')
    ap.add_argument('--show', action='store_true')
    ap.add_argument('--replace', nargs=2, metavar=('LAMA', 'BARU'), action='append')
    ap.add_argument('--title', default=None, help='ganti nama menu')
    ap.add_argument('--append-bullet', dest='append_bullet', action='append')
    ap.add_argument('--highlight-changed', action='store_true',
                    help='Highlight kuning pada baris/bullet yang kena --replace atau --append-bullet (menandai hasil revisi)')
    ap.add_argument('--highlight-title-only', action='store_true',
                    help='Untuk menu BARU: highlight kuning hanya di teks judul, isi section tidak ditandai')
    ap.add_argument('--clear-highlight', action='store_true',
                    help='Hapus semua highlight kuning di section ini (jalankan sebelum menandai revisi baru, supaya highlight lama tidak menumpuk)')
    ap.add_argument('--no-backup', action='store_true')
    a = ap.parse_args()

    if not a.menu and not a.section:
        print('Wajib pakai --menu (disarankan) atau --section')
        return 1

    tree, root = load(a.path)
    ct = content_table(root.find(w('body')))
    if ct is None:
        print('tabel konten tidak ditemukan')
        return 1

    head, body, num, title = section_rows(ct, a.section, a.menu)
    if head is None:
        target = a.menu or a.section
        print(f'menu/section "{target}" TIDAK DITEMUKAN')
        print('Yang tersedia:')
        for tr in ct.findall(w('tr')):
            n2, t2, first = row_heading(tr)
            if n2:
                print(f'  [{n2}]  {t2}')
        return 1

    n_img = count_images([head] + body)
    print(f'Menu: [{num}] {title}')
    print(f'  {len(body)} baris isi, {n_img} gambar tertanam')

    if a.show:
        print(f'\n--- JUDUL ---\n  {text_of(head)[:100]}')
        print('--- ISI ---')
        for tr in body:
            print('  ' + text_of(tr)[:100])
        return 0

    if not (a.replace or a.title or a.append_bullet or a.highlight_title_only or a.clear_highlight):
        print('Tidak ada aksi. Pakai --show / --replace / --title / --append-bullet / --clear-highlight / --highlight-title-only')
        return 1

    if not a.no_backup:
        shutil.copy2(a.path, a.path + '.bak')
        print(f'backup: {a.path}.bak')

    changed = 0

    # --- bersihkan highlight dari revisi sebelumnya ---
    # Dijalankan PALING AWAL, sebelum perubahan lain, supaya highlight lama
    # tidak menumpuk dengan highlight yang akan ditandai untuk revisi ini.
    if a.clear_highlight:
        cleared = 0
        cleared += clear_highlight_row(head)
        for tr in body:
            cleared += clear_highlight_row(tr)
        print(f'  highlight lama dibersihkan: {cleared} run')

    # --- ganti nama menu ---
    title_paragraph = None
    if a.title:
        for t in head.iter(w('t')):
            txt = t.text or ''
            m = HEAD_RE.match(txt)
            if m:
                t.text = f'{num} {a.title}'
                changed += 1
                # simpan elemen <w:p> pembungkus untuk highlight judul nanti
                p = t.getparent()
                while p is not None and etree.QName(p).localname != 'p':
                    p = p.getparent()
                title_paragraph = p
                break

    # --- ganti teks di dalam section ---
    # Cari di baris judul JUGA, karena pada Blueprint judul dan isi sering
    # berada di satu baris yang sama (judul di sel 1, isi di sel 2).
    # Sel pertama baris judul dilewati supaya nomor/judul tidak ikut terganti.
    rows_changed = set()  # baris (w:tr) yang isinya berubah karena --replace
    if a.replace:
        head_cells = head.findall(w('tc'))
        head_body_cells = head_cells[1:] if len(head_cells) > 1 else []
        for old, new in a.replace:
            hits = 0
            for tr in body:
                for t in tr.iter(w('t')):
                    if t.text and old in t.text:
                        t.text = t.text.replace(old, new)
                        hits += 1
                        rows_changed.add(id(tr))
            for c in head_body_cells:
                for t in c.iter(w('t')):
                    if t.text and old in t.text:
                        t.text = t.text.replace(old, new)
                        hits += 1
                        rows_changed.add(id(head))
            print(f'  "{old}" -> "{new}": {hits} kena')
            changed += hits

    # --- tambah bullet di akhir section ---
    new_paragraphs = []  # paragraf baru dari --append-bullet, untuk highlight
    if a.append_bullet:
        last = body[-1] if body else head
        for txt in a.append_bullet:
            tc = last.findall(w('tc'))
            target = tc[-1] if tc else None
            if target is None:
                print('  tidak bisa menambah bullet: struktur sel tidak dikenali')
                continue
            new_p = make_para(txt, size=24, align='both')
            target.append(new_p)
            new_paragraphs.append(new_p)
            print(f'  + bullet: {txt[:60]}')
            changed += 1

    # --- highlight hasil revisi ---
    # Ditandai SETELAH semua perubahan di atas diterapkan, supaya yang
    # di-highlight adalah teks versi baru (hasil akhir), bukan versi lama.
    highlighted = 0
    if a.highlight_changed:
        # baris yang kena --replace: highlight seluruh run di baris tsb
        for tr in body:
            if id(tr) in rows_changed:
                highlighted += highlight_row(tr, 'yellow')
        if id(head) in rows_changed:
            highlighted += highlight_row(head, 'yellow')
        # bullet baru dari --append-bullet: paragraf itu sendiri hasil revisi
        for p in new_paragraphs:
            for r in p.findall(w('r')):
                rp = get_rpr(r)
                set_highlight(rp, 'yellow')
                highlighted += 1
        if highlighted:
            print(f'  highlight ditandai: {highlighted} run')

    if a.highlight_title_only:
        # Untuk menu baru: HANYA teks judul yang ditandai, isi section tidak
        # disentuh. Judul biasa ada di head (baris pertama section).
        target_p = title_paragraph
        if target_p is None:
            # --title tidak dipakai bersamaan; cari run pertama di sel pertama head
            head_cells = head.findall(w('tc'))
            target_p = head_cells[0] if head_cells else head
        n = highlight_first_run(target_p, 'yellow')
        if n:
            print(f'  highlight judul: {n} run ditandai')
        else:
            print('  !! highlight judul: tidak menemukan run untuk ditandai')

    # --- pengaman: pastikan gambar tidak berkurang ---
    after_img = count_images([head] + body)
    if after_img < n_img:
        print(f'!! GAMBAR HILANG ({n_img} -> {after_img}) — dibatalkan')
        if not a.no_backup:
            shutil.copy2(a.path + '.bak', a.path)
            print('   dikembalikan dari backup')
        return 1

    save(tree, a.path)
    print(f'selesai: {changed} perubahan, gambar tetap {after_img}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
