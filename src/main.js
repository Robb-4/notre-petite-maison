// Bootstrap + boucle de jeu : monde multi-cartes (maison, hôpital, Louvre,
// Paris), joueuse, PNJ, et tous les systèmes (besoins, interactions,
// dialogues, horloge, quêtes, cinématiques).
import DATA from "./data.js";
import { CONFIG } from "./config.js";
import { createWorld } from "./world.js";
import { MAPS, SPAWNS, buildCollision } from "./map.js";
import { createInput } from "./input.js";
import { createCharacterView, Player } from "./player.js";
import { NPC } from "./npc.js";
import { Needs } from "./needs.js";
import { Interactions, ACTIONS } from "./interactions.js";
import { Dialogue } from "./dialogue.js";
import { Clock } from "./clock.js";
import { Quests } from "./quests.js";
import { HUD } from "./hud.js";
import { createMinigames } from "./minigames.js";

// --- écran titre personnalisé ---
document.title = DATA.meta.titre;
document.getElementById("title-name").textContent = DATA.meta.titre;
document.getElementById("title-sub").textContent = DATA.meta.dedicace;

// --- création du monde et des entités ---
const world = createWorld();
const input = createInput(world.canvas);
const hud = new HUD();
const dialogue = new Dialogue(DATA);
const clock = new Clock();
const needs = new Needs();

const playerView = createCharacterView(
  world,
  DATA.characters.player.spriteSet ?? "her",
  DATA.characters.player.palette
);
const player = new Player(playerView, SPAWNS.player.x, SPAWNS.player.y);

// PNJ : chacun vit sur sa carte (positions en coordonnées locales)
const npcs = {};
for (const id of ["partner", "sophie", "romain", "arij", "mahrez", "david", "mylene", "maman"]) {
  const c = DATA.characters[id];
  if (!c) continue;
  const view = createCharacterView(world, c.spriteSet ?? "him", c.palette);
  npcs[id] = new NPC(view, SPAWNS[id].x, SPAWNS[id].y);
  npcs[id].view = view;
}

// Pendant les quêtes d'histoire, Robin ne connaît pas encore la joueuse.
const STORY_IDS = new Set([
  "grand_jour",
  "entretien",
  "equipe",
  "devs",
  "nuit_appel",
  "premier_date",
  "saint_valentin",
  "egypte",
  "albanie",
]);
function inStory() {
  return STORY_IDS.has(quests?.current?.id);
}
// la « vraie vie » façon Sims commence une fois l'histoire terminée
function vieReelle() {
  return !inStory();
}

// état de la vraie vie
let robinParti = false; // il est parti bouder au bureau (amour à zéro)
let hasFlowers = false; // un bouquet cueilli au jardin
let pendingPartnerMove = null; // téléportation de Robin à appliquer (x, y)
let money = 50; // 💶 gagné en travaillant à l'hôpital
let happyDays = 0; // compteur de jours heureux (humeur moyenne ≥ 55 à l'aube)
let lastDay = 1;
let outfitIndex = -1; // tenue en cours (data.tenues)
let couchIndex = 0; // couleur du canapé (data.couleursCanape)
let dateVenue = null; // carte de la soirée en amoureux en cours
let lastDateVenue = "louvre";
let visitor = null; // { id, until, day } — visite surprise de Mylène / Maman
let demandeFaite = false; // 💍
let lastHourChecked = -1;

// la cuisine 🍳
let pantry = 3; // portions d'ingrédients 🧺
let seeds = 0; // graines 🌱
let carrying = null; // null | "ingredients" | { recette, qualite }
let cookT = 0; // temps du mini-jeu de cuisson

// le potager 🌱 (3 parcelles, mêmes indices que les placements garden_plot)
const plots = [
  { state: "vide", growth: 0, watered: false },
  { state: "vide", growth: 0, watered: false },
  { state: "vide", growth: 0, watered: false },
];
const PLOT_COLS = [18, 19, 20];

// les mini-jeux 🎮
const minigames = createMinigames();
let snakeHigh = 0;

// le ménage 🧹
const DIRT_SPOTS = [
  [3, 8], [6, 10], [8, 7], [10, 11], [12, 7],
  [13, 11], [7, 12], [4, 11], [11, 6], [14, 8],
];
let dirt = []; // [{ col, row }]

// Sur quelle carte vit chaque PNJ en ce moment ?
function npcMapOf(id) {
  if (id === "mylene") return visitor?.id === "mylene" ? "home" : "egypte";
  if (id === "maman") return visitor?.id === "maman" ? "home" : "albanie";
  if (id !== "partner") return "hospital";
  if (!inStory()) {
    if (dateVenue) return dateVenue; // en sortie en amoureux
    return robinParti ? "hospital" : "home";
  }
  const qid = quests.current?.id;
  if (qid === "premier_date") return "louvre";
  if (qid === "saint_valentin") return "paris";
  return "hospital";
}

// --- gestion des cartes ---
let mapId = "home";
let isSolid = buildCollision(MAPS.home);
let activeNpcs = {};

function refreshMap() {
  // les taches de ménage sont des placements dynamiques de la maison
  const extras = mapId === "home" ? dirt.map((d) => ({ type: "dirt", col: d.col, row: d.row })) : [];
  world.loadMap(MAPS[mapId], extras);
  isSolid = buildCollision(MAPS[mapId]);
  activeNpcs = {};
  for (const [id, npc] of Object.entries(npcs)) {
    if (npcMapOf(id) === mapId) {
      activeNpcs[id] = npc;
      world.addObj(...npc.view.meshes);
      npc.sync();
    }
  }
  world.addObj(...playerView.meshes);
  interactions.setMap([...MAPS[mapId].placements, ...extras], activeNpcs);
  world.updateCamera(player.x, player.y, 0, true);
  syncPlots();
}

