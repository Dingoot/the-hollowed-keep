// === RACES ===
// What your blood remembers. Pure data — the engine interprets perk strings.
// Stat mods are applied once at creation. Affinities are skill-XP rate
// modifiers (0.25 = +25%). Perks are string flags the engine implements.

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
    tagline: "Born hollow. (Advanced.)",
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

const RACE_ORDER = ["human", "dwarf", "ashborn", "gravekin", "vesseling"];
