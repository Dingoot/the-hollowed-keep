// === SKILL SYSTEM ===
// Use-based XP, carve-on-first-use, levels 1-50.

function statMod(v) { return Math.floor((v - 10) / 2); }

function skillXpCost(level) {
  return Math.floor(SKILL_XP.baseCost * Math.pow(level, SKILL_XP.exponent));
}

// XP rate multiplier from race + remnant.
function skillXpRate(skillId) {
  let rate = 1.0;
  const race = RACES[GS.race];
  if (race) {
    rate += race.xpAll || 0;
    rate += (race.affinities && race.affinities[skillId]) || 0;
  }
  const rem = REMNANTS[GS.remnant];
  if (rem && rem.affinities && rem.affinities[skillId]) {
    rate += rem.affinities[skillId];
  }
  return Math.max(0.25, rate);
}

function gainSkillXP(skillId, amount) {
  const def = SKILLS[skillId];
  if (!def) return;

  if (!GS.skills[skillId]) {
    GS.skills[skillId] = { level: 1, xp: 0 };
    print('');
    keepSays('Skill carved: ' + def.name.toUpperCase() + ' — ' + def.carve);
  }

  const s = GS.skills[skillId];
  if (s.level >= SKILL_XP.maxLevel) return;

  s.xp += Math.round(amount * skillXpRate(skillId));

  while (s.level < SKILL_XP.maxLevel && s.xp >= skillXpCost(s.level)) {
    s.xp -= skillXpCost(s.level);
    s.level++;
    keepSays(def.name.toUpperCase() + ' is now ' + s.level + '.');
    if (s.level % 10 === 0) {
      // Technique unlocks land on the tens. Placeholder line until each
      // skill's technique table is designed (see docs/character-systems.md).
      keepSays('Something new settles into your hands.');
    }
  }
  updatePanels();
}

// The skill fed by your currently equipped weapon.
function equippedWeaponSkill() {
  const w = GS.equipped.weapon;
  if (!w) return 'unarmed';
  return ITEMS[w].family || 'unarmed';
}

// === COMMANDS ===

function doSkillsCmd() {
  const ids = Object.keys(GS.skills);
  if (ids.length === 0) {
    print('Your hands remember nothing yet.', 'text-dim');
    print('They will. Skills are carved by doing, not choosing.', 'text-dim');
    return;
  }
  print('=== WHAT THE HOLLOW HOLDS ===', 'text-amber');
  const byFamily = {};
  for (const id of ids) {
    const fam = SKILLS[id].family;
    (byFamily[fam] = byFamily[fam] || []).push(id);
  }
  for (const fam of Object.keys(byFamily)) {
    print('');
    print('  ' + fam.toUpperCase(), 'text-dim');
    for (const id of byFamily[fam]) {
      const s = GS.skills[id];
      const pct = Math.floor((s.xp / skillXpCost(s.level)) * 100);
      print('    ' + SKILLS[id].name + '  ' + s.level +
        (s.level >= SKILL_XP.maxLevel ? '  (mastered)' : '  (' + pct + '% to next)'), 'text-white');
    }
  }
}

function doStatsCmd() {
  const st = GS.stats;
  const race = RACES[GS.race];
  const rem = REMNANTS[GS.remnant];
  print('=== THE VESSEL ===', 'text-amber');
  print('  Blood: ' + (race ? race.name : 'Unremembered'), 'text-white');
  if (GS.race === 'vesseling') {
    print('  Remnant: none. The Toll found nothing to miss.', 'text-dim');
  } else if (rem) {
    print('  Remnant: ' + rem.name, 'text-white');
    print('           "' + rem.whisper + '"', 'text-dim');
  }
  print('');
  print('  STR ' + st.str + '   DEX ' + st.dex + '   CON ' + st.con, 'text-white');
  print('  INT ' + st.int + '   WIS ' + st.wis + '   CHA ' + st.cha, 'text-white');
  print('  HOLLOW ' + st.hollow, st.hollow > 0 ? 'keep-voice' : 'text-dim');
  print('');
  print('  Level ' + GS.level + '  ·  HP ' + GS.hp + '/' + GS.maxHp +
    '  ·  ATK ' + getAttack() + '  ·  DEF ' + getDefense(), 'text-white');
}

// === SKILLS PANEL ===

function updateSkills() {
  const el = document.getElementById('skills-content');
  if (!el) return;
  const ids = Object.keys(GS.skills);
  if (ids.length === 0) {
    el.innerHTML = '<div class="empty-note">Nothing carved yet.</div>';
    return;
  }
  el.innerHTML = ids
    .sort((a, b) => GS.skills[b].level - GS.skills[a].level)
    .map(id => {
      const s = GS.skills[id];
      const pct = Math.min(100, Math.floor((s.xp / skillXpCost(s.level)) * 100));
      return '<div class="stat-line"><span class="stat-label">' + SKILLS[id].name +
        '</span><span class="stat-value">' + s.level + '</span></div>' +
        '<div class="xp-bar"><div class="xp-bar-fill" style="width:' + pct + '%"></div></div>';
    })
    .join('');
}
