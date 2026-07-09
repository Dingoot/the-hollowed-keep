// === COMBAT ===

// Pick a described blow for this verb, this victim, this much hurt.
function attackFlavourLine(group, enemy, dmg) {
  const tier = dmg <= 3 ? 'low' : 'mid';
  const byType = (ATTACK_FLAVOUR[enemy.type] && ATTACK_FLAVOUR[enemy.type][group]) || {};
  const pool = byType[tier] || (ATTACK_FLAVOUR.generic[group] && ATTACK_FLAVOUR.generic[group][tier]) || null;
  if (!pool || pool.length === 0) return 'You strike the ' + enemy.name + ' (' + dmg + ' damage).';
  const line = pool[rng(0, pool.length - 1)];
  return line.replace('{dmg}', dmg).replace('{name}', enemy.name.toLowerCase());
}

// One-time reactions as the fight turns.
function maybeStageLine(enemy) {
  if (!enemy || enemy.hp <= 0) return;
  const pct = enemy.hp / enemy.maxHp;
  const pool = STAGE_LINES[enemy.type] || STAGE_LINES.generic;
  if (pct <= 0.25 && enemy.stage !== 'bloody') {
    enemy.stage = 'bloody';
    print(pool.bloody[rng(0, pool.bloody.length - 1)], 'text-amber', 500);
  } else if (pct <= 0.5 && !enemy.stage) {
    enemy.stage = 'worn';
    print(pool.worn[rng(0, pool.worn.length - 1)], 'text-amber', 500);
  }
}

// - Combat math: d20 to-hit against AC, damage from weapon + stat + skill -
function skillLv(id) { return GS.skills[id] ? GS.skills[id].level : 0; }

function weaponInfo(verb) {
  if (verb) {
    let skill = 'unarmed';
    if ((verb === 'kick' || verb === 'knee') && GS.skills.boot_heel) skill = 'boot_heel';
    if ((verb === 'punch' || verb === 'slap' || verb === 'elbow' || verb === 'headbutt') && GS.skills.pugilism) skill = 'pugilism';
    return { base: 2, stat: 'str', skill };
  }
  const w = GS.equipped.weapon && ITEMS[GS.equipped.weapon];
  if (!w) return { base: 2, stat: 'str', skill: 'unarmed' };
  const finesse = ['daggers', 'bows', 'crossbows', 'thrown'];
  const fam = w.family || 'unarmed';
  return { base: w.attack || 1, stat: finesse.includes(fam) ? 'dex' : 'str', skill: fam };
}

// - Attack styles: a weapon family offers named attacks, each carrying a
// damage KIND (slash / pierce / blunt) that enemies resist or fear
// differently. Ranged families shoot instead, and can aim (body/head/legs).
const WEAPON_STYLES = {
  swords:    { default: 'slash', verbs: { slash: 'slash', slice: 'slash', cut: 'slash', stab: 'pierce', thrust: 'pierce', pommel: 'blunt' } },
  daggers:   { default: 'pierce', verbs: { stab: 'pierce', thrust: 'pierce', jab: 'pierce', slash: 'slash', slice: 'slash' } },
  axes:      { default: 'slash', verbs: { chop: 'slash', cleave: 'slash', hack: 'slash', slash: 'slash' } },
  maces:     { default: 'blunt', verbs: { bash: 'blunt', smash: 'blunt', crush: 'blunt' } },
  crossbows: { default: 'pierce', ranged: true },
  bows:      { default: 'pierce', ranged: true },
};
const KIND_WORD = { slash: 'blade', pierce: 'point', blunt: 'impact' };
const UNARMED_ATTACK_VERBS = ['punch', 'kick', 'headbutt', 'shove', 'slap', 'elbow', 'knee'];

function equippedStyleSet() {
  const w = GS.equipped.weapon && ITEMS[GS.equipped.weapon];
  if (!w) return null;
  return WEAPON_STYLES[w.family] || null;
}

// The styles the player could name right now, for hints and help.
function availableStyleVerbs() {
  const set = equippedStyleSet();
  if (!set) return ['punch', 'kick'];
  if (set.ranged) return ['shoot', 'shoot head', 'shoot legs'];
  return Object.keys(set.verbs || {});
}

// Turn a combat command into an attack descriptor, or { isAttack:false }.
function resolveAttackStyle(cmd, args) {
  const set = equippedStyleSet();
  const ranged = set && set.ranged;

  if (cmd === 'shoot' || cmd === 'fire' || cmd === 'loose' || cmd === 'aim') {
    if (!ranged) return { isAttack: true, needsRanged: true };
    let aim = 'body';
    if (/\b(head|face|eyes?|skull)\b/.test(args)) aim = 'head';
    else if (/\b(legs?|foot|feet|knees?)\b/.test(args)) aim = 'legs';
    return { isAttack: true, ranged: true, verb: 'shoot', kind: 'pierce', group: 'shoot', aim,
      hitMod: aim === 'head' ? -4 : 0, dmgMult: aim === 'head' ? 1.75 : aim === 'legs' ? 0.6 : 1 };
  }
  if (cmd === 'attack' || cmd === 'hit' || cmd === 'fight' || cmd === 'a') {
    if (ranged) return { isAttack: true, ranged: true, verb: 'shoot', kind: 'pierce', group: 'shoot', aim: 'body', hitMod: 0, dmgMult: 1 };
    if (set) return { isAttack: true, verb: set.default === 'blunt' ? 'strike' : set.default, kind: set.default, group: set.default };
    return { isAttack: true, unarmed: true, verb: 'strike', kind: 'blunt', group: 'punch' };
  }
  if (UNARMED_ATTACK_VERBS.includes(cmd)) {
    return { isAttack: true, unarmed: true, verb: cmd, kind: 'blunt', group: (cmd === 'kick' || cmd === 'knee') ? 'kick' : 'punch' };
  }
  if (set && set.verbs && set.verbs[cmd]) {
    return { isAttack: true, verb: cmd, kind: set.verbs[cmd], group: set.verbs[cmd] };
  }
  return { isAttack: false };
}

