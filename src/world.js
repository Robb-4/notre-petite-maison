// Scène three.js : caméra ortho vue du dessus, tuiles, meubles, cœurs, resize.
// Convention : positions logiques en "coordonnées carte" (x = colonne, y = ligne,
// y augmente vers le BAS) ; converties en monde three (y inversé) à l'affichage.
import * as THREE from "three";
import { CONFIG } from "./config.js";
import { TILES, TILE_PAL, FURNITURE, FURN_PAL, HEART } from "./sprites.js";
import { makeTexture, makeSpriteMaterial, makeOpaqueMaterial } from "./textures.js";
import { MAP, MAP_W, MAP_H, TILE_DEFS, PLACEMENTS } from "./map.js";

// Tri en profondeur : plus bas à l'écran = dessiné devant. baseY = bas de
// l'objet en coordonnées carte.
export function zForBase(baseYMap) {
  return 1 + baseYMap * 0.005;
}

export function createWorld() {
  const canvas = document.getElementById("game");
  const container = document.getElementById("game-container");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
  renderer.setSize(CONFIG.internalWidth, CONFIG.internalHeight, false);
  renderer.setClearColor("#1d2b1a");

  const scene = new THREE.Scene();
  const halfW = CONFIG.internalWidth / CONFIG.pxPerTile / 2;
  const halfH = CONFIG.internalHeight / CONFIG.pxPerTile / 2;
  const camera = new THREE.OrthographicCamera(-halfW, halfW, halfH, -halfH, 0.1, 200);
  camera.position.set(MAP_W / 2, -MAP_H / 2, 100);

  // --- tuiles ---
  const tileGeo = new THREE.PlaneGeometry(1, 1);
  const tileMats = {};
  for (const [name, grid] of Object.entries(TILES)) {
    tileMats[name] = makeOpaqueMaterial(makeTexture(grid, TILE_PAL));
  }
  for (let row = 0; row < MAP_H; row++) {
    for (let col = 0; col < MAP_W; col++) {
      const def = TILE_DEFS[MAP[row][col]];
      if (!def) continue;
      const mesh = new THREE.Mesh(tileGeo, tileMats[def.tile]);
      mesh.position.set(col + 0.5, -(row + 0.5), 0);
      scene.add(mesh);
    }
  }

  // --- meubles ---
  const furniture = []; // { type, mesh, rect {x0,y0,x1,y1}, cx, cy }
  const furnTexCache = {};
  for (const p of PLACEMENTS) {
    const def = FURNITURE[p.type];
    if (!furnTexCache[p.type]) furnTexCache[p.type] = makeTexture(def.grid, FURN_PAL);
    const gw = Math.max(...def.grid.map((r) => r.length)) / 16;
    const gh = def.grid.length / 16;
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(gw, gh),
      makeSpriteMaterial(furnTexCache[p.type])
    );
    const baseY = p.row + def.fh; // bas de l'empreinte (coordonnées carte)
    const cx = p.col + def.fw / 2;
    mesh.position.set(cx, -baseY + gh / 2, zForBase(baseY));
    scene.add(mesh);
    furniture.push({
      type: p.type,
      mesh,
      rect: { x0: p.col, y0: p.row, x1: p.col + def.fw, y1: p.row + def.fh },
      cx,
      cy: p.row + def.fh / 2,
    });
  }

  // --- cœurs qui s'envolent ---
  const heartTex = makeTexture(HEART, FURN_PAL);
  const heartGeo = new THREE.PlaneGeometry(0.5, 0.375);
  const hearts = [];
  function spawnHearts(x, y, n = 6) {
    for (let i = 0; i < n; i++) {
      const mat = makeSpriteMaterial(heartTex);
      const mesh = new THREE.Mesh(heartGeo, mat);
      mesh.position.set(x + (Math.random() - 0.5) * 1.2, -y + Math.random() * 0.4, 50);
      scene.add(mesh);
      hearts.push({
        mesh,
        mat,
        t: 0,
        life: 1.1 + Math.random() * 0.5,
        vx: (Math.random() - 0.5) * 0.6,
        vy: 1.1 + Math.random() * 0.8,
      });
    }
  }

  function update(dt) {
    for (let i = hearts.length - 1; i >= 0; i--) {
      const h = hearts[i];
      h.t += dt;
      h.mesh.position.x += h.vx * dt;
      h.mesh.position.y += h.vy * dt;
      h.mat.opacity = Math.max(0, 1 - h.t / h.life);
      if (h.t >= h.life) {
        scene.remove(h.mesh);
        h.mat.dispose();
        hearts.splice(i, 1);
      }
    }
  }

  // --- caméra : suivi doux + clamp aux bords + arrondi au pixel interne ---
  const camPos = { x: MAP_W / 2, y: MAP_H / 2 }; // coordonnées carte
  function updateCamera(tx, ty, dt, snap = false) {
    const k = snap ? 1 : Math.min(1, dt * 6);
    camPos.x += (tx - camPos.x) * k;
    camPos.y += (ty - camPos.y) * k;
    const cx = Math.min(Math.max(camPos.x, halfW), MAP_W - halfW);
    const cy = Math.min(Math.max(camPos.y, halfH), MAP_H - halfH);
    const px = CONFIG.pxPerTile;
    camera.position.x = Math.round(cx * px) / px;
    camera.position.y = -Math.round(cy * px) / px;
  }

  // --- projection carte → pixels CSS (pour le HUD flottant) ---
  const projV = new THREE.Vector3();
  function project(x, y) {
    projV.set(x, -y, 1);
    projV.project(camera);
    return {
      sx: ((projV.x + 1) / 2) * canvas.clientWidth,
      sy: ((1 - projV.y) / 2) * canvas.clientHeight,
    };
  }

  // --- mise à l'échelle entière de la résolution interne ---
  function resize() {
    let scale = Math.min(
      window.innerWidth / CONFIG.internalWidth,
      window.innerHeight / CONFIG.internalHeight
    );
    if (scale > 1) scale = Math.floor(scale);
    const w = Math.floor(CONFIG.internalWidth * scale);
    const h = Math.floor(CONFIG.internalHeight * scale);
    container.style.width = w + "px";
    container.style.height = h + "px";
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
  }
  window.addEventListener("resize", resize);
  resize();

  function setFurnitureVisible(type, visible) {
    for (const f of furniture) if (f.type === type) f.mesh.visible = visible;
  }

  function render() {
    renderer.render(scene, camera);
  }

  return {
    scene,
    camera,
    canvas,
    furniture,
    spawnHearts,
    update,
    updateCamera,
    project,
    render,
    setFurnitureVisible,
  };
}
