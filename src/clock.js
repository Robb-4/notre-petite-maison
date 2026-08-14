// Horloge du jeu : 1 seconde réelle = 1 minute de jeu. Gère le compteur de
// jours, la teinte jour/nuit et les événements horaires.
import { CONFIG } from "./config.js";

// Événements déclenchés au passage d'une heure (une fois par jour).
export const TIMED_EVENTS = [
  { hour: 8, key: "event_cafe_matin", effects: { energie: 15 }, speaker: "partner" },
  { hour: 21, key: "event_serie_soir", effects: {}, speaker: "partner" },
];

function hexToRgb(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

export class Clock {
  constructor() {
    this.day = 1;
    // on démarre 30 s de jeu avant l'heure pile, pour que l'événement du
    // café de 8h se déclenche peu après le début de partie ☕
    this.minutes = CONFIG.startHour * 60 - 0.5;
    this.prevMinutes = this.minutes;
    this.fired = new Set();
  }

  get hourFloat() {
    return this.minutes / 60;
  }

  // Avance le temps ; renvoie la liste des événements déclenchés.
  update(dt) {
    this.prevMinutes = this.minutes;
    this.minutes += dt * CONFIG.gameMinutesPerSecond;
    if (this.minutes >= 1440) {
      this.minutes -= 1440;
      this.prevMinutes -= 1440;
      this.day += 1;
      this.fired.clear();
    }
    const triggered = [];
    for (const ev of TIMED_EVENTS) {
      const m = ev.hour * 60;
      if (!this.fired.has(ev.key) && this.prevMinutes < m && this.minutes >= m) {
        this.fired.add(ev.key);
        triggered.push(ev);
      }
    }
    return triggered;
  }

  // La soirée série est active entre 21h et 23h.
  get serieActive() {
    return this.hourFloat >= 21 && this.hourFloat < 23;
  }

  // Dormir : avance au lendemain matin.
  sleep() {
    this.day += 1;
    this.minutes = CONFIG.wakeUpHour * 60;
    this.prevMinutes = this.minutes - 1;
    this.fired.clear();
  }

  bucket() {
    const h = this.hourFloat;
    if (h >= 23 || h < 6) return "nuit";
    for (const b of CONFIG.timeBuckets) {
      if (h >= b.from && h < b.to) return b.name;
    }
    return "jour";
  }

  timeString() {
    const h = Math.floor(this.minutes / 60);
    const m = Math.floor(this.minutes % 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  // Couleur de teinte interpolée entre les keyframes de config.
  tintColor() {
    const h = this.hourFloat;
    const kf = CONFIG.tintKeyframes;
    for (let i = 0; i < kf.length - 1; i++) {
      const [h0, c0] = kf[i];
      const [h1, c1] = kf[i + 1];
      if (h >= h0 && h <= h1) {
        const t = h1 === h0 ? 0 : (h - h0) / (h1 - h0);
        const a = hexToRgb(c0);
        const b = hexToRgb(c1);
        const rgb = a.map((v, j) => Math.round(v + (b[j] - v) * t));
        return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
      }
    }
    return "#ffffff";
  }
}
