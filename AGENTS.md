# Creatyss

## Mission

Construire une boutique e-commerce custom pour Creatyss, local-first via Docker, maintenable, lisible, strictement typée, et déployable ensuite sur un VPS OVH.

## Stack

- Next.js App Router
- TypeScript strict
- PostgreSQL
- Docker Compose
- Makefile

## Priorités

- Toujours choisir la solution la plus simple compatible avec l’évolution future.
- Toujours privilégier la lisibilité, la maintenabilité et la clarté du domaine métier.
- Toujours travailler par petits incréments sûrs.
- Toujours rester dans le périmètre demandé, sans ajouter de fonctionnalités non demandées.

## Interdits

- Ne jamais proposer WordPress, WooCommerce, Shopify, Supabase ou Vercel.
- Ne jamais ajouter de dépendance inutile.
- Ne jamais introduire Redis, queue, microservices, websocket, IA ou analytics avancés sans demande explicite.
- Ne jamais sur-architecturer.
- Ne jamais utiliser `any` sauf justification explicite et exceptionnelle.
- Ne jamais mélanger logique métier et composants de présentation.

## Structure attendue

- `app/` : routes, layouts, pages, handlers Next.js
- `features/` : cas d’usage et verticales fonctionnelles
- `entities/` ou `domain/` : types, règles métier, validations métier
- `db/` : migrations, seeds, repositories, accès PostgreSQL
- `components/` : composants UI réutilisables
- `lib/` : helpers techniques transverses
- `public/` : assets publics et uploads locaux
- `scripts/` : scripts techniques
- `docs/` : documentation projet

## Règles Next.js

- Server Components par défaut.
- Client Components seulement si nécessaire.
- Server Actions seulement quand elles simplifient vraiment le flux.
- Pas de logique métier directement dans les composants UI.
- Préférer des routes simples.
- Ne pas introduire de parallel routes sans besoin concret.

## Séparation des responsabilités

- UI : affichage et composition d’interface uniquement.
- Validation : validation explicite des entrées côté serveur.
- Métier : règles métier pures et explicites.
- Données : accès base isolé dans une couche dédiée.

## Base de données

- Clés primaires explicites.
- Timestamps systématiques.
- Slugs uniques quand nécessaire.
- Relations propres.
- Index utiles sans excès.
- Noms de tables et colonnes cohérents et stables.

## Local first

- Le projet doit fonctionner localement via Docker.
- La commande d’entrée principale est `make up`.
- Le setup local minimal inclut `app` et `db`.
- Tout ce qui est nécessaire au lancement local doit être dockerisé.

## Périmètre V1

- catalogue produits
- variantes couleur
- changement d’image selon variante
- catégories
- blog
- homepage éditable
- admin simple
- uploads locaux
- SEO de base
- authentification admin simple et sécurisée

## Hors périmètre V1

- paiement avancé
- coupons complexes
- promos avancées
- moteur de recommandation sophistiqué
- mailing list avancée
- multi-langue
- espace client complet
- IA
- analytics avancés

## Sécurité et robustesse

- Ne jamais faire confiance aux entrées utilisateur.
- Toujours valider côté serveur.
- Ne jamais exposer de secrets côté client.
- Gérer explicitement les erreurs métier, base de données, authentification et upload.
- Afficher des messages d’erreur utiles côté admin.
- Ne jamais masquer silencieusement une erreur importante.

## Règles de travail

Quand tu proposes une modification :

- donne une seule solution principale
- reste concret et orienté implémentation
- évite les longues explications théoriques
- indique les fichiers créés ou modifiés
- indique les variables d’environnement nécessaires
- indique la commande de test
- indique la vérification manuelle attendue

## Style de livraison

- Code complet quand nécessaire.
- TypeScript strict.
- Petits fichiers lisibles.
- Noms explicites.
- Pas d’abstraction prématurée.
- Pas de fonctionnalité hors périmètre demandé.
