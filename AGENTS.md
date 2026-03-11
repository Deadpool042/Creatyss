# Creatyss

## Mission

Construire et faire évoluer la boutique e-commerce custom Creatyss, local-first via Docker, maintenable, lisible, strictement typée, et déployable ensuite sur un VPS OVH.

## Stack

- Next.js App Router
- TypeScript strict
- PostgreSQL
- Docker Compose
- Makefile

## Principes de travail

- Toujours choisir la solution la plus simple compatible avec l’évolution future.
- Toujours privilégier la lisibilité, la maintenabilité et la clarté du domaine métier.
- Toujours travailler par petits incréments sûrs.
- Toujours rester dans le périmètre demandé, sans ajouter de fonctionnalités non demandées.
- Préserver le comportement existant hors périmètre.
- Donner une seule solution principale, concrète et orientée implémentation.

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
- `docs/` : documentation projet par version et par lot

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
- Toute modification de schéma doit passer par une migration SQL explicite.
- Ne jamais modifier silencieusement le schéma existant sans migration.
- Ne jamais supprimer table, colonne, contrainte ou index sans demande explicite.
- Préserver la compatibilité avec l’existant tant qu’une refonte complète n’est pas demandée.

## Dépendances

- Préférer les solutions natives Next.js, TypeScript, Node.js et PostgreSQL quand elles suffisent.
- Avant d’ajouter une librairie, vérifier qu’une solution simple native ou déjà présente dans le projet ne suffit pas.
- Toute nouvelle dépendance doit être justifiée explicitement.

## Local first

- Le projet doit fonctionner localement via Docker.
- La commande d’entrée principale est `make up`.
- Le setup local minimal inclut `app` et `db`.
- Tout ce qui est nécessaire au lancement local doit être dockerisé.

## Versioning et source de vérité

- Le projet évolue par versions et lots documentés dans `docs/`.
- Les documents de travail sont organisés par version, par exemple `docs/v6/*.md`.
- Pour toute demande liée à un lot, toujours prendre comme source de vérité le document de lot explicitement visé.
- Ne pas extrapoler au-delà du lot demandé.
- Ne pas implémenter une étape suivante non explicitement demandée.
- En cas de tension entre une ancienne implémentation et le lot courant, appliquer le lot courant tout en préservant la compatibilité demandée.

## Sécurité et robustesse

- Ne jamais faire confiance aux entrées utilisateur.
- Toujours valider côté serveur.
- Ne jamais exposer de secrets côté client.
- Gérer explicitement les erreurs métier, base de données, authentification et upload.
- Afficher des messages d’erreur utiles côté admin.
- Ne jamais masquer silencieusement une erreur importante.

## Discipline de modification

- Ne modifier que les fichiers nécessaires au lot demandé.
- Ne pas profiter d’un lot pour refactorer des zones non demandées.
- Ne pas renommer massivement des fichiers, types ou fonctions sans demande explicite.
- Préserver le comportement existant hors périmètre.
- Commencer par l’implémentation la plus simple et robuste pour le lot demandé.
- Si un document de lot impose un plan d’implémentation, le suivre strictement.

## Format de réponse attendu

Quand tu proposes une modification :

1. résume brièvement ce que tu vas modifier
2. liste les fichiers créés ou modifiés
3. fournis le code complet ou les patchs nécessaires
4. indique les variables d’environnement nécessaires
5. indique la commande de test
6. indique la vérification manuelle attendue
7. précise ce qui reste volontairement hors périmètre

## Style de livraison

- Code complet quand nécessaire.
- TypeScript strict.
- Petits fichiers lisibles.
- Noms explicites.
- Pas d’abstraction prématurée.
- Pas de fonctionnalité hors périmètre demandé.

## Planification

- Pour tout lot non trivial, commencer par proposer un plan avant toute modification de code.
- Si la demande vise un document de lot `docs/vX/*.md`, lire ce document en entier puis produire un plan d’implémentation strict.
- Tant que le plan n’est pas validé, ne modifier aucun fichier.
- Le plan doit lister :
  - les fichiers à créer ou modifier
  - l’ordre d’exécution
  - les impacts de compatibilité
  - les vérifications à exécuter
- Pour les lots importants, le plan peut être matérialisé dans un document dédié sous `docs/vX/plans/`.
