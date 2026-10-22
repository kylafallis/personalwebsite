// ============================================================
// games-mini.js: The Mini (crossword)
// ============================================================

(function () {

  const ANSWER = 'HOTDOG';

  // A 6x6 "#" grid: two across and two down, crossing at the O's.
  const SIZE = 6;
  const ENTRIES = [
    { num: 1, dir: 'down',   row: 0, col: 1, clue: 'Show off on the slopes' },
    { num: 2, dir: 'down',   row: 0, col: 4, clue: 'Its sandwich status is hotly debated' },
    { num: 3, dir: 'across', row: 1, col: 0, clue: 'Ballpark staple, often with mustard' },
    { num: 4, dir: 'across', row: 4, col: 0, clue: 'Frank in a bun' }
  ];

  const gridEl  = document.getElementById('xw-grid');
  const cluesEl = document.getElementById('xw-clues');
  const msgEl   = document.getElementById('xw-message');
  const activeClueEl = document.getElementById('xw-active-clue');
  const shareEl = document.getElementById('xw-share');

  // Map out which cells are open and what letter they hold
  const solution = {};
  const numbers = {};
  ENTRIES.forEach(en => {
    numbers[en.row + ',' + en.col] = en.num;
    for (let i = 0; i < ANSWER.length; i++) {
      const r = en.row + (en.dir === 'down' ? i : 0);
      const c = en.col + (en.dir === 'across' ? i : 0);
      solution[r + ',' + c] = ANSWER[i];
    }
  });

  // started is set on the first letter typed, so opening the tab doesn't start the clock
  const state = Games.load('crossword') || { letters: {}, status: 'playing', revealed: false, checks: 0 };
  let sel = { row: 1, col: 0, dir: 'across' };

  const cellEls = {};
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const key = r + ',' + c;
      const cell = document.createElement('div');
      cell.className = 'xw-cell';
      if (!solution[key]) {
        cell.classList.add('block');
      } else {
        cell.setAttribute('role', 'gridcell');
        cell.dataset.key = key;
        if (numbers[key]) {
          const n = document.createElement('span');
          n.className = 'xw-num';
          n.textContent = numbers[key];
          cell.appendChild(n);
        }
        const l = document.createElement('span');
        l.className = 'xw-letter';
        cell.appendChild(l);
        cellEls[key] = cell;
      }
      gridEl.appendChild(cell);
    }
  }

  // Hidden input catches typing so the mobile keyboard opens.
  const input = document.createElement('input');
  input.className = 'xw-input';
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('autocapitalize', 'characters');
  input.setAttribute('aria-label', 'Crossword letter entry');
  gridEl.appendChild(input);

  // Clue lists
  const clueEls = {};
  ['across', 'down'].forEach(dir => {
    const wrap = document.createElement('div');
    wrap.className = 'xw-clue-group';
    const h = document.createElement('h4');
    h.textContent = dir;
    wrap.appendChild(h);
    const ul = document.createElement('ul');
    ENTRIES.filter(en => en.dir === dir).forEach(en => {
      const li = document.createElement('li');
      li.innerHTML = '<span class="xw-clue-num">' + en.num + '</span><span></span>';
      li.lastChild.textContent = en.clue;
      li.addEventListener('click', () => { sel = { row: en.row, col: en.col, dir: en.dir }; render(); input.focus(); });
      ul.appendChild(li);
      clueEls[en.num + dir] = li;
    });
    wrap.appendChild(ul);
    cluesEl.appendChild(wrap);
  });

  function entryAt(row, col, dir) {
    return ENTRIES.find(en => en.dir === dir &&
      (dir === 'across'
        ? en.row === row && col >= en.col && col < en.col + ANSWER.length
        : en.col === col && row >= en.row && row < en.row + ANSWER.length));
  }

  function cellsOf(en) {
    const out = [];
    for (let i = 0; i < ANSWER.length; i++) {
      out.push((en.row + (en.dir === 'down' ? i : 0)) + ',' + (en.col + (en.dir === 'across' ? i : 0)));
    }
    return out;
  }

  function render() {
    // Some cells only belong to one direction; fall back to whichever exists
    if (!entryAt(sel.row, sel.col, sel.dir)) sel.dir = sel.dir === 'across' ? 'down' : 'across';
    const en = entryAt(sel.row, sel.col, sel.dir);
    const word = new Set(cellsOf(en));
    Object.keys(cellEls).forEach(k => {
      const el = cellEls[k];
      el.querySelector('.xw-letter').textContent = state.letters[k] || '';
      el.classList.toggle('in-word', word.has(k));
      el.classList.toggle('selected', k === sel.row + ',' + sel.col);
    });
    Object.keys(clueEls).forEach(k => clueEls[k].classList.toggle('active', k === en.num + en.dir));
    activeClueEl.innerHTML = '<span>' + en.num + (en.dir === 'across' ? 'A' : 'D') + '</span>';
    activeClueEl.appendChild(document.createTextNode(en.clue));
  }

  function move(step) {
    const cells = cellsOf(entryAt(sel.row, sel.col, sel.dir));
    const idx = cells.indexOf(sel.row + ',' + sel.col) + step;
    if (idx >= 0 && idx < cells.length) {
      const [r, c] = cells[idx].split(',').map(Number);
      sel.row = r; sel.col = c;
    }
  }

  function arrow(dr, dc) {
    let r = sel.row + dr, c = sel.col + dc;
    while (r >= 0 && r < SIZE && c >= 0 && c < SIZE) {
      if (solution[r + ',' + c]) { sel.row = r; sel.col = c; return; }
      r += dr; c += dc;
    }
  }

  const complete = () => Object.keys(solution).every(k => state.letters[k]);
  const solved   = () => Object.keys(solution).every(k => state.letters[k] === solution[k]);

  function fmtTime(ms) {
    const s = Math.round(ms / 1000);
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }

  function finish() {
    gridEl.classList.add('solved');
    msgEl.textContent = state.revealed
      ? 'Revealed. Every answer was HOTDOG. Of course it was.'
      : 'Solved in ' + fmtTime(state.time) + '. Every answer was HOTDOG.';
    document.getElementById('xw-check').hidden = true;
    document.getElementById('xw-reveal').hidden = true;
    shareEl.hidden = state.revealed;
  }

  function afterEdit() {
    Object.values(cellEls).forEach(el => el.classList.remove('wrong'));
    if (state.status === 'playing' && solved()) {
      state.status = 'solved';
      state.time = Date.now() - state.started;
      finish();
    } else if (state.status === 'playing') {
      msgEl.textContent = complete() ? 'Not quite. Something is off.' : '';
    }
    Games.save('crossword', state);
    Games.update();
  }

  function typeLetter(ch) {
    if (state.status !== 'playing') return;
    if (!state.started) state.started = Date.now();
    state.letters[sel.row + ',' + sel.col] = ch;
    move(1);
    afterEdit();
    render();
  }

  function backspace() {
    if (state.status !== 'playing') return;
    const k = sel.row + ',' + sel.col;
    if (state.letters[k]) delete state.letters[k];
    else { move(-1); delete state.letters[sel.row + ',' + sel.col]; }
    afterEdit();
    render();
  }

  gridEl.addEventListener('click', e => {
    const cell = e.target.closest('.xw-cell:not(.block)');
    if (!cell) return;
    const [r, c] = cell.dataset.key.split(',').map(Number);
    if (r === sel.row && c === sel.col) sel.dir = sel.dir === 'across' ? 'down' : 'across';
    else { sel.row = r; sel.col = c; }
    render();
    input.focus();
  });

  input.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const map = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
    if (map[e.key]) {
      e.preventDefault();
      const [dr, dc] = map[e.key];
      const wantDir = dr ? 'down' : 'across';
      if (sel.dir !== wantDir && entryAt(sel.row, sel.col, wantDir)) sel.dir = wantDir;
      else arrow(dr, dc);
      render();
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      backspace();
    } else if (e.key === ' ' || e.key === 'Tab') {
      e.preventDefault();
      const i = ENTRIES.indexOf(entryAt(sel.row, sel.col, sel.dir));
      const next = ENTRIES[(i + (e.shiftKey ? ENTRIES.length - 1 : 1)) % ENTRIES.length];
      sel = { row: next.row, col: next.col, dir: next.dir };
      render();
    } else if (/^[a-zA-Z]$/.test(e.key)) {
      e.preventDefault();
      typeLetter(e.key.toUpperCase());
    }
  });

  // Mobile keyboards often skip keydown details and only fire input
  input.addEventListener('input', () => {
    const ch = input.value.slice(-1).toUpperCase();
    input.value = '';
    if (/^[A-Z]$/.test(ch)) typeLetter(ch);
  });

  input.addEventListener('focus', () => gridEl.classList.add('focused'));
  input.addEventListener('blur',  () => gridEl.classList.remove('focused'));

  document.getElementById('xw-check').addEventListener('click', () => {
    let wrong = 0;
    Object.keys(state.letters).forEach(k => {
      if (state.letters[k] !== solution[k]) { cellEls[k].classList.add('wrong'); wrong++; }
    });
    // Only checks that catch a mistake count against the score
    if (wrong) { state.checks = (state.checks || 0) + 1; Games.save('crossword', state); Games.update(); }
    msgEl.textContent = wrong ? wrong + ' square' + (wrong > 1 ? 's' : '') + ' to fix.' : 'Looking good so far.';
  });

  document.getElementById('xw-reveal').addEventListener('click', () => {
    if (!window.confirm('Reveal the whole puzzle?')) return;
    Object.assign(state.letters, solution);
    state.revealed = true;
    state.status = 'solved';
    Games.save('crossword', state);
    render();
    finish();
    Games.update();
  });

  shareEl.addEventListener('click', () => {
    Games.copyText('The Mini No. ' + Games.puzzleNo + ' solved in ' + fmtTime(state.time) + ' 🌭\nkylafallis.com/games', shareEl);
  });

  render();
  if (state.status === 'solved') finish();

  Games.register('mini', () => {
    if (state.status === 'solved') {
      return state.revealed
        ? { state: 'done', label: 'Revealed', quality: 0 }
        : { state: 'done', label: fmtTime(state.time), quality: Math.max(0.4, 1 - 0.15 * (state.checks || 0)) };
    }
    const filled = Object.keys(state.letters).length;
    if (filled) return { state: 'playing', label: filled + ' of ' + Object.keys(solution).length + ' squares', quality: 0 };
    return { state: 'new', label: 'Not started' };
  });

})();
