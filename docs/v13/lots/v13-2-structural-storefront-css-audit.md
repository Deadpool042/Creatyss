# V13-2 — Structural storefront CSS audit

## Objectif du lot

Le lot V13-2 prend le relais après V13-1.

Si V13-1 traite les derniers patterns globaux simples encore faciles à remplacer, V13-2 a un rôle différent : il ne cherche plus à supprimer à tout prix, mais à clarifier et stabiliser ce qui reste du CSS structurel storefront.

L’objectif n’est donc pas de poursuivre une logique de nettoyage automatique. L’objectif est de poser une décision explicite sur les classes structurelles encore actives et de distinguer clairement :

- ce qui doit être conservé
- ce qui peut être simplifié plus tard
- ce qui ne mérite plus d’être traité car le gain serait trop faible

## Intention

Ce lot est un lot d’audit, de qualification et de cadrage.

La V12 a déjà supprimé une grande quantité de CSS legacy faible valeur. Ce qui reste après cette passe n’est plus forcément une dette. Une partie du CSS global encore présente joue désormais un rôle de structure stable du storefront.

V13-2 sert à transformer ce constat implicite en décision explicite.

## Résultat attendu

À l’issue de V13-2, le projet doit disposer d’une lecture claire de son CSS storefront structurel.

Le résultat attendu est :

- une cartographie claire des classes storefront encore actives
- une qualification de leur rôle réel
- une distinction nette entre CSS legacy résiduel et CSS structurel assumé
- une base de décision pour éviter les futurs faux chantiers de nettoyage
- éventuellement un cleanup mineur uniquement s’il est trivial et sûr

## Ce que couvre ce lot

V13-2 couvre :

- l’audit des classes structurelles storefront encore présentes
- la qualification de leur usage
- l’identification des classes clairement structurelles
- l’identification des classes encore ambiguës
- la documentation de ce qui est conservé intentionnellement
- un cleanup très mineur si une règle réellement morte apparaît au cours de l’audit

## Ce que ce lot ne couvre pas

V13-2 ne couvre pas :

- une réécriture massive des layouts storefront
- une suppression systématique de tout le CSS global restant
- une migration complète des zones `.product-*`, `.checkout-*`, `.cart-*`, `.variant-*`
- la création d’un nouveau design system
- des changements métier ou serveur

## Périmètre d’audit

Le périmètre principal concerne les classes structurelles encore visibles dans le storefront, par exemple :

- `.cart-*`
- `.checkout-*`
- `.product-*`
- `.variant-*`
- `.article-*`
- `.store-card`
- `.card-grid`
- `.empty-state`
- `.card-kicker`
- `.card-meta`
- `.card-copy`
- `.variant-meta`

Cette liste est indicative. L’audit doit partir de l’état réel du repo.

## Questions auxquelles le lot doit répondre

Le lot doit idéalement répondre à ces questions :

### 1. La classe est-elle encore active ?

Si une classe n’a plus d’usage réel, elle n’appartient plus au storefront structurel et peut potentiellement être supprimée.

### 2. La classe porte-t-elle une vraie structure ?

Si elle organise réellement un layout ou un pattern d’affichage central, elle peut relever d’un CSS structurel assumé.

### 3. La classe est-elle encore ambiguë ?

Certaines classes peuvent être encore actives sans être totalement convaincantes. Dans ce cas, elles doivent être signalées comme candidats potentiels à une simplification future, sans être forcément traitées immédiatement.

### 4. Le gain d’une migration supplémentaire serait-il réel ?

Si migrer une classe vers du Tailwind inline ou vers un composant local n’apporte qu’un gain marginal avec un risque élevé, la bonne décision peut être de la conserver.

## Grille de qualification recommandée

Chaque classe ou famille de classes auditée peut être rangée dans l’une des catégories suivantes :

### Catégorie A — CSS structurel assumé

Classe encore active, stable, lisible, utile, dont la conservation est acceptable.

