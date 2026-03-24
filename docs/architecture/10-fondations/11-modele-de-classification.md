# Modèle de classification

## Objectif

Ce document définit la taxonomie architecturale du système.

Tout nouvel élément significatif doit pouvoir être classé dans l’une des catégories suivantes :

- domaine coeur ;
- capacité optionnelle ;
- système externe ou satellite ;
- préoccupation transverse.

La classification n’est pas cosmétique.
Elle conditionne la manière correcte de concevoir, documenter, tester et exploiter le système.

---

## 1. Domaine coeur

### Définition

Un domaine coeur porte une responsabilité métier centrale et non optionnelle.

### Critères

Un élément relève d’un domaine coeur lorsqu’il :

- structure une vérité métier fondamentale ;
- porte des invariants propres ;
- reste indispensable au fonctionnement métier du système ;
- ne dépend pas d’un fournisseur externe pour exister.

### Conséquences

Un domaine coeur :

- doit être explicitement documenté ;
- ne doit pas être caché derrière une feature ou une intégration ;
- doit conserver des frontières claires ;
- influence directement la structure du modèle métier.

---

## 2. Capacité optionnelle

### Définition

Une capacité optionnelle enrichit le système sans redéfinir son coeur.

### Critères

Un élément relève d’une capacité optionnelle lorsqu’il :

- apporte de la valeur mais n’est pas indispensable à l’identité du système ;
- peut être activé ou non selon le contexte ;
- n’est pas la source de vérité principale du coeur ;
- peut être borné et gouverné comme extension.

### Conséquences

Une capacité optionnelle :

- doit être explicitement activable ;
- doit avoir un impact maîtrisé ;
- ne doit pas imposer sa logique à l’ensemble du système ;
- doit rester testable indépendamment.

---

## 3. Système externe ou satellite

### Définition

Un système externe ou satellite est un système tiers ou périphérique connecté au système.

### Critères

Un élément relève de cette catégorie lorsqu’il :

- vit hors du périmètre métier central ;
- fournit un service ou une interface externe ;
- peut être remplacé ou abstrait ;
- n’est pas la source conceptuelle du métier.

### Conséquences

Un satellite :

- doit être isolé derrière des adaptateurs ;
- ne doit pas imposer son vocabulaire au coeur ;
- doit être traité comme dépendance externe ;
- doit faire l’objet de règles d’intégration explicites.

---

## 4. Préoccupation transverse

### Définition

Une préoccupation transverse traverse plusieurs zones du système sans se confondre avec un seul domaine.

### Critères

Un élément relève d’une préoccupation transverse lorsqu’il :

- concerne plusieurs domaines ou couches ;
- représente une politique globale, un mécanisme partagé ou une exigence systémique ;
- n’est pas localisable proprement dans un seul domaine ;
- produit des effets dans plusieurs parties du système.

### Conséquences

Une préoccupation transverse :

- doit être explicitée ;
- ne doit pas être traitée comme effet secondaire invisible ;
- peut être critique et non optionnelle ;
- doit posséder des règles de présence, de déclenchement et de responsabilité.

---

## Ce que la classification n’est pas

La classification n’est pas :

- une simple organisation de fichiers ;
- une préférence de nommage ;
- un tri arbitraire ;
- une hiérarchie de prestige.

Elle sert à déterminer :

- où placer une responsabilité ;
- comment l’isoler ;
- comment la documenter ;
- comment tester ses frontières.

---

## Cas fréquents de confusion

### Confusion 1 — Intégration externe prise pour domaine

Erreur classique : appeler « domaine » un PSP, un ERP ou une API tierce.

Correction :

- le paiement métier peut relever d’un domaine ;
- Stripe n’est pas ce domaine ;
- Stripe est un fournisseur externe.

### Confusion 2 — Préoccupation transverse prise pour option

Erreur classique : considérer l’audit ou l’observabilité comme accessoires.

Correction :

- une préoccupation transverse peut être structurelle ;
- elle n’est pas optionnelle par nature ;
- son caractère transverse n’implique aucune faible criticité.

### Confusion 3 — Feature locale prise pour coeur métier

Erreur classique : promouvoir une feature commerciale en principe structurant du système.

Correction :

- une fonctionnalité activable n’est pas un coeur métier par défaut ;
- sa centralité doit être démontrée, pas supposée.

---

## Règle de décision

Lorsqu’un nouvel élément apparaît, il faut répondre dans cet ordre :

1. Porte-t-il une vérité métier fondamentale ?
2. Est-il indispensable à l’identité fonctionnelle du système ?
3. Peut-il être absent sans détruire le coeur ?
4. Dépend-il d’un fournisseur ou d’une plateforme externe ?
5. Traverse-t-il plusieurs domaines ou couches ?

Les réponses à ces questions déterminent sa classification.

La grille de décision détaillée est fournie dans `../90-reference/90-regles-de-decision.md`.
