// === UI RENDERING ===

const outputEl = () => document.getElementById('output');
const inputEl = () => document.getElementById('command-input');

// NPC dialogue renders beat by beat: what is DONE on its own dim line,
// what is SAID on its own bright quoted line. Speech is written in double
// quotes in the data; everything outside them is action.
function printNpcBeats(text) {
  const parts = String(text).split('"');
  for (let i = 0; i < parts.length; i++) {
    const seg = parts[i].trim();
    if (!seg) continue;
    if (i % 2 === 1) print('&ldquo;' + seg + '&rdquo;', 'npc-say');
    else print(seg, 'npc-act');
  }
}

// Legacy single-quote lines: what is said stays bright; what is done fades.
function formatNpcLine(text) {
  let out = '';
  let inQuote = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "'") {
      const prev = i > 0 ? text[i - 1] : ' ';
      const next = i < text.length - 1 ? text[i + 1] : ' ';
      const wordApostrophe = /[A-Za-z]/.test(prev) && /[A-Za-z]/.test(next);
      if (!wordApostrophe) {
        if (!inQuote) { inQuote = true; out += '<span class="npc-say">\''; continue; }
        inQuote = false; out += '\'</span>'; continue;
      }
    }
    out += ch;
  }
  if (inQuote) out += '</span>';
  return '<span class="npc-act">' + out + '</span>';
}

// Output streams line by line - readable, never a wall slamming the view.
// Pacing is a preference: 'instant' dumps everything, 'brisk' (default)
// keeps a light rhythm, 'slow' is the original theatrical pace. Enter on
// an empty line always skips straight to the end of whatever is queued.
const PRINT_QUEUE = [];
const TEXT_SPEEDS = { instant: 0, brisk: 0.35, slow: 1 };

function textSpeedFactor() {
  const f = TEXT_SPEEDS[META.textSpeed];
  return f != null ? f : TEXT_SPEEDS.brisk;
}

function doSpeed(args) {
  const choice = (args || '').trim();
  if (TEXT_SPEEDS[choice] == null) {
    print('Text speed is ' + (META.textSpeed || 'brisk') + '. Options: speed instant, speed brisk, speed slow.', 'system-msg');
    print('(Enter on an empty line always skips ahead.)', 'text-dim');
    return;
  }
  META.textSpeed = choice;
  saveMeta();
  print('Text speed set to ' + choice + '.', 'system-msg');
}

function print(text, className, pause) {
  if (className && className.indexOf('npc-speech') !== -1 && typeof text === 'string') {
    if (text.indexOf('"') !== -1) { printNpcBeats(text); return; }
    text = formatNpcLine(text);
  }
  PRINT_QUEUE.push({ text, className, pause });
  pumpPrintQueue();
}

let printPumpRunning = false;
let printPumpTimer = null;
let openBlock = null; // { id, el } - the paragraph currently being fed

function renderPrintItem(item) {
  const out = outputEl();
  if (!out || !out.appendChild) return;
  const nearBottom = !out.scrollHeight || (out.scrollHeight - out.scrollTop - out.clientHeight < 80);
  if (item.block && openBlock && openBlock.id === item.block && openBlock.el) {
    openBlock.el.innerHTML += ' ' + item.text;
  } else {
    const div = document.createElement('div');
    div.className = 'line ' + (item.className || '');
    div.innerHTML = item.text;
    out.appendChild(div);
    openBlock = item.block ? { id: item.block, el: div } : null;
  }
  if (nearBottom) out.scrollTop = out.scrollHeight;
}

function pumpPrintQueue() {
  if (printPumpRunning) return;
  printPumpRunning = true;
  const step = () => {
    if (PRINT_QUEUE.length === 0) { printPumpRunning = false; printPumpTimer = null; openBlock = null; return; }
    const item = PRINT_QUEUE.shift();
    renderPrintItem(item);
    printPumpTimer = setTimeout(step, Math.round((item.pause != null ? item.pause : 110) * textSpeedFactor()));
  };
  printPumpTimer = setTimeout(step, 0);
}

// Skip the wait: render everything queued, right now.
function flushPrintQueue() {
  if (printPumpTimer) { clearTimeout(printPumpTimer); printPumpTimer = null; }
  while (PRINT_QUEUE.length > 0) renderPrintItem(PRINT_QUEUE.shift());
  printPumpRunning = false;
  openBlock = null;
  const out = outputEl();
  if (out) out.scrollTop = out.scrollHeight;
}

// Prose streams a sentence at a time INTO one paragraph; blocks breathe
// between each other.
let proseBlockId = 0;
function streamProse(text, cls, sentencePause, endPause) {
  const parts = String(text).split(/(?<=[.!?])\s+/).filter(Boolean);
  const block = ++proseBlockId;
  parts.forEach((s, i) => {
    const last = i === parts.length - 1;
    PRINT_QUEUE.push({
      text: s,
      className: cls,
      block,
      pause: last ? (endPause != null ? endPause : 1100) : (sentencePause != null ? sentencePause : 130),
    });
  });
  pumpPrintQueue();
}

function printLine() { print('<span class="separator">' + '─'.repeat(50) + '</span>'); }

// The Keep's voice - the bracketed system layer. Old, dry, faintly amused.
function keepSays(text) { print('[ ' + text + ' ]', 'keep-voice'); }

// Alerts share the bracketed style: gameplay-critical, at a glance.
function alertSays(text) { print('[ ' + text + ' ]', 'keep-voice'); }

