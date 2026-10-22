#!/usr/bin/env node
// ============================================================
// make-puzzle.js: turn a daily puzzle spec into puzzle.js
//
//   node build/make-puzzle.js build/puzzle/specs/2026-10-22.json
//   node build/make-puzzle.js <spec> --dry        validate + print, don't write
//   node build/make-puzzle.js <spec> --seed=7     try a different Trails grid / Mini layout
//
// The spec holds the creative parts (word, clues, groups, theme words).
// This script does the parts that need exact computation: the Mini
// layout, the Trails letter grid, the Hive word list (from the ENABLE
// dictionary), and validation of all five games. Exits non-zero with a
// list of problems if anything is off, so a bad puzzle never ships.
// ============================================================

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2);
const specPath = args.find(a => !a.startsWith('--'));
const DRY = args.includes('--dry');
const seedArg = (args.find(a => a.startsWith('--seed=')) || '').split('=')[1];

if (!specPath) {
  console.error('usage: node build/make-puzzle.js <spec.json> [--dry] [--seed=N]');
  process.exit(2);
}

const problems = [];
const warnings = [];
const problem = m => problems.push(m);
const warn = m => warnings.push(m);

function bail() {
  console.error('\nPuzzle NOT written. Fix these in the spec and run again:');
  problems.forEach(p => console.error('  - ' + p));
  process.exit(1);
}

let spec;
try { spec = JSON.parse(fs.readFileSync(specPath, 'utf8')); }
catch (e) { console.error('Could not read spec: ' + e.message); process.exit(2); }

// ── Seeded randomness so a spec always builds the same puzzle ──
function hash(s) { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0) || 1; }
let seed = seedArg ? (+seedArg || 1) : hash(String(spec.date) + String(spec.word));
function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

const up = s => String(s || '').toUpperCase().trim();

// ── Basics ─────────────────────────────────────────────────
const WORD = up(spec.word);
if (!/^[A-Z]{5,7}$/.test(WORD)) problem('word must be 5 to 7 letters A-Z (got "' + spec.word + '")');
if (!/^\d{4}-\d{2}-\d{2}$/.test(spec.date || '')) problem('date must look like YYYY-MM-DD');
if (!spec.emoji) problem('emoji is required (used in share text)');
if (problems.length) bail();

