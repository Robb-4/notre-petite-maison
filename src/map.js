// Plan de la maison + jardin. 1 caractère = 1 tuile.
//   # mur   . parquet   , carrelage   r tapis   g herbe   f fleurs   p chemin
import { FURNITURE } from "./sprites.js";

export const MAP = [
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
  "g#.......rrrr....pppppgfgg",
  "g#.......rrrr...#gggggfggg",
  "g#..............#ggfgggggg",
  "g################gggggfggg",
  "gggggfgggggggggggggggggggg",
  "ggggggggggfgggggggggfggggg",
];

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
];

export const SPAWNS = {
  player: { x: 8.5, y: 9.5 },
  partner: { x: 13.5, y: 8.5 },
  partnerDay: { x: 13.5, y: 8.5 },
  partnerEvening: { x: 12.5, y: 10.5 },
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