// applique les stades visuels du potager (après chaque reconstruction de carte)
function syncPlots() {
  if (mapId !== "home") return;
  plots.forEach((pl, i) => {
    world.setPlotStage(i, pl.state === "vide" ? 0 : pl.state === "plantee" ? 1 : 2);
  });
}

// téléportation vers une autre carte, avec fondu
function switchMap(to, at) {
  const previous = state;
  state = "travel";
  fadeEl.style.opacity = "1";
  setTimeout(() => {
    // fin de la soirée en amoureux : Robin rentre à la maison
    if (dateVenue && to !== dateVenue) {
      dateVenue = null;
      npcs.partner.x = SPAWNS.partnerDay.x;
      npcs.partner.y = SPAWNS.partnerDay.y;
    }
    mapId = to;
    player.x = at.x;
    player.y = at.y;
    player.sync();
    refreshMap();
    hud.toast(MAPS[to].name);
    fadeEl.style.opacity = "0";
    setTimeout(() => {
      state = previous === "travel" ? "playing" : previous;
      state = "playing";
    }, 400);
  }, 400);
}

const interactions = new Interactions(MAPS.home.placements, {});

let pendingInterlude = false;
let pendingTransition = false; // vers la Saint-Valentin
let pendingEgypte = false; // vers le voyage en Égypte
let pendingAlbanie = false; // vers le voyage en Albanie

const quests = new Quests(DATA.quests, {
  onStepDone: () => hud.toast("✔ Étape accomplie !"),
  // effets attachés à une étape terminée (saut d'horloge, séquence auto…)
  onStepComplete: (step) => {
    if (step?.clockTo !== undefined) {
      clock.minutes = step.clockTo * 60;
      clock.prevMinutes = clock.minutes;
      hud.toast("🕐 Les heures filent…");
    }
    if (step?.hearts) world.spawnHearts(player.x, player.y - 0.6, 14); // les grands moments ❤
    if (step?.partnerTo && SPAWNS[step.partnerTo]) {
      npcs.partner.x = SPAWNS[step.partnerTo].x;
      npcs.partner.y = SPAWNS[step.partnerTo].y;
    }
    if (step?.sequenceAfter) playSequence(DATA.sequences[step.sequenceAfter] ?? []);
  },
  onQuestDone: (q, allDone) => {
    world.spawnHearts(player.x, player.y - 0.8, 7);
    hud.toast(`Objectif terminé : ${q.titre} ❤`);
    if (q.rewardDialogue) dialogue.showKey(q.rewardDialogue, "player", clock.bucket());
    if (q.id === "nuit_appel") {
      // pendant qu'elle dort, Robin file au Louvre pour le lendemain
      npcs.partner.x = SPAWNS.partnerLouvre.x;
      npcs.partner.y = SPAWNS.partnerLouvre.y;
    }
    if (q.id === "premier_date") pendingTransition = true; // direction le 14 février
    if (q.id === "saint_valentin") pendingEgypte = true; // direction l'Égypte ✈
    if (q.id === "egypte") pendingAlbanie = true; // retrouvailles… puis l'Albanie 🇦🇱
    if (q.id === "albanie") pendingInterlude = true; // le retour, et l'ellipse ❤ finale
    if (allDone) dialogue.showKey("quests_all_done", "partner", clock.bucket());
  },
});
interactions.onInteract((type) => quests.handleInteract(type));

// --- état global ---
let state = "title"; // title | cinematic | playing | sleeping | travel
let action = null; // { spot, def, t } pendant une action minutée
let pendingSleep = false;

const tintEl = document.getElementById("tint");
const fadeEl = document.getElementById("sleep-fade");
const titleEl = document.getElementById("title-screen");
const cineEl = document.getElementById("cinematic");
const cineTextEl = document.getElementById("cine-text");
const gameoverEl = document.getElementById("gameover");
document.getElementById("go-text").textContent =
  `Oups… ${DATA.characters.player.nom} est morte de faim.`;

// --- vraie vie : mort de faim et résurrection ---
function die() {
  state = "dead";
  gameoverEl.classList.remove("hidden");
}
function revive() {
  gameoverEl.classList.add("hidden");
  for (const key of Object.keys(needs.values)) {
    needs.values[key] = Math.max(needs.values[key], 65);
  }
  clock.sleep();
  mapId = "home";
  player.x = SPAWNS.player.x;
  player.y = SPAWNS.player.y;
  player.sync();
  refreshMap();
  state = "playing";
  hud.toast("👻 → ❤ Une seconde chance. MANGE.");
}

// --- vraie vie : écroulement de fatigue ---
function collapse() {
  state = "sleeping";
  hud.toast("😴 Tu t'es écroulée de fatigue…");
  fadeEl.style.opacity = "1";
  setTimeout(() => {
    clock.sleep();
    needs.apply({ energie: 55, hygiene: -10 });
    mapId = "home";
    player.x = 3.5;
    player.y = 4.5;
    player.sync();
    refreshMap();
    hud.toast(`☀ Réveil à la maison, ${String(CONFIG.wakeUpHour).padStart(2, "0")}h00. Mange quelque chose !`);
    fadeEl.style.opacity = "0";
    setTimeout(() => {
      state = "playing";
    }, 700);
  }, 900);
}

// --- vraie vie : Robin part bouder au bureau ---
function robinPart() {
  robinParti = true;
  playSequence(DATA.sequences.robin_part ?? []);
  pendingPartnerMove = { x: SPAWNS.partnerDev.x, y: SPAWNS.partnerDev.y };
}

