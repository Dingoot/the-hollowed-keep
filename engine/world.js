// === MOVEMENT ===

const OPPOSITE_DIR = { north: 'south', south: 'north', east: 'west', west: 'east', up: 'down', down: 'up' };

function doMove(dir) {
  if (!dir) { print('Go where? Specify a direction.', 'error-msg'); return; }
  const room = ROOMS[GS.currentRoom];
  const exits = getExits(GS.currentRoom);
  const target = exits[dir];

  if (!target) {
    print("You can't go " + dir + " from here.", 'error-msg');
    return;
  }

  // A living threat holds the room. Forward is through it; back is allowed.
  const rsHere = roomStates[GS.currentRoom];
  const living = rsHere.enemies.filter(id => ENEMIES[id]);
  if (living.length > 0 && !GS.inCombat) {
    const back = GS.enteredFrom[GS.currentRoom];
    if (dir !== back) {
      alertSays('The ' + ENEMIES[living[0]].name.toLowerCase() + ' blocks the way ' + dir + ' - take it down, or fall back ' + (back ? back : 'the way you came') + '.');
      return;
    }
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

  endConversation(); // walking off is its own goodbye
  GS.enteredFrom[target] = OPPOSITE_DIR[dir] || null;
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
    const npcId = npcsPresent(GS.currentRoom).find(id => matchNpc(id, args));
    if (npcId && NPCS[npcId]) {
      print(NPCS[npcId].desc, 'text-white');
      if (!GS.perks['met_' + npcId]) {
        GS.perks['met_' + npcId] = true;
        print('');
        doTalk(args);
      }
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
    print('A deep stone well, its mouth exhaling cold. Whatever rope it had is long gone - though the pulley above gleams with fresh oil, which is its own kind of unsettling. Far below, water moves. With rope of your own, you could descend.', 'text-white');
    return;
  }

  if (args.includes('mirror') && GS.currentRoom === 'lords_chamber') {
    print('The shattered mirror shows your face in a dozen fragments, each at a slightly different angle. In one shard, you see the room behind you - but the room in the reflection has someone standing in it. You spin around. Nothing.', 'text-white');
    return;
  }

  if (args.includes('telescope') && GS.currentRoom === 'observatory') {
    print('You peer through the telescope. The lens shows a patch of sky between the stars - and in that void, shapes move. Vast, slow shapes that suggest intelligence and scale beyond comprehension. You pull away, trembling.', 'text-white');
    return;
  }

  if (args.includes('painting') && GS.currentRoom === 'gallery') {
    print('The covered painting at the end of the gallery. Its surface seems to shift beneath the cloth. You\'re not sure you want to look again.', 'text-white');
    return;
  }

  if (args.includes('throne') && GS.currentRoom === 'throne_of_shadows') {
    print('The throne is carved from curdled shadow - a self taken in anger, and it never settled. Its surface absorbs light the way a debt absorbs wages. Sitting in it is an application for a position you should not want.', 'text-white');
    return;
  }

  if (args.includes('fountain') && GS.currentRoom === 'main_courtyard') {
    print('The fountain is dry, its basin cracked. The central figure was once a person - now eroded to abstraction. One arm reaches skyward, the other clutches something to its chest. Water stains suggest it once ran with something other than water - the residue is a dark, iridescent red.', 'text-white');
    return;
  }

  // Anything the room rewards searching, a close examination finds too.
  if (room.searchTargets) {
    const target = args.replace(/^(the|a|an)\s+/, '').trim();
    const key = Object.keys(room.searchTargets).find(k => target.includes(k) || k.includes(target));
    if (key) { print(room.searchTargets[key], 'text-white'); return; }
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
  const q = query.toLowerCase().trim();
  if (id.toLowerCase().replace(/_/g, ' ').includes(q) || npc.name.toLowerCase().includes(q)) return true;
  return (npc.aliases || []).some(a => a.includes(q) || q.includes(a));
}

function matchEnemy(id, query) {
  const enemy = ENEMIES[id];
  if (!enemy) return false;
  const q = query.toLowerCase();
  return id.toLowerCase().replace(/_/g, ' ').includes(q) || enemy.name.toLowerCase().includes(q);
}

