# The Hollowed Keep — Character Systems

Design doc for stats, races, skills, classes, and death. Companion to `world-bible.md`.

Core principle: **you are refilling a hollow.** Nothing about your character is chosen from a menu except what survives the Toll (race) and what the Toll missed (Remnant). Everything else is carved by what you actually do.

Project law: **polish over quantity.** Everything in this doc is the design skeleton. The "Launch Set" markers show what gets fully built first; nothing ships half-cooked just to pad a list.

---

## 1. The Two Skill Layers

**Base skills (stats)** — the classic seven. Slow-growing, milestone-based (deeds, tolls paid, rare finds — never grind):

| Stat | Governs |
|------|---------|
| Strength | melee damage, forcing doors, carrying, grappling |
| Dexterity | accuracy with finesse/ranged, dodging, climbing, sleight |
| Constitution | HP, poison/disease resist, stamina, drink |
| Intelligence | lore checks, crafting complexity, spell learning |
| Wisdom | perception, intuition, resisting mental effects, reading people |
| Charisma | prices, persuasion, performance, first impressions |
| **Hollow** | Keep-native. How deeply the Keep has touched you. Affects skill capacity, resistance to memory-tolls, and dialogue with Keep-things. Grows only through events — tolls paid, deaths survived, deep-floor exposure. Cuts both ways. |

Scale 1–20 (Hollow 0–10). Starting spread ~8–10, shaped by race.

**Player skills** — the discover-by-doing layer. The sheet starts *empty*. Every skill is granular and specific — no "Blades," no "One-Handed." You get good at *the thing you actually do*:

- **Weapon skills** (each its own skill): Daggers, Swords, Greatswords, Axes, Hammers & Maces, Spears, Bows, Crossbows, Thrown, Unarmed, Shields
- **Delving**: Stealth, Lockpicking, Climbing, Swimming, Traps (spot/disarm/set), Foraging, Cartography
- **Craft**: Cooking, Brewing, Smithing, Bonecraft, Fletching, Tailoring, Firecraft
- **Knowledge**: Lore, Alchemy, Ritual, Appraisal, Medicine
- **Social**: Silver Tongue, Haggling, Intimidation, Performance
- **The strange ones**: hidden until discovered — Demolitions, Bone-Speaking, Grave Etiquette, Falling (With Style), and many more that never appear on any public list. Rule: every floor ships 2–3+ hidden skills earned through unusual play.

Levels are plain numbers, **1–50**, technique unlocks at every 10 (e.g., Daggers 10 unlocks *bleed on backstab*). XP comes from doing, RuneScape-style. Curve tunable after playtests.

Carving moments stay the centerpiece:

```
[ Skill carved: DAGGERS — You introduced yourself point-first. The Keep remembers manners like yours. ]
[ DAGGERS is now 7. ]
```

### Capacity — the hollow only holds so much
No caps early; sprawl freely. From mid-game, total skill capacity is soft-capped by **Hollow** and level: you are a finite vessel. Raising something eventually means letting something fade (always warned, always player-chosen). Classes relieve the cap for in-class skills — that's *why* classes matter. The Unwritten keep the broadest raw capacity instead.

## 2. Races — what your blood remembers

Balance goal: a min/maxer should stare at any two races and think *"damn, they're both pretty good."* Every race has real pluses, real minuses (except Humans, whose identity is having neither), floor interactions, and one exclusive class.

### Human *(classic)*
- **Stats:** +1 to any two stats (your pick)
- **Skills:** +10% XP to *all* player skills
- **Prolific:** +1 recommended class slot at every crystallization
- **Drawbacks:** none — and no standout gifts either. The human gamble is breadth.
- **Exclusive class:** **Journeyman** — the only way to hold two classes at once (each at reduced power)
- *"The Keep finds humans... productive."*

### Dwarf *(classic)*
- **Stats:** +2 CON, +1 STR, −1 DEX
- **Skills:** +25% XP Smithing, Bonecraft, Brewing, Appraisal; −25% XP Stealth, Swimming
- **Stonesense:** hidden passages and structural secrets hint automatically on `search`
- **Bones Remember:** death-tolls take gold before memories, and *never* take craft skill levels
- **Drawbacks:** heavy-footed (the Stealth/Swim penalty is real), can't fit through some squeezes (alternate routes exist — see Multiple Solutions)
- **Exclusive class:** **Stonesinger** — sings to the Keep's bones; reshapes stone, opens walls
- *"The Keep respects things that endure. It has eaten very few dwarves it didn't have to chew."*

