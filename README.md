# The Hollowed Keep

A text-based adventure game with an old-internet MUD aesthetic.

> Every door demands a toll. The Keep's toll is you.

**Play it:** Open `index.html` in any browser. No server required.

**Structure:** world content lives in `data/`, game logic in `engine/`, design docs in `docs/` — see `docs/architecture.md`. Test with `node test/smoke.js`. The original single-file prototype is preserved in `legacy/`.

## Features

- 41 rooms across 6 regions (The Approach, Courtyard, Ground Floor, Upper Floors, The Dungeons, The Deep)
- Turn-based combat with 9 enemy types including a final boss
- 35+ items: weapons, armor, potions, quest items, lore documents
- 10 NPCs with dialogue trees and quest lines
- Puzzles, hidden passages, and multiple endings
- Inventory, equipment, and leveling system
- Save/load via localStorage
- Adventurer's Chronicle: simulated live activity from other "players"
- Rune Wall: leave persistent messages for future visits
- CRT terminal aesthetic with ASCII art castle
- Mobile-responsive with tabbed panels

## Commands

Movement: `north`, `south`, `east`, `west`, `up`, `down` (or `n`, `s`, `e`, `w`, `u`, `d`)

Type `help` in-game for the full command list.