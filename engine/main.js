// === BOOT SEQUENCE ===

function runBootSequence() {
  const bootEl = document.getElementById('boot-text');
  const lines = [
    { text: '', cls: '', delay: 200 },
    { text: '', cls: '', delay: 100 },
    { text: 'T H E   H O L L O W E D   K E E P', cls: 'line-bright line-center', delay: 500 },
    { text: 'a text adventure', cls: 'line-dim line-center', delay: 300 },
    { text: '', cls: '', delay: 200 },
    { text: '─'.repeat(44), cls: 'line-amber line-center', delay: 200 },
    { text: '', cls: '', delay: 150 },
    { text: 'Every door demands a toll.', cls: 'line-keep line-center', delay: 500 },
    { text: '', cls: '', delay: 300 },
    { text: 'begin  ·  pay the Toll and enter', cls: 'line-white line-center', delay: 200 },
    { text: 'load   ·  resume a delve', cls: 'line-white line-center', delay: 150 },
    { text: 'lore   ·  what little is known', cls: 'line-white line-center', delay: 150 },
    { text: '', cls: '', delay: 200 },
  ];


  let totalDelay = 0;
  for (const line of lines) {
    totalDelay += line.delay;
    setTimeout(() => {
      if (line.pre) {
        const pre = document.createElement('pre');
        pre.className = 'line ' + line.cls;
        pre.textContent = line.text;
        pre.style.fontSize = '0.5rem';
        pre.style.lineHeight = '1.1';
        bootEl.appendChild(pre);
      } else {
        const div = document.createElement('div');
        div.className = 'line ' + line.cls;
        div.textContent = line.text;
        bootEl.appendChild(div);
      }
      bootEl.scrollTop = bootEl.scrollHeight;
    }, totalDelay);
  }

  setTimeout(() => {
    const prompt = document.getElementById('boot-prompt');
    prompt.classList.remove('hidden');
    const bootInput = document.getElementById('boot-input');
    bootInput.focus();
    bootInput.addEventListener('keydown', handleBootInput);
  }, totalDelay + 300);
}

function handleBootInput(e) {
  if (e.key !== 'Enter') return;
  const input = e.target.value.trim().toLowerCase();
  e.target.value = '';

  if (CREATION.stage) {
    handleCreationInput(input);
    return;
  }

  if (input === 'begin' || input === 'start' || input === 'play' || input === 'enter') {
    startCreation();
  } else if (input === 'load' || input === 'restore') {
    startGame(true);
  } else if (input === 'lore' || input === 'history') {
    const bootEl = document.getElementById('boot-text');
    const div = document.createElement('div');
    div.className = 'line line-white';
    div.innerHTML = '\n  The Hollowed Keep surfaces where it pleases. One moonless night it\n  stood on the moor, gates open. The desperate walk in - and at the\n  threshold the Keep takes its Toll: name, past, trade, loves.\n\n  Once, a household of Stewards collected the Toll at the gate so the\n  Keep would not collect it inside. The last Steward skimmed from the\n  take. The Keep noticed. It always notices. He sits below now,\n  hollowed into a warning, still holding the Toll-Rod.\n\n  Everything the Keep has ever taken settles downward, floor upon\n  floor. Somewhere at the bottom is everything you were.\n\n  Type \'begin\' to pay the Toll.\n';
    bootEl.appendChild(div);
    bootEl.scrollTop = bootEl.scrollHeight;
  } else if (input === 'help') {
    const bootEl = document.getElementById('boot-text');
    const div = document.createElement('div');
    div.className = 'line line-dim';
    div.textContent = "\n  'begin' - Start a new game\n  'load'  - Load a saved game\n  'lore'  - Read the Keep's history\n";
    bootEl.appendChild(div);
    bootEl.scrollTop = bootEl.scrollHeight;
  } else {
    const bootEl = document.getElementById('boot-text');
    const div = document.createElement('div');
    div.className = 'line line-dim';
    div.textContent = "  Unknown command. Type 'begin' to enter the Keep.";
    bootEl.appendChild(div);
    bootEl.scrollTop = bootEl.scrollHeight;
  }
}

