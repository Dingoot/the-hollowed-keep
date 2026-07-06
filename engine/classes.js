// === CRYSTALLIZATION ===
// The Keep proposes classes based on how you actually play. The full
// Ledger of Paths is always choosable. Refusing is a real path.

function crystalLevel() {
  return GS.race === 'vesseling' ? 3 : 4; // vesselings crystallize sooner
}

function crystalEligible() {
  return !GS.class && GS.level >= crystalLevel();
}

// Score every class from skills, deeds, race, and remnant.
function scoreClasses() {
  const s = id => (GS.skills[id] ? GS.skills[id].level : 0);
  const kills = Object.keys(GS.kills || {}).length;
  const scores = {
    fighter: s('swords') + s('axes') + s('hammers') + s('spears') + s('daggers') + s('greatswords') + s('shields'),
    rogue: s('stealth') * 2 + s('lockpicking') * 2 + s('daggers') + (GS.remnant === 'calluses' ? 3 : 0),
    cleric: s('ritual') * 2 + s('medicine') * 2 + (GS.remnant === 'hymn' ? 3 : 0),
    wizard: s('lore') * 2 + s('alchemy') * 2 + s('ritual') + (GS.remnant === 'ink_fingers' ? 3 : 0),
    reaver: s('axes') + s('greatswords') + s('unarmed') + Math.floor(kills / 3),
    sapper: s('demolitions') * 3 + s('firecraft') + (GS.remnant === 'old_burn' ? 3 : 0),
    grave_speaker: s('bone_speaking') * 3 + s('bonecraft') + s('ritual') + (GS.race === 'gravekin' ? 4 : 0),
    tollwright: s('haggling') * 2 + s('appraisal') * 2 + GS.deaths * 2 + (GS.remnant === 'debt_marker' ? 3 : 0),
  };
  return scores;
}

function recommendedClasses() {
  const scores = scoreClasses();
  const n = GS.race === 'human' ? 4 : 3; // Prolific: humans get an extra offer
  return CLASS_ORDER.slice()
    .sort((a, b) => scores[b] - scores[a])
    .slice(0, n);
}

// Announce that the Keep is ready to propose. Called from checkLevelUp
// and from the Steward's defeat.
function announceCrystallization() {
  if (GS.crystalAnnounced || !crystalEligible()) return;
  GS.crystalAnnounced = true;
  print('');
  keepSays('You have carved enough of yourself to hold a shape.');
  keepSays("The Keep is prepared to propose. Type 'crystallize' to open the Ledger of Paths.");
}

function doCrystallize(args) {
  if (GS.class) {
    const c = CLASSES[GS.class];
    print('You are already written: ' + c.name.toUpperCase() + '. Deeper crystallizations come on deeper floors.', 'text-dim');
    return;
  }
  if (!crystalEligible()) {
    print('The Keep is not ready to propose - or you are not ready to be proposed to. (Reach level ' + crystalLevel() + '.)', 'text-dim');
    return;
  }

  const arg = (args || '').trim().toLowerCase();

  // Open the Ledger
  if (!arg) {
    const recs = recommendedClasses();
    printLine();
    print('THE LEDGER OF PATHS', 'text-amber');
    print('');
    keepSays('These offers are assembled from observation. The Keep has been paying attention. The Keep is always paying attention.');
    print('');
    print('  Proposed for you:', 'text-bright');
    for (const id of recs) {
      print('    ' + CLASSES[id].name.padEnd(14) + ' - ' + CLASSES[id].tagline, 'text-cyan');
    }
    print('');
    print('  The full Ledger (all paths open to any vessel):', 'text-dim');
    for (const id of CLASS_ORDER) {
      if (recs.includes(id)) continue;
      print('    ' + CLASSES[id].name.padEnd(14) + ' - ' + CLASSES[id].tagline, 'text-white');
    }
    const race = RACES[GS.race];
    if (race && race.exclusiveClass) {
      print('');
      print('  Your blood whispers of another path: ' + race.exclusiveClass + '. It is not yet walkable.', 'text-dim');
    }
    print('');
    print("Type 'crystallize [class]' to read its terms, or 'unwritten' to refuse the Keep.", 'text-amber');
    return;
  }

  // Read a class card / confirm
  const id = CLASS_ORDER.find(c => c.replace('_', ' ').startsWith(arg) || c.replace('_', '-').startsWith(arg) ||
    CLASSES[c].name.toLowerCase().startsWith(arg));
  if (!id) {
    print('No such path in the Ledger. The Keep double-checked.', 'error-msg');
    return;
  }
  const c = CLASSES[id];
  printLine();
  keepSays('The Keep proposes: ' + c.name.toUpperCase() + '.');
  keepSays(c.proposeLine);
  print('');
  for (const t of c.abilityText) print('  + ' + t, 'text-white');
  print('');
  print("Accept? Type 'accept' - or 'crystallize' to reread the Ledger.", 'text-bright');
  GS.flags.pendingClass = id;
}

