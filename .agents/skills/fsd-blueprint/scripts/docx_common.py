"""
Helper bersama untuk manipulasi docx FSD Blueprint.

ATURAN: selalu pakai lxml tree. JANGAN regex pada document.xml.
Lihat references/pitfalls.md.
"""
from lxml import etree

W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
MC = 'http://schemas.openxmlformats.org/markup-compatibility/2006'
XS = '{http://www.w3.org/XML/1998/namespace}space'


def w(tag):
    return f'{{{W}}}{tag}'


def parser():
    # huge_tree wajib: document.xml FSD bisa >2MB
    return etree.XMLParser(huge_tree=True)


def load(path):
    tree = etree.parse(path, parser())
    return tree, tree.getroot()


def save(tree, path):
    tree.write(path, xml_declaration=True, encoding='UTF-8', standalone=True)


# --- Urutan child element wajib menurut skema OOXML ---
# Salah urutan = "Element is not expected" saat validasi.
PPR_ORDER = ['pStyle', 'keepNext', 'keepLines', 'pageBreakBefore', 'framePr',
             'widowControl', 'numPr', 'suppressLineNumbers', 'pBdr', 'shd', 'tabs',
             'suppressAutoHyphens', 'kinsoku', 'wordWrap', 'overflowPunct',
             'topLinePunct', 'autoSpaceDE', 'autoSpaceDN', 'bidi', 'adjustRightInd',
             'snapToGrid', 'spacing', 'ind', 'contextualSpacing', 'mirrorIndents',
             'suppressOverlap', 'jc', 'textDirection', 'textAlignment',
             'textboxTightWrap', 'outlineLvl', 'divId', 'cnfStyle', 'rPr', 'sectPr']

RPR_ORDER = ['rStyle', 'rFonts', 'b', 'bCs', 'i', 'iCs', 'caps', 'smallCaps',
             'strike', 'dstrike', 'outline', 'shadow', 'emboss', 'imprint', 'noProof',
             'snapToGrid', 'vanish', 'webHidden', 'color', 'spacing', 'w', 'kern',
             'position', 'sz', 'szCs', 'highlight', 'u', 'effect', 'bdr', 'shd',
             'fitText', 'vertAlign', 'rtl', 'cs', 'em', 'lang', 'eastAsianLayout',
             'specVanish', 'oMath']

_PIDX = {n: i for i, n in enumerate(PPR_ORDER)}
_RIDX = {n: i for i, n in enumerate(RPR_ORDER)}


def _reorder(el, idx):
    ch = list(el)
    srt = sorted(ch, key=lambda c: idx.get(etree.QName(c).localname, 999))
    for c in ch:
        el.remove(c)
    for c in srt:
        el.append(c)


def order_ppr(ppr):
    _reorder(ppr, _PIDX)


def order_rpr(rpr):
    _reorder(rpr, _RIDX)


def get_ppr(p):
    pp = p.find(w('pPr'))
    if pp is None:
        pp = etree.Element(w('pPr'))
        p.insert(0, pp)
    return pp


def get_rpr(r):
    rp = r.find(w('rPr'))
    if rp is None:
        rp = etree.Element(w('rPr'))
        r.insert(0, rp)
    return rp


def set_font(rpr, half_points, font='Times New Roman'):
    """half_points: 24 = 12pt, 28 = 14pt, 32 = 16pt, 20 = 10pt"""
    for tag in ('rFonts', 'sz', 'szCs'):
        for e in rpr.findall(w(tag)):
            rpr.remove(e)
    f = etree.SubElement(rpr, w('rFonts'))
    for a in ('ascii', 'hAnsi', 'cs'):
        f.set(w(a), font)
    s = etree.SubElement(rpr, w('sz'))
    s.set(w('val'), str(half_points))
    s2 = etree.SubElement(rpr, w('szCs'))
    s2.set(w('val'), str(half_points))
    order_rpr(rpr)


def set_highlight(rpr, color='yellow'):
    """Tambah <w:highlight> ke rPr TANPA menghapus formatting lain (bold,
    italic, dst) yang sudah ada di rPr yang sama.

    Dipakai untuk menandai teks hasil revisi FSD. Idempotent: kalau rPr
    sudah punya <w:highlight>, nilainya diganti, bukan didobel."""
    for e in rpr.findall(w('highlight')):
        rpr.remove(e)
    h = etree.SubElement(rpr, w('highlight'))
    h.set(w('val'), color)
    order_rpr(rpr)


def clear_highlight(rpr):
    """Hapus <w:highlight> dari rPr kalau ada. Dipakai sebelum menandai
    revisi baru, supaya highlight dari revisi sebelumnya tidak menumpuk."""
    removed = False
    for e in rpr.findall(w('highlight')):
        rpr.remove(e)
        removed = True
    return removed


def highlight_row(tr, color='yellow'):
    """Highlight SEMUA run teks di dalam satu baris tabel (w:tr).
    Dipakai untuk menandai baris/bullet yang isinya berubah karena revisi."""
    n = 0
    for r in tr.iter(w('r')):
        rp = get_rpr(r)
        set_highlight(rp, color)
        order_rpr(rp)
        n += 1
    return n


