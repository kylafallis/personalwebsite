---
name: daily-puzzle
description: Publish a new daily puzzle on Kyla's portfolio site (kylafallis.com/games). Picks a funny theme word (or uses the one given), writes all five games around it (word game, mini crossword, Links groups, Hive letters, Trails theme), builds and validates puzzle.js, then commits and pushes so the site updates. Use this whenever someone asks for today's/tomorrow's puzzle, a new games theme or word, "make the puzzle about X", "run the daily puzzle", or when a scheduled midnight puzzle task fires, even if they don't name the skill.
---

# Daily puzzle

Kyla's site has a games page with five daily puzzles that all share one theme word: a Wordle-style game, a mini crossword where every answer is the word, a Connections-style grouping game ("Links"), a Spelling Bee-style hive, and a Strands-style letter trail. All of a day's content lives in one generated file, `puzzle.js`. Your job is the creative part: choose the word and write good clues, groups and theme words. A script handles everything that needs exact computation (crossword layout, the letter grid, the dictionary-based hive list, validation) and refuses to write a broken puzzle.

## 1. Find the repo and today's date

Work in the `personalwebsite` repo (on Kyla's PC: `C:\Users\kylak\Portfolio Website\personalwebsite`). You're in the right place if `games.html` and `build/make-puzzle.js` exist.

Get today's date in Kyla's timezone, because a midnight run on a machine set to UTC would otherwise stamp the wrong day:

```bash
node -e "console.log(new Date().toLocaleDateString('en-CA',{timeZone:'America/New_York'}))"
```

Run `git pull --rebase` before changing anything, so the push at the end doesn't collide with edits made elsewhere.

## 2. Pick the word

- **A word or theme was given**: use it. A theme ("Halloween", "breakfast") means pick a fitting word yourself.
- **No word (the scheduled run)**: if `build/puzzle/specs/<today>.json` already exists, today is done; say so and stop. Otherwise pick a random funny word.

Past puzzles are the files in `build/puzzle/specs/`. Never reuse a word that's in there.

A good daily word is 5 to 7 letters (the word game and crossword need that), family friendly, instantly recognizable, and a little ridiculous: think NOODLE, PICKLE, WAFFLE, LLAMA, GOBLIN, KAZOO, WOMBAT, BURRITO, PENGUIN. It also needs enough related material for four Links groups and seven or so Trails words, so a word with a rich world around it beats an obscure one. Avoid anything that could read as mean, crude, political or tied to a real person.

## 3. Write the spec

Create `build/puzzle/specs/<today>.json`. Read `references/spec-guide.md` for the format and what makes each game good. In short you write: 4 Mini clues, 4 Links groups of 4, a Hive pangram with exactly 7 different letters, and a Trails theme whose letters total exactly 48.

## 4. Build, read the output, iterate

```bash
node build/make-puzzle.js build/puzzle/specs/<today>.json --dry
```

The dry run validates everything and prints the whole puzzle without writing it. If it lists problems, fix the spec and run again; the messages say exactly what's wrong (a pangram missing from the dictionary, Trails letters adding up to 46 instead of 48, and so on). If Trails can't fit after a couple of tries, add `--seed=2`, `--seed=3`, or swap one word for a different length.

When it passes, **read the Hive word list it prints**. It comes from a large tournament dictionary, so it contains archaic and obscure words (TOROTH, DEHORT, GORGET) that would make players feel cheated, and occasionally crude or offensive ones that must never appear on Kyla's site. Add every such word to `hive.exclude` and rerun. Aim for roughly 40 to 100 words a normal person could find. Keep common plurals and verb forms.

Then build for real (same command without `--dry`). It writes `puzzle.js` at the repo root.

## 5. Commit and push

Only the spec and `puzzle.js` should change. Check with `git status` that nothing else is modified, then:

```bash
git add puzzle.js build/puzzle/specs/<today>.json
git commit -m "Daily puzzle <today>: <WORD>"
git push
```

The site is GitHub Pages, so the push is the deploy; it goes live within a couple of minutes. If the push fails (no credentials, rejected), say so plainly with the error; don't retry with force flags.

## 6. Report

Finish with a short summary Kyla can skim: the word, the Trails theme, the four Links group names, the Hive pangram and word count, and the commit hash. If this was a scheduled run, mention anything you had to work around.

## Things to leave alone

The game code (`games-*.js`, `games.html`, `style.css`) reads everything from `puzzle.js`, so a new theme never needs code changes. If something about a theme seems to require editing the games themselves, stop and explain instead of changing them: the scheduled run happens unattended, and a code change there could break the live site.
