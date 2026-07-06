// === PLAYER SKILLS ===
// The sheet starts empty. Skills are carved by doing.
// "hidden" skills never appear in any list until carved.
// Levels 1-50. XP cost to go from level N to N+1:
//   floor(baseCost * N^exponent)

const SKILL_XP = { baseCost: 30, exponent: 1.35, maxLevel: 50 };

const SKILLS = {
  // Weapons - each family its own skill. You get good at the thing you use.
  daggers: { name: "Daggers", family: "weapons",
    carve: "You introduced yourself point-first. The Keep remembers manners like yours." },
  swords: { name: "Swords", family: "weapons",
    carve: "The old argument, steel against the world. The Keep has heard it before. It listens anyway." },
  greatswords: { name: "Greatswords", family: "weapons",
    carve: "Subtlety was also available. The Keep respects the choice." },
  axes: { name: "Axes", family: "weapons",
    carve: "A tool for trees, applied to problems that are not trees. The Keep approves of adaptation." },
  hammers: { name: "Hammers & Maces", family: "weapons",
    carve: "Some locks are shaped like skulls. The Keep admires a universal key." },
  spears: { name: "Spears", family: "weapons",
    carve: "Distance, the first armour. The Keep notes that you like to keep things at arm's length." },
  bows: { name: "Bows", family: "weapons",
    carve: "Death at a distance, delivered quietly. The Keep barely heard it." },
  crossbows: { name: "Crossbows", family: "weapons",
    carve: "Patience, geometry, and a trigger. The Keep appreciates machinery of intent." },
  thrown: { name: "Thrown", family: "weapons",
    carve: "You gave your weapon away, violently. Bold. The Keep is watching to see if you get it back." },
  unarmed: { name: "Unarmed", family: "weapons",
    carve: "You brought hands to a monster fight. The Keep has decided not to look away." },
  shields: { name: "Shields", family: "weapons",
    carve: "The art of still being here afterward. The Keep finds survivors more interesting than heroes." },

  // Delving
  stealth: { name: "Stealth", family: "delving",
    carve: "You moved like someone with debts. The Keep approves of quiet people." },
  lockpicking: { name: "Lockpicking", family: "delving",
    carve: "The lock had one opinion. You had several slender counterarguments." },
  climbing: { name: "Climbing", family: "delving",
    carve: "Up is a direction most people only look. The Keep felt your fingers on it and did not mind." },
  swimming: { name: "Swimming", family: "delving",
    carve: "The water here remembers being elsewhere. It held you anyway." },
  foraging: { name: "Foraging", family: "delving",
    carve: "You found food where the Keep keeps its dead. It calls that initiative." },

  // Craft
  cooking: { name: "Cooking", family: "craft",
    carve: "You made something worth eating in a place that eats. The irony is noted, and savored." },
  brewing: { name: "Brewing", family: "craft",
    carve: "Liquid solutions to solid problems. The Keep has seen alchemists come and go. Mostly go." },
  smithing: { name: "Smithing", family: "craft",
    carve: "Fire, metal, intention. The oldest recipe. The Keep remembers when it was new." },
  bonecraft: { name: "Bonecraft", family: "craft",
    carve: "The Keep's most abundant resource, at last put to use. Waste not." },
  firecraft: { name: "Firecraft", family: "craft",
    carve: "You made fire behave. The Keep suggests you not get comfortable about that." },

  // Knowledge
  lore: { name: "Lore", family: "knowledge",
    carve: "You read the things the dead wrote down. Somewhere below, the dead are flattered." },
  alchemy: { name: "Alchemy", family: "knowledge",
    carve: "The distinction between potion and poison is mostly dosage. You are learning the dosage." },
  ritual: { name: "Ritual", family: "knowledge",
    carve: "Words in the right order, at the right time, in the right dark. The Keep mouths along." },
  appraisal: { name: "Appraisal", family: "knowledge",
    carve: "You know what things are worth. In here, that is a survival skill." },
  medicine: { name: "Medicine", family: "knowledge",
    carve: "You put someone back together. The Keep mostly sees the other direction." },

  // Social
  silver_tongue: { name: "Silver Tongue", family: "social",
    carve: "Words, arranged so that doors open. The Keep knows the trick. It invented the trick." },
  haggling: { name: "Haggling", family: "social",
    carve: "You argued about money with the dead. And won. The Keep is genuinely delighted." },
  intimidation: { name: "Intimidation", family: "social",
    carve: "You made something afraid, in the place fear was born. Professional respect." },

  pugilism: { name: "Pugilism", family: "weapons", hidden: true,
    carve: "Fists, refined past desperation into method. The Keep has hosted worse schools." },
  boot_heel: { name: "Boot & Heel", family: "weapons", hidden: true,
    carve: "You have decided the floor is a weapon and you are its delivery. The Keep respects commitment to a thesis." },

  // The strange ones - hidden until carved. This list will grow. Quietly.
  demolitions: { name: "Demolitions", family: "strange", hidden: true,
    carve: "You made fire your argument. The Keep finds you persuasive." },
  bone_speaking: { name: "Bone-Speaking", family: "strange", hidden: true,
    carve: "You kept talking to the dead until the dead started talking back. They have been waiting for a good listener." },
  grave_etiquette: { name: "Grave Etiquette", family: "strange", hidden: true,
    carve: "You take from the dead politely. The dead have noticed. The dead appreciate it." },
  falling: { name: "Falling (With Style)", family: "strange", hidden: true,
    carve: "That is three times gravity has tried to file a complaint about you. The Keep is keeping score." },
  beastmaster: { name: "Beastmaster", family: "strange", hidden: true,
    carve: "You spoke softly to a thing that meant to kill you, and it listened. The Keep has never once managed that." },
};
