# Lot — Implémentation navigation admin

## Statut

À faire — bloqué par `lot-decision-ia-admin.md` (validation humaine requise avant démarrage)

## Objectif

Appliquer la structure de navigation validée par `lot-decision-ia-admin.md`, découpée en sous-lots par groupe fonctionnel (catalog, commerce, content, marketing, settings) pour limiter le blast radius. Jamais un big-bang sur toute la navigation en un seul lot.

## Périmètre

- Un sous-lot par groupe fonctionnel touché par la décision validée.
- Mise à jour de `features/admin/navigation/utils/admin-navigation.data.ts` et des routes `app/admin/(protected)/**` concernées, groupe par groupe.
- Mise en place de redirects pour toute URL qui change, afin d'éviter les 404 pendant la transition.

## Hors périmètre

- Toute restructuration non validée explicitement dans `lot-decision-ia-admin.md`.
- Le volet storefront (`lot-audit-completude-storefront.md` et suites éventuelles) — périmètre strictement admin.
- Toute refonte visuelle du design system, conformément au garde-fou cité dans `README.md`.

## Invariants

- Aucune route existante ne doit renvoyer 404 pendant la transition — prévoir des redirects si des URLs changent.
- Les capabilities/feature flags actuels doivent continuer à gouverner l'accès aux mêmes écrans, sans perte ni élargissement non demandé.
- Chaque sous-lot par groupe doit rester déployable et recettable indépendamment des autres groupes.

## Risques

- Régression transversale : tous les écrans admin dépendent de la navigation — d'où le découpage strict en micro-lots par groupe.
- Risque d'oubli de redirect sur une URL bookmarkée ou partagée en interne.
- Risque de désynchronisation entre la décision validée et l'implémentation si plusieurs sous-lots s'étalent dans le temps — revalider l'alignement avec `lot-decision-ia-admin.md` à chaque sous-lot.

## Critères de fin

- `typecheck` et `lint` passent pour chaque sous-lot livré.
- Navigation manuelle recettée sans 404 sur l'ensemble des groupes touchés.
- Aucune capability ou feature flag perdu par rapport à l'état avant lot.

## Agent recommandé

`next-admin-ui-builder`
