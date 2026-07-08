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
  "data/classes.js",
  "data/verbs.js",
  "data/ambience.js",
  "data/combat_flavour.js",
  "engine/utils.js",
  "engine/state.js",
  "engine/skills.js",
  "engine/classes.js",
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
    assert(playerAC() === 9, "dwarf AC (10 + dex mod -1): " + playerAC());
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
  step("death toll: gold, then the choice", () => {
    GS.gold = 50;
    GS.currentRoom = "library";
    playerDeath("smoke test");
    assert(GS.gold === 30, "death toll wrong, gold: " + GS.gold);
    assert(GS.awaitingDeath === true, "death should await the choice");
    parseCommand("wake");
    assert(GS.awaitingDeath === false, "wake did not clear the between");
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
  // --- Content pass: The Toll world ---
  step("threshold rebuilt", () => {
    assert(!ROOMS.moor_path && !ROOMS.crumbling_bridge, "old approach rooms remain");
    assert(ROOMS.outer_gate.region === "The Threshold", "region not renamed");
    assert(ROOMS.gatehouse.npcs && ROOMS.gatehouse.npcs.includes("porter"), "porter not at the gate");
    assert(ROOMS.main_courtyard.npcs.includes("wick"), "wick not in courtyard");
    assert(NPCS.porter && NPCS.wick, "new NPC defs missing");
    assert(ROOMS.outer_gate.searchTargets.gouges.finds.includes("journal_page_1"), "journal page 1 lost in the move");
  });
  step("old lore gone from data", () => {
    const blob = JSON.stringify(ROOMS) + JSON.stringify(ITEMS) + JSON.stringify(NPCS) + JSON.stringify(ENEMIES);
    assert(!/Vane|Scepter of Aethon|Shadow Lord|Malachar/.test(blob), "old premise text still present");
  });
  step("demolitions via crude bomb craft", () => {
    GS = defaultState();
    GS.race = "human";
    GS.inventory.push("saltpeter", "lamp_oil");
    doCombine("bomb");
    assert(hasItem("crude_bomb"), "bomb not crafted");
    assert(GS.skills.demolitions, "demolitions not carved on craft");
  });
  step("talk to the porter", () => {
    GS.currentRoom = "gatehouse";
    initRoomStates();
    parseCommand("talk porter");
    parseCommand("ask toll");
  });

  // --- Crystallization ---
  step("crystallize: recommendations follow play", () => {
    GS = defaultState();
    GS.race = "human";
    GS.level = 4;
    gainSkillXP("stealth", 400);
    gainSkillXP("lockpicking", 400);
    const recs = recommendedClasses();
    assert(recs.length === 4, "human should get 4 offers, got " + recs.length);
    assert(recs[0] === "rogue", "sneaky play should top-rank rogue, got " + recs[0]);
  });
  step("crystallize: ledger + accept", () => {
    doCrystallize("");
    doCrystallize("rogue");
    assert(GS.flags.pendingClass === "rogue", "proposal not pending");
    const dexBefore = GS.stats.dex;
    doAcceptClass();
    assert(GS.class === "rogue", "class not applied");
    assert(GS.stats.dex === dexBefore + 1, "key stat bump missing");
  });
  step("class affinity feeds XP rate", () => {
    assert(Math.abs(skillXpRate("daggers") - 1.35) < 0.001, "rogue+human daggers rate: " + skillXpRate("daggers"));
  });
  step("rogue opening strike flag", () => {
    initRoomStates();
    GS.currentRoom = "great_hall";
    startCombat("giant_rats");
    assert(GS.perks.firstStrikeDone === false, "flag not reset on combat start");
    handleCombatCommand("attack");
    assert(GS.perks.firstStrikeDone === true, "flag not set after strike");
    GS.inCombat = false; GS.currentEnemy = null;
  });
  step("tollwright: adjusted death terms", () => {
    GS = defaultState();
    GS.race = "dwarf";
    GS.class = "tollwright";
    GS.gold = 50;
    playerDeath("terms test");
    assert(GS.gold === 40, "tollwright toll should halve to 10, gold: " + GS.gold);
    parseCommand("wake");
  });
  step("fighter rally", () => {
    GS = defaultState();
    GS.class = "fighter";
    GS.maxHp = 100; GS.hp = 10;
    doRally();
    assert(GS.hp === 40, "rally heal wrong: " + GS.hp);
    doRally();
    assert(GS.hp === 40, "rally must be once per rest");
    resetPerRestAbilities();
    GS.hp = 10;
    doRally();
    assert(GS.hp === 40, "rally should reset after rest");
  });
  step("reaver takes from the dead", () => {
    GS = defaultState();
    GS.class = "reaver";
    GS.currentRoom = "great_hall";
    initRoomStates();
    GS.currentEnemy = { name: "Test", xp: 0, gold: 0, loot: null, hp: 0, maxHp: 10 };
    GS.inCombat = true;
    endCombat(true);
    assert(GS.perks.reaverStacks === 1, "reaver stack missing: " + GS.perks.reaverStacks);
    assert(getAttack() >= GS.attack + 1, "stack not in attack");
  });
  step("announce at level milestone", () => {
    GS = defaultState();
    GS.level = 4;
    GS.crystalAnnounced = false;
    announceCrystallization();
    assert(GS.crystalAnnounced === true, "announcement did not fire");
  });

  step("kick devotion carves Boot & Heel", () => {
    GS = defaultState();
    applyRaceToState("human");
    applyDerivedStats();
    GS.maxHp = 1000; GS.hp = 1000;
    GS.currentRoom = "main_courtyard";
    initRoomStates();
    GS.inCombat = true;
    GS.currentEnemyId = "test_dummy";
    GS.currentEnemy = { name: "Training Dummy", hp: 10000, maxHp: 10000, attack: 1, defense: 0, attackMsg: "It wobbles." };
    for (let i = 0; i < 8; i++) handleCombatCommand("kick");
    assert(GS.skills.boot_heel, "Boot & Heel not carved after 8 kicks");
    GS.inCombat = false; GS.currentEnemy = null;
  });
  step("tackle pins an animal (forced roll)", () => {
    GS = defaultState();
    applyRaceToState("orc");
    applyDerivedStats();
    GS.inCombat = true;
    GS.currentEnemyId = "feral_hound";
    GS.currentEnemy = { name: "Feral Hound", animal: true, tameable: true, hp: 10, maxHp: 30, attack: 1, defense: 2, dex: 13, wis: 8, attackMsg: "It snaps." };
    const realRandom = Math.random;
    Math.random = () => 0.99; // you roll high, it rolls... also high, but str mod decides
    doTackle();
    Math.random = realRandom;
    assert(GS.currentEnemy.pinnedTurns === 2, "tackle did not pin: " + GS.currentEnemy.pinnedTurns);
    GS.inCombat = false; GS.currentEnemy = null;
  });

  step("a living threat gates the exits", () => {
    GS = defaultState();
    applyRaceToState("human");
    applyDerivedStats();
    initRoomStates();
    GS.gameStarted = true;
    GS.currentRoom = "main_courtyard";
    parseCommand("east"); // into the hound's garden
    assert(GS.currentRoom === "east_garden", "did not enter garden: " + GS.currentRoom);
    parseCommand("north"); // blocked - the hound holds the room
    assert(GS.currentRoom === "east_garden", "exit should be gated by the hound");
    parseCommand("west"); // retreat the way you came
    assert(GS.currentRoom === "main_courtyard", "retreat should be allowed: " + GS.currentRoom);
  });
  step("attack flavour resolves for every type and group", () => {
    const dummyTypes = ["beast", "undead", "construct", "shadow", "mystery"];
    for (const t of dummyTypes) {
      for (const g of ["punch", "kick", "strike", "throw"]) {
        const line = attackFlavourLine(g, { type: t, name: "Test Thing" }, 2);
        assert(line.includes("2"), "low line missing dmg for " + t + "/" + g);
        const line2 = attackFlavourLine(g, { type: t, name: "Test Thing" }, 9);
        assert(line2.includes("9"), "mid line missing dmg for " + t + "/" + g);
      }
    }
  });
  step("stage lines fire once per stage", () => {
    const e = { type: "beast", name: "Feral Hound", hp: 14, maxHp: 30 };
    maybeStageLine(e);
    assert(e.stage === "worn", "worn stage not set: " + e.stage);
    e.hp = 5;
    maybeStageLine(e);
    assert(e.stage === "bloody", "bloody stage not set: " + e.stage);
  });

  step("five clean takedowns carve Wrestling", () => {
    GS = defaultState();
    applyRaceToState("orc");
    applyDerivedStats();
    GS.inCombat = true;
    GS.currentEnemyId = "feral_hound";
    GS.currentEnemy = { name: "Feral Hound", animal: true, tameable: true, type: "beast", hp: 500, maxHp: 500, attack: 1, defense: 2, str: 12, dex: 13, wis: 8, attackMsg: "It snaps." };
    const realRandom = Math.random;
    Math.random = () => 0.99;
    for (let i = 0; i < 5; i++) {
      GS.currentEnemy.pinnedTurns = 0;
      doTackle();
    }
    Math.random = realRandom;
    assert(GS.skills.wrestling, "Wrestling not carved after 5 successful tackles");
    GS.inCombat = false; GS.currentEnemy = null;
  });

  step("meta unlock: vesseling at 5 deaths", () => {
    GS = defaultState();
    GS.race = "dwarf";
    META.totalDeaths = 4;
    META.unlocks = {};
    playerDeath("meta test");
    parseCommand("wake");
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
