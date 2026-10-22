// ============================================================
// games-wordle.js: Ten Letters
// ============================================================

(function () {

  const ANSWER = 'TROGLODYTE';
  const W_LEN = ANSWER.length;
  const W_TRIES = 6;

  const boardEl = document.getElementById('wordle-board');
  const kbEl    = document.getElementById('wordle-keyboard');
  const msgEl   = document.getElementById('wordle-message');
  const shareEl = document.getElementById('wordle-share');

  const state = Games.load('wordle') || { guesses: [], status: 'playing' };
  let current = '';

  // Two-pass scoring so repeated letters (two O's, two T's) are handled correctly.
  function score(guess) {
    const result = Array(W_LEN).fill('absent');
    const left = {};
    for (let i = 0; i < W_LEN; i++) {
      if (guess[i] === ANSWER[i]) result[i] = 'correct';
      else left[ANSWER[i]] = (left[ANSWER[i]] || 0) + 1;
    }
    for (let i = 0; i < W_LEN; i++) {
      if (result[i] === 'correct') continue;
      if (left[guess[i]]) { result[i] = 'present'; left[guess[i]]--; }
    }
    return result;
  }

  // Build the board
  const rows = [];
  for (let r = 0; r < W_TRIES; r++) {
    const row = document.createElement('div');
    row.className = 'wordle-row';
    row.style.gridTemplateColumns = 'repeat(' + W_LEN + ', minmax(0, 1fr))';
    const tiles = [];
    for (let c = 0; c < W_LEN; c++) {
      const t = document.createElement('div');
      t.className = 'wordle-tile';
      row.appendChild(t);
      tiles.push(t);
    }
    boardEl.appendChild(row);
    rows.push({ el: row, tiles });
  }

  // Build the keyboard
  const KEY_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', '+ZXCVBNM-'];
  const keyEls = {};
  KEY_ROWS.forEach(line => {
    const row = document.createElement('div');
    row.className = 'wordle-key-row';
    line.split('').forEach(k => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'wordle-key';
      if (k === '+') { b.textContent = 'Enter'; b.dataset.key = 'Enter'; b.classList.add('wide'); }
      else if (k === '-') { b.textContent = '⌫'; b.dataset.key = 'Backspace'; b.classList.add('wide'); b.setAttribute('aria-label', 'Backspace'); }
      else { b.textContent = k; b.dataset.key = k; keyEls[k] = b; }
      row.appendChild(b);
    });
    kbEl.appendChild(row);
  });

  const RANK = { absent: 1, present: 2, correct: 3 };
  function paintKeys() {
    const best = {};
    state.guesses.forEach(g => {
      score(g).forEach((s, i) => {
        if (!best[g[i]] || RANK[s] > RANK[best[g[i]]]) best[g[i]] = s;
      });
    });
    Object.keys(keyEls).forEach(k => {
      keyEls[k].classList.remove('correct', 'present', 'absent');
      if (best[k]) keyEls[k].classList.add(best[k]);
    });
  }

  function paintRow(r, word, result, animate) {
    rows[r].tiles.forEach((t, i) => {
      t.textContent = word[i] || '';
      t.classList.toggle('filled', !!word[i]);
      if (result) {
        const apply = () => t.classList.add(result[i], 'revealed');
        if (animate) setTimeout(apply, i * 220); else apply();
      }
    });
  }

  function shareText() {
    const tries = state.status === 'won' ? state.guesses.length : 'X';
    const grid = state.guesses.map(g =>
      score(g).map(s => s === 'correct' ? '🟩' : s === 'present' ? '🟨' : '⬜').join('')
    ).join('\n');
    return 'Ten Letters No. ' + Games.puzzleNo + ' ' + tries + '/' + W_TRIES + '\n' + grid + '\nkylafallis.com/games';
  }

  function finish() {
    const lines = ['Genius.', 'Magnificent.', 'Impressive.', 'Splendid.', 'Great.', 'Phew.'];
    msgEl.textContent = state.status === 'won'
      ? lines[state.guesses.length - 1] + ' The answer was ' + ANSWER + '.'
      : 'The answer was ' + ANSWER + '. Come back tomorrow.';
    shareEl.hidden = false;
  }

  function flash(msg) {
    msgEl.textContent = msg;
    const row = rows[state.guesses.length].el;
    row.classList.remove('shake');
    void row.offsetWidth; // restart animation
    row.classList.add('shake');
    setTimeout(() => { if (state.status === 'playing') msgEl.textContent = ''; }, 1400);
  }

  function press(key) {
    if (state.status !== 'playing') return;
    const r = state.guesses.length;
    if (key === 'Enter') {
      if (current.length < W_LEN) { flash('Not enough letters'); return; }
      state.guesses.push(current);
      paintRow(r, current, score(current), true);
      if (current === ANSWER) state.status = 'won';
      else if (state.guesses.length === W_TRIES) state.status = 'lost';
      current = '';
      Games.save('wordle', state);
      setTimeout(() => {
        paintKeys();
        if (state.status !== 'playing') finish();
        Games.update();
      }, W_LEN * 220 + 200);
    } else if (key === 'Backspace') {
      current = current.slice(0, -1);
      paintRow(r, current);
    } else if (/^[A-Z]$/.test(key) && current.length < W_LEN) {
      current += key;
      paintRow(r, current);
    }
  }

  kbEl.addEventListener('click', e => {
    const b = e.target.closest('.wordle-key');
    if (b) { press(b.dataset.key); b.blur(); }
  });

  // Physical keyboard only drives this game while its tab is open.
  document.addEventListener('keydown', e => {
    if (Games.active !== 'wordle') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.closest && e.target.closest('input, textarea')) return;
    const k = e.key.length === 1 ? e.key.toUpperCase() : e.key;
    if (k === 'Enter' || k === 'Backspace' || /^[A-Z]$/.test(k)) {
      if (k === 'Enter' && e.target.closest && e.target.closest('a, button:not(.wordle-key):not([role="tab"])')) return;
      e.preventDefault();
      press(k);
    }
  });

  shareEl.addEventListener('click', () => Games.copyText(shareText(), shareEl));

  // Restore today's progress
  state.guesses.forEach((g, r) => paintRow(r, g, score(g), false));
  paintKeys();
  if (state.status !== 'playing') finish();

  Games.register('wordle', () => {
    const n = state.guesses.length;
    if (state.status === 'won')  return { state: 'done', label: n + '/6', quality: 1 - (n - 1) * 0.12 };
    if (state.status === 'lost') return { state: 'done', label: 'X/6', quality: 0 };
    if (n) return { state: 'playing', label: n + ' of 6 guesses', quality: 0 };
    return { state: 'new', label: 'Not started' };
  });

})();
