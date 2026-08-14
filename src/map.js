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
// ligne 2 : mur nord · lignes 3-7 : open space data (carrelage) + bureau de
// Sophie (parquet) · ligne 8 : mur avec deux portes · lignes 9-18 : hall
// d'accueil (porte d'entrée à l'ouest, lignes 10-11) · ligne 19 : mur avec la
// porte du bureau des devs · lignes 20-25 : couloir de la machine à café (à
// l'ouest) + bureau des devs (parquet, au sud-est) · ligne 26 : mur sud
const HOSP_W = 24;
function hospRow(r) {
  if (r < 2 || r > 26) return "g".repeat(HOSP_W);
  if (r === 2 || r === 26) return "#".repeat(HOSP_W);
  if (r >= 3 && r <= 7) return "#" + ",".repeat(13) + "#" + ".".repeat(8) + "#";
  if (r === 8) return "#" + "###" + "," + "#".repeat(9) + "#" + "###" + "." + "####" + "#";
  if (r === 19) return "#" + ",".repeat(6) + "#" + "##" + "." + "#".repeat(12) + "#";
  if (r >= 20 && r <= 25) return "#" + ",".repeat(6) + "#" + ".".repeat(15) + "#";
  return (r === 10 || r === 11 ? "," : "#") + ",".repeat(22) + "#";
}

// --- bande intermédiaire (colonnes 26..31) : pelouse + chemins ---
// ligne 10 : chemin vers l'hôpital ; colonne 28 : chemin vers le Louvre (sud)
function midRow(r) {
  if (r === 10) return "pppppp";
  return "ggpggg"; // col 28 = chemin du Louvre
}

// --- le Louvre (colonnes 0..31, lignes 16..29) ---
// galerie de la Joconde (cols 4-14) + esplanade avec la pyramide de verre
const SOUTH = [
  "g".repeat(28) + "p" + "ggg",                          // 16
  "gggg" + "###########" + "g".repeat(13) + "p" + "ggg", // 17 mur nord galerie
  "gggg" + "#.........#" + "g".repeat(13) + "p" + "ggg", // 18
  "gggg" + "#.........#" + "g".repeat(13) + "p" + "ggg", // 19
  "gggg" + "#.........#" + "g".repeat(13) + "p" + "ggg", // 20
  "gggg" + "#####.#####" + "g".repeat(13) + "p" + "ggg", // 21 porte de la galerie
  "ggg" + "p".repeat(26) + "ggg",                        // 22 esplanade
  "ggg" + "p".repeat(26) + "ggg",                        // 23
  "ggg" + "p".repeat(26) + "ggg",                        // 24
  "ggg" + "p".repeat(26) + "ggg",                        // 25
  "ggg" + "p".repeat(26) + "ggg",                        // 26
  "ggg" + "p".repeat(26) + "ggg",                        // 27
  "ggg" + "p".repeat(26) + "ggg",                        // 28
  "g".repeat(15) + "p" + "g".repeat(16),                 // 29 chemin vers Paris
];

// --- le quartier parisien (colonnes 0..31, lignes 30..43) ---
// salle d'arcade (cols 5-15, sol sombre) et restaurant KONG (cols 19-31),
// reliés par une rue ; chemin depuis l'esplanade du Louvre (col 15)
const PARIS = [
  "g".repeat(15) + "p" + "g".repeat(16),                       // 30
  "g".repeat(15) + "p" + "g".repeat(16),                       // 31
  "gggg" + "p".repeat(27) + "g",                               // 32 la rue
  "ggggg" + "#####.#####" + "ggg" + "######.######",           // 33 façades + portes
  "ggggg" + "#kkkkkkkkk#" + "ggg" + "#...........#",           // 34
  "ggggg" + "#kkkkkkkkk#" + "ggg" + "#...........#",           // 35
  "ggggg" + "#kkkkkkkkk#" + "ggg" + "#...........#",           // 36
  "ggggg" + "#kkkkkkkkk#" + "ggg" + "#...........#",           // 37
  "ggggg" + "#kkkkkkkkk#" + "ggg" + "#...........#",           // 38
  "ggggg" + "#kkkkkkkkk#" + "ggg" + "#...........#",           // 39
  "ggggg" + "#kkkkkkkkk#" + "ggg" + "#...........#",           // 40
  "ggggg" + "###########" + "ggg" + "#############",           // 41
  "g".repeat(32),                                              // 42
  "g".repeat(32),                                              // 43
];

