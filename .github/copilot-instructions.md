# Creatyss - Instructions projet

## Contexte

Projet e-commerce custom pour Creatyss, marque de sacs artisanaux.

## Stack

- Next.js App Router (v16+)
- TypeScript strict
- PostgreSQL
- Docker Compose en local
- Makefile comme point d’entrée des commandes
- futur déploiement sur VPS OVH

## Interdits

- Ne jamais proposer WordPress, WooCommerce, Shopify, Supabase ou Vercel.
- Ne jamais ajouter de dépendance inutile.
- Ne jamais introduire Redis, microservices, queue, websocket, IA ou analytics avancés sans demande explicite.
- Ne jamais utiliser `any` sauf justification explicite et exceptionnelle.
- Ne jamais sur-architecturer.

## Priorités

- Solution la plus simple compatible avec l’évolution future.
- Local first via Docker.
- Code lisible, modulaire, maintenable.
- Séparation stricte entre UI, logique métier, accès aux données et validation.
- Mobile first.
- Interface sobre, rapide, claire et orientée conversion.

## Structure attendue

- `app/` pour les routes et layouts
- `features/` pour les cas d’usage par domaine
- `domain/` ou `entities/` pour les types et règles métier
- `db/` pour schéma, accès base et migrations
- `components/` pour composants UI réutilisables
- `lib/` pour helpers techniques transverses
- `public/` pour assets publics et uploads servis simplement en V1
- `scripts/` pour scripts techniques utiles
- `docs/` pour la documentation projet

## Règles Next.js et routing

- Server Components par défaut
- Client Components seulement si nécessaire
- Server Actions seulement quand elles simplifient vraiment le flux
- Pas de logique métier directement dans les composants UI
- Utiliser les layouts imbriqués pour limiter les rechargements inutiles
- Utiliser les parallel routes (`@slot`) seulement quand elles apportent un bénéfice clair de structure ou d’UX
- Réserver les parallel routes surtout pour l’admin, les vues composées, les modales ou des zones indépendantes
- Ne jamais introduire de parallel routes par défaut
- Préférer une route simple tant qu’un besoin concret ne justifie pas plus

## Règles UI

- Utiliser `shadcn/ui` comme base UI si une bibliothèque UI est nécessaire
- Ne pas surcharger l’interface avec des composants inutiles
- Toujours privilégier lisibilité, accessibilité et clarté des formulaires
- L’admin doit être simple pour une utilisatrice non technique

## Règles base de données

- Clés primaires explicites
- Timestamps systématiques
- Slugs uniques quand nécessaire
- Relations propres
- Noms de tables et colonnes cohérents et stables
- Index utiles sans excès

## Gestion des erreurs

- Prévoir la gestion des erreurs dès le début
- Valider toutes les entrées côté serveur
- Gérer explicitement les erreurs métier, base de données, authentification et upload
- Utiliser `error.tsx`, `not-found.tsx` et des retours d’erreur typés quand pertinent
- Afficher des messages d’erreur utiles côté admin
- Ne jamais masquer silencieusement une erreur importante

## V1 uniquement

- catalogue produits
- variantes couleur
- changement d’image selon variante
- catégories
- blog
- homepage éditable
- admin simple
- uploads locaux
- SEO de base
- auth admin simple et sécurisée

## Hors périmètre V1

- paiement avancé
- coupons complexes
- promos avancées
- réductions ciblées
- moteur de recommandation sophistiqué
- mailing list avancée
- automatisations marketing avancées
- publication automatique vers les réseaux sociaux
- IA
- analytics avancés
- multi-langue
- espace client complet

## Local first

- Le projet doit fonctionner localement via Docker
- La commande d’entrée principale doit être `make up`
- Le setup local doit inclure au minimum un service `app` et un service `db`

## Quand tu proposes une modification

Toujours donner :

- les fichiers créés/modifiés
- les variables d’environnement nécessaires
- la commande de test
- la vérification manuelle attendue

## Format des réponses

- Répondre de manière concise et orientée implémentation
- Éviter les longues explications théoriques
- Proposer une seule solution principale
- Préférer de petits incréments sûrs

# Creatyss - Copilot Instructions

## Positionnement

Creatyss est un socle e-commerce custom, conçu pour être :

- local-first via Docker Compose
- maintenable, lisible et modulaire
- strictement typé
- déployable ensuite sur un VPS OVH
- réutilisable pour d'autres projets e-commerce au-delà du seul cas Creatyss

Ce repo n'est pas piloté par une logique de phases `V*` comme source de vérité courante.
La doctrine actuelle part d'abord de l'architecture du socle puis de la cartographie des domaines.

## Source de vérité courante

Toujours partir de :

1. `README.md`
2. `AGENTS.md`
3. `docs/architecture/00-socle-overview.md`
4. `docs/architecture/01-architecture-principles.md`
5. `docs/architecture/02-client-needs-capabilities-and-levels.md`
6. `docs/architecture/03-core-domains-and-toggleable-capabilities.md`
7. `docs/architecture/04-solution-profiles-and-project-assembly.md`
8. `docs/architecture/05-maintenance-and-operating-levels.md`
9. `docs/architecture/06-socle-guarantees.md`
10. `docs/architecture/07-transactions-and-consistency.md`
11. `docs/architecture/08-domain-events-jobs-and-async-flows.md`
12. `docs/architecture/09-integrations-providers-and-external-boundaries.md`
13. `docs/architecture/10-data-lifecycle-and-governance.md`
14. `docs/architecture/11-pricing-and-cost-model.md`
15. `docs/domains/README.md`

Ensuite seulement, lire la documentation ciblée par la demande :

