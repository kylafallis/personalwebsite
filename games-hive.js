// ============================================================
// games-hive.js: The Hive (make words from the hive's letters)
// ============================================================

(function () {

  // TROGLODYTE has eight distinct letters and no common word uses exactly
  // seven of them, so this hive has eight: O in the middle, seven around it.
  // TROGLODYTE itself is the pangram.
  const CENTER = 'O';
  const OUTER  = ['T', 'R', 'G', 'L', 'D', 'Y', 'E'];
  const WORDS = [
    'DODGE', 'DODGED', 'DODGER', 'DODGY', 'DODO', 'DOER', 'DOGE', 'DOGGED', 'DOGGEDLY', 'DOGGEREL',
    'DOGGY', 'DOGLEG', 'DOLE', 'DOLL', 'DOLLED', 'DOLLY', 'DOLT', 'DOODLE', 'DOOR', 'DORY', 'DOTED',
    'DOTTED', 'DOTTY', 'DROLL', 'DROOL', 'ERGO', 'ERODE', 'ERODED', 'ERROR', 'GEOLOGY', 'GLORY',
    'GODLY', 'GOER', 'GOGGLE', 'GOLD', 'GOLLY', 'GOOD', 'GOODLY', 'GOODY', 'GOOEY', 'GORE', 'GORED',
    'GORGE', 'GORGED', 'GORY', 'GROG', 'GROGGY', 'GROTTO', 'LODE', 'LODGE', 'LODGED', 'LODGER',
    'LOGGED', 'LOGGER', 'LOGO', 'LOLLY', 'LOOT', 'LOOTED', 'LORD', 'LORE', 'LORRY', 'LOTTERY',
    'LOTTO', 'ODDER', 'ODDLY', 'ODOR', 'OGLE', 'OGRE', 'OLDER', 'ORDER', 'ORDERED', 'ORDERLY',
    'OTTER', 'REDO', 'REORDER', 'RETOLD', 'RETORT', 'RETORTED', 'RETRO', 'RODE', 'RODEO', 'ROLE',
    'ROLL', 'ROLLED', 'ROLLER', 'ROOD', 'ROOT', 'ROOTED', 'ROTE', 'ROTOR', 'ROTTED', 'TERROR',
    'TODDLER', 'TODDY', 'TOED', 'TOGGLE', 'TOGGLED', 'TOLD', 'TOLL', 'TOLLED', 'TOOL', 'TOOLED',
    'TOOT', 'TORE', 'TORT', 'TOTE', 'TOYED', 'TROD', 'TROGLODYTE', 'TROLL', 'TROLLED', 'TROLLEY',
    'TROT', 'TROTTED', 'TROTTER', 'YODEL', 'YODELER', 'YORE'
  ];
  const LETTERS = [CENTER].concat(OUTER);
  const isPangram = w => LETTERS.every(l => w.includes(l));
  const points = w => (w.length === 4 ? 1 : w.length) + (isPangram(w) ? 7 : 0);
  const MAX = WORDS.reduce((s, w) => s + points(w), 0);

  const RANKS = [
    ['Beginner', 0], ['Good Start', 0.02], ['Moving Up', 0.05], ['Good', 0.08], ['Solid', 0.15],
    ['Nice', 0.25], ['Great', 0.4], ['Amazing', 0.5], ['Genius', 0.7], ['Top Troglodyte', 1]
  ];
  const WIN = Math.round(MAX * 0.5);  // reaching Amazing wins the game

  const hiveEl   = document.getElementById('hive-board');
  const entryEl  = document.getElementById('hive-entry');
  const msgEl    = document.getElementById('hive-message');
  const rankName = document.getElementById('hive-rank-name');
  const ptsEl    = document.getElementById('hive-points');
  const barEl    = document.getElementById('hive-rank-bar');
  const countEl  = document.getElementById('hive-found-count');
  const listEl   = document.getElementById('hive-found-list');
  const shareEl  = document.getElementById('hive-share');

  const state = Games.load('hive') || { found: [] };
  let outer = OUTER.slice();
  let entry = '';
  let msgTimer;

  const score = () => state.found.reduce((s, w) => s + points(w), 0);

  function rank() {
    const s = score();
    let r = RANKS[0];
    RANKS.forEach(x => { if (s >= Math.round(MAX * x[1])) r = x; });
    return r;
  }

  // The center letter plus a ring of the outer letters
  function buildHive() {
    hiveEl.innerHTML = '';
    // Center hex, then the outer letters spaced evenly on a ring (works for 6 or 7)
    const slots = [[0, 0]].concat(outer.map((_, i) => {
      const a = -Math.PI / 2 + i * 2 * Math.PI / outer.length;
      return [+(1.16 * Math.cos(a)).toFixed(3), +(1.36 * Math.sin(a)).toFixed(3)];
    }));
    [CENTER].concat(outer).forEach((l, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'hive-cell' + (i === 0 ? ' center' : '');
      b.textContent = l;
      b.style.setProperty('--x', slots[i][0]);
      b.style.setProperty('--y', slots[i][1]);
      b.addEventListener('click', () => { add(l); b.blur(); });
      hiveEl.appendChild(b);
    });
  }

  function renderEntry() {
    entryEl.innerHTML = '';
    entry.split('').forEach(ch => {
      const s = document.createElement('span');
      s.textContent = ch;
      if (ch === CENTER) s.className = 'is-center';
      else if (!LETTERS.includes(ch)) s.className = 'is-bad';
      entryEl.appendChild(s);
    });
    const caret = document.createElement('i');
    entryEl.appendChild(caret);
  }

  function renderProgress() {
    const s = score();
    const r = rank();
    rankName.textContent = r[0];
    ptsEl.textContent = s + ' pts';
    barEl.innerHTML = '';
    const reached = RANKS.indexOf(r);
    RANKS.forEach((x, i) => {
      const d = document.createElement('i');
      d.title = x[0] + ' (' + Math.round(MAX * x[1]) + ' pts)';
      if (i <= reached) d.className = 'on';
      if (i === reached) d.className = 'on current';
      barEl.appendChild(d);
    });
    barEl.style.setProperty('--fill', Math.min(1, reached / (RANKS.length - 1)));

    countEl.textContent = 'You have found ' + state.found.length + ' word' + (state.found.length === 1 ? '' : 's');
    listEl.innerHTML = '';
    state.found.slice().sort().forEach(w => {
      const li = document.createElement('li');
      li.textContent = w.charAt(0) + w.slice(1).toLowerCase();
      if (isPangram(w)) li.className = 'pangram';
      listEl.appendChild(li);
    });
  }

  function say(text, good) {
    msgEl.textContent = text;
    msgEl.classList.toggle('is-good', !!good);
    clearTimeout(msgTimer);
    msgTimer = setTimeout(() => { msgEl.textContent = ''; }, 1600);
  }

  function add(ch) {
    if (entry.length >= 19) return;
    entry += ch;
    renderEntry();
  }

  function submit() {
    const w = entry;
    entry = '';
    renderEntry();
    if (!w) return;
    if (w.length < 4)               return say('Too short');
    if (!w.includes(CENTER))        return say('Missing center letter');
    if (w.split('').some(c => !LETTERS.includes(c))) return say('Bad letters');
    if (state.found.includes(w))    return say('Already found');
    if (!WORDS.includes(w))         return say('Not in word list');

    const before = rank();
    state.found.push(w);
    Games.save('hive', state);
    const p = points(w);
    if (isPangram(w)) say('Pangram! +' + p, true);
    else say((p === 1 ? 'Good!' : p < 7 ? 'Nice!' : 'Awesome!') + ' +' + p, true);
    if (rank() !== before && rank()[0] === 'Amazing') say('Amazing! That counts as a win. +' + p, true);
    if (rank() !== before && rank()[0] === 'Genius') say('Genius! +' + p, true);
    renderProgress();
    Games.update();
  }

  document.getElementById('hive-enter').addEventListener('click', submit);
  document.getElementById('hive-delete').addEventListener('click', () => { entry = entry.slice(0, -1); renderEntry(); });
  document.getElementById('hive-shuffle').addEventListener('click', () => { outer = Games.shuffle(outer); buildHive(); });

  document.addEventListener('keydown', e => {
    if (Games.active !== 'hive') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.closest && e.target.closest('input, textarea')) return;
    if (e.key === 'Enter') {
      if (e.target.closest && e.target.closest('a, button:not(.hive-cell):not([role="tab"])')) return;
      e.preventDefault(); submit();
    } else if (e.key === 'Backspace') {
      e.preventDefault(); entry = entry.slice(0, -1); renderEntry();
    } else if (e.key === ' ') {
      e.preventDefault(); outer = Games.shuffle(outer); buildHive();
    } else if (/^[a-zA-Z]$/.test(e.key)) {
      e.preventDefault(); add(e.key.toUpperCase());
    }
  });

  shareEl.addEventListener('click', () => {
    Games.copyText('The Hive No. ' + Games.puzzleNo + '\n' + rank()[0] + ' · ' + score() + ' pts · ' +
      state.found.length + ' words' + (state.found.some(isPangram) ? ' · found the pangram 🦇' : '') +
      '\nkylafallis.com/games', shareEl);
  });

  buildHive();
  renderEntry();
  renderProgress();

  // There's no natural end to a word hive, so reaching Amazing counts as done
  Games.register('hive', () => {
    const s = score();
    if (!state.found.length) return { state: 'new', label: 'Not started' };
    const label = rank()[0] + ' · ' + s + ' pts';
    return { state: s >= WIN ? 'done' : 'playing', label, quality: Math.min(1, s / WIN) };
  });

})();
