# Memory Index

## User

- Profil utilisateur : rôle, niveau technique, style de collaboration à documenter ici quand une mémoire stable existe.

## Project

- Référence courante du repo : `README.md`, `AGENTS.md`, `docs/architecture/00` à `11`, `docs/domains/README.md`.
- Attendus d'implémentation : petits incréments sûrs, périmètre strict, compatibilité préservée, séparation claire entre domaine, données, serveur et UI.
- Rappels canoniques : `stores` est le domaine de boutique ; `availability` est canonique ; `inventory` est une spécialisation satellitaire.

## Feedback

- Enregistrer ici les retours récurrents sur dérive de périmètre, refactors inutiles, lisibilité, compatibilité et niveau de robustesse attendu.

## Reference

- Checklist d'exécution : périmètre, fichiers touchés, impacts, vérifications, hors périmètre explicite.

# Memory Index

## User

- Profil utilisateur : rôle, niveau technique, style de collaboration et préférences stables à documenter ici uniquement quand elles sont récurrentes et non déjà capturées dans `AGENTS.md` ou `.claude/CLAUDE.md`.

## Project

- Doctrine courante du repo : `AGENTS.md`, `README.md`, `.claude/CLAUDE.md`, `docs/architecture/**`, `docs/domains/**`, `docs/testing/**`.
- Taxonomie canonique du repo : `core`, `optional`, `cross-cutting`, `satellites`, applicable à `docs/domains/**` et `prisma/**`.
- Creatyss est un socle e-commerce modulaire réutilisable, mais ce n’est ni une site-factory, ni une plateforme multi-tenant, ni un moteur runtime de features.
- Attendus d’implémentation : petits incréments sûrs, périmètre strict, compatibilité préservée, séparation claire entre domaine métier, accès aux données, logique serveur et UI.
- Vigilances de refactor : cohérence docs ↔ Prisma, ownership unique des modèles Prisma, absence de références orphelines, validation après déplacement structurel (`pnpm prisma validate` si `prisma/**` est touché), pas de fichiers `.prisma` vides.
- Distinctions canoniques à préserver : `availability` = disponibilité vendable ; `inventory` = vérité de stock ; `fulfillment` = exécution logistique ; `shipping` = expédition et suivi ; `customers` = client métier ; `domain-events` ≠ domaine métier `events`.

## Feedback

- Enregistrer ici les retours récurrents sur dérive de périmètre, refactors inutiles, lisibilité, compatibilité, petits lots sûrs et niveau de robustesse attendu quand ils deviennent stables et dépassent le contexte d’une seule conversation.

## Reference

- Garder ici les checklists d’exécution utiles dans le futur uniquement si elles ne sont pas déjà documentées explicitement dans `AGENTS.md`, `.claude/CLAUDE.md`, `docs/architecture/**`, `docs/domains/**` ou `docs/testing/**`.
