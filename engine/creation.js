// === CHARACTER CREATION ===
// Runs on the boot screen, after 'begin'. Two choices: blood, and what
// the Toll missed. Everything else is carved by play.

const CREATION = { stage: null, race: null, remnant: null, statPicks: [] };

function bootPrint(text, cls) {
  const bootEl = document.getElementById('boot-text');
  const div = document.createElement('div');
  div.className = 'line ' + (cls || 'line-white');
  div.innerHTML = text;
  bootEl.appendChild(div);
  // Scroll whichever container actually scrolls.
  bootEl.scrollTop = bootEl.scrollHeight;
  const screen = document.getElementById('boot-screen');
  if (screen) screen.scrollTop = screen.scrollHeight;
}

// A fresh screen for each stage of the Toll. No burying the good lines.
function bootClear() {
  const bootEl = document.getElementById('boot-text');
  bootEl.innerHTML = '';
}

// The bloods on offer: the gate lineup plus anything this player has unlocked.
function availableRaces() {
  const list = RACE_ORDER.slice();
  for (const id of Object.keys(LOCKED_RACES)) {
    if (META.unlocks[id] && RACES[id]) list.push(id);
  }
  return list;
}

function startCreation() {
  CREATION.stage = 'race';
  CREATION.race = null;
  CREATION.remnant = null;
  CREATION.statPicks = [];
  bootClear();
  bootPrint('');
  bootPrint('[ The Keep acknowledges receipt of: one self. ]', 'line-keep');
  bootPrint('');
  bootPrint('What you were is gone. Blood keeps its own records.', 'line-white');
  bootPrint('');
  bootPrint('What does your blood remember?', 'line-bright');
  bootPrint('');
  const races = availableRaces();
  races.forEach((id, i) => {
    bootPrint('  ' + String(i + 1).padStart(2) + '. ' + RACES[id].name.padEnd(12) + ' - ' + RACES[id].tagline, 'line-white');
  });
  const lockedLeft = Object.keys(LOCKED_RACES).filter(id => !META.unlocks[id]);
  if (lockedLeft.length > 0) {
    bootPrint('');
    bootPrint('  ...and ' + lockedLeft.length + ' blood' + (lockedLeft.length > 1 ? 's' : '') + ' the Keep has not yet shown you.', 'line-dim');
  }
  bootPrint('');
  bootPrint("Type a name or number to look closer.", 'line-dim');
}

function raceCard(id) {
  const r = RACES[id];
  bootClear();
  bootPrint('');
  bootPrint('  ═══ ' + r.name.toUpperCase() + ' ═══', 'line-amber');
  const mods = Object.entries(r.stats).map(([k, v]) => k.toUpperCase() + (v > 0 ? ' +' : ' ') + v);
  if (r.freeStatPoints) mods.push('+1 to any two stats');
  if (mods.length) bootPrint('  ' + mods.join('  ·  '), 'line-white');
  r.perkText.forEach(t => bootPrint('  + ' + t, 'line-white'));
  r.drawbackText.forEach(t => bootPrint('  - ' + t, 'line-dim'));
  bootPrint('  Exclusive class, someday: ' + r.exclusiveClass, 'line-dim');
  bootPrint('  "' + r.flavor + '"', 'line-amber');
  bootPrint('');
  bootPrint("Keep this blood? ('yes', or another name/number)", 'line-bright');
}

function matchRace(input) {
  const races = availableRaces();
  const n = parseInt(input, 10);
  if (!isNaN(n) && races[n - 1]) return races[n - 1];
  return races.find(id => id.startsWith(input) || RACES[id].name.toLowerCase().startsWith(input)) || null;
}

function showRemnantList() {
  CREATION.stage = 'remnant';
  bootClear();
  bootPrint('');
  bootPrint('The Porter pats you down with something that is not hands.', 'line-white');
  bootPrint('');
  bootPrint('[ Inventory of the taken: complete. Discrepancy found. ]', 'line-keep');
  bootPrint('');
  bootPrint('One thing survived the Toll. Missed, or left. Nobody will say.', 'line-white');
  bootPrint('It is your only clue to who you were.', 'line-white');
  bootPrint('');
  REMNANT_ORDER.forEach((id, i) => {
    bootPrint('  ' + String(i + 1).padStart(2) + '. ' + REMNANTS[id].name, 'line-white');
  });
  bootPrint('');
  bootPrint('What do you find in your pocket? (number or a few words)', 'line-bright');
}

function matchRemnant(input) {
  const n = parseInt(input, 10);
  if (!isNaN(n) && REMNANT_ORDER[n - 1]) return REMNANT_ORDER[n - 1];
  return REMNANT_ORDER.find(id =>
    REMNANTS[id].name.toLowerCase().includes(input) || id.replace('_', ' ').includes(input)) || null;
}

