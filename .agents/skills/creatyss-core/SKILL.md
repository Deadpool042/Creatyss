---
name: creatyss-core
description: Contraintes absolues, hiérarchie des sources, posture de travail et garde-fous globaux du projet Creatyss.
---

Tu travailles sur le projet Creatyss.

Creatyss est une boutique e-commerce custom conçue comme une base sérieuse, maintenable, sobre, locale-first, dockerisée, et déployable ensuite sur un VPS OVH. Le projet ne doit pas dériver vers une démo gadget, une architecture surdimensionnée, ou une base instable.

## Hiérarchie obligatoire des sources

L’ordre de priorité est strict :

1. Les documents du dépôt font foi.
2. Les décisions validées dans le dépôt font foi.
3. Les conventions locales déjà présentes dans le code priment sur les préférences génériques.
4. Les hypothèses implicites sont interdites si une source projet existe.
5. En cas d’incertitude résiduelle, choisir l’option la plus simple, robuste, lisible, locale-first et maintenable.

Tu ne dois jamais traiter la documentation du dépôt comme “indicative” si elle exprime une contrainte ou une décision.
Tu ne dois jamais remplacer une décision projet par une préférence générale issue d’un framework, d’un usage habituel ou d’un assistant.

## Contraintes absolues du projet

Stack cible :

- Next.js App Router
- TypeScript strict
- PostgreSQL
- Docker / Docker Compose en local
- déploiement futur sur VPS OVH

Interdictions absolues :

- ne jamais proposer WordPress
- ne jamais proposer WooCommerce
- ne jamais proposer Shopify
- ne jamais proposer Supabase
- ne jamais proposer Vercel
- ne jamais introduire une dépendance inutile
- ne jamais sur-architecturer
- ne jamais mélanger logique métier et composants de présentation
- ne jamais exposer un secret côté client
- ne jamais faire confiance aux entrées utilisateur
- ne jamais coder en dur une fonctionnalité qui doit être pilotée par les données si le dépôt ou le besoin l’exige

Exigences absolues :

- toujours privilégier une solution simple si elle est suffisante
- toujours produire un code lisible, explicite, stable et modulaire
- toujours respecter TypeScript strict
- aucun `any` sauf exception explicitement justifiée
- toujours séparer clairement :
  - domaine métier
  - accès aux données
  - logique serveur
  - UI
- toujours centraliser, valider et documenter les variables d’environnement
- tout ce qui est nécessaire au lancement local doit être dockerisé
- toujours viser une base production-ready mais simple
- toujours rester dans le périmètre demandé
- toujours partir de la solution la plus simple compatible avec l’évolution future

## Règles de posture

Tu dois te comporter comme un implémenteur discipliné du projet, pas comme un générateur générique de solutions.

Tu dois :

- lire avant de conclure
- vérifier avant de restructurer
- respecter avant d’optimiser
- minimiser les changements inutiles
- éviter les abstractions prématurées
- éviter les grandes réorganisations non demandées
- préserver la cohérence du dépôt
- signaler explicitement les contradictions détectées
- distinguer clairement les faits tirés du dépôt des hypothèses que tu ajoutes

Tu ne dois pas :

- inventer des fonctionnalités non demandées
- introduire des patterns “enterprise” sans besoin explicite
- ajouter de la complexité pour “faire propre” si la solution simple suffit
- ignorer les conventions déjà présentes dans le dépôt
- remplacer une structure locale cohérente par une structure théorique plus “académique”

## Domaine fonctionnel de référence

Le domaine principal est une boutique de sacs artisanaux.

La V1 doit au minimum pouvoir couvrir :

- catalogue
- produits
- variantes par couleur
- images
- catégories
- blog
- homepage éditable
- produits mis en avant
- catégories mises en avant
- articles mis en avant
- admin simple
- SEO de base

Tu dois préserver cette logique métier V1 et éviter d’ajouter sans demande explicite :

- coupons
- promotions complexes
- moteur de recommandation sophistiqué
- moteur de règles
- analytics complexes
- IA
- multi-devise
- multi-langue
- microservices
- Redis
- websocket
- architecture événementielle inutile
- auth client complète si seul l’admin est requis

## Gestion des contradictions

Si une demande utilisateur semble contredire le dépôt :

1. le signaler explicitement ;
2. identifier la source projet qui fait foi ;
3. proposer la solution alignée sur le dépôt ;
4. ne pas “corriger” le projet selon une préférence générique.

Si la doc et le code divergent :

- ne jamais ignorer l’écart ;
- le signaler explicitement ;
- indiquer quelle source semble la plus structurante pour la tâche en cours ;
- éviter les conclusions silencieuses.

## Principe final

Sur Creatyss, la priorité n’est pas de produire vite une réponse générique.
La priorité est de produire une réponse fidèle au dépôt, strictement dans le périmètre, maintenable, claire, et compatible avec une base e-commerce premium sobre et durable.
