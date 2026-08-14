// Scène three.js « HD-2D » isométrique, reconstructible par carte :
// world.loadMap(mapDef) rebâtit sols, murs et meubles ; les personnages sont
// ré-attachés par main.js via world.addObj(). Textures et matériaux sont mis
// en cache une seule fois.
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
  MONITOR,
  CANDLE,
} from "./sprites.js";
import { makeTexture, makeSpriteMaterial, makeOpaqueMaterial } from "./textures.js";
import { TILE_DEFS } from "./map.js";

const INTERIOR_FLOORS = new Set([".", ",", "r", "k"]);
const OUTLINE = "#1e1622"; // contour noir façon Habbo sur les billboards
// tuiles de mur avec fenêtre (façade sud) — par carte
const WINDOW_CELLS = {
  home: new Set(["3,1", "4,1", "10,1", "11,1"]),
  hospital: new Set(["5,2", "6,2", "19,2", "20,2"]),
};

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
  renderer.setClearColor("#69ab45"); // vert herbe : l'horizon se fond dans la pelouse

  const halfW = CONFIG.internalWidth / CONFIG.pxPerTile / 2;
  const halfH = CONFIG.internalHeight / CONFIG.pxPerTile / 2;
  const camera = new THREE.OrthographicCamera(-halfW, halfW, halfH, -halfH, 0.1, 200);

  const pitch = (CONFIG.view.pitchDeg * Math.PI) / 180;
  const yaw = (CONFIG.view.yawDeg * Math.PI) / 180;
  const camD = CONFIG.view.camDistance;
  camera.rotation.order = "YXZ";
  camera.rotation.y = yaw;
  camera.rotation.x = -pitch;
  const fwdVec = new THREE.Vector3(0, 0, -1).applyEuler(camera.rotation);
  const upVec = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);

  // --- caches de matériaux / textures (une seule fois) ---
  const tileGeo = new THREE.PlaneGeometry(1, 1);
  const tileMats = {};
  for (const [name, grid] of Object.entries(TILES)) {
    tileMats[name] = makeOpaqueMaterial(makeTexture(grid, TILE_PAL));
  }
  const capMat = makeOpaqueMaterial(makeTexture(WALL_TEX_GRIDS.cap, TILE_PAL));
  const faceMat = makeOpaqueMaterial(makeTexture(WALL_TEX_GRIDS.face, TILE_PAL));
  const faceWinMat = makeOpaqueMaterial(makeTexture(WALL_TEX_GRIDS.faceWindow, TILE_PAL));
  const faceShortMat = makeOpaqueMaterial(makeTexture(WALL_TEX_GRIDS.faceShort, TILE_PAL));
  const fullGeo = new THREE.BoxGeometry(1, CONFIG.view.wallHeight, 1);
  const shortGeo = new THREE.BoxGeometry(1, CONFIG.view.wallShortHeight, 1);
  const boxTex = {};
  for (const [name, grid] of Object.entries(BOX_TEX_GRIDS)) {
    boxTex[name] = makeOpaqueMaterial(makeTexture(grid, FURN_PAL));
  }
  const billTexCache = {};
  const vaseTex = makeTexture(VASE, FURN_PAL, OUTLINE);
  const flowerTex = makeTexture(FLOWER_BILL, TILE_PAL, OUTLINE);
  const heartTex = makeTexture(HEART, FURN_PAL);
  const shadowTex = makeTexture(SHADOW, { K: "#141018" });
  const flowerSize = gridSize(FLOWER_BILL);
  const flowerTrail = trailingEmptyRows(FLOWER_BILL) / 16;
  const heartGeo = new THREE.PlaneGeometry(0.5, 0.375);

  // --- état de la carte courante ---
  let scene = new THREE.Scene();
  let mapW = 26;
  let mapH = 16;
  let furniture = [];
  let hearts = [];

  // --- billboards (sprites toujours face caméra) ---
  function makeBillboard(texture, w, h) {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), makeSpriteMaterial(texture));
    mesh.material.alphaTest = 0.5;
    mesh.quaternion.copy(camera.quaternion);
    return mesh;
  }
  function setBillboardPos(mesh, xMap, yMap, h, base = 0, trail = 0) {
    const half = h / 2 - trail;
    mesh.position.set(
      xMap + half * upVec.x,
      base + 0.02 + half * upVec.y,
      yMap + half * upVec.z
    );
  }

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

  function makeBox(w, h, d, texTop, texFront, texSide) {
    return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [
      texSide,
      texSide,
      texTop,
      texTop,
      texFront,
      texSide,
    ]);
  }

  // --- construction d'une carte ---
  function loadMap(mapDef) {
    scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const sun = new THREE.DirectionalLight(0xffffff, 0.9);
    sun.position.set(6, 10, 3);
    scene.add(sun);

    const grid = mapDef.grid;
    mapH = grid.length;
    mapW = grid[0].length;
    furniture = [];
    hearts = [];
    const windows = WINDOW_CELLS[mapDef.id] ?? new Set();

    function addFloor(col, row, matName) {
      const mesh = new THREE.Mesh(tileGeo, tileMats[matName]);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(col + 0.5, 0, row + 0.5);
      scene.add(mesh);
    }
    function addFlower(col, row) {
      const b = makeBillboard(flowerTex, flowerSize.w, flowerSize.h);
      setBillboardPos(b, col + 0.5, row + 0.6, flowerSize.h, 0, flowerTrail);
      scene.add(b);
    }
    function isInteriorFloor(col, row) {
      if (col < 0 || row < 0 || col >= mapW || row >= mapH) return false;
      return INTERIOR_FLOORS.has(grid[row][col]);
    }

    // sols + jupe d'herbe + fleurs
    const skirt = CONFIG.view.grassSkirt;
    for (let row = -skirt; row < mapH + skirt; row++) {
      for (let col = -skirt; col < mapW + skirt; col++) {
        const inMap = col >= 0 && col < mapW && row >= 0 && row < mapH;
        const ch = inMap ? grid[row][col] : "g";
        const def = TILE_DEFS[ch];
        if (!def) continue;
        if (def.tile === "wall") continue;
        if (ch === "f") {
          addFloor(col, row, "grass");
          addFlower(col, row);
        } else {
          addFloor(col, row, def.tile);
        }
        if (ch === "g" && (((col * 7 + row * 13) % 29) + 29) % 29 === 0) addFlower(col, row);
      }
    }

    // murs (cutaway côté caméra iso : sol intérieur au nord / ouest / diag NO)
    for (let row = 0; row < mapH; row++) {
      for (let col = 0; col < mapW; col++) {
        if (TILE_DEFS[grid[row][col]]?.tile !== "wall") continue;
        const short =
          isInteriorFloor(col, row - 1) ||
          isInteriorFloor(col - 1, row) ||
          isInteriorFloor(col - 1, row - 1);
        const h = short ? CONFIG.view.wallShortHeight : CONFIG.view.wallHeight;
        const face = short ? faceShortMat : windows.has(col + "," + row) ? faceWinMat : faceMat;
        const side = short ? faceShortMat : faceMat;
        const mesh = new THREE.Mesh(short ? shortGeo : fullGeo, [
          side,
          side,
          capMat,
          capMat,
          face,
          side,
        ]);
        mesh.position.set(col + 0.5, h / 2, row + 0.5);
        scene.add(mesh);
      }
    }

    // meubles
    for (const p of mapDef.placements) {
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
          const vs = gridSize(VASE);
          const v = makeBillboard(vaseTex, vs.w, vs.h);
          setBillboardPos(v, cx, cz, vs.h, 0.55, trailingEmptyRows(VASE) / 16);
          meshes.push(m, v);
          break;
        }
        case "resto_table": {
          const m = makeBox(0.84, 0.55, 0.8, boxTex.deskTop, boxTex.deskSide, boxTex.deskSide);
          m.position.set(cx, 0.275, cz);
          if (!billTexCache.candle) billTexCache.candle = makeTexture(CANDLE, FURN_PAL, OUTLINE);
          const size = gridSize(CANDLE);
          const b = makeBillboard(billTexCache.candle, size.w, size.h);
          setBillboardPos(b, cx, cz, size.h, 0.55, trailingEmptyRows(CANDLE) / 16);
          meshes.push(m, b);
          break;
        }
        case "pyramid": {
          const geo = new THREE.ConeGeometry(1.9, 2.2, 4);
          const glass = new THREE.MeshLambertMaterial({
            color: "#a8d9ec",
            transparent: true,
            opacity: 0.62,
          });
          const m = new THREE.Mesh(geo, glass);
          m.rotation.y = Math.PI / 4;
          m.position.set(cx, 1.1, cz);
          const edges = new THREE.LineSegments(
            new THREE.EdgesGeometry(geo),
            new THREE.LineBasicMaterial({ color: "#eef8fc" })
          );
          edges.rotation.y = Math.PI / 4;
          edges.position.copy(m.position);
          meshes.push(m, edges);
          break;
        }
        case "joconde":
        case "painting": {
          if (!billTexCache[p.type]) billTexCache[p.type] = makeTexture(def.grid, FURN_PAL, OUTLINE);
          const size = gridSize(def.grid);
          const b = makeBillboard(billTexCache[p.type], size.w, size.h);
          setBillboardPos(b, cx, p.row + 0.4, size.h, 0.55, trailingEmptyRows(def.grid) / 16);
          meshes.push(b);
          break;
        }
        case "desk":
        case "her_desk": {
          const m = makeBox(0.9, 0.55, 0.8, boxTex.deskTop, boxTex.deskSide, boxTex.deskSide);
          m.position.set(cx, 0.275, cz);
          if (!billTexCache.monitor) billTexCache.monitor = makeTexture(MONITOR, FURN_PAL, OUTLINE);
          const size = gridSize(MONITOR);
          const b = makeBillboard(billTexCache.monitor, size.w, size.h);
          setBillboardPos(b, cx, cz, size.h, 0.55, trailingEmptyRows(MONITOR) / 16);
          meshes.push(m, b);
          break;
        }
        case "counter": {
          const m = makeBox(0.96, 0.85, 0.8, boxTex.tableTop, boxTex.tableSide, boxTex.tableSide);
          m.position.set(cx, 0.425, cz);
          meshes.push(m);
          break;
        }
        case "photo": {
          const m = makeBox(0.84, 0.6, 0.8, boxTex.nightTop, boxTex.nightFront, boxTex.tableSide);
          m.position.set(cx, 0.3, cz);
          if (!billTexCache.photo) billTexCache.photo = makeTexture(def.grid, FURN_PAL, OUTLINE);
          const size = gridSize(def.grid);
          const b = makeBillboard(billTexCache.photo, size.w, size.h);
          setBillboardPos(b, cx, cz, size.h, 0.6, trailingEmptyRows(def.grid) / 16);
          meshes.push(m, b);
          break;
        }
        default: {
          // billboard debout (tv, douche, plante, étagère, borne, gorille…)
          if (!billTexCache[p.type]) billTexCache[p.type] = makeTexture(def.grid, FURN_PAL, OUTLINE);
          const size = gridSize(def.grid);
          const b = makeBillboard(billTexCache[p.type], size.w, size.h);
          setBillboardPos(b, cx, p.row + def.fh - 0.15, size.h, 0, trailingEmptyRows(def.grid) / 16);
          if (p.flip) b.scale.x = -1; // flèche des panneaux vers la gauche
          meshes.push(b);
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
  }

  // --- cœurs qui s'envolent ---
  function spawnHearts(x, yMap, n = 6) {
    for (let i = 0; i < n; i++) {
      const mesh = makeBillboard(heartTex, 0.5, 0.375);
      mesh.geometry = heartGeo;
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
  const camPos = { x: 13, z: 8 };
  function updateCamera(tx, ty, dt, snap = false) {
    const k = snap ? 1 : Math.min(1, dt * 6);
    camPos.x += (tx - camPos.x) * k;
    camPos.z += (ty - camPos.z) * k;
    const cx = Math.min(Math.max(camPos.x, Math.min(4, mapW / 2)), Math.max(mapW - 4, mapW / 2));
    const cz = Math.min(Math.max(camPos.z, Math.min(3, mapH / 2)), Math.max(mapH - 3, mapH / 2));
    camera.position.set(cx - fwdVec.x * camD, -fwdVec.y * camD, cz - fwdVec.z * camD);
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

  function addObj(...objs) {
    for (const o of objs) scene.add(o);
  }

  function render() {
    renderer.render(scene, camera);
  }

  return {
    camera,
    canvas,
    loadMap,
    addObj,
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