function remnantCard(id) {
  const r = REMNANTS[id];
  bootClear();
  bootPrint('');
  bootPrint('  ═══ ' + r.name.toUpperCase() + ' ═══', 'line-amber');
  bootPrint('  "' + r.whisper + '"', 'line-amber');
  const aff = Object.entries(r.affinities || {}).map(([k, v]) =>
    '+' + Math.round(v * 100) + '% ' + (SKILLS[k] ? SKILLS[k].name : k) + ' XP');
  if (r.bonusAttack) aff.push('+' + r.bonusAttack + ' to hit and damage');
  if (r.bonusCon) aff.push('+' + r.bonusCon + ' CON');
  if (aff.length) bootPrint('  ' + aff.join('  ·  '), 'line-white');
  if (r.perks.length) bootPrint('  Something more sleeps in it. You will find out what.', 'line-dim');
  bootPrint('');
  bootPrint("Keep it? ('yes', or another number)", 'line-bright');
}

// Pure state application - also used by tests.
function applyRaceToState(raceId) {
  GS.race = raceId;
  const r = RACES[raceId];
  for (const [stat, mod] of Object.entries(r.stats)) {
    GS.stats[stat] += mod;
  }
}

function applyRemnantToState(remId) {
  GS.remnant = remId;
  const r = REMNANTS[remId];
  if (r.bonusCon) GS.stats.con += r.bonusCon;
  for (const p of r.perks) GS.perks[p] = true;
}

// Derived numbers, computed once when creation completes.
// (When stats become raisable mid-game, this moves into getAttack/getDefense.)
function applyDerivedStats() {
  GS.maxHp = 100 + (GS.stats.con - 10) * 5;
  GS.hp = GS.maxHp;
  const rem = REMNANTS[GS.remnant];
  // A fighting past helps you land blows as well as hurt with them.
  GS.perks.flatDamage = (rem && rem.bonusAttack) ? rem.bonusAttack : 0;
  GS.perks.hitBonus = (rem && rem.bonusAttack) ? rem.bonusAttack : 0;
  GS.perks.flatAC = 0;
}

function handleCreationInput(raw) {
  const input = raw.trim().toLowerCase();
  if (!input) return;

  if (CREATION.stage === 'race') {
    const id = matchRace(input);
    if (id) { CREATION.race = id; CREATION.stage = 'race_confirm'; raceCard(id); }
    else bootPrint('  Your blood does not remember that. Try a name or number from the list.', 'line-dim');
    return;
  }

  if (CREATION.stage === 'race_confirm') {
    if (input === 'yes' || input === 'y' || input === 'keep') {
      applyRaceToState(CREATION.race);
      const r = RACES[CREATION.race];
      if (r.freeStatPoints > 0) {
        CREATION.stage = 'stats';
        bootClear();
        bootPrint('');
        bootPrint('Human blood remembers a little of everything. Choose where it runs strongest.', 'line-white');
        bootPrint('Raise two, one at a time: str, dex, con, int, wis, cha (the same one twice is allowed)', 'line-bright');
      } else if (CREATION.race === 'vesseling') {
        finishCreation();
      } else {
        showRemnantList();
      }
    } else {
      const id = matchRace(input);
      if (id) { CREATION.race = id; raceCard(id); }
      else bootPrint("  'yes' to keep this blood, or another name/number.", 'line-dim');
    }
    return;
  }

  if (CREATION.stage === 'stats') {
    const valid = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    const pick = valid.find(s => input.startsWith(s));
    if (!pick) { bootPrint('  One of: str, dex, con, int, wis, cha', 'line-dim'); return; }
    CREATION.statPicks.push(pick);
    GS.stats[pick] += 1;
    bootPrint('  ' + pick.toUpperCase() + ' rises to ' + GS.stats[pick] + '.', 'line-white');
    if (CREATION.statPicks.length >= 2) showRemnantList();
    else bootPrint('  And the second?', 'line-bright');
    return;
  }

  if (CREATION.stage === 'remnant') {
    const id = matchRemnant(input);
    if (id) { CREATION.remnant = id; CREATION.stage = 'remnant_confirm'; remnantCard(id); }
    else bootPrint('  Your pocket disagrees. Try a number from the list.', 'line-dim');
    return;
  }

  if (CREATION.stage === 'remnant_confirm') {
    if (input === 'yes' || input === 'y' || input === 'keep') {
      applyRemnantToState(CREATION.remnant);
      finishCreation();
    } else {
      const id = matchRemnant(input);
      if (id) { CREATION.remnant = id; remnantCard(id); }
      else bootPrint("  'yes' to keep it, or another number.", 'line-dim');
    }
    return;
  }
}

function finishCreation() {
  CREATION.stage = null;
  applyDerivedStats();
  startGame(false);
}

