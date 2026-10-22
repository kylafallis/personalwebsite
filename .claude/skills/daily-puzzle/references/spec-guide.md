# Puzzle spec guide

A spec is the creative half of a day's puzzle. `build/make-puzzle.js` turns it into `puzzle.js`.

## Format

```json
{
  "date": "2026-10-22",
  "word": "LLAMA",
  "emoji": "🦙",
  "mini": {
    "clues": ["clue 1", "clue 2", "clue 3", "clue 4"]
  },
  "links": [
    { "name": "Easiest group", "words": ["W1", "W2", "W3", "W4"] },
    { "name": "Second",        "words": ["...", "...", "...", "..."] },
    { "name": "Third",         "words": ["...", "...", "...", "..."] },
    { "name": "Trickiest",     "words": ["...", "...", "...", "..."] }
  ],
  "hive": {
    "pangram": "CAMELBACK",
    "center": "A",
    "topRank": "Drama Llama",
    "exclude": [],
    "include": []
  },
  "trails": {
    "theme": "Fuzzy fibers",
    "spangram": "FIBERS",
    "words": ["ALPACA", "ANGORA", "MOHAIR", "CASHMERE", "MERINO", "VICUNA", "WOOL"]
  }
}
```

`build/puzzle/specs/2026-10-21.json` (HOTDOG) is a complete, finished example to model tone on.

## Word game (built automatically)

The answer is the theme word. Nothing to write.

## The Mini (4 clues)

Every answer in the crossword is the theme word, which is the joke, so the fun is in four different clues for the same thing. The script picks the layout and uses as many clues as it has entries (2 to 4), in order, so put your best clues first.

- Each clue should get at the word from a different angle: a straight definition, a pun, a fill-in-the-blank, a pop-culture nod, an unexpected fact.
- Never include the answer itself in a clue; the script rejects that.
- Keep them short (under about 50 characters) so they fit the clue bar on a phone.

## Links (4 groups of 4)

This is the game people judge hardest, so spend the most effort here. Order groups from easiest to trickiest; the colors follow that order (mustard, relish, bun, ketchup).

- Every group should relate to the theme, ideally in a way players only notice partway through.
- Build in red herrings: a few words that look like they belong to two groups. In the HOTDOG puzzle, SLAW looks like a condiment but belongs in "___ Dog", and FRANKFURTER looks like a famous Frank. Without herrings the game is just sorting.
- The trickiest group should be wordplay (hidden words, "___ Dog" style blanks, homophones) rather than trivia.
- Each entry is 2 to 12 characters; spaces are fine (TUBE STEAK). All 16 must be different.
- Check every word fits only the group you intend once the trick is known. Ambiguity that survives the reveal feels unfair.

## The Hive (7 letters)

- `pangram`: a real word with exactly 7 different letters, ideally theme related (it doesn't need to contain the theme word). It must be in `build/puzzle/words.txt`; search that file to find candidates, for example:
  `node -e "const w=require('fs').readFileSync('build/puzzle/words.txt','utf8').split(/\r?\n/);console.log(w.filter(x=>/pick|brine/.test(x)&&new Set(x).size===7).join(' '))"`
- `center`: one of the 7 letters. Every answer must use it, so a common letter (a vowel, R, S, T, L, N) gives a healthier word count than a rare one.
- `topRank`: a themed pun for the top rank (Top Dog, Big Dill, Drama Llama).
- `exclude`: obscure, archaic, crude or offensive words from the printed list (see SKILL.md step 4).
- `include`: rarely needed; for a fair word the dictionary is missing.

Rank thresholds scale with the total points, and reaching "Amazing" (50%) counts as winning, so a curated list matters more than a long one.

## Trails (theme + spangram + words)

- `theme`: a short, slightly oblique hint (HOTDOG used "Dress it up" for toppings).
- `spangram`: 6 to 12 letters, names what the words have in common, and runs across the whole board. It can be the theme word itself if that word has 6+ letters.
- `words`: theme words of 4 to 9 letters.
- **The letters must total exactly 48** (spangram plus all words). The script tells you the current total; adjust by swapping words of different lengths. Usually 6 to 8 words.
- Avoid words that hide inside other words on the list, and keep every word one the theme clearly suggests.
