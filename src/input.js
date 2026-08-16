// Clavier par e.code (positions physiques) : WASD couvre ZQSD sur AZERTY.
// Sur écran tactile : joystick virtuel + boutons E / ✕.
export function createInput(canvas) {
  const held = new Set();
  let interactEdge = false;
  let startEdge = false;
  let skipEdge = false;
  let muteEdge = false;
  let newEdge = false;
  const touchVec = { x: 0, y: 0 };

  const PREVENT = new Set([
    "Space",
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
  ]);

  window.addEventListener("keydown", (e) => {
    if (PREVENT.has(e.code)) e.preventDefault();
    if (e.repeat) return;
    held.add(e.code);
    if (e.code === "KeyE" || e.code === "Space") interactEdge = true;
    if (e.code === "Enter" || e.code === "KeyE" || e.code === "Space") startEdge = true;
    if (e.code === "Escape") skipEdge = true;
    if (e.code === "KeyM") muteEdge = true;
    if (e.code === "KeyN") newEdge = true;
  });
  window.addEventListener("keyup", (e) => held.delete(e.code));
  window.addEventListener("blur", () => held.clear());
  canvas.addEventListener("pointerdown", () => {
    interactEdge = true;
    startEdge = true;
  });

  // --- contrôles tactiles (affichés seulement sur écran tactile) ---
  if ("ontouchstart" in window) {
    document.body.classList.add("touch");
    const stick = document.getElementById("stick");
    const knob = document.getElementById("stick-knob");
    const btnA = document.getElementById("btn-a");
    const btnB = document.getElementById("btn-b");
    if (stick && knob) {
      let stickPointer = null;
      const setVec = (e) => {
        const r = stick.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        let vx = (e.clientX - cx) / (r.width / 2);
        let vy = (e.clientY - cy) / (r.height / 2);
        const len = Math.hypot(vx, vy);
        if (len > 1) {
          vx /= len;
          vy /= len;
        }
        touchVec.x = Math.abs(vx) > 0.28 ? vx : 0;
        touchVec.y = Math.abs(vy) > 0.28 ? vy : 0;
        knob.style.transform = `translate(${vx * 26}px, ${vy * 26}px)`;
      };
      stick.addEventListener("pointerdown", (e) => {
        stickPointer = e.pointerId;
        stick.setPointerCapture(e.pointerId);
        setVec(e);
        e.preventDefault();
      });
      stick.addEventListener("pointermove", (e) => {
        if (e.pointerId === stickPointer) setVec(e);
      });
      const release = (e) => {
        if (e.pointerId !== stickPointer) return;
        stickPointer = null;
        touchVec.x = 0;
        touchVec.y = 0;
        knob.style.transform = "translate(0,0)";
      };
      stick.addEventListener("pointerup", release);
      stick.addEventListener("pointercancel", release);
    }
    btnA?.addEventListener("pointerdown", (e) => {
      interactEdge = true;
      startEdge = true;
      e.preventDefault();
      e.stopPropagation();
    });
    btnB?.addEventListener("pointerdown", (e) => {
      skipEdge = true;
      e.preventDefault();
      e.stopPropagation();
    });
  }

  const has = (...codes) => codes.some((c) => held.has(c));

  return {
    get dx() {
      const kb = (has("KeyD", "ArrowRight") ? 1 : 0) - (has("KeyA", "ArrowLeft") ? 1 : 0);
      return kb !== 0 ? kb : touchVec.x;
    },
    get dy() {
      const kb = (has("KeyS", "ArrowDown") ? 1 : 0) - (has("KeyW", "ArrowUp") ? 1 : 0);
      return kb !== 0 ? kb : touchVec.y;
    },
    readInteract() {
      const v = interactEdge;
      interactEdge = false;
      return v;
    },
    readStart() {
      const v = startEdge;
      startEdge = false;
      return v;
    },
    readSkip() {
      const v = skipEdge;
      skipEdge = false;
      return v;
    },
    readMute() {
      const v = muteEdge;
      muteEdge = false;
      return v;
    },
    readNew() {
      const v = newEdge;
      newEdge = false;
      return v;
    },
  };
}
