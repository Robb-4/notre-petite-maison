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

// Sur quelle carte vit chaque PNJ en ce moment ?
function npcMapOf(id) {
  if (id === "mylene") return "egypte";
  if (id === "maman") return "albanie";
  if (id !== "partner") return "hospital";
  if (!inStory()) return robinParti ? "hospital" : "home";
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
    hud.toast(`☀ Jour ${clock.day} — ${String(CONFIG.wakeUpHour).padStart(2, "0")}h00, bien dormi !`);
    fadeEl.style.opacity = "0";
    setTimeout(() => {
      state = "playing";
    }, 700);
  }, 800);
}

function questHudText() {
  if (robinParti)
    return ["💔 Robin est parti bouder", "Cueille des fleurs au jardin et va le voir à l'hôpital", false];
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
  get robinParti() {
    return robinParti;
  },
  get hasFlowers() {
    return hasFlowers;
  },
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
    const anchors = {
      partner: partnerAnchor,
      sophie: SPAWNS.sophie,
      romain: SPAWNS.romain,
      arij: SPAWNS.arij,
      mahrez: SPAWNS.mahrez,
      david: SPAWNS.david,
      mylene: SPAWNS.mylene,
      maman: SPAWNS.maman,
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
