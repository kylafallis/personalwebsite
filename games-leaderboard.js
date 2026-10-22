// ============================================================
// games-leaderboard.js: Daily + all-time leaderboard
// Scores live in a Google Sheet behind an Apps Script web app;
// see build/leaderboard/Code.gs for the backend and setup steps.
// ============================================================

(function () {

  // Paste the Apps Script web app URL (ends in /exec) here.
  // Until it's set, the leaderboard stays hidden.
  const LEADERBOARD_URL = 'https://script.google.com/macros/s/AKfycbxXQVP9A63eLAiiRxpKIyZjcAJHSmpLxN37dnqkcQDMCzJ5gThf-AE7v20aH8XbbW_U/exec';

  const rootEl = document.getElementById('leaderboard');
  if (!LEADERBOARD_URL || !rootEl) return;
  rootEl.hidden = false;

  const P = Games.puzzle;
  const formEl  = document.getElementById('lb-form');
  const nameEl  = document.getElementById('lb-name');
  const sumEl   = document.getElementById('lb-summary');
  const errEl   = document.getElementById('lb-error');
  const noteEl  = document.getElementById('lb-note');
  const tableEl = document.getElementById('lb-table');
  const tabEls  = Array.from(rootEl.querySelectorAll('[data-board]'));

  // A random id per browser, so a player is one row per day and their
  // all-time total follows them even if they change their name.
  function store(key, val) {
    try {
      if (val === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, val);
    } catch (e) { return null; }
  }
  let player = store('games:player');
  if (!player || !/^[a-z0-9-]{8,40}$/.test(player)) {
    player = (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
      : Array.from({ length: 4 }, () => Math.random().toString(36).slice(2, 8)).join('-');
    store('games:player', player);
  }
  nameEl.value = store('games:name') || '';

  let board = 'today';
  let data = null;
  let submitted = !!Games.load('submitted');

  function fmtTime(ms) {
    if (ms === null || ms === undefined) return '—';
    const s = Math.round(ms / 1000);
    const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
    return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(sec).padStart(2, '0');
  }

  function cell(tag, text, cls) {
    const c = document.createElement(tag);
    c.textContent = text;
    if (cls) c.className = cls;
    return c;
  }

  function render() {
    tabEls.forEach(t => t.setAttribute('aria-selected', t.dataset.board === board));
    tableEl.innerHTML = '';
    if (!data) return;

    const today = board === 'today';
    const rows = today ? data.today : data.allTime;
    const mine = today ? data.myToday : data.myAllTime;

    const head = document.createElement('tr');
    (today ? ['#', 'Name', 'Score', 'Time'] : ['#', 'Name', 'Days', 'Avg', 'Points'])
      .forEach((h, i) => head.appendChild(cell('th', h, i > 1 ? 'num' : '')));
    const thead = document.createElement('thead');
    thead.appendChild(head);
    tableEl.appendChild(thead);

    const body = document.createElement('tbody');
    const addRow = r => {
      const tr = document.createElement('tr');
      if (r.me) tr.className = 'me';
      tr.appendChild(cell('td', r.rank, 'rank'));
      const nameTd = cell('td', r.name, 'name');
      if (r.me) nameTd.appendChild(cell('span', 'you', 'lb-you'));
      tr.appendChild(nameTd);
      if (today) {
        tr.appendChild(cell('td', r.score + '%', 'num'));
        tr.appendChild(cell('td', fmtTime(r.timeMs), 'num'));
      } else {
        tr.appendChild(cell('td', r.days, 'num'));
        tr.appendChild(cell('td', r.avg + '%', 'num'));
        tr.appendChild(cell('td', r.total, 'num'));
      }
      body.appendChild(tr);
    };
    rows.forEach(addRow);
    // If you're below the cut, still show where you stand
    if (mine && !rows.some(r => r.me)) {
      const gap = document.createElement('tr');
      gap.className = 'gap';
      gap.appendChild(cell('td', '…'));
      gap.firstChild.colSpan = today ? 4 : 5;
      body.appendChild(gap);
      addRow(mine);
    }
    if (!rows.length) {
      const empty = document.createElement('tr');
      empty.className = 'empty';
      empty.appendChild(cell('td', today ? 'No one has finished today\'s five yet. Be the first.' : 'No scores yet.'));
      empty.firstChild.colSpan = today ? 4 : 5;
      body.appendChild(empty);
    }
    tableEl.appendChild(body);
  }

  function renderNote() {
    const prog = Games.progress;
    const allDone = prog.done === prog.total;
    formEl.hidden = !allDone || submitted;
    if (allDone && !submitted) {
      sumEl.textContent = 'You finished all five: ' + prog.score + '% in ' + fmtTime(prog.timeMs) + '.';
    }
    if (submitted && data && data.myToday) {
      noteEl.textContent = "You're #" + data.myToday.rank + ' of ' + data.todayCount + ' today.';
    } else if (!allDone) {
      noteEl.textContent = 'Finish all five puzzles to get on today\'s board.';
    } else {
      noteEl.textContent = '';
    }
  }

  function load() {
    const url = LEADERBOARD_URL + '?puzzle=' + encodeURIComponent(P.id) + '&player=' + encodeURIComponent(player) + '&t=' + Date.now();
    return fetch(url)
      .then(r => r.json())
      .then(d => { data = d; render(); renderNote(); })
      .catch(() => { noteEl.textContent = 'The leaderboard is taking a break. Try again in a bit.'; });
  }

  // ── A joke "invoice" for one particular friend ─────────────
  // Purely a prank: there's no payment form and nothing can be charged.
  // "Pay Now" just opens the prize video. Shows once, closes normally.
  const BILLED = /^lily( larson)?$/i;
  function invoice(name) {
    const el = document.createElement('div');
    el.className = 'prize';
    el.innerHTML =
      '<div class="prize-window invoice" role="dialog" aria-modal="true" aria-label="Invoice">' +
        '<button type="button" class="prize-close" aria-label="Close">&times;</button>' +
        '<span class="section-label">Invoice No. 000001 &middot; Due immediately</span>' +
        '<h2>Leaderboard Processing Fee</h2>' +
        '<p class="invoice-to">Billed to: <strong></strong><br>Issued by: His Royal Highness, Nigerian Prince</p>' +
        '<dl class="invoice-lines">' +
          '<dt>Premium leaderboard placement</dt><dd>$9,999,999.00</dd>' +
          '<dt>Royal convenience fee</dt><dd>$0.99</dd>' +
          '<dt class="total">Total due</dt><dd class="total">$9,999,999.99</dd>' +
        '</dl>' +
        '<button type="button" class="btn btn-primary invoice-pay">Pay Now <span class="arrow">→</span></button>' +
      '</div>';
    el.querySelector('.invoice-to strong').textContent = name;
    const close = () => { el.remove(); document.body.style.overflow = ''; document.removeEventListener('keydown', onKey); };
    document.addEventListener('keydown', onKey);
    el.querySelector('.invoice-pay').addEventListener('click', () => { close(); Games.rickroll(); });
    document.body.appendChild(el);
    document.body.style.overflow = 'hidden';
    el.querySelector('.invoice-pay').focus();
  }

  formEl.addEventListener('submit', e => {
    e.preventDefault();
    const prog = Games.progress;
    const name = nameEl.value.replace(/\s+/g, ' ').trim();
    errEl.textContent = '';
    if (name.length < 2) { errEl.textContent = 'Names need at least 2 characters.'; return; }
    if (BILLED.test(name)) invoice(name);
    const btn = formEl.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'Adding…';
    // text/plain keeps this a "simple" request, which Apps Script accepts cross-origin
    fetch(LEADERBOARD_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ puzzle: P.id, date: P.date, player, name, score: prog.score, timeMs: prog.timeMs })
    })
      .then(r => r.json())
      .then(d => {
        if (!d.ok && !/already/i.test(d.error || '')) throw new Error(d.error || 'Something went wrong.');
        submitted = true;
        Games.save('submitted', true);
        store('games:name', name);
        if (d.ok) data = d;
        board = 'today';
        return d.ok ? (render(), renderNote()) : load();
      })
      .catch(err => { errEl.textContent = err.message || 'Could not reach the leaderboard. Try again.'; })
      .then(() => { btn.disabled = false; btn.textContent = 'Add Me'; });
  });

  tabEls.forEach(t => t.addEventListener('click', () => { board = t.dataset.board; render(); }));
  document.getElementById('lb-refresh').addEventListener('click', load);

  document.addEventListener('games:progress', renderNote);
  // After the prize video, point people at the board
  document.addEventListener('games:prize-closed', () => {
    if (!formEl.hidden) {
      rootEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => nameEl.focus({ preventScroll: true }), 500);
    }
  });

  renderNote();
  load();

})();
