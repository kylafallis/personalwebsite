"""Regenerate the favicon set and apple-touch-icon from the KF monogram.

    python build/make_icons.py

Writes favicon.ico (multi-resolution), favicon-32/192/512.png and
apple-touch-icon.png. Also re-bakes text onto images/share.jpg, so run
build/make_share.py after this if you only wanted the icons.
"""
import os
from PIL import Image, ImageDraw, ImageFont

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

CREAM  = (245, 242, 237)
DARK   = (26, 43, 24)
GREEN  = (74, 124, 89)
GLIGHT = (125, 175, 138)

F = "C:/Windows/Fonts/"
def font(name, size):
    return ImageFont.truetype(F + name, size)

def kb(p): return round(os.path.getsize(p) / 1024, 1)

# ══ SHARE IMAGE: bake name + title onto the darkened photo ══
share = Image.open("images/share.jpg").convert("RGB")
d = ImageDraw.Draw(share)

d.text((72, 196), "KYLA FALLIS", font=font("georgiab.ttf", 76), fill=CREAM)
d.line([(74, 300), (74 + 92, 300)], fill=GLIGHT, width=3)
for i, line in enumerate(["Environmental Engineer", "Researcher \u00b7 Builder"]):
    d.text((72, 330 + i * 44), line, font=font("georgiai.ttf", 38), fill=(214, 224, 212))
d.text((74, 436), "DEEP-SEA ELECTROCHEMISTRY  \u00b7  RENEWABLE ENERGY  \u00b7  POLICY",
       font=font("segoeui.ttf", 19), fill=GLIGHT)
d.text((74, 486), "kylafallis.com", font=font("consolab.ttf", 22), fill=(170, 196, 174))

share.save("images/share.jpg", "JPEG", quality=88, optimize=True, progressive=True)
print(f"images/share.jpg      1200x630   {kb('images/share.jpg')} KB")

# ══ FAVICON: square "KF" monogram, sharp corners to match the site ══
def monogram(px, pad_ratio=0.0):
    """Dark-green tile with a cream KF, rendered at 4x then downsampled."""
    S = px * 4
    img = Image.new("RGB", (S, S), DARK)
    dr = ImageDraw.Draw(img)
    inset = int(S * 0.085)
    dr.rectangle([inset, inset, S - inset - 1, S - inset - 1], outline=GREEN, width=max(2, S // 64))
    f = font("georgiab.ttf", int(S * 0.52))
    t = "KF"
    l, t_, r, b = dr.textbbox((0, 0), t, font=f)
    dr.text(((S - (r - l)) / 2 - l, (S - (b - t_)) / 2 - t_ - S * 0.015), t, font=f, fill=CREAM)
    return img.resize((px, px), Image.LANCZOS)

# Multi-resolution .ico (16/32/48 are what browsers actually request)
monogram(256).save("favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (256, 256)])
print(f"favicon.ico           multi-res  {kb('favicon.ico')} KB")

monogram(180).save("apple-touch-icon.png", "PNG", optimize=True)
print(f"apple-touch-icon.png  180x180    {kb('apple-touch-icon.png')} KB")

for px in (32, 192, 512):
    p = f"favicon-{px}.png"
    monogram(px).save(p, "PNG", optimize=True)
    print(f"{p:22}{px}x{px}      {kb(p)} KB")
