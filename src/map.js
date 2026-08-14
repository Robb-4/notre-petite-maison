// Les cartes du jeu — chaque lieu est une carte séparée, reliée aux autres
// par des zones de sortie (on marche dessus → téléportation avec fondu).
// 1 caractère = 1 tuile :
//   # mur   . parquet   , carrelage   r tapis   g herbe   f fleurs
//   p chemin   k moquette d'arcade
import { FURNITURE } from "./sprites.js";

// ---------------------------------------------------------------------------
// LA PETITE MAISON (26 × 16) — chemin est → hôpital, chemin sud → Louvre
// ---------------------------------------------------------------------------
const HOME_GRID = [
  "ggggfggggggggggggggfgggggg",
  "g################gfggggggg",
  "g#......#,,,,,,,#ggggfgggg",
  "g#......#,,,,,,,#gggggggfg",
  "g#......#,,,,,,,#ggfgggggg",
  "g###.#######,####ggggggfgg",
  "g#,,,,,.........#ggggfgggg",
  "g#,,,,,.........#gfgggggfg",
  "g#,,,,,.........#gggfggggg",
  "g#.......rrrr...#ggfgggggg",
  "g#.......rrrr....ppppppppp", // → l'hôpital, à l'est
  "g#.......rrrr...#ggggpfggg",
  "g#..............#ggfgpgggg",
  "g################ggggpfggg",
  "gggggfgggggggggggggggpgggg",
  "ggggggggggfgggggggggfpgggg", // → le Louvre, au sud
];

// ---------------------------------------------------------------------------
// L'HÔPITAL (26 × 28) — porte à l'ouest → la maison
// lignes 3-7 : open space data + bureau de Sophie · lignes 9-18 : hall
// ligne 19+ : couloir de la machine à café + bureau des devs
// ---------------------------------------------------------------------------
function hospRow(r) {
  const W = 24;
  if (r < 2 || r > 26) return "g".repeat(W);
  if (r === 2 || r === 26) return "#".repeat(W);
  if (r >= 3 && r <= 7) return "#" + ",".repeat(13) + "#" + ".".repeat(8) + "#";
  if (r === 8) return "#" + "###" + "," + "#".repeat(9) + "#" + "###" + "." + "####" + "#";
  if (r === 19) return "#" + ",".repeat(6) + "#" + "##" + "." + "#".repeat(12) + "#";
  if (r >= 20 && r <= 25) return "#" + ",".repeat(6) + "#" + ".".repeat(15) + "#";
  return (r === 10 || r === 11 ? "," : "#") + ",".repeat(22) + "#";
}
const HOSPITAL_GRID = [];
for (let r = 0; r < 28; r++) {
  HOSPITAL_GRID.push((r === 10 ? "pp" : "gg") + hospRow(r));
}

// ---------------------------------------------------------------------------
// LE LOUVRE (32 × 14) — chemin nord → la maison, chemin sud → Paris
// galerie de la Joconde + esplanade avec la pyramide
// ---------------------------------------------------------------------------
const LOUVRE_GRID = [
  "g".repeat(28) + "p" + "ggg",                          // 0  → maison (nord)
  "gggg" + "###########" + "g".repeat(13) + "p" + "ggg", // 1  mur nord galerie
  "gggg" + "#.........#" + "g".repeat(13) + "p" + "ggg", // 2
  "gggg" + "#.........#" + "g".repeat(13) + "p" + "ggg", // 3
  "gggg" + "#.........#" + "g".repeat(13) + "p" + "ggg", // 4
  "gggg" + "#####.#####" + "g".repeat(13) + "p" + "ggg", // 5  porte de la galerie
  "ggg" + "p".repeat(26) + "ggg",                        // 6  esplanade
  "ggg" + "p".repeat(26) + "ggg",                        // 7
  "ggg" + "p".repeat(26) + "ggg",                        // 8
  "ggg" + "p".repeat(26) + "ggg",                        // 9
  "ggg" + "p".repeat(26) + "ggg",                        // 10
  "ggg" + "p".repeat(26) + "ggg",                        // 11
  "ggg" + "p".repeat(26) + "ggg",                        // 12
  "g".repeat(15) + "p" + "g".repeat(16),                 // 13 → Paris (sud)
];

