// ============================================================
// build/prerender.js
//
// Bakes the output of render.js into the static HTML, so crawlers,
// link previewers, and no-JS visitors see real content instead of
// empty <div>s.
//
// It does NOT reimplement the templates. It executes the real
// render.js against a minimal DOM shim and captures what that code
// writes, so the markup can never drift from the runtime version.
//
//   node build/prerender.js
//
// Re-run it after editing data.js or render.js. Injected regions are
// fenced with <!-- prerender:ID --> markers and replaced in place, so
// running it repeatedly is safe.
// ============================================================

const fs = require('fs');
const path = require('path');
process.chdir(path.join(__dirname, '..'));

const PAGES = ['index.html', 'about.html', 'research.html', 'projects.html',
               'speaking.html', 'contact.html', 'now.html', 'mediakit.html'];

const dataSrc   = fs.readFileSync('data.js', 'utf8');
const renderSrc = fs.readFileSync('render.js', 'utf8');
const SITE_DATA = new Function(dataSrc + ';\nreturn SITE_DATA;')();

// ── Minimal DOM shim ─────────────────────────────────────────
// Covers exactly what render.js touches. Anything it does not know
// about is a no-op, which is the safe direction for a build step.
function makeShim(idsPresent, hasFooter) {
  const captured = {};
  const footer = { html: '' };

  function makeEl(tag) {
    return {
      tagName: tag,
      className: '',
      _html: '',
      get innerHTML() { return this._html; },
      set innerHTML(v) { this._html = v; },
      setAttribute() {}, getAttribute() { return null; },
      appendChild(child) { this._html += (child._html || ''); return child; },
      insertBefore(child) { this._html += (child._html || ''); return child; },
      querySelector() { return null; },
      querySelectorAll() { return []; },
      classList: { add() {}, remove() {} }
    };
  }

  const document = {
    getElementById(id) {
      if (!idsPresent.has(id)) return null;
      const el = makeEl('div');
      Object.defineProperty(el, 'innerHTML', {
        get() { return captured[id] || ''; },
        set(v) { captured[id] = v; }
      });
      return el;
    },
    querySelectorAll(sel) {
      if (sel === '.footer-inner' && hasFooter) {
        const node = {
          querySelector() { return { _marker: 'footer-copy' }; },
          insertBefore(wrap) { footer.html = wrap._html || wrap.innerHTML || ''; },
          appendChild(wrap)  { footer.html = wrap._html || wrap.innerHTML || ''; }
        };
        return [node];
      }
      return [];
    },
    createElement: makeEl,
    addEventListener() {}
  };

  // No fetch at build time: renderCvButtons bails out, which is what we
  // want. The CV button stays a runtime-only, file-exists-gated addition.
  const window = { fetch: undefined };
  const navigator = { clipboard: null };

  return { document, window, navigator, captured, footer };
}

// ── Run render.js once per page, with that page's container ids ──
function renderFor(page) {
  const html = fs.readFileSync(page, 'utf8');
  const ids = new Set([...html.matchAll(/id="([a-zA-Z0-9_-]+)"/g)].map(m => m[1]));
  const hasFooter = html.includes('footer-inner');
  const shim = makeShim(ids, hasFooter);

  // SITE_DATA is passed in as a parameter: `const` inside an eval would be
  // scoped to the eval itself and invisible to render.js.
  const fn = new Function('document', 'window', 'navigator', 'SITE_DATA',
    renderSrc + '\nreturn null;');
  fn(shim.document, shim.window, shim.navigator, SITE_DATA);

  return { html, captured: shim.captured, footer: shim.footer.html };
}

// ── Inject captured HTML between fence markers ───────────────
function inject(html, id, content) {
  const open = `<!-- prerender:${id} -->`;
  const close = `<!-- /prerender:${id} -->`;
  const payload = `${open}${content}${close}`;

  // Already prerendered -> replace the fenced region.
  const fenced = new RegExp(
    `<!-- prerender:${id} -->[\\s\\S]*?<!-- /prerender:${id} -->`);
  if (fenced.test(html)) return html.replace(fenced, payload);

  // First run -> fill the empty container, keeping its attributes.
  const empty = new RegExp(
    `(<([a-z]+)([^>]*\\bid="${id}"[^>]*)>)\\s*(</\\2>)`);
  if (empty.test(html)) return html.replace(empty, `$1${payload}$4`);

  return null;   // container has non-empty content already; leave it alone
}

let totalPages = 0, totalBlocks = 0;

for (const page of PAGES) {
  const { html, captured, footer } = renderFor(page);
  let out = html, blocks = 0;

  for (const [id, content] of Object.entries(captured)) {
    if (!content) continue;
    const next = inject(out, id, content);
    if (next) { out = next; blocks++; }
  }

  // Footer link row: injected before .footer-copy on every page.
  if (footer) {
    const wrapped = `<!-- prerender:footer --><div class="footer-links-wrap">${footer}</div><!-- /prerender:footer -->`;
    const fenced = /<!-- prerender:footer -->[\s\S]*?<!-- \/prerender:footer -->/;
    if (fenced.test(out)) { out = out.replace(fenced, wrapped); blocks++; }
    else if (out.includes('<p class="footer-copy"')) {
      out = out.replace('<p class="footer-copy"', wrapped + '\n        <p class="footer-copy"');
      blocks++;
    }
  }

  if (out !== html) {
    fs.writeFileSync(page, out);
    totalPages++;
    totalBlocks += blocks;
    console.log(`  ${page.padEnd(16)} ${blocks} block(s) prerendered`);
  } else {
    console.log(`  ${page.padEnd(16)} no change`);
  }
}

console.log(`\nprerendered ${totalBlocks} blocks across ${totalPages} pages`);