def clear_highlight_row(tr):
    """Hapus highlight dari semua run di satu baris. Dipakai di awal proses
    revisi baru supaya highlight revisi sebelumnya tidak menumpuk."""
    n = 0
    for r in tr.iter(w('r')):
        rp = r.find(w('rPr'))
        if rp is not None and clear_highlight(rp):
            n += 1
    return n


def highlight_first_run(p_or_tc, color='yellow'):
    """Highlight HANYA run pertama yang ditemukan di dalam elemen (paragraf
    atau sel). Dipakai untuk judul menu baru: hanya teks judulnya yang
    ditandai, bukan seluruh isi section di bawahnya."""
    r = p_or_tc.find(f'.//{w("r")}')
    if r is None:
        return 0
    rp = get_rpr(r)
    set_highlight(rp, color)
    order_rpr(rp)
    return 1


def pstyle_of(p):
    pp = p.find(w('pPr'))
    if pp is None:
        return None
    st = pp.find(w('pStyle'))
    return st.get(w('val')) if st is not None else None


def content_table(body):
    """Tabel konten = tabel dengan baris terbanyak.
    Di FSD Blueprint, seluruh body ada di dalam satu tabel besar."""
    tbls = body.findall(w('tbl'))
    if not tbls:
        return None
    return max(tbls, key=lambda t: len(t.findall(w('tr'))))


def text_of(el):
    return ' '.join(''.join(el.itertext()).split())


def make_para(text='', bold=False, size=24, align=None, color=None,
              font='Times New Roman', pagebreak=False, before=None, after=None,
              italic=False, underline=False):
    p = etree.Element(w('p'))
    pp = etree.SubElement(p, w('pPr'))
    if pagebreak:
        etree.SubElement(pp, w('pageBreakBefore'))
    if before is not None or after is not None:
        sp = etree.SubElement(pp, w('spacing'))
        if before is not None:
            sp.set(w('before'), str(before))
        if after is not None:
            sp.set(w('after'), str(after))
    if align:
        j = etree.SubElement(pp, w('jc'))
        j.set(w('val'), align)
    order_ppr(pp)
    r = etree.SubElement(p, w('r'))
    rp = etree.SubElement(r, w('rPr'))
    f = etree.SubElement(rp, w('rFonts'))
    for a in ('ascii', 'hAnsi', 'cs'):
        f.set(w(a), font)
    if bold:
        etree.SubElement(rp, w('b'))
    if italic:
        etree.SubElement(rp, w('i'))
    if underline:
        u = etree.SubElement(rp, w('u'))
        u.set(w('val'), 'single')
    if color:
        c = etree.SubElement(rp, w('color'))
        c.set(w('val'), color)
    s = etree.SubElement(rp, w('sz'))
    s.set(w('val'), str(size))
    s2 = etree.SubElement(rp, w('szCs'))
    s2.set(w('val'), str(size))
    order_rpr(rp)
    t = etree.SubElement(r, w('t'))
    t.set(XS, 'preserve')
    t.text = text
    return p


def make_cell(width, paras, shade=None, span=None, valign='center'):
    tc = etree.Element(w('tc'))
    pr = etree.SubElement(tc, w('tcPr'))
    tw = etree.SubElement(pr, w('tcW'))
    tw.set(w('w'), str(width))
    tw.set(w('type'), 'dxa')
    if span:
        gs = etree.SubElement(pr, w('gridSpan'))
        gs.set(w('val'), str(span))
    if shade:
        sh = etree.SubElement(pr, w('shd'))
        sh.set(w('val'), 'clear')
        sh.set(w('color'), 'auto')
        sh.set(w('fill'), shade)
    va = etree.SubElement(pr, w('vAlign'))
    va.set(w('val'), valign)
    for p in (paras if isinstance(paras, list) else [paras]):
        tc.append(p)
    return tc


def make_row(cells, height=None, rule='atLeast'):
    tr = etree.Element(w('tr'))
    if height:
        trp = etree.SubElement(tr, w('trPr'))
        h = etree.SubElement(trp, w('trHeight'))
        h.set(w('val'), str(height))
        h.set(w('hRule'), rule)
    for c in cells:
        tr.append(c)
    return tr


def make_table(cols, width=None, border_color='auto', border_sz='4', align=None):
    tbl = etree.Element(w('tbl'))
    pr = etree.SubElement(tbl, w('tblPr'))
    tw = etree.SubElement(pr, w('tblW'))
    tw.set(w('w'), str(width or sum(cols)))
    tw.set(w('type'), 'dxa')
    if align:
        j = etree.SubElement(pr, w('jc'))
        j.set(w('val'), align)
    b = etree.SubElement(pr, w('tblBorders'))
    for e in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
        x = etree.SubElement(b, w(e))
        x.set(w('val'), 'single')
        x.set(w('color'), border_color)
        x.set(w('sz'), border_sz)
        x.set(w('space'), '0')
    lay = etree.SubElement(pr, w('tblLayout'))
    lay.set(w('type'), 'fixed')
    g = etree.SubElement(tbl, w('tblGrid'))
    for c in cols:
        gc = etree.SubElement(g, w('gridCol'))
        gc.set(w('w'), str(c))
    return tbl