// ---------------------------------------------------------------------------
// PARIS, LE QUARTIER DE LA SAINT-VALENTIN (32 × 14) — chemin nord → Louvre
// salle d'arcade + restaurant KONG
// ---------------------------------------------------------------------------
const PARIS_GRID = [
  "g".repeat(15) + "p" + "g".repeat(16),             // 0  → Louvre (nord)
  "g".repeat(15) + "p" + "g".repeat(16),             // 1
  "gggg" + "p".repeat(27) + "g",                     // 2  la rue
  "ggggg" + "#####.#####" + "ggg" + "######.######", // 3  façades + portes
  "ggggg" + "#kkkkkkkkk#" + "ggg" + "#...........#", // 4
  "ggggg" + "#kkkkkkkkk#" + "ggg" + "#...........#", // 5
  "ggggg" + "#kkkkkkkkk#" + "ggg" + "#...........#", // 6
  "ggggg" + "#kkkkkkkkk#" + "ggg" + "#...........#", // 7
  "ggggg" + "#kkkkkkkkk#" + "ggg" + "#...........#", // 8
  "ggggg" + "#kkkkkkkkk#" + "ggg" + "#...........#", // 9
  "ggggg" + "#kkkkkkkkk#" + "ggg" + "#...........#", // 10
  "ggggg" + "###########" + "ggg" + "#############", // 11
  "g".repeat(32),                                    // 12
  "g".repeat(32),                                    // 13
];

export const TILE_DEFS = {
  "#": { tile: "wall", solid: true },
  ".": { tile: "wood" },
  ",": { tile: "tileFloor" },
  r: { tile: "rug" },
  g: { tile: "grass" },
  f: { tile: "flowers" },
  p: { tile: "path" },
  k: { tile: "arcadeFloor" },
};

// ---------------------------------------------------------------------------
// LES CARTES — placements en coordonnées locales, sorties (zones de tp)
// ---------------------------------------------------------------------------
export const MAPS = {
  home: {
    name: "🏠 La petite maison",
    grid: HOME_GRID,
    placements: [
      { type: "bed", col: 2, row: 2 },
      { type: "photo", col: 3, row: 2 },
      { type: "bookshelf", col: 5, row: 2 },
      { type: "plant", col: 7, row: 2 },
      { type: "shower", col: 14, row: 2 },
      { type: "fridge", col: 2, row: 6 },
      { type: "stove", col: 3, row: 6 },
      { type: "table", col: 5, row: 7 },
      { type: "couch", col: 10, row: 9 },
      { type: "tv", col: 10, row: 12 },
      { type: "bookshelf", col: 15, row: 6 },
      { type: "plant", col: 15, row: 12 },
      { type: "lost_item", col: 23, row: 12 },
      // panneaux directionnels aux départs de chemin
      { type: "signpost", col: 24, row: 9, label: "→ L'hôpital (à l'est)" },
      { type: "signpost", col: 22, row: 14, flip: true, label: "→ Le Louvre (au sud)" },
    ],
    exits: [
      { x0: 24.7, y0: 9.5, x1: 26, y1: 11.5, to: "hospital", at: { x: 1.5, y: 10.5 } },
      { x0: 20.4, y0: 15.2, x1: 22.6, y1: 16, to: "louvre", at: { x: 28.5, y: 1.2 } },
    ],
  },

  hospital: {
    name: "🏥 L'hôpital",
    grid: HOSPITAL_GRID,
    placements: [
      // open space data
      { type: "bookshelf", col: 3, row: 3 },
      { type: "desk", col: 4, row: 3 },
      { type: "desk", col: 8, row: 3 },
      { type: "her_desk", col: 12, row: 3 },
      { type: "plant", col: 15, row: 3 },
      // bureau de Sophie
      { type: "bookshelf", col: 17, row: 3 },
      { type: "desk", col: 20, row: 3 },
      { type: "plant", col: 24, row: 3 },
      // hall
      { type: "counter", col: 6, row: 13 },
      { type: "counter", col: 7, row: 13 },
      { type: "plant", col: 3, row: 9 },
      { type: "plant", col: 24, row: 9 },
      { type: "plant", col: 24, row: 16 },
      // couloir sud + bureau des devs
      { type: "coffee", col: 4, row: 25 },
      { type: "plant", col: 3, row: 20 },
      { type: "desk", col: 11, row: 20 },
      { type: "desk", col: 15, row: 20 },
      { type: "desk", col: 19, row: 20 },
      { type: "bookshelf", col: 23, row: 20 },
      { type: "table", col: 14, row: 23 },
      { type: "plant", col: 24, row: 25 },
      // panneau devant l'entrée
      { type: "sign", col: 0, row: 9 },
      { type: "signpost", col: 1, row: 12, flip: true, label: "→ La maison (à l'ouest)" },
    ],
    exits: [{ x0: 0, y0: 9.6, x1: 0.6, y1: 11.6, to: "home", at: { x: 24, y: 10.5 } }],
  },

  louvre: {
    name: "🖼️ Le Louvre",
    grid: LOUVRE_GRID,
    placements: [
      { type: "painting", col: 6, row: 2 },
      { type: "joconde", col: 9, row: 2 },
      { type: "painting", col: 12, row: 2 },
      { type: "pyramid", col: 17, row: 8 },
      { type: "plant", col: 4, row: 7 },
      { type: "plant", col: 26, row: 7 },
      { type: "plant", col: 4, row: 11 },
      { type: "plant", col: 26, row: 11 },
      { type: "signpost", col: 27, row: 1, label: "→ La maison (au nord)" },
      { type: "signpost", col: 16, row: 12, flip: true, label: "→ Paris : arcade & KONG" },
    ],
    exits: [
      { x0: 27.4, y0: 0, x1: 29.6, y1: 0.6, to: "home", at: { x: 21.5, y: 14.5 } },
      { x0: 14.4, y0: 13.4, x1: 16.6, y1: 14, to: "paris", at: { x: 15.5, y: 1.2 } },
    ],
  },

  paris: {
    name: "🕹️ Paris — arcade & KONG",
    grid: PARIS_GRID,
    placements: [
      // la salle d'arcade
      { type: "borne", col: 6, row: 4 },
      { type: "borne", col: 8, row: 4 },
      { type: "borne", col: 12, row: 4 },
      { type: "borne", col: 14, row: 6 },
      { type: "table", col: 9, row: 7 },
      { type: "plant", col: 6, row: 9 },
      // le restaurant KONG
      { type: "kong_statue", col: 28, row: 4 },
      { type: "resto_table", col: 21, row: 5 },
      { type: "resto_table", col: 24, row: 6 },
      { type: "resto_table", col: 27, row: 5 },
      { type: "resto_table", col: 21, row: 8 },
      { type: "resto_table", col: 27, row: 8 },
      { type: "counter", col: 30, row: 6 },
      { type: "counter", col: 30, row: 7 },
      { type: "plant", col: 20, row: 9 },
      { type: "signpost", col: 16, row: 1, label: "→ Le Louvre (au nord)" },
    ],
    exits: [{ x0: 14.4, y0: 0, x1: 16.6, y1: 0.6, to: "louvre", at: { x: 15.5, y: 12.5 } }],
  },
};

