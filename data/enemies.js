// === ENEMIES ===

const ENEMIES = {
  giant_rats: { name: "Giant Rats", desc: "A pack of rats the size of dogs, eyes gleaming red in the darkness. Their fur is matted with something dark and their teeth are too long.", hp: 15, maxHp: 15, attack: 3, defense: 1, xp: 10, gold: 0, loot: null, undead: false,
    attackMsg: "The rats swarm and bite!", defeatMsg: "The rats scatter, squealing, into the darkness." },
  feral_hound: { name: "Feral Hound", desc: "A massive hound with slavering jaws and eyes that glow with unnatural intelligence. Its fur is patchy, revealing grey skin beneath.", hp: 30, maxHp: 30, attack: 6, defense: 2, xp: 15, gold: 0, loot: null, undead: false,
    attackMsg: "The hound lunges with snapping jaws!", defeatMsg: "The hound collapses with a final whimper, its glowing eyes fading to dark." },
  skeleton_warrior: { name: "Skeleton Warrior", desc: "The animated bones of a soldier, still wearing fragments of armor. It fights with terrible precision, muscle memory encoded in bone.", hp: 45, maxHp: 45, attack: 9, defense: 5, xp: 25, gold: 10, loot: null, undead: true,
    attackMsg: "The skeleton strikes with practiced precision!", defeatMsg: "The bones clatter apart and the animating force dissipates like smoke." },
  animated_armor: { name: "Animated Armor", desc: "The suit of plate armor steps off its stand, moving with grinding precision. No body inhabits it—only will.", hp: 55, maxHp: 55, attack: 10, defense: 8, xp: 30, gold: 0, loot: null, undead: false,
    attackMsg: "The armor swings a massive gauntleted fist!", defeatMsg: "The armor freezes mid-swing, then collapses into a pile of inert metal." },
  cave_spider: { name: "Cave Spider", desc: "A spider the size of a large dog, pale and blind, sensing prey through vibration. Venom drips from its mandibles.", hp: 35, maxHp: 35, attack: 7, defense: 3, xp: 20, gold: 0, loot: null, undead: false, poisonous: true,
    attackMsg: "The spider strikes with venomous fangs!", defeatMsg: "The spider curls in on itself, legs twitching, then goes still." },
  ghoul: { name: "Ghoul", desc: "A hunched figure with too-long limbs and a mouth of needle teeth. It was human once. Now it is hunger given form.", hp: 55, maxHp: 55, attack: 12, defense: 6, xp: 35, gold: 15, loot: null, undead: true,
    attackMsg: "The ghoul rakes with filthy claws!", defeatMsg: "The ghoul screams—a sound almost like words—and dissolves into dark mist." },
  wraith: { name: "Wraith", desc: "A shape of concentrated darkness in the form of a robed figure. Where its face should be, there is only void. Cold radiates from it in waves.", hp: 65, maxHp: 65, attack: 14, defense: 3, xp: 40, gold: 0, loot: null, undead: true, physicalResist: true,
    attackMsg: "The wraith's touch drains your life force!", defeatMsg: "The wraith shrieks—a sound like tearing silk—and unravels into wisps of shadow." },
  shadow_knight: { name: "Shadow Knight", desc: "A towering figure in armor of living shadow. It moves with fluid grace, its blade trailing darkness. The Shadow Lord's champion.", hp: 85, maxHp: 85, attack: 16, defense: 10, xp: 55, gold: 0, loot: "shadow_plate", undead: false, shadowBeing: true,
    attackMsg: "The Shadow Knight's blade cuts through reality itself!", defeatMsg: "The Shadow Knight kneels, its form flickering. 'You are... worthy,' it whispers, and dissolves. Its armor remains, solidified from shadow to substance." },
  shadow_lord: { name: "The Shadow Lord", desc: "Lord Malachar Vane—or what remains of him. A figure of absolute authority wreathed in living darkness. His eyes are voids that pull at your consciousness. His voice echoes from everywhere and nowhere.", hp: 150, maxHp: 150, attack: 20, defense: 12, xp: 100, gold: 0, loot: "scepter_of_aethon", undead: false, shadowBeing: true, boss: true, regenerates: true,
    attackMsg: "The Shadow Lord unleashes a wave of pure darkness!", defeatMsg: "The Shadow Lord staggers. The darkness around him flickers. 'You... understand nothing...' he rasps. 'The Scepter... is not a weapon... it is a SEAL...' He collapses, and the Scepter clatters to the ground, pulsing with terrible energy." },
};

