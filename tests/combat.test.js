import { fightEnemy, Enemy } from '../js/combat.js';
import { player } from '../js/player.js';
import { Skills } from '../js/skills.js';

describe('fightEnemy', () => {
  beforeEach(() => {
    // reset player and skills
    player.health = player.maxHealth;
    player.xp = 0;
    player.stats.strength = 1;
    const attackSkill = Skills.find(s => s.name === 'Attack');
    const defenseSkill = Skills.find(s => s.name === 'Defense');
    if (attackSkill) { attackSkill.xp = 0; attackSkill.level = 1; }
    if (defenseSkill) { defenseSkill.xp = 0; defenseSkill.level = 1; }
  });

  test('returns numeric damage totals and updates XP', () => {
    const enemy = new Enemy({ id: 99, name: 'Dummy', stats: { attack: 0, defense: 0 }, maxHp: 5, goldReward: 0 });
    const result = fightEnemy(enemy, 'Attack');
    expect(typeof result.dealt).toBe('number');
    expect(typeof result.taken).toBe('number');

    const attackSkill = Skills.find(s => s.name === 'Attack');
    const defenseSkill = Skills.find(s => s.name === 'Defense');
    expect(attackSkill.xp).toBeGreaterThan(0);
    expect(defenseSkill.xp).toBe(0); // enemy attack is 0
  });
});
