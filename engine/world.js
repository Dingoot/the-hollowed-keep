// === MOVEMENT ===

function doMove(dir) {
  if (!dir) { print('Go where? Specify a direction.', 'error-msg'); return; }
  const room = ROOMS[GS.currentRoom];
  const exits = getExits(GS.currentRoom);
  const target = exits[dir];

  if (!target) {
    print("You can't go " + dir + " from here.", 'error-msg');
    return;
  }

  const targetRoom = ROOMS[target];
  const targetState = roomStates[target];
  if (targetRoom && targetRoom.locked && targetState && !targetState.unlocked) {
    if (targetRoom.lockDir && targetRoom.lockDir !== dir) {
      // lock only applies in a specific direction
    } else {
      const keyName = targetRoom.lockKey;
      if (hasItem(keyName)) {
        print('You use the ' + ITEMS[keyName].name + ' to unlock the way.', 'success-msg');
        targetState.unlocked = true;
      } else if (hasItem('lockpicks') && !targetRoom.lockKey) {
        print('You pick the lock with practiced skill.', 'success-msg');
        targetState.unlocked = true;
      } else {
        print("The way is locked. You need the right key.", 'error-msg');
        return;
      }
    }
  }

  GS.currentRoom = target;
  printRoom(target);

  if (targetState && targetState.enemies.length > 0 && (!targetRoom.dark || hasLight())) {
    const enemyId = targetState.enemies[0];
    if (!GS.kills[target + '_' + enemyId]) {
      print('');
      print(ENEMIES[enemyId].name + ' blocks your path!', 'text-red');
    }
  }
}

// === LOOK & EXAMINE ===

function doLook(args) {
  if (!args) {
    printRoom(GS.currentRoom);
  } else {
    doExamine(args);
  }
}

function doExamine(args) {
  if (!args) { print('Examine what?', 'error-msg'); return; }

  const room = ROOMS[GS.currentRoom];
  const rs = roomStates[GS.currentRoom];

  const itemInRoom = rs.items.find(id => matchItem(id, args));
  if (itemInRoom && ITEMS[itemInRoom]) {
    print(ITEMS[itemInRoom].name + ': ' + ITEMS[itemInRoom].desc, 'text-white');
    return;
  }

  const itemInInv = GS.inventory.find(id => matchItem(id, args));
  if (itemInInv && ITEMS[itemInInv]) {
    print(ITEMS[itemInInv].name + ': ' + ITEMS[itemInInv].desc, 'text-white');
    return;
  }

  if (room.npcs) {
    const npcId = room.npcs.find(id => matchNpc(id, args));
    if (npcId && NPCS[npcId]) {
      print(NPCS[npcId].desc, 'text-white');
      return;
    }
  }

  if (rs.enemies.length > 0) {
    const eid = rs.enemies.find(id => matchEnemy(id, args));
    if (eid && ENEMIES[eid]) {
      print(ENEMIES[eid].desc, 'text-white');
      return;
    }
  }

  if (args.includes('well') && GS.currentRoom === 'main_courtyard') {
    print('A deep stone well, its interior swallowed by darkness. A bucket on a frayed rope hangs over the edge. You hear water far below. With proper rope, you might be able to descend.', 'text-white');
    return;
  }

  if (args.includes('mirror') && GS.currentRoom === 'lords_chamber') {
    print('The shattered mirror shows your face in a dozen fragments, each at a slightly different angle. In one shard, you see the room behind you—but the room in the reflection has someone standing in it. You spin around. Nothing.', 'text-white');
    return;
  }

  if (args.includes('telescope') && GS.currentRoom === 'observatory') {
    print('You peer through the telescope. The lens shows a patch of sky between the stars—and in that void, shapes move. Vast, slow shapes that suggest intelligence and scale beyond comprehension. You pull away, trembling.', 'text-white');
    return;
  }

  if (args.includes('painting') && GS.currentRoom === 'gallery') {
    print('The covered painting at the end of the gallery. Its surface seems to shift beneath the cloth. You\'re not sure you want to look again.', 'text-white');
    return;
  }

  if (args.includes('throne') && GS.currentRoom === 'throne_of_shadows') {
    print('The throne is carved from solidified shadow—a paradox made material. Its surface absorbs all light. Sitting in it would mean touching something that exists in another reality entirely. The Scepter of Aethon rests upon its arm.', 'text-white');
    return;
  }

  if (args.includes('fountain') && GS.currentRoom === 'main_courtyard') {
    print('The fountain is dry, its basin cracked. The central figure was once a person—now eroded to abstraction. One arm reaches skyward, the other clutches something to its chest. Water stains suggest it once ran with something other than water—the residue is a dark, iridescent red.', 'text-white');
    return;
  }

  print("You don't see anything special about that.", 'text-dim');
}

function matchItem(id, query) {
  const item = ITEMS[id];
  if (!item) return false;
  const q = query.toLowerCase();
  return id.toLowerCase().includes(q) || item.name.toLowerCase().includes(q);
}

function matchNpc(id, query) {
  const npc = NPCS[id];
  if (!npc) return false;
  const q = query.toLowerCase();
  return id.toLowerCase().replace(/_/g, ' ').includes(q) || npc.name.toLowerCase().includes(q);
}

function matchEnemy(id, query) {
  const enemy = ENEMIES[id];
  if (!enemy) return false;
  const q = query.toLowerCase();
  return id.toLowerCase().replace(/_/g, ' ').includes(q) || enemy.name.toLowerCase().includes(q);
}

