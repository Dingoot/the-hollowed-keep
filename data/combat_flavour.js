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
    slash: {
      low: ["The edge parts fur and little else - a thin red seam ({dmg} damage)."],
      mid: [
        "You lay open a long wound along its flank; it screams and slews away ({dmg} damage).",
        "Your blade carves across it and comes away wet ({dmg} damage).",
      ],
    },
    pierce: {
      low: ["The point pricks it and it flinches more than it bleeds ({dmg} damage)."],
      mid: [
        "You drive the point between its ribs and it shudders around the steel ({dmg} damage).",
        "The thrust sinks deep into muscle and it recoils, keening ({dmg} damage).",
      ],
    },
    blunt: {
      low: ["The blow thuds into it and it shakes it off, unimpressed ({dmg} damage)."],
      mid: ["You crack the blow across it and something under the fur gives ({dmg} damage)."],
    },
    shoot: {
      low: ["The bolt grazes its hide and buries itself in the dark beyond ({dmg} damage)."],
      mid: [
        "The bolt punches into its flank and stays there; it snaps at the shaft, maddened ({dmg} damage).",
        "Your shot takes it clean through the shoulder and it stumbles ({dmg} damage).",
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
    slash: {
      low: ["The edge skates off old bone with a dry scrape ({dmg} damage)."],
      mid: ["You shear through a rib and it comes loose, clattering ({dmg} damage)."],
    },
    pierce: {
      low: ["The point slips between its bones and finds nothing to ruin ({dmg} damage)."],
      mid: ["You wedge the point into a joint and lever until something cracks ({dmg} damage)."],
    },
    blunt: {
      low: ["The blow rattles its frame and knocks it half a step out of true ({dmg} damage)."],
      mid: [
        "You stave in a section of it - bone gives all at once with a splintering crunch ({dmg} damage).",
        "The crushing blow lands and pieces of it simply leave ({dmg} damage).",
      ],
    },
    shoot: {
      low: ["The bolt clatters between its ribs and out the far side, harmless ({dmg} damage)."],
      mid: ["The bolt cracks a bone and lodges there, jarring it ({dmg} damage)."],
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
    slash: {
      low: ["The edge shrieks across the plate and leaves a bright scratch ({dmg} damage)."],
      mid: ["You find a seam and drag the edge through it; something inside protests ({dmg} damage)."],
    },
    pierce: {
      low: ["The point skids off the curve of the plate ({dmg} damage)."],
      mid: ["You drive the point into a rivet-gap and feel it punch through ({dmg} damage)."],
    },
    blunt: {
      low: ["The blow rings off the steel like a struck bell ({dmg} damage)."],
      mid: [
        "You dent the breastplate inward with a booming clang and the whole suit shudders ({dmg} damage).",
        "The blunt blow caves a pauldron and the arm beneath it hitches ({dmg} damage).",
      ],
    },
    shoot: {
      low: ["The bolt spangs off the plate and away ({dmg} damage)."],
      mid: ["The bolt finds a joint and jams it, grinding ({dmg} damage)."],
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
    slash: {
      low: ["Your edge opens a shallow cut ({dmg} damage)."],
      mid: ["Your blade draws a clean red line across it ({dmg} damage)."],
    },
    pierce: {
      low: ["Your point pricks home, shallow ({dmg} damage)."],
      mid: ["You drive the point in and feel it bite deep ({dmg} damage)."],
    },
    blunt: {
      low: ["Your blow thuds home without much behind it ({dmg} damage)."],
      mid: ["You land a heavy, jarring blow ({dmg} damage)."],
    },
    shoot: {
      low: ["Your shot grazes it ({dmg} damage)."],
      mid: ["Your shot punches home ({dmg} damage)."],
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