Exemples typiques :

- classes de layout storefront structurantes
- classes de grille ou d’assemblage de cartes encore bien délimitées

### Catégorie B — CSS actif mais améliorable

Classe encore active, mais dont la migration future pourrait apporter un petit gain si elle s’inscrit dans un lot cohérent.

Exemples typiques :

- petites classes de présentation encore partagées
- conventions résiduelles de texte ou de métadonnées

### Catégorie C — CSS mort

Classe sans usage réel confirmé, supprimable immédiatement après validation.

### Catégorie D — CSS ambigu à documenter

Classe encore active, mais dont le rôle exact ou la place future doit être clarifié avant toute suppression.

## Principes de décision

### 1. Conserver ce qui est structurel et propre

Une classe ne doit pas être supprimée uniquement parce qu’elle est ancienne.

Si elle reste utile, stable et lisible, elle peut être conservée comme partie assumée du socle storefront.

### 2. Ne pas confondre structure et dette

Une partie du CSS global restant n’est plus une dette de migration, mais une structure d’interface encore pertinente.

### 3. Privilégier la décision explicite à la suppression symbolique

Le vrai objectif de V13-2 est de documenter les choix, pas de faire tomber artificiellement quelques lignes de CSS pour donner l’illusion d’un nettoyage.

### 4. Nettoyer seulement quand la preuve est triviale

Si une règle est réellement morte, il faut la supprimer.

Mais le cleanup ne doit pas devenir la finalité du lot.

## Méthode recommandée

Le déroulé recommandé est :

1. lister les classes storefront encore actives
2. vérifier leurs usages réels dans le repo
3. regrouper par familles cohérentes
4. qualifier chaque famille avec la grille A / B / C / D
5. supprimer uniquement les cas C démontrés
6. documenter clairement les familles A et B
7. signaler les D si nécessaire

## Sortie attendue du lot

Le lot doit idéalement produire :

- une synthèse claire des classes storefront restantes
- une qualification par famille
- un éventuel cleanup mineur si certaines règles sont mortes
- une conclusion explicite sur ce qui devient du CSS structurel assumé

## Validation attendue

### Validation technique

- `pnpm run typecheck`
- aucune suppression cassant un écran réel
- aucun cleanup non prouvé

### Validation documentaire

Le lot doit permettre à un futur intervenant de comprendre rapidement :

- quelles classes restent intentionnellement en CSS global
- lesquelles sont encore candidates à amélioration
- lesquelles ont été définitivement considérées comme structurelles

### Validation produit

Aucun comportement métier ne doit être modifié.

## Anti-patterns à éviter

### 1. Relancer une croisade anti-CSS global

V13-2 n’est pas un lot idéologique. Il doit constater la réalité du projet.

### 2. Supprimer des classes structurelles utiles

Une classe de layout storefront encore claire et stable ne doit pas être sacrifiée pour des raisons purement théoriques.

### 3. Ouvrir une refonte de layout déguisée

Si un travail implique de refondre profondément une fiche produit, un panier ou un checkout, il ne relève plus de ce lot.

### 4. Mélanger audit et redesign

Le lot doit rester analytique, sobre et fondé sur l’état réel du code.

## Livrables attendus

Le lot doit produire au minimum :

- un état des lieux synthétique
- une qualification des familles de classes storefront
- une décision claire sur ce qui est conservé
- un cleanup limité uniquement si justifié

## Suite logique

Une fois V13-2 terminé, la suite logique est :

### V13-3 — UI closeout documentation

Ce lot devra transformer les conclusions de V13-2 en documentation claire et durable pour clôturer proprement la phase de migration UI.

## Résumé

V13-2 n’est pas un lot de suppression, mais un lot de clarification.

Il sert à reconnaître que le CSS restant n’est plus uniformément du legacy à faire disparaître, mais en partie un socle structurel storefront désormais stable et assumé.
