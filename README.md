# The Hollowed Keep

A text-based adventure game with an old-internet MUD aesthetic.

> Every door demands a toll. The Keep's toll is you.

**Play it:** Open `index.html` in any browser. No server required.

**Structure:** world content lives in `data/`, game logic in `engine/`, design docs in `docs/` — see `docs/architecture.md`. Test with `node test/smoke.js`. The original single-file prototype is preserved in `legacy/`.

## Features

- 39 rooms across 6 regions (The Threshold, Courtyard, Ground Floor, Upper Floors, The Dungeons, The Deep)
- Turn-based combat with 9 enemy types including a final boss
- 35+ items: weapons, armor, potions, quest items, lore documents
- 12 NPCs with dialogue trees and quest lines — meet the Porter at the gate, and Wick will light your way
- Puzzles, hidden passages, and multiple endings
- Nine playable bloods (plus unlockables), Remnants, use-based skills carved by doing, hearth checkpoints, and death-tolls — the Keep always takes something
- Save/load via localStorage
- Adventurer's Chronicle: simulated live activity from other "players"
- Rune Wall: leave persistent messages for future visits
- CRT terminal aesthetic with ASCII art castle
- Mobile-responsive with tabbed panels

## Commands

Movement: `north`, `south`, `east`, `west`, `up`, `down` (or `n`, `s`, `e`, `w`, `u`, `d`)

Type `help` in-game for the full command list.

## Lore

> The Hollowed Keep surfaces where it pleases. At its threshold it takes the Toll:
> name, past, trade, loves. Everything it has ever taken settles downward, floor
> upon floor. Somewhere at the bottom is everything you were. The gates stand open.
