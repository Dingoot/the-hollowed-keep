// === ITEMS ===

function doTake(args) {
  // Some things are spoken for.
  if (GS.currentRoom === 'gatehouse' && /ledger/.test(args || '')) {
    print("'That stays with me.' The Porter has not moved, has not looked up, and is somehow already between you and the table. 'It is the only copy. There is a waiting list.'", 'npc-speech');
    return;
  }

  if (!args) { print('Take what?', 'error-msg'); return; }
  const rs = roomStates[GS.currentRoom];
  if (args === 'all') {
    const toTake = [...rs.items];
    if (toTake.length === 0) { print('Nothing to take here.', 'text-dim'); return; }
    for (const id of toTake) {
      rs.items = rs.items.filter(i => i !== id);
      GS.inventory.push(id);
      GS.itemsFound++;
      print('Taken: ' + ITEMS[id].name, 'success-msg');
    }
    return;
  }
  const idx = rs.items.findIndex(id => matchItem(id, args));
  if (idx === -1) { print("You don't see that here.", 'error-msg'); return; }
  const id = rs.items[idx];

  if (GS.currentRoom === 'armory' && id === 'chain_mail' && rs.enemies.includes('animated_armor') && !GS.kills['armory_animated_armor']) {
    print('As you reach for the chain mail, the suit of armour lurches to life!', 'text-red');
    startCombat('animated_armor');
    return;
  }

  rs.items.splice(idx, 1);
  GS.inventory.push(id);
  GS.itemsFound++;
  print('Taken: ' + ITEMS[id].name, 'success-msg');

  if (id === 'ancient_tome' && !GS.spells.includes('sunder')) {
    print('You leaf through the tome. A chapter on the "Word of Sundering" catches your eye - a word of power that disrupts shadow constructs. You commit it to memory.', 'text-amber');
    GS.spells.push('sunder');
  }
}

function doDrop(args) {
  if (!args) { print('Drop what?', 'error-msg'); return; }
  const idx = GS.inventory.findIndex(id => matchItem(id, args));
  if (idx === -1) { print("You don't have that.", 'error-msg'); return; }
  const id = GS.inventory[idx];
  for (const slot of Object.keys(GS.equipped)) {
    if (GS.equipped[slot] === id) GS.equipped[slot] = null;
  }
  GS.inventory.splice(idx, 1);
  roomStates[GS.currentRoom].items.push(id);
  print('Dropped: ' + ITEMS[id].name, 'text-dim');
}

function doInventory() {
  if (GS.inventory.length === 0) {
    print('You are carrying nothing.', 'text-dim');
    return;
  }
  print('You are carrying:', 'text-amber');
  for (const id of GS.inventory) {
    const item = ITEMS[id];
    const eq = isEquipped(id) ? ' [equipped]' : '';
    print('  ' + item.name + eq, eq ? 'text-amber' : 'text-green');
  }
  print('Gold: ' + GS.gold, 'text-amber');
}

function doEquip(args) {
  if (!args) { print('Equip what?', 'error-msg'); return; }
  const idx = GS.inventory.findIndex(id => matchItem(id, args));
  if (idx === -1) { print("You don't have that.", 'error-msg'); return; }
  const id = GS.inventory[idx];
  const item = ITEMS[id];
  if (!item.equippable) { print("You can't equip that.", 'error-msg'); return; }
  if (GS.equipped[item.slot] === id) { print("Already equipped.", 'text-dim'); return; }
  if (GS.equipped[item.slot]) {
    print('You unequip ' + ITEMS[GS.equipped[item.slot]].name + '.', 'text-dim');
  }
  GS.equipped[item.slot] = id;
  print('Equipped: ' + item.name, 'success-msg');
}

function doUnequip(args) {
  if (!args) { print('Unequip what?', 'error-msg'); return; }
  for (const [slot, id] of Object.entries(GS.equipped)) {
    if (id && matchItem(id, args)) {
      GS.equipped[slot] = null;
      print('Unequipped: ' + ITEMS[id].name, 'text-dim');
      return;
    }
  }
  print("You don't have that equipped.", 'error-msg');
}

