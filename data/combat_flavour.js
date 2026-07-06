// === COMBAT FLAVOUR ===
// Every blow described for what it is: the verb, the victim, the damage.
// Keyed by enemy type, then attack group, then damage tier (low = 3 or
// less). {dmg} and {name} are filled in by the engine. Low-tier lines are
// allowed to be a little funny. That is the point of low-tier lines.

const ATTACK_FLAVOUR = {
  beast: {
    punch: {
      low: [
        "Your fist glances off its snout - it recoils, shakes its whole head, and sneezes violently ({dmg} damage).",
        "You clip its jaw as it twists away - more insult than injury ({dmg} damage).",
        "Your knuckles skid across its skull, which is apparently the hardest part of it ({dmg} damage).",
      ],
      mid: [
        "You hammer your fist down across the {name}'s skull - it staggers sideways, claws skidding on the stone ({dmg} damage).",
        "Your fist cracks into its ribs and something in there flexes the wrong way - it snarls through the pain ({dmg} damage).",
        "A short, ugly blow under the jaw snaps its head up and back ({dmg} damage).",
      ],
    },
    kick: {
      low: [
        "Your boot catches more matted fur than flesh - it skips back, unimpressed ({dmg} damage).",
        "A grazing kick along its flank - it wheels away and comes back low ({dmg} damage).",
      ],
      mid: [
        "You put your boot into its ribs and feel the whole cage shift - it yelps despite itself ({dmg} damage).",
        "Your heel comes down on its foreleg and the leg buckles - it scrambles, snarling, to keep its feet ({dmg} damage).",
        "A driving kick catches it mid-lunge and folds it sideways into the dirt ({dmg} damage).",
      ],
    },
    strike: {
      low: [
        "The edge skips off bone - a red line, no depth ({dmg} damage).",
        "It twists at the last breath and takes the flat instead of the edge ({dmg} damage).",
      ],
      mid: [
        "Steel opens a long stripe along the {name}'s flank - it screams like nothing that size should ({dmg} damage).",
        "You cut low and true; it drags that leg after it now, leaving a dark thread on the stones ({dmg} damage).",
        "The blade bites deep at the shoulder and grates on bone ({dmg} damage).",
      ],
    },
    throw: {
      low: [
        "The stone bounces off its haunch - it rounds on the noise, angrier ({dmg} damage).",
        "It jinks at the last instant; the throw clips an ear ({dmg} damage).",
      ],
      mid: [
        "The stone takes it above the eye with a crack - it drops its head and blinks hard, twice ({dmg} damage).",
      ],
    },
  },
  undead: {
    punch: {
      low: ["Your fist passes through robes and dust and finds too little to hurt ({dmg} damage)."],
      mid: ["You drive your fist through its guard and feel old bone shift and grind ({dmg} damage).", "The blow lands where a body used to keep its organs. Habit makes it flinch ({dmg} damage)."],
    },
    kick: {
      low: ["Your boot rattles it without rearranging anything important ({dmg} damage)."],
      mid: ["Your kick staves in something structural - it lurches, recalculating how to stand ({dmg} damage)."],
    },
    strike: {
      low: ["The blow glances off bone with a sound like a dropped plate ({dmg} damage)."],
      mid: ["Steel shears through it and it comes apart a little - not enough, but a little ({dmg} damage).", "The strike knocks it a half-step out of its own rhythm ({dmg} damage)."],
    },
    throw: {
      low: ["The stone passes through where a softer target would have minded ({dmg} damage)."],
      mid: ["The stone caves in a section it was still using ({dmg} damage)."],
    },
  },
  construct: {
    punch: {
      low: ["You punch the armour. The armour wins the exchange ({dmg} damage - most of it arguably yours)."],
      mid: ["You find the joint at the elbow and drive your fist in - metal grinds against metal ({dmg} damage)."],
    },
    kick: {
      low: ["Your boot rings off the breastplate like a struck bell ({dmg} damage)."],
      mid: ["A flat kick to the knee-joint and the whole leg jolts out of true ({dmg} damage)."],
    },
    strike: {
      low: ["The blow skates across the plate, shrieking ({dmg} damage)."],
      mid: ["You wedge the strike into the gap under the arm and lever - something inside gives ({dmg} damage)."],
    },
    throw: {
      low: ["The stone dents nothing and offends no one ({dmg} damage)."],
      mid: ["The stone crashes into the visor and the whole helm rings ({dmg} damage)."],
    },
  },
  shadow: {
    punch: {
      low: ["Your fist enters it and comes back cold to the elbow ({dmg} damage)."],
      mid: ["You strike where it is densest and feel it tear like wet cloth ({dmg} damage)."],
    },
    kick: {
      low: ["Your boot passes through its edge, scattering wisps that reform at leisure ({dmg} damage)."],
      mid: ["The kick lands in its core and the darkness ripples outward from your boot ({dmg} damage)."],
    },
    strike: {
      low: ["The edge parts it; it flows back around the cut, unhurried ({dmg} damage)."],
      mid: ["Your strike opens a seam of paler dark - it hisses like tearing silk ({dmg} damage)."],
    },
    throw: {
      low: ["The stone sails through it and clatters somewhere beyond, embarrassed ({dmg} damage)."],
      mid: ["The stone drags a channel of light through it as it passes ({dmg} damage)."],
    },
  },
  generic: {
    punch: {
      low: ["Your fist lands without much conviction ({dmg} damage)."],
      mid: ["You drive your fist in, thrown from the shoulder, and it lands solid ({dmg} damage)."],
    },
    kick: {
      low: ["Your boot glances off ({dmg} damage)."],
      mid: ["You plant a kick where it counts ({dmg} damage)."],
    },
    strike: {
      low: ["The blow skates off - a scratch ({dmg} damage)."],
      mid: ["You strike true, everything behind it ({dmg} damage)."],
    },
    throw: {
      low: ["It clips the target ({dmg} damage)."],
      mid: ["A solid hit, dead centre ({dmg} damage)."],
    },
  },
};

// One-time reactions as a fight turns: worn at half health, bloody at a quarter.
const STAGE_LINES = {
  beast: {
    worn: [
      "It is slowing now - flanks heaving, foam at the jaw, that first easy menace worn down to something more desperate.",
      "The circle it takes around you is smaller this time, and it favours a leg. It is hurting.",
    ],
    bloody: [
      "It is a mess now - coat dark and matted, one eye squinted shut, still coming because stopping was never in it.",
      "It can barely hold the snarl together. What is left is mostly refusal.",
    ],
  },
  undead: {
    worn: ["It has lost pieces it is not going to miss quickly enough.", "It moves like a puppet whose strings have started fraying."],
    bloody: ["It is held together by intention and not much else now.", "More of it is on the floor than in the fight."],
  },
  construct: {
    worn: ["The armour grinds at every joint now, leaking dust from its seams.", "One pauldron hangs loose, swinging with each step like a broken wing."],
    bloody: ["It staggers between blows, the will inside it audibly outlasting the metal.", "The plate is buckled through; whatever animates it is running out of shape to wear."],
  },
  shadow: {
    worn: ["It is thinner now - the light behind it shows through in patches.", "It gathers itself more slowly each time, like smoke in a draught."],
    bloody: ["It is barely holding a form at all - a suggestion of what stood there before.", "The dark of it has gone grey and threadbare."],
  },
  generic: {
    worn: ["It is worn down now - slower, more careful, no longer sure of this.", "The damage is telling. Its movements have lost their certainty."],
    bloody: ["It is barely holding together - whatever drives it is doing most of the work now.", "It sways. Not much of it is left willing."],
  },
};
