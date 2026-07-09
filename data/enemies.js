// === ENEMIES ===

const ENEMIES = {
  giant_rats: { moves: [
      { type: "strike", weight: 3, telegraph: "The pack tightens, noses low, choosing a leg." },
      { type: "reckless", weight: 2, telegraph: "Two rats break early, over-eager, tumbling ahead of the pack." },
      { type: "heavy", weight: 1, telegraph: "The pack masses behind the biggest one, gathering for a rush." },
    ], animal: true, type: "beast", str: 6, dex: 14, wis: 5, emerge: "The rustling arrives before they do - then the shadows shiver and the rats pour out, dog-big, moving as one appetite.", name: "Giant Rats", desc: "A pack of rats the size of dogs, eyes gleaming red in the darkness. Their fur is matted with something dark and their teeth are too long.", hp: 12, maxHp: 12, attack: 3, defense: 1, xp: 10, gold: 0, loot: null, undead: false,
    attackMsg: "The rats swarm and bite!", defeatMsg: "The rats scatter, squealing, into the darkness." },
  feral_hound: { moves: [
      { type: "strike", weight: 3, telegraph: "The hound circles, head low, measuring you." },
      { type: "heavy", weight: 2, telegraph: "Its haunches coil - it means to go for your throat." },
      { type: "reckless", weight: 1, telegraph: "Froth flies as it snaps wild - all hunger, no craft." },
    ], animal: true, tameable: true, type: "beast", str: 12, dex: 13, wis: 8, emerge: "Something low detaches itself from the tangle of vines - grey-skinned where the fur has gone, breath rasping wet over its teeth. It puts itself deliberately between you and the far archway, head dropping, and its eyes catch what light there is and keep it.", name: "Feral Hound", desc: "A massive hound with slavering jaws and eyes that glow with unnatural intelligence. Its fur is patchy, revealing grey skin beneath.", hp: 22, maxHp: 22, attack: 6, defense: 2, xp: 15, gold: 0, loot: null, undead: false,
    attackMsg: "The hound lunges with snapping jaws!", defeatMsg: "The hound collapses with a final whimper, its glowing eyes fading to dark." },
  skeleton_warrior: { moves: [
      { type: "strike", weight: 2, telegraph: "It advances a drilled half-step, blade level." },
      { type: "guard", weight: 2, telegraph: "It sets its feet in parade order, blade high - a parry rehearsed for centuries." },
      { type: "heavy", weight: 1, telegraph: "The blade climbs into a slow, measured overhead cut." },
    ], type: "undead", humanoid: true, emerge: "Bone scrapes stone somewhere ahead - then it steps into what light there is, blade already up, moving like drill practice that never learnt to stop.", name: "Skeleton Warrior", desc: "The animated bones of a soldier, still wearing fragments of armour. It fights with terrible precision, muscle memory encoded in bone.", hp: 32, maxHp: 32, attack: 9, defense: 5, xp: 25, gold: 10, loot: null, undead: true,
    attackMsg: "The skeleton strikes with practiced precision!", defeatMsg: "The bones clatter apart and the animating force dissipates like smoke." },
  animated_armor: { moves: [
      { type: "heavy", weight: 2, telegraph: "The gauntlet draws back with a grind of plate, cocking a hammer-blow." },
      { type: "guard", weight: 2, telegraph: "It squares itself into a wall of polished steel." },
      { type: "strike", weight: 2, telegraph: "It grinds forward, fist rising." },
    ], type: "construct", emerge: "The polished suit turns its helm toward you with a slow grind of metal, and steps down off the stand as though dismissed from duty.", name: "Animated Armour", desc: "The suit of plate armour steps off its stand, moving with grinding precision. No body inhabits it - only will.", hp: 40, maxHp: 40, attack: 10, defense: 8, xp: 30, gold: 0, loot: null, undead: false,
    attackMsg: "The armour swings a massive gauntleted fist!", defeatMsg: "The armour freezes mid-swing, then collapses into a pile of inert metal." },
  cave_spider: { moves: [
      { type: "strike", weight: 2, telegraph: "It tests the air, fangs working." },
      { type: "reckless", weight: 2, telegraph: "It skitters high up the wall, poised to drop on you." },
      { type: "heavy", weight: 1, telegraph: "Venom beads at its fangs - it rears back to strike deep." },
    ], animal: true, type: "beast", str: 10, dex: 15, wis: 6, emerge: "A pale shape unfolds from the ceiling shadow - legs first, wrongly many - testing the air where your warmth is.", name: "Cave Spider", desc: "A spider the size of a large dog, pale and blind, sensing prey through vibration. Venom drips from its mandibles.", hp: 26, maxHp: 26, attack: 7, defense: 3, xp: 20, gold: 0, loot: null, undead: false, poisonous: true,
    attackMsg: "The spider strikes with venomous fangs!", defeatMsg: "The spider curls in on itself, legs twitching, then goes still." },
  ghoul: { moves: [
      { type: "reckless", weight: 3, telegraph: "It gibbers and gathers itself, hunger outrunning sense." },
      { type: "strike", weight: 2, telegraph: "It circles crabwise, claws flexing." },
      { type: "heavy", weight: 1, telegraph: "It coils low, jaw distending horribly." },
    ], type: "undead", humanoid: true, name: "Ghoul", desc: "A hunched figure with too-long limbs and a mouth of needle teeth. It was human once. Now it is hunger given form.", hp: 40, maxHp: 40, attack: 12, defense: 6, xp: 35, gold: 15, loot: null, undead: true,
    attackMsg: "The ghoul rakes with filthy claws!", defeatMsg: "The ghoul screams - a sound almost like words - and dissolves into dark mist." },
  wraith: { moves: [
      { type: "strike", weight: 2, telegraph: "The cold deepens. It drifts nearer." },
      { type: "heavy", weight: 2, telegraph: "It billows upward, darkness pooling in its hands." },
      { type: "guard", weight: 1, telegraph: "It thins to vapor - hard to read, harder to touch." },
    ], type: "undead", name: "Wraith", desc: "A shape of concentrated darkness in the form of a robed figure. Where its face should be, there is only void. Cold radiates from it in waves.", hp: 48, maxHp: 48, attack: 14, defense: 3, xp: 40, gold: 0, loot: null, undead: true, physicalResist: true,
    attackMsg: "The wraith's touch drains your life force!", defeatMsg: "The wraith shrieks - a sound like tearing silk - and unravels into wisps of shadow." },
  shadow_knight: { moves: [
      { type: "strike", weight: 2, telegraph: "The shadow-blade traces a lazy line toward you." },
      { type: "guard", weight: 2, telegraph: "The blade rises into a perfect, patient guard." },
      { type: "heavy", weight: 2, telegraph: "It draws the blade back in one slow, absolute arc." },
      { type: "reckless", weight: 1, telegraph: "It flickers forward - eager, for the first time." },
    ], type: "shadow", name: "Shadow Knight", desc: "A towering figure in armour of living shadow. It moves with fluid grace, its blade trailing darkness. The Hollow Steward's bailiff - stitched from taken shadow, sent to enforce.", hp: 64, maxHp: 64, attack: 16, defense: 10, xp: 55, gold: 0, loot: "shadow_plate", undead: false, shadowBeing: true,
    attackMsg: "The Shadow Knight's blade cuts through reality itself!", defeatMsg: "The Shadow Knight kneels, its form flickering. 'You are... worthy,' it whispers, and dissolves. Its armour remains, solidified from shadow to substance." },
  shadow_lord: { moves: [
      { type: "strike", weight: 3, telegraph: "The Toll-Rod tips toward you, casually, like a quill toward a column." },
      { type: "heavy", weight: 2, telegraph: "The Rod rises. The script in its eyes runs faster - a levy is being calculated." },
      { type: "guard", weight: 2, telegraph: "It folds shadow about itself like an auditor closing the books." },
    ], type: "shadow", name: "The Hollow Steward", desc: "Steward Malchor - or the punishment wearing his shape. A figure of curdled shadow in the tatters of household finery, the Toll-Rod in its grip. Where its eyes should be, pale ledger-script scrolls and scrolls. Its voice arrives like an invoice: exact, itemized, patient.", hp: 115, maxHp: 115, attack: 20, defense: 12, xp: 100, gold: 0, loot: "scepter_of_aethon", undead: false, shadowBeing: true, boss: true, regenerates: true,
    attackMsg: "The Hollow Steward levies a wave of curdled darkness!", defeatMsg: "The Steward buckles. The script in its eyes stutters, mid-column. 'You understand... nothing,' it rasps. 'The Rod is not power. It is a DEBT. Someone... must hold it...' It collapses, and the Toll-Rod rings against the obsidian like a dropped coin." },
};

