// skills.js
// Scaffold for skill system in your RPG-Idle game

import { UI } from './ui.js';

export class Skill {
  constructor({ name, level = 1, xp = 0, rate = 0, threshold = 100, isTraining = false }) {
    this.name = name;
    this.level = level;
    this.xp = xp;
    this.rate = rate;          // XP gained per tick when training
    this.threshold = threshold; // Base XP required for level 1→2
    this.isTraining = isTraining;
  }

  addXP(amount) {
    this.xp += amount;
    this.checkLevelUp();
    UI.renderSkills();
  }

  checkLevelUp() {
    while (this.xp >= this.xpForNext()) {
      this.xp -= this.xpForNext();
      this.level++;
      this.onLevelUp();
    }
  }

  xpForNext() {
    // Customize XP curve (e.g., linear, exponential)
    return this.threshold * this.level;
  }

  onLevelUp() {
    // Display level-up notification and update UI
    UI.showNotification(`${this.name} reached level ${this.level}!`);
    // Optionally: adjust rate or unlock features
    this.rate += 0; // placeholder for custom rate adjustment
    UI.renderSkills();
  }

  startTraining() {
    this.isTraining = true;
  }

  stopTraining() {
    this.isTraining = false;
  }
}

// Default skill list
export const Skills = [
  new Skill({ name: 'Attack', rate: 1, threshold: 50 }),
  new Skill({ name: 'Strength', rate: 1, threshold: 50 }),
  new Skill({ name: 'Defense', rate: 1, threshold: 50 }),
  new Skill({ name: 'Magic', rate: 1, threshold: 50 }),
  // Add additional skills here
];

// Utility: fetch skill by name
export function getSkillByName(name) {
  return Skills.find(skill => skill.name.toLowerCase() === name.toLowerCase());
}

// Engine: progress all training skills per tick
export function trainSkills(deltaTime = 1) {
  Skills.forEach(skill => {
    if (skill.isTraining) {
      const xpGain = skill.rate * deltaTime;
      skill.addXP(xpGain);
    }
  });
}
