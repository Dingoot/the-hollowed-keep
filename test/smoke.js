// Smoke test for The Hollowed Keep.
// Runs the game headless in Node with a stubbed DOM and executes a
// short playthrough of core commands. Exits non-zero on any crash.
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
  "engine/utils.js",
  "engine/state.js",
  "engine/ui.js",
  "engine/chronicle.js",
  "engine/parser.js",
  "engine/world.js",
  "engine/actions.js",
  "engine/combat.js",
  "engine/npcs.js",
  "engine/endings.js",
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
global.localStorage = {
  _s: {},
  getItem(k) { return k in this._s ? this._s[k] : null; },
  setItem(k, v) { this._s[k] = String(v); },
  removeItem(k) { delete this._s[k]; },
};
// Timers: never fire (we don't want ambient loops in tests), but return ids.
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

  step("initRoomStates", () => initRoomStates());
  step("start state", () => { GS.gameStarted = true; if (GS.currentRoom !== "moor_path") throw new Error("bad start room"); });
  step("printRoom", () => printRoom(GS.currentRoom));
  step("look", () => parseCommand("look"));
  step("help", () => parseCommand("help"));
  step("search", () => parseCommand("search"));
  step("take item", () => parseCommand("take journal page"));
  step("inventory", () => parseCommand("inventory"));
  step("move north", () => { parseCommand("north"); if (GS.currentRoom !== "crumbling_bridge") throw new Error("move failed, in " + GS.currentRoom); });
  step("move south", () => { parseCommand("south"); if (GS.currentRoom !== "moor_path") throw new Error("return failed, in " + GS.currentRoom); });
  step("stats panel", () => updateStats());
  step("save", () => saveGame());
  step("load", () => loadGame());
  step("restart cmd", () => parseCommand("restart"));

  console.log(log.join("\\n"));
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
