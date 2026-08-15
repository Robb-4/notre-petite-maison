// HUD en DOM : jauges, horloge, tracker de quête, prompt flottant, bulle
// d'alerte besoin, barre d'action, toasts.
import { CONFIG } from "./config.js";

export class HUD {
  constructor() {
    this.needsEl = document.getElementById("needs");
    this.clockEl = document.getElementById("clock");
    this.questEl = document.getElementById("quest");
    this.questTitleEl = document.getElementById("quest-title");
    this.questStepEl = document.getElementById("quest-step");
    this.promptEl = document.getElementById("prompt");
    this.bubbleEl = document.getElementById("bubble");
    this.actionBarEl = document.getElementById("action-bar");
    this.actionFillEl = document.getElementById("action-fill");
    this.toastEl = document.getElementById("toast");
    this.toastTimer = null;

    this.bars = {};
    for (const [key, def] of Object.entries(CONFIG.needs)) {
      const row = document.createElement("div");
      row.className = "need";
      row.innerHTML = `<span class="icon">${def.icon}</span><span class="bar"><span class="fill"></span></span>`;
      row.title = def.label;
      this.needsEl.appendChild(row);
      this.bars[key] = { row, fill: row.querySelector(".fill"), last: -1 };
    }
  }

  // affiche/masque une jauge (ex : Amour, cachée pendant l'histoire)
  setNeedVisible(key, visible) {
    const bar = this.bars[key];
    if (!bar || bar.visible === visible) return;
    bar.visible = visible;
    bar.row.style.display = visible ? "" : "none";
  }

  updateNeeds(values) {
    for (const [key, val] of Object.entries(values)) {
      const bar = this.bars[key];
      if (!bar) continue;
      const pct = Math.round(val);
      if (pct !== bar.last) {
        bar.last = pct;
        bar.fill.style.width = pct + "%";
        bar.row.classList.toggle("low", val < CONFIG.needLowThreshold);
      }
    }
  }

  setClock(day, timeStr) {
    this.clockEl.textContent = `Jour ${day} — ${timeStr}`;
  }

  setQuest(title, stepLabel, done = false) {
    this.questTitleEl.textContent = title;
    this.questStepEl.textContent = stepLabel;
    this.questEl.classList.toggle("done", done);
  }

  showPrompt(text, sx, sy) {
    this.promptEl.innerHTML = `<span class="key">[E]</span> ${text}`;
    this.promptEl.style.left = sx + "px";
    this.promptEl.style.top = sy + "px";
    this.promptEl.classList.remove("hidden");
  }
  hidePrompt() {
    this.promptEl.classList.add("hidden");
  }

  showBubble(emoji, sx, sy) {
    this.bubbleEl.textContent = emoji;
    this.bubbleEl.style.left = sx + "px";
    this.bubbleEl.style.top = sy + "px";
    this.bubbleEl.classList.remove("hidden");
  }
  hideBubble() {
    this.bubbleEl.classList.add("hidden");
  }

  showActionBar(frac, sx, sy) {
    this.actionFillEl.style.width = Math.round(frac * 100) + "%";
    this.actionBarEl.style.left = sx + "px";
    this.actionBarEl.style.top = sy + "px";
    this.actionBarEl.classList.remove("hidden");
  }
  hideActionBar() {
    this.actionBarEl.classList.add("hidden");
  }

  toast(text, duration = 2.6) {
    this.toastEl.textContent = text;
    this.toastEl.classList.remove("hidden");
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastEl.classList.add("hidden"), duration * 1000);
  }
}