export const MAP = [];
for (let r = 0; r < 44; r++) {
  let west;
  if (r < 16) west = HOUSE[r] + midRow(r);
  else if (r < 30) west = SOUTH[r - 16];
  else west = PARIS[r - 30];
  MAP.push(west + hospRow(r));
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
  k: { tile: "arcadeFloor" },
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
  { type: "plant", col: 54, row: 16 },
  // couloir sud : LA machine à café
  { type: "coffee", col: 34, row: 25 },
  { type: "plant", col: 33, row: 20 },
  // bureau des devs
  { type: "desk", col: 41, row: 20 },
  { type: "desk", col: 45, row: 20 },
  { type: "desk", col: 49, row: 20 },
  { type: "bookshelf", col: 53, row: 20 },
  { type: "table", col: 44, row: 23 },
  { type: "plant", col: 54, row: 25 },
  // panneau devant l'entrée
  { type: "sign", col: 30, row: 9 },

  // le Louvre — galerie
  { type: "painting", col: 6, row: 18 },
  { type: "joconde", col: 9, row: 18 },
  { type: "painting", col: 12, row: 18 },
  // esplanade : la pyramide de verre + verdure
  { type: "pyramid", col: 17, row: 24 },
  { type: "plant", col: 4, row: 23 },
  { type: "plant", col: 26, row: 23 },
  { type: "plant", col: 4, row: 27 },
  { type: "plant", col: 26, row: 27 },

  // la salle d'arcade
  { type: "borne", col: 6, row: 34 },
  { type: "borne", col: 8, row: 34 },
  { type: "borne", col: 12, row: 34 },
  { type: "borne", col: 14, row: 36 },
  { type: "table", col: 9, row: 37 },
  { type: "plant", col: 6, row: 39 },

  // le restaurant KONG
  { type: "kong_statue", col: 28, row: 34 },
  { type: "resto_table", col: 21, row: 35 },
  { type: "resto_table", col: 24, row: 36 },
  { type: "resto_table", col: 27, row: 35 },
  { type: "resto_table", col: 21, row: 38 },
  { type: "resto_table", col: 27, row: 38 },
  { type: "counter", col: 30, row: 36 },
  { type: "counter", col: 30, row: 37 },
  { type: "plant", col: 20, row: 39 },
];

export const SPAWNS = {
  player: { x: 8.5, y: 9.5 },
  // Robin commence au bureau des devs — la rencontre n'a pas encore eu lieu !
  partner: { x: 49.5, y: 22.5 },
  partnerDev: { x: 49.5, y: 22.5 },
  partnerDay: { x: 13.5, y: 8.5 },
  partnerEvening: { x: 12.5, y: 10.5 },
  // l'équipe data
  sophie: { x: 50.5, y: 5.5 },
  romain: { x: 34.5, y: 5.5 },
  arij: { x: 38.5, y: 5.5 },
  // les devs
  mahrez: { x: 41.5, y: 22.5 },
  david: { x: 45.5, y: 22.5 },
  // Robin qui attend sur l'esplanade du Louvre, le jour J
  partnerLouvre: { x: 21.5, y: 24.5 },
  // la Saint-Valentin : l'arcade puis le KONG
  partnerArcade: { x: 12.5, y: 37.5 },
  partnerKong: { x: 24.5, y: 37.6 },
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