function doAcceptClass() {
  const id = GS.flags.pendingClass;
  if (!id || GS.class || !crystalEligible()) {
    print('There is no proposal on the table.', 'text-dim');
    return;
  }
  applyClass(id);
}

function applyClass(id) {
  const c = CLASSES[id];
  GS.class = id;
  GS.flags.pendingClass = null;
  GS.stats[c.keyStat] += 1;
  if (id === 'fighter') { GS.perks.flatDamage = (GS.perks.flatDamage || 0) + 1; GS.perks.flatAC = (GS.perks.flatAC || 0) + 1; }
  printLine();
  keepSays('It is written: ' + c.name.toUpperCase() + '.');
  logEvent('crystallized: ' + c.name, 'discover');
  print(c.confirmLine, 'text-amber');
  print('');
  print('(New abilities are listed under stats. Some answer to their own commands - see help.)', 'text-dim');
  updatePanels();
}

function doUnwritten() {
  if (GS.class) { print('Too late for that - you are already written.', 'text-dim'); return; }
  if (!crystalEligible()) { print('The Keep has made no proposal to refuse. Yet.', 'text-dim'); return; }
  GS.flags.refusals = (GS.flags.refusals || 0) + 1;
  GS.flags.pendingClass = null;
  printLine();
  if (GS.flags.refusals === 1) {
    keepSays('Refused. Noted. The Keep has been refused before - twice, if it recalls, and it always recalls.');
    keepSays('It will ask again. It has nothing but time, and you have nothing but its time.');
  } else if (GS.flags.refusals === 2) {
    keepSays('Again? The Keep revises its file on you: fascinating.');
  } else {
    keepSays('The Unwritten. Very well. Every hall will know what you are not.');
  }
  print("(Staying unwritten keeps your skills broad. 'crystallize' remains open if you change your mind.)", 'text-dim');
}

// --- Ability helpers used by combat/economy hooks ---

function classIs(id) { return GS.class === id; }

function resetPerRestAbilities() {
  GS.perks.roarUsed = false;      // orc ancestors catch their breath
  GS.perks.rallyUsed = false;     // fighter
  GS.perks.prayUsed = false;      // cleric
  GS.perks.invokeUsed = false;    // tollwright
  GS.perks.reaverStacks = 0;      // reaver's taken slivers fade
}

function doRally() {
  if (!classIs('fighter')) { print('You plant your feet, breathe... nothing. That is not a shape you hold.', 'text-dim'); return; }
  if (GS.perks.rallyUsed) { print('Once per rest. Your body has spent that already.', 'text-dim'); return; }
  GS.perks.rallyUsed = true;
  const heal = Math.floor(GS.maxHp * 0.3);
  GS.hp = Math.min(GS.maxHp, GS.hp + heal);
  print('You plant your feet and refuse. (+' + heal + ' HP)', 'combat-heal');
  if (GS.inCombat) enemyTurn();
  updatePanels();
}

function doPray() {
  if (!classIs('cleric')) {
    print('You pray. The Keep listens, which is not the same as answering.', 'text-dim');
    return;
  }
  if (GS.perks.prayUsed) { print('Whatever answers has answered once already today.', 'text-dim'); return; }
  GS.perks.prayUsed = true;
  const heal = Math.floor(GS.maxHp * 0.4);
  GS.hp = Math.min(GS.maxHp, GS.hp + heal);
  GS.poisoned = false;
  GS.poisonTurns = 0;
  print('You pray. Something answers - warmth, and a silence inside the silence. (+' + heal + ' HP, poison purged)', 'combat-heal');
  if (GS.inCombat) enemyTurn();
  updatePanels();
}

function doInvokeToll() {
  if (!classIs('tollwright')) { print('You declare a price. Nothing is legally obligated to care.', 'text-dim'); return; }
  if (!GS.inCombat || !GS.currentEnemy) { print('The Toll is invoked against something, in the moment of dispute.', 'text-dim'); return; }
  if (GS.perks.invokeUsed) { print('Once per rest. Even the Keep respects a rate limit.', 'text-dim'); return; }
  GS.perks.invokeUsed = true;
  const enemy = GS.currentEnemy;
  const dmg = Math.max(5, Math.floor(enemy.maxHp * 0.15));
  enemy.hp -= dmg;
  print('You invoke the Toll. The ' + enemy.name + ' PAYS - something is simply, bureaucratically subtracted from it. (' + dmg + ' damage, defense ignored)', 'text-cyan');
  keepSays('Collected on behalf of: you. Processing fee: waived. This once.');
  if (enemy.hp <= 0) { endCombat(true); return; }
  print(enemy.name + ' HP: ' + enemy.hp + '/' + enemy.maxHp, 'combat-info');
  enemyTurn();
  updatePanels();
}
