# SPEC.md — The Hollowed Keep (living spec)

Tracks the game from 2026-07-08 onward. Changes made before this date live in git history and the code itself; this spec documents mechanics and state only as they are touched from here on out.

## World/game model
_(Filled in as systems are touched. When a change involves an existing mechanic, document that mechanic here as part of the change.)_

### Combat math (d20)
- Player attack: `d20 + 4 + stat mod (STR, or DEX for finesse weapons) + skill/3 + remnant to-hit bonus` vs enemy AC `8 + DEF/2`. Natural 20 always hits and crits (double damage). Misses grant a small amount of weapon-skill XP (2; hits grant 5), so whiffing still trains the skill.
- Player damage: `weapon base (unarmed 2) + stat mod + skill/4 + flat bonuses + rng(0-2)`, min 1.
- Player AC: `10 + DEX mod + gear defense + perks`. Enemy attack: `d20 + 2 + ATK/3` vs that.
- Enemy adaptation: only blows that LAND feed an enemy's memory of a verb. After 3 landed repeats it may slip the attack (15% per further rep, capped 45%); a slip resets its memory, so it nudges variety rather than locking a verb out. Switching verbs also resets.
- The scar remnant's `bonusAttack` grants +1 to hit AND +1 damage.
- Combat header shows the enemy's AC (the number your roll is against), not raw DEF.
- Design intent: hitting is the norm, missing the exception. Baselines (level 1 orc + scar, verified by simulation): ~95% to hit rats, ~85% skeleton, 75% Animated Armour bare-fisted (a ~45% win — it's a brawl, not a wall; any weapon+armor makes it ~98%).

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
- Combat formulas retuned (see Combat math above); smoke test's AC assertion updated to the new base.

## Changelog
_(Newest on top. One dated line per change; commit messages match these lines.)_

- 2026-07-08 — Combat retune: hitting is the norm — to-hit +4 base and skill/3, enemy AC uses half DEF, player AC base 10, misses teach skill XP, adaptation counts only landed blows and resets on slip, scar remnant aids to-hit, unarmed base damage 2.
- 2026-07-08 — Text pacing: brisk default speed, `speed` command (instant/brisk/slow), Enter skips streaming, visited rooms print instantly.
- 2026-07-08 — Start living spec; entries begin from this date forward.
