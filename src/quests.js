// Quêtes : une active à la fois, dans l'ordre de data.js. Chaque étape est
// validée quand la joueuse interagit avec sa cible.
export class Quests {
  // callbacks: { onStepDone(step), onQuestDone(quest, allDone) }
  constructor(quests, callbacks = {}) {
    this.quests = quests;
    this.cb = callbacks;
    this.qi = 0;
    this.si = 0;
    this.allDone = quests.length === 0;
  }

  get current() {
    return this.allDone ? null : this.quests[this.qi];
  }

  get currentStep() {
    return this.current ? this.current.steps[this.si] : null;
  }

  isCurrentTarget(type) {
    return this.currentStep?.target === type;
  }

  _advance() {
    const completedStep = this.currentStep;
    this.si += 1;
    this.cb.onStepComplete?.(completedStep); // effets de l'étape terminée
    if (this.si >= this.current.steps.length) {
      const done = this.current;
      this.qi += 1;
      this.si = 0;
      if (this.qi >= this.quests.length) this.allDone = true;
      this.cb.onQuestDone?.(done, this.allDone);
    } else {
      this.cb.onStepDone?.(this.currentStep);
    }
  }

  handleInteract(type) {
    const step = this.currentStep;
    if (!step || step.target !== type) return;
    this._advance();
  }

  // Étapes « atteindre une zone » : appelé chaque frame avec les pieds du
  // joueur et l'identifiant de la carte courante.
  handleGoto(px, py, mapId) {
    const g = this.currentStep?.goto;
    if (!g) return;
    if (g.map && g.map !== mapId) return;
    if (px >= g.x0 && px <= g.x1 && py >= g.y0 && py <= g.y1) this._advance();
  }
}