function doUse(args) {
  if (!args) { print('Use what?', 'error-msg'); return; }
  const idx = GS.inventory.findIndex(id => matchItem(id, args));
  if (idx === -1) { print("You don't have that.", 'error-msg'); return; }
  const id = GS.inventory[idx];
  const item = ITEMS[id];

  if (item.type === 'consumable') {
    if (item.healing) {
      GS.hp = Math.min(GS.maxHp, GS.hp + item.healing);
      print('You consume the ' + item.name + '. (+' + item.healing + ' HP)', 'combat-heal');
      GS.inventory.splice(idx, 1);
    } else if (item.curesPoison) {
      GS.poisoned = false;
      GS.poisonTurns = 0;
      print('You drink the antidote. The poison is purged from your body.', 'combat-heal');
      GS.inventory.splice(idx, 1);
    } else if (item.tempAttack) {
      GS.tempAttackBonus = item.tempAttack;
      GS.tempAttackTurns = item.duration || 3;
      print('You drink the ' + item.name + '. Power surges through your muscles! (+' + item.tempAttack + ' ATK for ' + GS.tempAttackTurns + ' turns)', 'text-amber');
      GS.inventory.splice(idx, 1);
    } else if (item.undeadOnly) {
      print("The holy water burns your hands slightly. Better used on something unholy.", 'text-dim');
    }
    return;
  }

  if (id === 'rope' && GS.currentRoom === 'main_courtyard') {
    endConversation();
    print('You tie the rope to the well\'s crossbar and lower yourself down into the darkness...', 'text-amber');
    GS.flags.wellRopeTied = true; // survives save/load - see loadGame
    if (!ROOMS.underground_river.exits.up_well) {
      ROOMS.underground_river.exits.up_well = 'main_courtyard';
      ROOMS.main_courtyard.exits.down = 'underground_river';
    }
    GS.currentRoom = 'underground_river';
    printRoom('underground_river');
    return;
  }

  if (id === 'bone_flute') {
    print('You raise the bone flute to your lips and play. A haunting melody fills the air, resonating in your bones. Restless spirits calm. The shadows themselves seem to still.', 'text-cyan');
    if (GS.currentRoom === 'catacombs' && roomStates.catacombs.enemies.includes('wraith') && !GS.kills['catacombs_wraith']) {
      print('The Wraith pauses, its form flickering. For a moment, you see the chaplain it once was - eyes full of sorrow. Then it dissipates, not destroyed but... released.', 'text-amber');
      GS.kills['catacombs_wraith'] = true;
      roomStates.catacombs.enemies = [];
      GS.xp += 40;
      print('(+40 XP)', 'text-cyan');
      checkLevelUp();
    }
    return;
  }

  if (id === 'silver_mirror') {
    print('You hold up the mirror. Your reflection stares back - but a moment behind, always reacting to what you just did. In the mirror, you can see things that aren\'t visible directly: hidden writing on walls, invisible presences, the true nature of illusions.', 'text-cyan');
    if (GS.currentRoom === 'shadow_halls') {
      print('The mirror reveals the correct path through the shifting corridors! The geometry that confounds the eye becomes clear in the reflection.', 'text-amber');
    }
    return;
  }

  if (id === 'map_fragment') {
    print('The map shows the Keep\'s layout. A passage behind the reading nook bookshelf is marked, activated by a red-bound book. The lower levels are partially mapped, with warnings scrawled at every junction.', 'text-white');
    return;
  }

  if (item.equippable) {
    doEquip(args);
    return;
  }

  print("You can't figure out how to use that here.", 'text-dim');
}

// === SEARCH, PUSH, READ ===

// Searching is aimed, not blanket: every room lists what invites a look
// (its searchTargets - nouns from the room's own prose). Each target is
// searched once; what it holds ('finds') surfaces then. Bare 'search'
// asks you to choose.
function targetEntry(v) { return typeof v === 'string' ? { text: v } : (v || {}); }

function roomHasUnclaimedFinds(roomId) {
  const room = ROOMS[roomId];
  const rs = roomStates[roomId];
  const done = rs.searchedTargets || [];
  return Object.entries(room.searchTargets || {}).some(([k, v]) =>
    (targetEntry(v).finds || []).length > 0 && !done.includes(k));
}