// ============================================================
// THE MINI: every entry is WORD. Search every placement of 2-4 copies
// on a small square grid and keep the best legal crossword.
// ============================================================
function buildMini(W, clues) {
  const L = W.length;
  let best = null, bestScore = null, ties = [];

  for (let N = L; N <= L + 2; N++) {
    const places = [];
    for (let r = 0; r < N; r++) for (let c = 0; c + L <= N; c++) places.push({ dir: 'across', row: r, col: c });
    for (let c = 0; c < N; c++) for (let r = 0; r + L <= N; r++) places.push({ dir: 'down', row: r, col: c });
    const cellsOf = p => Array.from({ length: L }, (_, i) => [p.row + (p.dir === 'down' ? i : 0), p.col + (p.dir === 'across' ? i : 0), W[i]]);

    const chosen = [];
    const grid = new Map();

    const legal = () => {
      // Every run of 2+ white cells must be exactly one of our entries
      const white = (r, c) => grid.has(r + ',' + c);
      for (const dir of ['across', 'down']) {
        for (let a = 0; a < N; a++) {
          let b = 0;
          while (b < N) {
            const [r, c] = dir === 'across' ? [a, b] : [b, a];
            if (!white(r, c)) { b++; continue; }
            let len = 0;
            while (b + len < N && white(...(dir === 'across' ? [a, b + len] : [b + len, a]))) len++;
            if (len >= 2 && !(len === L && chosen.some(p => p.dir === dir && p.row === r && p.col === c))) return false;
            b += len;
          }
        }
      }
      // All white cells connected
      const keys = [...grid.keys()];
      const seen = new Set([keys[0]]), stack = [keys[0]];
      while (stack.length) {
        const [r, c] = stack.pop().split(',').map(Number);
        for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const k = (r + dr) + ',' + (c + dc);
          if (grid.has(k) && !seen.has(k)) { seen.add(k); stack.push(k); }
        }
      }
      return seen.size === keys.length;
    };

    const score = () => {
      const across = chosen.filter(p => p.dir === 'across').length;
      const sym = [...grid.keys()].every(k => { const [r, c] = k.split(',').map(Number); return grid.has((N - 1 - r) + ',' + (N - 1 - c)); });
      // More entries first, then smaller grid, then symmetry, then a balance of across/down
      return [chosen.length, -N, sym ? 1 : 0, Math.min(across, chosen.length - across)];
    };
    const better = (a, b) => { for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1; return 0; };

    const rec = start => {
      if (chosen.length >= 2 && legal()) {
        const s = score();
        const cmp = bestScore ? better(s, bestScore) : 1;
        const snap = { N, entries: chosen.map(p => ({ ...p })) };
        if (cmp > 0) { bestScore = s; ties = [snap]; }
        else if (cmp === 0) ties.push(snap);
      }
      if (chosen.length === 4) return;
      for (let i = start; i < places.length; i++) {
        const cells = cellsOf(places[i]);
        if (cells.some(([r, c, ch]) => grid.has(r + ',' + c) && grid.get(r + ',' + c) !== ch)) continue;
        if (chosen.some(p => p.dir === places[i].dir && cellsOf(p).some(([r, c]) => cells.some(x => x[0] === r && x[1] === c)))) continue;
        const added = cells.filter(([r, c]) => !grid.has(r + ',' + c));
        added.forEach(([r, c, ch]) => grid.set(r + ',' + c, ch));
        chosen.push(places[i]);
        rec(i + 1);
        chosen.pop();
        added.forEach(([r, c]) => grid.delete(r + ',' + c));
      }
    };
    rec(0);
  }

  if (!ties.length) { problem('Mini: no legal crossword layout for ' + W); return null; }
  best = ties[Math.floor(rnd() * ties.length)];

  // Standard crossword numbering, row by row
  const starts = {};
  best.entries.forEach(e => { starts[e.row + ',' + e.col] = true; });
  let n = 0;
  const numAt = {};
  for (let r = 0; r < best.N; r++) for (let c = 0; c < best.N; c++) if (starts[r + ',' + c]) numAt[r + ',' + c] = ++n;
  const entries = best.entries
    .map(e => ({ num: numAt[e.row + ',' + e.col], dir: e.dir, row: e.row, col: e.col, answer: W }))
    .sort((a, b) => a.num - b.num || (a.dir === 'across' ? -1 : 1));

  if (!Array.isArray(clues) || clues.length < entries.length) {
    problem('Mini: the layout has ' + entries.length + ' entries but only ' + (clues ? clues.length : 0) + ' clues were given (give 4)');
    return null;
  }
  const cleanClues = clues.map(c => String(c).trim()).filter(Boolean);
  if (new Set(cleanClues.map(c => c.toLowerCase())).size !== cleanClues.length) problem('Mini: clues must all be different');
  cleanClues.forEach(c => { if (new RegExp('\\b' + W + '\\b', 'i').test(c)) problem('Mini: a clue gives away the answer: "' + c + '"'); });
  entries.forEach((e, i) => { e.clue = cleanClues[i]; });
  return { size: best.N, entries };
}

