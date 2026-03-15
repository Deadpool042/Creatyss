# V14-6 — Final audit

## Objectif du lot

Le lot V14-6 clôt la séquence V14 consacrée à l’élimination progressive du CSS custom restant.

Après les lots ciblés sur :

- les labels de métadonnées
- les styles texte/meta storefront
- les helpers publics simples
- les structures storefront plus denses
- l’éditorial

ce lot a pour rôle de produire un état final clair du CSS custom encore présent dans le projet.

L’objectif n’est plus de migrer, mais de constater précisément ce qui a été supprimé, ce qui reste, et ce qui doit désormais être considéré comme résiduel mais assumé.

## Intention

V14-6 est un lot de clôture analytique.

Il doit éviter deux dérives :

- continuer à ouvrir des micro-lots de cleanup sans fin
- laisser le projet dans un état où personne ne sait plus ce qui reste intentionnellement en CSS global

Ce lot sert à transformer le résultat de V14 en une décision explicite sur l’état final du CSS custom.

## Résultat attendu

À l’issue de V14-6, le projet doit disposer :

- d’un audit final du CSS custom restant
- d’une liste claire des familles supprimées pendant V14
- d’une qualification explicite des classes encore actives
- d’une frontière nette entre CSS résiduel assumé et dette éventuelle future
- d’une sortie propre de la phase “custom CSS elimination”

## Ce que couvre ce lot

V14-6 couvre :

- l’audit final du CSS custom restant
- la synthèse des suppressions réalisées pendant V14
- la qualification des familles encore actives
- l’identification des règles réellement mortes si certaines subsistent encore
- la documentation de ce qui reste volontairement en place
- la formulation explicite de la fin du chantier V14

## Ce que ce lot ne couvre pas

V14-6 ne couvre pas :

- une nouvelle vague de migration écran par écran
- une suppression opportuniste de règles non auditées
- une refonte supplémentaire du storefront
- des changements métier ou serveur
- la création de nouveaux composants

## Questions auxquelles le lot doit répondre

### 1. Quelles familles de classes ont effectivement disparu pendant V14 ?

Le lot doit produire un bilan clair des suppressions réelles.

### 2. Quel CSS custom reste encore actif après V14 ?

Le but est de rendre visible l’état final, pas de rester dans une impression floue.

### 3. Le CSS restant est-il encore améliorable ou désormais assumé ?

Chaque famille restante doit être qualifiée explicitement.

### 4. Existe-t-il encore des règles réellement mortes ?

Si oui, elles peuvent être supprimées dans ce lot, à condition que la preuve soit complète.

### 5. La phase V14 peut-elle être considérée comme terminée ?

La réponse doit être documentée clairement.

## Grille de qualification recommandée

Les familles restantes peuvent être classées dans les catégories suivantes :

### A — CSS résiduel assumé

Classe encore active, utile, lisible, conservée volontairement.

### B — CSS actif mais encore améliorable

Classe encore active, non critique, qui pourrait être retravaillée plus tard si un vrai besoin apparaît.

### C — CSS mort

Classe sans usage réel confirmé, supprimable immédiatement.

### D — CSS ambigu à documenter

Classe encore active mais dont le rôle mérite une clarification explicite avant toute décision future.

## Principes de décision

### 1. Finir proprement, pas éterniser

Le rôle de V14-6 est de fermer la séquence, pas de rouvrir un nouveau mini-lot caché.

### 2. Supprimer seulement ce qui est prouvé mort

Aucune suppression symbolique.

### 3. Assumer le résiduel utile

S’il reste un petit noyau de CSS custom encore utile, il doit être documenté comme tel.

### 4. Transformer le résultat en base de décision

Le lot doit permettre au projet de passer à autre chose ensuite.

## Méthode recommandée

Le déroulé recommandé est :

1. relister les familles ciblées par V14
2. vérifier ce qui a effectivement été supprimé
3. auditer le CSS custom restant
4. qualifier chaque famille restante
5. supprimer uniquement les règles démontrées mortes
6. lancer le typecheck
7. produire une synthèse finale claire
8. documenter la sortie de V14

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

V14-6 doit mettre fin à la logique de nettoyage sans fin.

### 2. Présenter comme “temporaire” un résiduel déjà assumé

Si une classe restante est encore utile, il faut le dire clairement.

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

Une fois V14-6 terminé, la suite logique n’est plus une nouvelle vague de cleanup CSS.

La suite doit revenir à des sujets de plus forte valeur, par exemple :

- paiement réel
- gestion de stock
- robustesse des flux commande
- améliorations métier ciblées

## Résumé

V14-6 est le lot de clôture de l’élimination progressive du CSS custom.

Il sert à établir l’état final du CSS restant, à documenter clairement ce qui a disparu et ce qui demeure, et à permettre au projet de sortir proprement du chantier CSS pour revenir à des priorités plus produit.∑
