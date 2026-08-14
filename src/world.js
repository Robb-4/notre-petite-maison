// Scène three.js « HD-2D » : sol à plat, murs en volumes avec cutaway façon
// Sims, meubles en boîtes texturées pixel art, personnages en billboards.
// Convention : la logique du jeu reste en "coordonnées carte" (x = colonne,
// y = ligne, y vers le BAS). Monde three : X = x, Z = y, Y = hauteur.
import * as THREE from "three";
import { CONFIG } from "./config.js";
import {
  TILES,
  TILE_PAL,
  FURNITURE,
  FURN_PAL,
  HEART,
  WALL_TEX_GRIDS,
  BOX_TEX_GRIDS,
  VASE,
  FLOWER_BILL,
  SHADOW,
} from "./sprites.js";
import { makeTexture, makeSpriteMaterial, makeOpaqueMaterial } from "./textures.js";
import { MAP, MAP_W, MAP_H, TILE_DEFS, PLACEMENTS } from "./map.js";

const INTERIOR_FLOORS = new Set([".", ",", "r"]);
// tuiles de mur avec fenêtre (façade sud, mur du fond)
const WINDOW_CELLS = new Set(["3,1", "4,1", "10,1", "11,1"]);

function trailingEmptyRows(grid) {
  let n = 0;
  for (let i = grid.length - 1; i >= 0; i--) {
    if (/^[. ]*$/.test(grid[i])) n++;
    else break;
  }
  return n;
}

function gridSize(grid) {
  return { w: Math.max(...grid.map((r) => r.length)) / 16, h: grid.length / 16 };
}