### Ashborn *(original)* — moor-pyre folk, fire in the blood
- **Stats:** +1 DEX, +1 INT, −1 CON (burned thin)
- **Skills:** +25% XP Firecraft, Demolitions, Cooking; −25% XP Swimming
- **Candleflame:** a fingertip light, always available, never drops, can't be stolen. Light is a real mechanic in this game; this is a quiet superpower.
- **Fire resist / cold weakness:** −25% fire damage taken, +25% cold and drowning damage. The Drowned Village will test them.
- **Exclusive class:** **Cinderlord** — stops carrying the fire and becomes it
- *"The Keep likes things that burn. They remind it of the sky."*

### Gravekin *(original)* — death-marked
- **Stats:** +1 WIS, +1 INT, −1 CHA *with the living* (+2 CHA with the dead — the dead find them charming)
- **Skills:** +25% XP Bonecraft, Ritual, Medicine; unlocks Grave Etiquette and Bone-Speaking faster than anyone
- **Louder Dead:** extra dialogue options with every ghost, skull, and revenant — and this game is full of them
- **Necrotic resist / consecration prickle:** −25% necrotic damage; minor discomfort debuff on holy ground (the Stolen Cathedral will test them)
- **Drawbacks:** living merchants charge them more, some living NPCs need convincing to deal at all
- **Exclusive class:** **Deathward** — the dead guard them in return
- *"The Keep is fond of Gravekin. Nobody has ever asked it why, and it has never volunteered."*