function printRoom(roomId) {
  const room = ROOMS[roomId];
  const rs = roomStates[roomId];
  if (!room) return;

  printLine();
  print(room.name, 'room-name');
  print('<span class="text-dim">[' + room.region + ']</span>', '', rs.visited ? 0 : 350);
  // First arrivals get the slow reveal; ground already walked prints at once.
  if (rs.visited) {
    print(roomDesc(roomId), 'room-desc', 0);
  } else {
    streamProse(roomDesc(roomId), 'room-desc', 500, 1300);
  }

  if (!rs.visited && room.firstVisit) {
    streamProse(room.firstVisit, 'text-amber', 500, 1000);
  }

  if (room.dark && !hasLight()) {
    print('');
    if (GS.race === 'elf') {
      print('Darkness pools here, but your eyes drink what little light exists. Shapes and ways out - not details. Searching needs flame.', 'text-dim');
    } else {
      print('It is pitch dark. You can barely see your hand in front of your face. You need a light source.', 'text-red');
    }
  }

  // The staged introduction plays once; afterwards, whoever is still
  // around gets a line of presence that keeps up with their story.
  const sight = room.sight || room.npcIntro;
  if (!room.dark || hasLight()) {
    if (sight && !rs.visited) {
      streamProse(sight, 'text-amber', 500, 1000);
    } else {
      for (const nid of npcsPresent(roomId)) {
        print('');
        print(npcPresenceLine(NPCS[nid], nid), 'room-npcs');
      }
    }
  }

  const enemies = rs.enemies.filter(id => ENEMIES[id]);
  const threatened = enemies.length > 0 && (!room.dark || hasLight());
  if (threatened) {
    for (const eid of enemies) {
      const e = ENEMIES[eid];
      if (e.emerge) {
        if (rs.visited) print(e.emerge, 'text-white', 0);
        else streamProse(e.emerge, 'text-white', 130, 800);
      }
      print('! ' + e.name, 'text-red', 400);
    }
    const back = GS.enteredFrom[roomId];
    const blocked = Object.keys(getExits(roomId)).filter(d => d !== back);
    const first = ENEMIES[enemies[0]];
    if (blocked.length > 0) {
      alertSays('The ' + first.name.toLowerCase() + ' blocks the way ' + blocked.join(' and ') + ' - take it down, or fall back ' + (back || 'the way you came') + '.');
    } else {
      alertSays('The ' + first.name.toLowerCase() + ' stands its ground - take it down, or fall back ' + (back || 'the way you came') + '.');
    }
  } else {
    const exits = getExits(roomId);
    const exitNames = Object.keys(exits);
    if (exitNames.length > 0) {
      print('');
      print('Exits: ' + exitNames.map(e => '<span>' + e + '</span>').join(', '), 'room-exits');
    }
  }

  if (GS.race === 'dwarf' && roomHasUnclaimedFinds(roomId)) {
    print('(Your bones itch. Something here rewards a closer look.)', 'text-dim');
  }
  if (GS.race === 'gravekin' && roomId === 'chapel') {
    print('(The sanctified ground prickles, faintly offended by your blood.)', 'text-dim');
  }

  rs.visited = true;
  if (!GS.visitedRooms.includes(roomId)) {
    GS.visitedRooms.push(roomId);
    GS.roomsDiscovered++;
  }

  document.title = 'The Hollowed Keep - ' + room.name;
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
  atk += GS.tempAttackBonus === undefined ? 0 : 0; // (stat contribution applied at creation - see applyDerivedStats)
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
  updateVessel();
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
    ${GS.poisoned ? '<div class="stat-line"><span class="stat-value danger">POISONED</span></div>' : ''}
    ${GS.tempAttackBonus > 0 ? '<div class="stat-line"><span class="stat-value warning">EMBOLDENED +' + GS.tempAttackBonus + '</span></div>' : ''}
    ${GS.companion ? '<div class="stat-line"><span class="stat-value" style="color:var(--cyan)">HOUND AT HEEL</span></div>' : ''}
  `;
}

function updateVessel() {
  const acEl = document.getElementById('vessel-ac');
  if (acEl) acEl.textContent = 'AC ' + playerAC();
  const el = document.getElementById('vessel-content');
  if (!el) return;
  const st = GS.stats;
  let html = '';
  html += '<div class="stat-line"><span class="stat-label">Blood</span><span class="stat-value">' + (GS.race && RACES[GS.race] ? RACES[GS.race].name : '-') + '</span></div>';
  if (GS.class && CLASSES[GS.class]) {
    html += '<div class="stat-line"><span class="stat-label">Path</span><span class="stat-value">' + CLASSES[GS.class].name + '</span></div>';
  }
  html += '<div style="height:8px"></div>';
  const rows = [['STR', st.str], ['DEX', st.dex], ['CON', st.con], ['INT', st.int], ['WIS', st.wis], ['CHA', st.cha]];
  html += rows.map(([n, v]) =>
    '<div class="stat-line"><span class="stat-label">' + n + '</span><span class="stat-value">' + v + '</span></div>').join('');
  if (st.hollow > 0) {
    html += '<div class="stat-line"><span class="stat-label">HOLLOW</span><span class="stat-value warning">' + st.hollow + '</span></div>';
  }
  el.innerHTML = html;
}



function updateInventory() {
  const goldEl = document.getElementById('inv-gold');
  if (goldEl) goldEl.textContent = GS.gold + 'g';
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
  const regionOrder = ["The Threshold", "Courtyard", "Ground Floor", "Upper Floors", "The Dungeons", "The Deep"];
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
  const countEl = document.getElementById('map-count');
  if (countEl) countEl.textContent = GS.roomsDiscovered + '/' + Object.keys(ROOMS).length;
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

