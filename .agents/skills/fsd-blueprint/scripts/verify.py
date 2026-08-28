#!/usr/bin/env python3
"""
Verifikasi hasil SEBELUM diserahkan ke user.

Cek:
  1. Validasi schema OOXML (pakai validator bawaan skill docx kalau ada)
  2. Jumlah paragraf & baris tabel dibanding sumber  <-- penangkap data loss
  3. Distribusi ukuran font & jumlah italic/bold/justify
  4. Ekstraksi teks per halaman (kalau bisa render PDF)

Kalau paragraf turun drastis, itu tanda BUG (biasanya regex over-match atau
penghapusan pakai index basi). JANGAN serahkan hasilnya.

Pakai:
    python3 verify.py hasil.docx [--original sumber.docx] [--pages 1-5]
"""
import argparse
import collections
import os
import subprocess
import sys
import tempfile
import zipfile
from lxml import etree
from docx_common import w, content_table

LOSS_THRESHOLD = 0.85   # paragraf hasil < 85% sumber = mencurigakan


def read_doc_xml(docx):
    with zipfile.ZipFile(docx) as z:
        return etree.fromstring(z.read('word/document.xml'),
                                etree.XMLParser(huge_tree=True))


def stats(root):
    body = root.find(w('body'))
    ct = content_table(body)
    s = {
        'paragraphs': len(list(body.iter(w('p')))),
        'tables': len(body.findall(w('tbl'))),
        'content_rows': len(ct.findall(w('tr'))) if ct is not None else 0,
        'runs': len(list(body.iter(w('r')))),
        'drawings': len(list(body.iter(w('drawing')))),
    }
    sizes = collections.Counter()
    fonts = collections.Counter()
    italic = bold = justify = 0
    scope = ct if ct is not None else body
    for r in scope.iter(w('r')):
        rp = r.find(w('rPr'))
        if rp is None:
            continue
        sz = rp.find(w('sz'))
        sizes[sz.get(w('val')) if sz is not None else None] += 1
        rf = rp.find(w('rFonts'))
        fonts[rf.get(w('ascii')) if rf is not None else None] += 1
        txt = ''.join(t.text or '' for t in r.iter(w('t'))).strip()
        if rp.find(w('i')) is not None and 'tempel screenshot' not in txt:
            italic += 1
        if rp.find(w('b')) is not None:
            bold += 1
    for p in scope.iter(w('p')):
        pp = p.find(w('pPr'))
        if pp is None:
            continue
        j = pp.find(w('jc'))
        if j is not None and j.get(w('val')) == 'both':
            justify += 1
    s.update(sizes=dict(sizes), fonts=dict(fonts),
             italic=italic, bold=bold, justify=justify)
    return s


def validate_schema(docx, original=None):
    val = '/mnt/skills/public/docx/scripts/office/validate.py'
    if not os.path.exists(val):
        print('  (validator schema tidak tersedia, dilewati)')
        return True
    cmd = [sys.executable, val, docx]
    if original:
        cmd += ['--original', original]
    r = subprocess.run(cmd, capture_output=True, text=True)
    out = (r.stdout or '') + (r.stderr or '')
    ok = 'All validations PASSED' in out
    print('  ' + out.strip().splitlines()[-1] if out.strip() else '  (no output)')
    return ok


def page_text(docx, pages):
    soffice = '/mnt/skills/public/docx/scripts/office/soffice.py'
    if not os.path.exists(soffice):
        return None
    with tempfile.TemporaryDirectory() as td:
        r = subprocess.run([sys.executable, soffice, '--headless',
                            '--convert-to', 'pdf', '--outdir', td, docx],
                           capture_output=True, text=True)
        pdf = os.path.join(td, os.path.splitext(os.path.basename(docx))[0] + '.pdf')
        if not os.path.exists(pdf):
            return None
        n = subprocess.run(['pdfinfo', pdf], capture_output=True, text=True).stdout
        total = [l for l in n.splitlines() if l.startswith('Pages')]
        out = {'total_pages': total[0].split()[-1] if total else '?'}
        if pages:
            a, b = (pages.split('-') + [pages])[:2]
            for i in range(int(a), int(b) + 1):
                t = subprocess.run(['pdftotext', '-f', str(i), '-l', str(i),
                                    '-layout', pdf, '-'],
                                   capture_output=True, text=True).stdout
                out[f'page{i}'] = [l for l in t.splitlines() if l.strip()][:12]
        return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('docx')
    ap.add_argument('--original', default=None)
    ap.add_argument('--pages', default='1-4')
    a = ap.parse_args()

    print('=== 1. VALIDASI SCHEMA ===')
    ok = validate_schema(a.docx, a.original)

    print('\n=== 2. STRUKTUR ===')
    cur = stats(read_doc_xml(a.docx))
    for k in ('paragraphs', 'tables', 'content_rows', 'runs', 'drawings'):
        print(f'  {k}: {cur[k]}')

    fail = not ok
    if a.original:
        old = stats(read_doc_xml(a.original))
        print(f'  sumber paragraphs: {old["paragraphs"]} | '
              f'content_rows: {old["content_rows"]}')
        ratio = cur['paragraphs'] / max(old['paragraphs'], 1)
        print(f'  rasio paragraf: {ratio:.2%}')
        if ratio < LOSS_THRESHOLD:
            print('  !! DATA LOSS TERDETEKSI — JANGAN SERAHKAN KE USER !!')
            fail = True
        if cur['content_rows'] < old['content_rows']:
            print(f'  !! baris tabel konten berkurang '
                  f'({old["content_rows"]} -> {cur["content_rows"]}) !!')
            fail = True

    print('\n=== 3. FORMAT ===')
    print(f'  ukuran (half-pt): {cur["sizes"]}')
    print(f'  font: {cur["fonts"]}')
    print(f'  italic: {cur["italic"]} | bold: {cur["bold"]} | '
          f'justify: {cur["justify"]}')

    print('\n=== 4. HALAMAN ===')
    pt = page_text(a.docx, a.pages)
    if pt:
        print(f'  total halaman: {pt["total_pages"]}')
        for k, v in pt.items():
            if k.startswith('page'):
                print(f'  --- {k} ---')
                for line in v:
                    print('    ' + line[:95])
    else:
        print('  (render PDF tidak tersedia)')

    print('\n=== HASIL ===')
    print('  GAGAL — perbaiki dulu' if fail else '  OK — aman diserahkan')
    sys.exit(1 if fail else 0)


if __name__ == '__main__':
    main()
