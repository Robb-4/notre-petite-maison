// Réglages du jeu — tout ce qui est « tunable » vit ici.

export const CONFIG = {
  // Rendu
  internalWidth: 640,   // résolution interne fixe (pixels)
  internalHeight: 360,
  pxPerTile: 32,        // 1 tuile = 32 px internes (sprites 16 px affichés x2)

  // Mouvement
  playerSpeed: 3.5,     // tuiles / seconde
  playerSpeedTired: 2.2, // si un besoin < seuil bas
  npcSpeed: 1.6,
  playerBox: { w: 0.6, h: 0.5 }, // AABB aux pieds, en tuiles

  // Interactions
  interactRadius: 1.15, // distance max (en tuiles) pour interagir

  // Besoins : décroissance en points / seconde réelle (jauges 0..100)
  needs: {
    faim:    { decay: 0.20, icon: "🍽️", label: "Faim" },
    energie: { decay: 0.15, icon: "⚡", label: "Énergie" },
    hygiene: { decay: 0.12, icon: "🚿", label: "Hygiène" },
    fun:     { decay: 0.18, icon: "🎮", label: "Fun" },
    social:  { decay: 0.15, icon: "💕", label: "Social" },
  },
  needStart: 80,
  needLowThreshold: 20,

  // Horloge : 1 seconde réelle = 1 minute de jeu (journée = 24 min réelles)
  gameMinutesPerSecond: 1,
  startHour: 8,
  wakeUpHour: 7,

  // Moments de la journée (pour les dialogues)
  timeBuckets: [
    { name: "matin", from: 6,  to: 11 },
    { name: "jour",  from: 11, to: 18 },
    { name: "soir",  from: 18, to: 23 },
    { name: "nuit",  from: 23, to: 30 }, // 23h → 6h (le +24 est géré dans clock.js)
  ],

  // Teintes jour/nuit : [heure, couleur] — interpolées linéairement
  tintKeyframes: [
    [0,  "#33406e"],
    [5,  "#33406e"],
    [7,  "#ffd9b0"],
    [9,  "#ffffff"],
    [17, "#ffffff"],
    [20, "#ff9d5c"],
    [22, "#33406e"],
    [24, "#33406e"],
  ],
};
