// === ITEMS ===

function doTake(args) {
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
    print('As you reach for the chain mail, the suit of armor lurches to life!', 'text-red');
    startCombat('animated_armor');
    return;
  }

  rs.items.splice(idx, 1);
  GS.inventory.push(id);
  GS.itemsFound++;
  print('Taken: ' + ITEMS[id].name, 'success-msg');

  if (id === 'ancient_tome' && !GS.spells.includes('sunder')) {
    print('You leaf through the tome. A chapter on the "Word of Sundering" catches your eye—a word of power that disrupts shadow constructs. You commit it to memory.', 'text-amber');
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
    print('You tie the rope to the well\'s crossbar and lower yourself down into the darkness...', 'text-amber');
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
      print('The Wraith pauses, its form flickering. For a moment, you see the chaplain it once was—eyes full of sorrow. Then it dissipates, not destroyed but... released.', 'text-amber');
      GS.kills['catacombs_wraith'] = true;
      roomStates.catacombs.enemies = [];
      GS.xp += 40;
      print('(+40 XP)', 'text-cyan');
      checkLevelUp();
    }
    return;
  }

  if (id === 'silver_mirror') {
    print('You hold up the mirror. Your reflection stares back—but a moment behind, always reacting to what you just did. In the mirror, you can see things that aren\'t visible directly: hidden writing on walls, invisible presences, the true nature of illusions.', 'text-cyan');
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

function doSearch() {
  const room = ROOMS[GS.currentRoom];
  const rs = roomStates[GS.currentRoom];

  if (room.dark && !hasLight()) {
    print("You grope in the darkness but find nothing. You need light to search.", 'error-msg');
    return;
  }

  if (rs.searched) {
    print("You've already thoroughly searched this area.", 'text-dim');
    return;
  }

  rs.searched = true;
  if (room.search) {
    print(room.search, 'text-white');
    if (room.searchItems) {
      for (const id of room.searchItems) {
        if (ITEMS[id]) {
          rs.items.push(id);
          print('Found: ' + ITEMS[id].name, 'text-amber');
        }
      }
    }
  } else {
    print("You search the area thoroughly but find nothing of note.", 'text-dim');
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
  if (hasItem('crystal_shard_1') && hasItem('crystal_shard_2') && hasItem('crystal_shard_3') &&
      (args.includes('shard') || args.includes('crystal'))) {
    GS.inventory = GS.inventory.filter(i => !i.startsWith('crystal_shard'));
    GS.inventory.push('crystal_key');
    GS.itemsFound++;
    print('The three crystal shards drift together, drawn by invisible forces. They fuse in a flash of light, forming a key that exists in multiple states simultaneously—solid and liquid, dark and light, here and elsewhere.', 'text-cyan');
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
  const canLight = GS.race === 'ashborn' || hasItem('torch') || hasItem('lantern') || isEquipped('torch') || isEquipped('lantern');
  if (!canLight) { print('You have nothing to light it with.', 'error-msg'); return; }
  GS.litHearths.push(GS.currentRoom);
  GS.lastHearth = GS.currentRoom;
  if (GS.race === 'ashborn') {
    print('You touch the cold ash with one bright fingertip. The hearth takes the flame like a secret it was owed.', 'text-amber');
    gainSkillXP('firecraft', 10);
  } else {
    print('You coax flame into the cold hearth. It catches slowly, then all at once.', 'text-amber');
  }
  print('Warmth spreads through the room. The stones remember what they were for.', 'text-white');
  print('');
  keepSays('For once, the Keep says nothing at all.');
  saveGame();
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
  GS.perks.roarUsed = false; // the ancestors catch their breath
  const heal = atHearth ? GS.maxHp - GS.hp : rng(10, 20);
  GS.hp = Math.min(GS.maxHp, GS.hp + heal);
  if (atHearth) {
    print('You rest by the lit hearth. Sleep comes easily here — the only place it does. (fully healed)', 'combat-heal');
  } else {
    print('You rest for a while, tending your wounds. (+' + heal + ' HP)', 'combat-heal');
  }
}

function doMap() {
  print('=== EXPLORED REGIONS ===', 'text-amber');
  const regionOrder = ["The Approach", "Courtyard", "Ground Floor", "Upper Floors", "The Dungeons", "The Deep"];
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
  print('  Attack: ' + getAttack() + ' (base: ' + GS.attack + ')', 'text-green');
  print('  Defense: ' + getDefense() + ' (base: ' + GS.defense + ')', 'text-green');
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
  print('The Hollowed Keep appeared on the moors of Ashenvale one moonless', 'text-white');
  print('night in 993 A.D. None knew its origin. The local folk whispered of', 'text-white');
  print('Lord Aldric Vane—a nobleman who sought power beyond mortal reach—and', 'text-white');
  print('the Scepter of Aethon, a relic said to command shadow and flame.', 'text-white');
  print('', '');
  print('The Vane dynasty ruled from the Keep for generations, each lord', 'text-white');
  print('wielding the Scepter, each consumed by its power. The last—Lord', 'text-white');
  print('Malachar Vane—opened the way fully, becoming the Shadow Lord, a', 'text-white');
  print('being of pure darkness bound to the throne for eternity.', 'text-white');
  print('', '');
  print('Many adventurers have entered the Keep seeking the Scepter.', 'text-white');
  print('Few have returned. The Keep endures.', 'text-white');
  print('', '');
  print('Type "help" for a list of commands.', 'text-dim');
}

function doHint() {
  const hints = [];
  if (!GS.visitedRooms.includes('gatehouse')) hints.push('Head north to enter the Keep. The gatehouse may hold supplies.');
  else if (GS.inventory.length === 0) hints.push('Search rooms carefully and take anything useful. The gatehouse has a torch.');
  if (!hasLight() && GS.visitedRooms.includes('gatehouse')) hints.push("You'll need a light source for dark areas. Check the gatehouse or kitchen.");
  if (!GS.equipped.weapon) hints.push('Find a weapon before engaging enemies. The training yard might have something.');
  if (GS.questLog.length === 0) hints.push('Talk to the people you meet. They may need help—and help you in return.');
  if (GS.questLog.includes('heal_knight') && !GS.completedQuests.includes('heal_knight')) hints.push('The wounded knight needs a healing potion. Check the pantry.');
  if (GS.questLog.includes('free_thief') && !GS.completedQuests.includes('free_thief')) hints.push('The thief needs a key. There should be one in the gatehouse.');
  if (!GS.flags.hiddenPassageFound && GS.visitedRooms.includes('reading_nook')) hints.push("The reading nook has a peculiar red-bound book. Try pushing it.");
  if (GS.visitedRooms.includes('rune_chamber') && !GS.flags.runesSolved) hints.push('The rune chamber pattern matches the star charts from the observatory.');
  if (hasItem('crystal_shard_1') || hasItem('crystal_shard_2') || hasItem('crystal_shard_3')) hints.push('Crystal shards can be combined. Collect all three and try "combine shards".');
  if (!hasItem('amulet_of_warding') && GS.visitedRooms.includes('shadow_halls')) hints.push('The Shadow Lord is nearly invincible without the Amulet of Warding. Find the Ancient Shrine.');

  if (hints.length === 0) hints.push('Explore deeper. The Keep has many secrets yet to reveal.');
  print('A whisper in the walls: "' + pick(hints) + '"', 'text-cyan');
}

function doCarve(args) {
  if (!args) { print('Carve what message?', 'error-msg'); return; }
  if (args.length > 100) { print('The stone can only hold so many words.', 'text-dim'); return; }
  const saved = JSON.parse(localStorage.getItem('hollowkeep_runes') || '[]');
  saved.push({ text: args, author: 'You' });
  if (saved.length > 10) saved.shift();
  localStorage.setItem('hollowkeep_runes', JSON.stringify(saved));
  print('You carve your message into the stone: "' + args + '"', 'text-green');
  print('Perhaps another adventurer will find it someday.', 'text-dim');
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
      print('  ' + ITEMS[id].name + ' — ' + price + ' gold', 'text-green');
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
  print('  look (l)        — Describe current room', 'text-green');
  print('  examine (x) [thing] — Examine something closely', 'text-green');
  print('  search           — Search the room thoroughly', 'text-green');
  print('  map (m)          — Show explored areas', 'text-green');
  print('  skills           — What the hollow holds', 'text-green');
  print('  stats            — The vessel: blood, remnant, stats', 'text-green');
  print('  light hearth     — Light a cold hearth (rest point · you wake here)', 'text-green');
  print('  push [thing]     — Push something', 'text-green');
  print('');
  print('ITEMS', 'text-amber');
  print('  take/get [item]  — Pick up an item (or "take all")', 'text-green');
  print('  drop [item]      — Drop an item', 'text-green');
  print('  use [item]       — Use an item', 'text-green');
  print('  equip [item]     — Equip weapon/armor', 'text-green');
  print('  unequip [item]   — Remove equipment', 'text-green');
  print('  inventory (i)    — List your items', 'text-green');
  print('  combine [items]  — Combine items together', 'text-green');
  print('  read [item]      — Read a document or book', 'text-green');
  print('');
  print('INTERACTION', 'text-amber');
  print('  talk [person]    — Talk to someone', 'text-green');
  print('  ask [topic]      — Ask about a topic', 'text-green');
  print('  answer [text]    — Answer a question', 'text-green');
  print('  give [item]      — Give an item to someone', 'text-green');
  print('  trade/buy/sell   — Trade with merchants', 'text-green');
  print('  brew             — Brew potions (with alchemist)', 'text-green');
  print('');
  print('COMBAT', 'text-amber');
  print('  attack [enemy]   — Attack an enemy', 'text-green');
  print('  cast [spell]     — Cast a known spell', 'text-green');
  print('  flee             — Attempt to run from combat', 'text-green');
  print('');
  print('OTHER', 'text-amber');
  print('  rest             — Rest and heal (if safe)', 'text-green');
  print('  stats            — Show character details', 'text-green');
  print('  quests           — Show quest log', 'text-green');
  print('  carve [message]  — Leave a message on the rune wall', 'text-green');
  print('  lore             — Read the Keep\'s history', 'text-green');
  print('  hint             — Consult the spirits for guidance', 'text-green');
  print('  save / load      — Save or load your game', 'text-green');
  print('  clear            — Clear the screen', 'text-green');
  print('  verbose          — Toggle verbose descriptions', 'text-green');
  print('  help (?)         — Show this list', 'text-green');
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
      if (NPCS.imprisoned_thief.quest && !NPCS.imprisoned_thief.quest.completed) {
        doGive('');
      }
    } else if (hasItem('lockpicks')) {
      rs.unlocked = true;
      print('You work the lockpicks with care. After a tense minute, the mechanism yields.', 'success-msg');
      gainSkillXP('lockpicking', 12);
      if (NPCS.imprisoned_thief.quest && !NPCS.imprisoned_thief.quest.completed) {
        doGive('');
      }
    } else {
      print("It's locked. You need a key or lockpicks.", 'error-msg');
      if (GS.race === 'gnome') {
        print('You press an ear to the plate. The tumblers gossip: iron, three wards, guard-issue. Its key hangs where a bored guard would wait — or slender tools could fool it.', 'text-dim');
      }
    }
    return;
  }

  if (args.includes('sarcophagus') && GS.currentRoom === 'crypt') {
    print('You heave the marble lid aside. Inside: not a body, but a rectangular window into absolute darkness. The void is perfect and complete. At the edge, something gleams—items resting on the lip of nothingness.', 'text-white');
    return;
  }

  print("You can't open that.", 'text-dim');
}

