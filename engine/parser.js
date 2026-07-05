// === COMMAND PARSER ===

function parseCommand(raw) {
  const input = raw.trim().toLowerCase();
  if (!input) return;

  GS.turnCount++;
  GS.commandHistory.unshift(raw);
  if (GS.commandHistory.length > 50) GS.commandHistory.pop();
  GS.historyIndex = -1;

  print('');
  print('<span class="text-dim">&gt; ' + raw + '</span>');

  if (GS.inCombat) {
    handleCombatCommand(input);
    return;
  }

  if (GS.poisoned) {
    GS.poisonTurns--;
    GS.hp -= 3;
    print('The poison burns in your veins. (-3 HP)', 'text-red');
    if (GS.hp <= 0) { playerDeath('poison'); return; }
    if (GS.poisonTurns <= 0) { GS.poisoned = false; print('The poison fades from your system.', 'success-msg'); }
  }

  if (GS.tempAttackTurns > 0) {
    GS.tempAttackTurns--;
    if (GS.tempAttackTurns <= 0) {
      GS.tempAttackBonus = 0;
      print('The strength elixir wears off.', 'system-msg');
    }
  }

  const parts = input.split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1).join(' ');

  const dirMap = { n: 'north', s: 'south', e: 'east', w: 'west', u: 'up', d: 'down',
    north: 'north', south: 'south', east: 'east', west: 'west', up: 'up', down: 'down' };

  if (dirMap[cmd]) { doMove(dirMap[cmd]); return; }

  switch (cmd) {
    case 'look': case 'l': doLook(args); break;
    case 'examine': case 'x': doExamine(args); break;
    case 'go': case 'move': case 'walk': doMove(dirMap[args] || args); break;
    case 'take': case 'get': case 'grab': case 'pick': doTake(args === 'up' ? parts.slice(2).join(' ') : args); break;
    case 'drop': doDrop(args); break;
    case 'use': doUse(args); break;
    case 'equip': case 'wear': case 'wield': doEquip(args); break;
    case 'unequip': case 'remove': doUnequip(args); break;
    case 'inventory': case 'i': case 'inv': doInventory(); break;
    case 'attack': case 'fight': case 'kill': case 'hit': doAttack(args); break;
    case 'talk': case 'speak': doTalk(args); break;
    case 'ask': doAsk(args); break;
    case 'answer': doAnswer(args); break;
    case 'search': case 'investigate': doSearch(); break;
    case 'open': case 'unlock': doOpen(args); break;
    case 'push': case 'pull': case 'press': doPush(args); break;
    case 'read': doRead(args); break;
    case 'combine': case 'craft': doCombine(args); break;
    case 'cast': doCast(args); break;
    case 'play': doPlay(args); break;
    case 'rest': case 'sleep': doRest(); break;
    case 'map': case 'm': doMap(); break;
    case 'stats': case 'status': case 'stat': doStats(); break;
    case 'quests': case 'journal': case 'quest': doQuests(); break;
    case 'save': saveGame(); break;
    case 'load': case 'restore': loadGame(); break;
    case 'help': case 'h': case '?': doHelp(); break;
    case 'lore': case 'history': doLore(); break;
    case 'carve': case 'write': doCarve(args); break;
    case 'xyzzy': print('A hollow voice says "Fool."', 'text-amber'); break;
    case 'plugh': print('Nothing happens. Were you expecting magic words to work? ...Wait.', 'text-dim'); break;
    case 'hint': case 'hints': doHint(); break;
    case 'flee': case 'run': doFlee(); break;
    case 'buy': case 'trade': case 'sell': doTrade(args); break;
    case 'brew': doBrew(); break;
    case 'give': doGive(args); break;
    case 'clear': case 'cls': outputEl().innerHTML = ''; printRoom(GS.currentRoom); break;
    case 'verbose': GS.flags.verbose = !GS.flags.verbose; print('Verbose mode ' + (GS.flags.verbose ? 'on' : 'off') + '.', 'system-msg'); break;
    default:
      print("I don't understand '" + cmd + "'. Type 'help' for commands.", 'error-msg');
  }

  updatePanels();
}

