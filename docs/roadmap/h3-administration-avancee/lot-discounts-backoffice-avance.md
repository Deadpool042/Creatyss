# Lot — Discounts : back-office avancé

## Statut

A faire

## Objectif

Ouvrir un back-office dédié à la gestion des `DiscountCode` secondaires, permettre l'édition de la priorité des remises automatiques, et visualiser les `DiscountRedemption` par code. Le module `commerce.discounts` est observé à L3 complet mais ces surfaces admin avancées sont absentes.

## Périmètre

Proposition — non observé comme implémenté à ce jour :

- `features/admin/marketing/discounts/` — extension de la vue admin existante :
  - Section dédiée `DiscountCode` : liste, création en masse, désactivation, statistiques de rédemption
  - Vue `DiscountRedemption` par code : qui a utilisé quoi et quand
  - Édition de la priorité des remises automatiques (`priority`) directement dans la liste
- Interface de création de lots de codes (génération en série)

## Hors périmètre

- Génération automatique de codes en masse par algorithme cryptographique dédié (peut suivre si besoin validé)
- API publique codes promo (endpoint externe pour des partenaires)
- A/B testing sur les remises

## Dépendances

- `commerce.discounts` L3 déjà actif avec `DiscountCode` et `DiscountRedemption` posés en Prisma (observé dans `2026-06-13-audit-catalogue-modules.md`)
- H2 terminé ou en cours — les rédemptions sont liées à des commandes

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
- Test manuel : création d'un `DiscountCode`, visualisation des rédemptions, édition de priorité

## Critères de fin

- L'admin peut créer, lister et désactiver des `DiscountCode` secondaires
- Les `DiscountRedemption` sont visibles par code avec les informations de commande associées
- La priorité des remises automatiques est éditable depuis la liste
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`next-admin-ui-builder`
