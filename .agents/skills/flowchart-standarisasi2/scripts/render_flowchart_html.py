#!/usr/bin/env python3
"""
render_flowchart_html.py
-------------------------
Turns a flowchart JSON (the SAME anti-summarization JSON produced by the
flowchart-standarisasi2 skill's Mode A, with a couple of optional extra
fields — see below) into a single, self-contained, downloadable HTML file:
swimlane diagram + icons + legend + step table + decision table + notes,
with per-section "download as PNG" buttons baked into the page.

This script is the reference implementation of every layout / anti-overlap /
download rule documented in SKILL.md. Re-run it any time instead of
hand-rolling the HTML again — behavior stays consistent across sessions and
devices.

INPUT JSON SCHEMA (superset of the Mode A JSON — every Mode A field is
still valid and required; two fields below are OPTIONAL additions used only
by this renderer):

{
  "title": "...", "subtitle": "...",
  "lanes": ["Lane 0 name", "Lane 1 name", ...],
  "steps": [
    {
      "id": "s1", "no": 1, "type": "process", "label": "...",
      "lane": 0, "row": 3,
      "offset": 0,                  # OPTIONAL, default 0. Sub-column inside
                                     # the lane for side-by-side branches:
                                     # 0 = main column, negative = left,
                                     # positive = right. Use small integers
                                     # (-1, 0, 1, ...) — the renderer spaces
                                     # them out automatically.
      "desc": "...", "pic": "...", "output": "...",
      "next": [{"to": "s2"}],
      "yaTo": null, "tidakTo": null,
      "branches": null              # OPTIONAL. Only meaningful on a
                                     # "decision" step with MORE than two
                                     # outcomes, or outcomes not named
                                     # Ya/Tidak. List of:
                                     #   {"label": "Survey", "to": "s12",
                                     #    "kind": "normal"}
                                     # kind in {normal, ya, tidak} controls
                                     # arrow/label color (gray/green/red).
                                     # If omitted, the renderer falls back
                                     # to yaTo/tidakTo with labels "Ya" /
                                     # "Tidak".
    }
  ],
  "footerNotes": [
    "Genuine business/process rules visible in the flowchart — deadlines,
     conditional branches, distribution rules, etc. NEVER meta-commentary
     about how the JSON/HTML was built (see SKILL.md, section
     'Aturan isi Catatan')."
  ]
}

USAGE:
    python3 render_flowchart_html.py --data flow.json --out out.html \
        [--icons-dir ../assets/icons] [--lane-w 760] [--offset-w 258] \
        [--row-h 168]

If --icons-dir is omitted, the script looks for ./assets/icons next to this
file's parent skill folder, and auto-generates it via generate_icons.py if
missing (fully self-contained — no external assets required).
"""
import argparse, base64, html as htmlmod, json, os, subprocess, sys

# ---------------- CLI ----------------
def parse_args():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", required=True, help="Path to flowchart JSON")
    ap.add_argument("--out", required=True, help="Output HTML path")
    ap.add_argument("--icons-dir", default=None)
    ap.add_argument("--lane-w", type=int, default=760)
    ap.add_argument("--offset-w", type=int, default=258)
    ap.add_argument("--row-h", type=int, default=168)
    ap.add_argument("--title", default=None, help="Override JSON title")
    ap.add_argument("--subtitle", default=None, help="Override JSON subtitle")
    return ap.parse_args()

def esc(s): return htmlmod.escape(str(s))