function doSearch(args) {
  const room = ROOMS[GS.currentRoom];
  const rs = roomStates[GS.currentRoom];

  if (room.dark && !hasLight()) {
    print("You grope in the darkness but find nothing. You need light to search.", 'error-msg');
    return;
  }

  const targets = room.searchTargets || {};
  const keys = Object.keys(targets);
  rs.searchedTargets = rs.searchedTargets || [];

  if (!args) {
    if (keys.length === 0) {
      print('You cast about, but nothing here invites a closer look.', 'text-dim');
      return;
    }
    print('You take the room in, considering where to begin.', 'text-dim');
    const listed = keys.map(k => 'the ' + k).join(', ');
    if (keys.every(k => rs.searchedTargets.includes(k))) {
      keepSays('Everything here has been picked over: ' + listed + '. The Keep admires thoroughness, within reason.');
    } else {
      keepSays('Curiosity is billed by the object. Name it: ' + listed + '.');
    }
    return;
  }

  const target = args.replace(/^(the|a|an)\s+/, '').trim();
  const key = keys.find(k => k === target) || keys.find(k => target.includes(k) || k.includes(target));
  if (key) {
    const t = targetEntry(targets[key]);
    if (rs.searchedTargets.includes(key)) {
      print(t.again || ('You have been over the ' + key + ' already. It offers nothing further, and manages to seem pointed about it.'), 'text-dim');
      return;
    }
    rs.searchedTargets.push(key);
    print(t.text, 'text-white');
    for (const id of t.finds || []) {
      if (ITEMS[id]) {
        rs.items.push(id);
        print('Found: ' + ITEMS[id].name, 'text-amber');
      }
    }
    if (t.loreXP) gainSkillXP('lore', t.loreXP);
    return;
  }

  if (roomDesc(GS.currentRoom).toLowerCase().includes(target)) {
    print('You go over the ' + target + ' carefully, but its secrets - if it keeps any - stay kept for now.', 'text-dim');
  } else {
    print("There's no " + target + ' here worth the searching.', 'text-dim');
  }
}


function doPush(args) {
  if (!args) { print('Push what?', 'error-msg'); return; }

  if (GS.currentRoom === 'reading_nook' && (args.includes('red') || args.includes('book') || args.includes('binding') || args.includes('crimson'))) {
    const rs = roomStates.reading_nook;
    if (rs.hiddenExitRevealed) {
      print("The bookshelf is already open.", 'text-dim');
      return;
    }
    rs.hiddenExitRevealed = true;
    print('You push the crimson binding. Something clicks deep within the wall. The entire bookshelf swings inward with a groan of ancient hinges, revealing a dark passage beyond.', 'text-amber');
    print('A rush of cold, dusty air escapes the opening. The passage leads east into darkness.', 'text-white');
    GS.flags.hiddenPassageFound = true;
    return;
  }

  print("Nothing happens when you push that.", 'text-dim');
}

function doRead(args) {
  if (!args) { print('Read what?', 'error-msg'); return; }
  const idx = GS.inventory.findIndex(id => matchItem(id, args));
  if (idx !== -1) {
    const itemId = GS.inventory[idx];
    const item = ITEMS[itemId];
    print(item.desc, 'text-white');
    if (item.type === 'lore' && !GS.perks['read_' + itemId]) {
      GS.perks['read_' + itemId] = true;
      gainSkillXP('lore', 8);
    }
    return;
  }
  print("You don't have anything like that to read.", 'error-msg');
}

// === CRAFTING ===

function doCombine(args) {
  if (hasItem('saltpeter') && hasItem('lamp_oil') && (args.includes('salt') || args.includes('oil') || args.includes('bomb') || args.includes('powder') || !args)) {
    GS.inventory = GS.inventory.filter(i => i !== 'saltpeter' && i !== 'lamp_oil');
    GS.inventory.push('crude_bomb');
    if (GS.class === 'sapper') { GS.inventory.push('crude_bomb'); print('Good wadding: the batch makes two.', 'text-cyan'); }
    GS.itemsFound++;
    print('You pack the saltpeter and oil-soaked wadding into the flask, working from an instinct your hands seem to have kept off the books.', 'text-white');
    print('Obtained: Crude Bomb', 'text-amber');
    gainSkillXP('demolitions', 15);
    return;
  }

  if (hasItem('crystal_shard_1') && hasItem('crystal_shard_2') && hasItem('crystal_shard_3') &&
      (args.includes('shard') || args.includes('crystal'))) {
    GS.inventory = GS.inventory.filter(i => !i.startsWith('crystal_shard'));
    GS.inventory.push('crystal_key');
    GS.itemsFound++;
    print('The three crystal shards drift together, drawn by invisible forces. They fuse in a flash of light, forming a key that exists in multiple states simultaneously - solid and liquid, dark and light, here and elsewhere.', 'text-cyan');
    print('Obtained: Crystal Key', 'text-amber');
    return;
  }

  if (hasItem('rope') && hasItem('iron_hook') && (args.includes('rope') || args.includes('hook') || args.includes('grappling'))) {
    GS.inventory = GS.inventory.filter(i => i !== 'rope' && i !== 'iron_hook');
    GS.inventory.push('grappling_hook');
    GS.itemsFound++;
    print('You lash the iron hook to the rope, creating a serviceable grappling hook.', 'success-msg');
    print('Obtained: Grappling Hook', 'text-amber');
    return;
  }

  print("You can't combine those things.", 'text-dim');
}

