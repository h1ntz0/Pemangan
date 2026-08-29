#!/usr/bin/env python3
"""
Samakan tinggi baris heading di tabel konten.

Kenapa perlu: tinggi baris heading di FSD sumber sering tidak konsisten
(ada yang 561, 218, bahkan 90 twips = 0.06in) sehingga judul terlihat mepet.

Default: heading level 2-4 -> 0.30in (432 twips), hRule=atLeast.
atLeast dipakai supaya baris berisi teks panjang tetap bisa melebar sendiri
dan isinya TIDAK terpotong.

Konversi: inch * 1440 = twips. 0.30in = 432.

Pakai:
    python3 set_row_height.py document.xml [--styles 22,23,24] [--inch 0.30]
"""
import argparse
from lxml import etree
from docx_common import w, load, save, content_table, text_of


def run(path, styles, twips):
    tree, root = load(path)
    ct = content_table(root.find(w('body')))
    if ct is None:
        print('tabel konten tidak ditemukan')
        return

    changed = []
    for tr in ct.findall(w('tr')):
        ps = tr.find('.//' + w('pStyle'))
        sid = ps.get(w('val')) if ps is not None else None
        if sid not in styles:
            continue
        trPr = tr.find(w('trPr'))
        if trPr is None:
            trPr = etree.Element(w('trPr'))
            tr.insert(0, trPr)
        old = None
        for h in trPr.findall(w('trHeight')):
            old = h.get(w('val'))
            trPr.remove(h)
        h = etree.SubElement(trPr, w('trHeight'))
        h.set(w('val'), str(twips))
        h.set(w('hRule'), 'atLeast')
        changed.append((sid, old, text_of(tr)[:40]))

    save(tree, path)
    print(f'baris heading disesuaikan ke {twips} twips: {len(changed)}')
    for sid, old, txt in changed:
        print(f'  style {sid}: {old} -> {twips} | {txt}')


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('path', nargs='?', default='/tmp/unpacked/word/document.xml')
    ap.add_argument('--styles', default='22,23,24')
    ap.add_argument('--inch', type=float, default=0.30)
    a = ap.parse_args()
    try:
        run(a.path, set(a.styles.split(',')), int(round(a.inch * 1440)))
    except BrokenPipeError:
        pass
