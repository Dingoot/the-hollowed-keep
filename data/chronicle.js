// === CHRONICLE DATA ===

const ADVENTURER_NAMES = [
  "Wanderer_42","SilverFox","Thornwick","Lady_Moonfall","Grimjaw_III",
  "Questborne","DarkWanderer","Ashknight","RuneSeeker","Stormcrow",
  "Daggerfall","Nightwhisper","IronVeil","ShadowPine","Frostbane",
  "Emberwolf","Goldenthorn","Ravencrest","Windwalker","Oakenshield",
  "BloodRaven","Silentblade","MistWalker","Hexbound","GhostPetal",
  "Crowfeather","Duskmire","StarAnvil","Ashgrove","Ironquill"
];

const CHRONICLE_EVENTS = [
  { action: "fell to the Wraith in the Catacombs", type: "death" },
  { action: "was slain by the Shadow Knight", type: "death" },
  { action: "was unmade by the Hollow Steward", type: "death" },
  { action: "was devoured by giant rats on the moor", type: "death" },
  { action: "drowned in the flooded passage", type: "death" },
  { action: "succumbed to spider venom", type: "death" },
  { action: "discovered the Hidden Passage", type: "discover" },
  { action: "found the Alchemist's Laboratory", type: "discover" },
  { action: "reached the Ancient Shrine", type: "discover" },
  { action: "entered the Shadow Halls", type: "discover" },
  { action: "solved the Chapel Riddle", type: "discover" },
  { action: "collected all five Journal Pages", type: "discover" },
  { action: "freed the imprisoned thief", type: "discover" },
  { action: "healed the wounded knight", type: "discover" },
  { action: "is exploring the Dungeons", type: "active" },
  { action: "is battling skeletons in the Guard Room", type: "active" },
  { action: "is reading in the Library", type: "active" },
  { action: "is navigating the Catacombs", type: "active" },
  { action: "is descending the Dungeon Stairs", type: "active" },
  { action: "carved a rune on the Wall", type: "rune" },
  { action: "left a warning near the bridge", type: "rune" },
  { action: "defeated the Animated Armor", type: "discover" },
  { action: "claimed the Silver Dagger", type: "discover" },
  { action: "has entered the Throne of Shadows", type: "active" },
  { action: "brewed a potion with the Alchemist", type: "discover" },
];

const RUNE_WALL_MESSAGES = [
  { text: "Beware the third corridor. The bones lie.", author: "Greymantle" },
  { text: "Steel is useless below the river. Bring silver or don't come at all.", author: "Thornwick" },
  { text: "The alchemist can be trusted. Mostly.", author: "RuneSeeker" },
  { text: "I hear singing from the walls. Beautiful and terrible.", author: "Lady_Moonfall" },
  { text: "Push the red book. Trust me.", author: "Wren" },
  { text: "The guardian's riddle: think flat, think paper.", author: "Anonymous" },
  { text: "I've been here three days. Or three centuries. Time is broken.", author: "Wanderer_42" },
  { text: "Don't look through the telescope at midnight.", author: "StarAnvil" },
  { text: "The merchant ghost gives fair prices. The skull gives fair warnings.", author: "Oakenshield" },
  { text: "To whoever finds this: I didn't make it out. The Rod isn't worth it. Nothing down there is worth it. Says the man still here.", author: "Ser Aldous" },
  { text: "The stars below the glass floor are not stars. They are eyes.", author: "Hexbound" },
  { text: "If you free the thief, watch your pockets.", author: "Daggerfall" },
  { text: "The crown gives back. The rod keeps taking. Choose like it's your last self. It is.", author: "Unknown" },
  { text: "I kept two books. I regret both.", author: "Malchor" },
  { text: "Three shards make a key. River, rune, crypt.", author: "GhostPetal" },
];

