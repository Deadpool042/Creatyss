---
name: lot-implementation
description: Implémenter un lot Creatyss documenté en respectant strictement le périmètre demandé, la doctrine courante du repo, la compatibilité attendue et la structure du projet.
---

# Quand utiliser ce skill

Utiliser ce skill quand la tâche demande d’implémenter un lot clairement défini, une évolution ciblée ou une fonctionnalité bornée dans le repo.

Exemples :

- implémentation d’une verticale admin
- ajout ciblé dans un domaine coeur ou optionnel
- extraction locale de helpers, types ou queries dans un périmètre cadré
- adaptation d’un flux serveur, UI ou base de données après cadrage

## Source de vérité

Lire par défaut, dans cet ordre :

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
Elles ne servent que de contexte ciblé si une demande les vise explicitement.

## Règles d’implémentation

- Commencer par lire le périmètre ciblé en entier.
- Identifier les impacts minimaux nécessaires.
- Ne modifier que les fichiers strictement nécessaires.
- Préserver le comportement existant hors périmètre.
- Ne pas profiter du lot pour refactorer des zones non demandées.
- Ne pas renommer massivement fichiers, types ou fonctions sans demande explicite.
- Choisir l’implémentation la plus simple, lisible et robuste compatible avec l’évolution future.
- Toujours auditer d’abord, éditer ensuite.
- Toujours vérifier la cohérence avec la doctrine courante avant de modifier le code.

## Doctrine projet à respecter

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
- `inventory` est une spécialisation satellitaire d’`availability`

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
- Ne jamais traiter une capability optionnelle comme si elle appartenait d’office au coeur.

## Structure de code attendue

Respecter autant que possible la structure existante :

- `app/` : routes, layouts, pages, handlers Next.js
- `features/` : cas d’usage et verticales fonctionnelles
- `entities/` ou `domain/` : types, règles métier, validations métier
- `db/` : migrations, seeds, repositories, accès PostgreSQL
- `components/` : composants UI
- `lib/` : helpers techniques
- `public/` : assets et uploads locaux
- `scripts/` : scripts techniques
- `docs/architecture/` : doctrine du socle
- `docs/domains/` : documentation des domaines
- `docs/testing/` : stratégie et docs de test

## Discipline de modification

- Toujours rester dans le périmètre demandé.
- Toujours privilégier de petits incréments sûrs.
- Toujours préserver les contrats publics, chemins d’import publics et signatures runtime sauf demande explicite.
- Ne pas introduire de redesign public quand une extraction interne locale suffit.
- Si une opération touche la cohérence métier ou transactionnelle, vérifier `docs/architecture/07-transactions-and-consistency.md`.
- Si une modification touche la doctrine, vérifier la cohérence entre `README.md`, `AGENTS.md`, `docs/architecture/` et `docs/domains/`.

## Format de réponse attendu

Quand tu livres une implémentation :

1. résume brièvement ce que tu modifies
2. liste les fichiers créés ou modifiés
3. fournis le code complet ou les patchs nécessaires
4. indique les variables d’environnement nécessaires
5. indique les commandes de vérification
6. indique la vérification manuelle attendue
7. précise ce qui reste volontairement hors périmètre