function startGame(loadSave) {
  document.getElementById('boot-screen').classList.add('hidden');
  document.getElementById('game-container').classList.remove('hidden');

  if (window.innerWidth <= 900) {
    document.getElementById('mobile-tabs').classList.remove('hidden');
    showMobilePanel('center-panel');
  }

  document.getElementById('castle-art').textContent = CASTLE_ART;
  scatterStars();

  initRoomStates();
  initChronicle();

  if (loadSave) {
    const loaded = loadGame();
    if (!loaded) {
      GS.gameStarted = true;
      printRoom(GS.currentRoom);
    }
  } else {
    GS.gameStarted = true;
    print('Cold flagstones. A grey sky framed by black walls.', 'text-amber');
    print('You are lying in a courtyard, and you do not remember lying down.', 'text-amber');
    print('');
    keepSays('The Toll is paid. Welcome to the Hollowed Keep.');
    print('');
    print('Something is missing. Everything is missing. Your hands know things', 'text-dim');
    print('your mind does not. Perhaps, in here, you will meet yourself.', 'text-dim');
    print('');
    printRoom(GS.currentRoom);
  }

  const cmdInput = inputEl();
  cmdInput.focus();
  cmdInput.addEventListener('keydown', handleGameInput);
}

function handleGameInput(e) {
  if (e.key === 'Enter') {
    const input = inputEl().value;
    inputEl().value = '';
    if (input.trim()) parseCommand(input);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (GS.commandHistory.length > 0) {
      GS.historyIndex = Math.min(GS.historyIndex + 1, GS.commandHistory.length - 1);
      inputEl().value = GS.commandHistory[GS.historyIndex];
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (GS.historyIndex > 0) {
      GS.historyIndex--;
      inputEl().value = GS.commandHistory[GS.historyIndex];
    } else {
      GS.historyIndex = -1;
      inputEl().value = '';
    }
  }
}

// === MOBILE TABS ===

function showMobilePanel(panelId) {
  document.querySelectorAll('#left-panel, #center-panel, #right-panel').forEach(p => {
    p.classList.remove('mobile-visible');
    p.style.display = '';
  });
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  const panel = document.getElementById(panelId);
  if (panelId !== 'center-panel') {
    panel.classList.add('mobile-visible');
  }
  document.querySelector(`.tab-btn[data-panel="${panelId}"]`).classList.add('active');

  if (panelId === 'center-panel') {
    inputEl().focus();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      showMobilePanel(btn.dataset.panel);
    });
  });
});

// === AMBIENT MESSAGES ===

let ambientTimer = null;

function startAmbient() {
  const messages = [
    'The walls whisper. You cannot make out the words.',
    'A cold draft stirs the dust.',
    'Somewhere distant, a door creaks open. Then shuts.',
    'You hear footsteps above you. Or below. Hard to tell.',
    'The shadows seem to deepen for a moment, then recede.',
    'A faint smell of smoke drifts through the air.',
    'The stone beneath your feet vibrates, barely perceptibly.',
    'For an instant, you see movement in your peripheral vision. Nothing is there.',
    'A distant bell tolls once. Silence follows.',
    'The flame of your light source flickers, though there is no breeze.',
    'You feel watched.',
    'The temperature drops suddenly, then normalizes.',
  ];

  ambientTimer = setInterval(() => {
    if (!GS.gameStarted || GS.gameWon || GS.inCombat) return;
    // Only whisper at the idle - never interrupt someone mid-thought.
    if (Date.now() - (GS.lastInputAt || 0) < 60000) return;
    if (Math.random() < 0.4) {
      print('');
      print(pick(messages), 'system-msg');
    }
  }, 45000);
}

// Stars across the full width of the header. Various sizes, none too big.
function scatterStars() {
  const header = document.getElementById('ascii-header');
  if (!header || header.querySelector('.hk-star')) return;
  const glyphs = ['.', '·', '*', '+', '˙'];
  const count = 34;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.className = 'hk-star';
    s.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    s.style.left = (Math.random() * 98) + '%';
    s.style.top = (Math.random() * 90) + '%';
    s.style.fontSize = (6 + Math.random() * 6) + 'px';
    s.style.opacity = (0.35 + Math.random() * 0.55).toFixed(2);
    header.appendChild(s);
  }
}

// === INITIALIZATION ===

document.addEventListener('DOMContentLoaded', () => {
  runBootSequence();
  startAmbient();

  document.body.addEventListener('click', () => {
    // Respect text selection - refocusing the input clears highlights,
    // which made copying impossible. Only grab focus when nothing is selected.
    const sel = window.getSelection && window.getSelection();
    if (sel && !sel.isCollapsed) return;
    const bootInput = document.getElementById('boot-input');
    const cmdInput = inputEl();
    if (bootInput && !document.getElementById('boot-screen').classList.contains('hidden')) {
      bootInput.focus();
    } else if (cmdInput) {
      cmdInput.focus();
    }
  });
});
