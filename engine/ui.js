// === UI RENDERING ===

const outputEl = () => document.getElementById('output');
const inputEl = () => document.getElementById('command-input');

function print(text, className) {
  const el = outputEl();
  const div = document.createElement('div');
  div.className = 'output-line' + (className ? ' ' + className : '');
  div.innerHTML = text;
  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
}

function printLine() { print('<span class="separator">' + '─'.repeat(50) + '</span>'); }

// The Keep's voice — the bracketed system layer. Old, dry, faintly amused.
function keepSays(text) { print('[ ' + text + ' ]', 'keep-voice'); }

function printRoom(roomId) {
  const room = ROOMS[roomId];
  const rs = roomStates[roomId];
  if (!room) return;

  printLine();
  print(room.name, 'room-name');
  print('<span class="text-dim">[' + room.region + ']</span>');
  print(room.desc, 'room-desc');

  if (!rs.visited && room.firstVisit) {
    print('');
    print(room.firstVisit, 'text-amber');
  }

  if (room.dark && !hasLight()) {
    print('');
    if (GS.race === 'elf') {
      print('Darkness pools here, but your eyes drink what little light exists. Shapes and ways out — not details. Searching needs flame.', 'text-dim');
    } else {
      print('It is pitch dark. You can barely see your hand in front of your face. You need a light source.', 'text-red');
    }
  }

  const items = rs.items.filter(id => ITEMS[id]);
  if (items.length > 0 && (!room.dark || hasLight())) {
    print('');
    print('You see: ' + items.map(id => '<span>' + ITEMS[id].name + '</span>').join(', '), 'room-items');
  }

  const enemies = rs.enemies.filter(id => ENEMIES[id]);
  if (enemies.length > 0 && (!room.dark || hasLight())) {
    print('');
    for (const eid of enemies) {
      print('! ' + ENEMIES[eid].name + ' — ' + ENEMIES[eid].desc, 'text-red');
    }
  }

  if (room.npcs && (!room.dark || hasLight())) {
    for (const nid of room.npcs) {
      const npc = NPCS[nid];
      if (npc && (!npc.quest || !npc.quest.completed || nid === 'talking_skull' || nid === 'merchant_ghost' || nid === 'mad_alchemist')) {
        print('');
        print(npc.name + ' is here.', 'room-npcs');
      }
    }
  }

  const exits = getExits(roomId);
  const exitNames = Object.keys(exits);
  if (exitNames.length > 0) {
    print('');
    print('Exits: ' + exitNames.map(e => '<span>' + e + '</span>').join(', '), 'room-exits');
  }

  rs.visited = true;
  if (!GS.visitedRooms.includes(roomId)) {
    GS.visitedRooms.push(roomId);
    GS.roomsDiscovered++;
  }

  if (GS.race === 'dwarf' && room.search && !GS.searchedRooms.includes(roomId)) {
    print('(Your bones itch. Something here rewards a closer look.)', 'text-dim');
  }
  if (GS.race === 'gravekin' && roomId === 'chapel') {
    print('(The sanctified ground prickles, faintly offended by your blood.)', 'text-dim');
  }

  document.title = 'The Hollowed Keep — ' + room.name;
  updatePanels();
}

function getExits(roomId) {
  const room = ROOMS[roomId];
  const rs = roomStates[roomId];
  const exits = { ...room.exits };
  if (room.hiddenExits && rs.hiddenExitRevealed) {
    Object.assign(exits, room.hiddenExits);
  }
  return exits;
}

function hasLight() {
  if (GS.race === 'ashborn') return true; // Candleflame: always with you.
  return GS.equipped.light !== null;
}

function hasItem(id) {
  return GS.inventory.includes(id);
}

function isEquipped(id) {
  return Object.values(GS.equipped).includes(id);
}

function getAttack() {
  let atk = GS.attack;
  atk += GS.tempAttackBonus === undefined ? 0 : 0; // (stat contribution applied at creation — see applyDerivedStats)
  if (GS.equipped.weapon && ITEMS[GS.equipped.weapon]) atk += ITEMS[GS.equipped.weapon].attack || 0;
  if (GS.equipped.ring && ITEMS[GS.equipped.ring]) atk += ITEMS[GS.equipped.ring].attack || 0;
  atk += GS.perks && GS.perks.reaverStacks ? GS.perks.reaverStacks : 0;
  atk += GS.tempAttackBonus;
  return atk;
}

function getDefense() {
  let def = GS.defense;
  if (GS.equipped.armor && ITEMS[GS.equipped.armor]) def += ITEMS[GS.equipped.armor].defense || 0;
  if (GS.equipped.offhand && ITEMS[GS.equipped.offhand]) def += ITEMS[GS.equipped.offhand].defense || 0;
  if (GS.equipped.ring && ITEMS[GS.equipped.ring]) def += ITEMS[GS.equipped.ring].defense || 0;
  return def;
}

// === PANELS ===

function updatePanels() {
  updateStats();
  updateSkills();
  updateInventory();
  updateMap();
  updateQuests();
}

