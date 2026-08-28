#!/usr/bin/env python3
"""
Ganti semua gambar di document.xml jadi placeholder teks.

WAJIB pakai lxml tree — jangan regex. Regex <w:drawing>.*?</w:drawing> dengan
DOTALL akan over-match dan menghapus ratusan baris tabel.

Pakai:
    python3 replace_images.py /tmp/unpacked/word/document.xml
"""
import sys
from lxml import etree
from docx_common import w, MC, XS, load, save, order_rpr

PLACEHOLDER = '[ Gambar \u2013 tempel screenshot di sini ]'


def make_placeholder_run():
    r = etree.Element(w('r'))
    rp = etree.SubElement(r, w('rPr'))
    f = etree.SubElement(rp, w('rFonts'))
    for a in ('ascii', 'hAnsi', 'cs'):
        f.set(w(a), 'Calibri')
    etree.SubElement(rp, w('i'))
    c = etree.SubElement(rp, w('color'))
    c.set(w('val'), '808080')
    s = etree.SubElement(rp, w('sz'))
    s.set(w('val'), '18')
    s2 = etree.SubElement(rp, w('szCs'))
    s2.set(w('val'), '18')
    order_rpr(rp)
    t = etree.SubElement(r, w('t'))
    t.set(XS, 'preserve')
    t.text = PLACEHOLDER
    return r


def run(path):
    tree, root = load(path)
    n_alt = n_run = n_stray = 0

    # 1) mc:AlternateContent yang membungkus drawing (punya fallback)
    #    Harus diganti UTUH, bukan cuma drawing di dalamnya — kalau tidak,
    #    run akan tersisa langsung di bawah <mc:Choice> = XML invalid.
    for alt in list(root.iter(f'{{{MC}}}AlternateContent')):
        if alt.find(f'.//{w("drawing")}') is None:
            continue
        parent = alt.getparent()
        ph = make_placeholder_run()
        if etree.QName(parent).localname == 'r' and parent.getparent() is not None:
            parent.getparent().replace(parent, ph)
        else:
            parent.replace(alt, ph)
        n_alt += 1

    # 2) run yang membungkus drawing -> ganti seluruh run
    for r in list(root.iter(w('r'))):
        if r.find(w('drawing')) is not None and r.getparent() is not None:
            r.getparent().replace(r, make_placeholder_run())
            n_run += 1

    # 3) sisa drawing yang tercecer -> naik ke ancestor run
    for d in list(root.iter(w('drawing'))):
        anc = d.getparent()
        while anc is not None and etree.QName(anc).localname != 'r':
            anc = anc.getparent()
        if anc is not None and anc.getparent() is not None:
            anc.getparent().replace(anc, make_placeholder_run())
            n_stray += 1

    # 4) legacy <w:pict>
    for pic in list(root.iter(w('pict'))):
        anc = pic.getparent()
        while anc is not None and etree.QName(anc).localname != 'r':
            anc = anc.getparent()
        if anc is not None and anc.getparent() is not None:
            anc.getparent().replace(anc, make_placeholder_run())
            n_stray += 1

    save(tree, path)

    left = len(list(root.iter(w('drawing'))))
    print(f'AlternateContent: {n_alt} | run-wrapped: {n_run} | stray: {n_stray}')
    print(f'sisa drawing: {left}')

    # sanity: tidak boleh ada run yang parent-nya bukan paragraph-like
    allowed = {'p', 'hyperlink', 'ins', 'del', 'smartTag', 'fldSimple', 'sdtContent'}
    bad = [r for r in root.iter(w('r'))
           if r.getparent() is not None
           and etree.QName(r.getparent()).localname not in allowed]
    if bad:
        print(f'PERINGATAN: {len(bad)} run dengan parent tidak valid')
        sys.exit(1)
    print('OK')


if __name__ == '__main__':
    run(sys.argv[1] if len(sys.argv) > 1 else '/tmp/unpacked/word/document.xml')
