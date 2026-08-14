// Boîte de dialogue : choisit une réplique dans data.js selon le contexte et
// le moment de la journée, effet machine à écrire, file d'attente.
export class Dialogue {
  constructor(data) {
    this.data = data;
    this.queue = [];
    this.current = null;
    this.shown = 0;
    this.box = document.getElementById("dialogue");
    this.nameEl = document.getElementById("dlg-name");
    this.textEl = document.getElementById("dlg-text");
    this.box.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      this.advance();
    });
  }

  get isOpen() {
    return this.current !== null;
  }

  // key: clé dans data.dialogues ; speaker: "player" | "partner" ; bucket:
  // "matin" | "jour" | "soir" | "nuit"
  showKey(key, speaker, bucket) {
    const entry = this.data.dialogues[key];
    if (!entry) return;
    const list = entry[bucket] || entry.any;
    if (!list || list.length === 0) return;
    const text = list[Math.floor(Math.random() * list.length)];
    const name = this.data.characters[speaker]?.nom ?? "";
    this.show(name, text);
  }

  show(name, text) {
    this.queue.push({ name, text });
    if (!this.current) this.next();
  }

  next() {
    this.current = this.queue.shift() ?? null;
    if (this.current) {
      this.box.classList.remove("hidden");
      this.nameEl.textContent = this.current.name;
      this.textEl.textContent = "";
      this.shown = 0;
    } else {
      this.box.classList.add("hidden");
    }
  }

  advance() {
    if (!this.current) return;
    if (this.shown < this.current.text.length) {
      this.shown = this.current.text.length; // complète la ligne
      this.textEl.textContent = this.current.text;
    } else {
      this.next();
    }
  }

  update(dt) {
    if (!this.current) return;
    if (this.shown < this.current.text.length) {
      this.shown = Math.min(this.current.text.length, this.shown + dt * 35);
      this.textEl.textContent = this.current.text.slice(0, Math.floor(this.shown));
    }
  }
}
