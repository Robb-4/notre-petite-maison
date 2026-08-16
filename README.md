# Notre Petite Maison 🏠❤

Un petit jeu cozy façon Sims, en pixel art vue du dessus, fait avec three.js.
Le personnage jouable, c'est elle ; le PNJ qui traîne dans le salon, c'est Robin.

## 📖 L'histoire

Une cinématique d'intro raconte votre rencontre, puis c'est le grand jour :
elle quitte la maison, suit le chemin vers l'est jusqu'à l'hôpital, passe
l'entretien de data scientist avec Sophie (la cheffe), est embauchée, puis
fait connaissance avec Romain et Arij avant de rentrer tout raconter à Robin.
Ensuite, la vie continue : quêtes cozy, besoins, jour/nuit.

## ✏️ Personnaliser le jeu

**Tout** le contenu personnel vit dans un seul fichier : [`src/data.js`](src/data.js).

- **Prénoms** : `characters.player.nom` et `characters.partner.nom`
- **Apparence** : les palettes de couleurs (`H` cheveux, `S` peau, `T` haut/robe,
  `P` jambes/pantalon, `F` chaussures) et `spriteSet` (`"her"` ou `"him"`)
- **La cinématique d'intro** : la liste `intro` (une carte de texte par entrée)
- **Les scènes d'histoire** (départ, entretien, rencontres, retour) : la
  section `sequences`
- **Dialogues** : remplace les textes entre `[CROCHETS]` par vos private jokes.
  Chaque contexte accepte des listes par moment de la journée (`matin`, `jour`,
  `soir`, `nuit`) et une liste `any` ; une réplique est tirée au hasard.
- **Textes des objets** : la section `flavor`
- **Quêtes** : la section `quests` (étapes `target`, `sequence`, ou zones `goto`)

Modifie le fichier, sauvegarde, recharge la page — c'est tout.

Les réglages de rythme (vitesse, décroissance des jauges, durée de la journée)
sont dans [`src/config.js`](src/config.js). Le pixel art est dans
[`src/sprites.js`](src/sprites.js) (grilles de texte : 1 caractère = 1 pixel).

## 💞 La vraie vie (après l'histoire)

Une fois l'histoire finie, le jeu devient un vrai Sims :

- Une 6e jauge apparaît : **Amour ❤**. Elle s'entretient en parlant à Robin
  et en lui offrant des bouquets (à cueillir dans le jardin 🌼). À zéro,
  **Robin part bouder au bureau** — va le reconquérir avec des fleurs.
- **Hygiène à zéro : tu pues.** Volutes vertes, et plus personne ne veut te
  parler avant la douche.
- **Énergie basse : tu te traînes.** À zéro, tu t'écroules et te réveilles
  chez toi le lendemain.
- **Faim à zéro : tu meurs.** 💀 (Mais l'amour est plus fort que la mort —
  Entrée pour revivre.)
- **Argent 💶** : travaille à ton bureau à l'hôpital (+40 €) pour financer le
  reste.
- **Le centre commercial 🛍️** (à l'est de la rue de Paris) : nouvelles tenues
  (10 €), courses (15 €), couleur du canapé (50 €).
- **Soirées en amoureux 📅** : le calendrier près de la porte (30 €) vous
  emmène au KONG ou au Louvre, en alternance.
- **Visites surprises** : Mylène ou Maman passent parfois dire coucou.
- **Humeur & jours heureux** : un emoji d'humeur dans l'horloge, et un
  compteur de jours heureux… qui mène peut-être à une demande 💍 (amour au
  sommet, un soir, près de Robin).
- **La vraie cuisine 🍳** : les courses donnent des ingrédients 🧺, le frigo
  les met en main, la cuisinière lance un **mini-jeu de timing** (E dans la
  zone verte : parfait / correct / brûlé avec fumée noire). Le plat se mange
  à table — et si Robin est là, c'est un **dîner à deux** (+amour, gros bonus
  si c'est SON plat préféré). Les recettes s'éditent dans `data.recettes`.
- **Le potager 🌱** : 3 parcelles au sud du jardin. Planter (graine des
  courses), arroser chaque jour, récolter (+2 🧺) au bout de 2 jours.
- **Le ménage 🧹** : des taches apparaissent chaque jour ; à 4 taches, le
  moral s'use plus vite (et Robin fait des remarques).
- **Les rêves 💭** : en dormant, parfois un rêve — souvenir de votre histoire
  (+amour) ou rêve absurde (`data.reves`).
- **Le métro 🚇** : la bouche de métro du jardin relie directement la maison
  à la rue de Paris (arcade, KONG, centre commercial). Et retour.
- **Les mini-jeux 🎮** : **Snake** et **Casse-briques** sur les bornes
  d'arcade (2 € la partie, high-score), et **Pong contre Robin** sur la TV
  du salon quand il est là (+fun et +amour, gagné ou perdu).

## 🎮 Contrôles

- **ZQSD / WASD / flèches** : se déplacer
- **E / Espace / clic** : interagir, faire avancer les dialogues
- Dormir dans le lit fait passer au lendemain 7h00.
- Le café de 8h et la série de 21h sont des rendez-vous quotidiens.

## 🖥️ Lancer en local

Les modules ES ont besoin d'un serveur (pas de `file://`) :

```
npx serve .
# ou
python -m http.server 8000
```

puis ouvre `http://localhost:8000`.

## 🚀 Publier une mise à jour

Le jeu est hébergé sur GitHub Pages, sans build :

```
git add -A
git commit -m "maj des dialogues"
git push
```

La page est mise à jour au bout d'une minute environ (pense à Ctrl+F5,
le cache de GitHub Pages est têtu).

## 🧱 Technique

- three.js (vendored dans `lib/`, importé via importmap — zéro dépendance réseau)
- Rendu isométrique façon Habbo : caméra orthographique tournée à 45° et
  inclinée à 30° (projection 2:1, réglable via `config.js → view.yawDeg` /
  `view.pitchDeg`), murs en volumes avec cutaway façon Sims, meubles en
  boîtes texturées, personnages et plantes en billboards détourés avec
  ombres portées, quadrillage de sol façon Habbo
- Résolution interne 640×360 mise à l'échelle entière, textures
  `NearestFilter` : pixels nets garantis
- Aucune image : tous les sprites sont des grilles de texte converties en
  `CanvasTexture` au chargement
- HUD et dialogues en DOM, teinte jour/nuit en overlay `mix-blend-mode`