// Aimed shots read differently from body shots - their own lines.
function aimedShotLine(aim, enemy, dmg) {
  const name = enemy.name.toLowerCase();
  const head = [
    'You aim high and the bolt takes it clean in the head - it rocks back hard (' + dmg + ' damage).',
    'The shot punches through where you aimed; the ' + name + "'s head snaps aside (" + dmg + ' damage).',
  ];
  const legs = [
    'The bolt takes it low, in the leg (' + dmg + ' damage).',
    'You aim for the stride and the bolt finds it - the ' + name + ' lurches (' + dmg + ' damage).',
  ];
  const pool = aim === 'head' ? head : legs;
  return pool[rng(0, pool.length - 1)];
}

// One varied line for an enemy's attack, by the move type it just used.
function enemyAttackLine(enemy, type) {
  const pool = enemy.attacks && enemy.attacks[type];
  if (pool && pool.length) return pool[rng(0, pool.length - 1)];
  const fallback = enemy.attacks && (enemy.attacks.strike || Object.values(enemy.attacks)[0]);
  if (fallback && fallback.length) return fallback[rng(0, fallback.length - 1)];
  return enemy.attackMsg;
}

function playerAC() {
  let ac = 10 + statMod(GS.stats.dex);
  for (const slot of ['armor', 'offhand', 'ring']) {
    const id = GS.equipped[slot];
    if (id && ITEMS[id]) ac += ITEMS[id].defense || 0;
  }
  ac += GS.perks.flatAC || 0;
  return ac;
}

// Hitting should be the norm; missing the exception. Enemy DEF feeds AC at
// half weight so tough foes are hard to hurt, not impossible to touch.
function enemyAC(e) { return 8 + Math.floor((e.defense || 0) / 2); }
function playerHitBonus(info) { return 4 + statMod(GS.stats[info.stat]) + Math.floor(skillLv(info.skill) / 3) + (GS.perks.hitBonus || 0); }
function enemyHitBonus(e) { return 2 + Math.floor((e.attack || 4) / 3); }

function doAttack(args) {
  const rs = roomStates[GS.currentRoom];
  const room = ROOMS[GS.currentRoom];
  // People are attackable. This is rarely wise.
  if (args && room.npcs) {
    const nid = npcsPresent(GS.currentRoom).find(id => matchNpc(id, args));
    if (nid) { attackNpc(nid); return; }
  }
  if (rs.enemies.length === 0) {
    if (npcsPresent(GS.currentRoom).length > 0) {
      print('Nothing here needs killing. Someone here could be attacked, if you insist - name them.', 'text-dim');
      return;
    }
    print("There's nothing to attack here.", 'error-msg');
    return;
  }
  if (room.dark && !hasLight()) {
    print("You can't fight what you can't see!", 'error-msg');
    return;
  }
  const enemyId = args ? rs.enemies.find(id => matchEnemy(id, args)) : rs.enemies[0];
  if (!enemyId) { print("You don't see that enemy.", 'error-msg'); return; }
  if (GS.kills[GS.currentRoom + '_' + enemyId]) { print("It's already defeated.", 'text-dim'); return; }
  startCombat(enemyId);
}

function attackNpc(npcId) {
  const npc = NPCS[npcId];
  if (npcId === 'porter') {
    GS.perks.porterStruck = (GS.perks.porterStruck || 0) + 1;
    if (GS.perks.porterStruck === 1) {
      print(npc.onAttackStages[0], 'npc-speech');
      print('');
      keepSays('The Keep pretends not to have seen that. The pretence is itself a message.');
      return;
    }
    porterFlick();
    return;
  }
  if (npc.onAttack) {
    print(npc.onAttack, 'npc-speech');
    gainSkillXP('unarmed', 2);
    return;
  }
  print('You square up to ' + npc.name + ', then think better of it.', 'text-dim');
}

function doTackle() {
  const enemy = GS.currentEnemy;
  if (!GS.inCombat || !enemy) { print('Nothing here to tackle. The furniture forgives you.', 'text-dim'); return; }
  if (!enemy.animal && !enemy.humanoid) {
    print('It offers nothing you would want your arms around. You shove it instead, gracelessly.', 'text-dim');
    enemyTurn();
    updatePanels();
    return;
  }
  if (enemy.pinnedTurns > 0) {
    print('You already have it pinned. Press the advantage - or try to calm it.', 'text-dim');
    return;
  }
  const you = rng(1, 20) + statMod(GS.stats.str) + Math.floor(skillLv('wrestling') / 4);
  const it = rng(1, 20) + statMod(enemy.dex || 10);
  if (you >= it) {
    const hold = Math.max(1, Math.min(4, 2 + Math.floor((GS.stats.str - (enemy.str || 10)) / 6) + Math.floor(skillLv('wrestling') / 5)));
    enemy.pinnedTurns = hold;
    const dmg = 1 + rng(0, 1);
    enemy.hp -= dmg;
    print('&rsaquo; You drop low and crash through its guard, arms locking - you ride it down to the stone and hold it there. (' + dmg + ' damage, pinned ' + hold + ' turns)', 'you-line');
    gainSkillXP('unarmed', 4);
    GS.perks.tackleWins = (GS.perks.tackleWins || 0) + 1;
    if (GS.perks.tackleWins >= 5 && !GS.skills.wrestling) gainSkillXP('wrestling', 10);
    if (GS.skills.wrestling) gainSkillXP('wrestling', 5);
    maybeStageLine(enemy);
    if (enemy.hp <= 0) { endCombat(true); return; }
  } else {
    print('&rsaquo; You lunge - it twists free at the last instant and you meet the flagstones. It does not waste the opening.', 'you-line you-miss');
    enemyTurn();
  }
  updatePanels();
}


