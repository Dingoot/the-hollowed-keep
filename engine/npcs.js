// === NPC INTERACTION ===

// Quest state lives on GS (questLog/completedQuests), which is what the
// save file keeps - never on the NPC objects, which reset on reload.
function questDone(npc) { return !!(npc.quest && GS.completedQuests.includes(npc.quest.id)); }

// Who is actually in a room right now. NPCs marked leavesAfterQuest are
// gone once their business with you concludes.
function npcsPresent(roomId) {
  const room = ROOMS[roomId];
  return (room.npcs || []).filter(id => {
    const npc = NPCS[id];
    return npc && !(npc.leavesAfterQuest && questDone(npc));
  });
}

// Meeting someone is a fact the text respects: names appear only once
// they are given, and greetings know whether you are a stranger, a
// regular, or the recently deceased.
function hasMet(npcId) { return !!GS.perks['met_' + npcId]; }

function markMet(npcId) {
  if (hasMet(npcId)) return;
  GS.perks['met_' + npcId] = true;
  // Deaths before you knew each other are not theirs to remark on.
  GS.deathsGreetedBy[npcId] = GS.deaths;
}

function npcPresenceLine(npc, npcId) {
  if (!hasMet(npcId) && npc.presenceUnmet) return npc.presenceUnmet;
  if (questDone(npc) && npc.postQuestPresence) return npc.postQuestPresence;
  return npc.presence || (npcDisplayName(npc, npcId) + ' is here.');
}

// First meeting: the full introduction. After that: a return greeting,
// or an after-death one when the Keep has collected you since you last
// spoke (only NPCs close enough to notice carry one).
function npcGreeting(npc, npcId) {
  if (!hasMet(npcId)) return npc.greeting;
  if (npc.deathGreeting && GS.deaths > (GS.deathsGreetedBy[npcId] || 0)) {
    GS.deathsGreetedBy[npcId] = GS.deaths;
    return npc.deathGreeting;
  }
  if (questDone(npc) && npc.postQuestGreeting) return npc.postQuestGreeting;
  return npc.returnGreeting || npc.greeting;
}

function npcDisplayName(npc, npcId) {
  if (npcId && !hasMet(npcId) && npc.unmetName) return npc.unmetName;
  return (questDone(npc) && npc.postQuestName) ? npc.postQuestName : npc.name;
}

// Topics visible to this player. Supports hidden topics that unlock when
// other topics reveal them - conversation as exploration.
function topicEntry(v) { return typeof v === 'string' ? { text: v } : (v || {}); }

function npcAllTopics(npc) {
  // Once the quest is done, postQuestTopics REPLACE the base set - the
  // wounded man's pleas shouldn't survive his recovery.
  const all = (questDone(npc) && npc.postQuestTopics)
    ? Object.assign({}, npc.postQuestTopics)
    : Object.assign({}, npc.topics || {});
  if ((GS.race === 'gravekin' || GS.class === 'grave_speaker') && npc.gravekinTopics) Object.assign(all, npc.gravekinTopics);
  return all;
}

function npcTopics(npc, npcId) {
  const out = {};
  for (const [k, v] of Object.entries(npcAllTopics(npc))) {
    const e = topicEntry(v);
    if (e.hidden && !GS.perks['topic_' + npcId + '_' + k]) continue;
    out[k] = e.text;
  }
  return out;
}

// === CONVERSATION STATE ===
// Talking to someone engages them; 'ask' goes to them until you say
// goodbye, walk away, or someone starts a fight.

function conversationPartner() {
  const id = GS.conversationWith;
  if (id && npcsPresent(GS.currentRoom).includes(id)) return id;
  return null;
}

// 'the Wounded Knight', 'the Porter', but plain 'Wick'.
function npcRef(npc) {
  if (/^the\s/i.test(npc.name)) return npc.name.replace(/^The\s/, 'the ');
  return npc.name.includes(' ') ? 'the ' + npc.name : npc.name;
}

function endConversation(quietly) {
  const id = conversationPartner();
  GS.conversationWith = null;
  if (!id || quietly) return;
  print('(You take your leave of ' + npcRef(NPCS[id]) + '.)', 'text-dim');
}

function doGoodbye() {
  const id = conversationPartner();
  if (!id) {
    GS.conversationWith = null;
    print('You are not talking to anyone. The stones accept the farewell on file.', 'text-dim');
    return;
  }
  const npc = NPCS[id];
  GS.conversationWith = null;
  if (npc.farewell) print(npc.farewell, 'npc-speech');
  else print('You take your leave of ' + npcRef(npc) + '.', 'text-dim');
}

