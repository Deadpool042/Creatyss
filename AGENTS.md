# Creatyss

## Mission

Construire et faire évoluer le socle e-commerce custom Creatyss.

Le projet est conçu pour être :

- **local-first** via Docker Compose
- maintenable, lisible et modulaire
- strictement typé
- déployable ensuite sur un VPS OVH
- réutilisable pour d'autres projets e-commerce au-delà du seul cas Creatyss

## Source de vérité documentaire

La source de vérité courante du repo est désormais organisée autour de :

1. `README.md`
2. `docs/architecture/00-socle-overview.md`
3. `docs/architecture/01-architecture-principles.md`
4. `docs/architecture/02-client-needs-capabilities-and-levels.md`
5. `docs/architecture/03-core-domains-and-toggleable-capabilities.md`
6. `docs/architecture/04-solution-profiles-and-project-assembly.md`
7. `docs/architecture/05-maintenance-and-operating-levels.md`
8. `docs/architecture/06-socle-guarantees.md`
9. `docs/architecture/07-transactions-and-consistency.md`
10. `docs/architecture/08-domain-events-jobs-and-async-flows.md`
11. `docs/architecture/09-integrations-providers-and-external-boundaries.md`
12. `docs/architecture/10-data-lifecycle-and-governance.md`
13. `docs/architecture/11-pricing-and-cost-model.md`
14. `docs/domains/README.md`

Quand une demande vise explicitement une doc de lot, une doc de test ou une fiche de domaine précise, il faut bien sûr la lire et l'appliquer.
Mais par défaut, la doctrine courante du repo part d'abord de `docs/architecture/` puis de `docs/domains/`.

## Lecture recommandée avant d'agir

Pour toute tâche non triviale :

1. lire `README.md`
2. lire `AGENTS.md`
3. lire `docs/architecture/00` à `11`
4. lire `docs/domains/README.md`
5. lire ensuite seulement la documentation ciblée par la demande : lot, tests, domaine précis, etc.

## Stack

- Next.js App Router
- TypeScript strict
- PostgreSQL
- Docker Compose
- Makefile

## Positionnement du socle

Le repo n'est pas un simple projet applicatif figé.
Il sert de base e-commerce custom structurée par :

- domaines coeur
- domaines optionnels
- capabilities toggleables
- niveaux de sophistication
- niveaux de maintenance / exploitation
- garanties de socle
- cohérence transactionnelle
- gouvernance de cycle de vie des données

La logique documentaire doit rester cohérente avec cette doctrine.

## Principes de travail

- Toujours choisir la solution la plus simple compatible avec l'évolution future.
- Toujours privilégier la lisibilité, la maintenabilité et la clarté du domaine métier.
- Toujours travailler par petits incréments sûrs.
- Toujours rester dans le périmètre demandé, sans ajouter de fonctionnalités non demandées.
- Préserver le comportement existant hors périmètre.
- Donner une seule solution principale, concrète et orientée implémentation.
- Toujours raisonner d'abord en séparation claire entre doctrine, domaine, données, logique serveur et UI.

## Interdits

- Ne jamais proposer WordPress, WooCommerce, Shopify, Supabase ou Vercel.
- Ne jamais ajouter de dépendance inutile.
- Ne jamais introduire Redis, queue, microservices, websocket, IA ou analytics avancés sans demande explicite.
- Ne jamais sur-architecturer.
- Ne jamais utiliser `any` sauf justification explicite et exceptionnelle.
- Ne jamais mélanger logique métier et composants de présentation.
- Ne jamais traiter une capability optionnelle comme si elle appartenait d'office au coeur.
- Ne jamais faire dériver la doctrine du repo à partir d'un ancien document isolé sans validation explicite.

## Structure attendue

- `app/` : routes, layouts, pages, handlers Next.js
- `features/` : cas d'usage et verticales fonctionnelles
- `entities/` ou `domain/` : types, règles métier, validations métier
- `db/` : migrations, seeds, repositories, accès PostgreSQL
- `components/` : composants UI réutilisables
- `lib/` : helpers techniques transverses
- `public/` : assets publics et uploads locaux
- `scripts/` : scripts techniques
- `docs/architecture/` : doctrine du socle
- `docs/domains/` : cartographie et fiches de domaines
- `docs/testing/` : stratégie et docs de test

## Règles Next.js

- Server Components par défaut.
- Client Components seulement si nécessaire.
- Server Actions seulement quand elles simplifient vraiment le flux.
- Pas de logique métier directement dans les composants UI.
- Préférer des routes simples.
- Ne pas introduire de parallel routes sans besoin concret.

## Séparation des responsabilités

- UI : affichage et composition d'interface uniquement.
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
- Préserver la compatibilité avec l'existant tant qu'une refonte complète n'est pas demandée.

## Dépendances