function doSoothe() {
  const enemy = GS.currentEnemy;
  if (!GS.inCombat || !enemy || !enemy.animal) { print('There is nothing here that gentling would reach.', 'text-dim'); return; }
  if (!(enemy.pinnedTurns > 0)) { print('Not while it is free to take your face off. Pin it first.', 'text-dim'); return; }
  if (!enemy.tameable) {
    print('You speak softly. Whatever this is, it was never anyone\'s to gentle.', 'text-dim');
    enemyTurn();
    updatePanels();
    return;
  }
  if (enemy.hp > Math.floor(enemy.maxHp * 0.6)) {
    print('It is too whole, too sure of itself - all teeth and certainty. Wear it down first.', 'text-dim');
    enemyTurn();
    updatePanels();
    return;
  }
  // Gentling is meant to be rare: your worst word against its wariness.
  const a = rng(1, 20), b = rng(1, 20);
  const you = Math.min(a, b) + statMod(GS.stats.cha);
  const it = rng(1, 20) + statMod(enemy.wis || 10);
  if (you >= it) {
    print('You keep your voice low and your hand slow. The thrashing gutters out by degrees. Under your palm its heart hammers - then merely beats. It looks at you. Something in it decides.', 'text-cyan');
    keepSays('The Keep registers a change of ownership it did not authorise. It is rereading the relevant clause.');
    gainSkillXP('beastmaster', 10);
    GS.companion = GS.currentEnemyId;
    GS.kills[GS.currentRoom + '_' + GS.currentEnemyId] = true;
    roomStates[GS.currentRoom].enemies = roomStates[GS.currentRoom].enemies.filter(id => id !== GS.currentEnemyId);
    logEvent('gentled the ' + enemy.name.toLowerCase(), 'discover');
    GS.inCombat = false;
    GS.currentEnemy = null;
    print('');
    print('The hound rises, shakes itself nose to tail, and falls in at your heel as though the matter is settled. It is settled.', 'text-amber');
    roomAftermath();
  } else {
    print('It bares its teeth at the kindness - not yet. Perhaps not ever. But it did not go for your throat, and that is something.', 'text-dim');
    enemyTurn();
    updatePanels();
  }
}

function doTackleCommand(args) {
  if (GS.inCombat) { doTackle(); return; }
  const rs = roomStates[GS.currentRoom];
  if (args && npcsPresent(GS.currentRoom).find(id => matchNpc(id, args))) { doAttack(args); return; }
  if (!rs.enemies.length) { print('Nothing here to tackle. The furniture forgives you.', 'text-dim'); return; }
  doAttack(args);
  if (GS.inCombat) doTackle();
}

function porterFlick() {
  print('');
  print('The Porter sets down the ledger. This is the first time you have seen it set down the ledger.', 'text-white');
  print('');
  print("'Noted,' it says, and raises one hand, and flicks - a small, tidy gesture, like shooing a moth.", 'text-white');
  print('');
  print('Your vision doubles. Your knees find the flagstones without consulting you. Something warm sheets down your face, your arms, out from under your fingernails - and you understand, distantly, that it is you, all of it, leaving from everywhere at once. You did not know you contained this much. The flagstones drink it without hurry, the way they have drunk everything, always.', 'text-red');
  print('');
  print('The last thing you see is the Porter producing a small white cloth and beginning, patiently, to polish the ledger.', 'text-white');
  print('');
  keepSays('Cause of death, for the record: discourtesy.');
  GS.perks.porterStruck = 0;
  playerDeath('the Porter');
}

// - Intents: the enemy telegraphs its next move, and reading it is the
// game. strike = normal blow (block halves, dodge may avoid). heavy =
// big telegraphed hit (BLOCK negates it and staggers them; dodging works
// too). guard = a set defence (attacks mostly bounce; FEINT breaks it).
// reckless = an opening (hit it hard). A staggered enemy loses its turn
// and takes worse from everything.
const DEFAULT_MOVES = [
  { type: 'strike', weight: 3, telegraph: 'It shifts its weight, watching for an opening.' },
  { type: 'heavy', weight: 1, telegraph: 'It gathers itself for one heavy blow.' },
];

function chooseEnemyMove(enemy) {
  const moves = enemy.moves || DEFAULT_MOVES;
  const total = moves.reduce((s, m) => s + m.weight, 0);
  let r = rng(1, total);
  for (const m of moves) {
    r -= m.weight;
    if (r <= 0) { enemy.nextMove = m; return; }
  }
  enemy.nextMove = moves[0];
}

function printIntent(enemy) {
  if (!enemy || enemy.hp <= 0 || !GS.inCombat) return;
  if ((enemy.staggerTurns || 0) > 0) {
    print('&#9656; It reels, guard in pieces - strike now.', 'combat-intent', 400);
    return;
  }
  print('&#9656; ' + enemy.nextMove.telegraph, 'combat-intent', 400);
}

function startCombat(enemyId) {
  endConversation(true); // violence outranks small talk
  GS.currentEnemyId = enemyId;
  GS.combatMemory = {};
  GS.momentum = 0;
  GS.counterReady = false;
  GS.reaction = null;
  GS.perks.firstStrikeDone = false;
  GS.perks.undeadHesitated = false;
  const template = ENEMIES[enemyId];
  GS.inCombat = true;
  GS.currentEnemy = { ...template, id: enemyId, hp: template.hp, staggerTurns: 0 };
  printLine();
  print('COMBAT: ' + template.name, 'text-red text-bold');
  print(template.desc, 'text-white');
  print('HP: ' + template.hp + '/' + template.maxHp + ' | ATK: ' + template.attack + ' | AC: ' + enemyAC(template), 'combat-info');
  print('');
  const styleHint = availableStyleVerbs().slice(0, 4).join(', ');
  print('Commands: attack (' + styleHint + '), block, dodge, feint, use [item], flee', 'text-dim');
  printLine();
  chooseEnemyMove(GS.currentEnemy);
  printIntent(GS.currentEnemy);
}

