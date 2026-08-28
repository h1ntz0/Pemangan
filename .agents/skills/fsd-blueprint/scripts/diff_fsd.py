#!/usr/bin/env python3
"""
Bandingkan FSD v1 vs v2, laporkan bagian mana yang berubah.

Dipakai untuk MODE C (revisi konten): hasil diff jadi dasar patch ke Blueprint
yang sudah jadi. JANGAN rebuild Blueprint dari nol — screenshot user ada di sana.

Pemetaan section memakai judul bernomor (2.3.1.1 dst) sebagai kunci, sehingga
tahan terhadap pergeseran halaman.

Pakai:
    python3 diff_fsd.py lama.docx baru.docx
    python3 diff_fsd.py lama.docx baru.docx --json rencana.json
"""
import argparse
import difflib
import json
import re
import sys
import zipfile
from lxml import etree

W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'


def w(t):
    return f'{{{W}}}{t}'


def read_root(docx):
    with zipfile.ZipFile(docx) as z:
        return etree.fromstring(z.read('word/document.xml'),
                                etree.XMLParser(huge_tree=True))


def norm(s):
    return ' '.join((s or '').split())


HEAD_RE = re.compile(r'^(\d+(?:\.\d+)*)\s+(\S.*)$')


def norm_key(title):
    """Normalisasi nama menu jadi kunci yang stabil.

    Nama menu adalah IDENTITAS section; nomor (2.3.1.4) cuma POSISI dan
    bisa bergeser kalau ada menu disisipkan di tengah. Karena itu kunci
    diambil dari nama, bukan nomor.

    Normalisasi: huruf kecil, buang tanda baca/pemisah, rapatkan spasi.
    Jadi "Master - Master workstation" == "master master workstation".
    """
    s = (title or '').lower()
    s = re.sub(r'[-–—_:.,()\[\]/]+', ' ', s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s


def extract_sections(root):
    """Kembalikan dict: nama_menu_ternormalisasi -> {...}.

    Blueprint menaruh seluruh isi dalam satu tabel besar. Judul section ada di
    SEL PERTAMA baris, isinya di sel berikutnya — jadi judul diambil dari sel
    pertama saja, bukan seluruh teks baris (kalau tidak, isi ikut terbawa ke
    judul: "1.2 Scope1. Master asset2. Feedbeck User...").

    KUNCI = nama menu (bukan nomor), supaya tahan terhadap penyisipan menu
    baru yang menggeser penomoran.
    """
    body = root.find(w('body'))
    tbls = body.findall(w('tbl'))
    if not tbls:
        return {}
    ct = max(tbls, key=lambda t: len(t.findall(w('tr'))))

    sections, current = {}, None
    order = 0
    for tr in ct.findall(w('tr')):
        cells = tr.findall(w('tc'))
        first = norm(''.join(cells[0].itertext())) if cells else ''
        rest = norm(' '.join(''.join(c.itertext()) for c in cells[1:])) if len(cells) > 1 else ''
        whole = norm(''.join(tr.itertext()))
        if not whole:
            continue

        m = HEAD_RE.match(first[:120])
        if m and len(first) < 120:
            number, title = m.group(1), norm(m.group(2))[:80]
            key = norm_key(title)
            if not key:                      # judul kosong -> fallback ke nomor
                key = f'#{number}'
            # nama menu duplikat (mis. "Report" muncul di 2 modul):
            # bedakan dengan menyertakan nomor induknya
            if key in sections:
                parent = number.rsplit('.', 1)[0] if '.' in number else number
                key = f'{key} @{parent}'
            order += 1
            current = key
            sections[key] = {'number': number, 'title': title,
                             'order': order, 'body': [rest] if rest else []}
        elif current:
            sections[current]['body'].append(whole)
        else:
            sections.setdefault('_pre', {'number': '', 'title': '(sebelum section)',
                                         'order': 0, 'body': []})['body'].append(whole)
    for k in sections:
        sections[k]['body'] = '\n'.join(x for x in sections[k]['body'] if x)
    return sections


def similarity(a, b):
    return difflib.SequenceMatcher(None, a, b).ratio()


def compare(old, new):
    o, n = extract_sections(old), extract_sections(new)
    ok, nk = set(o), set(n)

    plan = {'added': [], 'removed': [], 'changed': [],
            'renumbered': [], 'unchanged': []}

    for k in sorted(nk - ok, key=lambda x: n[x]['order']):
        plan['added'].append({'menu': n[k]['title'], 'number': n[k]['number']})
    for k in sorted(ok - nk, key=lambda x: o[x]['order']):
        plan['removed'].append({'menu': o[k]['title'], 'number': o[k]['number']})

    for k in sorted(ok & nk, key=lambda x: n[x]['order']):
        ob, nb = o[k]['body'], n[k]['body']
        onum, nnum = o[k]['number'], n[k]['number']
        renum = onum != nnum

        if ob == nb:
            # isi sama; kalau nomor bergeser cuma penomoran, bukan revisi konten
            if renum:
                plan['renumbered'].append({'menu': n[k]['title'],
                                           'from': onum, 'to': nnum})
            else:
                plan['unchanged'].append(n[k]['title'])
            continue

        diff = list(difflib.unified_diff(
            ob.splitlines(), nb.splitlines(),
            fromfile=f'v1 {onum}', tofile=f'v2 {nnum}', lineterm='', n=1))
        plan['changed'].append({
            'menu': n[k]['title'],
            'number_old': onum,
            'number_new': nnum,
            'renumbered': renum,
            'similarity': round(similarity(ob, nb), 3),
            'diff': diff[:60],
        })
    return plan


def report(plan):
    print('=== RINGKASAN PERUBAHAN (kunci: NAMA MENU) ===')
    print(f'  menu baru      : {len(plan["added"])}')
    print(f'  menu hilang    : {len(plan["removed"])}')
    print(f'  isi berubah    : {len(plan["changed"])}')
    print(f'  hanya bergeser : {len(plan["renumbered"])}')
    print(f'  tetap          : {len(plan["unchanged"])}')

    if plan['added']:
        print('\n--- MENU BARU (tambahkan ke Blueprint) ---')
        for a in plan['added']:
            print(f'  + [{a["number"]}] {a["menu"]}')

    if plan['removed']:
        print('\n--- MENU HILANG (KONFIRMASI dulu, jangan hapus otomatis) ---')
        for r in plan['removed']:
            print(f'  - [{r["number"]}] {r["menu"]}')

    if plan['changed']:
        print('\n--- ISI BERUBAH (patch hanya menu ini) ---')
        for c in plan['changed']:
            move = (f'  [nomor {c["number_old"]} -> {c["number_new"]}]'
                    if c['renumbered'] else '')
            print(f'  ~ [{c["number_new"]}] {c["menu"]} '
                  f'(mirip {c["similarity"]:.0%}){move}')

    if plan['renumbered']:
        print('\n--- HANYA BERGESER NOMOR (isi sama, TIDAK perlu di-patch) ---')
        for r in plan['renumbered']:
            print(f'  = {r["menu"]}: {r["from"]} -> {r["to"]}')

    if not (plan['added'] or plan['removed'] or plan['changed']):
        print('\nTidak ada perubahan konten terdeteksi.')

    print('\n=== LANGKAH BERIKUTNYA ===')
    print('  1. Tampilkan ringkasan ini ke user, MINTA KONFIRMASI dulu.')
    print('  2. Patch HANYA menu yang isinya berubah / menu baru.')
    print('  3. JANGAN rebuild dari nol — screenshot user ada di dokumen itu.')
    print('  4. Menu "tetap" dan "hanya bergeser nomor" jangan disentuh isinya.')
    print('  5. patch_section.py boleh pakai --menu (nama) atau --section (nomor).')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('old')
    ap.add_argument('new')
    ap.add_argument('--json', default=None, help='simpan rencana ke file JSON')
    ap.add_argument('--show-diff', action='store_true',
                    help='tampilkan detail diff tiap section')
    a = ap.parse_args()

    plan = compare(read_root(a.old), read_root(a.new))
    report(plan)

    if a.show_diff:
        print('\n=== DETAIL DIFF ===')
        if not plan['changed']:
            print('  (tidak ada section yang berubah)')
        for c in plan['changed']:
            print(f"\n--- [{c['number_new']}] {c['menu']} ---")
            if not c['diff']:
                print('  (perubahan hanya pada judul)')
            for line in c['diff']:
                print('  ' + line[:110])

    if a.json:
        with open(a.json, 'w', encoding='utf-8') as f:
            json.dump(plan, f, ensure_ascii=False, indent=2)
        print(f'\nrencana disimpan: {a.json}')

    return 0


if __name__ == '__main__':
    sys.exit(main())
