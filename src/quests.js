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

  handleInteract(type) {
    const step = this.currentStep;
    if (!step || step.target !== type) return;
    this.si += 1;
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
}
