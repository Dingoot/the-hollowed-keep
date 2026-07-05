// === SHADOW LORD ENDING ===

function handleShadowLordDefeat() {
  print('');
  print('The Shadow Lord—Lord Malachar Vane—lies defeated. The Scepter of Aethon', 'text-white');
  print('pulses on the ground before you, its dark energy beckoning.', 'text-white');
  print('');
  print('Behind the throne, a passage opens, revealing a chamber of white stone.', 'text-amber');
  print('');
  print('You have a choice:', 'text-bright');
  print('');
  print('  1. Take the Scepter — Claim its power. Become the new Shadow Lord.', 'text-red');
  print('     (Type "take scepter")', 'text-dim');
  print('');
  print('  2. Enter the Sanctum — Seek another way. The Crown of Endings awaits.', 'text-cyan');
  print('     (Go east to the Sanctum)', 'text-dim');
  print('');
  print('  3. Destroy the Scepter — Speak the Word of Sundering upon it.', 'text-amber');
  print('     (Type "cast sunder" or "use scepter")', 'text-dim');

  ROOMS.throne_of_shadows.exits.east = 'sanctum';
  GS.flags.shadowLordDefeated = true;
}

// Add restart and ending commands to parser
const originalParse = parseCommand;
parseCommand = function(raw) {
  const input = raw.trim().toLowerCase();
  if (input === 'restart' || input === 'new game' || input === 'newgame') {
    GS = defaultState();
    initRoomStates();
    for (const npc of Object.values(NPCS)) {
      if (npc.quest) { npc.quest.active = false; npc.quest.completed = false; }
      if (npc.riddleSolved !== undefined) npc.riddleSolved = false;
    }
    outputEl().innerHTML = '';
    print('A new journey begins...', 'text-amber');
    print('');
    printRoom('moor_path');
    GS.gameStarted = true;
    updatePanels();
    return;
  }

  if (input === 'buy' || input.startsWith('buy ')) {
    const what = input.replace(/^buy\s*/, '');
    if (!what) { doTrade(''); return; }
    doBuy(what);
    updatePanels();
    return;
  }

  if (input === 'sell' || input.startsWith('sell ')) {
    const what = input.replace(/^sell\s*/, '');
    if (!what) { print('Sell what?', 'error-msg'); return; }
    const idx = GS.inventory.findIndex(id => matchItem(id, what));
    if (idx === -1) { print("You don't have that.", 'error-msg'); return; }
    const room = ROOMS[GS.currentRoom];
    if (!room.npcs || !room.npcs.includes('merchant_ghost')) { print("There's nobody to sell to here.", 'error-msg'); return; }
    const id = GS.inventory[idx];
    const item = ITEMS[id];
    const value = item.value || 5;
    GS.inventory.splice(idx, 1);
    GS.gold += value;
    print("'A fine piece!' Bartholomew takes the " + item.name + ". (+" + value + " gold)", 'success-msg');
    updatePanels();
    return;
  }

  if (GS.flags.shadowLordDefeated && !GS.gameWon) {
    if (input === 'take scepter' || input === 'grab scepter' || input === 'get scepter') {
      GS.gameWon = true;
      GS.ending = 'power';
      GS.inventory.push('scepter_of_aethon');
      showEnding('power');
      return;
    }
  }

  if (GS.currentRoom === 'sanctum' && !GS.gameWon) {
    if ((input === 'take crown' || input === 'wear crown' || input === 'use crown' || input === 'get crown') && !GS.gameWon) {
      GS.gameWon = true;
      GS.ending = 'sacrifice';
      showEnding('sacrifice');
      return;
    }
  }

  if (GS.flags.shadowLordDefeated && !GS.gameWon && (input === 'cast sunder' || input === 'destroy scepter')) {
    GS.gameWon = true;
    GS.ending = 'destruction';
    showEnding('destruction');
    return;
  }

  originalParse.call(this, raw);
};

