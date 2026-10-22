// ============================================================
// games-links.js: Links (four groups of four)
// ============================================================

(function () {

  // Ordered easiest to hardest; each group carries its color and share emoji
  const GROUPS = Games.puzzle.links.groups;
  const MAX_MISTAKES = 4;

  const boardEl    = document.getElementById('links-board');
  const mistakesEl = document.getElementById('links-mistakes');
  const msgEl      = document.getElementById('links-message');
  const submitEl   = document.getElementById('links-submit');
  const controlsEl = document.getElementById('links-controls');
  const shareEl    = document.getElementById('links-share');

  const groupOf = {};
  GROUPS.forEach((g, i) => g.words.forEach(w => { groupOf[w] = i; }));

  const state = Games.load('links') || {
    order: Games.shuffle(Object.keys(groupOf)),
    solved: [],      // group indexes, in the order found
    guesses: [],     // every submitted set of four, for the share grid
    mistakes: 0,
    status: 'playing'
  };
  let selected = [];

  function save() { Games.save('links', state); Games.update(); }

  function render() {
    boardEl.innerHTML = '';

    // Solved groups stack at the top
    state.solved.forEach(gi => {
      const g = GROUPS[gi];
      const row = document.createElement('div');
      row.className = 'links-solved tone-' + g.tone;
      row.innerHTML = '<strong></strong><span></span>';
      row.firstChild.textContent = g.name;
      row.lastChild.textContent = g.words.join(', ');
      boardEl.appendChild(row);
    });

    // Remaining tiles
    state.order.filter(w => !state.solved.includes(groupOf[w])).forEach(w => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'links-tile' + (w.length >= 8 ? ' long' : '') + (selected.includes(w) ? ' selected' : '');
      b.textContent = w;
      b.setAttribute('aria-pressed', selected.includes(w));
      b.disabled = state.status !== 'playing';
      b.addEventListener('click', () => toggle(w));
      boardEl.appendChild(b);
    });

    mistakesEl.innerHTML = '<span>Mistakes remaining</span>';
    for (let i = 0; i < MAX_MISTAKES; i++) {
      const d = document.createElement('i');
      if (i >= MAX_MISTAKES - state.mistakes) d.className = 'used';
      mistakesEl.appendChild(d);
    }

    submitEl.disabled = selected.length !== 4;
    controlsEl.hidden = state.status !== 'playing';
    mistakesEl.hidden = state.status !== 'playing';
  }

  function toggle(w) {
    if (state.status !== 'playing') return;
    Games.touch('links');
    if (selected.includes(w)) selected = selected.filter(x => x !== w);
    else if (selected.length < 4) selected.push(w);
    render();
  }

  function finish() {
    msgEl.textContent = state.status === 'won'
      ? (state.mistakes === 0 ? 'Perfect. Not a single slip.' : 'Got them all, with ' + state.mistakes + ' mistake' + (state.mistakes > 1 ? 's' : '') + '.')
      : 'Out of mistakes. Here are the groups.';
    shareEl.hidden = false;
  }

  function submit() {
    if (selected.length !== 4 || state.status !== 'playing') return;
    const key = selected.slice().sort().join('|');
    if (state.guesses.some(g => g.slice().sort().join('|') === key)) {
      msgEl.textContent = 'Already guessed!';
      return;
    }
    state.guesses.push(selected.slice());

    const counts = {};
    selected.forEach(w => { counts[groupOf[w]] = (counts[groupOf[w]] || 0) + 1; });
    const best = Math.max.apply(null, Object.values(counts));

    if (best === 4) {
      state.solved.push(groupOf[selected[0]]);
      msgEl.textContent = '';
      if (state.solved.length === GROUPS.length) { state.status = 'won'; finish(); }
    } else {
      state.mistakes++;
      msgEl.textContent = best === 3 ? 'One away...' : 'Not a group.';
      boardEl.classList.remove('shake');
      void boardEl.offsetWidth;
      boardEl.classList.add('shake');
      if (state.mistakes >= MAX_MISTAKES) {
        state.status = 'lost';
        // Reveal what's left, easiest first
        GROUPS.forEach((g, i) => { if (!state.solved.includes(i)) state.solved.push(i); });
        finish();
      }
    }
    selected = [];
    save();
    render();
  }

  submitEl.addEventListener('click', submit);
  document.getElementById('links-shuffle').addEventListener('click', () => {
    state.order = Games.shuffle(state.order);
    save();
    render();
  });
  document.getElementById('links-deselect').addEventListener('click', () => { selected = []; render(); });

  shareEl.addEventListener('click', () => {
    const grid = state.guesses.map(g => g.map(w => GROUPS[groupOf[w]].emoji).join('')).join('\n');
    Games.copyText('Links No. ' + Games.puzzleNo + '\n' + grid + '\nkylafallis.com/games', shareEl);
  });

  render();
  if (state.status !== 'playing') finish();

  Games.register('links', () => {
    const found = state.status === 'lost'
      ? state.guesses.filter(g => g.every(w => groupOf[w] === groupOf[g[0]])).length
      : state.solved.length;
    if (state.status === 'won') {
      return { state: 'done', label: state.mistakes ? state.mistakes + ' mistake' + (state.mistakes > 1 ? 's' : '') : 'Perfect', quality: 1 - state.mistakes * 0.2 };
    }
    if (state.status === 'lost') return { state: 'done', label: found + '/4 groups', quality: found * 0.12 };
    if (state.guesses.length) return { state: 'playing', label: found + '/4 groups', quality: found / 4 };
    return { state: 'new', label: 'Not started' };
  });

})();
