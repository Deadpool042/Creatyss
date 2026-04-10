# Memory Index

## User

- Profil utilisateur : rôle, niveau technique, style de collaboration et préférences stables à documenter ici uniquement quand elles sont récurrentes et non déjà capturées dans `AGENTS.md` ou `.claude/CLAUDE.md`.

## Project

- Doctrine courante applicable à Prisma : `AGENTS.md`, `README.md`, `.claude/CLAUDE.md`, `docs/architecture/**`, `docs/domains/**`, `docs/testing/**`, puis `prisma/**`.
- Taxonomie canonique du repo : `core`, `optional`, `cross-cutting`, `satellites`, applicable à `docs/domains/**` et `prisma/**`.
- Creatyss est un socle e-commerce modulaire réutilisable, mais ce n’est ni une site-factory, ni une plateforme multi-tenant, ni un moteur runtime de features.
- Vigilances Prisma principales : ownership unique des modèles, cohérence relationnelle, absence de références orphelines, cohérence après déplacement structurel, absence de fichier `.prisma` vide, alignement docs ↔ Prisma.
- Distinctions canoniques à préserver : `availability` = disponibilité vendable ; `inventory` = vérité de stock ; `fulfillment` = exécution logistique ; `shipping` = expédition et suivi ; `customers` = client métier ; `domain-events` ≠ domaine métier `events`.
- Zones durablement sensibles : `cart` / `checkout` / `orders`, `inventory` / `availability`, `payments` / `returns` / `documents`, `pricing` / `discounts` / `taxation` / `sales-policy`, `shipping` / `fulfillment`, `notifications` / `email` / `newsletter`, et les domaines cross-cutting génériques.

## Feedback

- Enregistrer ici les préférences récurrentes de modélisation, de sobriété structurelle, de petits lots sûrs et de cohérence Prisma quand elles deviennent stables et dépassent le contexte d’une seule conversation.

## Reference

- Garder ici les décisions structurantes utiles aux audits Prisma futurs, uniquement si elles ne sont pas déjà documentées explicitement dans `AGENTS.md`, `.claude/CLAUDE.md`, `docs/architecture/**` ou `docs/domains/**`.
