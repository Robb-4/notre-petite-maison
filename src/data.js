// ============================================================================
//  ★★★  C'EST ICI QUE TU PERSONNALISES LE JEU  ★★★
// ============================================================================
//  Tout le contenu personnel (prénoms, couleurs, cinématiques, dialogues,
//  private jokes, quêtes) vit dans CE fichier. Remplace les textes entre
//  [CROCHETS] par vos vraies références. Dans les listes, une réplique est
//  tirée au hasard à chaque fois.
//
//  L'HISTOIRE : elle vit seule dans sa petite maison. Grand jour : entretien
//  de data scientist à l'hôpital → embauchée → elle rencontre l'équipe data
//  (Sophie, Romain, Arij) → puis l'équipe des devs (Mahrez, David… et Robin).
//  Le coup de foudre, une ellipse « quelques mois plus tard », et la vie à
//  deux commence dans la petite maison.
//
//  Moments de la journée pour les dialogues : "matin" (6h-11h), "jour"
//  (11h-18h), "soir" (18h-23h), "nuit" (23h-6h), et "any" = fallback.
// ============================================================================

export default {
  meta: {
    titre: "Notre Petite Maison",
    dedicace: "Pour toi, Karima ❤",
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
      nom: "Karima",
      spriteSet: "her",
      palette: { H: "#6b3f23", S: "#f2c9a0", T: "#d95d7f", P: "#f2c9a0", F: "#7a3b52", K: "#3b2b40" },
    },
    // Toi : dev à l'hôpital, futur amoureux.
    partner: {
      nom: "Robin",
      spriteSet: "him",
      palette: { H: "#2b2b2b", S: "#e8b78e", T: "#4f7d4f", P: "#444a55", F: "#2e3138", K: "#2b2330" },
    },
    // L'équipe data.
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
    // L'équipe des devs.
    mahrez: {
      nom: "Mahrez",
      spriteSet: "him",
      palette: { H: "#1e1a20", S: "#c98f5e", T: "#2e8a8a", P: "#3a3f4a", F: "#2e3138", K: "#241f26" },
    },
    david: {
      nom: "David",
      spriteSet: "him",
      palette: { H: "#8a6a3c", S: "#ecc39c", T: "#b5484d", P: "#46516b", F: "#2e3138", K: "#2b2330" },
    },
    // La meilleure amie, compagne de voyage en Égypte.
    mylene: {
      nom: "Mylène",
      spriteSet: "her",
      palette: { H: "#a34a2a", S: "#f2c9a0", T: "#3a8a5f", P: "#f2c9a0", F: "#4a2e1f", K: "#3b2b40" },
    },
    // Sa maman (spriteSet "hijab" : H = couleur du voile), du voyage en Albanie.
    maman: {
      nom: "Maman",
      spriteSet: "hijab",
      palette: { H: "#7b5aa6", S: "#e8b78e", T: "#4a5a8a", P: "#4a5a8a", F: "#3a3140", K: "#3b2b40" },
    },
  },

  // --------------------------------------------------------------------------
  // LA VRAIE VIE — tenues à acheter (10 €) et couleurs de canapé (50 €).
  // T = couleur de la robe, F = chaussures. Ajoute autant d'entrées que tu veux.
  // --------------------------------------------------------------------------
  tenues: [
    { nom: "Rose", T: "#d95d7f", F: "#7a3b52" },
    { nom: "Bleu nuit", T: "#35507a", F: "#232f4a" },
    { nom: "Vert forêt", T: "#3a8a5f", F: "#245239" },
    { nom: "Soleil", T: "#e8a53d", F: "#8a5a1f" },
    { nom: "Violette", T: "#8a5fc9", F: "#4a3372" },
    { nom: "Rouge passion", T: "#c93a4a", F: "#701f2a" },
  ],
  couleursCanape: ["#5fa8a0", "#c96f8a", "#8a6fc9", "#c9a95f", "#5f7ac9", "#7a8a5a"],

  // --------------------------------------------------------------------------
  // LA CUISINE — les recettes (tirées au hasard à la cuisson). `prefere: true`
  // = LE plat préféré de Robin (gros bonus d'amour au dîner). `faim` = points.
  // --------------------------------------------------------------------------
  recettes: [
    { nom: "Tacos", faim: 55, prefere: true },
    { nom: "Tomate Burrata", faim: 50 },
    { nom: "Pizza", faim: 50 },
    { nom: "Pâtes du soir (le classique)", faim: 40 },
  ],

  // --------------------------------------------------------------------------
  // LES RÊVES — parfois en dormant. `amour: true` = rêve de vous deux (+8 ❤).
  // --------------------------------------------------------------------------
  reves: [
    { texte: "Tu as rêvé du baiser sous la pyramide… « c'est Disneyland ! »", amour: true },
    { texte: "Tu as rêvé de votre premier date au Louvre ❤", amour: true },
    { texte: "Tu as rêvé de Robin ❤", amour: true },
    { texte: "Tu as rêvé que la machine à café de l'hôpital te parlait. Bizarre.", amour: false },
    { texte: "Tu as rêvé d'un voyage en montgolfière.", amour: false },
    { texte: "Tu as rêvé du chameau. Il te jugeait encore.", amour: false },
  ],

  // --------------------------------------------------------------------------
  // CINÉMATIQUE D'INTRO — avant le grand jour. Une carte de texte par entrée.
  // --------------------------------------------------------------------------
  intro: [
    "Voici l'histoire d'une brillante data scientist… et d'un grand jour.",
    "Aujourd'hui : entretien d'embauche à l'hôpital GHU, pour LE poste de ses rêves.",
    "Elle ne le sait pas encore… mais cette journée va changer sa vie. Deux fois.",
    "Bonne chance Karima",
  ],

  // --------------------------------------------------------------------------
  // TRANSITION — jouée entre le Louvre et la Saint-Valentin.
  // --------------------------------------------------------------------------
  transition_valentin: [
    "Officiellement ensemble",
    "Les semaines passent… et l'amour grandit.",
    "Et arrive le 14 février. La Saint-Valentin. Robin a préparé LA journée parfaite.",
  ],

  // --------------------------------------------------------------------------
  // TRANSITION — jouée entre la Saint-Valentin et le voyage en Égypte.
  // --------------------------------------------------------------------------
  transition_egypte: [
    "Quelques semaines après la Saint-Valentin…",
    "Besoin de changer d'air. Besoin de soleil. Besoin de voyage.",
    "Elle s'envole pour l'Égypte avec Mylène, sa meilleure amie ✈",
    "(Premier éloignement depuis la rencontre avec Robin. Il tiendra. Probablement.)",
  ],

  // --------------------------------------------------------------------------
  // TRANSITION — le retour d'Égypte, les retrouvailles… et déjà l'Albanie.
  // --------------------------------------------------------------------------
  transition_albanie: [
    "De retour à Paris : Robin l'attendait à l'aéroport",
    "Et le fameux « truc à te dire » ? Il l'a dit. En vrai. Et c'était parfait.",
    "Mais le passeport n'a pas eu le temps de refroidir…",
    "Direction l'Albanie 🇦🇱 — avec Maman, cette fois.",
  ],

  // --------------------------------------------------------------------------
  // INTERLUDE — joué après le retour d'Albanie (ellipse temporelle finale).
  // --------------------------------------------------------------------------
  interlude: [
    "De retour pour de bon, cette fois.",
    "Et la vie reprend son cours. Le travail, les voyages, les sorties… et l'amour.",
    "Et 6 mois plus tard… ils emménageaient ensemble dans leur petite maison.",
  ],

  // --------------------------------------------------------------------------
  // SÉQUENCES SCÉNARISÉES — dialogues à plusieurs voix, joués pendant les
  // étapes d'histoire. `qui` = clé d'un personnage ci-dessus.
  // --------------------------------------------------------------------------
  sequences: {
    entretien: [
      { qui: "sophie", texte: "Bonjour Karima ! Je suis Sophie, la cheffe d'équipe. Asseyez-vous." },
      { qui: "sophie", texte: "Alors… data scientist, hein ? Parlez-moi de vous." },
      { qui: "player", texte: "J'adore les stats et le machine learning !" },
      { qui: "sophie", texte: "Question technique : c'est quoi, une p-value ?" },
      { qui: "player", texte: "C'est la probabilité de rejeter l'hypothèse nulle alors qu'elle est vraie." },
      { qui: "sophie", texte: "… Impressionnant. Dernière question : vous savez faire marcher la machine à café ?" },
      { qui: "player", texte: "C'est ma plus grande compétence." },
      { qui: "sophie", texte: "Parfait. Vous êtes EMBAUCHÉE ! Bienvenue à l'hôpital ❤" },
      { qui: "sophie", texte: "Allez vous présenter à l'équipe dans l'open space, juste à côté. Et la machine à café est au bout du couloir sud !" },
    ],
    meet_romain: [
      { qui: "romain", texte: "Salut, moi c'est Romain ! Je suis un coureur hors pair." },
      { qui: "player", texte: "Enchantée !" },
      { qui: "romain", texte: "Si tu as besoin d'aide avec le code, c'est moi. Et va te présenter aux devs, en bas — ils sont sympas. Enfin, surtout un." },
    ],
    meet_arij: [
      { qui: "arij", texte: "Bienvenue dans l'équipe ! Moi c'est Arij." },
      { qui: "player", texte: "Merci, je suis ravie d'être là !" },
      { qui: "arij", texte: "Entre nous : méfie-toi des réunions du lundi matin." },
    ],
    meet_mahrez: [
      { qui: "mahrez", texte: "Yo ! Mahrez, chef des développeurs." },
      { qui: "player", texte: "Enchantée, moi c'est Karima, la nouvelle data scientist !" },
      { qui: "mahrez", texte: "Ah, encore quelqu'un qui va nous demander des accès à la base. Bienvenue !" },
    ],
    meet_david: [
      { qui: "david", texte: "Salut ! David. Amateur de café et de blagues nulles." },
      { qui: "player", texte: "Enchantée !" },
      { qui: "david", texte: "Tu verras, on est une super équipe. Il te reste juste Robin à rencontrer… il est juste là." },
    ],
    // LA rencontre ❤
    rencontre_robin: [
      { qui: "partner", texte: "Salut ! Euh… moi c'est Robin. Développeur. Enfin, dev. Enfin… bienvenue !" },
      { qui: "player", texte: "(Il est mignon quand il s'emmêle, non ?)" },
      { qui: "partner", texte: "T'aime les mangas ?" },
      { qui: "player", texte: "Oui, j'adore ça !" },
      { qui: "partner", texte: "Si tu as un souci de VPN, d'accès… ou juste envie d'un café, je suis là ☕" },
      { qui: "player", texte: "Un café ? Pourquoi pas…" },
    ],
    // La nuit de l'appel 📱 — joué automatiquement quand elle rentre chez elle
    appel_nuit: [
      { qui: "player", texte: "(22h. Tu repenses à ta première journée… et un peu à ce dev, aussi.)" },
      { qui: "player", texte: "📱 DRRRRR ! …Numéro inconnu ?" },
      { qui: "player", texte: "Allô ?" },
      { qui: "partner", texte: "Euh… salut ! C'est Robin. Le dev. De l'hôpital. J'ai eu ton numéro par Mahrez…" },
      { qui: "player", texte: "(Il a appelé. IL A APPELÉ.)" },
      { qui: "partner", texte: "Je me demandais… enfin… ça te dirait de te promener, un de ces soirs ?" },
      { qui: "player", texte: "… Oui. Carrément, oui." },
      { qui: "partner", texte: "C'est vr— super ! Génial ! Samedi, au Louvre alors. Bonne nuit Karima :)" },
      { qui: "player", texte: "Bonne nuit Robin ❤" },
    ],
    // ---- LE PREMIER DATE, AU LOUVRE ----
    date_retrouvailles: [
      { qui: "partner", texte: "Tu es venue ! J'avais peur que tu changes d'avis…" },
      { qui: "player", texte: "Évidemment que je suis venue. Alors, le Louvre ?" },
      { qui: "partner", texte: "J'ai révisé toute la nuit. Je connais au moins 3 anecdotes sur Paris." },
      { qui: "player", texte: "Vendu. Mais d'abord : la Joconde. Évidemment." },
    ],
    date_joconde: [
      { qui: "player", texte: "Elle est… plus petite que je pensais." },
      { qui: "partner", texte: "Tout le monde dit ça ! Moi, de toute façon, je ne regarde pas le tableau." },
      { qui: "player", texte: "Ah bon ? Tu regardes quoi ?" },
      { qui: "partner", texte: "(Il te regarde, l'air de rien.)" },
      { qui: "player", texte: "(😳)" },
      { qui: "partner", texte: "Viens, on retourne voir la pyramide. Au coucher du soleil, c'est magique." },
    ],
    // LE baiser ❤ — et LA phrase mythique
    date_baiser: [
      { qui: "partner", texte: "Regarde… la pyramide, au coucher du soleil." },
      { qui: "player", texte: "C'est magnifique…" },
      { qui: "partner", texte: "[CE QU'IL A VRAIMENT DIT JUSTE AVANT ?]" },
      { qui: "player", texte: "(Le temps s'arrête.)" },
      { qui: "player", texte: "💋" },
      { qui: "partner", texte: "…C'est Disneyland !" },
      { qui: "player", texte: "Disneyland ?! On est au Louvre !" },
      { qui: "player", texte: "Alors… on est ensemble ? Officiellement ?" },
      { qui: "partner", texte: "Officiellement" },
    ],
    // ---- LA SAINT-VALENTIN : arcade puis KONG ----
    valentin_arcade: [
      { qui: "partner", texte: "Saint-Valentin, niveau 1 : la salle d'arcade. Prête à perdre ?" },
      { qui: "player", texte: "Tu vas manger tes mots. On joue à quoi ?" },
      { qui: "partner", texte: "On fait tous les jeux !" },
      { qui: "player", texte: "(Ça s'enchaîne, ça rigole, ça triche un peu.)" },
      { qui: "player", texte: "Je gagne. Évidemment." },
      { qui: "partner", texte: "Deux sur trois ! …Bon, d'accord. Je file réserver la table — rejoins-moi au KONG ! juste à côté " },
    ],
    valentin_kong: [
      { qui: "partner", texte: "Madame… votre table. La meilleure du Kong, j'ai insisté." },
      { qui: "player", texte: "Rien que ça ?!" },
      { qui: "partner", texte: "Que veux-tu. C'est la Saint-Valentin, et c'est toi." },
      { qui: "player", texte: "(Vous commandez les plats.)" },
      { qui: "partner", texte: "Tu es magnifique ce soir." },
      { qui: "player", texte: "(Meilleure Saint-Valentin. Meilleure équipe.)" },
      { qui: "partner", texte: "À nous ❤" },
    ],
    // ---- LE VOYAGE EN ÉGYPTE, AVEC MYLÈNE ----
    egypte_mylene: [
      { qui: "mylene", texte: "ON. Y. EST. L'Égypte, ma belle !!" },
      { qui: "player", texte: "J'arrive toujours pas à y croire. Regarde ces pyramides !" },
      { qui: "mylene", texte: "C'est ouf !" },
      { qui: "player", texte: "Allez viens, on va tout voir. TOUT." },
    ],
    egypte_pyramides: [
      { qui: "player", texte: "Wow. WOW. Elles sont immenses en vrai." },
      { qui: "mylene", texte: "Allez, pose devant ! Photo. Photo. PHOTO." },
      { qui: "player", texte: "Ma tenue spécial pyramides !" },
      { qui: "mylene", texte: "(Elle en prend quarante. Robin ne va pas y croire.)" },
    ],
    egypte_sphinx: [
      { qui: "player", texte: "Le Sphinx… 4500 ans, et pas une ride." },
      { qui: "mylene", texte: "Tu sais que le Sphinx n'a pas de nez ?" },
      { qui: "player", texte: "(Fou rire. Le Sphinx, lui, reste de marbre. Enfin, de calcaire.)" },
    ],
    egypte_chameau: [
      { qui: "player", texte: "Bonjour toi. Tu t'appelles comment ? Robin" },
      { qui: "mylene", texte: "Allez monte lui dessus" },
      { qui: "player", texte: "(Le chameau vous juge un peu. Mais avec bienveillance.)" },
    ],
    // le soir, au campement : l'appel à Paris 📱
    egypte_appel: [
      { qui: "player", texte: "(Le soir tombe sur le désert. Ton téléphone capte à peine… mais il capte.)" },
      { qui: "partner", texte: "Allô ?! Tu me vois ? Raconte ! Les pyramides ? Le sphinx ?!" },
      { qui: "player", texte: "C'était incroyable. Mais tu sais quoi ? Tu me manques." },
      { qui: "partner", texte: "Toi aussi tu me manques. La maison est trop calme sans toi." },
      { qui: "mylene", texte: "(De loin) C'est Robiiiin ?? Dis-lui bonjouuuur !!" },
      { qui: "partner", texte: "Salut Mylène ! …Bref. Dépêche-toi de rentrer, j'ai un truc à te dire. En vrai, pas au téléphone." },
      { qui: "player", texte: "(Un truc à me dire ?! COMMENT VEUX-TU DORMIR MAINTENANT ?)" },
    ],
    // ---- LE VOYAGE EN ALBANIE, AVEC MAMAN ----
    albanie_maman: [
      { qui: "maman", texte: "Ma chérie ! Viens là que je te regarde." },
      { qui: "player", texte: "Maman ! Prête pour l'aventure albanaise ?" },
      { qui: "maman", texte: "J'ai mon rouge à lèvres dans mon sac. On ne sait jamais." },
      { qui: "player", texte: "(Évidemment qu'elle l'a. Elle l'a toujours.)" },
    ],
    albanie_bunker: [
      { qui: "player", texte: "Maman, regarde : un vrai bunker ! Il y en a 170 000 dans le pays." },
      { qui: "maman", texte: "WOW !" },
      { qui: "player", texte: "(Photo de maman devant le bunker. Iconique.)" },
    ],
    albanie_plage: [
      { qui: "maman", texte: "L'Adriatique… C'est magnifique !" },
      { qui: "player", texte: "(L'eau est turquoise. Le moment aussi.)" },
    ],
    // le soir, au coucher du soleil : la conversation mère-fille ❤
    albanie_soir: [
      { qui: "maman", texte: "Alors… ce Robin. Parle-moi de lui." },
      { qui: "player", texte: "Il est… il est génial, maman." },
      { qui: "maman", texte: "Je l'aime bien, ce Robin." },
      { qui: "player", texte: "(Le soleil se couche sur l'Adriatique. Et tu sais, là, que c'est lui.)" },
    ],
    // ---- LA VRAIE VIE : quand l'amour est à zéro… ----
    robin_part: [
      { qui: "partner", texte: "Je… j'ai l'impression qu'on ne se voit plus. Je vais dormir au bureau quelques jours." },
      { qui: "partner", texte: "Je boude." },
      { qui: "player", texte: "(Il est parti à l'hôpital. Il FAUT te faire pardonner. Des fleurs du jardin, peut-être ?)" },
    ],
    reconquete: [
      { qui: "player", texte: "Robin… je suis désolée. Tiens. Je les ai cueillies dans NOTRE jardin." },
      { qui: "partner", texte: "Des fleurs ?! Pour MOI ?" },
      { qui: "partner", texte: "…Bon. D'accord. Tu me connais trop bien. On rentre ?" },
      { qui: "player", texte: "On rentre" },
    ],
    // le dîner à deux, quand elle a cuisiné ❤
    diner: [
      { qui: "partner", texte: "Ça sent incroyablement bon… c'est pour nous ?" },
      { qui: "player", texte: "Assieds-toi. Chef Karima a cuisiné." },
      { qui: "partner", texte: "T'es trop forte mon pips" },
      { qui: "player", texte: "(Dîner improvisé aux chandelles. Parfait.)" },
    ],
    // …et quand c'est SON plat préféré
    diner_prefere: [
      { qui: "partner", texte: "Attends. ATTENDS. C'est… mon plat préféré ?!" },
      { qui: "partner", texte: "J'aime trop !" },
      { qui: "player", texte: "(Heureux comme un gosse. Mission accomplie.)" },
    ],
    // la soirée en amoureux (via le calendrier près de la porte, 30 €)
    date_night: [
      { qui: "partner", texte: "Une soirée rien qu'à nous ? J'attrape ma veste." },
      { qui: "player", texte: "(Comme au premier jour.)" },
      { qui: "partner", texte: "On va au cinéma, comme toujours." },
      { qui: "player", texte: "(Meilleure idée de la semaine ❤)" },
    ],
    // 💍 LE chapitre final — se déclenche un soir, quand l'amour est au sommet
    demande: [
      { qui: "partner", texte: "…Karima. Viens par là. J'ai quelque chose à te dire." },
      { qui: "partner", texte: "Depuis le premier café à l'hôpital, je sais." },
      { qui: "partner", texte: "Je veux t'épouser." },
      { qui: "player", texte: "…" },
      { qui: "player", texte: "OUI. Mille fois oui !!! 💍❤" },
    ],
  },

  // --------------------------------------------------------------------------
  // DIALOGUES LIBRES — une réplique au hasard selon le moment de la journée.
  // --------------------------------------------------------------------------
  dialogues: {
    // Robin AVANT la rencontre officielle (pendant l'histoire à l'hôpital)
    talk_robin_avant: {
      any: [
        "Salut ! Tu dois être la nouvelle. Moi c'est… enfin bref. Le VPN, c'est moi.",
        "(Il te regarde un peu trop longtemps, puis fixe son écran.)",
      ],
    },
    // Robin quand l'amour est bas (vraie vie)
    partner_talk_triste: {
      any: [
        "…Coucou.",
        "(Il sourit, mais à moitié. Vous devriez passer plus de temps ensemble.)",
        "Tu m'as manqué. Enfin… bref.",
      ],
    },
    // Robin parti bouder au bureau (amour à zéro)
    robin_boude: {
      any: [
        "J'ai besoin d'un peu de temps…",
        "(Des fleurs du jardin aideraient, peut-être ?)",
      ],
    },
    // quand elle offre un bouquet
    offre_fleurs: {
      any: [
        "Des fleurs ! Pour moi ?! Tu es la meilleure ❤",
        "Un bouquet de NOTRE jardin ? Je fonds.",
      ],
    },
    // le frigo est vide…
    frigo_vide: {
      any: [
        "Le frigo est vide… il reste un vieux truc au fond. (+10 faim, courage)",
        "Le frigo sonne creux. Courses obligatoires.",
      ],
    },
    // quand elle lui donne un plat en main propre
    sert_plat: {
      any: [
        "Tu m'as fait à manger ?! Je t'aime.",
        "Un plat fait maison ? T'es la meilleure.",
      ],
    },
    // quand elle sent trop fort (hygiène à zéro)
    talk_beurk: {
      any: [
        "…Tu sens… l'aventure ? La douche est par là 🤢",
        "(Un pas en arrière, poliment.) On se parle après la douche ?",
      ],
    },
    // Robin une fois en couple, à la maison
    partner_talk: {
      any: [
        "Coucou toi ! ",
        "Tu te souviens de Montmartre ? Moi j'y pense encore.",
        "T'es la plus belle, même en pixels.",
        "Pips, je t'aime trop.",
        "Dire qu'on s'est rencontrés à l'hôpital… merci le service informatique",
      ],
      matin: ["Café d'abord, câlins ensuite ? Ou l'inverse ?", "Bien dormi mon amour ?"],
      soir: ["On se lance un épisode ce soir ?", "Ce soir c'est série !"],
      nuit: ["Tu devrais aller dormir, il est tard…"],
    },

    // Les collègues data
    talk_sophie: {
      any: [
        "Alors, prête pour de grands projets data ?",
        "Réunion lundi 9h. Le café est obligatoire, la bonne humeur aussi.",
        "Tu as vu le dernier notebook de Romain ? Il est… surprenant.",
      ],
    },
    talk_romain: {
      any: [
        "T'aimes les stats ? Moi j'adore les stats !",
        "Tu as vu le dashboard ? Il est ENCORE cassé.",
        "Pause café ? Pause café.",
      ],
    },
    talk_arij: {
      any: [
        "J'ai un notebook qui tourne depuis ce matin… croisons les doigts.",
        "Ce soir, c'est pilate ?",
      ],
    },
    // Les devs
    talk_mahrez: {
      any: [
        "C'est pas un bug, c'est une fonctionnalité.",
        "Quelqu'un a redémarré le serveur ? Non ? Parfait, c'est donc ça le problème.",
      ],
    },
    talk_david: {
      any: [
        "Ticket n°4512 : « ça marche pas ». Merci pour les détails.",
        "On déploie vendredi 17h ? Excellente idée. (non)",
      ],
    },
    talk_mylene: {
      any: [
        "Meilleure amie, meilleur voyage. C'est mathématique.",
        "On refait nos valises quand tu veux, tu sais.",
      ],
    },
    talk_maman: {
      any: [
        "Ma chérie ❤",
        "Tu as mangé ? Tu es sûre ? Tiens, mange.",
      ],
    },

    // Objets de la maison
    use_fridge: {
      any: ["Miam… il reste des trucs douteux !", "Quelqu'un a ENCORE fini les BAIOCCHI…"],
      matin: ["Petit-déj ! La chose la plus importante de la journée."],
    },
    use_stove: { any: ["Ça sent bon dans toute la maison…", "Attention, ça chauffe !"] },
    use_bed: {
      any: ["Une petite sieste réparatrice…"],
      soir: ["Bonne nuit."],
      nuit: ["Enfin au lit…"],
    },
    use_shower: {
      any: ["🎵 I'M A SINGLE LADY 🎵", "L'eau chaude, meilleure invention de l'humanité."],
    },
    use_couch: {
      any: ["Pause canapé bien méritée.", "Juste un épisode. Promis. (non)"],
      soir: ["La soirée parfaite commence ici."],
    },
    use_bookshelf: {
      any: ["Tiens ! Un classique.", "Il faudrait vraiment ranger cette étagère un jour."],
    },
    use_plant: {
      any: ["La plante que personne n'oublie JAMAIS d'arroser.", "Pousse, petite plante, pousse."],
    },
    use_table: { any: ["Les fleurs qu'il m'a offertes."] },
    use_tv: {
      any: ["Un petit épisode…", "Zapping du soir, espoir."],
      soir: ["LE créneau série. Sacré."],
    },
    use_photo: {
      any: [
        "Notre photo…",
        "On avait l'air si jeunes sur cette photo. C'était il y a 2 jours !",
      ],
    },

    // Objets de l'hôpital
    use_sign: { any: ["« Hôpital GHU » — c'est ici !"] },
    use_joconde: {
      any: [
        "Elle sourit. Elle sait, pour vous deux.",
        "Toujours aussi petite. Toujours aussi célèbre.",
      ],
    },
    use_pyramide: {
      any: [
        "La pyramide du Louvre. C'était magique ici ❤",
        "C'est ici que tout est devenu officiel.",
      ],
    },
    // Robin pendant le date (hors séquences)
    talk_robin_date: {
      any: ["(Vous êtes bien, là, tous les deux.)", "On la refait, cette journée ? N'importe quand."],
    },
    use_her_desk: {
      any: ["Mon nouveau bureau ✨ Il ne manque plus qu'une plante et ma tasse à café."],
    },
    use_coffee: {
      any: [
        "Le carburant officiel de l'hôpital. ☕ +15 énergie !",
        "La machine fait un bruit bizarre… mais le café est bon.",
      ],
    },

    // Événements horaires (à la maison, une fois en couple)
    event_cafe_matin: { any: ["☕ 8h : l'heure sacrée du café ensemble. +15 énergie !"] },
    event_serie_soir: { any: ["📺 21h : c'est l'heure de votre série ! Le canapé rapporte double fun."] },

    // Fins de quêtes
    quest_done_arrivee: { any: ["Te voilà à l'hôpital. Respire… tout va bien se passer ❤"] },
    quest_done_entretien: { any: ["EMBAUCHÉE ! Bon. Maintenant, rencontrer les collègues…"] },
    quest_done_equipe: { any: ["L'équipe data adoptée ✔ Reste à saluer les devs, en bas."] },
    quest_done_devs: { any: ["(Ce Robin… il a quelque chose, non ?) Allez, la journée est finie : direction la maison."] },
    quest_done_appel: { any: ["(Comment veux-tu dormir après ÇA ?!)"] },
    quest_done_date: { any: ["Officiellement ensemble ❤ (Et oui : « c'est Disneyland ». Personne ne comprendra jamais, et c'est très bien.)"] },
    quest_done_valentin: { any: ["Jeux d'arcade + KONG + lui. La formule parfaite ❤"] },
    quest_done_egypte: { any: ["L'Égypte dans les yeux… et Paris dans le cœur. Il est temps de rentrer ✈"] },
    quest_done_albanie: { any: ["Deux voyages, deux personnes en or… et une certitude en rentrant ❤"] },
    use_bunker: { any: ["Un bunker de poche. Collector.", "(Solide. Rond. Inutile. Parfait.)"] },
    use_parasol: { any: ["À l'ombre, face à l'Adriatique. Le luxe.", "[VOTRE MOMENT PLAGE EN ALBANIE ?]"] },
    use_montagne: { any: ["Les montagnes albanaises."] },
    use_pyr_egypte: { any: ["4500 ans d'avance sur nos plus beaux projets."] },
    use_sphinx: { any: ["Il garde le plateau depuis 4500 ans. Sans pause café.", "(Il sait des choses, c'est sûr.)"] },
    use_camel: { any: ["Robin le chameau approuve ta présence.", "(Il mâche. Toujours. Quoi ? Mystère.)"] },
    use_borne: { any: ["Encore une partie d'arcade ?", "INSÉREZ UNE PIÈCE. (Toujours aussi tentant.)"] },
    use_resto_table: { any: ["Une table aux chandelles… classe.", "(L'odeur du plat flotte encore.)"] },
    use_kong_statue: { any: ["Le gorille du KONG. Il en impose.", "(Il vous juge un peu, mais avec bienveillance.)"] },
    quest_done_q1: { any: ["C'était le plat de saint valentin"] },
    quest_done_q2: { any: ["LA chaussette perdue ! Elle était dans le jardin depuis 3 ANS."] },
    quests_all_done: { any: ["Tous les objectifs sont finis… mais la vie continue, tranquillement, ensemble ❤"] },
  },

  // --------------------------------------------------------------------------
  // FLAVOR — le petit texte affiché quand on s'approche ([E] …)
  // --------------------------------------------------------------------------
  flavor: {
    fridge: "Le frigo — toujours plein de surprises",
    stove: "La cuisinière",
    bed: "Le lit douillet",
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
    mahrez: "Mahrez",
    david: "David",
    sign: "Le panneau de l'hôpital",
    signpost: "Panneau indicateur",
    her_desk: "Ton nouveau bureau",
    coffee: "LA machine à café",
    joconde: "La Joconde (elle vous suit du regard)",
    pyramid: "La pyramide du Louvre",
    borne: "Une borne d'arcade",
    resto_table: "Une table aux chandelles",
    kong_statue: "Le gorille du KONG",
    pyramide_egypte: "La Grande Pyramide",
    sphinx: "Le Sphinx",
    camel: "Un chameau",
    palm: "Un palmier",
    mylene: "Mylène (la meilleure)",
    maman: "Maman ❤",
    flower_spot: "Cueillir un bouquet 🌼",
    date_board: "Proposer une soirée en amoureux (30 €)",
    garden_plot: "Le potager",
    dirt: "Nettoyer la tache 🧹",
    metro: "Le métro 🚇",
    tv: "La télé",
    mall_sign: "Le centre commercial 🛍️",
    fence: "La clôture du potager",
    clothes_rack: "Nouvelle tenue (10 €)",
    grocery_shelf: "Faire les courses (15 €)",
    furniture_shop: "Changer la couleur du canapé (50 €)",
    bunker: "Un bunker albanais",
    parasol: "Le parasol",
    mountain: "Les montagnes albanaises",
  },

  // --------------------------------------------------------------------------
  // QUÊTES — dans l'ordre. Types d'étapes :
  //   { target: "fridge", label: "…" }                → interagir avec la cible
  //   { target: "sophie", sequence: "entretien", … }  → joue la séquence scénarisée
  //   { goto: {x0,y0,x1,y1}, label: "…" }             → atteindre une zone
  // Targets : fridge, stove, bed, shower, couch, bookshelf, plant, table,
  //           photo, partner, lost_item, her_desk, sign, coffee,
  //           sophie, romain, arij, mahrez, david
  // La quête "devs" déclenche l'interlude (ellipse) à sa fin, puis Robin
  // emménage à la maison.
  // --------------------------------------------------------------------------
  quests: [
    {
      id: "grand_jour",
      titre: "Le grand jour",
      description: "L'entretien t'attend à l'hôpital.",
      steps: [
        {
          goto: { map: "hospital", x0: 0, y0: 9, x1: 5, y1: 12 },
          label: "Aller à l'hôpital (sors du jardin par l'est)",
        },
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
      titre: "L'équipe data",
      description: "Fais connaissance avec tes nouveaux collègues.",
      steps: [
        { target: "romain", sequence: "meet_romain", label: "Faire connaissance avec Romain" },
        { target: "arij", sequence: "meet_arij", label: "Faire connaissance avec Arij" },
        { target: "her_desk", label: "T'installer à ton nouveau bureau" },
      ],
      rewardDialogue: "quest_done_equipe",
    },
    {
      id: "devs",
      titre: "L'équipe des devs",
      description: "Il paraît qu'ils sont sympas. Surtout un.",
      steps: [
        {
          goto: { map: "hospital", x0: 10, y0: 20, x1: 15, y1: 23 },
          label: "Descendre au bureau des devs (couloir au sud du hall)",
        },
        { target: "mahrez", sequence: "meet_mahrez", label: "Se présenter à Mahrez" },
        { target: "david", sequence: "meet_david", label: "Se présenter à David" },
        { target: "partner", sequence: "rencontre_robin", label: "Se présenter au dernier dev… Robin" },
      ],
      rewardDialogue: "quest_done_devs",
    },
    {
      id: "nuit_appel",
      titre: "Cette nuit-là",
      description: "Rentrer, souffler… et peut-être rêver un peu.",
      steps: [
        {
          goto: { map: "home", x0: 2, y0: 6, x1: 16, y1: 12.8 },
          label: "Rentrer chez toi (des étoiles plein la tête)",
          // effets d'étape : l'horloge saute au soir, puis la séquence se joue
          clockTo: 22,
          sequenceAfter: "appel_nuit",
        },
        { target: "bed", label: "Aller te coucher (avec le sourire)" },
      ],
      rewardDialogue: "quest_done_appel",
    },
    {
      id: "premier_date",
      titre: "Le premier date",
      description: "Samedi. Au Louvre, comme promis.",
      steps: [
        {
          goto: { map: "louvre", x0: 16, y0: 6, x1: 28, y1: 12 },
          label: "Rejoindre Robin au Louvre (chemin au sud du jardin)",
          clockTo: 17,
        },
        { target: "partner", sequence: "date_retrouvailles", label: "Retrouver Robin sur l'esplanade" },
        {
          target: "joconde",
          sequence: "date_joconde",
          label: "Aller voir la Joconde ensemble (dans la galerie)",
          clockTo: 20.5,
        },
        {
          target: "partner",
          sequence: "date_baiser",
          label: "Retrouver Robin sous la pyramide, au coucher du soleil…",
          hearts: true,
        },
      ],
      rewardDialogue: "quest_done_date",
    },
    {
      id: "saint_valentin",
      titre: "La Saint-Valentin",
      description: "Arcade, puis dîner. LA journée parfaite.",
      steps: [
        {
          goto: { map: "paris", x0: 6, y0: 4, x1: 15, y1: 10.5 },
          label: "Entrer dans la salle d'arcade (la rue au sud du Louvre)",
        },
        {
          target: "borne",
          sequence: "valentin_arcade",
          label: "Faire une partie avec Robin",
          partnerTo: "partnerKong", // il file réserver la table
        },
        {
          goto: { map: "paris", x0: 20, y0: 4, x1: 31, y1: 10.5 },
          label: "Rejoindre Robin au restaurant, juste à côté",
          clockTo: 20,
        },
        {
          target: "resto_table",
          sequence: "valentin_kong",
          label: "Vous installer à votre table ❤",
          hearts: true,
        },
      ],
      rewardDialogue: "quest_done_valentin",
    },
    {
      id: "egypte",
      titre: "Le voyage en Égypte",
      description: "Des pyramides, un sphinx… et quelqu'un qui manque.",
      steps: [
        {
          goto: { map: "egypte", x0: 5, y0: 2, x1: 14, y1: 10 },
          label: "Explorer le désert (vers les pyramides)",
        },
        {
          target: "mylene",
          sequence: "egypte_mylene",
          label: "Retrouver Mylène (elle est déjà partie devant !)",
        },
        {
          target: "pyramide_egypte",
          sequence: "egypte_pyramides",
          label: "Admirer la Grande Pyramide",
        },
        { target: "sphinx", sequence: "egypte_sphinx", label: "Saluer le Sphinx" },
        {
          target: "camel",
          sequence: "egypte_chameau",
          label: "Faire connaissance avec un chameau",
          clockTo: 21, // le soir tombe sur le désert…
          sequenceAfter: "egypte_appel", // …et Robin appelle 📱
        },
      ],
      rewardDialogue: "quest_done_egypte",
    },
    {
      id: "albanie",
      titre: "L'Albanie avec Maman",
      description: "La côte, les montagnes… et une conversation importante.",
      steps: [
        {
          goto: { map: "albanie", x0: 6, y0: 5, x1: 18, y1: 12 },
          label: "Explorer la côte albanaise",
        },
        { target: "maman", sequence: "albanie_maman", label: "Retrouver Maman au village" },
        { target: "bunker", sequence: "albanie_bunker", label: "Inspecter le fameux bunker" },
        {
          target: "parasol",
          sequence: "albanie_plage",
          label: "Un moment plage avec Maman",
          clockTo: 20, // le coucher de soleil sur l'Adriatique…
          sequenceAfter: "albanie_soir", // …et LA conversation ❤
        },
      ],
      rewardDialogue: "quest_done_albanie",
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
