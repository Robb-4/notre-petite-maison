// Vue des personnages (sprite animé) + déplacement du joueur avec collision.
import * as THREE from "three";
import { CONFIG } from "./config.js";
import { CHAR_SPRITES } from "./sprites.js";
import { makeTexture, makeSpriteMaterial } from "./textures.js";
import { zForBase } from "./world.js";

// Crée le mesh + textures d'un personnage. spriteSet: "her" | "him".
export function createCharacterView(spriteSet, palette) {
  const set = CHAR_SPRITES[spriteSet];
  const texs = {};
  for (const dir of ["down", "up", "side"]) {
    for (const frame of ["idle", "step"]) {
      texs[dir + frame] = makeTexture(set[dir][frame], palette);
    }
  }
  const mat = makeSpriteMaterial(texs.downidle);
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 1), mat);

  function setPose(dir, stepping) {
    const key = dir === "left" || dir === "right" ? "side" : dir;
    mat.map = texs[key + (stepping ? "step" : "idle")];
    mesh.scale.x = dir === "left" ? -1 : 1;
  }
  // x,y = position des pieds en coordonnées carte
  function setFeet(x, y, bob = 0) {
    mesh.position.set(x, -y + 0.5 + bob, zForBase(y));
  }
  return { mesh, setPose, setFeet };
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

  update(dt, input, isSolid, slow) {
    let dx = input.dx;
    let dy = input.dy;
    this.moving = dx !== 0 || dy !== 0;
    if (this.moving) {
      const len = Math.hypot(dx, dy);
      const speed = slow ? CONFIG.playerSpeedTired : CONFIG.playerSpeed;
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
