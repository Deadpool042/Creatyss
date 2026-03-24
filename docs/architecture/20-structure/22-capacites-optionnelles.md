# Capacités optionnelles

## Objectif

Ce document recense les capacités optionnelles du système au niveau architectural.

Une capacité optionnelle enrichit le produit sans redéfinir son coeur.

Elle peut être importante commercialement, mais son importance ne suffit pas à en faire un domaine coeur.

---

## Définition

Une capacité optionnelle :

- apporte de la valeur ;
- peut être activée ou non selon le contexte ;
- reste bornée ;
- ne devient pas la source de vérité principale du coeur ;
- ne doit pas dissoudre les frontières métier du système.

---

## Règles de conception

Toute capacité optionnelle doit :

- être explicitement identifiable ;
- avoir un point d’ancrage clair ;
- déclarer son impact sur le système ;
- rester compréhensible lorsqu’elle est absente ;
- être testable indépendamment de son activation ;
- éviter toute redéfinition implicite des invariants coeur.

---

## Règles de gouvernance

Toute capacité optionnelle significative doit :

- être documentée dans `docs/domains/optional/` ;
- expliciter son mode d’activation ;
- expliciter ses dépendances ;
- expliciter ses interactions avec le coeur ;
- expliciter ses effets observables.

---

## Position de principe pour Creatyss

Creatyss doit traiter comme capacités optionnelles les comportements qui :

- enrichissent le produit ;
- modulent l’offre ;
- peuvent varier selon le client, le contexte ou la configuration ;
- n’incarnent pas à eux seuls la vérité métier centrale.

Cela inclut typiquement des blocs comme :

- promotions ;
- fidélité ;
- avis ;
- wishlist ;
- enrichissements merchandising ;
- personnalisation avancée ;
- fonctionnalités de confort ou de différenciation commerciale.

La liste effective doit être maintenue dans `docs/domains/optional/` et reflétée ici une fois stabilisée.

---

## Règle d’activation

Une capacité optionnelle doit être activée explicitement.

Elle ne doit pas :

- devenir active par effet de bord ;
- modifier silencieusement le comportement coeur ;
- exiger du reste du système une connaissance implicite de son existence.

---

## Frontière avec le coeur

Une capacité optionnelle peut :

- consommer des faits métier ;
- étendre certains comportements ;
- produire des effets secondaires encadrés ;
- publier ses propres signaux.

Elle ne doit pas :

- devenir la source de vérité du coeur ;
- imposer sa logique comme norme globale non documentée ;
- fragmenter les invariants fondamentaux.

---

## Anti-patterns à éviter

Le système doit éviter :

- une option qui devient structurellement obligatoire sans requalification ;
- une capacité qui modifie globalement le comportement sans activation explicite ;
- une option qui disperse sa logique dans plusieurs domaines sans frontière claire ;
- une option qui devient un coeur déguisé.

---

## Documents liés

- `../10-fondations/11-modele-de-classification.md`
- `../10-fondations/12-frontieres-et-responsabilites.md`
- `../../domains/optional/`
