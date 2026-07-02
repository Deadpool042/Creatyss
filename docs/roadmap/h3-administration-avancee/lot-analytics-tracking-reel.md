# Lot — Analytics : tracking réel

## Statut

Livré — 2026-07-02 — tracking anonyme sans cookie, recette locale validée

## État observé au 2026-07-02

- Décision produit actée : compteurs agrégés côté serveur, anonymes, sans cookie ni identifiant → pas de consentement RGPD requis ; sessions/visiteurs uniques exclus (non mesurables sans identifiant)
- Métriques : `storefront.product_views` et `storefront.cart_additions`, un snapshot par jour/métrique (upsert + increment), collecte fire-and-forget gatée par `engagement.analytics`
- Bloc "Aujourd'hui vs hier" branché sur `AnalyticsSnapshot` (query `get-daily-traffic-analytics`), delta nullable si veille absente ; bloc "Ce mois" intact
- Tests : 7 tests unitaires du service d'agrégation ; suite complète 335/335
- Recette locale (2026-07-02) : visite fiche produit + ajout panier → snapshots incrémentés en DB → bloc admin affiche les valeurs réelles. Flag `engagement.analytics` activé en DB locale pour la recette (seedé DRAFT)

## Objectif

Brancher le bloc "Aujourd'hui vs hier" de l'admin analytics sur un pipeline de tracking minimal, en remplacement des données mock actuelles. `AnalyticsMetric` et `AnalyticsSnapshot` sont posés en Prisma mais non alimentés (observé dans `2026-06-13-audit-catalogue-modules.md`).

## Périmètre

Proposition — non observé comme implémenté à ce jour :

- `prisma/optional/engagement/analytics.prisma` — modèles `AnalyticsMetric` et `AnalyticsSnapshot` déjà posés, à alimenter
- `features/admin/insights/` — remplacement du bloc "Aujourd'hui vs hier" mock par une lecture réelle de `AnalyticsSnapshot`
- Pipeline de collecte minimal : enregistrement des métriques clés (vues produit, sessions storefront, ajouts panier) via des Server Actions ou des API routes
- Job périodique ou agrégation à la volée pour alimenter `AnalyticsSnapshot`

## Hors périmètre

- Analytics complexes, entonnoirs de conversion multi-étapes
- Heatmaps, enregistrements de sessions
- Recommandations produits basées sur le comportement (`recommendations` niveau `engagement.analytics`)
- Intégration d'outils analytics externes (Google Analytics, Plausible, etc.)

## Dépendances

- Décision produit sur le périmètre du tracking : quelles métriques collecter (vues produit ? sessions ? ajouts panier ? uniquement les conversions ?) — à trancher avant toute implémentation
- Si le tracking comporte des données comportementales identifiables : consentement RGPD requis (bandeau cookies ou équivalent)
- `insights.analyticsRead` L3 actif (observé) comme surface de lecture déjà en place

## Invariants

- `AnalyticsMetric` et `AnalyticsSnapshot` ne doivent pas stocker de données personnelles identifiables sans consentement explicite
- Le bloc "Ce mois" branché sur `Order`/`Customer` réels (observé comme fonctionnel) ne doit pas être impacté par ce lot
- La collecte doit être optionnelle et gatable : si l'utilisatrice retire le consentement, la collecte doit cesser

## Risques

- RGPD : le tracking comportemental (vues, clics, sessions) est soumis à consentement si les données sont liées à un identifiant (cookie, IP) — implications légales à ne pas sous-estimer
- Volumétrie : l'écriture d'une métrique à chaque vue produit peut générer un volume important en DB — agrégation périodique préférable à l'écriture brute en temps réel
- Absence de décision produit : si le périmètre du tracking n'est pas tranché, ce lot ne peut pas démarrer

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Test manuel : navigation storefront → vérification que les métriques sont enregistrées → bloc "Aujourd'hui vs hier" affiche des données réelles

## Critères de fin

- Le bloc "Aujourd'hui vs hier" affiche des données réelles issues de `AnalyticsSnapshot`
- Les métriques sont collectées de façon non bloquante pour le parcours storefront
- La collecte respecte le consentement utilisatrice si des données comportementales identifiables sont concernées
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`architect-review` pour le cadrage du périmètre tracking et la décision RGPD, puis `next-feature-builder` pour l'implémentation.
