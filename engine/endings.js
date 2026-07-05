// === SHADOW LORD ENDING ===

function handleShadowLordDefeat() {
  print('');
  print('The Hollow Steward — Malchor, last of the household — lies unmade.', 'text-white');
  print('The Toll-Rod pulses on the obsidian, humming with borrowed authority.', 'text-white');
  print('It wants a hand. Any hand. Yours would do nicely.', 'text-white');
  print('');
  print('Behind the throne, a seam opens: a chamber of white stone.', 'text-amber');
  print('');
  keepSays('The position of Steward is, as of this moment, vacant.');
  print('');
  print('You have a choice:', 'text-bright');
  print('');
  print('  1. Take the Rod — Take up the collection. The Keep needs a Steward.', 'text-red');
  print('     (Type "take rod")', 'text-dim');
  print('');
  print('  2. Enter the Sanctum — What the Steward hid is still hidden. For now.', 'text-cyan');
  print('     (Go east to the Sanctum)', 'text-dim');
  print('');
  print('  3. Sunder the Rod — Speak the Word upon the Keep\'s own authority.', 'text-amber');
  print('     (Type "cast sunder")', 'text-dim');

  ROOMS.throne_of_shadows.exits.east = 'sanctum';
  GS.flags.shadowLordDefeated = true;
}

// Add restart and ending commands to parser
const originalParse = parseCommand;
parseCommand = function(raw) {
  const input = raw.trim().toLowerCase();
  if (input === 'restart' || input === 'new game' || input === 'newgame') {
    // Back through the gate. The Toll is taken fresh each time.
    location.reload();
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
    if (input === 'take rod' || input === 'take scepter' || input === 'grab rod' || input === 'get rod' || input === 'take toll-rod') {
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

  if (GS.flags.shadowLordDefeated && !GS.gameWon && (input === 'cast sunder' || input === 'destroy rod' || input === 'destroy scepter' || input === 'sunder rod')) {
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
    print('  E N D I N G :  T H E   N E W   S T E W A R D', 'text-red text-bold');
    print('');
    print('  You grasp the Rod. Authority floods through you — every debt', 'text-white');
    print('  in the building, itemized, and the perfect right to collect.', 'text-white');
    print('  The throne is warm. You sit. Of course you sit.', 'text-white');
    print('');
    print('  The Keep settles around you like a coat being tried on.', 'text-white');
    print('  You feel the gates far above, and the stairs far below, and', 'text-white');
    print('  every cold hearth in between. The ledger opens itself.', 'text-white');
    print('');
    print('  Somewhere overhead, footsteps: a new arrival, hollow and', 'text-white');
    print('  blinking on the courtyard stones. Their Toll passes down', 'text-white');
    print('  through the walls and settles, neat and weightless,', 'text-white');
    print('  into your open hand.', 'text-white');
    print('');
    print('  You chose to collect. The ledger continues.', 'text-red');
  } else if (type === 'sacrifice') {
    print('  E N D I N G :  T H E   R E S T I T U T I O N', 'text-cyan text-bold');
    print('');
    print('  You lift the Crown of Endings — every fragment the Steward', 'text-white');
    print('  ever skimmed, grown together — and you put it on, and you', 'text-white');
    print('  give it all back.', 'text-white');
    print('');
    print('  Through the Keep, the robbed remember. Cedric signs his own', 'text-white');
    print('  name to his own book. The merchant recalls, at last, what he', 'text-white');
    print('  once sold, and laughs until he weeps. A knight reads his', 'text-white');
    print('  crest like a letter from home.', 'text-white');
    print('');
    print('  And the gates — for one long night, for the first time in', 'text-white');
    print('  anyone\'s stolen memory — open outward. The freed walk out', 'text-white');
    print('  across the moor and do not look back. You are not among', 'text-white');
    print('  them. Restitution has a clerk, and the clerk stays.', 'text-white');
    print('');
    print('  You chose to give back what was taken.', 'text-cyan');
    print('  Even the Keep is quiet tonight.', 'text-cyan');
  } else if (type === 'destruction') {
    print('  E N D I N G :  T H E   S U N D E R I N G', 'text-amber text-bold');
    print('');
    print('  You speak the Word of Sundering upon the Toll-Rod — upon', 'text-white');
    print('  the Keep\'s own lent authority. The Rod cracks, screams', 'text-white');
    print('  in a voice like tearing paper, and unravels.', 'text-white');
    print('');
    print('  Every debt on this floor is suddenly, catastrophically', 'text-white');
    print('  void. The ghosts flicker. The walls forget what they are', 'text-white');
    print('  owed. For one impossible hour, nothing in the Keep Proper', 'text-white');
    print('  can take anything from anyone.', 'text-white');
    print('');
    print('  Then, from far below, a sound you feel in your teeth:', 'text-white');
    print('  stairs, opening. Many stairs. The Keep, unpaid, will do', 'text-white');
    print('  its own collecting now — and it is coming up to start.', 'text-white');
    print('');
    print('  You chose to void the ledger. The Keep chose', 'text-amber');
    print('  to stop using clerks.', 'text-amber');
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

