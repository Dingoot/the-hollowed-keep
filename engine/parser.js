// === COMMAND PARSER ===

function parseCommand(raw) {
  const input = raw.trim().toLowerCase();
  if (!input) return;

  GS.turnCount++;
  GS.commandHistory.unshift(raw);
  if (GS.commandHistory.length > 50) GS.commandHistory.pop();
  GS.historyIndex = -1;

  GS.lastInputAt = Date.now();
  print('');
  print('<span class="text-dim">&gt; ' + raw + '</span>');
  print('');

  if (GS.awaitingDeath) {
    if (input === 'wake' || input === 'wake up' || input === 'rise') { respawnFromDeath(); updatePanels(); return; }
    if (input === 'quit' || input === 'menu') { location.reload(); return; }
    print("You are between. 'wake', or 'quit'.", 'text-dim');
    return;
  }

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

  // Turning to some other business - searching, taking, working - lets a
  // conversation lapse quietly. Talking verbs and out-of-fiction commands
  // (look, help, save, panels) keep it alive; walking out says goodbye in doMove.
  const CONVO_KEEP = new Set(['talk', 'speak', 'approach', 'greet', 'ask', 'topics', 'goodbye', 'bye', 'farewell',
    'answer', 'give', 'buy', 'sell', 'trade', 'brew', 'look', 'l', 'help', 'h', '?', 'save', 'load', 'restore',
    'inventory', 'i', 'inv', 'map', 'm', 'stats', 'self', 'vessel', 'skills', 'skill', 'status', 'stat', 'record',
    'quests', 'journal', 'quest', 'speed', 'textspeed', 'clear', 'cls', 'hint', 'hints']);
  if (GS.conversationWith && !CONVO_KEEP.has(cmd)) GS.conversationWith = null;

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
    case 'attack': case 'fight': case 'kill': case 'hit':
    case 'punch': case 'kick': case 'shove': case 'slap': case 'headbutt': case 'elbow':
    case 'stab': case 'thrust': case 'slash': case 'slice': case 'cut':
    case 'chop': case 'cleave': case 'hack': case 'bash': case 'smash':
    case 'shoot': case 'fire': case 'loose': doAttack(args); break;
    case 'tackle': case 'grapple': doTackleCommand(args); break;
    case 'block': case 'brace': case 'parry': doBlock(); break;
    case 'dodge': case 'duck': case 'evade': doDodge(); break;
    case 'feint': doFeint(); break;
    case 'throw': case 'hurl': case 'toss': doThrow(args); break;
    case 'talk': case 'speak': case 'approach': case 'greet': doTalk(args); break;
    case 'ask': doAsk(args); break;
    case 'goodbye': case 'bye': case 'farewell': doGoodbye(); break;
    case 'topics': doTopics(); break;
    case 'answer': doAnswer(args); break;
    case 'search': case 'investigate': case 'examine room': doSearch(args); break;
    case 'skills': case 'skill': doSkillsCmd(); break;
    case 'crystallize': case 'crystalize': case 'ledger': doCrystallize(args); break;
    case 'accept': doAcceptClass(); break;
    case 'unwritten': case 'refuse': doUnwritten(); break;
    case 'rally': doRally(); break;
    case 'pray': doPray(); break;
    case 'invoke': doInvokeToll(); break;
    case 'stats': case 'self': case 'vessel': doStatsCmd(); break;
    case 'light': if (!args || args.includes('hearth') || args.includes('fire')) { doLightHearth(); } else { doUse(args); } break;
    case 'open': case 'unlock': doOpen(args); break;
    case 'push': case 'pull': case 'press': doPush(args); break;
    case 'read': doRead(args); break;
    case 'combine': case 'craft': doCombine(args); break;
    case 'cast': doCast(args); break;
    case 'play': doPlay(args); break;
    case 'rest': case 'sleep': doRest(); break;
    case 'map': case 'm': doMap(); break;
    case 'status': case 'stat': case 'record': doStats(); break;
    case 'quests': case 'journal': case 'quest': doQuests(); break;
    case 'save': saveGame(); break;
    case 'load': case 'restore': loadGame(); break;
    case 'help': case 'h': case '?': doHelp(args); break;
    case 'carve': case 'write': doCarve(args); break;
    case 'xyzzy': print('A hollow voice says "Fool."', 'text-amber'); break;
    case 'plugh': print('Nothing happens. Were you expecting magic words to work? ...Wait.', 'text-dim'); break;
    case 'hint': case 'hints': doHint(); break;
    case 'flee': case 'run': doFlee(); break;
    case 'trade': doTrade(args); break;
    case 'buy': doBuy(args); break;
    case 'sell': doSell(args); break;
    case 'brew': doBrew(); break;
    case 'give': doGive(args); break;
    case 'clear': case 'cls': outputEl().innerHTML = ''; printRoom(GS.currentRoom); break;
    case 'speed': case 'textspeed': doSpeed(args); break;
    default:
      if (typeof VERB_RESPONSES !== 'undefined' && VERB_RESPONSES[cmd]) {
        print(pick(VERB_RESPONSES[cmd]), 'text-white');
        break;
      }
      if (cmd === 'yell') { print(pick(VERB_RESPONSES.shout), 'text-white'); break; }
      if (cmd === 'sniff') { print(pick(VERB_RESPONSES.smell), 'text-white'); break; }
      if (cmd === 'feel') { print(pick(VERB_RESPONSES.touch), 'text-white'); break; }
      print("Unrecognised command. Try 'help' for what's available.", 'error-msg');
  }

  updatePanels();
}

