// === NPC INTERACTION ===

// Topics visible to this player. Supports hidden topics that unlock when
// other topics reveal them - conversation as exploration.
function topicEntry(v) { return typeof v === 'string' ? { text: v } : (v || {}); }

function npcTopics(npc, npcId) {
  const all = Object.assign({}, npc.topics || {});
  if ((GS.race === 'gravekin' || GS.class === 'grave_speaker') && npc.gravekinTopics) Object.assign(all, npc.gravekinTopics);
  const out = {};
  for (const [k, v] of Object.entries(all)) {
    const e = topicEntry(v);
    if (e.hidden && !GS.perks['topic_' + npcId + '_' + k]) continue;
    out[k] = e.text;
  }
  return out;
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
  const room = ROOMS[GS.currentRoom];
  if (!room.npcs || room.npcs.length === 0) {
    print("There's nobody to talk to here.", 'error-msg');
    return;
  }
  const npcId = args ? room.npcs.find(id => matchNpc(id, args)) : room.npcs[0];
  if (!npcId || !NPCS[npcId]) {
    print("You don't see that person.", 'error-msg');
    return;
  }
  const npc = NPCS[npcId];
  print('<span class="npc-name">' + npc.name + '</span>', '');
  print(npc.greeting, 'npc-speech');
  trackSkullTalk(npcId);
  if (npc.topics) {
    print('');
    print('Topics: ' + Object.keys(npcTopics(npc, npcId)).join(', '), 'text-dim');
    print("(Type 'ask [topic]' to inquire)", 'text-dim');
  }

  if (npc.quest && !npc.quest.active && !npc.quest.completed && !GS.questLog.includes(npc.quest.id)) {
    GS.questLog.push(npc.quest.id);
    npc.quest.active = true;
    print('');
    print('New quest: ' + npc.quest.name, 'text-amber');
  }
}

function doAsk(args) {
  const room = ROOMS[GS.currentRoom];
  if (!room.npcs || room.npcs.length === 0) {
    print("There's nobody to ask.", 'error-msg');
    return;
  }

  const parts = args.split(/\s+about\s+/i);
  let npcQuery, topic;
  if (parts.length > 1) {
    npcQuery = parts[0];
    topic = parts[1];
  } else {
    topic = args;
    npcQuery = null;
  }

  const npcId = npcQuery ? room.npcs.find(id => matchNpc(id, npcQuery)) : room.npcs[0];
  if (!npcId || !NPCS[npcId]) {
    print("You don't see that person.", 'error-msg');
    return;
  }
  const npc = NPCS[npcId];

  const visible = npcTopics(npc, npcId);
  if (visible[topic]) {
    print('<span class="npc-name">' + npc.name + '</span>:', '');
    print(visible[topic], 'npc-speech');
    trackSkullTalk(npcId);
    // Some answers open new questions.
    const raw = (npc.topics && npc.topics[topic]) || (npc.gravekinTopics && npc.gravekinTopics[topic]);
    const reveals = (topicEntry(raw).reveals || []).concat((npc.topicReveals && npc.topicReveals[topic]) || []);
    let opened = false;
    for (const r of reveals) {
      const key = 'topic_' + npcId + '_' + r;
      if (!GS.perks[key]) { GS.perks[key] = true; opened = true; }
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
    if (guardian.riddleSolved) {
      print("The guardian nods. 'You have already answered correctly.'", 'npc-speech');
      return;
    }
    if (args.toLowerCase().includes(guardian.riddleAnswer)) {
      guardian.riddleSolved = true;
      print("The guardian's stern expression softens. 'Correct. The simplest answers are often the truest.' The silver dagger materializes in your hands, cold and thrumming with power.", 'npc-speech');
      GS.inventory.push(guardian.riddleReward);
      GS.itemsFound++;
      print('Obtained: ' + ITEMS[guardian.riddleReward].name, 'text-amber');
      GS.flags.riddleSolved = true;
    } else {
      print("The guardian shakes its head. 'Incorrect. Think carefully. I have cities, but no houses. Mountains, but no trees...'", 'npc-speech');
    }
    return;
  }

  print("Nobody is waiting for an answer.", 'error-msg');
}

function doGive(args) {
  const room = ROOMS[GS.currentRoom];
  if (!room.npcs || room.npcs.length === 0) {
    print("There's nobody to give things to.", 'error-msg');
    return;
  }

  for (const npcId of room.npcs) {
    const npc = NPCS[npcId];
    if (!npc || !npc.quest || npc.quest.completed) continue;

    const req = npc.quest.requires;
    if (Array.isArray(req)) {
      if (req.every(id => hasItem(id))) {
        for (const id of req) {
          GS.inventory = GS.inventory.filter(i => i !== id);
        }
        npc.quest.completed = true;
        GS.completedQuests.push(npc.quest.id);
        print(npc.quest.onComplete, 'npc-speech');
        if (npc.quest.reward) {
          for (const r of npc.quest.reward) { GS.inventory.push(r); GS.itemsFound++; }
        }
        if (npc.quest.rewardText) print(npc.quest.rewardText, 'text-amber');
        if (npc.quest.statBonus) {
          if (npc.quest.statBonus.attack) GS.attack += npc.quest.statBonus.attack;
          if (npc.quest.statBonus.defense) GS.defense += npc.quest.statBonus.defense;
        }
        if (npc.quest.teachesSpell && !GS.spells.includes(npc.quest.teachesSpell)) {
          GS.spells.push(npc.quest.teachesSpell);
          print('Learned spell: ' + npc.quest.teachesSpell, 'text-cyan');
        }
        if (npc.quest.revealsHidden) {
          roomStates[npc.quest.revealsHidden].hiddenExitRevealed = true;
          print('Secret passage revealed in the ' + ROOMS[npc.quest.revealsHidden].name + '!', 'text-amber');
        }
        return;
      }
    } else if (typeof req === 'string') {
      if (hasItem(req)) {
        GS.inventory = GS.inventory.filter(i => i !== req);
        npc.quest.completed = true;
        GS.completedQuests.push(npc.quest.id);
        print(npc.quest.onComplete, 'npc-speech');
        if (npc.quest.reward) {
          for (const r of npc.quest.reward) { GS.inventory.push(r); GS.itemsFound++; }
        }
        if (npc.quest.rewardText) print(npc.quest.rewardText, 'text-amber');
        if (npc.quest.statBonus) {
          if (npc.quest.statBonus.attack) GS.attack += npc.quest.statBonus.attack;
          if (npc.quest.statBonus.defense) GS.defense += npc.quest.statBonus.defense;
        }
        if (npc.quest.revealsHidden) {
          roomStates[npc.quest.revealsHidden].hiddenExitRevealed = true;
          print('Secret passage revealed in the ' + ROOMS[npc.quest.revealsHidden].name + '!', 'text-amber');
        }
        return;
      }
    }
  }

  print("They don't seem interested in what you're offering.", 'text-dim');
}

