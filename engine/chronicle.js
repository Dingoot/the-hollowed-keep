// === CHRONICLE SYSTEM ===
// Real events only. Your deeds, and - as the systems earn it - the deeds
// of NPCs living their own lives. The simulated-player arrays in
// data/chronicle.js are kept as a dormant template for the multiplayer era.

function initChronicle() {
  if (!GS.chronicleLog) GS.chronicleLog = [];
  renderChronicle();
  renderRuneWall();
}

// Log a real deed. type: 'discover' | 'death' | 'skill' | 'quest' | 'active'
function logEvent(action, type) {
  if (!GS.chronicleLog) GS.chronicleLog = [];
  GS.chronicleLog.push({ action, type, turn: GS.turnCount });
  if (GS.chronicleLog.length > 30) GS.chronicleLog.shift();
  renderChronicle();
}

function renderChronicle() {
  const el = document.getElementById('chronicle-content');
  if (!el) return;
  const log = GS.chronicleLog || [];
  if (log.length === 0) {
    el.innerHTML = '<div class="empty-note">Your deeds will be recorded here. The Keep keeps records of everything.</div>';
    return;
  }
  el.innerHTML = log.slice(-12).reverse().map(e => {
    const typeClass = e.type === 'death' ? 'chronicle-death' : e.type === 'discover' ? 'chronicle-discover' : '';
    return `<div class="chronicle-entry">
      <span class="chronicle-name">You</span>
      <span class="chronicle-action ${typeClass}"> ${e.action}</span>
      <span class="chronicle-time">t${e.turn}</span>
    </div>`;
  }).join('');
}

function renderRuneWall() {
  const el = document.getElementById('runewall-content');
  if (!el) return;
  const messages = GS.runeMessages || [];
  el.innerHTML = messages.slice(-8).map(m =>
    `<div class="rune-entry">"${m.text}" <span class="rune-author">- ${m.author}</span></div>`
  ).join('');
}


