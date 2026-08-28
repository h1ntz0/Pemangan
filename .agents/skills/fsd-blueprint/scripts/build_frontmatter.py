#!/usr/bin/env python3
"""
Bangun front matter FSD Blueprint standar PT. Advantage SCM (4 halaman):
  I   Sampul
  II  Tanda tangan (4 panel) + Disclaimer
  III DOKUMEN KONTROL
  IV  DAFTAR ISI (dibangun oleh fix_headings_toc.py)

Pakai:
    python3 build_frontmatter.py document.xml --judul "FIXAM IT" --versi 1.1 \
        [--tahun 2025] [--disiapkan "Nama"] [--pemilik IT] [--area IT]

Field yang tidak diisi akan dikosongkan (bukan ditebak).
"""
import sys
import argparse
from lxml import etree
from docx_common import (w, load, save, make_para, make_cell, make_row,
                         make_table, text_of)

COPY = ('Dokumen ini mengandung informasi yang bersifat rahasia dan menjadi hak milik '
        'PT. Advantage SCM. Dokumen ini (termasuk bagian-bagian di dalamnya) tidak '
        'diperbolehkan untuk disebar-luaskan, diperbanyak ataupun dipindah-tangankan '
        'kepada pihak-pihak lain diluar PT. Advantage SCM. tanpa ijin tertulis dari '
        'manajemen PT. Advantage SCM.')

PERN = ('Informasi rencana, produk, fitur dan jasa yang terdapat pada dokumen ini '
        'terselenggarakan berdasarkan internal Proyek Bisnis Cash Management '
        'PT. Advantage SCM. Diyakinkan bahwa informasi yang disediakan mencukupi '
        'kebutuhan pengembangan dimana tingkat informasi yang disediakan dapat '
        'didetailkan lebih lanjut tanpa bersinggungan dengan kebutuhan mendasar dari '
        'Proyek Bisnis Cash Management PT. Advantage SCM. Maka dari itu tidak menutup '
        'kemungkinan adanya perubahan pada kebutuhan yang tercantum dalam dokumen ini.')

DISC1 = ('Disclaimer : Jika terdapat revisi setelah FSD di setujui, maka IT memiliki '
         'wewenang penuh untuk menentukan revisi tesebut masuk ke tahap saat ini, '
         'atau tahap selanjutnya.')
DISC2 = 'Revisi yang di terima akan berdampak kepada time-line Project.'

KONTROL_COLS = [1900, 1500, 900, 3100, 1900]
KONTROL_HEAD = ['Tanggal Selesai Doc', 'PIC Review', 'Versi', 'Referensi',
                'Nomor Ticket PMA']


def sig_panel_pair(left_label, right_label):
    """Satu tabel: 2 panel berdampingan, tiap panel = label, area TTD kosong,
    lalu Nama / Jabatan / Tanggal. Semua 12pt."""
    t = make_table([1100, 3400, 1100, 3400], width=9000, border_color='000000')
    t.append(make_row([
        make_cell(4500, make_para(left_label, bold=True, size=24), span=2, valign='top'),
        make_cell(4500, make_para(right_label, bold=True, size=24), span=2, valign='top'),
    ]))
    t.append(make_row([
        make_cell(4500, [make_para('', size=24) for _ in range(3)], span=2, valign='top'),
        make_cell(4500, [make_para('', size=24) for _ in range(3)], span=2, valign='top'),
    ], height=900))
    for lbl in ('Nama', 'Jabatan', 'Tanggal'):
        t.append(make_row([
            make_cell(1100, make_para(lbl, size=24, underline=True)),
            make_cell(3400, make_para('', size=24, bold=True)),
            make_cell(1100, make_para(lbl, size=24, underline=True)),
            make_cell(3400, make_para('', size=24, bold=True)),
        ], height=280))
    return t


