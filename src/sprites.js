// Tout le pixel art du jeu, en grilles de texte : 1 caractère = 1 pixel.
// "." = transparent. Les lettres pointent vers une palette de couleurs.

// ---------------------------------------------------------------------------
// PERSONNAGES — 12x16 px. Palette fournie par data.js :
//   H cheveux, S peau, K yeux, T haut/robe, P jambes/pantalon, F chaussures
// Directions : down / up / side (side = regarde à DROITE, miroir pour gauche)
// Frames : idle + step (alternées en marchant)
// ---------------------------------------------------------------------------

// --- Elle : cheveux longs + robe ---
const P_DOWN_IDLE = [
  "....HHHH....",
  "...HHHHHH...",
  "..HHHHHHHH..",
  "..HHSSSSHH..",
  "..HSKSSKSH..",
  "..HSSSSSSH..",
  "..HH.SS.HH..",
  "..HTTTTTTH..",
  "..HTTTTTTH..",
  ".STTTTTTTTS.",
  ".TTTTTTTTTT.",
  ".TTTTTTTTTT.",
  ".TTTTTTTTTT.",
  "....P..P....",
  "....F..F....",
  "............",
];
const P_DOWN_STEP = [
  ...P_DOWN_IDLE.slice(0, 13),
  "...P....P...",
  "...F....F...",
  "............",
];
const P_UP_IDLE = [
  "....HHHH....",
  "...HHHHHH...",
  "..HHHHHHHH..",
  "..HHHHHHHH..",
  "..HHHHHHHH..",
  "..HHHHHHHH..",
  "..HHHHHHHH..",
  "..HHHHHHHH..",
  "..HHHHHHHH..",
  ".SHHHHHHHHS.",
  ".TTHHHHHHTT.",
  ".TTTHHHHTTT.",
  ".TTTTTTTTTT.",
  "....P..P....",
  "....F..F....",
  "............",
];
const P_UP_STEP = [
  ...P_UP_IDLE.slice(0, 13),
  "...P....P...",
  "...F....F...",
  "............",
];
const P_SIDE_IDLE = [
  "....HHHH....",
  "...HHHHHH...",
  "..HHHHHHHH..",
  "..HHHSSSS...",
  "..HHHSSKS...",
  "..HHHSSSS...",
  "..HHH.SS....",
  "..HHTTTT....",
  "..HHTTTTT...",
  "..HTTTTTTS..",
  "..TTTTTTTT..",
  "..TTTTTTTT..",
  "..TTTTTTTT..",
  ".....PP.....",
  ".....FF.....",
  "............",
];
const P_SIDE_STEP = [
  ...P_SIDE_IDLE.slice(0, 13),
  "....P..P....",
  "....F..F....",
  "............",
];

// --- Lui : cheveux courts + t-shirt/pantalon ---
const R_DOWN_IDLE = [
  "....HHHH....",
  "...HHHHHH...",
  "...HHHHHH...",
  "...HSSSSH...",
  "...SKSSKS...",
  "...SSSSSS...",
  "....SSSS....",
  "...TTTTTT...",
  "..TTTTTTTT..",
  ".STTTTTTTTS.",
  "..TTTTTTTT..",
  "...PPPPPP...",
  "...PP..PP...",
  "...PP..PP...",
  "...FF..FF...",
  "............",
];
const R_DOWN_STEP = [
  ...R_DOWN_IDLE.slice(0, 12),
  "..PP....PP..",
  "..PP....PP..",
  "..FF....FF..",
  "............",
];
const R_UP_IDLE = [
  "....HHHH....",
  "...HHHHHH...",
  "...HHHHHH...",
  "...HHHHHH...",
  "...SHHHHS...",
  "...SSSSSS...",
  "....SSSS....",
  "...TTTTTT...",
  "..TTTTTTTT..",
  ".STTTTTTTTS.",
  "..TTTTTTTT..",
  "...PPPPPP...",
  "...PP..PP...",
  "...PP..PP...",
  "...FF..FF...",
  "............",
];
const R_UP_STEP = [
  ...R_UP_IDLE.slice(0, 12),
  "..PP....PP..",
  "..PP....PP..",
  "..FF....FF..",
  "............",
];
const R_SIDE_IDLE = [
  "....HHHH....",
  "...HHHHHH...",
  "...HHHHHH...",
  "...HHSSSS...",
  "...HHSSKS...",
  "...HHSSSS...",
  ".....SSS....",
  "....TTTT....",
  "...TTTTTT...",
  "...TTTTTTS..",
  "...TTTTTT...",
  "....PPPP....",
  "....PPP.....",
  "....PPP.....",
  "....FFF.....",
  "............",
];
const R_SIDE_STEP = [
  ...R_SIDE_IDLE.slice(0, 12),
  "...PP.PP....",
  "...PP..PP...",
  "...FF..FF...",
  "............",
];

