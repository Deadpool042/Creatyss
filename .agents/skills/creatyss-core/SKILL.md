---
name: creatyss-core
description: Garde-fous absolus, posture d’exécution et priorités non négociables du projet Creatyss.
---

Tu travailles sur le projet Creatyss.

`AGENTS.md` est la doctrine canonique du dépôt.
Ce skill n’a pas vocation à la recopier intégralement.
Il rappelle uniquement les contraintes absolues et la posture d’exécution à respecter en permanence.

## Priorité absolue

Sur Creatyss, tu ne dois jamais répondre comme sur un projet générique.

Tu dois toujours :

- partir du dépôt réel ;
- appliquer la doctrine existante ;
- rester strictement dans le périmètre demandé ;
- privilégier la solution la plus simple, robuste et maintenable ;
- éviter toute dérive structurelle non demandée.

## Hiérarchie de décision

Quand une source projet existe, elle prime sur une préférence générique.

Ordre de priorité :

1. la documentation structurante du dépôt ;
2. les décisions validées dans le dépôt ;
3. les conventions déjà présentes dans le code local concerné ;
4. les choix par défaut les plus simples et les plus robustes s’il n’existe pas de source explicite.

Ne jamais remplacer une contrainte projet par une habitude framework ou un pattern théorique.

## Contraintes non négociables

- Next.js App Router
- TypeScript strict
- PostgreSQL
- Docker / Docker Compose en local
- futur déploiement sur VPS OVH

## Interdictions absolues

Ne jamais :

- proposer WordPress, WooCommerce, Shopify, Supabase ou Vercel ;
- sur-architecturer ;
- introduire une dépendance inutile ;
- mélanger logique métier et composants de présentation ;
- exposer un secret côté client ;
- faire confiance aux entrées utilisateur ;
- réintroduire une architecture legacy sans validation explicite ;
- inventer une fonctionnalité non demandée ;
- modifier silencieusement un contrat public ou une sémantique métier.

## Exigences permanentes

Toujours :

- produire un code lisible, explicite et stable ;
- respecter TypeScript strict ;
- éviter `any` sauf justification explicite ;
- séparer clairement domaine, accès aux données, logique serveur et UI ;
- privilégier de petits incréments sûrs ;
- limiter les changements au strict nécessaire ;
- préserver la cohérence structurelle du repo ;
- signaler explicitement toute contradiction détectée entre doc, code et demande.

## Cadre fonctionnel V1

Le projet doit au minimum couvrir une base e-commerce artisanale simple et propre :

- catalogue ;
- produits ;
- variantes ;
- images ;
- catégories ;
- blog ;
- homepage éditable ;
- produits, catégories et articles mis en avant ;
- admin simple ;
- SEO de base.

Ne pas ajouter sans demande explicite :

- promotions complexes ;
- moteur de recommandation sophistiqué ;
- analytics complexes ;
- multi-devise ;
- multi-langue ;
- microservices ;
- Redis ;
- websocket ;
- architecture événementielle inutile ;
- auth client complète si seul l’admin est requis.

## Posture de travail

Tu dois te comporter comme un implémenteur discipliné du dépôt.

Tu dois :

- lire avant de conclure ;
- vérifier avant de restructurer ;
- respecter avant d’optimiser ;
- minimiser le churn ;
- éviter les abstractions prématurées ;
- distinguer clairement faits du dépôt et hypothèses ajoutées.

En cas d’incertitude résiduelle, choisir l’option la plus simple et la plus robuste pour une V1 locale dockerisée.
