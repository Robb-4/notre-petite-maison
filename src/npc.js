// Le PNJ partenaire : erre doucement autour de son ancrage, s'arrête pour
// discuter, regarde la joueuse quand on lui parle. Pas de pathfinding —
// s'il se cogne, il change d'avis.
import { CONFIG } from "./config.js";
import { tryMove } from "./player.js";

const DIRS = {
  down: [0, 1],
  up: [0, -1],
  left: [-1, 0],
  right: [1, 0],
};

export class NPC {
  constructor(view, x, y) {
    this.view = view;
    this.x = x;
    this.y = y;
    this.dir = "down";
    this.state = "idle";
    this.timer = 1.5;
    this.talkTimer = 0;
    this.animT = 0;
    this.moving = false;
    this.sync();
  }

  faceToward(tx, ty) {
    const dx = tx - this.x;
    const dy = ty - this.y;
    if (Math.abs(dx) > Math.abs(dy)) this.dir = dx > 0 ? "right" : "left";
    else this.dir = dy > 0 ? "down" : "up";
  }

  startTalk(px, py) {
    this.talkTimer = 4;
    this.state = "idle";
    this.moving = false;
    this.faceToward(px, py);
  }

  update(dt, isSolid, anchor) {
    if (this.talkTimer > 0) {
      this.talkTimer -= dt;
      this.moving = false;
      this.sync();
      return;
    }
    this.timer -= dt;
    if (this.state === "idle") {
      this.moving = false;
      if (this.timer <= 0) {
        // trop loin de l'ancrage → direction biaisée vers lui
        const far = Math.hypot(anchor.x - this.x, anchor.y - this.y) > 4;
        if (far) {
          this.faceToward(anchor.x, anchor.y);
        } else {
          const dirs = Object.keys(DIRS);
          this.dir = dirs[Math.floor(Math.random() * dirs.length)];
        }
        this.state = "walk";
        this.timer = 0.5 + Math.random() * 1.2;
      }
    } else {
      const [dx, dy] = DIRS[this.dir];
      const step = CONFIG.npcSpeed * dt;
      const res = tryMove(this.x, this.y, dx * step, dy * step, isSolid, 0.3, 0.25);
      this.x = res.x;
      this.y = res.y;
      this.moving = true;
      this.animT += dt;
      if (res.blocked || this.timer <= 0) {
        this.state = "idle";
        this.timer = 1.5 + Math.random() * 3;
      }
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
