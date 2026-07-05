// === UTILITY ===

function rng(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