function doTopics() {
  const id = conversationPartner();
  if (!id) { print("You're not in a conversation. (talk [person] to start one)", 'text-dim'); return; }
  const npc = NPCS[id];
  print('Topics for ' + npcDisplayName(npc, id) + ': ' + Object.keys(npcTopics(npc, id)).join(', '), 'text-dim');
}

function trackSkullTalk(npcId) {
  if (npcId !== 'talking_skull') return;
  GS.perks.skullTalks = (GS.perks.skullTalks || 0) + 1;
  const needed = GS.race === 'gravekin' ? 3 : 5;
  if (GS.perks.skullTalks >= needed && !GS.skills.bone_speaking) {
    gainSkillXP('bone_speaking', 10);
  }
}

function doTalk(args) {
  const present = npcsPresent(GS.currentRoom);
  if (present.length === 0) {
    print("There's nobody to talk to here.", 'error-msg');
    return;
  }
  let npcId;
  if (args) {
    npcId = present.find(id => matchNpc(id, args));
    if (!npcId) { print("You don't see that person.", 'error-msg'); return; }
  } else if (present.length === 1) {
    npcId = present[0];
  } else if (conversationPartner()) {
    npcId = conversationPartner();
  } else {
    print('Talk to whom? ' + present.map(id => npcDisplayName(NPCS[id], id)).join(', or ') + '.', 'text-dim');
    return;
  }
  const npc = NPCS[npcId];
  GS.conversationWith = npcId;
  // Pick the greeting and header before marking them met - the header may
  // still be a stranger's ('Hooded Figure' until Wick has introduced itself).
  const greeting = npcGreeting(npc, npcId);
  print('<span class="npc-name">' + npcDisplayName(npc, npcId) + '</span>', '');
  markMet(npcId);
  print(greeting, 'npc-speech');
  trackSkullTalk(npcId);

  // Some NPCs press a gift on you the first time you speak - once, ever.
  if (npc.givesOnFirstMeet && !GS.flags['gift_' + npcId]) {
    GS.flags['gift_' + npcId] = true;
    const giftId = npc.givesOnFirstMeet;
    if (!hasItem(giftId)) { GS.inventory.push(giftId); GS.itemsFound++; }
    print('');
    if (npc.giftText) print(npc.giftText, 'npc-speech');
    print('Received: ' + ITEMS[giftId].name, 'text-amber');
  }

  if (npc.topics) {
    print('');
    print('Topics: ' + Object.keys(npcTopics(npc, npcId)).join(', '), 'text-dim');
    // The how-to hint retires once the player has asked anything at all.
    if (!GS.flags.usedAsk) print("(ask [topic], or 'goodbye' to leave)", 'text-dim');
  }

  if (npc.quest && !GS.questLog.includes(npc.quest.id)) {
    GS.questLog.push(npc.quest.id);
    print('');
    print('New quest: ' + npc.quest.name, 'text-amber');
  }
}

function doAsk(args) {
  const present = npcsPresent(GS.currentRoom);
  if (present.length === 0) {
    print("There's nobody to ask.", 'error-msg');
    return;
  }
  if (!args) { print('Ask about what? (ask [topic])', 'error-msg'); return; }

  const parts = args.split(/\s+about\s+/i);
  let npcQuery, topic;
  if (parts.length > 1 && parts[0]) {
    npcQuery = parts[0];
    topic = parts[1];
  } else {
    topic = parts.length > 1 ? parts[1] : args;
    npcQuery = null;
  }

  // Questions go to whoever you're talking to; naming someone else
  // turns the conversation to them instead.
  let npcId;
  if (npcQuery) {
    npcId = present.find(id => matchNpc(id, npcQuery));
    if (!npcId) { print("You don't see that person.", 'error-msg'); return; }
  } else {
    npcId = conversationPartner() || (present.length === 1 ? present[0] : null);
    if (!npcId) {
      print("You're not talking to anyone yet. (talk [person] first, or 'ask [person] about [topic]')", 'text-dim');
      return;
    }
  }
  const npc = NPCS[npcId];
  GS.conversationWith = npcId;
  markMet(npcId);

  const visible = npcTopics(npc, npcId);
  const t = topic.replace(/^(the|a|an)\s+/, '').trim().toLowerCase();
  const key = visible[t] !== undefined ? t
    : Object.keys(visible).find(k => t.length >= 3 && (k.includes(t) || t.includes(k)));
  if (key) {
    GS.flags.usedAsk = true;
    print('<span class="npc-name">' + npcDisplayName(npc, npcId) + '</span>:', '');
    print(visible[key], 'npc-speech');
    trackSkullTalk(npcId);
    // Some answers open new questions.
    const reveals = (topicEntry(npcAllTopics(npc)[key]).reveals || []).concat((npc.topicReveals && npc.topicReveals[key]) || []);
    let opened = false;
    for (const r of reveals) {
      const perkKey = 'topic_' + npcId + '_' + r;
      if (!GS.perks[perkKey]) { GS.perks[perkKey] = true; opened = true; }
    }
    print('');
    print('Topics: ' + Object.keys(npcTopics(npc, npcId)).join(', ') + (opened ? '  <span class="text-cyan">(something new)</span>' : ''), 'text-dim');
  } else {
    print(npc.name + " doesn't have anything to say about that.", 'text-dim');
    print('Try asking about: ' + Object.keys(visible).join(', '), 'text-dim');
  }
}

