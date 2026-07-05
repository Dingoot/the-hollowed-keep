// === RACES ===
// What your blood remembers. Pure data — the engine interprets perk strings.
// Stat mods are applied once at creation. Affinities are skill-XP rate
// modifiers (0.25 = +25%). Perks are string flags the engine implements.
//
// RACE_ORDER is the gate lineup. LOCKED_RACES are unlocked through play
// (stored in the meta save, persists across characters).

const RACES = {
  human: {
    name: "Human",
    tagline: "The gamble of breadth.",
    stats: {},
    freeStatPoints: 2,
    xpAll: 0.10,
    affinities: {},
    perks: ["prolific"],
    perkText: [
      "+1 to any two stats (your choice, now)",
      "+10% XP to every skill",
      "Prolific: an extra recommended offer at every crystallization",
    ],
    drawbackText: [],
    exclusiveClass: "Journeyman",
    flavor: "The Keep finds humans... productive.",
  },
  elf: {
    name: "Elf",
    tagline: "Four centuries, taken at the gate.",
    stats: { dex: 2, wis: 1, con: -1 },
    freeStatPoints: 0,
    xpAll: 0,
    affinities: { bows: 0.25, stealth: 0.25, foraging: 0.25, intimidation: -0.25 },
    perks: ["twilight_eyes", "stolen_centuries"],
    perkText: [
      "Twilight Eyes: in dark rooms you see shapes and exits without a light — details still need flame",
      "Stolen Centuries: the Toll took four hundred years of memory. Fragments surface, unbidden, in places the Keep has taken.",
    ],
    drawbackText: [
      "Gracile: -1 CON",
      "Serenity reads poorly here: slower to learn Intimidation",
    ],
    exclusiveClass: "Vigil",
    flavor: "The Keep took an elf's centuries like a fee. Elves have been coming back angry ever since.",
  },
  dwarf: {
    name: "Dwarf",
    tagline: "Things that endure.",
    stats: { con: 2, str: 1, dex: -1 },
    freeStatPoints: 0,
    xpAll: 0,
    affinities: { smithing: 0.25, bonecraft: 0.25, brewing: 0.25, appraisal: 0.25, stealth: -0.25, swimming: -0.25 },
    perks: ["stonesense", "bones_remember"],
    perkText: [
      "Stonesense: your bones itch near hidden things worth finding",
      "Bones Remember: death-tolls take gold before anything else, and never your craft",
    ],
    drawbackText: ["Heavy-footed: slower to learn Stealth and Swimming"],
    exclusiveClass: "Stonesinger",
    flavor: "The Keep respects things that endure. It has eaten very few dwarves it didn't have to chew.",
  },
  halfling: {
    name: "Halfling",
    tagline: "Filed under 'miscellaneous.'",
    stats: { dex: 2, cha: 1, str: -1 },
    freeStatPoints: 0,
    xpAll: 0,
    affinities: { stealth: 0.25, cooking: 0.25, haggling: 0.25, greatswords: -0.25, hammers: -0.25 },
    perks: ["underfoot_luck"],
    perkText: [
      "Underfoot Luck: one blow in ten simply misses you. Nobody can explain it. Stop asking.",
    ],
    drawbackText: [
      "Small frame: -1 STR, and the heaviest weapons come slow",
    ],
    exclusiveClass: "The Unnoticed",
    flavor: "The Porter's ledger lists halflings under 'miscellaneous.' They have never once complained. This unsettles the Keep more than armies did.",
  },
  gnome: {
    name: "Gnome",
    tagline: "The Keep is a machine. Machines talk.",
    stats: { int: 2, dex: 1, str: -1 },
    freeStatPoints: 0,
    xpAll: 0,
    affinities: { alchemy: 0.25, lockpicking: 0.25, appraisal: 0.25, intimidation: -0.25 },
    perks: ["gearsense"],
    perkText: [
      "Gearsense: locks, traps, and mechanisms confide in you — expect hints the others never hear",
    ],
    drawbackText: ["Small frame: -1 STR", "Hard to loom: slower to learn Intimidation"],
    exclusiveClass: "Wallspeaker",
    flavor: "Gnomes ask the Keep how it works. The Keep, flattered despite itself, occasionally answers.",
  },
  orc: {
    name: "Orc",
    tagline: "The ancestors ride the blood.",
    stats: { str: 2, con: 1, wis: -1 },
    freeStatPoints: 0,
    xpAll: 0,
    affinities: { axes: 0.25, unarmed: 0.25, intimidation: 0.25, lockpicking: -0.25 },
    perks: ["blood_roar"],
    perkText: [
      "Blood Roar: fall below a quarter health and the ancestors roar — +4 attack for 3 turns, once per rest",
    ],
    drawbackText: [
      "The fury clouds judgment: -1 WIS",
      "Big hands: slower to learn Lockpicking",
    ],
    exclusiveClass: "Old Blood",
    flavor: "Orc dead do not go below. They stay in the blood. The Keep finds this untidy, and has stopped trying to collect.",
  },
  tiefling: {
    name: "Tiefling",
    tagline: "There is history in your blood. It isn't yours.",
    stats: { cha: 2, int: 1, wis: -1 },
    freeStatPoints: 0,
    xpAll: 0,
    affinities: { silver_tongue: 0.25, ritual: 0.25, firecraft: 0.25 },
    perks: ["fiends_bargain", "marked_blood"],
    perkText: [
      "Fiend's Bargain: once per life, the blood refuses to let you die — you stand back up at 1 HP, toll unpaid",
      "The blood knows fire and old words: Firecraft, Ritual, Silver Tongue come easy",
    ],
    drawbackText: [
      "The whispers mislead: -1 WIS",
      "The dead remember hell: ghost merchants round up",
      "Marked: things of shadow notice you first",
    ],
    exclusiveClass: "Covenant",
    flavor: "The Keep met whatever lives in tiefling blood a long time ago. There is history. Neither party discusses it.",
  },
  ashborn: {
    name: "Ashborn",
    tagline: "Moor-pyre folk. Fire in the blood.",
    stats: { dex: 1, int: 1, con: -1 },
    freeStatPoints: 0,
    xpAll: 0,
    affinities: { firecraft: 0.25, demolitions: 0.25, cooking: 0.25, swimming: -0.25 },
    perks: ["candleflame", "fire_resist", "cold_weak"],
    perkText: [
      "Candleflame: a fingertip light, always with you, never drops, cannot be stolen",
      "Fire resist: -25% fire damage taken",
    ],
    drawbackText: ["Burned thin: +25% cold and drowning damage taken"],
    exclusiveClass: "Cinderlord",
    flavor: "The Keep likes things that burn. They remind it of the sky.",
  },
  gravekin: {
    name: "Gravekin",
    tagline: "Death-marked. The dead speak louder.",
    stats: { wis: 1, int: 1, cha: -1 },
    freeStatPoints: 0,
    xpAll: 0,
    affinities: { bonecraft: 0.25, ritual: 0.25, medicine: 0.25, bone_speaking: 0.5 },
    perks: ["louder_dead", "necrotic_resist", "consecration_prickle"],
    perkText: [
      "Louder Dead: extra words with every ghost, skull, and revenant — and this place is full of them",
      "The dead find you charming: ghost merchants give kin rates",
      "Necrotic resist: -25% necrotic damage taken",
    ],
    drawbackText: [
      "The living charge you more, and trust you less",
      "Consecrated ground prickles",
    ],
    exclusiveClass: "Deathward",
    flavor: "The Keep is fond of Gravekin. Nobody has ever asked it why, and it has never volunteered.",
  },
  vesseling: {
    name: "Vesseling",
    tagline: "Born hollow. (Unlocked.)",
    stats: { con: -1, cha: -1, hollow: 3 },
    freeStatPoints: 0,
    xpAll: 0,
    affinities: {},
    perks: ["blank_remnant", "half_remembered", "deep_capacity"],
    perkText: [
      "Hollow 3: the Keep took almost nothing at the gate. There was almost nothing to take.",
      "Deep capacity: you will hold more, later, than anyone",
      "Crystallization comes sooner for you",
    ],
    drawbackText: [
      "Weakest start in the game",
      "No Remnant. No clue. Your past is the strangest question in the Keep.",
      "People struggle to hold you in mind",
    ],
    exclusiveClass: "Hollow Saint",
    flavor: "The Keep has been watching you since the gate, the way a well watches a dropped stone.",
  },
};

// The gate lineup — classics first, then the moor-born originals.
const RACE_ORDER = ["human", "elf", "dwarf", "halfling", "gnome", "orc", "tiefling", "ashborn", "gravekin"];

// Bloods the Keep has not yet shown you. Key: race id → how it unlocks.
// Unlocks live in the meta save and persist across characters.
const LOCKED_RACES = {
  vesseling: { unlockHint: "The Keep shows this blood only to those who understand emptiness." },
};
