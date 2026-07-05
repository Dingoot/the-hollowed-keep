// === REMNANTS ===
// The one thing the Toll missed. A whisper of a bonus, a seed of a past.
// Affinities modify skill XP rates. Perk strings are implemented by the
// engine as systems come online; unimplemented perks are still recorded
// on the character and will begin working when their system ships.

const REMNANTS = {
  locket: {
    name: "A locket with a worn portrait",
    whisper: "Someone loved you.",
    affinities: { silver_tongue: 0.25 },
    perks: [],
  },
  scar: {
    name: "A soldier's scar",
    whisper: "You were in a war.",
    affinities: {},
    bonusAttack: 1,
    perks: ["first_weapon_affinity"],
  },
  ink_fingers: {
    name: "Ink-stained fingers",
    whisper: "You wrote things down.",
    affinities: { lore: 0.25 },
    perks: ["read_faded"],
  },
  calluses: {
    name: "A thief's calluses",
    whisper: "You took things.",
    affinities: { stealth: 0.25, lockpicking: 0.25 },
    perks: [],
  },
  hymn: {
    name: "A hymn stuck in your head",
    whisper: "You believed something.",
    affinities: { ritual: 0.25 },
    perks: ["calm_spirits"],
  },
  old_burn: {
    name: "A burn that never healed",
    whisper: "You made things, and paid for one.",
    affinities: { firecraft: 0.25, smithing: 0.25 },
    perks: [],
  },
  strange_key: {
    name: "A key that fits nothing",
    whisper: "Somewhere, a lock is waiting.",
    affinities: { lockpicking: 0.25 },
    perks: ["doors_notice"],
  },
  named_ring: {
    name: "A ring with a name inside — not yours",
    whisper: "You carried someone else's promise.",
    affinities: { appraisal: 0.25 },
    perks: ["the_name_recurs"],
  },
  straw_doll: {
    name: "A child's straw doll",
    whisper: "Someone small trusted you.",
    affinities: { medicine: 0.25 },
    perks: ["ward_nightmares"],
  },
  gambler_coin: {
    name: "A gambler's coin",
    whisper: "You never could walk past a wager.",
    affinities: {},
    perks: ["luck_reroll"],
  },
  sailor_knots: {
    name: "Sailor's knots on your wrists",
    whisper: "You knew the water.",
    affinities: { climbing: 0.25, swimming: 0.25 },
    perks: ["rope_tricks"],
  },
  broken_hilt: {
    name: "A broken blade hilt",
    whisper: "Something ended badly, and you kept the handle.",
    affinities: { smithing: 0.25 },
    perks: ["blade_half_exists"],
  },
  wolf_tooth: {
    name: "A wolf's tooth on a cord",
    whisper: "Something wild owed you.",
    affinities: { foraging: 0.25 },
    perks: ["beast_hesitation"],
  },
  debt_marker: {
    name: "A debt-marker bearing a stranger's seal",
    whisper: "You were owed, and you came to collect.",
    affinities: { haggling: 0.25 },
    perks: ["someone_owes_you"],
  },
  milk_tooth: {
    name: "A milk tooth in a small pouch",
    whisper: "Whose was it?",
    affinities: {},
    bonusCon: 1,
    perks: ["protective_fury"],
  },
};

const REMNANT_ORDER = [
  "locket", "scar", "ink_fingers", "calluses", "hymn", "old_burn",
  "strange_key", "named_ring", "straw_doll", "gambler_coin",
  "sailor_knots", "broken_hilt", "wolf_tooth", "debt_marker", "milk_tooth",
];
