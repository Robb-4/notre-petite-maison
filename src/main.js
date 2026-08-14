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
for (const id of ["partner", "sophie", "romain", "arij", "mahrez", "david"]) {
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
]);
function inStory() {
  return STORY_IDS.has(quests?.current?.id);
}

// Sur quelle carte vit chaque PNJ en ce moment ?
function npcMapOf(id) {
  if (id !== "partner") return "hospital";
  if (!inStory()) return "home";
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
  world.loadMap(MAPS[mapId]);
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
  interactions.setMap(MAPS[mapId].placements, activeNpcs);
  world.updateCamera(player.x, player.y, 0, true);
}

// téléportation vers une autre carte, avec fondu
function switchMap(to, at) {
  const previous = state;
  state = "travel";
  fadeEl.style.opacity = "1";
  setTimeout(() => {
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
    if (q.id === "saint_valentin") pendingInterlude = true; // l'ellipse ❤ finale
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

// Après la Saint-Valentin : quelques mois plus tard, la vie à deux commence.
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
  needs.apply(effects);
  activeNpcs[spot.type]?.startTalk(player.x, player.y);
  const step = quests.currentStep;
  if (step?.sequence && step.target === spot.type) {
    playSequence(DATA.sequences[step.sequence] ?? []);
  } else if (def.dlg) {
    let key = def.dlg;
    if (spot.type === "partner" && inStory()) {
      const qid = quests.current?.id;
      key = qid === "premier_date" || qid === "saint_valentin" ? "talk_robin_date" : "talk_robin_avant";
    }
    dialogue.showKey(key, def.speaker, clock.bucket());
  }
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
    hud.toast(`☀ Jour ${clock.day} — ${String(CONFIG.wakeUpHour).padStart(2, "0")}h00, bien dormi !`);
    fadeEl.style.opacity = "0";
    setTimeout(() => {
      state = "playing";
    }, 700);
  }, 800);
}

function questHudText() {
  if (quests.allDone) return ["Objectifs ❤", "Tout est accompli — profitez !", true];
  return [quests.current.titre, quests.currentStep.label, false];
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

  dialogue.update(dt);
  input.readSkip();

  if (dialogue.isOpen) {
    if (input.readInteract()) dialogue.advance();
  } else if (state === "sleeping" || state === "travel") {
    input.readInteract();
  } else if (pendingSleep) {
    pendingSleep = false;
    input.readInteract();
    doSleep();
  } else if (pendingTransition) {
    pendingTransition = false;
    input.readInteract();
    startCinematic(DATA.transition_valentin, startValentin);
  } else if (pendingInterlude) {
    pendingInterlude = false;
    input.readInteract();
    startCinematic(DATA.interlude, moveInTogether);
  } else {
    // événements horaires — seulement une fois la vie à deux commencée
    for (const ev of clock.update(dt)) {
      if (inStory()) continue;
      dialogue.showKey(ev.key, ev.speaker, clock.bucket());
      if (ev.effects) needs.apply(ev.effects);
    }
    needs.update(dt);

    const evening = clock.hourFloat >= 20 || clock.hourFloat < 6;
    let partnerAnchor;
    if (!inStory()) {
      partnerAnchor = evening ? SPAWNS.partnerEvening : SPAWNS.partnerDay;
    } else if (quests.current?.id === "premier_date") {
      partnerAnchor = SPAWNS.partnerLouvre;
    } else if (quests.current?.id === "saint_valentin") {
      partnerAnchor = quests.si <= 1 ? SPAWNS.partnerArcade : SPAWNS.partnerKong;
    } else {
      partnerAnchor = SPAWNS.partnerDev;
    }
    const anchors = {
      partner: partnerAnchor,
      sophie: SPAWNS.sophie,
      romain: SPAWNS.romain,
      arij: SPAWNS.arij,
      mahrez: SPAWNS.mahrez,
      david: SPAWNS.david,
    };
    for (const [id, npc] of Object.entries(activeNpcs)) npc.update(dt, isSolid, anchors[id]);

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
      player.update(dt, input, isSolid, needs.anyLow());
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

  hud.updateNeeds(needs.values);
  hud.setClock(clock.day, clock.timeString());
  const [qTitle, qStep, qDone] = questHudText();
  hud.setQuest(qTitle, qStep, qDone);
  tintEl.style.backgroundColor = clock.tintColor();

  const spot = !dialogue.isOpen && !action && state === "playing" ? interactions.current : null;
  if (spot) {
    const p = world.project(spot.cx, spot.cy, 1.7);
    hud.showPrompt(spot.label ?? DATA.flavor[spot.type] ?? spot.type, p.sx, p.sy);
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