// ============================================================
// LINKS: four groups of four, easiest first
// ============================================================
function buildLinks(groups) {
  const TONES = [['mustard', '🟨'], ['relish', '🟩'], ['bun', '🟧'], ['ketchup', '🟥']];
  if (!Array.isArray(groups) || groups.length !== 4) { problem('Links: need exactly 4 groups'); return null; }
  const all = [];
  const out = groups.map((g, i) => {
    const words = (g.words || []).map(up);
    if (!g.name) problem('Links: group ' + (i + 1) + ' needs a name');
    if (words.length !== 4) problem('Links: group "' + g.name + '" needs exactly 4 words');
    words.forEach(w => {
      if (!/^[A-Z0-9' &.-]{2,12}$/.test(w)) problem('Links: "' + w + '" must be 2-12 characters (letters, digits, spaces, \' & . -)');
      all.push(w);
    });
    return { name: String(g.name).trim(), tone: TONES[i][0], emoji: TONES[i][1], words };
  });
  const dupes = all.filter((w, i) => all.indexOf(w) !== i);
  if (dupes.length) problem('Links: repeated words: ' + [...new Set(dupes)].join(', '));
  return { groups: out };
}

// ============================================================
// THE HIVE: seven letters from a pangram; words come from ENABLE
// ============================================================
function buildHive(h) {
  if (!h || !h.pangram || !h.center) { problem('Hive: needs "pangram" and "center"'); return null; }
  const pangram = up(h.pangram);
  const letters = [...new Set(pangram)];
  const center = up(h.center);
  if (letters.length !== 7) { problem('Hive: pangram "' + pangram + '" has ' + letters.length + ' different letters; it needs exactly 7'); return null; }
  if (!letters.includes(center) || center.length !== 1) { problem('Hive: center must be one of the pangram letters'); return null; }

  const dictFile = path.join(__dirname, 'puzzle', 'words.txt');
  const dict = fs.readFileSync(dictFile, 'utf8').split(/\r?\n/).map(up).filter(Boolean);
  const dictSet = new Set(dict);
  const fits = w => w.length >= 4 && w.includes(center) && [...w].every(ch => letters.includes(ch));

  if (!dictSet.has(pangram)) problem('Hive: pangram "' + pangram + '" is not in the dictionary (build/puzzle/words.txt)');
  const exclude = new Set((h.exclude || []).map(up));
  const include = (h.include || []).map(up);
  include.forEach(w => { if (!fits(w)) problem('Hive: include word "' + w + '" breaks the hive rules (4+ letters, uses the center, only hive letters)'); });

  const words = [...new Set(dict.filter(fits).concat(include))].filter(w => !exclude.has(w)).sort();
  if (!words.includes(pangram)) problem('Hive: the pangram was excluded');
  const pangrams = words.filter(w => letters.every(l => w.includes(l)));
  if (words.length < 20) problem('Hive: only ' + words.length + ' words; pick letters that make more words');
  if (words.length > 110) warn('Hive: ' + words.length + ' words is a lot; consider excluding obscure ones');

  const outer = shuffle(letters.filter(l => l !== center));
  return { center, outer, words, pangrams, topRank: String(h.topRank || 'Top Banana').trim() };
}

// ============================================================
// TRAILS: 6x8 grid, every cell in exactly one word, spangram runs
// from the left edge to the right edge
// ============================================================
function buildTrails(t) {
  const COLS = 6, ROWS = 8;
  if (!t || !t.theme || !t.spangram || !Array.isArray(t.words)) { problem('Trails: needs "theme", "spangram" and "words"'); return null; }
  const SPAN = up(t.spangram).replace(/\s+/g, '');
  const words = t.words.map(w => up(w).replace(/\s+/g, ''));
  if (!/^[A-Z]{6,12}$/.test(SPAN)) problem('Trails: spangram must be 6-12 letters so it can cross the 6-wide board');
  words.forEach(w => { if (!/^[A-Z]{4,9}$/.test(w)) problem('Trails: theme word "' + w + '" must be 4-9 letters'); });
  if (new Set(words.concat(SPAN)).size !== words.length + 1) problem('Trails: words must all be different (and not repeat the spangram)');
  const total = words.reduce((s, w) => s + w.length, SPAN.length);
  if (total !== COLS * ROWS) problem('Trails: letters must add up to exactly ' + (COLS * ROWS) + ' (spangram + theme words = ' + total + '). Add, drop or swap a word.');
  if (problems.length) return null;

  const nb = (r, c) => { const o = []; for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { if (!dr && !dc) continue; const R = r + dr, C = c + dc; if (R >= 0 && R < ROWS && C >= 0 && C < COLS) o.push([R, C]); } return o; };
  const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  const paths = {};
  // Two diagonal moves that cross each other make the board unreadable
  const diag = new Set();
  const dk = (a, b) => a + '|' + b;
  const crosses = (a, b) => a[0] !== b[0] && a[1] !== b[1] && (diag.has(dk([a[0], b[1]], [b[0], a[1]])) || diag.has(dk([b[0], a[1]], [a[0], b[1]])));
  const addDiag = (a, b) => { if (a[0] !== b[0] && a[1] !== b[1]) { diag.add(dk(a, b)); return true; } return false; };

  let steps = 0;
  const emptyNeighbors = (r, c) => nb(r, c).filter(([a, b]) => !grid[a][b]).length;

  // Every walled-off empty region must be fillable by some subset of the
  // words still to place, or this branch can't work.
  function regionsOk(rem) {
    const sums = new Set([0]);
    rem.forEach(w => [...sums].forEach(s => sums.add(s + w.length)));
    const seen = new Set();
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      if (grid[r][c] || seen.has(r + ',' + c)) continue;
      let n = 0; const st = [[r, c]]; seen.add(r + ',' + c);
      while (st.length) { const [R, C] = st.pop(); n++; for (const [a, b] of nb(R, C)) if (!grid[a][b] && !seen.has(a + ',' + b)) { seen.add(a + ',' + b); st.push([a, b]); } }
      if (!sums.has(n)) return false;
    }
    return true;
  }

  // Lay word[idx] at (r, c), then keep walking in `dir` (+1 toward the end,
  // -1 toward the start) until that end of the word is placed.
  function walk(word, idx, dir, r, c, cells, done) {
    if (grid[r][c]) return false;
    grid[r][c] = word[idx]; cells.push([r, c]);
    const next = idx + dir;
    if ((next < 0 || next >= word.length) ? done() : stepFrom(word, next, dir, r, c, cells, done)) return true;
    grid[r][c] = null; cells.pop(); return false;
  }
  function stepFrom(word, idx, dir, r, c, cells, done) {
    for (const [R, C] of shuffle(nb(r, c))) {
      if (grid[R][C] || crosses([r, c], [R, C])) continue;
      const d = addDiag([r, c], [R, C]);
      if (walk(word, idx, dir, R, C, cells, done)) return true;
      if (d) diag.delete(dk([r, c], [R, C]));
    }
    return false;
  }

  function solve(rem) {
    if (++steps > 60000) throw new Error('limit');
    // Work on the most boxed-in empty cell. If it has one open neighbor it
    // must be the end of a word; otherwise a word may pass through it.
    let best = null, bestN = 9;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      if (grid[r][c]) continue;
      const n = emptyNeighbors(r, c);
      if (n === 0) return false;           // an orphan cell can't be part of any word
      if (n < bestN) { best = [r, c]; bestN = n; }
    }
    if (!best) return rem.length === 0;
    if (!regionsOk(rem)) return false;

    for (const w of shuffle(rem)) {
      const spots = bestN === 1 ? [0, w.length - 1] : shuffle([...Array(w.length).keys()]);
      for (const i of spots) {
        const fwd = [], back = [];
        const finish = () => {
          paths[w] = back.slice().reverse().concat(fwd);
          if (solve(rem.filter(x => x !== w))) return true;
          delete paths[w]; return false;
        };
        if (walk(w, i, 1, best[0], best[1], fwd, () => i === 0 ? finish() : stepFrom(w, i - 1, -1, best[0], best[1], back, finish))) return true;
      }
    }
    return false;
  }
  // Spangram: a random walk from column 0 that lands on column 5 on its last letter
  function spanWalk() {
    const p = [];
    const go = (r, c) => {
      p.push([r, c]); grid[r][c] = SPAN[p.length - 1];
      if (p.length === SPAN.length) { if (c === COLS - 1) return true; }
      else {
        const left = SPAN.length - p.length;
        for (const [R, C] of shuffle(nb(r, c))) {
          if (grid[R][C] || C === 0 || (COLS - 1 - C) > left - 1 || (C === COLS - 1 && left > 1) || crosses([r, c], [R, C])) continue;
          const d = addDiag([r, c], [R, C]);
          if (go(R, C)) return true;
          if (d) diag.delete(dk([r, c], [R, C]));
        }
      }
      grid[r][c] = null; p.pop(); return false;
    };
    return go(Math.floor(rnd() * ROWS), 0) ? p : null;
  }

  for (let attempt = 0; attempt < 300; attempt++) {
    grid.forEach(row => row.fill(null)); diag.clear(); Object.keys(paths).forEach(k => delete paths[k]); steps = 0;
    const sp = spanWalk();
    if (!sp) continue;
    try {
      if (solve(words)) {
        paths[SPAN] = sp;
        const ordered = {}; [SPAN].concat(words).forEach(w => { ordered[w] = paths[w]; });
        return { theme: String(t.theme).trim(), cols: COLS, rows: ROWS, grid: grid.map(r => r.join('')), spangram: SPAN, paths: ordered };
      }
    } catch (e) { /* too slow, reshuffle */ }
  }
  problem('Trails: could not fit these words in a 6x8 grid. Try --seed=N, or swap a word for one with a different length');
  return null;
}

