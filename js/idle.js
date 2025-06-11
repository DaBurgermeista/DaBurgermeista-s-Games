// idle.js
// Manages passive progression and offline gains

import { trainSkills } from './skills.js';
import { UI } from './ui.js';

const TICK_MS = 1000;
let intervalId;

// Initialize idle systems on page load
export function initIdle() {
  applyOfflineProgress();
  startIdleLoop();
}

// Apply gains for time spent offline
function applyOfflineProgress() {
  const last = localStorage.getItem('lastTimestamp');
  if (!last) return;
  const diffSec = (Date.now() - parseInt(last, 10)) / 1000;
  if (diffSec > 0) {
    trainSkills(diffSec);
    UI.renderSkills();
    UI.showNotification(`You gained ${Math.floor(diffSec)}s of training while offline.`);
  }
  localStorage.removeItem('lastTimestamp');
}

// Start the regular idle tick
export function startIdleLoop() {
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(() => {
    trainSkills(1);
    UI.renderSkills();
    // Update last timestamp for potential offline calculation
    localStorage.setItem('lastTimestamp', Date.now().toString());
  }, TICK_MS);
}

// Stop the idle loop
export function stopIdleLoop() {
  clearInterval(intervalId);
}

// Hook into page lifecycle
window.addEventListener('DOMContentLoaded', () => initIdle());
window.addEventListener('beforeunload', () => {
  localStorage.setItem('lastTimestamp', Date.now().toString());
});