// spriteSet: "her" (cheveux longs + robe) ou "him" (cheveux courts + pantalon)
export const CHAR_SPRITES = {
  her: {
    down: { idle: P_DOWN_IDLE, step: P_DOWN_STEP },
    up: { idle: P_UP_IDLE, step: P_UP_STEP },
    side: { idle: P_SIDE_IDLE, step: P_SIDE_STEP },
  },
  him: {
    down: { idle: R_DOWN_IDLE, step: R_DOWN_STEP },
    up: { idle: R_UP_IDLE, step: R_UP_STEP },
    side: { idle: R_SIDE_IDLE, step: R_SIDE_STEP },
  },
};

// ---------------------------------------------------------------------------
// MEUBLES — palette partagée
// ---------------------------------------------------------------------------
export const FURN_PAL = {
  W: "#6e4226", // bois foncé
  w: "#9c6238", // bois clair
  L: "#f5f0e4", // draps
  l: "#dcd4bf", // draps ombre
  B: "#e5798f", // couverture
  b: "#c25a72", // couverture ombre
  R: "#e04a54", // rouge / cœur
  U: "#5fa8a0", // canapé
  u: "#47827c", // canapé ombre
  E: "#8ed0c8", // coussin
  e: "#69b0a8", // coussin ombre
  M: "#e9edf0", // blanc électroménager
  m: "#c2ccd2", // blanc ombre
  D: "#4a4553", // gris foncé
  K: "#26222e", // presque noir
  C: "#bfe8f2", // verre
  c: "#204a5c", // écran éteint
  s: "#8fd8ea", // reflet écran
  A: "#6db6d8", // goutte d'eau
  G: "#3f8f3f", // feuille foncée
  g: "#63b953", // feuille claire
  P: "#b0562f", // pot terre cuite
  p: "#8c4222", // pot ombre
  Y: "#f2c94c", // jaune
  N: "#35507a", // bleu marine
  O: "#e8853d", // orange
  V: "#a86fd6", // violet
};

const BED = [
  "WWWWWWWWWWWWWWWW",
  "WwwwwwwwwwwwwwW",
  "WwwwwwwwwwwwwwW",
  "WWWWWWWWWWWWWWWW",
  "WLLLLLLLLLLLLLLW",
  "WLLLLLLLLLLLLLLW",
  "WLLLLLLLLLLLLLLW",
  "WllllllllllllllW",
  "WLLLLLLLLLLLLLLW",
  "WllllllllllllllW",
  "WBBBBBBBBBBBBBBW",
  "WBBBBBBBBBBBBBBW",
  "WbbbbbbbbbbbbbbW",
  "WBBBBBBBBBBBBBBW",
  "WBBBBBBBBBBBBBBW",
  "WBBBBRRBBRRBBBBW",
  "WBBBRRRRRRRRBBBW",
  "WBBBRRRRRRRRBBBW",
  "WBBBBRRRRRRBBBBW",
  "WBBBBBRRRRBBBBBW",
  "WBBBBBBRRBBBBBBW",
  "WBBBBBBBBBBBBBBW",
  "WBBBBBBBBBBBBBBW",
  "WBBBBBBBBBBBBBBW",
  "WbbbbbbbbbbbbbbW",
  "WBBBBBBBBBBBBBBW",
  "WBBBBBBBBBBBBBBW",
  "WBBBBBBBBBBBBBBW",
  "WbbbbbbbbbbbbbbW",
  "WWWWWWWWWWWWWWWW",
  "WwwwwwwwwwwwwwW",
  "WWWWWWWWWWWWWWWW",
];

