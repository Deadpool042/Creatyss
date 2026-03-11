---
name: lot-implementation
description: Implémenter un lot Creatyss documenté dans docs/vX/*.md en respectant strictement le périmètre, la compatibilité demandée et la structure du projet.
---

# Quand utiliser ce skill

Utiliser ce skill quand la tâche demande d’implémenter un lot décrit dans un document de type :

- `docs/v6/*.md`
- ou plus généralement `docs/vX/*.md`

Exemples :

- ajout d’un lot produit simple natif
- évolution d’un flux admin documenté
- adaptation ciblée du modèle, de la lecture ou de l’écriture selon un lot précis

## Source de vérité

- Le document de lot explicitement mentionné est la source de vérité.
- En cas de conflit entre le code existant et le lot demandé, appliquer le lot demandé en préservant la compatibilité explicitement requise.
- Ne jamais extrapoler à l’étape suivante.
- Ne jamais élargir le périmètre au-delà de ce que demande le lot.

## Règles d’implémentation

- Commencer par lire le document de lot ciblé en entier.
- Identifier les impacts minimaux nécessaires.
- Ne modifier que les fichiers strictement nécessaires.
- Préserver le comportement existant hors périmètre.
- Ne pas profiter du lot pour refactorer des zones non demandées.
- Ne pas renommer massivement fichiers, types ou fonctions sans demande explicite.
- Choisir l’implémentation la plus simple, lisible et robuste compatible avec l’évolution future.

## Contraintes projet à respecter

- Stack : Next.js App Router, TypeScript strict, PostgreSQL, Docker Compose, Makefile.
- Server Components par défaut.
- Client Components seulement si nécessaire.
- Pas de logique métier dans les composants UI.
- Séparer clairement UI, validation serveur, métier et accès aux données.
- Ne jamais utiliser `any` sauf justification explicite et exceptionnelle.
- Ne jamais ajouter de dépendance inutile.
- Ne jamais proposer WordPress, WooCommerce, Shopify, Supabase ou Vercel.
- Ne jamais sur-architecturer.

## Structure de code attendue

Respecter autant que possible la structure existante :

- `app/` : routes, layouts, pages, handlers Next.js
- `features/` : cas d’usage et verticales fonctionnelles
- `entities/` ou `domain/` : types et règles métier
- `db/` : migrations, seeds, repositories, accès PostgreSQL
- `components/` : composants UI
- `lib/` : helpers techniques
- `public/` : assets et uploads locaux
- `docs/` : documentation projet par version et lot

## Format de réponse attendu

Quand tu livres une implémentation :

1. résume brièvement ce que tu modifies
2. liste les fichiers créés ou modifiés
3. fournis le code complet ou les patchs nécessaires
4. indique les variables d’environnement nécessaires
5. indique les commandes de vérification
6. indique la vérification manuelle attendue
7. précise ce qui reste volontairement hors périmètre