// --- la cuisine 🍳 : mini-jeu de cuisson ---
function startCooking() {
  state = "cooking";
  cookT = 0;
  hud.showCookbar(0);
}
function resolveCooking(dist) {
  hud.hideCookbar();
  state = "playing";
  needs.apply({ energie: -5 });
  const C = CONFIG.cuisine;
  if (dist > C.correct) {
    // brûlé !
    carrying = null;
    needs.apply({ fun: -10, faim: 5 });
    for (let i = 0; i < 6; i++) world.spawnSmoke(player.x, player.y - 0.6);
    hud.toast("💨 BRÛLÉ ! (les voisins s'inquiètent)");
  } else {
    const recette = DATA.recettes[Math.floor(Math.random() * DATA.recettes.length)];
    const qualite = dist <= C.perfect ? "parfait" : "correct";
    carrying = { recette, qualite };
    if (qualite === "parfait") needs.apply({ fun: 10 });
    hud.toast(`🍲 ${recette.nom} — ${qualite === "parfait" ? "PARFAIT ✨" : "réussi !"}`);
    interactions.emit("stove"); // la quête q1 valide « cuisiner » sur un plat réussi
  }
}
function cancelCooking() {
  hud.hideCookbar();
  state = "playing";
  hud.toast("🍳 Cuisson annulée (ingrédients gardés)");
}

// --- les mini-jeux 🎮 ---
function startMinigame(name) {
  state = "minigame";
  minigames.start(name);
}
function rewardMinigame(res) {
  if (res.name === "snake") {
    const fun = Math.min(8 + 2 * res.score, 35);
    needs.apply({ fun });
    if (res.score > snakeHigh) {
      snakeHigh = res.score;
      hud.toast(`🏆 Nouveau record : ${res.score} ! (+${fun} fun)`);
    } else {
      hud.toast(`🐍 Score : ${res.score} (+${fun} fun)`);
    }
  } else if (res.name === "breakout") {
    const fun = Math.round(res.broken / 2) + (res.win ? 30 : 0);
    needs.apply({ fun });
    hud.toast(res.win ? `🧱 TOUT CASSÉ ! (+${fun} fun)` : `🧱 ${res.broken}/${res.total} briques (+${fun} fun)`);
  } else if (res.name === "work") {
    const salaire = 15 + 8 * res.queries;
    money += salaire;
    needs.apply({ energie: -18, fun: -5 });
    if (res.queries >= 5) {
      hud.toast(`💼 +${salaire} € — Sophie : « Excellente prod ! » (prime incluse)`);
      money += 10;
    } else {
      hud.toast(`💼 ${res.queries} requête(s) traitée(s) : +${salaire} €`);
    }
  } else if (res.name === "pong") {
    if (res.win) {
      needs.apply({ fun: 20, amour: 15 });
      hud.toast(`🏓 ${res.s1}-${res.s2} ! Robin : « Revanche. RE-VANCHE. »`);
    } else {
      needs.apply({ fun: 10, amour: 10 });
      hud.toast(`🏓 ${res.s1}-${res.s2}… Robin jubile. (Mais c'était bien.)`);
    }
    world.spawnHearts(player.x, player.y - 0.8, 4);
  }
}

// --- la cuisine 🍳 : le dîner à deux ---
function serveDinner() {
  const plat = carrying;
  carrying = null;
  const C = CONFIG.cuisine;
  const faim = Math.round(plat.recette.faim * (plat.qualite === "parfait" ? C.parfaitMult : 1));
  if (activeNpcs.partner && !robinParti) {
    // Robin vient s'asseoir à table
    npcs.partner.x = 6.5;
    npcs.partner.y = 7.5;
    npcs.partner.startTalk(5.5, 7.5);
    npcs.partner.talkTimer = 8;
    const isPref = !!plat.recette.prefere;
    let amour = isPref ? C.amourDinerPrefere : C.amourDiner;
    if (plat.qualite === "parfait") amour += 5;
    needs.apply({ faim, amour, fun: 10, social: 15 });
    playSequence(DATA.sequences[isPref ? "diner_prefere" : "diner"] ?? []);
    world.spawnHearts(6, 7, isPref ? 10 : 6);
  } else {
    needs.apply({ faim, fun: 5 });
    hud.toast("🍽️ (C'était bon. Mais c'est meilleur à deux.)");
  }
}

// --- vraie vie : soirée en amoureux (KONG et Louvre en alternance) ---
function startDateNight() {
  lastDateVenue = lastDateVenue === "paris" ? "louvre" : "paris";
  dateVenue = lastDateVenue;
  const anchor = dateVenue === "paris" ? SPAWNS.partnerKong : SPAWNS.partnerLouvre;
  npcs.partner.x = anchor.x;
  npcs.partner.y = anchor.y;
  clock.minutes = 20 * 60;
  clock.prevMinutes = clock.minutes;
  needs.apply({ amour: 40, fun: 25, social: 20 });
  switchMap(dateVenue, dateVenue === "paris" ? { x: 25.5, y: 5 } : { x: 20, y: 9 });
  playSequence(DATA.sequences.date_night ?? []);
}

