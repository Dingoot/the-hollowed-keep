// === COMBAT ===

function doAttack(args) {
  const rs = roomStates[GS.currentRoom];
  if (rs.enemies.length === 0) {
    print("There's nothing to attack here.", 'error-msg');
    return;
  }
  const room = ROOMS[GS.currentRoom];
  if (room.dark && !hasLight()) {
    print("You can't fight what you can't see!", 'error-msg');
    return;
  }
  const enemyId = args ? rs.enemies.find(id => matchEnemy(id, args)) : rs.enemies[0];
  if (!enemyId) { print("You don't see that enemy.", 'error-msg'); return; }
  if (GS.kills[GS.currentRoom + '_' + enemyId]) { print("It's already defeated.", 'text-dim'); return; }
  startCombat(enemyId);
}

function startCombat(enemyId) {
  const template = ENEMIES[enemyId];
  GS.inCombat = true;
  GS.currentEnemy = { ...template, id: enemyId, hp: template.hp };
  printLine();
  print('COMBAT: ' + template.name, 'text-red text-bold');
  print(template.desc, 'text-white');
  print('HP: ' + template.hp + '/' + template.maxHp + ' | ATK: ' + template.attack + ' | DEF: ' + template.defense, 'combat-info');
  print('');
  print("Commands: attack, use [item], cast [spell], flee", 'text-dim');
  printLine();
}

function handleCombatCommand(input) {
  const parts = input.split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1).join(' ');
  const enemy = GS.currentEnemy;

  if (cmd === 'attack' || cmd === 'hit' || cmd === 'fight' || cmd === 'a') {
    let playerAtk = getAttack();
    let bonusDmg = 0;

    if (enemy.undead && GS.equipped.weapon) {
      const wpn = ITEMS[GS.equipped.weapon];
      if (wpn && wpn.undeadBonus) bonusDmg += wpn.undeadBonus;
    }

    if (enemy.physicalResist && !(GS.equipped.weapon && ITEMS[GS.equipped.weapon] && ITEMS[GS.equipped.weapon].undeadBonus)) {
      playerAtk = Math.floor(playerAtk / 3);
      print('Your weapon passes through the creature with little effect! You need silver!', 'text-amber');
    }

    if (enemy.shadowBeing && !hasItem('amulet_of_warding') && !isEquipped('amulet_of_warding')) {
      print('Shadow energy saps your strength! You need protection!', 'text-amber');
      playerAtk = Math.floor(playerAtk / 2);
    }

    const dmg = Math.max(1, playerAtk + bonusDmg - enemy.defense + rng(-2, 2));
    enemy.hp -= dmg;
    print('You strike the ' + enemy.name + ' for ' + dmg + ' damage!', 'combat-hit');

    if (enemy.hp <= 0) {
      endCombat(true);
      return;
    }

    if (enemy.regenerates && enemy.shadowBeing && !isEquipped('amulet_of_warding')) {
      const regen = 8;
      enemy.hp = Math.min(enemy.maxHp, enemy.hp + regen);
      print('The ' + enemy.name + ' regenerates ' + regen + ' HP from the surrounding darkness!', 'text-amber');
    }

    print(enemy.name + ' HP: ' + enemy.hp + '/' + enemy.maxHp, 'combat-info');
    enemyTurn();

  } else if (cmd === 'use') {
    const itemIdx = GS.inventory.findIndex(id => matchItem(id, args));
    if (itemIdx === -1) { print("You don't have that.", 'error-msg'); return; }
    const itemId = GS.inventory[itemIdx];
    const item = ITEMS[itemId];

    if (itemId === 'holy_water' && enemy.undead) {
      GS.inventory.splice(itemIdx, 1);
      const dmg = item.damage || 30;
      enemy.hp -= dmg;
      print('You hurl the holy water! It burns the ' + enemy.name + ' for ' + dmg + ' damage!', 'combat-hit');
      if (enemy.hp <= 0) { endCombat(true); return; }
      print(enemy.name + ' HP: ' + enemy.hp + '/' + enemy.maxHp, 'combat-info');
    } else if (item.healing) {
      GS.inventory.splice(itemIdx, 1);
      GS.hp = Math.min(GS.maxHp, GS.hp + item.healing);
      print('You consume the ' + item.name + '. (+' + item.healing + ' HP)', 'combat-heal');
    } else if (item.tempAttack) {
      GS.inventory.splice(itemIdx, 1);
      GS.tempAttackBonus = item.tempAttack;
      GS.tempAttackTurns = item.duration || 3;
      print('You drink the ' + item.name + '! (+' + item.tempAttack + ' ATK)', 'text-amber');
    } else {
      print("You can't use that effectively in combat.", 'error-msg');
      return;
    }
    enemyTurn();

  } else if (cmd === 'cast') {
    if (!GS.spells.includes(args || 'sunder')) {
      print("You don't know that spell.", 'error-msg');
      return;
    }
    if ((args || 'sunder') === 'sunder') {
      if (enemy.shadowBeing || enemy.undead) {
        const dmg = 25 + rng(0, 10);
        enemy.hp -= dmg;
        print('You speak the Word of Sundering! Reality ripples and the ' + enemy.name + '\'s form tears apart! (' + dmg + ' damage)', 'text-cyan');
        if (enemy.hp <= 0) { endCombat(true); return; }
        print(enemy.name + ' HP: ' + enemy.hp + '/' + enemy.maxHp, 'combat-info');
      } else {
        print('The Word of Sundering washes over the ' + enemy.name + ' with no effect. It only works on shadow and undead.', 'text-dim');
      }
      enemyTurn();
    }

  } else if (cmd === 'flee' || cmd === 'run') {
    doFlee();

  } else if (cmd === 'look' || cmd === 'l') {
    print(enemy.name + ' — HP: ' + enemy.hp + '/' + enemy.maxHp, 'combat-info');
    print('Your HP: ' + GS.hp + '/' + GS.maxHp, 'combat-info');

  } else {
    print("In combat: attack, use [item], cast [spell], flee, look", 'text-dim');
  }

  updatePanels();
}