// chaque carte connaît son propre identifiant
for (const [id, def] of Object.entries(MAPS)) def.id = id;

// Points d'apparition et ancrages (coordonnées locales à chaque carte)
export const SPAWNS = {
  player: { x: 8.5, y: 9.5 }, // maison
  // Robin : au bureau des devs (hôpital) tant que la rencontre n'a pas eu lieu
  partner: { x: 19.5, y: 22.5 },
  partnerDev: { x: 19.5, y: 22.5 },
  partnerDay: { x: 13.5, y: 8.5 }, // maison, une fois ensemble
  partnerEvening: { x: 12.5, y: 10.5 },
  partnerLouvre: { x: 21.5, y: 8.5 },
  partnerArcade: { x: 12.5, y: 7.5 },
  partnerKong: { x: 24.5, y: 7.6 },
  // l'équipe data (hôpital)
  sophie: { x: 20.5, y: 5.5 },
  romain: { x: 4.5, y: 5.5 },
  arij: { x: 8.5, y: 5.5 },
  // les devs (hôpital)
  mahrez: { x: 11.5, y: 22.5 },
  david: { x: 15.5, y: 22.5 },
};

// Grille de collision d'une carte : murs + meubles solides. Hors carte = solide.
export function buildCollision(mapDef) {
  const grid = mapDef.grid;
  const h = grid.length;
  const w = grid[0].length;
  const solid = [];
  for (let row = 0; row < h; row++) {
    solid.push([]);
    for (let col = 0; col < w; col++) {
      solid[row].push(!!TILE_DEFS[grid[row][col]]?.solid);
    }
  }
  for (const p of mapDef.placements) {
    const def = FURNITURE[p.type];
    if (!def.solid) continue;
    for (let dy = 0; dy < def.fh; dy++) {
      for (let dx = 0; dx < def.fw; dx++) {
        if (solid[p.row + dy]) solid[p.row + dy][p.col + dx] = true;
      }
    }
  }
  return function isSolid(col, row) {
    if (col < 0 || row < 0 || col >= w || row >= h) return true;
    return solid[row][col];
  };
}