- Préférer les solutions natives Next.js, TypeScript, Node.js et PostgreSQL quand elles suffisent.
- Avant d'ajouter une librairie, vérifier qu'une solution simple native ou déjà présente dans le projet ne suffit pas.
- Toute nouvelle dépendance doit être justifiée explicitement.

## Local first

- Le projet doit fonctionner localement via Docker.
- La commande d'entrée principale est `make up`.
- Le setup local minimal inclut `app` et `db`.
- Tout ce qui est nécessaire au lancement local doit être dockerisé.

## Doctrine domaines / capabilities

- Toujours distinguer domaine coeur, domaine optionnel, satellite documentaire et concern transverse.
- Toujours vérifier le rang documentaire dans `docs/domains/README.md` avant de créer ou déplacer une doc de domaine.
- Toujours vérifier la criticité architecturale dans `docs/architecture/03-core-domains-and-toggleable-capabilities.md`.
- Ne pas confondre rang documentaire et criticité architecturale.
- `availability` est le domaine canonique de disponibilité ; `inventory` est une spécialisation satellitaire centrée sur le quantitatif.
- `stores` est le nom canonique du domaine de boutique / composition projet.

## Sécurité et robustesse

- Ne jamais faire confiance aux entrées utilisateur.
- Toujours valider côté serveur.
- Ne jamais exposer de secrets côté client.
- Gérer explicitement les erreurs métier, base de données, authentification et upload.
- Afficher des messages d'erreur utiles côté admin.
- Ne jamais masquer silencieusement une erreur importante.
- Quand une opération a une portée transactionnelle ou de cohérence, vérifier la doctrine dans `docs/architecture/07-transactions-and-consistency.md`.

## Discipline de modification

- Ne modifier que les fichiers nécessaires au lot demandé.
- Ne pas profiter d'un lot pour refactorer des zones non demandées.
- Ne pas renommer massivement des fichiers, types ou fonctions sans demande explicite.
- Préserver le comportement existant hors périmètre.
- Commencer par l'implémentation la plus simple et robuste pour le lot demandé.
- Si un document de lot impose un plan d'implémentation, le suivre strictement.
- Si un travail touche la doctrine, vérifier la cohérence entre `README.md`, `docs/architecture/` et `docs/domains/`.

## Format de réponse attendu

Quand tu proposes une modification :

1. résumer brièvement ce que tu vas modifier
2. lister les fichiers créés ou modifiés
3. fournir le code complet ou les patchs nécessaires
4. indiquer les variables d'environnement nécessaires
5. indiquer la commande de test
6. indiquer la vérification manuelle attendue
7. préciser ce qui reste volontairement hors périmètre

## Lisibilité métier et UX admin

- Le modèle visible dans l'admin doit rester simple, métier et compréhensible par une utilisatrice non technique.
- Pour tout lot de vocabulaire, wording UI, terminologie ou documentation métier, utiliser les termes officiels en vigueur dans la doctrine courante du repo et les docs métier ciblées par la demande.
- L'admin doit parler en termes de :
  - produit simple
  - produit avec déclinaisons
  - informations de vente
  - déclinaisons
  - prix
  - prix barré
  - stock
  - référence
  - publication
- Ne jamais exposer comme chemin principal dans l'UI des notions internes telles que :
  - produit parent
  - produit vendable
  - variante technique
  - compatibilité legacy
  - fallback
  - `compareAtPrice`
  - `simpleOffer`
- Le code doit privilégier des noms orientés métier, des responsabilités claires et des fichiers lisibles.
- Toute compatibilité transitoire ou legacy doit rester isolée et ne pas structurer l'expérience admin principale.

## Style de livraison

- Code complet quand nécessaire.
- TypeScript strict.
- Petits fichiers lisibles.
- Noms explicites.
- Pas d'abstraction prématurée.
- Pas de fonctionnalité hors périmètre demandé.
- Privilégier des noms et structures compréhensibles par intention métier avant toute sophistication technique.

## Planification

- Pour tout lot non trivial, commencer par proposer un plan avant toute modification de code.
- Si la demande vise un document de lot, le lire en entier puis produire un plan d'implémentation strict.
- Tant que le plan n'est pas validé, ne modifier aucun fichier.
- Le plan doit être structuré dans cet ordre :
  1. objectif
  2. périmètre
  3. hors périmètre
  4. fichiers à créer ou modifier
  5. ordre d'exécution
  6. impacts de compatibilité
  7. vérifications

## Vérifications

- Pour chaque lot, exécuter les vérifications les plus pertinentes pour le périmètre modifié.
- Inclure au minimum `typecheck`, puis des tests unitaires et e2e ciblés si le lot le justifie.
- Si un lot touche l'UI, privilégier une vérification automatisée des écrans ou parcours impactés avant de laisser une vérification manuelle.
- Ne proposer une vérification manuelle navigateur que lorsqu'aucune vérification automatisée utile n'existe.
- Toujours indiquer clairement les commandes lancées, les vérifications passées et les limites restantes.
