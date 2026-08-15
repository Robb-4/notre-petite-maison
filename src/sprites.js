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

// --- Personnage voilé : hijab (H = couleur du voile) + robe longue ---
const V_DOWN_IDLE = [
  "....HHHH....",
  "...HHHHHH...",
  "..HHHHHHHH..",
  "..HHSSSSHH..",
  "..HSKSSKSH..",
  "..HHSSSSHH..",
  "..HHHHHHHH..",
  "..HTTTTTTH..",
  "...TTTTTT...",
  ".STTTTTTTTS.",
  ".TTTTTTTTTT.",
  ".TTTTTTTTTT.",
  ".TTTTTTTTTT.",
  ".TTTTTTTTTT.",
  "....F..F....",
  "............",
];
const V_DOWN_STEP = [
  ...V_DOWN_IDLE.slice(0, 14),
  "...F....F...",
  "............",
];
const V_UP_IDLE = [
  "....HHHH....",
  "...HHHHHH...",
  "..HHHHHHHH..",
  "..HHHHHHHH..",
  "..HHHHHHHH..",
  "..HHHHHHHH..",
  "..HHHHHHHH..",
  "..HTTTTTTH..",
  "...TTTTTT...",
  ".STTTTTTTTS.",
  ".TTTTTTTTTT.",
  ".TTTTTTTTTT.",
  ".TTTTTTTTTT.",
  ".TTTTTTTTTT.",
  "....F..F....",
  "............",
];
const V_UP_STEP = [
  ...V_UP_IDLE.slice(0, 14),
  "...F....F...",
  "............",
];
const V_SIDE_IDLE = [
  "....HHHH....",
  "...HHHHHH...",
  "..HHHHHHHH..",
  "..HHHSSSS...",
  "..HHHSSKS...",
  "..HHHSSSS...",
  "..HHHHSSH...",
  "..HHTTTTT...",
  "..HTTTTTT...",
  "..TTTTTTTT..",
  "..TTTTTTTT..",
  "..TTTTTTTT..",
  "..TTTTTTTT..",
  "..TTTTTTTT..",
  ".....FF.....",
  "............",
];
const V_SIDE_STEP = [
  ...V_SIDE_IDLE.slice(0, 14),
  "....F..F....",
  "............",
];