// === PLAY ===

function doPlay(args) {
  if (hasItem('bone_flute') && (args.includes('flute') || !args)) {
    doUse('bone flute');
  } else {
    print("Play what?", 'error-msg');
  }
}

// === MISC COMMANDS ===

function doLightHearth() {
  const room = ROOMS[GS.currentRoom];
  if (!room.hearth) { print('There is no hearth here worth the name.', 'error-msg'); return; }
  if (GS.litHearths.includes(GS.currentRoom)) {
    GS.lastHearth = GS.currentRoom;
    print('The hearth already burns low and steady. Its warmth knows you.', 'text-amber');
    return;
  }
  const canLight = GS.race === 'ashborn' || hasItem('flint_and_tinder') || hasItem('torch') || hasItem('lantern') || isEquipped('torch') || isEquipped('lantern');
  if (!canLight) { print('You have nothing to light it with.', 'error-msg'); return; }
  GS.litHearths.push(GS.currentRoom);
  GS.lastHearth = GS.currentRoom;
  resetPerRestAbilities();
  if (GS.race === 'ashborn') {
    print('You touch the cold ash with one bright fingertip. The hearth takes the flame like a secret it was owed.', 'text-amber');
    gainSkillXP('firecraft', 10);
  } else {
    print('You coax flame into the cold hearth. It catches slowly, then all at once.', 'text-amber');
  }
  print('Warmth spreads through the room. The stones remember what they were for.', 'text-white');
  print('');
  keepSays('For once, the Keep says nothing at all.');
  logEvent('lit the hearth in ' + ROOMS[GS.currentRoom].name, 'discover');
  saveGame();
}

function doThrow(args) {
  const target = (args || '').trim();
  if (!target) { print('Throw what?', 'error-msg'); return; }

  const isRock = /\b(rock|stone|rubble|pebble)\b/.test(target);

  if (GS.inCombat && GS.currentEnemy) {
    const enemy = GS.currentEnemy;
    if (hasItem('crude_bomb') && /bomb/.test(target)) {
      // Route through the combat item logic for consistent behaviour.
      handleCombatCommand('use bomb');
      return;
    }
    if (isRock) {
      const dmg = 3 + rng(0, 4);
      enemy.hp -= dmg;
      print(attackFlavourLine('throw', enemy, dmg), 'combat-hit');
      gainSkillXP('thrown', 8);
      maybeStageLine(enemy);
      keepSays('The Keep notes, without rancour, that you are throwing it at things.');
      if (enemy.hp <= 0) { endCombat(true); return; }
      print(enemy.name + ' HP: ' + enemy.hp + '/' + enemy.maxHp, 'combat-info');
      enemyTurn();
      updatePanels();
      return;
    }
    const idx = GS.inventory.findIndex(id => matchItem(id, target));
    if (idx !== -1) {
      const id = GS.inventory[idx];
      GS.inventory.splice(idx, 1);
      roomStates[GS.currentRoom].items.push(id);
      const dmg = 2;
      enemy.hp -= dmg;
      print('You throw the ' + ITEMS[id].name + ' at the ' + enemy.name + '. It bounces off, landing somewhere behind it. (' + dmg + ' damage, one ' + ITEMS[id].name.toLowerCase() + ' down)', 'combat-hit');
      gainSkillXP('thrown', 4);
      if (enemy.hp <= 0) { endCombat(true); return; }
      enemyTurn();
      updatePanels();
      return;
    }
    print("You have nothing like that to throw.", 'error-msg');
    return;
  }

  if (GS.currentRoom === 'main_courtyard' && /\b(coin|coins|gold|offering)\b/.test(target)) {
    print('You take one of the corroded offerings from the fountain\'s litter and flick it out over the well. You count the fall. Four. Five. Six. You never hear it land.', 'text-white');
    print('', '', 300);
    keepSays('Received: one coin, value negligible. Logged under: hope, miscellaneous.');
    return;
  }

  if (isRock) {
    print('You find a loose piece of the Keep and throw it down the way. The clatter is deeply satisfying and accomplishes nothing at all.', 'text-dim');
    return;
  }
  const idx = GS.inventory.findIndex(id => matchItem(id, target));
  if (idx !== -1) {
    print('You weigh the ' + ITEMS[GS.inventory[idx]].name + ' in your hand, then think better of it. You would only have to pick it up again.', 'text-dim');
    return;
  }
  print('Throw what, exactly?', 'error-msg');
}

