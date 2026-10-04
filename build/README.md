# Build scripts

The site is still plain static HTML, so you can open any page directly and it
works. These scripts just bake data into the HTML so search engines and link
previewers see real content instead of empty `<div>`s.

## When to run them

**After editing `data.js` or `render.js`, run:**

```bash
node build/prerender.js    # bakes rendered content into the HTML
node build/jsonld.js       # regenerates the structured data on index.html
```

If you skip this, the site still looks correct in a browser (render.js fills
everything in at runtime), but Google and LinkedIn will see the older baked
copy. So: edit content, run the two commands, commit.

## What each one does

### `prerender.js`

Executes the real `render.js` against a small DOM shim and writes the resulting
HTML into each page between fence comments:

```html
<div id="research-entries"><!-- prerender:research-entries -->...<!-- /prerender:research-entries --></div>
```

It does **not** reimplement any templates. It runs your actual render code, so
the baked markup can't drift from the runtime version. Running it twice in a row
changes nothing (it replaces the fenced region in place).

At runtime `render.js` still runs and overwrites these containers with identical
markup. That's intentional: the baked copy is for crawlers, the runtime copy
keeps everything dynamic.

**Deliberately not prerendered:** the "Full CV" button. It is added at runtime
only after a `HEAD` request confirms `files/Kyla_Fallis_CV.pdf` actually exists,
so a missing CV can never produce a dead link. Drop the PDF into `files/` and the
button appears by itself, with no code change needed.

### `jsonld.js`

Generates the `Person` + `ScholarlyArticle` JSON-LD block on `index.html` from
`data.js`. Add a DOI to a paper in `data.js`, re-run it, and the DOI flows into
the structured data automatically.

Setting `scholar` or `orcid` in `data.js` adds them to the `sameAs` list, which
is how Google links your site to your publication profiles.

## Images

Source photos live in **`images/originals/`**. Everything in `images/` itself is
generated, so don't hand-edit those, they get overwritten.

> The split matters: Windows filesystems are case-insensitive, so a source named
> `hero.JPG` sitting next to a generated `hero.jpg` is **the same file**, and the
> build silently destroys the original. Keeping sources in a subfolder makes that
> impossible.

| Served file | Size | Generated from |
|---|---|---|
| `hero.webp` / `.jpg` (2000w) | 120 KB / 216 KB | `originals/hero-original.jpg` |
| `hero-1200w.webp` / `.jpg` | 50 KB / 86 KB | `originals/hero-original.jpg` |
| `about.webp` / `.jpg` (1600w) | 64 KB / 130 KB | `originals/about-original.jpg` |
| `about-900w.webp` / `.jpg` | 29 KB / 53 KB | `originals/about-original.jpg` |
| `share.jpg` (1200x630) | 90 KB | `originals/hero-original.jpg` + baked text |

The originals are 3.9 MB and 6.1 MB; the hero now serves at 120 KB, a 97%
reduction.

### Replacing a photo

1. Drop the new full-resolution file into `images/originals/`, keeping the name.
2. Run:

   ```bash
   python build/images.py        # resize + WebP/JPEG at two widths each
   python build/make_share.py    # rebuild the 1200x630 link-preview card
   ```

If you swap the hero photo, open `build/make_share.py` and adjust `FACE_X` /
`FACE_Y`, which position the crop so the subject lands clear of the text panel.

### Icons

`python build/make_icons.py` regenerates `favicon.ico`, `favicon-32/192/512.png`
and `apple-touch-icon.png` from the "KF" monogram. Run `make_share.py` afterwards,
since make_icons also touches the share card.