const COUCH = [
  "UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU",
  "UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU",
  "UuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuU",
  "UUEEEEEEEEEEEEEUUEEEEEEEEEEEEEUU",
  "UUEEEEEEEEEEEEEUUEEEEEEEEEEEEEUU",
  "UUEEEEEEEEEEEEEUUEEEEEEEEEEEEEUU",
  "UUEEEEEEEEEEEEEUUEEEEEEEEEEEEEUU",
  "UUeeeeeeeeeeeeeUUeeeeeeeeeeeeeUU",
  "UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU",
  "UuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuU",
  "UuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuU",
  "UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU",
  "..WW........................WW..",
  "..WW........................WW..",
  "................................",
  "................................",
];

const TV = [
  "..........KKKKKKKKKKKK..........",
  "..........KccccccccccK..........",
  "..........KcccccccsccK..........",
  "..........KccccccscccK..........",
  "..........KcccccsccccK..........",
  "..........KccccccccccK..........",
  "..........KKKKKKKKKKKK..........",
  "...............KK...............",
  "..WWWWWWWWWWWWWWWWWWWWWWWWWWWW..",
  "..WwwwwwwwwwwwwwwwwwwwwwwwwwwW..",
  "..WwwwwwwwwwwwwwwwwwwwwwwwwwwW..",
  "..WWWWWWWWWWWWWWWWWWWWWWWWWWWW..",
  "..WW........................WW..",
  "................................",
  "................................",
  "................................",
];

const FRIDGE = [
  ".MMMMMMMMMMMMMM.",
  ".MMMMMMMMMMMMMM.",
  ".MMMMMMMMMMMMDM.",
  ".MMMRMMMMMMMMDM.",
  ".MMMMMMYMMMMMDM.",
  ".MMMMMMMMMMMMMM.",
  ".MMMMMMMMMMMMMM.",
  ".mmmmmmmmmmmmmm.",
  ".MMMMMMMMMMMMMM.",
  ".MMMMMMMMMMMMDM.",
  ".MMMMMMMMMMMMDM.",
  ".MMMMMMMMMMMMDM.",
  ".MMMMMMMMMMMMMM.",
  ".MMGMMMMMMMMMMM.",
  ".MMMMMMMMMMMMMM.",
  ".MMMMMMMMMMMMMM.",
  ".MMMMMMMMMMMMMM.",
  ".MMMMMMMMMMMMMM.",
  ".MMMMMMMMMMMMMM.",
  ".MMMMMMMMMMMMMM.",
  ".mmmmmmmmmmmmmm.",
  ".MMMMMMMMMMMMMM.",
  ".mmmmmmmmmmmmmm.",
  "..D..........D..",
];

const STOVE = [
  "MMMMMMMMMMMMMMMM",
  "MKKKMMKKKMMKKKMM",
  "MKKKMMKKKMMKKKMM",
  "MMMMMMMMMMMMMMMM",
  "MMDMMDMMDMMDMMMM",
  "MmmmmmmmmmmmmmmM",
  "MmKKKKKKKKKKKKmM",
  "MmKDDDDDDDDDDKmM",
  "MmKDDDDDDDDDDKmM",
  "MmKDDDDDDDDDDKmM",
  "MmKKKKKKKKKKKKmM",
  "MmmmmmmmmmmmmmmM",
  "MMMMMMMMMMMMMMMM",
  "MMMMMMMMMMMMMMMM",
  ".D............D.",
  "................",
];