function handleCombatCommand(input) {
  const parts = input.split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1).join(' ');
  const enemy = GS.currentEnemy;

  if (cmd === 'throw' || cmd === 'hurl' || cmd === 'toss') {
    doThrow(args);
    return;
  }

  const atk = resolveAttackStyle(cmd, args);
  if (atk.isAttack) {
    if (atk.needsRanged) { print('You have nothing to shoot with. Equip a bow or crossbow first.', 'error-msg'); return; }
    if (atk.ranged) {
      const ammo = ITEMS[GS.equipped.weapon].requiresAmmo;
      if (ammo && !hasItem(ammo) && !isEquipped(ammo)) {
        print('You are out of ' + (ITEMS[ammo] ? ITEMS[ammo].name.toLowerCase() : ammo) + '. Nothing to loose.', 'error-msg');
        return;
      }
    }
    const isUnarmedVerb = !!atk.unarmed;
    const info = isUnarmedVerb ? weaponInfo(atk.verb) : weaponInfo(null);
    const slipLabel = atk.ranged ? 'shot' : atk.verb;

    // The mob reads repetition - the same move LANDING too many times
    // running gets learnt. Misses teach it nothing, and a slip resets the
    // lesson, so adaptation nudges variety instead of locking a verb out.
    // Different styles (slash vs stab vs punch) each track separately.
    GS.combatMemory = GS.combatMemory || {};
    const verbKey = atk.verb;
    for (const k of Object.keys(GS.combatMemory)) if (k !== verbKey) GS.combatMemory[k] = 0;
    const reps = GS.combatMemory[verbKey] || 0;

    // Devotion to a technique carves its own craft.
    if (isUnarmedVerb) {
      const bucket = (atk.verb === 'kick' || atk.verb === 'knee') ? 'kickCount' : 'punchCount';
      GS.perks[bucket] = (GS.perks[bucket] || 0) + 1;
      if (bucket === 'kickCount' && GS.perks.kickCount >= 8 && !GS.skills.boot_heel) gainSkillXP('boot_heel', 10);
      if (bucket === 'punchCount' && GS.perks.punchCount >= 8 && !GS.skills.pugilism) gainSkillXP('pugilism', 10);
    }

    if (reps >= 3 && rng(1, 100) <= Math.min(45, (reps - 2) * 15)) {
      print('The ' + enemy.name + ' has your rhythm now - it slips the ' + slipLabel + ' entirely. Vary your attacks.', 'text-amber');
      GS.combatMemory[verbKey] = 0;
      GS.perks.firstStrikeDone = true;
      enemyTurn();
      updatePanels();
      return;
    }

    // The situation is half the roll: pins, staggers, openings, and set
    // guards all move the odds - reading the telegraph pays here.
    const mv = enemy.nextMove || {};
    const staggered = (enemy.staggerTurns || 0) > 0;
    let situBonus = (enemy.pinnedTurns || 0) > 0 ? 4 : 0;
    if (staggered) situBonus += 4;
    if (!staggered && mv.type === 'reckless') situBonus += 3;
    if (!staggered && mv.type === 'guard') situBonus -= 4;

    // A successful dodge (or a read-through feint) loads a counter: your
    // next blow cannot miss and hits harder. Staggered foes give the same,
    // plus they lose their turn. Both are consumed here.
    const countering = !!GS.counterReady && !staggered;
    GS.counterReady = false;
    const guaranteed = staggered || countering;

    const roll = rng(1, 20);
    if (roll !== 20 && !guaranteed && roll + playerHitBonus(info) + situBonus + (atk.hitMod || 0) < enemyAC(enemy)) {
      if (atk.aim === 'head') {
        print('&rsaquo; You aim for the head and it moves - the shot goes wide of a hard target.', 'you-line you-miss');
      } else if (!staggered && mv.type === 'guard') {
        print('&rsaquo; Your blow meets the parry it was waiting for. (A feint would open that stance.)', 'you-line you-miss');
      } else {
        const missLines = [
          'Your ' + slipLabel + ' finds only the space it just left.',
          'It shifts - your blow skates wide.',
          'A miss, close enough to feel the heat of almost.',
        ];
        print('&rsaquo; ' + missLines[rng(0, missLines.length - 1)], 'you-line you-miss');
      }
      gainSkillXP(info.skill, 2); // a miss still teaches the hands something
      GS.momentum = 0;
      GS.perks.firstStrikeDone = true;
      enemyTurn();
      updatePanels();
      return;
    }

    let bonusDmg = 0;
    if (enemy.undead && GS.equipped.weapon) {
      const wpn = ITEMS[GS.equipped.weapon];
      if (wpn && wpn.undeadBonus) bonusDmg += wpn.undeadBonus;
    }
    if (enemy.undead && GS.class === 'cleric') bonusDmg += 3; // radiant edge

    let dmg = info.base + statMod(GS.stats[info.stat]) + Math.floor(skillLv(info.skill) / 4)
      + bonusDmg + (GS.perks.flatDamage || 0) + (GS.perks.reaverStacks || 0) + GS.tempAttackBonus + rng(0, 2)
      + Math.min(3, GS.momentum);
    if (!staggered && mv.type === 'reckless') dmg += 2;

    // Style vs body: aim multiplier, then the enemy's resistance to this
    // kind of hurt. Noted once per kind per enemy, so it teaches without nagging.
    if (atk.dmgMult) dmg *= atk.dmgMult;
    const prof = (enemy.damageProfile && enemy.damageProfile[atk.kind]) || 1;
    dmg *= prof;
    dmg = Math.max(1, Math.round(dmg));
    if (prof <= 0.7 || prof >= 1.3) {
      enemy.kindNoted = enemy.kindNoted || {};
      if (!enemy.kindNoted[atk.kind]) {
        enemy.kindNoted[atk.kind] = true;
        if (prof <= 0.7) print('The ' + KIND_WORD[atk.kind] + ' finds little purchase - this one is armoured against it.', 'text-amber');
        else print('The ' + KIND_WORD[atk.kind] + ' bites deep - it has no answer for that.', 'text-cyan');
      }
    }
    GS.combatMemory[verbKey] = reps + 1;

    if (enemy.physicalResist && !(GS.equipped.weapon && ITEMS[GS.equipped.weapon] && ITEMS[GS.equipped.weapon].undeadBonus)) {
      dmg = Math.max(1, Math.floor(dmg / 3));
      print('Your weapon passes through it with little purchase - it wants silver.', 'text-amber');
    }
    if (enemy.shadowBeing && !hasItem('amulet_of_warding') && !isEquipped('amulet_of_warding')) {
      dmg = Math.max(1, Math.floor(dmg / 2));
      print('Shadow drinks half the force of the blow - you need warding.', 'text-amber');
    }
    if (staggered) { dmg = Math.floor(dmg * 1.5); print('&rsaquo; It cannot answer - you strike at your leisure.', 'text-cyan'); }
    else if (countering) { dmg = Math.floor(dmg * 1.5); print('&rsaquo; The opening your read bought - your counter lands clean and hard.', 'text-cyan'); }
    if (roll === 20) { dmg *= 2; print('&rsaquo; A perfect opening - critical hit, double damage.', 'text-cyan'); }
    if (GS.class === 'rogue' && !GS.perks.firstStrikeDone) {
      dmg *= 2;
      print("Opening strike - you were already where the guard wasn't.", 'text-cyan');
    }
    GS.perks.firstStrikeDone = true;
    enemy.hp -= dmg;
    GS.momentum++;
    if (GS.momentum === 3) print('You have its rhythm - your blows land heavier while the streak holds.', 'text-cyan');
    if (GS.companion === 'feral_hound' && enemy.hp > 0 && rng(1, 5) === 1) {
      enemy.hp -= 3;
      print('The hound darts in low and worries at it. (+3 damage)', 'text-cyan');
    }
    const flav = (atk.aim === 'head' || atk.aim === 'legs')
      ? aimedShotLine(atk.aim, enemy, dmg)
      : attackFlavourLine(atk.group, enemy, dmg);
    print('&rsaquo; ' + flav, 'you-line');
    gainSkillXP(info.skill, 5);
    maybeStageLine(enemy);

    if (enemy.hp <= 0) {
      endCombat(true);
      return;
    }

    // Aimed at the legs: cripple a flesh-and-blood foe once, costing it its
    // next move. After that it shields the wound - no endless leg-lock.
    if (atk.aim === 'legs') {
      if (enemy.canHobble && !enemy.legWounded) {
        enemy.legWounded = true;
        enemy.hobbled = 1;
        print('The bolt punches through its leg - it buckles, and whatever it meant to do next collapses under it.', 'text-cyan');
      } else if (enemy.canHobble) {
        print('It is already favouring that leg and shields the wound now - no second gift.', 'text-dim');
      } else {
        print('There is nothing there to lame - it has no legs to speak of.', 'text-dim');
      }
    }

    if (enemy.regenerates && enemy.shadowBeing && !isEquipped('amulet_of_warding')) {
      const regen = 8;
      enemy.hp = Math.min(enemy.maxHp, enemy.hp + regen);
      print('The ' + enemy.name + ' regenerates ' + regen + ' HP from the surrounding darkness!', 'text-amber');
    }

    print(enemy.name + ' HP: ' + enemy.hp + '/' + enemy.maxHp, 'combat-info');
    enemyTurn();

  } else if (cmd === 'use') {
    const itemIdx = GS.inventory.findIndex(id => matchItem(id, args));
    if (itemIdx === -1) { print("You don't have that.", 'error-msg'); return; }
    const itemId = GS.inventory[itemIdx];
    const item = ITEMS[itemId];

    if (itemId === 'holy_water' && enemy.undead) {
      GS.inventory.splice(itemIdx, 1);
      const dmg = item.damage || 30;
      enemy.hp -= dmg;
      print('You hurl the holy water! It burns the ' + enemy.name + ' for ' + dmg + ' damage!', 'combat-hit');
      if (enemy.hp <= 0) { endCombat(true); return; }
      print(enemy.name + ' HP: ' + enemy.hp + '/' + enemy.maxHp, 'combat-info');
    } else if (itemId === 'crude_bomb') {
      GS.inventory.splice(itemIdx, 1);
      let dmg = (item.damage || 25) + rng(0, 10);
      if (GS.class === 'sapper') dmg = Math.floor(dmg * 1.5); // good wadding
      enemy.hp -= dmg;
      print('You hurl the crude bomb! The blast tears through the ' + enemy.name + ' - and a fair amount of masonry. (' + dmg + ' damage)', 'combat-hit');
      gainSkillXP('demolitions', 20);
      if (enemy.hp <= 0) { endCombat(true); return; }
      print(enemy.name + ' HP: ' + enemy.hp + '/' + enemy.maxHp, 'combat-info');
    } else if (item.healing) {
      GS.inventory.splice(itemIdx, 1);
      GS.hp = Math.min(GS.maxHp, GS.hp + item.healing);
      print('You consume the ' + item.name + '. (+' + item.healing + ' HP)', 'combat-heal');
    } else if (item.tempAttack) {
      GS.inventory.splice(itemIdx, 1);
      GS.tempAttackBonus = item.tempAttack;
      GS.tempAttackTurns = item.duration || 3;
      print('You drink the ' + item.name + '! (+' + item.tempAttack + ' ATK)', 'text-amber');
    } else {
      print("You can't use that effectively in combat.", 'error-msg');
      return;
    }
    enemyTurn();

  } else if (cmd === 'cast') {
    if (!GS.spells.includes(args || 'sunder')) {
      print("You don't know that spell.", 'error-msg');
      return;
    }
    if ((args || 'sunder') === 'sunder') {
      if (enemy.shadowBeing || enemy.undead) {
        let dmg = 25 + rng(0, 10);
        if (GS.class === 'wizard') dmg = Math.floor(dmg * 1.5); // arcane edge
        enemy.hp -= dmg;
        print('You speak the Word of Sundering! Reality ripples and the ' + enemy.name + '\'s form tears apart! (' + dmg + ' damage)', 'text-cyan');
        if (enemy.hp <= 0) { endCombat(true); return; }
        print(enemy.name + ' HP: ' + enemy.hp + '/' + enemy.maxHp, 'combat-info');
      } else {
        print('The Word of Sundering washes over the ' + enemy.name + ' with no effect. It only works on shadow and undead.', 'text-dim');
      }
      enemyTurn();
    }

  } else if (cmd === 'block' || cmd === 'brace' || cmd === 'parry' || cmd === 'guard') {
    doBlock(); return;
  } else if (cmd === 'dodge' || cmd === 'duck' || cmd === 'evade' || cmd === 'sidestep') {
    doDodge(); return;
  } else if (cmd === 'feint') {
    doFeint(); return;
  } else if (cmd === 'tackle' || cmd === 'grapple' || cmd === 'pin') {
    doTackle(); return;
  } else if (cmd === 'soothe' || cmd === 'calm' || cmd === 'comfort' || cmd === 'tame') {
    doSoothe(); return;
  } else if (cmd === 'rally') {
    doRally(); return;
  } else if (cmd === 'pray') {
    doPray(); return;
  } else if (cmd === 'invoke') {
    doInvokeToll(); return;
  } else if (cmd === 'flee' || cmd === 'run') {
    doFlee();

  } else if (cmd === 'look' || cmd === 'l') {
    print(enemy.name + ' - HP: ' + enemy.hp + '/' + enemy.maxHp, 'combat-info');
    print('Your HP: ' + GS.hp + '/' + GS.maxHp, 'combat-info');
    printIntent(enemy);

  } else {
    print("In combat: attack, block, dodge, feint, tackle, use [item], cast [spell], flee, look", 'text-dim');
  }

  updatePanels();
}