// ── Build ──────────────────────────────────────────────────
const wordle = { answer: WORD };
const mini   = buildMini(WORD, spec.mini && spec.mini.clues);
const links  = buildLinks(spec.links);
const hive   = buildHive(spec.hive);
const trails = buildTrails(spec.trails);
if (problems.length) bail();

// ── Independent re-check of what we built ──────────────────
(function verify() {
  // Mini: letters agree at every crossing
  const cells = {};
  mini.entries.forEach(e => [...e.answer].forEach((ch, i) => {
    const k = (e.row + (e.dir === 'down' ? i : 0)) + ',' + (e.col + (e.dir === 'across' ? i : 0));
    if (cells[k] && cells[k] !== ch) problem('verify: Mini crossing mismatch at ' + k);
    cells[k] = ch;
  }));
  // Trails: spelling, adjacency, coverage, spangram edges
  const used = {};
  Object.entries(trails.paths).forEach(([w, p]) => {
    if (p.map(([r, c]) => trails.grid[r][c]).join('') !== w) problem('verify: Trails path for ' + w + ' does not spell it');
    p.forEach(([r, c], i) => {
      if (used[r + ',' + c]) problem('verify: Trails cell ' + r + ',' + c + ' used twice');
      used[r + ',' + c] = true;
      if (i && Math.max(Math.abs(r - p[i - 1][0]), Math.abs(c - p[i - 1][1])) !== 1) problem('verify: Trails path for ' + w + ' skips a cell');
    });
  });
  if (Object.keys(used).length !== trails.cols * trails.rows) problem('verify: Trails grid not fully covered');
  const sc = trails.paths[trails.spangram].map(p => p[1]);
  if (!sc.includes(0) || !sc.includes(trails.cols - 1)) problem('verify: spangram does not touch both side edges');
  // Hive: every word obeys the rules
  const L = [hive.center].concat(hive.outer);
  hive.words.forEach(w => { if (w.length < 4 || !w.includes(hive.center) || [...w].some(ch => !L.includes(ch))) problem('verify: Hive word ' + w + ' breaks the rules'); });
})();
if (problems.length) bail();

