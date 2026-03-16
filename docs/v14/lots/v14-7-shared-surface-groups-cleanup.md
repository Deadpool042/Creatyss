# V14-7 — Shared surface groups cleanup

## Objectif du lot

Le lot V14-7 traite un point charnière de la seconde vague V14 : les grands sélecteurs groupés encore présents dans `globals.css`.

Après les lots précédents, une partie importante du CSS custom restant ne tient plus seulement à des classes isolées, mais à des règles mutualisées entre plusieurs familles de composants visuellement proches.

Ces groupes ont souvent été utiles pour accélérer la mise en place initiale du projet, mais ils bloquent désormais les suppressions fines : tant que plusieurs surfaces partagent la même règle, il devient difficile d’en faire tomber une seule sans toucher aux autres.

L’objectif de V14-7 est donc de clarifier et, si le ratio gain / risque est bon, de casser certains groupes de surfaces partagées pour rendre les responsabilités CSS plus explicites.

## Intention

Ce lot n’a pas pour but de supprimer massivement du CSS en une seule passe.

Il sert à démêler les règles groupées qui empêchent les lots suivants d’avancer proprement.

Autrement dit, V14-7 est un lot de **désentrelacement** :

- identifier les groupes encore trop larges
- décider lesquels doivent être conservés
- décider lesquels peuvent être séparés
- rendre possibles les suppressions fines à venir

Le but n’est pas d’éclater artificiellement chaque groupe, mais d’améliorer la lisibilité structurelle du CSS restant.

## Résultat attendu

À l’issue de V14-7, le projet doit idéalement :

- mieux distinguer les responsabilités CSS entre familles de surfaces
- réduire certains sélecteurs groupés hérités qui bloquent les nettoyages fins
- conserver uniquement les groupements réellement utiles et cohérents
- rendre les lots V14-8 à V14-10 plus lisibles et plus sûrs
- ne provoquer aucune régression visuelle ni responsive

## Ce que couvre ce lot

V14-7 couvre :

- l’audit des grands sélecteurs groupés encore présents dans `globals.css`
- leur qualification par groupe
- leur séparation partielle ou totale si le gain est réel
- la suppression de règles devenues mortes après découplage
- la documentation des groupes conservés volontairement

## Ce que ce lot ne couvre pas

V14-7 ne couvre pas :

- une refonte esthétique des surfaces publiques
- une réécriture complète des composants ou des pages
- la suppression automatique de tous les groupes
- des changements métier ou serveur
- l’ouverture simultanée des gros chantiers `cart-*`, `checkout-*`, `product-*` sans hiérarchie

## Cibles probables

Les groupes les plus probables dans ce lot sont :

- `.hero, .section, .card`
- `.store-card, .variant-card, .empty-state`
- `.store-card, .variant-card, .product-panel, .empty-state`
- `.hero-media, .media-placeholder, .product-media, .article-cover`
- `.hero-media, .product-media, .article-cover, .variant-media`
- `.media-image, .product-media img, .article-cover img, .variant-media img`

La liste réelle doit être confirmée par l’état du repo.

## Nature des patterns ciblés

Ces groupes sont difficiles parce qu’ils mélangent souvent :

- des surfaces encore proches visuellement
- des contextes d’usage différents
- des besoins de responsive distincts
- parfois des sélecteurs descendants sur des enfants (`img` notamment)

Ils ne sont donc pas de bons candidats à un nettoyage brutal.

Le bon travail ici consiste à répondre à une question simple :

> ce groupement exprime-t-il encore une vraie cohérence, ou empêche-t-il maintenant des suppressions plus fines ?

## Questions auxquelles le lot doit répondre

### 1. Le groupe exprime-t-il encore une intention commune claire ?

Si oui, il peut rester groupé.

### 2. Le groupe masque-t-il des familles qui ont désormais divergé ?

Si plusieurs surfaces n’évoluent plus ensemble, le groupe devient un frein et peut devoir être séparé.

### 3. Le découplage simplifie-t-il réellement la suite ?

Le but de V14-7 est aussi de préparer les lots suivants. Un découplage utile est celui qui rend les prochains nettoyages plus lisibles.

### 4. Le découplage reste-t-il maintenable ?

Créer quatre règles quasi identiques pour gagner très peu n’est pas forcément une amélioration.

### 5. Les sélecteurs descendants ou partagés restent-ils sûrs ?

C’est particulièrement important pour les groupes autour de :

- `img`
- wrappers média
- surfaces overflow / object-fit
- cartes ou panneaux réutilisés dans plusieurs flux

## Principes de décision

### 1. Casser un groupe seulement si cela clarifie vraiment le système

Un groupe cohérent n’a pas à être éclaté juste pour réduire une apparence de legacy.

### 2. Préparer les prochains lots

Le vrai gain de V14-7 est souvent indirect : un groupe mieux séparé rend possible une suppression ultérieure propre dans V14-8 ou V14-9.

### 3. Ne pas fragmenter sans stratégie

Découpler un groupe ne doit pas produire un nuage de règles redondantes sans bénéfice clair.

### 4. Préserver strictement le rendu

Les surfaces visuelles concernées doivent rester identiques après découplage, sauf amélioration mineure explicitement assumée.

## Méthode recommandée

Le déroulé recommandé est :

1. lister tous les sélecteurs groupés encore significatifs
2. identifier les familles concernées par chaque groupe
3. qualifier chaque groupe :
   - à conserver tel quel
   - à découpler partiellement
   - à découpler complètement
   - à repousser
4. choisir un plan minimal
5. appliquer uniquement les découplages réellement utiles
6. vérifier si certaines règles deviennent mortes
7. supprimer uniquement les règles prouvées inutiles
8. lancer le typecheck
9. documenter précisément les décisions prises

## Validation attendue

### Validation technique

- `pnpm run typecheck`
- aucune suppression CSS injustifiée
- aucune régression de sélecteurs descendants
- aucun changement de comportement

### Validation visuelle

Vérifier en particulier :

- hero public
- sections publiques
- cards utilitaires
- médias et placeholders
- images de produits / variantes / articles
- surfaces partagées storefront
- responsive mobile / tablette / desktop

### Validation fonctionnelle

Vérifier que les écrans concernés restent identiques fonctionnellement.

## Anti-patterns à éviter

### 1. Éclater les groupes “par principe”

Si un groupe reste bon, il peut rester en place.

### 2. Introduire des duplications massives de règles quasi identiques

Le but est de clarifier, pas de répandre la même règle en quatre endroits sans bénéfice.

### 3. Oublier les sélecteurs descendants

Les groupes avec `img` ou wrappers média sont particulièrement sensibles.

### 4. Ouvrir en même temps tous les chantiers denses

V14-7 doit préparer la suite, pas absorber d’un coup tout le travail de V14-8 et V14-9.

## Livrables attendus

Le lot doit idéalement produire :

- un audit clair des grands groupes encore présents
- un petit nombre de découplages réellement utiles
- la suppression éventuelle de règles devenues mortes
- une justification explicite des groupes conservés en l’état

## Suite logique

Une fois V14-7 terminé, la suite logique est :

### V14-8 — Cart and checkout structure cleanup

Ce lot pourra s’attaquer aux familles panier et checkout avec une base CSS potentiellement mieux désentrelacée et donc plus facile à traiter proprement.

## Résumé

V14-7 est un lot de clarification structurelle du CSS restant.

Il sert à casser seulement les grands groupes qui empêchent les prochains nettoyages fins, tout en conservant les groupements encore réellement cohérents et utiles.