// - Reactions: spend your turn answering the telegraph instead of hitting -
function reactionSkill() { return weaponInfo(GS.equipped.weapon ? null : 'punch').skill; }

function doBlock() {
  if (!GS.inCombat || !GS.currentEnemy) { print('You raise your guard against the empty air. The air, wisely, backs off.', 'text-dim'); return; }
  print('&rsaquo; You plant your feet and set your guard.', 'you-line');
  GS.reaction = 'block';
  gainSkillXP(reactionSkill(), 2);
  enemyTurn();
  updatePanels();
}

function doDodge() {
  if (!GS.inCombat || !GS.currentEnemy) { print('You weave smartly away from nothing at all. The Keep declines to comment.', 'text-dim'); return; }
  print('&rsaquo; You stay light on your feet, ready to move.', 'you-line');
  GS.reaction = 'dodge';
  gainSkillXP(reactionSkill(), 2);
  enemyTurn();
  updatePanels();
}

function doFeint() {
  if (!GS.inCombat || !GS.currentEnemy) { print('You feint at the shadows. Somewhere, the shadows take notes.', 'text-dim'); return; }
  print('&rsaquo; You sell a strike you never mean to finish.', 'you-line');
  GS.reaction = 'feint';
  GS.combatMemory = {}; // breaking your own pattern resets what it has learnt
  gainSkillXP(reactionSkill(), 2);
  enemyTurn();
  updatePanels();
}