function showEnding(type) {
  printLine();
  print('');

  if (type === 'power') {
    print('  E N D I N G :  T H E   N E W   L O R D', 'text-red text-bold');
    print('');
    print('  You grasp the Scepter. Power floods through you—vast,', 'text-white');
    print('  intoxicating, terrible. The shadows of the Keep bend to', 'text-white');
    print('  your will. The throne calls. You sit.', 'text-white');
    print('');
    print('  The Keep shudders, acknowledging its new master. You can', 'text-white');
    print('  feel every stone, every shadow, every whisper within its', 'text-white');
    print('  walls. You are the Keep. The Keep is you.', 'text-white');
    print('');
    print('  Outside, on the moors, the fog thickens. The Keep stands', 'text-white');
    print('  eternal, waiting for the next adventurer to challenge its', 'text-white');
    print('  new lord.', 'text-white');
    print('');
    print('  You chose power. The cycle continues.', 'text-red');
  } else if (type === 'sacrifice') {
    print('  E N D I N G :  T H E   S A C R I F I C E', 'text-cyan text-bold');
    print('');
    print('  You place the Crown of Endings upon your head. Starlight', 'text-white');
    print('  fills your vision. You understand, suddenly and completely,', 'text-white');
    print('  what must be done.', 'text-white');
    print('');
    print('  The door between worlds begins to close. The Keep groans,', 'text-white');
    print('  stone grinding against stone, reality folding. The shadows', 'text-white');
    print('  scream. You hold firm.', 'text-white');
    print('');
    print('  When it is done, the Keep vanishes from the moors. The fog', 'text-white');
    print('  lifts. Sunlight touches Ashenvale for the first time in a', 'text-white');
    print('  thousand years. The door is sealed forever.', 'text-white');
    print('');
    print('  You remain, the final seal, in a place between worlds—', 'text-white');
    print('  alone, but at peace. The cage is locked. The sacrifice holds.', 'text-white');
    print('');
    print('  You chose sacrifice. The cycle is broken.', 'text-cyan');
  } else if (type === 'destruction') {
    print('  E N D I N G :  T H E   S U N D E R I N G', 'text-amber text-bold');
    print('');
    print('  You speak the Word of Sundering upon the Scepter. The', 'text-white');
    print('  artifact cracks, screams, and explodes in a burst of', 'text-white');
    print('  shadow and light.', 'text-white');
    print('');
    print('  The Keep begins to collapse. Not physically—but', 'text-white');
    print('  existentially. Walls fade. Floors dissolve. The boundary', 'text-white');
    print('  between worlds tears open completely.', 'text-white');
    print('');
    print('  You run. Behind you, the Keep folds in on itself like', 'text-white');
    print('  a closing fist. You burst through the outer gate moments', 'text-white');
    print('  before it ceases to exist.', 'text-white');
    print('');
    print('  On the moor, you turn. Where the Keep stood, there is', 'text-white');
    print('  nothing—not even a foundation. Just moor grass and', 'text-white');
    print('  silence. But in the sky above that spot, the stars', 'text-white');
    print('  flicker strangely, and you know the door is not closed.', 'text-white');
    print('  Merely... unhinged.', 'text-white');
    print('');
    print('  You chose destruction. The cycle is shattered—', 'text-amber');
    print('  but what comes next may be worse.', 'text-amber');
  }

  print('');
  printLine();
  print('  Rooms explored: ' + GS.roomsDiscovered + '/' + Object.keys(ROOMS).length, 'text-dim');
  print('  Items found: ' + GS.itemsFound, 'text-dim');
  print('  Deaths: ' + GS.deaths, 'text-dim');
  print('  Turns: ' + GS.turnCount, 'text-dim');
  print('  Quests completed: ' + GS.completedQuests.length, 'text-dim');
  print('');
  print("  Type 'restart' to begin a new journey.", 'text-amber');
  printLine();
}