function doRest() {
  const room = ROOMS[GS.currentRoom];
  const rs = roomStates[GS.currentRoom];
  if (rs.enemies.length > 0 && !GS.kills[GS.currentRoom + '_' + rs.enemies[0]]) {
    print("You can't rest with enemies nearby!", 'error-msg');
    return;
  }
  if (GS.hp >= GS.maxHp) {
    print("You're already at full health.", 'text-dim');
    return;
  }
  const atHearth = GS.litHearths.includes(GS.currentRoom);
  if (atHearth) GS.lastHearth = GS.currentRoom;
  resetPerRestAbilities();
  const heal = atHearth ? GS.maxHp - GS.hp : rng(10, 20);
  GS.hp = Math.min(GS.maxHp, GS.hp + heal);
  if (atHearth) {
    print('You rest by the lit hearth. Sleep comes easily here - the only place it does. (fully healed)', 'combat-heal');
  } else {
    print('You rest for a while, tending your wounds. (+' + heal + ' HP)', 'combat-heal');
  }
}

function doMap() {
  print('=== EXPLORED REGIONS ===', 'text-amber');
  const regionOrder = ["The Threshold", "Courtyard", "Ground Floor", "Upper Floors", "The Dungeons", "The Deep"];
  for (const region of regionOrder) {
    const rooms = Object.entries(ROOMS).filter(([id, r]) => r.region === region && GS.visitedRooms.includes(id));
    if (rooms.length === 0) continue;
    print('');
    print('  ' + region, 'text-amber');
    for (const [id, room] of rooms) {
      const marker = id === GS.currentRoom ? ' >> ' : '    ';
      const exits = Object.entries(getExits(id)).map(([dir, target]) => {
        const tRoom = ROOMS[target];
        const visited = GS.visitedRooms.includes(target);
        return dir + ':' + (visited ? tRoom.name : '???');
      }).join(', ');
      const style = id === GS.currentRoom ? 'text-amber' : 'text-green';
      print(marker + room.name, style);
      print('        [' + exits + ']', 'text-dim');
    }
  }
}

function doStats() {
  print('=== CHARACTER STATS ===', 'text-amber');
  print('  Level: ' + GS.level + ' (' + GS.xp + '/' + GS.xpToLevel + ' XP)', 'text-green');
  print('  HP: ' + GS.hp + '/' + GS.maxHp, 'text-green');
  print('  AC: ' + playerAC(), 'text-green');
  const wInfo = weaponInfo(null);
  print('  Damage: ~' + Math.max(1, wInfo.base + statMod(GS.stats[wInfo.stat]) + Math.floor(skillLv(wInfo.skill) / 4) + (GS.perks.flatDamage || 0)) + ' (' + (GS.equipped.weapon ? ITEMS[GS.equipped.weapon].name : 'unarmed') + ')', 'text-green');
  print('  Gold: ' + GS.gold, 'text-green');
  print('  Rooms discovered: ' + GS.roomsDiscovered + '/' + Object.keys(ROOMS).length, 'text-green');
  print('  Items found: ' + GS.itemsFound, 'text-green');
  print('  Deaths: ' + GS.deaths, GS.deaths > 0 ? 'text-red' : 'text-green');
  print('  Turns: ' + GS.turnCount, 'text-green');
  if (GS.spells.length > 0) print('  Spells: ' + GS.spells.join(', '), 'text-cyan');
  print('');
  print('  Equipped:', 'text-amber');
  for (const [slot, id] of Object.entries(GS.equipped)) {
    if (id) print('    ' + capitalize(slot) + ': ' + ITEMS[id].name, 'text-green');
  }
}