function enemyTurn() {
  const enemy = GS.currentEnemy;
  if (!enemy) return;
  const reaction = GS.reaction;
  GS.reaction = null;
  enemyAct(enemy, reaction);
  if (!GS.inCombat || !GS.currentEnemy || GS.awaitingDeath || enemy.hp <= 0) return;
  chooseEnemyMove(enemy);
  printIntent(enemy);
}

function enemyAct(enemy, reaction) {
  if (GS.class === 'grave_speaker' && enemy.undead && !GS.perks.undeadHesitated) {
    GS.perks.undeadHesitated = true;
    print('The ' + enemy.name + ' hesitates. The dead do not strike a Speaker first.', 'text-cyan');
    return;
  }

  // Blood Roar: at a quarter health, the ancestors answer. (Orc)
  if (GS.hp > 0 && GS.race === 'orc' && GS.hp <= Math.floor(GS.maxHp * 0.25) && !GS.perks.roarUsed) {
    GS.perks.roarUsed = true;
    GS.tempAttackBonus += 4;
    GS.tempAttackTurns = Math.max(GS.tempAttackTurns, 3);
    print('Your ancestors ROAR in the blood. Your next blows carry all of them. (+4 damage, 3 turns)', 'text-red');
  }

  if (enemy.pinnedTurns && enemy.pinnedTurns > 0) {
    enemy.pinnedTurns--;
    print('Pinned, the ' + enemy.name + ' thrashes under your weight' + (enemy.pinnedTurns > 0 ? '.' : ' - and is working itself loose.'), 'text-amber');
    return;
  }

  if ((enemy.hobbled || 0) > 0) {
    enemy.hobbled--;
    print('The ' + enemy.name + ' scrabbles for footing on its ruined leg - whatever it meant to do dies there.', 'text-amber');
    return;
  }

  if ((enemy.staggerTurns || 0) > 0) {
    enemy.staggerTurns--;
    print('The ' + enemy.name + ' flounders, fighting to recover its footing.', 'text-amber');
    return;
  }

  const mv = enemy.nextMove || { type: 'strike' };
  const atkLine = enemyAttackLine(enemy, mv.type);

  if (mv.type === 'guard') {
    if (reaction === 'feint') {
      enemy.staggerTurns = 1;
      print('It commits everything to the parry that never comes - and overbalances, wide open.', 'text-cyan');
    } else {
      print('It holds behind its guard, giving nothing away.', 'text-dim');
    }
    return;
  }

  // An attack is coming: strike, heavy, or reckless.
  const heavy = mv.type === 'heavy';
  const reckless = mv.type === 'reckless';

  // Underfoot Luck: one blow in ten parts the air instead. (Halfling)
  if (GS.race === 'halfling' && rng(1, 10) === 1) {
    print(atkLine, 'combat-hit');
    print('The blow parts the air where you almost were. Underfoot luck.', 'text-cyan');
    return;
  }

  if (reaction === 'block' && heavy) {
    enemy.staggerTurns = 1;
    print(atkLine, 'combat-hit');
    print('You take the whole weight of it on your set guard - the shock rings up your arms, and the follow-through drags it off balance.', 'text-cyan');
    return;
  }

  if (reaction === 'dodge') {
    const dc = heavy ? 9 : 11; // the big ones announce themselves; DEX sways it
    if (rng(1, 20) + statMod(GS.stats.dex) >= dc) {
      print(atkLine, 'combat-hit');
      if (heavy) {
        enemy.staggerTurns = 1;
        print('You slip inside the arc - it hammers the stone where you stood, wide open. Strike now.', 'text-cyan');
      } else {
        GS.counterReady = true;
        print('You slip it clean, and the whiff leaves it turned the wrong way - your next blow will find the gap.', 'text-cyan');
      }
      return;
    }
    print('You guess wrong and move into it.', 'text-red');
  }

  const roll = rng(1, 20);
  const hitMod = heavy ? -2 : (reckless ? 2 : 0);
  if (roll !== 20 && roll + enemyHitBonus(enemy) + hitMod < playerAC()) {
    print(atkLine, 'combat-hit');
    print('It misses - your guard holds.', 'text-dim');
    return;
  }
  let enemyDmg = Math.max(1, (enemy.attack || 3) + rng(-2, 2));
  if (heavy) enemyDmg = Math.floor(enemyDmg * 1.8);
  if (reckless) enemyDmg += 2;
  if (reaction === 'block') enemyDmg = Math.max(1, Math.floor(enemyDmg / 2));
  if (roll === 20) enemyDmg = Math.floor(enemyDmg * 1.5);
  GS.hp -= enemyDmg;
  GS.momentum = 0;
  const suffix = reaction === 'block' ? ' Your guard takes the worst of it.' : (roll === 20 ? ' It found the gap.' : '');
  print(atkLine + ' (' + enemyDmg + ' damage' + (heavy ? ' - a heavy blow' : '') + ')' + suffix, 'combat-hit');
  print('', '', 300);

  if (reaction === 'feint') {
    GS.counterReady = true;
    print('It bought none of your feint - but you sold it the wrong tempo, and your next blow will find the gap.', 'text-dim');
  }

  if (enemy.poisonous && !GS.poisoned && rng(1, 3) === 1) {
    GS.poisoned = true;
    GS.poisonTurns = 5;
    print('You have been poisoned!', 'text-red');
  }

  if (GS.hp <= 0) {
    playerDeath(enemy.name);
  }
}

