# SPEC.md — The Hollowed Keep (living spec)

Tracks the game from 2026-07-08 onward. Changes made before this date live in git history and the code itself; this spec documents mechanics and state only as they are touched from here on out.

## World/game model
_(Filled in as systems are touched. When a change involves an existing mechanic, document that mechanic here as part of the change.)_

### NPC conversations
- `talk [person]` engages that NPC (`GS.conversationWith`, saved with the game). While engaged, `ask [topic]` always goes to them — never to whoever happens to be first in the room. `topics` re-lists their topics. `goodbye`/`bye`/`farewell` ends the conversation (NPCs may have a custom `farewell` line); walking to another room, using the well rope, or entering combat ends it implicitly.
- `talk` with no name: engages the only NPC present, re-greets your current partner, or asks "Talk to whom?" if several are present. `ask [person] about [topic]` switches partners. Topic matching strips articles and accepts close matches (≥3 chars).
- Quest state lives ONLY on GS (`questLog`, `completedQuests`) — never on NPC objects, so it survives save/load. The chapel riddle uses `GS.flags.riddleSolved`.
- NPC room display: a room's `sight`/`npcIntro` prose plays on first visit only. Afterwards each present NPC shows a `presence` line (`postQuestPresence` once their quest is done; fallback "X is here."). NPCs with `leavesAfterQuest: true` (the thief) vanish from the room — display and interaction — once their quest completes; everyone else stays and can get `postQuestGreeting`/`postQuestTopics` (the Wounded Knight has them).

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
- Conversation engagement system (see NPC conversations above); all NPCs gained `presence` + `farewell` lines; knight gained post-quest greeting/topics/name; quest flags moved off NPC data into GS.
- Main Courtyard polish: room desc hints at the footprints, `examine well` no longer contradicts `search well` (the rope is gone in both), `examine` falls back to a room's searchTargets so examine/search agree, and throwing a coin down the well earns a Keep remark.

## Changelog
_(Newest on top. One dated line per change; commit messages match these lines.)_

- 2026-07-08 — Courtyard polish: footprints hinted in the room desc, well examine/search agree that the rope is gone, examine reaches searchTargets, coin down the well gets a Keep remark, healed knight renamed The Knight.
- 2026-07-08 — NPC conversations: talk engages one NPC, ask routes to them (fixes Wick's topics answered by the knight), goodbye/walking away ends it, presence lines replace repeated intros, knight reacts to being healed, quest state moved into the save.
- 2026-07-08 — Combat retune: hitting is the norm — to-hit +4 base and skill/3, enemy AC uses half DEF, player AC base 10, misses teach skill XP, adaptation counts only landed blows and resets on slip, scar remnant aids to-hit, unarmed base damage 2.
- 2026-07-08 — Text pacing: brisk default speed, `speed` command (instant/brisk/slow), Enter skips streaming, visited rooms print instantly.
- 2026-07-08 — Start living spec; entries begin from this date forward.
