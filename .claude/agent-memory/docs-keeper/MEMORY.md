# Memory Index

## User

- Profil utilisateur : rôle, niveau technique, style de collaboration et préférences stables à documenter ici uniquement quand elles sont récurrentes et non déjà capturées dans `AGENTS.md` ou `.claude/CLAUDE.md`.

## Project

- Doctrine documentaire courante : `AGENTS.md`, `README.md`, `docs/architecture/**`, `docs/domains/**`, `docs/testing/**`.
- Taxonomie canonique du repo : `core`, `optional`, `cross-cutting`, `satellites`, applicable à `docs/domains/**` et `prisma/**`.
- Creatyss est un socle e-commerce modulaire réutilisable, mais ce n’est ni une site-factory, ni une plateforme multi-tenant, ni un moteur runtime de features.
- Vigilances documentaires principales : cohérence docs ↔ Prisma, cohérence de taxonomie, cohérence des chemins, cohérence entre `README.md`, `AGENTS.md`, `.claude/CLAUDE.md`, `docs/architecture/**`, `docs/domains/**`, `docs/testing/**`.
- Distinctions canoniques à préserver : `availability` = disponibilité vendable ; `inventory` = vérité de stock ; `fulfillment` = exécution logistique ; `shipping` = expédition et suivi ; `customers` = client métier ; `domain-events` ≠ domaine métier `events`.

## Feedback

- Enregistrer ici les préférences récurrentes de rédaction, de hiérarchie documentaire, de non-ambiguïté doctrinale et de sobriété quand elles deviennent stables et dépassent le contexte d’une seule conversation.

## Reference

- Garder ici les décisions structurantes utiles aux audits documentaires futurs, uniquement si elles ne sont pas déjà documentées explicitement dans `AGENTS.md`, `.claude/CLAUDE.md` ou `docs/architecture/**`.
