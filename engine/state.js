// === GAME STATE ===

const defaultState = () => ({
  currentRoom: "main_courtyard",
  hp: 100,
  maxHp: 100,
  attack: 5,
  defense: 3,
  level: 1,
  xp: 0,
  xpToLevel: 25,
  gold: 0,
  race: null,
  remnant: null,
  class: null,
  crystalAnnounced: false,
  stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10, hollow: 0 },
  skills: {},
  perks: {},
  litHearths: [],
  lastHearth: null,
  searchedRooms: [],
  chronicleLog: [],
  enteredFrom: {},
  runeMessages: [
    { text: "New arrival: when your legs remember themselves, come south to the gatehouse. Orientation is part of the service.", author: "The Porter" },
  ],
  companion: null,
  awaitingDeath: false,
  inventory: [],
  equipped: { weapon: null, armor: null, offhand: null, light: null, amulet: null, ring: null },
  spells: [],
  visitedRooms: [],
  flags: {},
  questLog: [],
  completedQuests: [],
  kills: {},
  deaths: 0,
  roomsDiscovered: 0,
  itemsFound: 0,
  poisoned: false,
  poisonTurns: 0,
  tempAttackBonus: 0,
  tempAttackTurns: 0,
  inCombat: false,
  currentEnemy: null,
  commandHistory: [],
  historyIndex: -1,
  gameStarted: false,
  gameWon: false,
  ending: null,
  turnCount: 0,
  runeWallMessages: [],
});

let GS = defaultState();
let roomStates = {};

// === META SAVE ===
// Persists across characters and restarts: race unlocks, lifetime tallies.
const META_KEY = 'hollowkeep_meta';
let META = { totalDeaths: 0, unlocks: {} };

function loadMeta() {
  try {
    const m = JSON.parse(localStorage.getItem(META_KEY));
    if (m) META = { totalDeaths: m.totalDeaths || 0, unlocks: m.unlocks || {} };
  } catch (e) { /* fresh meta */ }
}

function saveMeta() {
  localStorage.setItem(META_KEY, JSON.stringify(META));
}

loadMeta();

function initRoomStates() {
  roomStates = {};
  for (const [id, room] of Object.entries(ROOMS)) {
    roomStates[id] = {
      items: room.items ? [...room.items] : [],
      enemies: room.enemies ? [...room.enemies] : [],
      visited: false,
      searched: false,
      hiddenExitRevealed: room.hiddenExitRevealed || false,
    };
  }
}

// === SAVE / LOAD ===

function saveGame() {
  const data = { gs: GS, rooms: roomStates, version: 2 };
  localStorage.setItem('hollowkeep_save', JSON.stringify(data));
  print('Game saved.', 'success-msg');
}

function loadGame() {
  const raw = localStorage.getItem('hollowkeep_save');
  if (!raw) { print('No saved game found.', 'error-msg'); return false; }
  try {
    const data = JSON.parse(raw);
    GS = { ...defaultState(), ...data.gs };
    roomStates = data.rooms;
    if (!Array.isArray(GS.runeMessages)) GS.runeMessages = [];
    if (!GS.runeMessages.some(m => m && m.author === 'The Porter')) {
      GS.runeMessages.unshift({ text: 'New arrival: when your legs remember themselves, come south to the gatehouse. Orientation is part of the service.', author: 'The Porter' });
    }
    print('Game loaded.', 'success-msg');
    printRoom(GS.currentRoom);
    return true;
  } catch {
    print('Save data corrupted.', 'error-msg');
    return false;
  }
}

