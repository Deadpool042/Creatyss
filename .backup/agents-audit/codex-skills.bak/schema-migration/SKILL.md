---
name: schema-migration
description: Faire évoluer le schéma PostgreSQL de Creatyss via une migration explicite, sobre, compatible avec l’existant et alignée sur la doctrine actuelle du repo ainsi que sur le lot demandé.
---

# Quand utiliser ce skill

Utiliser ce skill quand une tâche implique :

- ajout ou modification de colonnes
- ajout ou modification de contraintes
- ajout ou modification d’index
- ajout ou modification de tables
- compatibilité transitoire entre ancien et nouveau modèle
- adaptation des types TypeScript ou des repositories après évolution SQL

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

Ensuite seulement, lire :

- la fiche de domaine concernée
- la documentation de lot explicitement visée
- la documentation de test si le lot la touche

Les anciennes docs `docs/v*` ne sont plus la source de vérité par défaut.

## Règles impératives

- Toute modification de schéma doit passer par une migration explicite.
- Ne jamais modifier silencieusement le schéma existant sans migration.
- Ne jamais supprimer table, colonne, contrainte ou index sans demande explicite.
- Préserver la compatibilité avec l’existant tant qu’une refonte complète n’est pas demandée.
- Garder des noms de tables et colonnes cohérents et stables.
- Ajouter des contraintes sobres et explicites.
- Ajouter des index seulement s’ils sont clairement utiles.
- Vérifier la cohérence avec la doctrine courante du domaine concerné.

## Doctrine à respecter

- `stores` est le nom canonique du domaine de boutique / composition projet.
- `availability` est le domaine canonique de disponibilité.
- `inventory` est une spécialisation satellitaire d’`availability`.
- Ne jamais confondre rang documentaire et criticité architecturale.
- Si la migration touche la cohérence métier ou transactionnelle, relire `docs/architecture/07-transactions-and-consistency.md`.
- Si elle touche lifecycle / archivage / suppression, relire `docs/architecture/10-data-lifecycle-and-governance.md`.

## Style SQL attendu

- SQL lisible et simple.
- Pas de magie implicite.
- Types PostgreSQL explicites.
- Clés primaires explicites.
- Timestamps systématiques quand pertinent.
- Slugs uniques quand nécessaire.
- Relations propres.
- `CHECK` sobres si utiles au domaine.

## Compatibilité applicative

Après la migration, vérifier les impacts applicatifs minimaux :

- types TypeScript serveur
- repositories
- logique de lecture / écriture impactée
- validations serveur associées
- éventuels seeds impactés

Ne pas étendre la modification au-delà du lot demandé.

## Discipline de modification

- Créer une migration dédiée, avec un nom cohérent avec le lot.
- Limiter les changements collatéraux.
- Ne pas refactorer d’autres zones sans nécessité directe.
- Préserver les chemins existants pour les flux non concernés.
- Ne pas utiliser la migration comme prétexte pour un redesign non demandé.

## Format de réponse attendu

Quand tu livres une évolution de schéma :

1. résume l’objectif de la migration
2. liste les fichiers créés ou modifiés
3. fournis la migration SQL
4. fournis les adaptations TypeScript ou repository nécessaires
5. indique les commandes de vérification
6. indique la vérification manuelle attendue
7. précise les limites de compatibilité ou points laissés hors périmètre