export function createWorld() {
  const canvas = document.getElementById("game");
  const container = document.getElementById("game-container");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
  renderer.setSize(CONFIG.internalWidth, CONFIG.internalHeight, false);
  renderer.setClearColor("#2a3d24");

  const scene = new THREE.Scene();
  const halfW = CONFIG.internalWidth / CONFIG.pxPerTile / 2;
  const halfH = CONFIG.internalHeight / CONFIG.pxPerTile / 2;
  const camera = new THREE.OrthographicCamera(-halfW, halfW, halfH, -halfH, 0.1, 200);

  const pitch = (CONFIG.view.pitchDeg * Math.PI) / 180;
  const camD = CONFIG.view.camDistance;
  camera.rotation.order = "YXZ";
  camera.rotation.x = -pitch;
  // vecteur "haut" à l'écran, exprimé en monde (pour poser les billboards)
  const upVec = new THREE.Vector3(0, Math.cos(pitch), -Math.sin(pitch));

  // --- matériaux de tuiles ---
  const tileGeo = new THREE.PlaneGeometry(1, 1);
  const tileMats = {};
  for (const [name, grid] of Object.entries(TILES)) {
    tileMats[name] = makeOpaqueMaterial(makeTexture(grid, TILE_PAL));
  }

  function addFloor(col, row, matName) {
    const mesh = new THREE.Mesh(tileGeo, tileMats[matName]);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(col + 0.5, 0, row + 0.5);
    scene.add(mesh);
  }

  // --- billboards (sprites toujours face caméra) ---
  function makeBillboard(texture, w, h) {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), makeSpriteMaterial(texture));
    mesh.material.alphaTest = 0.5;
    mesh.quaternion.copy(camera.quaternion);
    return mesh;
  }
  function setBillboardPos(mesh, xMap, yMap, h, base = 0, trail = 0) {
    const half = h / 2 - trail;
    mesh.position.set(xMap, base + 0.02 + half * upVec.y, yMap + half * upVec.z);
  }

  // --- ombres portées ---
  const shadowTex = makeTexture(SHADOW, { K: "#141018" });
  function makeShadow(scale = 1) {
    const mat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.62 * scale, 0.32 * scale), mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.renderOrder = 1;
    return mesh;
  }

  // --- sols : carte + jupe d'herbe autour + fleurs en billboards ---
  const flowerTex = makeTexture(FLOWER_BILL, TILE_PAL);
  const flowerSize = gridSize(FLOWER_BILL);
  const flowerTrail = trailingEmptyRows(FLOWER_BILL) / 16;
  function addFlower(col, row) {
    const b = makeBillboard(flowerTex, flowerSize.w, flowerSize.h);
    setBillboardPos(b, col + 0.5, row + 0.6, flowerSize.h, 0, flowerTrail);
    scene.add(b);
  }

  const skirt = CONFIG.view.grassSkirt;
  for (let row = -skirt; row < MAP_H + skirt; row++) {
    for (let col = -skirt; col < MAP_W + skirt; col++) {
      const inMap = col >= 0 && col < MAP_W && row >= 0 && row < MAP_H;
      const ch = inMap ? MAP[row][col] : "g";
      const def = TILE_DEFS[ch];
      if (!def) continue;
      if (def.tile === "wall") continue; // les murs sont des volumes
      if (ch === "f") {
        addFloor(col, row, "grass");
        addFlower(col, row);
      } else {
        addFloor(col, row, def.tile);
      }
      // quelques fleurs sauvages déterministes hors carte
      if (!inMap && ((col * 7 + row * 13) % 29 + 29) % 29 === 0) addFlower(col, row);
    }
  }

  // --- murs en volumes, avec cutaway côté caméra ---
  const wallTex = {
    cap: makeTexture(WALL_TEX_GRIDS.cap, TILE_PAL),
    face: makeTexture(WALL_TEX_GRIDS.face, TILE_PAL),
    faceWindow: makeTexture(WALL_TEX_GRIDS.faceWindow, TILE_PAL),
    faceShort: makeTexture(WALL_TEX_GRIDS.faceShort, TILE_PAL),
  };
  const capMat = makeOpaqueMaterial(wallTex.cap);
  const faceMat = makeOpaqueMaterial(wallTex.face);
  const faceWinMat = makeOpaqueMaterial(wallTex.faceWindow);
  const faceShortMat = makeOpaqueMaterial(wallTex.faceShort);
  const fullGeo = new THREE.BoxGeometry(1, CONFIG.view.wallHeight, 1);
  const shortGeo = new THREE.BoxGeometry(1, CONFIG.view.wallShortHeight, 1);

  function isInteriorFloor(col, row) {
    if (col < 0 || row < 0 || col >= MAP_W || row >= MAP_H) return false;
    return INTERIOR_FLOORS.has(MAP[row][col]);
  }

  for (let row = 0; row < MAP_H; row++) {
    for (let col = 0; col < MAP_W; col++) {
      if (TILE_DEFS[MAP[row][col]]?.tile !== "wall") continue;
      // cutaway : si le mur cache l'intérieur (sol intérieur juste au nord),
      // on le rend bas pour voir dans la maison, façon Sims
      const short = isInteriorFloor(col, row - 1);
      const h = short ? CONFIG.view.wallShortHeight : CONFIG.view.wallHeight;
      const face = short ? faceShortMat : WINDOW_CELLS.has(col + "," + row) ? faceWinMat : faceMat;
      const side = short ? faceShortMat : faceMat;
      const mesh = new THREE.Mesh(short ? shortGeo : fullGeo, [
        side, // +x
        side, // -x
        capMat, // +y
        capMat, // -y
        face, // +z (face sud, vers la caméra)
        side, // -z
      ]);
      mesh.position.set(col + 0.5, h / 2, row + 0.5);
      scene.add(mesh);
    }
  }

  // --- meubles : boîtes texturées ou billboards ---
  const boxTex = {};
  for (const [name, grid] of Object.entries(BOX_TEX_GRIDS)) {
    boxTex[name] = makeOpaqueMaterial(makeTexture(grid, FURN_PAL));
  }
  const vaseTex = makeTexture(VASE, FURN_PAL);

  function makeBox(w, h, d, texTop, texFront, texSide) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [
      texSide,
      texSide,
      texTop,
      texTop,
      texFront,
      texSide,
    ]);
    return mesh;
  }

  const furniture = []; // { type, meshes: [..], placement }
  const billTexCache = {};

  for (const p of PLACEMENTS) {
    const def = FURNITURE[p.type];
    const cx = p.col + def.fw / 2;
    const cz = p.row + def.fh / 2;
    const meshes = [];

    switch (p.type) {
      case "bed": {
        const m = makeBox(0.94, 0.5, 1.94, boxTex.bedTop, boxTex.bedSide, boxTex.bedSide);
        m.position.set(cx, 0.25, cz);
        meshes.push(m);
        break;
      }
      case "couch": {
        const seat = makeBox(1.9, 0.38, 0.62, boxTex.couchSeatTop, boxTex.couchSeatFront, boxTex.couchSide);
        seat.position.set(cx, 0.19, p.row + 0.66);
        const back = makeBox(1.9, 0.72, 0.3, boxTex.couchBackTop, boxTex.couchBackFront, boxTex.couchSide);
        back.position.set(cx, 0.36, p.row + 0.18);
        meshes.push(seat, back);
        break;
      }
      case "fridge": {
        const m = makeBox(0.85, 1.4, 0.8, boxTex.fridgeTop, boxTex.fridgeFront, boxTex.fridgeSide);
        m.position.set(cx, 0.7, cz);
        meshes.push(m);
        break;
      }
      case "stove": {
        const m = makeBox(0.94, 0.85, 0.9, boxTex.stoveTop, boxTex.stoveFront, boxTex.stoveSide);
        m.position.set(cx, 0.425, cz);
        meshes.push(m);
        break;
      }
      case "table": {
        const m = makeBox(0.84, 0.55, 0.8, boxTex.tableTop, boxTex.tableSide, boxTex.tableSide);
        m.position.set(cx, 0.275, cz);
        const vaseSize = gridSize(VASE);
        const v = makeBillboard(vaseTex, vaseSize.w, vaseSize.h);
        setBillboardPos(v, cx, cz, vaseSize.h, 0.55, trailingEmptyRows(VASE) / 16);
        meshes.push(m, v);
        break;
      }
      case "photo": {
        const m = makeBox(0.84, 0.6, 0.8, boxTex.nightTop, boxTex.nightFront, boxTex.tableSide);
        m.position.set(cx, 0.3, cz);
        if (!billTexCache.photo) billTexCache.photo = makeTexture(def.grid, FURN_PAL);
        const size = gridSize(def.grid);
        const b = makeBillboard(billTexCache.photo, size.w, size.h);
        setBillboardPos(b, cx, cz, size.h, 0.6, trailingEmptyRows(def.grid) / 16);
        meshes.push(m, b);
        break;
      }
      default: {
        // billboard debout (tv, douche, plante, étagère, chaussette…)
        if (!billTexCache[p.type]) billTexCache[p.type] = makeTexture(def.grid, FURN_PAL);
        const size = gridSize(def.grid);
        const b = makeBillboard(billTexCache[p.type], size.w, size.h);
        setBillboardPos(b, cx, p.row + def.fh - 0.15, size.h, 0, trailingEmptyRows(def.grid) / 16);
        meshes.push(b);
        // petite ombre sous les meubles sur pied
        if (p.type !== "lost_item") {
          const sh = makeShadow(size.w * 1.1);
          sh.position.set(cx, 0.015, p.row + def.fh - 0.35);
          meshes.push(sh);
        }
      }
    }
    for (const m of meshes) scene.add(m);
    furniture.push({ type: p.type, meshes, placement: p });
  }

  // --- cœurs qui s'envolent ---
  const heartTex = makeTexture(HEART, FURN_PAL);
  const hearts = [];
  function spawnHearts(x, yMap, n = 6) {
    for (let i = 0; i < n; i++) {
      const mesh = makeBillboard(heartTex, 0.5, 0.375);
      mesh.material.depthWrite = false;
      mesh.renderOrder = 10;
      mesh.position.set(x + (Math.random() - 0.5) * 1.2, 0.9 + Math.random() * 0.4, yMap);
      scene.add(mesh);
      hearts.push({
        mesh,
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
      h.mesh.material.opacity = Math.max(0, 1 - h.t / h.life);
      if (h.t >= h.life) {
        scene.remove(h.mesh);
        h.mesh.material.dispose();
        hearts.splice(i, 1);
      }
    }
  }

  // --- caméra : suivi doux + clamp ---
  const camPos = { x: MAP_W / 2, z: MAP_H / 2 };
  function updateCamera(tx, ty, dt, snap = false) {
    const k = snap ? 1 : Math.min(1, dt * 6);
    camPos.x += (tx - camPos.x) * k;
    camPos.z += (ty - camPos.z) * k;
    const cx = Math.min(Math.max(camPos.x, halfW - 2), MAP_W - halfW + 2);
    const cz = Math.min(Math.max(camPos.z, 3), MAP_H - 2);
    camera.position.set(cx, camD * Math.sin(pitch), cz + camD * Math.cos(pitch));
  }

  // --- projection carte → pixels CSS (HUD flottant). height = hauteur monde ---
  const projV = new THREE.Vector3();
  function project(xMap, yMap, height = 0) {
    projV.set(xMap, height, yMap);
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
    for (const f of furniture) {
      if (f.type === type) for (const m of f.meshes) m.visible = visible;
    }
  }

  function render() {
    renderer.render(scene, camera);
  }

  return {
    scene,
    camera,
    canvas,
    furniture,
    makeBillboard,
    setBillboardPos,
    makeShadow,
    spawnHearts,
    update,
    updateCamera,
    project,
    render,
    setFurnitureVisible,
  };
}
