// main.js
// Entry point: load/save game and initialize UI & idle systems

import { player, Player } from './player.js';
import './idle.js'; // ensure idle logic is loaded
import { UI } from './ui.js';

/**
 * Load saved game data from localStorage
 */
function loadGame() {
  // Load player data
  const playerData = localStorage.getItem('playerData');
  if (playerData) {
    try {
      const parsed = JSON.parse(playerData);
      const temp = Player.fromJSON(parsed);
      Object.assign(player, temp);
    } catch (e) {
      console.error('Failed to load player data:', e);
    }
  }

  // TODO: Load skills data once serialization is implemented
}

/**
 * Save current game data to localStorage
 */
function saveGame() {
  try {
    localStorage.setItem('playerData', JSON.stringify(player.toJSON()));
    // TODO: Save skills data once serialization is implemented
  } catch (e) {
    console.error('Failed to save game data:', e);
  }
}

// Initialize when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  loadGame();
  UI.init();
});

// Save game on page unload
window.addEventListener('beforeunload', saveGame);
