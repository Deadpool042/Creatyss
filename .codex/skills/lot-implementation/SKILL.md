---
name: lot-implementation
description: Implémenter un lot borné en respectant strictement le périmètre demandé, la doctrine canonique du repo, les contrats publics existants et la structure réellement observée.
---

# Rôle de ce skill

`AGENTS.md` est la doctrine canonique du repo.

Ce skill ne la recopie pas.
Il définit la discipline d’exécution attendue pour implémenter un lot borné dans le dépôt, sans dérive de périmètre, sans refactor opportuniste et sans rupture silencieuse des contrats existants.

# Quand utiliser ce skill

Utiliser ce skill quand la tâche demande une implémentation clairement bornée dans le repo, par exemple :

- verticale admin ciblée
- évolution locale d’un domaine
- extraction limitée de types, helpers, queries ou composants
- adaptation d’un flux serveur, UI ou accès aux données déjà cadré
- sous-lot technique localisé dans une feature existante

Ne pas utiliser ce skill pour :

- un audit d’architecture
- une décision de doctrine
- une revue qualité finale
- une modification documentaire pure

# Source de vérité

Lire d’abord, dans cet ordre :

1. `AGENTS.md`
2. `README.md`
3. `.claude/CLAUDE.md`

Puis la documentation structurante pertinente :

- `docs/architecture/README.md`
- `docs/architecture/00-introduction/**`
- `docs/architecture/10-fondations/**`
- `docs/architecture/20-structure/**`
- `docs/domains/README.md`
- `docs/domains/**` ciblés par la demande
- `docs/testing/**` si la demande touche validation, robustesse ou stratégie de tests

Ensuite seulement, auditer la zone réelle du repo concernée par le lot.

Les anciennes docs `docs/v*` ne sont pas la source de vérité par défaut.

# Discipline d’implémentation

- Auditer d’abord, éditer ensuite.
- Rester strictement dans le périmètre demandé.
- Modifier uniquement les fichiers nécessaires.
- Préserver les contrats publics, imports publics et signatures runtime sauf demande explicite.
- Respecter la structure réellement observée dans le repo avant toute préférence générique.
- Ne jamais imposer un template fixe (`repository/queries/services/helpers/mappers/types`) si le repo réel n’utilise pas cette structure.
- Ne jamais réintroduire une couche `db/repositories` sans validation explicite de la doctrine courante.
- Toujours privilégier la solution la plus simple, lisible et robuste.
- Limiter le churn et éviter les renommages sans gain net.
- Vérifier explicitement les boundaries entre UI, validation, métier et accès aux données.
- Ne jamais mélanger logique métier et composants de présentation.
- Ne jamais élargir silencieusement le lot sous prétexte de “faire plus propre”.

# Contraintes projet

- Next.js App Router
- TypeScript strict
- Server Components par défaut
- Client Components seulement si nécessaire
- pas de logique métier dans les composants UI
- pas de `any` sauf justification explicite
- pas de dépendance inutile
- pas de sur-architecture
- token-driven pour l’UI si système existant
- compatibilité avec le mode local Docker

# Vérifications attendues

Quand c’est pertinent pour le lot, exécuter ou mentionner explicitement :

- `pnpm run typecheck`
- `pnpm run lint`
- tests ciblés si le lot touche une logique critique
- vérification manuelle ciblée si le lot touche l’UI ou un flux utilisateur

Ne jamais prétendre qu’une vérification a été faite si elle ne l’a pas été.

# Format de livraison attendu

1. résumé bref
2. fichiers modifiés ou créés
3. code complet ou patchs
4. variables d’environnement nécessaires
5. commandes de vérification
6. vérification manuelle attendue
7. ce qui reste hors périmètre

# Règle finale

Une bonne implémentation de lot sur Creatyss doit être :

- fidèle au repo
- strictement bornée
- lisible
- compatible avec la doctrine courante
- compatible avec les contrats existants
- exploitable sans réinterprétation
