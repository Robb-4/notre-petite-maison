// Détection de l'objet interactable le plus proche + définition des actions.
import { CONFIG } from "./config.js";
import { FURNITURE } from "./sprites.js";

// Ce que fait chaque interaction. duration en secondes (0 = instantané),
// effects = points de besoins, dlg = clé de dialogue, speaker = qui parle.
export const ACTIONS = {
  fridge: { duration: 2, effects: { faim: 45 }, dlg: "use_fridge", speaker: "player" },
  stove: { duration: 2.5, effects: { faim: 30 }, dlg: "use_stove", speaker: "player" },
  shower: { duration: 3, effects: { hygiene: 60 }, dlg: "use_shower", speaker: "player" },
  couch: { duration: 2, effects: { fun: 40 }, dlg: "use_couch", speaker: "player" },
  bookshelf: { duration: 1.5, effects: { fun: 15 }, dlg: "use_bookshelf", speaker: "player" },
  plant: { duration: 1, effects: { fun: 5 }, dlg: "use_plant", speaker: "player" },
  table: { duration: 1, effects: { fun: 5 }, dlg: "use_table", speaker: "player" },
  photo: { duration: 1, effects: { fun: 8, social: 5 }, dlg: "use_photo", speaker: "player" },
  bed: { special: "sleep", dlg: "use_bed", speaker: "player" },
  partner: { duration: 0, effects: { social: 35, fun: 10 }, dlg: "partner_talk", speaker: "partner" },
  lost_item: { duration: 1.2, effects: {}, dlg: null, speaker: "player" },
  // hôpital
  sophie: { duration: 0, effects: { social: 20, fun: 5 }, dlg: "talk_sophie", speaker: "sophie" },
  romain: { duration: 0, effects: { social: 20, fun: 5 }, dlg: "talk_romain", speaker: "romain" },
  arij: { duration: 0, effects: { social: 20, fun: 5 }, dlg: "talk_arij", speaker: "arij" },
  mahrez: { duration: 0, effects: { social: 20, fun: 5 }, dlg: "talk_mahrez", speaker: "mahrez" },
  david: { duration: 0, effects: { social: 20, fun: 5 }, dlg: "talk_david", speaker: "david" },
  her_desk: { duration: 1.2, effects: { fun: 10 }, dlg: "use_her_desk", speaker: "player" },
  sign: { duration: 0, effects: {}, dlg: "use_sign", speaker: "player" },
  signpost: { duration: 0, effects: {}, dlg: null, speaker: "player" },
  coffee: { duration: 1.5, effects: { energie: 15 }, dlg: "use_coffee", speaker: "player" },
  // le Louvre
  joconde: { duration: 0, effects: { fun: 10 }, dlg: "use_joconde", speaker: "player" },
  pyramid: { duration: 0, effects: { fun: 8 }, dlg: "use_pyramide", speaker: "player" },
  // la Saint-Valentin
  borne: { duration: 0, effects: { fun: 20 }, dlg: "use_borne", speaker: "player" },
  resto_table: { duration: 0, effects: { faim: 30, fun: 10 }, dlg: "use_resto_table", speaker: "player" },
  kong_statue: { duration: 0, effects: { fun: 5 }, dlg: "use_kong_statue", speaker: "player" },
};

// Distance d'un point au rectangle (0 si dedans).
function rectDist(px, py, r) {
  const dx = Math.max(r.x0 - px, 0, px - r.x1);
  const dy = Math.max(r.y0 - py, 0, py - r.y1);
  return Math.hypot(dx, dy);
}

export class Interactions {
  // placements: meubles de la carte courante ; npcs: { id: npcInstance }
  // présents sur cette carte (positions dynamiques — spots mobiles)
  constructor(placements, npcs) {
    this.listeners = [];
    this.current = null;
    this.setMap(placements, npcs);
  }

  // reconstruit les spots pour une nouvelle carte (les listeners restent)
  setMap(placements, npcs) {
    this.npcs = npcs;
    this.current = null;
    this.spots = [];
    for (const p of placements) {
      if (!ACTIONS[p.type]) continue;
      const def = FURNITURE[p.type];
      this.spots.push({
        type: p.type,
        label: p.label, // texte de prompt spécifique (ex : panneaux directionnels)
        rect: { x0: p.col, y0: p.row, x1: p.col + def.fw, y1: p.row + def.fh },
        cx: p.col + def.fw / 2,
        cy: p.row + def.fh / 2,
      });
    }
  }

  onInteract(cb) {
    this.listeners.push(cb);
  }

  emit(type) {
    for (const cb of this.listeners) cb(type);
  }

  // px,py = pieds du joueur. visibleFn(type) → false pour masquer un spot
  // (ex : la chaussette hors quête). preferred = cible de l'étape de quête en
  // cours : si elle est à portée, elle gagne toujours.
  update(px, py, visibleFn, preferred = null) {
    let best = null;
    let bestDist = CONFIG.interactRadius;
    let pref = null;
    let prefDist = Infinity;
    for (const s of this.spots) {
      if (visibleFn && !visibleFn(s.type)) continue;
      const d = rectDist(px, py, s.rect);
      if (d < bestDist) {
        bestDist = d;
        best = s;
      }
      if (s.type === preferred && d < CONFIG.interactRadius && d < prefDist) {
        prefDist = d;
        pref = s;
      }
    }
    // les PNJ sont des spots mobiles (rayon un peu plus généreux) — le plus
    // proche gagne, à égalité avec les meubles
    for (const [id, npc] of Object.entries(this.npcs)) {
      const d = Math.hypot(npc.x - px, npc.y - py);
      if (d < 1.3 && d < bestDist) {
        bestDist = d;
        best = { type: id, cx: npc.x, cy: npc.y, rect: null };
      }
      if (id === preferred && d < 1.3 && d < prefDist) {
        prefDist = d;
        pref = { type: id, cx: npc.x, cy: npc.y, rect: null };
      }
    }
    this.current = pref ?? best;
    return this.current;
  }
}