// spriteSet: "her" (cheveux longs + robe), "him" (cheveux courts + pantalon)
// ou "hijab" (voile + robe longue)
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
  hijab: {
    down: { idle: V_DOWN_IDLE, step: V_DOWN_STEP },
    up: { idle: V_UP_IDLE, step: V_UP_STEP },
    side: { idle: V_SIDE_IDLE, step: V_SIDE_STEP },
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
  S: "#d9b36c", // pierre / poil des bêtes du désert
  Q: "#a5804a", // pierre sombre
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

// Photo souvenir encadrée (posée sur la table de nuit)
const PHOTO = [
  "WWWWWWWWWW",
  "WwwwwwwwwW",
  "WwCCCCCCwW",
  "WwCCCCCCwW",
  "WwCBCCGCwW",
  "WwCBCCGCwW",
  "WwCggggCwW",
  "WwwwwwwwwW",
  "WWWWWWWWWW",
  "....WW....",
  "....WW....",
  "..........",
];

// Écran d'ordinateur (posé sur les bureaux de l'hôpital)
const MONITOR = [
  "KKKKKKKKKK",
  "KccccccccK",
  "KccscccccK",
  "KccccccccK",
  "KKKKKKKKKK",
  "....KK....",
  "...KKKK...",
  "..........",
];

// Panneau de l'hôpital (croix rouge sur pied)
const SIGN = [
  "DDDDDDDDDDDDDD",
  "DMMMMMMMMMMMMD",
  "DMMMMMRRMMMMMD",
  "DMMMMMRRMMMMMD",
  "DMMMRRRRRRMMMD",
  "DMMMRRRRRRMMMD",
  "DMMMMMRRMMMMMD",
  "DMMMMMRRMMMMMD",
  "DMMMMMMMMMMMMD",
  "DDDDDDDDDDDDDD",
  "......DD......",
  "......DD......",
  "......DD......",
  "......DD......",
  "......DD......",
  "..............",
];

// La machine à café de l'hôpital (institution sacrée)
const COFFEE = [
  ".KKKKKKKKK..",
  ".KDDDDDDDK..",
  ".KDRDDDDDK..",
  ".KDDDDDDDK..",
  ".KKKKKKKKK..",
  ".KDKKKKKDK..",
  ".KD.MM..DK..",
  ".KD.MM..DK..",
  ".KDDDDDDDK..",
  ".KKKKKKKKK..",
  "..D......D..",
  "............",
];

// La Joconde (cadre doré, sourire énigmatique en 6 pixels)
const JOCONDE = [
  "YYYYYYYYYYYY",
  "YccccccccccY",
  "YcccKKKKcccY",
  "YccKKLLKKccY",
  "YccKLLLLKccY",
  "YcccLLLLcccY",
  "YcccDDDDcccY",
  "YccDDDDDDccY",
  "YccDDLLDDccY",
  "YccccccccccY",
  "YYYYYYYYYYYY",
  "............",
];

// Tableau générique (paysage)
const PAINTING = [
  "WWWWWWWWWW",
  "WCCCCCCCCW",
  "WCCCYYCCCW",
  "WCCCCCCCCW",
  "WGGgGGgGGW",
  "WGGGGGGGGW",
  "WWWWWWWWWW",
  "..........",
];

// Borne d'arcade (marquee lumineux + écran + joystick)
const BORNE = [
  ".KKKKKKKKKKK..",
  ".KRRRRRRRRRK..",
  ".KRYRRYRRYRK..",
  ".KKKKKKKKKKK..",
  ".KcccscccccK..",
  ".KcccccccccK..",
  ".KcccccccccK..",
  ".KKKKKKKKKKK..",
  ".KDDDDDDDDDK..",
  ".KDDRDDYDDDK..",
  ".KDDDDDDDDDK..",
  ".KKKKKKKKKKK..",
  ".KKKKKKKKKKK..",
  ".KKKKKKKKKKK..",
  ".KKKKKKKKKKK..",
  "..KK.....KK...",
  "..............",
];

// Le gorille du KONG (il en impose)
const KONG_STATUE = [
  "....DDDDDD....",
  "...DDDDDDDD...",
  "...DmmmmmmD...",
  "...DmKmmKmD...",
  "...DmmmmmmD...",
  "...DmmKKmmD...",
  "...DDmmmmDD...",
  "..DDDDDDDDDD..",
  ".DDDDDDDDDDDD.",
  ".DDDDDDDDDDDD.",
  ".DDDDDDDDDDDD.",
  ".DDDDDDDDDDDD.",
  "..DDD....DDD..",
  "..DDD....DDD..",
  ".DDDD....DDDD.",
  "..............",
];

// Bougie de table romantique
const CANDLE = [
  "..Y...",
  "..O...",
  "..MM..",
  "..MM..",
  "..MM..",
  ".mmm..",
  "......",
];

// Panneau directionnel en bois (flèche vers la droite ; flip pour la gauche)
const SIGNPOST = [
  "WWWWWWWWWW..",
  "WwwwwwwwWW..",
  "WwwwwwwwwWW.",
  "WwwwwwwwWW..",
  "WWWWWWWWWW..",
  "...WW.......",
  "...WW.......",
  "...WW.......",
  "...WW.......",
  "...WW.......",
  "...WW.......",
  "..WWWW......",
  "............",
];

// Le Sphinx (tête à gauche, corps de lion allongé vers la droite)
const SPHINX = [
  "..QQQQ",
  ".QQSSSQ",
  ".QSSSSSQ",
  ".QSKSSKQ",
  ".QSSSSSQ",
  ".QQSSSQQ",
  "..QSSQ...QQQQQQQQQQQQ",
  "..QSSQQQSSSSSSSSSSSSSQ",
  ".QSSSSSSSSSSSSSSSSSSSSQ",
  ".QSSSSSSSSSSSSSSSSSSSSQ",
  ".QSSSSSSSSSSSSSSSSSSSSQ",
  ".QSSQQSSSSSSSSSSSSSQQSQ",
  ".QSSQ.QSSQ.......QSSQ",
  ".QSSQ.QSSQ.......QSSQ",
  "QQSSQQQSSQQ.....QQSSQQ",
  "",
];

// Le chameau (avec sa petite selle rouge)
const CAMEL = [
  ".SS",
  ".SSS",
  ".SKS",
  "..SS",
  "..SS....SSSS...SSSS",
  "..SS...SSSSSSRSSSSSS",
  "..SSSSSSSSSSSRSSSSSSS",
  "...SSSSSSSSSSSSSSSSSS",
  "...SS...SS....SS...SS",
  "...SS...SS....SS...SS",
  "...QQ...QQ....QQ...QQ",
  "",
];

// Un palmier
const PALM = [
  "..GG.....GG",
  ".GGGG.gGGGG",
  "GGgGGGGGGgGG",
  ".GG.GGGG.GG.",
  "....GOOG",
  ".....WW",
  ".....WW",
  ".....WW",
  "....WW",
  "....WW",
  "....WW",
  "...WW",
  "...WW",
  "...WWW",
  "..WWWW",
  "",
];

// Parasol de plage (rayures rouges et blanches)
const PARASOL = [
  "......RR........",
  "....RRMMRR......",
  "..RRMMRRMMRR....",
  ".RMMRRMMRRMMR...",
  "......WW........",
  "......WW........",
  "......WW........",
  "......WW........",
  "......WW........",
  "......WW........",
  "......WW........",
  "......WW........",
  "......WW........",
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

// Petites volutes vertes de puanteur (hygiène à zéro…)
export const STINK = [
  ".g..G...",
  "g.G..g..",
  ".G.g..G.",
  "G...G...",
  ".g...g..",
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
  photo: { grid: PHOTO, fw: 1, fh: 1, solid: true },
  lost_item: { grid: SOCK, fw: 1, fh: 1, solid: false },
  // hôpital
  desk: { grid: MONITOR, fw: 1, fh: 1, solid: true },
  her_desk: { grid: MONITOR, fw: 1, fh: 1, solid: true },
  counter: { grid: MONITOR, fw: 1, fh: 1, solid: true },
  sign: { grid: SIGN, fw: 1, fh: 1, solid: true },
  signpost: { grid: SIGNPOST, fw: 1, fh: 1, solid: true },
  coffee: { grid: COFFEE, fw: 1, fh: 1, solid: true },
  // le Louvre
  joconde: { grid: JOCONDE, fw: 1, fh: 1, solid: false }, // accrochée au mur
  painting: { grid: PAINTING, fw: 1, fh: 1, solid: false },
  pyramid: { grid: MONITOR, fw: 3, fh: 3, solid: true }, // volume 3D dédié
  // la Saint-Valentin
  borne: { grid: BORNE, fw: 1, fh: 1, solid: true },
  kong_statue: { grid: KONG_STATUE, fw: 1, fh: 1, solid: true },
  resto_table: { grid: CANDLE, fw: 1, fh: 1, solid: true }, // boîte + bougie
  // l'Égypte
  sphinx: { grid: SPHINX, fw: 3, fh: 2, solid: true, scale: 1.7 },
  camel: { grid: CAMEL, fw: 2, fh: 1, solid: true, scale: 1.35 },
  palm: { grid: PALM, fw: 1, fh: 1, solid: true, scale: 1.5 },
  pyramide_egypte: { grid: MONITOR, fw: 5, fh: 5, solid: true }, // volume 3D dédié
  // l'Albanie
  parasol: { grid: PARASOL, fw: 1, fh: 1, solid: true, scale: 1.4 },
  bunker: { grid: MONITOR, fw: 2, fh: 2, solid: true }, // dôme 3D dédié
  mountain: { grid: MONITOR, fw: 4, fh: 4, solid: true }, // cône 3D dédié
  // la vraie vie : coin de fleurs à cueillir (les fleurs de la tuile suffisent)
  flower_spot: { grid: MONITOR, fw: 1, fh: 1, solid: false },
  // le centre commercial + la vie à deux
  clothes_rack: { grid: MONITOR, fw: 1, fh: 1, solid: true },
  grocery_shelf: { grid: MONITOR, fw: 1, fh: 1, solid: true },
  furniture_shop: { grid: MONITOR, fw: 1, fh: 1, solid: true },
  date_board: { grid: MONITOR, fw: 1, fh: 1, solid: true },
};

export { CANDLE };

export { MONITOR, SIGN };

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
  t: "#b39066", // dessus de mur (chapeau)
  u: "#8a6b48", // bord du chapeau
  z: "#4a3120", // plinthe
  F: "#efe4cf", // cadre de fenêtre
  e: "#a9d9ea", // vitre
  E: "#d3f0fa", // reflet de vitre
  x: "#3a3350", // moquette d'arcade
  y: "#544a75", // motif de moquette
  b: "#ecd9a0", // sable
  c: "#d9c185", // sable ombre
  o: "#7fc7d9", // eau d'oasis
  O: "#5aa8bd", // vague
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
  if (x === 0 || y === 0) return "d"; // quadrillage de tuiles façon Habbo
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
  wood: genTile((x, y) =>
    x === 0 || y % 4 === 3 || (x * 5 + y * 11) % 37 === 0 ? "v" : "w"
  ),
  tileFloor: genTile((x, y) => (x % 8 === 0 || y % 8 === 0 ? "m" : "M")),
  grass: genTile(grassChar),
  flowers: genTile(flowerChar),
  path: genTile((x, y) =>
    y % 8 === 0 || (x + (Math.floor(y / 8) % 2) * 4) % 8 === 0 ? "n" : "q"
  ),
  rug: genTile((x, y) =>
    x === 0 || y === 0 ? "s" : x % 6 === 2 && y % 6 === 3 ? "s" : "r"
  ),
  arcadeFloor: genTile((x, y) =>
    x === 0 || y === 0 || (x * 5 + y * 7) % 17 === 0 ? "y" : "x"
  ),
  sand: genTile((x, y) =>
    x === 0 || y === 0 || (x * 7 + y * 13) % 19 === 0 ? "c" : "b"
  ),
  water: genTile((x, y) => ((x + y * 3) % 11 === 0 ? "O" : "o")),
  wall: genTile((x, y) => {
    if (y === 0) return "h";
    if (y % 5 === 4) return "a";
    if ((x + (Math.floor(y / 5) % 2) * 4) % 8 === 0) return "a";
    return "A";
  }),
};

// ---------------------------------------------------------------------------
// VUE 3D « HD-2D » : façades de murs, faces des meubles-boîtes, billboards
// ---------------------------------------------------------------------------

function genGrid(w, h, fn) {
  const rows = [];
  for (let y = 0; y < h; y++) {
    let r = "";
    for (let x = 0; x < w; x++) r += fn(x, y);
    rows.push(r);
  }
  return rows;
}

// briques du mur (partagé entre les hauteurs de façade)
function brickChar(x, y) {
  if (y % 5 === 4) return "a";
  if ((x + (Math.floor(y / 5) % 2) * 4) % 8 === 0) return "a";
  return "A";
}

function wallFace(h, withWindow = false) {
  const wTop = Math.round(h * 0.2);
  const wBot = wTop + 11;
  return genGrid(16, h, (x, y) => {
    if (y === 0) return "h";
    if (y >= h - 2) return "z"; // plinthe
    if (withWindow && x >= 3 && x <= 12 && y >= wTop && y <= wBot) {
      const edge = x === 3 || x === 12 || y === wTop || y === wBot;
      if (edge) return "F";
      return (x + y) % 7 < 2 ? "E" : "e"; // vitre + reflet
    }
    if (withWindow && y === wBot + 1 && x >= 3 && x <= 12) return "F"; // rebord
    return brickChar(x, y);
  });
}

export const WALL_TEX_GRIDS = {
  cap: genGrid(16, 16, (x, y) =>
    x === 0 || y === 0 || x === 15 || y === 15 || ((x * 7 + y * 13) % 23 === 0 && x > 2 && x < 13)
      ? "u"
      : "t"
  ),
  face: wallFace(26),
  faceWindow: wallFace(26, true),
  faceShort: genGrid(16, 6, (x, y) => (y === 0 ? "h" : y === 5 ? "z" : brickChar(x, y))),
};

// faces des meubles rendus en volumes (boîtes)
export const BOX_TEX_GRIDS = {
  bedTop: BED,
  bedSide: genGrid(16, 8, (x, y) => (y >= 6 ? "W" : y === 2 ? "b" : "B")),
  couchSeatTop: genGrid(32, 12, (x, y) => (x === 15 || x === 16 || y === 11 ? "e" : "E")),
  couchSeatFront: genGrid(32, 6, (x, y) => (y >= 5 ? "u" : "U")),
  couchBackTop: genGrid(32, 4, () => "U"),
  couchBackFront: genGrid(32, 8, (x, y) =>
    y === 0 ? "U" : x === 15 || x === 16 ? "e" : "E"
  ),
  couchSide: genGrid(12, 10, (x, y) => (y >= 8 ? "u" : "U")),
  stoveTop: genGrid(16, 16, (x, y) => {
    if (x === 0 || y === 0 || x === 15 || y === 15) return "m";
    for (const [cx, cy] of [[4, 4], [11, 4], [4, 11], [11, 11]]) {
      const d2 = (x - cx) * (x - cx) + (y - cy) * (y - cy);
      if (d2 <= 6) return "K";
    }
    return "M";
  }),
  stoveFront: genGrid(16, 14, (x, y) => {
    if (y === 0 || y >= 13) return "m";
    if (y <= 2 && (x === 2 || x === 5 || x === 8 || x === 11)) return "D";
    if (x >= 2 && x <= 13 && y >= 4 && y <= 11) {
      const edge = x === 2 || x === 13 || y === 4 || y === 11;
      return edge ? "K" : "D";
    }
    return "M";
  }),
  stoveSide: genGrid(16, 14, (x, y) => (x === 0 || y === 0 || y >= 13 ? "m" : "M")),
  fridgeFront: FRIDGE,
  fridgeSide: genGrid(16, 24, (x, y) => (x <= 1 || y <= 1 || y >= 22 ? "m" : "M")),
  fridgeTop: genGrid(16, 16, (x, y) => (x === 0 || y === 0 || x === 15 || y === 15 ? "m" : "M")),
  tableTop: genGrid(16, 16, (x, y) =>
    x === 0 || y === 0 || x === 15 || y === 15 || y === 8 ? "W" : "w"
  ),
  tableSide: genGrid(16, 9, (x, y) => (y === 0 || y === 8 ? "W" : "w")),
  nightTop: genGrid(16, 16, (x, y) =>
    x === 0 || y === 0 || x === 15 || y === 15 ? "W" : "w"
  ),
  deskTop: genGrid(16, 16, (x, y) =>
    x === 0 || y === 0 || x === 15 || y === 15 ? "m" : "M"
  ),
  deskSide: genGrid(16, 9, (x, y) => (y === 0 || y === 8 || x === 0 ? "m" : "M")),
  // faces des meubles convertis en boîtes (fini les meubles de travers)
  tvScreen: genGrid(16, 10, (x, y) =>
    x === 0 || y === 0 || x === 15 || y === 9 ? "K" : x === y + 4 || x === y + 5 ? "s" : "c"
  ),
  darkSide: genGrid(12, 14, () => "K"),
  darkTop: genGrid(12, 12, (x, y) => (x === 0 || y === 0 || x === 11 || y === 11 ? "D" : "K")),
  grayTop: genGrid(16, 16, (x, y) => (x === 0 || y === 0 || x === 15 || y === 15 ? "D" : "m")),
  groceryFront: genGrid(16, 20, (x, y) => {
    if (y <= 1 || y === 7 || y === 13 || y >= 19 || x === 0 || x === 15) return "W";
    if (y < 7) return x % 4 === 0 ? "K" : x % 3 === 1 ? "O" : "R"; // fruits
    if (y < 13) return x % 4 === 2 ? "K" : x % 3 === 0 ? "Y" : "G"; // légumes
    return x % 5 === 3 ? "K" : x % 2 === 0 ? "N" : "M"; // boîtes
  }),
  nightFront: genGrid(16, 10, (x, y) => {
    if (x === 0 || y === 0 || x === 15 || y === 9) return "W";
    if (x >= 3 && x <= 12 && y >= 2 && y <= 7 && (x === 3 || x === 12 || y === 2 || y === 7)) return "W";
    if ((x === 7 || x === 8) && (y === 4 || y === 5)) return "W";
    return "w";
  }),
};

// petits billboards décoratifs
export const VASE = [
  ".R.Y.V..",
  ".YRVYR..",
  "..GGG...",
  "..MMM...",
  "..MMM...",
  "...MM...",
  "........",
];

export const FLOWER_BILL = [
  "..RR....",
  ".RYYR...",
  "..RR..V.",
  "...G.VYV",
  "...G..V.",
  "...G..G.",
  "..G.G.G.",
  "...GG.G.",
  "....G...",
  "....G...",
  "........",
];

export const SHADOW = [
  "...KKKKKK...",
  ".KKKKKKKKKK.",
  "KKKKKKKKKKKK",
  "KKKKKKKKKKKK",
  ".KKKKKKKKKK.",
  "...KKKKKK...",
];

// Portant de vêtements (centre commercial)
export const RACK = [
  "WWWWWWWWWWWWWWWW",
  "W.RRR.NNN.GGG..W",
  "W.RRR.NNN.GGG..W",
  "W.RRR.NNN.GGG..W",
  "W.RRR.NNN.GGG..W",
  "W..R...N...G...W",
  "W..............W",
  "W..............W",
  "WW............WW",
  "................",
];

// Petit calendrier des sorties en amoureux (posé près de la porte)
export const CALENDAR = [
  ".W.W.W.W.W..",
  "MMMMMMMMMMMM",
  "MMMMMMMMMMMM",
  "MMRRMMMRRMMM",
  "MRRRRRRRRRRM",
  "MRRRRRRRRRRM",
  "MMRRRRRRRRMM",
  "MMMRRRRRRMMM",
  "MMMMRRRRMMMM",
  "MMMMMRRMMMMM",
  "MMMMMMMMMMMM",
  "....WW......",
  "....WW......",
  "............",
];

// faces découpées pour les boîtes (fini les meubles de travers) : dernière
// ligne transparente retirée, points remplacés par du noir si besoin
BOX_TEX_GRIDS.bookshelfFront = BOOKSHELF.slice(0, 23);
BOX_TEX_GRIDS.showerSide = SHOWER.slice(0, 23);
BOX_TEX_GRIDS.borneFront = BORNE.slice(0, 15).map((r) => r.replace(/\./g, "K"));
BOX_TEX_GRIDS.coffeeFront = COFFEE.slice(0, 10).map((r) => r.replace(/\./g, "K"));
