// === CHRONICLE SYSTEM ===

let chronicleTimer = null;
let chronicleEntries = [];

function initChronicle() {
  chronicleEntries = [];
  for (let i = 0; i < 6; i++) {
    addChronicleEntry();
  }
  renderChronicle();
  renderRuneWall();
  renderServer();
  chronicleTimer = setInterval(() => {
    addChronicleEntry();
    if (chronicleEntries.length > 10) chronicleEntries.shift();
    renderChronicle();
    renderServer();
  }, rng(15000, 45000));
}

function addChronicleEntry() {
  const name = pick(ADVENTURER_NAMES);
  const event = pick(CHRONICLE_EVENTS);
  const minutesAgo = rng(1, 120);
  const timeStr = minutesAgo < 2 ? 'just now' : minutesAgo < 60 ? minutesAgo + 'm ago' : Math.floor(minutesAgo / 60) + 'h ago';
  chronicleEntries.push({ name, ...event, time: timeStr });
}

function renderChronicle() {
  const el = document.getElementById('chronicle-content');
  el.innerHTML = chronicleEntries.slice().reverse().map(e => {
    const typeClass = e.type === 'death' ? 'chronicle-death' : e.type === 'discover' ? 'chronicle-discover' : '';
    return `<div class="chronicle-entry">
      <span class="chronicle-name">${e.name}</span>
      <span class="chronicle-action ${typeClass}"> ${e.action}</span>
      <span class="chronicle-time">${e.time}</span>
    </div>`;
  }).join('');
}

function renderRuneWall() {
  const el = document.getElementById('runewall-content');
  const allMessages = [...RUNE_WALL_MESSAGES];
  const saved = JSON.parse(localStorage.getItem('hollowkeep_runes') || '[]');
  for (const msg of saved) allMessages.push(msg);
  const shuffled = allMessages.sort(() => Math.random() - 0.5).slice(0, 8);
  el.innerHTML = shuffled.map(m =>
    `<div class="rune-entry">"${m.text}" <span class="rune-author">— ${m.author}</span></div>`
  ).join('');
}

function renderServer() {
  const el = document.getElementById('server-content');
  const uptime = 1247 + Math.floor((Date.now() % 86400000) / 3600000);
  const online = rng(3, 14);
  const deaths = rng(12, 47);
  el.innerHTML = `
    <div class="server-stat"><span>Uptime</span><span class="server-value">${uptime}d</span></div>
    <div class="server-stat"><span>Online</span><span class="server-value">${online}</span></div>
    <div class="server-stat"><span>Deaths today</span><span class="server-value">${deaths}</span></div>
    <div class="server-stat"><span>World resets</span><span class="server-value">0</span></div>
    <div class="server-stat"><span>Version</span><span class="server-value">2.17</span></div>
  `;
}