function doQuests() {
  const active = GS.questLog.filter(q => !GS.completedQuests.includes(q));
  const completed = GS.completedQuests;
  if (active.length === 0 && completed.length === 0) {
    print('No quests yet. Talk to the inhabitants of the Keep.', 'text-dim');
    return;
  }
  if (active.length > 0) {
    print('=== ACTIVE QUESTS ===', 'text-amber');
    for (const qid of active) {
      const quest = findQuest(qid);
      if (quest) print('  > ' + quest.name, 'text-green');
    }
  }
  if (completed.length > 0) {
    print('=== COMPLETED ===', 'text-dim');
    for (const qid of completed) {
      const quest = findQuest(qid);
      if (quest) print('  x ' + quest.name, 'text-dim');
    }
  }
}

function doLore() {
  print('=== THE HOLLOWED KEEP ===', 'text-amber');
  print('', '');
  print('The Hollowed Keep surfaces where it pleases. One moonless night it', 'text-white');
  print('stood on the moor - gates open, windows dark, patient. It does not', 'text-white');
  print('advertise. At the threshold it takes the Toll: name, past, trade,', 'text-white');
  print('loves. The blood stays. One keepsake stays. Terms are terms.', 'text-white');
  print('', '');
  print('Once, a household of Stewards collected the Toll at the gate so the', 'text-white');
  print('Keep would not collect inside. The last Steward, Malchor, skimmed', 'text-white');
  print('from the take. The Keep noticed. It always notices. He sits below', 'text-white');
  print('now, hollowed into a warning, still holding the Toll-Rod.', 'text-white');
  print('', '');
  print('Everything the Keep has ever taken settles downward, floor upon', 'text-white');
  print('floor. Somewhere at the bottom is everything you were.', 'text-white');
  print('', '');
  print('Type "help" for a list of commands.', 'text-dim');
}

function doHint() {
  const hints = [];
  if (!GS.visitedRooms.includes('gatehouse')) hints.push('Head north to enter the Keep. The gatehouse may hold supplies.');
  else if (GS.inventory.length === 0) hints.push('Search rooms carefully and take anything useful. The gatehouse has a torch.');
  if (!hasLight() && GS.visitedRooms.includes('gatehouse')) hints.push("You'll need a light source for dark areas. Check the gatehouse or kitchen.");
  if (!GS.equipped.weapon) hints.push('Find a weapon before engaging enemies. The training yard might have something.');
  if (GS.questLog.length === 0) hints.push('Talk to the people you meet. They may need help - and help you in return.');
  if (GS.questLog.includes('heal_knight') && !GS.completedQuests.includes('heal_knight')) hints.push('The wounded knight needs a healing potion. Check the pantry.');
  if (GS.questLog.includes('free_thief') && !GS.completedQuests.includes('free_thief')) hints.push('The thief needs a key. There should be one in the gatehouse.');
  if (!GS.flags.hiddenPassageFound && GS.visitedRooms.includes('reading_nook')) hints.push("The reading nook has a peculiar red-bound book. Try pushing it.");
  if (GS.visitedRooms.includes('rune_chamber') && !GS.flags.runesSolved) hints.push('The rune chamber pattern matches the star charts from the observatory.');
  if (hasItem('crystal_shard_1') || hasItem('crystal_shard_2') || hasItem('crystal_shard_3')) hints.push('Crystal shards can be combined. Collect all three and try "combine shards".');
  if (!hasItem('amulet_of_warding') && GS.visitedRooms.includes('shadow_halls')) hints.push('The Hollow Steward is nearly invincible without the Amulet of Warding. Find the Ancient Shrine.');

  if (hints.length === 0) hints.push('Explore deeper. The Keep has many secrets yet to reveal.');
  print('A whisper in the walls: "' + pick(hints) + '"', 'text-cyan');
}

function doCarve(args) {
  const RUNE_ROOMS = ['main_courtyard', 'gatehouse', 'outer_gate'];
  if (!RUNE_ROOMS.includes(GS.currentRoom)) {
    print('The stones here do not take messages. The walls near the Threshold remember - carve there.', 'text-dim');
    return;
  }
  // Strip the "on the wall" part people naturally type.
  let msg = (args || '').replace(/^(on|onto|into)?\s*(the)?\s*(wall|stone|gate|gates)\s*/i, '').trim();
  if (!msg) { print('Carve what? (write [your message])', 'error-msg'); return; }
  if (msg.length > 100) { print('The stone can only hold so many words.', 'text-dim'); return; }
  GS.runeMessages.push({ text: msg, author: 'You' });
  if (GS.runeMessages.length > 12) GS.runeMessages.shift();
  print('You carve into the old stone, beside a hundred older hands: "' + msg + '"', 'text-green');
  print('Whoever wakes on these flagstones next will read it.', 'text-dim');
  renderRuneWall();
}


