# Notre Petite Maison 🏠❤

Un petit jeu cozy façon Sims, en pixel art vue du dessus, fait avec three.js.
Le personnage jouable, c'est elle ; le PNJ qui traîne dans le salon, c'est Robin.

## ✏️ Personnaliser le jeu

**Tout** le contenu personnel vit dans un seul fichier : [`src/data.js`](src/data.js).

- **Prénoms** : `characters.player.nom` et `characters.partner.nom`
- **Apparence** : les palettes de couleurs (`H` cheveux, `S` peau, `T` haut/robe,
  `P` jambes/pantalon, `F` chaussures)
- **Dialogues** : remplace les textes entre `[CROCHETS]` par vos private jokes.
  Chaque contexte accepte des listes par moment de la journée (`matin`, `jour`,
  `soir`, `nuit`) et une liste `any` ; une réplique est tirée au hasard.
- **Textes des objets** : la section `flavor`
- **Quêtes** : la section `quests`

Modifie le fichier, sauvegarde, recharge la page — c'est tout.

Les réglages de rythme (vitesse, décroissance des jauges, durée de la journée)
sont dans [`src/config.js`](src/config.js). Le pixel art est dans
[`src/sprites.js`](src/sprites.js) (grilles de texte : 1 caractère = 1 pixel).

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