// --- cinématiques (intro, transition, interlude) ---
let cineIndex = 0;
let cineSlides = [];
let cineOnEnd = null;
function startCinematic(slides, onEnd = null) {
  state = "cinematic";
  cineIndex = 0;
  cineSlides = slides;
  cineOnEnd = onEnd;
  cineEl.classList.remove("hidden");
  showCineSlide();
}
function showCineSlide() {
  const card = document.getElementById("cine-card");
  card.style.animation = "none";
  void card.offsetWidth;
  card.style.animation = "";
  cineTextEl.textContent = cineSlides[cineIndex];
}
function advanceCinematic() {
  cineIndex += 1;
  if (cineIndex >= cineSlides.length) endCinematic();
  else showCineSlide();
}
function endCinematic() {
  cineEl.classList.add("hidden");
  state = "playing";
  cineOnEnd?.();
  cineOnEnd = null;
}
cineEl.addEventListener("pointerdown", (e) => {
  e.stopPropagation();
  if (state === "cinematic") advanceCinematic();
});

// Le 14 février : le couple se retrouve devant la salle d'arcade, à Paris.
function startValentin() {
  npcs.partner.x = SPAWNS.partnerArcade.x;
  npcs.partner.y = SPAWNS.partnerArcade.y;
  clock.minutes = 14 * 60;
  clock.prevMinutes = clock.minutes;
  switchMap("paris", { x: 10.5, y: 2.4 });
  hud.toast("❤ 14 février — Saint-Valentin !");
}

// Le voyage : elle atterrit en Égypte, au matin.
function startEgypte() {
  clock.minutes = 10 * 60;
  clock.prevMinutes = clock.minutes;
  switchMap("egypte", { x: 2.5, y: 10 });
  hud.toast("✈ L'Égypte !");
}

// Le second voyage : l'Albanie avec Maman, au matin.
function startAlbanie() {
  clock.minutes = 11 * 60;
  clock.prevMinutes = clock.minutes;
  switchMap("albanie", { x: 3, y: 9.5 });
  hud.toast("✈ L'Albanie !");
}

// Après le retour d'Albanie : quelques mois plus tard, la vie à deux commence.
function moveInTogether() {
  npcs.partner.x = SPAWNS.partnerDay.x;
  npcs.partner.y = SPAWNS.partnerDay.y;
  npcs.partner.state = "idle";
  npcs.partner.timer = 2;
  clock.sleep(); // nouveau matin, nouvelle vie
  switchMap("home", { x: SPAWNS.player.x, y: SPAWNS.player.y });
  world.spawnHearts(SPAWNS.player.x, SPAWNS.player.y - 0.8, 9);
}

// --- séquences scénarisées (dialogues à plusieurs voix) ---
function playSequence(lines) {
  for (const line of lines) {
    const name = DATA.characters[line.qui]?.nom ?? line.qui;
    dialogue.show(name, line.texte);
  }
}

