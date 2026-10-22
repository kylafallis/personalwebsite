// ============================================================
// Leaderboard backend for kylafallis.com/games (Google Apps Script)
//
// Setup (once):
//   1. Make a new Google Sheet (sheets.new), name it "Games Leaderboard".
//   2. Extensions > Apps Script. Replace everything with this file. Save.
//   3. Deploy > New deployment > type "Web app".
//        Execute as: Me    Who has access: Anyone
//   4. Authorize, then copy the Web app URL (ends in /exec) into
//      LEADERBOARD_URL at the top of games-leaderboard.js.
//
// Scores land on the "Scores" tab, one row per player per puzzle.
// To hide an entry (a rude name, an obvious cheat), type anything in its
// "hidden" column. Boards refresh within about 30 seconds.
//
// After editing this script, use Deploy > Manage deployments > Edit >
// Version: New version, so the same URL serves the new code.
// ============================================================

var SHEET_NAME = 'Scores';
var HEADERS = ['timestamp', 'puzzle', 'date', 'player', 'name', 'score', 'timeMs', 'hidden'];
var BOARD_SIZE = 25;

// Names containing any of these (after undoing l33t-speak) are refused.
// Kept to unambiguous roots so ordinary names don't get caught.
// (No 'cock', 'porn', 'nazi' or 'rapist': they'd catch Hancock, Pornchai, Nazia
// and "therapist". The hidden column handles anything that slips through.)
var SAFE = ['shita', 'shiitake', 'shitake', 'scunthorpe', 'cockburn'];
var BLOCKED = ['fuck', 'shit', 'bitch', 'cunt', 'nigg', 'fagg', 'slut', 'whore',
  'hitler', 'penis', 'vagin', 'pussy', 'twat', 'retard', 'kike', 'chink',
  'dildo', 'boob', 'tits', 'asshole', 'jackass', 'dumbass', 'bastard'];

function doGet(e) {
  var p = (e && e.parameter) || {};
  var puzzle = String(p.puzzle || '');
  var player = String(p.player || '');
  return json_(boards_(rows_(), puzzle, player));
}

function doPost(e) {
  var body;
  try { body = JSON.parse(e.postData.contents); }
  catch (err) { return json_({ ok: false, error: 'Bad request.' }); }

  var entry = validate_(body);
  if (entry.error) return json_({ ok: false, error: entry.error });

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var rows = rows_();
    var dupe = rows.some(function (r) { return r.puzzle === entry.puzzle && r.player === entry.player; });
    if (dupe) return json_({ ok: false, error: "You're already on today's board." });
    // Leading apostrophes keep Sheets from turning dates and number-like names into other types
    sheet_().appendRow([Date.now(), entry.puzzle, "'" + entry.date, entry.player,
      "'" + entry.name, entry.score, entry.timeMs, '']);
  } finally {
    lock.releaseLock();
  }
  var out = boards_(rows_(), entry.puzzle, entry.player);
  out.ok = true;
  return json_(out);
}

function validate_(b) {
  b = b || {};
  var puzzle = String(b.puzzle || '');
  var date = String(b.date || '');
  var player = String(b.player || '');
  var name = String(b.name || '').replace(/\s+/g, ' ').trim();
  var score = Number(b.score);
  var timeMs = b.timeMs === null || b.timeMs === undefined || b.timeMs === '' ? '' : Number(b.timeMs);

  if (!/^\d{4}-\d{2}-\d{2}-[a-z]{3,12}$/.test(puzzle)) return { error: 'Unknown puzzle.' };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || puzzle.indexOf(date) !== 0) return { error: 'Unknown puzzle.' };
  if (!/^[a-z0-9-]{8,40}$/.test(player)) return { error: 'Bad request.' };
  if (name.length < 2 || name.length > 20) return { error: 'Names need 2 to 20 characters.' };
  if (!/^[\p{L}\p{N} ._'-]+$/u.test(name)) return { error: 'Letters, numbers, spaces and . _ \' - only.' };
  if (blocked_(name)) return { error: 'Please pick a different name.' };
  if (!(score >= 0 && score <= 100) || Math.round(score) !== score) return { error: 'Bad score.' };
  if (timeMs !== '' && !(timeMs >= 5000 && timeMs <= 24 * 3600 * 1000)) timeMs = '';
  if (timeMs !== '') timeMs = Math.round(timeMs);

  return { puzzle: puzzle, date: date, player: player, name: name, score: score, timeMs: timeMs };
}

function blocked_(name) {
  var map = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', '$': 's', '!': 'i' };
  var flat = name.toLowerCase().replace(/[013457@$!]/g, function (c) { return map[c]; }).replace(/[^a-z]/g, '');
  // Innocent words that contain a blocked root (Yamashita, Matsushita, shiitake...)
  SAFE.forEach(function (w) { flat = flat.split(w).join(''); });
  return BLOCKED.some(function (w) { return flat.indexOf(w) !== -1; });
}

function boards_(rows, puzzle, player) {
  var visible = rows.filter(function (r) { return !r.hidden; });

  // Today: best score first, then fastest
  var today = visible
    .filter(function (r) { return r.puzzle === puzzle; })
    .sort(function (a, b) {
      return b.score - a.score || timeOrMax_(a) - timeOrMax_(b) || a.timestamp - b.timestamp;
    })
    .map(function (r) { return { name: r.name, score: r.score, timeMs: r.timeMs === '' ? null : r.timeMs, me: !!player && r.player === player }; });

  // All time: total points across every finished day, so showing up and
  // playing well both count. Latest name wins if someone renames.
  var byPlayer = {};
  visible.forEach(function (r) {
    var p = byPlayer[r.player] || (byPlayer[r.player] = { name: r.name, last: 0, days: 0, total: 0 });
    p.days++;
    p.total += r.score;
    if (r.timestamp > p.last) { p.last = r.timestamp; p.name = r.name; }
    p.me = !!player && r.player === player;
  });
  var allTime = Object.keys(byPlayer).map(function (k) {
    var p = byPlayer[k];
    return { name: p.name, days: p.days, total: p.total, avg: Math.round(p.total / p.days), me: p.me };
  }).sort(function (a, b) { return b.total - a.total || b.avg - a.avg; });

  return {
    today: rank_(today).slice(0, BOARD_SIZE),
    todayCount: today.length,
    allTime: rank_(allTime).slice(0, BOARD_SIZE),
    myToday: rank_(today).filter(function (r) { return r.me; })[0] || null,
    myAllTime: rank_(allTime).filter(function (r) { return r.me; })[0] || null
  };
}

function rank_(list) {
  return list.map(function (r, i) { r.rank = i + 1; return r; });
}

function timeOrMax_(r) { return r.timeMs === '' || r.timeMs === null ? Infinity : r.timeMs; }

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function rows_() {
  var values = sheet_().getDataRange().getValues();
  return values.slice(1).map(function (v) {
    return {
      timestamp: Number(v[0]) || 0, puzzle: String(v[1]), date: String(v[2]), player: String(v[3]),
      name: String(v[4]), score: Number(v[5]) || 0, timeMs: v[6] === '' ? '' : Number(v[6]),
      hidden: String(v[7]).trim() !== ''
    };
  });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
