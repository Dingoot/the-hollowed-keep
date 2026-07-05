// Smoke test for The Hollowed Keep.
// Runs the game headless in Node with a stubbed DOM and executes a
// short playthrough of core commands + character systems. Exits
// non-zero on any crash.
//
// Usage: node test/smoke.js

const fs = require("fs");
const path = require("path");

// --- Load order: must match the <script> order in index.html ---
const LOAD_ORDER = [
  "data/art.js",
  "data/rooms.js",
  "data/items.js",
  "data/npcs.js",
  "data/enemies.js",
  "data/chronicle.js",
  "data/races.js",
  "data/remnants.js",
  "data/skills.js",
  "engine/utils.js",
  "engine/state.js",
  "engine/skills.js",
  "engine/ui.js",
  "engine/chronicle.js",
  "engine/parser.js",
  "engine/world.js",
  "engine/actions.js",
  "engine/combat.js",
  "engine/npcs.js",
  "engine/endings.js",
  "engine/creation.js",
  "engine/main.js",
];

// --- Minimal DOM / browser stubs ---
function makeEl() {
  return {
    innerHTML: "",
    textContent: "",
    value: "",
    className: "",
    scrollTop: 0,
    scrollHeight: 0,
    style: {},
    dataset: {},
    classList: {
      add() {},
      remove() {},
      toggle() {},
      contains() { return false; },
    },
    children: [],
    appendChild(c) { this.children.push(c); return c; },
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    querySelectorAll() { return []; },
    querySelector() { return makeEl(); },
    setAttribute() {},
  };
}

const elCache = {};
global.document = {
  getElementById(id) { return (elCache[id] ||= makeEl()); },
  createElement() { return makeEl(); },
  querySelectorAll() { return []; },
  querySelector() { return makeEl(); },
  addEventListener() {},
  body: makeEl(),
};
global.window = { innerWidth: 1200, addEventListener() {} };
global.location = { reload() {} };
global.localStorage = {
  _s: {},
  getItem(k) { return k in this._s ? this._s[k] : null; },
  setItem(k, v) { this._s[k] = String(v); },
  removeItem(k) { delete this._s[k]; },
};
global.setInterval = () => 0;
global.clearInterval = () => {};
global.setTimeout = () => 0;
global.clearTimeout = () => {};

// --- Concatenate all scripts + the test driver, evaluate once ---
const root = path.join(__dirname, "..");
let src = LOAD_ORDER.map((f) => fs.readFileSync(path.join(root, f), "utf8")).join("\n;\n");

