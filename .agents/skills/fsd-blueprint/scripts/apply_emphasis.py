#!/usr/bin/env python3
"""
Terapkan penekanan:
  - ITALIC : frasa Inggris utuh (whitelist). BUKAN istilah UI baku
             (edit, form, button, menu, report, user) — kalau semua
             kata Inggris dimiringkan, separuh dokumen jadi miring.
  - BOLD   : nama menu / field / tombol

Daftar istilah dibaca dari assets/istilah.md (bisa ditambah per project),
atau override lewat --italic / --bold.

PENTING: script ini juga MEMBERSIHKAN italic bawaan dokumen sumber.
Banyak FSD punya ribuan sel tabel yang sudah miring ("Wajib Isi",
"Tidak Ada", "Varchar 20") — kalau dibiarkan, aturan italic jadi tidak
berlaku. Pakai --keep-existing-italic kalau memang mau dipertahankan.

Pakai:
    python3 apply_emphasis.py document.xml [--terms ../assets/istilah.md]
"""
import argparse
import copy
import os
import re
from lxml import etree
from docx_common import w, XS, load, save, content_table

PLACEHOLDER_MARK = 'tempel screenshot'


def load_terms(path):
    italic, bold = [], []
    if not path or not os.path.exists(path):
        return italic, bold
    section = None
    for line in open(path, encoding='utf-8'):
        s = line.strip()
        if s.lower().startswith('## italic'):
            section = 'i'
            continue
        if s.lower().startswith('## bold'):
            section = 'b'
            continue
        if s.startswith('#'):
            section = None
            continue
        if s.startswith('- ') and section:
            term = s[2:].strip()
            if term:
                (italic if section == 'i' else bold).append(term)
    return italic, bold


def set_flag(rpr, tag):
    if rpr.find(w(tag)) is None:
        e = etree.Element(w(tag))
        rf = rpr.find(w('rFonts'))
        if rf is not None:
            rf.addnext(e)
        else:
            rpr.insert(0, e)


def run(path, italic_terms, bold_terms, strip_existing=True):
    tree, root = load(path)
    ct = content_table(root.find(w('body')))
    if ct is None:
        print('tabel konten tidak ditemukan')
        return

    allowed = set(t.strip() for t in italic_terms)

    # 1) bersihkan italic bawaan (kecuali placeholder & whitelist)
    removed = 0
    if strip_existing:
        for r in ct.iter(w('r')):
            rp = r.find(w('rPr'))
            if rp is None:
                continue
            i = rp.find(w('i'))
            if i is None:
                continue
            txt = ''.join(t.text or '' for t in r.iter(w('t'))).strip()
            if PLACEHOLDER_MARK in txt or txt in allowed:
                continue
            rp.remove(i)
            ics = rp.find(w('iCs'))
            if ics is not None:
                rp.remove(ics)
            removed += 1

    # 2) terapkan italic + bold, pecah run per istilah
    it = sorted(set(italic_terms), key=len, reverse=True)
    bo = sorted(set(bold_terms), key=len, reverse=True)
    pat_i = re.compile('|'.join(re.escape(t) for t in it)) if it else None
    pat_b = re.compile('|'.join(re.escape(t) for t in bo)) if bo else None

    n_i = n_b = 0
    for p in list(ct.iter(w('p'))):
        for r in list(p.findall(w('r'))):
            ts = r.findall(w('t'))
            if len(ts) != 1:
                continue
            text = ts[0].text or ''
            if not text.strip() or PLACEHOLDER_MARK in text:
                continue
            marks = []
            if pat_b:
                marks += [(m.start(), m.end(), 'b') for m in pat_b.finditer(text)]
            if pat_i:
                for m in pat_i.finditer(text):
                    if not any(s < m.end() and m.start() < e for s, e, _ in marks):
                        marks.append((m.start(), m.end(), 'i'))
            if not marks:
                continue
            marks.sort()
            segs, pos = [], 0
            for s, e, kind in marks:
                if s > pos:
                    segs.append((text[pos:s], None))
                segs.append((text[s:e], kind))
                pos = e
            if pos < len(text):
                segs.append((text[pos:], None))

            idx = list(p).index(r)
            for off, (seg, kind) in enumerate(segs):
                nr = copy.deepcopy(r)
                for t in nr.findall(w('t')):
                    nr.remove(t)
                rp = nr.find(w('rPr'))
                if rp is None:
                    rp = etree.Element(w('rPr'))
                    nr.insert(0, rp)
                # bersihkan italic warisan dari deepcopy
                for tag in ('i', 'iCs'):
                    for e2 in rp.findall(w(tag)):
                        rp.remove(e2)
                if kind == 'i':
                    set_flag(rp, 'i')
                    n_i += 1
                elif kind == 'b':
                    set_flag(rp, 'b')
                    n_b += 1
                nt = etree.SubElement(nr, w('t'))
                nt.set(XS, 'preserve')
                nt.text = seg
                p.insert(idx + off, nr)
            p.remove(r)

    save(tree, path)
    print(f'italic bawaan dihapus: {removed}')
    print(f'italic diterapkan: {n_i} | bold diterapkan: {n_b}')


if __name__ == '__main__':
    here = os.path.dirname(os.path.abspath(__file__))
    ap = argparse.ArgumentParser()
    ap.add_argument('path', nargs='?', default='/tmp/unpacked/word/document.xml')
    ap.add_argument('--terms', default=os.path.join(here, '..', 'assets', 'istilah.md'))
    ap.add_argument('--italic', default=None, help='pisah koma, override file')
    ap.add_argument('--bold', default=None, help='pisah koma, override file')
    ap.add_argument('--keep-existing-italic', action='store_true')
    a = ap.parse_args()

    it, bo = load_terms(a.terms)
    if a.italic:
        it = [x.strip() for x in a.italic.split(',') if x.strip()]
    if a.bold:
        bo = [x.strip() for x in a.bold.split(',') if x.strip()]
    print(f'istilah italic: {len(it)} | bold: {len(bo)}')
    run(a.path, it, bo, strip_existing=not a.keep_existing_italic)
