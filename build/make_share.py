"""Rebuild images/share.jpg - the 1200x630 card used for link previews.

    python build/make_share.py

Crops hero.JPG so the subject sits right of centre, lays a dark scrim over
the left, and bakes in the name and title (OG images cannot use CSS).
FACE_X / FACE_Y below control the crop - adjust if you swap the photo.
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
CREAM, DARK, GLIGHT = (245,242,237), (26,43,24), (125,175,138)
F = "C:/Windows/Fonts/"
font = lambda n,s: ImageFont.truetype(F+n, s)
kb = lambda p: round(os.path.getsize(p)/1024, 1)

TW, TH = 1200, 630
hero = Image.open("images/originals/hero-original.jpg").convert("RGB")

# Scale up, then solve the crop so KYLA's face lands at ~70% across, in the clear
# right side, with the other panelist pushed off-frame entirely.
Z = 1.5
scale = max(TW/hero.width, TH/hero.height) * Z
hr = hero.resize((round(hero.width*scale), round(hero.height*scale)), Image.LANCZOS)
FACE_X, FACE_Y = 0.467, 0.295      # her face centre, as a fraction of the source
left = max(0, min(hr.width  - TW, int(FACE_X*hr.width  - TW*0.70)))
top  = max(0, min(hr.height - TH, int(FACE_Y*hr.height - TH*0.43)))
base = hr.crop((left, top, left+TW, top+TH))

# Strong left-to-right scrim: near-opaque under the text, clean photo on the right.
grad = Image.new("L", (TW, TH), 0)
px = grad.load()
for x in range(TW):
    t = x / TW
    if   t < 0.44: a = 248
    elif t < 0.72: a = int(248 * (1 - (t-0.44)/0.28) ** 1.6)
    else:          a = 0
    for y in range(TH):
        px[x, y] = a
grad = grad.filter(ImageFilter.GaussianBlur(14))
share = Image.composite(Image.new("RGB",(TW,TH),DARK), base, grad)
# gentle global darkening keeps the right side from blowing out next to the panel
share = Image.blend(share, Image.new("RGB",(TW,TH),DARK), 0.12)

d = ImageDraw.Draw(share)
d.text((76, 188), "KYLA",   font=font("georgiab.ttf", 82), fill=CREAM)
d.text((76, 272), "FALLIS", font=font("georgiab.ttf", 82), fill=CREAM)
d.line([(78, 386),(78+96, 386)], fill=GLIGHT, width=3)
d.text((76, 414), "Chemical Engineer",  font=font("georgiai.ttf", 36), fill=(216,226,214))
d.text((76, 456), "Researcher \u00b7 Builder",     font=font("georgiai.ttf", 36), fill=(216,226,214))
d.text((78, 520), "kylafallis.com", font=font("consolab.ttf", 21), fill=GLIGHT)

share.save("images/share.jpg", "JPEG", quality=88, optimize=True, progressive=True)
print(f"images/share.jpg  1200x630  {kb('images/share.jpg')} KB")
