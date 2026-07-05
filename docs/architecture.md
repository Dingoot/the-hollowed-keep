# The Hollowed Keep — Architecture

How the code is organized and the rules that keep it sane as the game grows.

## Layout

```
index.html          shell + script load order (a contract — see below)
styles.css          CRT terminal aesthetic
data/               WORLD CONTENT — pure data, no logic
  art.js            ASCII art
  rooms.js          every room (world map)
  items.js          every item
  npcs.js           every NPC, dialogue, quests
  enemies.js        every enemy
  chronicle.js      fake-multiplayer flavor data
  races.js          the five races (stats, affinities, perks)
  remnants.js       the fifteen remnants
  skills.js         player skill definitions + XP curve
engine/             GAME LOGIC — no content
  utils.js          rng, pick, helpers
  state.js          game state, save/load
  skills.js         skill XP/carving, stat helpers, vessel sheet
  creation.js       boot-screen character creation (the Toll)
  ui.js             output rendering + side panels, the Keep's voice
  chronicle.js      chronicle/rune wall systems
  parser.js         command parsing + dispatch
  world.js          movement, look, examine
  actions.js        take/use/equip/search/craft/etc.
  combat.js         combat loop + spells
  npcs.js           dialogue, quests, trading, brewing
  endings.js        endgame sequences (wraps parseCommand)
  main.js           boot sequence, init — always loads last
docs/               design docs (world bible, character systems, this file)
test/smoke.js       headless playthrough test — run: node test/smoke.js
legacy/app.js       the original single-file prototype, kept for reference
```

## The rules

**1. Data files contain zero behavior.** Everything in `data/` must stay JSON-shaped: objects, arrays, strings, numbers, booleans. Behavior is referenced by string keys (`"teachesSpell": "sunder"`) that the engine interprets. This is what lets a future MUD server load the same world without a browser — stripping the `const X =` wrapper turns any data file into pure JSON.

**2. Load order is a contract.** Scripts share one global scope, classic-script style (no build step, no modules — the game still runs by double-clicking `index.html`). Data loads before engine, `endings.js` after `parser.js` (it wraps `parseCommand`), `main.js` last. The order lives in two places that must match: `index.html` and `LOAD_ORDER` in `test/smoke.js`.

**3. Every change runs the smoke test.** `node test/smoke.js` boots the game headless and plays a short session. It catches load-order breaks, syntax errors, and crashed commands in about a second. Grow it as systems grow.

## Adding content

- **A room:** add an entry in `data/rooms.js`, wire its `exits` to neighbors (exits are one-way — add both directions), done.
- **An item:** add to `data/items.js`, then place it in a room's `items` array or an NPC's inventory/reward.
- **An NPC:** add to `data/npcs.js` with `topics` (dialogue) and optionally a `quest`; list them in a room's `npcs` array.
- **An enemy:** add to `data/enemies.js`; list in a room's `enemies` array.
- **A new verb/system:** engine work — add a case in `parser.js` dispatching to a function in the right engine file.

## Deploying

Unchanged: push to `main`, GitHub Pages workflow uploads the whole directory. Relative paths only — the game must keep working from both `file://` and a subpath URL.

## The multiplayer path (later, by design)

The world lives in `data/` with no functions and no DOM. A future Node MUD server imports the same data, reimplements the thin engine layer server-side, and talks to clients over websockets — the browser UI becomes one client among several. Nothing needs restructuring for that day as long as rules 1 and 2 hold.
