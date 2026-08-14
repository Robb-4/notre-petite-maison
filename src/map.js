// Grande carte : la maison (à l'ouest), le chemin, et l'hôpital (à l'est).
// 1 caractère = 1 tuile :
//   # mur   . parquet   , carrelage   r tapis   g herbe   f fleurs   p chemin
import { FURNITURE } from "./sprites.js";

// --- la maison + son jardin (colonnes 0..25, lignes 0..15) ---
const HOUSE = [
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
  "g#.......rrrr....ppppppppp", // le chemin part du jardin vers l'est
  "g#.......rrrr...#gggggfggg",
  "g#..............#ggfgggggg",
  "g################gggggfggg",
  "gggggfgggggggggggggggggggg",
  "ggggggggggfgggggggggfggggg",
];

// --- l'hôpital (colonnes 32..55, lignes 2..26) ---
// ligne 2 : mur nord · lignes 3-7 : open space (carrelage) + bureau de Sophie
// (parquet) · ligne 8 : mur avec deux portes · lignes 9-25 : hall d'accueil
// (porte d'entrée à l'ouest, lignes 10-11) · ligne 26 : mur sud
const HOSP_W = 24;
function hospRow(r) {
  if (r < 2 || r > 26) return "g".repeat(HOSP_W);
  if (r === 2 || r === 26) return "#".repeat(HOSP_W);
  if (r >= 3 && r <= 7) return "#" + ",".repeat(13) + "#" + ".".repeat(8) + "#";
  if (r === 8) return "#" + "###" + "," + "#".repeat(9) + "#" + "###" + "." + "####" + "#";
  return (r === 10 || r === 11 ? "," : "#") + ",".repeat(22) + "#";
}

// --- bande intermédiaire (colonnes 26..31) : pelouse + chemin ligne 10 ---
function midRow(r) {
  return r === 10 ? "pppppp" : "gggggg";
}

export const MAP = [];
for (let r = 0; r < 30; r++) {
  const west = r < HOUSE.length ? HOUSE[r] : "g".repeat(26);
  MAP.push(west + midRow(r) + hospRow(r));
}

export const MAP_H = MAP.length;
export const MAP_W = MAP[0].length;

export const TILE_DEFS = {
  "#": { tile: "wall", solid: true },
  ".": { tile: "wood" },
  ",": { tile: "tileFloor" },
  r: { tile: "rug" },
  g: { tile: "grass" },
  f: { tile: "flowers" },
  p: { tile: "path" },
};

// Meubles : col/row = tuile en haut à gauche de l'empreinte au sol
export const PLACEMENTS = [
  // chambre
  { type: "bed", col: 2, row: 2 },
  { type: "photo", col: 3, row: 2 }, // table de nuit + photo souvenir
  { type: "bookshelf", col: 5, row: 2 },
  { type: "plant", col: 7, row: 2 },
  // salle de bain
  { type: "shower", col: 14, row: 2 },
  // cuisine
  { type: "fridge", col: 2, row: 6 },
  { type: "stove", col: 3, row: 6 },
  { type: "table", col: 5, row: 7 },
  // salon
  { type: "couch", col: 10, row: 9 },
  { type: "tv", col: 10, row: 12 },
  { type: "bookshelf", col: 15, row: 6 },
  { type: "plant", col: 15, row: 12 },
  // jardin — la fameuse chaussette (invisible tant que la quête ne la cherche pas)
  { type: "lost_item", col: 21, row: 11 },

  // hôpital — open space data
  { type: "bookshelf", col: 33, row: 3 },
  { type: "desk", col: 34, row: 3 },
  { type: "desk", col: 38, row: 3 },
  { type: "her_desk", col: 42, row: 3 },
  { type: "plant", col: 45, row: 3 },
  // bureau de Sophie
  { type: "bookshelf", col: 47, row: 3 },
  { type: "desk", col: 50, row: 3 },
  { type: "plant", col: 54, row: 3 },
  // hall d'accueil
  { type: "counter", col: 36, row: 13 },
  { type: "counter", col: 37, row: 13 },
  { type: "plant", col: 33, row: 9 },
  { type: "plant", col: 54, row: 9 },
  { type: "table", col: 48, row: 20 },
  { type: "plant", col: 54, row: 25 },
  // panneau devant l'entrée
  { type: "sign", col: 30, row: 9 },
];

export const SPAWNS = {
  player: { x: 8.5, y: 9.5 },
  partner: { x: 13.5, y: 8.5 },
  partnerDay: { x: 13.5, y: 8.5 },
  partnerEvening: { x: 12.5, y: 10.5 },
  // collègues de l'hôpital
  sophie: { x: 50.5, y: 5.5 },
  romain: { x: 34.5, y: 5.5 },
  arij: { x: 38.5, y: 5.5 },
};

// Grille de collision : murs + meubles solides. Hors carte = solide.
export function buildCollision() {
  const solid = [];
  for (let row = 0; row < MAP_H; row++) {
    solid.push([]);
    for (let col = 0; col < MAP_W; col++) {
      solid[row].push(!!TILE_DEFS[MAP[row][col]]?.solid);
    }
  }
  for (const p of PLACEMENTS) {
    const def = FURNITURE[p.type];
    if (!def.solid) continue;
    for (let dy = 0; dy < def.fh; dy++) {
      for (let dx = 0; dx < def.fw; dx++) {
        if (solid[p.row + dy]) solid[p.row + dy][p.col + dx] = true;
      }
    }
  }
  return function isSolid(col, row) {
    if (col < 0 || row < 0 || col >= MAP_W || row >= MAP_H) return true;
    return solid[row][col];
  };
}
