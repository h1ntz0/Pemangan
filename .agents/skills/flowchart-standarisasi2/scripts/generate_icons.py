#!/usr/bin/env python3
"""
generate_icons.py
------------------
Generates every PNG icon used by render_flowchart_html.py and saves them as
base64 .b64 files next to the .png files, inside --outdir (default:
./assets/icons relative to this script's parent skill folder).

Self-contained: only depends on Pillow (PIL). No network access, no external
image files. Safe to re-run on any machine — it always regenerates the full
icon set so the skill never depends on files that might get lost when the
skill folder is copied to another device.

Usage:
    python3 generate_icons.py [--outdir PATH]

Icons produced:
  Role icons (used in swimlane headers):
    icon_role_initiator, icon_role_approver, icon_role_reviewer,
    icon_role_team, icon_role_person   (generic fallback)
  Shape/legend icons (literal miniatures of the shapes used in the diagram —
  NOT symbolic icons like a gear or magnifying glass, so the legend visually
  matches the diagram itself):
    icon_shape_startend, icon_shape_process, icon_shape_decision,
    icon_shape_data
  Header icon:
    icon_header (generic flowchart/process glyph used in the page banner)
"""
import argparse, base64, math, os
from PIL import Image, ImageDraw

def canvas(w=96, h=96):
    return Image.new("RGBA", (w, h), (0, 0, 0, 0))

def save_all(outdir):
    os.makedirs(outdir, exist_ok=True)

    def save(img, name):
        path = os.path.join(outdir, f"{name}.png")
        img.save(path)
        with open(os.path.join(outdir, f"{name}.b64"), "w") as f:
            f.write(base64.b64encode(open(path, "rb").read()).decode())

    # ---- Role icons (swimlane headers) ----
    img = canvas(); d = ImageDraw.Draw(img)
    d.ellipse((28, 10, 68, 50), fill=(46, 107, 176, 255))
    d.pieslice((14, 46, 82, 96), 180, 360, fill=(46, 107, 176, 255))
    d.rectangle((60, 55, 64, 85), fill=(217, 165, 33, 255))
    d.polygon([(58, 82), (66, 82), (62, 92)], fill=(90, 60, 10, 255))
    save(img, "icon_role_initiator")

    img = canvas(); d = ImageDraw.Draw(img)
    d.ellipse((28, 10, 68, 50), fill=(94, 143, 42, 255))
    d.pieslice((14, 46, 82, 96), 180, 360, fill=(94, 143, 42, 255))
    d.ellipse((58, 58, 90, 90), fill=(255, 255, 255, 255), outline=(94, 143, 42, 255), width=3)
    d.line([(65, 74), (72, 82), (84, 64)], fill=(94, 143, 42, 255), width=5, joint="curve")
    save(img, "icon_role_approver")

    img = canvas(); d = ImageDraw.Draw(img)
    d.ellipse((20, 20, 64, 64), outline=(201, 122, 18, 255), width=8)
    d.line([(60, 60), (84, 84)], fill=(201, 122, 18, 255), width=10)
    save(img, "icon_role_reviewer")

    img = canvas(); d = ImageDraw.Draw(img)
    d.rounded_rectangle((16, 40, 80, 82), radius=8, fill=(95, 67, 144, 255))
    d.rectangle((38, 28, 58, 42), outline=(95, 67, 144, 255), width=6)
    d.line([(16, 58), (80, 58)], fill=(255, 255, 255, 255), width=4)
    save(img, "icon_role_team")

    img = canvas(); d = ImageDraw.Draw(img)
    d.ellipse((28, 8, 68, 48), fill=(46, 107, 176, 255))
    d.pieslice((14, 44, 82, 94), 180, 360, fill=(46, 107, 176, 255))
    d.rectangle((30, 64, 66, 80), fill=(255, 255, 255, 255), outline=(46, 107, 176, 255), width=3)
    d.line([(48, 64), (48, 80)], fill=(46, 107, 176, 255), width=2)
    save(img, "icon_role_person")

    # ---- Shape / legend icons: literal shape miniatures, colors match the
    # actual node styling used by render_flowchart_html.py ----
    img = canvas(96, 60); d = ImageDraw.Draw(img)
    d.ellipse((2, 14, 44, 46), fill=(139, 195, 74, 255), outline=(51, 85, 31, 255), width=3)
    d.ellipse((52, 14, 94, 46), fill=(217, 83, 79, 255), outline=(51, 85, 31, 255), width=3)
    save(img, "icon_shape_startend")

    img = canvas(96, 72); d = ImageDraw.Draw(img)
    d.rounded_rectangle((6, 10, 90, 62), radius=12, fill=(234, 243, 252, 255), outline=(46, 107, 176, 255), width=4)
    d.line([(16, 26), (80, 26)], fill=(46, 107, 176, 180), width=3)
    d.line([(16, 38), (70, 38)], fill=(46, 107, 176, 180), width=3)
    d.line([(16, 50), (60, 50)], fill=(46, 107, 176, 180), width=3)
    save(img, "icon_shape_process")

    img = canvas(96, 80); d = ImageDraw.Draw(img)
    d.polygon([(48, 4), (92, 40), (48, 76), (4, 40)], fill=(252, 228, 192, 255), outline=(201, 122, 18, 255), width=4)
    save(img, "icon_shape_decision")

    # database/merge: cylinder ("tabung") — matches the actual diagram shape
    # (see render_flowchart_html.py shape_database), not a hexagon
    img = canvas(96, 76); d = ImageDraw.Draw(img)
    fill, stroke = (217, 204, 240, 255), (95, 67, 144, 255)
    ell_h = 14
    top_y, bot_y = 8 + ell_h, 68 - ell_h
    d.rectangle((8, top_y, 88, bot_y), fill=fill)
    d.line([(8, top_y), (8, bot_y)], fill=stroke, width=4)
    d.line([(88, top_y), (88, bot_y)], fill=stroke, width=4)
    d.ellipse((8, bot_y - ell_h, 88, bot_y + ell_h), fill=fill, outline=stroke, width=4)
    d.ellipse((8, top_y - ell_h, 88, top_y + ell_h), fill=fill, outline=stroke, width=4)
    save(img, "icon_shape_data")

    # ---- Header glyph (generic flow/process icon for the page banner) ----
    img = canvas(96, 96); d = ImageDraw.Draw(img)
    cx, cy, r = 48, 48, 26
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(46, 107, 176, 255))
    for i in range(8):
        a = i * math.pi / 4
        x1 = cx + (r + 3) * math.cos(a); y1 = cy + (r + 3) * math.sin(a)
        x2 = cx + (r + 11) * math.cos(a); y2 = cy + (r + 11) * math.sin(a)
        d.line([(x1, y1), (x2, y2)], fill=(46, 107, 176, 255), width=7)
    d.ellipse((cx - 10, cy - 10, cx + 10, cy + 10), fill=(255, 255, 255, 255))
    save(img, "icon_header")

    print(f"Icons written to: {outdir}")

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    here = os.path.dirname(os.path.abspath(__file__))
    default_out = os.path.normpath(os.path.join(here, "..", "assets", "icons"))
    ap.add_argument("--outdir", default=default_out)
    args = ap.parse_args()
    save_all(args.outdir)
