// === CHRONICLE SYSTEM ===
// Real events only. Your deeds, and - as the systems earn it - the deeds
// of NPCs living their own lives. The simulated-player arrays in
// data/chronicle.js are kept as a dormant template for the multiplayer era.

function initChronicle() {
  if (!GS.chronicleLog) GS.chronicleLog = [];
  renderChronicle();
  renderRuneWall();
  renderServer();
}

// Log a real deed. type: 'discover' | 'death' | 'skill' | 'quest' | 'active'
function logEvent(action, type) {
  if (!GS.chronicleLog) GS.chronicleLog = [];
  GS.chronicleLog.push({ action, type, turn: GS.turnCount });
  if (GS.chronicleLog.length > 30) GS.chronicleLog.shift();
  renderChronicle();
  renderServer();
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
  // One seeded message, placed with intent: the Porter leaves word for
  // every new arrival. Everything else is carved by players.
  const messages = [
    { text: "New arrival: when your legs remember themselves, come south to the gatehouse. Orientation is part of the service.", author: "The Porter" },
  ];
  const saved = JSON.parse(localStorage.getItem('hollowkeep_runes') || '[]');
  for (const msg of saved) messages.push(msg);
  el.innerHTML = messages.slice(-8).map(m =>
    `<div class="rune-entry">"${m.text}" <span class="rune-author">- ${m.author}</span></div>`
  ).join('');
}

function renderServer() {
  const el = document.getElementById('server-content');
  if (!el) return;
  el.innerHTML = `
    <div class="server-stat"><span>Turns</span><span class="server-value">${GS.turnCount}</span></div>
    <div class="server-stat"><span>Deaths</span><span class="server-value">${GS.deaths}</span></div>
    <div class="server-stat"><span>Hearths lit</span><span class="server-value">${(GS.litHearths || []).length}</span></div>
    <div class="server-stat"><span>Rooms</span><span class="server-value">${GS.roomsDiscovered}/${Object.keys(ROOMS).length}</span></div>
    <div class="server-stat"><span>Version</span><span class="server-value">3.0</span></div>
  `;
}