const id = spec.date + '-' + WORD.toLowerCase();
const puzzle = { id, date: spec.date, word: WORD, emoji: spec.emoji, wordle, mini, links, hive, trails };

// ── Report ─────────────────────────────────────────────────
const points = w => (w.length === 4 ? 1 : w.length) + (hive.pangrams.includes(w) ? 7 : 0);
const maxPts = hive.words.reduce((s, w) => s + points(w), 0);
console.log('Puzzle ' + id + (DRY ? ' (dry run, nothing written)' : ''));
console.log('  Six Letters  ' + WORD);
console.log('  The Mini     ' + mini.size + 'x' + mini.size + ', ' + mini.entries.length + ' entries');
const g = {}; mini.entries.forEach(e => [...e.answer].forEach((ch, i) => { g[(e.row + (e.dir === 'down' ? i : 0)) + ',' + (e.col + (e.dir === 'across' ? i : 0))] = ch; }));
for (let r = 0; r < mini.size; r++) { let s = ''; for (let c = 0; c < mini.size; c++) s += g[r + ',' + c] || '#'; console.log('               ' + s); }
mini.entries.forEach(e => console.log('               ' + e.num + (e.dir === 'across' ? 'A' : 'D') + '  ' + e.clue));
console.log('  Links        ' + links.groups.map(x => x.name).join(' / '));
console.log('  The Hive     ' + hive.center + ' + ' + hive.outer.join('') + ', ' + hive.words.length + ' words, ' + maxPts + ' pts, pangrams: ' + hive.pangrams.join(', ') + ', top rank "' + hive.topRank + '"');
console.log('               ' + hive.words.join(' '));
console.log('  Trails       "' + trails.theme + '", spangram ' + trails.spangram + ', ' + Object.keys(trails.paths).length + ' words');
trails.grid.forEach(r => console.log('               ' + r.split('').join(' ')));
warnings.forEach(w => console.log('  warning: ' + w));

if (DRY) process.exit(0);

let json = JSON.stringify(puzzle, null, 2).replace(/\[\s+(\d+),\s+(\d+)\s+\]/g, '[$1, $2]');
const out = '// puzzle.js: today\'s puzzle for games.html.\n' +
  '// Generated by build/make-puzzle.js from build/puzzle/specs/' + path.basename(specPath) + '. Don\'t hand-edit;\n' +
  '// change the spec and rebuild.\n' +
  'window.PUZZLE = ' + json + ';\n';
fs.writeFileSync(path.join(ROOT, 'puzzle.js'), out);
console.log('\nWrote puzzle.js');
