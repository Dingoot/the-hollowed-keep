// === CLASSES - THE LAUNCH SET ===
// Proposed, never assigned. The Keep watches how you play and makes offers;
// the full Ledger of Paths is always choosable. Refusing is a real path.
// Pure data - scoring rules and abilities live in engine/classes.js.

const CLASSES = {
  fighter: {
    name: "Fighter",
    tagline: "Master of every argument steel can make.",
    keyStat: "str",
    affinities: {},
    familyAffinity: { family: "weapons", amount: 0.15 },
    abilityText: [
      "+15% XP to every weapon skill - the only path that masters all arms",
      "+1 attack, +1 defense",
      "RALLY: once per rest, plant your feet and recover 30% of your health (type 'rally', works mid-combat)",
    ],
    proposeLine: "You have introduced yourself to its residents with five kinds of edge and both fists. The Keep appreciates a generalist.",
    confirmLine: "Your hands settle into a stance no one taught you today. Every weapon in the world is now a sentence you can finish.",
  },
  rogue: {
    name: "Rogue",
    tagline: "The locks here have started gossiping about you.",
    keyStat: "dex",
    affinities: { stealth: 0.25, lockpicking: 0.25, daggers: 0.25 },
    abilityText: [
      "+25% XP: Stealth, Lockpicking, Daggers",
      "+1 DEX",
      "OPENING STRIKE: your first blow in every fight lands exactly where things prefer it didn't - automatic double damage",
    ],
    proposeLine: "Doors open for you that were not consulted on the matter. The Keep respects craftsmanship, even at its own expense.",
    confirmLine: "The shadows shift half a step closer, like colleagues making room.",
  },
  cleric: {
    name: "Cleric",
    tagline: "Something still answers prayers down here. Ask carefully.",
    keyStat: "wis",
    affinities: { ritual: 0.25, medicine: 0.25 },
    abilityText: [
      "+25% XP: Ritual, Medicine",
      "+1 WIS",
      "BENEDICTION: once per rest, pray - heal 40% of your health and purge poison (type 'pray', works mid-combat)",
      "Your strikes carry a radiant edge: +3 damage against the undead",
    ],
    proposeLine: "You kept faith in a building that eats it. Something noticed. The Keep declines to say what.",
    confirmLine: "Warmth settles over your shoulders like a borrowed coat. Somewhere far above, or far below, a bell you cannot hear finishes ringing.",
  },
  wizard: {
    name: "Wizard",
    tagline: "Spells are found, not given. You keep finding them.",
    keyStat: "int",
    affinities: { lore: 0.25, alchemy: 0.25, ritual: 0.25 },
    abilityText: [
      "+25% XP: Lore, Alchemy, Ritual",
      "+1 INT",
      "ARCANE EDGE: every spell you cast strikes half again as hard",
    ],
    proposeLine: "You read the things the dead wrote down, and worse, you understood them. The Keep files you under: promising, hazardous.",
    confirmLine: "The margins of every book you have ever read rearrange themselves slightly in your memory. They were always going to mean this.",
  },
  reaver: {
    name: "Reaver",
    tagline: "Take from what you kill. It wasn't using it.",
    keyStat: "str",
    affinities: { axes: 0.25, greatswords: 0.25, unarmed: 0.25 },
    abilityText: [
      "+25% XP: Axes, Greatswords, Unarmed",
      "+1 STR",
      "TAKE FROM THE DEAD: every kill carves a sliver of the fallen into you - +1 attack per kill, up to +5, until you rest",
    ],
    proposeLine: "Everything you have killed, you have kept a little of. The Keep recognizes the method. The Keep INVENTED the method.",
    confirmLine: "The next thing you kill will leave something behind in your grip. This feels less like learning and more like remembering.",
  },
  sapper: {
    name: "Sapper",
    tagline: "The Keep has opinions about its walls. Overrule them.",
    keyStat: "int",
    affinities: { demolitions: 0.25, firecraft: 0.25 },
    abilityText: [
      "+25% XP: Demolitions, Firecraft",
      "+1 INT",
      "GOOD WADDING: crafting bombs yields two per batch, and your bombs hit half again as hard",
    ],
    proposeLine: "You unmade three of its doors and one of its walls. It would like to see what you do with better tools. This is not a trap. Probably.",
    confirmLine: "You now see load-bearing everything. The Keep's architecture regards you the way a beach regards the tide.",
  },
  grave_speaker: {
    name: "Grave-Speaker",
    tagline: "The dead have wanted a good listener for centuries.",
    keyStat: "wis",
    affinities: { bone_speaking: 0.25, ritual: 0.25, bonecraft: 0.25 },
    abilityText: [
      "+25% XP: Bone-Speaking, Ritual, Bonecraft",
      "+1 WIS",
      "THE DEAD SPEAK FIRST: undead hesitate before striking you - they skip their first attack of every fight",
      "Extra words with every ghost, skull, and revenant (as the Gravekin hear)",
    ],
    proposeLine: "You talk to the dead like they are people. They are, of course. It is the living who forget. The dead have asked for you by description.",
    confirmLine: "The silence of the Keep acquires a texture, like a room full of held breath deciding, one exhale at a time, to trust you.",
  },
  tollwright: {
    name: "Tollwright",
    tagline: "Everything has a price. Start setting them.",
    keyStat: "cha",
    affinities: { haggling: 0.25, appraisal: 0.25 },
    abilityText: [
      "+25% XP: Haggling, Appraisal",
      "+1 CHA",
      "ADJUSTED TERMS: death-tolls take half as much from you, and merchants shave 10% off",
      "INVOKE THE TOLL: once per rest, in combat, make the enemy pay - it loses 15% of its full health, defense be damned (type 'invoke')",
    ],
    proposeLine: "You have died, paid, haggled, and died again - and you keep reading the receipts. The Keep has never once been audited. It finds the prospect... invigorating.",
    confirmLine: "You feel the ledger of the room: what everything owes, what everything is owed. The numbers are negotiable now. For you.",
  },
};

const CLASS_ORDER = ["fighter", "rogue", "cleric", "wizard", "reaver", "sapper", "grave_speaker", "tollwright"];
