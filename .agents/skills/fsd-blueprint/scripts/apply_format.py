#!/usr/bin/env python3
"""
Terapkan tipografi standar FSD Blueprint:
  - Isi konten : Times New Roman 12pt (sz=24), justify untuk narasi
  - Heading 1  : 16pt (sz=32)
  - Heading 2-4: 14pt (sz=28)
  - Copyright  : 10pt (sz=20)
  - Blok TTD   : 12pt (sz=24)
  - Placeholder gambar dibiarkan 9pt abu-abu (biar gampang dicari)

Pakai:
    python3 apply_format.py document.xml [--map 21=32,22=28,23=28,24=28]

CATATAN: hitung run pakai p.iter(w('r')), BUKAN p.findall(w('r')).
findall melewatkan run di dalam hyperlink -> banyak teks tidak ikut berubah.
"""
import argparse
from lxml import etree
from docx_common import (w, load, save, get_rpr, set_font, order_ppr,
                         content_table, pstyle_of)

PLACEHOLDER_MARK = 'tempel screenshot'
BODY_SIZE = 24        # 12pt
COPYRIGHT_SIZE = 20   # 10pt
SIG_SIZE = 24         # 12pt
JUSTIFY_MIN_CHARS = 60


def run(path, head_map):
    tree, root = load(path)
    body = root.find(w('body'))
    ct = content_table(body)

    n_head = n_body = n_just = 0

    # --- heading & isi konten ---
    if ct is not None:
        for p in ct.iter(w('p')):
            sid = pstyle_of(p)
            runs = list(p.iter(w('r')))
            if sid in head_map:
                for r in runs:
                    set_font(get_rpr(r), head_map[sid])
                    n_head += 1
                continue
            for r in runs:
                txt = ''.join(t.text or '' for t in r.iter(w('t')))
                if PLACEHOLDER_MARK in txt:
                    continue
                set_font(get_rpr(r), BODY_SIZE)
                n_body += 1
            if len(''.join(p.itertext()).strip()) > JUSTIFY_MIN_CHARS:
                pp = p.find(w('pPr'))
                if pp is None:
                    pp = etree.Element(w('pPr'))
                    p.insert(0, pp)
                for j in pp.findall(w('jc')):
                    pp.remove(j)
                j = etree.SubElement(pp, w('jc'))
                j.set(w('val'), 'both')
                order_ppr(pp)
                n_just += 1

    # --- front matter: copyright 10pt, blok TTD 12pt ---
    n_copy = n_sig = 0
    for t in body.findall(w('tbl')):
        if t is ct:
            continue
        txt = ''.join(t.itertext())
        if 'Copyright' in txt:
            for r in t.iter(w('r')):
                set_font(get_rpr(r), COPYRIGHT_SIZE)
                n_copy += 1
        elif any(k in txt for k in ('Disusun oleh:', 'Diperiksa oleh:',
                                    'Diketahui oleh:', 'Disetejui oleh:')):
            for r in t.iter(w('r')):
                set_font(get_rpr(r), SIG_SIZE)
                n_sig += 1

    save(tree, path)
    print(f'heading runs: {n_head} | body runs: {n_body} | justified: {n_just}')
    print(f'copyright runs -> 10pt: {n_copy} | signature runs -> 12pt: {n_sig}')


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('path', nargs='?', default='/tmp/unpacked/word/document.xml')
    ap.add_argument('--map', default='21=32,22=28,23=28,24=28',
                    help='styleId=halfpoints, mis. 21=32 (H1 16pt)')
    a = ap.parse_args()
    hm = {k: int(v) for k, v in (kv.split('=') for kv in a.map.split(','))}
    run(a.path, hm)
