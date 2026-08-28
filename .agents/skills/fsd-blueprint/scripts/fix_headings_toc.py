#!/usr/bin/env python3
"""
1. Beri outlineLvl pada style heading -> jadi Heading 1..4 sungguhan
2. Bangun ulang DAFTAR ISI sebagai field TOC otomatis

Kenapa perlu: FSD sumber sering TIDAK punya heading style sama sekali
(outlineLvl kosong), sehingga TOC Word tidak bisa dibangun dan daftar isi
lama cuma teks statis yang salah.

Cara kerja: style heading dideteksi dari pStyle yang dipakai baris judul di
tabel konten, lalu dipetakan ke level 0..3. Kalau mapping otomatis meleset,
override manual dengan --map.

Pakai:
    python3 fix_headings_toc.py document.xml [--styles-path styles.xml]
    python3 fix_headings_toc.py document.xml --map 21=0,22=1,23=2,24=3
"""
import sys
import argparse
import re
from lxml import etree
from docx_common import (w, XS, load, save, order_ppr, order_rpr,
                         content_table, text_of, make_para, pstyle_of)


def detect_mapping(body):
    """Tebak style heading dari pola nomor judul: 'Overview' = L0,
    '1.1 X' = L1, '2.3.1 X' = L2, '2.3.1.1 X' = L3.

    KETAT supaya tidak salah tangkap. Baris yang dianggap heading harus:
      - isinya pendek (<80 char) -> baris judul, bukan baris berisi tabel/narasi
      - kalau tanpa nomor, harus cocok daftar judul utama yang dikenal

    Kalau hasilnya meleset, override dengan --map.
    """
    ct = content_table(body)
    if ct is None:
        return {}
    KNOWN_L0 = ('overview', 'spesifikasi fungsional')
    votes = {}
    for tr in ct.findall(w('tr')):
        ps = tr.find('.//' + w('pStyle'))
        if ps is None:
            continue
        sid = ps.get(w('val'))
        txt = text_of(tr)
        if len(txt) > 80:            # baris konten, bukan judul
            continue
        m = re.match(r'^(\d+(?:\.\d+)*)\s+\S', txt)
        if m:
            lvl = min(m.group(1).count('.'), 7)
        elif any(txt.lower().startswith(k) for k in KNOWN_L0):
            lvl = 0
        else:
            continue
        votes.setdefault(sid, []).append(lvl)
    # buang style yang cuma muncul sekali dan tidak meyakinkan
    return {sid: max(set(v), key=v.count)
            for sid, v in votes.items() if len(v) >= 1}


def set_outline(styles_path, mapping):
    tree, root = load(styles_path)
    done = {}
    for s in root.iter(w('style')):
        sid = s.get(w('styleId'))
        if sid not in mapping:
            continue
        ppr = s.find(w('pPr'))
        if ppr is None:
            ppr = etree.SubElement(s, w('pPr'))
        for ol in ppr.findall(w('outlineLvl')):
            ppr.remove(ol)
        ol = etree.SubElement(ppr, w('outlineLvl'))
        ol.set(w('val'), str(mapping[sid]))
        order_ppr(ppr)
        done[sid] = mapping[sid]
    save(tree, styles_path)
    return done


def toc_field():
    p = etree.Element(w('p'))
    etree.SubElement(p, w('pPr'))

    def run(child_tag, **kw):
        r = etree.SubElement(p, w('r'))
        rp = etree.SubElement(r, w('rPr'))
        f = etree.SubElement(rp, w('rFonts'))
        for a in ('ascii', 'hAnsi', 'cs'):
            f.set(w(a), 'Times New Roman')
        s = etree.SubElement(rp, w('sz'))
        s.set(w('val'), '24')
        s2 = etree.SubElement(rp, w('szCs'))
        s2.set(w('val'), '24')
        order_rpr(rp)
        return r

    r1 = run(None)
    fc = etree.SubElement(r1, w('fldChar'))
    fc.set(w('fldCharType'), 'begin')

    r2 = run(None)
    it = etree.SubElement(r2, w('instrText'))
    it.set(XS, 'preserve')
    it.text = ' TOC \\o "1-8" \\h \\z \\u '

    r3 = run(None)
    f3 = etree.SubElement(r3, w('fldChar'))
    f3.set(w('fldCharType'), 'separate')

    r4 = run(None)
    t4 = etree.SubElement(r4, w('t'))
    t4.set(XS, 'preserve')
    t4.text = ('Klik kanan di sini > Update Field > Update entire table '
               'untuk memuat Daftar Isi.')

    r5 = run(None)
    f5 = etree.SubElement(r5, w('fldChar'))
    f5.set(w('fldCharType'), 'end')
    return p


