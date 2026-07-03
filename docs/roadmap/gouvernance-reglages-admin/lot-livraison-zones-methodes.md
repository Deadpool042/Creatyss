# Lot — Zones et méthodes de livraison multiples

## Statut

À faire.

## Objectif

Permettre à l'utilisatrice de configurer plusieurs zones de livraison (ex. France, Union européenne, International) et plusieurs méthodes par zone (ex. standard, express, retrait), au lieu de la configuration actuelle limitée à une unique zone `"FR"` avec deux méthodes fixes.

## Contexte technique observé

- `prisma/optional/commerce/shipping.prisma` définit déjà `ShippingZone` et `ShippingMethod` comme des modèles supportant plusieurs entrées (relation un-vers-plusieurs), consommés côté checkout public par `features/commerce/checkout/queries/get-available-shipping-methods.query.ts`.
- `features/admin/settings/actions/update-admin-shipping-settings.action.ts` (lignes 55-93) fait un `upsert` codé en dur sur la zone `"FR"` et les méthodes `"STANDARD"` / `"FREE"` — aucune UI n'expose la création d'une zone ou d'une méthode supplémentaire.
- `features/admin/settings/components/shipping-settings-form.tsx` n'expose qu'un montant de frais standard et un seuil de livraison offerte, avec la devise en champ caché (`hidden field`) — cohérent avec le modèle actuel à zone unique.

## Périmètre

- Migration de l'action serveur d'un `upsert` hardcodé vers une logique générique acceptant zone et méthode en paramètres.
- UI CRUD pour créer/modifier/désactiver une zone de livraison (nom, pays/région couverts).
- UI CRUD pour créer/modifier/désactiver une méthode de livraison au sein d'une zone (nom, tarif, seuil de gratuité, délai indicatif si le modèle le permet).
- Vérification de compatibilité avec `get-available-shipping-methods.query.ts` côté storefront — s'assurer que le checkout public reste fonctionnel avec plusieurs zones/méthodes actives.

## Hors périmètre

- Toute modification du schéma Prisma `ShippingZone`/`ShippingMethod` — l'audit indique que le modèle actuel supporte déjà le besoin, sauf découverte contraire en phase Prisma de ce lot.
- Calcul de frais de port dynamique par poids/volume — non observé dans le modèle actuel, hors périmètre sauf demande explicite ultérieure.
- Intégration transporteur externe (API Colissimo, Chronopost, etc.) — hors périmètre.

## Invariants

- La configuration actuelle (zone `"FR"`, méthodes `"STANDARD"`/`"FREE"`) doit continuer de fonctionner sans interruption pendant et après la migration — pas de régression sur le seul cas actuellement utilisé en production.
- Devise cohérente avec `Store` (actuellement EUR fixe) — pas d'élargissement multi-devise non demandé.

## Risques

- Action serveur déjà utilisée en production (frais de port réels appliqués au checkout) — tout changement de sa signature doit être vérifié contre le comportement actuel avant déploiement.
- Risque de sur-ingénierie si le lot introduit une UI généraliste plus complexe que le besoin réel (ex. règles de calcul multiples par méthode) — rester au plus près du modèle Prisma existant, pas d'anticipation de besoins non confirmés.

## Critères de fin

- Au moins une deuxième zone de livraison configurable et fonctionnelle de bout en bout (admin → checkout storefront), en plus de la zone `"FR"` existante.
- Aucune régression sur la configuration `"FR"` / `"STANDARD"` / `"FREE"` actuelle.
- `pnpm run typecheck`, `pnpm run lint`, et `pnpm run db:validate` (si Prisma modifié) passent.
- Recette manuelle du parcours checkout avec plusieurs zones actives.

## Agent recommandé

`prisma-architect` si le schéma nécessite un ajustement (à confirmer en phase 1 du lot), puis `next-admin-ui-builder` pour l'UI, `next-feature-builder` pour la logique serveur.
