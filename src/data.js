// ============================================================================
//  ★★★  C'EST ICI QUE TU PERSONNALISES LE JEU  ★★★
// ============================================================================
//  Tout le contenu personnel (prénoms, couleurs, dialogues, private jokes,
//  quêtes) vit dans CE fichier. Le reste du code n'a jamais besoin d'être
//  modifié. Remplace les textes entre [CROCHETS] par vos vraies références,
//  ajoute autant de répliques que tu veux dans les listes : le jeu en pioche
//  une au hasard à chaque fois.
//
//  Moments de la journée disponibles pour les dialogues :
//    "matin" (6h-11h), "jour" (11h-18h), "soir" (18h-23h), "nuit" (23h-6h)
//    et "any" = à n'importe quelle heure (utilisé si le moment n'a pas de liste).
// ============================================================================

export default {
  meta: {
    titre: "Notre Petite Maison",
    // Affiché sur l'écran titre sous le titre du jeu :
    dedicace: "Pour toi, [PRÉNOM DE TA FEMME] ❤",
    jourDepart: "Samedi",
  },

  characters: {
    // Le personnage jouable : ta femme.
    player: {
      nom: "[PRÉNOM DE TA FEMME]",
      // Couleurs du sprite : H = cheveux, S = peau, T = robe/haut, P = jambes, F = chaussures
      palette: {
        H: "#6b3f23", // cheveux (châtain)
        S: "#f2c9a0", // peau
        T: "#d95d7f", // robe
        P: "#f2c9a0", // jambes
        F: "#7a3b52", // chaussures
        K: "#3b2b40", // yeux
      },
    },
    // Le PNJ partenaire : toi.
    partner: {
      nom: "Robin",
      palette: {
        H: "#2b2b2b", // cheveux
        S: "#e8b78e", // peau
        T: "#4f7d4f", // t-shirt
        P: "#444a55", // pantalon
        F: "#2e3138", // chaussures
        K: "#2b2330", // yeux
      },
    },
  },

  // --------------------------------------------------------------------------
  // DIALOGUES — une réplique est tirée au hasard dans la liste du moment
  // de la journée courant (sinon dans "any").
  // --------------------------------------------------------------------------
  dialogues: {
    // Quand on parle à Robin (PNJ)
    partner_talk: {
      any: [
        "Coucou toi ! [PRIVATE JOKE À METTRE ICI]",
        "Tu te souviens de [UN SOUVENIR À VOUS] ? Moi j'y pense encore.",
        "T'es la plus belle, même en pixels.",
        "[SURNOM QU'IL TE DONNE], je t'aime fort.",
      ],
      matin: [
        "Café d'abord, câlins ensuite ? Ou l'inverse ?",
        "Bien dormi mon amour ?",
      ],
      soir: [
        "On se lance un épisode de [VOTRE SÉRIE] ce soir ?",
        "Ce soir c'est [VOTRE RITUEL DU SOIR] !",
      ],
      nuit: ["Tu devrais aller dormir, il est tard…"],
    },

    // Objets de la maison
    use_fridge: {
      any: [
        "Miam… il reste du [SON PLAT PRÉFÉRÉ] !",
        "Quelqu'un a ENCORE fini les [SA GOURMANDISE]…",
      ],
      matin: ["Petit-déj ! La chose la plus importante de la journée."],
    },
    use_stove: {
      any: ["Ça sent bon dans toute la maison…", "Attention, ça chauffe !"],
    },
    use_bed: {
      any: ["Une petite sieste réparatrice…"],
      soir: ["Bonne nuit mon amour."],
      nuit: ["Enfin au lit…"],
    },
    use_shower: {
      any: [
        "🎵 [LA CHANSON QU'ELLE CHANTE SOUS LA DOUCHE] 🎵",
        "L'eau chaude, meilleure invention de l'humanité.",
      ],
    },
    use_couch: {
      any: ["Pause canapé bien méritée.", "Juste un épisode. Promis. (non)"],
      soir: ["La soirée parfaite commence ici."],
    },
    use_bookshelf: {
      any: [
        "Tiens, [UN LIVRE/MANGA QU'ELLE ADORE] ! Un classique.",
        "Il faudrait vraiment ranger cette étagère un jour.",
      ],
    },
    use_plant: {
      any: [
        "La plante que personne n'oublie JAMAIS d'arroser. (si, [QUI OUBLIE ?])",
        "Pousse, petite plante, pousse.",
      ],
    },
    use_table: {
      any: ["Les fleurs de [OCCASION OÙ IL T'A OFFERT DES FLEURS]."],
    },
    use_photo: {
      any: [
        "Notre photo de [VOTRE VOYAGE / MOMENT PRÉFÉRÉ]…",
        "On avait l'air si jeunes sur cette photo. C'était il y a [DURÉE] !",
      ],
    },

    // Événements horaires
    event_cafe_matin: {
      any: ["☕ 8h : l'heure sacrée du café ensemble. +15 énergie !"],
    },
    event_serie_soir: {
      any: ["📺 21h : c'est l'heure de votre série ! Le canapé rapporte double fun."],
    },

    // Fins de quêtes
    quest_done_q1: {
      any: ["C'était le plat de [OCCASION SPÉCIALE : premier rdv ? anniversaire ?] ❤"],
    },
    quest_done_q2: {
      any: ["LA chaussette perdue ! Elle était dans le jardin depuis [DURÉE ABSURDE]."],
    },
    quests_all_done: {
      any: ["Tous les objectifs sont finis… mais la vie continue, tranquillement, ensemble ❤"],
    },
  },

  // --------------------------------------------------------------------------
  // FLAVOR — le petit texte affiché quand on s'approche d'un objet ([E] …)
  // --------------------------------------------------------------------------
  flavor: {
    fridge: "Le frigo — toujours plein de [SA GOURMANDISE]",
    stove: "La cuisinière",
    bed: "Notre lit douillet",
    shower: "La douche (salle de concert privée)",
    couch: "Le canapé des soirées série",
    bookshelf: "L'étagère à [LIVRES / MANGAS / JEUX]",
    plant: "La plante (survivante)",
    table: "La petite table aux fleurs",
    photo: "Notre photo encadrée",
    lost_item: "Une chaussette ?!",
    partner: "Robin",
  },

  // --------------------------------------------------------------------------
  // QUÊTES — accomplies dans l'ordre. Chaque étape = interagir avec `target`.
  // Targets possibles : fridge, stove, bed, shower, couch, bookshelf, plant,
  //                     table, partner, lost_item
  // --------------------------------------------------------------------------
  quests: [
    {
      id: "q1",
      titre: "Le dîner surprise",
      description: "Prépare le plat préféré de Robin.",
      steps: [
        { target: "fridge",  label: "Prendre les ingrédients dans le frigo" },
        { target: "stove",   label: "Cuisiner le [PLAT PRÉFÉRÉ DE ROBIN]" },
        { target: "partner", label: "Servir Robin" },
      ],
      rewardDialogue: "quest_done_q1",
    },
    {
      id: "q2",
      titre: "La chaussette perdue",
      description: "Robin a ENCORE perdu une chaussette. Retrouve-la.",
      steps: [
        { target: "partner",   label: "Demander à Robin où il l'a vue en dernier" },
        { target: "lost_item", label: "Fouiller… le jardin ?" },
      ],
      rewardDialogue: "quest_done_q2",
    },
  ],
};