const SHOWER = [
  "DDDDDDDDDDDDDDDD",
  "DCCCCCCCCCCCCCCD",
  "DCCCCCCMMMCCCCCD",
  "DCCCCCCMMMCCCCCD",
  "DCCCCCCACACCCCCD",
  "DCCCCCCCACCCCCCD",
  "DCCCCCCACACCCCCD",
  "DCCCCCCCACCCCCCD",
  "DCCCCCCACACCCCCD",
  "DCCCCCCCCCCCCCCD",
  "DCCCCCCCCCCCCCCD",
  "DCCCCCCCCCCCCCCD",
  "DCCCCCCCCCCCCCCD",
  "DCCCCCCCCCCCCCCD",
  "DCCCCCCCCCCCCCCD",
  "DCCCCCCCCCCCCCCD",
  "DCCCCCCCCCCCCCCD",
  "DCCCCCCCCCCCCCCD",
  "DCCCCCCCCCCCCCCD",
  "DCCCCCCCCCCCCCCD",
  "DMMMMMMMMMMMMMMD",
  "DmmmmmmmmmmmmmmD",
  "DDDDDDDDDDDDDDDD",
  "................",
];

const PLANT = [
  "......GgG.......",
  "....GGgGGgG.....",
  "...GgGGgGGGgG...",
  "..GGgGGGgGGGGg..",
  "..gGGGGgGGgGGG..",
  "...GGgGGGGgGG...",
  "....GGGgGG......",
  "......GG........",
  "....PPPPPPPP....",
  "....PppppppP....",
  ".....PPPPPP.....",
  ".....PPPPPP.....",
  ".....pppppp.....",
  "................",
  "................",
  "................",
];

const BOOKSHELF = [
  "WWWWWWWWWWWWWWWW",
  "WwwwwwwwwwwwwwW",
  "WWWWWWWWWWWWWWWW",
  "WRRNNYYGGOOCCNNW",
  "WRRNNYYGGOOCCNNW",
  "WRRNNYYGGOOCCNNW",
  "WRRNNYYGGOOCCNNW",
  "WRRNNYYGGOOCCNNW",
  "WWWWWWWWWWWWWWWW",
  "WYYOOKCCNNRRGGYW",
  "WYYOOKCCNNRRGGYW",
  "WYYOOKCCNNRRGGYW",
  "WYYOOKCCNNRRGGYW",
  "WYYOOKCCNNRRGGYW",
  "WWWWWWWWWWWWWWWW",
  "WNNGGRRKYYOOCCNW",
  "WNNGGRRKYYOOCCNW",
  "WNNGGRRKYYOOCCNW",
  "WNNGGRRKYYOOCCNW",
  "WNNGGRRKYYOOCCNW",
  "WWWWWWWWWWWWWWWW",
  "WwwwwwwwwwwwwwW",
  "WWWWWWWWWWWWWWWW",
  "................",
];

const TABLE = [
  "....R.Y.V.......",
  "....YRVYR.......",
  ".....GGG........",
  ".....MMM........",
  ".....MMM........",
  "..WWWWWWWWWWWW..",
  "..WwwwwwwwwwwW..",
  "..WWWWWWWWWWWW..",
  "...W........W...",
  "...W........W...",
  "...W........W...",
  "................",
  "................",
  "................",
  "................",
  "................",
];

const SOCK = [
  "..NNNNN.....",
  "..NNNNN.....",
  "..NNNNN.....",
  "..NNNNN.....",
  "..NNNNNN....",
  "..NNNNNNNN..",
  "..NNNNNNMM..",
  "..NNNNNNMM..",
  "...NNNNMM...",
  "............",
];

