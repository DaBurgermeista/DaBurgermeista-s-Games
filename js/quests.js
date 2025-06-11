// quests.js
// Scaffold for quest system in your RPG-Idle game

import { getSkillByName } from './skills.js';
import { player } from './player.js';

export class Quest {
  constructor({ id, name, description, requirements = {}, rewards = {}, status = 'available' }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.requirements = requirements; // e.g., { skill: { name: 'Attack', level: 5 } }
    this.rewards = rewards;         // e.g., { xp: 100, gold: 50, items: [] }
    this.status = status;           // 'available' | 'inProgress' | 'completed'
  }

  canStart() {
    if (this.requirements.skill) {
      const req = this.requirements.skill;
      const skill = getSkillByName(req.name);
      return skill && skill.level >= req.level;
    }
    return true;
  }

  start() {
    if (this.canStart() && this.status === 'available') {
      this.status = 'inProgress';
      console.log(`Quest started: ${this.name}`);
    }
  }

  checkCompletion() {
    if (this.status !== 'inProgress') return;

    if (this.requirements.skill) {
      const req = this.requirements.skill;
      const skill = getSkillByName(req.name);
      if (skill.level >= req.level) {
        this.complete();
      }
    }
    // TODO: add other requirement types (e.g., kills, items, quests)
  }

  complete() {
    if (this.status === 'inProgress') {
      this.status = 'completed';
      this.onComplete();
    }
  }

  onComplete() {
    console.log(`Quest completed: ${this.name}`);
    if (this.rewards.xp) player.addXP(this.rewards.xp);
    if (this.rewards.gold) player.gold = (player.gold || 0) + this.rewards.gold;
    // TODO: award items
    // e.g., this.rewards.items.forEach(item => player.addItem(item));
  }
}

// Example quests
export const Quests = [
  new Quest({
    id: 1,
    name: 'Train Attack to 5',
    description: 'Reach Attack level 5.',
    requirements: { skill: { name: 'Attack', level: 5 } },
    rewards: { xp: 200, gold: 50 }
  }),
  // Add more quests here
];

export function getAvailableQuests() {
  return Quests.filter(q => q.status === 'available' && q.canStart());
}

export function startQuest(id) {
  const quest = Quests.find(q => q.id === id);
  if (quest) quest.start();
}

export function completeQuest(id) {
  const quest = Quests.find(q => q.id === id);
  if (quest) quest.complete();
}

// Progression loop: check ongoing quests for completion
export function checkQuests() {
  Quests.forEach(q => q.checkCompletion());
}