function completeInteraction(spot, def) {
  let effects = def.effects ?? {};
  if (spot.type === "couch" && clock.serieActive) {
    effects = { ...effects, fun: (effects.fun ?? 0) * 2 };
  }
  const isNpc = !!activeNpcs[spot.type];
  const stinky = vieReelle() && needs.values.hygiene <= CONFIG.vieReelle.stinkThreshold;
  activeNpcs[spot.type]?.startTalk(player.x, player.y);

  const step = quests.currentStep;
  if (step?.sequence && step.target === spot.type) {
    // étape d'histoire scénarisée
    playSequence(DATA.sequences[step.sequence] ?? []);
  } else if (spot.type === "flower_spot") {
    // cueillette de fleurs
    if (hasFlowers) {
      hud.toast("🌼 Tu as déjà un bouquet !");
    } else {
      hasFlowers = true;
      hud.toast("🌼 Bouquet cueilli ! (Offre-le à Robin)");
    }
  } else if (spot.type === "fridge" && vieReelle()) {
    // prendre des ingrédients (ou fond de frigo si vide)
    effects = {};
    if (carrying) {
      hud.toast(carrying === "ingredients" ? "🧺 Tu as déjà les ingrédients !" : "🍲 Tu as déjà un plat en main !");
    } else if (pantry > 0 || quests.isCurrentTarget("fridge")) {
      if (pantry > 0) pantry -= 1;
      carrying = "ingredients";
      hud.toast("🧺 Ingrédients en main — direction la cuisinière !");
    } else {
      needs.apply({ faim: 10 });
      dialogue.showKey("frigo_vide", "player", clock.bucket());
    }
  } else if (spot.type === "stove" && vieReelle()) {
    // lancer la cuisson (mini-jeu) — « stove » n'est émis qu'en cas de réussite
    effects = {};
    if (carrying === "ingredients") {
      carrying = null;
      startCooking();
      return;
    }
    hud.toast("🧺 Il faut d'abord des ingrédients (frigo) !");
  } else if (spot.type === "table" && vieReelle() && carrying && carrying !== "ingredients") {
    // servir le dîner à table ❤
    serveDinner();
  } else if (spot.type === "garden_plot") {
    // le potager : planter / arroser / récolter
    const i = PLOT_COLS.indexOf(spot.rect.x0);
    const pl = plots[i];
    if (pl.state === "vide") {
      if (seeds > 0) {
        seeds -= 1;
        pl.state = "plantee";
        pl.growth = 0;
        pl.watered = true;
        hud.toast("🌱 Planté ! (arrose chaque jour)");
        syncPlots();
      } else {
        hud.toast("🌱 Il te faut des graines (courses au centre commercial)");
      }
    } else if (pl.state === "plantee") {
      if (!pl.watered) {
        pl.watered = true;
        hud.toast("💧 Arrosé !");
      } else {
        hud.toast("💧 Déjà arrosé aujourd'hui");
      }
    } else {
      pl.state = "vide";
      pl.growth = 0;
      pantry += CONFIG.potager.recolte;
      hud.toast(`🥕 Récolte : +${CONFIG.potager.recolte} 🧺 !`);
      syncPlots();
    }
  } else if (spot.type === "dirt") {
    // nettoyer une tache
    dirt = dirt.filter((d) => !(d.col === spot.rect.x0 && d.row === spot.rect.y0));
    hud.toast("🧹 Et voilà, propre !");
    refreshMap();
  } else if (spot.type === "her_desk" && vieReelle()) {
    // travailler = le mini-jeu du rush de données
    effects = {};
    startMinigame("work");
    return;
  } else if (spot.type === "clothes_rack") {
    if (money >= 10) {
      money -= 10;
      outfitIndex = (outfitIndex + 1) % DATA.tenues.length;
      const t = DATA.tenues[outfitIndex];
      playerView.recolor({ ...DATA.characters.player.palette, T: t.T, F: t.F });
      hud.toast(`👗 Nouvelle tenue : ${t.nom} !`);
    } else {
      hud.toast("💶 Pas assez d'argent (10 €)");
    }
  } else if (spot.type === "grocery_shelf") {
    if (money >= 15) {
      money -= 15;
      pantry += 3;
      seeds += 1;
      needs.apply({ fun: 5 });
      hud.toast("🛒 Courses : +3 🧺 ingrédients, +1 🌱 graine !");
    } else {
      hud.toast("💶 Pas assez d'argent (15 €)");
    }
  } else if (spot.type === "furniture_shop") {
    if (money >= 50) {
      money -= 50;
      couchIndex = (couchIndex + 1) % DATA.couleursCanape.length;
      world.setCouchColor(DATA.couleursCanape[couchIndex]);
      hud.toast("🛋️ Nouveau canapé ! (regarde le modèle d'expo)");
    } else {
      hud.toast("💶 Pas assez d'argent (50 €)");
    }
  } else if (spot.type === "borne" && vieReelle()) {
    // les bornes d'arcade : Snake (cols 6/12) ou Casse-briques (cols 8/14)
    effects = {};
    if (money >= 2) {
      money -= 2;
      startMinigame(spot.rect.x0 === 6 || spot.rect.x0 === 12 ? "snake" : "breakout");
      return;
    }
    hud.toast("💶 Il faut 2 € pour jouer");
  } else if (spot.type === "tv") {
    // la télé : Pong avec Robin s'il est là, sinon un petit épisode
    effects = {};
    if (vieReelle() && activeNpcs.partner && !robinParti) {
      startMinigame("pong");
      return;
    }
    needs.apply({ fun: 15 });
    dialogue.showKey("use_tv", "player", clock.bucket());
  } else if (spot.type === "metro") {
    // le métro : maison ↔ Paris (fermé pendant l'histoire)
    effects = {};
    if (!vieReelle()) {
      hud.toast("🚇 Fermé pour travaux. (Plus tard…)");
    } else if (mapId === "home") {
      switchMap("paris", { x: 3.5, y: 2.4 });
      return;
    } else {
      switchMap("home", { x: 23.5, y: 12.5 });
      return;
    }
  } else if (spot.type === "date_board") {
    if (!vieReelle()) {
      hud.toast("📅 (Plus tard…)");
    } else if (robinParti) {
      hud.toast("💔 Robin n'est pas là…");
    } else if (money >= 30) {
      money -= 30;
      startDateNight();
    } else {
      hud.toast("💶 Pas assez d'argent (30 €)");
    }
  } else if (isNpc && stinky) {
    // personne ne veut te parler dans cet état
    effects = {};
    dialogue.showKey("talk_beurk", spot.type, clock.bucket());
  } else if (spot.type === "partner" && vieReelle() && robinParti) {
    // Robin boude au bureau…
    if (hasFlowers) {
      hasFlowers = false;
      robinParti = false;
      needs.values.amour = CONFIG.vieReelle.amourRetour;
      playSequence(DATA.sequences.reconquete ?? []);
      pendingPartnerMove = { x: SPAWNS.partnerDay.x, y: SPAWNS.partnerDay.y };
      world.spawnHearts(player.x, player.y - 0.8, 10);
    } else {
      dialogue.showKey("robin_boude", "partner", clock.bucket());
    }
  } else if (spot.type === "partner" && vieReelle() && carrying && carrying !== "ingredients") {
    // lui donner le plat en main propre (valide aussi la quête q1)
    const plat = carrying;
    carrying = null;
    const isPref = !!plat.recette.prefere;
    needs.apply({ amour: isPref ? CONFIG.cuisine.amourDinerPrefere : CONFIG.cuisine.amourDiner, social: 15 });
    dialogue.showKey("sert_plat", "partner", clock.bucket());
    world.spawnHearts(player.x, player.y - 0.8, isPref ? 10 : 6);
  } else if (spot.type === "partner" && vieReelle() && hasFlowers) {
    // offrir le bouquet ❤
    hasFlowers = false;
    needs.apply({ amour: CONFIG.vieReelle.amourFleurs });
    dialogue.showKey("offre_fleurs", "partner", clock.bucket());
    world.spawnHearts(player.x, player.y - 0.8, 8);
  } else if (def.dlg) {
    let key = def.dlg;
    if (spot.type === "partner" && inStory()) {
      const qid = quests.current?.id;
      key = qid === "premier_date" || qid === "saint_valentin" ? "talk_robin_date" : "talk_robin_avant";
    } else if (spot.type === "partner" && vieReelle() && needs.values.amour < 25) {
      key = "partner_talk_triste";
    }
    dialogue.showKey(key, def.speaker, clock.bucket());
  }
  needs.apply(effects);
  interactions.emit(spot.type);
}