function doTrade(args) {
  const room = ROOMS[GS.currentRoom];
  if (!room.npcs || !room.npcs.includes('merchant_ghost')) {
    print("There's nobody to trade with here.", 'error-msg');
    return;
  }
  const merchant = NPCS.merchant_ghost;
  if (!args || args === '') {
    print('<span class="npc-name">Bartholomew\'s Wares:</span>', '');
    for (const [id, price] of Object.entries(merchant.inventory)) {
      print('  ' + ITEMS[id].name + ' - ' + price + ' gold', 'text-green');
    }
    print('');
    print("Type 'buy [item]' to purchase, or 'sell [item]' to sell.", 'text-dim');
    print("Sell values: Gold Coins (25g), Gemstone (50g), misc (5g)", 'text-dim');
    return;
  }

  // handled by buy/sell
}

function doBuy(item) {
  const merchant = NPCS.merchant_ghost;
  for (const [id, basePrice] of Object.entries(merchant.inventory)) {
    if (matchItem(id, item)) {
      let price = basePrice;
      let note = '';
      if (GS.race === 'gravekin') { price = Math.max(1, Math.round(price * 0.9)); note = " 'Kin rates, of course.'"; }
      if (GS.race === 'tiefling') { price = Math.round(price * 1.1); note = ' He eyes your horns and rounds up.'; }
      if (GS.class === 'tollwright') { price = Math.max(1, Math.round(price * 0.9)); note += " 'For a fellow professional? Adjusted terms.'"; }
      if (GS.gold >= price) {
        GS.gold -= price;
        GS.inventory.push(id);
        print("'Pleasure doing business!' You receive: " + ITEMS[id].name + ' (' + price + ' gold)' + note, 'success-msg');
      } else {
        print("'You haven't got the gold for that, friend.' (Need " + price + ', have ' + GS.gold + ')' + note, 'text-amber');
      }
      return;
    }
  }
  print("Bartholomew doesn't have that in stock.", 'text-dim');
}

function doBrew() {
  const room = ROOMS[GS.currentRoom];
  if (!room.npcs || !room.npcs.includes('mad_alchemist')) {
    print("There's nobody here to brew potions.", 'error-msg');
    return;
  }
  if (hasItem('healing_herb') && hasItem('holy_water')) {
    GS.inventory = GS.inventory.filter(i => i !== 'healing_herb' && i !== 'holy_water');
    GS.inventory.push('antidote');
    GS.itemsFound++;
    print("The alchemist combines the moonpetal and holy water with practiced hands. The mixture fizzes, turns green, then settles. 'An Antidote of Warding. Cures shadow corruption. You'll want that where you're going.'", 'npc-speech');
    print('Obtained: Antidote', 'text-amber');
    gainSkillXP('brewing', 15);
  } else if (hasItem('healing_herb') && hasItem('empty_vial')) {
    GS.inventory = GS.inventory.filter(i => i !== 'healing_herb' && i !== 'empty_vial');
    GS.inventory.push('healing_potion');
    GS.itemsFound++;
    print("The alchemist crushes the moonpetal into the vial and adds a catalyst. 'Simple but effective. A healing draught.'", 'npc-speech');
    print('Obtained: Healing Potion', 'text-amber');
    gainSkillXP('brewing', 12);
  } else {
    print("'Bring me ingredients! Moonpetal and holy water for an antidote. Moonpetal and an empty vial for a healing potion.'", 'npc-speech');
  }
}