function enemyTurn() {
  const enemy = GS.currentEnemy;
  const enemyDmg = Math.max(1, enemy.attack - getDefense() + rng(-2, 2));
  GS.hp -= enemyDmg;
  print(enemy.attackMsg + ' (' + enemyDmg + ' damage)', 'combat-hit');

  if (enemy.poisonous && !GS.poisoned && rng(1, 3) === 1) {
    GS.poisoned = true;
    GS.poisonTurns = 5;
    print('You have been poisoned!', 'text-red');
  }

  if (GS.hp <= 0) {
    playerDeath(enemy.name);
  }
}

function endCombat(victory) {
  const enemy = GS.currentEnemy;
  if (victory) {
    printLine();
    print(enemy.defeatMsg, 'success-msg');
    print('+' + enemy.xp + ' XP', 'text-cyan');
    GS.xp += enemy.xp;
    if (enemy.gold > 0) {
      GS.gold += enemy.gold;
      print('+' + enemy.gold + ' gold', 'text-amber');
    }
    if (enemy.loot) {
      GS.inventory.push(enemy.loot);
      GS.itemsFound++;
      print('Obtained: ' + ITEMS[enemy.loot].name, 'text-amber');
    }
    GS.kills[GS.currentRoom + '_' + enemy.id] = true;
    roomStates[GS.currentRoom].enemies = roomStates[GS.currentRoom].enemies.filter(e => e !== enemy.id);
    if (!GS.kills[enemy.id]) GS.kills[enemy.id] = 0;
    GS.kills[enemy.id]++;
    printLine();
    checkLevelUp();

    if (enemy.boss && enemy.id === 'shadow_lord') {
      handleShadowLordDefeat();
    }
  }
  GS.inCombat = false;
  GS.currentEnemy = null;
}

