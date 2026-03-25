# Règles de décision

## Objectif

Ce document fournit une grille pratique pour classifier correctement un nouvel élément architectural.

Il sert à éviter les erreurs classiques de modélisation et de vocabulaire.

---

## Question 1 — Porte-t-il une vérité métier fondamentale ?

Si oui, il s’agit probablement d’un domaine coeur.

Indicateurs :

- il porte des invariants ;
- il structure un état métier important ;
- son absence dénature le système ;
- il ne dépend pas d’un fournisseur pour exister.

Si non, passer à la question suivante.

---

## Question 2 — Est-il indispensable à l’identité fonctionnelle du système ?

Si oui, il relève probablement encore du coeur, même si sa frontière doit être précisée.

Si non, passer à la question suivante.

---

## Question 3 — Peut-il être absent sans détruire le coeur ?

Si oui, il s’agit probablement d’une capacité optionnelle ou d’un satellite.

Si non, reconsidérer sa nature de domaine coeur.

---

## Question 4 — Représente-t-il un système tiers, une plateforme externe ou un fournisseur ?

Si oui, il s’agit d’un système externe ou d’un satellite.

Indicateurs :

- il vit hors du système ;
- il impose un contrat externe ;
- il peut être remplacé ;
- il apporte une capacité technique ou périphérique.

---

## Question 5 — Traverse-t-il plusieurs domaines ou couches ?

Si oui, il s’agit probablement d’une préoccupation transverse.

Indicateurs :

- il n’appartient pas proprement à un seul domaine ;
- il influence plusieurs zones ;
- il représente une politique globale ou un mécanisme partagé.

---

## Table de décision simplifiée

### Domaine coeur

Choisir cette classification si l’élément :

- porte une vérité métier centrale ;
- est indispensable ;
- possède des invariants propres ;
- structure le modèle.

### Capacité optionnelle

Choisir cette classification si l’élément :

- enrichit le système ;
- peut être activé ou absent ;
- reste borné ;
- ne redéfinit pas la source de vérité centrale.

### Système externe / satellite

Choisir cette classification si l’élément :

- est tiers ;
- apporte un service externe ;
- impose un contrat externe ;
- doit être encapsulé.

### Préoccupation transverse

Choisir cette classification si l’élément :

- traverse plusieurs blocs ;
- représente une exigence systémique ;
- nécessite une gouvernance globale ;
- ne se localise pas proprement dans un seul domaine.

---

## Cas de requalification obligatoire

Un élément doit être requalifié si :

- sa classification actuelle masque sa criticité réelle ;
- il est documenté comme option alors qu’il est structurellement indispensable ;
- il est traité comme domaine alors qu’il s’agit d’un fournisseur ;
- il agit partout sans être reconnu comme transverse.

---

## Règle finale

En cas d’hésitation, la décision doit être justifiée par :

- la source de vérité ;
- la responsabilité principale ;
- le degré d’indispensabilité ;
- la dépendance ou non à un système externe ;
- l’étendue de son impact transversal.

La classification doit être défendable, pas seulement pratique.
