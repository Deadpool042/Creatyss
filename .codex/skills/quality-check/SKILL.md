---
name: quality-check
description: Vérifier un lot Creatyss avant livraison avec une check-list stricte, cohérente avec la doctrine actuelle du repo, orientée périmètre, robustesse, TypeScript strict, Docker local et absence de régression hors périmètre.
---

# Quand utiliser ce skill

Utiliser ce skill à la fin d’un lot, avant de considérer l’implémentation ou la mise à jour documentaire comme livrable.

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

Ensuite seulement, lire la documentation ciblée par le lot ou la revue :

- fiche de domaine concernée
- documentation de test
- documentation de lot explicitement visée

Les anciennes docs `docs/v*` ne sont plus la source de vérité par défaut.

## Objectif

S’assurer que la proposition reste :

- dans le périmètre demandé
- cohérente avec TypeScript strict
- compatible avec le fonctionnement local via Docker
- lisible et maintenable
- sans dépendance inutile
- sans régression évidente hors périmètre
- cohérente avec la doctrine actuelle du repo

## Vérifications minimales

### Périmètre

- vérifier qu’aucune fonctionnalité non demandée n’a été ajoutée
- vérifier qu’aucune zone non concernée n’a été refactorée inutilement
- vérifier que le lot suit bien la documentation explicitement ciblée
- vérifier qu’aucune capability optionnelle n’a été traitée comme coeur par défaut

### Doctrine / architecture

- vérifier la cohérence avec `README.md`
- vérifier la cohérence avec `AGENTS.md`
- vérifier la cohérence avec `docs/architecture/`
- vérifier la cohérence avec `docs/domains/`
- vérifier que `stores`, `availability` et `inventory` sont utilisés selon la doctrine canonique
- vérifier que rang documentaire et criticité architecturale ne sont pas confondus

### Code

- vérifier l’absence de `any` non justifié
- vérifier la cohérence des types d’entrée et de sortie
- vérifier la séparation entre UI, métier, validation et données
- vérifier que la solution reste simple et lisible
- vérifier l’absence de churn inutile : renommages, moves, refactors opportunistes

### Base de données

Si le lot touche la base :

- vérifier la présence d’une migration explicite quand elle est requise
- vérifier la cohérence des contraintes ajoutées
- vérifier les impacts sur types, repositories et seeds
- vérifier que rien n’a été supprimé silencieusement sans demande explicite

### Exécution locale

Proposer les commandes pertinentes selon le lot, par exemple :

- `make up`
- `pnpm run typecheck`
- `pnpm run build`
- commande de test ciblée
- commande liée à la migration ou au schéma si le lot en possède une

### Vérifications UI / parcours

Si le lot touche l’UI ou un flux critique :

- proposer un test e2e ciblé si pertinent
- indiquer la vérification manuelle minimale utile
- signaler explicitement si cette vérification n’a pas été exécutée

## Sortie attendue

Toujours finir par :

1. la liste des fichiers modifiés
2. les commandes de vérification
3. la vérification manuelle attendue
4. les risques ou écarts éventuels
5. les points volontairement hors périmètre
