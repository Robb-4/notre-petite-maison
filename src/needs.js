// Les 5 jauges de besoins (0..100). Pas d'échec possible : sous le seuil bas,
// juste un ralentissement et une bulle d'alerte — c'est un jeu cadeau.
import { CONFIG } from "./config.js";

export class Needs {
  constructor() {
    this.values = {};
    for (const key of Object.keys(CONFIG.needs)) {
      this.values[key] = CONFIG.needStart;
    }
  }

  // skip = clés à ne pas faire décroître (ex : "amour" pendant l'histoire)
  update(dt, skip = []) {
    for (const [key, def] of Object.entries(CONFIG.needs)) {
      if (skip.includes(key)) continue;
      this.values[key] = Math.max(0, this.values[key] - def.decay * dt);
    }
  }

  apply(effects) {
    for (const [key, delta] of Object.entries(effects)) {
      if (!(key in this.values)) continue;
      this.values[key] = Math.min(100, Math.max(0, this.values[key] + delta));
    }
  }

  // Le besoin le plus bas sous le seuil, ou null.
  lowestLow() {
    let worst = null;
    let worstVal = CONFIG.needLowThreshold;
    for (const [key, val] of Object.entries(this.values)) {
      if (val < worstVal) {
        worst = key;
        worstVal = val;
      }
    }
    return worst;
  }

  anyLow() {
    return this.lowestLow() !== null;
  }
}
