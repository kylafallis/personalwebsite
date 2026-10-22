// ============================================================
// games-core.js: Shared setup for the daily puzzles
// Date + puzzle number, storage, sharing, tabs, and the tracker.
// Each game file calls Games.register(id, summary) where summary()
// returns { state: 'new' | 'playing' | 'done', label, quality 0..1 }.
// ============================================================

window.Games = (function () {

  // ── DAILY SETUP ────────────────────────────────────────────
  // Today's content lives in puzzle.js (built by build/make-puzzle.js).
  // Puzzle No. 1 is launch day; the number comes from the puzzle's own
  // date, so a late update never shows tomorrow's number on old content.
  const P = window.PUZZLE;
  const LAUNCH = new Date(2026, 9, 21); // Oct 21, 2026 (month is 0-based)

  const [py, pm, pd] = P.date.split('-').map(Number);
  const puzzleDay = new Date(py, pm - 1, pd);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const puzzleNo = Math.max(1, Math.round((puzzleDay - LAUNCH) / 86400000) + 1);

  // Progress is keyed to the puzzle itself, so new content always
  // starts fresh even if it lands mid-day.
  // Storage can throw (private mode, blocked cookies), so the games
  // must still work when nothing persists.
  function load(name) {
    try { return JSON.parse(localStorage.getItem('games:' + P.id + ':' + name)); }
    catch (e) { return null; }
  }
  function save(name, value) {
    try { localStorage.setItem('games:' + P.id + ':' + name, JSON.stringify(value)); }
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
    puzzleDay.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

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

  // ── TIMING ─────────────────────────────────────────────────
  // Each game's clock runs from the first move in it (Games.touch) to the
  // update where it reports done. The total feeds the leaderboard.
  const timing = load('timing') || {};
  function touch(id) {
    if (timing[id]) return;
    timing[id] = { start: Date.now() };
    save('timing', timing);
  }
  function totalTime() {
    let ms = 0;
    for (const id of ids) {
      const t = timing[id];
      if (!t || !t.start || !t.end) return null;   // finished before timing existed
      ms += t.end - t.start;
    }
    return ms;
  }
  let progress = { done: 0, total: ids.length, score: null, timeMs: null };

  function update() {
    let done = 0, total = 0;
    ids.forEach((id, i) => {
      const sum = summaries[id] ? summaries[id]() : { state: 'new', label: '' };
      if (sum.state === 'done' && timing[id] && !timing[id].end) { timing[id].end = Date.now(); save('timing', timing); }
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

    progress = { done, total: ids.length, score: done ? Math.round(total / done * 100) : null, timeMs: done === ids.length ? totalTime() : null };
    if (allIn) document.dispatchEvent(new CustomEvent('games:progress', { detail: progress }));
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
    prizeEl.remove();
    prizeEl = null;
    document.body.style.overflow = '';
    document.dispatchEvent(new CustomEvent('games:prize-closed'));
  }

  // A popup over the page: the intro card first, then the video in the same window
  function prize(skipIntro) {
    if (prizeEl) return;
    prizeEl = document.createElement('div');
    prizeEl.className = 'prize';
    prizeEl.innerHTML =
      '<div class="prize-window" role="dialog" aria-modal="true" aria-label="Your prize">' +
        '<button type="button" class="prize-close" aria-label="Close">&times;</button>' +
        '<div class="prize-intro">' +
          '<span class="section-label">All five solved</span>' +
          '<h2>You did it. <em>Every single one.</em></h2>' +
          '<p>Unlocking your prize<span class="prize-dots"></span></p>' +
        '</div>' +
      '</div>';
    document.body.appendChild(prizeEl);
    document.body.style.overflow = 'hidden';
    const win = prizeEl.querySelector('.prize-window');
    win.querySelector('.prize-close').addEventListener('click', closePrize);
    win.querySelector('.prize-close').focus();
    // Clicking the dimmed page around the window closes it
    prizeEl.addEventListener('click', e => { if (e.target === prizeEl) closePrize(); });

    loadYouTubeApi();  // fetch the player during the intro so the video starts on time
    setTimeout(() => {
      if (!prizeEl) return;
      const slot = document.createElement('div');
      slot.className = 'prize-video';
      win.appendChild(slot);
      prizeEl.classList.add('is-playing');
      playPrize(slot, win);
    }, skipIntro ? 0 : 2200);
  }

  // ── Video ──────────────────────────────────────────────────
  // The YouTube player API reports when a video refuses to embed (the label
  // limits where this one plays), so the prize can fall back to a button
  // that opens it on YouTube instead of showing a dead player.
  const PRIZE_VIDEO = 'dQw4w9WgXcQ';
  let ytReady = null;
  function loadYouTubeApi() {
    if (ytReady) return ytReady;
    ytReady = new Promise((resolve, reject) => {
      if (window.YT && window.YT.Player) { resolve(window.YT); return; }
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { if (prev) prev(); resolve(window.YT); };
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      s.onerror = reject;
      document.head.appendChild(s);
      setTimeout(() => reject(new Error('timeout')), 8000);
    });
    ytReady.catch(() => { ytReady = null; });  // allow a retry on replay
    return ytReady;
  }

  function prizeFallback(win) {
    const slot = win.querySelector('.prize-video');
    if (slot) slot.remove();
    if (win.querySelector('.prize-fallback')) return;
    const box = document.createElement('div');
    box.className = 'prize-fallback';
    box.innerHTML =
      '<span class="section-label">Your prize is ready</span>' +
      '<h2>One more click.</h2>' +
      '<a class="btn btn-primary" target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=' + PRIZE_VIDEO + '">Claim Prize <span class="arrow">→</span></a>';
    box.querySelector('a').addEventListener('click', () => setTimeout(closePrize, 300));
    win.appendChild(box);
  }

  function playPrize(slot, win) {
    loadYouTubeApi().then(YT => {
      if (!prizeEl) return;
      new YT.Player(slot, {
        videoId: PRIZE_VIDEO,
        host: 'https://www.youtube-nocookie.com',
        playerVars: { autoplay: 1, rel: 0, playsinline: 1 },
        events: {
          onReady: e => e.target.playVideo(),
          onError: () => prizeFallback(win)   // 101/150: embedding not allowed here
        }
      });
    }, () => prizeFallback(win));
  }

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePrize(); });

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
    puzzle: P, puzzleNo, load, save, copyText, shuffle, register, update, touch,
    rickroll: () => prize(true),
    get progress() { return progress; },
    get active() { return active; }
  };

})();