def wrap(text, max_chars):
    words = str(text).split()
    lines, cur = [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if len(t) > max_chars and cur:
            lines.append(cur); cur = w
        else:
            cur = t
    if cur: lines.append(cur)
    return lines

def svg_text(x, y, text, size=12, weight=600, color="#152A54", anchor="middle", max_chars=20, lh=1.25, style=""):
    lines = wrap(text, max_chars)
    start_y = y - ((len(lines) - 1) * size * lh) / 2
    out = (f'<text x="{x}" y="{start_y:.1f}" text-anchor="{anchor}" font-size="{size}" '
           f'font-weight="{weight}" fill="{color}" font-family="Arial, sans-serif" {style}>')
    for i, l in enumerate(lines):
        dy = 0 if i == 0 else size * lh
        out += f'<tspan x="{x}" dy="{dy:.1f}">{esc(l)}</tspan>'
    out += "</text>"
    return out

def autofit_size(text, avail_h, base_size, min_size, base_max_chars, lh=1.22, shrink_step=0.4):
    """Pick (max_chars, font_size) for a shape label so the wrapped text
    block fits inside avail_h, shrinking from base_size down to min_size
    instead of overflowing the shape.

    Confirmed real bug this fixes: unlike deadend_note (a short annotation
    outside the shape), a source flowchart step LABEL can legitimately be
    long — e.g. "Masuk ke database IMEI, device yang sudah didaftarkan
    dapat dipergunakan sesuai kebutuhan" (Comsec Master-IMEI flowchart).
    The anti-summarization rule forbids shortening it, and every shape here
    used a FIXED font size + FIXED box size (DIM dict) with no relationship
    between text length and box height — so a label like that wrapped into
    8+ lines at a fixed 10px and spilled text past both the ellipse cap and
    the bottom edge of the shape, well outside its border. Shrinking the
    font (down to min_size) instead of shortening the text is the only way
    to honor JANGAN MERINGKAS while still keeping label text inside its
    own shape. Chars-per-line is scaled up as size shrinks (smaller font =
    more characters fit per line at the same pixel width), matching how
    every other wrap() call in this file already estimates width by
    character count rather than measuring pixels.

    If even min_size does not make it fit (extremely long label on a small
    shape), this still returns min_size — see "Aturan Layout — Auto-fit
    Label Shape" in SKILL.md for what to do next (widen the shape's DIM
    rather than shrinking below a legible floor).
    """
    size = base_size
    while True:
        chars = max(6, round(base_max_chars * (base_size / size)))
        lines = wrap(text, chars)
        block_h = len(lines) * size * lh
        if block_h <= avail_h or size <= min_size:
            return chars, max(size, min_size)
        size = max(min_size, size - shrink_step)

ROLE_KEYWORDS = [
    (("inisiator", "initiator", "requester", "pemohon"), "icon_role_initiator"),
    (("atasan", "approver", "supervisor", "manager", "manajer"), "icon_role_approver"),
    (("reviewer", "review", "qa", "quality"), "icon_role_reviewer"),
    (("hr", "team", "tim", "admin", "ops", "operasional"), "icon_role_team"),
]
def role_icon_for_lane(lane_name):
    n = lane_name.lower()
    for keywords, icon in ROLE_KEYWORDS:
        if any(k in n for k in keywords):
            return icon
    return "icon_role_person"

def ensure_icons(icons_dir, script_dir):
    if icons_dir is None:
        icons_dir = os.path.normpath(os.path.join(script_dir, "..", "assets", "icons"))
    needed = ["icon_role_initiator", "icon_role_approver", "icon_role_reviewer",
              "icon_role_team", "icon_role_person", "icon_shape_startend",
              "icon_shape_process", "icon_shape_decision", "icon_shape_data", "icon_header"]
    missing = [n for n in needed if not os.path.exists(os.path.join(icons_dir, n + ".b64"))]
    if missing:
        gen = os.path.join(script_dir, "generate_icons.py")
        subprocess.run([sys.executable, gen, "--outdir", icons_dir], check=True)
    b64 = {}
    for n in needed:
        with open(os.path.join(icons_dir, n + ".b64")) as f:
            b64[n] = f.read().strip()
    return b64

# ---------------- geometry / shapes ----------------
DIM = {"process": (98, 46), "input": (98, 46), "start": (72, 30),
       "end": (72, 30), "decision": (88, 54), "database": (62, 50)}

EDGE_COLOR = {"normal": "#5b6577", "ya": "#3f8f3f", "tidak": "#c0392b"}

def build(args):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data = json.load(open(args.data))
    LANES = data["lanes"]
    steps = {s["id"]: dict(s) for s in data["steps"]}
    for s in steps.values():
        s.setdefault("offset", 0)
        s.setdefault("type", "process")
        s["hw"], s["hh"] = DIM.get(s["type"], (98, 46))

    ICONS = ensure_icons(args.icons_dir, script_dir)
    LANE_ICON = [role_icon_for_lane(n) for n in LANES]

    LANE_W, OFFSET_W, ROW_H = args.lane_w, args.offset_w, args.row_h
    MARGIN, HEADER_H, SWIM_H, TOP_PAD = 34, 118, 76, 36

    # --- Safety clamp (Fix #1): guarantee OFFSET_W/LANE_W can never be
    # smaller than what the actual shapes in THIS flowchart need, no matter
    # what the caller passes via --offset-w/--lane-w. Without this, a
    # decision (hw=88) sitting next to a process box (hw=98) at adjacent
    # offset columns can overlap if someone requests a compact layout —
    # this happened once and must never happen again for any flowchart. ---
    max_hw = max((s["hw"] for s in steps.values()), default=98)
    max_offset_used = max((abs(s["offset"]) for s in steps.values()), default=0)
    MIN_OFFSET_W = int(max_hw * 2 + 40)          # two half-widths + clear margin
    if OFFSET_W < MIN_OFFSET_W:
        OFFSET_W = MIN_OFFSET_W
    MIN_LANE_W = int(max_offset_used * OFFSET_W * 2 + max_hw * 2 + 60)
    if LANE_W < MIN_LANE_W:
        LANE_W = MIN_LANE_W

    def center(nd):
        cx = MARGIN + nd["lane"] * LANE_W + LANE_W / 2 + nd["offset"] * OFFSET_W
        cy = MARGIN + HEADER_H + SWIM_H + TOP_PAD + nd["row"] * ROW_H + ROW_H / 2
        return cx, cy

    for nd in steps.values():
        nd["cx"], nd["cy"] = center(nd)

    # per-row tallest half-height, used by the same-row "dip" routing below
    row_max_hh = {}
    for nd in steps.values():
        row_max_hh[nd["row"]] = max(row_max_hh.get(nd["row"], 0), nd["hh"])

    max_row = max(s["row"] for s in steps.values())
    n_lanes = len(LANES)
    diagram_w = n_lanes * LANE_W
    total_w = diagram_w + MARGIN * 2
    diagram_top = MARGIN + HEADER_H + SWIM_H
    diagram_h = TOP_PAD + (max_row + 1) * ROW_H + 40

    def shape_process(nd):
        cx, cy, hw, hh = nd["cx"], nd["cy"], nd["hw"], nd["hh"]
        x, y, w, h = cx - hw, cy - hh, hw * 2, hh * 2
        dead = nd.get("deadend", False)
        fill = "#FBEAEA" if dead else "#EAF3FC"
        stroke = "#C94F4F" if dead else "#2E6BB0"
        if nd["type"] == "input":
            # rectangle with a small cut top-left corner, distinguishes
            # "input/form" steps from plain "process" steps per Mode A schema
            cut = 12
            pts = f"{x+cut},{y} {x+w},{y} {x+w},{y+h} {x},{y+h} {x},{y+cut}"
            out = f'<polygon points="{pts}" fill="{fill}" stroke="{stroke}" stroke-width="2"/>'
        else:
            out = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="{fill}" stroke="{stroke}" stroke-width="2"/>'
        if nd.get("no"):
            out += f'<circle cx="{x+18}" cy="{y+18}" r="14" fill="{stroke}"/>'
            out += svg_text(x + 18, y + 22.5, str(nd["no"]), size=12, weight=800, color="#fff", max_chars=4)
        label_cy = cy + (10 if nd.get("no") else 0)
        avail_h = hh * 2 - (30 if nd.get("no") else 16)
        chars, fsize = autofit_size(nd["label"], avail_h, base_size=10.6, min_size=7.5, base_max_chars=24, lh=1.22)
        out += svg_text(cx, label_cy, nd["label"], size=fsize, weight=600, color="#152A54", max_chars=chars, lh=1.22)
        return out

    def shape_start_end(nd):
        cx, cy, hw, hh = nd["cx"], nd["cy"], nd["hw"], nd["hh"]
        fill = "#8BC34A" if nd["type"] == "start" else "#D9534F"
        out = f'<ellipse cx="{cx}" cy="{cy}" rx="{hw}" ry="{hh}" fill="{fill}" stroke="#33551f" stroke-width="1.5"/>'
        out += svg_text(cx, cy + 1, nd["label"], size=12, weight=700, color="#fff", max_chars=12)
        return out

    def shape_decision(nd):
        cx, cy, hw, hh = nd["cx"], nd["cy"], nd["hw"], nd["hh"]
        pts = f"{cx},{cy-hh} {cx+hw},{cy} {cx},{cy+hh} {cx-hw},{cy}"
        out = f'<polygon points="{pts}" fill="#FCE4C0" stroke="#C97A12" stroke-width="2"/>'
        # A diamond's usable text width tapers toward the top/bottom points,
        # so budget less vertical room than the full hh (else long labels
        # would wrap "wide" lines that actually poke past the diamond's
        # slanted edges near the first/last line).
        avail_h = hh * 0.8
        chars, fsize = autofit_size(nd["label"], avail_h, base_size=10.2, min_size=7.5, base_max_chars=15, lh=1.15)
        out += svg_text(cx, cy, nd["label"], size=fsize, weight=700, color="#7a4b06", max_chars=chars, lh=1.15)
        return out

    def shape_database(nd):
        # Classic "stored data" cylinder ("tabung") symbol — top ellipse cap,
        # straight vertical sides, curved bottom. Purple fill/stroke to match
        # the legend. Replaces the earlier hexagon: a cylinder is the
        # conventional flowchart symbol for database/storage and matches
        # what most source flowcharts (incl. the ones this skill has
        # processed) actually draw for "Masuk ke dalam database" shapes.
        cx, cy, hw, hh = nd["cx"], nd["cy"], nd["hw"], nd["hh"]
        fill, stroke = "#D9CCF0", "#5F4390"
        ell_h = hh * 0.26
        top_y, bot_y = cy - hh + ell_h, cy + hh - ell_h
        body = (f'<path d="M {cx-hw} {top_y} L {cx-hw} {bot_y} '
                f'A {hw} {ell_h} 0 0 0 {cx+hw} {bot_y} L {cx+hw} {top_y} '
                f'A {hw} {ell_h} 0 0 0 {cx-hw} {top_y} Z" '
                f'fill="{fill}" stroke="{stroke}" stroke-width="2"/>')
        top_cap = f'<ellipse cx="{cx}" cy="{top_y}" rx="{hw}" ry="{ell_h}" fill="{fill}" stroke="{stroke}" stroke-width="2"/>'
        out = body + top_cap
        # Usable height is the straight-sided body only, minus the cap
        # curvature already accounted for by the +3 baseline offset below.
        avail_h = (bot_y - top_y) - 6
        chars, fsize = autofit_size(nd["label"], avail_h, base_size=10, min_size=7, base_max_chars=12, lh=1.2)
        out += svg_text(cx, cy + ell_h * 0.55 + 3, nd["label"], size=fsize, weight=700, color="#3a2a5c", max_chars=chars, lh=1.2)
        return out

    def draw_node(nd):
        if nd["type"] in ("process", "input"): return shape_process(nd)
        if nd["type"] in ("start", "end"): return shape_start_end(nd)
        if nd["type"] == "decision": return shape_decision(nd)
        if nd["type"] == "database": return shape_database(nd)
        return ""

    def anchor(nd, side):
        cx, cy, hw, hh = nd["cx"], nd["cy"], nd["hw"], nd["hh"]
        return {"top": (cx, cy - hh), "bottom": (cx, cy + hh),
                "left": (cx - hw, cy), "right": (cx + hw, cy)}[side]

    def is_obstructed(a, b):
        """True if some OTHER node sits between a and b on the same row —
        i.e. a straight line from a to b would visually cut through it.
        This is what makes a long same-row edge (e.g. a decision's "Tidak"
        branch jumping back across one or more lanes) unsafe to draw as a
        single straight segment."""
        lo, hi = sorted([a["cx"], b["cx"]])
        for nd in steps.values():
            if nd is a or nd is b:
                continue
            if nd["row"] != a["row"]:
                continue
            if lo + 4 < nd["cx"] < hi - 4:
                return True
        return False

    def find_vertical_obstruction(a, b):
        """For an elbow edge (different row AND different column) — is there
        some OTHER node sitting in a row strictly between a and b, positioned
        at roughly the same x as the TARGET? If so, the final vertical
        approach into the target would cut straight through it (classic
        case: a database annotation placed directly above its sibling
        process box, at offset 0, gets run over by an unrelated cross-lane
        edge landing on that same process box from a different row)."""
        lo_row, hi_row = sorted([a["row"], b["row"]])
        hit = None
        for nd in steps.values():
            if nd is a or nd is b:
                continue
            if not (lo_row < nd["row"] < hi_row):
                continue
            if abs(nd["cx"] - b["cx"]) < (nd["hw"] + b["hw"]) * 0.6:
                if hit is None or abs(nd["row"] - b["row"]) < abs(hit["row"] - b["row"]):
                    hit = nd
        return hit

    def find_straight_obstruction(a, b):
        """For a straight-vertical edge (same column, but spanning 2+ rows)
        — is there some OTHER node sitting in a row strictly between a and
        b, at that SAME column? A straight line would run right through it.
        Unlike find_vertical_obstruction (which handles elbow edges by
        moving the jog point), a truly same-column edge needs an actual
        sideways bypass — shifting the jog point alone does nothing when
        x1 == x2."""
        lo_row, hi_row = sorted([a["row"], b["row"]])
        for nd in steps.values():
            if nd is a or nd is b:
                continue
            if lo_row < nd["row"] < hi_row and abs(nd["cx"] - a["cx"]) < (nd["hw"] + a["hw"]) * 0.6:
                return nd
        return None

    def draw_edge(a, b, label, kind):
        color = EDGE_COLOR.get(kind, "#5b6577")
        marker = f'url(#arrow-{kind if kind in EDGE_COLOR else "normal"})'
        same_row = a["row"] == b["row"]
        if same_row and not is_obstructed(a, b):
            if b["cx"] > a["cx"]:
                x1, y1 = anchor(a, "right"); x2, y2 = anchor(b, "left")
            else:
                x1, y1 = anchor(a, "left"); x2, y2 = anchor(b, "right")
            d = f"M {x1} {y1} L {x2} {y2}"
            lx, ly = (x1 + x2) / 2, y1 - 16
        elif same_row and is_obstructed(a, b):
            # DIP ROUTING (Fix #2): something else sits directly between
            # source and target on this row (classic case: a decision's
            # reject/"Tidak" branch jumping back past an intermediate box
            # in another lane). Never cut straight through it — drop below
            # the tallest shape on this row, travel horizontally under
            # everything, then rise back up into the target. This mirrors
            # how such backward loops are conventionally hand-drawn.
            x1, y1 = anchor(a, "bottom"); x2, y2 = anchor(b, "bottom")
            dip_y = a["cy"] + row_max_hh.get(a["row"], a["hh"]) + 34
            d = f"M {x1} {y1} L {x1} {dip_y} L {x2} {dip_y} L {x2} {y2}"
            lx, ly = (x1 + x2) / 2, dip_y + 15
        elif abs(a["cx"] - b["cx"]) < 6 and find_straight_obstruction(a, b) is None:
            x1, y1 = anchor(a, "bottom"); x2, y2 = anchor(b, "top")
            d = f"M {x1} {y1} L {x2} {y2}"
            # centered on the line, biased close to the SOURCE so a sibling
            # branch's (lower) elbow label never collides with this one
            lx, ly = x1, y1 + (y2 - y1) * 0.20
        elif abs(a["cx"] - b["cx"]) < 6:
            # BYPASS ROUTING (Fix #4): same column, but something sits
            # directly in between (classic case: a process box's incoming
            # edge spans 2+ rows in the SAME lane/offset as its own database
            # annotation, which occupies the row in between). A straight
            # line would cut right through it, and simply moving a midpoint
            # doesn't help when x1==x2 — so detour sideways around it
            # instead, then back onto the target's column.
            obstruction = find_straight_obstruction(a, b)
            x1, y1 = anchor(a, "bottom"); x2, y2 = anchor(b, "top")
            bypass_x = x1 + obstruction["hw"] + 30
            top_y = obstruction["cy"] - obstruction["hh"] - 18
            bot_y = obstruction["cy"] + obstruction["hh"] + 18
            if y2 < y1:  # target above source -> traverse the bypass upward
                top_y, bot_y = bot_y, top_y
            d = f"M {x1} {y1} L {x1} {top_y} L {bypass_x} {top_y} L {bypass_x} {bot_y} L {x2} {bot_y} L {x2} {y2}"
            lx, ly = bypass_x, (top_y + bot_y) / 2
        else:
            x1, y1 = anchor(a, "bottom"); x2, y2 = anchor(b, "top")
            # jog biased toward the source, and deliberately lower than the
            # straight-branch case above -> the two heights never collide
            midY = y1 + (y2 - y1) * 0.42
            # FIX #3: if something sits directly above/below the target in
            # between, push the jog past it so the final vertical approach
            # never cuts through it (see find_vertical_obstruction above).
            obstruction = find_vertical_obstruction(a, b)
            if obstruction is not None:
                if y2 > y1:  # target below source -> push jog below the obstruction
                    midY = max(midY, obstruction["cy"] + obstruction["hh"] + 22)
                else:  # target above source -> push jog above the obstruction
                    midY = min(midY, obstruction["cy"] - obstruction["hh"] - 22)
            d = f"M {x1} {y1} L {x1} {midY} L {x2} {midY} L {x2} {y2}"
            lx, ly = (x1 + x2) / 2, midY - 13
        path_svg = f'<path d="{d}" fill="none" stroke="{color}" stroke-width="2.2" marker-end="{marker}"/>'
        label_svg = ""
        if label:
            lw = 7.6 * len(label) + 14
            label_svg = (f'<rect x="{lx-lw/2}" y="{ly-10.5}" width="{lw}" height="17" '
                         f'fill="#ffffff" fill-opacity="0.97" stroke="{color}" stroke-width="0.8" rx="4"/>')
            label_svg += svg_text(lx, ly + 1.5, label, size=10.5, weight=800, color=color, max_chars=30)
        return path_svg, label_svg

    # ---- resolve edges from Mode A fields (next/yaTo/tidakTo) plus the
    # optional `branches` override ----
    edges = []  # (a_id, b_id, label, kind)
    for sid, s in steps.items():
        if s.get("branches"):
            for br in s["branches"]:
                if br.get("to") in steps:
                    edges.append((sid, br["to"], br.get("label"), br.get("kind", "normal")))
            continue
        for n in (s.get("next") or []):
            if n.get("to") in steps:
                edges.append((sid, n["to"], None, "normal"))
        if s.get("yaTo") and s["yaTo"] in steps:
            edges.append((sid, s["yaTo"], "Ya", "ya"))
        if s.get("tidakTo") and s["tidakTo"] in steps:
            edges.append((sid, s["tidakTo"], "Tidak", "tidak"))

    # ---- SVG ----
    svg = []
    svg.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{total_w}" height="{diagram_top+diagram_h}" viewBox="0 0 {total_w} {diagram_top+diagram_h}" font-family="Arial, sans-serif">')
    svg.append('<defs>')
    for k, c in EDGE_COLOR.items():
        svg.append(f'<marker id="arrow-{k}" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="{c}"/></marker>')
    svg.append('</defs>')
    svg.append(f'<rect x="0" y="0" width="{total_w}" height="{diagram_top+diagram_h}" fill="#ffffff"/>')

    title = args.title or data.get("title", "Flowchart")
    subtitle = args.subtitle or data.get("subtitle", "")
    svg.append(f'<rect x="{MARGIN}" y="{MARGIN}" width="{diagram_w}" height="{HEADER_H}" rx="16" fill="#152A54"/>')
    svg.append(f'<rect x="{MARGIN+20}" y="{MARGIN+20}" width="76" height="76" rx="14" fill="#ffffff"/>')
    svg.append(f'<image href="data:image/png;base64,{ICONS["icon_header"]}" x="{MARGIN+34}" y="{MARGIN+34}" width="48" height="48"/>')
    svg.append(f'<text x="{MARGIN+118}" y="{MARGIN+58}" font-size="28" font-weight="800" fill="#ffffff" font-family="Arial">{esc(title)}</text>')
    if subtitle:
        svg.append(svg_text(MARGIN + 120, MARGIN + 90, subtitle, size=14, weight=500, color="#c7d3ec", anchor="start", max_chars=90))

    for i, name in enumerate(LANES):
        lx = MARGIN + i * LANE_W
        svg.append(f'<rect x="{lx}" y="{MARGIN+HEADER_H}" width="{LANE_W}" height="{SWIM_H}" fill="#1B4FA0" stroke="#ffffff" stroke-width="1"/>')
        svg.append(f'<image href="data:image/png;base64,{ICONS[LANE_ICON[i]]}" x="{lx+16}" y="{MARGIN+HEADER_H+13}" width="50" height="50"/>')
        svg.append(svg_text(lx + LANE_W / 2 + 22, MARGIN + HEADER_H + SWIM_H / 2 + 5, name, size=13.5, weight=700, color="#fff", max_chars=16))

    for i in range(n_lanes):
        lx = MARGIN + i * LANE_W
        if i % 2 == 1:
            svg.append(f'<rect x="{lx}" y="{diagram_top}" width="{LANE_W}" height="{diagram_h}" fill="#F5F7FB"/>')
    for i in range(1, n_lanes):
        lx = MARGIN + i * LANE_W
        svg.append(f'<line x1="{lx}" y1="{diagram_top}" x2="{lx}" y2="{diagram_top+diagram_h}" stroke="#c7ccd6" stroke-width="1.5" stroke-dasharray="5,5"/>')
    svg.append(f'<rect x="{MARGIN}" y="{diagram_top}" width="{diagram_w}" height="{diagram_h}" fill="none" stroke="#c7ccd6" stroke-width="1.5"/>')

    label_svgs = []
    for a_id, b_id, label, kind in edges:
        path_svg, label_svg = draw_edge(steps[a_id], steps[b_id], label, kind)
        svg.append(path_svg)
        if label_svg: label_svgs.append(label_svg)
    for nd in steps.values():
        svg.append(draw_node(nd))
    svg.extend(label_svgs)  # labels last: always on top of lines and shapes

    svg.append("</svg>")
    svg_str = "\n".join(svg)

    # ---- tables ----
    numbered = sorted([s for s in steps.values() if s.get("no")], key=lambda n: n["no"])
    LANE_BADGE_COLOR = ["#1B4FA0", "#5E8F2A", "#C97A12", "#5F4390", "#8E5FA6", "#2E6BB0", "#3f8f3f", "#c0392b"]
    rows_html = []
    for nd in numbered:
        li = nd["lane"]
        rows_html.append(f"""
    <tr>
      <td><span class="badge" style="background:{LANE_BADGE_COLOR[li % len(LANE_BADGE_COLOR)]}">{nd['no']}</span></td>
      <td>{esc(nd['label'])}</td>
      <td>{esc(LANES[li])}</td>
      <td>{esc(nd.get('pic','-'))}</td>
    </tr>""")
    table_html = "\n".join(rows_html)

    decisions = [s for s in steps.values() if s["type"] == "decision"]
    dec_rows = "\n".join(f"""
    <tr><td>{esc(nd['label'])}</td><td>{esc(LANES[nd['lane']])}</td></tr>""" for nd in decisions)

    notes = data.get("footerNotes") or []
    notes_html = "\n".join(f'&bull; {esc(n)}<br>' for n in notes) or "<i>(tidak ada catatan proses pada sumber)</i>"

    HTML = f"""<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>{esc(title)}</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<style>
  :root{{ --navy:#152A54; --navy2:#1B4FA0; --text:#152A54; }}
  *{{box-sizing:border-box;}}
  body{{font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#e9edf3;margin:0;padding:24px;color:var(--text);}}
  .wrap{{max-width:1500px;margin:0 auto;}}
  h1{{font-size:20px;margin:0 0 4px;}}
  p.sub{{margin:0 0 18px;color:#5b6577;font-size:13px;}}
  .panel{{background:#fff;border-radius:12px;padding:18px;margin-bottom:18px;box-shadow:0 1px 3px rgba(0,0,0,.08);}}
  .panel h2{{font-size:15px;margin:0;color:var(--navy);}}
  .section-head{{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:12px;}}
  #canvasHolder{{overflow:auto;background:#fff;border-radius:12px;padding:14px;box-shadow:0 1px 3px rgba(0,0,0,.08);}}
  #canvasHolder svg{{display:block;}}
  table{{width:100%;border-collapse:collapse;font-size:12.5px;}}
  th{{background:var(--navy);color:#fff;text-align:left;padding:9px 10px;font-size:12px;}}
  td{{padding:8px 10px;border-bottom:1px solid #e3e7ee;vertical-align:top;}}
  tr:nth-child(even) td{{background:#f7f9fc;}}
  .badge{{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;color:#fff;font-weight:700;font-size:11.5px;}}
  .legend-grid{{display:flex;flex-wrap:wrap;gap:14px;}}
  .legend-item{{display:flex;align-items:center;gap:10px;background:#f7f9fc;border:1px solid #e3e7ee;border-radius:10px;padding:10px 14px;min-width:230px;flex:1;}}
  .legend-item img{{width:34px;height:34px;flex-shrink:0;}}
  .legend-item b{{display:block;font-size:12.5px;color:var(--navy);}}
  .legend-item span{{font-size:11px;color:#5b6577;}}
  .footer-note{{font-size:12px;color:#3a4356;line-height:1.6;}}
  .two-col{{display:grid;grid-template-columns:2.1fr 1fr;gap:18px;align-items:start;}}
  @media(max-width:1100px){{.two-col{{grid-template-columns:1fr;}}}}
  .dl-bar{{background:#fff;border-radius:12px;padding:12px 16px;margin-bottom:14px;box-shadow:0 1px 3px rgba(0,0,0,.08);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;}}
  .dl-btn{{background:var(--navy2);color:#fff;border:none;padding:8px 15px;border-radius:8px;font-size:12.5px;font-weight:600;cursor:pointer;white-space:nowrap;display:inline-flex;align-items:center;gap:6px;}}
  .dl-btn:hover{{filter:brightness(1.1);}}
  .dl-btn:active{{transform:translateY(1px);}}
  .dl-status{{font-size:11.5px;color:#5b6577;margin-left:8px;}}
</style>
</head>
<body>
<div class="wrap">
  <h1>{esc(title)}</h1>
  <p class="sub">{esc(subtitle)}</p>

  <div class="dl-bar">
    <div style="font-size:12.5px;color:#5b6577;">Diagram di bawah dirender sebagai SVG &mdash; unduh sebagai gambar PNG resolusi tinggi.</div>
    <div>
      <button class="dl-btn" onclick="downloadFlowchartPNG()">&#8681; Unduh Flowchart Utama (PNG)</button>
      <span id="statusMain" class="dl-status"></span>
    </div>
  </div>

  <div id="canvasHolder"><div id="flowSvgWrap">
    {svg_str}
  </div></div>

  <div class="panel" id="legendPanel" style="margin-top:18px;">
    <div class="section-head">
      <h2>Legenda Simbol</h2>
      <div><button class="dl-btn" onclick="downloadSectionPNG('legendCapture','legenda_simbol','statusLegend')">&#8681; Unduh Legenda Simbol (PNG)</button><span id="statusLegend" class="dl-status"></span></div>
    </div>
    <div id="legendCapture" style="background:#fff;">
    <div class="legend-grid" style="margin-top:12px;">
      <div class="legend-item"><img src="data:image/png;base64,{ICONS['icon_shape_startend']}"><div><b>Start / End</b><span>Oval hijau = titik mulai, oval merah = titik selesai pada tiap lane.</span></div></div>
      <div class="legend-item"><img src="data:image/png;base64,{ICONS['icon_shape_process']}"><div><b>Process / Input</b><span>Kotak biru &mdash; aktivitas/pekerjaan atau input data yang dilakukan PIC pada lane terkait.</span></div></div>
      <div class="legend-item"><img src="data:image/png;base64,{ICONS['icon_shape_decision']}"><div><b>Decision</b><span>Belah ketupat oranye &mdash; titik pengambilan keputusan dengan 2 cabang atau lebih.</span></div></div>
      <div class="legend-item"><img src="data:image/png;base64,{ICONS['icon_shape_data']}"><div><b>Database / Merge</b><span>Tabung ungu &mdash; penyimpanan/master data atau titik merge sebelum broadcast ke lane lain.</span></div></div>
    </div>
    </div>
  </div>

  <div class="two-col">
    <div class="panel" id="stepTablePanel">
      <div class="section-head">
        <h2>Penjelasan Setiap Step</h2>
        <div><button class="dl-btn" onclick="downloadSectionPNG('stepTableCapture','penjelasan_step','statusStep')">&#8681; Unduh Tabel Step (PNG)</button><span id="statusStep" class="dl-status"></span></div>
      </div>
      <div id="stepTableCapture" style="background:#fff;">
      <table>
        <tr><th>No</th><th>Aktivitas</th><th>Lane</th><th>PIC</th></tr>
        {table_html}
      </table>
      </div>
    </div>
    <div>
      <div class="panel" id="decisionTablePanel">
        <div class="section-head">
          <h2>Daftar Decision Point</h2>
          <div><button class="dl-btn" onclick="downloadSectionPNG('decisionTableCapture','decision_point','statusDecision')">&#8681; Unduh Decision Point (PNG)</button><span id="statusDecision" class="dl-status"></span></div>
        </div>
        <div id="decisionTableCapture" style="background:#fff;">
        <table>
          <tr><th>Decision</th><th>Lane</th></tr>
          {dec_rows}
        </table>
        </div>
      </div>
      <div class="panel" id="catatanPanel">
        <div class="section-head"><h2>Catatan</h2></div>
        <div class="footer-note">
          {notes_html}
        </div>
      </div>
    </div>
  </div>
</div>

<script>
function downloadFlowchartPNG(){{
  var statusEl = document.getElementById('statusMain');
  var svgEl = document.querySelector('#flowSvgWrap svg');
  if(!svgEl){{ statusEl.textContent = 'SVG tidak ditemukan.'; return; }}
  statusEl.textContent = 'Menyiapkan gambar...';
  var svgClone = svgEl.cloneNode(true);
  svgClone.setAttribute('xmlns','http://www.w3.org/2000/svg');
  var svgString = new XMLSerializer().serializeToString(svgClone);
  var svgBlob = new Blob([svgString], {{type:'image/svg+xml;charset=utf-8'}});
  var url = URL.createObjectURL(svgBlob);
  var widthAttr = svgEl.getAttribute('width');
  var heightAttr = svgEl.getAttribute('height');
  var img = new Image();
  img.onload = function(){{
    var scale = 2;
    var w = parseFloat(widthAttr) || img.width;
    var h = parseFloat(heightAttr) || img.height;
    var canvas = document.createElement('canvas');
    canvas.width = w*scale; canvas.height = h*scale;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.scale(scale,scale);
    ctx.drawImage(img,0,0,w,h);
    canvas.toBlob(function(blob){{
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'flowchart.png';
      document.body.appendChild(a); a.click(); a.remove();
      statusEl.textContent = 'Selesai diunduh.';
      setTimeout(function(){{ statusEl.textContent=''; }}, 3000);
    }}, 'image/png');
    URL.revokeObjectURL(url);
  }};
  img.onerror = function(){{ statusEl.textContent = 'Gagal membuat gambar. Coba lagi.'; }};
  img.src = url;
}}

function downloadSectionPNG(elementId, filename, statusId){{
  var statusEl = document.getElementById(statusId);
  var target = document.getElementById(elementId);
  if(!target){{ statusEl.textContent = 'Elemen tidak ditemukan.'; return; }}
  if(typeof html2canvas === 'undefined'){{
    statusEl.textContent = 'Gagal memuat pustaka gambar (perlu koneksi internet).';
    return;
  }}
  statusEl.textContent = 'Menyiapkan gambar...';
  html2canvas(target, {{scale:2, backgroundColor:'#ffffff', useCORS:true}}).then(function(canvas){{
    canvas.toBlob(function(blob){{
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename + '.png';
      document.body.appendChild(a); a.click(); a.remove();
      statusEl.textContent = 'Selesai diunduh.';
      setTimeout(function(){{ statusEl.textContent=''; }}, 3000);
    }}, 'image/png');
  }}).catch(function(err){{
    statusEl.textContent = 'Gagal membuat gambar. Coba lagi.';
    console.error(err);
  }});
}}
</script>
</body>
</html>
"""
    with open(args.out, "w") as f:
        f.write(HTML)
    print(f"Written: {args.out}  ({len(HTML)} chars)")

if __name__ == "__main__":
    build(parse_args())