const driver = `
;(function runSmoke() {
  const log = [];
  const step = (name, fn) => {
    try { fn(); log.push("ok   " + name); }
    catch (e) { log.push("FAIL " + name + " :: " + e.message); throw Object.assign(e, { _step: name, _log: log }); }
  };
  const assert = (cond, msg) => { if (!cond) throw new Error(msg); };

  step("initRoomStates", () => initRoomStates());

  // --- Character creation (dwarf, milk tooth) ---
  step("creation: race", () => {
    applyRaceToState("dwarf");
    assert(GS.race === "dwarf", "race not set");
    assert(GS.stats.con === 12 && GS.stats.str === 11 && GS.stats.dex === 9, "dwarf stat mods wrong: " + JSON.stringify(GS.stats));
  });
  step("creation: remnant", () => {
    applyRemnantToState("milk_tooth");
    assert(GS.stats.con === 13, "milk tooth CON bonus missing");
    assert(GS.perks.protective_fury === true, "remnant perk not stored");
  });
  step("creation: derived", () => {
    applyDerivedStats();
    assert(GS.maxHp === 115, "maxHp wrong: " + GS.maxHp);
    assert(GS.defense === 2, "dex penalty not applied to defense: " + GS.defense);
  });

  step("start state", () => { GS.gameStarted = true; assert(GS.currentRoom === "main_courtyard", "bad start room: " + GS.currentRoom); });
  step("printRoom", () => printRoom(GS.currentRoom));
  step("look", () => parseCommand("look"));
  step("help", () => parseCommand("help"));
  step("vessel sheet", () => parseCommand("stats"));
  step("legacy record", () => parseCommand("status"));
  step("move north", () => { parseCommand("north"); assert(GS.currentRoom === "great_hall", "move failed, in " + GS.currentRoom); });
  step("move south", () => { parseCommand("south"); assert(GS.currentRoom === "main_courtyard", "return failed, in " + GS.currentRoom); });

  // --- Skills ---
  step("skill carve + levels", () => {
    gainSkillXP("swords", 200);
    assert(GS.skills.swords, "swords not carved");
    assert(GS.skills.swords.level >= 2, "swords did not level: " + JSON.stringify(GS.skills.swords));
  });
  step("dwarf xp affinity", () => {
    assert(Math.abs(skillXpRate("brewing") - 1.25) < 0.001, "dwarf brewing rate: " + skillXpRate("brewing"));
    assert(Math.abs(skillXpRate("stealth") - 0.75) < 0.001, "dwarf stealth rate: " + skillXpRate("stealth"));
  });
  step("hidden skill: bone-speaking", () => {
    for (let i = 0; i < 5; i++) trackSkullTalk("talking_skull");
    assert(GS.skills.bone_speaking, "bone_speaking not carved after 5 talks");
  });
  step("skills cmd", () => parseCommand("skills"));

  // --- Hearths + death toll ---
  step("light hearth", () => {
    GS.currentRoom = "great_hall";
    GS.inventory.push("torch");
    doLightHearth();
    assert(GS.lastHearth === "great_hall", "lastHearth not set");
    assert(GS.litHearths.includes("great_hall"), "hearth not recorded");
  });
  step("hearth rest heals fully", () => {
    GS.hp = 10;
    doRest();
    assert(GS.hp === GS.maxHp, "hearth rest did not fully heal: " + GS.hp);
  });
  step("death toll: gold, wake at hearth", () => {
    GS.gold = 50;
    GS.currentRoom = "library";
    playerDeath("smoke test");
    assert(GS.gold === 30, "death toll wrong, gold: " + GS.gold);
    assert(GS.currentRoom === "great_hall", "did not wake at hearth: " + GS.currentRoom);
    assert(GS.hp === GS.maxHp, "not healed on respawn");
  });

  // --- Persistence ---
  step("save", () => saveGame());
  step("load keeps character", () => {
    loadGame();
    assert(GS.race === "dwarf", "race lost on load");
    assert(GS.skills.swords, "skills lost on load");
    assert(GS.lastHearth === "great_hall", "hearth lost on load");
  });
  step("restart cmd (reload stub)", () => parseCommand("restart"));

  // --- New races + meta unlocks ---
  step("gate lineup: 9 bloods, vesseling locked", () => {
    assert(RACE_ORDER.length === 9, "gate lineup: " + RACE_ORDER.length);
    assert(!availableRaces().includes("vesseling"), "vesseling should start locked");
  });
  step("elf stats", () => {
    GS = defaultState();
    applyRaceToState("elf");
    assert(GS.stats.dex === 12 && GS.stats.wis === 11 && GS.stats.con === 9, "elf mods: " + JSON.stringify(GS.stats));
  });
  step("tiefling fiend's bargain", () => {
    GS = defaultState();
    applyRaceToState("tiefling");
    applyDerivedStats();
    GS.gold = 50;
    playerDeath("bargain test");
    assert(GS.hp === 1, "bargain hp: " + GS.hp);
    assert(GS.gold === 50, "bargain must skip the toll, gold: " + GS.gold);
    assert(GS.perks.bargainUsed === true, "bargainUsed flag missing");
  });
  step("orc blood roar", () => {
    GS = defaultState();
    applyRaceToState("orc");
    applyDerivedStats();
    GS.hp = 20;
    GS.currentEnemy = { name: "Test Poker", attack: 1, attackMsg: "It pokes you." };
    enemyTurn();
    assert(GS.perks.roarUsed === true && GS.tempAttackBonus >= 4, "roar did not trigger: bonus " + GS.tempAttackBonus);
  });
  step("meta unlock: vesseling at 5 deaths", () => {
    GS = defaultState();
    GS.race = "dwarf";
    META.totalDeaths = 4;
    META.unlocks = {};
    playerDeath("meta test");
    assert(META.unlocks.vesseling === true, "vesseling not unlocked at 5 lifetime deaths");
    assert(availableRaces().includes("vesseling"), "unlocked blood missing from the gate");
  });

  log.forEach(function (l) { console.log(l); });
  console.log("SMOKE_OK");
})();
`;

try {
  eval(src + driver);
} catch (e) {
  if (e && e._log) console.log(e._log.join("\n"));
  console.error("SMOKE_FAILED:", e.message);
  process.exit(1);
}
