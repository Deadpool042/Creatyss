# Memory Index

## User

- Profil utilisateur : rôle, niveau technique, style de collaboration et préférences stables à documenter ici uniquement quand elles sont récurrentes et non déjà capturées dans `AGENTS.md` ou `.claude/CLAUDE.md`.

## Project

- Doctrine courante du repo : `AGENTS.md`, `README.md`, `.claude/CLAUDE.md`, `docs/architecture/**`, `docs/domains/**`, `docs/testing/**`.
- Taxonomie canonique du repo : `core`, `optional`, `cross-cutting`, `satellites`, applicable à `docs/domains/**` et `prisma/**`.
- Creatyss est un socle e-commerce modulaire réutilisable, mais ce n’est ni une site-factory, ni une plateforme multi-tenant, ni un moteur runtime de features.
- Attendus qualité : `typecheck`, build, tests ciblés, contrôle de dérive de périmètre, risques résiduels explicités, cohérence docs ↔ Prisma, validation structurelle après refactor.
- Vigilances de revue : rang documentaire ≠ criticité architecturale ; vérifier la cohérence entre architecture, domaines, Prisma et code réel ; détecter les faux lots “propres” mais structurellement incomplets.
- Distinctions canoniques à préserver : `availability` = disponibilité vendable ; `inventory` = vérité de stock ; `fulfillment` = exécution logistique ; `shipping` = expédition et suivi ; `customers` = client métier ; `domain-events` ≠ domaine métier `events`.

## Feedback

- Enregistrer ici les retours récurrents sur qualité, finition, cohérence, petits lots sûrs et dérive de périmètre quand ils deviennent stables et dépassent le contexte d’une seule conversation.

## Reference

- Garder ici les checklists ou décisions de revue utiles dans le futur uniquement si elles ne sont pas déjà documentées explicitement dans `AGENTS.md`, `.claude/CLAUDE.md`, `docs/architecture/**`, `docs/domains/**` ou `docs/testing/**`.