function startInteraction(spot) {
  const def = ACTIONS[spot.type];
  if (!def) return;
  if (def.special === "sleep") {
    if (def.dlg) dialogue.showKey(def.dlg, def.speaker, clock.bucket());
    pendingSleep = true;
    interactions.emit(spot.type); // le lit peut valider une étape de quête
    return;
  }
  if (def.duration > 0) action = { spot, def, t: 0 };
  else completeInteraction(spot, def);
}

function doSleep() {
  state = "sleeping";
  fadeEl.style.opacity = "1";
  setTimeout(() => {
    clock.sleep();
    needs.apply({ energie: 100 });
    const wakeToast = `☀ Jour ${clock.day} — ${String(CONFIG.wakeUpHour).padStart(2, "0")}h00, bien dormi !`;
    fadeEl.style.opacity = "0";
    // parfois, un rêve 💭
    const dream =
      vieReelle() && DATA.reves?.length && Math.random() < 0.5
        ? DATA.reves[Math.floor(Math.random() * DATA.reves.length)]
        : null;
    if (dream) {
      if (dream.amour) needs.apply({ amour: 8 });
      startCinematic([`💭 ${dream.texte}`], () => hud.toast(wakeToast));
    } else {
      hud.toast(wakeToast);
      setTimeout(() => {
        state = "playing";
      }, 700);
    }
  }, 800);
}

function questHudText() {
  if (robinParti)
    return ["💔 Robin est parti bouder", "Cueille des fleurs au jardin et va le voir à l'hôpital", false];
  if (quests.allDone) {
    if (demandeFaite)
      return ["💍 Fiancés !", `${happyDays} jour(s) heureux — et toute la vie devant vous ❤`, true];
    return ["La vie à deux ❤", `${happyDays} jour(s) heureux — entretiens l'amour… qui sait ? 💍`, true];
  }
  return [quests.current.titre, quests.currentStep.label, false];
}

// humeur globale (moyenne des jauges) → petit emoji dans l'horloge
function moodEmoji() {
  const v = needs.values;
  const keys = vieReelle()
    ? ["faim", "energie", "hygiene", "fun", "social", "amour"]
    : ["faim", "energie", "hygiene", "fun", "social"];
  const avg = keys.reduce((s, k) => s + v[k], 0) / keys.length;
  return { avg, emoji: avg >= 70 ? "😄" : avg >= 50 ? "🙂" : avg >= 35 ? "😐" : avg >= 20 ? "😟" : "😭" };
}

// la chaussette n'existe que lorsque sa quête la cherche
function spotVisible(type) {
  if (type === "lost_item") return quests.isCurrentTarget("lost_item");
  return true;
}

// carte de départ
refreshMap();

// hook de debug (utile en développement, inoffensif en prod)
window.__game = {
  player,
  npcs,
  clock,
  needs,
  quests,
  dialogue,
  get mapId() {
    return mapId;
  },
  goMap: (id, x, y) => switchMap(id, { x, y }),
  endCinematic: () => endCinematic(),
  get robinParti() {
    return robinParti;
  },
  get hasFlowers() {
    return hasFlowers;
  },
  get money() {
    return money;
  },
  set money(v) {
    money = v;
  },
  get demandeFaite() {
    return demandeFaite;
  },
  get dateVenue() {
    return dateVenue;
  },
  get pantry() {
    return pantry;
  },
  set pantry(v) {
    pantry = v;
  },
  get seeds() {
    return seeds;
  },
  set seeds(v) {
    seeds = v;
  },
  get carrying() {
    return carrying;
  },
  get plots() {
    return plots;
  },
  get dirt() {
    return dirt;
  },
  get cookPos() {
    return state === "cooking" ? Math.sin(cookT * CONFIG.cuisine.cursorSpeed) : null;
  },
  get state() {
    return state;
  },
  miniPeek: () => minigames.peek(),
};

