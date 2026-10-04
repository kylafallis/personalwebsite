"""Regenerate the served WebP/JPEG sizes from the originals in images/.

Run after replacing a photo in images/originals/:
    python build/images.py
Then rebuild the link-preview card:
    python build/make_share.py

Requires Pillow  (pip install Pillow).

NOTE: sources live in images/originals/ and outputs in images/ on purpose.
Windows filesystems are case-insensitive, so writing images/hero.jpg next to
an images/hero.JPG source would silently overwrite the original.
"""
import os
from PIL import Image

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

CREAM = (245, 242, 237)
DARK  = (26, 43, 24)

def kb(p):
    return round(os.path.getsize(p) / 1024, 1)

def save_pair(im, stem, width, q_webp=80, q_jpg=82):
    """Resize to `width` and write both .webp and .jpg; return (webp, jpg) paths."""
    w, h = im.size
    if w > width:
        im = im.resize((width, round(h * width / w)), Image.LANCZOS)
    wp, jp = f"{stem}.webp", f"{stem}.jpg"
    im.save(wp, "WEBP", quality=q_webp, method=6)
    im.save(jp, "JPEG", quality=q_jpg, optimize=True, progressive=True)
    return wp, jp, im.size

print("=== RESPONSIVE IMAGES ===")
for src, stem, widths in [
    ("images/originals/hero-original.jpg",  "images/hero",  [2000, 1200]),
    ("images/originals/about-original.jpg", "images/about", [1600, 900]),
]:
    im = Image.open(src).convert("RGB")
    for width in widths:
        suffix = "" if width == widths[0] else f"-{width}w"
        wp, jp, size = save_pair(im.copy(), stem + suffix, width)
        print(f"  {wp:32} {str(size):14} {kb(wp):>7} KB")
        print(f"  {jp:32} {str(size):14} {kb(jp):>7} KB")

print("\nDone. Now rebuild the link-preview card so it matches:")
print("    python build/make_share.py")
