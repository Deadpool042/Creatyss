# V14-10 — Real final audit

## Objectif du lot

Le lot V14-10 clôt la seconde vague V14 consacrée à l’élimination progressive du CSS custom restant.

Après les lots ciblés sur :

- les libellés de métadonnées
- les styles texte/meta storefront
- les helpers publics simples
- certaines sous-familles produit / variante
- certaines classes éditoriales
- le shell public
- les utilitaires admin
- les groupes de surfaces partagées
- les structures panier / checkout
- les structures produit / variante restantes

ce lot a pour rôle d’établir le véritable état final du CSS custom encore présent dans le projet.

L’objectif n’est plus de continuer le nettoyage par inertie. L’objectif est de constater précisément ce qui a été supprimé, ce qui reste, et ce qui doit désormais être considéré comme résiduel mais assumé.

## Intention

V14-10 est un lot de clôture analytique et décisionnelle.

Il doit éviter deux dérives :

- relancer indéfiniment de nouveaux micro-lots CSS alors que le gain devient marginal
- laisser le projet dans un état où personne ne sait plus distinguer le CSS encore utile du CSS simplement non traité

Ce lot sert à transformer le résultat de toute la V14 en position claire sur l’état final du CSS custom du repo.

## Résultat attendu

À l’issue de V14-10, le projet doit disposer :

- d’un audit final honnête du CSS custom restant
- d’une synthèse claire de ce qui a été effectivement supprimé pendant toute la V14
- d’une qualification explicite des familles restantes
- d’une distinction nette entre CSS résiduel assumé et éventuelle dette future
- d’une conclusion claire sur la fin réelle du chantier V14

## Ce que couvre ce lot

V14-10 couvre :

- l’audit final du CSS custom restant
- la synthèse des suppressions réalisées pendant toute la V14
- la qualification des familles encore actives
- l’identification d’éventuelles règles réellement mortes si certaines subsistent encore
- la documentation de ce qui reste volontairement en place
- la formulation explicite de la sortie de V14

## Ce que ce lot ne couvre pas

V14-10 ne couvre pas :

- une nouvelle vague de migration écran par écran
- une suppression opportuniste de règles non auditées
- une refonte supplémentaire du storefront ou de l’admin
- des changements métier ou serveur
- la création de nouveaux composants

## Questions auxquelles le lot doit répondre

### 1. Quelles familles de classes ont effectivement disparu pendant V14 ?

Le lot doit produire un bilan clair des suppressions réelles, pas seulement des intentions initiales de roadmap.

### 2. Quel CSS custom reste encore actif après toute la V14 ?

Le but est de rendre visible l’état final, pas de laisser une impression floue de “chantier presque terminé”.

### 3. Le CSS restant est-il encore améliorable ou désormais assumé ?

Chaque famille restante doit être qualifiée explicitement.

### 4. Existe-t-il encore des règles réellement mortes ?

Si oui, elles peuvent être supprimées dans ce lot, à condition que la preuve soit complète.

### 5. La V14 peut-elle être considérée comme terminée ?

La réponse doit être formulée clairement, sans ambiguïté.

## Grille de qualification recommandée

Les familles restantes peuvent être rangées dans les catégories suivantes :

### A — CSS résiduel assumé

Classe encore active, utile, lisible, conservée volontairement.

### B — CSS actif mais encore améliorable

Classe encore active, non prioritaire, qui pourrait être retravaillée plus tard si un vrai besoin apparaît.

### C — CSS mort

Classe sans usage réel confirmé, supprimable immédiatement.

### D — CSS ambigu à documenter

Classe encore active mais dont le rôle mérite une clarification explicite avant toute décision future.

## Principes de décision

### 1. Finir proprement, pas éterniser le chantier

Le rôle de V14-10 est de clore la phase d’élimination du CSS custom, pas d’ouvrir un nouveau cycle caché.

### 2. Supprimer seulement ce qui est prouvé mort

Aucune suppression symbolique.

### 3. Assumer clairement le résiduel utile

S’il reste un petit noyau de CSS custom encore pertinent, il doit être documenté comme tel.

### 4. Produire une base de décision pour la suite

Le lot doit permettre au projet de revenir ensuite à des sujets de plus forte valeur produit.

## Méthode recommandée

Le déroulé recommandé est :

1. relister les familles ciblées par toute la V14
2. vérifier ce qui a effectivement été supprimé
3. auditer le CSS custom restant
4. qualifier chaque famille restante
5. supprimer uniquement les règles démontrées mortes
6. lancer le typecheck
7. produire une synthèse finale claire
8. documenter explicitement la sortie de V14

## Validation attendue

### Validation technique

- `pnpm run typecheck`
- aucune suppression CSS non prouvée
- aucun changement de comportement

### Validation documentaire

Le lot doit permettre à un intervenant de comprendre rapidement :

- ce que V14 a réellement supprimé
- ce qui reste
- pourquoi cela reste
- si le chantier CSS est considéré comme clos

### Validation projet

La fin de V14 doit permettre de redonner la priorité aux sujets non CSS.

## Anti-patterns à éviter

### 1. Continuer à nettoyer pour le principe

V14-10 doit mettre fin à la logique de nettoyage sans fin.

### 2. Présenter comme “temporaire” un résiduel déjà assumé

Si une classe restante est encore utile, il faut le documenter clairement.

### 3. Laisser une sortie floue

Le lot doit conclure explicitement l’état du CSS custom après V14.

### 4. Masquer l’absence de gain réel

Si le CSS restant est déjà réduit et stable, il faut l’assumer au lieu d’inventer une dette artificielle.

## Livrables attendus

Le lot doit idéalement produire :

- une synthèse finale des suppressions V14
- une liste des familles restantes
- une qualification explicite du CSS restant
- un éventuel micro-cleanup final si certaines règles sont réellement mortes
- une conclusion claire sur la fin de V14

## Suite logique

Une fois V14-10 terminé, la suite logique n’est plus une nouvelle vague de cleanup CSS par défaut.

La suite doit revenir à des sujets de plus forte valeur, par exemple :

- paiement réel
- gestion de stock
- robustesse des flux commande
- améliorations métier ciblées

## Résumé

V14-10 est le lot de clôture réelle de la phase d’élimination progressive du CSS custom.

Il sert à établir l’état final du CSS restant, à documenter clairement ce qui a disparu et ce qui demeure, et à permettre au projet de sortir proprement du chantier CSS pour revenir à des priorités plus produit.
