// ui.js
// Responsible for rendering and interacting with the UI

import { player } from './player.js';
import { Skills, trainSkills } from './skills.js';
import { Quests, startQuest, checkQuests } from './quests.js';
import { createEnemy, fightEnemy } from './combat.js';

export const UI = {
  init() {
    this.cacheElements();
    this.renderPlayer();
    this.renderSkills();
    this.renderQuests();
    this.bindEvents();
    this.startIdleLoop();
  },

  cacheElements() {
    this.nameEl = document.getElementById('player-name');
    this.levelEl = document.getElementById('player-level');
    this.xpEl = document.getElementById('player-xp');
    this.xpNextEl = document.getElementById('player-xp-next');
    this.hpEl = document.getElementById('player-hp');
    this.maxHpEl = document.getElementById('player-maxhp');
    this.skillListEl = document.getElementById('skill-list');
    this.questListEl = document.getElementById('quest-list');
    this.combatViewEl = document.getElementById('combat-view');
    this.offenseSelect = document.getElementById('offense-select');
    this.combatStatusEl = document.getElementById('combat-status');
    this.fightBtn = document.getElementById('fight-btn');
    this.notificationEl = document.getElementById('notifications');
  },

  renderPlayer() {
    this.nameEl.textContent = player.name;
    this.levelEl.textContent = player.level;
    this.xpEl.textContent = Math.floor(player.xp);
    this.xpNextEl.textContent = player.xpForNext();
    this.hpEl.textContent = player.health;
    this.maxHpEl.textContent = player.maxHealth;
  },

  renderSkills() {
    this.skillListEl.innerHTML = '';
    Skills.forEach(skill => {
      const li = document.createElement('li');
      li.className = 'skill-item';
      li.innerHTML = `
        <div class="info">
          <span class="name">${skill.name} (Lv ${skill.level})</span>
          <div class="bar"><div class="fill" style="width: ${this.fillPercent(skill)}%;"></div></div>
        </div>
      `;
      this.skillListEl.append(li);
    });
  },

  renderQuests() {
    this.questListEl.innerHTML = '';
    Quests.forEach(q => {
      const li = document.createElement('li');
      li.className = `quest-item ${q.status}`;
      li.innerHTML = `<strong>${q.name}</strong>: ${q.description}`;

      if (q.status === 'available' && q.canStart()) {
        const btn = document.createElement('button');
        btn.textContent = 'Start';
        btn.addEventListener('click', () => {
          startQuest(q.id);
          this.renderQuests();
        });
        li.appendChild(btn);
      } else if (q.status === 'inProgress') {
        const span = document.createElement('span'); span.textContent = ' In progress';
        li.appendChild(span);
      } else if (q.status === 'completed') {
        const span = document.createElement('span'); span.textContent = ' Completed';
        li.appendChild(span);
      }

      this.questListEl.appendChild(li);
    });
  },

  fillPercent(skill) {
    return Math.floor((skill.xp / skill.xpForNext()) * 100);
  },

  bindEvents() {
    // Overwrite any prior handler, and disable the button while fighting:
    this.fightBtn.onclick = () => {
      // prevent double-click
      this.fightBtn.disabled = true;

      const skillName = this.offenseSelect.value;
      const enemy = createEnemy(1);
      this.combatStatusEl.textContent = `Fighting ${enemy.name} with ${skillName}`;

      // run combat synchronously, then re-enable
      fightEnemy(enemy, skillName);

      this.fightBtn.disabled = false;
    };
  },

  startIdleLoop() {
    setInterval(() => {
      trainSkills(1);
      checkQuests();
      this.renderSkills();
      this.renderQuests();
    }, 1000);
  },

  showNotification(msg) {
    const el = document.createElement('div');
    el.textContent = msg;
    this.notificationEl.append(el);
    setTimeout(() => el.remove(), 3000);
  }
};

window.addEventListener('DOMContentLoaded', () => UI.init());
