# V14-6B — Public shell and surface cleanup

## Objectif du lot

Le lot V14-6B ouvre la seconde vague de la V14 sur un périmètre encore large, mais qui reste raisonnablement traitable sans refonte lourde : le shell public et les surfaces simples.

Après les premiers lots V14, plusieurs classes de présentation simples ont déjà disparu. Ce qui reste maintenant du côté public n’est plus du petit helper typographique, mais un ensemble de wrappers, surfaces et conteneurs génériques encore portés par `globals.css`.

L’objectif de V14-6B n’est pas de refaire le storefront. Il est de vérifier jusqu’où ces classes transverses peuvent être remplacées localement ou via les primitives déjà stabilisées, tout en conservant une base lisible et sobre.

## Intention

Ce lot vise les classes globales qui structurent encore le shell public et certaines surfaces de base, par exemple :

- le site wrapper
- le header public
- les conteneurs de page
- les surfaces hero / section / card
- certains wrappers de shell comme le drawer

Il s’agit d’une zone stratégique, car ces classes sont transverses : les toucher peut faire tomber une part importante du CSS custom restant, mais aussi introduire de la duplication si le lot est mal cadré.

Le principe doit donc rester strict :

> on ne remplace que ce qui devient réellement plus clair, plus local et encore maintenable.

## Résultat attendu

À l’issue de V14-6B, le projet doit idéalement :

- réduire plusieurs classes globales encore centrales dans le shell public
- conserver une cohérence visuelle parfaite entre les pages publiques
- éviter la duplication diffuse de gros ensembles de classes Tailwind
- supprimer uniquement les règles CSS réellement devenues mortes
- ne provoquer aucun changement métier ni aucune régression responsive

## Ce que couvre ce lot

V14-6B couvre :

- l’audit des wrappers et surfaces publiques simples encore globales
- leur qualification par famille
- leur remplacement local si le ratio gain / risque est bon
- la suppression de règles CSS réellement mortes
- la documentation explicite des classes conservées

## Ce que ce lot ne couvre pas

V14-6B ne couvre pas :

- les structures storefront transactionnelles denses
- les classes produit / panier / checkout profondes
- les helpers admin
- la création de nouveaux composants abstraits sans nécessité forte
- des changements métier ou serveur

## Cibles probables

Les familles les plus probables dans ce lot sont :

- `.site`
- `.site-header`
- `.site-main`
- `.page`
- `.hero`
- `.hero-copy`
- `.card`
- `.section`
- `.shell`
- `.shell-drawer`

Cette liste doit être confirmée par l’état réel du repo.

## Nature des patterns ciblés

Ces classes ne sont pas de simples styles de texte, mais elles ne sont pas non plus les structures storefront les plus lourdes.

Elles appartiennent à une zone intermédiaire :

- suffisamment transverses pour peser dans `globals.css`
- suffisamment simples pour être parfois réécrites proprement localement
- suffisamment visibles pour exiger une grande discipline de cohérence

Certaines pourront probablement disparaître.
D’autres mériteront peut-être d’être conservées comme conventions globales encore utiles.

## Questions auxquelles le lot doit répondre

### 1. La classe apporte-t-elle encore une vraie mutualisation utile ?

Si une surface comme `.card` ou `.section` reste un bon pattern partagé et évite beaucoup de duplication, sa conservation peut être rationnelle.

### 2. Le remplacement local reste-t-il lisible ?

Un gros paquet de classes inline recopié partout n’est pas une victoire sur le CSS global.

### 3. La classe est-elle réellement homogène dans tous ses usages ?

Si une même classe sert en réalité à plusieurs usages divergents, sa suppression peut devenir pertinente.

### 4. Le responsive et les comportements spéciaux restent-ils intacts ?

C’est particulièrement important pour :

- le header sticky
- les wrappers de shell
- les surfaces hero
- les supports `@supports (backdrop-filter: ...)`

### 5. La règle CSS devient-elle totalement morte ?

La suppression ne doit être faite que lorsque tous les usages réels ont disparu ou ont été remplacés.

## Principes de décision

### 1. Priorité à la cohérence transversale

Comme ces classes touchent plusieurs pages publiques, le moindre remplacement doit rester uniforme à l’échelle du storefront.

### 2. Pas de duplication décorative

Si la suppression d’une classe globale exige de répéter un gros bloc Tailwind identique sur plusieurs pages, le gain est probablement faible.

### 3. Conserver les conventions encore bonnes

Une classe globale propre, stable et réellement utile peut être conservée. La V14 n’a pas pour but de supprimer tout le global CSS à n’importe quel prix.

### 4. Nettoyer seulement si le bilan net est positif

Le bon critère n’est pas “moins de CSS global”, mais “code plus simple, plus explicite et toujours maintenable”.

## Méthode recommandée

Le déroulé recommandé est :

1. lister les occurrences réelles des familles ciblées
2. comparer les usages page par page
3. qualifier chaque famille :
   - à remplacer maintenant
   - à conserver
   - à repousser
4. choisir un plan minimal
5. appliquer uniquement les remplacements réellement justifiés
6. vérifier si certaines règles deviennent mortes
7. supprimer uniquement les règles prouvées inutiles
8. lancer le typecheck
9. documenter précisément les décisions prises

## Validation attendue

### Validation technique

- `pnpm run typecheck`
- aucune suppression CSS injustifiée
- aucun changement de comportement

### Validation visuelle

Vérifier en particulier :

- le header public
- les surfaces hero
- les sections publiques
- les pages 404 / error si concernées
- les wrappers de shell
- le responsive mobile / tablette / desktop

### Validation fonctionnelle

Vérifier que les pages publiques concernées restent identiques fonctionnellement.

## Anti-patterns à éviter

### 1. Transformer le lot en redesign public

V14-6B est un lot de cleanup, pas une refonte esthétique du storefront.

### 2. Faire tomber des classes transverses sans stratégie

Comme ces classes sont souvent partagées par plusieurs pages, un remplacement fragmentaire peut faire plus de mal que de bien.

### 3. Supprimer des `@supports` ou comportements spéciaux sans équivalent

Les comportements liés au blur, au sticky ou aux surfaces doivent rester fonctionnellement identiques.

### 4. Confondre “moins de global CSS” et “meilleur code”

Le meilleur résultat n’est pas forcément celui qui supprime le plus de lignes, mais celui qui laisse le projet plus lisible.

## Livrables attendus

Le lot doit idéalement produire :

- un audit clair des familles du shell public et des surfaces simples
- un petit nombre de fichiers modifiés
- la suppression éventuelle de règles réellement mortes
- une justification explicite des familles conservées

## Suite logique

Une fois V14-6B terminé, la suite logique est :

### V14-6C — Admin utility cleanup

Ce lot pourra s’attaquer aux helpers admin encore globalement présents, là où les composants admin stabilisés rendent désormais certains styles redondants.

## Résumé

V14-6B est un lot de cleanup transversal mais prudent.

Il sert à déterminer jusqu’où le shell public et les surfaces simples peuvent sortir de `globals.css` sans créer de duplication excessive ni dégrader la cohérence visuelle du storefront.
