// Vue des personnages (billboard animé + ombre) + déplacement du joueur.
import { CONFIG } from "./config.js";
import { CHAR_SPRITES } from "./sprites.js";
import { makeTexture } from "./textures.js";

const OUTLINE = "#241726"; // contour des personnages, pour la lisibilité en 3D
const CHAR_W = 0.75;
const CHAR_H = 1.0;
const CHAR_TRAIL = 1 / 16; // ligne vide en bas des grilles

// Crée le billboard + textures d'un personnage. spriteSet: "her" | "him".
// `meshes` doit être ré-attaché à la scène après chaque changement de carte
// (main.js s'en charge via world.addObj).
export function createCharacterView(world, spriteSet, palette) {
  const set = CHAR_SPRITES[spriteSet];
  const texs = {};
  for (const dir of ["down", "up", "side"]) {
    for (const frame of ["idle", "step"]) {
      texs[dir + frame] = makeTexture(set[dir][frame], palette, OUTLINE);
    }
  }
  const mesh = world.makeBillboard(texs.downidle, CHAR_W, CHAR_H);
  const shadow = world.makeShadow(1);
  let lastKey = "downidle";

  function setPose(dir, stepping) {
    const key = dir === "left" || dir === "right" ? "side" : dir;
    lastKey = key + (stepping ? "step" : "idle");
    mesh.material.map = texs[lastKey];
    mesh.scale.x = dir === "left" ? -1 : 1;
  }

  // change la tenue (nouvelle palette) — régénère toutes les textures
  function recolor(newPalette) {
    for (const dir of ["down", "up", "side"]) {
      for (const frame of ["idle", "step"]) {
        texs[dir + frame] = makeTexture(set[dir][frame], newPalette, OUTLINE);
      }
    }
    mesh.material.map = texs[lastKey];
  }
  // x,y = position des pieds en coordonnées carte
  function setFeet(x, y, bob = 0) {
    world.setBillboardPos(mesh, x, y, CHAR_H, bob, CHAR_TRAIL);
    shadow.position.set(x, 0.02, y);
  }
  return { mesh, meshes: [mesh, shadow], setPose, setFeet, recolor };
}

// Déplacement AABB contre la grille, axe par axe. Renvoie la position finale.
export function tryMove(x, y, dx, dy, isSolid, hw, hh) {
  function boxHits(cx, cy) {
    const x0 = Math.floor(cx - hw);
    const x1 = Math.floor(cx + hw - 0.001);
    const y0 = Math.floor(cy - hh);
    const y1 = Math.floor(cy + hh - 0.001);
    for (let r = y0; r <= y1; r++) {
      for (let c = x0; c <= x1; c++) {
        if (isSolid(c, r)) return true;
      }
    }
    return false;
  }
  let nx = x + dx;
  if (dx !== 0 && boxHits(nx, y)) nx = x;
  let ny = y + dy;
  if (dy !== 0 && boxHits(nx, ny)) ny = y;
  return { x: nx, y: ny, blocked: nx === x && ny === y && (dx !== 0 || dy !== 0) };
}

export class Player {
  constructor(view, x, y) {
    this.view = view;
    this.x = x;
    this.y = y;
    this.dir = "down";
    this.moving = false;
    this.animT = 0;
    this.sync();
  }

  // mode : "normal" | "tired" | "crawl"
  update(dt, input, isSolid, mode = "normal") {
    let dx = input.dx;
    let dy = input.dy;
    this.moving = dx !== 0 || dy !== 0;
    if (this.moving) {
      const len = Math.hypot(dx, dy);
      const speed =
        mode === "crawl"
          ? CONFIG.playerSpeedCrawl
          : mode === "tired"
            ? CONFIG.playerSpeedTired
            : CONFIG.playerSpeed;
      dx = (dx / len) * speed * dt;
      dy = (dy / len) * speed * dt;
      if (Math.abs(input.dx) >= Math.abs(input.dy)) {
        this.dir = input.dx > 0 ? "right" : "left";
      } else {
        this.dir = input.dy > 0 ? "down" : "up";
      }
      const box = CONFIG.playerBox;
      const res = tryMove(this.x, this.y, dx, dy, isSolid, box.w / 2, box.h / 2);
      this.x = res.x;
      this.y = res.y;
      this.animT += dt;
    }
    this.sync();
  }

  sync() {
    const stepping = this.moving && Math.floor(this.animT * 7) % 2 === 1;
    const bob = stepping ? 1 / CONFIG.pxPerTile : 0;
    this.view.setPose(this.dir, stepping);
    this.view.setFeet(this.x, this.y, bob);
  }
}
