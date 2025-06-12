// combat.js
// Combat system for RPG-Idle game with reduced notifications

import { player } from './player.js';
import { UI } from './ui.js';
import { getSkillByName } from './skills.js';

/**
 * Enemy class representing a combatant
 */
export class Enemy {
  constructor({
    id,
    name = 'Street Punk',
    level = 1,
    stats = { attack: 0, defense: 0 },
    maxHp = 5,
    goldReward = 5,
    loot = []
  }) {
    this.id = id;
    this.name = name;
    this.level = level;
    this.stats = stats;
    this.maxHp = maxHp;
    this.hp = maxHp;
    this.goldReward = goldReward;
    this.loot = loot;
  }

  isAlive() {
    return this.hp > 0;
  }

  takeDamage(amount) {
    const damage = Math.max(amount - (this.stats.defense || 0), 0);
    this.hp = Math.max(this.hp - damage, 0);
    return damage;
  }

  attackTarget(target) {
    return target.takeDamage(this.stats.attack);
  }
}

// Enemy templates (weakened Street Punk)
export const EnemyTemplates = [
  { id: 1, name: 'Street Punk', level: 1, stats: { attack: 0, defense: 0 }, maxHp: 5, goldReward: 5 }
];

/**
 * Create a new Enemy instance from a template id
 */
export function createEnemy(id) {
  const tpl = EnemyTemplates.find(e => e.id === id);
  if (!tpl) throw new Error(`Enemy template #${id} not found.`);
  return new Enemy(tpl);
}

/**
 * Conduct a turn-based fight. Only key notifications are shown.
 * Offensive skill XP for damage dealt; Defense XP for damage taken.
 * @param {Enemy} enemy
 * @param {string} offenseSkillName
 */
export function fightEnemy(enemy, offenseSkillName = 'Attack') {
  const offenseSkill = getSkillByName(offenseSkillName);
  const defenseSkill = getSkillByName('Defense');

  // Revive hero if dead
  if (player.health <= 0) {
    player.health = player.maxHealth;
    UI.showNotification(`${player.name} is revived!`);
  }

  // Notify encounter
  UI.showNotification(`A wild ${enemy.name} appears!`);

  let totalDealt = 0;
  let totalTaken = 0;

  // Combat loop without per-hit toasts
  while (player.health > 0 && enemy.isAlive()) {
    // Player attack
    const dealt = enemy.takeDamage(player.stats.strength || 1);
    totalDealt += dealt;
    if (offenseSkill) offenseSkill.addXP(dealt);

    if (!enemy.isAlive()) break;

    // Enemy attack
    const taken = player.takeDamage(enemy.stats.attack);
    totalTaken += taken;
    if (defenseSkill) defenseSkill.addXP(taken);
  }

  // Outcome notifications
  if (player.health > 0) {
    UI.showNotification(`Defeated ${enemy.name}! Dealt ${totalDealt} damage, took ${totalTaken}.`);
    player.gold = (player.gold || 0) + enemy.goldReward;
    UI.showNotification(`Looted ${enemy.goldReward} gold.`);
  } else {
    UI.showNotification(`Defeated by ${enemy.name}...`);
    // TODO: handle death penalties
  }

  // Refresh all UI
  UI.renderPlayer();
  UI.renderSkills();
  UI.renderQuests();

  return { dealt: totalDealt, taken: totalTaken };
}
