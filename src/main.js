// Bootstrap + boucle de jeu : câble le monde, la joueuse, les PNJ et tous les
// systèmes (besoins, interactions, dialogues, horloge, quêtes, cinématique).
import DATA from "./data.js";
import { CONFIG } from "./config.js";
import { createWorld } from "./world.js";
import { buildCollision, SPAWNS, PLACEMENTS } from "./map.js";
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
const isSolid = buildCollision();
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

// PNJ : les collègues à l'hôpital — Robin y travaille aussi, la rencontre
// n'a pas encore eu lieu !
const npcs = {};
for (const id of ["partner", "sophie", "romain", "arij", "mahrez", "david"]) {
  const c = DATA.characters[id];
  if (!c) continue;
  const view = createCharacterView(world, c.spriteSet ?? "him", c.palette);
  npcs[id] = new NPC(view, SPAWNS[id].x, SPAWNS[id].y);
}

// Pendant les quêtes d'histoire, Robin est au bureau des devs et ne connaît
// pas encore la joueuse.
const STORY_IDS = new Set(["grand_jour", "entretien", "equipe", "devs", "nuit_appel"]);
function inStory() {
  return STORY_IDS.has(quests?.current?.id);
}

const interactions = new Interactions(PLACEMENTS, npcs);

let pendingInterlude = false;

const quests = new Quests(DATA.quests, {
  onStepDone: () => hud.toast("✔ Étape accomplie !"),
  // effets attachés à une étape terminée (saut d'horloge, séquence auto…)
  onStepComplete: (step) => {
    if (step?.clockTo !== undefined) {
      clock.minutes = step.clockTo * 60;
      clock.prevMinutes = clock.minutes;
      hud.toast("🌙 Le soir tombe…");
    }
    if (step?.sequenceAfter) playSequence(DATA.sequences[step.sequenceAfter] ?? []);
  },
  onQuestDone: (q, allDone) => {
    world.spawnHearts(player.x, player.y - 0.8, 7);
    hud.toast(`Objectif terminé : ${q.titre} ❤`);
    if (q.rewardDialogue) dialogue.showKey(q.rewardDialogue, "player", clock.bucket());
    if (q.id === "nuit_appel") pendingInterlude = true; // l'ellipse ❤ après l'appel
    if (allDone) dialogue.showKey("quests_all_done", "partner", clock.bucket());
  },
});
interactions.onInteract((type) => quests.handleInteract(type));

// --- état global ---
let state = "title"; // title | cinematic | playing | sleeping
let action = null; // { spot, def, t } pendant une action minutée
let pendingSleep = false;

const tintEl = document.getElementById("tint");
const fadeEl = document.getElementById("sleep-fade");
const titleEl = document.getElementById("title-screen");
const cineEl = document.getElementById("cinematic");
const cineTextEl = document.getElementById("cine-text");

// --- cinématiques (intro + interlude) ---
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
  void card.offsetWidth; // relance l'animation d'apparition
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

// Après la rencontre : quelques mois plus tard, la vie à deux commence.
function moveInTogether() {
  player.x = SPAWNS.player.x;
  player.y = SPAWNS.player.y;
  const partner = npcs.partner;
  partner.x = SPAWNS.partnerDay.x;
  partner.y = SPAWNS.partnerDay.y;
  partner.state = "idle";
  partner.timer = 2;
  clock.sleep(); // nouveau matin, nouvelle vie
  world.updateCamera(player.x, player.y, 0, true);
  world.spawnHearts(player.x, player.y - 0.8, 9);
  hud.toast("❤ Quelques mois plus tard… chez vous.");
}
cineEl.addEventListener("pointerdown", (e) => {
  e.stopPropagation();
  if (state === "cinematic") advanceCinematic();
});

// --- séquences scénarisées (dialogues à plusieurs voix) ---
function playSequence(lines) {
  for (const line of lines) {
    const name = DATA.characters[line.qui]?.nom ?? line.qui;
    dialogue.show(name, line.texte);
  }
}

function completeInteraction(spot, def) {
  let effects = def.effects ?? {};
  // pendant la soirée série, le canapé rapporte double fun
  if (spot.type === "couch" && clock.serieActive) {
    effects = { ...effects, fun: (effects.fun ?? 0) * 2 };
  }
  needs.apply(effects);
  npcs[spot.type]?.startTalk(player.x, player.y);
  // étape d'histoire scénarisée → la séquence remplace le dialogue habituel
  const step = quests.currentStep;
  if (step?.sequence && step.target === spot.type) {
    playSequence(DATA.sequences[step.sequence] ?? []);
  } else if (def.dlg) {
    // pendant l'histoire, Robin ne la connaît pas encore
    const key = spot.type === "partner" && inStory() ? "talk_robin_avant" : def.dlg;
    dialogue.showKey(key, def.speaker, clock.bucket());
  }
  interactions.emit(spot.type);
}

function startInteraction(spot) {
  const def = ACTIONS[spot.type];
  if (!def) return;
  if (def.special === "sleep") {
    if (def.dlg) dialogue.showKey(def.dlg, def.speaker, clock.bucket());
    pendingSleep = true; // le dodo démarre à la fermeture du dialogue
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

// hook de debug (utile en développement, inoffensif en prod)
window.__game = { player, npcs, clock, needs, quests, dialogue, endCinematic: () => endCinematic() };

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
    // monde figé pendant la lecture
    if (input.readInteract()) dialogue.advance();
  } else if (state === "sleeping") {
    input.readInteract();
  } else if (pendingSleep) {
    pendingSleep = false;
    input.readInteract();
    doSleep();
  } else if (pendingInterlude) {
    pendingInterlude = false;
    input.readInteract();
    startCinematic(DATA.interlude, moveInTogether);
  } else {
    // événements horaires (café de 8h, série de 21h…) — seulement une fois
    // la vie à deux commencée
    for (const ev of clock.update(dt)) {
      if (inStory()) continue;
      dialogue.showKey(ev.key, ev.speaker, clock.bucket());
      if (ev.effects) needs.apply(ev.effects);
    }
    needs.update(dt);

    const evening = clock.hourFloat >= 20 || clock.hourFloat < 6;
    const anchors = {
      partner: inStory()
        ? SPAWNS.partnerDev
        : evening
          ? SPAWNS.partnerEvening
          : SPAWNS.partnerDay,
      sophie: SPAWNS.sophie,
      romain: SPAWNS.romain,
      arij: SPAWNS.arij,
      mahrez: SPAWNS.mahrez,
      david: SPAWNS.david,
    };
    for (const [id, npc] of Object.entries(npcs)) npc.update(dt, isSolid, anchors[id]);

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
      quests.handleGoto(player.x, player.y);
      const spot = interactions.update(player.x, player.y, spotVisible);
      if (input.readInteract() && spot) startInteraction(spot);
    }

    // petits cœurs quand Robin et elle sont proches
    const partner = npcs.partner;
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
    hud.showPrompt(DATA.flavor[spot.type] ?? spot.type, p.sx, p.sy);
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