function endCombat(victory) {
  if (victory && GS.class === 'reaver') {
    GS.perks.reaverStacks = Math.min(5, (GS.perks.reaverStacks || 0) + 1);
    print('You take something from the fallen - a sliver of what it was. (+' + GS.perks.reaverStacks + ' ATK until you rest)', 'text-cyan');
  }
  const enemy = GS.currentEnemy;
  if (victory) {
    printLine();
    print(enemy.defeatMsg, 'success-msg');
    print('+' + enemy.xp + ' XP', 'text-cyan');
    GS.xp += enemy.xp;
    if (enemy.gold > 0) {
      GS.gold += enemy.gold;
      print('+' + enemy.gold + ' gold', 'text-amber');
    }
    if (enemy.loot) {
      GS.inventory.push(enemy.loot);
      GS.itemsFound++;
      print('Obtained: ' + ITEMS[enemy.loot].name, 'text-amber');
    }
    GS.kills[GS.currentRoom + '_' + enemy.id] = true;
    roomStates[GS.currentRoom].enemies = roomStates[GS.currentRoom].enemies.filter(e => e !== enemy.id);
    if (!GS.kills[enemy.id]) GS.kills[enemy.id] = 0;
    GS.kills[enemy.id]++;
    printLine();
    checkLevelUp();
  updatePanels();
  if (victory) roomAftermath();

    if (enemy.boss && enemy.id === 'shadow_lord') {
      handleShadowLordDefeat();
    }
  }
  GS.inCombat = false;
  GS.currentEnemy = null;
}
// When the last threat in a room falls, the room exhales.
function roomAftermath() {
  const room = ROOMS[GS.currentRoom];
  const rs = roomStates[GS.currentRoom];
  const living = rs.enemies.filter(id => ENEMIES[id]);
  if (living.length > 0) return;
  print('', '', 600);
  if (room.aftermath) {
    streamProse(room.aftermath, 'text-amber', 130, 700);
  }
  const exits = getExits(GS.currentRoom);
  const names = Object.keys(exits);
  if (names.length > 0) {
    print('Exits: ' + names.map(e => '<span>' + e + '</span>').join(', '), 'room-exits');
  }
  updatePanels();
}


