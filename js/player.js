// player.js

import { Skills, getSkillByName } from './skills.js';
import { UI } from './ui.js';

export class Player {
  constructor({
    name = 'Runner',
    level = 1,
    xp = 0,
    gold = 0,
    stats = { strength: 1, dexterity: 1, intelligence: 1 },
    health = 100,
    maxHealth = 100,
    inventory = [],        // Array of item objects
    equipment = {}         // { slotName: itemObject }
  } = {}) {
    this.name = name;
    this.level = level;
    this.xp = xp;
    this.gold = gold;
    this.stats = stats;
    this.health = health;
    this.maxHealth = maxHealth;
    this.inventory = inventory;
    this.equipment = equipment;
  }

  addXP(amount) {
    this.xp += amount;
    this.checkLevelUp();
  }

  xpForNext() {
    // XP curve: base 100 * level
    return 100 * this.level;
  }

  checkLevelUp() {
    while (this.xp >= this.xpForNext()) {
      this.xp -= this.xpForNext();
      this.level++;
      this.onLevelUp();
    }
  }

  onLevelUp() {
    UI.showNotification(`${this.name} reached level ${this.level}!`);
    // Example: increase stats or unlock new skills
    this.stats.strength += 1;
    this.stats.dexterity += 1;
    this.stats.intelligence += 1;
    // Optionally: sync with Skills array
    const skill = getSkillByName('Attack');
    if (skill) skill.rate += 0.5;
  }

  takeDamage(amount) {
    const damage = Math.max(amount - (this.stats.defense || 0), 0);
    const prevHealth = this.health;
    this.health = Math.max(this.health - damage, 0);
    const actual = prevHealth - this.health;
    if (this.health === 0) this.onDeath();
    return actual;
  }

  heal(amount) {
    this.health = Math.min(this.health + amount, this.maxHealth);
  }

  onDeath() {
    console.log(`${this.name} has fallen!`);
    // TODO: handle death (respawn, penalties, etc.)
  }

  addItem(item) {
    this.inventory.push(item);
  }

  removeItem(itemId) {
    this.inventory = this.inventory.filter(item => item.id !== itemId);
  }

  equip(slot, item) {
    // Unequip existing in slot
    if (this.equipment[slot]) this.addItem(this.equipment[slot]);
    this.equipment[slot] = item;
    this.removeItem(item.id);
    // TODO: apply item stat bonuses
  }

  unequip(slot) {
    const item = this.equipment[slot];
    if (item) {
      this.addItem(item);
      delete this.equipment[slot];
      // TODO: remove item stat bonuses
    }
  }

  toJSON() {
    return {
      name: this.name,
      level: this.level,
      xp: this.xp,
      gold: this.gold,
      stats: this.stats,
      health: this.health,
      maxHealth: this.maxHealth,
      inventory: this.inventory,
      equipment: this.equipment
    };
  }

  static fromJSON(data) {
    return new Player(data);
  }
}

// Singleton player instance
export const player = new Player({ name: 'Runner', gold: 0 });