def manual_entry(text, page):
    p = etree.Element(w('p'))
    pp = etree.SubElement(p, w('pPr'))
    tabs = etree.SubElement(pp, w('tabs'))
    tb = etree.SubElement(tabs, w('tab'))
    tb.set(w('val'), 'right')
    tb.set(w('leader'), 'dot')
    tb.set(w('pos'), '9000')
    order_ppr(pp)
    for txt, is_tab in ((text, False), (None, True), (page, False)):
        r = etree.SubElement(p, w('r'))
        rp = etree.SubElement(r, w('rPr'))
        f = etree.SubElement(rp, w('rFonts'))
        for a in ('ascii', 'hAnsi', 'cs'):
            f.set(w(a), 'Times New Roman')
        s = etree.SubElement(rp, w('sz'))
        s.set(w('val'), '20')
        s2 = etree.SubElement(rp, w('szCs'))
        s2.set(w('val'), '20')
        order_rpr(rp)
        if is_tab:
            etree.SubElement(r, w('tab'))
        else:
            t = etree.SubElement(r, w('t'))
            t.set(XS, 'preserve')
            t.text = txt
    return p


def rebuild_toc(doc_path):
    tree, root = load(doc_path)
    body = root.find(w('body'))

    # kumpulkan paragraf TOC lama BY REFERENCE (bukan index!)
    old = []
    for el in list(body):
        if etree.QName(el).localname != 'p':
            continue
        x = etree.tostring(el, encoding='unicode')
        txt = ''.join(el.itertext())
        if ('_Toc' in x and 'HYPERLINK' in txt) or ('TOC \\' in txt) \
           or txt.strip().upper() == 'DAFTAR ISI':
            old.append(el)
    if not old:
        print('TOC lama tidak ditemukan — dilewati')
        return

    anchor = old[-1]
    for b in [make_para('DAFTAR ISI', bold=True, size=24, align='center',
                        pagebreak=True, after=200),
              manual_entry('DOKUMEN KONTROL', 'III'),
              manual_entry('DAFTAR ISI', 'IV'),
              toc_field()]:
        anchor.addprevious(b)
    for el in old:
        if el.getparent() is not None:
            body.remove(el)

    # pastikan isi setelah TOC mulai di halaman baru
    nxt = anchor.getnext()
    if nxt is not None and etree.QName(nxt).localname == 'p':
        pp = nxt.find(w('pPr'))
        if pp is None:
            pp = etree.Element(w('pPr'))
            nxt.insert(0, pp)
        if pp.find(w('pageBreakBefore')) is None:
            etree.SubElement(pp, w('pageBreakBefore'))
            order_ppr(pp)

    save(tree, doc_path)
    print(f'DAFTAR ISI dibangun ulang ({len(old)} paragraf lama dihapus)')


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('path', nargs='?', default='/tmp/unpacked/word/document.xml')
    ap.add_argument('--styles-path', default=None)
    ap.add_argument('--map', default=None, help='mis. 21=0,22=1,23=2,24=3')
    a = ap.parse_args()

    styles = a.styles_path or a.path.replace('document.xml', 'styles.xml')

    if a.map:
        mapping = {k: int(v) for k, v in
                   (kv.split('=') for kv in a.map.split(','))}
    else:
        _, root = load(a.path)
        mapping = detect_mapping(root.find(w('body')))
    print('mapping style -> outlineLvl:', mapping)
    if not mapping:
        print('PERINGATAN: tidak ada style heading terdeteksi. '
              'Pakai --map untuk set manual.')
        sys.exit(1)

    print('style diberi outlineLvl:', set_outline(styles, mapping))
    rebuild_toc(a.path)