def build(args):
    tree, root = load(args.path)
    body = root.find(w('body'))

    # cari batas front matter lama: sampai paragraf DAFTAR ISI (exclusive)
    kids = list(body)
    cut = None
    for i, el in enumerate(kids):
        if 'DAFTAR ISI' in text_of(el).upper():
            cut = i
            break
    if cut is None:
        # tidak ada DAFTAR ISI -> sisipkan di depan tabel konten
        for i, el in enumerate(kids):
            if etree.QName(el).localname == 'tbl':
                cut = i
                break
    if cut is None:
        cut = 0

    new = []

    # ---------- I. SAMPUL ----------
    new.append(make_para('FUNCTIONAL SPECIFICATION & TECHNICAL DESIGN',
                         bold=True, size=24, align='center'))
    new.append(make_para('', size=24))

    tb = make_table([8000], border_color='000000', border_sz='24', align='center')
    tb.append(make_row([make_cell(8000, [
        make_para('FSD BLUEPRINT', bold=True, size=44, align='center', color='1F3864'),
        make_para(args.judul.upper(), bold=True, size=44, align='center', color='1F3864'),
        make_para(f'VERSI: {args.versi}', bold=True, size=20, align='center', color='1F3864'),
    ], shade='BFBFBF')], height=1200))
    new.append(tb)
    new.append(make_para('', size=30))

    meta = [('No. Dokumen', args.no_dokumen), ('Klarifikasi', 'Rahasia'),
            ('Disiapkan Oleh', args.disiapkan), ('Pemilik Sistem', args.pemilik),
            ('Area Bisnis', args.area)]
    mt = make_table([2600, 3400], width=6000, align='center')
    # tanpa border tampak: pakai border putih
    for e in mt.find(w('tblPr')).find(w('tblBorders')):
        e.set(w('color'), 'FFFFFF')
    for k, v in meta:
        mt.append(make_row([
            make_cell(2600, make_para(k, bold=True, size=24), valign='top'),
            make_cell(3400, make_para(': ' + (v or ''), bold=True, size=24), valign='top'),
        ]))
    new.append(mt)
    new.append(make_para('', size=26))

    ct = make_table([8600], border_color='000000', border_sz='8', align='center')
    ct.append(make_row([make_cell(8600, [
        make_para(f'Copyright \u00a9 ({args.tahun})', bold=True, size=20, align='center'),
        make_para(COPY, size=20, align='both'),
        make_para('Pernyataan', bold=True, size=20, align='center'),
        make_para(PERN, size=20, align='both'),
    ], valign='top')]))
    new.append(ct)

    # ---------- II. TANDA TANGAN + DISCLAIMER ----------
    new.append(make_para(args.judul.upper(), bold=True, size=28,
                         align='center', pagebreak=True))
    new.append(make_para('', size=10))
    for pair in (('Disusun oleh:', 'Disetejui oleh:'),
                 ('Diperiksa oleh:', 'Diperiksa oleh:'),
                 ('Diketahui oleh:', 'Diketahui oleh:'),
                 ('Diketahui oleh:', 'Diketahui oleh:')):
        new.append(sig_panel_pair(*pair))
        new.append(make_para('', size=10))

    dt = make_table([9000], border_color='000000', border_sz='8')
    dt.append(make_row([make_cell(9000, [
        make_para(DISC1, size=18, color='FF0000', align='both'),
        make_para('', size=18),
        make_para(DISC2, size=18, color='FF0000', align='center'),
    ], valign='top')]))
    new.append(dt)

    # ---------- III. DOKUMEN KONTROL ----------
    new.append(make_para('DOKUMEN KONTROL', bold=True, size=24,
                         align='center', pagebreak=True))
    new.append(make_para('', size=20))
    kt = make_table(KONTROL_COLS, border_color='4472C4', align='center')
    kt.append(make_row([
        make_cell(KONTROL_COLS[i],
                  make_para(KONTROL_HEAD[i], bold=True, size=16,
                            align='center', color='FFFFFF'),
                  shade='4472C4')
        for i in range(5)], height=340))
    for _ in range(args.baris_kontrol):
        kt.append(make_row([make_cell(KONTROL_COLS[i], make_para('', size=16, align='center'))
                            for i in range(5)], height=300))
    new.append(kt)

    # ---------- splice: buang front matter lama, pasang yang baru ----------
    old = list(body)[:cut]
    anchor = list(body)[cut] if cut < len(list(body)) else None
    for el in new:
        if anchor is not None:
            anchor.addprevious(el)
        else:
            body.append(el)
    for el in old:                      # hapus by reference, BUKAN index
        if el.getparent() is not None:
            body.remove(el)

    save(tree, args.path)
    print(f'Front matter dibangun: {len(new)} blok, {len(old)} blok lama dihapus')


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('path', nargs='?', default='/tmp/unpacked/word/document.xml')
    ap.add_argument('--judul', required=True)
    ap.add_argument('--versi', default='1.0')
    ap.add_argument('--tahun', default='2025')
    ap.add_argument('--no-dokumen', dest='no_dokumen', default='')
    ap.add_argument('--disiapkan', default='')
    ap.add_argument('--pemilik', default='')
    ap.add_argument('--area', default='')
    ap.add_argument('--baris-kontrol', dest='baris_kontrol', type=int, default=2)
    build(ap.parse_args())
