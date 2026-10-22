// ============================================================
// games-core.js: Shared setup for the daily puzzles
// Date + puzzle number, storage, sharing, tabs, and the tracker.
// Each game file calls Games.register(id, summary) where summary()
// returns { state: 'new' | 'playing' | 'done', label, quality 0..1 }.
// ============================================================

window.Games = (function () {

  // ── DAILY SETUP ────────────────────────────────────────────
  // Puzzle No. 1 is launch day. Everything keys off the visitor's
  // local date so the puzzle rolls over at their midnight.
  const LAUNCH = new Date(2026, 9, 21); // Oct 21, 2026 (month is 0-based)

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayKey = today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0');
  const puzzleNo = Math.max(1, Math.round((today - LAUNCH) / 86400000) + 1);

  // Today's theme. Saved progress is keyed to it, so swapping the theme
  // mid-day starts everyone fresh instead of loading old guesses.
  const THEME = 'troglodyte';

  // Storage can throw (private mode, blocked cookies), so the games
  // must still work when nothing persists.
  const storeKey = name => 'games:' + dayKey + ':' + THEME + ':' + name;
  function load(name) {
    try { return JSON.parse(localStorage.getItem(storeKey(name))); }
    catch (e) { return null; }
  }
  function save(name, value) {
    try { localStorage.setItem(storeKey(name), JSON.stringify(value)); }
    catch (e) { /* not persisting is fine */ }
  }

  function copyText(text, btn) {
    const done = () => {
      const label = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = label; }, 1600);
    };
    if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
      navigator.share({ text }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(done, () => window.prompt('Copy your result:', text));
    } else {
      window.prompt('Copy your result:', text);
    }
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ── BANNER ─────────────────────────────────────────────────
  document.getElementById('puzzle-no').textContent = 'No. ' + puzzleNo;
  document.getElementById('puzzle-date').textContent =
    today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const countdownEl = document.getElementById('puzzle-countdown');
  function tick() {
    const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    let s = Math.max(0, Math.floor((midnight - new Date()) / 1000));
    if (s === 0) { location.reload(); return; }
    const h = Math.floor(s / 3600); s %= 3600;
    const m = Math.floor(s / 60);   s %= 60;
    countdownEl.textContent = [h, m, s].map(n => String(n).padStart(2, '0')).join(':');
  }
  tick();
  setInterval(tick, 1000);

  // ── TABS ───────────────────────────────────────────────────
  const tabEls = Array.from(document.querySelectorAll('#games-tabs [role="tab"]'));
  const ids = tabEls.map(t => t.dataset.game);
  const panels = {};
  ids.forEach(id => { panels[id] = document.getElementById('panel-' + id); });
  const summaries = {};
  let active = null;

  tabEls.forEach(t => {
    t.id = 'tab-' + t.dataset.game;
    t.setAttribute('aria-controls', 'panel-' + t.dataset.game);
    panels[t.dataset.game].setAttribute('aria-labelledby', t.id);
  });

  function activate(id, focusTab) {
    if (!panels[id]) return;
    active = id;
    tabEls.forEach(t => {
      const on = t.dataset.game === id;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      t.classList.toggle('active', on);
      if (on && focusTab) t.focus();
    });
    ids.forEach(g => { panels[g].hidden = g !== id; });
    segEls.forEach((s, i) => s.classList.toggle('active', ids[i] === id));
    try { history.replaceState(null, '', '#' + id); } catch (e) {}
  }

  tabEls.forEach((t, i) => {
    t.addEventListener('click', () => activate(t.dataset.game));
    t.addEventListener('keydown', e => {
      const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!step) return;
      e.preventDefault();
      activate(ids[(i + step + ids.length) % ids.length], true);
    });
  });

  // ── TRACKER ────────────────────────────────────────────────
  const barEl = document.getElementById('tracker-bar');
  const segEls = ids.map(id => {
    const s = document.createElement('button');
    s.type = 'button';
    s.className = 'tracker-seg';
    s.tabIndex = -1;
    s.innerHTML = '<span class="tracker-fill"></span>';
    s.addEventListener('click', () => activate(id));
    barEl.appendChild(s);
    return s;
  });

  function tone(q) {
    if (q >= 0.8) return 'great';
    if (q >= 0.5) return 'good';
    if (q > 0)    return 'ok';
    return 'miss';
  }

  function update() {
    let done = 0, total = 0;
    ids.forEach((id, i) => {
      const sum = summaries[id] ? summaries[id]() : { state: 'new', label: '' };
      const seg = segEls[i];
      const q = Math.max(0, Math.min(1, sum.quality || 0));
      seg.dataset.state = sum.state;
      seg.dataset.tone = sum.state === 'new' ? '' : tone(q);
      // Finished games always fill the full segment, so a loss still reads as "done"
      seg.firstChild.style.width = sum.state === 'done' ? '100%' : (sum.state === 'playing' ? Math.max(12, q * 100) + '%' : '0');
      seg.title = tabEls[i].querySelector('.tab-name').textContent + ': ' + sum.label;
      const st = tabEls[i].querySelector('.tab-status');
      st.textContent = sum.label;
      tabEls[i].dataset.state = sum.state;
      if (sum.state === 'done') { done++; total += q; }
    });
    document.getElementById('tracker-count').textContent = done + ' of ' + ids.length + ' done';
    document.getElementById('tracker-score').textContent = done ? Math.round(total / done * 100) + '%' : '—';

    // The prize fires on the move that finishes the last game, not on every
    // page load with everything already done.
    const allIn = Object.keys(summaries).length === ids.length;
    if (allIn && lastDone !== null && lastDone < ids.length && done === ids.length) {
      setTimeout(prize, 900);  // let the game's own "solved" moment land first
    }
    replayEl.hidden = done < ids.length;
    if (allIn) lastDone = done;
  }

  // ── THE PRIZE ──────────────────────────────────────────────
  let lastDone = null;
  const replayEl = document.createElement('button');
  replayEl.type = 'button';
  replayEl.className = 'tracker-replay';
  replayEl.textContent = 'Replay prize';
  replayEl.hidden = true;
  replayEl.addEventListener('click', () => prize(true));
  document.querySelector('.tracker-head').appendChild(replayEl);

  let prizeEl = null;
  function closePrize() {
    if (!prizeEl) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    prizeEl.remove();
    prizeEl = null;
    document.body.style.overflow = '';
  }

  function prize(skipIntro) {
    if (prizeEl) return;
    prizeEl = document.createElement('div');
    prizeEl.className = 'prize';
    prizeEl.setAttribute('role', 'dialog');
    prizeEl.setAttribute('aria-modal', 'true');
    prizeEl.setAttribute('aria-label', 'Your prize');
    prizeEl.innerHTML =
      '<button type="button" class="prize-close" aria-label="Close">&times;</button>' +
      '<div class="prize-intro">' +
        '<span class="section-label">All five solved</span>' +
        '<h2>You did it. <em>Every single one.</em></h2>' +
        '<p>Unlocking your prize<span class="prize-dots"></span></p>' +
      '</div>';
    document.body.appendChild(prizeEl);
    document.body.style.overflow = 'hidden';
    prizeEl.querySelector('.prize-close').addEventListener('click', closePrize);
    prizeEl.querySelector('.prize-close').focus();

    // Fullscreen needs the click/keypress that finished the game, so ask right away
    if (prizeEl.requestFullscreen) prizeEl.requestFullscreen().catch(() => {});

    setTimeout(() => {
      if (!prizeEl) return;
      const frame = document.createElement('iframe');
      frame.className = 'prize-video';
      frame.src = 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&playsinline=1&controls=0';
      frame.title = 'Your prize';
      frame.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
      frame.allowFullscreen = true;
      prizeEl.appendChild(frame);
      prizeEl.classList.add('is-playing');
    }, skipIntro ? 0 : 2200);
  }

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePrize(); });
  document.addEventListener('fullscreenchange', () => {
    // Leaving fullscreen with the browser's own Esc closes the prize too
    if (!document.fullscreenElement && prizeEl && prizeEl.classList.contains('is-playing')) closePrize();
  });

  function register(id, summary) {
    summaries[id] = summary;
    update();
  }

  // Open the tab in the URL, otherwise the first game not finished today
  const fromHash = location.hash.replace('#', '');
  activate(panels[fromHash] ? fromHash : ids[0]);

  window.addEventListener('hashchange', () => activate(location.hash.replace('#', '')));

  window.addEventListener('load', () => {
    if (panels[fromHash]) return;
    const next = ids.find(id => summaries[id] && summaries[id]().state !== 'done');
    if (next) activate(next);
  });

  return {
    dayKey, puzzleNo, THEME, load, save, copyText, shuffle, register, update,
    get active() { return active; }
  };

})();
