// Clavier par e.code (positions physiques) : WASD couvre ZQSD sur AZERTY.
export function createInput(canvas) {
  const held = new Set();
  let interactEdge = false;
  let startEdge = false;
  let skipEdge = false;

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
  });
  window.addEventListener("keyup", (e) => held.delete(e.code));
  window.addEventListener("blur", () => held.clear());
  canvas.addEventListener("pointerdown", () => {
    interactEdge = true;
    startEdge = true;
  });

  const has = (...codes) => codes.some((c) => held.has(c));

  return {
    get dx() {
      return (has("KeyD", "ArrowRight") ? 1 : 0) - (has("KeyA", "ArrowLeft") ? 1 : 0);
    },
    get dy() {
      return (has("KeyS", "ArrowDown") ? 1 : 0) - (has("KeyW", "ArrowUp") ? 1 : 0);
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
  };
}
