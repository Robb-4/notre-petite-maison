// ============================================================================
//  ★★★  C'EST ICI QUE TU PERSONNALISES LE JEU  ★★★
// ============================================================================
//  Tout le contenu personnel (prénoms, couleurs, cinématique, dialogues,
//  private jokes, quêtes) vit dans CE fichier. Remplace les textes entre
//  [CROCHETS] par vos vraies références. Dans les listes, une réplique est
//  tirée au hasard à chaque fois.
//
//  Moments de la journée pour les dialogues : "matin" (6h-11h), "jour"
//  (11h-18h), "soir" (18h-23h), "nuit" (23h-6h), et "any" = fallback.
// ============================================================================

export default {
  meta: {
    titre: "Notre Petite Maison",
    dedicace: "Pour toi, [PRÉNOM DE TA FEMME] ❤",
    jourDepart: "Samedi",
  },

  // --------------------------------------------------------------------------
  // PERSONNAGES — spriteSet: "her" (cheveux longs + robe) ou "him" (cheveux
  // courts + pantalon). Palette : H cheveux, S peau, K yeux, T haut/robe,
  // P jambes/pantalon, F chaussures.
  // --------------------------------------------------------------------------
  characters: {
    // Le personnage jouable : ta femme.
    player: {
      nom: "[PRÉNOM DE TA FEMME]",
      spriteSet: "her",
      palette: { H: "#6b3f23", S: "#f2c9a0", T: "#d95d7f", P: "#f2c9a0", F: "#7a3b52", K: "#3b2b40" },
    },
    // Le PNJ partenaire : toi.
    partner: {
      nom: "Robin",
      spriteSet: "him",
      palette: { H: "#2b2b2b", S: "#e8b78e", T: "#4f7d4f", P: "#444a55", F: "#2e3138", K: "#2b2330" },
    },
    // Les collègues de l'hôpital.
    sophie: {
      nom: "Sophie",
      spriteSet: "her",
      palette: { H: "#d8b04a", S: "#f2c9a0", T: "#35507a", P: "#f2c9a0", F: "#2e3138", K: "#3b2b40" },
    },
    romain: {
      nom: "Romain",
      spriteSet: "him",
      palette: { H: "#5a3d28", S: "#e8b78e", T: "#8a4baf", P: "#3a3f4a", F: "#2e3138", K: "#2b2330" },
    },
    arij: {
      nom: "Arij",
      spriteSet: "her",
      palette: { H: "#241f26", S: "#d9a878", T: "#c96a35", P: "#d9a878", F: "#4a2e1f", K: "#241f26" },
    },
  },

  // --------------------------------------------------------------------------
  // CINÉMATIQUE D'INTRO — votre histoire, une carte de texte à la fois.
  // Ajoute/retire autant de cartes que tu veux.
  // --------------------------------------------------------------------------
  intro: [
    "Il était une fois deux personnes qui se sont rencontrées [OÙ VOUS VOUS ÊTES RENCONTRÉS]…",
    "Le [DATE DE LA RENCONTRE], tout a commencé par [COMMENT ÇA A COMMENCÉ : un message ? un regard ? une blague nulle ?].",
    "Depuis, il y a eu [SOUVENIR 1], [SOUVENIR 2]… et ce moment inoubliable à [LIEU / VOYAGE].",
    "Et puis [VOTRE GRAND MOMENT : l'emménagement ? la demande ? le mariage ?] ❤",
    "Aujourd'hui, c'est un autre grand jour : l'entretien pour LE poste de data scientist à l'hôpital.",
    "Bonne chance mon amour. Cette petite maison croit en toi ❤",
  ],

  // --------------------------------------------------------------------------
  // SÉQUENCES SCÉNARISÉES — dialogues à plusieurs voix, joués pendant les
  // étapes d'histoire. `qui` = clé d'un personnage ci-dessus.
  // --------------------------------------------------------------------------
  sequences: {
    depart: [
      { qui: "partner", texte: "C'est le grand jour ! Tu vas les impressionner." },
      { qui: "player", texte: "J'ai le trac…" },
      { qui: "partner", texte: "Tu es la meilleure, fonce. Ce soir je prépare [SON PLAT PRÉFÉRÉ] pour fêter ça ❤" },
      { qui: "partner", texte: "L'hôpital est au bout du chemin, à l'est du jardin. File !" },
    ],
    entretien: [
      { qui: "sophie", texte: "Bonjour [PRÉNOM] ! Je suis Sophie, la cheffe d'équipe. Asseyez-vous." },
      { qui: "sophie", texte: "Alors… data scientist, hein ? Parlez-moi de vous." },
      { qui: "player", texte: "J'adore [SA SPÉCIALITÉ : les stats ? Python ? R ? le machine learning ?] !" },
      { qui: "sophie", texte: "Question technique : c'est quoi, une p-value ?" },
      { qui: "player", texte: "[SA RÉPONSE BRILLANTE — OU UNE BLAGUE DE STATS]" },
      { qui: "sophie", texte: "… Impressionnant. Dernière question : vous savez faire marcher la machine à café ?" },
      { qui: "player", texte: "C'est ma plus grande compétence." },
      { qui: "sophie", texte: "Parfait. Vous êtes EMBAUCHÉE ! Bienvenue à l'hôpital ❤" },
    ],
    meet_romain: [
      { qui: "romain", texte: "Salut, moi c'est Romain ! [PRIVATE JOKE / TRAIT DE ROMAIN À METTRE ICI]" },
      { qui: "player", texte: "Enchantée !" },
      { qui: "romain", texte: "Si tu as besoin d'aide avec [SUJET], c'est moi. Et info capitale : la machine à café est au bout du couloir." },
    ],
    meet_arij: [
      { qui: "arij", texte: "Bienvenue dans l'équipe ! Moi c'est Arij. [PRIVATE JOKE / TRAIT D'ARIJ À METTRE ICI]" },
      { qui: "player", texte: "Merci, je suis ravie d'être là !" },
      { qui: "arij", texte: "Entre nous : méfie-toi des réunions du lundi matin. [DÉTAIL DRÔLE]" },
    ],
    retour: [
      { qui: "player", texte: "Robin !! Je suis prise !!!" },
      { qui: "partner", texte: "JE LE SAVAIS ! Je suis tellement fier de toi ❤" },
      { qui: "partner", texte: "Ce soir on fête ça : [VOTRE FAÇON DE FÊTER]. Tu l'as tellement mérité." },
    ],
  },

  // --------------------------------------------------------------------------
  // DIALOGUES LIBRES — une réplique au hasard selon le moment de la journée.
  // --------------------------------------------------------------------------
  dialogues: {
    partner_talk: {
      any: [
        "Coucou toi ! [PRIVATE JOKE À METTRE ICI]",
        "Tu te souviens de [UN SOUVENIR À VOUS] ? Moi j'y pense encore.",
        "T'es la plus belle, même en pixels.",
        "[SURNOM QU'IL TE DONNE], je t'aime fort.",
      ],
      matin: ["Café d'abord, câlins ensuite ? Ou l'inverse ?", "Bien dormi mon amour ?"],
      soir: ["On se lance un épisode de [VOTRE SÉRIE] ce soir ?", "Ce soir c'est [VOTRE RITUEL DU SOIR] !"],
      nuit: ["Tu devrais aller dormir, il est tard…"],
    },

    // Les collègues, une fois l'histoire terminée
    talk_sophie: {
      any: [
        "Alors, prête pour de grands projets data ?",
        "Réunion lundi 9h. Le café est obligatoire, la bonne humeur aussi.",
        "[PHRASE TYPIQUE DE SOPHIE]",
      ],
    },
    talk_romain: {
      any: [
        "[BLAGUE RÉCURRENTE DE ROMAIN]",
        "Tu as vu le dashboard ? Il est ENCORE cassé.",
        "Pause café ? Pause café.",
      ],
    },
    talk_arij: {
      any: [
        "[BLAGUE RÉCURRENTE D'ARIJ]",
        "J'ai un notebook qui tourne depuis ce matin… croisons les doigts.",
        "Ce soir, [CE QU'ARIJ PROPOSE TOUJOURS] ?",
      ],
    },

    // Objets de la maison
    use_fridge: {
      any: ["Miam… il reste du [SON PLAT PRÉFÉRÉ] !", "Quelqu'un a ENCORE fini les [SA GOURMANDISE]…"],
      matin: ["Petit-déj ! La chose la plus importante de la journée."],
    },
    use_stove: { any: ["Ça sent bon dans toute la maison…", "Attention, ça chauffe !"] },
    use_bed: {
      any: ["Une petite sieste réparatrice…"],
      soir: ["Bonne nuit mon amour."],
      nuit: ["Enfin au lit…"],
    },
    use_shower: {
      any: ["🎵 [LA CHANSON QU'ELLE CHANTE SOUS LA DOUCHE] 🎵", "L'eau chaude, meilleure invention de l'humanité."],
    },
    use_couch: {
      any: ["Pause canapé bien méritée.", "Juste un épisode. Promis. (non)"],
      soir: ["La soirée parfaite commence ici."],
    },
    use_bookshelf: {
      any: ["Tiens, [UN LIVRE/MANGA QU'ELLE ADORE] ! Un classique.", "Il faudrait vraiment ranger cette étagère un jour."],
    },
    use_plant: {
      any: ["La plante que personne n'oublie JAMAIS d'arroser. (si, [QUI OUBLIE ?])", "Pousse, petite plante, pousse."],
    },
    use_table: { any: ["Les fleurs de [OCCASION OÙ IL T'A OFFERT DES FLEURS]."] },
    use_photo: {
      any: [
        "Notre photo de [VOTRE VOYAGE / MOMENT PRÉFÉRÉ]…",
        "On avait l'air si jeunes sur cette photo. C'était il y a [DURÉE] !",
      ],
    },

    // Objets de l'hôpital
    use_sign: { any: ["« Hôpital [NOM DE L'HÔPITAL] » — c'est ici !"] },
    use_her_desk: {
      any: ["Mon nouveau bureau ✨ Il ne manque plus qu'une plante et [SON OBJET FÉTICHE]."],
    },

    // Événements horaires
    event_cafe_matin: { any: ["☕ 8h : l'heure sacrée du café ensemble. +15 énergie !"] },
    event_serie_soir: { any: ["📺 21h : c'est l'heure de votre série ! Le canapé rapporte double fun."] },

    // Fins de quêtes
    quest_done_arrivee: { any: ["Te voilà à l'hôpital. Respire… tout va bien se passer ❤"] },
    quest_done_entretien: { any: ["EMBAUCHÉE ! Le champagne attendra ce soir 🍾"] },
    quest_done_equipe: { any: ["Une nouvelle aventure commence… et elle s'annonce très bien ❤"] },
    quest_done_q1: { any: ["C'était le plat de [OCCASION SPÉCIALE : premier rdv ? anniversaire ?] ❤"] },
    quest_done_q2: { any: ["LA chaussette perdue ! Elle était dans le jardin depuis [DURÉE ABSURDE]."] },
    quests_all_done: { any: ["Tous les objectifs sont finis… mais la vie continue, tranquillement, ensemble ❤"] },
  },

  // --------------------------------------------------------------------------
  // FLAVOR — le petit texte affiché quand on s'approche ([E] …)
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
    sophie: "Sophie (la cheffe)",
    romain: "Romain",
    arij: "Arij",
    sign: "Le panneau de l'hôpital",
    her_desk: "Ton nouveau bureau",
  },

  // --------------------------------------------------------------------------
  // QUÊTES — dans l'ordre. Types d'étapes :
  //   { target: "fridge", label: "…" }                → interagir avec la cible
  //   { target: "sophie", sequence: "entretien", … }  → joue la séquence scénarisée
  //   { goto: {x0,y0,x1,y1}, label: "…" }             → atteindre une zone
  // Targets : fridge, stove, bed, shower, couch, bookshelf, plant, table,
  //           photo, partner, lost_item, her_desk, sign, sophie, romain, arij
  // --------------------------------------------------------------------------
  quests: [
    {
      id: "grand_jour",
      titre: "Le grand jour",
      description: "L'entretien t'attend à l'hôpital.",
      steps: [
        { target: "partner", sequence: "depart", label: "Dire au revoir à Robin" },
        { goto: { x0: 30, y0: 9, x1: 34, y1: 12 }, label: "Aller à l'hôpital (suis le chemin vers l'est)" },
      ],
      rewardDialogue: "quest_done_arrivee",
    },
    {
      id: "entretien",
      titre: "L'entretien d'embauche",
      description: "Sophie t'attend dans son bureau.",
      steps: [
        { target: "sophie", sequence: "entretien", label: "Trouver Sophie dans son bureau (au fond à droite)" },
      ],
      rewardDialogue: "quest_done_entretien",
    },
    {
      id: "equipe",
      titre: "Bienvenue dans l'équipe",
      description: "Fais connaissance avec tes nouveaux collègues.",
      steps: [
        { target: "romain", sequence: "meet_romain", label: "Faire connaissance avec Romain" },
        { target: "arij", sequence: "meet_arij", label: "Faire connaissance avec Arij" },
        { target: "her_desk", label: "T'installer à ton nouveau bureau" },
        { target: "partner", sequence: "retour", label: "Rentrer tout raconter à Robin" },
      ],
      rewardDialogue: "quest_done_equipe",
    },
    {
      id: "q1",
      titre: "Le dîner surprise",
      description: "Prépare le plat préféré de Robin.",
      steps: [
        { target: "fridge", label: "Prendre les ingrédients dans le frigo" },
        { target: "stove", label: "Cuisiner le [PLAT PRÉFÉRÉ DE ROBIN]" },
        { target: "partner", label: "Servir Robin" },
      ],
      rewardDialogue: "quest_done_q1",
    },
    {
      id: "q2",
      titre: "La chaussette perdue",
      description: "Robin a ENCORE perdu une chaussette. Retrouve-la.",
      steps: [
        { target: "partner", label: "Demander à Robin où il l'a vue en dernier" },
        { target: "lost_item", label: "Fouiller… le jardin ?" },
      ],
      rewardDialogue: "quest_done_q2",
    },
  ],
};
