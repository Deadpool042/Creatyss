# Systèmes externes et satellites

## Objectif

Ce document décrit la place des systèmes externes dans l’architecture.

Il répond à une question simple :
quels systèmes le produit utilise-t-il sans les confondre avec son coeur métier ?

---

## Définition

Un système externe ou satellite :

- vit hors du périmètre métier central ;
- fournit un service, une interface ou une ressource ;
- impose des contrats externes ;
- peut évoluer indépendamment du coeur.

---

## Règles d’architecture

Un satellite :

- doit être traité comme dépendance externe ;
- doit être isolé derrière des adaptateurs ;
- ne doit pas imposer son vocabulaire au coeur ;
- ne doit pas devenir la source conceptuelle du métier ;
- doit faire l’objet de règles d’échange explicites.

---

## Catégories usuelles

Selon le périmètre du projet, cette catégorie peut inclure :

- fournisseurs de paiement ;
- services d’email ;
- ERP ;
- transporteurs ;
- outils analytiques ;
- CMS externes ;
- places de marché ;
- outils d’identité ou de communication.

---

## Règle de documentation

Un satellite significatif doit être documenté avec :

- son rôle ;
- sa responsabilité ;
- la nature de l’échange ;
- les points d’entrée et de sortie ;
- le niveau de criticité ;
- la stratégie d’isolation.

---

## Frontière à préserver

Le coeur parle dans son langage métier.
Le satellite parle dans son langage externe.

La traduction entre les deux appartient aux adaptateurs et aux mécanismes d’intégration.

---

## Documents liés

- `../10-fondations/12-frontieres-et-responsabilites.md`
- `../30-execution/32-integrations-et-adaptateurs-fournisseurs.md`
