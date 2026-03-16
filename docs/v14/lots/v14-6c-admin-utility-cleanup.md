# V14-6C — Admin utility cleanup

## Objectif du lot

Le lot V14-6C prend le relais après V14-6B sur un périmètre différent : les helpers et utilitaires admin encore portés par `globals.css`.

Après la stabilisation progressive des composants admin en V12 et V13, une partie du CSS global côté back-office est devenue redondante ou partiellement recouverte par Tailwind et par les composants déjà installés dans le projet.

L’objectif de V14-6C est de vérifier jusqu’où ces classes admin encore globales peuvent être supprimées proprement, sans casser la lisibilité des formulaires ni rouvrir une refonte des écrans d’administration.

## Intention

Ce lot vise les classes admin qui servent encore de wrappers ou d’utilitaires de structure légère, par exemple :

- zones de largeur
- wrappers de champs
- groupes d’actions
- sous-sections de formulaires produit
- cartes admin dont la largeur est encore portée par une classe globale

La situation est différente du storefront :

- l’admin dispose déjà de composants stabilisés (`AdminPageShell`, `AdminFormField`, `AdminFormActions`, etc.)
- une partie des classes globales restantes peut déjà être devenue purement vestigiale
- mais certaines classes peuvent encore servir de point d’ancrage structurel utile

Le lot doit donc rester pragmatique :

> supprimer ce qui est devenu redondant, conserver ce qui reste réellement utile.

## Résultat attendu

À l’issue de V14-6C, le projet doit idéalement :

- réduire les classes admin globales devenues redondantes
- mieux aligner le markup admin sur les composants déjà stabilisés
- supprimer uniquement les règles CSS réellement mortes
- ne provoquer aucune régression visuelle ni aucune régression fonctionnelle côté admin
- clarifier explicitement les classes admin conservées

## Ce que couvre ce lot

V14-6C couvre :

- l’audit des utilitaires admin encore actifs dans `globals.css`
- leur qualification par famille
- leur suppression ou remplacement si le ratio gain / risque est bon
- la suppression des règles CSS réellement mortes
- la documentation des familles laissées en place

## Ce que ce lot ne couvre pas

V14-6C ne couvre pas :

- une refonte des écrans admin
- la réécriture du domaine métier admin
- des changements serveur ou métier
- la création de nouveaux composants abstraits sans nécessité forte
- un nettoyage opportuniste hors du périmètre admin

## Cibles probables

Les familles les plus probables dans ce lot sont :

- `.admin-area`
- `.admin-field`
- `.admin-actions`
- `.admin-product-subsection`
- `.admin-product-card`
- `.admin-blog-card`
- `.admin-variant-card`
- `.admin-image-card`

Cette liste doit être confirmée par l’état réel du repo.

## Nature des patterns ciblés

Ces classes appartiennent à trois sous-types différents :

### 1. Utilitaires potentiellement vestigiaux

Exemples typiques :

- wrappers déjà remplacés par `grid gap-*`
- groupes d’actions déjà couverts par Tailwind
- conteneurs dont toutes les propriétés sont déjà redondantes

### 2. Utilitaires encore structurels mais simples

Exemples typiques :

- `width: 100%`
- `align-content: start`
- petits wrappers encore utiles à la lisibilité du layout admin

### 3. Classes encore présentes mais à faible gain de suppression

Certaines classes peuvent encore exister sans être problématiques, si leur suppression n’apporte presque rien.

## Questions auxquelles le lot doit répondre

### 1. La classe est-elle réellement active ou déjà redondante ?

Si toutes ses propriétés sont déjà recouvertes par Tailwind ou par un composant admin, sa suppression peut être légitime.

### 2. Le nom de classe a-t-il encore un rôle structurel utile dans le markup ?

Certaines classes peuvent rester lisibles même avec peu de CSS, si elles expriment encore clairement une intention de structure.

### 3. La suppression exige-t-elle un nettoyage coordonné du markup ?

Supprimer une règle CSS tout en laissant des class names no-op partout n’est pas un vrai cleanup.

### 4. Le composant admin concerné devient-il plus clair après suppression ?

Le but est de simplifier, pas de déplacer du bruit de `globals.css` vers du JSX inutilement verbeux.

## Principes de décision

### 1. Priorité aux classes déjà recouvertes par les composants admin stabilisés

Si `AdminFormField` ou `AdminFormActions` rendent une classe globale redondante, celle-ci devient un bon candidat à suppression.

### 2. Pas de demi-nettoyage

Quand c’est possible, il faut nettoyer ensemble :

- la règle CSS
- le class name devenu inutile
- le markup qui dépendait de cette règle

### 3. Conserver les classes qui gardent une vraie valeur structurelle

Une classe simple comme `width: 100%` peut rester acceptable si elle évite de disperser des `w-full` sans gain réel.

### 4. Ne pas rouvrir les écrans admin un par un

Le lot porte sur des utilitaires transverses, pas sur une nouvelle vague de migration d’écrans.

## Méthode recommandée

Le déroulé recommandé est :

1. lister les occurrences réelles des classes admin ciblées
2. vérifier quelles propriétés sont réellement encore actives
3. qualifier chaque famille :
   - à supprimer maintenant
   - à conserver
   - à repousser
4. choisir un plan minimal
5. appliquer les suppressions réellement justifiées
6. vérifier si les règles CSS deviennent mortes
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

- les formulaires admin
- les groupes d’actions
- les cartes produit / blog / variante / image
- les largeurs et alignements de sous-sections
- les écrans produit et commande les plus denses

### Validation fonctionnelle

Vérifier que les écrans admin concernés restent identiques fonctionnellement.

## Anti-patterns à éviter

### 1. Nettoyer le CSS sans nettoyer le markup

Si une classe devient inutile, son nom doit idéalement disparaître aussi.

### 2. Transformer le lot en refonte admin

V14-6C n’est pas un lot de redesign du back-office.

### 3. Supprimer une classe structurelle pour la remplacer par du bruit inline partout

Le résultat doit rester plus clair, pas simplement plus “Tailwind”.

### 4. Toucher au métier sous prétexte de cleanup

Le périmètre est purement UI/CSS.

## Livrables attendus

Le lot doit idéalement produire :

- un audit clair des utilitaires admin restants
- un petit nombre de fichiers modifiés
- la suppression éventuelle de règles réellement mortes
- une justification explicite des classes admin conservées

## Suite logique

Une fois V14-6C terminé, la suite logique est :

### V14-7 — Shared surface groups cleanup

Ce lot pourra s’attaquer aux gros sélecteurs groupés encore présents dans `globals.css`, qui bloquent aujourd’hui plusieurs suppressions fines.

## Résumé

V14-6C est un lot de cleanup admin ciblé.

Il sert à faire disparaître les utilitaires admin devenus redondants grâce aux composants déjà stabilisés, tout en conservant explicitement les classes qui gardent encore une vraie utilité structurelle.
