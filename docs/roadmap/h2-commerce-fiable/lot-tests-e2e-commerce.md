# Lot — Tests E2E commerce

## Statut

A faire

## Objectif

Couvrir automatiquement les flux discounts, taxation, fulfillment et returns par des tests E2E, afin de prévenir les régressions sur les modules commerce complétés en H2.

## Périmètre

Proposition — non observé comme existant à ce jour :

- `tests/e2e/` — nouveaux fichiers de specs par module :
  - `commerce-discounts.spec.ts` : application d'un code promo, remise automatique, FREE_SHIPPING
  - `commerce-taxation.spec.ts` : vérification des montants TVA sur une commande avec adresse DOM et métropole
  - `commerce-fulfillment.spec.ts` : création d'une préparation depuis l'admin, transitions d'état
  - `commerce-returns.spec.ts` : demande de retour storefront, approbation admin, vérification statut
- Fixtures de données de test pour chaque flux (produits, commandes, taux TVA actifs)
- Configuration Playwright pour les modules gated (`commerce.taxation`, `commerce.fulfillment`, `commerce.returns` doivent être actifs dans l'environnement de test)

## Hors périmètre

- Tests de performance ou de charge
- Tests E2E du paiement Stripe en mode live (couvert par la recette humaine `lot-recette-complete`)
- Tests de l'email transactionnel réel (la trace DB suffit, conformément au pattern existant dans `commerce-smoke.spec.ts`)
- Tests E2E de Factur-X (format technique, couvert par tests unitaires)

## Dépendances

- H2 : modules `commerce.discounts`, `commerce.taxation`, `commerce.fulfillment`, `commerce.returns` fonctionnellement complets (les trois derniers lots H2 doivent être terminés)
- Infrastructure E2E Playwright existante (observée via `tests/e2e/public/commerce-smoke.spec.ts`)
- Environnement de test avec seed reproductible (pattern existant dans `pnpm seed:test-checkout`)

## Invariants

- Le smoke existant `commerce-smoke.spec.ts` ne doit pas être modifié ou cassé par ce lot
- `commerce-availability.spec.ts` existant ne doit pas être modifié
- Les nouveaux tests doivent utiliser les fixtures auto-provisionnées, pas de données hardcodées non reproductibles
- Les modules gated doivent être activés dans l'environnement de test via la même mécanique que `seed:test-checkout`

## Risques

- Les modules gated nécessitent une activation explicite dans l'environnement de test — oubli = tests en faux positif
- La taxation dépend du code postal de l'adresse de livraison — les fixtures doivent couvrir les deux cas (métropole + DOM)
- Les tests fulfillment et returns nécessitent une commande préexistante — les dépendances de fixtures sont à bien cadrer

## Vérifications

- `pnpm run test` — tous les nouveaux specs passent localement
- `pnpm run typecheck` — aucune erreur TypeScript dans les fichiers de test
- Les specs existants (`commerce-smoke`, `commerce-availability`) restent verts

## Critères de fin

- Chaque module H2 (discounts, taxation, fulfillment, returns) est couvert par au moins un spec E2E
- Les specs passent localement sur une DB de test fraîche provisionnée par seed
- Aucun spec existant n'est cassé
- `typecheck` passe sans erreur

## Agent recommandé

`test-engineer`