- fiche de domaine dans `docs/domains/`
- documentation de test dans `docs/testing/`
- documentation de lot explicitement visée

Les anciennes docs `docs/v*` ne sont plus la source de vérité par défaut.

## Stack

- Next.js App Router
- TypeScript strict
- PostgreSQL
- Docker Compose en local
- Makefile comme point d'entrée des commandes
- déploiement futur sur VPS OVH

## Doctrine du repo

Le repo est structuré autour de :

- domaines coeur
- domaines optionnels
- capabilities toggleables
- niveaux de sophistication
- niveaux de maintenance / exploitation
- garanties de socle
- cohérence transactionnelle
- gouvernance de cycle de vie des données

La hiérarchie documentaire des domaines est :

- `core/`
- `optional/`
- `satellites/`
- `cross-cutting/`

Ne jamais confondre :

- rang documentaire
- criticité architecturale

Points canoniques à préserver :

- `stores` est le nom canonique du domaine de boutique / composition projet
- `availability` est le domaine canonique de disponibilité
- `inventory` est une spécialisation satellitaire d'`availability`

## Interdits

- Ne jamais proposer WordPress, WooCommerce, Shopify, Supabase ou Vercel.
- Ne jamais ajouter de dépendance inutile.
- Ne jamais introduire Redis, microservices, queue, websocket, IA ou analytics avancés sans demande explicite.
- Ne jamais utiliser `any` sauf justification explicite et exceptionnelle.
- Ne jamais sur-architecturer.
- Ne jamais traiter une capability optionnelle comme si elle appartenait d'office au coeur.
- Ne jamais faire dériver la doctrine courante à partir d'un ancien document isolé sans validation explicite.

## Priorités

- Solution la plus simple compatible avec l'évolution future.
- Local first via Docker.
- Code lisible, modulaire, maintenable.
- Séparation stricte entre UI, logique métier, accès aux données et validation.
- Sobriété de l'interface.
- Expérience claire pour une utilisatrice admin non technique.

## Structure attendue

- `app/` pour les routes, layouts, pages et handlers Next.js
- `features/` pour les cas d'usage et verticales fonctionnelles
- `domain/` ou `entities/` pour les types, règles métier et validations métier
- `db/` pour schéma, migrations, seeds et accès base
- `components/` pour composants UI réutilisables
- `lib/` pour helpers techniques transverses
- `public/` pour assets publics et uploads locaux
- `scripts/` pour scripts techniques utiles
- `docs/architecture/` pour la doctrine du socle
- `docs/domains/` pour la cartographie et les fiches de domaines
- `docs/testing/` pour la stratégie et les docs de test

## Règles Next.js et routing

- Server Components par défaut.
- Client Components seulement si nécessaire.
- Server Actions seulement quand elles simplifient vraiment le flux.
- Pas de logique métier directement dans les composants UI.
- Utiliser les layouts imbriqués seulement quand ils servent réellement la structure.
- Utiliser les parallel routes (`@slot`) seulement quand elles apportent un bénéfice clair de structure ou d'UX.
- Réserver les parallel routes surtout à des cas admin, modales, vues composées ou zones réellement indépendantes.
- Ne jamais introduire de parallel routes par défaut.
- Préférer une route simple tant qu'un besoin concret ne justifie pas plus.

## Règles UI

- Utiliser `shadcn/ui` comme base UI si une bibliothèque UI est nécessaire.
- Ne pas surcharger l'interface avec des composants inutiles.
- Toujours privilégier lisibilité, accessibilité et clarté des formulaires.
- L'admin doit rester simple pour une utilisatrice non technique.
- Ne jamais mélanger logique métier et composants de présentation.

## Règles base de données

- Clés primaires explicites.
- Timestamps systématiques.
- Slugs uniques quand nécessaire.
- Relations propres.
- Noms de tables et colonnes cohérents et stables.
- Index utiles sans excès.
- Toute modification de schéma doit passer par une migration explicite.
- Ne jamais supprimer silencieusement table, colonne, contrainte ou index sans demande explicite.

## Gestion des erreurs et robustesse

- Prévoir la gestion des erreurs dès le début.
- Valider toutes les entrées côté serveur.
- Gérer explicitement les erreurs métier, base de données, authentification et upload.
- Utiliser `error.tsx`, `not-found.tsx` et des retours d'erreur typés quand pertinent.
- Afficher des messages d'erreur utiles côté admin.
- Ne jamais masquer silencieusement une erreur importante.
- Quand une opération touche la cohérence, vérifier `docs/architecture/07-transactions-and-consistency.md`.

## Portée

Toujours raisonner en socle modulaire.
Ne pas réduire systématiquement le repo à une ancienne V1 figée.
Le périmètre exact dépend de la demande, de la doctrine architecture et du domaine concerné.

## Local first

- Le projet doit fonctionner localement via Docker.
- La commande d'entrée principale doit être `make up`.
- Le setup local doit inclure au minimum un service `app` et un service `db`.
- Tout ce qui est nécessaire au lancement local doit être dockerisé.

## Quand tu proposes une modification

Toujours donner :

- les fichiers créés ou modifiés
- les variables d'environnement nécessaires
- la commande de test
- la vérification manuelle attendue
- ce qui reste explicitement hors périmètre si c'est utile

## Format des réponses

- Répondre de manière concise et orientée implémentation.
- Éviter les longues explications théoriques.
- Proposer une seule solution principale.
- Préférer de petits incréments sûrs.
- Toujours privilégier la cohérence avec `README.md`, `AGENTS.md`, `docs/architecture/` et `docs/domains/`.
