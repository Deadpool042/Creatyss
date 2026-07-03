# Lot — Discounts : back-office avancé

## Statut

Livré — 2026-06-25

## Objectif

Ouvrir un back-office dédié à la gestion des `DiscountCode` secondaires, permettre l'édition de la priorité des remises automatiques, et visualiser les `DiscountRedemption` par code.

## Périmètre

Livré au 2026-06-25 :

- `app/admin/(protected)/marketing/discounts/[discount]/page.tsx` — page détail admin dédiée par remise
- `features/admin/marketing/discounts/queries/get-admin-discount-detail.query.ts` — lecture détaillée de la remise, de ses codes et de sa priorité
- `features/admin/marketing/discounts/queries/list-discount-redemptions.query.ts` — lecture des rédemptions par remise
- `features/admin/marketing/discounts/components/admin-discount-codes-list.tsx` — liste des `DiscountCode` liés à la remise
- `features/admin/marketing/discounts/components/admin-discount-code-create-form.tsx` et `actions/create-discount-code.action.ts` — création de codes secondaires avec validation serveur
- `features/admin/marketing/discounts/components/admin-discount-priority-form.tsx` et `actions/update-discount-priority.action.ts` — édition de la priorité admin avec garde-fous serveur
- `features/admin/marketing/discounts/components/admin-discount-redemptions-table.tsx` — visualisation des `DiscountRedemption`
- `features/admin/marketing/discounts/actions/toggle-discount-code-status.action.ts` — activation/désactivation de code avec contrôle boutique courante et niveau de feature
- `features/admin/marketing/discounts/components/admin-discounts-list.tsx` — navigation liste → détail
- `tests/e2e/admin/commerce-discounts.spec.ts` — test e2e admin dédié à la page détail (création de code secondaire, désactivation/réactivation, édition de priorité, cas d'erreur) ; 5 tests unitaires sur les actions/queries (`tests/unit/features/admin/marketing/discounts/`)

Reste en dehors de la preuve livrée dans ce lot :

- feedback UX avancé globalisé côté back-office (bannière ou toasts centralisés)

## Hors périmètre

- Génération automatique de codes en masse par algorithme cryptographique dédié (peut suivre si besoin validé)
- API publique codes promo (endpoint externe pour des partenaires)
- A/B testing sur les remises

## Dépendances

- `commerce.discounts` L3 déjà actif avec `DiscountCode` et `DiscountRedemption` posés en Prisma
- Socle commandes suffisamment cohérent pour exposer les rédemptions liées aux commandes

## Invariants

- La logique de résolution des remises au checkout ne doit pas être modifiée par ce lot (périmètre back-office uniquement)
- `maxRedemptionsPerCode` et `maxRedemptionsPerUser` déjà implémentés ne doivent pas être contournés par le back-office
- La priorité ne peut être éditée que sur les remises de type `automation` (remises sans code manuel)

## Risques

- Cohérence de priorité : si deux remises automatiques ont la même priorité, le comportement au checkout doit être défini et documenté
- Rédemptions historiques : l'affichage des rédemptions peut être volumineux si la boutique a un historique important — pagination obligatoire

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run test:unit`
- `pnpm exec playwright test tests/e2e/public/commerce-discounts.spec.ts`

## Critères de fin

- L'admin peut accéder à une page détail de remise depuis la liste
- L'admin peut créer, lister et désactiver des `DiscountCode` secondaires
- Les `DiscountRedemption` sont visibles dans le détail admin de la remise
- La priorité des remises automatiques est éditable côté admin avec validation serveur
- `typecheck`, `lint` et les tests ciblés passent sans erreur

## Agent recommandé

`next-admin-ui-builder`
