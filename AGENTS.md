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
- Pour toute demande liée à un lot, toujours prendre comme source de vérité le ou les documents explicitement visés dans `docs/vX/`.
- Pour la terminologie métier, les termes UI autorisés ou interdits, et la hiérarchie documentaire actuelle, s’aligner sur `docs/v6/glossary.md`.
- Pour le langage visible et l’UX admin produit, `docs/v6/admin-language-and-ux.md` complète `AGENTS.md` et prime sur les formulations plus anciennes.
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

## Lisibilité métier et UX admin

- Le modèle visible dans l’admin doit rester simple, métier et compréhensible par une utilisatrice non technique.
- Pour tout lot de vocabulaire, wording UI, terminologie ou documentation métier, utiliser les termes officiels de `docs/v6/glossary.md` et `docs/v6/admin-language-and-ux.md`.
- L’admin doit parler en termes de :
  - produit simple
  - produit avec déclinaisons
  - informations de vente
  - déclinaisons
  - prix
  - prix barré
  - stock
  - référence
  - publication
  - Ne jamais exposer comme chemin principal dans l’UI des notions internes telles que :
  - produit parent
  - produit vendable
  - variante technique
  - compatibilité legacy
  - fallback
  - `compareAtPrice`
  - `simpleOffer`
  - Le code doit privilégier des noms orientés métier, des responsabilités claires et des fichiers lisibles.
  - Toute compatibilité transitoire ou legacy doit rester isolée et ne pas structurer l’expérience admin principale.

## Style de livraison

- Code complet quand nécessaire.
- TypeScript strict.
- Petits fichiers lisibles.
- Noms explicites.
- Pas d’abstraction prématurée.
- Pas de fonctionnalité hors périmètre demandé.
- Privilégier des noms et structures compréhensibles par intention métier avant toute sophistication technique.

## Planification

- Pour tout lot non trivial, commencer par proposer un plan avant toute modification de code.
- Si la demande vise un document de lot `docs/vX/*.md`, lire ce document en entier puis produire un plan d’implémentation strict.
- Tant que le plan n’est pas validé, ne modifier aucun fichier.
- Le plan doit être structuré dans cet ordre :
  1. objectif
  2. périmètre
  3. hors périmètre
  4. fichiers à créer ou modifier
  5. ordre d’exécution
  6. impacts de compatibilité
  7. vérifications
- Pour les lots importants, le plan peut être matérialisé dans un document dédié sous `docs/vX/plans/`.

## Vérifications

- Pour chaque lot, exécuter les vérifications les plus pertinentes pour le périmètre modifié.
- Inclure au minimum `typecheck`, puis des tests unitaires et e2e ciblés si le lot le justifie.
- Si un lot touche l’UI, privilégier une vérification automatisée des écrans ou parcours impactés avant de laisser une vérification manuelle.
- Ne proposer une vérification manuelle navigateur que lorsqu’aucune vérification automatisée utile n’existe.
- Toujours indiquer clairement les commandes lancées, les vérifications passées et les limites restantes.