### Vesseling *(original, advanced)* — born hollow
- **Stats:** −1 CON, −1 CHA, **Hollow starts at 3** (everyone else starts 0–1)
- **Capacity:** +1 skill capacity band; crystallization milestones arrive ~25% sooner
- **Blank Remnant:** no past hook, no starting whisper. Their vault-reveal is the strangest one in the game.
- **Half-Remembered:** NPCs struggle to hold them in mind — mostly flavor, occasionally mechanical, occasionally *useful* (some things can't remember them either)
- **Drawbacks:** weakest start in the game; the payoff is the highest ceiling and the deepest mystery
- **Exclusive class:** **Hollow Saint** — emptiness, perfected
- *"The Keep did not take much at the gate. There was not much to take. It has been watching you ever since, the way a well watches a dropped stone."*

## 3. Remnants — what the Toll missed

One small thing survived. Whisper of a bonus + a personal questline (via the Remembrancer) + a bias on what the Vault assembles at the end. Not a class. A clue.

| Remnant | Whisper | Seeds |
|---------|---------|-------|
| A locket with a worn portrait | +Silver Tongue XP | someone loved you |
| A soldier's scar | +1 STR-based damage, +weapon XP (first weapon family you use) | you were in a war |
| Ink-stained fingers | +Lore XP, can read faded texts | you wrote things down |
| A thief's calluses | +Stealth & Lockpicking XP | you took things |
| A hymn stuck in your head | +Ritual XP, minor calm-spirits when hummed | you believed something |
| A burn that never healed | +Firecraft & Smithing XP | you made things, and paid for one |
| A key that fits nothing | ??? — doors notice you (+Lockpicking XP) | somewhere, a lock is waiting |
| A ring with a name inside — not yours | +Appraisal XP; the name recurs in the Keep | you carried someone else's promise |
| A child's straw doll | +Medicine XP; sleeping with it wards nightmares | someone small trusted you |
| A gambler's coin | luck: rerolls one bad outcome per hearth-rest | you never could walk past a wager |
| Sailor's knots on your wrists | +Climbing & Swimming XP, rope tricks | you knew the water |
| A broken blade hilt | +Smithing XP; the blade's other half exists | something ended badly, and you kept the handle |
| A wolf's tooth on a cord | +Foraging XP, beasts hesitate before attacking | something wild owed you |
| A debt-marker bearing a stranger's seal | +Haggling XP; someone in the Keep owes *you* | you were owed, and you came to collect |
| A milk tooth in a small pouch | +CON-based resists; protective fury (damage bonus when defending NPCs) | whose was it? |

(Vesselings skip this. Theirs is blank, and that's the point.)

## 4. Multiple Solutions, Always — design pillar

Target feeling: *"are you f—ing kidding me, that actually WORKED?"*

Every obstacle ships with **at least three** answers across different skill families, and the parser should reward lateral thinking beyond the authored list wherever the simulation allows. The locked door: pick it, force it, find the key, ask the right ghost, unscrew the hinges (Smithing), burn it (Firecraft, with consequences), or — if you're the Thresholder — simply disagree with it. Rats guarding a passage: fight them, sneak past, throw food, or be the sort of person rats follow now.

Authoring rule for every puzzle/obstacle: write the intended solution, then two more, then one that makes the designer laugh. The Keep comments on the weird ones — that's where the voice earns its keep:

```
[ The Keep has seen four thousand people fight that door. You are the first to feed it. ]
```

## 5. Classes

### Structure
- **Classic archetypes** — the D&D-familiar thirteen, skinned for this world. Recognizable on sight; each gets a Keep-native twist so none is a straight port.
- **Original classes** — native to the premise. Each must pass the uniqueness bar: if its identity can be summarized as "like [classic] but," it gets redesigned or cut.
- **Race-exclusives** — one per race (listed in §2).

**Launch Set** (fully built first, everything else designed-but-later): Fighter, Rogue, Cleric, Wizard + Reaver, Sapper, Grave-Speaker, Tollwright. Eight polished lanes covering melee/stealth/faith/arcane/premise-native. The rest unlock in waves as floors release.

### The classic thirteen
| Class | Keep-native twist |
|-------|-------------------|
| Fighter | Weapon mastery earned per weapon skill — the only class that can master *all* weapon families |
| Barbarian | Rage draws on the Hollow — emptier vessels rage harder. Dangerous synergy. |
| Rogue | The Keep's locks and shadows *recognize* skill; high-level Rogues get openings others never see |
| Ranger | There is no wilderness here — Rangers bond with the Keep's ecology: rats, hounds, worse |
| Monk | Discipline as armor against the Toll — Monks resist memory-loss on death |
| Paladin | An oath sworn *inside* the Keep, where oaths have weight and witnesses |
| Cleric | Which god answers prayers down here? Clerics eventually find out. They may not like it. |
| Druid | Shapes taken from the Orchard of Hands — the Keep's flora and fauna, not nature's |
| Bard | Songs are memory made loud — anathema and delicacy to the Keep both. Bards can *carry* memories for others. |
| Wizard | Spell theory scavenged from the Library of Ash; spells are *found*, not leveled into |
| Sorcerer | The Keep's power leaking into a cracked vessel; Hollow is their fuel gauge |
| Warlock | The patron is *in the building.* Negotiations available. Terms unfavorable. |
| Artificer | Gadgets from scavenged Taking-tech — drowned-village diving bells, foundry limbs |

### The originals *(uniqueness bar applies — pitch identities, full kits built in waves)*
| Class | Identity |
|-------|----------|
| **Reaver** | Takes from what it kills — carves out properties (a hound's speed, a wraith's chill) and wears them briefly. Not rage: *theft by violence*. |
| **Sapper** | Unmakes architecture. Demolitions, collapses, breach tactics. The Keep finds this personally offensive, which is half the fun. |
| **Grave-Speaker** | Diplomat to the dead. Doesn't raise them — *negotiates*: secrets, services, safe passage. The dead have wanted a good listener for centuries. |
| **Tollwright** | Manipulates cost itself. Pays HP instead of gold, redirects tolls onto enemies, makes the Keep take from *them*. The most premise-native class in the game. |
| **Thresholder** | Doors, boundaries, thresholds. Locks/unlocks anything eventually; blinks through doorways; draws lines things cannot cross. |
| **Memory-Thief** | Steals memories in combat — enemies forget their techniques, forget their orders, forget *you*. Sells what it steals. |
| **Lamplighter** | Light as weapon, shield, and sanctuary. Can light hearths others can't. Support class with teeth. |
| **Hearthkeeper** | Domestic magic: food, rest, mending, morale. The party class — feeds NPCs into loyalty, turns camps into fortresses. |
| **Broker** | Deals with anything that can want. Contracts, escrow, collateral — binds NPCs, spirits, and eventually stranger parties to terms. |
| **Bonewright** | Crafts from the Keep's most abundant resource. Weapons, tools, constructs. Macabre artisan, not a necromancer. |
| **Echo** | Channels taken selves from the Vault's leakage — borrows a dead duelist's stance, a drowned diver's lungs, one at a time, briefly. |
| **Wayfinder** | In a Keep that rearranges, they *keep their bearings*: shortcuts, true maps, Oubliette-sense, retreat routes. Navigation as power fantasy. |
| **King of Rats** | Hidden class. You know how you get it? You're kind to rats. Every rat. All of them. For a very long time. |

Crossover audit (run on every addition): Reaver≠Barbarian (theft, not rage), Grave-Speaker≠Warlock (negotiation, not pact), Bonewright≠Artificer (material craft, not gadgets), Memory-Thief≠Rogue (steals minds, not goods), Wayfinder≠Ranger (navigation, not ecology). Anything that fails the audit gets redesigned.

## 6. Crystallization — proposed, never assigned

### The event
At each milestone the Keep opens the **Ledger of Paths**:

- **Recommended offers (3–5):** assembled from your top skills, deeds, race, and Remnant. These glow, and come with the Keep's commentary on *why*. (Humans get +1 slot.)
- **The full list:** every class you've *unlocked visibility on*, freely choosable. The classic thirteen are always visible. Originals appear when the world shows them to you — meet a practicing Lamplighter, watch a Sapper die interestingly, read the right book. Race-exclusives are visible only to that race. Recommendations are guidance, never a cage: the human who ignores every signal and picks Fighter is playing correctly.

```
[ The Keep proposes: SAPPER. ]
[ You unmade three of its doors and one of its walls. It would like to see what you do with better tools. ]
[ Or consult the full Ledger of Paths. Or continue unwritten. ]
```

### Milestones and later floors
- **First crystallization:** end of Floor 1 (Warden of the Keep Proper falls, or the first Stairs are paid).
- **Every floor after:** a crystallization event at each descent offering: **Deepen** (advance class tier — new abilities, higher affinities), **Branch** (take a subclass, eligible ~Floor 4+), **Rewrite** (swap class — always possible, never free: the Keep takes something commensurate from the old lane), or **Stay as you are.**
- **Class tiers** track floors roughly 1:1, so a Floor-6 Reaver and a Floor-6 Rogue are peers in power with wildly different verbs.
- **Subclasses** = class + how you've *actually* been playing it + floor-specific deeds. A Reaver who hunts Wardens becomes a **Warden-Breaker**; one who fights bloody becomes a **Wound-Drinker**. Data-driven rules; the table grows forever.

### The Unwritten — staying classless
Hard mode, real identity, never a trap option:

- **Breadth:** keep the widest raw skill capacity in the game (classes lift caps in-lane; the Unwritten never narrow)
- **Voice:** unique dialogue throughout — NPCs find them unsettling, the Keep finds them *fascinating*, and both say so
- **The escalating proposals:** the Keep keeps trying. Its offers become more frequent, more personal, and more revealing — refusing the Keep is one of the best ways to learn what it wants
- **Exclusive Engravings** and an ending variant: the self the Vault assembles for an Unwritten is unprecedented, and the Keep's reaction to it is one of the game's secrets
- **The cost:** no affinities, no class abilities, no title the world bows to. Combat and checks are simply harder. That's the deal.

## 7. Death — the Keep takes more

No game-overs, no reload loop.

**Hearths:** cold hearths throughout the Keep can be lit — checkpoint, rest, and the one place the Keep's voice goes quiet. Lighting every hearth is its own quiet completionist thread.

**On death** you wake at your last hearth, minus something, always itemized, always one dry line:

```
[ The Keep accepts your offering. ]
[ Taken: 34 gold. The rat, it should be said, was also having a bad day. ]
```

Escalation tiers: gold/valuables → occasionally a skill level (*"a day's practice, gone"*) → rarely, Floor 4+, a memory gained *inside* the Keep: a fogged map region, an NPC who no longer remembers you. Telegraphed before it's possible; Dwarves and Monks bend the rules; Hollow stat resists the worst of it.

**Stairs-tolls** between floors reuse the same muscle — choose what you lose (world bible §4).

## 8. Save/Progression Notes

Saves stay localStorage (export/import string as escape hatch). Autosave fires on death *before* the toll applies; single rolling slot by default so death-tolls can't be keypress-reversed. All state maps cleanly to server-side characters for the multiplayer era; nothing above assumes single-player except where saves live.