export const HEART = [
  ".RR..RR.",
  "RRRRRRRR",
  "RRRRRRRR",
  ".RRRRRR.",
  "..RRRR..",
  "...RR...",
];

// fw/fh = empreinte au sol en tuiles (collision) ; la taille visuelle vient de
// la grille (16 px = 1 tuile). solid=false → traversable (juste interactable).
export const FURNITURE = {
  bed: { grid: BED, fw: 1, fh: 2, solid: true },
  couch: { grid: COUCH, fw: 2, fh: 1, solid: true },
  tv: { grid: TV, fw: 2, fh: 1, solid: true },
  fridge: { grid: FRIDGE, fw: 1, fh: 1, solid: true },
  stove: { grid: STOVE, fw: 1, fh: 1, solid: true },
  shower: { grid: SHOWER, fw: 1, fh: 1, solid: true },
  plant: { grid: PLANT, fw: 1, fh: 1, solid: true },
  bookshelf: { grid: BOOKSHELF, fw: 1, fh: 1, solid: true },
  table: { grid: TABLE, fw: 1, fh: 1, solid: true },
  lost_item: { grid: SOCK, fw: 1, fh: 1, solid: false },
};

// ---------------------------------------------------------------------------
// TUILES DE SOL / MUR — 16x16, générées procéduralement (déterministe)
// ---------------------------------------------------------------------------
export const TILE_PAL = {
  w: "#b07c48", // parquet
  v: "#94643a", // parquet ligne
  M: "#e3e9ea", // carrelage
  m: "#c6d1d4", // carrelage joint
  g: "#74b84e", // herbe
  d: "#65a643", // herbe sombre
  l: "#83c95c", // herbe claire
  R: "#e04a54", // fleur rouge
  Y: "#f2c94c", // cœur de fleur
  V: "#a86fd6", // fleur violette
  q: "#b9b3a5", // pierre
  n: "#9b968a", // pierre joint
  A: "#8a5a3b", // mur brique
  a: "#6b452a", // mur mortier
  h: "#a5714a", // mur haut
  r: "#e0a8ba", // tapis
  s: "#c98da2", // tapis motif
};

function genTile(fn) {
  const rows = [];
  for (let y = 0; y < 16; y++) {
    let r = "";
    for (let x = 0; x < 16; x++) r += fn(x, y);
    rows.push(r);
  }
  return rows;
}

function grassChar(x, y) {
  if ((x * 7 + y * 13) % 11 === 0) return "d";
  if ((x * 3 + y * 7) % 13 === 0) return "l";
  return "g";
}

// petites fleurs en croix sur la tuile fleurie
const FLOWER_SPOTS = [
  { cx: 4, cy: 5, petal: "R" },
  { cx: 11, cy: 10, petal: "V" },
];
function flowerChar(x, y) {
  for (const f of FLOWER_SPOTS) {
    if (x === f.cx && y === f.cy) return "Y";
    if (Math.abs(x - f.cx) + Math.abs(y - f.cy) === 1) return f.petal;
  }
  if (x === 13 && y === 2) return "R";
  return grassChar(x, y);
}

export const TILES = {
  wood: genTile((x, y) => (y % 4 === 3 || (x * 5 + y * 11) % 37 === 0 ? "v" : "w")),
  tileFloor: genTile((x, y) => (x % 8 === 7 || y % 8 === 7 ? "m" : "M")),
  grass: genTile(grassChar),
  flowers: genTile(flowerChar),
  path: genTile((x, y) =>
    y % 8 === 7 || (x + (Math.floor(y / 8) % 2) * 4) % 8 === 7 ? "n" : "q"
  ),
  rug: genTile((x, y) => (x % 6 === 2 && y % 6 === 3 ? "s" : "r")),
  wall: genTile((x, y) => {
    if (y === 0) return "h";
    if (y % 5 === 4) return "a";
    if ((x + (Math.floor(y / 5) % 2) * 4) % 8 === 0) return "a";
    return "A";
  }),
};
