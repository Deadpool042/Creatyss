# Analyses — cadrage d'un cockpit analytique étendu

Chantier cross-cutting, hors séquence H1-H4 de valeur métier. Déclenché par un retour produit (2026-07-06) : la section nav renommée "Pilotage" → "Analyses" (cf. `docs/roadmap/admin-design-macos/lot-14-pilotage-activation.md`) doit devenir un vrai cockpit analytique poussé — ventes, comportement (clics), conversion, recherche — permettant de prendre des directions marketing et commerciales, pas seulement afficher des compteurs.

Ce document cadre la vision avant tout lot exécutable. Aucun code n'est modifié ici.

## Observé (2026-07-06)

- **Ventes / commerce** : réel. `/admin/insights/analytics` lit `Order`/`Customer` en direct (bloc "Ce mois", niveaux `read`/`insights`/`recommendations` du flag `engagement.analytics`, désormais actif par défaut — lot 14).
- **Comportement storefront anonyme** : réel mais minimal. `features/analytics/tracking/record-storefront-analytics-event.service.ts` ne collecte que 2 métriques — vues produit et ajouts panier — en agrégats quotidiens anonymes sans cookie (`AnalyticsSnapshot`), gatées par le même flag.
- **Bloc "Pages les plus visitées"** (`features/admin/insights/components/analytics-overview-sections.tsx`) : mock en dur, explicitement documenté dans le code comme hors périmètre ("Analytics complexes", tracking par page absent du repo). Décision assumée à l'origine, mais désormais plus visible puisque le flag est actif par défaut pour tout le monde depuis le lot 14 — point à trancher en premier (cf. Risque ci-dessous).
- **Trafic web réel** (pages vues, sources, données SEO) : couvert par **Plausible Community Edition** self-hosted (décision du 2026-06-26, `docs/domains/cross-cutting/analytics.md#décision--analytics-web-externe-2026-06-26`) — outil externe, hors admin Creatyss, non injecté dans les vues internes actuelles.
- **Recherche** (termes recherchés, résultats, conversion recherche→achat) : top termes + recherches sans résultat trackés depuis le 2026-07-06 (`features/analytics/tracking/record-storefront-analytics-event.service.ts`, agrégat anonyme quotidien). Pas de lecture admin dédiée à ce stade (prévue lot 5). Clic sur résultat et conversion recherche→achat non trackés (hors périmètre assumé). Le domaine `search` existe (index FTS Postgres, `prisma/satellites/search.prisma`) mais reste une projection d'indexation, pas un domaine de mesure comportementale.
- **Conversion** (relances, upsell, seuils de progression) : domaine documenté (`docs/domains/cross-cutting/conversion.md`, activable) mais aucun flag seedé, aucun code.
- **Attribution marketing** (source/canal/campagne) : domaine documenté (`docs/domains/cross-cutting/attribution.md`, activable) mais aucun flag seedé, aucun code.
- **Clics / interactions UI** (heatmap, clics détaillés) : aucun domaine ni tracking dédié au-delà des 2 métriques storefront existantes.

## Documenté mais non implémenté

Quatre domaines cross-cutting couvrent déjà, dans la doctrine, exactement l'ambition décrite par le retour produit :

- `tracking.md` — signaux de suivi comportemental/interaction.
- `attribution.md` — attribution marketing et commerciale.
- `conversion.md` — mécaniques de relance et de progression commerciale.
- `dashboarding.md` — vues de pilotage et tableaux de bord consolidés (le nom recoupe directement l'ancien libellé nav "Pilotage").

Tous sont classés `activable: oui` (sauf `dashboarding`, structurel dès qu'une exposition existe) mais aucun n'a de `FeatureFlag` seedé ni d'implémentation. `docs/domains/cross-cutting/analytics.md` précise explicitement que le domaine `analytics` **ne doit pas devenir un doublon** de `tracking` ou `attribution` — étendre le cockpit doit donc passer par l'activation de ces domaines dédiés, pas par un gonflement direct du cockpit `analytics` existant.

## Risque à trancher en premier

Le bloc "Pages les plus visitées" affiche des chiffres inventés, dans un écran désormais actif par défaut pour toute nouvelle boutique. Avant d'étendre quoi que ce soit, décider : le retirer (état vide honnête) ou le brancher sur une vraie source (API Plausible, ou tracking interne par page).

## Proposition de découpage en lots (aucun engagement de calendrier)

1. **Assainir le mock** — traiter le bloc "Pages les plus visitées" (retrait ou vraie source). **Livré (2026-07-06)** : branché sur un provider analytics interne (`features/analytics/providers/`, `getAnalyticsClient()`), Umami self-hosted comme premier provider, fallback `none` → mock. Cf. branche `feature/analyses-plausible-top-pages`.
2. **Recherche** — cadrer un tracking minimal des requêtes (terme, nombre de résultats, clic sur résultat) + taux de conversion recherche→achat. À trancher : nouveau domaine ou extension du domaine `search` existant. **Livré partiellement (2026-07-06)** : extension de `features/analytics/tracking/` (pattern `tracking`, pas `search` — `search` reste une projection d'indexation) avec top termes recherchés + compteur de recherches sans résultat, sur `AnalyticsSnapshot` existant (aucune migration Prisma). Clic sur résultat et conversion recherche→achat **hors périmètre** — nécessitent respectivement un beacon client (nouveau mécanisme) et un quasi-identifiant de session (cart token), reportés à des lots séparés après revue RGPD/architecture. Cf. branche `feature/analytics-search-tracking`.
3. **Conversion** — activer une première tranche de `conversion.md` (ex. relance panier abandonné) si le besoin business est confirmé.
4. **Attribution marketing** — activer `attribution.md` (source/canal/campagne) si le besoin de mesure est confirmé ; dépend en partie des lots 2 et 3 pour avoir des événements à attribuer.
5. **Cockpit consolidé** — une fois 1 à 4 avancés, revoir `/admin/insights/analytics` pour intégrer les nouvelles sources sans reproduire un hub à cartes creux (leçon du lot 14 : ne pas ajouter de navigation qui ne mène qu'à du vide).

## Hors périmètre de ce document

Toute implémentation. Ce cadrage sert à aligner la vision et l'état réel avant de lancer un premier lot exécutable — chaque lot listé ci-dessus doit être cadré et validé séparément avant code.