function doFlee() {
  if (!GS.inCombat) { print("You're not in combat.", 'text-dim'); return; }
  if (GS.currentEnemy && GS.currentEnemy.boss) {
    print("You cannot flee from this battle!", 'error-msg');
    enemyTurn();
    return;
  }
  if (rng(1, 3) <= 2) {
    print('You manage to disengage and retreat!', 'text-amber');
    GS.inCombat = false;
    const enemy = GS.currentEnemy;
    if (enemy) {
      const template = ENEMIES[enemy.id];
      if (template) roomStates[GS.currentRoom].enemies = [enemy.id];
    }
    GS.currentEnemy = null;
    const exits = getExits(GS.currentRoom);
    const dirs = Object.keys(exits);
    if (dirs.length > 0) {
      const dir = dirs[0];
      GS.currentRoom = exits[dir];
      printRoom(GS.currentRoom);
    }
  } else {
    print('You fail to escape!', 'error-msg');
    enemyTurn();
  }
  updatePanels();
}

function playerDeath(cause) {
  GS.inCombat = false;
  GS.currentEnemy = null;
  GS.deaths++;
  printLine();
  print('', '');
  print('  Y O U   H A V E   D I E D', 'combat-death');
  print('', '');
  if (cause === 'poison') {
    print('  The poison claimed you at last.', 'text-red');
  } else {
    print('  Slain by: ' + cause, 'text-red');
  }
  print('  Deaths: ' + GS.deaths + ' | Rooms: ' + GS.roomsDiscovered + ' | Turns: ' + GS.turnCount, 'text-dim');
  print('', '');
  print('  The Keep endures. You do not.', 'text-dim');
  print('  But the moor path remembers your footsteps...', 'text-dim');
  print('', '');
  printLine();
  print("Type 'load' to restore a save, or 'restart' to begin anew.", 'text-amber');

  GS.hp = GS.maxHp;
  GS.poisoned = false;
  GS.poisonTurns = 0;
  GS.currentRoom = 'moor_path';
  GS.tempAttackBonus = 0;
  GS.tempAttackTurns = 0;
}

function checkLevelUp() {
  while (GS.xp >= GS.xpToLevel) {
    GS.xp -= GS.xpToLevel;
    GS.level++;
    GS.maxHp += 15;
    GS.hp = GS.maxHp;
    GS.attack += 1;
    GS.defense += 1;
    GS.xpToLevel = Math.floor(GS.xpToLevel * 1.5);
    print('LEVEL UP! You are now level ' + GS.level + '!', 'text-bright');
    print('  HP: ' + GS.maxHp + ' | ATK: ' + GS.attack + ' | DEF: ' + GS.defense, 'text-cyan');
  }
}

// === SPELLS ===

function doCast(args) {
  if (!args) { print('Cast what? Known spells: ' + (GS.spells.length > 0 ? GS.spells.join(', ') : 'none'), 'error-msg'); return; }
  if (!GS.spells.includes(args)) {
    print("You don't know that spell.", 'error-msg');
    return;
  }
  if (args === 'sunder') {
    if (GS.inCombat) return;
    print('You speak the Word of Sundering. A ripple of force expands outward, disrupting shadow constructs.', 'text-cyan');
    const rs = roomStates[GS.currentRoom];
    if (rs.enemies.length > 0) {
      const enemy = ENEMIES[rs.enemies[0]];
      if (enemy && (enemy.shadowBeing || enemy.undead)) {
        print('The ' + enemy.name + ' shudders as the word tears at its essence!', 'text-amber');
        startCombat(rs.enemies[0]);
        GS.currentEnemy.hp -= 25;
        print('The Word of Sundering dealt 25 damage!', 'combat-hit');
        if (GS.currentEnemy.hp <= 0) { endCombat(true); }
      }
    }
  }
}

