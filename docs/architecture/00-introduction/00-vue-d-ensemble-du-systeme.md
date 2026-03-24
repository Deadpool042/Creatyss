# Vue d’ensemble du système

## Objectif

Ce document présente la structure globale du système et la manière correcte de l’aborder.

Il doit permettre à un lecteur de comprendre rapidement :

- ce que le système cherche à résoudre ;
- quels sont ses blocs architecturaux majeurs ;
- comment distinguer le coeur, les options, les systèmes externes et les éléments transverses ;
- où lire ensuite selon le niveau de détail recherché.

---

## Vision générale

Le système est conçu comme un socle modulaire orienté métier.

La priorité architecturale est la suivante :

1. préserver la cohérence du coeur métier ;
2. isoler les dépendances externes ;
3. rendre les capacités optionnelles activables sans contaminer le coeur ;
4. traiter explicitement les préoccupations transverses ;
5. garder une structure lisible, testable et maintenable.

Le système ne doit pas être pensé comme une juxtaposition de features.
Il doit être pensé comme un ensemble structuré autour de responsabilités stables.

---

## Grands blocs du système

Le système est organisé autour de quatre familles principales :

### 1. Domaines coeur

Les domaines coeur portent les vérités métier fondamentales du système.

Ils définissent :

- les objets métier structurants ;
- les invariants ;
- les règles de décision ;
- les états importants ;
- les relations métier durables.

Le coeur ne dépend pas directement d’un fournisseur externe pour exister.

### 2. Capacités optionnelles

Les capacités optionnelles apportent des comportements activables selon le contexte produit, commercial ou opérationnel.

Elles :

- enrichissent le système ;
- restent découplées du coeur autant que possible ;
- ne doivent pas redéfinir la vérité métier centrale ;
- peuvent être activées, désactivées ou modulées selon les besoins.

### 3. Systèmes externes et satellites

Les systèmes externes regroupent les fournisseurs, plateformes tierces et services périphériques.

Ils apportent :

- des moyens techniques ;
- des capacités de diffusion, paiement, synchronisation ou communication ;
- des interfaces externes ;
- des flux entrants et sortants.

Ils ne doivent pas imposer leur modèle au coeur métier.

### 4. Préoccupations transverses

Les préoccupations transverses traversent plusieurs blocs du système.

Elles regroupent notamment :

- l’audit ;
- l’observabilité ;
- la sécurité ;
- les traitements asynchrones ;
- la journalisation ;
- certaines politiques techniques globales.

Une préoccupation transverse n’est pas secondaire par nature.
Elle peut être structurellement critique.

---

## Logique de conception

Le système suit les principes suivants :

- le métier passe avant la technique ;
- le coeur passe avant les intégrations ;
- les dépendances externes sont encapsulées ;
- les capacités optionnelles restent identifiables et bornées ;
- les effets transverses sont traités explicitement, jamais implicitement.

---

## Ce que cette architecture cherche à éviter

Cette architecture cherche explicitement à éviter :

- un coeur métier contaminé par des API externes ;
- des features optionnelles qui modifient silencieusement le comportement central ;
- des responsabilités diffuses ;
- des documents hybrides impossibles à maintenir ;
- une taxonomie floue ;
- un couplage implicite entre couches.

---

## Documents à lire ensuite

- Pour le vocabulaire : `01-glossaire.md`
- Pour l’ordre de lecture : `02-guide-de-lecture.md`
- Pour la doctrine : `../10-fondations/10-principes-d-architecture.md`
- Pour la classification : `../10-fondations/11-modele-de-classification.md`
- Pour la carte concrète du système : `../20-structure/20-cartographie-du-systeme.md`