function updateStats() {
  const hpPct = Math.max(0, (GS.hp / GS.maxHp) * 100);
  const hpClass = hpPct <= 25 ? 'danger' : hpPct <= 50 ? 'warning' : '';
  const xpPct = GS.xpToLevel > 0 ? ((GS.xp / GS.xpToLevel) * 100) : 0;
  const el = document.getElementById('stats-content');
  el.innerHTML = `
    <div class="stat-line"><span class="stat-label">HP</span><span class="stat-value ${hpClass}">${GS.hp}/${GS.maxHp}</span></div>
    <div class="hp-bar"><div class="hp-bar-fill ${hpClass}" style="width:${hpPct}%"></div></div>
    <div class="stat-line"><span class="stat-label">Level</span><span class="stat-value">${GS.level}</span></div>
    <div class="xp-bar"><div class="xp-bar-fill" style="width:${xpPct}%"></div></div>
    <div class="stat-line"><span class="stat-label">ATK</span><span class="stat-value">${getAttack()}</span></div>
    <div class="stat-line"><span class="stat-label">DEF</span><span class="stat-value">${getDefense()}</span></div>
    <div class="stat-line"><span class="stat-label">Gold</span><span class="stat-value">${GS.gold}</span></div>
    <div class="stat-line"><span class="stat-label">Blood</span><span class="stat-value">${GS.race && RACES[GS.race] ? RACES[GS.race].name : '—'}</span></div>
    ${GS.class && CLASSES[GS.class] ? '<div class="stat-line"><span class="stat-label">Path</span><span class="stat-value">' + CLASSES[GS.class].name + '</span></div>' : ''}
    <div class="stat-line"><span class="stat-label">S/D/C</span><span class="stat-value">${GS.stats.str}/${GS.stats.dex}/${GS.stats.con}</span></div>
    <div class="stat-line"><span class="stat-label">I/W/Ch</span><span class="stat-value">${GS.stats.int}/${GS.stats.wis}/${GS.stats.cha}</span></div>
    ${GS.stats.hollow > 0 ? '<div class="stat-line"><span class="stat-label">Hollow</span><span class="stat-value warning">' + GS.stats.hollow + '</span></div>' : ''}
    <div class="stat-line"><span class="stat-label">Rooms</span><span class="stat-value">${GS.roomsDiscovered}/${Object.keys(ROOMS).length}</span></div>
    ${GS.poisoned ? '<div class="stat-line"><span class="stat-value danger">POISONED</span></div>' : ''}
    ${GS.tempAttackBonus > 0 ? '<div class="stat-line"><span class="stat-value warning">STR+' + GS.tempAttackBonus + ' (' + GS.tempAttackTurns + ')</span></div>' : ''}
  `;
}

function updateInventory() {
  const el = document.getElementById('inventory-content');
  if (GS.inventory.length === 0) {
    el.innerHTML = '<div class="text-dim">  (empty)</div>';
    return;
  }
  el.innerHTML = GS.inventory.map(id => {
    const item = ITEMS[id];
    if (!item) return '';
    const eq = isEquipped(id);
    return `<div class="inv-item${eq ? ' equipped' : ''}" title="${item.desc}">${item.name}</div>`;
  }).join('');
}

function updateMap() {
  const el = document.getElementById('map-content');
  const regionOrder = ["The Approach", "Courtyard", "Ground Floor", "Upper Floors", "The Dungeons", "The Deep"];
  const regions = {};
  for (const [id, room] of Object.entries(ROOMS)) {
    if (!GS.visitedRooms.includes(id)) continue;
    const r = room.region;
    if (!regions[r]) regions[r] = [];
    regions[r].push({ id, name: room.name, current: id === GS.currentRoom });
  }
  let mapText = '';
  for (const region of regionOrder) {
    if (!regions[region]) continue;
    mapText += `\n ${region}\n`;
    for (const room of regions[region]) {
      const marker = room.current ? ' >> ' : '    ';
      const cls = room.current ? 'map-current' : 'map-visited';
      mapText += `<span class="${cls}">${marker}${room.name}</span>\n`;
    }
  }
  el.innerHTML = mapText || '\n  (unexplored)';
}

function updateQuests() {
  const el = document.getElementById('quests-content');
  const active = GS.questLog.filter(q => !GS.completedQuests.includes(q));
  const completed = GS.completedQuests;
  if (active.length === 0 && completed.length === 0) {
    el.innerHTML = '<div class="text-dim">  (none)</div>';
    return;
  }
  let html = '';
  for (const qid of active) {
    const quest = findQuest(qid);
    if (quest) html += `<div class="quest-entry quest-active">${quest.name}</div>`;
  }
  for (const qid of completed) {
    const quest = findQuest(qid);
    if (quest) html += `<div class="quest-entry quest-completed">${quest.name}</div>`;
  }
  el.innerHTML = html;
}

function findQuest(qid) {
  for (const npc of Object.values(NPCS)) {
    if (npc.quest && npc.quest.id === qid) return npc.quest;
  }
  return null;
}