function doFlee() {
  if (!GS.inCombat) { print("You're not in combat.", 'text-dim'); return; }
  if (GS.currentEnemy && GS.currentEnemy.boss) {
    print('You cannot flee from this battle!', 'error-msg');
    enemyTurn();
    return;
  }
  if (rng(1, 3) <= 2) {
    print('You disengage, giving ground until it stops pressing.', 'text-amber');
    GS.inCombat = false;
    GS.currentEnemy = null;
    const back = GS.enteredFrom[GS.currentRoom];
    print('Exits available: ' + (back ? back : 'the way you came') + '.', 'room-exits');
    updatePanels();
  } else {
    print('It cuts off your retreat!', 'error-msg');
    enemyTurn();
  }
}


const DEATH_TOLL_LINES = [
  'The rat, it should be said, was also having a bad day.',
  'It will be spent on upkeep. The Keep always says that.',
  'Consider it rent, paid in arrears.',
  'The Keep files it under: tuition.',
  'Somewhere below, something smiled.',
];

function playerDeath(cause) {
  // Fiend's Bargain: once per life, the blood refuses. (Tiefling)
  if (GS.race === 'tiefling' && !GS.perks.bargainUsed) {
    GS.perks.bargainUsed = true;
    GS.hp = 1;
    GS.poisoned = false;
    GS.poisonTurns = 0;
    print('');
    print('Your heart stops. Something older than your heart declines to accept this.', 'text-red');
    keepSays("Something in your blood pays the difference. It does not say what it bought.");
    return;
  }

  GS.inCombat = false;
  GS.currentEnemy = null;
  GS.conversationWith = null;
  GS.deaths++;
  META.totalDeaths++;
  if (META.totalDeaths >= 5 && !META.unlocks.vesseling) {
    META.unlocks.vesseling = true;
    print('');
    keepSays('Five times, now. The Keep has decided you understand emptiness well enough to be born to it.');
    keepSays('New blood available at the gate: VESSELING.');
  }
  saveMeta();
  printLine();
  print('', '');
  print('  Y O U   H A V E   D I E D', 'combat-death');
  print('', '');
  if (cause === 'poison') {
    print('  The poison claimed you at last.', 'text-red');
  } else {
    print('  Slain by: ' + cause, 'text-red');
  }
  print('', '');
  keepSays('The Keep accepts your offering.');
  // Death toll, tier 1: gold. Deeper tiers arrive with deeper floors.
  if (GS.gold > 0) {
    let taken = Math.min(GS.gold, 5 + Math.floor(GS.gold * 0.3));
    if (GS.class === 'tollwright') taken = Math.floor(taken / 2); // adjusted terms
    GS.gold -= taken;
    keepSays('Taken: ' + taken + ' gold. ' + pick(DEATH_TOLL_LINES));
  } else {
    keepSays('You had nothing worth taking. The Keep finds this almost admirable.');
  }
  GS.hp = GS.maxHp;
  GS.poisoned = false;
  GS.poisonTurns = 0;
  GS.tempAttackBonus = 0;
  GS.tempAttackTurns = 0;
  logEvent('died: ' + cause, 'death');
  GS.awaitingDeath = true;
  print('');
  print("(Type 'wake' to rise, or 'quit' to return to the gate.)", 'text-amber');
}

function respawnFromDeath() {
  GS.awaitingDeath = false;
  const home = GS.lastHearth || 'main_courtyard';
  GS.currentRoom = home;
  print('');
  if (GS.lastHearth) {
    print('Warmth first. Then the ache. You come back to yourself beside the embers, patted into shape by the heat - lighter than you were, and aware of the gap without being able to name what filled it.', 'text-amber');
  } else {
    print('Cold flagstones again. You come back to yourself where the Keep first learnt your shape - lighter than you were, and aware of the gap without being able to name what filled it.', 'text-amber');
  }
  print('');
  printRoom(home);
  updatePanels();
}

function checkLevelUp() {
  while (GS.xp >= GS.xpToLevel) {
    GS.xp -= GS.xpToLevel;
    GS.level++;
    GS.maxHp += 15;
    GS.hp = GS.maxHp;
    GS.attack += 1;
    GS.defense += 1;
    GS.xpToLevel = Math.floor(GS.xpToLevel * 1.45);
    print('LEVEL UP! You are now level ' + GS.level + '!', 'text-bright');
    logEvent('reached level ' + GS.level, 'discover');
    print('  HP: ' + GS.maxHp + ' | ATK: ' + GS.attack + ' | DEF: ' + GS.defense, 'text-cyan');
  }
  announceCrystallization();
}

// === SPELLS ===

function doCast(args) {
  if (!args) { print('Cast what? Known spells: ' + (GS.spells.length > 0 ? GS.spells.join(', ') : 'none'), 'error-msg'); return; }
  if (!GS.spells.includes(args)) {
    print("You don't know that spell.", 'error-msg');
    return;
  }
  if (args === 'sunder') {
    if (GS.inCombat) return;
    print('You speak the Word of Sundering. A ripple of force expands outward, disrupting shadow constructs.', 'text-cyan');
    const rs = roomStates[GS.currentRoom];
    if (rs.enemies.length > 0) {
      const enemy = ENEMIES[rs.enemies[0]];
      if (enemy && (enemy.shadowBeing || enemy.undead)) {
        print('The ' + enemy.name + ' shudders as the word tears at its essence!', 'text-amber');
        startCombat(rs.enemies[0]);
        GS.currentEnemy.hp -= (GS.class === 'wizard' ? 37 : 25);
        print('The Word of Sundering dealt ' + (GS.class === 'wizard' ? 37 : 25) + ' damage!', 'combat-hit');
        if (GS.currentEnemy.hp <= 0) { endCombat(true); }
      }
    }
  }
}

