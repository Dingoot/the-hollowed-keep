# SPEC.md — The Hollowed Keep (living spec)

Tracks the game from 2026-07-08 onward. Changes made before this date live in git history and the code itself; this spec documents mechanics and state only as they are touched from here on out.

## World/game model
_(Filled in as systems are touched. When a change involves an existing mechanic, document that mechanic here as part of the change.)_

### Text pacing
- All game output goes through a print queue (`engine/ui.js`). Every pause is scaled by a persistent speed setting: `instant` (0×), `brisk` (0.35×, default), `slow` (1×, the original theatrical pace). Set with the `speed` command; stored in META (localStorage), so it survives across characters.
- Pressing Enter always flushes the queue instantly — an empty line is purely a skip; a command flushes first so its output never queues behind old text.
- Rooms stream their prose (sentence-by-sentence) only on first visit. Revisited rooms print everything at once, so re-traversal is fast. Enemy emerge lines follow the same rule.

## Constraints
- Plain HTML/CSS/JS, no build step — the game runs by opening `index.html` in a browser, no server required.
- Saves go through localStorage.
- Old-internet MUD aesthetic; keep the Keep's voice in all player-facing text.

## Current state
_(Only entries added or modified since 2026-07-08 are listed. Anything not listed here is as the code has it.)_

- Text speed setting (`speed instant|brisk|slow`, default brisk), Enter-to-skip, instant re-render of visited rooms. The dead `verbose` command was replaced by `speed`.

## Changelog
_(Newest on top. One dated line per change; commit messages match these lines.)_

- 2026-07-08 — Text pacing: brisk default speed, `speed` command (instant/brisk/slow), Enter skips streaming, visited rooms print instantly.
- 2026-07-08 — Start living spec; entries begin from this date forward.