function doAnswer(args) {
  const room = ROOMS[GS.currentRoom];
  if (!room.npcs) { print("Nobody is listening.", 'error-msg'); return; }

  if (room.npcs.includes('spectral_guardian')) {
    const guardian = NPCS.spectral_guardian;
    if (GS.flags.riddleSolved) {
      print(`The Guardian inclines its head. "You have already answered truly. The chapel does not forget - and neither, seeker, do I."`, 'npc-speech');
      return;
    }
    if (args.toLowerCase().includes(guardian.riddleAnswer)) {
      print(`The stern light softens - the nearest thing to a smile the armour allows. "Truly answered. The simplest answers were always the truest." The Guardian opens one gauntleted hand, and the Silver Dagger materializes across your palms, cold and thrumming with its last blessing. "Carry it below. It remembers what it is for."`, 'npc-speech');
      GS.inventory.push(guardian.riddleReward);
      GS.itemsFound++;
      print('Obtained: ' + ITEMS[guardian.riddleReward].name, 'text-amber');
      GS.flags.riddleSolved = true;
    } else {
      print(`The Guardian is unmoved, and unhurried. "No. Think again, seeker - the answer is a humble thing. I have cities, but no houses. Mountains, but no trees." A pause. "Truth rarely announces itself."`, 'npc-speech');
    }
    return;
  }

  print("Nobody is waiting for an answer.", 'error-msg');
}

function doGive(args) {
  const present = npcsPresent(GS.currentRoom);
  if (present.length === 0) {
    print("There's nobody to give things to.", 'error-msg');
    return;
  }

  for (const npcId of present) {
    const npc = NPCS[npcId];
    if (!npc.quest || questDone(npc)) continue;

    // requiresAny: any ONE of the listed items satisfies it (and only that
    // one is consumed). requires: needs ALL listed items.
    let consume;
    if (npc.quest.requiresAny) {
      const have = npc.quest.requiresAny.find(id => hasItem(id));
      if (!have) continue;
      consume = [have];
    } else {
      const req = Array.isArray(npc.quest.requires) ? npc.quest.requires : [npc.quest.requires];
      if (!req.every(id => hasItem(id))) continue;
      consume = req;
    }

    GS.inventory = GS.inventory.filter(i => !consume.includes(i));
    GS.completedQuests.push(npc.quest.id);
    print(npc.quest.onComplete, 'npc-speech');
    if (npc.quest.reward) {
      for (const r of npc.quest.reward) { GS.inventory.push(r); GS.itemsFound++; }
    }
    if (npc.quest.rewardText) print(npc.quest.rewardText, 'text-amber');
    if (npc.quest.statBonus) {
      if (npc.quest.statBonus.attack) GS.perks.flatDamage = (GS.perks.flatDamage || 0) + npc.quest.statBonus.attack;
      if (npc.quest.statBonus.defense) GS.perks.flatAC = (GS.perks.flatAC || 0) + npc.quest.statBonus.defense;
    }
    if (npc.quest.teachesSpell && !GS.spells.includes(npc.quest.teachesSpell)) {
      GS.spells.push(npc.quest.teachesSpell);
      print('Learned spell: ' + npc.quest.teachesSpell, 'text-cyan');
    }
    if (npc.quest.revealsHidden) {
      roomStates[npc.quest.revealsHidden].hiddenExitRevealed = true;
      print('Secret passage revealed in the ' + ROOMS[npc.quest.revealsHidden].name + '!', 'text-amber');
    }
    if (npc.leavesAfterQuest) endConversation(true);
    return;
  }

  print("They don't seem interested in what you're offering.", 'text-dim');
}

