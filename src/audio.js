// Sons et musique 100 % WebAudio — aucun fichier, tout est généré en code.
// La musique est une petite boucle pentatonique douce ; les effets sont des
// oscillateurs avec enveloppe. Touche M pour tout couper.

export function createAudio() {
  let ctx = null;
  let enabled = true;
  let musicTimer = null;
  let step = 0;
  let nextTime = 0;

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    return ctx;
  }

  function tone(freq, dur, { type = "square", vol = 0.07, slide = 0, delay = 0 } = {}) {
    if (!enabled || !ctx) return;
    const t0 = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t0 + dur);
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  }

  const SFX = {
    blip: () => tone(520, 0.06, { vol: 0.04 }),
    success: () => {
      tone(523, 0.09);
      tone(659, 0.09, { delay: 0.09 });
      tone(784, 0.16, { delay: 0.18 });
    },
    jingle: () => {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.13, { delay: i * 0.11, type: "triangle", vol: 0.09 }));
    },
    coin: () => {
      tone(880, 0.06);
      tone(1320, 0.12, { delay: 0.06 });
    },
    heart: () => tone(1100, 0.14, { type: "triangle", vol: 0.05, slide: 400 }),
    fail: () => tone(300, 0.4, { type: "sawtooth", vol: 0.06, slide: -220 }),
    sweep: () => tone(220, 0.3, { type: "triangle", vol: 0.05, slide: 500 }),
    sleep: () => {
      tone(660, 0.2, { type: "triangle", vol: 0.05 });
      tone(440, 0.3, { delay: 0.18, type: "triangle", vol: 0.05 });
    },
    point: () => tone(720, 0.05, { vol: 0.045 }),
  };

  function play(name) {
    if (!ctx || !enabled) return;
    SFX[name]?.();
  }

  // boucle d'ambiance : arpège pentatonique lent, très discret
  const SCALE = [261.6, 293.7, 329.6, 392.0, 440.0, 523.3];
  const PATTERN = [0, 2, 4, 5, 4, 2, 3, 1, 0, 2, 4, 2, 5, 4, 2, 1];
  function startMusic() {
    if (musicTimer || !ctx) return;
    nextTime = ctx.currentTime + 0.2;
    musicTimer = setInterval(() => {
      if (!enabled || !ctx) return;
      while (nextTime < ctx.currentTime + 0.5) {
        const idx = PATTERN[step % PATTERN.length];
        const oct = Math.floor(step / PATTERN.length) % 2 === 0 ? 0.5 : 1;
        const t0 = nextTime;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "triangle";
        o.frequency.value = SCALE[idx] * oct;
        g.gain.setValueAtTime(0.025, t0);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.6);
        o.connect(g).connect(ctx.destination);
        o.start(t0);
        o.stop(t0 + 0.65);
        nextTime += 0.43;
        step += 1;
      }
    }, 150);
  }

  // à appeler après le premier geste utilisateur (politique d'autoplay)
  function resume() {
    const c = ensure();
    if (!c) return;
    if (c.state === "suspended") c.resume();
    startMusic();
  }

  function toggle() {
    enabled = !enabled;
    return enabled;
  }

  return {
    play,
    toggle,
    resume,
    get enabled() {
      return enabled;
    },
    get state() {
      return ctx ? ctx.state : "none";
    },
  };
}
