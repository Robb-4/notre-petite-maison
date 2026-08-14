// Bootstrap + boucle de jeu : câble le monde, le joueur, le PNJ et tous les
// systèmes (besoins, interactions, dialogues, horloge, quêtes, HUD).
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

const playerView = createCharacterView("her", DATA.characters.player.palette);
const player = new Player(playerView, SPAWNS.player.x, SPAWNS.player.y);
world.scene.add(playerView.mesh);

const npcView = createCharacterView("him", DATA.characters.partner.palette);
const npc = new NPC(npcView, SPAWNS.partner.x, SPAWNS.partner.y);
world.scene.add(npcView.mesh);

const interactions = new Interactions(PLACEMENTS, npc);

const quests = new Quests(DATA.quests, {
  onStepDone: () => hud.toast("✔ Étape accomplie !"),
  onQuestDone: (q, allDone) => {
    world.spawnHearts(player.x, player.y - 0.8, 7);
    hud.toast(`Objectif terminé : ${q.titre} ❤`);
    if (q.rewardDialogue) dialogue.showKey(q.rewardDialogue, "partner", clock.bucket());
    if (allDone) dialogue.showKey("quests_all_done", "partner", clock.bucket());
  },
});
interactions.onInteract((type) => quests.handleInteract(type));

// --- état global ---
let state = "title"; // title | playing | sleeping
let action = null; // { spot, def, t } pendant une action minutée
let pendingSleep = false;

const tintEl = document.getElementById("tint");
const fadeEl = document.getElementById("sleep-fade");
const titleEl = document.getElementById("title-screen");

function completeInteraction(spot, def) {
  let effects = def.effects ?? {};
  // pendant la soirée série, le canapé rapporte double fun
  if (spot.type === "couch" && clock.serieActive) {
    effects = { ...effects, fun: (effects.fun ?? 0) * 2 };
  }
  needs.apply(effects);
  if (spot.type === "partner") npc.startTalk(player.x, player.y);
  if (def.dlg) dialogue.showKey(def.dlg, def.speaker, clock.bucket());
  interactions.emit(spot.type);
}

function startInteraction(spot) {
  const def = ACTIONS[spot.type];
  if (!def) return;
  if (def.special === "sleep") {
    if (def.dlg) dialogue.showKey(def.dlg, def.speaker, clock.bucket());
    pendingSleep = true; // le dodo démarre à la fermeture du dialogue
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
window.__game = { player, npc, clock, needs, quests };

// --- boucle de jeu ---
let last = performance.now();
function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  if (state === "title") {
    if (input.readStart()) {
      titleEl.classList.add("hidden-fade");
      input.readInteract(); // évite une interaction immédiate au lancement
      state = "playing";
    }
    world.updateCamera(player.x, player.y, dt, true);
    world.render();
    return;
  }

  dialogue.update(dt);

  if (dialogue.isOpen) {
    // monde figé pendant la lecture
    if (input.readInteract()) dialogue.advance();
  } else if (state === "sleeping") {
    input.readInteract();
  } else if (pendingSleep) {
    pendingSleep = false;
    input.readInteract();
    doSleep();
  } else {
    // événements horaires (café de 8h, série de 21h…)
    for (const ev of clock.update(dt)) {
      dialogue.showKey(ev.key, ev.speaker, clock.bucket());
      if (ev.effects) needs.apply(ev.effects);
    }
    needs.update(dt);

    const evening = clock.hourFloat >= 20 || clock.hourFloat < 6;
    npc.update(dt, isSolid, evening ? SPAWNS.partnerEvening : SPAWNS.partnerDay);

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
      const spot = interactions.update(player.x, player.y, spotVisible);
      if (input.readInteract() && spot) startInteraction(spot);
    }

    // petits cœurs quand ils sont l'un près de l'autre
    if (Math.hypot(npc.x - player.x, npc.y - player.y) < 2 && Math.random() < dt * 0.12) {
      world.spawnHearts(npc.x, npc.y - 1.2, 1);
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
    const p = world.project(spot.cx, spot.topY - 0.2);
    hud.showPrompt(DATA.flavor[spot.type] ?? spot.type, p.sx, p.sy);
  } else {
    hud.hidePrompt();
  }

  if (action) {
    const p = world.project(player.x, player.y + 0.4);
    hud.showActionBar(action.t / action.def.duration, p.sx, p.sy);
  }

  const low = needs.lowestLow();
  if (low && !dialogue.isOpen && state === "playing") {
    const p = world.project(player.x, player.y - 1.5);
    hud.showBubble(CONFIG.needs[low].icon, p.sx, p.sy);
  } else {
    hud.hideBubble();
  }

  world.render();
}
requestAnimationFrame(loop);