// --- boucle de jeu ---
let last = performance.now();
function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  if (state === "title") {
    if (input.readStart()) {
      titleEl.classList.add("hidden-fade");
      input.readInteract();
      startCinematic(DATA.intro);
    }
    world.updateCamera(player.x, player.y, dt, true);
    world.render();
    return;
  }

  if (state === "cinematic") {
    if (input.readSkip()) endCinematic();
    else if (input.readStart() || input.readInteract()) advanceCinematic();
    world.updateCamera(player.x, player.y, dt, true);
    world.render();
    return;
  }

  if (state === "dead") {
    if (input.readStart()) revive();
    input.readInteract();
    world.render();
    return;
  }

  dialogue.update(dt);
  if (state !== "cooking" && state !== "minigame") input.readSkip();

  if (dialogue.isOpen) {
    if (input.readInteract()) dialogue.advance();
  } else if (state === "sleeping" || state === "travel") {
    input.readInteract();
  } else if (state === "cooking") {
    // mini-jeu de cuisson : E au bon moment, Échap pour renoncer
    cookT += dt;
    const pos = Math.sin(cookT * CONFIG.cuisine.cursorSpeed);
    hud.showCookbar(pos);
    if (input.readSkip()) {
      carrying = "ingredients"; // on garde les ingrédients
      cancelCooking();
    } else if (input.readInteract()) {
      resolveCooking(Math.abs(pos));
    } else if (cookT >= CONFIG.cuisine.timeout) {
      resolveCooking(1); // laissé sur le feu…
    }
  } else if (state === "minigame") {
    if (input.readSkip()) {
      minigames.abort();
      state = "playing";
      hud.toast("🎮 Partie quittée");
      input.readInteract();
    } else {
      const res = minigames.update(dt, input);
      input.readInteract();
      if (res) {
        state = "playing";
        rewardMinigame(res);
      }
    }
  } else if (pendingSleep) {
    pendingSleep = false;
    input.readInteract();
    doSleep();
  } else if (pendingTransition) {
    pendingTransition = false;
    input.readInteract();
    startCinematic(DATA.transition_valentin, startValentin);
  } else if (pendingEgypte) {
    pendingEgypte = false;
    input.readInteract();
    startCinematic(DATA.transition_egypte, startEgypte);
  } else if (pendingAlbanie) {
    pendingAlbanie = false;
    input.readInteract();
    startCinematic(DATA.transition_albanie, startAlbanie);
  } else if (pendingInterlude) {
    pendingInterlude = false;
    input.readInteract();
    startCinematic(DATA.interlude, moveInTogether);
  } else {
    // téléportation différée de Robin (départ ou retour)
    if (pendingPartnerMove) {
      npcs.partner.x = pendingPartnerMove.x;
      npcs.partner.y = pendingPartnerMove.y;
      pendingPartnerMove = null;
      refreshMap();
      if (!robinParti) hud.toast("❤ Robin est rentré à la maison !");
    }

    // événements horaires — seulement une fois la vie à deux commencée
    for (const ev of clock.update(dt)) {
      if (inStory()) continue;
      dialogue.showKey(ev.key, ev.speaker, clock.bucket());
      if (ev.effects) needs.apply(ev.effects);
    }
    needs.update(dt, vieReelle() ? [] : ["amour"]);

    // la vraie vie a des conséquences…
    if (vieReelle() && state === "playing") {
      if (needs.values.faim <= 0) {
        die();
        return;
      }
      if (needs.values.energie <= 0) {
        collapse();
        return;
      }
      if (!robinParti && needs.values.amour <= 0) robinPart();
      if (needs.values.hygiene <= CONFIG.vieReelle.stinkThreshold && Math.random() < dt * 0.7) {
        world.spawnStink(player.x, player.y - 0.9);
      }

      // visites surprises de Mylène ou Maman (vérifié à chaque heure pleine)
      const hourNow = Math.floor(clock.hourFloat);
      if (hourNow !== lastHourChecked) {
        lastHourChecked = hourNow;
        if (!visitor && hourNow >= 10 && hourNow <= 18 && Math.random() < 0.22) {
          const id = Math.random() < 0.5 ? "mylene" : "maman";
          visitor = { id, until: clock.minutes + 180, day: clock.day };
          npcs[id].x = 17.5;
          npcs[id].y = 10.5;
          hud.toast(`🔔 ${DATA.characters[id].nom} passe dire coucou !`);
          if (mapId === "home") refreshMap();
        }
      }
      if (visitor && (clock.minutes > visitor.until || clock.day !== visitor.day)) {
        hud.toast(`👋 ${DATA.characters[visitor.id].nom} rentre chez elle. À bientôt !`);
        npcs[visitor.id].x = SPAWNS[visitor.id].x;
        npcs[visitor.id].y = SPAWNS[visitor.id].y;
        visitor = null;
        if (mapId === "home") refreshMap();
      }

      // 💍 le chapitre final : un soir, quand l'amour est au sommet…
      const partnerNpc = activeNpcs.partner;
      if (
        !demandeFaite &&
        quests.allDone &&
        !robinParti &&
        needs.values.amour >= 95 &&
        clock.hourFloat >= 20 &&
        clock.hourFloat < 23 &&
        partnerNpc &&
        Math.hypot(partnerNpc.x - player.x, partnerNpc.y - player.y) < 2.2
      ) {
        demandeFaite = true;
        playSequence(DATA.sequences.demande ?? []);
        world.spawnHearts(player.x, player.y - 0.6, 20);
        hud.toast("💍 FIANCÉS !!!");
      }
    }

    // saleté : au-delà du seuil, le moral s'use plus vite (et Robin remarque)
    if (vieReelle() && dirt.length >= CONFIG.menage.seuilMalus) {
      needs.values.fun = Math.max(0, needs.values.fun - 0.09 * dt);
      if (Math.random() < dt * 0.008 && activeNpcs.partner) {
        hud.toast("🧹 Robin : « …on nettoie un peu ? »");
      }
    }

    // tick journalier : jours heureux, potager, nouvelles taches
    if (clock.day !== lastDay) {
      if (moodEmoji().avg >= 55) happyDays += 1;
      lastDay = clock.day;
      if (vieReelle()) {
        let changed = false;
        for (const pl of plots) {
          if (pl.state === "plantee") {
            if (pl.watered) {
              pl.growth += 1;
              if (pl.growth >= CONFIG.potager.joursCroissance) {
                pl.state = "mure";
                hud.toast("🥕 Le potager est mûr !");
              }
              changed = true;
            }
            pl.watered = false;
          }
        }
        const n = 1 + Math.floor(Math.random() * 2);
        for (let k = 0; k < n && dirt.length < CONFIG.menage.maxTaches; k++) {
          const free = DIRT_SPOTS.filter(([c, r]) => !dirt.some((d) => d.col === c && d.row === r));
          if (free.length) {
            const [c, r] = free[Math.floor(Math.random() * free.length)];
            dirt.push({ col: c, row: r });
            changed = true;
          }
        }
        if (changed && mapId === "home") refreshMap();
      }
    }

    const evening = clock.hourFloat >= 20 || clock.hourFloat < 6;
    let partnerAnchor;
    if (!inStory()) {
      partnerAnchor = robinParti
        ? SPAWNS.partnerDev
        : evening
          ? SPAWNS.partnerEvening
          : SPAWNS.partnerDay;
    } else if (quests.current?.id === "premier_date") {
      partnerAnchor = SPAWNS.partnerLouvre;
    } else if (quests.current?.id === "saint_valentin") {
      partnerAnchor = quests.si <= 1 ? SPAWNS.partnerArcade : SPAWNS.partnerKong;
    } else {
      partnerAnchor = SPAWNS.partnerDev;
    }
    if (!inStory() && dateVenue) {
      partnerAnchor = dateVenue === "paris" ? SPAWNS.partnerKong : SPAWNS.partnerLouvre;
    }
    const anchors = {
      partner: partnerAnchor,
      sophie: SPAWNS.sophie,
      romain: SPAWNS.romain,
      arij: SPAWNS.arij,
      mahrez: SPAWNS.mahrez,
      david: SPAWNS.david,
      mylene: visitor?.id === "mylene" ? { x: 11, y: 10.5 } : SPAWNS.mylene,
      maman: visitor?.id === "maman" ? { x: 11, y: 10.5 } : SPAWNS.maman,
    };
    for (const [id, npc] of Object.entries(activeNpcs)) {
      // le PNJ attendu par l'étape de quête en cours s'arrête et attend
      if (quests.currentStep?.target === id) {
        npc.state = "idle";
        npc.moving = false;
        npc.timer = Math.max(npc.timer, 1);
        npc.sync();
        continue;
      }
      npc.update(dt, isSolid, anchors[id]);
    }

    if (action) {
      action.t += dt;
      input.readInteract();
      if (action.t >= action.def.duration) {
        const { spot, def } = action;
        action = null;
        hud.hideActionBar();
        completeInteraction(spot, def);
      }
    } else {
      const speedMode =
        vieReelle() && needs.values.energie <= CONFIG.vieReelle.crawlThreshold
          ? "crawl"
          : needs.anyLow()
            ? "tired"
            : "normal";
      player.update(dt, input, isSolid, speedMode);
      quests.handleGoto(player.x, player.y, mapId);

      // sorties de carte (on marche dessus → téléportation)
      let traveled = false;
      for (const ex of MAPS[mapId].exits) {
        if (player.x >= ex.x0 && player.x <= ex.x1 && player.y >= ex.y0 && player.y <= ex.y1) {
          switchMap(ex.to, ex.at);
          traveled = true;
          break;
        }
      }

      if (!traveled) {
        const spot = interactions.update(player.x, player.y, spotVisible, quests.currentStep?.target);
        if (input.readInteract() && spot) startInteraction(spot);
      }
    }

    // petits cœurs quand Robin et elle sont proches (sur la même carte)
    const partner = activeNpcs.partner;
    if (partner && Math.hypot(partner.x - player.x, partner.y - player.y) < 2 && Math.random() < dt * 0.12) {
      world.spawnHearts(partner.x, partner.y - 1.2, 1);
    }
  }

  // --- affichage (toujours) ---
  world.setFurnitureVisible("lost_item", quests.isCurrentTarget("lost_item"));
  world.update(dt);
  world.updateCamera(player.x, player.y, dt);

  hud.setNeedVisible("amour", vieReelle());
  hud.updateNeeds(needs.values);
  hud.setClock(clock.day, clock.timeString(), vieReelle() ? moodEmoji().emoji : "");
  hud.setMoney(money, vieReelle());
  let invText = `🧺 ${pantry} · 🌱 ${seeds}`;
  if (hasFlowers) invText += " · 🌼 bouquet";
  if (carrying === "ingredients") invText += " · 🧺 en main";
  else if (carrying) invText += ` · 🍲 ${carrying.recette.nom}`;
  hud.setInv(invText, vieReelle());
  const [qTitle, qStep, qDone] = questHudText();
  hud.setQuest(qTitle, qStep, qDone);
  tintEl.style.backgroundColor = clock.tintColor();

  // texte de prompt contextuel (potager, frigo, table…)
  function promptText(spot) {
    if (spot.type === "garden_plot") {
      const pl = plots[PLOT_COLS.indexOf(spot.rect.x0)];
      if (pl.state === "vide") return `Planter 🌱 (graines : ${seeds})`;
      if (pl.state === "plantee") return pl.watered ? "💧 Arrosé — ça pousse…" : "Arroser 💧";
      return "Récolter 🥕";
    }
    if (vieReelle()) {
      if (spot.type === "fridge") return `Le frigo (🧺 ×${pantry})`;
      if (spot.type === "stove") return carrying === "ingredients" ? "Cuisiner 🍳 !" : DATA.flavor.stove;
      if (spot.type === "table" && carrying && carrying !== "ingredients") return "Servir le dîner ❤";
      if (spot.type === "tv" && activeNpcs.partner && !robinParti) return "Jouer à la console avec Robin 🎮";
      if (spot.type === "her_desk") return "Travailler 📊 (rush de données)";
    }
    return spot.label ?? DATA.flavor[spot.type] ?? spot.type;
  }

  const spot = !dialogue.isOpen && !action && state === "playing" ? interactions.current : null;
  if (spot) {
    const p = world.project(spot.cx, spot.cy, 1.7);
    hud.showPrompt(promptText(spot), p.sx, p.sy);
  } else {
    hud.hidePrompt();
  }

  if (action) {
    const p = world.project(player.x, player.y + 0.5, 0);
    hud.showActionBar(action.t / action.def.duration, p.sx, p.sy);
  }

  const low = needs.lowestLow();
  if (low && !dialogue.isOpen && state === "playing") {
    const p = world.project(player.x, player.y, 1.55);
    hud.showBubble(CONFIG.needs[low].icon, p.sx, p.sy);
  } else {
    hud.hideBubble();
  }

  world.render();
}
requestAnimationFrame(loop);