function doHelp() {
  print('=== COMMANDS ===', 'text-amber');
  print('');
  print('MOVEMENT', 'text-amber');
  print('  north/south/east/west/up/down (or n/s/e/w/u/d)', 'text-green');
  print('  go [direction]', 'text-green');
  print('');
  print('EXPLORATION', 'text-amber');
  print('  look (l)        - Describe current room', 'text-green');
  print('  examine (x) [thing] - Examine something closely', 'text-green');
  print("  search [thing]   - Search something specific ('search' alone lists what invites a look)", 'text-green');
  print('  map (m)          - Show explored areas', 'text-green');
  print('  skills           - What the hollow holds', 'text-green');
  print('  stats            - The vessel: blood, remnant, stats', 'text-green');
  print('  light hearth     - Light a cold hearth (rest point · you wake here)', 'text-green');
  print('  crystallize      - Open the Ledger of Paths (once the Keep proposes)', 'text-green');
  print('  rally/pray/invoke - Class abilities, for those who are written', 'text-green');
  print('  push [thing]     - Push something', 'text-green');
  print('');
  print('ITEMS', 'text-amber');
  print('  take/get [item]  - Pick up an item (or "take all")', 'text-green');
  print('  drop [item]      - Drop an item', 'text-green');
  print('  use [item]       - Use an item', 'text-green');
  print('  equip [item]     - Equip weapon/armour', 'text-green');
  print('  unequip [item]   - Remove equipment', 'text-green');
  print('  inventory (i)    - List your items', 'text-green');
  print('  combine [items]  - Combine items together', 'text-green');
  print('  read [item]      - Read a document or book', 'text-green');
  print('');
  print('INTERACTION', 'text-amber');
  print('  talk [person]    - Start a conversation', 'text-green');
  print("  ask [topic]      - Ask the person you're talking to", 'text-green');
  print('  topics           - List what they will speak about', 'text-green');
  print('  goodbye          - End the conversation', 'text-green');
  print('  answer [text]    - Answer a question', 'text-green');
  print('  give [item]      - Give an item to someone', 'text-green');
  print('  trade/buy/sell   - Trade with merchants', 'text-green');
  print('  brew             - Brew potions (with alchemist)', 'text-green');
  print('');
  print('COMBAT', 'text-amber');
  print('  attack [enemy]   - Attack an enemy (punch/kick work too)', 'text-green');
  print('  tackle [beast]   - Wrestle an animal down; soothe may follow', 'text-green');
  print('  cast [spell]     - Cast a known spell', 'text-green');
  print('  flee             - Attempt to run from combat', 'text-green');
  print('');
  print('OTHER', 'text-amber');
  print('  rest             - Rest and heal (if safe)', 'text-green');
  print('  stats            - Show character details', 'text-green');
  print('  quests           - Show quest log', 'text-green');
  print('  carve [message]  - Leave a message on the rune wall', 'text-green');
  print('  lore             - Read the Keep\'s history', 'text-green');
  print('  hint             - Consult the spirits for guidance', 'text-green');
  print('  save / load      - Save or load your game', 'text-green');
  print('  clear            - Clear the screen', 'text-green');
  print('  speed            - Text pace: instant, brisk, slow (Enter skips)', 'text-green');
  print('  help (?)         - Show this list', 'text-green');
}

// === OPEN / UNLOCK ===

function doOpen(args) {
  if (!args) { print('Open what?', 'error-msg'); return; }

  if (GS.currentRoom === 'cell_block' && (args.includes('cell') || args.includes('door') || args.includes('lock'))) {
    const rs = roomStates.cell_block;
    if (rs.unlocked) { print("It's already open.", 'text-dim'); return; }
    if (hasItem('iron_key')) {
      rs.unlocked = true;
      print('The iron key turns with a grinding protest. The cell door swings open.', 'success-msg');
      if (!questDone(NPCS.imprisoned_thief)) {
        doGive('');
      }
    } else if (hasItem('lockpicks')) {
      rs.unlocked = true;
      print('You work the lockpicks with care. After a tense minute, the mechanism yields.', 'success-msg');
      gainSkillXP('lockpicking', 12);
      if (!questDone(NPCS.imprisoned_thief)) {
        doGive('');
      }
    } else {
      print("It's locked. You need a key or lockpicks.", 'error-msg');
      if (GS.race === 'gnome') {
        print('You press an ear to the plate. The tumblers gossip: iron, three wards, guard-issue. Its key hangs where a bored guard would wait - or slender tools could fool it.', 'text-dim');
      }
    }
    return;
  }

  if (args.includes('sarcophagus') && GS.currentRoom === 'crypt') {
    print('You heave the marble lid aside. Inside: not a body, but a rectangular window into absolute darkness. The void is perfect and complete. At the edge, something gleams - items resting on the lip of nothingness.', 'text-white');
    return;
  }

  print("You can't open that.", 'text-dim');
}

